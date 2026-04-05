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
  });
});
