"use client";

import { trackEvent } from "../../lib/app/analytics-client";

type LectureActionsProps = {
  printLabel: string;
  pdfLabel: string;
  pdfHref: string;
  lectureSlug: string;
};

export function LectureActions({ printLabel, pdfLabel, pdfHref, lectureSlug }: LectureActionsProps) {
  return (
    <div className="lecture-action-row print-hidden">
      <button
        type="button"
        className="secondary"
        onClick={() => {
          void trackEvent({
            eventName: "lecture_print_clicked",
            route: "/lectures/[slug]",
            lectureSlug
          });
          window.print();
        }}
      >
        {printLabel}
      </button>
      <a href={pdfHref} target="_blank" rel="noreferrer" className="lecture-action-link">
        {pdfLabel}
      </a>
    </div>
  );
}
