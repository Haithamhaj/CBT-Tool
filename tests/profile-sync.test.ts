import { describe, expect, it } from "vitest";
import { InMemoryRepository } from "../src/lib/db/in-memory-repository";

describe("auth profile sync", () => {
  it("creates a trainee profile when a new auth user appears", async () => {
    const repo = new InMemoryRepository();

    const user = await repo.ensureUserProfile({
      id: "44444444-4444-4444-4444-444444444444",
      email: "new.user@example.com",
      name: "new.user"
    });

    expect(user.role).toBe("trainee");
    expect(user.level).toBe("beginner");
    expect(user.email).toBe("new.user@example.com");
  });

  it("keeps role and level when an existing profile syncs again", async () => {
    const repo = new InMemoryRepository();

    const user = await repo.ensureUserProfile({
      id: "22222222-2222-2222-2222-222222222222",
      email: "trainee.one+updated@example.com",
      name: "updated-name"
    });

    expect(user.role).toBe("trainee");
    expect(user.level).toBe("beginner");
    expect(user.email).toBe("trainee.one+updated@example.com");
    expect(user.name).toBe("updated-name");
  });

  it("merges a legacy email match by updating the id and preserving facilitator data", async () => {
    const repo = new InMemoryRepository({
      users: [
        {
          id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          email: "haitham.haj@gmail.com",
          name: "Haitham Legacy",
          role: "facilitator",
          level: "advanced",
          facilitator_id: null
        }
      ],
      sessions: [
        {
          id: "99999999-9999-4999-8999-999999999999",
          user_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          case_id: "case_beginner_sleep_deadlines",
          state: "review_pending",
          current_step: "summary_and_homework",
          stage: "core_tools",
          selected_tool: "thought_record",
          session_goal: "Preserve facilitator history",
          revision_count: 0,
          started_at: null,
          finished_at: null,
          last_activity_at: "2026-04-02T00:00:00.000Z",
          created_at: "2026-04-02T00:00:00.000Z",
          updated_at: "2026-04-02T00:00:00.000Z"
        }
      ]
    });

    const user = await repo.ensureUserProfile({
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      email: "haitham.haj@gmail.com",
      name: "Haitham Haj"
    });

    expect(user.id).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    expect(user.email).toBe("haitham.haj@gmail.com");
    expect(user.name).toBe("Haitham Haj");
    expect(user.role).toBe("facilitator");
    expect(user.level).toBe("advanced");
    expect(user.facilitator_id).toBeNull();

    const session = await repo.getSession("99999999-9999-4999-8999-999999999999");
    expect(session?.user_id).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
  });
});
