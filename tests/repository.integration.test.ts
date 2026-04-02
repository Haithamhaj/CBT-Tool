import { createTestDb } from "./helpers/postgres-test-db";

describe("postgres repository integration", () => {
  it("persists sessions and attempts in the database", async () => {
    const { repository, pool } = await createTestDb();

    const session = await repository.createSession({
      user_id: "22222222-2222-2222-2222-222222222222",
      case_id: "B001",
      state: "ready",
      current_step: "guided_input",
      stage: "foundations",
      selected_tool: "thought_record",
      session_goal: "Identify the automatic thought before the update.",
      revision_count: 0,
      started_at: null,
      finished_at: null
    });

    const attempt = await repository.createAttempt({
      session_id: session.id,
      revision_number: 0,
      step_name: "guided_input",
      input_payload: { text: "A sufficiently long guided input payload for testing." },
      validation_output: {
        passed: true,
        blocking_errors: [],
        warnings: [],
        rule_hits: []
      },
      evaluator_outputs: [],
      score_snapshot: null
    });

    const storedSession = await repository.getSession(session.id);
    const storedAttempts = await repository.listAttemptsBySession(session.id);

    expect(storedSession?.id).toBe(session.id);
    expect(storedAttempts).toHaveLength(1);
    expect(storedAttempts[0].id).toBe(attempt.id);

    await pool.end();
  });
});
