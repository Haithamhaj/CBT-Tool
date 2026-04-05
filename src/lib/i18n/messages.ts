import type { AppLanguage } from "./shared";

type MessageValue = string | ((value?: string | number) => string);

const messages = {
  en: {
    appTitle: "CBT Reference Hub",
    appSubtitle: "Reference-first learning hub",
    navPracticeSetup: "Practice Setup",
    navSessions: "Sessions",
    navProgress: "Progress",
    navReferenceHub: "CBT Reference Hub",
    navAdmin: "Admin",
    logout: "Log out",
    language: "Language",
    languageArabic: "Arabic",
    languageEnglish: "English",
    loginTitle: "Log In",
    loginSubtitle: "Use your real database user record to enter the reference hub.",
    loginMagicLinkSubtitle: "Enter your email and we will send a Magic Link to open the reference hub.",
    loginDevFallbackSubtitle: "Supabase Auth is not configured in this environment, so development fallback login is active.",
    email: "Email",
    signIn: "Sign In",
    signingIn: "Signing in...",
    sendMagicLink: "Send Magic Link",
    magicLinkSent: "Magic Link sent. Check your email, then return through the link.",
    magicLinkCheckInboxTitle: "Check your email first",
    magicLinkCooldownNotice: (value) => `A login link was just sent. Wait ${value ?? 60}s before requesting another one, and use the newest email only.`,
    magicLinkResendIn: (value) => `Resend in ${value ?? 60}s`,
    magicLinkCooldownActive: (value) => `A login link was already sent. Wait ${value ?? 60}s, then try again only if needed.`,
    magicLinkDeliveryHelp: "If the email does not appear, check Spam or Junk, search for Supabase Auth, then request one new link only after the timer ends.",
    devFallbackMode: "Development fallback mode",
    devFallbackHint: "This local path uses seeded users only. It is not the production login flow.",
    authCallbackFailed: "The Magic Link callback could not complete. Request a new link and try again.",
    errorEmailRateLimit: "Too many email sign-in requests were sent. Please wait about a minute, then try again.",
    practiceSetupTitle: "Practice Setup",
    practiceSetupSubtitle: "Choose a case, match the stage and tool, then start the guided session.",
    case: "Case",
    stage: "Stage",
    tool: "Tool",
    sessionGoal: "Session goal",
    toolRationale: "Tool rationale",
    startSession: "Start Session",
    starting: "Starting...",
    sessionStepTitle: "Session Step",
    sessionStepSubtitle: "Complete the current step, then use the validation guidance before moving on.",
    caseContext: "Case context",
    currentStep: "Current step",
    sessionSummary: "Session summary",
    homework: "Homework",
    stepInput: "Step input",
    submitStep: "Submit Step",
    latestResult: "Latest result",
    validation: "Validation",
    blockingIssues: "What must be fixed",
    warnings: "What to improve",
    noDriftEvents: "No deterministic drift events were returned on the latest submission.",
    evaluatorOutput: "Evaluator output",
    review: "Review",
    reviewLoading: "Loading review...",
    officialReview: "Official Review",
    advisoryGuidance: "Advisory Guidance",
    scoreSummary: "Score Summary",
    deterministicDriftSummary: "Deterministic Drift Summary",
    nextAction: "Next action",
    nextFocus: "Next focus",
    outcome: "Outcome",
    adjustedScore: "Adjusted score",
    rawScore: "Raw score",
    topIssue: "Top issue",
    didWell: "Did well",
    nextRevision: "Next revision",
    aiOnlyDriftHints: "AI-only Drift Hints",
    sessionSynthesis: "Session Synthesis",
    summary: "Summary",
    primaryLearningPattern: "Primary learning pattern",
    strength: "Strength",
    priorityImprovementArea: "Priority improvement area",
    recommendedNextFocus: "Recommended next focus",
    scorePending: "No score snapshot yet.",
    noDriftsRecorded: "No deterministic drift events were recorded for this session.",
    noAiDrifts: "No advisory AI-only drifts were detected for this session.",
    noSynthesisFocus: "No synthesis next focus is available yet.",
    reviewSubtitle: "Read the official review first. Use advisory guidance only to sharpen the next attempt.",
    advisoryNote: "Advisory only",
    deterministicNote: "Deterministic",
    authoritativeNote: "Authoritative",
    openReview: "Open Review",
    reviewUnavailable: "Review is not ready yet",
    reviewUnavailableHint: "Review appears only after the summary and homework step is submitted and scored.",
    loadingSession: "Loading session...",
    loadingProgress: "Loading progress...",
    loadingCases: "Loading cases...",
    progressTitle: "Progress",
    progressSubtitle: "Review recent sessions, repeated drifts, and the next practice recommendation.",
    referenceHubTitle: "CBT Reference Hub",
    referenceHubSubtitle: "A practical study map for quick review, structured learning, and fast return to core CBT material.",
    coreReference: "Core Reference",
    advancedReference: "Advanced Reference",
    averageScore: "Average score",
    nextPracticeArea: "Next practice area",
    recentSessions: "Recent Sessions",
    repeatedDriftPatterns: "Repeated Drift Patterns",
    noRecentSessions: "No recent sessions yet.",
    noRepeatedDrifts: "No repeated drift patterns yet.",
    occurrences: (value?: string | number) => `Occurrences: ${value ?? ""}`,
    sessionsTitle: "Recent Sessions",
    sessionsSubtitle: "Continue active work or open review only when the session is ready.",
    continue: "Continue",
    noSessions: "No sessions yet.",
    passed: "Passed",
    yes: "Yes",
    no: "No",
    provider: "Provider",
    source: "Source",
    fallback: "Fallback",
    fallbackReason: "Fallback reason",
    latency: (value?: string | number) => `${value ?? ""} ms`,
    statusReady: "Ready",
    statusInProgress: "In progress",
    statusBlockedValidation: "Blocked by validation",
    statusReviewPending: "Review pending",
    statusReviewed: "Reviewed",
    statusNeedsRevision: "Needs revision",
    statusCompleted: "Completed",
    stepGuidedInput: "Guided input",
    stepSummaryHomework: "Summary and homework",
    stageFoundations: "Foundations",
    stageSessionStructure: "Session structure",
    stageCoreTools: "Core tools",
    stageDeeperFormulation: "Deeper formulation",
    stageTreatmentPlanning: "Treatment planning",
    stageFullSimulation: "Full simulation",
    toolThoughtRecord: "Thought record",
    toolSocraticQuestioning: "Socratic questioning",
    toolDownwardArrow: "Downward arrow",
    toolBehavioralExperiment: "Behavioral experiment",
    toolActivityScheduling: "Activity scheduling",
    toolExposureHierarchy: "Exposure hierarchy",
    toolProblemSolving: "Problem solving",
    toolCoreBeliefWorksheet: "Core belief worksheet",
    toolAgendaSetting: "Agenda setting",
    toolSummaryAndHomework: "Summary and homework",
    toolHomeworkPlanning: "Homework planning",
    toolCaseFormulation: "Case formulation",
    severityMinor: "Minor",
    severityModerate: "Moderate",
    severityMajor: "Major",
    difficultyBeginner: "Beginner",
    difficultyIntermediate: "Intermediate",
    difficultyAdvanced: "Advanced",
    outcomeStrongPass: "Strong pass",
    outcomePass: "Pass",
    outcomeNeedsRevision: "Needs revision",
    outcomeFail: "Fail",
    placeholderSessionGoal: "State one focused learning goal for this session.",
    placeholderToolRationale: "Explain why this tool fits this case and stage.",
    placeholderStepInput: "Write the trainee response for this step.",
    placeholderSessionSummary: "Summarize the session briefly and concretely.",
    placeholderHomework: "Assign one realistic task that clearly follows from the session.",
    helpSessionGoal: "Write one clear learning target for this session. Be specific and short. Example: identify the main automatic thought before the meeting update.",
    helpToolRationale: "Write why this tool fits this case right now. Mention the match between the goal and the tool. Example: a thought record fits because the goal is to examine one anxious thought.",
    helpStepInput: "Write the actual CBT response you would say or write in this step. Stay specific to this case, not general advice. Example: 'The thought is: If I pause, they will think I am incompetent.'",
    helpSessionSummary: "Write 1 to 2 sentences about what became clear in the session. Name the main point, not every detail. Example: 'We linked the anxiety spike to a prediction about sounding unintelligent.'",
    helpHomework: "Write one small task the trainee can actually do after this session. Keep it concrete and linked to the tool. Example: 'Complete one thought record after the next team update.'",
    helpOfficialReview: "Read this section first. It gives the official result based on the rules and score. Use it to know whether the work passed or what must be fixed.",
    helpAdvisoryGuidance: "Read this after the official review. It gives extra coaching and patterns to learn from. It helps you improve, but it does not change the official result.",
    helpNextAction: "This tells you the main thing to do next. Follow this before anything else. Example: revise the homework so it matches the selected tool.",
    helpNextFocus: "This gives one optional practice focus for the next attempt. It is broader than the next action. Example: practice guided discovery instead of giving direct advice.",
    clearValidationGuidance: "Fix the blocking issue first, then submit again.",
    validationUnavailable: "Validation details are not available yet.",
    errorUnauthorized: "You need to sign in first.",
    errorEmailNotFound: "No user was found for that email in development fallback mode.",
    errorSessionNotFound: "This session could not be found.",
    errorCaseNotFound: "This case could not be found.",
    errorForbidden: "You do not have access to this record.",
    errorReviewUnavailable: "Review is not available yet. Complete the session first.",
    errorSessionNotAccepting: "This session is not accepting a submission right now.",
    errorUnsupportedStep: "This step is not supported in the MVP flow.",
    errorUnableLoadSession: "Unable to load the session.",
    errorUnableLoadReview: "Unable to load the review.",
    errorUnableLoadProgress: "Unable to load progress.",
    errorUnableLoadSessions: "Unable to load sessions.",
    errorUnableCreateSession: "Unable to create the session.",
    errorUnableStartSession: "Unable to start the session.",
    errorUnableSubmitStep: "Unable to submit the step.",
    validationSetupGoalMissing: "Add a specific session goal before starting.",
    validationSetupToolMismatch: "Choose a tool that fits the selected stage.",
    validationSetupRationaleMissing: "Explain why this tool fits the case and stage.",
    validationInputTooShort: "Add a fuller CBT response. The current step input is too short.",
    validationSummaryTooBrief: "Expand the session summary so it clearly states what was learned.",
    validationHomeworkExpected: "Review or carry forward prior homework because this case expects it.",
    validationHomeworkToolMismatch: "Rewrite the homework so it clearly fits the selected tool.",
    validationHomeworkOverloaded: "Narrow the homework to one focused and realistic task.",
    driftDr005Name: "Advice over guidance",
    driftDr005Message: "The response gives advice instead of guiding discovery.",
    driftDr005Action: "Ask a guided question that helps the trainee uncover the answer.",
    driftDr007Message: "The session ended without a clear summary.",
    driftDr007Action: "Add one concise summary before finishing review.",
    driftDr008Message: "The homework does not clearly follow from the tool or session goal.",
    driftDr008Action: "Rewrite the homework so it matches the selected tool and goal.",
    driftDr010Name: "Unsupported formulation",
    driftDr010Message: "The response makes a formulation claim that is not grounded in the presented material.",
    driftDr010Action: "Anchor the formulation in specific evidence from the case or keep it tentative.",
    driftDr012Message: "The homework is too broad or contains too many tasks.",
    driftDr012Action: "Reduce the homework to one small and clearly defined task.",
    recommendationSessionStructure: "Practice agenda setting, transitions, summary, and homework closure.",
    recommendationIdentificationAccuracy: "Practice distinguishing situation, thought, emotion, and behavior.",
    recommendationToolSelection: "Practice matching the tool to the training stage and case goal.",
    recommendationQuestioningQuality: "Practice guided discovery instead of direct advice.",
    recommendationFormulationQuality: "Practice building evidence-based formulations from case details.",
    recommendationSummaryHomework: "Practice concise summaries and tightly linked homework.",
    recommendationDefault: "Repeat a guided case at the same stage with targeted revision."
  },
  ar: {
    appTitle: "مرجع العلاج المعرفي السلوكي",
    appSubtitle: "منصة مرجعية تعليمية",
    navPracticeSetup: "إعداد الممارسة",
    navSessions: "الجلسات",
    navProgress: "التقدم",
    navReferenceHub: "مرجع العلاج المعرفي السلوكي",
    navAdmin: "لوحة الإدارة",
    logout: "تسجيل الخروج",
    language: "اللغة",
    languageArabic: "العربية",
    languageEnglish: "الإنجليزية",
    loginTitle: "تسجيل الدخول",
    loginSubtitle: "استخدم سجل المستخدم الحقيقي من قاعدة البيانات للدخول إلى المرجع.",
    loginMagicLinkSubtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابط دخول مباشر لفتح المرجع.",
    loginDevFallbackSubtitle: "مصادقة Supabase غير مفعلة في هذه البيئة، لذلك يعمل الآن مسار دخول محلي للتطوير فقط.",
    email: "البريد الإلكتروني",
    signIn: "دخول",
    signingIn: "جارٍ تسجيل الدخول...",
    sendMagicLink: "أرسل رابط الدخول",
    magicLinkSent: "تم إرسال رابط الدخول. افحص بريدك ثم ادخل عبر الرابط.",
    magicLinkCheckInboxTitle: "افحص بريدك أولًا",
    magicLinkCooldownNotice: (value) => `تم إرسال رابط دخول الآن. انتظر ${value ?? 60} ثانية قبل طلب رابط جديد، واستخدم أحدث رسالة فقط.`,
    magicLinkResendIn: (value) => `إعادة الإرسال خلال ${value ?? 60}ث`,
    magicLinkCooldownActive: (value) => `تم إرسال رابط دخول بالفعل. انتظر ${value ?? 60} ثانية ثم أعد المحاولة فقط إذا لزم.`,
    magicLinkDeliveryHelp: "إذا لم تجد الرسالة، افحص Spam أو Junk، وابحث عن Supabase Auth، ثم اطلب رابطًا جديدًا واحدًا فقط بعد انتهاء العداد.",
    devFallbackMode: "وضع التطوير المحلي",
    devFallbackHint: "هذا المسار المحلي يستخدم مستخدمين مزروعين فقط، وليس مسار الدخول الإنتاجي.",
    authCallbackFailed: "تعذر إكمال العودة من رابط الدخول. اطلب رابطًا جديدًا ثم حاول مرة أخرى.",
    errorEmailRateLimit: "تم إرسال طلبات دخول كثيرة عبر البريد. انتظر دقيقة تقريبًا ثم حاول مرة أخرى.",
    practiceSetupTitle: "إعداد الممارسة",
    practiceSetupSubtitle: "اختر الحالة، ثم طابق المرحلة والأداة، وبعدها ابدأ الجلسة الموجّهة.",
    case: "الحالة",
    stage: "المرحلة",
    tool: "الأداة",
    sessionGoal: "هدف الجلسة",
    toolRationale: "مبرر اختيار الأداة",
    startSession: "ابدأ الجلسة",
    starting: "جارٍ البدء...",
    sessionStepTitle: "خطوة الجلسة",
    sessionStepSubtitle: "أكمل الخطوة الحالية ثم استخدم توجيهات التحقق قبل الانتقال.",
    caseContext: "سياق الحالة",
    currentStep: "الخطوة الحالية",
    sessionSummary: "ملخص الجلسة",
    homework: "الواجب",
    stepInput: "مدخل الخطوة",
    submitStep: "إرسال الخطوة",
    latestResult: "أحدث نتيجة",
    validation: "التحقق",
    blockingIssues: "ما الذي يجب إصلاحه",
    warnings: "ما الذي يحتاج تحسينًا",
    noDriftEvents: "لم يتم إرجاع أي انحرافات حتمية في آخر إرسال.",
    evaluatorOutput: "مخرجات المقيم",
    review: "المراجعة",
    reviewLoading: "جارٍ تحميل المراجعة...",
    officialReview: "المراجعة الرسمية",
    advisoryGuidance: "الإرشاد المساند",
    scoreSummary: "ملخص الدرجة",
    deterministicDriftSummary: "ملخص الانحرافات الحتمية",
    nextAction: "الإجراء التالي",
    nextFocus: "التركيز التالي",
    outcome: "النتيجة",
    adjustedScore: "الدرجة المعدلة",
    rawScore: "الدرجة الخام",
    topIssue: "أهم مشكلة",
    didWell: "نقطة جيدة",
    nextRevision: "أقرب تعديل",
    aiOnlyDriftHints: "مؤشرات انحراف بالذكاء الاصطناعي فقط",
    sessionSynthesis: "خلاصة الجلسة",
    summary: "الخلاصة",
    primaryLearningPattern: "النمط التعلمي الأبرز",
    strength: "قوة ظاهرة",
    priorityImprovementArea: "أولوية التحسين",
    recommendedNextFocus: "التركيز المقترح التالي",
    scorePending: "لا توجد لقطة درجة بعد.",
    noDriftsRecorded: "لم يتم تسجيل أي انحرافات حتمية لهذه الجلسة.",
    noAiDrifts: "لم يتم رصد أي انحرافات استشارية خاصة بالذكاء الاصطناعي لهذه الجلسة.",
    noSynthesisFocus: "لا يوجد تركيز تالي متاح بعد.",
    reviewSubtitle: "ابدأ بالمراجعة الرسمية أولًا. استخدم الإرشاد المساند فقط لتحسين المحاولة التالية.",
    advisoryNote: "استشاري فقط",
    deterministicNote: "حتمي",
    authoritativeNote: "مرجعي",
    openReview: "افتح المراجعة",
    reviewUnavailable: "المراجعة ليست جاهزة بعد",
    reviewUnavailableHint: "تظهر المراجعة فقط بعد إرسال خطوة الملخص والواجب وحساب نتيجتها.",
    loadingSession: "جارٍ تحميل الجلسة...",
    loadingProgress: "جارٍ تحميل التقدم...",
    loadingCases: "جارٍ تحميل الحالات...",
    progressTitle: "التقدم",
    progressSubtitle: "راجع الجلسات الأخيرة، والانحرافات المتكررة، وتوصية الممارسة التالية.",
    referenceHubTitle: "مرجع العلاج المعرفي السلوكي",
    referenceHubSubtitle: "خريطة عملية للمراجعة السريعة والتعلّم المنظم والرجوع السريع إلى مادة CBT الأساسية.",
    coreReference: "المرجع الأساسي",
    advancedReference: "المرجع المتقدم",
    averageScore: "متوسط الدرجة",
    nextPracticeArea: "مجال الممارسة التالي",
    recentSessions: "الجلسات الأخيرة",
    repeatedDriftPatterns: "الانحرافات المتكررة",
    noRecentSessions: "لا توجد جلسات حديثة بعد.",
    noRepeatedDrifts: "لا توجد انحرافات متكررة بعد.",
    occurrences: (value?: string | number) => `عدد التكرارات: ${value ?? ""}`,
    sessionsTitle: "الجلسات الأخيرة",
    sessionsSubtitle: "أكمل العمل الجاري أو افتح المراجعة فقط عندما تصبح الجلسة جاهزة.",
    continue: "أكمل",
    noSessions: "لا توجد جلسات بعد.",
    passed: "نجح",
    yes: "نعم",
    no: "لا",
    provider: "المزوّد",
    source: "المصدر",
    fallback: "مسار احتياطي",
    fallbackReason: "سبب المسار الاحتياطي",
    latency: (value?: string | number) => `${value ?? ""} مللي ثانية`,
    statusReady: "جاهزة",
    statusInProgress: "قيد التنفيذ",
    statusBlockedValidation: "متوقفة بسبب التحقق",
    statusReviewPending: "بانتظار المراجعة",
    statusReviewed: "تمت مراجعتها",
    statusNeedsRevision: "تحتاج تعديلًا",
    statusCompleted: "مكتملة",
    stepGuidedInput: "الإدخال الموجّه",
    stepSummaryHomework: "الملخص والواجب",
    stageFoundations: "الأساسيات",
    stageSessionStructure: "بنية الجلسة",
    stageCoreTools: "الأدوات الأساسية",
    stageDeeperFormulation: "الصياغة الأعمق",
    stageTreatmentPlanning: "تخطيط العلاج",
    stageFullSimulation: "محاكاة كاملة",
    toolThoughtRecord: "سجل الأفكار",
    toolSocraticQuestioning: "الأسئلة السقراطية",
    toolDownwardArrow: "السهم الهابط",
    toolBehavioralExperiment: "تجربة سلوكية",
    toolActivityScheduling: "جدولة الأنشطة",
    toolExposureHierarchy: "تدرج التعرض",
    toolProblemSolving: "حل المشكلات",
    toolCoreBeliefWorksheet: "ورقة المعتقدات الجوهرية",
    toolAgendaSetting: "تحديد جدول الجلسة",
    toolSummaryAndHomework: "الملخص والواجب",
    toolHomeworkPlanning: "تخطيط الواجب",
    toolCaseFormulation: "صياغة الحالة",
    severityMinor: "بسيط",
    severityModerate: "متوسط",
    severityMajor: "كبير",
    difficultyBeginner: "مبتدئ",
    difficultyIntermediate: "متوسط",
    difficultyAdvanced: "متقدم",
    outcomeStrongPass: "نجاح قوي",
    outcomePass: "نجاح",
    outcomeNeedsRevision: "تحتاج تعديلًا",
    outcomeFail: "إخفاق",
    placeholderSessionGoal: "اكتب هدفًا تعليميًا واحدًا ومحددًا لهذه الجلسة.",
    placeholderToolRationale: "اشرح لماذا تناسب هذه الأداة هذه الحالة وهذه المرحلة.",
    placeholderStepInput: "اكتب استجابة المتدرب لهذه الخطوة.",
    placeholderSessionSummary: "اكتب ملخصًا قصيرًا وواضحًا لما خرجت به الجلسة.",
    placeholderHomework: "حدّد مهمة واحدة واقعية تنبثق مباشرة من الجلسة.",
    helpSessionGoal: "اكتب هدفًا تعليميًا واحدًا وواضحًا لهذه الجلسة. اجعله محددًا وقصيرًا. مثال: تحديد الفكرة التلقائية الأساسية قبل تحديث الاجتماع.",
    helpToolRationale: "اكتب لماذا تناسب هذه الأداة هذه الحالة الآن. اذكر العلاقة بين الهدف والأداة. مثال: يناسب سجل الأفكار هنا لأن الهدف هو فحص فكرة قلقة واحدة.",
    helpStepInput: "اكتب الاستجابة المعرفية السلوكية الفعلية التي ستقولها أو تكتبها في هذه الخطوة. ابقَ محددًا لهذه الحالة لا نصيحة عامة. مثال: 'الفكرة هي: إذا ترددت فسيظنون أنني غير كفء.'",
    helpSessionSummary: "اكتب جملة أو جملتين عن الشيء الرئيسي الذي اتضح في الجلسة. اذكر الفكرة الأساسية لا كل التفاصيل. مثال: 'ربطنا ارتفاع القلق بتوقع الظهور بمظهر غير ذكي.'",
    helpHomework: "اكتب مهمة واحدة صغيرة يمكن للمتدرب فعلها فعلًا بعد الجلسة. اجعلها محددة ومرتبطة بالأداة. مثال: 'أكمل سجل أفكار واحد بعد تحديث الفريق القادم.'",
    helpOfficialReview: "اقرأ هذا القسم أولًا. هنا تظهر النتيجة الرسمية المبنية على القواعد والدرجة. استخدمه لمعرفة هل نجح العمل أو ما الذي يجب إصلاحه.",
    helpAdvisoryGuidance: "اقرأ هذا بعد المراجعة الرسمية. هنا توجد ملاحظات تدريبية إضافية وأنماط مفيدة للتعلّم. تساعدك على التحسن لكنها لا تغيّر النتيجة الرسمية.",
    helpNextAction: "هذا يخبرك بأهم شيء يجب فعله الآن. اتبعه قبل أي شيء آخر. مثال: عدّل الواجب ليطابق الأداة المختارة.",
    helpNextFocus: "هذا يعطيك تركيزًا تدريبيًا اختياريًا للمحاولة القادمة. هو أوسع من الإجراء التالي. مثال: تدرّب على الاستكشاف الموجّه بدل إعطاء النصيحة المباشرة.",
    clearValidationGuidance: "أصلح المشكلة المانعة أولًا ثم أرسل مرة أخرى.",
    validationUnavailable: "تفاصيل التحقق غير متاحة بعد.",
    errorUnauthorized: "يجب تسجيل الدخول أولًا.",
    errorEmailNotFound: "لم يتم العثور على مستخدم لهذا البريد في وضع التطوير المحلي.",
    errorSessionNotFound: "تعذر العثور على هذه الجلسة.",
    errorCaseNotFound: "تعذر العثور على هذه الحالة.",
    errorForbidden: "لا تملك صلاحية الوصول إلى هذا السجل.",
    errorReviewUnavailable: "المراجعة غير متاحة بعد. أكمل الجلسة أولًا.",
    errorSessionNotAccepting: "هذه الجلسة لا تقبل إرسالًا في هذه اللحظة.",
    errorUnsupportedStep: "هذه الخطوة غير مدعومة في تدفق MVP.",
    errorUnableLoadSession: "تعذر تحميل الجلسة.",
    errorUnableLoadReview: "تعذر تحميل المراجعة.",
    errorUnableLoadProgress: "تعذر تحميل التقدم.",
    errorUnableLoadSessions: "تعذر تحميل الجلسات.",
    errorUnableCreateSession: "تعذر إنشاء الجلسة.",
    errorUnableStartSession: "تعذر بدء الجلسة.",
    errorUnableSubmitStep: "تعذر إرسال الخطوة.",
    validationSetupGoalMissing: "أضف هدفًا محددًا للجلسة قبل البدء.",
    validationSetupToolMismatch: "اختر أداة تناسب المرحلة المحددة.",
    validationSetupRationaleMissing: "اشرح لماذا تناسب هذه الأداة الحالة والمرحلة.",
    validationInputTooShort: "أضف استجابة علاجية أوسع. مدخل الخطوة الحالي قصير جدًا.",
    validationSummaryTooBrief: "وسّع ملخص الجلسة حتى يوضح ما الذي تم تعلمه بوضوح.",
    validationHomeworkExpected: "راجع الواجب السابق أو مهمة المتابعة لأن هذه الحالة تتوقع ذلك.",
    validationHomeworkToolMismatch: "أعد صياغة الواجب بحيث يتوافق بوضوح مع الأداة المختارة.",
    validationHomeworkOverloaded: "ضيّق الواجب إلى مهمة واحدة محددة وواقعية.",
    driftDr005Name: "نصيحة بدل الاستكشاف",
    driftDr005Message: "الاستجابة تقدم نصيحة مباشرة بدل توجيه الاكتشاف.",
    driftDr005Action: "استخدم سؤالًا موجهًا يساعد المتدرب على الوصول للإجابة بنفسه.",
    driftDr007Message: "انتهت الجلسة من دون ملخص واضح.",
    driftDr007Action: "أضف ملخصًا موجزًا واحدًا قبل إنهاء المراجعة.",
    driftDr008Message: "الواجب لا يرتبط بوضوح بالأداة أو بهدف الجلسة.",
    driftDr008Action: "أعد كتابة الواجب بحيث يطابق الأداة المختارة والهدف.",
    driftDr010Name: "صياغة غير مدعومة",
    driftDr010Message: "الاستجابة تتضمن صياغة غير مستندة إلى المادة المعروضة.",
    driftDr010Action: "اربط الصياغة بأدلة محددة من الحالة أو اجعلها أكثر تحفظًا.",
    driftDr012Message: "الواجب واسع جدًا أو يحتوي مهام كثيرة.",
    driftDr012Action: "حوّل الواجب إلى مهمة واحدة صغيرة ومحددة بوضوح.",
    recommendationSessionStructure: "تدرّب على وضع جدول الجلسة والانتقالات والملخص وإغلاق الواجب.",
    recommendationIdentificationAccuracy: "تدرّب على التمييز بين الموقف والفكرة والانفعال والسلوك.",
    recommendationToolSelection: "تدرّب على مواءمة الأداة مع المرحلة التدريبية وهدف الحالة.",
    recommendationQuestioningQuality: "تدرّب على الاستكشاف الموجّه بدل إعطاء النصيحة المباشرة.",
    recommendationFormulationQuality: "تدرّب على بناء صياغات قائمة على الأدلة من تفاصيل الحالة.",
    recommendationSummaryHomework: "تدرّب على كتابة ملخصات موجزة وربط الواجب بإحكام.",
    recommendationDefault: "أعد حالة موجهة في المرحلة نفسها مع تعديل مستهدف."
  }
} as const satisfies Record<AppLanguage, Record<string, MessageValue>>;

