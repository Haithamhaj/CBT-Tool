import type {
  CategoryClassifierResult,
  DriftDetectorResult,
  FeedbackCoachResult,
  RubricScores
} from "../../contracts";
import type {
  CategoryClassifierInput,
  DriftDetectorInput,
  EvaluatorProvider,
  FeedbackCoachInput,
  SessionSynthesizerInput
} from "./provider";
import type { AppLanguage } from "../i18n/shared";
import { labelForOutcome, translateRecommendation, translateRubricArea } from "../i18n/messages";

const emotionWords = ["anxious", "anxiety", "fear", "sad", "sadness", "shame", "angry", "hurt", "overwhelm"];
const thoughtSignals = ["i think", "i am going to", "they will", "it means", "i'll", "i will"];
const behaviorSignals = ["avoid", "avoids", "left", "leaves", "speaks", "checks", "sends", "withdraws", "stays"];
const situationSignals = ["when ", "manager", "meeting", "friend", "asks", "after ", "before "];

function classifyHeuristically(text: string, language: AppLanguage): CategoryClassifierResult {
  const normalized = text.toLowerCase();

  if (emotionWords.some((word) => normalized.includes(word))) {
    return {
      label: "emotion",
      confidence: 0.67,
      explanation: language === "ar" ? "النص يصف حالة انفعالية محسوسة في الغالب." : "The text mostly names a felt emotional state."
    };
  }

  if (thoughtSignals.some((signal) => normalized.includes(signal))) {
    return {
      label: "thought",
      confidence: 0.72,
      explanation: language === "ar" ? "النص يبدو كتفسير أو توقع أكثر من كونه شعورًا أو سلوكًا." : "The text looks like an interpretation or prediction rather than a feeling or action."
    };
  }

  if (behaviorSignals.some((signal) => normalized.includes(signal))) {
    return {
      label: "behavior",
      confidence: 0.62,
      explanation: language === "ar" ? "النص يصف غالبًا فعلًا ملحوظًا أو نمط استجابة." : "The text mostly describes an observable action or response pattern."
    };
  }

  if (situationSignals.some((signal) => normalized.includes(signal))) {
    return {
      label: "situation",
      confidence: 0.6,
      explanation: language === "ar" ? "النص يبدو أنه يصف موقفًا أو سياقًا." : "The text appears to describe an event or context."
    };
  }

  return {
    label: "ambiguous",
    confidence: 0.45,
    explanation: language === "ar" ? "النص لا ينتمي بوضوح إلى فئة معرفية سلوكية واحدة." : "The text does not clearly map to a single CBT category."
  };
}

function weakestRubricArea(rubricContext: RubricScores): string {
  return Object.entries(rubricContext).sort((left, right) => left[1] - right[1])[0]?.[0] ?? "questioning_quality";
}

function buildFeedbackFallback(input: FeedbackCoachInput): FeedbackCoachResult {
  const strengths: string[] = [];
  if (input.attemptText.trim().length >= 20) {
    strengths.push(
      input.language === "ar"
        ? "قدّمت محتوى كافيًا لمراجعة الخطوة بشكل مفيد."
        : "You provided enough content to review the step meaningfully."
    );
  }
  if (input.detectedIssues.length === 0) {
    strengths.push(
      input.language === "ar"
        ? "لم تظهر مشكلة حتمية مانعة في هذا الإرسال."
        : "No deterministic blocking issue was triggered on this submission."
    );
  }

  const topIssues =
    input.detectedIssues.slice(0, 3).length > 0
      ? input.detectedIssues.slice(0, 3)
      : [
          input.language === "ar"
            ? `حسّن ${weakestRubricArea(input.rubricContext)} للحصول على استجابة أقوى.`
            : `Improve ${weakestRubricArea(input.rubricContext)} for a stronger response.`
        ];

  const whyItMatters = topIssues.map((issue) => {
    if (issue.toLowerCase().includes("category")) {
      return input.language === "ar"
        ? "وضوح الفصل بين الفئات ضروري لصياغة معرفية سلوكية دقيقة."
        : "Clear category separation is necessary for accurate CBT formulation.";
    }
    if (issue.toLowerCase().includes("homework")) {
      return input.language === "ar"
        ? "ينبغي أن يخرج الواجب مباشرة من هدف الجلسة والأداة المختارة."
        : "Homework should follow directly from the session target and selected tool.";
    }
    return input.language === "ar"
      ? "هذا يؤثر في مدى قابلية الاستجابة للتعليم والتنظيم ومواءمتها لأسلوب العلاج المعرفي السلوكي."
      : "This affects whether the response is teachable, structured, and aligned with CBT method.";
  });

  return {
    what_was_done_well: strengths.slice(0, 3),
    top_issues: topIssues,
    why_it_matters: whyItMatters.slice(0, 3),
    next_revision: topIssues[0]
      ? input.language === "ar"
        ? `ابدأ التعديل بهذا أولًا: ${topIssues[0]}`
        : `Revise the response by addressing this first: ${topIssues[0]}`
      : input.language === "ar"
        ? "عدّل الاستجابة بجعل الهدف المعرفي السلوكي ومبرره أوضح."
        : "Revise the response by making the CBT target and rationale more explicit."
  };
}

