import Link from "next/link";
import { listDisorders } from "../../src/lib/content/disorders";

export default async function DisordersPage() {
  const disorders = await listDisorders();

  return (
    <div className="page reference-page">
      <div>
        <h1>مكتبة الاضطرابات</h1>
        <p className="muted">وحدات تعليمية منظمة تجمع الفهم السريري، الصياغة المعرفية السلوكية، الأدوات، والملفات المرجعية.</p>
      </div>

      <section className="panel lecture-hero stack">
        <span className="badge authority-badge">طبقة جديدة</span>
        <p>هذه المكتبة منفصلة عن المحاضرات. كل وحدة تحفظ نفس البنية العالية الجودة حتى يمكن إعادة استخدامها مع الاكتئاب والقلق والوسواس وغيرها.</p>
      </section>

      <section className="lecture-list-grid">
        {disorders.map((disorder) => (
          <Link key={disorder.slug} href={`/disorders/${disorder.slug}`} className="panel lecture-list-card stack">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-label">وحدة اضطراب</span>
              <span className="badge">عربي</span>
            </div>
            <strong>{disorder.title}</strong>
            <p>{disorder.subtitle}</p>
            <p className="muted">{disorder.audience}</p>
            <div className="lecture-chip-group">
              {disorder.tags.map((tag) => (
                <span key={tag} className="badge">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