const stageLabelKeys: Record<string, keyof typeof messages.en> = {
  foundations: "stageFoundations",
  session_structure: "stageSessionStructure",
  core_tools: "stageCoreTools",
  deeper_formulation: "stageDeeperFormulation",
  treatment_planning: "stageTreatmentPlanning",
  full_simulation: "stageFullSimulation"
};

const toolLabelKeys: Record<string, keyof typeof messages.en> = {
  thought_record: "toolThoughtRecord",
  socratic_questioning: "toolSocraticQuestioning",
  downward_arrow: "toolDownwardArrow",
  behavioral_experiment: "toolBehavioralExperiment",
  activity_scheduling: "toolActivityScheduling",
  exposure_hierarchy: "toolExposureHierarchy",
  problem_solving: "toolProblemSolving",
  core_belief_worksheet: "toolCoreBeliefWorksheet",
  agenda_setting: "toolAgendaSetting",
  summary_and_homework: "toolSummaryAndHomework",
  homework_planning: "toolHomeworkPlanning",
  case_formulation: "toolCaseFormulation"
};

const stateLabelKeys: Record<string, keyof typeof messages.en> = {
  ready: "statusReady",
  in_progress: "statusInProgress",
  blocked_validation: "statusBlockedValidation",
  review_pending: "statusReviewPending",
  reviewed: "statusReviewed",
  needs_revision: "statusNeedsRevision",
  completed: "statusCompleted"
};

