import type { AppLanguage } from "./shared";

type RoadmapStatusLabels = {
  notStarted: string;
  inProgress: string;
  completed: string;
};

type RoadmapContent = {
  pageTitle: string;
  pageIntro: string;
  timelineTitle: string;
  flowTitle: string;
  flowIntro: string;
  summaryTitle: string;
  summaryText: string;
  whatToDoTitle: string;
  therapeuticBenefitTitle: string;
  whatNextTitle: string;
  doNotAdvanceTitle: string;
  nextStepLabel: string;
  warningLabel: string;
  structureTitle: string;
  checklistTitle: string;
  milestonesTitle: string;
  toolsTitle: string;
  homeworkTitle: string;
  outputTitle: string;
  statusTitle: string;
  progressTitle: string;
  openPdfLabel: string;
  referenceCtaLabel: string;
  referenceCtaHint: string;
  pdfReadyTitle: string;
  pdfReadyHint: string;
  savedHint: string;
  statusLabels: RoadmapStatusLabels;
};

const roadmapContent: Record<AppLanguage, RoadmapContent> = {
  en: {
    pageTitle: "5-Session CBT Roadmap",
    pageIntro:
      "Use this page as a training board for the early CBT formulation path. It keeps the full sequence visible, shows what each session must produce, and lets you track your own progress locally.",
    timelineTitle: "Session timeline",
    flowTitle: "Interactive session flow",
    flowIntro: "Select any session to see what happens in that step, why it matters, what comes next, and when you should not move forward yet.",
    summaryTitle: "How to use this board",
    summaryText:
      "Read the five sessions as one connected path: clarify the problem, sharpen the pattern, name distortions, reach deeper meaning, then convert the pattern into a treatment direction.",
    whatToDoTitle: "What do I do here?",
    therapeuticBenefitTitle: "What is the therapeutic benefit?",
    whatNextTitle: "What comes next?",
    doNotAdvanceTitle: "Do not move on yet if...",
    nextStepLabel: "Next step",
    warningLabel: "Do not advance yet if",
    structureTitle: "Session structure",
    checklistTitle: "Session checklist",
    milestonesTitle: "Readiness signs",
    toolsTitle: "Main tools",
    homeworkTitle: "Homework",
    outputTitle: "Expected output",
    statusTitle: "Status",
    progressTitle: "Checklist progress",
    openPdfLabel: "Print / Save as PDF",
    referenceCtaLabel: "Open the full roadmap board",
    referenceCtaHint: "Use the separate board when you want a larger visual map, checklist tracking, and printable output.",
    pdfReadyTitle: "Roadmap print view ready",
    pdfReadyHint: "The print dialog should open automatically with the same checklist state shown in the board.",
    savedHint: "Checklist changes are saved on this device only.",
    statusLabels: {
      notStarted: "Not started",
      inProgress: "In progress",
      completed: "Completed"
    }
  },
  ar: {
    pageTitle: "لوحة الجلسات الخمس في CBT",
    pageIntro:
      "استخدم هذه الصفحة كلوحة تدريبية لمسار الصياغة المبكر في العلاج المعرفي السلوكي. هي تعرض التسلسل كاملًا، وتوضح ماذا يفترض أن تنتجه كل جلسة، وتسمح لك بمتابعة تقدمك محليًا.",
    timelineTitle: "الخط الزمني للجلسات",
    flowTitle: "المسار التفاعلي للجلسات",
    flowIntro: "اختر أي جلسة لترى ماذا يحدث فيها، ولماذا هي مهمة، وماذا بعدها، ومتى لا ينبغي أن تنتقل بعد.",
    summaryTitle: "كيف تستخدم هذه اللوحة",
    summaryText:
      "اقرأ الجلسات الخمس كمسار واحد مترابط: توضيح المشكلة، ثم تحسين صورة النمط، ثم تسمية أخطاء التفكير، ثم الوصول إلى المعنى الأعمق، ثم تحويل ذلك إلى اتجاه علاجي.",
    whatToDoTitle: "ماذا أفعل هنا؟",
    therapeuticBenefitTitle: "ما الفائدة العلاجية؟",
    whatNextTitle: "ماذا بعد؟",
    doNotAdvanceTitle: "لا تنتقل إذا...",
    nextStepLabel: "الخطوة التالية",
    warningLabel: "لا تنتقل بعد إذا",
    structureTitle: "بنية الجلسة",
    checklistTitle: "قائمة متابعة الجلسة",
    milestonesTitle: "علامات الجاهزية",
    toolsTitle: "الأدوات الرئيسية",
    homeworkTitle: "الواجب",
    outputTitle: "المخرج المتوقع",
    statusTitle: "الحالة",
    progressTitle: "تقدم القائمة",
    openPdfLabel: "طباعة / تنزيل PDF",
    referenceCtaLabel: "افتح لوحة المتابعة الكاملة",
    referenceCtaHint: "استخدم اللوحة المستقلة عندما تريد خريطة أكبر، وتتبعًا بالقائمة، وإخراجًا قابلًا للطباعة.",
    pdfReadyTitle: "نسخة الطباعة للوحة المسار جاهزة",
    pdfReadyHint: "من المفترض أن تفتح نافذة الطباعة تلقائيًا مع نفس علامات الإنجاز الظاهرة في اللوحة.",
    savedHint: "تغييرات القائمة تُحفظ على هذا الجهاز فقط.",
    statusLabels: {
      notStarted: "غير مبدوءة",
      inProgress: "قيد المتابعة",
      completed: "مكتملة"
    }
  }
};

export function getSessionRoadmapContent(language: AppLanguage) {
  return roadmapContent[language];
}

export type { RoadmapContent, RoadmapStatusLabels };
