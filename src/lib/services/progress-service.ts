import type { ProgressRetrievalRequest, User } from "../../contracts";
import type { Repository } from "../db/repository";

function authorizeProgressAccess(actor: User, targetUserId: string) {
  if (actor.id === targetUserId) {
    return;
  }

  if (actor.role === "facilitator") {
    return;
  }

  throw new Error("Forbidden");
}

export class ProgressService {
  constructor(private readonly repo: Repository) {}

  async getProgress(request: ProgressRetrievalRequest) {
    const actor = await this.repo.getUser(request.actor_user_id);
    if (!actor) {
      throw new Error("Actor user not found");
    }

    const target = await this.repo.getUser(request.user_id);
    if (!target) {
      throw new Error("Target user not found");
    }

    authorizeProgressAccess(actor, request.user_id);

    if (actor.role === "facilitator" && target.facilitator_id !== actor.id) {
      throw new Error("Forbidden");
    }

    const persisted = await this.repo.listProgressSnapshotsByUser(request.user_id);
    const sessions = await this.repo.listSessionsByUser(request.user_id);
    const recentSessions = await Promise.all(
      sessions
        .slice()
        .sort((left, right) => right.created_at.localeCompare(left.created_at))
        .slice(0, 5)
        .map(async (session) => ({
          id: session.id,
          case_id: session.case_id,
          state: session.state,
          stage: session.stage,
          selected_tool: session.selected_tool,
          created_at: session.created_at,
          score: await this.repo.latestScoreForSession(session.id)
        }))
    );

    const driftCounts = new Map<string, number>();
    for (const session of sessions) {
      const drifts = await this.repo.listDriftEventsBySession(session.id);
      for (const drift of drifts) {
        driftCounts.set(drift.drift_id, (driftCounts.get(drift.drift_id) ?? 0) + 1);
      }
    }

    const repeatedDrifts = [...driftCounts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([drift_id, count]) => ({ drift_id, count }));

    if (persisted.length > 0) {
      const latestSnapshot = persisted[0];
      return {
        user_id: request.user_id,
        snapshots: persisted,
        average_score: latestSnapshot.avg_score,
        recent_sessions: recentSessions,
        repeated_drift_patterns: repeatedDrifts,
        recommended_next_practice_area:
          recentSessions[0]?.score?.recommended_next_practice_area ??
          "Complete another guided practice session to generate recommendations."
      };
    }

    const scoredSessions = (
      await Promise.all(
        (await this.repo.listSessionsByUser(request.user_id)).map((session) =>
          this.repo.latestScoreForSession(session.id)
        )
      )
    ).filter((score): score is NonNullable<typeof score> => score !== null);

    const average =
      scoredSessions.length === 0
        ? 0
        : Math.round(scoredSessions.reduce((sum, score) => sum + score.adjusted_score, 0) / scoredSessions.length);

    return {
      user_id: request.user_id,
      snapshots: [],
      average_score: average,
      recent_sessions: recentSessions,
      repeated_drift_patterns: repeatedDrifts,
      recommended_next_practice_area:
        scoredSessions[0]?.recommended_next_practice_area ??
        "Complete a scored session to unlock recommendations.",
      derived_summary: {
        avg_score: average,
        top_drift: "none",
        strongest_skill: scoredSessions[0]?.priority_skill ?? "none",
        weakest_skill: scoredSessions[0]?.priority_skill ?? "none"
      }
    };
  }
}
