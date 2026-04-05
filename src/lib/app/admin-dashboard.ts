import { Pool } from "pg";
import { requireDatabaseUrl } from "./runtime-env";

declare global {
  // eslint-disable-next-line no-var
  var __cbt_admin_pool__: Pool | undefined;
}

type TableCount = {
  table: string;
  count: number;
};

type RecentUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  level: string;
  updated_at: string | null;
};

type RecentSession = {
  id: string;
  user_email: string;
  case_title: string;
  state: string;
  stage: string;
  selected_tool: string;
  session_goal: string;
  updated_at: string;
};

type RecentAttempt = {
  id: string;
  session_id: string;
  revision_number: number;
  step_name: string;
  created_at: string;
};

type RecentDrift = {
  id: string;
  session_id: string;
  name: string;
  severity: string;
  status: string;
  detection_mode: string;
  created_at: string;
};

type RecentProgress = {
  id: string;
  user_email: string;
  date: string;
  avg_score: number;
  top_drift: string;
  weakest_skill: string;
};

export type AdminDashboardData = {
  counts: TableCount[];
  recentUsers: RecentUser[];
  recentSessions: RecentSession[];
  recentAttempts: RecentAttempt[];
  recentDrifts: RecentDrift[];
  recentProgress: RecentProgress[];
};

function getAdminPool() {
  if (!globalThis.__cbt_admin_pool__) {
    globalThis.__cbt_admin_pool__ = new Pool({
      connectionString: requireDatabaseUrl()
    });
  }

  return globalThis.__cbt_admin_pool__;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const pool = getAdminPool();
  const tables = ["users", "cases", "sessions", "attempts", "drift_events", "progress_snapshots"];

  const countResults = await Promise.all(
    tables.map(async (table) => {
      const result = await pool.query(`select count(*)::int as count from ${table}`);
      return {
        table,
        count: Number(result.rows[0]?.count ?? 0)
      };
    })
  );

  const [recentUsers, recentSessions, recentAttempts, recentDrifts, recentProgress] = await Promise.all([
    pool.query<RecentUser>(
      `select id::text, email, name, role, level, updated_at::text
       from users
       order by updated_at desc nulls last, created_at desc nulls last
       limit 20`
    ),
    pool.query<RecentSession>(
      `select
         s.id::text,
         u.email as user_email,
         c.title as case_title,
         s.state,
         s.stage,
         s.selected_tool,
         s.session_goal,
         s.updated_at::text
       from sessions s
       join users u on u.id = s.user_id
       join cases c on c.id = s.case_id
       order by s.updated_at desc
       limit 20`
    ),
    pool.query<RecentAttempt>(
      `select id::text, session_id::text, revision_number, step_name, created_at::text
       from attempts
       order by created_at desc
       limit 20`
    ),
    pool.query<RecentDrift>(
      `select id::text, session_id::text, name, severity, status, detection_mode, created_at::text
       from drift_events
       order by created_at desc
       limit 20`
    ),
    pool.query<RecentProgress>(
      `select
         p.id::text,
         u.email as user_email,
         p.date::text,
         p.avg_score,
         p.top_drift,
         p.weakest_skill
       from progress_snapshots p
       join users u on u.id = p.user_id
       order by p.date desc, p.created_at desc
       limit 20`
    )
  ]);

  return {
    counts: countResults,
    recentUsers: recentUsers.rows,
    recentSessions: recentSessions.rows,
    recentAttempts: recentAttempts.rows,
    recentDrifts: recentDrifts.rows,
    recentProgress: recentProgress.rows
  };
}
