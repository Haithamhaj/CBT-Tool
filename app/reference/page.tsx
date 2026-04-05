"use client";

import { useEffect, useMemo, useState } from "react";
import { EmotionWheel } from "../../src/components/emotion-wheel";
import { HelpTip } from "../../src/components/help-tip";
import { useLanguage } from "../../src/components/language-provider";
import { DecisionFlowDiagram } from "../../src/components/reference/decision-flow-diagram";
import { LayerDiagram } from "../../src/components/reference/layer-diagram";
import { PathwayDiagram } from "../../src/components/reference/pathway-diagram";
import { SequenceDiagram } from "../../src/components/reference/sequence-diagram";
import { SessionStageMap } from "../../src/components/reference/session-stage-map";
import { getReferenceHubAlignment } from "../../src/lib/i18n/reference-hub-alignment";
import { getReferenceHubContent } from "../../src/lib/i18n/reference-hub-content";
import {
  getReferenceHubOperationalContent,
  type ReferenceTabId
} from "../../src/lib/i18n/reference-hub-operational";

type WorksheetLayout =
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      type: "form";
      fields: Array<{
        label: string;
        value: string;
      }>;
    }
  | {
      type: "sections";
      sections: Array<{
        title: string;
        lines: string[];
      }>;
    };

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function layoutToHtml(layout: WorksheetLayout) {
  if (layout.type === "table") {
    return `
      <table>
        <thead>
          <tr>${layout.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${layout.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell || " ")}</td>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>
    `;
  }

  if (layout.type === "form") {
    return `
      <div class="form-grid">
        ${layout.fields
          .map(
            (field) =>
              `<div class="form-line"><strong>${escapeHtml(field.label)}:</strong> ${escapeHtml(field.value || "________________")}</div>`
          )
          .join("")}
      </div>
    `;
  }

  return `
    <div class="section-grid">
      ${layout.sections
        .map(
          (section) => `
            <section class="section-card">
              <h3>${escapeHtml(section.title)}</h3>
              <ul>${section.lines.map((line) => `<li>${escapeHtml(line || "________________")}</li>`).join("")}</ul>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function renderWorksheetLayout(layout?: WorksheetLayout) {
  if (!layout) {
    return null;
  }

  if (layout.type === "table") {
    return (
      <div className="worksheet-table-wrap">
        <table className="worksheet-table">
          <thead>
            <tr>
              {layout.headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {layout.rows.map((row, rowIndex) => (
              <tr key={`worksheet-row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`worksheet-cell-${rowIndex}-${cellIndex}`}>{cell || "\u00A0"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (layout.type === "form") {
    return (
      <div className="worksheet-form-preview">
        {layout.fields.map((field) => (
          <div key={`${field.label}-${field.value}`} className="worksheet-form-line">
            <strong>{field.label}:</strong> {field.value}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="worksheet-section-grid">
      {layout.sections.map((section) => (
        <article key={section.title} className="worksheet-section-card">
          <strong>{section.title}</strong>
          <div className="list">
            {section.lines.map((line) => (
              <div key={`${section.title}-${line}`} className="list-item">
                {line}
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function ReferenceHubPage() {
  const { language, t } = useLanguage();
  const alignment = getReferenceHubAlignment(language);
  const content = getReferenceHubContent(language);
  const operational = getReferenceHubOperationalContent(language);
  const [activeTab, setActiveTab] = useState<ReferenceTabId>("overview");
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [selectedDistortionIndex, setSelectedDistortionIndex] = useState(0);
  const [selectedWorksheetIndex, setSelectedWorksheetIndex] = useState(0);

  useEffect(() => {
    setActiveTab("overview");
  }, [language]);

  useEffect(() => {
    setSelectedWorksheetIndex(0);
  }, [language]);

  useEffect(() => {
    setSelectedToolIndex(0);
    setSelectedDistortionIndex(0);
  }, [language]);

  const currentHint = operational.sectionHints[activeTab];
  const shortcutTabs: ReferenceTabId[] = [
    "session-structure",
    "exploration-stage",
    "techniques",
    "thinking",
    "treatment-plan"
  ];
  const allTechniques = useMemo(
    () => [
      ...content.tools.items.map((tool, index) => ({
        ...tool,
        ...operational.toolsMeta[index]
      })),
      ...alignment.extraTechniques
    ],
    [alignment.extraTechniques, content.tools.items, operational.toolsMeta]
  );
  const explorationStages = useMemo(
    () =>
      content.fiveSessionMap.items.map((item, index) => ({
        title: item.session,
        focus: operational.sessionMeta[index]?.focus ?? item.purpose,
        tools: item.tools,
        output: item.output
      })),
    [content.fiveSessionMap.items, operational.sessionMeta]
  );
  const treatmentPath = useMemo(
    () => [
      {
        title: language === "ar" ? "قائمة المشكلات" : "Problem list",
        description:
          language === "ar"
            ? "ابدأ بتسمية المشكلات الحالية بشكل محدد بدل تركها عامة أو متداخلة."
            : "Start by naming the current problems clearly instead of keeping them broad or mixed together."
      },
      {
        title: language === "ar" ? "الصياغة المعرفية" : "Cognitive formulation",
        description:
          language === "ar"
            ? "اربط الموقف بالأفكار والمشاعر والسلوك حتى تعرف ما الذي يحافظ على المشكلة."
            : "Link the situation, thoughts, emotions, and behavior so you can see what is maintaining the problem."
      },
      {
        title: language === "ar" ? "الأهداف المباشرة" : "Immediate goals",
        description: content.goals.items[0]?.text ?? ""
      },
      {
        title: language === "ar" ? "الأهداف المتوسطة" : "Medium-term goals",
        description: content.goals.items[1]?.text ?? ""
      },
      {
        title: language === "ar" ? "الفنيات والواجب" : "Techniques and homework",
        description:
          language === "ar"
            ? "اختر الفنية والواجب من الصياغة والهدف، لا من التفضيل الشخصي أو العشوائية."
            : "Choose the technique and homework from the formulation and goal, not from personal preference or random variety."
      }
    ],
    [content.goals.items, language]
  );
  const selectedWorksheet = content.worksheets.items[selectedWorksheetIndex];

  const worksheetDocumentHtml = useMemo(() => {
    if (!selectedWorksheet) {
      return "";
    }

    const title = escapeHtml(selectedWorksheet.name);
    const useText = escapeHtml(selectedWorksheet.use);
    const includes = selectedWorksheet.includes.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("");

    return `<!doctype html>
      <html lang="${language === "ar" ? "ar" : "en"}" dir="${language === "ar" ? "rtl" : "ltr"}">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 32px; color: #16202a; }
            h1, h2, h3 { margin: 0 0 12px; }
            p, li { line-height: 1.6; }
            .sheet { margin-top: 24px; border: 1px solid #d8dee4; border-radius: 12px; padding: 18px; }
            .meta { margin-bottom: 20px; }
            .form-grid, .section-grid { display: grid; gap: 12px; }
            .form-line, .section-card { border: 1px solid #d8dee4; border-radius: 10px; padding: 12px; background: #fbfcfd; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th, td { border: 1px solid #d8dee4; padding: 8px 10px; text-align: start; vertical-align: top; }
            th { background: #f8fbff; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="meta">
            <p>${useText}</p>
            <ul>${includes}</ul>
          </div>
          <div class="sheet">
            <h2>${escapeHtml(selectedWorksheet.workedExample.title)}</h2>
            <p><strong>${escapeHtml(language === "ar" ? "سياق الحالة" : "Case context")}:</strong> ${escapeHtml(selectedWorksheet.workedExample.caseContext)}</p>
            <p><strong>${escapeHtml(language === "ar" ? "لماذا هذا الشكل" : "Why this shape")}:</strong> ${escapeHtml(selectedWorksheet.workedExample.whyThisShape)}</p>
            <p><strong>${escapeHtml(language === "ar" ? "كيف تقلده" : "How to copy it")}:</strong> ${escapeHtml(selectedWorksheet.workedExample.copyTip)}</p>
            ${layoutToHtml(selectedWorksheet.workedExample.layout as WorksheetLayout)}
          </div>
          <div class="sheet">
            <h2>${escapeHtml(language === "ar" ? "النسخة الفارغة" : "Blank template")}</h2>
            ${layoutToHtml(selectedWorksheet.blankTemplate as WorksheetLayout)}
          </div>
        </body>
      </html>`;
  }, [language, selectedWorksheet]);

  function openWorksheetDocument(mode: "print" | "download") {
    if (!selectedWorksheet || !worksheetDocumentHtml) {
      return;
    }

    if (mode === "download") {
      const blob = new Blob([worksheetDocumentHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${selectedWorksheet.name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "worksheet"}.html`;
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    }

    const popup = window.open("", "_blank", "noopener,noreferrer,width=980,height=760");
    if (!popup) {
      return;
    }

    popup.document.open();
    popup.document.write(worksheetDocumentHtml);
    popup.document.close();
    popup.focus();
    popup.print();
  }

  const tabPanels = useMemo<Record<ReferenceTabId, React.ReactNode>>(
    () => ({
      overview: (
        <div className="stack">
          <div className="panel reference-diagram-panel stack">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <h3>{operational.diagrams.cbtModelTitle}</h3>
              <span className="badge">{operational.toolFields.useDuring}</span>
            </div>
            <SequenceDiagram nodes={operational.diagrams.cbtModelNodes} rtl={language === "ar"} />
          </div>

          <div className="panel stack">
            <h3>{content.overview.title}</h3>
            <p>{content.overview.intro}</p>
            <div className="list">
              {content.overview.bullets.map((bullet) => (
                <div key={bullet} className="list-item reference-check">
                  {bullet}
                </div>
              ))}
            </div>
          </div>

          <div className="panel stack">
            <h3>{content.principles.title}</h3>
            <div className="reference-card-grid">
              {content.principles.items.map((item) => (
                <article key={item.title} className="reference-card">
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="panel stack">
            <h3>{operational.checklistsTitle}</h3>
            <div className="reference-checklist-grid">
              {operational.checklists.slice(0, 2).map((checklist) => (
                <article key={checklist.title} className="reference-card checklist-card">
                  <strong>{checklist.title}</strong>
                  <p className="muted">{checklist.useHint}</p>
                  <div className="list">
                    {checklist.items.map((item) => (
                      <div key={item} className="list-item reference-check">
                        {item}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ),
      principles: (
        <div className="stack">
          <div className="panel stack">
            <h3>{alignment.principlesTitle}</h3>
            <p className="muted">{alignment.principlesIntro}</p>
            <div className="reference-card-grid">
              {alignment.principles.map((principle, index) => (
                <article key={principle.title} className="reference-card">
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{principle.title}</strong>
                    <span className="badge">{index + 1}</span>
                  </div>
                  <p>{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      ),
      "session-structure": (
        <div className="stack">
          <div className="panel reference-diagram-panel stack">
            <SequenceDiagram
              title={operational.diagrams.sessionFlowTitle}
              nodes={operational.diagrams.sessionFlowNodes}
              rtl={language === "ar"}
            />
          </div>

          <div className="panel stack">
            <h3>{content.sessionStructure.title}</h3>
            <div className="reference-timeline">
              {content.sessionStructure.items.map((item, index) => (
                <div key={item} className="reference-timeline-item">
                  <span className="badge">{index + 1}</span>
                  <div>{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="reference-checklist-grid">
            {operational.checklists.slice(0, 3).map((checklist) => (
              <div key={checklist.title} className="panel stack checklist-card">
                <h3>{checklist.title}</h3>
                <p className="muted">{checklist.useHint}</p>
                <div className="list">
                  {checklist.items.map((item) => (
                    <div key={item} className="list-item reference-check">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      "exploration-stage": (
        <div className="stack">
          <div className="panel reference-diagram-panel stack">
            <SequenceDiagram
              title={operational.diagrams.fiveSessionsTitle}
              nodes={operational.diagrams.fiveSessionsNodes}
              numbered
              rtl={language === "ar"}
            />
          </div>

          <div className="panel stack">
            <SessionStageMap
              title={language === "ar" ? "خريطة المرحلة الاستكشافية" : "Exploration stage map"}
              items={explorationStages}
            />
          </div>

          <div className="panel stack">
            <h3>{content.fiveSessionMap.title}</h3>
            <p className="muted">{content.fiveSessionMap.intro}</p>
            <div className="reference-sequence">
              {content.fiveSessionMap.items.map((item, index) => (
                <article key={item.session} className="reference-sequence-card">
                  <div className="sequence-index">{index + 1}</div>
                  <div className="stack">
                    <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{item.session}</strong>
                    </div>
                    <p><strong>{operational.toolFields.goal}:</strong> {item.purpose}</p>
                    <p><strong>{operational.toolFields.mainFocus}:</strong> {operational.sessionMeta[index]?.focus}</p>
                    <p><strong>{operational.toolFields.mainTools}:</strong> {item.tools.join(" • ")}</p>
                    <p><strong>{operational.toolFields.homework}:</strong> {item.homework}</p>
                    <p><strong>{operational.toolFields.expectedSessionOutput}:</strong> {item.output}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ),
      "cognitive-model": (
        <div className="stack">
          <div className="panel reference-diagram-panel stack">
            <SequenceDiagram
              title={operational.diagrams.cbtModelTitle}
              nodes={operational.diagrams.cbtModelNodes}
              rtl={language === "ar"}
            />
          </div>

          <div className="panel stack">
            <LayerDiagram
              title={content.cognitiveStructure.title}
              layers={content.cognitiveStructure.levels.map((level) => ({
                title: level.name,
                description: level.description,
                example: `${language === "ar" ? "مثال" : "Example"}: ${level.example}`
              }))}
            />
          </div>
        </div>
      ),
      techniques: (
        <div className="stack">
          <div className="reference-checklist-grid">
            {operational.checklists.slice(4, 6).map((checklist) => (
              <div key={checklist.title} className="panel stack checklist-card">
                <h3>{checklist.title}</h3>
                <p className="muted">{checklist.useHint}</p>
                <div className="list">
                  {checklist.items.map((item) => (
                    <div key={item} className="list-item reference-check">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="panel stack">
            <h3>{language === "ar" ? "الفنيات العلاجية" : "Therapeutic Techniques"}</h3>
            <p className="muted">{content.tools.intro}</p>
            <div className="reference-browser">
              <aside className="reference-browser-list">
                {allTechniques.map((tool, index) => (
                  <button
                    key={tool.name}
                    type="button"
                    className={selectedToolIndex === index ? "reference-browser-item active" : "reference-browser-item"}
                    onClick={() => setSelectedToolIndex(index)}
                  >
                    <strong>{tool.name}</strong>
                    <span>{tool.when}</span>
                  </button>
                ))}
              </aside>

              <section className="reference-browser-detail panel">
                {(() => {
                  const tool = allTechniques[selectedToolIndex];
                  return (
                    <div className="stack">
                      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{tool.name}</strong>
                        <span className="badge">{tool.level}</span>
                      </div>
                      <div className="emotion-chips">
                        {tool.tags.map((tag) => (
                          <span key={tag} className="badge">{tag}</span>
                        ))}
                      </div>
                      <p><strong>{language === "ar" ? "ما هي؟" : "What it is:"}</strong> {tool.what}</p>
                      <p><strong>{language === "ar" ? "متى تُستخدم؟" : "When to use it:"}</strong> {tool.when}</p>
                      <p><strong>{operational.toolFields.whenNot}:</strong> {tool.whenNot}</p>
                      <p><strong>{operational.toolFields.expectedOutput}:</strong> {tool.expectedOutput}</p>
                      <p><strong>{language === "ar" ? "خطأ شائع:" : "Common mistake:"}</strong> {tool.mistake}</p>

                      <div className="detail-callout">
                        <strong>{language === "ar" ? "مؤشرات أنها الأداة المناسبة الآن" : "Signs this tool fits now"}</strong>
                        <div className="list">
                          {tool.fitSigns.map((sign) => (
                            <div key={sign} className="list-item reference-check">
                              {sign}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="detail-callout">
                        <strong>{language === "ar" ? "كيف تبدأ بها عمليًا" : "How to start with it"}</strong>
                        <div>{tool.starterMove}</div>
                      </div>

                      <div className="detail-callout">
                        <div className="worksheet-preview-title">
                          {tool.miniCase.title}
                        </div>
                        <p><strong>{language === "ar" ? "الموقف:" : "Situation:"}</strong> {tool.miniCase.situation}</p>
                        <p><strong>{language === "ar" ? "لماذا هذه الأداة؟" : "Why this tool now:"}</strong> {tool.miniCase.whyThisTool}</p>
                        <p><strong>{language === "ar" ? "المخرج المتوقع:" : "Expected output:"}</strong> {tool.miniCase.expectedOutput}</p>
                      </div>

                    </div>
                  );
                })()}
              </section>
            </div>
          </div>
          <div className="panel stack">
            <DecisionFlowDiagram
              title={alignment.techniqueDecisionTitle}
              steps={alignment.techniqueDecision}
            />
            <p className="muted">{alignment.techniqueDecisionIntro}</p>
          </div>
        </div>
      ),
      thinking: (
        <div className="stack">
          <div className="panel stack">
            <LayerDiagram
              title={content.thinkingLevels.title}
              layers={content.thinkingLevels.items.map((level) => ({
                title: level.name,
                description: `${level.definition} ${language === "ar" ? "الفرق" : "Difference"}: ${level.difference}`,
                example: `${language === "ar" ? "مثال" : "Example"}: ${level.example}`
              }))}
            />
          </div>

          <div className="panel stack">
            <h3>{content.distortions.title}</h3>
            <p className="muted">{content.distortions.intro}</p>
          </div>
          <div className="panel stack">
            <h3>{language === "ar" ? "مقارنة سريعة بين مستويات التفكير" : "Quick comparison of thinking levels"}</h3>
            <div className="reference-card-grid">
              {content.thinkingLevels.items.map((level) => (
                <article key={level.name} className="reference-card">
                  <strong>{level.name}</strong>
                  <p>{level.definition}</p>
                  <p><strong>{language === "ar" ? "كيف تختلف؟" : "How it differs:"}</strong> {level.difference}</p>
                  <p><strong>{language === "ar" ? "مثال:" : "Example:"}</strong> {level.example}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="panel stack">
            <h3>{alignment.beliefExtractionTitle}</h3>
            <p className="muted">{alignment.beliefExtractionIntro}</p>
            <div className="reference-card-grid">
              {alignment.beliefExtractionMethods.map((method, index) => (
                <article key={method.title} className="reference-card">
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{method.title}</strong>
                    <span className="badge">{index + 1}</span>
                  </div>
                  <p>{method.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="reference-browser">
            <aside className="reference-browser-list">
              {content.distortions.items.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  className={selectedDistortionIndex === index ? "reference-browser-item active" : "reference-browser-item"}
                  onClick={() => setSelectedDistortionIndex(index)}
                >
                  <strong>{item.name}</strong>
                  <span>{item.definition}</span>
                </button>
              ))}
            </aside>

            <section className="reference-browser-detail panel">
              {(() => {
                const item = content.distortions.items[selectedDistortionIndex];
                return (
                  <div className="stack">
                    <strong>{item.name}</strong>
                    <p><strong>{language === "ar" ? "تعريف بسيط:" : "Simple definition:"}</strong> {item.definition}</p>
                    <p><strong>{language === "ar" ? "مثال:" : "Example:"}</strong> {item.example}</p>
                    <p><strong>{language === "ar" ? "كيف يظهر عادة؟" : "How it usually appears:"}</strong> {item.appearsAs}</p>
                    <div className="detail-callout">
                      <strong>{language === "ar" ? "كيف لا تخلطه بغيره" : "Do not confuse it with"}</strong>
                      <div>{item.differsFrom}</div>
                    </div>
                  </div>
                );
              })()}
            </section>
          </div>
        </div>
      ),
      emotions: (
        <div className="stack">
          <div className="panel stack">
            <h3>{content.emotions.title}</h3>
            <p className="muted">{content.emotions.intro}</p>
            <EmotionWheel language={language} />
          </div>
        </div>
      ),
      worksheets: (
        <div className="stack">
          <div className="panel stack">
            <h3>{content.worksheets.title}</h3>
            <div className="worksheet-console">
              <aside className="worksheet-list">
                {content.worksheets.items.map((worksheet, index) => (
                  <button
                    key={worksheet.name}
                    type="button"
                    className={selectedWorksheetIndex === index ? "worksheet-list-item active" : "worksheet-list-item"}
                    onClick={() => setSelectedWorksheetIndex(index)}
                  >
                    <strong>{worksheet.name}</strong>
                    <span>{worksheet.use}</span>
                  </button>
                ))}
              </aside>

              <section className="worksheet-detail panel">
                <div className="stack">
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <div className="stack" style={{ gap: 6 }}>
                      <h4 style={{ margin: 0 }}>{selectedWorksheet?.name}</h4>
                      <p className="muted" style={{ margin: 0 }}>
                        {selectedWorksheet?.use}
                      </p>
                    </div>
                    <span className="badge">{language === "ar" ? "مرجع عملي" : "Practical reference"}</span>
                  </div>

                  <div className="worksheet-actions">
                    <button type="button" onClick={() => openWorksheetDocument("print")}>
                      {language === "ar" ? "طباعة الورقة" : "Print worksheet"}
                    </button>
                    <button type="button" className="secondary" onClick={() => openWorksheetDocument("download")}>
                      {language === "ar" ? "تنزيل HTML" : "Download HTML"}
                    </button>
                  </div>

                  <div className="worksheet-includes">
                    {selectedWorksheet?.includes.map((entry) => (
                      <span key={entry} className="badge">
                        {entry}
                      </span>
                    ))}
                  </div>

                  <div className="detail-callout">
                    <div className="worksheet-preview-title">
                      {selectedWorksheet?.workedExample.title}
                    </div>
                    <p>
                      <strong>{language === "ar" ? "سياق الحالة:" : "Case context:"}</strong>{" "}
                      {selectedWorksheet?.workedExample.caseContext}
                    </p>
                    <p>
                      <strong>{language === "ar" ? "لماذا هذا الشكل؟" : "Why this shape:"}</strong>{" "}
                      {selectedWorksheet?.workedExample.whyThisShape}
                    </p>
                    <p>
                      <strong>{language === "ar" ? "كيف تقلده؟" : "How to copy it:"}</strong>{" "}
                      {selectedWorksheet?.workedExample.copyTip}
                    </p>
                  </div>

                  <div className="worksheet-grid">
                    <div className="worksheet-preview large">
                      <div className="worksheet-preview-title">
                        {language === "ar" ? "مثال مكتمل" : "Worked example"}
                      </div>
                      {renderWorksheetLayout(selectedWorksheet?.workedExample.layout as WorksheetLayout)}
                    </div>

                    <div className="worksheet-preview large">
                      <div className="worksheet-preview-title">
                        {language === "ar" ? "النسخة الفارغة" : "Blank template"}
                      </div>
                      {renderWorksheetLayout(selectedWorksheet?.blankTemplate as WorksheetLayout)}
                    </div>
                  </div>

                </div>
              </section>
            </div>
          </div>
        </div>
      ),
      "treatment-plan": (
        <div className="stack">
          <div className="panel reference-diagram-panel stack">
            <PathwayDiagram
              title={language === "ar" ? "مسار بناء الخطة العلاجية" : "Treatment planning pathway"}
              steps={treatmentPath}
              rtl={language === "ar"}
            />
          </div>

          <div className="panel stack">
            <h3>{content.goals.title}</h3>
            <div className="reference-card-grid">
              {content.goals.items.map((item) => (
                <article key={item.title} className="reference-card">
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="panel stack checklist-card">
            <h3>{operational.checklists[3].title}</h3>
            <p className="muted">{operational.checklists[3].useHint}</p>
            <div className="list">
              {operational.checklists[3].items.map((item) => (
                <div key={item} className="list-item reference-check">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      "therapy-obstacles": (
        <div className="stack">
          <div className="panel stack">
            <h3>{alignment.therapyObstaclesTitle}</h3>
            <p className="muted">{alignment.therapyObstaclesIntro}</p>
            <div className="reference-card-grid">
              {alignment.therapyObstacles.map((group) => (
                <article key={group.title} className="reference-card">
                  <strong>{group.title}</strong>
                  <p>{group.intro}</p>
                  <div className="list">
                    {group.items.map((item) => (
                      <div key={item} className="list-item reference-check">
                        {item}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ),
      glossary: (
        <div className="panel stack">
          <h3>{content.glossary.title}</h3>
          <div className="reference-glossary">
            {content.glossary.items.map((item) => (
              <div key={item.term} className="list-item">
                <strong>{item.term}</strong>
                <div>{item.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      ),
      advanced: (
        <div className="panel stack advanced-shell">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3>{content.advanced.title}</h3>
              <p className="muted">{content.advanced.intro}</p>
            </div>
            <span className="badge">{operational.toolFields.notStartingPoint}</span>
          </div>
          <div className="reference-advanced-list">
            {content.advanced.blocks.map((block) => (
              <details key={block.title} className="reference-advanced-item">
                <summary>{block.title}</summary>
                <p>{block.intro}</p>
                <div className="list">
                  {block.bullets.map((bullet) => (
                    <div key={bullet} className="list-item reference-check">
                      {bullet}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      )
    }),
    [
      alignment,
      allTechniques,
      content,
      explorationStages,
      language,
      selectedWorksheet,
      operational,
      selectedDistortionIndex,
      selectedToolIndex,
      selectedWorksheetIndex,
      treatmentPath
    ]
  );

  return (
    <div className="page reference-page">
      <div>
        <h1>{t(language, "referenceHubTitle")}</h1>
        <p className="muted">{t(language, "referenceHubSubtitle")}</p>
      </div>

      <div className="panel reference-hero">
        <span className="badge authority-badge">{t(language, "coreReference")}</span>
        <p>{content.heroNote}</p>
      </div>

      <div className="panel stack">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>{language === "ar" ? "الأقسام الأكثر استخدامًا" : "Most-used sections"}</h2>
          <span className="badge">{language === "ar" ? "للوصول السريع" : "For quick access"}</span>
        </div>
        <div className="reference-link-row">
          {shortcutTabs.map((tabId) => (
            <button
              key={tabId}
              type="button"
              className={activeTab === tabId ? "reference-link-chip active" : "reference-link-chip secondary"}
              onClick={() => setActiveTab(tabId)}
            >
              {operational.tabs.find((tab) => tab.id === tabId)?.label}
            </button>
          ))}
        </div>
      </div>

      <section className="reference-console stack">
        <div className="panel stack">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h2>{operational.quickStartTitle}</h2>
            <HelpTip
              label={operational.quickStartTitle}
              content={
                language === "ar"
                  ? "اختر طريقة الاستخدام الأقرب لحاجتك الآن، وسيتم نقلك مباشرة إلى أهم جزء بدل البحث داخل الصفحة."
                  : "Pick the use case that matches your need now and jump straight to the most relevant section."
              }
            />
          </div>
          <div className="reference-quickstart-grid">
            {operational.quickStartItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={activeTab === item.tab ? "reference-quickstart active" : "reference-quickstart"}
                onClick={() => setActiveTab(item.tab)}
              >
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="reference-tabs" role="tablist" aria-label={t(language, "referenceHubTitle")}>
          {operational.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? "reference-tab active" : "reference-tab"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="panel reference-tab-summary">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div className="stack" style={{ gap: 6 }}>
              <span className="section-label">
                {activeTab === "advanced" ? t(language, "advancedReference") : t(language, "coreReference")}
              </span>
              <strong>{operational.tabs.find((tab) => tab.id === activeTab)?.label}</strong>
            </div>
            <HelpTip
              label={operational.tabs.find((tab) => tab.id === activeTab)?.label ?? ""}
              content={currentHint}
            />
          </div>
          <p className="muted">{currentHint}</p>
        </div>

        <section className="reference-section stack">{tabPanels[activeTab]}</section>
      </section>
    </div>
  );
}
