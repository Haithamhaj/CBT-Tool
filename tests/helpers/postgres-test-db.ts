import { newDb } from "pg-mem";
import type { Pool } from "pg";
import cases from "../../data/seeds/cases.json";
import users from "../../data/seeds/users.json";
import { PostgresRepository } from "../../src/lib/db/postgres-repository";

export async function createTestDb() {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  const { Pool } = db.adapters.createPg();
  const pool: Pool = new Pool();

  await pool.query(`
    create table users (
      id text primary key,
      email text not null unique,
      name text not null,
      role text not null,
      level text not null,
      facilitator_id text null,
      created_at timestamptz not null default current_timestamp,
      updated_at timestamptz not null default current_timestamp
    );

    create table cases (
      id text primary key,
      title text not null,
      difficulty text not null,
      theme text not null,
      presenting_complaint text not null,
      trigger_events jsonb not null,
      sample_thoughts jsonb not null,
      sample_emotions jsonb not null,
      sample_behaviors jsonb not null,
      hidden_beliefs jsonb not null,
      recommended_tools jsonb not null,
      expected_drifts jsonb not null,
      homework_context_present boolean not null,
      stage_suitability jsonb not null,
      content_json jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default current_timestamp,
      updated_at timestamptz not null default current_timestamp
    );

    create table sessions (
      id text primary key,
      user_id text not null references users(id) on delete cascade,
      case_id text not null references cases(id) on delete restrict,
      state text not null,
      current_step text null,
      stage text not null,
      selected_tool text not null,
      session_goal text not null,
      revision_count integer not null,
      started_at timestamptz null,
      finished_at timestamptz null,
      last_activity_at timestamptz not null default current_timestamp,
      created_at timestamptz not null default current_timestamp,
      updated_at timestamptz not null default current_timestamp
    );

    create table attempts (
      id text primary key,
      session_id text not null references sessions(id) on delete cascade,
      revision_number integer not null,
      step_name text not null,
      input_payload jsonb not null,
      validation_output jsonb not null,
      evaluator_outputs jsonb not null,
      score_snapshot jsonb null,
      created_at timestamptz not null default current_timestamp
    );

    create table drift_events (
      id text primary key,
      session_id text not null references sessions(id) on delete cascade,
      attempt_id text not null references attempts(id) on delete cascade,
      drift_id text not null,
      name text not null,
      description text not null,
      detection_mode text not null,
      severity text not null,
      status text not null,
      message text not null,
      corrective_action text not null,
      created_at timestamptz not null default current_timestamp,
      corrected_at timestamptz null
    );

    create table progress_snapshots (
      id text primary key,
      user_id text not null references users(id) on delete cascade,
      date date not null,
      avg_score integer not null,
      top_drift text not null,
      strongest_skill text not null,
      weakest_skill text not null,
      created_at timestamptz not null default current_timestamp
    );
  `);

  for (const user of users) {
    await pool.query(
      `insert into users (id, email, name, role, level, facilitator_id)
       values ($1,$2,$3,$4,$5,$6)`,
      [user.id, user.email, user.name, user.role, user.level, user.facilitator_id]
    );
  }

  for (const caseRecord of cases) {
    await pool.query(
      `insert into cases (
        id, title, difficulty, theme, presenting_complaint,
        trigger_events, sample_thoughts, sample_emotions, sample_behaviors,
        hidden_beliefs, recommended_tools, expected_drifts,
        homework_context_present, stage_suitability, content_json
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        caseRecord.id,
        caseRecord.title,
        caseRecord.difficulty,
        caseRecord.theme,
        caseRecord.presenting_complaint,
        JSON.stringify(caseRecord.trigger_events),
        JSON.stringify(caseRecord.sample_thoughts),
        JSON.stringify(caseRecord.sample_emotions),
        JSON.stringify(caseRecord.sample_behaviors),
        JSON.stringify(caseRecord.hidden_beliefs),
        JSON.stringify(caseRecord.recommended_tools),
        JSON.stringify(caseRecord.expected_drifts),
        caseRecord.homework_context_present,
        JSON.stringify(caseRecord.stage_suitability),
        JSON.stringify(caseRecord)
      ]
    );
  }

  return {
    db,
    pool,
    repository: PostgresRepository.fromConnection(pool)
  };
}
