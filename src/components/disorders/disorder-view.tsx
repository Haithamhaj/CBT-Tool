"use client";

import { useMemo, useState } from "react";
import type {
  ClassificationCheck,
  Disorder,
  DisorderCheck,
  DisorderQuizQuestion,
  MultipleChoiceCheck,
  OrderingCheck,
  WorksheetLayout
} from "../../lib/content/disorders";

function Section({
  id,
  title,
  children
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="panel disorder-section stack">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function renderLayout(layout: WorksheetLayout) {
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
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`}>{cell || "\u00A0"}</td>
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
            <strong>{field.label}:</strong> {field.value || "________________"}
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
            {section.lines.map((line, index) => (
              <div key={`${section.title}-${index}`} className="list-item">
                {line || "________________"}
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function MultipleChoice({ check }: { check: MultipleChoiceCheck }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : check.options[selectedIndex];

  return (
    <article className="panel disorder-check stack">
      <strong>{check.title}</strong>
      <p>{check.prompt}</p>
      <div className="list">
        {check.options.map((option, index) => (
          <button
            key={option.label}
            type="button"
            className={selectedIndex === index ? "secondary disorder-option active" : "secondary disorder-option"}
            onClick={() => setSelectedIndex(index)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selected ? (
        <div className={selected.correct ? "callout callout-official" : "callout callout-advisory"}>
          {selected.explanation}
        </div>
      ) : null}
    </article>
  );
}

function Classification({ check }: { check: ClassificationCheck }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  return (
    <article className="panel disorder-check stack">
      <strong>{check.title}</strong>
      <p>{check.prompt}</p>
      <div className="stack">
        {check.items.map((item, index) => {
          const answer = answers[index];
          const solved = Boolean(answer);
          const correct = answer === item.correctGroup;
          return (
            <div key={item.text} className="reference-card stack">
              <p>{item.text}</p>
              <div className="row">
                {check.groups.map((group) => (
                  <button
                    key={`${item.text}-${group}`}
                    type="button"
                    className={answer === group ? "secondary disorder-option active" : "secondary disorder-option"}
                    onClick={() => setAnswers((current) => ({ ...current, [index]: group }))}
                  >
                    {group}
                  </button>
                ))}
              </div>
              {solved ? (
                <div className={correct ? "callout callout-official" : "callout callout-advisory"}>
                  {correct ? item.feedback : `الإجابة الأقرب: ${item.correctGroup}. ${item.feedback}`}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}

function Ordering({ check }: { check: OrderingCheck }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <article className="panel disorder-check stack">
      <strong>{check.title}</strong>
      <p>{check.prompt}</p>
      <button type="button" className="secondary" onClick={() => setRevealed((value) => !value)}>
        {revealed ? "إخفاء الترتيب" : "إظهار الترتيب الصحيح"}
      </button>
      {revealed ? (
        <div className="reference-sequence">
          {check.correctOrder.map((item, index) => (
            <article key={item} className="reference-sequence-card">
              <div className="sequence-index">{index + 1}</div>
              <div className="stack">
                <strong>{item}</strong>
              </div>
            </article>
          ))}
        </div>
      ) : null}
      <div className="callout callout-official">{check.explanation}</div>
    </article>
  );
}

function CheckBlock({ check }: { check: DisorderCheck }) {
  if (check.type === "multiple-choice") {
    return <MultipleChoice check={check} />;
  }

  if (check.type === "classification") {
    return <Classification check={check} />;
  }

  return <Ordering check={check} />;
}

function QuizQuestion({ question, index }: { question: DisorderQuizQuestion; index: number }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : question.options[selectedIndex];

  return (
    <article className="reference-card stack">
      <strong>
        {index + 1}. {question.prompt}
      </strong>
      <div className="list">
        {question.options.map((option, optionIndex) => (
          <button
            key={option.label}
            type="button"
            className={selectedIndex === optionIndex ? "secondary disorder-option active" : "secondary disorder-option"}
            onClick={() => setSelectedIndex(optionIndex)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selected ? (
        <div className={selected.correct ? "callout callout-official" : "callout callout-advisory"}>
          {selected.explanation}
        </div>
      ) : null}
    </article>
  );
}

export function DisorderView({ disorder }: { disorder: Disorder }) {
  const [selectedTool, setSelectedTool] = useState(0);
  const tool = disorder.tools[selectedTool];
  const navItems = useMemo(
    () => [
      ["concept", "المفهوم"],
      ["symptoms", "الأعراض"],
      ["distinctions", "التمييزات"],
      ["diagnosis", "التشخيص"],
      ["formation", "التكوين المعرفي السلوكي"],
      ["roadmap", "خريطة تدخل CBT"],
      ["tools", "الأدوات"],
      ["training", "التطبيقات والتدريب"],
      ["risk", "الخطر والانتباه السريري"],
      ["case-study", "الحالة التدريبية"],
      ["quiz", "الاختبار"],
      ["references", "الملفات المرجعية"],
      ["recap", "الخلاصة"]
    ],
    []
  );

  return (
    <div className="page lecture-page disorder-page">
      <header className="panel lecture-header stack">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="stack" style={{ gap: 6 }}>
            <span className="section-label">مكتبة الاضطرابات</span>
            <h1 className="lecture-title">{disorder.title}</h1>
            <p className="muted">{disorder.subtitle}</p>
          </div>
          <div className="lecture-chip-group">
            <span className="badge authority-badge">وحدة اضطراب</span>
            <span className="badge">عربي</span>
          </div>
        </div>

        <div className="lecture-meta-grid">
          <article className="lecture-meta-card">
            <strong>الفئة المستهدفة</strong>
            <p>{disorder.audience}</p>
          </article>
          <article className="lecture-meta-card">
            <strong>طبقات الوحدة</strong>
            <p>تعليمي + تطبيقي + مرجعي</p>
          </article>
          <article className="lecture-meta-card">
            <strong>المرجع الأساسي</strong>
            <p>الشرائح + المادة العلمية</p>
          </article>
        </div>

        <div className="lecture-chip-group">
          {disorder.tags.map((tag) => (
            <span key={tag} className="badge">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="panel lecture-section-nav stack">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>انتقل داخل الوحدة</h2>
          <span className="badge">13 قسمًا</span>
        </div>
        <div className="lecture-link-row">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="reference-link-chip secondary">
              {label}
            </a>
          ))}
        </div>
      </section>

      <Section id="concept" title="المفهوم">
        <div className="reference-card-grid">
          {disorder.summaryCards.map((card) => (
            <article key={card.title} className="reference-card">
              <strong>{card.title}</strong>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
        <div className="reference-card-grid">
          {disorder.helperCards.map((card) => (
            <article key={card.title} className="reference-card">
              <span className="section-label">{card.label}</span>
              <strong>{card.title}</strong>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
        <div className="stack">
          {disorder.conceptBody.map((paragraph, index) => (
            <p key={`concept-${index}`}>{paragraph}</p>
          ))}
        </div>
        <CheckBlock check={disorder.conceptCheck} />
      </Section>

      <Section id="symptoms" title="الأعراض">
        <div className="lecture-group-grid">
          {disorder.symptomGroups.map((group) => (
            <article key={group.groupName} className="reference-card stack">
              <strong>{group.groupName}</strong>
              <p>{group.intro}</p>
              <div className="list">
                {group.items.map((item) => (
                  <div key={item} className="list-item">
                    {item}
                  </div>
                ))}
              </div>
              <div className="callout callout-official stack">
                <strong>أمثلة بلغة المريض</strong>
                {group.examples.map((example) => (
                  <p key={example}>{example}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="callout callout-advisory">انتبه: العرض لا يساوي تشخيصًا. المطلوب صورة كاملة ومدة وتعطل وظيفي.</div>
        <CheckBlock check={disorder.symptomCheck} />
      </Section>

      <Section id="distinctions" title="التمييزات">
        <div className="lecture-comparison-stack">
          {disorder.distinctions.map((item) => (
            <article key={item.title} className="panel lecture-distinction-card">
              <strong>{item.title}</strong>
              <div className="lecture-distinction-grid">
                <div className="callout callout-official stack">
                  <strong>{item.leftTitle}</strong>
                  <p>{item.left}</p>
                </div>
                <div className="callout callout-advisory stack">
                  <strong>{item.rightTitle}</strong>
                  <p>{item.right}</p>
                </div>
              </div>
              <p className="muted">{item.whyItMatters}</p>
            </article>
          ))}
        </div>
        <div className="callout callout-advisory">لا تتسرع: المطلوب قراءة السياق والفقد والتعطل الوظيفي قبل القفز إلى وسم تشخيصي.</div>
        <CheckBlock check={disorder.distinctionCheck} />
      </Section>

      <Section id="diagnosis" title="التشخيص">
        <div className="lecture-criteria-stack">
          {disorder.criteria.map((criterion) => (
            <article key={criterion.title} className="reference-card">
              <strong>{criterion.title}</strong>
              <div className="list">
                {criterion.rules.map((rule) => (
                  <div key={rule} className="list-item">
                    {rule}
                  </div>
                ))}
              </div>
              <p className="muted">{criterion.note}</p>
            </article>
          ))}
        </div>
        <CheckBlock check={disorder.diagnosticCheck} />
      </Section>

      <Section id="formation" title="التكوين المعرفي السلوكي">
        <div className="reference-card-grid">
          {disorder.formationFrameworks.map((framework) => (
            <article key={framework.title} className="reference-card">
              <strong>{framework.title}</strong>
              {framework.intro ? <p>{framework.intro}</p> : null}
              <div className="list">
                {framework.items.map((item) => (
                  <div key={item} className="list-item">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <CheckBlock check={disorder.formationCheck} />
      </Section>

      <Section id="roadmap" title="خريطة تدخل CBT">
        <div className="reference-sequence">
          {disorder.roadmapSteps.map((step, index) => (
            <article key={step.title} className="reference-sequence-card">
              <div className="sequence-index">{index + 1}</div>
              <div className="stack">
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="row">
          <div className="callout callout-official disorder-mini-note">من أين نبدأ؟ من المرحلة التي تسمح للمريض أن يدخل العمل فعلًا.</div>
          <div className="callout callout-advisory disorder-mini-note">متى لا تكون البداية معرفية خالصة؟ عندما تكون الطاقة والتركيز والدافعية منخفضة بشدة.</div>
        </div>
        <CheckBlock check={disorder.roadmapCheck} />
      </Section>

      <Section id="tools" title="الأدوات">
        <div className="stack">
          {disorder.toolsIntro.map((paragraph, index) => (
            <p key={`tool-intro-${index}`}>{paragraph}</p>
          ))}
        </div>
        <div className="worksheet-console">
          <aside className="worksheet-list">
            {disorder.tools.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                className={selectedTool === index ? "worksheet-list-item active" : "worksheet-list-item"}
                onClick={() => setSelectedTool(index)}
              >
                <strong>{item.name}</strong>
                <span>{item.whenUsed}</span>
              </button>
            ))}
          </aside>

          <section className="worksheet-detail panel stack">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <h3>{tool.name}</h3>
              <span className="badge">{tool.relatedWorksheet}</span>
            </div>

            <div className="reference-card-grid">
              <article className="reference-card">
                <strong>ما هي الأداة؟</strong>
                <p>{tool.what}</p>
              </article>
              <article className="reference-card">
                <strong>متى تستخدم؟</strong>
                <p>{tool.whenUsed}</p>
              </article>
              <article className="reference-card">
                <strong>متى لا تكون البداية المناسبة؟</strong>
                <p>{tool.whenNotFirst}</p>
              </article>
            </div>

            <article className="reference-card stack">
              <strong>كيف تستخدم خطوة بخطوة؟</strong>
              <div className="list">
                {tool.steps.map((step) => (
                  <div key={step} className="list-item">
                    {step}
                  </div>
                ))}
              </div>
            </article>

            <div className="reference-card-grid">
              <article className="reference-card">
                <strong>مثال واضح</strong>
                <p>{tool.example}</p>
              </article>
              <article className="reference-card">
                <strong>أخطاء شائعة</strong>
                <div className="list">
                  {tool.commonMistakes.map((mistake) => (
                    <div key={mistake} className="list-item">
                      {mistake}
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="worksheet-grid">
              <div className="worksheet-preview large stack">
                <div className="worksheet-preview-title">النسخة الفارغة</div>
                {renderLayout(tool.layouts.blank)}
              </div>
              <div className="worksheet-preview large stack">
                <div className="worksheet-preview-title">النسخة التدريبية</div>
                {renderLayout(tool.layouts.guided)}
              </div>
              <div className="worksheet-preview large stack">
                <div className="worksheet-preview-title">مثال مملوء</div>
                {renderLayout(tool.layouts.filled)}
              </div>
            </div>

            <div className="worksheet-actions">
              {tool.downloads.blankPdf ? (
                <a className="lecture-action-link" href={tool.downloads.blankPdf} target="_blank" rel="noreferrer">
                  PDF فارغ
                </a>
              ) : null}
              {tool.downloads.blankXlsx ? (
                <a className="lecture-action-link" href={tool.downloads.blankXlsx}>
                  Excel فارغ
                </a>
              ) : null}
              {tool.downloads.guidedPdf ? (
                <a className="lecture-action-link" href={tool.downloads.guidedPdf} target="_blank" rel="noreferrer">
                  PDF تدريبي
                </a>
              ) : null}
              {tool.downloads.guidedXlsx ? (
                <a className="lecture-action-link" href={tool.downloads.guidedXlsx}>
                  Excel تدريبي
                </a>
              ) : null}
              {tool.downloads.filledPdf ? (
                <a className="lecture-action-link" href={tool.downloads.filledPdf} target="_blank" rel="noreferrer">
                  PDF مملوء
                </a>
              ) : null}
              {tool.downloads.filledXlsx ? (
                <a className="lecture-action-link" href={tool.downloads.filledXlsx}>
                  Excel مملوء
                </a>
              ) : null}
            </div>
          </section>
        </div>
      </Section>

      <Section id="training" title="التطبيقات والتدريب">
        <div className="stack">
          {disorder.trainingIntro.map((paragraph, index) => (
            <p key={`training-${index}`}>{paragraph}</p>
          ))}
        </div>
        <div className="reference-card-grid">
          {disorder.trainingExercises.map((exercise) => (
            <article key={exercise.title} className="reference-card">
              <strong>{exercise.title}</strong>
              <p>{exercise.goal}</p>
              <p>{exercise.task}</p>
              <div className="callout callout-official">{exercise.outputHint}</div>
            </article>
          ))}
        </div>
        <CheckBlock check={disorder.trainingCheck} />
      </Section>

      <Section id="risk" title="الخطر والانتباه السريري">
        <div className="stack">
          {disorder.riskIntro.map((paragraph, index) => (
            <p key={`risk-${index}`}>{paragraph}</p>
          ))}
        </div>
        <div className="reference-sequence">
          {disorder.riskStages.map((stage, index) => (
            <article key={stage.title} className="reference-sequence-card">
              <div className="sequence-index">{index + 1}</div>
              <div className="stack">
                <strong>{stage.title}</strong>
                <p>{stage.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="callout callout-advisory">متى يتوقف الشرح ويبدأ الانتباه السريري؟ عندما يتحرك الحديث من الألم العام إلى نية أو خطة أو استعداد أو محاولة.</div>
        <CheckBlock check={disorder.riskCheck} />
      </Section>

      <Section id="case-study" title="الحالة التدريبية">
        <article className="reference-card stack">
          <strong>{disorder.caseStudy.title}</strong>
          <p>{disorder.caseStudy.opening}</p>
        </article>
        <div className="reference-sequence">
          {disorder.caseStudy.stages.map((stage, index) => (
            <article key={stage.title} className="reference-sequence-card">
              <div className="sequence-index">{index + 1}</div>
              <div className="stack">
                <strong>{stage.title}</strong>
                <p>{stage.content}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="reference-card-grid">
          <article className="reference-card">
            <strong>الواجب والمتابعة</strong>
            <p>{disorder.caseStudy.homework}</p>
          </article>
          <article className="reference-card">
            <strong>تأمل التقدم</strong>
            <p>{disorder.caseStudy.progressReflection}</p>
          </article>
        </div>
      </Section>

      <Section id="quiz" title="الاختبار">
        <div className="stack">
          {disorder.quizIntro.map((paragraph, index) => (
            <p key={`quiz-intro-${index}`}>{paragraph}</p>
          ))}
        </div>
        <div className="stack">
          {disorder.quiz.map((question, index) => (
            <QuizQuestion key={question.prompt} question={question} index={index} />
          ))}
        </div>
      </Section>

      <Section id="references" title="الملفات المرجعية">
        <div className="reference-card-grid">
          {disorder.references.map((reference) => (
            <article key={reference.id} className="reference-card stack">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <strong>{reference.name}</strong>
                <span className="badge">{reference.fileType}</span>
              </div>
              <p>{reference.role}</p>
              <div className="list">
                {reference.reviewFocus.map((item) => (
                  <div key={item} className="list-item">
                    {item}
                  </div>
                ))}
              </div>
              <div className="worksheet-actions">
                <a href={reference.viewHref} className="lecture-action-link">
                  عرض داخل المشروع
                </a>
                <a href={reference.downloadHref} className="lecture-action-link" download>
                  تنزيل مباشر
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="recap" title="الخلاصة">
        <div className="list">
          {disorder.recap.map((item) => (
            <div key={item} className="list-item">
              {item}
            </div>
          ))}
        </div>
        <div className="callout callout-official">
          <strong>أهم ما يجب أن يخرج به المتدرب</strong>
          <p>{disorder.nextFocus}</p>
        </div>
      </Section>
    </div>
  );
}
