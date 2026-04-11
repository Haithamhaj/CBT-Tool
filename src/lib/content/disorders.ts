import { cache } from "react";

export type WorksheetLayout =
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      type: "form";
      fields: Array<{
        label: string;
        value: string;
      }>;
    }
  | {
      type: "sections";
      sections: Array<{
        title: string;
        lines: string[];
      }>;
    };

export type DisorderHelperCard = {
  label: string;
  title: string;
  text: string;
};

export type DisorderSummaryCard = {
  title: string;
  text: string;
};

export type DisorderSymptomGroup = {
  groupName: string;
  intro: string;
  items: string[];
  examples: string[];
};

export type DisorderDistinction = {
  title: string;
  leftTitle: string;
  rightTitle: string;
  left: string;
  right: string;
  whyItMatters: string;
};

export type DisorderCriteria = {
  title: string;
  rules: string[];
  note: string;
};

export type DisorderFramework = {
  title: string;
  intro?: string;
  items: string[];
};

export type DisorderRoadmapStep = {
  title: string;
  text: string;
};

export type WorksheetAssetLinks = {
  blankPdf?: string;
  blankXlsx?: string;
  guidedPdf?: string;
  guidedXlsx?: string;
  filledPdf?: string;
  filledXlsx?: string;
};

export type DisorderTool = {
  slug: string;
  name: string;
  what: string;
  whenUsed: string;
  whenNotFirst: string;
  steps: string[];
  example: string;
  commonMistakes: string[];
  relatedWorksheet: string;
  layouts: {
    blank: WorksheetLayout;
    guided: WorksheetLayout;
    filled: WorksheetLayout;
  };
  downloads: WorksheetAssetLinks;
};

export type DisorderExercise = {
  title: string;
  goal: string;
  task: string;
  outputHint: string;
};

export type MultipleChoiceCheck = {
  type: "multiple-choice";
  title: string;
  prompt: string;
  options: Array<{
    label: string;
    explanation: string;
    correct: boolean;
  }>;
};

export type ClassificationCheck = {
  type: "classification";
  title: string;
  prompt: string;
  groups: string[];
  items: Array<{
    text: string;
    correctGroup: string;
    feedback: string;
  }>;
};

export type OrderingCheck = {
  type: "ordering";
  title: string;
  prompt: string;
  correctOrder: string[];
  explanation: string;
};

export type DisorderCheck = MultipleChoiceCheck | ClassificationCheck | OrderingCheck;

export type DisorderCaseStage = {
  title: string;
  content: string;
};

export type DisorderCaseStudy = {
  title: string;
  opening: string;
  stages: DisorderCaseStage[];
  homework: string;
  progressReflection: string;
};

export type DisorderQuizQuestion = {
  prompt: string;
  options: Array<{
    label: string;
    correct: boolean;
    explanation: string;
  }>;
};

export type DisorderReferenceFile = {
  id: string;
  name: string;
  fileType: string;
  role: string;
  reviewFocus: string[];
  viewHref: string;
  downloadHref: string;
};

export type DisorderSourceTrace = {
  slides: string[];
  scientific: string[];
  rewritten: string[];
  scaffold?: string[];
};

export type Disorder = {
  slug: string;
  title: string;
  subtitle: string;
  audience: string;
  contentLanguage: "ar";
  tags: string[];
  summaryCards: DisorderSummaryCard[];
  helperCards: DisorderHelperCard[];
  conceptBody: string[];
  conceptCheck: DisorderCheck;
  symptomGroups: DisorderSymptomGroup[];
  symptomCheck: DisorderCheck;
  distinctions: DisorderDistinction[];
  distinctionCheck: DisorderCheck;
  criteria: DisorderCriteria[];
  diagnosticCheck: DisorderCheck;
  formationFrameworks: DisorderFramework[];
  formationCheck: DisorderCheck;
  roadmapSteps: DisorderRoadmapStep[];
  roadmapCheck: DisorderCheck;
  toolsIntro: string[];
  tools: DisorderTool[];
  trainingIntro: string[];
  trainingExercises: DisorderExercise[];
  trainingCheck: DisorderCheck;
  riskIntro: string[];
  riskStages: DisorderRoadmapStep[];
  riskCheck: DisorderCheck;
  caseStudy: DisorderCaseStudy;
  quizIntro: string[];
  quiz: DisorderQuizQuestion[];
  references: DisorderReferenceFile[];
  recap: string[];
  nextFocus: string;
  sourceTrace: Record<string, DisorderSourceTrace>;
};

function tableRows(columns: number, rows: number, fill = "") {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => fill));
}

