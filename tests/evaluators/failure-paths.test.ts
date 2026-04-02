import { describe, expect, it } from "vitest";
import { EvaluatorService, toEvaluatorOutput } from "../../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../../src/lib/evaluators/provider";
import { buildHandlers } from "../../src/lib/api/handlers";
import { InMemoryRepository } from "../../src/lib/db/in-memory-repository";

describe("evaluator failure paths", () => {
  it("falls back when provider returns schema-invalid category output", async () => {
    const invalidProvider: EvaluatorProvider = {
      async classifyCategory() {
        return { label: "invalid" };
      },
      async detectDrift() {
        return { invalid: true };
      },
      async coachFeedback() {
        return { wrong: true };
      },
      async synthesizeSession() {
        return { wrong: true };
      }
    };

    const service = new EvaluatorService(invalidProvider);
    const result = await service.classifyCategory({
      text: "When my manager asks for an update, I freeze.",
      language: "en"
    });

    expect(result.meta.model).toBe("fallback");
    expect(result.output.label).toBeTruthy();
  });

  it("persists evaluator outputs without affecting deterministic flow", async () => {
    const repo = new InMemoryRepository();
    const handlers = buildHandlers(
      repo
    );
    const setup = await handlers.practiceSetup({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "B001",
      stage: "foundations",
      selected_tool: "thought_record",
      session_goal: "Identify the thought before the meeting update.",
      rationale: "This is an early-stage classification exercise."
    });

    const sessionId = "session" in setup.body && setup.body.session ? setup.body.session.id : "";
    await handlers.sessionStart({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId
    });

    const submit = await handlers.stepSubmit({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "guided_input",
      input_payload: {
        text: "I am going to sound incompetent in the meeting."
      }
    });

    expect(submit.status).toBe(200);
    expect("attempt" in submit.body && submit.body.attempt?.evaluator_outputs?.length).toBe(2);
  });

  it("formats persisted evaluator outputs in the shared contract", () => {
    const output = toEvaluatorOutput(
      "category_classifier",
      {
        providerName: "fallback",
        responseSource: "fallback",
        fallbackUsed: true,
        fallbackReason: "schema_validation",
        model: "fallback",
        promptVersion: "category-classifier-v1:fallback",
        latencyMs: 12,
        occurredAt: "2026-04-01T08:00:00.000Z",
        outputLanguage: "en"
      },
      {
        label: "thought",
        confidence: 0.7,
        explanation: "The text expresses an interpretation."
      }
    );

    expect(output.status).toBe("success");
    expect(output.output).not.toBeNull();
  });
});
