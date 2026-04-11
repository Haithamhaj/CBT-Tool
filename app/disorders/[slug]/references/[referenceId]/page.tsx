import Link from "next/link";
import { notFound } from "next/navigation";
import { getDisorderBySlug, getDisorderSlugs } from "../../../../../src/lib/content/disorders";

export async function generateStaticParams() {
  const slugs = await getDisorderSlugs();
  const disorders = await Promise.all(slugs.map((slug) => getDisorderBySlug(slug)));
  return disorders.flatMap((disorder) =>
    disorder ? disorder.references.map((reference) => ({ slug: disorder.slug, referenceId: reference.id })) : []
  );
}

export default async function DisorderReferencePage({
  params
}: {
  params: Promise<{ slug: string; referenceId: string }>;
}) {
  const { slug, referenceId } = await params;
  const disorder = await getDisorderBySlug(slug);

  if (!disorder) {
    notFound();
  }

  const reference = disorder.references.find((item) => item.id === referenceId);
  if (!reference) {
    notFound();
  }

  return (
    <div className="page disorder-reference-page">
      <header className="panel stack">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div className="stack" style={{ gap: 6 }}>
            <span className="section-label">مرجع أصلي</span>
            <h1>{reference.name}</h1>
          </div>
          <span className="badge authority-badge">{disorder.title}</span>
        </div>
        <p>{reference.role}</p>
        <div className="worksheet-actions">
          <Link href={`/disorders/${slug}`} className="lecture-action-link">
            العودة إلى الوحدة
          </Link>
          <a href={reference.downloadHref} className="lecture-action-link" download>
            تنزيل الملف
          </a>
        </div>
      </header>

      <section className="panel stack">
        <strong>ما الذي يُراجع هنا؟</strong>
        <div className="list">
          {reference.reviewFocus.map((item) => (
            <div key={item} className="list-item">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="panel disorder-reference-frame">
        <iframe src={reference.downloadHref} title={reference.name} className="disorder-reference-iframe" />
      </section>
    </div>
  );
}