const stepLabelKeys: Record<string, keyof typeof messages.en> = {
  guided_input: "stepGuidedInput",
  summary_and_homework: "stepSummaryHomework"
};

const outcomeLabelKeys: Record<string, keyof typeof messages.en> = {
  strong_pass: "outcomeStrongPass",
  pass: "outcomePass",
  needs_revision: "outcomeNeedsRevision",
  fail: "outcomeFail"
};

const severityLabelKeys: Record<string, keyof typeof messages.en> = {
  minor: "severityMinor",
  moderate: "severityModerate",
  major: "severityMajor"
};

const exactServerTextKeys: Record<string, keyof typeof messages.en> = {
  "Session goal is required.": "validationSetupGoalMissing",
  "Selected tool is blocked for this stage.": "validationSetupToolMismatch",
  "Provide a brief rationale for the tool choice.": "validationSetupRationaleMissing",
  "Guided input is too short.": "validationInputTooShort",
  "Session summary is missing or too brief.": "validationSummaryTooBrief",
  "Homework review or carry-forward task is expected for this case.": "validationHomeworkExpected",
  "Homework does not align with the selected tool.": "validationHomeworkToolMismatch",
  "Homework appears overloaded and should be narrowed.": "validationHomeworkOverloaded",
  Unauthorized: "errorUnauthorized",
  "Session not found": "errorSessionNotFound",
  "Case not found": "errorCaseNotFound",
  Forbidden: "errorForbidden",
  "Review is not available for this session state": "errorReviewUnavailable",
  "Session is not accepting step submissions": "errorSessionNotAccepting",
  "Unsupported step submission for MVP": "errorUnsupportedStep",
  "Unable to load session.": "errorUnableLoadSession",
  "Unable to load review.": "errorUnableLoadReview",
  "Unable to load progress.": "errorUnableLoadProgress",
  "Unable to load sessions.": "errorUnableLoadSessions",
  "Unable to create the session.": "errorUnableCreateSession",
  "Unable to start the session.": "errorUnableStartSession",
  "Unable to submit step.": "errorUnableSubmitStep",
  "No user found for that email.": "errorEmailNotFound",
  "email rate limit exceeded": "errorEmailRateLimit",
  authCallbackFailed: "authCallbackFailed"
};

