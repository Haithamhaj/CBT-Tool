type DecisionStep = {
  title: string;
  condition: string;
  outcome: string;
};

type DecisionFlowDiagramProps = {
  title?: string;
  steps: DecisionStep[];
};

export function DecisionFlowDiagram({ title, steps }: DecisionFlowDiagramProps) {
  return (
    <div className="stack">
      {title ? <h3>{title}</h3> : null}
      <div className="reference-decision-grid">
        {steps.map((step) => (
          <article key={step.title} className="reference-card decision-card">
            <strong>{step.title}</strong>
            <p>{step.condition}</p>
            <div className="detail-callout">
              <strong>→</strong>
              <div>{step.outcome}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
