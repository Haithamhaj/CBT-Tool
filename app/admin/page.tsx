import { notFound } from "next/navigation";
import { getAdminDashboardData } from "../../src/lib/app/admin-dashboard";
import { getAnalyticsDashboardData, getLectureInventoryData } from "../../src/lib/app/analytics-dashboard";
import { requireCurrentSessionUser } from "../../src/lib/app/runtime-auth";

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

  let legacyData;
  let analyticsData;
  let lectureInventory;
  let legacyError: string | null = null;
  let analyticsError: string | null = null;
  let lecturesError: string | null = null;

  try {
    legacyData = await getAdminDashboardData();
  } catch (cause) {
    legacyError = cause instanceof Error ? cause.message : "Unable to load legacy admin data.";
  }

  try {
    analyticsData = await getAnalyticsDashboardData();
  } catch (cause) {
    analyticsError = cause instanceof Error ? cause.message : "Unable to load analytics data.";
  }

  try {
    lectureInventory = await getLectureInventoryData();
  } catch (cause) {
    lecturesError = cause instanceof Error ? cause.message : "Unable to load lecture inventory.";
  }

  return (
    <div className="page">
      <div className="stack">
        <section className="panel stack">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ marginBottom: 8 }}>Admin Overview</h1>
              <p className="muted" style={{ margin: 0 }}>
                Read-only visibility into content coverage, visitor usage signals, and any remaining legacy database records.
              </p>
            </div>
            <span className="badge authority-badge">Facilitator only</span>
          </div>
        </section>

        {analyticsError ? (
          <section className="panel stack">
            <h2 style={{ marginBottom: 0 }}>Analytics unavailable</h2>
            <p className="muted" style={{ margin: 0 }}>
              {analyticsError}
            </p>
          </section>
        ) : null}

        {lecturesError ? (
          <section className="panel stack">
            <h2 style={{ marginBottom: 0 }}>Lecture inventory unavailable</h2>
            <p className="muted" style={{ margin: 0 }}>
              {lecturesError}
            </p>
          </section>
        ) : null}

        {analyticsData ? (
          <>
            <section className="panel stack">
              <div>
                <h2 style={{ marginBottom: 8 }}>Usage overview</h2>
                <p className="muted" style={{ margin: 0 }}>
                  Lightweight analytics from content page views plus lecture PDF and print interactions.
                </p>
              </div>
              <section className="reference-card-grid">
                <article className="reference-card">
                  <strong>Total visits (7d)</strong>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{analyticsData.usage.totalVisits7d}</div>
                </article>
                <article className="reference-card">
                  <strong>Unique visitors (7d)</strong>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{analyticsData.usage.uniqueVisitors7d}</div>
                </article>
                <article className="reference-card">
                  <strong>Lecture visits (7d)</strong>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{analyticsData.usage.lectureVisits7d}</div>
                </article>
                <article className="reference-card">
                  <strong>Reference visits (7d)</strong>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{analyticsData.usage.referenceVisits7d}</div>
                </article>
                <article className="reference-card">
                  <strong>PDF opens (7d)</strong>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{analyticsData.usage.pdfOpens7d}</div>
                </article>
              </section>
            </section>

            <section className="reference-card-grid">
              <article className="panel stack">
                <h2 style={{ marginBottom: 0 }}>Top pages</h2>
                <div className="worksheet-table-wrap">
                  <table className="worksheet-table">
                    <thead>
                      <tr>
                        <th>Route</th>
                        <th>Visits</th>
                        <th>Unique visitors</th>
                        <th>Last visit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topRoutes.length ? (
                        analyticsData.topRoutes.map((route) => (
                          <tr key={route.route}>
                            <td>{route.route}</td>
                            <td>{route.visits}</td>
                            <td>{route.unique_visitors}</td>
                            <td>{formatDate(route.last_visit)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>No analytics data yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="panel stack">
                <h2 style={{ marginBottom: 0 }}>Top lectures</h2>
                <div className="worksheet-table-wrap">
                  <table className="worksheet-table">
                    <thead>
                      <tr>
                        <th>Lecture</th>
                        <th>Views</th>
                        <th>PDF opens</th>
                        <th>Last visit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topLectures.length ? (
                        analyticsData.topLectures.map((lecture) => (
                          <tr key={lecture.lecture_slug}>
                            <td>{lecture.title}</td>
                            <td>{lecture.visits}</td>
                            <td>{lecture.pdf_opens}</td>
                            <td>{formatDate(lecture.last_visit)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>No lecture analytics yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          </>
        ) : null}

        {lectureInventory ? (
          <>
            <section className="panel stack">
              <div>
                <h2 style={{ marginBottom: 8 }}>Lectures inventory</h2>
                <p className="muted" style={{ margin: 0 }}>
                  Current lecture corpus coverage and how much structured support exists around the primary text.
                </p>
              </div>
              <section className="reference-card-grid">
                <article className="reference-card">
                  <strong>Published lectures</strong>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{lectureInventory.totalPublished}</div>
                </article>
                <article className="reference-card">
                  <strong>Rich support lectures</strong>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{lectureInventory.richSupportCount}</div>
                </article>
                <article className="reference-card">
                  <strong>Body-first lectures</strong>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{lectureInventory.bodyOnlyCount}</div>
                </article>
                <article className="reference-card">
                  <strong>Missing lecture numbers</strong>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>
                    {lectureInventory.missingLectureNumbers.length ? lectureInventory.missingLectureNumbers.join(", ") : "None"}
                  </div>
                </article>
              </section>
              <div className="lecture-chip-group">
                {Object.entries(lectureInventory.byContentType).map(([contentType, count]) => (
                  <span key={contentType} className="badge">
                    {contentType}: {count}
                  </span>
                ))}
              </div>
            </section>

            <section className="panel stack">
              <h2 style={{ marginBottom: 0 }}>Lecture coverage table</h2>
              <div className="worksheet-table-wrap">
                <table className="worksheet-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Tags</th>
                      <th>Concepts</th>
                      <th>Warnings</th>
                      <th>Visuals</th>
                      <th>Recap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lectureInventory.lectures.map((lecture) => (
                      <tr key={lecture.lectureNumber}>
                        <td>{lecture.lectureNumber}</td>
                        <td>{lecture.title}</td>
                        <td>{lecture.contentType}</td>
                        <td>{lecture.tagsCount}</td>
                        <td>{lecture.hasConcepts ? "Yes" : "No"}</td>
                        <td>{lecture.hasWarnings ? "Yes" : "No"}</td>
                        <td>{lecture.hasVisuals ? "Yes" : "No"}</td>
                        <td>{lecture.hasRecap ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}

        {legacyError ? (
          <section className="panel stack">
            <h2 style={{ marginBottom: 0 }}>Legacy database unavailable</h2>
            <p className="muted" style={{ margin: 0 }}>
              {legacyError}
            </p>
          </section>
        ) : null}

        {legacyData ? (
          <>
            <section className="panel stack">
              <div>
                <h2 style={{ marginBottom: 8 }}>Legacy database activity</h2>
                <p className="muted" style={{ margin: 0 }}>
                  Historical training records remain visible here, but they are no longer the primary product signal.
                </p>
              </div>
            </section>

            <section className="reference-card-grid">
              {legacyData.counts.map((item) => (
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
                    {legacyData.recentUsers.map((user) => (
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
                    {legacyData.recentSessions.map((session) => (
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
                      {legacyData.recentAttempts.map((attempt) => (
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
                      {legacyData.recentDrifts.map((drift) => (
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
                    {legacyData.recentProgress.map((snapshot) => (
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
