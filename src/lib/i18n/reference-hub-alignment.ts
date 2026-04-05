import type { AppLanguage } from "./shared";

export type ReferenceTechnique = {
  name: string;
  what: string;
  when: string;
  why: string;
  example: string;
  mistake: string;
  miniCase: {
    title: string;
    situation: string;
    whyThisTool: string;
    expectedOutput: string;
  };
  whenNot: string;
  expectedOutput: string;
  level: string;
  tags: string[];
  fitSigns: string[];
  starterMove: string;
};

type ReferencePrinciple = {
  title: string;
  description: string;
};

type TherapyObstacleGroup = {
  title: string;
  intro: string;
  items: string[];
};

type TechniqueDecision = {
  title: string;
  condition: string;
  outcome: string;
};

type BeliefExtractionMethod = {
  title: string;
  description: string;
};

type AlignmentContent = {
  principlesTitle: string;
  principlesIntro: string;
  principles: ReferencePrinciple[];
  extraTechniques: ReferenceTechnique[];
  therapyObstaclesTitle: string;
  therapyObstaclesIntro: string;
  therapyObstacles: TherapyObstacleGroup[];
  techniqueDecisionTitle: string;
  techniqueDecisionIntro: string;
  techniqueDecision: TechniqueDecision[];
  beliefExtractionTitle: string;
  beliefExtractionIntro: string;
  beliefExtractionMethods: BeliefExtractionMethod[];
};

