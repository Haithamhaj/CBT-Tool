import type { AppLanguage } from "./shared";

export type EmotionChild = {
  id: string;
  name: string;
  definition: string;
  appearsAs: string;
  differsFrom: string;
  example: string;
};

export type EmotionGroupDetail = {
  id: string;
  name: string;
  color: string;
  definition: string;
  appearsAs: string;
  differsFrom: string;
  children: EmotionChild[];
};

type EmotionWheelContent = {
  intro: string;
  prompt: string;
  centerLabel: string;
  coreLabel: string;
  preciseLabel: string;
  detailsTitle: string;
  fields: {
    definition: string;
    appearsAs: string;
    differsFrom: string;
    example: string;
  };
  groups: EmotionGroupDetail[];
};

const emotionWheelContent: Record<AppLanguage, EmotionWheelContent> = {
  en: {
    intro:
      "Use the wheel to move from a broad emotional label to a more precise one. Start with the inner ring, then click the outer ring for a more exact feeling word.",
    prompt: "Click a feeling on the wheel to see a short definition and how it usually shows up.",
    centerLabel: "Emotion",
    coreLabel: "Primary emotion",
    preciseLabel: "More precise feeling",
    detailsTitle: "Selected feeling",
    fields: {
      definition: "Definition",
      appearsAs: "How it often appears",
      differsFrom: "How it differs",
      example: "Short example"
    },
    groups: [
      {
        id: "sadness",
        name: "Sadness",
        color: "#5b86b4",
        definition: "A lowering emotion linked to loss, disappointment, or disconnection.",
        appearsAs: "Withdrawal, heaviness, crying, silence, or low energy.",
        differsFrom: "Sadness is more about loss or disappointment than threat.",
        children: [
          {
            id: "disappointed",
            name: "Disappointed",
            definition: "Feeling let down because reality did not match hope.",
            appearsAs: "The person expected something better and feels deflated.",
            differsFrom: "Less heavy than grief and less isolated than loneliness.",
            example: "I prepared well, but the meeting still went badly."
          },
          {
            id: "hurt",
            name: "Hurt",
            definition: "Emotional pain caused by rejection, criticism, or being let down.",
            appearsAs: "Sensitive reaction to a comment or action from someone important.",
            differsFrom: "More relational than hopelessness.",
            example: "What they said stayed with me all day."
          },
          {
            id: "lonely",
            name: "Lonely",
            definition: "Feeling emotionally alone or unsupported.",
            appearsAs: "The person feels unseen or disconnected from others.",
            differsFrom: "Less about loss itself and more about absence of connection.",
            example: "I was around people, but I still felt alone."
          },
          {
            id: "grief",
            name: "Grief",
            definition: "Deep sadness linked to loss and separation.",
            appearsAs: "Strong emotional pain, emptiness, and missing what is gone.",
            differsFrom: "Heavier and more loss-centered than disappointment.",
            example: "Since the relationship ended, everything feels empty."
          },
          {
            id: "hopeless",
            name: "Hopeless",
            definition: "Feeling that improvement or relief will not come.",
            appearsAs: "The future looks blocked and effort feels pointless.",
            differsFrom: "More future-focused and darker than ordinary sadness.",
            example: "Nothing I do will really change this."
          }
        ]
      },
      {
        id: "fear",
        name: "Fear / Anxiety",
        color: "#5a9f7d",
        definition: "An emotion linked to danger, uncertainty, or anticipated harm.",
        appearsAs: "Tension, avoidance, overthinking, scanning for threat, or panic.",
        differsFrom: "Fear is centered on threat and future risk rather than loss.",
        children: [
          {
            id: "worried",
            name: "Worried",
            definition: "Mentally preoccupied with what might go wrong.",
            appearsAs: "Repeated future-oriented thoughts and difficulty switching off.",
            differsFrom: "Less physically intense than panic.",
            example: "I keep thinking about what could go wrong tomorrow."
          },
          {
            id: "tense",
            name: "Tense",
            definition: "Feeling physically and mentally keyed up.",
            appearsAs: "Tight body, shallow breathing, readiness, or irritability.",
            differsFrom: "More bodily than insecure.",
            example: "My shoulders are tight and I cannot relax."
          },
          {
            id: "afraid",
            name: "Afraid",
            definition: "Feeling danger strongly enough to want protection or escape.",
            appearsAs: "Urgent urge to avoid, hide, or seek safety.",
            differsFrom: "More immediate than general worry.",
            example: "I did not want to speak because I felt afraid."
          },
          {
            id: "panicked",
            name: "Panicked",
            definition: "An intense fear state with high urgency and loss of control.",
            appearsAs: "Racing heart, strong alarm, and a need to get out quickly.",
            differsFrom: "Much more intense than ordinary fear.",
            example: "As soon as the door closed, I felt I had to leave."
          },
          {
            id: "insecure",
            name: "Insecure",
            definition: "Feeling uncertain about safety, acceptance, or ability.",
            appearsAs: "Self-doubt, hesitation, and needing reassurance.",
            differsFrom: "More self-doubt based than panic.",
            example: "I kept checking whether I sounded competent."
          }
        ]
      },
      {
        id: "anger",
        name: "Anger",
        color: "#d36a5c",
        definition: "An activation emotion linked to violation, blockage, or unfairness.",
        appearsAs: "Heat, sharp tone, blaming, arguing, or pushing back.",
        differsFrom: "Anger tends to move toward action rather than withdrawal.",
        children: [
          {
            id: "irritated",
            name: "Irritated",
            definition: "A lower-intensity anger reaction to annoyance or friction.",
            appearsAs: "Short temper, impatience, or low tolerance.",
            differsFrom: "Lighter than fury or resentment.",
            example: "Small interruptions started getting on my nerves."
          },
          {
            id: "resentful",
            name: "Resentful",
            definition: "Anger that stays because something feels unfair or unresolved.",
            appearsAs: "The person keeps replaying the wrong and feels stuck on it.",
            differsFrom: "Longer-lasting than irritation.",
            example: "I still feel bitter about how that was handled."
          },
          {
            id: "furious",
            name: "Furious",
            definition: "Very intense anger with a strong impulse to react.",
            appearsAs: "Explosive tone, heat, forceful behavior, or losing calm.",
            differsFrom: "More intense and overwhelming than irritation.",
            example: "I felt like I could not stay calm at all."
          },
          {
            id: "frustrated",
            name: "Frustrated",
            definition: "Anger linked to blockage, delay, or repeated difficulty.",
            appearsAs: "Irritation because something is not moving or working.",
            differsFrom: "More about obstacles than insult.",
            example: "No matter what I tried, the situation stayed stuck."
          },
          {
            id: "offended",
            name: "Offended",
            definition: "Anger linked to feeling insulted or disrespected.",
            appearsAs: "The person reacts strongly to tone, words, or social meaning.",
            differsFrom: "More about personal dignity than practical blockage.",
            example: "The way they said it felt disrespectful."
          }
        ]
      },
      {
        id: "shame",
        name: "Shame",
        color: "#8d6bb3",
        definition: "A painful self-focused emotion linked to feeling defective, exposed, or small.",
        appearsAs: "Hiding, shrinking, silence, avoiding eye contact, or self-attack.",
        differsFrom: "Shame is more about the self being bad than about a specific action being wrong.",
        children: [
          {
            id: "embarrassed",
            name: "Embarrassed",
            definition: "A social discomfort state linked to unwanted attention or awkwardness.",
            appearsAs: "Blushing, laughing it off, hiding, or wanting the moment to pass.",
            differsFrom: "Lighter than humiliation or feeling defective.",
            example: "I just wanted the moment to end and move on."
          },
          {
            id: "small",
            name: "Small",
            definition: "Feeling diminished or reduced in value.",
            appearsAs: "The person feels less important, less capable, or less worthy.",
            differsFrom: "Less exposed than humiliation, but still self-lowering.",
            example: "When they said that, I felt very small."
          },
          {
            id: "defective",
            name: "Defective",
            definition: "Feeling that something is fundamentally wrong with the self.",
            appearsAs: "The mind moves from one mistake to a global defect story.",
            differsFrom: "More identity-based than embarrassment.",
            example: "This proves there is something wrong with me."
          },
          {
            id: "exposed",
            name: "Exposed",
            definition: "Feeling seen in a way that feels unsafe or unwanted.",
            appearsAs: "Fear that others will notice weakness or flaw.",
            differsFrom: "More about being seen than being attacked.",
            example: "I felt everyone could see how uncomfortable I was."
          },
          {
            id: "humiliated",
            name: "Humiliated",
            definition: "An intense shame state linked to being lowered in front of others.",
            appearsAs: "A sharp social pain with urge to disappear or escape.",
            differsFrom: "Stronger and more public than embarrassment.",
            example: "It felt like I was reduced in front of everyone."
          }
        ]
      },
      {
        id: "guilt",
        name: "Guilt",
        color: "#c9933e",
        definition: "A moral self-evaluative emotion linked to feeling responsible for something wrong.",
        appearsAs: "Regret, self-criticism, apologizing, or urge to repair.",
        differsFrom: "Guilt is more about 'I did something wrong' than 'I am wrong.'",
        children: [
          {
            id: "regretful",
            name: "Regretful",
            definition: "Feeling sorry about a choice, action, or missed opportunity.",
            appearsAs: "Thinking about what should have been done differently.",
            differsFrom: "Less moral and less heavy than remorse.",
            example: "I wish I had handled that differently."
          },
          {
            id: "remorseful",
            name: "Remorseful",
            definition: "A deeper guilt response with stronger moral pain.",
            appearsAs: "Strong wish to repair, apologize, or undo harm.",
            differsFrom: "Heavier than ordinary regret.",
            example: "I feel genuinely bad about what I did."
          },
          {
            id: "self-blaming",
            name: "Self-blaming",
            definition: "Taking responsibility in a harsh or exaggerated way.",
            appearsAs: "The person explains everything through their own fault.",
            differsFrom: "More rigid and punitive than balanced regret.",
            example: "This entire problem is because of me."
          },
          {
            id: "sorry",
            name: "Sorry",
            definition: "Feeling that you hurt someone or fell short and want to make it right.",
            appearsAs: "Apology, repair, or softer self-reflection.",
            differsFrom: "Usually lighter and more relational than remorse.",
            example: "I feel sorry for how that affected them."
          }
        ]
      },
      {
        id: "joy",
        name: "Joy / Relief",
        color: "#d8b74f",
        definition: "A positive state linked to safety, satisfaction, hope, or release of strain.",
        appearsAs: "Warmth, calm, openness, and more behavioral flexibility.",
        differsFrom: "This is a resource state rather than a distress state.",
        children: [
          {
            id: "calm",
            name: "Calm",
            definition: "A settled state with lower internal alarm.",
            appearsAs: "Steadier breathing, clearer thinking, and less urgency.",
            differsFrom: "Less excited than joy and more regulated than relief.",
            example: "After naming the thought, I felt calmer."
          },
          {
            id: "safe",
            name: "Safe",
            definition: "Feeling protected enough that threat drops.",
            appearsAs: "The body settles and the person can engage more freely.",
            differsFrom: "More about protection than satisfaction.",
            example: "Once I knew what to expect, I felt safer."
          },
          {
            id: "satisfied",
            name: "Satisfied",
            definition: "Feeling content because something meaningful went well enough.",
            appearsAs: "Steady positive feeling rather than high excitement.",
            differsFrom: "Less future-oriented than hope.",
            example: "The session did not solve everything, but it felt useful."
          },
          {
            id: "hopeful",
            name: "Hopeful",
            definition: "Feeling that improvement is possible.",
            appearsAs: "The future seems more workable and effort feels worthwhile.",
            differsFrom: "More future-oriented than calm.",
            example: "I can see a next step that might actually help."
          },
          {
            id: "pleased",
            name: "Pleased",
            definition: "A lighter positive state of appreciation or quiet happiness.",
            appearsAs: "Soft positive mood and ease.",
            differsFrom: "Less deep than satisfaction and less intense than joy.",
            example: "I felt pleased that I handled the moment better."
          }
        ]
      }
    ]
  },
  ar: {
    intro:
      "استخدم العجلة للانتقال من اسم شعور عام إلى اسم أدق. ابدأ من الحلقة الداخلية ثم اضغط على الحلقة الخارجية إذا أردت كلمة انفعالية أكثر تحديدًا.",
    prompt: "اضغط على أي شعور في العجلة لتظهر لك دلالة مختصرة وكيف يظهر عادة.",
    centerLabel: "الشعور",
    coreLabel: "الشعور الأساسي",
    preciseLabel: "الشعور الأدق",
    detailsTitle: "تفاصيل الشعور المختار",
    fields: {
      definition: "التعريف",
      appearsAs: "كيف يظهر عادة",
      differsFrom: "كيف يختلف",
      example: "مثال قصير"
    },
    groups: [
      {
        id: "sadness",
        name: "حزن",
        color: "#5b86b4",
        definition: "شعور منخفض يرتبط بالفقد أو الخيبة أو الانفصال.",
        appearsAs: "انسحاب، ثقل، بكاء، صمت، أو قلة طاقة.",
        differsFrom: "الحزن يرتبط أكثر بالفقد أو الخيبة لا بالتهديد.",
        children: [
          {
            id: "disappointed",
            name: "خيبة",
            definition: "إحساس بالخذلان لأن الواقع لم يوافق التوقع.",
            appearsAs: "الشخص كان ينتظر شيئًا أفضل ثم شعر بالهبوط.",
            differsFrom: "أخف من الفقد وأقل عزلة من الوحدة.",
            example: "كنت متوقعًا أن الأمور ستسير أفضل من ذلك."
          },
          {
            id: "hurt",
            name: "ألم",
            definition: "وجع نفسي سببه رفض أو نقد أو خذلان.",
            appearsAs: "تأثر داخلي بكلام أو تصرف من شخص مهم.",
            differsFrom: "أكثر ارتباطًا بالعلاقة من اليأس.",
            example: "الكلام الذي قيل بقي يوجعني بقية اليوم."
          },
          {
            id: "lonely",
            name: "وحدة",
            definition: "إحساس بالعزلة أو غياب السند العاطفي.",
            appearsAs: "الشخص يشعر أنه غير مرئي أو غير متصل بالآخرين.",
            differsFrom: "تركّز على غياب الاتصال أكثر من الفقد نفسه.",
            example: "كنت بين الناس لكنني شعرت أنني وحدي."
          },
          {
            id: "grief",
            name: "فقد",
            definition: "حزن عميق مرتبط بخسارة أو انفصال.",
            appearsAs: "ألم قوي وفراغ واشتياق لما فُقد.",
            differsFrom: "أثقل وأكثر ارتباطًا بالخسارة من الخيبة.",
            example: "منذ انتهاء العلاقة وكل شيء يبدو فارغًا."
          },
          {
            id: "hopeless",
            name: "يأس",
            definition: "إحساس بأن التحسن أو الانفراج لن يأتي.",
            appearsAs: "المستقبل يبدو مغلقًا والجهد يبدو بلا فائدة.",
            differsFrom: "أكثر سوادًا وتركيزًا على المستقبل من الحزن العادي.",
            example: "لا أشعر أن أي شيء سيتغير فعلًا."
          }
        ]
      },
      {
        id: "fear",
        name: "قلق / خوف",
        color: "#5a9f7d",
        definition: "شعور يرتبط بالخطر أو عدم اليقين أو توقع الأذى.",
        appearsAs: "توتر، تجنب، تفكير زائد، ترقب للخطر، أو هلع.",
        differsFrom: "الخوف يتركز على التهديد والمستقبل أكثر من الفقد.",
        children: [
          {
            id: "worried",
            name: "قلق",
            definition: "انشغال ذهني بما قد يسوء.",
            appearsAs: "أفكار متكررة عن المستقبل وصعوبة في إيقافها.",
            differsFrom: "أقل شدة جسدية من الهلع.",
            example: "كنت أستمر في التفكير بما قد يحدث غدًا."
          },
          {
            id: "tense",
            name: "توتر",
            definition: "إحساس جسدي وذهني بالشد والاستنفار.",
            appearsAs: "شد عضلي، تنفس ضيق، استعداد زائد، أو سرعة انفعال.",
            differsFrom: "أكثر جسدية من عدم الأمان.",
            example: "كتفاي مشدودتان ولا أستطيع أن أرتاح."
          },
          {
            id: "afraid",
            name: "خوف",
            definition: "إحساس بالخطر يدفع إلى الحماية أو الهروب.",
            appearsAs: "رغبة عاجلة في التجنب أو الاختباء أو طلب الأمان.",
            differsFrom: "أكثر مباشرة من القلق العام.",
            example: "لم أرد أن أتكلم لأنني كنت خائفًا."
          },
          {
            id: "panicked",
            name: "هلع",
            definition: "حالة خوف شديدة مع إحساس بفقدان السيطرة.",
            appearsAs: "خفقان شديد وإنذار داخلي قوي وحاجة للخروج بسرعة.",
            differsFrom: "أعلى شدة بكثير من الخوف العادي.",
            example: "ما إن أُغلق الباب حتى شعرت أنني يجب أن أخرج."
          },
          {
            id: "insecure",
            name: "عدم أمان",
            definition: "إحساس بعدم الثبات أو الثقة في القبول أو القدرة.",
            appearsAs: "تردد، شك في النفس، وحاجة للتطمين.",
            differsFrom: "أقرب لضعف الثقة من الهلع.",
            example: "بقيت أراجع كلامي لأتأكد أنني أبدو كفؤًا."
          }
        ]
      },
      {
        id: "anger",
        name: "غضب",
        color: "#d36a5c",
        definition: "شعور تنشيطي يرتبط بانتهاك أو تعطيل أو ظلم.",
        appearsAs: "سخونة، حدة نبرة، لوم، جدال، أو دفع للمواجهة.",
        differsFrom: "الغضب يدفع للحركة والرد أكثر من الانسحاب.",
        children: [
          {
            id: "irritated",
            name: "انزعاج",
            definition: "غضب منخفض الشدة ناتج عن احتكاك أو إزعاج.",
            appearsAs: "ضيق سريع، قلة صبر، أو انخفاض في التحمل.",
            differsFrom: "أخف من الحنق أو الاستياء الطويل.",
            example: "المقاطعات الصغيرة بدأت تستفزني."
          },
          {
            id: "resentful",
            name: "استياء",
            definition: "غضب يبقى مستمرًا لأن الأمر يبدو غير عادل أو غير محسوم.",
            appearsAs: "إعادة استحضار الموقف مع شعور مرّ ومتكرر.",
            differsFrom: "أطول بقاءً من الانزعاج اللحظي.",
            example: "ما زلت أشعر بمرارة من طريقة حدوث الأمر."
          },
          {
            id: "furious",
            name: "حنق",
            definition: "غضب شديد مع اندفاع قوي للرد.",
            appearsAs: "حدة كبيرة، سخونة، أو فقدان واضح للهدوء.",
            differsFrom: "أعلى شدة بكثير من الانزعاج.",
            example: "شعرت أنني لا أستطيع أن أبقى هادئًا."
          },
          {
            id: "frustrated",
            name: "إحباط",
            definition: "غضب مرتبط بالعوائق والتعطيل وتكرار الفشل.",
            appearsAs: "ضيق لأن الأمور لا تتحرك أو لا تنجح.",
            differsFrom: "يرتبط بالعائق أكثر من الإهانة.",
            example: "مهما حاولت شعرت أن الوضع لا يتحرك."
          },
          {
            id: "offended",
            name: "إهانة",
            definition: "غضب مرتبط بالشعور بعدم الاحترام أو الانتقاص.",
            appearsAs: "حساسية قوية للنبرة أو للكلمات أو للمعنى الاجتماعي.",
            differsFrom: "يرتبط بالكرامة أكثر من تعطيل المهمة.",
            example: "طريقة الكلام نفسها شعرتني بالإهانة."
          }
        ]
      },
      {
        id: "shame",
        name: "خزي",
        color: "#8d6bb3",
        definition: "شعور مؤلم متمركز حول الذات، مرتبط بالانكشاف أو النقص أو العيب.",
        appearsAs: "اختباء، انكماش، صمت، تجنب النظر، أو هجوم على الذات.",
        differsFrom: "الخزي يتعلق بأن الذات نفسها سيئة، لا بأن فعلًا محددًا كان خطأ.",
        children: [
          {
            id: "embarrassed",
            name: "إحراج",
            definition: "ضيق اجتماعي بسبب انتباه غير مرغوب أو موقف مربك.",
            appearsAs: "احمرار، محاولة تجاوز الموقف، أو رغبة أن ينتهي بسرعة.",
            differsFrom: "أخف من المهانة أو الشعور بالعيب.",
            example: "كنت فقط أريد أن ينتهي الموقف بسرعة."
          },
          {
            id: "small",
            name: "صِغَر",
            definition: "إحساس بأن قيمتك تقل أو أنك أقل من اللازم.",
            appearsAs: "الشخص يشعر أنه أصغر أو أضعف أو أقل شأنًا.",
            differsFrom: "أقل انكشافًا من المهانة لكنه لا يزال يخفض الذات.",
            example: "عندما قال ذلك شعرت أنني صغير جدًا."
          },
          {
            id: "defective",
            name: "شعور بالعيب",
            definition: "إحساس بأن هناك شيئًا معيبًا في الذات نفسها.",
            appearsAs: "الانتقال من خطأ واحد إلى قصة كاملة عن العيب الشخصي.",
            differsFrom: "أكثر ارتباطًا بالهوية من الإحراج.",
            example: "هذا يثبت أن هناك شيئًا خاطئًا فيَّ."
          },
          {
            id: "exposed",
            name: "انكشاف",
            definition: "إحساس بأنك مرئي بطريقة غير آمنة أو غير مرغوبة.",
            appearsAs: "خوف أن يلاحظ الآخرون نقطة ضعف أو عيبًا.",
            differsFrom: "يركز على أن يُرى الشخص أكثر من أن يُهان.",
            example: "شعرت أن الجميع يستطيع أن يرى ارتباكي."
          },
          {
            id: "humiliated",
            name: "مهانة",
            definition: "خزي شديد مرتبط بأن تُخفض أمام الآخرين.",
            appearsAs: "ألم اجتماعي حاد مع رغبة في الاختفاء أو الهروب.",
            differsFrom: "أشد وأكثر علنية من الإحراج.",
            example: "شعرت أنني صُغّرت أمام الجميع."
          }
        ]
      },
      {
        id: "guilt",
        name: "ذنب",
        color: "#c9933e",
        definition: "شعور أخلاقي يتعلق بإحساسك أنك مسؤول عن شيء خاطئ.",
        appearsAs: "ندم، نقد للذات، اعتذار، أو رغبة في الإصلاح.",
        differsFrom: "الذنب أقرب إلى: أنا فعلت شيئًا خاطئًا، لا أنا شخص خاطئ.",
        children: [
          {
            id: "regretful",
            name: "ندم",
            definition: "إحساس بالأسف على قرار أو فعل أو فرصة ضائعة.",
            appearsAs: "تفكير فيما كان يجب أن يحدث بشكل مختلف.",
            differsFrom: "أخف وأقل أخلاقية من التأنيب العميق.",
            example: "أتمنى لو أنني تصرفت بطريقة مختلفة."
          },
          {
            id: "remorseful",
            name: "تأنيب",
            definition: "استجابة ذنب أعمق فيها ألم أخلاقي أوضح.",
            appearsAs: "رغبة قوية في الإصلاح أو الاعتذار أو التراجع.",
            differsFrom: "أثقل من الندم العادي.",
            example: "أشعر فعلًا بالسوء تجاه ما فعلته."
          },
          {
            id: "self-blaming",
            name: "لوم ذات",
            definition: "تحميل النفس المسؤولية بطريقة قاسية أو مبالغ فيها.",
            appearsAs: "تفسير كل شيء من خلال خطأ الذات وحدها.",
            differsFrom: "أكثر صرامة وعقابًا من الندم المتوازن.",
            example: "كل هذه المشكلة بسببي أنا."
          },
          {
            id: "sorry",
            name: "أسف",
            definition: "إحساس بأنك قصرت أو آذيت أحدًا وتريد التعديل.",
            appearsAs: "اعتذار أو محاولة إصلاح أو مراجعة هادئة للنفس.",
            differsFrom: "أخف وأكثر ارتباطًا بالعلاقة من التأنيب العميق.",
            example: "أشعر بالأسف على أثر ذلك عليهم."
          }
        ]
      },
      {
        id: "joy",
        name: "فرح / ارتياح",
        color: "#d8b74f",
        definition: "حالة إيجابية ترتبط بالأمان أو الرضا أو الأمل أو زوال الضغط.",
        appearsAs: "دفء، هدوء، انفتاح، ومرونة أكبر في التصرف.",
        differsFrom: "هي حالة مورد نفسي وليست حالة ضيق.",
        children: [
          {
            id: "calm",
            name: "هدوء",
            definition: "حالة مستقرة يقل فيها الإنذار الداخلي.",
            appearsAs: "تنفس أهدأ، تفكير أوضح، وإلحاح أقل.",
            differsFrom: "أقل حماسة من الفرح وأكثر تنظيمًا من مجرد ارتياح لحظي.",
            example: "بعد أن سميت الفكرة شعرت بهدوء أكبر."
          },
          {
            id: "safe",
            name: "أمان",
            definition: "إحساس بأن الخطر انخفض وأنك محمي بما يكفي.",
            appearsAs: "استرخاء أكبر وقدرة على التفاعل بحرية.",
            differsFrom: "يرتبط بالحماية أكثر من الرضا.",
            example: "عندما عرفت ما المتوقع شعرت بأمان أكثر."
          },
          {
            id: "satisfied",
            name: "رضا",
            definition: "إحساس بالقبول لأن شيئًا مهمًا سار بشكل جيد بما يكفي.",
            appearsAs: "شعور إيجابي ثابت لا يعتمد على حماس مرتفع.",
            differsFrom: "أقل توجهًا للمستقبل من الأمل.",
            example: "لم تُحل كل الأمور، لكن الجلسة كانت مفيدة."
          },
          {
            id: "hopeful",
            name: "أمل",
            definition: "إحساس بأن التحسن ممكن وأن هناك اتجاهًا قابلًا للعمل.",
            appearsAs: "المستقبل يبدو أكثر قابلية للحركة والجهد يبدو مستحقًا.",
            differsFrom: "أكثر توجهًا للمستقبل من الهدوء.",
            example: "أشعر أن هناك خطوة تالية قد تساعد فعلاً."
          },
          {
            id: "pleased",
            name: "سرور",
            definition: "حالة إيجابية خفيفة من الارتياح أو السعادة الهادئة.",
            appearsAs: "مزاج إيجابي بسيط وشعور بالسلاسة.",
            differsFrom: "أخف من الرضا وأقل عمقًا من الأمان.",
            example: "شعرت بسرور لأنني تعاملت مع الموقف بشكل أفضل."
          }
        ]
      }
    ]
  }
};

export function getReferenceHubEmotionWheel(language: AppLanguage) {
  return emotionWheelContent[language];
}
