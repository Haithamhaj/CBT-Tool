import { notFound } from "next/navigation";
import { requireCurrentSessionUser } from "../../src/lib/app/runtime-auth";
import { getAdminDashboardData } from "../../src/lib/app/admin-dashboard";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-GB");
}

export default async function AdminPage() {
  const currentUser = await requireCurrentSessionUser();

  if (currentUser.role !== "facilitator") {
    notFound();
  }

  let data;
  let error: string | null = null;

  try {
    data = await getAdminDashboardData();
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Unable to load admin data.";
  }

  return (
    <div className="page">
      <div className="stack">
        <section className="panel stack">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ marginBottom: 8 }}>Admin Overview</h1>
              <p className="muted" style={{ margin: 0 }}>
                Read-only visibility into the remaining database records and legacy training data.
              </p>
            </div>
            <span className="badge authority-badge">Facilitator only</span>
          </div>
        </section>

        {error ? (
          <section className="panel stack">
            <h2 style={{ marginBottom: 0 }}>Database unavailable</h2>
            <p className="muted" style={{ margin: 0 }}>
              {error}
            </p>
          </section>
        ) : null}

        {data ? (
          <>
            <section className="reference-card-grid">
              {data.counts.map((item) => (
                <article key={item.table} className="reference-card">
                  <strong>{item.table}</strong>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{item.count}</div>
                </article>
              ))}
            </section>

            <section className="panel stack">
              <h2 style={{ marginBottom: 0 }}>Recent users</h2>
              <div className="worksheet-table-wrap">
                <table className="worksheet-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Level</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.name}</td>
                        <td>{user.role}</td>
                        <td>{user.level}</td>
                        <td>{formatDate(user.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel stack">
              <h2 style={{ marginBottom: 0 }}>Recent sessions</h2>
              <div className="worksheet-table-wrap">
                <table className="worksheet-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Case</th>
                      <th>State</th>
                      <th>Stage</th>
                      <th>Tool</th>
                      <th>Goal</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentSessions.map((session) => (
                      <tr key={session.id}>
                        <td>{session.user_email}</td>
                        <td>{session.case_title}</td>
                        <td>{session.state}</td>
                        <td>{session.stage}</td>
                        <td>{session.selected_tool}</td>
                        <td>{session.session_goal || "—"}</td>
                        <td>{formatDate(session.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="reference-card-grid">
              <article className="panel stack">
                <h2 style={{ marginBottom: 0 }}>Recent attempts</h2>
                <div className="worksheet-table-wrap">
                  <table className="worksheet-table">
                    <thead>
                      <tr>
                        <th>Session</th>
                        <th>Revision</th>
                        <th>Step</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentAttempts.map((attempt) => (
                        <tr key={attempt.id}>
                          <td>{attempt.session_id}</td>
                          <td>{attempt.revision_number}</td>
                          <td>{attempt.step_name}</td>
                          <td>{formatDate(attempt.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="panel stack">
                <h2 style={{ marginBottom: 0 }}>Recent drift events</h2>
                <div className="worksheet-table-wrap">
                  <table className="worksheet-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Mode</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentDrifts.map((drift) => (
                        <tr key={drift.id}>
                          <td>{drift.name}</td>
                          <td>{drift.severity}</td>
                          <td>{drift.status}</td>
                          <td>{drift.detection_mode}</td>
                          <td>{formatDate(drift.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>

            <section className="panel stack">
              <h2 style={{ marginBottom: 0 }}>Recent progress snapshots</h2>
              <div className="worksheet-table-wrap">
                <table className="worksheet-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Date</th>
                      <th>Average score</th>
                      <th>Top drift</th>
                      <th>Weakest skill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentProgress.map((snapshot) => (
                      <tr key={snapshot.id}>
                        <td>{snapshot.user_email}</td>
                        <td>{snapshot.date}</td>
                        <td>{snapshot.avg_score}</td>
                        <td>{snapshot.top_drift}</td>
                        <td>{snapshot.weakest_skill}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