const recommendationKeys: Record<string, keyof typeof messages.en> = {
  "Practice agenda setting, transitions, summary, and homework closure.": "recommendationSessionStructure",
  "Practice distinguishing situation, thought, emotion, and behavior.": "recommendationIdentificationAccuracy",
  "Practice matching the tool to the training stage and case goal.": "recommendationToolSelection",
  "Practice guided discovery instead of direct advice.": "recommendationQuestioningQuality",
  "Practice building evidence-based formulations from case details.": "recommendationFormulationQuality",
  "Practice concise summaries and tightly linked homework.": "recommendationSummaryHomework",
  "Repeat a guided case at the same stage with targeted revision.": "recommendationDefault"
};

function resolveMessage(language: AppLanguage, key: string, value?: string | number) {
  const entry = (messages[language] as Record<string, MessageValue>)[key];
  if (!entry) {
    return key;
  }
  return typeof entry === "function" ? entry(value) : entry;
}

export function t(language: AppLanguage, key: keyof typeof messages.en, value?: string | number) {
  return resolveMessage(language, key, value);
}

export function labelForStage(language: AppLanguage, stage: string) {
  return t(language, stageLabelKeys[stage] ?? "stageFoundations");
}

export function labelForTool(language: AppLanguage, tool: string) {
  return t(language, toolLabelKeys[tool] ?? "tool");
}

