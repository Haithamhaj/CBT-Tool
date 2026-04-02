import cases from "../data/seeds/cases.json";
import { caseSchema } from "../src/contracts";
import { validateSessionSetup, validateSummaryAndHomework } from "../src/lib/rules/rules-engine";

describe("rules engine", () => {
  const parsedCases = cases.map((caseRecord) => caseSchema.parse(caseRecord));

  it("blocks a blocked tool for a stage", () => {
    const result = validateSessionSetup({
      caseRecord: parsedCases[0],
      stage: "foundations",
      selectedTool: "core_belief_work",
      sessionGoal: "Identify the automatic thought before the meeting begins.",
      rationale: "The case has deeper themes."
    });

    expect(result.passed).toBe(false);
    expect(result.rule_hits).toContain("DR006");
  });

  it("warns on discouraged tool selection and caps tool selection score", () => {
    const result = validateSessionSetup({
      caseRecord: parsedCases[0],
      stage: "foundations",
      selectedTool: "cognitive_restructuring",
      sessionGoal: "Identify one automatic thought and explore whether it fits the evidence.",
      rationale: "Trying to change the thought quickly."
    });

    expect(result.passed).toBe(true);
    expect(result.rule_hits).toContain("DR004");
    expect(result.toolSelectionCap).toBe(11);
  });

  it("flags weak session goals and weak rationale for allowed tools", () => {
    const result = validateSessionSetup({
      caseRecord: parsedCases[3],
      stage: "foundations",
      selectedTool: "behavioral_activation",
      sessionGoal: "Feel better",
      rationale: "It helps."
    });

    expect(result.rule_hits).toContain("DR009");
    expect(result.rule_hits).toContain("DR011");
  });

  it("flags missing summary and mismatched homework", () => {
    const result = validateSummaryAndHomework({
      caseRecord: parsedCases[2],
      selectedTool: "thought_record",
      summaryText: "",
      homeworkText: "Go for a run and clean the room and call a friend"
    });

    expect(result.rule_hits).toContain("DR007");
    expect(result.rule_hits).toContain("DR008");
    expect(result.rule_hits).toContain("DR012");
    expect(result.passed).toBe(false);
  });
});
