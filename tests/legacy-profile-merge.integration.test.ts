import { describe, expect, it } from "vitest";
import { createTestDb } from "./helpers/postgres-test-db";

describe("legacy profile merge", () => {
  it("reuses a legacy email row by updating its id and preserving role/level", async () => {
    const { pool, repository } = await createTestDb();

    await pool.query(
      `insert into users (id, email, name, role, level, facilitator_id)
       values ($1, $2, $3, $4, $5, $6)`,
      [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "haitham.haj@gmail.com",
        "Legacy Facilitator",
        "facilitator",
        "advanced",
        null
      ]
    );

    const user = await repository.ensureUserProfile({
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      email: "haitham.haj@gmail.com",
      name: "Haitham Haj"
    });

    expect(user.id).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    expect(user.email).toBe("haitham.haj@gmail.com");
    expect(user.name).toBe("Haitham Haj");
    expect(user.role).toBe("facilitator");
    expect(user.level).toBe("advanced");

    const rows = await pool.query(
      `select id, email, role, level, name from users where lower(email) = lower($1)`,
      ["haitham.haj@gmail.com"]
    );

    expect(rows.rowCount).toBe(1);
    expect(rows.rows[0]?.id).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    expect(rows.rows[0]?.role).toBe("facilitator");
    expect(rows.rows[0]?.level).toBe("advanced");
  });
});
