import type {
  Attempt,
  Case,
  DriftEvent,
  ScoreOutput,
  Session,
  User
} from "../../contracts";

export type ProgressSnapshot = {
  id: string;
  user_id: string;
  date: string;
  avg_score: number;
  top_drift: string;
  strongest_skill: string;
  weakest_skill: string;
};

export type NewSession = Omit<Session, "id" | "created_at" | "updated_at" | "last_activity_at">;
export type NewAttempt = Omit<Attempt, "id" | "created_at">;
export type NewDriftEvent = Omit<
  DriftEvent,
  "id" | "session_id" | "attempt_id" | "created_at" | "corrected_at" | "status"
>;
export type NewProgressSnapshot = Omit<ProgressSnapshot, "id">;

export interface Repository {
  createSession(input: NewSession): Promise<Session>;
  updateSession(session: Session): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  getCase(caseId: string): Promise<Case | undefined>;
  getUser(userId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  listSessionsByUser(userId: string): Promise<Session[]>;
  createAttempt(input: NewAttempt): Promise<Attempt>;
  updateAttempt(attempt: Attempt): Promise<Attempt>;
  listAttemptsBySession(sessionId: string): Promise<Attempt[]>;
  createDriftEvents(
    sessionId: string,
    attemptId: string,
    drifts: NewDriftEvent[]
  ): Promise<DriftEvent[]>;
  listDriftEventsBySession(sessionId: string): Promise<DriftEvent[]>;
  addProgressSnapshot(snapshot: NewProgressSnapshot): Promise<ProgressSnapshot>;
  listProgressSnapshotsByUser(userId: string): Promise<ProgressSnapshot[]>;
  latestScoreForSession(sessionId: string): Promise<ScoreOutput | null>;
}
