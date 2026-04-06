import Link from "next/link";
import { getCurrentLanguage } from "../../src/lib/app/runtime-language";
import { listLectures } from "../../src/lib/content/lectures";
import { t } from "../../src/lib/i18n/messages";

const contentTypeLabelKey = {
  conceptual: "lectureTypeConceptual",
  diagnostic: "lectureTypeDiagnostic",
  structural: "lectureTypeStructural",
  practical: "lectureTypePractical",
  mixed: "lectureTypeMixed"
} as const;

export default async function LecturesPage() {
  const language = await getCurrentLanguage();
  const lectures = await listLectures();

  return (
    <div className="page reference-page">
      <div>
        <h1>{t(language, "lecturesTitle")}</h1>
        <p className="muted">{t(language, "lecturesSubtitle")}</p>
      </div>

      <section className="panel lecture-hero stack">
        <span className="badge authority-badge">{t(language, "lecturesLayerBadge")}</span>
        <p>{t(language, "lecturesIntro")}</p>
      </section>

      <section className="lecture-list-grid">
        {lectures.map((lecture) => (
          <Link key={lecture.slug} href={`/lectures/${lecture.slug}`} className="panel lecture-list-card stack">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-label">
                {t(language, "lectureNumberLabel")} {lecture.lectureNumber}
              </span>
              <span className="badge">{t(language, contentTypeLabelKey[lecture.contentType])}</span>
            </div>
            <strong>{lecture.title}</strong>
            <p>{lecture.realTopic}</p>
            <p className="muted">{lecture.whyImportant}</p>
            <div className="lecture-chip-group">
              {lecture.tags.map((tag) => (
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
