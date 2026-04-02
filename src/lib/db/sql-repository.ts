import type { QueryResult } from "pg";
import type {
  Attempt,
  Case,
  DriftEvent,
  ScoreOutput,
  Session,
  User
} from "../../contracts";
import {
  attemptSchema,
  caseSchema,
  driftEventSchema,
  scoreOutputSchema,
  sessionSchema,
  userSchema
} from "../../contracts";
import type {
  AuthProfileInput,
  NewAttempt,
  NewDriftEvent,
  NewProgressSnapshot,
  NewSession,
  ProgressSnapshot,
  Repository
} from "./repository";

type Queryable = {
  query: (sql: string, params?: unknown[]) => Promise<QueryResult>;
};

function randomId(): string {
  return crypto.randomUUID();
}

function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function iso(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function mapSession(row: Record<string, unknown>): Session {
  return sessionSchema.parse({
    ...row,
    current_step: row.current_step ?? null,
    started_at: iso(row.started_at),
    finished_at: iso(row.finished_at),
    last_activity_at: iso(row.last_activity_at),
    created_at: iso(row.created_at),
    updated_at: iso(row.updated_at)
  });
}

function mapAttempt(row: Record<string, unknown>): Attempt {
  return attemptSchema.parse({
    ...row,
    input_payload: plain(row.input_payload),
    validation_output: plain(row.validation_output),
    evaluator_outputs: plain(row.evaluator_outputs),
    score_snapshot: row.score_snapshot ? plain(row.score_snapshot) : null,
    created_at: iso(row.created_at)
  });
}

function mapDriftEvent(row: Record<string, unknown>): DriftEvent {
  return driftEventSchema.parse({
    ...row,
    created_at: iso(row.created_at),
    corrected_at: iso(row.corrected_at)
  });
}

function mapCase(row: Record<string, unknown>): Case {
  return caseSchema.parse({
    ...row,
    trigger_events: plain(row.trigger_events),
    sample_thoughts: plain(row.sample_thoughts),
    sample_emotions: plain(row.sample_emotions),
    sample_behaviors: plain(row.sample_behaviors),
    hidden_beliefs: plain(row.hidden_beliefs),
    recommended_tools: plain(row.recommended_tools),
    expected_drifts: plain(row.expected_drifts),
    stage_suitability: plain(row.stage_suitability)
  });
}

function mapUser(row: Record<string, unknown>): User {
  return userSchema.parse({
    ...row,
    facilitator_id: row.facilitator_id ?? null
  });
}

function mapProgress(row: Record<string, unknown>): ProgressSnapshot {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    date: String(row.date),
    avg_score: Number(row.avg_score),
    top_drift: String(row.top_drift),
    strongest_skill: String(row.strongest_skill),
    weakest_skill: String(row.weakest_skill)
  };
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

  async createSession(input: NewSession): Promise<Session> {
    const id = randomId();
    const result = await this.db.query(
      `insert into sessions (
        id, user_id, case_id, state, current_step, stage, selected_tool,
        session_goal, revision_count, started_at, finished_at
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      returning *`,
      [
        id,
        input.user_id,
        input.case_id,
        input.state,
        input.current_step,
        input.stage,
        input.selected_tool,
        input.session_goal,
        input.revision_count,
        input.started_at,
        input.finished_at
      ]
    );
    return mapSession(result.rows[0] as Record<string, unknown>);
  }

  async updateSession(session: Session): Promise<Session> {
    const result = await this.db.query(
      `update sessions
      set state = $2,
          current_step = $3,
          stage = $4,
          selected_tool = $5,
          session_goal = $6,
          revision_count = $7,
          started_at = $8,
          finished_at = $9,
          updated_at = current_timestamp,
          last_activity_at = current_timestamp
      where id = $1
      returning *`,
      [
        session.id,
        session.state,
        session.current_step,
        session.stage,
        session.selected_tool,
        session.session_goal,
        session.revision_count,
        session.started_at,
        session.finished_at
      ]
    );

    if (result.rows.length === 0) {
      throw new Error("Session not found");
    }

    return mapSession(result.rows[0] as Record<string, unknown>);
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const result = await this.db.query(`select * from sessions where id = $1`, [sessionId]);
    return result.rows[0] ? mapSession(result.rows[0] as Record<string, unknown>) : undefined;
  }

  async getCase(caseId: string): Promise<Case | undefined> {
    const result = await this.db.query(`select * from cases where id = $1`, [caseId]);
    return result.rows[0] ? mapCase(result.rows[0] as Record<string, unknown>) : undefined;
  }

  async getUser(userId: string): Promise<User | undefined> {
    const result = await this.db.query(`select * from users where id = $1`, [userId]);
    return result.rows[0] ? mapUser(result.rows[0] as Record<string, unknown>) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.query(`select * from users where email = $1`, [email]);
    return result.rows[0] ? mapUser(result.rows[0] as Record<string, unknown>) : undefined;
  }

  async listSessionsByUser(userId: string): Promise<Session[]> {
    const result = await this.db.query(
      `select * from sessions where user_id = $1 order by created_at asc`,
      [userId]
    );
    return result.rows.map((row) => mapSession(row as Record<string, unknown>));
  }

  async createAttempt(input: NewAttempt): Promise<Attempt> {
    const id = randomId();
    const result = await this.db.query(
      `insert into attempts (
        id, session_id, revision_number, step_name, input_payload, validation_output, evaluator_outputs, score_snapshot
      ) values ($1,$2,$3,$4,$5,$6,$7,$8)
      returning *`,
      [
        id,
        input.session_id,
        input.revision_number,
        input.step_name,
        JSON.stringify(input.input_payload),
        JSON.stringify(input.validation_output),
        JSON.stringify(input.evaluator_outputs),
        input.score_snapshot ? JSON.stringify(input.score_snapshot) : null
      ]
    );
    return mapAttempt(result.rows[0] as Record<string, unknown>);
  }

  async updateAttempt(attempt: Attempt): Promise<Attempt> {
    const result = await this.db.query(
      `update attempts
      set revision_number = $2,
          step_name = $3,
          input_payload = $4,
          validation_output = $5,
          evaluator_outputs = $6,
          score_snapshot = $7
      where id = $1
      returning *`,
      [
        attempt.id,
        attempt.revision_number,
        attempt.step_name,
        JSON.stringify(attempt.input_payload),
        JSON.stringify(attempt.validation_output),
        JSON.stringify(attempt.evaluator_outputs),
        attempt.score_snapshot ? JSON.stringify(attempt.score_snapshot) : null
      ]
    );
    return mapAttempt(result.rows[0] as Record<string, unknown>);
  }

  async listAttemptsBySession(sessionId: string): Promise<Attempt[]> {
    const result = await this.db.query(
      `select * from attempts where session_id = $1 order by created_at asc`,
      [sessionId]
    );
    return result.rows.map((row) => mapAttempt(row as Record<string, unknown>));
  }

  async createDriftEvents(
    sessionId: string,
    attemptId: string,
    drifts: NewDriftEvent[]
  ): Promise<DriftEvent[]> {
    const created: DriftEvent[] = [];
    for (const drift of drifts) {
      const id = randomId();
      const result = await this.db.query(
        `insert into drift_events (
          id, session_id, attempt_id, drift_id, name, description,
          detection_mode, severity, status, message, corrective_action, corrected_at
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,'open',$9,$10,null)
        returning *`,
        [
          id,
          sessionId,
          attemptId,
          drift.drift_id,
          drift.name,
          drift.description,
          drift.detection_mode,
          drift.severity,
          drift.message,
          drift.corrective_action
        ]
      );
      created.push(mapDriftEvent(result.rows[0] as Record<string, unknown>));
    }
    return created;
  }

  async listDriftEventsBySession(sessionId: string): Promise<DriftEvent[]> {
    const result = await this.db.query(
      `select * from drift_events where session_id = $1 order by created_at asc`,
      [sessionId]
    );
    return result.rows.map((row) => mapDriftEvent(row as Record<string, unknown>));
  }

  async addProgressSnapshot(snapshot: NewProgressSnapshot): Promise<ProgressSnapshot> {
    const id = randomId();
    const result = await this.db.query(
      `insert into progress_snapshots (
        id, user_id, date, avg_score, top_drift, strongest_skill, weakest_skill
      ) values ($1,$2,$3,$4,$5,$6,$7)
      returning *`,
      [
        id,
        snapshot.user_id,
        snapshot.date,
        snapshot.avg_score,
        snapshot.top_drift,
        snapshot.strongest_skill,
        snapshot.weakest_skill
      ]
    );
    return mapProgress(result.rows[0] as Record<string, unknown>);
  }

  async listProgressSnapshotsByUser(userId: string): Promise<ProgressSnapshot[]> {
    const result = await this.db.query(
      `select * from progress_snapshots where user_id = $1 order by date desc, created_at desc`,
      [userId]
    );
    return result.rows.map((row) => mapProgress(row as Record<string, unknown>));
  }

  async latestScoreForSession(sessionId: string): Promise<ScoreOutput | null> {
    const result = await this.db.query(
      `select score_snapshot from attempts
      where session_id = $1 and score_snapshot is not null
      order by created_at desc
      limit 1`,
      [sessionId]
    );

    if (!result.rows[0]) {
      return null;
    }

    return scoreOutputSchema.parse(plain((result.rows[0] as Record<string, unknown>).score_snapshot));
  }
}
