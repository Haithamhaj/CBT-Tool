import type { Lecture, LectureVisualBlock } from "../../lib/content/lectures";

function BlockSection({
  id,
  title,
  children
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="panel stack lecture-block-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function renderVisualBlock(block: LectureVisualBlock) {
  if (block.type === "group-grid" && "groups" in block.data) {
    return (
      <div className="lecture-group-grid">
        {block.data.groups.map((group) => (
          <article key={group.title} className="reference-card">
            <strong>{group.title}</strong>
            <div className="list">
              {group.items.map((item) => (
                <div key={item} className="list-item">
                  {item}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (block.type === "sequence" && "steps" in block.data) {
    return (
      <div className="reference-sequence">
        {block.data.steps.map((step, index) => (
          <article key={`${step.title}-${index}`} className="reference-sequence-card">
            <div className="sequence-index">{index + 1}</div>
            <div className="stack">
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (block.type === "comparison" && "rows" in block.data) {
    return (
      <div className="lecture-comparison">
        <div className="lecture-comparison-header">
          <strong>{block.data.leftTitle}</strong>
          <strong>{block.data.rightTitle}</strong>
        </div>
        {block.data.rows.map((row) => (
          <div key={row.label} className="lecture-comparison-row">
            <div className="lecture-comparison-cell">
              <span className="section-label">{row.label}</span>
              <p>{row.left}</p>
            </div>
            <div className="lecture-comparison-cell">
              <span className="section-label">{row.label}</span>
              <p>{row.right}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export function LectureBlocks({
  lecture,
  labels
}: {
  lecture: Lecture;
  labels: Record<string, string>;
}) {
  return (
    <>
      {lecture.summaryCards?.length ? (
        <BlockSection id="summary-cards" title={labels.summaryCards}>
          <div className="reference-card-grid">
            {lecture.summaryCards.map((card) => (
              <article key={card.title} className="reference-card">
                <strong>{card.title}</strong>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.concepts?.length ? (
        <BlockSection id="concepts" title={labels.concepts}>
          <div className="reference-card-grid">
            {lecture.concepts.map((concept) => (
              <article key={concept.term} className="reference-card">
                <strong>{concept.term}</strong>
                <p>{concept.definition}</p>
                <p className="muted">{concept.lectureMeaning}</p>
                {concept.misunderstanding ? <div className="callout callout-advisory">{concept.misunderstanding}</div> : null}
              </article>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.keyDistinctions?.length ? (
        <BlockSection id="distinctions" title={labels.keyDistinctions}>
          <div className="lecture-comparison-stack">
            {lecture.keyDistinctions.map((item) => (
              <article key={item.title} className="panel lecture-distinction-card">
                <strong>{item.title}</strong>
                <div className="lecture-distinction-grid">
                  <div className="callout callout-official">{item.sideA}</div>
                  <div className="callout callout-advisory">{item.sideB}</div>
                </div>
                <p className="muted">{item.whyItMatters}</p>
              </article>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.frameworks?.length ? (
        <BlockSection id="frameworks" title={labels.frameworks}>
          <div className="reference-card-grid">
            {lecture.frameworks.map((framework) => (
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
        </BlockSection>
      ) : null}

      {lecture.symptomGroups?.length ? (
        <BlockSection id="symptom-groups" title={labels.symptomGroups}>
          <div className="reference-card-grid">
            {lecture.symptomGroups.map((group) => (
              <article key={group.groupName} className="reference-card">
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{group.groupName}</strong>
                  {group.count ? <span className="badge">{group.count}</span> : null}
                </div>
                <div className="list">
                  {group.items.map((item) => (
                    <div key={item} className="list-item">
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.criteria?.length ? (
        <BlockSection id="criteria" title={labels.criteria}>
          <div className="lecture-criteria-stack">
            {lecture.criteria.map((criterion) => (
              <article key={criterion.title} className="reference-card">
                <strong>{criterion.title}</strong>
                <div className="list">
                  {criterion.rules.map((rule) => (
                    <div key={rule} className="list-item">
                      {rule}
                    </div>
                  ))}
                </div>
                {criterion.note ? <p className="muted">{criterion.note}</p> : null}
              </article>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.stages?.length ? (
        <BlockSection id="stages" title={labels.stages}>
          <div className="reference-sequence">
            {lecture.stages.map((stage, index) => (
              <article key={stage.title} className="reference-sequence-card">
                <div className="sequence-index">{index + 1}</div>
                <div className="stack">
                  <strong>{stage.title}</strong>
                  <p>{stage.description}</p>
                  {stage.markers?.length ? (
                    <div className="list">
                      {stage.markers.map((marker) => (
                        <div key={marker} className="list-item">
                          {marker}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.tools?.length ? (
        <BlockSection id="tools" title={labels.tools}>
          <div className="reference-card-grid">
            {lecture.tools.map((tool) => (
              <article key={tool.name} className="reference-card">
                <strong>{tool.name}</strong>
                <p>{tool.purpose}</p>
                {tool.whenUsed ? <p className="muted">{tool.whenUsed}</p> : null}
                {tool.warning ? <div className="callout callout-advisory">{tool.warning}</div> : null}
              </article>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.warnings?.length || lecture.misconceptions?.length ? (
        <BlockSection id="warnings" title={labels.warnings}>
          {lecture.warnings?.length ? (
            <div className="stack">
              {lecture.warnings.map((warning) => (
                <article key={warning.title} className="callout callout-advisory stack">
                  <strong>{warning.title}</strong>
                  <p>{warning.text}</p>
                </article>
              ))}
            </div>
          ) : null}
          {lecture.misconceptions?.length ? (
            <div className="lecture-misconception-grid">
              {lecture.misconceptions.map((item) => (
                <article key={item.mistake} className="reference-card">
                  <strong>{item.mistake}</strong>
                  <p>{item.correction}</p>
                </article>
              ))}
            </div>
          ) : null}
        </BlockSection>
      ) : null}

      {lecture.qaHighlights?.length ? (
        <BlockSection id="qa-highlights" title={labels.qaHighlights}>
          <div className="stack">
            {lecture.qaHighlights.map((qa) => (
              <article key={qa.question} className="panel stack">
                <strong>{qa.question}</strong>
                <p>{qa.answer}</p>
                {qa.whyItMatters ? <p className="muted">{qa.whyItMatters}</p> : null}
              </article>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.visualBlocks?.length ? (
        <BlockSection id="visual-blocks" title={labels.visualBlocks}>
          <div className="stack">
            {lecture.visualBlocks.map((block) => (
              <article key={`${block.type}-${block.title}`} className="stack">
                <strong>{block.title}</strong>
                {renderVisualBlock(block)}
              </article>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.thinkingQuestions?.length ? (
        <BlockSection id="thinking-questions" title={labels.thinkingQuestions}>
          <div className="list">
            {lecture.thinkingQuestions.map((question) => (
              <div key={question} className="list-item">
                {question}
              </div>
            ))}
          </div>
        </BlockSection>
      ) : null}

      {lecture.reflectionExercise ? (
        <BlockSection id="reflection-exercise" title={labels.reflectionExercise}>
          <article className="panel stack">
            <strong>{lecture.reflectionExercise.title}</strong>
            <p>{lecture.reflectionExercise.prompt}</p>
            {lecture.reflectionExercise.steps?.length ? (
              <div className="list">
                {lecture.reflectionExercise.steps.map((step) => (
                  <div key={step} className="list-item">
                    {step}
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        </BlockSection>
      ) : null}

      {lecture.livingRecap ? (
        <BlockSection id="living-recap" title={labels.livingRecap}>
          <article className="panel stack">
            <strong>{lecture.livingRecap.title}</strong>
            <div className="list">
              {lecture.livingRecap.bullets.map((bullet) => (
                <div key={bullet} className="list-item">
                  {bullet}
                </div>
              ))}
            </div>
          </article>
        </BlockSection>
      ) : null}
    </>
  );
}
