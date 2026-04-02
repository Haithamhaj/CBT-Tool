import { describe, expect, it } from "vitest";
import { InMemoryRepository } from "../../src/lib/db/in-memory-repository";
import { EvaluatorService } from "../../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../../src/lib/evaluators/provider";
import { PracticeService } from "../../src/lib/services/practice-service";

describe("evaluator boundary regression", () => {
  it("prevents deterministic drift ids from becoming authoritative AI outcomes", async () => {
    const provider: EvaluatorProvider = {
      async classifyCategory() {
        return {
          label: "thought",
          confidence: 0.9,
          explanation: "ok"
        };
      },
      async detectDrift() {
        return {
          ai_drifts: [
            {
              drift_id: "DR012"
            }
          ]
        };
      },
      async coachFeedback() {
        return {
          what_was_done_well: ["ok"],
          top_issues: ["ok"],
          why_it_matters: ["ok"],
          next_revision: "ok"
        };
      },
      async synthesizeSession() {
        return {
          session_summary: "ok",
          primary_learning_pattern: "ok",
          evidence_based_strengths: ["ok"],
          priority_improvement_area: "ok",
          recommended_next_focus: "ok",
          confidence: 0.7
        };
      }
    };

    const repo = new InMemoryRepository();
    const service = new PracticeService(repo, new EvaluatorService(provider));

    const setup = await service.setupPractice({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "A002",
      stage: "full_simulation",
      selected_tool: "homework_planning",
      session_goal: "Create one concrete homework task linked to the session target.",
      rationale: "The case supports a focused practice task linked to the selected tool."
    });
    const session = setup.session!;

    await service.startSession({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    await service.submitStep({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id,
      step_name: "guided_input",
      input_payload: {
        text: "I predict I will fail if I do not complete everything perfectly."
      }
    });

    const result = await service.submitStep({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id,
      step_name: "summary_and_homework",
      input_payload: {
        text: "summary",
        summary_text: "We linked the session to one planning target.",
        homework_text: "Create one practice task and plan a second task and then review the plan"
      }
    });

    expect(result.drift_events.map((entry) => entry.drift_id)).toContain("DR012");
    const driftOutput = result.attempt.evaluator_outputs.find((entry) => entry.evaluator_name === "drift_detector");
    const aiDrifts = (driftOutput?.output as { ai_drifts?: Array<{ drift_id: string }> } | null)?.ai_drifts ?? [];
    expect(aiDrifts).toHaveLength(0);
    expect(result.drift_events.every((entry) => entry.detection_mode === "rule")).toBe(true);
  });
});