export function labelForState(language: AppLanguage, state: string) {
  return t(language, stateLabelKeys[state] ?? "statusReady");
}

export function labelForStep(language: AppLanguage, step: string) {
  return t(language, stepLabelKeys[step] ?? "stepGuidedInput");
}

export function labelForOutcome(language: AppLanguage, outcome: string) {
  return t(language, outcomeLabelKeys[outcome] ?? "outcomeNeedsRevision");
}

export function labelForSeverity(language: AppLanguage, severity: string) {
  return t(language, severityLabelKeys[severity] ?? "severityModerate");
}

export function labelForDifficulty(language: AppLanguage, difficulty: string) {
  const map: Record<string, keyof typeof messages.en> = {
    beginner: "difficultyBeginner",
    intermediate: "difficultyIntermediate",
    advanced: "difficultyAdvanced"
  };
  return t(language, map[difficulty] ?? "difficultyBeginner");
}

export function translateServerText(language: AppLanguage, text: string | null | undefined) {
  if (!text) {
    return "";
  }
  const key = exactServerTextKeys[text];
  return key ? t(language, key) : text;
}

export function translateDriftMessage(language: AppLanguage, driftId: string, fallback: string) {
  const map: Record<string, keyof typeof messages.en> = {
    DR005: "driftDr005Message",
    DR007: "driftDr007Message",
    DR008: "driftDr008Message",
    DR010: "driftDr010Message",
    DR012: "driftDr012Message"
  };
  return map[driftId] ? t(language, map[driftId]) : fallback;
}

