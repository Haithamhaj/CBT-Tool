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
    expect(user.name).toBe("Trainee One");
  });
});
