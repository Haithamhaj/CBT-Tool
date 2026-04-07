import { LectureBlocks } from "./lecture-blocks";
import { LectureBody } from "./lecture-body";
import { LectureHeader } from "./lecture-header";
import type { Lecture } from "../../lib/content/lectures";
import type { AppLanguage } from "../../lib/i18n/shared";
import { directionForLanguage } from "../../lib/i18n/shared";
import { t } from "../../lib/i18n/messages";
import { LecturePdfTrigger } from "./lecture-pdf-trigger";

const contentTypeLabelKey = {
  conceptual: "lectureTypeConceptual",
  diagnostic: "lectureTypeDiagnostic",
  structural: "lectureTypeStructural",
  practical: "lectureTypePractical",
  mixed: "lectureTypeMixed"
} as const;

export function LecturePdfView({ lecture, language }: { lecture: Lecture; language: AppLanguage }) {
  const sectionLabels = {
    fullLesson: t(language, "lectureSectionFullLesson"),
    summaryCards: t(language, "lectureSectionSummaryCards"),
    concepts: t(language, "lectureSectionConcepts"),
    keyDistinctions: t(language, "lectureSectionDistinctions"),
    frameworks: t(language, "lectureSectionFrameworks"),
    symptomGroups: t(language, "lectureSectionSymptomGroups"),
    criteria: t(language, "lectureSectionCriteria"),
    stages: t(language, "lectureSectionStages"),
    tools: t(language, "lectureSectionTools"),
    warnings: t(language, "lectureSectionWarnings"),
    qaHighlights: t(language, "lectureSectionQA"),
    visualBlocks: t(language, "lectureSectionVisuals"),
    thinkingQuestions: t(language, "lectureSectionQuestions"),
    reflectionExercise: t(language, "lectureSectionExercise"),
    livingRecap: t(language, "lectureSectionRecap")
  };

  return (
    <div className="page lecture-page lecture-pdf-page">
      <LecturePdfTrigger />
      <section className="panel print-hidden lecture-pdf-banner stack">
        <strong>{t(language, "lecturePdfReadyTitle")}</strong>
        <p>{t(language, "lecturePdfReadyHint")}</p>
      </section>

      <LectureHeader
        lecture={lecture}
        contentTypeLabel={t(language, contentTypeLabelKey[lecture.contentType])}
        contentLanguageLabel={lecture.contentLanguage === "ar" ? t(language, "languageArabic") : t(language, "languageEnglish")}
        labels={{
          lectureNumber: t(language, "lectureNumberLabel"),
          realTopic: t(language, "lectureLabelRealTopic"),
          centralMessage: t(language, "lectureLabelCentralMessage"),
          whyImportant: t(language, "lectureLabelWhyImportant"),
          print: t(language, "lectureActionPrint"),
          pdf: t(language, "lectureActionPdf")
        }}
      />

      <LectureBody
        body={lecture.body}
        title={sectionLabels.fullLesson}
        dir={directionForLanguage(lecture.contentLanguage === "ar" ? "ar" : "en")}
        primaryLabel={t(language, "lecturePrimaryTextBadge")}
      />

      <LectureBlocks lecture={lecture} labels={sectionLabels} />
    </div>
  );
}
