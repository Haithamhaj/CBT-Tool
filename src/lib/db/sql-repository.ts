import type { QueryResult } from "pg";
import type { User } from "../../contracts";
import { userSchema } from "../../contracts";
import type { AuthProfileInput, Repository } from "./repository";

type Queryable = {
  query: (sql: string, params?: unknown[]) => Promise<QueryResult>;
};

function mapUser(row: Record<string, unknown>): User {
  return userSchema.parse({
    ...row,
    facilitator_id: row.facilitator_id ?? null
  });
}

export class SqlRepository implements Repository {
  constructor(private readonly db: Queryable) {}

  async ensureUserProfile(profile: AuthProfileInput): Promise<User> {
    const legacyResult = await this.db.query(
      `select * from users where lower(email) = lower($1) and id <> $2 limit 1`,
      [profile.email, profile.id]
    );

    if (legacyResult.rows[0]) {
      const legacy = legacyResult.rows[0] as Record<string, unknown>;
      const legacyId = String(legacy.id);

      await this.db.query(
        `update users
            set email = concat('__legacy__', id::text, '__', email),
                updated_at = current_timestamp
          where id = $1`,
        [legacyId]
      );

      const inserted = await this.db.query(
        `insert into users (id, email, name, role, level, facilitator_id)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (id) do update
           set email = excluded.email,
               name = excluded.name,
               updated_at = current_timestamp
         returning *`,
        [
          profile.id,
          profile.email,
          profile.name,
          String(legacy.role),
          String(legacy.level),
          legacy.facilitator_id ?? null
        ]
      );

      await this.db.query(`update sessions set user_id = $1 where user_id = $2`, [profile.id, legacyId]);
      await this.db.query(`update progress_snapshots set user_id = $1 where user_id = $2`, [profile.id, legacyId]);
      await this.db.query(`update users set facilitator_id = $1 where facilitator_id = $2`, [profile.id, legacyId]);
      await this.db.query(`delete from users where id = $1`, [legacyId]);

      return mapUser(inserted.rows[0] as Record<string, unknown>);
    }

    const result = await this.db.query(
      `insert into users (id, email, name, role, level, facilitator_id)
       values ($1, $2, $3, 'trainee', 'beginner', null)
       on conflict (id) do update
         set email = excluded.email,
             name = excluded.name,
             updated_at = current_timestamp
       returning *`,
      [profile.id, profile.email, profile.name]
    );

    return mapUser(result.rows[0] as Record<string, unknown>);
  }

  async getUser(userId: string): Promise<User | undefined> {
    const result = await this.db.query(`select * from users where id = $1`, [userId]);
    return result.rows[0] ? mapUser(result.rows[0] as Record<string, unknown>) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.query(`select * from users where email = $1`, [email]);
    return result.rows[0] ? mapUser(result.rows[0] as Record<string, unknown>) : undefined;
  }
}
