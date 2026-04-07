"use client";

type LectureActionsProps = {
  printLabel: string;
  downloadLabel: string;
  downloadHref: string;
};

export function LectureActions({ printLabel, downloadLabel, downloadHref }: LectureActionsProps) {
  return (
    <div className="lecture-action-row print-hidden">
      <button type="button" className="secondary" onClick={() => window.print()}>
        {printLabel}
      </button>
      <a href={downloadHref} className="lecture-action-link">
        {downloadLabel}
      </a>
    </div>
  );
}
