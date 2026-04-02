"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmotionWheel } from "../../src/components/emotion-wheel";
import { HelpTip } from "../../src/components/help-tip";
import { useLanguage } from "../../src/components/language-provider";
import { getReferenceHubContent } from "../../src/lib/i18n/reference-hub-content";
import {
  getReferenceHubOperationalContent,
  type ReferenceTabId
} from "../../src/lib/i18n/reference-hub-operational";

export default function ReferenceHubPage() {
  const { language, t } = useLanguage();
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
  const shortcutTabs: ReferenceTabId[] = ["tools", "thinking", "emotions", "worksheets", "goals"];

  const tabPanels = useMemo<Record<ReferenceTabId, React.ReactNode>>(
    () => ({
      overview: (
        <div className="stack">
          <div className="panel reference-diagram-panel stack">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <h3>{operational.diagrams.cbtModelTitle}</h3>
              <span className="badge">{operational.toolFields.useDuring}</span>
            </div>
            <div className="reference-flow">
              {operational.diagrams.cbtModelNodes.map((node, index) => (
                <div key={node} className="reference-flow-wrap">
                  <div className="reference-flow-node">{node}</div>
                  {index < operational.diagrams.cbtModelNodes.length - 1 ? (
                    <div className="reference-flow-arrow" aria-hidden="true">
                      {language === "ar" ? "←" : "→"}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
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
      "session-structure": (
        <div className="stack">
          <div className="panel reference-diagram-panel stack">
            <h3>{operational.diagrams.sessionFlowTitle}</h3>
            <div className="reference-flow">
              {operational.diagrams.sessionFlowNodes.map((node, index) => (
                <div key={node} className="reference-flow-wrap">
                  <div className="reference-flow-node">{node}</div>
                  {index < operational.diagrams.sessionFlowNodes.length - 1 ? (
                    <div className="reference-flow-arrow" aria-hidden="true">
                      {language === "ar" ? "←" : "→"}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
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
      "five-sessions": (
        <div className="stack">
          <div className="panel reference-diagram-panel stack">
            <h3>{operational.diagrams.fiveSessionsTitle}</h3>
            <div className="reference-flow">
              {operational.diagrams.fiveSessionsNodes.map((node, index) => (
                <div key={node} className="reference-flow-wrap">
                  <div className="reference-flow-node numbered">{node}</div>
                  {index < operational.diagrams.fiveSessionsNodes.length - 1 ? (
                    <div className="reference-flow-arrow" aria-hidden="true">
                      {language === "ar" ? "←" : "→"}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
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
      tools: (
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
            <h3>{content.tools.title}</h3>
            <p className="muted">{content.tools.intro}</p>
            <div className="reference-browser">
              <aside className="reference-browser-list">
                {content.tools.items.map((tool, index) => (
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
                  const tool = content.tools.items[selectedToolIndex];
                  const meta = operational.toolsMeta[selectedToolIndex];
                  return (
                    <div className="stack">
                      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{tool.name}</strong>
                        <span className="badge">{meta.level}</span>
                      </div>
                      <div className="emotion-chips">
                        {meta.tags.map((tag) => (
                          <span key={tag} className="badge">{tag}</span>
                        ))}
                      </div>
                      <p><strong>{language === "ar" ? "ما هي؟" : "What it is:"}</strong> {tool.what}</p>
                      <p><strong>{language === "ar" ? "متى تُستخدم؟" : "When to use it:"}</strong> {tool.when}</p>
                      <p><strong>{operational.toolFields.whenNot}:</strong> {meta.whenNot}</p>
                      <p><strong>{operational.toolFields.expectedOutput}:</strong> {meta.expectedOutput}</p>
                      <p><strong>{language === "ar" ? "خطأ شائع:" : "Common mistake:"}</strong> {tool.mistake}</p>

                      <div className="detail-callout">
                        <strong>{language === "ar" ? "مؤشرات أنها الأداة المناسبة الآن" : "Signs this tool fits now"}</strong>
                        <div className="list">
                          {meta.fitSigns.map((sign) => (
                            <div key={sign} className="list-item reference-check">
                              {sign}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="detail-callout">
                        <strong>{language === "ar" ? "كيف تبدأ بها عمليًا" : "How to start with it"}</strong>
                        <div>{meta.starterMove}</div>
                      </div>

                      <div className="detail-callout">
                        <div className="worksheet-preview-title">
                          {tool.miniCase.title}
                        </div>
                        <p><strong>{language === "ar" ? "الموقف:" : "Situation:"}</strong> {tool.miniCase.situation}</p>
                        <p><strong>{language === "ar" ? "لماذا هذه الأداة؟" : "Why this tool now:"}</strong> {tool.miniCase.whyThisTool}</p>
                        <p><strong>{language === "ar" ? "المخرج المتوقع:" : "Expected output:"}</strong> {tool.miniCase.expectedOutput}</p>
                      </div>

                      <div className="reference-link-row">
                        <Link href="/practice/setup" className="reference-link-chip">
                          {language === "ar" ? "استخدمها في إعداد الممارسة" : "Use in Practice Setup"}
                        </Link>
                        <Link href="/sessions" className="reference-link-chip secondary">
                          {language === "ar" ? "ارجع إلى الجلسات" : "Return to Sessions"}
                        </Link>
                      </div>
                    </div>
                  );
                })()}
              </section>
            </div>
          </div>
        </div>
      ),
      thinking: (
        <div className="stack">
          <div className="panel stack">
            <h3>{content.cognitiveStructure.title}</h3>
            <p className="muted">{content.cognitiveStructure.intro}</p>
            <div className="cognitive-structure">
              {content.cognitiveStructure.levels.map((level, index) => (
                <div key={level.name} className="cognitive-structure-step">
                  <div className="cognitive-structure-card">
                    <strong>{level.name}</strong>
                    <p>{level.description}</p>
                    <div className="muted">
                      <strong>{language === "ar" ? "مثال:" : "Example:"}</strong> {level.example}
                    </div>
                  </div>
                  {index < content.cognitiveStructure.levels.length - 1 ? (
                    <div className="cognitive-structure-arrow" aria-hidden="true">
                      ↓
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="panel stack">
            <h3>{content.thinkingLevels.title}</h3>
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
            <h3>{content.distortions.title}</h3>
            <p className="muted">{content.distortions.intro}</p>
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
                      <h4 style={{ margin: 0 }}>{content.worksheets.items[selectedWorksheetIndex]?.name}</h4>
                      <p className="muted" style={{ margin: 0 }}>
                        {content.worksheets.items[selectedWorksheetIndex]?.use}
                      </p>
                    </div>
                    <span className="badge">{language === "ar" ? "مرجع عملي" : "Practical reference"}</span>
                  </div>

                  <div className="worksheet-includes">
                    {content.worksheets.items[selectedWorksheetIndex]?.includes.map((entry) => (
                      <span key={entry} className="badge">
                        {entry}
                      </span>
                    ))}
                  </div>

                  <div className="detail-callout">
                    <div className="worksheet-preview-title">
                      {content.worksheets.items[selectedWorksheetIndex]?.workedExample.title}
                    </div>
                    <p>
                      <strong>{language === "ar" ? "سياق الحالة:" : "Case context:"}</strong>{" "}
                      {content.worksheets.items[selectedWorksheetIndex]?.workedExample.caseContext}
                    </p>
                    <p>
                      <strong>{language === "ar" ? "لماذا هذا الشكل؟" : "Why this shape:"}</strong>{" "}
                      {content.worksheets.items[selectedWorksheetIndex]?.workedExample.whyThisShape}
                    </p>
                    <p>
                      <strong>{language === "ar" ? "كيف تقلده؟" : "How to copy it:"}</strong>{" "}
                      {content.worksheets.items[selectedWorksheetIndex]?.workedExample.copyTip}
                    </p>
                  </div>

                  <div className="worksheet-preview large">
                    <div className="worksheet-preview-title">
                      {language === "ar" ? "شكل النموذج المتوقع" : "Expected worksheet structure"}
                    </div>
                    {content.worksheets.items[selectedWorksheetIndex]?.preview.type === "table" ? (
                      <div className="worksheet-table-wrap">
                        <table className="worksheet-table">
                          <thead>
                            <tr>
                              {content.worksheets.items[selectedWorksheetIndex]?.preview.headers?.map((header) => (
                                <th key={header}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {content.worksheets.items[selectedWorksheetIndex]?.preview.rows?.map((row, rowIndex) => (
                              <tr key={`${content.worksheets.items[selectedWorksheetIndex]?.name}-${rowIndex}`}>
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={`${content.worksheets.items[selectedWorksheetIndex]?.name}-${rowIndex}-${cellIndex}`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="worksheet-form-preview">
                        {content.worksheets.items[selectedWorksheetIndex]?.preview.fields?.map((field) => (
                          <div key={`${field.label}-${field.value}`} className="worksheet-form-line">
                            <strong>{field.label}:</strong> {field.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="reference-link-row">
                    <Link href="/practice/setup" className="reference-link-chip">
                      {language === "ar" ? "ابدأ تدريبًا بهذا المرجع" : "Start practice with this reference"}
                    </Link>
                    <Link href="/sessions" className="reference-link-chip secondary">
                      {language === "ar" ? "اكمل جلسة سابقة" : "Resume a prior session"}
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ),
      goals: (
        <div className="stack">
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
      content,
      language,
      operational,
      selectedDistortionIndex,
      selectedToolIndex,
      selectedWorksheetIndex
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
          <h2>{language === "ar" ? "اختصارات الاستخدام السريع" : "Most-used shortcuts"}</h2>
          <span className="badge">{language === "ar" ? "للرجوع السريع" : "For quick return"}</span>
        </div>
        <div className="reference-link-row">
          <Link href="/practice/setup" className="reference-link-chip">
            {language === "ar" ? "إعداد الممارسة" : "Practice Setup"}
          </Link>
          <Link href="/sessions" className="reference-link-chip">
            {language === "ar" ? "الجلسات" : "Sessions"}
          </Link>
          <Link href="/progress" className="reference-link-chip">
            {language === "ar" ? "التقدم" : "Progress"}
          </Link>
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
