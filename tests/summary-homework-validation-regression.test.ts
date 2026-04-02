import { buildHandlers } from "../src/lib/api/handlers";
import { InMemoryRepository } from "../src/lib/db/in-memory-repository";
import { transitionSessionState } from "../src/lib/session/state-machine";

describe("summary and homework validation regression", () => {
  it("keeps the session recoverable when summary/homework validation fails from blocked_validation", async () => {
    const handlers = buildHandlers(new InMemoryRepository());

    const setup = await handlers.practiceSetup({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      case_id: "B001",
      stage: "foundations",
      selected_tool: "thought_record",
      session_goal: "Identify one automatic thought before the meeting update.",
      rationale: "Thought record fits an early focused classification target."
    });

    const sessionId = "session" in setup.body && setup.body.session ? setup.body.session.id : "";

    await handlers.sessionStart({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId
    });

    const guided = await handlers.stepSubmit({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "guided_input",
      input_payload: {
        text: "Before the update, the trainee thinks sounding uncertain will prove they are incompetent."
      },
      language: "en"
    });

    expect(guided.status).toBe(200);
    expect("session" in guided.body && guided.body.session?.current_step).toBe("summary_and_homework");

    const firstFailedSummary = await handlers.stepSubmit({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "summary_and_homework",
      input_payload: {
        text: "summary",
        summary_text: "brief",
        homework_text: "Do many tasks this week and try several worksheets after different meetings."
      },
      language: "en"
    });

    expect(firstFailedSummary.status).toBe(200);
    expect("session" in firstFailedSummary.body && firstFailedSummary.body.session?.state).toBe("blocked_validation");
    expect("attempt" in firstFailedSummary.body && firstFailedSummary.body.attempt?.validation_output.passed).toBe(false);
    expect("attempt" in firstFailedSummary.body && firstFailedSummary.body.attempt?.validation_output.blocking_errors.length).toBeGreaterThan(0);

    const secondFailedSummary = await handlers.stepSubmit({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "summary_and_homework",
      input_payload: {
        text: "summary",
        summary_text: "still brief",
        homework_text: "Practice breathing after the next meeting and try a relaxation exercise at home."
      },
      language: "en"
    });

    expect(secondFailedSummary.status).toBe(200);
    expect("session" in secondFailedSummary.body && secondFailedSummary.body.session?.state).toBe("blocked_validation");

    const correctedSummary = await handlers.stepSubmit({
      actor_user_id: "22222222-2222-2222-2222-222222222222",
      actor_role: "trainee",
      session_id: sessionId,
      step_name: "summary_and_homework",
      input_payload: {
        text: "Summary and homework",
        summary_text: "We identified the prediction about sounding incompetent and linked it to anticipatory anxiety before the update.",
        homework_text: "Complete one thought record after the next team update."
      },
      rubric_scores: {
        session_structure: 16,
        identification_accuracy: 15,
        tool_selection: 13,
        questioning_quality: 12,
        formulation_quality: 11,
        summary_and_homework: 13
      },
      language: "en"
    });

    expect(correctedSummary.status).toBe(200);
    expect("session" in correctedSummary.body && correctedSummary.body.session?.state).not.toBe("blocked_validation");
    expect("score_snapshot" in correctedSummary.body && correctedSummary.body.score_snapshot).not.toBeNull();
  });

  it("allows final-step completion from blocked_validation", () => {
    expect(transitionSessionState("blocked_validation", "attempt_failed")).toBe("blocked_validation");
    expect(transitionSessionState("blocked_validation", "all_steps_complete")).toBe("review_pending");
  });
});
