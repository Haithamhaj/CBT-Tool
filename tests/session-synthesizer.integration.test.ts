import { describe, expect, it } from "vitest";
import { InMemoryRepository } from "../src/lib/db/in-memory-repository";
import { EvaluatorService } from "../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../src/lib/evaluators/provider";
import { PracticeService } from "../src/lib/services/practice-service";
import { ReviewService } from "../src/lib/services/review-service";

describe("session synthesizer integration", () => {
  it("runs only at review stage and does not affect score, drifts, or session state", async () => {
    const provider: EvaluatorProvider = {
      async classifyCategory() {
        return { label: "thought", confidence: 0.9, explanation: "ok" };
      },
      async detectDrift() {
        return { ai_drifts: [] };
      },
      async coachFeedback() {
        return {
          what_was_done_well: ["Clear enough to review."],
          top_issues: ["Homework needs narrowing."],
          why_it_matters: ["Specific tasks are easier to complete."],
          next_revision: "Reduce the homework to one task."
        };
      },
      async synthesizeSession() {
        return {
          session_summary: "The session completed review and showed one main improvement pattern.",
          primary_learning_pattern: "The main pattern was keeping the work coherent while needing more precision.",
          evidence_based_strengths: ["The trainee completed the required flow."],
          priority_improvement_area: "The main improvement area is narrowing the final task.",
          recommended_next_focus: "Practice one focused homework plan.",
          confidence: 0.81
        };
      }
    };

    const repo = new InMemoryRepository();
    const evaluatorService = new EvaluatorService(provider, provider);
    const practiceService = new PracticeService(repo, evaluatorService);
    const reviewService = new ReviewService(repo, evaluatorService);

    const setup = await practiceService.setupPractice({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "A002",
      stage: "full_simulation",
      selected_tool: "homework_planning",
      session_goal: "Create one concrete homework task linked to the session target.",
      rationale: "The case supports a focused practice task linked to the selected tool."
    });
    const session = setup.session!;

    await practiceService.startSession({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    const guided = await practiceService.submitStep({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id,
      step_name: "guided_input",
      input_payload: {
        text: "I predict I will fail if I do not complete everything perfectly."
      }
    });

    expect(guided.attempt.evaluator_outputs.some((entry) => entry.evaluator_name === "session_evaluator")).toBe(false);

    const finalStep = await practiceService.submitStep({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id,
      step_name: "summary_and_homework",
      input_payload: {
        text: "summary",
        summary_text: "We linked the session to one homework planning target.",
        homework_text: "Create one practice task"
      }
    });

    const scoreBeforeReview = finalStep.score_snapshot!;
    const driftIdsBeforeReview = finalStep.drift_events.map((entry) => entry.drift_id);
    const stateBeforeReview = finalStep.session.state;

    const review = await reviewService.getReview({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    const lastAttempt = review.attempts[review.attempts.length - 1]!;
    expect(lastAttempt.evaluator_outputs.some((entry) => entry.evaluator_name === "session_evaluator")).toBe(true);
    expect(review.score_snapshot).toEqual(scoreBeforeReview);
    expect(review.drift_events.map((entry) => entry.drift_id)).toEqual(driftIdsBeforeReview);
    expect(review.session.state).toBe(stateBeforeReview);
  });

  it("reuses cached synthesis on repeated review fetches when review evidence is unchanged", async () => {
    let synthCalls = 0;
    const provider: EvaluatorProvider = {
      async classifyCategory() {
        return { label: "thought", confidence: 0.9, explanation: "ok" };
      },
      async detectDrift() {
        return { ai_drifts: [] };
      },
      async coachFeedback() {
        return {
          what_was_done_well: ["Clear enough to review."],
          top_issues: ["Homework needs narrowing."],
          why_it_matters: ["Specific tasks are easier to complete."],
          next_revision: "Reduce the homework to one task."
        };
      },
      async synthesizeSession() {
        synthCalls += 1;
        return {
          session_summary: `Synthesis run ${synthCalls}.`,
          primary_learning_pattern: "The main pattern was keeping the work coherent while needing more precision.",
          evidence_based_strengths: ["The trainee completed the required flow."],
          priority_improvement_area: "The main improvement area is narrowing the final task.",
          recommended_next_focus: "Practice one focused homework plan.",
          confidence: 0.81
        };
      }
    };

    const repo = new InMemoryRepository();
    const evaluatorService = new EvaluatorService(provider, provider);
    const practiceService = new PracticeService(repo, evaluatorService);
    const reviewService = new ReviewService(repo, evaluatorService);

    const setup = await practiceService.setupPractice({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "A002",
      stage: "full_simulation",
      selected_tool: "homework_planning",
      session_goal: "Create one concrete homework task linked to the session target.",
      rationale: "The case supports a focused practice task linked to the selected tool."
    });
    const session = setup.session!;

    await practiceService.startSession({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    await practiceService.submitStep({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id,
      step_name: "guided_input",
      input_payload: {
        text: "I predict I will fail if I do not complete everything perfectly."
      }
    });

    await practiceService.submitStep({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id,
      step_name: "summary_and_homework",
      input_payload: {
        text: "summary",
        summary_text: "We linked the session to one homework planning target.",
        homework_text: "Create one practice task"
      }
    });

    const first = await reviewService.getReview({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });
    const second = await reviewService.getReview({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    expect(synthCalls).toBe(1);
    const latestAttempt = second.attempts[second.attempts.length - 1]!;
    const sessionSynthOutputs = latestAttempt.evaluator_outputs.filter((entry) => entry.evaluator_name === "session_evaluator");
    expect(sessionSynthOutputs).toHaveLength(1);
    expect((sessionSynthOutputs[0]!.output as { session_summary?: string }).session_summary).toBe("Synthesis run 1.");
    expect((first.attempts[first.attempts.length - 1]!.evaluator_outputs.find((entry) => entry.evaluator_name === "session_evaluator")!.output as {
      session_summary?: string;
    }).session_summary).toBe("Synthesis run 1.");
  });

  it("invalidates cached synthesis when the latest review score snapshot changes", async () => {
    let synthCalls = 0;
    const provider: EvaluatorProvider = {
      async classifyCategory() {
        return { label: "thought", confidence: 0.9, explanation: "ok" };
      },
      async detectDrift() {
        return { ai_drifts: [] };
      },
      async coachFeedback() {
        return {
          what_was_done_well: ["Clear enough to review."],
          top_issues: ["Homework needs narrowing."],
          why_it_matters: ["Specific tasks are easier to complete."],
          next_revision: "Reduce the homework to one task."
        };
      },
      async synthesizeSession() {
        synthCalls += 1;
        return {
          session_summary: `Synthesis run ${synthCalls}.`,
          primary_learning_pattern: "The main pattern was keeping the work coherent while needing more precision.",
          evidence_based_strengths: ["The trainee completed the required flow."],
          priority_improvement_area: "The main improvement area is narrowing the final task.",
          recommended_next_focus: "Practice one focused homework plan.",
          confidence: 0.81
        };
      }
    };

    const repo = new InMemoryRepository();
    const evaluatorService = new EvaluatorService(provider, provider);
    const practiceService = new PracticeService(repo, evaluatorService);
    const reviewService = new ReviewService(repo, evaluatorService);

    const setup = await practiceService.setupPractice({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "A002",
      stage: "full_simulation",
      selected_tool: "homework_planning",
      session_goal: "Create one concrete homework task linked to the session target.",
      rationale: "The case supports a focused practice task linked to the selected tool."
    });
    const session = setup.session!;

    await practiceService.startSession({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    await practiceService.submitStep({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id,
      step_name: "guided_input",
      input_payload: {
        text: "I predict I will fail if I do not complete everything perfectly."
      }
    });

    await practiceService.submitStep({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id,
      step_name: "summary_and_homework",
      input_payload: {
        text: "summary",
        summary_text: "We linked the session to one homework planning target.",
        homework_text: "Create one practice task"
      }
    });

    const first = await reviewService.getReview({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    const latestAttempt = first.attempts[first.attempts.length - 1]!;
    await repo.updateAttempt({
      ...latestAttempt,
      score_snapshot: latestAttempt.score_snapshot
        ? {
            ...latestAttempt.score_snapshot,
            drift_count: latestAttempt.score_snapshot.drift_count + 1
          }
        : latestAttempt.score_snapshot
    });

    const second = await reviewService.getReview({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    expect(synthCalls).toBe(2);
    expect((second.attempts[second.attempts.length - 1]!.evaluator_outputs.find((entry) => entry.evaluator_name === "session_evaluator")!.output as {
      session_summary?: string;
    }).session_summary).toBe("Synthesis run 2.");
  });
});
