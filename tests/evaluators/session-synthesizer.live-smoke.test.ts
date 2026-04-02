import { describe, expect, it } from "vitest";
import { InMemoryRepository } from "../../src/lib/db/in-memory-repository";
import { EvaluatorService } from "../../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../../src/lib/evaluators/provider";
import { PracticeService } from "../../src/lib/services/practice-service";
import { ReviewService } from "../../src/lib/services/review-service";
import { getEvaluatorRuntimeConfig } from "../../src/lib/evaluators/runtime";

describe("live session synthesizer smoke", () => {
  it("captures provider-backed session synthesis at review time", async () => {
    const runtime = getEvaluatorRuntimeConfig();
    const repo = new InMemoryRepository();

    const stubProvider: EvaluatorProvider = {
      async classifyCategory() {
        return {
          label: "thought",
          confidence: 0.92,
          explanation: "Prediction language."
        };
      },
      async detectDrift() {
        return { ai_drifts: [] };
      },
      async coachFeedback() {
        return {
          what_was_done_well: ["The trainee completed the flow."],
          top_issues: ["Homework should stay focused."],
          why_it_matters: ["Focused homework is easier to complete."],
          next_revision: "Keep the homework limited to one task."
        };
      },
      async synthesizeSession() {
        return {
          session_summary: "unused",
          primary_learning_pattern: "unused",
          evidence_based_strengths: ["unused"],
          priority_improvement_area: "unused",
          recommended_next_focus: "unused",
          confidence: 0.1
        };
      }
    };

    const practiceService = new PracticeService(repo, new EvaluatorService(stubProvider, stubProvider));
    const reviewService = new ReviewService(repo, new EvaluatorService());

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

    const review = await reviewService.getReview({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    const synthesis = review.attempts
      .flatMap((attempt) => attempt.evaluator_outputs)
      .find((entry) => entry.evaluator_name === "session_evaluator");

    console.log(
      "[live-session-synthesizer-smoke.default]",
      JSON.stringify(
        {
          environment: {
            node: process.version,
            has_openai_api_key: Boolean(process.env.OPENAI_API_KEY),
            configured_provider: runtime.providerName,
            model: runtime.model,
            timeout_ms: runtime.timeoutMs
          },
          synthesis
        },
        null,
        2
      )
    );

    expect(synthesis?.provider_name).toBeTruthy();
    expect(synthesis?.output).toBeTruthy();
  }, 20000);
});
