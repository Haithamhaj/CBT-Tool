import type { Repository } from "../db/repository";

export class SessionQueryService {
  constructor(private readonly repo: Repository) {}

  async getSessionView(sessionId: string, actorUserId: string) {
    const session = await this.repo.getSession(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    if (session.user_id !== actorUserId) {
      throw new Error("Forbidden");
    }

    const caseRecord = await this.repo.getCase(session.case_id);
    const attempts = await this.repo.listAttemptsBySession(sessionId);
    const driftEvents = await this.repo.listDriftEventsBySession(sessionId);

    return {
      session,
      case: caseRecord ?? null,
      attempts,
      drift_events: driftEvents,
      latest_score: await this.repo.latestScoreForSession(sessionId)
    };
  }

  async listRecentSessions(actorUserId: string) {
    const sessions = await this.repo.listSessionsByUser(actorUserId);
    const ordered = sessions
      .slice()
      .sort((left, right) => right.created_at.localeCompare(left.created_at));

    return Promise.all(
      ordered.map(async (session) => ({
        session,
        latest_score: await this.repo.latestScoreForSession(session.id)
      }))
    );
  }
}
