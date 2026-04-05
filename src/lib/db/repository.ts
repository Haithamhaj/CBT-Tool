import type { User } from "../../contracts";

export type AuthProfileInput = {
  id: string;
  email: string;
  name: string;
};

export interface Repository {
  ensureUserProfile(profile: AuthProfileInput): Promise<User>;
  getUser(userId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
}
