import { buildHandlers } from "../src/lib/api/handlers";
import { InMemoryRepository } from "../src/lib/db/in-memory-repository";

describe("backend service and API layer", () => {
  it("supports practice setup and session start happy path", async () => {
    const handlers = buildHandlers(new InMemoryRepository());

    const setup = await handlers.practiceSetup({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "B001",
      stage: "foundations",
      selected_tool: "thought_record",
      session_goal: "Identify the automatic thought that appears before the team update.",
      rationale: "The case is early-stage and the immediate goal is to separate trigger, thought, and emotion."
    });

    expect(setup.status).toBe(200);
    expect("session" in setup.body && setup.body.session?.state).toBe("ready");

    const sessionId = "session" in setup.body && setup.body.session ? setup.body.session.id : "";
    const started = await handlers.sessionStart({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId
    });

    expect(started.status).toBe(200);
    expect("state" in started.body && started.body.state).toBe("in_progress");
  });

  it("returns validation failure for blocked tool selection", async () => {
    const handlers = buildHandlers(new InMemoryRepository());

    const response = await handlers.practiceSetup({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "B001",
      stage: "foundations",
      selected_tool: "core_belief_work",
      session_goal: "Explore the case.",
      rationale: "Trying deep work early."
    });

    expect(response.status).toBe(200);
    expect("created" in response.body && response.body.created).toBe(false);
  });

  it("supports full submission and review retrieval path", async () => {
    const handlers = buildHandlers(new InMemoryRepository());

    const setup = await handlers.practiceSetup({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      case_id: "B003",
      stage: "core_tools",
      selected_tool: "thought_record",
      session_goal: "Map the trigger, automatic thought, and next action for exam procrastination.",
      rationale: "The case is suited to a thought record before planning homework."
    });

    const sessionId = "session" in setup.body && setup.body.session ? setup.body.session.id : "";

    await handlers.sessionStart({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      session_id: sessionId
    });

    const guided = await handlers.stepSubmit({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "guided_input",
      input_payload: {
        text: "Before opening the material, the student thinks failing to study perfectly means there is no point in starting."
      }
    });

    expect(guided.status).toBe(200);

    const summary = await handlers.stepSubmit({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "summary_and_homework",
      input_payload: {
        text: "Summary and homework",
        summary_text: "We identified perfectionistic thinking as a trigger for procrastination and linked it to task avoidance.",
        homework_text: "Complete one thought record after the next study block and note the trigger, thought, emotion, and alternative response."
      },
      rubric_scores: {
        session_structure: 16,
        identification_accuracy: 17,
        tool_selection: 13,
        questioning_quality: 12,
        formulation_quality: 11,
        summary_and_homework: 13
      }
    });

    expect(summary.status).toBe(200);
    expect("score_snapshot" in summary.body && summary.body.score_snapshot?.adjusted_score).toBe(77);

    const review = await handlers.reviewGet({
      actor_user_id: "33333333-3333-3333-3333-333333333333",
      actor_role: "trainee",
      session_id: sessionId
    });

    expect(review.status).toBe(200);
    expect("score_snapshot" in review.body && review.body.score_snapshot?.outcome).toBe("pass");
  });

  it("blocks unauthorized progress access", async () => {
    const handlers = buildHandlers(new InMemoryRepository());

    const response = await handlers.progressGet({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      user_id: "33333333-3333-3333-3333-333333333333"
    });

    expect(response.status).toBe(400);
    expect("error" in response.body && response.body.error).toContain("Forbidden");
  });
});
