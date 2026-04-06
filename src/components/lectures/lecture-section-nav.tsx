type LectureSectionNavItem = {
  id: string;
  label: string;
};

export function LectureSectionNav({
  items,
  title,
  badge
}: {
  items: LectureSectionNavItem[];
  title: string;
  badge: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="panel lecture-section-nav stack">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2>{title}</h2>
        <span className="badge">{badge}</span>
      </div>
      <div className="lecture-link-row">
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="reference-link-chip secondary">
            {item.label}
          </a>
        ))}
      </div>
    </section>
  );
}
