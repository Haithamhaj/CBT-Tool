type SequenceDiagramProps = {
  title?: string;
  nodes: string[];
  numbered?: boolean;
  rtl?: boolean;
};

export function SequenceDiagram({ title, nodes, numbered = false, rtl = false }: SequenceDiagramProps) {
  return (
    <div className="stack">
      {title ? <h3>{title}</h3> : null}
      <div className="reference-flow">
        {nodes.map((node, index) => (
          <div key={`${node}-${index}`} className="reference-flow-wrap">
            <div className={numbered ? "reference-flow-node numbered" : "reference-flow-node"}>{node}</div>
            {index < nodes.length - 1 ? (
              <div className="reference-flow-arrow" aria-hidden="true">
                {rtl ? "←" : "→"}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
