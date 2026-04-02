import { describe, expect, it } from "vitest";
import { driftDetectorResultSchema } from "../../src/contracts";
import { EvaluatorService } from "../../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../../src/lib/evaluators/provider";

describe("drift detector evaluator", () => {
  it("returns schema-valid advisory drift output", async () => {
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
              drift_id: "DR005",
              name: "Advice Instead of Guided Discovery",
              severity: "major",
              rationale: "The response gives direct instructions instead of questions.",
              corrective_action: "Rewrite the intervention as guided discovery."
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

    const service = new EvaluatorService(provider, provider);
    const result = await service.detectDrift({
      stepName: "guided_input",
      stage: "full_simulation",
      selectedTool: "cognitive_restructuring",
      text: "You should tell yourself that this is irrational.",
      language: "en"
    });

    expect(driftDetectorResultSchema.parse(result.output).ai_drifts[0]?.drift_id).toBe("DR005");
    expect(result.meta.fallbackUsed).toBe(false);
  });

  it("falls back safely on invalid provider output", async () => {
    const invalidProvider: EvaluatorProvider = {
      async classifyCategory() {
        throw new Error("unused");
      },
      async detectDrift() {
        return { ai_drifts: [{ drift_id: "DR012" }] };
      },
      async coachFeedback() {
        throw new Error("unused");
      },
      async synthesizeSession() {
        throw new Error("unused");
      }
    };

    const service = new EvaluatorService(invalidProvider);
    const result = await service.detectDrift({
      stepName: "guided_input",
      stage: "full_simulation",
      selectedTool: "cognitive_restructuring",
      text: "You should just stop thinking that way.",
      language: "en"
    });

    expect(result.meta.fallbackUsed).toBe(true);
    expect(result.meta.fallbackReason).toBe("schema_validation");
    expect(result.output.ai_drifts).toHaveLength(0);
  });
});
