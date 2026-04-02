import type { SessionState } from "../../contracts";

export type SessionEvent =
  | "setup_completed"
  | "first_step_opened"
  | "attempt_passed"
  | "attempt_failed"
  | "all_steps_complete"
  | "review_pass"
  | "review_fail"
  | "finalize_session"
  | "targeted_redo_started"
  | "re_evaluation_pass"
  | "inactivity_timeout";

const transitions: Record<SessionState, Partial<Record<SessionEvent, SessionState>>> = {
  draft: {
    setup_completed: "ready",
    inactivity_timeout: "abandoned"
  },
  ready: {
    first_step_opened: "in_progress",
    inactivity_timeout: "abandoned"
  },
  in_progress: {
    attempt_passed: "in_progress",
    attempt_failed: "blocked_validation",
    all_steps_complete: "review_pending",
    inactivity_timeout: "abandoned"
  },
  blocked_validation: {
    attempt_passed: "in_progress",
    attempt_failed: "blocked_validation",
    all_steps_complete: "review_pending",
    inactivity_timeout: "abandoned"
  },
  review_pending: {
    review_pass: "reviewed",
    review_fail: "needs_revision"
  },
  reviewed: {
    finalize_session: "completed"
  },
  needs_revision: {
    targeted_redo_started: "in_progress",
    re_evaluation_pass: "reviewed"
  },
  completed: {},
  abandoned: {}
};

export function transitionSessionState(currentState: SessionState, event: SessionEvent): SessionState {
  const nextState = transitions[currentState][event];

  if (!nextState) {
    throw new Error(`Invalid transition: ${currentState} -> ${event}`);
  }

  return nextState;
}
