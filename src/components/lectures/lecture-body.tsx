import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LectureBody({
  body,
  title,
  dir,
  primaryLabel
}: {
  body: string;
  title: string;
  dir: "rtl" | "ltr";
  primaryLabel: string;
}) {
  return (
    <section id="full-lesson" className="panel lecture-body-section stack" dir={dir}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2>{title}</h2>
        <span className="badge authority-badge">{primaryLabel}</span>
      </div>
      <div className="lecture-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </section>
  );
}
