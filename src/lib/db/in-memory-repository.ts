import usersSeed from "../../../data/seeds/users.json";
import type { User } from "../../contracts";
import { userSchema } from "../../contracts";
import type { AuthProfileInput, Repository } from "./repository";

type Store = {
  users: User[];
};

export class InMemoryRepository implements Repository {
  private store: Store;

  constructor(seed?: Partial<Store>) {
    this.store = {
      users: seed?.users ?? usersSeed.map((entry) => userSchema.parse(entry))
    };
  }

  async ensureUserProfile(profile: AuthProfileInput): Promise<User> {
    const existingIndex = this.store.users.findIndex((user) => user.id === profile.id);
    const existing = existingIndex >= 0 ? this.store.users[existingIndex] : undefined;

    if (existing) {
      const updated = { ...existing, email: profile.email, name: profile.name };
      this.store.users[existingIndex] = updated;
      return updated;
    }

    const legacyEmailIndex = this.store.users.findIndex(
      (user) => user.email.toLowerCase() === profile.email.toLowerCase()
    );
    const legacyEmailMatch = legacyEmailIndex >= 0 ? this.store.users[legacyEmailIndex] : undefined;

    if (legacyEmailMatch) {
      const legacyId = legacyEmailMatch.id;
      this.store.users = this.store.users.map((user) =>
        user.facilitator_id === legacyId ? { ...user, facilitator_id: profile.id } : user
      );

      const merged = userSchema.parse({
        ...legacyEmailMatch,
        id: profile.id,
        email: profile.email,
        name: profile.name
      });
      this.store.users[legacyEmailIndex] = merged;
      return merged;
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

  async getUser(userId: string): Promise<User | undefined> {
    return this.store.users.find((user) => user.id === userId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.store.users.find((user) => user.email === email);
  }
}
