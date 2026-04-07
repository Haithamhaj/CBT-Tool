import { LectureActions } from "./lecture-actions";
import type { Lecture } from "../../lib/content/lectures";

type LectureHeaderProps = {
  lecture: Lecture;
  contentTypeLabel: string;
  contentLanguageLabel: string;
  pdfHref?: string;
  labels: {
    lectureNumber: string;
    realTopic: string;
    centralMessage: string;
    whyImportant: string;
    print: string;
    pdf: string;
  };
};

export function LectureHeader({ lecture, contentTypeLabel, contentLanguageLabel, pdfHref, labels }: LectureHeaderProps) {
  return (
    <header className="panel lecture-header stack">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="stack" style={{ gap: 6 }}>
          <span className="section-label">
            {labels.lectureNumber} {lecture.lectureNumber}
          </span>
          <h1 className="lecture-title">{lecture.title}</h1>
        </div>
        <div className="lecture-chip-group">
          <span className="badge authority-badge">{contentTypeLabel}</span>
          <span className="badge">{contentLanguageLabel}</span>
        </div>
      </div>

      {pdfHref ? (
        <LectureActions
          printLabel={labels.print}
          pdfLabel={labels.pdf}
          pdfHref={pdfHref}
          lectureSlug={lecture.slug}
        />
      ) : null}

      <div className="lecture-meta-grid">
        <article className="lecture-meta-card">
          <strong>{labels.realTopic}</strong>
          <p>{lecture.realTopic}</p>
        </article>
        <article className="lecture-meta-card">
          <strong>{labels.centralMessage}</strong>
          <p>{lecture.centralMessage}</p>
        </article>
        <article className="lecture-meta-card">
          <strong>{labels.whyImportant}</strong>
          <p>{lecture.whyImportant}</p>
        </article>
      </div>

      <div className="lecture-chip-group">
        {lecture.tags.map((tag) => (
          <span key={tag} className="badge">
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
}
