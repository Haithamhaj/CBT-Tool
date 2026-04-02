import { derivePublicUserFromAuth, isPublicUserSynced } from "../src/lib/auth/user-mapping";

describe("auth and user mapping", () => {
  it("derives a public user row from auth metadata", () => {
    const derived = derivePublicUserFromAuth({
      id: "44444444-4444-4444-4444-444444444444",
      email: "new.user@example.com",
      raw_user_meta_data: {
        name: "New User",
        role: "facilitator",
        level: "advanced",
        facilitator_id: "11111111-1111-1111-1111-111111111111"
      }
    });

    expect(derived.id).toBe("44444444-4444-4444-4444-444444444444");
    expect(derived.role).toBe("facilitator");
    expect(derived.level).toBe("advanced");
  });

  it("falls back to safe defaults for invalid metadata", () => {
    const derived = derivePublicUserFromAuth({
      id: "55555555-5555-5555-5555-555555555555",
      email: "fallback.user@example.com",
      raw_user_meta_data: {
        role: "admin",
        level: "expert"
      }
    });

    expect(derived.name).toBe("fallback.user");
    expect(derived.role).toBe("trainee");
    expect(derived.level).toBe("beginner");
  });

  it("checks auth/public identity sync by id and email", () => {
    const authUser = {
      id: "22222222-2222-2222-2222-222222222222",
      email: "trainee.one@example.com"
    };

    expect(
      isPublicUserSynced(authUser, {
        id: "22222222-2222-2222-2222-222222222222",
        email: "trainee.one@example.com",
        name: "Trainee One",
        role: "trainee",
        level: "beginner",
        facilitator_id: "11111111-1111-1111-1111-111111111111"
      })
    ).toBe(true);
  });
});
