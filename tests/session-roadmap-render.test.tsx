import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SessionRoadmapView } from "../src/components/reference/session-roadmap-view";
import { getReferenceHubContent } from "../src/lib/i18n/reference-hub-content";
import { getSessionRoadmapContent } from "../src/lib/i18n/session-roadmap-content";
import { parseChecklistState } from "../src/lib/session-roadmap";

describe("SessionRoadmapView", () => {
  it("renders the five sessions in Arabic and includes checklist state in the printable output", () => {
    const sessions = getReferenceHubContent("ar").fiveSessionMap.items;
    const labels = getSessionRoadmapContent("ar");
    const state = parseChecklistState(JSON.stringify({ [sessions[0].session]: [true, false, true, false] }), sessions);

    const markup = renderToStaticMarkup(
      <SessionRoadmapView sessions={sessions} labels={labels} checklistState={state} pdfHref="/reference/5-sessions/pdf" />
    );

    expect(markup).toContain("لوحة الجلسات الخمس في CBT");
    expect(markup).toContain("الجلسة الأولى");
    expect(markup).toContain("الجلسة الخامسة");
    expect(markup).toContain("checked");
    expect(markup).toContain("2/4");
    expect(markup).toContain("/reference/5-sessions/pdf");
  });
});
