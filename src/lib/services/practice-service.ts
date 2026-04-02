import {
  type PracticeSetupRequest,
  type RubricScores,
  type Session,
  type SessionStartRequest,
  type StepSubmissionRequest
} from "../../contracts";
import type { Repository } from "../db/repository";
import { EvaluatorService, toEvaluatorOutput } from "../evaluators/service";
import { calculateScore } from "../scoring/scoring-engine";
import { validateSessionSetup, validateSummaryAndHomework } from "../rules/rules-engine";
import { transitionSessionState } from "../session/state-machine";
import { getStageToolEntry } from "../config/stage-tool-matrix";
import { translateDriftMessage, translateServerText } from "../i18n/messages";

function assertOwner(session: Session, actorUserId: string) {
  if (session.user_id !== actorUserId) {
    throw new Error("Forbidden");
  }
}

async function ensureActorUser(repo: Repository, actorUserId: string) {
  const user = await repo.getUser(actorUserId);
  if (!user) {
    throw new Error("Actor user not found");
  }
  return user;
}

function scoreOutcomeToState(outcome: string): Session["state"] {
  return outcome === "strong_pass" || outcome === "pass" ? "reviewed" : "needs_revision";
}

function deriveRubricScores(session: Session, driftIds: string[]): RubricScores {
  const toolStatus = getStageToolEntry(session.stage, session.selected_tool).status;
  const has = (driftId: string) => driftIds.includes(driftId);

  return {
    session_structure: has("DR001") || has("DR007") ? 10 : 16,
    identification_accuracy: has("DR003") ? 8 : 16,
    tool_selection: toolStatus === "recommended" ? 13 : toolStatus === "allowed" ? 11 : 8,
    questioning_quality: has("DR005") ? 8 : 12,
    formulation_quality: has("DR010") ? 8 : 10,
    summary_and_homework: has("DR008") ? 7 : has("DR012") ? 10 : 13
  };
}

async function buildReviewFromSummaryStep(params: {
  repo: Repository;
  session: Session;
  rubricScores: RubricScores;
}) {
  const driftEvents = await params.repo.listDriftEventsBySession(params.session.id);
  return calculateScore({
    rubricScores: params.rubricScores,
    driftEvents
  });
}

export class PracticeService {
  constructor(
    private readonly repo: Repository,
    private readonly evaluatorService: EvaluatorService = new EvaluatorService()
  ) {}

  async setupPractice(request: PracticeSetupRequest) {
    await ensureActorUser(this.repo, request.actor_user_id);
    const caseRecord = await this.repo.getCase(request.case_id);
    if (!caseRecord) {
      throw new Error("Case not found");
    }

    const setupValidation = validateSessionSetup({
      caseRecord,
      stage: request.stage,
      selectedTool: request.selected_tool,
      sessionGoal: request.session_goal,
      rationale: request.rationale
    });

    if (!setupValidation.passed) {
      return {
        created: false,
        validation: setupValidation,
        session: null
      };
    }

    const session = await this.repo.createSession({
      user_id: request.actor_user_id,
      case_id: request.case_id,
      state: "ready",
      current_step: "guided_input",
      stage: request.stage,
      selected_tool: request.selected_tool,
      session_goal: request.session_goal,
      revision_count: 0,
      started_at: null,
      finished_at: null
    });

    return {
      created: true,
      validation: setupValidation,
      session
    };
  }

  async startSession(request: SessionStartRequest) {
    await ensureActorUser(this.repo, request.actor_user_id);
    const session = await this.repo.getSession(request.session_id);
    if (!session) {
      throw new Error("Session not found");
    }
    assertOwner(session, request.actor_user_id);

    return this.repo.updateSession({
      ...session,
      state: transitionSessionState(session.state, "first_step_opened"),
      started_at: session.started_at ?? new Date().toISOString(),
      current_step: "guided_input"
    });
  }

