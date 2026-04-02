import { transitionSessionState } from "../src/lib/session/state-machine";

describe("session state machine", () => {
  it("supports the standard passing path", () => {
    let state = transitionSessionState("draft", "setup_completed");
    state = transitionSessionState(state, "first_step_opened");
    state = transitionSessionState(state, "attempt_passed");
    state = transitionSessionState(state, "all_steps_complete");
    state = transitionSessionState(state, "review_pass");
    state = transitionSessionState(state, "finalize_session");

    expect(state).toBe("completed");
  });

  it("supports revision flow after failed review", () => {
    let state = transitionSessionState("review_pending", "review_fail");
    state = transitionSessionState(state, "targeted_redo_started");
    state = transitionSessionState(state, "all_steps_complete");
    state = transitionSessionState(state, "review_pass");

    expect(state).toBe("reviewed");
  });

  it("throws on invalid transitions", () => {
    expect(() => transitionSessionState("draft", "review_pass")).toThrow("Invalid transition");
  });
});
