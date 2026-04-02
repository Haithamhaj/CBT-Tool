import { buildHandlers } from "../src/lib/api/handlers";
import { createTestDb } from "./helpers/postgres-test-db";

describe("authorization integration", () => {
  it("prevents one trainee from reading another trainee review", async () => {
    const { repository, pool } = await createTestDb();
    const handlers = buildHandlers(repository);

    const setup = await handlers.practiceSetup({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "B001",
      stage: "foundations",
      selected_tool: "thought_record",
      session_goal: "Identify the key automatic thought before the work update.",
      rationale: "Thought record is the best fit at this stage."
    });

    const sessionId = "session" in setup.body && setup.body.session ? setup.body.session.id : "";
    await handlers.sessionStart({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId
    });

    const review = await handlers.reviewGet({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      session_id: sessionId
    });

    expect(review.status).toBe(400);
    expect("error" in review.body && review.body.error).toContain("Forbidden");

    await pool.end();
  });

  it("allows an assigned facilitator to read trainee progress only", async () => {
    const { repository, pool } = await createTestDb();
    const handlers = buildHandlers(repository);

    const setup = await handlers.practiceSetup({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "B001",
      stage: "foundations",
      selected_tool: "thought_record",
      session_goal: "Identify the key automatic thought before the work update.",
      rationale: "Thought record is the best fit at this stage."
    });
    const sessionId = "session" in setup.body && setup.body.session ? setup.body.session.id : "";
    await handlers.sessionStart({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId
    });
    await handlers.stepSubmit({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "guided_input",
      input_payload: {
        text: "The work update triggers a thought about being seen as incompetent, followed by anxiety and brief speech."
      }
    });
    await handlers.stepSubmit({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "summary_and_homework",
      input_payload: {
        text: "summary",
        summary_text: "We identified the work-update thought and linked it to anxiety and short responses.",
        homework_text: "Complete one thought record after the next meeting and note the trigger, thought, emotion, and response."
      },
      rubric_scores: {
        session_structure: 16,
        identification_accuracy: 16,
        tool_selection: 13,
        questioning_quality: 12,
        formulation_quality: 10,
        summary_and_homework: 12
      }
    });

    const progress = await handlers.progressGet({
      actor_user_id: "11111111-1111-1111-1111-111111111111",
      actor_role: "facilitator",
      user_id: "22222222-2222-2222-2222-222222222222"
    });

    expect(progress.status).toBe(200);
    expect("snapshots" in progress.body).toBe(true);

    const review = await handlers.reviewGet({
      actor_user_id: "11111111-1111-1111-1111-111111111111",
      actor_role: "facilitator",
      session_id: sessionId
    });

    expect(review.status).toBe(400);
    expect("error" in review.body && review.body.error).toContain("Forbidden");

    await pool.end();
  });
});
