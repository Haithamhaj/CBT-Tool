import { describe, expect, it } from "vitest";
import { sessionSynthesizerResultSchema } from "../../src/contracts";
import { EvaluatorService } from "../../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../../src/lib/evaluators/provider";

const input = {
  session: {
    id: "s1",
    user_id: "22222222-2222-2222-2222-222222222222",
    case_id: "B001",
    state: "reviewed" as const,
    current_step: "summary_and_homework" as const,
    stage: "foundations" as const,
    selected_tool: "thought_record" as const,
    session_goal: "Identify the main prediction before the meeting.",
    revision_count: 0,
    started_at: "2026-04-01T08:00:00.000Z",
    finished_at: "2026-04-01T08:10:00.000Z",
    created_at: "2026-04-01T08:00:00.000Z",
    updated_at: "2026-04-01T08:10:00.000Z",
    last_activity_at: "2026-04-01T08:10:00.000Z"
  },
  attempts: [],
  driftEvents: [],
  scoreSnapshot: {
    rubric_scores: {
      session_structure: 16,
      identification_accuracy: 15,
      tool_selection: 13,
      questioning_quality: 12,
      formulation_quality: 10,
      summary_and_homework: 12
    },
    raw_score: 78,
    adjusted_score: 78,
    outcome: "pass" as const,
    drift_penalties: [],
    drift_count: 0,
    top_issues: ["questioning_quality"],
    priority_skill: "questioning_quality",
    recommended_next_practice_area: "guided discovery questioning"
  },
  language: "en" as const
};

describe("session synthesizer evaluator", () => {
  it("returns schema-valid session synthesis output", async () => {
    const provider: EvaluatorProvider = {
      async classifyCategory() {
        return { label: "thought", confidence: 0.9, explanation: "ok" };
      },
      async detectDrift() {
        return { ai_drifts: [] };
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
          session_summary: "The session stayed coherent and reviewable.",
          primary_learning_pattern: "The main pattern was improving thought-focused work while needing stronger questioning.",
          evidence_based_strengths: ["The trainee completed the session flow."],
          priority_improvement_area: "The main improvement area is questioning quality.",
          recommended_next_focus: "Practice guided discovery on one prediction at a time.",
          confidence: 0.83
        };
      }
    };

    const service = new EvaluatorService(provider, provider);
    const result = await service.synthesizeSession(input);

    expect(sessionSynthesizerResultSchema.parse(result.output).confidence).toBe(0.83);
    expect(result.meta.fallbackUsed).toBe(false);
  });

  it("falls back safely on invalid provider output", async () => {
    const invalidProvider: EvaluatorProvider = {
      async classifyCategory() {
        throw new Error("unused");
      },
      async detectDrift() {
        throw new Error("unused");
      },
      async coachFeedback() {
        throw new Error("unused");
      },
      async synthesizeSession() {
        return { session_summary: "missing fields" };
      }
    };

    const service = new EvaluatorService(invalidProvider);
    const result = await service.synthesizeSession(input);

    expect(result.meta.fallbackUsed).toBe(true);
    expect(result.meta.fallbackReason).toBe("schema_validation");
    expect(result.output.evidence_based_strengths.length).toBeGreaterThan(0);
  });
});
