import casesSeed from "../../../data/seeds/cases.json";
import usersSeed from "../../../data/seeds/users.json";
import type { Attempt, Case, DriftEvent, ScoreOutput, Session, User } from "../../contracts";
import { caseSchema, userSchema } from "../../contracts";
import type {
  AuthProfileInput,
  NewAttempt,
  NewDriftEvent,
  NewProgressSnapshot,
  NewSession,
  ProgressSnapshot,
  Repository
} from "./repository";

type Store = {
  cases: Case[];
  users: User[];
  sessions: Session[];
  attempts: Attempt[];
  driftEvents: DriftEvent[];
  progressSnapshots: ProgressSnapshot[];
};

function nowIso(): string {
  return new Date().toISOString();
}

function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export class InMemoryRepository implements Repository {
  private store: Store;

  constructor(seed?: Partial<Store>) {
    this.store = {
      cases: seed?.cases ?? casesSeed.map((entry) => caseSchema.parse(entry)),
      users: seed?.users ?? usersSeed.map((entry) => userSchema.parse(entry)),
      sessions: seed?.sessions ?? [],
      attempts: seed?.attempts ?? [],
      driftEvents: seed?.driftEvents ?? [],
      progressSnapshots: seed?.progressSnapshots ?? []
    };
  }

  async ensureUserProfile(profile: AuthProfileInput): Promise<User> {
    const existingIndex = this.store.users.findIndex((user) => user.id === profile.id);
    const existing = existingIndex >= 0 ? this.store.users[existingIndex] : undefined;
    if (existing) {
      const updated = { ...existing, email: profile.email };
      this.store.users[existingIndex] = updated;
      return updated;
    }

    const created = userSchema.parse({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: "trainee",
      level: "beginner",
      facilitator_id: null
    });
    this.store.users.push(created);
    return created;
  }

  async createSession(input: NewSession): Promise<Session> {
    const created: Session = {
      ...input,
      id: randomId("session"),
      created_at: nowIso(),
      updated_at: nowIso(),
      last_activity_at: nowIso()
    };
    this.store.sessions.push(created);
    return created;
  }

  async updateSession(session: Session): Promise<Session> {
    const index = this.store.sessions.findIndex((item) => item.id === session.id);
    if (index === -1) {
      throw new Error("Session not found");
    }

    const updated = { ...session, updated_at: nowIso(), last_activity_at: nowIso() };
    this.store.sessions[index] = updated;
    return updated;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.store.sessions.find((session) => session.id === sessionId);
  }

  async getCase(caseId: string): Promise<Case | undefined> {
    return this.store.cases.find((caseRecord) => caseRecord.id === caseId);
  }

  async getUser(userId: string): Promise<User | undefined> {
    return this.store.users.find((user) => user.id === userId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.store.users.find((user) => user.email === email);
  }

  async listSessionsByUser(userId: string): Promise<Session[]> {
    return this.store.sessions.filter((session) => session.user_id === userId);
  }

  async createAttempt(input: NewAttempt): Promise<Attempt> {
    const attempt: Attempt = {
      ...input,
      id: randomId("attempt"),
      created_at: nowIso()
    };
    this.store.attempts.push(attempt);
    return attempt;
  }

  async updateAttempt(attempt: Attempt): Promise<Attempt> {
    const index = this.store.attempts.findIndex((item) => item.id === attempt.id);
    if (index === -1) {
      throw new Error("Attempt not found");
    }
    this.store.attempts[index] = attempt;
    return attempt;
  }

  async listAttemptsBySession(sessionId: string): Promise<Attempt[]> {
    return this.store.attempts.filter((attempt) => attempt.session_id === sessionId);
  }

  async createDriftEvents(
    sessionId: string,
    attemptId: string,
    drifts: NewDriftEvent[]
  ): Promise<DriftEvent[]> {
    const created = drifts.map((drift) => ({
      ...drift,
      id: randomId("drift"),
      session_id: sessionId,
      attempt_id: attemptId,
      status: "open" as const,
      created_at: nowIso(),
      corrected_at: null
    }));
    this.store.driftEvents.push(...created);
    return created;
  }

  async listDriftEventsBySession(sessionId: string): Promise<DriftEvent[]> {
    return this.store.driftEvents.filter((event) => event.session_id === sessionId);
  }

  async addProgressSnapshot(snapshot: NewProgressSnapshot): Promise<ProgressSnapshot> {
    const created = { ...snapshot, id: randomId("progress") };
    this.store.progressSnapshots.push(created);
    return created;
  }

  async listProgressSnapshotsByUser(userId: string): Promise<ProgressSnapshot[]> {
    return this.store.progressSnapshots.filter((snapshot) => snapshot.user_id === userId);
  }

  async latestScoreForSession(sessionId: string): Promise<ScoreOutput | null> {
    const attempts = this.store.attempts
      .filter((attempt) => attempt.session_id === sessionId && attempt.score_snapshot !== null);

    return attempts.length === 0 ? null : attempts[attempts.length - 1].score_snapshot;
  }
}

export type { ProgressSnapshot };