const alignmentContent: Record<AppLanguage, AlignmentContent> = {
  en: {
    principlesTitle: "The Ten Core Principles",
    principlesIntro:
      "These are the trainer’s core organizing principles. They should appear as the backbone of the reference, not as scattered notes.",
    principles: [
      { title: "Progressive and continuous assessment", description: "Assessment keeps evolving across sessions rather than stopping after the first impression." },
      { title: "Presence", description: "The therapist maintains real attunement to the client’s emotional state without becoming vague or unstructured." },
      { title: "Collaboration", description: "The client and therapist decide together what the session will focus on and what happens between sessions." },
      { title: "Goal setting", description: "Each treatment direction should be translated into a clear behavioral goal." },
      { title: "Focus on the present", description: "Current suffering and current maintaining patterns are the main entry point unless the past is clinically necessary." },
      { title: "Primarily educational", description: "CBT teaches the client how to understand, test, and respond differently, not just how to talk." },
      { title: "Time-bound", description: "CBT is structured around a focused course of work rather than undefined open-ended treatment." },
      { title: "Structured sessions", description: "Each session follows a stable sequence: check-in, agenda, review, main work, summary, homework, and feedback." },
      { title: "Awareness raising", description: "The client is taught to notice thoughts, beliefs, distortions, and patterns more clearly." },
      { title: "Multiple methods and techniques", description: "Technique choice follows formulation and goals, not personal preference or random variety." }
    ],
    extraTechniques: [
      {
        name: "Pleasurable activities list",
        what: "A list of pleasant or restoring activities used to increase engagement and mood activation.",
        when: "Use it when low mood, withdrawal, or loss of reinforcement is prominent.",
        why: "It helps the client move from passivity to small observable activation steps.",
        example: "Schedule one short walk, one phone call, and one enjoyable routine this week.",
        mistake: "Turning it into a long ideal plan that the client is unlikely to do.",
        miniCase: {
          title: "Mini-case",
          situation: "The client reports staying in bed, avoiding activity, and feeling no motivation at all.",
          whyThisTool: "A pleasant activities list is suitable because action needs to restart before deeper cognitive work can gain traction.",
          expectedOutput: "A short list of small activities with realistic timing."
        },
        whenNot: "Not when the main task is still to clarify the problem pattern and no target behavior is visible.",
        expectedOutput: "One or more small activating tasks the client can realistically do.",
        level: "Core",
        tags: ["Core", "Behavioral"],
        fitSigns: ["The client is withdrawn or inactive.", "Mood may improve if contact with reinforcing activity increases."],
        starterMove: "Ask what the client used to do, still partly enjoys, or can tolerate for ten minutes this week."
      },
      {
        name: "Pros and cons",
        what: "A structured look at the gains and losses of a thought, behavior, or coping style.",
        when: "Use it when ambivalence is strong and the client is stuck between change and maintaining the current pattern.",
        why: "It helps make hidden benefits and hidden costs visible.",
        example: "What do you gain by avoiding the meeting, and what does that avoidance cost you?",
        mistake: "Using it as persuasion instead of genuine exploration.",
        miniCase: {
          title: "Mini-case",
          situation: "The client knows avoidance is costly but still feels protected by it.",
          whyThisTool: "Pros and cons work well because the barrier is ambivalence rather than lack of insight.",
          expectedOutput: "A balanced list of perceived gains and costs."
        },
        whenNot: "Not when the client is already ready to act and only needs a concrete next step.",
        expectedOutput: "A visible map of what the current pattern protects and what it damages.",
        level: "Core",
        tags: ["Core", "Decision support"],
        fitSigns: ["The client says change is important but keeps doing the same thing.", "The current behavior has both relief and cost."],
        starterMove: "Draw two columns and ask first what the client gets from the pattern before asking what it costs."
      },
      {
        name: "Cognitive continuum",
        what: "A technique that moves thinking away from rigid extremes toward a more graded view.",
        when: "Use it when the person thinks in all-or-none categories.",
        why: "It helps loosen polarized judgments and create a middle range.",
        example: "Instead of either weak or strong, where would this performance fall on a 0 to 100 scale?",
        mistake: "Jumping to the middle without first naming the rigid extreme.",
        miniCase: {
          title: "Mini-case",
          situation: "The client says: 'If I am not the best, then I am a failure.'",
          whyThisTool: "The continuum is a direct fit because the thinking is sharply black-and-white.",
          expectedOutput: "A more graded rating and a less absolute conclusion."
        },
        whenNot: "Not when the issue is missing evidence rather than rigid scaling.",
        expectedOutput: "A more flexible scale-based judgment instead of an absolute label.",
        level: "Core",
        tags: ["Core", "Distortion work"],
        fitSigns: ["The client uses total success or total failure language.", "Performance is judged with no middle ground."],
        starterMove: "Ask the client to place the feared outcome and a realistic outcome on the same scale."
      },
      {
        name: "Pie chart",
        what: "A visual way to distribute responsibility or causes instead of personalizing everything.",
        when: "Use it when the client over-assigns blame or responsibility to self.",
        why: "It makes causation more balanced and reduces distorted ownership.",
        example: "Divide the outcome across your effort, timing, external pressure, and other people’s roles.",
        mistake: "Using it when the client has not yet described the event concretely.",
        miniCase: {
          title: "Mini-case",
          situation: "The client believes the entire failure of a team project proves personal incompetence.",
          whyThisTool: "The pie chart helps redistribute responsibility more realistically.",
          expectedOutput: "A visual division of contributing factors rather than total self-blame."
        },
        whenNot: "Not when the main issue is future prediction rather than self-blame.",
        expectedOutput: "A more proportionate view of causes and responsibility.",
        level: "Core",
        tags: ["Core", "Personalization"],
        fitSigns: ["The client says it was all my fault.", "Other contributing factors are being ignored."],
        starterMove: "List all possible contributors first, then assign rough percentages instead of exact precision."
      },
      {
        name: "Cognitive restructuring",
        what: "The broader process of identifying, testing, and revising an unhelpful thought.",
        when: "Use it when the thought is clear and there is enough evidence to work with.",
        why: "It turns a rigid conclusion into a more balanced and testable response.",
        example: "The thought changes from 'I will definitely fail' to 'I may struggle, but I have handled similar tasks before.'",
        mistake: "Replacing the thought with forced positivity instead of believable balance.",
        miniCase: {
          title: "Mini-case",
          situation: "The client can name the thought clearly and is ready to examine it in more depth.",
          whyThisTool: "Cognitive restructuring fits because the thought is explicit and workable.",
          expectedOutput: "A revised thought that is more balanced and believable."
        },
        whenNot: "Not when the client still lacks one clear thought or the session material is too vague.",
        expectedOutput: "A thought that is less distorted, more evidence-based, and more usable.",
        level: "Core",
        tags: ["Core", "Most used"],
        fitSigns: ["The client can state the thought exactly.", "Evidence can be gathered for and against it."],
        starterMove: "Write the exact automatic thought first, then test it before rewriting it."
      },
      {
        name: "Exposure and response prevention",
        what: "A structured approach to facing feared cues while reducing avoidance or safety responses.",
        when: "Use it when fear is maintained by repeated avoidance or compulsive neutralizing.",
        why: "It helps the client learn through direct experience that the feared outcome or feared state can be tolerated.",
        example: "Stay in the feared situation without the usual safety behavior and observe what happens.",
        mistake: "Making the exposure too large, too early, or detached from formulation.",
        miniCase: {
          title: "Mini-case",
          situation: "The client repeatedly avoids speaking situations and relies on rituals to feel safe.",
          whyThisTool: "Exposure with response prevention is relevant because avoidance is maintaining the fear cycle.",
          expectedOutput: "A graded exposure task with one response prevention target."
        },
        whenNot: "Not before clarifying the fear structure and agreeing a graded, safe behavioral plan.",
        expectedOutput: "A small planned exposure linked to reduced avoidance or ritual response.",
        level: "Advanced",
        tags: ["Advanced", "Behavioral"],
        fitSigns: ["Fear stays high because the client never remains in the situation long enough to learn.", "Safety behaviors are maintaining the pattern."],
        starterMove: "Define one feared cue, one safety behavior to reduce, and one graded exposure step."
      }
    ],
    therapyObstaclesTitle: "Therapy Obstacles",
    therapyObstaclesIntro:
      "The trainer material treats obstacles as part of formulation. They should be named explicitly rather than treated as vague resistance.",
    therapyObstacles: [
      {
        title: "Beliefs that interfere with therapy",
        intro: "Some beliefs make CBT harder to use even when the client understands the model.",
        items: [
          "I cannot change no matter what I do.",
          "If I show difficulty, it means I am weak.",
          "The therapist should fix this for me without effort from my side.",
          "If I feel bad, the thought must be true."
        ]
      },
      {
        title: "Behaviors that interfere with therapy",
        intro: "Some patterns disrupt the process directly and should be addressed early.",
        items: [
          "Avoiding homework or doing it vaguely.",
          "Staying in general storytelling without one concrete example.",
          "Expecting insight without practice between sessions.",
          "Using safety behaviors that block testing and learning."
        ]
      },
      {
        title: "Treatment planning implication",
        intro: "Obstacles change pacing, technique choice, and the order of goals.",
        items: [
          "A therapy obstacle may become an early treatment target.",
          "More psychoeducation may be needed before deeper technique work.",
          "Some clients need simpler behavioral tasks before cognitive depth.",
          "The plan should reflect readiness, not only ideal technique logic."
        ]
      }
    ],
    techniqueDecisionTitle: "How To Choose the Technique",
    techniqueDecisionIntro:
      "This is a practical reading path from unclear material to clearer intervention choice.",
    techniqueDecision: [
      {
        title: "Material is vague",
        condition: "The client is speaking generally and one concrete situation is still missing.",
        outcome: "Start with monitoring or observation before debating beliefs."
      },
      {
        title: "A thought is clear",
        condition: "There is one strong automatic thought connected to distress or avoidance.",
        outcome: "Use evidence review, Socratic questioning, or cognitive restructuring."
      },
      {
        title: "A pattern repeats",
        condition: "Several situations now point to the same rule, meaning, or fear.",
        outcome: "Move toward downward arrow and formulation."
      },
      {
        title: "Ambivalence blocks change",
        condition: "The client understands the issue but still protects the pattern.",
        outcome: "Use gains and losses before pushing direct change."
      },
      {
        title: "The belief needs real testing",
        condition: "Discussion alone is no longer enough to challenge the prediction.",
        outcome: "Use a behavioral experiment or graded exposure."
      },
      {
        title: "The next step is outside session",
        condition: "The session already produced one clear direction.",
        outcome: "Turn it into one realistic homework task or worksheet."
      }
    ],
    beliefExtractionTitle: "How Beliefs Are Extracted",
    beliefExtractionIntro:
      "The trainer material lists several practical routes for uncovering intermediate and deeper beliefs.",
    beliefExtractionMethods: [
      {
        title: "Belief appears directly in the thought",
        description: "Sometimes the belief is already visible in the automatic thought and only needs to be named clearly."
      },
      {
        title: "Ask what the thought means",
        description: "Ask what the automatic thought would mean if it were true, and keep following the meaning downward."
      },
      {
        title: "Look for the common thread",
        description: "Repeated thoughts often reveal one shared assumption or deeper rule."
      },
      {
        title: "Infer the rule and test it collaboratively",
        description: "The therapist may suggest a possible rule and ask whether it fits the client’s experience."
      },
      {
        title: "Use questionnaires when needed",
        description: "Belief-focused measures may help when the pattern is hard to see directly."
      },
      {
        title: "Use downward arrow",
        description: "Downward arrow remains one of the most direct ways to move from the thought to its deeper meaning."
      }
    ]
  },
  ar: {
    principlesTitle: "المبادئ العشرة الأساسية",
    principlesIntro:
      "هذه هي المبادئ المنظمة الأساسية في مادة المدرب، ويجب أن تظهر كعمود فقري للمرجع لا كنقاط متناثرة.",
    principles: [
      { title: "التقييم المتنامي والمستمر", description: "التقييم يستمر ويتطور عبر الجلسات ولا يتوقف عند الانطباع الأول." },
      { title: "المواجدة", description: "يحافظ المعالج على حضور حقيقي مع الحالة الانفعالية للمريض دون أن يفقد البنية." },
      { title: "التعاون", description: "يتم تحديد محور الجلسة وما بين الجلسات بشكل تشاركي بين المعالج والمريض." },
      { title: "تحديد الهدف", description: "كل اتجاه علاجي يجب أن يترجم إلى هدف سلوكي واضح." },
      { title: "التركيز على الحاضر", description: "المدخل الأساسي هو المعاناة الحالية والعوامل الحالية التي تحافظ على المشكلة." },
      { title: "علاج تعليمي في الأساس", description: "CBT يعلّم المريض كيف يلاحظ ويفحص ويستجيب، وليس فقط كيف يتكلم عن المشكلة." },
      { title: "محدد بزمن", description: "العلاج يدار ضمن مسار واضح ومركز، لا ضمن إطار مفتوح بلا حدود." },
      { title: "الجلسات مقننة", description: "لكل جلسة تسلسل ثابت: فحص، أجندة، مراجعة، عمل رئيسي، تلخيص، واجب، وتغذية راجعة." },
      { title: "زيادة الوعي", description: "يتم تعليم المريض كيف يلاحظ الأفكار والمعتقدات والتشوهات والأنماط بشكل أدق." },
      { title: "تعدد الفنيات والتقنيات", description: "اختيار الفنية يتبع الصياغة والأهداف العلاجية، لا الذوق الشخصي أو التنويع العشوائي." }
    ],
    extraTechniques: [
      {
        name: "قائمة الأنشطة السارة",
        what: "قائمة بالأنشطة المريحة أو الممتعة تستخدم لزيادة التفاعل وتنشيط المزاج.",
        when: "تستخدم عندما يكون الانسحاب أو الخمول أو فقد التعزيز واضحًا.",
        why: "تساعد المريض على الانتقال من السلبية إلى خطوات سلوكية صغيرة يمكن ملاحظتها.",
        example: "تحديد مشي قصير، مكالمة واحدة، ونشاط بسيط ممتع هذا الأسبوع.",
        mistake: "تحويلها إلى خطة مثالية طويلة يصعب تنفيذها.",
        miniCase: {
          title: "مثال مصغر",
          situation: "المريض يقضي أغلب الوقت في السرير ويتجنب النشاط ولا يشعر بدافعية.",
          whyThisTool: "هذه الفنية مناسبة لأن الفعل نفسه يحتاج أن يعود قبل أن ينفع العمل المعرفي الأعمق.",
          expectedOutput: "قائمة قصيرة من الأنشطة الصغيرة مع توقيت واقعي."
        },
        whenNot: "ليست عندما تكون المهمة الأساسية ما زالت هي فهم المشكلة ولم يظهر سلوك هدف واضح بعد.",
        expectedOutput: "مهمة أو أكثر منشطة وصغيرة يمكن تنفيذها فعليًا.",
        level: "أساسي",
        tags: ["أساسي", "سلوكي"],
        fitSigns: ["المريض منسحب أو خامل.", "قد يتحسن المزاج مع زيادة الاحتكاك بالأنشطة المعززة."],
        starterMove: "اسأل: ما الذي كان يفعله سابقًا أو ما الذي ما زال يمكنه تحمله عشر دقائق هذا الأسبوع؟"
      },
      {
        name: "المكاسب والخسائر",
        what: "فحص منظم لما يكسبه الشخص وما يخسره من فكرة أو سلوك أو أسلوب مواجهة معين.",
        when: "تستخدم عندما يكون التردد أو التعلق بالنمط الحالي قويًا.",
        why: "تجعل الفوائد الخفية والتكاليف الخفية مرئية بوضوح.",
        example: "ماذا تكسب من تجنب الاجتماع، وماذا يكلفك هذا التجنب؟",
        mistake: "استخدامها كوسيلة ضغط بدل الاستكشاف الحقيقي.",
        miniCase: {
          title: "مثال مصغر",
          situation: "المريض يعرف أن التجنب مكلف لكنه ما زال يشعر أنه يحميه.",
          whyThisTool: "هذه الفنية مناسبة لأن المشكلة هنا ليست نقص الفهم بل التردد بين التغيير والاستمرار.",
          expectedOutput: "قائمة متوازنة بالمكاسب والخسائر."
        },
        whenNot: "ليست عندما يكون المريض جاهزًا للفعل ولا يحتاج إلا خطوة عملية واضحة.",
        expectedOutput: "خريطة واضحة لما يحميه النمط الحالي وما يفسده في الوقت نفسه.",
        level: "أساسي",
        tags: ["أساسي", "دعم القرار"],
        fitSigns: ["المريض يقول إن التغيير مهم لكنه يستمر في النمط نفسه.", "السلوك الحالي فيه راحة وفيه تكلفة معًا."],
        starterMove: "ارسم عمودين وابدأ أولًا بما يكسبه الشخص من النمط قبل سؤاله عما يخسره."
      },
      {
        name: "المتصل المعرفي",
        what: "فنية تساعد على كسر الأحكام المطلقة وتحويلها إلى تقدير تدريجي أكثر مرونة.",
        when: "تستخدم عندما يكون التفكير مستقطبًا أو أبيض/أسود.",
        why: "تخفف حدة الحكم المطلق وتسمح بمنطقة وسط.",
        example: "بدل قوي أو ضعيف فقط، أين يقع هذا الأداء على مقياس من 0 إلى 100؟",
        mistake: "القفز إلى المنتصف دون تسمية الطرفين المتطرفين أولًا.",
        miniCase: {
          title: "مثال مصغر",
          situation: "المريض يقول: إذا لم أكن الأفضل فأنا فاشل.",
          whyThisTool: "هذه الفنية مناسبة مباشرة لأن المشكلة هنا هي الاستقطاب الشديد في الحكم.",
          expectedOutput: "تقدير أكثر تدريجًا ونتيجة أقل إطلاقًا."
        },
        whenNot: "ليست عندما تكون المشكلة الأساسية هي غياب الأدلة لا التطرف في التقدير.",
        expectedOutput: "حكم مرن قائم على تدرج بدل تصنيف مطلق.",
        level: "أساسي",
        tags: ["أساسي", "أخطاء التفكير"],
        fitSigns: ["المريض يستخدم لغة نجاح كامل أو فشل كامل.", "لا توجد منطقة وسط في التقييم."],
        starterMove: "اطلب من المريض أن يضع النتيجة المخيفة والنتيجة الواقعية على المقياس نفسه."
      },
      {
        name: "رسم الدائرة",
        what: "طريقة بصرية لتوزيع المسؤولية أو الأسباب بدل تحميل الذات كل شيء.",
        when: "تستخدم عندما يكون هناك شخصنة أو لوم ذاتي مبالغ فيه.",
        why: "تساعد على رؤية السببية بشكل أكثر توازنًا.",
        example: "قسّم النتيجة بين جهدك، التوقيت، ضغط الظروف، ودور الآخرين.",
        mistake: "استعمالها قبل أن يصبح الحدث نفسه موصوفًا بوضوح.",
        miniCase: {
          title: "مثال مصغر",
          situation: "المريض يرى أن فشل مشروع الفريق يثبت وحده أنه غير كفء.",
          whyThisTool: "رسم الدائرة يساعد على توزيع المسؤولية بصورة أكثر واقعية.",
          expectedOutput: "تقسيم بصري للعوامل بدل اللوم الذاتي الكامل."
        },
        whenNot: "ليست عندما تكون المشكلة الأساسية هي التنبؤ بالمستقبل لا لوم الذات.",
        expectedOutput: "رؤية أكثر تناسبًا للعوامل المساهمة والمسؤولية.",
        level: "أساسي",
        tags: ["أساسي", "الشخصنة"],
        fitSigns: ["المريض يقول: كله بسببي.", "العوامل الأخرى غير مرئية تقريبًا في وصفه."],
        starterMove: "اكتب كل العوامل المساهمة أولًا، ثم وزع نسبًا تقريبية بدل البحث عن دقة مثالية."
      },
      {
        name: "إعادة الصياغة المعرفية",
        what: "العملية الأوسع لتحديد الفكرة غير المفيدة وفحصها وتعديلها إلى استجابة أكثر توازنًا.",
        when: "تستخدم عندما تكون الفكرة واضحة وهناك مادة كافية لاختبارها.",
        why: "تنقل الشخص من حكم جامد إلى استجابة أكثر واقعية وقابلة للاختبار.",
        example: "تتحول الفكرة من: سأفشل بالتأكيد، إلى: قد أتعثر لكن لدي سوابق نجحت فيها.",
        mistake: "استبدال الفكرة بإيجابية مفتعلة بدل توازن مقنع.",
        miniCase: {
          title: "مثال مصغر",
          situation: "المريض قادر على تسمية الفكرة بوضوح وجاهز لفحصها بعمق أكبر.",
          whyThisTool: "هذه الفنية مناسبة لأن الفكرة أصبحت صريحة وقابلة للعمل.",
          expectedOutput: "فكرة معدلة أكثر توازنًا وقابلية للتصديق."
        },
        whenNot: "ليست عندما لا تزال الفكرة غير واضحة أو المادة غامضة جدًا.",
        expectedOutput: "فكرة أقل تشوهًا وأكثر اعتمادًا على الأدلة.",
        level: "أساسي",
        tags: ["أساسي", "الأكثر استخدامًا"],
        fitSigns: ["المريض قادر على قول الفكرة كما هي.", "يمكن جمع أدلة معها وضدها."],
        starterMove: "اكتب الفكرة التلقائية حرفيًا أولًا، ثم اختبرها قبل تعديلها."
      },
      {
        name: "التعرض ومنع الاستجابة",
        what: "طريقة منظمة لمواجهة المثيرات المخيفة مع تقليل التجنب أو السلوكيات الآمنة/الطقوس.",
        when: "تستخدم عندما يكون الخوف مستمرًا بسبب التجنب أو السلوكيات المعادِلة.",
        why: "تسمح للمريض أن يتعلم من الخبرة المباشرة أن الموقف أو الإحساس يمكن احتماله.",
        example: "البقاء في الموقف المخيف دون السلوك الآمن المعتاد وملاحظة ما يحدث.",
        mistake: "جعل المهمة كبيرة جدًا أو مبكرة جدًا أو غير مرتبطة بالصياغة.",
        miniCase: {
          title: "مثال مصغر",
          situation: "المريض يتجنب مواقف الكلام ويعتمد على طقوس أو وسائل أمان ليشعر بالأمان.",
          whyThisTool: "هذه الفنية مناسبة لأن التجنب نفسه يحافظ على دائرة الخوف.",
          expectedOutput: "خطة تعرض تدريجي مع هدف واضح لمنع الاستجابة."
        },
        whenNot: "ليست قبل فهم بنية الخوف والاتفاق على خطوة سلوكية متدرجة وآمنة.",
        expectedOutput: "خطوة تعرض صغيرة مخططة مرتبطة بتقليل التجنب أو الاستجابة الآمنة.",
        level: "متقدم",
        tags: ["متقدم", "سلوكي"],
        fitSigns: ["الخوف يبقى مرتفعًا لأن المريض لا يبقى في الموقف بما يكفي ليتعلم.", "السلوكيات الآمنة تحافظ على النمط."],
        starterMove: "حدد مثيرًا واحدًا، وسلوك أمان واحدًا سيخفف، وخطوة تعرض واحدة متدرجة."
      }
    ],
    therapyObstaclesTitle: "مفسدات العلاج",
    therapyObstaclesIntro:
      "المادة الأصلية تتعامل مع المفسدات كجزء من الصياغة، ويجب تسميتها بوضوح لا اعتبارها مقاومة غامضة فقط.",
    therapyObstacles: [
      {
        title: "معتقدات تعوق العملية العلاجية",
        intro: "بعض المعتقدات تجعل CBT أصعب حتى لو فهم المريض النموذج.",
        items: [
          "أنا لا أستطيع التغيير مهما حدث.",
          "إذا ظهرت صعوبتي فهذا يعني أنني ضعيف.",
          "المعالج يجب أن يصلح المشكلة نيابة عني دون جهد مني.",
          "إذا شعرت بشيء فلا بد أنه حقيقي."
        ]
      },
      {
        title: "سلوكيات تعوق العملية العلاجية",
        intro: "بعض الأنماط تعطل العلاج مباشرة ويجب الانتباه لها مبكرًا.",
        items: [
          "تجنب الواجب أو تنفيذه بشكل عام وغير محدد.",
          "البقاء في سرد عام دون موقف واحد واقعي.",
          "انتظار التغيير من الفهم دون ممارسة بين الجلسات.",
          "التمسك بسلوكيات الأمان التي تمنع التعلم الحقيقي."
        ]
      },
      {
        title: "ما الذي يترتب عليها في الخطة العلاجية؟",
        intro: "المفسدات تغيّر سرعة العلاج وترتيب الأهداف واختيار الفنية.",
        items: [
          "قد تصبح بعض مفسدات العلاج هدفًا علاجيًا مبكرًا بحد ذاتها.",
          "قد يحتاج الأمر إلى تعليم نفسي أكثر قبل التعمق الفني.",
          "بعض الحالات تحتاج بدايات سلوكية أبسط قبل العمل المعرفي الأعمق.",
          "الخطة يجب أن تراعي الجاهزية، لا المنطق المثالي للفنية فقط."
        ]
      }
    ],
    techniqueDecisionTitle: "كيف أختار الفنية المناسبة؟",
    techniqueDecisionIntro:
      "هذه خريطة عملية للانتقال من المادة غير الواضحة إلى اختيار تدخّل أوضح.",
    techniqueDecision: [
      {
        title: "المادة ما زالت غامضة",
        condition: "المريض يتكلم بشكل عام ولم يظهر موقف واقعي واحد بعد.",
        outcome: "ابدأ بجدول الرصد قبل مناقشة المعتقدات."
      },
      {
        title: "هناك فكرة واضحة",
        condition: "توجد فكرة تلقائية قوية مرتبطة بالضيق أو التجنب.",
        outcome: "استخدم مراجعة الأدلة أو التساؤل السقراطي أو إعادة الصياغة المعرفية."
      },
      {
        title: "هناك نمط متكرر",
        condition: "أكثر من موقف أصبح يشير إلى القاعدة أو المعنى نفسه.",
        outcome: "انتقل إلى السهم الهابط ثم الصياغة المعرفية."
      },
      {
        title: "التردد يمنع التغيير",
        condition: "المريض يفهم المشكلة لكنه ما زال يحمي النمط الحالي.",
        outcome: "استخدم المكاسب والخسائر قبل الدفع نحو التغيير المباشر."
      },
      {
        title: "المعتقد يحتاج اختبارًا حيًا",
        condition: "النقاش وحده لم يعد كافيًا لتحدي التوقع.",
        outcome: "استخدم تجربة سلوكية أو تعرضًا متدرجًا."
      },
      {
        title: "الخطوة التالية خارج الجلسة",
        condition: "الجلسة أنتجت اتجاهًا واضحًا واحدًا.",
        outcome: "حوّلها إلى واجب منزلي أو نموذج عملي واضح."
      }
    ],
    beliefExtractionTitle: "كيف نستخرج المعتقدات؟",
    beliefExtractionIntro:
      "المادة الأصلية تعرض أكثر من طريق عملي للكشف عن المعتقدات الوسيطة والأعمق.",
    beliefExtractionMethods: [
      {
        title: "ظهور المعتقد بشكل مباشر داخل الفكرة",
        description: "أحيانًا يكون المعتقد ظاهرًا أصلًا داخل الفكرة التلقائية ولا يحتاج إلا تسمية أوضح."
      },
      {
        title: "سؤال: ماذا تعني هذه الفكرة؟",
        description: "نسأل عن معنى الفكرة إذا كانت صحيحة، ثم نستمر في تتبع المعنى إلى الأسفل."
      },
      {
        title: "البحث عن العامل المشترك",
        description: "تكرار أفكار مختلفة قد يكشف افتراضًا واحدًا أو قاعدة واحدة تحتها."
      },
      {
        title: "استنتاج القاعدة ثم اختبارها مع المريض",
        description: "قد يقترح المعالج قاعدة محتملة ويسأل المريض هل تعبر فعلًا عن طريقته في التفكير."
      },
      {
        title: "استخدام الاستبيانات عند الحاجة",
        description: "بعض المقاييس قد تساعد عندما يصعب رؤية المعتقد بشكل مباشر من الجلسات."
      },
      {
        title: "استخدام السهم الهابط",
        description: "السهم الهابط يظل من أوضح الطرق للانتقال من الفكرة إلى معناها الأعمق."
      }
    ]
  }
};

export function getReferenceHubAlignment(language: AppLanguage) {
  return alignmentContent[language];
}
