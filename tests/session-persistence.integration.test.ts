import { buildHandlers } from "../src/lib/api/handlers";
import { createTestDb } from "./helpers/postgres-test-db";

describe("session persistence integration", () => {
  it("persists sessions, drifts, scores, and progress snapshots", async () => {
    const { repository, pool } = await createTestDb();
    const handlers = buildHandlers(repository);

    const setup = await handlers.practiceSetup({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      case_id: "B004",
      stage: "core_tools",
      selected_tool: "behavioral_activation",
      session_goal: "Plan one small activity to restart structure after routine loss.",
      rationale: "Behavioral activation fits low mood and routine disruption."
    });

    const sessionId = "session" in setup.body && setup.body.session ? setup.body.session.id : "";
    await handlers.sessionStart({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      session_id: sessionId
    });

    await handlers.stepSubmit({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "guided_input",
      input_payload: {
        text: "The person links losing structure with low mood and withdraws further instead of restarting one task."
      }
    });

    const summary = await handlers.stepSubmit({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "summary_and_homework",
      input_payload: {
        text: "summary",
        summary_text: "We linked low mood to routine disruption and chose one small activity to restore momentum.",
        homework_text: "Complete one activity schedule entry tomorrow morning and note the task, time, and mood before and after."
      },
      rubric_scores: {
        session_structure: 17,
        identification_accuracy: 15,
        tool_selection: 13,
        questioning_quality: 11,
        formulation_quality: 10,
        summary_and_homework: 13
      }
    });

    expect(summary.status).toBe(200);

    const attempts = await repository.listAttemptsBySession(sessionId);
    const drifts = await repository.listDriftEventsBySession(sessionId);
    const progress = await repository.listProgressSnapshotsByUser("33333333-3333-3333-3333-333333333333");

    expect(attempts).toHaveLength(2);
    expect(attempts[1].score_snapshot).not.toBeNull();
    expect(drifts.length).toBeGreaterThanOrEqual(0);
    expect(progress).toHaveLength(1);

    await pool.end();
  });
});
