type Layer = {
  title: string;
  description: string;
  example?: string;
};

type LayerDiagramProps = {
  title?: string;
  layers: Layer[];
};

export function LayerDiagram({ title, layers }: LayerDiagramProps) {
  return (
    <div className="stack">
      {title ? <h3>{title}</h3> : null}
      <div className="reference-layer-diagram">
        {layers.map((layer, index) => (
          <div key={layer.title} className="reference-layer-step">
            <div className="reference-layer-card">
              <strong>{layer.title}</strong>
              <p>{layer.description}</p>
              {layer.example ? <div className="muted">{layer.example}</div> : null}
            </div>
            {index < layers.length - 1 ? <div className="reference-layer-arrow">↓</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
