import type { Difficulty, User, UserRole } from "../../contracts";

export type AuthUserPayload = {
  id: string;
  email: string;
  raw_user_meta_data?: Record<string, unknown> | null;
};

function deriveRole(input: unknown): UserRole {
  return input === "facilitator" || input === "trainee" ? input : "trainee";
}

function deriveLevel(input: unknown): Difficulty {
  return input === "beginner" || input === "intermediate" || input === "advanced"
    ? input
    : "beginner";
}

export function derivePublicUserFromAuth(authUser: AuthUserPayload): User {
  const metadata = authUser.raw_user_meta_data ?? {};
  const name =
    typeof metadata.name === "string" && metadata.name.trim().length > 0
      ? metadata.name
      : authUser.email.split("@")[0];

  return {
    id: authUser.id,
    email: authUser.email,
    name,
    role: deriveRole(metadata.role),
    level: deriveLevel(metadata.level),
    facilitator_id: typeof metadata.facilitator_id === "string" ? metadata.facilitator_id : null
  };
}

export function isPublicUserSynced(authUser: AuthUserPayload, publicUser: User): boolean {
  return (
    authUser.id === publicUser.id &&
    authUser.email === publicUser.email
  );
}
