import type { User } from "../../contracts";
import type { AuthProfileInput, Repository } from "./repository";

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

  ensureUserProfile(profile: AuthProfileInput): Promise<User> {
    return this.run("ensureUserProfile", () => this.primary.ensureUserProfile(profile), () => this.fallback.ensureUserProfile(profile));
  }

  getUser(userId: string): Promise<User | undefined> {
    return this.run("getUser", () => this.primary.getUser(userId), () => this.fallback.getUser(userId));
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.run("getUserByEmail", () => this.primary.getUserByEmail(email), () => this.fallback.getUserByEmail(email));
  }
}

export { isConnectivityError };
