import { validateSeedCases, validateSeedUsers } from "../src/lib/seeds/seed-validation";

describe("seed validation", () => {
  it("validates all seeded cases", () => {
    const cases = validateSeedCases();

    expect(cases).toHaveLength(10);
    expect(cases.filter((caseRecord) => caseRecord.difficulty === "beginner")).toHaveLength(5);
    expect(cases.filter((caseRecord) => caseRecord.difficulty === "intermediate")).toHaveLength(3);
    expect(cases.filter((caseRecord) => caseRecord.difficulty === "advanced")).toHaveLength(2);
  });

  it("validates seeded users and facilitator linkage", () => {
    const users = validateSeedUsers();
    const facilitator = users.find((user) => user.role === "facilitator");
    const trainees = users.filter((user) => user.role === "trainee");

    expect(facilitator).toBeDefined();
    expect(trainees).toHaveLength(2);
    expect(trainees.every((user) => user.facilitator_id === facilitator?.id)).toBe(true);
  });
});
