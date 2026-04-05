type PathwayStep = {
  title: string;
  description: string;
};

type PathwayDiagramProps = {
  title?: string;
  steps: PathwayStep[];
  rtl?: boolean;
};

export function PathwayDiagram({ title, steps, rtl = false }: PathwayDiagramProps) {
  return (
    <div className="stack">
      {title ? <h3>{title}</h3> : null}
      <div className="reference-pathway">
        {steps.map((step, index) => (
          <div key={step.title} className="reference-pathway-wrap">
            <article className="reference-pathway-card">
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </article>
            {index < steps.length - 1 ? (
              <div className="reference-pathway-arrow" aria-hidden="true">
                {rtl ? "←" : "→"}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
