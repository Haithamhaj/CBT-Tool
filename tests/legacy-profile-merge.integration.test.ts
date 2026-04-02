import { describe, expect, it } from "vitest";
import { createTestDb } from "./helpers/postgres-test-db";

describe("legacy profile merge", () => {
  it("reuses a legacy email row, migrates session references, and preserves role/level", async () => {
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

    await pool.query(
      `insert into sessions (
        id, user_id, case_id, state, current_step, stage, selected_tool,
        session_goal, revision_count, started_at, finished_at
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        "99999999-9999-4999-8999-999999999999",
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "B001",
        "review_pending",
        "summary_and_homework",
        "core_tools",
        "thought_record",
        "Preserve facilitator history",
        0,
        null,
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

    const sessionRows = await pool.query(
      `select user_id from sessions where id = $1`,
      ["99999999-9999-4999-8999-999999999999"]
    );

    expect(sessionRows.rows[0]?.user_id).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
  });
});