const depression: Disorder = {
  slug: "depression",
  title: "الاكتئاب",
  subtitle: "وحدة اضطراب تعليمية تجمع الفهم السريري، الصياغة المعرفية السلوكية، والأدوات التطبيقية.",
  audience: "موجهة لمتدرب CBT في المستوى المبتدئ إلى المتوسط.",
  contentLanguage: "ar",
  tags: ["اضطرابات", "اكتئاب", "تشخيص", "صياغة", "CBT"],
  summaryCards: [
    {
      title: "ليست مجرد حالة حزن",
      text: "الوحدة تبدأ من تصحيح الفكرة الشائعة: الاكتئاب اضطراب قد يغيّر المزاج والتفكير والسلوك والأداء، وليس مجرد ضيق عابر."
    },
    {
      title: "الفهم قبل الأداة",
      text: "قبل استخدام الجداول والفنيات، يحتاج المتدرب إلى فهم الصورة السريرية، والمنطق التشخيصي، وكيف يحافظ الاكتئاب على نفسه."
    },
    {
      title: "الأدوات لها توقيت",
      text: "المادة العلمية شددت على أن البداية ليست معرفية دائمًا، خصوصًا عندما تكون الطاقة والتركيز والدافعية منخفضة بشدة."
    }
  ],
  helperCards: [
    {
      label: "لماذا يهم هذا القسم؟",
      title: "الفهم هنا يمنع الظلم السريري",
      text: "إذا لم يفهم المتدرب الفرق بين الحزن والاكتئاب، أو بين العرض والتشخيص، فسيقرأ المعاناة قراءة أخلاقية أو سطحية."
    },
    {
      label: "مفهوم خاطئ شائع",
      title: "الاكتئاب = ضعف شخصية أو ضعف إيمان",
      text: "المصدران يرفضان هذا الاختزال. قد يفسر المريض حالته بهذه الطريقة، لكن مهمة المتدرب أن يرى البناء السريري والمعرفي والسلوكي."
    },
    {
      label: "تمييز سريع",
      title: "العرض لا يساوي تشخيصًا",
      text: "وجود عرض واحد أو حتى عدة أعراض لا يكفي وحده. التشخيص يحتاج نمطًا، مدة، تعطلًا، وتفكيرًا سريريًا منظمًا."
    }
  ],
  conceptBody: [
    "الاكتئاب كما تقدمه المادة العلمية والشرائح ليس مجرد مزاج منخفض، بل اضطراب قد يغيّر طريقة إدراك الشخص لنفسه والعالم والمستقبل، ويؤثر في نشاطه الجسدي، وقراراته، وأدائه اليومي.",
    "تكمن أهميته التعليمية في أن المتدرب يواجهه كثيرًا في التدريب السريري، لكنه قد يخطئ قراءته إذا اختزله في الحزن أو الوعظ أو الكسل. هنا نحتاج أن نفهم المعنى قبل المصطلح: ماذا يحدث للإنسان؟ كيف يصف خبرته؟ ولماذا قد لا يطلب المساعدة أصلًا؟",
    "الشرائح تساعد في تقديم صورة إنسانية بسيطة وواضحة، بينما المادة العلمية تضيف العمق التشخيصي والتطبيقي. لذلك صيغ هذا القسم ليكون بداية تعلم، لا بداية حفظ."
  ],
  conceptCheck: {
    type: "multiple-choice",
    title: "تحقق سريع",
    prompt: "أي عبارة أدق في وصف الاكتئاب كما تقدمه هذه الوحدة؟",
    options: [
      {
        label: "هو حزن شديد فقط، لكنه يظل ضمن النطاق الانفعالي الطبيعي.",
        explanation: "هذا اختزال زائد. الحزن قد يكون جزءًا من الصورة، لكن الاكتئاب أوسع ويمس التفكير والطاقة والسلوك والأداء.",
        correct: false
      },
      {
        label: "هو اضطراب يؤثر في المزاج والتفكير والجسد والسلوك، وقد يعطل الوظيفة اليومية ويحتاج فهمًا سريريًا منظمًا.",
        explanation: "هذا هو المنطق الذي تبنيه الوحدة: وصف سريري وتعليمي منظم، لا حكم أخلاقي ولا تبسيط.",
        correct: true
      },
      {
        label: "هو حالة تتضح فقط عندما يصرح الشخص برغبته في الموت.",
        explanation: "الخطر قد يظهر في بعض الحالات، لكنه ليس الشرط الوحيد، كما أن العلامات تبدأ قبل التصريح المباشر.",
        correct: false
      }
    ]
  },
  symptomGroups: [
    {
      groupName: "الأعراض الوجدانية",
      intro: "هذا هو الباب الذي يظهر فيه تعكر المزاج وفقدان المتعة بوصفهما قلب الصورة الاكتئابية.",
      items: ["مزاج متعكر أو حزين معظم الوقت", "فقدان القدرة على الاستمتاع أو التلذذ", "إحباط وتعاسة مستمرة", "شعور داخلي بالخواء أو انطفاء الحياة"],
      examples: ["\"الحاجات اللي كانت بتفرحني ما بقتش بتفرق\"", "\"أنا عايش لكن من جوّا مطفي\""]
    },
    {
      groupName: "الأعراض المعرفية",
      intro: "تظهر هنا طريقة التفكير المكتئبة: الذنب، قلة القيمة، اليأس، وضعف التركيز والتفسير السلبي.",
      items: ["الشعور المفرط بالذنب", "الإحساس بعدم القيمة أو الفشل", "اليأس من المستقبل", "بطء التفكير وضعف التركيز والتردد", "تفسير الأحداث بطريقة انهزامية أو متحيزة سلبيًا"],
      examples: ["\"أكيد المشكلة كلها بسببي\"", "\"حتى لو حاولت، النتيجة محسومة\""]
    },
    {
      groupName: "الأعراض الجسمانية",
      intro: "المادة العلمية توسع هذا الباب بوضوح، وتبيّن أن الاكتئاب قد يُعاش في الجسد لا في المشاعر فقط.",
      items: ["اضطرابات النوم", "تغيرات الشهية أو الوزن", "الإرهاق أو فقدان الطاقة", "آلام وأوجاع جسمانية", "ثقل في الحركة أو الإحساس بالهبوط"],
      examples: ["\"أنام وأصحى كأني راجع من رحلة مرهقة\"", "\"حاسس بثقل في عيني وصداع ملازمني\""]
    },
    {
      groupName: "الأعراض السلوكية",
      intro: "هنا نرى كيف تتحول المعاناة إلى انسحاب أو بطء أو تهيج أو تعطّل في أدوار الحياة.",
      items: ["الانسحاب الاجتماعي", "التأخر أو البطء النفسي الحركي", "التهيج النفسي الحركي في بعض الحالات", "تعطل الدراسة أو العمل أو العناية اليومية", "محاولات أو تدرج في الخطر الانتحاري"],
      examples: ["\"بقيت أتهرب من الناس ومن أي التزام\"", "\"حتى الرد على الرسائل بقى محتاج مجهود\""]
    }
  ],
  symptomCheck: {
    type: "classification",
    title: "صنّف العرض",
    prompt: "اختر المجموعة الأنسب لكل عبارة كما يتعلمها المتدرب في هذه الوحدة.",
    groups: ["وجدانية", "معرفية", "جسمانية", "سلوكية"],
    items: [
      {
        text: "«ما عاد عندي أي طعم للحياة أو الأشياء التي كانت تسعدني»",
        correctGroup: "وجدانية",
        feedback: "هذه العبارة تعبّر عن فقدان المتعة، وهو من الأعراض الوجدانية المحورية."
      },
      {
        text: "«مهما حصل لن يتحسن شيء، ومستقبلي منتهي»",
        correctGroup: "معرفية",
        feedback: "هذه صياغة واضحة لليأس والتوقع السلبي للمستقبل، وهو عرض معرفي."
      },
      {
        text: "«أنام وأصحو وكأنني لم أنم، وكل جسمي منهك»",
        correctGroup: "جسمانية",
        feedback: "هذا يصف اضطراب النوم مع الإرهاق، وهو من البناء الجسماني للصورة الاكتئابية."
      },
      {
        text: "«صرت أنسحب من الناس وأترك واجباتي اليومية»",
        correctGroup: "سلوكية",
        feedback: "الانسحاب وتعطل الأداء اليومي من أوضح المؤشرات السلوكية."
      }
    ]
  },
  distinctions: [
    {
      title: "الحزن العادي مقابل الاكتئاب",
      leftTitle: "الحزن العادي",
      rightTitle: "الاكتئاب",
      left: "خبرة إنسانية قد تتبع فقدًا أو إحباطًا أو حدثًا مؤلمًا، وقد تبقى مع شيء من القدرة على الاستجابة للحياة.",
      right: "نمط أوسع وأشد تأثيرًا، يمس المتعة والطاقة والتفكير والأداء، ويستمر بصورة تعطل الوظيفة اليومية.",
      whyItMatters: "الخلط بينهما يؤدي إلى المبالغة في التشخيص أو إلى التقليل من معاناة الحالة الحقيقية."
    },
    {
      title: "الفقد الطبيعي مقابل نوبة الاكتئاب",
      leftTitle: "الفقد الطبيعي",
      rightTitle: "نوبة الاكتئاب",
      left: "قد يتضمن حزنًا شديدًا ونقص شهية واضطراب نوم واجترارًا حول الفقد، لكن يظل مرتبطًا بالسياق ويُقرأ بحذر ثقافي وسريري.",
      right: "يُفكَّر فيها عندما تتكون صورة سريرية ممتدة مع تعطل وظيفي وأعراض بنائية لا تفسر بالفقد وحده.",
      whyItMatters: "المادة العلمية شددت على الحذر هنا حتى لا نخلط بين استجابة بشرية موجعة وبين نوبة سريرية كاملة."
    },
    {
      title: "الضيق العابر مقابل النمط الإكلينيكي",
      leftTitle: "ضيق عابر",
      rightTitle: "نمط إكلينيكي",
      left: "قد يظهر عرض أو عرضان في فترة ضغط ثم يخفان من غير بناء اكتئابي كامل.",
      right: "تتجمع الأعراض في نمط متماسك مع مدة كافية وتأثير واضح في العمل أو الدراسة أو العلاقات.",
      whyItMatters: "المنطق التشخيصي لا يبنى على كلمة واحدة، بل على النمط والاستمرار والتعطل."
    }
  ],
  distinctionCheck: {
    type: "multiple-choice",
    title: "حالة مقارنة",
    prompt: "شخص فقد قريبًا له قبل أيام، حزين جدًا، نومه مضطرب، ويجتر أفكار الفقد، لكنه ما زال يتفاعل مع أسرته أحيانًا ويصف حزنه على أنه مرتبط بالموقف. كيف نفكر هنا أولًا؟",
    options: [
      {
        label: "نعدّ ذلك مباشرة نوبة اكتئاب كاملة لأن اضطراب النوم والحزن الشديد موجودان.",
        explanation: "هذه قراءة متسرعة؛ المادة العلمية تذكر أن ردود الفعل الطبيعية للفقد قد تحمل أعراضًا مشابهة وتحتاج قراءة أكثر حذرًا.",
        correct: false
      },
      {
        label: "نقرأ الحالة أولًا في سياق الفقد الطبيعي، ثم ننتبه إذا تشكل نمط سريري ممتد وتعطل واضح لا يفسره الفقد وحده.",
        explanation: "هذا هو التفكير التعليمي الصحيح: الحذر من الإفراط في الوصم مع إبقاء العين على المؤشرات السريرية.",
        correct: true
      },
      {
        label: "نهمل الأعراض الحالية لأنها دائمًا جزء طبيعي من الفقد ولا تستحق متابعة.",
        explanation: "هذا أيضًا خطأ؛ المطلوب هو الحذر والمتابعة، لا الإهمال.",
        correct: false
      }
    ]
  },
  criteria: [
    {
      title: "كيف نفكر في التشخيص؟",
      rules: [
        "نبحث أولًا عن وجود عرض محوري من المزاج المكتئب أو فقدان المتعة.",
        "ثم ننظر إلى عدد بقية الأعراض وتجمعها في صورة بنائية واضحة.",
        "نثبت وجود مدة كافية واستمرار نسبي في الأيام.",
        "نراجع التعطل الوظيفي: الدراسة، العمل، العلاقات، والرعاية الذاتية.",
        "نقدّر الشدة: بسيط، متوسط، شديد، بناءً على كثافة الأعراض وتعطيلها وخطورة الحالة."
      ],
      note: "هذا المسار تعليمي ولا يحل محل التقييم السريري الكامل، لكنه يعلّم المتدرب المنطق بدل الحفظ المجرد."
    },
    {
      title: "الشدة بلغة وظيفية",
      rules: [
        "البسيط: أعراض أقل نسبيًا مع بقاء بعض القدرة على العمل أو الدراسة.",
        "المتوسط: تعطل أوضح مع صعوبة في الاستمرار الطبيعي في الأدوار اليومية.",
        "الشديد: صورة كثيفة قد تشمل ضعفًا شديدًا في الطاقة والتركيز أو ارتفاعًا في الخطر أو شبه توقف في الأداء."
      ],
      note: "المادة العلمية توازن بين العدد وبين أثر الحالة على الأداء."
    }
  ],
  diagnosticCheck: {
    type: "multiple-choice",
    title: "تطبيق تشخيصي مبسط",
    prompt: "إذا حضر شخص بمزاج مكتئب، فقدان متعة، أرق شبه يومي، إرهاق شديد، شعور بعدم القيمة، ضعف تركيز، وتعطل واضح في العمل منذ أسابيع، فما الذي نفكر فيه تعليميًا؟",
    options: [
      {
        label: "نفكر في وجود مؤشرات قوية على نوبة اكتئابية، ثم نتحقق من باقي الشروط والسياق والشدة بدل الاكتفاء بالانطباع.",
        explanation: "هذا هو التفكير الصحيح: توجد صورة سريرية قوية، لكننا نثبتها بمنطق منظم لا بحدس سريع.",
        correct: true
      },
      {
        label: "لا يمكن التفكير في الاكتئاب لأن الأعراض الجسمانية ليست كافية وحدها.",
        explanation: "هنا توجد أعراض محورية ومعرفية وجسمانية وتعطل وظيفي، وليست المسألة مسألة عرض جسماني معزول.",
        correct: false
      },
      {
        label: "يكفي وجود الحزن وحده كي نثبت التشخيص مباشرة.",
        explanation: "الحزن وحده لا يكفي؛ المطلوب صورة متكاملة ومنطق تشخيصي منظم.",
        correct: false
      }
    ]
  },
  formationFrameworks: [
    {
      title: "لماذا قد يظهر الاكتئاب؟",
      intro: "المادة العلمية لا تحصره في سبب واحد، بل تفتح أكثر من مدخل للفهم.",
      items: [
        "عوامل وراثية وعصبية وكيميائية قد تزيد الاستعداد.",
        "طريقة تفسير الشخص للأحداث ونظرته لنفسه والعالم والمستقبل.",
        "عوامل سلوكية مثل انخفاض المدعمات الإيجابية والانسحاب والعزلة.",
        "خبرات مبكرة أو مخططات معرفية سلبية تنشط تحت الضغط."
      ]
    },
    {
      title: "الثالوث المعرفي",
      items: [
        "نظرة سلبية نحو الذات: أنا ناقص، فاشل، أو غير ذي قيمة.",
        "نظرة سلبية نحو العالم: الناس والحياة والظروف ضدّي أو لا تقدم دعمًا.",
        "نظرة سلبية نحو المستقبل: لا شيء سيتغير، والفشل قادم على أي حال."
      ]
    },
    {
      title: "كيف تستمر الحلقة؟",
      items: [
        "يحدث موقف ضاغط أو مثير.",
        "تنشط مخططات أو معتقدات سلبية قديمة.",
        "تظهر أفكار تلقائية مكتئبة وتفسيرات منحازة.",
        "يتولد مزاج منخفض ويقل النشاط.",
        "يزيد الانسحاب والعزلة وقلة المدعمات الإيجابية.",
        "تجد الأفكار السلبية نفسها دليلًا جديدًا فتستمر الحلقة."
      ]
    },
    {
      title: "أخطاء معرفية متكررة",
      items: [
        "التجريد الانتقائي: التركيز على الجزء السلبي فقط.",
        "الاستدلال التعسفي: الوصول إلى نتيجة من غير دليل كافٍ.",
        "التعميم الزائد: تحويل موقف واحد إلى قاعدة عامة.",
        "قراءة الخبرة بأسلوب انهزامي أو اجتراري."
      ]
    }
  ],
  formationCheck: {
    type: "multiple-choice",
    title: "افهم الحلقة",
    prompt: "ما الفكرة الأدق في فهم استمرار الاكتئاب داخل نموذج CBT؟",
    options: [
      {
        label: "الاكتئاب يستمر فقط بسبب خلل كيميائي، لذلك لا يفيد فهم الأفكار أو السلوك.",
        explanation: "المادة العلمية تذكر المدخل العصبي، لكنها لا تختزل الحالة فيه؛ النموذج المعرفي السلوكي يشرح كيف تستمر الأعراض عبر المعنى والسلوك.",
        correct: false
      },
      {
        label: "المواقف تضغط، فتتنشط المخططات والأفكار السلبية، ويقل النشاط، ثم يزيد الانسحاب وقلة المدعمات، فتتغذى الحلقة من جديد.",
        explanation: "هذا يلخص منطق الصياغة المعرفية السلوكية كما ورد في المادة العلمية.",
        correct: true
      },
      {
        label: "بمجرد وجود أفكار سلبية، لا حاجة للنظر إلى السلوك أو البيئة أو التاريخ الشخصي.",
        explanation: "هذا تبسيط مخل؛ الصياغة في CBT تربط بين الخبرات والمعتقدات والأفكار والسلوك والنتائج.",
        correct: false
      }
    ]
  },
  roadmapSteps: [
    {
      title: "التهيئة والتثقيف النفسي",
      text: "نبني التحالف العلاجي، ونطبع الخبرة الاكتئابية، ونشرح للمريض أن ما يمر به مفهوم وقابل للفهم والعمل."
    },
    {
      title: "التركيز السلوكي المبكر",
      text: "عندما تكون الطاقة والتركيز والدافعية منخفضة، لا تكون البداية المعرفية الخالصة هي الأنسب دائمًا؛ نبدأ باستعادة الحركة والأنشطة والمدعمات."
    },
    {
      title: "رصد الأفكار التلقائية",
      text: "بعد وجود أرضية عمل أفضل، نستخدم الجداول والأسئلة لكشف الأفكار التلقائية وطريقة تفسير المواقف."
    },
    {
      title: "إعادة التقييم والتعديل",
      text: "نستخدم الأسئلة السقراطية والتجارب السلوكية والمتصل المعرفي لفك جمود التفسير وليس لمجرد إثبات أن المريض مخطئ."
    },
    {
      title: "العمل الأعمق والمهارات",
      text: "عند الحاجة، ننتقل إلى المعتقدات الجوهرية والمهارات الاجتماعية وحل المشكلات وتوكيد الذات."
    },
    {
      title: "المتابعة ومنع الانتكاسة",
      text: "نرسخ ما تعلمه المريض، وننتبه إلى الإشارات المبكرة، ونحافظ على المعتقدات الجديدة وخطط النشاط."
    }
  ],
  roadmapCheck: {
    type: "multiple-choice",
    title: "من أين نبدأ؟",
    prompt: "في اكتئاب متوسط إلى شديد مع طاقة منخفضة وتركيز ضعيف وعزلة واضحة، ما البداية الأقرب لمنطق المادة العلمية؟",
    options: [
      {
        label: "نبدأ مباشرة بجدل معرفي عميق حول المعتقدات الجوهرية.",
        explanation: "هذا قد يكون مبكرًا جدًا عندما تكون الطاقة والتركيز منخفضين.",
        correct: false
      },
      {
        label: "نهيئ للعلاج، ونستخدم التثقيف النفسي، ثم نبدأ بتغييرات سلوكية مبكرة مثل جدولة الأنشطة واستعادة الاندماج تدريجيًا.",
        explanation: "هذا ما تؤكد عليه المادة العلمية بوضوح في المراحل المبكرة من العمل.",
        correct: true
      },
      {
        label: "نؤجل أي تدخل حتى تختفي الأعراض من تلقاء نفسها لأن العمل المعرفي السلوكي لا يفيد في هذه المرحلة.",
        explanation: "هذا مخالف للمادة العلمية؛ المطلوب اختيار البداية المناسبة لا إيقاف العمل كله.",
        correct: false
      }
    ]
  },
  toolsIntro: [
    "هذا القسم لا يكتفي بتسمية الأدوات، بل يعلّم المتدرب لماذا وُجدت الأداة، ومتى تُستخدم، ومتى لا تكون هي البداية المناسبة.",
    "كل أداة هنا مرتبطة بنموذج قابل للعرض والتنزيل، مع نسخة فارغة، ونسخة تدريبية شبه مملوءة، ونسخة مملوءة بالكامل عندما يكون ذلك مناسبًا."
  ],
  tools: [
    {
      slug: "abc",
      name: "نموذج ABC",
      what: "إطار مبسط يربط بين الحدث أو الموقف، وتفسير الشخص له، ثم ما ينتج عنه من شعور وسلوك.",
      whenUsed: "يستخدم مبكرًا لتعليم أن المشكلة ليست في الحدث وحده، بل في معنى الحدث داخل ذهن الشخص.",
      whenNotFirst: "إذا كان المريض مشتتًا جدًا أو عاجزًا عن تتبع الخبرة، قد نحتاج أولًا إلى تهدئة أو تنشيط سلوكي أبسط.",
      steps: ["حدد الموقف بدقة.", "اكتب الفكرة أو التفسير الذي ظهر.", "سمِّ الشعور والسلوك الناتج.", "راجع العلاقة بين B وبين C."],
      example: "موقف: تأخر الرد على رسالة. الفكرة: أنا غير مهم. النتيجة: حزن وانسحاب.",
      commonMistakes: ["كتابة الموقف على شكل تفسير.", "خلط الشعور بالفكرة.", "تحويل الأداة إلى نص إنشائي طويل."],
      relatedWorksheet: "ورقة نموذج ABC",
      layouts: {
        blank: {
          type: "table",
          headers: ["A الموقف", "B الفكرة أو التفسير", "C الشعور/السلوك"],
          rows: tableRows(3, 6)
        },
        guided: {
          type: "table",
          headers: ["A الموقف", "B الفكرة أو التفسير", "C الشعور/السلوك"],
          rows: [
            ["تأخر صديقتي في الرد", "ما عدت مهمة لديها", "حزن + تجنب"],
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
          ]
        },
        filled: {
          type: "table",
          headers: ["A الموقف", "B الفكرة أو التفسير", "C الشعور/السلوك"],
          rows: [
            ["تأخر مشرفي في الرد على الرسالة", "أكيد غير راضٍ عني", "قلق 80% + تجنب السؤال مرة ثانية"],
            ["لم أخرج من غرفتي عصرًا", "أنا فاشل حتى في أبسط الأشياء", "حزن 75% + مزيد من الانسحاب"]
          ]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/abc-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/abc-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/abc-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/abc-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/abc-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/abc-filled.xlsx"
      }
    },
    {
      slug: "conceptualization",
      name: "التصور أو الصياغة المعرفية",
      what: "خريطة تشرح كيف ترتبط الطفولة والخبرات المبكرة بالمعتقدات الجوهرية والوسيطة والاستراتيجيات التعويضية والأعراض الحالية.",
      whenUsed: "تستخدم بعد تكوّن معلومات كافية عن النمط المتكرر، لتوجيه العلاج بدل العمل المتناثر.",
      whenNotFirst: "لا تكون البداية المناسبة إذا لم تتضح الأفكار والمشكلات الحالية بعد، أو إذا كان المريض ما يزال في بداية التهيئة.",
      steps: ["اجمع معلومات الطفولة والخبرات ذات الصلة.", "حدد المعتقد الجوهري والوسيط.", "اربطها بالأفكار التلقائية الحالية.", "أضف السلوكيات والاستراتيجيات التعويضية.", "استخرج كيف يحافظ ذلك على المشكلة."],
      example: "خبرات إهمال مبكرة -> معتقد: لا أحد يحبني -> قاعدة: إذا أرضيت الجميع سيبقون معي -> سلوك: لا أرفض الطلبات -> نتيجة: إنهاك وحزن وانسحاب.",
      commonMistakes: ["كتابة الصياغة كحكم نهائي بدل فرضية عمل.", "القفز إلى المعتقد الجوهري من غير دلائل كافية.", "فصل الصياغة عن اختيار الخطة العلاجية."],
      relatedWorksheet: "استمارة التصور المعرفي",
      layouts: {
        blank: {
          type: "sections",
          sections: [
            { title: "خبرات مبكرة مهمة", lines: ["", "", ""] },
            { title: "المعتقد الجوهري", lines: [""] },
            { title: "المعتقدات الوسيطة", lines: ["", ""] },
            { title: "الأفكار التلقائية الحالية", lines: ["", ""] },
            { title: "الاستراتيجيات التعويضية والسلوك", lines: ["", ""] }
          ]
        },
        guided: {
          type: "sections",
          sections: [
            { title: "خبرات مبكرة مهمة", lines: ["مثال: تعرضت لنقد متكرر من أحد الوالدين", "", ""] },
            { title: "المعتقد الجوهري", lines: ["مثال: أنا غير كفء"] },
            { title: "المعتقدات الوسيطة", lines: ["إذا لم أكن مثاليًا فسيرفضني الناس", ""] },
            { title: "الأفكار التلقائية الحالية", lines: ["أكيد سأفشل", ""] },
            { title: "الاستراتيجيات التعويضية والسلوك", lines: ["تجنب المحاولة أو الانسحاب", ""] }
          ]
        },
        filled: {
          type: "sections",
          sections: [
            { title: "خبرات مبكرة مهمة", lines: ["إهمال عاطفي من الأم", "صعوبة في تكوين صداقات في المدرسة", "خبرات تحرش في سن صغيرة"] },
            { title: "المعتقد الجوهري", lines: ["محدش بيحبني"] },
            { title: "المعتقدات الوسيطة", lines: ["لو جيت على نفسي في العلاقة سيتمسكون بي", "لازم أتجنب الرفض بأي طريقة"] },
            { title: "الأفكار التلقائية الحالية", lines: ["أنا مليش لزمة", "أي مشكلة معناها أنني فاشلة"] },
            { title: "الاستراتيجيات التعويضية والسلوك", lines: ["لا أرفض طلبات الآخرين", "أنسحب وأعزل نفسي عند أقل خيبة"] }
          ]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/conceptualization-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/conceptualization-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/conceptualization-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/conceptualization-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/conceptualization-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/conceptualization-filled.xlsx"
      }
    },
    {
      slug: "thought-record",
      name: "جدول المراقبة الذاتية للأفكار السلبية",
      what: "ورقة عمل ترصد الموقف والانفعال والفكرة ودرجة الإيمان بها، ثم تُبنى عليها قراءة بديلة أكثر توازنًا.",
      whenUsed: "تستخدم عندما يصبح المريض قادرًا على رصد أفكاره التلقائية بدقة نسبية، وغالبًا بعد التهيئة والتثقيف الأولي.",
      whenNotFirst: "إذا كان المريض شديد الانهاك أو غير قادر على تحديد الفكرة أصلًا، نبدأ بما هو أبسط أو أكثر سلوكية.",
      steps: ["حدد اليوم أو الساعة والموقف.", "سمِّ الانفعال ودرجته.", "اكتب الفكرة ودرجة الإيمان بها.", "اقرأ الأسئلة السقراطية.", "دوّن الفكرة البديلة والانفعال الجديد."],
      example: "الموقف: تجاهل زميلة. الانفعال: حزن 70%. الفكرة: أنا منبوذ. الفكرة البديلة: لا أملك دليلًا كافيًا، وربما كانت مشغولة.",
      commonMistakes: ["كتابة قصة طويلة بدل موقف محدد.", "عدم تقدير الشدة بالأرقام.", "تقديم فكرة بديلة وعظية لا ترتبط بالأدلة."],
      relatedWorksheet: "سجل الأفكار السلبية",
      layouts: {
        blank: {
          type: "table",
          headers: ["اليوم/الساعة", "الموقف", "الانفعال ودرجته", "الفكرة ودرجة الإيمان", "الفكرة البديلة", "الانفعال بعد المراجعة"],
          rows: tableRows(6, 5)
        },
        guided: {
          type: "table",
          headers: ["اليوم/الساعة", "الموقف", "الانفعال ودرجته", "الفكرة ودرجة الإيمان", "الفكرة البديلة", "الانفعال بعد المراجعة"],
          rows: [
            ["الاثنين 6م", "تأخر الرد على رسالتي", "حزن 70%", "أنا غير مهم 85%", "هل أملك دليلًا كافيًا؟", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""]
          ]
        },
        filled: {
          type: "table",
          headers: ["اليوم/الساعة", "الموقف", "الانفعال ودرجته", "الفكرة ودرجة الإيمان", "الفكرة البديلة", "الانفعال بعد المراجعة"],
          rows: [
            ["الاثنين 6م", "تأخر الرد على رسالتي", "حزن 70%", "أنا غير مهم 85%", "قد يكون التأخر سببه الانشغال، وليس رفضي", "حزن 45%"],
            ["الأربعاء 11ص", "لم أستطع إكمال مهمة", "إحباط 80%", "أنا فاشل في كل شيء 90%", "تعثري في مهمة لا يعني أنني فاشل في كل شيء", "إحباط 50%"]
          ]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/thought-record-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/thought-record-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/thought-record-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/thought-record-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/thought-record-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/thought-record-filled.xlsx"
      }
    },
    {
      slug: "socratic",
      name: "الأسئلة السقراطية",
      what: "مجموعة أسئلة تساعد المريض على مراجعة الفكرة أو المعتقد بدل مجادلته بصورة مباشرة.",
      whenUsed: "تستخدم عند وجود فكرة محددة تحتاج فحص الأدلة والمعنى والبدائل.",
      whenNotFirst: "لا تصلح إذا لم نفهم الفكرة أصلًا، أو إذا تحولت إلى استجواب يربك المريض بدل أن يساعده.",
      steps: ["حدد الفكرة المستهدفة.", "اسأل عن أدلة الصحة.", "اسأل عن أدلة عدم الصحة.", "اسأل عن أسوأ احتمال وكيف سيتعامل معه.", "ابحث عن تفسير بديل أو نصيحة لصديق."],
      example: "ما الدليل أن الجميع يراك فاشلًا؟ وما الدليل المضاد؟ لو قالها صديق عن نفسه فبماذا سترد عليه؟",
      commonMistakes: ["تحويل السؤال إلى امتحان.", "سرد الأسئلة كلها من غير إنصات.", "القفز إلى بديل إيجابي غير مدعوم."],
      relatedWorksheet: "ورقة الأسئلة السقراطية",
      layouts: {
        blank: {
          type: "sections",
          sections: [
            { title: "الفكرة المستهدفة", lines: [""] },
            { title: "ما الأدلة التي تؤيدها؟", lines: ["", ""] },
            { title: "ما الأدلة التي لا تؤيدها؟", lines: ["", ""] },
            { title: "ما أسوأ ما قد يحدث؟ وكيف يمكن التعامل معه؟", lines: ["", ""] },
            { title: "ما الفكرة البديلة الأكثر توازنًا؟", lines: [""] }
          ]
        },
        guided: {
          type: "sections",
          sections: [
            { title: "الفكرة المستهدفة", lines: ["مثال: لا أحد يريدني"] },
            { title: "ما الأدلة التي تؤيدها؟", lines: ["رفضت دعوتي مرة", ""] },
            { title: "ما الأدلة التي لا تؤيدها؟", lines: ["هناك من تواصل معي الأسبوع الماضي", ""] },
            { title: "ما أسوأ ما قد يحدث؟ وكيف يمكن التعامل معه؟", lines: ["", ""] },
            { title: "ما الفكرة البديلة الأكثر توازنًا؟", lines: [""] }
          ]
        },
        filled: {
          type: "sections",
          sections: [
            { title: "الفكرة المستهدفة", lines: ["لا أحد يريدني"] },
            { title: "ما الأدلة التي تؤيدها؟", lines: ["اعتذرت صديقة عن لقائي", "تجاهلني زميل في العمل يومًا واحدًا"] },
            { title: "ما الأدلة التي لا تؤيدها؟", lines: ["تواصلت أختي معي وسألت عني", "قبل يومين دعاني صديق للخروج"] },
            { title: "ما أسوأ ما قد يحدث؟ وكيف يمكن التعامل معه؟", lines: ["قد يرفضني بعض الناس فعلًا", "يمكنني طلب دعم من أشخاص آخرين وعدم تعميم التجربة"] },
            { title: "ما الفكرة البديلة الأكثر توازنًا؟", lines: ["بعض العلاقات قد تخيبني، لكن ليس معنى ذلك أنني غير مرغوب من الجميع"] }
          ]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/socratic-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/socratic-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/socratic-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/socratic-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/socratic-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/socratic-filled.xlsx"
      }
    },
    {
      slug: "behavioral-experiment",
      name: "التجارب السلوكية",
      what: "تجربة واقعية صغيرة لاختبار صحة التوقع أو الفكرة السلبية عندما لا يؤيدها الواقع بدرجة كافية.",
      whenUsed: "تستخدم بعد تحديد توقع واضح وقابل للاختبار في الواقع.",
      whenNotFirst: "إذا كان الواقع يؤيد الفكرة فعلًا أو كانت الخطورة عالية، فقد نحتاج حل مشكلات أو توكيد ذات بدل التجربة.",
      steps: ["حدد الفكرة المراد اختبارها.", "دوّن ما يتوقعه المريض.", "صمم موقفًا صغيرًا وآمنًا للاختبار.", "نفذ التجربة.", "قارن النتيجة بما كان متوقعًا."],
      example: "الفكرة: لو تكلمت أمام الناس سيضحكون عليّ. التجربة: أطرح سؤالًا قصيرًا في اللقاء. النتيجة: لم يحدث ما توقعته.",
      commonMistakes: ["اختيار تجربة كبيرة جدًا.", "تنفيذها من غير توقع واضح مسبق.", "استخدامها لإثبات الخطأ بدل التعلم من النتيجة."],
      relatedWorksheet: "ورقة التجربة السلوكية",
      layouts: {
        blank: {
          type: "table",
          headers: ["الفكرة", "التوقع", "تصميم التجربة", "النتيجة الفعلية", "ما الذي تعلمته؟"],
          rows: tableRows(5, 5)
        },
        guided: {
          type: "table",
          headers: ["الفكرة", "التوقع", "تصميم التجربة", "النتيجة الفعلية", "ما الذي تعلمته؟"],
          rows: [["لو طلبت المساعدة سيرفضني الجميع", "سيرفضونني بنسبة كبيرة", "سأطلب مساعدة محددة من زميل واحد", "", ""], ["", "", "", "", ""]]
        },
        filled: {
          type: "table",
          headers: ["الفكرة", "التوقع", "تصميم التجربة", "النتيجة الفعلية", "ما الذي تعلمته؟"],
          rows: [["لو طلبت المساعدة سيرفضني الجميع", "سيرفضونني بنسبة 90%", "طلبت من زميل واحد مساعدتي في مهمة قصيرة", "وافق وساعدني بهدوء", "توقعي كان أوسع من الواقع، والطلب المحدد قد ينجح"]]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/behavioral-experiment-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/behavioral-experiment-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/behavioral-experiment-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/behavioral-experiment-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/behavioral-experiment-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/behavioral-experiment-filled.xlsx"
      }
    },
    {
      slug: "continuum",
      name: "المتصل المعرفي",
      what: "أداة تساعد على كسر التفكير الثنائي المطلق، ونقل التقييم من 0 إلى 100 بدل صح/خطأ بالكامل.",
      whenUsed: "تستخدم عندما يكون المريض يرى نفسه أو الآخرين أو المواقف بصورة قطبية جامدة.",
      whenNotFirst: "لا تكون البداية إذا كانت المشكلة الأساسية غياب النشاط أو غموض الفكرة أصلًا.",
      steps: ["حدد الفكرة القطبية.", "ابنِ متصلًا من 0 إلى 100.", "ضع أمثلة أو أشخاصًا على المتصل.", "حدد موضع المريض فعليًا.", "استخرج قراءة أكثر مرونة."],
      example: "بدل «أنا فاشل تمامًا»، يوضع المتصل بين فشل كامل وكفاءة كاملة، ثم تبحث الأدلة عن موضع أكثر واقعية.",
      commonMistakes: ["استخدام المتصل لإجبار المريض على التفاؤل.", "وضع نقاط من غير معايير واضحة.", "نسيان ربط الأداة بالدليل الواقعي."],
      relatedWorksheet: "ورقة المتصل المعرفي",
      layouts: {
        blank: {
          type: "sections",
          sections: [
            { title: "الفكرة القطبية", lines: [""] },
            { title: "طرف 0%", lines: [""] },
            { title: "طرف 100%", lines: [""] },
            { title: "أين يضع المريض نفسه الآن؟", lines: [""] },
            { title: "ما الموضع الأقرب للواقع بعد جمع الأدلة؟", lines: [""] }
          ]
        },
        guided: {
          type: "sections",
          sections: [
            { title: "الفكرة القطبية", lines: ["أنا غير كفء على الإطلاق"] },
            { title: "طرف 0%", lines: ["غير كفء تمامًا"] },
            { title: "طرف 100%", lines: ["كفء دائمًا في كل شيء"] },
            { title: "أين يضع المريض نفسه الآن؟", lines: ["10%"] },
            { title: "ما الموضع الأقرب للواقع بعد جمع الأدلة؟", lines: [""] }
          ]
        },
        filled: {
          type: "sections",
          sections: [
            { title: "الفكرة القطبية", lines: ["أنا غير كفء على الإطلاق"] },
            { title: "طرف 0%", lines: ["غير كفء تمامًا"] },
            { title: "طرف 100%", lines: ["كفء دائمًا في كل شيء"] },
            { title: "أين يضع المريض نفسه الآن؟", lines: ["10%"] },
            { title: "ما الموضع الأقرب للواقع بعد جمع الأدلة؟", lines: ["45%: أتعثر في بعض المهام، لكن لدي جوانب قدرة واضحة"] }
          ]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/continuum-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/continuum-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/continuum-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/continuum-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/continuum-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/continuum-filled.xlsx"
      }
    },
    {
      slug: "activity-schedule",
      name: "جدولة الأنشطة الأسبوعية",
      what: "جدول زمني يعيد إدخال النشاط إلى الأسبوع ويجعل العمل السلوكي مرئيًا وقابلًا للمتابعة.",
      whenUsed: "تستخدم مبكرًا عندما تكون قلة النشاط والعزلة وانخفاض الدافعية من العوامل المحافظة على الاكتئاب.",
      whenNotFirst: "إذا كانت الحالة تحتاج أولًا إلى احتواء خطر أو إلى تقييم طارئ، فالأولوية ليست للجدولة.",
      steps: ["ارصد اليوم الحالي.", "حدد الفترات الخالية أو المنسحبة.", "أدخل أنشطة واقعية صغيرة.", "راجع التنفيذ والفرق بين المتوقع والفعلي."],
      example: "إدخال نصف ساعة مشي أو جلوس خارج الغرفة أو مهمة قصيرة بدل ترك اليوم فارغًا بالكامل.",
      commonMistakes: ["ملء الجدول بأهداف كبيرة غير واقعية.", "إهمال المراجعة الأسبوعية.", "اختيار أنشطة لا معنى لها للمريض."],
      relatedWorksheet: "جدول الأنشطة الأسبوعي",
      layouts: {
        blank: {
          type: "table",
          headers: ["الوقت", "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
          rows: [["8-9", "", "", "", "", "", "", ""], ["9-10", "", "", "", "", "", "", ""], ["10-11", "", "", "", "", "", "", ""], ["11-12", "", "", "", "", "", "", ""], ["12-1", "", "", "", "", "", "", ""], ["1-2", "", "", "", "", "", "", ""]]
        },
        guided: {
          type: "table",
          headers: ["الوقت", "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
          rows: [["8-9", "استيقاظ + فطور", "", "", "", "", "", ""], ["9-10", "مشي 15 دقيقة", "", "", "", "", "", ""], ["10-11", "", "", "", "", "", "", ""]]
        },
        filled: {
          type: "table",
          headers: ["الوقت", "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
          rows: [["8-9", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور"], ["9-10", "مشي 15 دقيقة", "ترتيب السرير", "مراجعة 30 دقيقة", "مشي 20 دقيقة", "اتصال بصديق", "زيارة قصيرة", "راحة"], ["10-11", "مهمة منزلية", "مذاكرة", "شراء حاجات", "مهمة جامعية", "جلسة علاجية", "قراءة خفيفة", "خروج مع الأسرة"]]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/activity-schedule-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/activity-schedule-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/activity-schedule-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/activity-schedule-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/activity-schedule-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/activity-schedule-filled.xlsx"
      }
    },
    {
      slug: "pleasant-activities",
      name: "الأنشطة السارة",
      what: "قائمة منظمة لأنشطة يتوقع أن تعيد شيئًا من الراحة أو المتعة أو الإحساس بالحياة.",
      whenUsed: "تستخدم عندما تصبح الحياة ضيقة وفقيرة في المدعمات الإيجابية ويحتاج المريض إلى استعادة النشاط الممتع تدريجيًا.",
      whenNotFirst: "لا تستخدم بشكل سطحي أو كأنها وصفة ترفيه، بل تربط دائمًا بالبناء السلوكي للحالة.",
      steps: ["استخرج أنشطة لها معنى شخصي.", "قدّر المتعة المتوقعة.", "نفذ النشاط.", "قارن بالمتعة الفعلية.", "كرر ما يعطي أثرًا معقولًا."],
      example: "ارتداء ملابس مفضلة، المشي في مكان مفتوح، حديث رياضي، أعمال خيرية، لقاء بسيط مع صديق.",
      commonMistakes: ["اختيار أنشطة لا تخص الشخص.", "إغراق القائمة بأنشطة كثيرة دفعة واحدة.", "اعتبار المتعة الفورية الكاملة شرطًا للنجاح."],
      relatedWorksheet: "جدول الأنشطة السارة",
      layouts: {
        blank: {
          type: "table",
          headers: ["النشاط", "درجة المتعة المتوقعة", "درجة المتعة الفعلية", "ملاحظات"],
          rows: tableRows(4, 6)
        },
        guided: {
          type: "table",
          headers: ["النشاط", "درجة المتعة المتوقعة", "درجة المتعة الفعلية", "ملاحظات"],
          rows: [["مشي قصير في الحديقة", "40%", "", ""], ["الجلوس مع صديق موثوق", "50%", "", ""]]
        },
        filled: {
          type: "table",
          headers: ["النشاط", "درجة المتعة المتوقعة", "درجة المتعة الفعلية", "ملاحظات"],
          rows: [["مشي قصير في الحديقة", "40%", "55%", "كان أصعب قبل الخروج ثم صار أخف"], ["الجلوس مع صديق موثوق", "50%", "60%", "المتعة لم تكن كبيرة لكن العزلة انخفضت"]]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/pleasant-activities-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/pleasant-activities-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/pleasant-activities-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/pleasant-activities-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/pleasant-activities-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/pleasant-activities-filled.xlsx"
      }
    },
    {
      slug: "positive-log",
      name: "السجلات الإيجابية",
      what: "سجل يجمع الأدلة والمعلومات التي تدعم المعتقد الجديد وتقاوم التحيز نحو السلبي فقط.",
      whenUsed: "تستخدم بعد تكوّن حد أدنى من الاقتناع بالمعتقد الجديد، حتى لا تبدو للمريض كلامًا غير قابل للتصديق.",
      whenNotFirst: "لا تكون البداية إذا لم يُفكك المعتقد القديم أو إذا لم يظهر بديل معقول بعد.",
      steps: ["حدد المعتقد الجديد.", "اجمع مواقف أو دلائل تدعمه.", "سجلها باستمرار دون انتقاء سلبي.", "راجعها دوريًا مع المعالج."],
      example: "المعتقد الجديد: أنا شخص كفء إلى حد معقول. الدليل: أنجزت مهمة، التزمت بموعد، طلب أحدهم مساعدتي لثقته بي.",
      commonMistakes: ["تسجيل عبارات مديح عامة من غير دليل.", "استخدام السجل قبل وجود بديل معقول.", "الاقتصار على جملة واحدة متكررة."],
      relatedWorksheet: "سجل المعلومات الإيجابية",
      layouts: {
        blank: {
          type: "table",
          headers: ["المعتقد الجديد", "الدليل أو الحدث", "ما الذي يقوله هذا الدليل؟"],
          rows: tableRows(3, 6)
        },
        guided: {
          type: "table",
          headers: ["المعتقد الجديد", "الدليل أو الحدث", "ما الذي يقوله هذا الدليل؟"],
          rows: [["أنا شخص كفء إلى حد معقول", "أنهيت مهمة دراسية كنت أؤجلها", "", ""], ["", "", ""]]
        },
        filled: {
          type: "table",
          headers: ["المعتقد الجديد", "الدليل أو الحدث", "ما الذي يقوله هذا الدليل؟"],
          rows: [["أنا شخص كفء إلى حد معقول", "أنهيت مهمة دراسية كنت أؤجلها", "أستطيع الإنجاز عندما أكسر المهمة إلى خطوات"], ["أنا شخص له قيمة", "صديقتي طلبت رأيي في قرار مهم", "وجود من يستشيرني دليل على أن لي قيمة في العلاقة"]]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/positive-log-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/positive-log-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/positive-log-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/positive-log-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/positive-log-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/positive-log-filled.xlsx"
      }
    },
    {
      slug: "assertiveness",
      name: "توكيد الذات والمهارات الاجتماعية",
      what: "مجموعة مهارات تحمي المريض من الذوبان في إرضاء الآخرين أو الاستجابة العدوانية أو التجنب الصامت.",
      whenUsed: "تستخدم عندما تكون العلاقات والمواقف الاجتماعية جزءًا من استمرار الضغط أو الشعور بالعجز والذنب.",
      whenNotFirst: "إذا كانت الحالة ما تزال في مرحلة انهيار شديد أو عزلة مطبقة، فقد نبدأ بما هو أبسط وأكثر أساسية.",
      steps: ["حدد الموقف الاجتماعي الضاغط.", "اختر المهارة المناسبة مثل قول لا أو التجاهل الانتقائي أو تطويق الغضب.", "درّبها بصورة قصيرة وواضحة.", "راجع أثرها بعد التطبيق."],
      example: "بدل تبرير الرفض طويلًا، يتدرب المريض على قول «لا» بهدوء وتكرارها عند الحاجة.",
      commonMistakes: ["تحويل توكيد الذات إلى عدوان.", "شرح الرفض أكثر من اللازم.", "تدريب المهارة من غير ربطها بموقف حقيقي."],
      relatedWorksheet: "ورقة تدريب توكيد الذات",
      layouts: {
        blank: {
          type: "form",
          fields: [
            { label: "الموقف الاجتماعي", value: "" },
            { label: "الفكرة المعيقة", value: "" },
            { label: "المهارة المختارة", value: "" },
            { label: "الجملة أو السلوك الذي سأجربه", value: "" },
            { label: "ما الذي حدث بعد التجربة؟", value: "" }
          ]
        },
        guided: {
          type: "form",
          fields: [
            { label: "الموقف الاجتماعي", value: "شخص يلح عليّ بطلب لا أريده" },
            { label: "الفكرة المعيقة", value: "إذا رفضت سيغضب ولن يحبني" },
            { label: "المهارة المختارة", value: "" },
            { label: "الجملة أو السلوك الذي سأجربه", value: "" },
            { label: "ما الذي حدث بعد التجربة؟", value: "" }
          ]
        },
        filled: {
          type: "form",
          fields: [
            { label: "الموقف الاجتماعي", value: "شخص يلح عليّ بطلب لا أريده" },
            { label: "الفكرة المعيقة", value: "إذا رفضت سيغضب ولن يحبني" },
            { label: "المهارة المختارة", value: "الأسطوانة المشروخة" },
            { label: "الجملة أو السلوك الذي سأجربه", value: "لا أستطيع هذا اليوم" },
            { label: "ما الذي حدث بعد التجربة؟", value: "كرر الطلب مرتين ثم توقف، وشعرت بذنب أقل مما توقعت" }
          ]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/assertiveness-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/assertiveness-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/assertiveness-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/assertiveness-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/assertiveness-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/assertiveness-filled.xlsx"
      }
    },
    {
      slug: "progress-tracker",
      name: "متابعة التقدم الأسبوعي",
      what: "ورقة مختصرة تربط شدة المزاج بالنشاط والواجبات والأفكار الرئيسية، حتى يرى المتدرب والمريض الحركة عبر الأسابيع.",
      whenUsed: "تستخدم على مدار العلاج لتثبيت التحسن أو كشف مواضع التعثر.",
      whenNotFirst: "لا تكون بديلًا عن التقييم أو الصياغة، بل أداة متابعة وربط.",
      steps: ["سجل المزاج العام.", "أدخل الأنشطة المنفذة.", "دوّن الواجب المنزلي.", "اكتب ملاحظة عن أهم فكرة أو تقدم.", "قارن بالأسبوع السابق."],
      example: "انخفضت شدة الحزن من 8/10 إلى 6/10 عندما عاد المشي والالتزام بموعد المذاكرة القصير.",
      commonMistakes: ["التركيز على الرقم وترك المعنى.", "إهمال ربط التحسن بما تم فعله.", "ملء الورقة في نهاية الشهر بدل كل أسبوع."],
      relatedWorksheet: "متابعة التقدم الأسبوعي",
      layouts: {
        blank: {
          type: "table",
          headers: ["الأسبوع", "شدة المزاج", "أهم نشاط منفذ", "الواجب", "ملاحظة تقدم/تعثر"],
          rows: tableRows(5, 6)
        },
        guided: {
          type: "table",
          headers: ["الأسبوع", "شدة المزاج", "أهم نشاط منفذ", "الواجب", "ملاحظة تقدم/تعثر"],
          rows: [["الأول", "8/10", "مشي يومين", "ملء سجل فكرة واحدة", "", ""], ["الثاني", "", "", "", ""]]
        },
        filled: {
          type: "table",
          headers: ["الأسبوع", "شدة المزاج", "أهم نشاط منفذ", "الواجب", "ملاحظة تقدم/تعثر"],
          rows: [["الأول", "8/10", "مشي يومين", "ملء سجل فكرة واحدة", "البداية كانت صعبة لكن الخروج خفف العزلة"], ["الثاني", "6/10", "مشي 4 أيام + ترتيب الدراسة", "استكمال سجل الأفكار", "ظهر تحسن جزئي مع بقاء أفكار عدم القيمة"]]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/progress-tracker-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/progress-tracker-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/progress-tracker-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/progress-tracker-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/progress-tracker-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/progress-tracker-filled.xlsx"
      }
    },
    {
      slug: "relapse-prevention",
      name: "علامات الإنذار المبكر ومنع الانتكاسة",
      what: "نموذج يساعد على رصد المؤشرات المبكرة لعودة الحلقة الاكتئابية وما الخطة المناسبة عند ظهورها.",
      whenUsed: "يستخدم في المراحل اللاحقة أو عند اقتراب نهاية المسار العلاجي.",
      whenNotFirst: "لا يسبق بناء الفهم والصياغة والتدخل الأساسي، بل يأتي بعد ظهور تقدم نسبي.",
      steps: ["حدد العلامات المبكرة الشخصية.", "اربط كل علامة باستجابة عملية.", "حدد أشخاص الدعم أو الخطوات الوقائية.", "راجع النموذج دوريًا."],
      example: "العلامة المبكرة: البقاء في السرير ساعات إضافية. الاستجابة: تفعيل جدول الصباح والاتصال بشخص داعم.",
      commonMistakes: ["كتابة علامات عامة جدًا.", "غياب خطة استجابة واضحة.", "حصر النموذج في التذكير من غير مراجعة دورية."],
      relatedWorksheet: "خطة منع الانتكاسة",
      layouts: {
        blank: {
          type: "table",
          headers: ["العلامة المبكرة", "ماذا تعني لي؟", "الاستجابة المقترحة", "من يمكنني إبلاغه؟"],
          rows: tableRows(4, 5)
        },
        guided: {
          type: "table",
          headers: ["العلامة المبكرة", "ماذا تعني لي؟", "الاستجابة المقترحة", "من يمكنني إبلاغه؟"],
          rows: [["التوقف عن الخروج من الغرفة", "قد تكون بداية عودة الانسحاب", "", ""], ["", "", "", ""]]
        },
        filled: {
          type: "table",
          headers: ["العلامة المبكرة", "ماذا تعني لي؟", "الاستجابة المقترحة", "من يمكنني إبلاغه؟"],
          rows: [["التوقف عن الخروج من الغرفة", "قد تكون بداية عودة الانسحاب", "إعادة جدول الصباح والخروج القصير في نفس اليوم", "أختي"], ["إلغاء المواعيد بلا سبب", "قد تعود أفكار اليأس", "مراجعة سجل الأفكار والاتصال بالمعالج أو الداعم", "صديقتي المقربة"]]
        }
      },
      downloads: {
        blankPdf: "/disorders/depression/worksheets/relapse-prevention-blank.pdf",
        blankXlsx: "/disorders/depression/worksheets/relapse-prevention-blank.xlsx",
        guidedPdf: "/disorders/depression/worksheets/relapse-prevention-guided.pdf",
        guidedXlsx: "/disorders/depression/worksheets/relapse-prevention-guided.xlsx",
        filledPdf: "/disorders/depression/worksheets/relapse-prevention-filled.pdf",
        filledXlsx: "/disorders/depression/worksheets/relapse-prevention-filled.xlsx"
      }
    }
  ],
  trainingIntro: [
    "هذا القسم هو معمل التدريب داخل الوحدة. المقصود ليس تكرار المعلومات، بل تحويلها إلى مهام ينجزها المتدرب خطوة بخطوة.",
    "بُنيت التدريبات هنا من المادة العلمية خصوصًا: الجداول، الأمثلة التطبيقية، الصياغة، وخطة الجلسات."
  ],
  trainingExercises: [
    {
      title: "تدريب الأعراض",
      goal: "أن يلتقط المتدرب الصورة الكاملة بدل الحفظ المعزول.",
      task: "اقرأ وصف الحالة التدريبية، ثم استخرج 6 أعراض على الأقل، ووزعها على المجموعات الأربع.",
      outputHint: "اكتب العرض ثم سبب وضعه في هذه المجموعة."
    },
    {
      title: "تدريب التمييز",
      goal: "أن يميز بين الفقد الطبيعي، والحزن العابر، والنمط الاكتئابي السريري.",
      task: "قارن بين حالتين قصيرتين: واحدة بعد فقد قريب، والثانية فيها فقدان متعة وتعطل وظيفي ممتد. اذكر أين تزداد المؤشرات السريرية ولماذا.",
      outputHint: "لا تستخدم الحكم النهائي فقط؛ اشرح منطقك."
    },
    {
      title: "تدريب الصياغة المعرفية",
      goal: "أن ينتقل من الأعراض إلى البنية.",
      task: "استخرج من الحالة التدريبية: خبرة مبكرة محتملة، معتقدًا جوهريًا، معتقدًا وسيطًا، وفكرتين تلقائيتين، وسلوكًا يحافظ على المشكلة.",
      outputHint: "عامل الصياغة كفرضية عمل مبنية على دلائل، لا كحقيقة نهائية."
    },
    {
      title: "تدريب اختيار الأداة",
      goal: "أن يربط بين المرحلة العلاجية والأداة المناسبة.",
      task: "اختر أداة واحدة كبداية، ثم أداة ثانية لاحقة، واشرح لماذا لم تبدأ بأداة أخرى.",
      outputHint: "اربط القرار بالطاقة، والدافعية، ووضوح الأفكار، ومرحلة العلاج."
    },
    {
      title: "تدريب تخطيط التدخل",
      goal: "أن يبني خطة أولية قصيرة منطقية.",
      task: "اكتب خطة تدخل أولية من 3 خطوات للحالة التدريبية، تتضمن: بداية العمل، أداة، وواجبًا منزليًا صغيرًا.",
      outputHint: "اجعل الخطة واقعية وتدريجية."
    }
  ],
  trainingCheck: {
    type: "multiple-choice",
    title: "قرار تطبيقي",
    prompt: "في حالة يغلب عليها الانسحاب وقلة الطاقة وصعوبة التركيز، ما الاختيار التدريبي الأنسب أولًا؟",
    options: [
      {
        label: "البدء بتحدي المعتقدات الجوهرية فورًا.",
        explanation: "هذا قد يكون متقدمًا على المرحلة الحالية.",
        correct: false
      },
      {
        label: "التركيز على أداة سلوكية مبكرة مثل جدولة الأنشطة أو الأنشطة السارة مع تثقيف نفسي واضح.",
        explanation: "هذا هو الربط المنهجي الذي تؤكد عليه المادة العلمية عندما تكون الدافعية والطاقة منخفضتين.",
        correct: true
      },
      {
        label: "تأجيل العمل تمامًا حتى يعود المزاج تلقائيًا.",
        explanation: "هذا لا يعبّر عن تدخل CBT منظم.",
        correct: false
      }
    ]
  },
  riskIntro: [
    "الخطر هنا ليس هامشًا إضافيًا في الوحدة، بل جزء من التربية السريرية الأساسية. الهدف ليس الإثارة، بل تعليم متى يصبح التقييم والانتباه أكثر جدية.",
    "الشرائح قدّمت تدرجًا واضحًا للخطر، والمادة العلمية أكدت أن الانتحار في الاكتئاب يؤخذ بجدية، وأن التصاعد يقرأ عبر المراحل لا عبر الفعل الأخير فقط."
  ],
  riskStages: [
    { title: "تمني الموت", text: "رغبة في انتهاء الحياة أو الراحة من الألم من غير انتقال كامل إلى خطة فعلية." },
    { title: "أفكار انتحارية", text: "ظهور فكرة صريحة بأن الموت قد يكون حلًا أو مخرجًا." },
    { title: "نوايا أو رغبة أقرب للتنفيذ", text: "اقتراب الفكرة من الدافع الشخصي أو التوجه نحو الفعل." },
    { title: "خطط انتحارية", text: "وجود تصور متى وكيف وأين يمكن أن يحدث الفعل." },
    { title: "استعدادات", text: "تجهيز وسيلة أو ترتيب ما يسبق التنفيذ." },
    { title: "محاولة تنفيذ", text: "انتقال من التحضير إلى الفعل، وهنا تتغير جدية الانتباه بصورة حاسمة." }
  ],
  riskCheck: {
    type: "ordering",
    title: "رتب التصاعد",
    prompt: "رتب مراحل الخطر الانتحاري كما تتعلمها في هذه الوحدة من الأقل إلى الأعلى.",
    correctOrder: ["تمني الموت", "أفكار انتحارية", "نوايا أو رغبة أقرب للتنفيذ", "خطط انتحارية", "استعدادات", "محاولة تنفيذ"],
    explanation: "الفكرة الأساسية أن الخطر لا يبدأ من المحاولة فقط؛ بل توجد مراحل تسبقها ويجب التقاطها تعليميًا وسريريًا."
  },
  caseStudy: {
    title: "حالة تدريبية ممتدة: سارة",
    opening:
      "سارة متدربة جامعية في منتصف العشرينات. خلال الأشهر الأخيرة بدأت تنسحب من صديقاتها، وتؤجل مهامها، وتصف نفسها بأنها «فاشلة ومليش لزمة». تأتي للمتدرب بعد تراجع واضح في الدراسة، واضطراب في النوم، وشعور متكرر بالذنب والتعطل.",
    stages: [
      {
        title: "الشكوى الأساسية",
        content: "تقول سارة: «أنا تعبت من نفسي. كنت أقدر أذاكر وأخرج وأرد على الناس. الآن حتى الرسائل أثقل منّي»."
      },
      {
        title: "التقاط الأعراض",
        content: "يستخرج المتدرب من وصفها فقدان المتعة، تعكر المزاج، ضعف التركيز، اضطراب النوم، الإرهاق، الانسحاب، والشعور بعدم القيمة."
      },
      {
        title: "التمييز",
        content: "لا يوجد فقد حديث يفسر الصورة وحده، كما أن الحالة ممتدة ومصحوبة بتدهور وظيفي واضح، لذلك لا نتعامل معها كضيق عابر فقط."
      },
      {
        title: "التفكير التشخيصي",
        content: "يفكر المتدرب في مؤشرات نوبة اكتئابية محتملة، ويراجع وجود الأعراض المحورية، المدة، وعدد الأعراض والتعطل الوظيفي."
      },
      {
        title: "الصياغة المعرفية السلوكية",
        content: "عبر المقابلة يظهر تاريخ من نقد شديد في الطفولة، ما يدعم معتقدًا مثل: «قيمتي مرتبطة بأن أكون مثالية». عند التعثر تظهر أفكار: «أنا فاشلة» و«لا أحد سيحترمني». فتنسحب، ويقل النشاط، وتزداد أفكارها السلبية."
      },
      {
        title: "اختيار الأداة",
        content: "بسبب انخفاض الطاقة والعزلة، تكون البداية الأنسب: تثقيف نفسي قصير + جدولة نشاط بسيطة + نشاط سار محدود، ثم لاحقًا سجل الأفكار والأسئلة السقراطية."
      },
      {
        title: "التدخل الأولي",
        content: "يضع المتدرب معها 3 أنشطة صغيرة للأسبوع، ويربط كل نشاط بمعنى واضح، ثم يراجع الفكرة السلبية الأكثر تكرارًا في موقف واحد فقط."
      }
    ],
    homework: "الواجب المقترح: ملء خانة واحدة من جدول الأنشطة + موقف واحد في سجل الأفكار التلقائية إذا استطاعت، مع الحفاظ على الواقعية وعدم إرهاقها بواجبات كثيرة.",
    progressReflection:
      "في المتابعة، لا يُقاس التقدم فقط بانخفاض الحزن، بل أيضًا بزيادة الحركة، والقدرة على التقاط الفكرة، وتحسن الالتزام، وتراجع الانسحاب."
  },
  quizIntro: [
    "الاختبار هنا يقيس الفهم التطبيقي، لا التذكر فقط.",
    "إذا أخفقت في سؤال، راجع القسم المرتبط به: الأعراض، التمييزات، الصياغة، أو الأدوات."
  ],
  quiz: [
    {
      prompt: "أي عرض من التالي يُعد من الأعراض المعرفية في الصورة الاكتئابية؟",
      options: [
        { label: "اضطراب النوم", correct: false, explanation: "هذا عرض جسماني." },
        { label: "الشعور بعدم القيمة", correct: true, explanation: "هذا من صميم البناء المعرفي للاكتئاب." },
        { label: "الانسحاب من الناس", correct: false, explanation: "هذا عرض سلوكي." }
      ]
    },
    {
      prompt: "ما الفكرة الأدق في الفرق بين الحزن والاكتئاب؟",
      options: [
        { label: "لا فرق بينهما، إنما اختلاف في الشدة فقط.", correct: false, explanation: "الفرق ليس عدديًا فقط، بل بنيوي ووظيفي أيضًا." },
        { label: "الحزن العادي قد يكون مفهومًا وسياقيًا، أما الاكتئاب فيتضمن نمطًا أوسع وتعطلًا أوضح.", correct: true, explanation: "هذا هو التمييز التعليمي المطلوب." },
        { label: "الاكتئاب لا يمكن أن يتضمن حزنًا أصلًا.", correct: false, explanation: "بل قد يتضمنه، لكنه لا يختزل فيه." }
      ]
    },
    {
      prompt: "في نموذج Beck، أي مجموعة تصف الثالوث المعرفي؟",
      options: [
        { label: "الذات، العالم، المستقبل", correct: true, explanation: "هذا هو الثالوث المعرفي كما ورد في المادة العلمية." },
        { label: "الأفكار، المشاعر، السلوك", correct: false, explanation: "هذا قريب من نموذج ABC وليس الثالوث المعرفي." },
        { label: "الطفولة، البيئة، العلاج", correct: false, explanation: "هذه ليست صياغة الثالوث." }
      ]
    },
    {
      prompt: "متى تكون البداية السلوكية أكثر منطقية من البداية المعرفية الخالصة؟",
      options: [
        { label: "عندما تكون الطاقة والدافعية والتركيز منخفضة بدرجة تعوق العمل المعرفي المباشر.", correct: true, explanation: "هذا من أهم رسائل المادة العلمية في ترتيب التدخل." },
        { label: "عندما يريد المعالج اختصار الوقت فقط.", correct: false, explanation: "القرار هنا سريري وتعليمي، لا عشوائي." },
        { label: "لا توجد حالة تستدعي بداية سلوكية.", correct: false, explanation: "هذا مخالف للمادة العلمية." }
      ]
    },
    {
      prompt: "إذا قال المريض: «أنا فاشل في كل شيء» فأي أداة قد تساعد على كسر الثنائية المطلقة هنا؟",
      options: [
        { label: "المتصل المعرفي", correct: true, explanation: "هذه الأداة صممت لهذا النوع من التفكير القطبي." },
        { label: "جدول الأنشطة السارة فقط", correct: false, explanation: "قد يفيد لاحقًا، لكنه ليس الأداة الأقرب لهذه الفكرة تحديدًا." },
        { label: "تجاهل الفكرة لأن محتواها انفعالي فقط", correct: false, explanation: "هذه فكرة معرفية تستحق فحصًا." }
      ]
    },
    {
      prompt: "ما الخطأ الشائع في استخدام الأسئلة السقراطية؟",
      options: [
        { label: "أن تتحول إلى استجواب سريع من غير إنصات أو بناء مشترك.", correct: true, explanation: "هذا يفسد وظيفة الأداة ويجعلها ضغطًا لا اكتشافًا." },
        { label: "أن تبدأ بفكرة محددة.", correct: false, explanation: "بل هذا شرط مفيد لاستخدامها." },
        { label: "أن تسأل عن الدليل المؤيد والمعارض.", correct: false, explanation: "هذا من قلب الأداة." }
      ]
    },
    {
      prompt: "أي ترتيب أقرب لمنطق الحالة التدريبية؟",
      options: [
        { label: "أعراض -> صياغة -> اختيار أداة -> واجب منزلي", correct: true, explanation: "هذا يعكس الربط المنهجي المطلوب داخل الوحدة." },
        { label: "أداة -> تشخيص -> أعراض -> صياغة", correct: false, explanation: "هذا يعكس فوضى في التسلسل." },
        { label: "واجب منزلي -> صياغة -> تشخيص", correct: false, explanation: "الواجب يأتي بعد وضوح المنطق لا قبله." }
      ]
    },
    {
      prompt: "لماذا يُعد قسم الخطر والانتباه السريري جزءًا أساسيًا من الوحدة؟",
      options: [
        { label: "لأنه معلومة إضافية اختيارية فقط.", correct: false, explanation: "ليس هامشًا إضافيًا، بل جزء من التربية السريرية." },
        { label: "لأن الاكتئاب قد يتصاعد إلى مراحل خطر تحتاج انتباهًا جادًا قبل الفعل الأخير.", correct: true, explanation: "هذه هي الرسالة الأساسية في هذا القسم." },
        { label: "لأنه يغني عن التقييم السريري لاحقًا.", correct: false, explanation: "هذا القسم تعليمي ولا يحل محل التقييم الكامل." }
      ]
    }
  ],
  references: [
    {
      id: "scientific-material",
      name: "المادة العلمية.pdf",
      fileType: "PDF",
      role: "المصدر العلمي والتطبيقي الأعمق في الوحدة.",
      reviewFocus: ["الشرح التشخيصي", "الثالوث المعرفي والمخططات", "الأدوات والجداول", "مراحل العلاج وخطة الجلسات"],
      viewHref: "/disorders/depression/references/scientific-material",
      downloadHref: "/disorders/depression/references/material-science.pdf"
    },
    {
      id: "slide-deck",
      name: "Final depression dr amr khater.pdf.pdf",
      fileType: "PDF",
      role: "المرجع التعليمي البصري وتسلسل العرض التدريبي.",
      reviewFocus: ["تقسيم الأعراض", "التدفق العام: أعراض ثم تشخيص ثم تكوين ثم علاج", "الأمثلة اللغوية البسيطة", "عرض الخطر بصورة تدريبية"],
      viewHref: "/disorders/depression/references/slide-deck",
      downloadHref: "/disorders/depression/references/depression-slide-deck.pdf"
    }
  ],
  recap: [
    "الاكتئاب اضطراب سريري أوسع من الحزن، وقراءته تحتاج منطقًا لا انطباعًا.",
    "الصورة الكاملة تضم أعراضًا وجدانية ومعرفية وجسمانية وسلوكية، ولا يكفي عرض واحد لتثبيت التشخيص.",
    "التمييز بين الفقد الطبيعي وبين النوبة الاكتئابية يحتاج حذرًا وسياقًا وتعطلًا وظيفيًا.",
    "يفهم CBT الاكتئاب عبر المعتقدات والمخططات والأفكار التلقائية والسلوكيات التي تحافظ على الحلقة.",
    "البداية العلاجية ليست معرفية دائمًا؛ أحيانًا تبدأ من التنشيط السلوكي واستعادة المدعمات.",
    "الأدوات لا تُستخدم لأنها معروفة فقط، بل لأنها مناسبة لمرحلة معينة ومشكلة محددة."
  ],
  nextFocus: "بعد إتقان هذه الوحدة، يكون الانتقال المنطقي إلى وحدة اضطراب أخرى مع الحفاظ على نفس الهيكل: المفهوم، الصورة السريرية، التكوين، التدخل، والأدوات.",
  sourceTrace: {
    concept: {
      slides: ["الافتتاح التعليمي المبسط: ما هو الاكتئاب؟", "الصياغة القريبة من خبرة المريض مثل فقدان طعم الحياة"],
      scientific: ["المقدمة العامة عن أهمية الاكتئاب وخطورته وسوء فهمه", "رفض عزوه إلى ضعف الشخصية أو الإيمان"],
      rewritten: ["إعادة بناء افتتاح تعليمي موجّه للمتدرب", "ترتيب المفاهيم قبل المصطلحات"],
      scaffold: ["جمل انتقالية قصيرة وتوضيح لغرض القسم"]
    },
    symptoms: {
      slides: ["تقسيم الأعراض إلى وجدانية/معرفية/جسمانية/سلوكية", "الأمثلة القريبة من لغة المريض"],
      scientific: ["التوسع في الأعراض الجسمانية والتشخيصية", "الإشارات الخاصة بالنوم والشهية والطاقة"],
      rewritten: ["صياغة أمثلة بشرية مختصرة", "توضيح الفرق بين العرض والصورة الكاملة"]
    },
    distinctions: {
      slides: ["الإشارات التعليمية العامة للحزن والاكتئاب"],
      scientific: ["الفروق بين grief و major depression", "الحذر من الإفراط في التشخيص"],
      rewritten: ["بطاقات مقارنة وحالات قصيرة"],
      scaffold: ["عبارات مساعدة مثل لا تتسرع"]
    },
    diagnosis: {
      slides: ["المنطق التعليمي العام للتشخيص"],
      scientific: ["المحكات الأساسية والمدة والتعطل الوظيفي والشدة"],
      rewritten: ["مسار تشخيصي مبسط للمتدرب"]
    },
    formation: {
      slides: ["رحلة الاضطراب وأبواب التكوين"],
      scientific: ["العوامل الوراثية/العصبية", "نموذج Beck والثالوث والمخططات والأخطاء المعرفية"],
      rewritten: ["تبسيط التدرج من لماذا يحدث إلى كيف يستمر"]
    },
    roadmap: {
      slides: ["التدفق العام: علاج معرفي وسلوكي", "تسلسل العرض"],
      scientific: ["مراحل العلاج والتركيز السلوكي المبكر ثم المعرفي ثم الأعمق"],
      rewritten: ["Roadmap تدريبي واضح يربط كل مرحلة بسببها"]
    },
    tools: {
      slides: ["عرض أسماء بعض الفنيات ومسارها"],
      scientific: ["الجداول، التجارب، المتصل، السجلات، جدولة الأنشطة، المهارات الاجتماعية"],
      rewritten: ["قالب ثابت لكل أداة", "أمثلة ونماذج مرتبطة بكل أداة"],
      scaffold: ["microcopy للتنزيل والعرض"]
    },
    training: {
      slides: ["أمثلة وتعليم بصري مبسط"],
      scientific: ["الصياغة التطبيقية، خطة الجلسات، الواجبات، الأمثلة الممتدة"],
      rewritten: ["معمل تدريب من 5 أنواع إلزامية"],
      scaffold: ["تعليمات قصيرة للمهمة المطلوبة"]
    },
    risk: {
      slides: ["تدرج الخطر الانتحاري", "عرض المراحل بصورة واضحة"],
      scientific: ["تأكيد جدية الخطر في الاكتئاب وخطورته"],
      rewritten: ["صياغة تعليمية غير مثيرة وغير سطحية"]
    },
    caseStudy: {
      slides: ["اللغة القريبة من عرض الحالة"],
      scientific: ["التصور المعرفي المثال وخطة الجلسات والواجبات"],
      rewritten: ["حالة تدريبية موحدة تستخدم كمصدر للأمثلة المعبأة"]
    },
    quiz: {
      slides: ["البنية التعليمية البسيطة"],
      scientific: ["المحتوى الذي يقاس: أعراض، تمييز، أدوات، صياغة"],
      rewritten: ["تحويل المحتوى إلى أسئلة تطبيقية"]
    },
    references: {
      slides: ["الملف نفسه كمرجع أصلي"],
      scientific: ["الملف نفسه كمرجع أصلي"],
      rewritten: ["وصف دور كل ملف وما الذي يراجع فيه المتدرب"]
    }
  }
};

const disorders = [depression];

export type DisorderListItem = Pick<Disorder, "slug" | "title" | "subtitle" | "tags" | "audience">;

const loadDisorders = cache(async (): Promise<Disorder[]> => disorders);

export async function listDisorders(): Promise<DisorderListItem[]> {
  const items = await loadDisorders();
  return items.map(({ slug, title, subtitle, tags, audience }) => ({ slug, title, subtitle, tags, audience }));
}

export async function getDisorderBySlug(slug: string): Promise<Disorder | null> {
  const items = await loadDisorders();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getDisorderSlugs(): Promise<string[]> {
  const items = await loadDisorders();
  return items.map((item) => item.slug);
}
