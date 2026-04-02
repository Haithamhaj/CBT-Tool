import type {
  Attempt,
  Case,
  DriftEvent,
  ScoreOutput,
  Session,
  User
} from "../../contracts";
import type {
  NewAttempt,
  NewDriftEvent,
  NewProgressSnapshot,
  NewSession,
  ProgressSnapshot,
  Repository
} from "./repository";

function isConnectivityError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  const message = error.message.toLowerCase();

  return (
    code === "ENOTFOUND" ||
    code === "ECONNREFUSED" ||
    code === "EAI_AGAIN" ||
    message.includes("getaddrinfo") ||
    message.includes("connect econnrefused") ||
    message.includes("connection terminated unexpectedly")
  );
}

export class ResilientRepository implements Repository {
  private fallbackActive = false;

  constructor(
    private readonly primary: Repository,
    private readonly fallback: Repository
  ) {}

  private async run<T>(operationName: string, primaryCall: () => Promise<T>, fallbackCall: () => Promise<T>) {
    if (this.fallbackActive) {
      return fallbackCall();
    }

    try {
      return await primaryCall();
    } catch (error) {
      if (!isConnectivityError(error)) {
        throw error;
      }

      this.fallbackActive = true;
      console.warn(`[repository.fallback] ${operationName} switched to in-memory fallback`, error);
      return fallbackCall();
    }
  }

  createSession(input: NewSession): Promise<Session> {
    return this.run("createSession", () => this.primary.createSession(input), () => this.fallback.createSession(input));
  }

  updateSession(session: Session): Promise<Session> {
    return this.run("updateSession", () => this.primary.updateSession(session), () => this.fallback.updateSession(session));
  }

  getSession(sessionId: string): Promise<Session | undefined> {
    return this.run("getSession", () => this.primary.getSession(sessionId), () => this.fallback.getSession(sessionId));
  }

  getCase(caseId: string): Promise<Case | undefined> {
    return this.run("getCase", () => this.primary.getCase(caseId), () => this.fallback.getCase(caseId));
  }

  getUser(userId: string): Promise<User | undefined> {
    return this.run("getUser", () => this.primary.getUser(userId), () => this.fallback.getUser(userId));
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.run("getUserByEmail", () => this.primary.getUserByEmail(email), () => this.fallback.getUserByEmail(email));
  }

  listSessionsByUser(userId: string): Promise<Session[]> {
    return this.run("listSessionsByUser", () => this.primary.listSessionsByUser(userId), () => this.fallback.listSessionsByUser(userId));
  }

  createAttempt(input: NewAttempt): Promise<Attempt> {
    return this.run("createAttempt", () => this.primary.createAttempt(input), () => this.fallback.createAttempt(input));
  }

  updateAttempt(attempt: Attempt): Promise<Attempt> {
    return this.run("updateAttempt", () => this.primary.updateAttempt(attempt), () => this.fallback.updateAttempt(attempt));
  }

  listAttemptsBySession(sessionId: string): Promise<Attempt[]> {
    return this.run("listAttemptsBySession", () => this.primary.listAttemptsBySession(sessionId), () => this.fallback.listAttemptsBySession(sessionId));
  }

  createDriftEvents(sessionId: string, attemptId: string, drifts: NewDriftEvent[]): Promise<DriftEvent[]> {
    return this.run(
      "createDriftEvents",
      () => this.primary.createDriftEvents(sessionId, attemptId, drifts),
      () => this.fallback.createDriftEvents(sessionId, attemptId, drifts)
    );
  }

  listDriftEventsBySession(sessionId: string): Promise<DriftEvent[]> {
    return this.run(
      "listDriftEventsBySession",
      () => this.primary.listDriftEventsBySession(sessionId),
      () => this.fallback.listDriftEventsBySession(sessionId)
    );
  }

  addProgressSnapshot(snapshot: NewProgressSnapshot): Promise<ProgressSnapshot> {
    return this.run(
      "addProgressSnapshot",
      () => this.primary.addProgressSnapshot(snapshot),
      () => this.fallback.addProgressSnapshot(snapshot)
    );
  }

  listProgressSnapshotsByUser(userId: string): Promise<ProgressSnapshot[]> {
    return this.run(
      "listProgressSnapshotsByUser",
      () => this.primary.listProgressSnapshotsByUser(userId),
      () => this.fallback.listProgressSnapshotsByUser(userId)
    );
  }

  latestScoreForSession(sessionId: string): Promise<ScoreOutput | null> {
    return this.run(
      "latestScoreForSession",
      () => this.primary.latestScoreForSession(sessionId),
      () => this.fallback.latestScoreForSession(sessionId)
    );
  }
}

export { isConnectivityError };
