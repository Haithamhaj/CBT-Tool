import fs from "node:fs";
import path from "node:path";

describe("RLS policy migration", () => {
  it("defines owner-only access to sessions, attempts, and drift events", () => {
    const sql = fs.readFileSync(
      path.join(process.cwd(), "supabase/migrations/202604010002_rls_policies.sql"),
      "utf8"
    );

    expect(sql).toContain('create policy "sessions_owner_only"');
    expect(sql).toContain('create policy "attempts_owner_only"');
    expect(sql).toContain('create policy "drift_events_owner_only"');
    expect(sql).toContain("user_id = auth.uid()");
  });

  it("defines facilitator access only for assigned progress and user rows", () => {
    const sql = fs.readFileSync(
      path.join(process.cwd(), "supabase/migrations/202604010002_rls_policies.sql"),
      "utf8"
    );

    expect(sql).toContain("create or replace function public.is_assigned_facilitator");
    expect(sql).toContain('create policy "progress_owner_or_assigned_facilitator"');
    expect(sql).toContain('create policy "users_select_self_or_assigned"');
  });
});
