import type { AppLanguage } from "./shared";

export type ReferenceTabId =
  | "overview"
  | "session-structure"
  | "five-sessions"
  | "tools"
  | "thinking"
  | "emotions"
  | "worksheets"
  | "goals"
  | "glossary"
  | "advanced";

type QuickStartItem = {
  id: string;
  title: string;
  description: string;
  tab: ReferenceTabId;
};

type Checklist = {
  title: string;
  useHint: string;
  items: string[];
};

type ToolOperationalMeta = {
  whenNot: string;
  expectedOutput: string;
  level: string;
  tags: string[];
  fitSigns: string[];
  starterMove: string;
};

type SessionFlowMeta = {
  focus: string;
};

type HubOperationalContent = {
  tabs: Array<{ id: ReferenceTabId; label: string }>;
  quickStartTitle: string;
  quickStartItems: QuickStartItem[];
  sectionHints: Record<ReferenceTabId, string>;
  diagrams: {
    cbtModelTitle: string;
    sessionFlowTitle: string;
    fiveSessionsTitle: string;
    cbtModelNodes: string[];
    sessionFlowNodes: string[];
    fiveSessionsNodes: string[];
  };
  checklistsTitle: string;
  checklists: Checklist[];
  toolsMeta: ToolOperationalMeta[];
  sessionMeta: SessionFlowMeta[];
  toolFields: {
    whenNot: string;
    expectedOutput: string;
    level: string;
    goal: string;
    mainFocus: string;
    mainTools: string;
    homework: string;
    expectedSessionOutput: string;
    useDuring: string;
    notStartingPoint: string;
  };
  emotionMapCenter: string;
};

