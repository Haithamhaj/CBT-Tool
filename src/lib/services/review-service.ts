import type { ReviewRetrievalRequest } from "../../contracts";
import type { Attempt, EvaluatorOutput } from "../../contracts";
import type { Repository } from "../db/repository";
import { EvaluatorService, toEvaluatorOutput } from "../evaluators/service";

function upsertSessionSynthesizerOutput(attempt: Attempt, output: EvaluatorOutput): Attempt {
  const evaluatorOutputs = attempt.evaluator_outputs.filter((entry) => entry.evaluator_name !== "session_evaluator");
  evaluatorOutputs.push(output);
  return {
    ...attempt,
    evaluator_outputs: evaluatorOutputs
  };
}

function getSessionSynthesizerOutput(attempt: Attempt) {
  return attempt.evaluator_outputs.find((entry) => entry.evaluator_name === "session_evaluator");
}

function hasReusableSessionSynthesis(params: {
  latestAttempt: Attempt;
  driftEventCount: number;
  scoreSnapshotPresent: boolean;
  language: "en" | "ar";
}) {
  const synthesis = getSessionSynthesizerOutput(params.latestAttempt);
  if (!synthesis || !params.scoreSnapshotPresent || !params.latestAttempt.score_snapshot) {
    return false;
  }

  return (
    params.latestAttempt.score_snapshot.drift_count === params.driftEventCount &&
    synthesis.output_language === params.language
  );
}

export class ReviewService {
  constructor(
    private readonly repo: Repository,
    private readonly evaluatorService: EvaluatorService = new EvaluatorService()
  ) {}

  async getReview(request: ReviewRetrievalRequest) {
    const session = await this.repo.getSession(request.session_id);
    if (!session) {
      throw new Error("Session not found");
    }

    if (session.user_id !== request.actor_user_id) {
      throw new Error("Forbidden");
    }

    if (!["review_pending", "reviewed", "needs_revision", "completed"].includes(session.state)) {
      throw new Error("Review is not available for this session state");
    }

    const attempts = await this.repo.listAttemptsBySession(session.id);
    const driftEvents = await this.repo.listDriftEventsBySession(session.id);
    const scoreSnapshot = await this.repo.latestScoreForSession(session.id);

    let resolvedAttempts = attempts;
    if (scoreSnapshot && attempts.length > 0) {
      const latestAttempt = attempts[attempts.length - 1]!;
      if (hasReusableSessionSynthesis({
        latestAttempt,
        driftEventCount: driftEvents.length,
        scoreSnapshotPresent: Boolean(scoreSnapshot),
        language: request.language ?? "en"
      })) {
        resolvedAttempts = attempts;
      } else {
        const synthesis = await this.evaluatorService.synthesizeSession({
          session,
          attempts,
          driftEvents,
          scoreSnapshot,
          language: request.language ?? "en"
        });
        const persistedAttempt = await this.repo.updateAttempt(
          upsertSessionSynthesizerOutput(
            latestAttempt,
            toEvaluatorOutput("session_evaluator", synthesis.meta, synthesis.output)
          )
        );
        resolvedAttempts = [...attempts.slice(0, -1), persistedAttempt];
      }
    }

    return {
      session,
      attempts: resolvedAttempts,
      drift_events: driftEvents,
      score_snapshot: scoreSnapshot
    };
  }
}