function buildSessionSynthesizerFallback(input: SessionSynthesizerInput) {
  return {
    session_summary: input.language === "ar"
      ? `انتهت الجلسة بنتيجة ${labelForOutcome("ar", input.scoreSnapshot.outcome)} وكانت الحاجة التعليمية الأوضح هي إبقاء العمل متوافقًا مع أهم إشارات المراجعة.`
      : `The session completed with a ${input.scoreSnapshot.outcome} outcome and the main learning need was keeping the work aligned with the strongest review signals.`,
    primary_learning_pattern: input.scoreSnapshot.top_issues[0]
      ? input.language === "ar"
        ? `كان النمط الأبرز هو الصعوبة في ${input.scoreSnapshot.top_issues[0].toLowerCase()}.`
        : `The dominant pattern was difficulty with ${input.scoreSnapshot.top_issues[0].toLowerCase()}.`
      : input.language === "ar"
        ? "كان النمط الأبرز هو الحفاظ على بنية معرفية سلوكية متماسكة عبر الجلسة."
        : "The dominant pattern was maintaining a coherent CBT structure across the session.",
    evidence_based_strengths: [
      input.language === "ar"
        ? `وصلت الجلسة إلى المراجعة بعد ${input.attempts.length} محاولة مسجلة.`
        : `The session reached review with ${input.attempts.length} recorded attempt${input.attempts.length === 1 ? "" : "s"}.`
    ],
    priority_improvement_area: input.scoreSnapshot.priority_skill
      ? input.language === "ar"
        ? `أولوية التحسين هي ${translateRubricArea("ar", input.scoreSnapshot.priority_skill)}.`
        : `The priority improvement area is ${input.scoreSnapshot.priority_skill.replaceAll("_", " ")}.`
      : input.language === "ar"
        ? "أولوية التحسين هي تقوية أضعف مجال في التقييم."
        : "The priority improvement area is strengthening the weakest scored domain.",
    recommended_next_focus: input.language === "ar"
      ? `ينبغي أن يركز التدريب القادم على ${translateRecommendation("ar", input.scoreSnapshot.recommended_next_practice_area)}.`
      : `Next practice should focus on ${translateRecommendation("en", input.scoreSnapshot.recommended_next_practice_area)}.`,
    confidence: 0.62
  };
}

export class FallbackEvaluatorProvider implements EvaluatorProvider {
  async classifyCategory(input: CategoryClassifierInput): Promise<CategoryClassifierResult> {
    return classifyHeuristically(input.text, input.language);
  }

  async detectDrift(_input: DriftDetectorInput): Promise<DriftDetectorResult> {
    return {
      ai_drifts: []
    };
  }

  async coachFeedback(input: FeedbackCoachInput): Promise<FeedbackCoachResult> {
    return buildFeedbackFallback(input);
  }

  async synthesizeSession(input: SessionSynthesizerInput) {
    return buildSessionSynthesizerFallback(input);
  }
}
