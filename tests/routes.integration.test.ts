import { createTestDb } from "./helpers/postgres-test-db";
import { practiceSetupRoute } from "../src/lib/routes/practice-setup";
import { sessionStartRoute } from "../src/lib/routes/session-start";

describe("route bindings integration", () => {
  it("validates and persists through request/response route handlers", async () => {
    const { repository, pool } = await createTestDb();

    const setupResponse = await practiceSetupRoute(
      new Request("http://localhost/practice-setup", {
        method: "POST",
        body: JSON.stringify({
          actor_user_id: "22222222-2222-2222-2222-222222222222",
          actor_role: "trainee",
          case_id: "B001",
          stage: "foundations",
          selected_tool: "thought_record",
          session_goal: "Identify the thought before the update begins.",
          rationale: "The stage and case both support thought record work."
        })
      }),
      repository
    );

    expect(setupResponse.status).toBe(200);
    const setupBody = (await setupResponse.json()) as { session: { id: string } | null };
    expect(setupBody.session).not.toBeNull();

    const startResponse = await sessionStartRoute(
      new Request("http://localhost/session-start", {
        method: "POST",
        body: JSON.stringify({
          actor_user_id: "22222222-2222-2222-2222-222222222222",
          actor_role: "trainee",
          session_id: setupBody.session?.id
        })
      }),
      repository
    );

    expect(startResponse.status).toBe(200);
    const startBody = (await startResponse.json()) as { state: string };
    expect(startBody.state).toBe("in_progress");

    await pool.end();
  });
});
