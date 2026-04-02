import { describe, expect, it } from "vitest";
import { InMemoryRepository } from "../src/lib/db/in-memory-repository";
import { EvaluatorService } from "../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../src/lib/evaluators/provider";
import { PracticeService } from "../src/lib/services/practice-service";

describe("drift detector integration", () => {
  it("keeps AI-only drifts advisory during guided input", async () => {
    const provider: EvaluatorProvider = {
      async classifyCategory() {
        return {
          label: "thought",
          confidence: 0.91,
          explanation: "Prediction language."
        };
      },
      async detectDrift() {
        return {
          ai_drifts: [
            {
              drift_id: "DR005",
              name: "Advice Instead of Guided Discovery",
              severity: "major",
              rationale: "The intervention uses direct advice wording.",
              corrective_action: "Convert the advice into exploratory questions."
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
    const service = new PracticeService(repo, new EvaluatorService(provider, provider));

    const setup = await service.setupPractice({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "I003",
      stage: "full_simulation",
      selected_tool: "cognitive_restructuring",
      session_goal: "Practice questioning an anxious prediction before a meeting.",
      rationale: "The case already shows automatic thought content tied to meeting fears."
    });
    const session = setup.session!;

    await service.startSession({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id
    });

    const result = await service.submitStep({
      actor_user_id: session.user_id,
      actor_role: "trainee",
      session_id: session.id,
      step_name: "guided_input",
      input_payload: {
        text: "You should tell yourself that the meeting will go fine and stop worrying about it."
      }
    });

    expect(result.drift_events).toHaveLength(0);
    const driftOutput = result.attempt.evaluator_outputs.find((entry) => entry.evaluator_name === "drift_detector");
    const aiDrifts = (driftOutput?.output as {
      ai_drifts?: Array<{ drift_id: string }>;
    } | null)?.ai_drifts ?? [];
    expect(aiDrifts.map((entry) => entry.drift_id)).toContain("DR005");
    expect(result.session.current_step).toBe("summary_and_homework");
  });

  it("keeps deterministic drifts authoritative and AI drift output advisory", async () => {
    const provider: EvaluatorProvider = {
      async classifyCategory() {
        return {
          label: "thought",
          confidence: 0.91,
          explanation: "Prediction language."
        };
      },
      async detectDrift() {
        return {
          ai_drifts: [
            {
              drift_id: "DR010",
              name: "Unsupported Formulation Claim",
              severity: "moderate",
              rationale: "The summary makes a belief-level claim without clear case support.",
              corrective_action: "Anchor the formulation claim to explicit case evidence."
            }
          ]
        };
      },
      async coachFeedback() {
        return {
          what_was_done_well: ["Clear enough to review."],
          top_issues: ["Homework scope needs narrowing."],
          why_it_matters: ["Specific homework is more teachable."],
          next_revision: "Reduce the homework to one task."
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
    const service = new PracticeService(repo, new EvaluatorService(provider, provider));

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
        summary_text: "We linked the session to a homework planning task and also concluded this reflects a core belief about worthlessness.",
        homework_text: "Create one practice task and plan a second task and then review the plan"
      }
    });

    expect(result.drift_events.map((entry) => entry.drift_id)).toContain("DR012");
    const driftOutput = result.attempt.evaluator_outputs.find((entry) => entry.evaluator_name === "drift_detector");
    const aiDrifts = (driftOutput?.output as {
      ai_drifts?: Array<{ drift_id: string }>;
    } | null)?.ai_drifts ?? [];
    expect(aiDrifts.map((entry) => entry.drift_id)).toContain("DR010");
    expect(result.drift_events.map((entry) => entry.drift_id)).not.toContain("DR010");
  });
});
