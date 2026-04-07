"use client";

type LectureActionsProps = {
  printLabel: string;
  pdfLabel: string;
  pdfHref: string;
};

export function LectureActions({ printLabel, pdfLabel, pdfHref }: LectureActionsProps) {
  return (
    <div className="lecture-action-row print-hidden">
      <button type="button" className="secondary" onClick={() => window.print()}>
        {printLabel}
      </button>
      <a href={pdfHref} target="_blank" rel="noreferrer" className="lecture-action-link">
        {pdfLabel}
      </a>
    </div>
  );
}