  async submitStep(request: StepSubmissionRequest) {
    await ensureActorUser(this.repo, request.actor_user_id);
    const session = await this.repo.getSession(request.session_id);
    if (!session) {
      throw new Error("Session not found");
    }
    assertOwner(session, request.actor_user_id);

    if (!["in_progress", "blocked_validation"].includes(session.state)) {
      throw new Error("Session is not accepting step submissions");
    }

    const caseRecord = await this.repo.getCase(session.case_id);
    if (!caseRecord) {
      throw new Error("Case not found");
    }

    if (request.step_name === "guided_input") {
      const passed = request.input_payload.text.trim().length >= 20;
      let attempt = await this.repo.createAttempt({
        session_id: session.id,
        revision_number: session.revision_count,
        step_name: request.step_name,
        input_payload: request.input_payload,
        validation_output: {
          passed,
          blocking_errors: passed ? [] : ["Guided input is too short."],
          warnings: [],
          rule_hits: []
        },
        evaluator_outputs: [],
        score_snapshot: null
      });

      const categoryClassifier = await this.evaluatorService.classifyCategory({
        text: request.input_payload.text,
        language: request.language ?? "en"
      });
      const driftDetector = await this.evaluatorService.detectDrift({
        stepName: request.step_name,
        stage: session.stage,
        selectedTool: session.selected_tool,
        text: request.input_payload.text,
        language: request.language ?? "en"
      });

      attempt = await this.repo.updateAttempt({
        ...attempt,
        evaluator_outputs: [
          toEvaluatorOutput(
            "category_classifier",
            categoryClassifier.meta,
            categoryClassifier.output
          ),
          toEvaluatorOutput(
            "drift_detector",
            driftDetector.meta,
            driftDetector.output
          )
        ]
      });

      const updated = await this.repo.updateSession({
        ...session,
        state: passed
          ? transitionSessionState(session.state, "attempt_passed")
          : transitionSessionState(session.state, "attempt_failed"),
        current_step: passed ? "summary_and_homework" : "guided_input"
      });

      return { attempt, session: updated, drift_events: [] };
    }

    if (request.step_name !== "summary_and_homework") {
      throw new Error("Unsupported step submission for MVP");
    }

    const validation = validateSummaryAndHomework({
      selectedTool: session.selected_tool,
      summaryText: request.input_payload.summary_text,
      homeworkText: request.input_payload.homework_text,
      caseRecord,
      language: request.language ?? "en"
    });

    const attempt = await this.repo.createAttempt({
      session_id: session.id,
      revision_number: session.revision_count,
      step_name: request.step_name,
      input_payload: request.input_payload,
      validation_output: {
        passed: validation.passed,
        blocking_errors: validation.blocking_errors,
        warnings: validation.warnings,
        rule_hits: validation.rule_hits
      },
      evaluator_outputs: [],
      score_snapshot: null
    });

    const driftEvents = await this.repo.createDriftEvents(
      session.id,
      attempt.id,
      validation.drifts.map((drift) => ({
        drift_id: drift.drift_id,
        name: drift.drift_id,
        description: drift.message,
        detection_mode: "rule",
        severity: drift.severity,
        message: drift.message,
        corrective_action: drift.corrective_action
      }))
    );

    const rubricScores = request.rubric_scores ?? deriveRubricScores(
      session,
      driftEvents.map((drift) => drift.drift_id)
    );
    const driftDetector = await this.evaluatorService.detectDrift({
      stepName: request.step_name,
      stage: session.stage,
      selectedTool: session.selected_tool,
      text: request.input_payload.summary_text ?? request.input_payload.text,
      summaryText: request.input_payload.summary_text,
      homeworkText: request.input_payload.homework_text,
      language: request.language ?? "en"
    });

    const feedbackCoach = await this.evaluatorService.coachFeedback({
      stepName: request.step_name,
      attemptText: request.input_payload.summary_text ?? request.input_payload.text,
      detectedIssues: [
        ...validation.blocking_errors.map((message) => translateServerText(request.language ?? "en", message)),
        ...validation.warnings.map((message) => translateServerText(request.language ?? "en", message)),
        ...driftEvents.map(
          (drift) =>
            `${drift.drift_id}: ${translateDriftMessage(request.language ?? "en", drift.drift_id, drift.message)}`
        )
      ].slice(0, 3),
      rubricContext: rubricScores,
      language: request.language ?? "en"
    });

    if (!validation.passed) {
      const persistedAttempt = await this.repo.updateAttempt({
        ...attempt,
        evaluator_outputs: [
          toEvaluatorOutput(
            "drift_detector",
            driftDetector.meta,
            driftDetector.output
          ),
          toEvaluatorOutput(
            "feedback_coach",
            feedbackCoach.meta,
            feedbackCoach.output
          )
        ]
      });
      const updated = await this.repo.updateSession({
        ...session,
        state: transitionSessionState(session.state, "attempt_failed"),
        current_step: "summary_and_homework"
      });

      return { attempt: persistedAttempt, session: updated, drift_events: driftEvents, score_snapshot: null };
    }

    let updated = await this.repo.updateSession({
      ...session,
      state: transitionSessionState(session.state, "all_steps_complete"),
      current_step: "summary_and_homework"
    });

    let scoreSnapshot = null;
    if (rubricScores) {
      scoreSnapshot = await buildReviewFromSummaryStep({
        repo: this.repo,
        session: updated,
        rubricScores
      });

      const persistedAttempt = await this.repo.updateAttempt({
        ...attempt,
        evaluator_outputs: [
          toEvaluatorOutput(
            "drift_detector",
            driftDetector.meta,
            driftDetector.output
          ),
          toEvaluatorOutput(
            "feedback_coach",
            feedbackCoach.meta,
            feedbackCoach.output
          )
        ],
        score_snapshot: scoreSnapshot
      });

      attempt.id = persistedAttempt.id;
      attempt.evaluator_outputs = persistedAttempt.evaluator_outputs;
      attempt.score_snapshot = persistedAttempt.score_snapshot;
      updated = await this.repo.updateSession({
        ...updated,
        state: scoreOutcomeToState(scoreSnapshot.outcome),
        finished_at:
          scoreSnapshot.outcome === "strong_pass" || scoreSnapshot.outcome === "pass"
            ? new Date().toISOString()
            : null
      });

      await this.repo.addProgressSnapshot({
        user_id: updated.user_id,
        date: new Date().toISOString().slice(0, 10),
        avg_score: scoreSnapshot.adjusted_score,
        top_drift: scoreSnapshot.top_issues[0] ?? "none",
        strongest_skill: scoreSnapshot.priority_skill,
        weakest_skill: scoreSnapshot.priority_skill
      });
    }

    return { attempt, session: updated, drift_events: driftEvents, score_snapshot: scoreSnapshot };
  }
}
