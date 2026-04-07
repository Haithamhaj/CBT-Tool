import { notFound } from "next/navigation";
import { LectureBlocks } from "../../../src/components/lectures/lecture-blocks";
import { LectureBody } from "../../../src/components/lectures/lecture-body";
import { LectureHeader } from "../../../src/components/lectures/lecture-header";
import { LectureSectionNav } from "../../../src/components/lectures/lecture-section-nav";
import { getCurrentLanguage } from "../../../src/lib/app/runtime-language";
import { getLectureBySlug, getLectureSlugs } from "../../../src/lib/content/lectures";
import { directionForLanguage } from "../../../src/lib/i18n/shared";
import { t } from "../../../src/lib/i18n/messages";

const contentTypeLabelKey = {
  conceptual: "lectureTypeConceptual",
  diagnostic: "lectureTypeDiagnostic",
  structural: "lectureTypeStructural",
  practical: "lectureTypePractical",
  mixed: "lectureTypeMixed"
} as const;

export async function generateStaticParams() {
  const slugs = await getLectureSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function LectureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lecture = await getLectureBySlug(slug);
  const language = await getCurrentLanguage();

  if (!lecture) {
    notFound();
  }

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

  const navItems = [
    { id: "full-lesson", label: sectionLabels.fullLesson },
    ...(lecture.concepts?.length ? [{ id: "concepts", label: sectionLabels.concepts }] : []),
    ...(lecture.keyDistinctions?.length ? [{ id: "distinctions", label: sectionLabels.keyDistinctions }] : []),
    ...(lecture.frameworks?.length ? [{ id: "frameworks", label: sectionLabels.frameworks }] : []),
    ...(lecture.symptomGroups?.length ? [{ id: "symptom-groups", label: sectionLabels.symptomGroups }] : []),
    ...(lecture.criteria?.length ? [{ id: "criteria", label: sectionLabels.criteria }] : []),
    ...(lecture.stages?.length ? [{ id: "stages", label: sectionLabels.stages }] : []),
    ...(lecture.tools?.length ? [{ id: "tools", label: sectionLabels.tools }] : []),
    ...(lecture.warnings?.length || lecture.misconceptions?.length ? [{ id: "warnings", label: sectionLabels.warnings }] : []),
    ...(lecture.qaHighlights?.length ? [{ id: "qa-highlights", label: sectionLabels.qaHighlights }] : []),
    ...(lecture.visualBlocks?.length ? [{ id: "visual-blocks", label: sectionLabels.visualBlocks }] : []),
    ...(lecture.thinkingQuestions?.length ? [{ id: "thinking-questions", label: sectionLabels.thinkingQuestions }] : []),
    ...(lecture.reflectionExercise ? [{ id: "reflection-exercise", label: sectionLabels.reflectionExercise }] : []),
    ...(lecture.livingRecap ? [{ id: "living-recap", label: sectionLabels.livingRecap }] : [])
  ];

  return (
    <div className="page lecture-page">
      <LectureHeader
        lecture={lecture}
        contentTypeLabel={t(language, contentTypeLabelKey[lecture.contentType])}
        contentLanguageLabel={lecture.contentLanguage === "ar" ? t(language, "languageArabic") : t(language, "languageEnglish")}
        pdfHref={`/lectures/${lecture.slug}/pdf`}
        labels={{
          lectureNumber: t(language, "lectureNumberLabel"),
          realTopic: t(language, "lectureLabelRealTopic"),
          centralMessage: t(language, "lectureLabelCentralMessage"),
          whyImportant: t(language, "lectureLabelWhyImportant"),
          print: t(language, "lectureActionPrint"),
          pdf: t(language, "lectureActionPdf")
        }}
      />

      <LectureSectionNav
        items={navItems}
        title={t(language, "lectureSectionNavTitle")}
        badge={t(language, "lectureSectionNavBadge")}
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
