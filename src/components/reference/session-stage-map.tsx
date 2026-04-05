type SessionStageItem = {
  title: string;
  focus: string;
  tools: string[];
  output: string;
};

type SessionStageMapProps = {
  title?: string;
  items: SessionStageItem[];
};

export function SessionStageMap({ title, items }: SessionStageMapProps) {
  return (
    <div className="stack">
      {title ? <h3>{title}</h3> : null}
      <div className="reference-stage-map">
        {items.map((item, index) => (
          <article key={item.title} className="reference-stage-card">
            <div className="reference-stage-number">{index + 1}</div>
            <div className="stack">
              <strong>{item.title}</strong>
              <div className="muted">{item.focus}</div>
              <div className="reference-inline-chips">
                {item.tools.map((tool) => (
                  <span key={tool} className="badge subtle">
                    {tool}
                  </span>
                ))}
              </div>
              <div className="detail-callout">
                <strong>→</strong>
                <div>{item.output}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