export function translateDriftAction(language: AppLanguage, driftId: string, fallback: string) {
  const map: Record<string, keyof typeof messages.en> = {
    DR005: "driftDr005Action",
    DR007: "driftDr007Action",
    DR008: "driftDr008Action",
    DR010: "driftDr010Action",
    DR012: "driftDr012Action"
  };
  return map[driftId] ? t(language, map[driftId]) : fallback;
}

export function translateRecommendation(language: AppLanguage, text: string | null | undefined) {
  if (!text) {
    return "";
  }
  const key = recommendationKeys[text];
  return key ? t(language, key) : text;
}

export function translateTopIssue(language: AppLanguage, issue: string) {
  if (issue.startsWith("DR")) {
    const [driftId] = issue.split(":");
    const remainder = issue.split(":").slice(1).join(":").trim();
    return remainder ? `${driftId}: ${translateDriftMessage(language, driftId, remainder)}` : issue;
  }

  const lowestRubricMatch = issue.match(/^Lowest rubric area: ([a-z_]+) \((\d+)\)$/);
  if (lowestRubricMatch) {
    const [, area, score] = lowestRubricMatch;
    return language === "ar"
      ? `أضعف مجال في الروبرك: ${translateRubricArea(language, area)} (${score})`
      : `Lowest rubric area: ${translateRubricArea(language, area)} (${score})`;
  }

  return translateServerText(language, issue);
}

export function translateRubricArea(language: AppLanguage, area: string) {
  const map: Record<string, string> = {
    session_structure: language === "ar" ? "بنية الجلسة" : "session structure",
    identification_accuracy: language === "ar" ? "دقة التمييز" : "identification accuracy",
    tool_selection: language === "ar" ? "اختيار الأداة" : "tool selection",
    questioning_quality: language === "ar" ? "جودة التساؤل" : "questioning quality",
    formulation_quality: language === "ar" ? "جودة الصياغة" : "formulation quality",
    summary_and_homework: language === "ar" ? "الملخص والواجب" : "summary and homework"
  };
  return map[area] ?? area.replaceAll("_", " ");
}