const operationalContent: Record<AppLanguage, HubOperationalContent> = {
  en: {
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "session-structure", label: "Session Structure" },
      { id: "five-sessions", label: "Five Sessions Map" },
      { id: "tools", label: "Tools Library" },
      { id: "thinking", label: "Thinking & Distortions" },
      { id: "emotions", label: "Emotions" },
      { id: "worksheets", label: "Worksheets" },
      { id: "goals", label: "Goals & Treatment Plan" },
      { id: "glossary", label: "Glossary" },
      { id: "advanced", label: "Advanced Reference" }
    ],
    quickStartTitle: "Quick Start",
    quickStartItems: [
      { id: "new", title: "I am new", description: "Start with CBT basics, the fixed session structure, and the first-session map.", tab: "overview" },
      { id: "before", title: "I am reviewing before a session", description: "Go to the session structure and before-session checklist first.", tab: "session-structure" },
      { id: "during", title: "I am reviewing during a session", description: "Use the tools library and the during-session checklist.", tab: "tools" },
      { id: "after", title: "I am reviewing after a session", description: "Use homework setup, next-step planning, and worksheets.", tab: "worksheets" },
      { id: "deeper", title: "I want deeper understanding", description: "Open the advanced reference only after the core map feels clear.", tab: "advanced" }
    ],
    sectionHints: {
      overview: "Use this tab when you need the simplest grounding map before practice.",
      "session-structure": "Use this during session preparation or when the sequence feels unclear.",
      "five-sessions": "Use this to understand the logic of early CBT exploration from session 1 to 5.",
      tools: "Use this when you need to decide which tool fits the case and stage.",
      thinking: "Use this when the case is still unclear and you need better naming of thoughts or distortions.",
      emotions: "Use this when the emotion label is too broad and needs sharpening.",
      worksheets: "Use this when you need a reminder of what each sheet should contain.",
      goals: "Use this when you need to move from problem list to treatment direction.",
      glossary: "Use this when a CBT term is familiar but still fuzzy.",
      advanced: "Not the starting point. Open this only when the core reference already makes sense."
    },
    diagrams: {
      cbtModelTitle: "CBT Model",
      sessionFlowTitle: "Session Flow",
      fiveSessionsTitle: "Five-Session Progression",
      cbtModelNodes: ["Situation", "Thought", "Emotion", "Behavior"],
      sessionFlowNodes: ["Mood / status check", "Agenda", "Review previous homework", "Main work", "Summary", "New homework"],
      fiveSessionsNodes: ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5"]
    },
    checklistsTitle: "Operational Checklists",
    checklists: [
      {
        title: "Before the session",
        useHint: "Use this before you start or before you resume a case.",
        items: [
          "Know the current complaint in one clear sentence.",
          "Decide the session goal before choosing the tool.",
          "Check what homework or previous observation is already available.",
          "Choose one main focus instead of trying to cover everything."
        ]
      },
      {
        title: "During the session",
        useHint: "Use this to stay structured and collaborative.",
        items: [
          "Start with the client’s current status and agree the agenda.",
          "Stay with one concrete example instead of speaking generally.",
          "Use guided discovery more than advice.",
          "Keep linking the step back to the case evidence."
        ]
      },
      {
        title: "End of session",
        useHint: "Use this before closing the meeting.",
        items: [
          "State the one main thing that became clearer.",
          "Check whether the client understood the session direction.",
          "Set one realistic homework task only.",
          "Make sure the homework clearly follows the tool and goal."
        ]
      },
      {
        title: "Case formulation review",
        useHint: "Use this when the case still feels scattered.",
        items: [
          "Name the current problem clearly.",
          "Identify the trigger or activating situation.",
          "Separate thought, emotion, and behavior.",
          "Keep deeper belief claims tentative unless the evidence is strong."
        ]
      },
      {
        title: "Tool selection",
        useHint: "Use this before selecting a CBT tool.",
        items: [
          "Choose the tool that matches the current goal, not the most impressive tool.",
          "Use monitoring before deeper belief work when the material is still vague.",
          "Use downward arrow only after a clear automatic thought is available.",
          "Avoid advanced tools if the case evidence is still thin."
        ]
      },
      {
        title: "Homework setup",
        useHint: "Use this before assigning the between-session task.",
        items: [
          "Keep it to one task only.",
          "Make it observable and reviewable.",
          "Link it directly to the session tool.",
          "Check that it is realistic for the client’s week."
        ]
      }
    ],
    toolsMeta: [
      { whenNot: "Not when the case is still only abstract storytelling with no single example.", expectedOutput: "One specific monitored situation with thought, emotion, and behavior.", level: "Core", tags: ["Beginner", "Core", "Most used"], fitSigns: ["The client speaks generally instead of naming one moment.", "You still do not have a clear trigger-thought-emotion sequence."], starterMove: "Ask for one recent moment only, then capture it in four parts: situation, thought, emotion, behavior." },
      { whenNot: "Not as the first tool if the trainee still cannot identify the original thought.", expectedOutput: "A tested automatic thought and a more balanced response.", level: "Core", tags: ["Core", "Most used"], fitSigns: ["One clear automatic thought is already visible.", "That thought is driving strong distress or avoidance."], starterMove: "Write the exact thought first, then ask what evidence supports it and what evidence does not." },
      { whenNot: "Not before the trainee has enough real examples to label.", expectedOutput: "A named distortion linked to a real client thought.", level: "Core", tags: ["Core", "Beginner"], fitSigns: ["You already have a real thought written down.", "The trainee needs help naming the thinking pattern."], starterMove: "Read the thought as written, then compare it against two or three likely distortion labels." },
      { whenNot: "Not when the automatic thought is still unclear or unsupported.", expectedOutput: "A tentative deeper belief or meaning statement.", level: "Advanced", tags: ["Advanced"], fitSigns: ["The same surface thought keeps appearing across situations.", "The thought seems to point to a deeper rule about worth, weakness, or safety."], starterMove: "Take one automatic thought and ask: if that were true, what would it mean about you?" },
      { whenNot: "Not when the case still lacks enough concrete repeated patterns.", expectedOutput: "A case map linking problem, trigger, thought, emotion, behavior, and belief.", level: "Advanced", tags: ["Advanced", "Most used"], fitSigns: ["You have more than one monitored example showing the same pattern.", "The trainee needs one map that connects the pieces."], starterMove: "Place the current problem in the center, then fill trigger, thought, emotion, behavior, and belief from actual examples." },
      { whenNot: "Not before the main problem pattern and priorities are visible.", expectedOutput: "An ordered set of treatment targets and a starting direction.", level: "Advanced", tags: ["Advanced"], fitSigns: ["The formulation is clear enough to choose priorities.", "You need to decide what comes first rather than keep exploring."], starterMove: "List the main problems, choose the first target, then link one short-term goal to one matching tool." },
      { whenNot: "Not as a detached lecture unrelated to the case.", expectedOutput: "A clearer shared understanding of the CBT model or problem pattern.", level: "Core", tags: ["Beginner", "Core", "Most used"], fitSigns: ["The client does not yet understand why the current step matters.", "Motivation drops because the model still feels vague."], starterMove: "Explain one CBT idea only, then connect it immediately to the client's own recent example." },
      { whenNot: "Not when the client first needs better observation rather than debate.", expectedOutput: "A more tested view of the thought and its evidence.", level: "Core", tags: ["Core"], fitSigns: ["The client sounds certain but the evidence is thin.", "The thought can be checked rather than only described."], starterMove: "Draw two columns: evidence for and evidence against, then stay with concrete facts." },
      { whenNot: "Not when the therapist is already pushing the answer.", expectedOutput: "A discovery-based question path that helps the client think.", level: "Core", tags: ["Core", "Most used"], fitSigns: ["You know the direction but do not want to lecture.", "The client may reach a clearer view through guided discovery."], starterMove: "Start with one open question that widens perspective instead of correcting the thought directly." },
      { whenNot: "Not as a large risky exposure when one smaller test is enough.", expectedOutput: "A real-world test of a prediction with observable results.", level: "Advanced", tags: ["Advanced"], fitSigns: ["The belief includes a testable prediction about what will happen.", "Discussion alone is no longer enough."], starterMove: "Write one prediction, one small test, and one observable outcome before trying it." },
      { whenNot: "Not as a broad list of tasks or vague motivation.", expectedOutput: "One realistic between-session task that can be reviewed.", level: "Core", tags: ["Core", "Most used"], fitSigns: ["The session produced one clear next step.", "You can name exactly what the client should try before next time."], starterMove: "Turn the session into one task with a clear cue, one action, and one thing to bring back." }
    ],
    sessionMeta: [
      { focus: "Build the first shared understanding of the complaint and the CBT frame." },
      { focus: "Sharpen triggers, emotional pattern, and what happens around the problem." },
      { focus: "Help the client start naming cognitive distortions in their own examples." },
      { focus: "Move from surface thoughts toward deeper meaning and beliefs." },
      { focus: "Turn repeated patterns into a formulation and treatment direction." }
    ],
    toolFields: {
      whenNot: "When not to use it",
      expectedOutput: "Expected output",
      level: "Level",
      goal: "Goal",
      mainFocus: "Main focus",
      mainTools: "Main tools",
      homework: "Homework",
      expectedSessionOutput: "Expected output",
      useDuring: "Use during training",
      notStartingPoint: "Not the starting point"
    },
    emotionMapCenter: "Name the emotion more precisely"
  },
  ar: {
    tabs: [
      { id: "overview", label: "نظرة عامة" },
      { id: "session-structure", label: "بنية الجلسة" },
      { id: "five-sessions", label: "خريطة 5 جلسات" },
      { id: "tools", label: "مكتبة الأدوات" },
      { id: "thinking", label: "التفكير والتشوهات" },
      { id: "emotions", label: "المشاعر" },
      { id: "worksheets", label: "النماذج" },
      { id: "goals", label: "الأهداف والخطة" },
      { id: "glossary", label: "المعجم" },
      { id: "advanced", label: "المرجع المتقدم" }
    ],
    quickStartTitle: "بداية سريعة",
    quickStartItems: [
      { id: "new", title: "أنا جديد", description: "ابدأ بأساسيات CBT، وبنية الجلسة الثابتة، وخريطة الجلسات الأولى.", tab: "overview" },
      { id: "before", title: "أراجع قبل الجلسة", description: "اذهب أولًا إلى بنية الجلسة وقائمة ما قبل الجلسة.", tab: "session-structure" },
      { id: "during", title: "أراجع أثناء الجلسة", description: "استخدم مكتبة الأدوات وقائمة أثناء الجلسة.", tab: "tools" },
      { id: "after", title: "أراجع بعد الجلسة", description: "ارجع إلى إعداد الواجب، والخطوة التالية، والنماذج المرجعية.", tab: "worksheets" },
      { id: "deeper", title: "أريد فهمًا أعمق", description: "افتح المرجع المتقدم فقط بعد أن يصبح المرجع الأساسي واضحًا.", tab: "advanced" }
    ],
    sectionHints: {
      overview: "استخدم هذا التبويب عندما تحتاج أبسط خريطة عامة قبل التدريب.",
      "session-structure": "استخدمه أثناء التحضير للجلسة أو عندما تختلط عليك البنية.",
      "five-sessions": "استخدمه لفهم منطق الانتقال من الجلسة 1 إلى 5 في الاستكشاف المبكر.",
      tools: "استخدمه عندما تريد أن تقرر أي أداة تناسب الحالة والمرحلة.",
      thinking: "استخدمه عندما تكون الحالة ما زالت غير واضحة وتحتاج تسمية أدق للأفكار أو التشوهات.",
      emotions: "استخدمه عندما تكون تسمية الشعور عامة جدًا وتحتاج إلى دقة أعلى.",
      worksheets: "استخدمه عندما تحتاج تذكيرًا بما الذي يجب أن تحتويه كل ورقة.",
      goals: "استخدمه عندما تريد الانتقال من قائمة المشكلات إلى اتجاه علاجي واضح.",
      glossary: "استخدمه عندما تعرف المصطلح تقريبًا لكن معناه ما زال غير ثابت.",
      advanced: "ليس نقطة البداية. افتحه فقط بعد فهم المرجع الأساسي."
    },
    diagrams: {
      cbtModelTitle: "نموذج CBT",
      sessionFlowTitle: "تدفق الجلسة",
      fiveSessionsTitle: "تدرج الجلسات الخمس",
      cbtModelNodes: ["الموقف", "الفكرة", "الشعور", "السلوك"],
      sessionFlowNodes: ["فحص الحالة / المزاج", "الأجندة", "مراجعة الواجب السابق", "العمل الرئيسي", "الملخص", "واجب جديد"],
      fiveSessionsNodes: ["الجلسة 1", "الجلسة 2", "الجلسة 3", "الجلسة 4", "الجلسة 5"]
    },
    checklistsTitle: "قوائم عملية",
    checklists: [
      {
        title: "قبل الجلسة",
        useHint: "استخدمها قبل البدء أو قبل استكمال حالة سابقة.",
        items: [
          "اعرف الشكوى الحالية في جملة واحدة واضحة.",
          "حدد هدف الجلسة قبل اختيار الأداة.",
          "راجع ما إذا كان هناك واجب أو رصد سابق متاح.",
          "اختر محورًا واحدًا أساسيًا بدل تغطية كل شيء."
        ]
      },
      {
        title: "أثناء الجلسة",
        useHint: "استخدمها لتحافظ على التنظيم والتعاون.",
        items: [
          "ابدأ بالحالة الحالية ثم اتفق على الأجندة.",
          "ابقَ مع مثال واحد واقعي بدل الكلام العام.",
          "استخدم الاكتشاف الموجّه أكثر من النصيحة المباشرة.",
          "اربط الخطوة دائمًا بأدلة الحالة."
        ]
      },
      {
        title: "نهاية الجلسة",
        useHint: "استخدمها قبل إغلاق الجلسة.",
        items: [
          "اذكر الشيء الواحد الأوضح الذي ظهر في الجلسة.",
          "تأكد أن العميل فهم اتجاه الجلسة.",
          "حدد واجبًا واحدًا واقعيًا فقط.",
          "تأكد أن الواجب يخرج بوضوح من الأداة والهدف."
        ]
      },
      {
        title: "مراجعة الصياغة",
        useHint: "استخدمها عندما تبدو الحالة متفرقة وغير مترابطة.",
        items: [
          "سمِّ المشكلة الحالية بوضوح.",
          "حدد الموقف المفجر أو المنشط.",
          "افصل بين الفكرة والمشاعر والسلوك.",
          "اجعل أي حديث عن المعتقدات الأعمق افتراضيًا ما لم توجد أدلة قوية."
        ]
      },
      {
        title: "اختيار الأداة",
        useHint: "استخدمها قبل اختيار أداة CBT.",
        items: [
          "اختر الأداة التي تخدم الهدف الحالي، لا الأداة التي تبدو أذكى.",
          "استخدم الرصد قبل العمل العميق على المعتقدات إذا كانت المادة ما زالت غامضة.",
          "استخدم السهم الهابط فقط بعد وضوح فكرة تلقائية محددة.",
          "تجنب الأدوات المتقدمة إذا كانت أدلة الحالة ما زالت ضعيفة."
        ]
      },
      {
        title: "إعداد الواجب",
        useHint: "استخدمها قبل تحديد المهمة بين الجلسات.",
        items: [
          "اجعلها مهمة واحدة فقط.",
          "اجعلها قابلة للملاحظة والمراجعة.",
          "اربطها مباشرة بأداة الجلسة.",
          "تأكد أنها واقعية خلال أسبوع العميل."
        ]
      }
    ],
    toolsMeta: [
      { whenNot: "ليس عندما تكون المادة مجرد سرد عام بلا مثال واحد محدد.", expectedOutput: "موقف واحد مرصود بوضوح مع فكرة وشعور وسلوك.", level: "أساسي", tags: ["مبتدئ", "أساسي", "الأكثر استخدامًا"], fitSigns: ["العميل يتكلم بشكل عام من دون موقف واحد واضح.", "ما زال تسلسل الموقف والفكرة والشعور غير واضح."], starterMove: "اطلب موقفًا حديثًا واحدًا فقط، ثم اكتبه في أربعة أجزاء: الموقف، الفكرة، الشعور، السلوك." },
      { whenNot: "ليس كأول أداة إذا كان المتدرب لا يزال غير قادر على تحديد الفكرة الأصلية.", expectedOutput: "فكرة تلقائية مفحوصة واستجابة أكثر توازنًا.", level: "أساسي", tags: ["أساسي", "الأكثر استخدامًا"], fitSigns: ["هناك فكرة تلقائية واضحة بالفعل.", "هذه الفكرة تقود الضيق أو التجنب بشكل مباشر."], starterMove: "اكتب الفكرة كما قيلت أولًا، ثم اسأل: ما الدليل معها وما الدليل ضدها؟" },
      { whenNot: "ليس قبل أن تتوفر أمثلة واقعية كافية يمكن تسميتها.", expectedOutput: "تشوه معرفي مسمى ومرتبط بفكرة حقيقية.", level: "أساسي", tags: ["أساسي", "مبتدئ"], fitSigns: ["لديك فكرة حقيقية مكتوبة بالفعل.", "المتدرب يحتاج تسمية النمط بدل البقاء في الوصف العام."], starterMove: "اقرأ الفكرة كما هي، ثم قارنها باثنين أو ثلاثة من أخطاء التفكير المحتملة." },
      { whenNot: "ليس عندما تكون الفكرة التلقائية نفسها ما زالت غير واضحة أو غير مدعومة.", expectedOutput: "صياغة افتراضية لمعنى أعمق أو معتقد محتمل.", level: "متقدم", tags: ["متقدم"], fitSigns: ["الفكرة السطحية نفسها تتكرر في أكثر من موقف.", "الفكرة تشير إلى قاعدة أعمق عن القيمة أو الضعف أو الأمان."], starterMove: "خذ فكرة تلقائية واحدة واسأل: إذا كانت صحيحة، ماذا يعني ذلك عنك؟" },
      { whenNot: "ليس عندما لا تزال الحالة تفتقد لأنماط متكررة كافية.", expectedOutput: "خريطة حالة تربط المشكلة بالمثير والفكرة والمشاعر والسلوك والمعتقد.", level: "متقدم", tags: ["متقدم", "الأكثر استخدامًا"], fitSigns: ["لديك أكثر من مثال مرصود يكرر النمط نفسه.", "المتدرب يحتاج خريطة واحدة تجمع الأجزاء بدل بقاء التفاصيل متفرقة."], starterMove: "ضع المشكلة الحالية في الوسط، ثم املأ المثير والفكرة والشعور والسلوك والمعتقد من الأمثلة الواقعية." },
      { whenNot: "ليس قبل وضوح النمط الأساسي وأولويات المشكلة.", expectedOutput: "ترتيب واضح للأهداف العلاجية ونقطة بداية.", level: "متقدم", tags: ["متقدم"], fitSigns: ["الصياغة أصبحت كافية لاختيار الأولويات.", "أنت الآن تحتاج قرار البداية لا مزيدًا من الاستكشاف."], starterMove: "اكتب المشكلات الأساسية، اختر الهدف الأول، ثم اربطه بهدف قصير المدى وأداة مناسبة." },
      { whenNot: "ليس كمحاضرة منفصلة عن الحالة.", expectedOutput: "فهم أوضح مشترك لنموذج CBT أو لنمط المشكلة.", level: "أساسي", tags: ["مبتدئ", "أساسي", "الأكثر استخدامًا"], fitSigns: ["العميل لا يفهم بعد لماذا هذه الخطوة مهمة.", "الدافعية انخفضت لأن النموذج ما زال غامضًا."], starterMove: "اشرح فكرة واحدة فقط من CBT ثم اربطها فورًا بمثال حديث من حالة العميل." },
      { whenNot: "ليس عندما يحتاج العميل أولًا إلى رصد أفضل لا إلى مناظرة.", expectedOutput: "رؤية أكثر اختبارًا للفكرة وأدلتها.", level: "أساسي", tags: ["أساسي"], fitSigns: ["العميل يتكلم بيقين عالٍ لكن الأدلة ضعيفة.", "الفكرة قابلة للفحص لا للوصف فقط."], starterMove: "قسّم الورقة إلى عمودين: أدلة مع الفكرة وأدلة ضدها، ثم ابق مع الحقائق الملموسة." },
      { whenNot: "ليس عندما يكون المعالج يدفع الإجابة مسبقًا.", expectedOutput: "مسار أسئلة يساعد العميل على الاكتشاف بنفسه.", level: "أساسي", tags: ["أساسي", "الأكثر استخدامًا"], fitSigns: ["أنت تعرف الاتجاه لكنك لا تريد إعطاء محاضرة.", "العميل قد يصل إلى رؤية أدق عبر الاكتشاف الموجه."], starterMove: "ابدأ بسؤال مفتوح يوسع زاوية النظر بدل تصحيح الفكرة مباشرة." },
      { whenNot: "ليس كمهمة كبيرة أو مخيفة بينما تكفي تجربة أصغر.", expectedOutput: "اختبار واقعي لتوقع مع نتائج يمكن ملاحظتها.", level: "متقدم", tags: ["متقدم"], fitSigns: ["المعتقد يتضمن توقعًا يمكن اختباره عمليًا.", "النقاش وحده لم يعد كافيًا."], starterMove: "اكتب توقعًا واحدًا، واختبارًا صغيرًا واحدًا، ونتيجة واحدة يمكن ملاحظتها قبل التنفيذ." },
      { whenNot: "ليس كلائحة مهام واسعة أو دافعية عامة.", expectedOutput: "مهمة واحدة واقعية بين الجلسات يمكن مراجعتها.", level: "أساسي", tags: ["أساسي", "الأكثر استخدامًا"], fitSigns: ["الجلسة أنتجت خطوة تالية واحدة واضحة.", "يمكنك تسمية ما الذي سيفعله العميل قبل المرة القادمة بدقة."], starterMove: "حوّل الجلسة إلى مهمة واحدة مع موقف محفز واضح، وفعل واحد، وشيء واحد يعود للمراجعة." }
    ],
    sessionMeta: [
      { focus: "بناء الفهم المشترك الأولي للشكوى وإطار CBT." },
      { focus: "توضيح المثيرات والنمط الانفعالي وما الذي يحدث حول المشكلة." },
      { focus: "مساعدة العميل على تسمية أخطاء التفكير في أمثلته الواقعية." },
      { focus: "الانتقال من الأفكار السطحية إلى المعنى الأعمق والمعتقدات." },
      { focus: "تحويل الأنماط المتكررة إلى صياغة واتجاه علاجي." }
    ],
    toolFields: {
      whenNot: "متى لا تُستخدم",
      expectedOutput: "المخرج المتوقع",
      level: "المستوى",
      goal: "الهدف",
      mainFocus: "التركيز الرئيسي",
      mainTools: "الأدوات الرئيسية",
      homework: "الواجب",
      expectedSessionOutput: "المخرج المتوقع",
      useDuring: "استخدم أثناء التدريب",
      notStartingPoint: "ليست نقطة البداية"
    },
    emotionMapCenter: "سمِّ الشعور بدقة أكبر"
  }
};

export function getReferenceHubOperationalContent(language: AppLanguage) {
  return operationalContent[language];
}
