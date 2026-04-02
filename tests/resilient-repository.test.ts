import { describe, expect, it, vi } from "vitest";
import { InMemoryRepository } from "../src/lib/db/in-memory-repository";
import { ResilientRepository } from "../src/lib/db/resilient-repository";
import type { Repository } from "../src/lib/db/repository";

function connectivityError(message = "getaddrinfo ENOTFOUND db.example.supabase.co") {
  const error = new Error(message) as Error & { code: string };
  error.code = "ENOTFOUND";
  return error;
}

function createFailingRepository(): Repository {
  const fail = async () => {
    throw connectivityError();
  };

  return {
    createSession: fail,
    updateSession: fail,
    getSession: fail,
    getCase: fail,
    getUser: fail,
    getUserByEmail: fail,
    listSessionsByUser: fail,
    createAttempt: fail,
    updateAttempt: fail,
    listAttemptsBySession: fail,
    createDriftEvents: fail,
    listDriftEventsBySession: fail,
    addProgressSnapshot: fail,
    listProgressSnapshotsByUser: fail,
    latestScoreForSession: fail
  } as Repository;
}

describe("ResilientRepository", () => {
  it("falls back to in-memory users when connectivity fails", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const repo = new ResilientRepository(createFailingRepository(), new InMemoryRepository());

    const user = await repo.getUserByEmail("trainee.one@example.com");

    expect(user?.name).toBe("Trainee One");
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it("stays on fallback after the first connectivity failure", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const repo = new ResilientRepository(createFailingRepository(), new InMemoryRepository());

    await repo.getUserByEmail("trainee.one@example.com");
    const session = await repo.createSession({
      user_id: "22222222-2222-2222-2222-222222222222",
      case_id: "case-beginner-social-anxiety-1",
      state: "draft",
      current_step: "guided_input",
      stage: "foundations",
      selected_tool: "thought_record",
      session_goal: "",
      revision_count: 0,
      started_at: null,
      finished_at: null
    });

    expect(session.id).toMatch(/^session-/);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });
});
