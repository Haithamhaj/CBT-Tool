import type { AppLanguage } from "./shared";

type SimpleItem = {
  title: string;
  text: string;
};

type SessionMapItem = {
  session: string;
  purpose: string;
  tools: string[];
  homework: string;
  output: string;
};

type ToolItem = {
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
};

type ThinkingLevel = {
  name: string;
  definition: string;
  difference: string;
  example: string;
};

type Distortion = {
  name: string;
  definition: string;
  example: string;
  appearsAs: string;
  differsFrom: string;
};

type EmotionGroup = {
  core: string;
  children: string[];
};

type Worksheet = {
  name: string;
  use: string;
  includes: string[];
  workedExample: {
    title: string;
    caseContext: string;
    whyThisShape: string;
    copyTip: string;
  };
  preview: {
    type: "table" | "form";
    headers?: string[];
    rows?: string[][];
    fields?: Array<{
      label: string;
      value: string;
    }>;
  };
};

type GlossaryItem = {
  term: string;
  meaning: string;
};

type AdvancedBlock = {
  title: string;
  intro: string;
  bullets: string[];
};

type HubContent = {
  heroNote: string;
  overview: {
    title: string;
    intro: string;
    bullets: string[];
  };
  principles: {
    title: string;
    items: SimpleItem[];
  };
  sessionStructure: {
    title: string;
    items: string[];
  };
  fiveSessionMap: {
    title: string;
    intro: string;
    items: SessionMapItem[];
  };
  tools: {
    title: string;
    intro: string;
    items: ToolItem[];
  };
  cognitiveStructure: {
    title: string;
    intro: string;
    levels: Array<{
      name: string;
      description: string;
      example: string;
    }>;
  };
  thinkingLevels: {
    title: string;
    items: ThinkingLevel[];
  };
  distortions: {
    title: string;
    intro: string;
    items: Distortion[];
  };
  emotions: {
    title: string;
    intro: string;
    groups: EmotionGroup[];
  };
  worksheets: {
    title: string;
    items: Worksheet[];
  };
  goals: {
    title: string;
    items: SimpleItem[];
  };
  glossary: {
    title: string;
    items: GlossaryItem[];
  };
  advanced: {
    title: string;
    intro: string;
    blocks: AdvancedBlock[];
  };
};

const content: Record<AppLanguage, HubContent> = {
  en: {
    heroNote:
      "Built from the trainer material by Dr. Amr Khater. Use this page when you need the big picture, a quick reminder, or a simple explanation before continuing practice.",
    overview: {
      title: "What is CBT?",
      intro:
        "CBT is a structured, practical therapy model that links thoughts, emotions, behavior, and the meaning a person gives to events. In the trainer material, CBT is presented as evidence-based, collaborative, goal-directed, and educational.",
      bullets: [
        "In this product, CBT is practiced as a training flow rather than free-form therapy.",
        "You are expected to define a goal, choose a fitting tool, write structured responses, and revise based on review.",
        "The point is not to sound academic. The point is to think clearly, stay structured, and link each step to the case."
      ]
    },
    principles: {
      title: "Core CBT Principles",
      items: [
        { title: "Continuous assessment", text: "The case is assessed session by session. CBT keeps updating understanding instead of waiting until the end." },
        { title: "Collaboration", text: "The work is done with the client, not imposed on the client. Goals, agenda, and homework are discussed together." },
        { title: "Clear goals", text: "Each session needs a specific target in simple behavioral language." },
        { title: "Focus on the present", text: "CBT starts from current problems. The past is used when it helps explain what is still active now." },
        { title: "Educational style", text: "The client is taught how to understand and respond differently, so they gradually become their own helper." },
        { title: "Structured sessions", text: "Sessions follow a repeatable format: check-in, agenda, review, main work, summary, homework." },
        { title: "Time-bounded work", text: "The model is focused and usually planned over a defined course rather than open-ended work." },
        { title: "Multiple tools", text: "CBT uses different techniques depending on the problem, the formulation, and the treatment goal." }
      ]
    },
    sessionStructure: {
      title: "Fixed CBT Session Structure",
      items: [
        "Mood or status check",
        "Agree the agenda",
        "Review previous homework",
        "Do the main session work",
        "Summarize what was learned",
        "Set one new homework task"
      ]
    },
    fiveSessionMap: {
      title: "5-Session Exploration Map",
      intro:
        "The trainer material lays out an early five-session formulation path. Use it as a reference for what each early session is trying to produce.",
      items: [
        {
          session: "Session 1",
          purpose: "Know the client, clarify the present complaint, and explain the CBT method.",
          tools: ["Psychoeducation", "Observation table"],
          homework: "Start the observation table after relevant situations.",
          output: "Clear current complaint, early timeline, and first monitoring task."
        },
        {
          session: "Session 2",
          purpose: "Review homework, identify triggering factors, and deepen the picture of thoughts and feelings.",
          tools: ["Observation table review", "Trigger exploration"],
          homework: "Continue monitoring with better detail.",
          output: "Better map of triggers, repeated reactions, and emotional patterns."
        },
        {
          session: "Session 3",
          purpose: "Teach cognitive distortions and help the client start labeling them in their own records.",
          tools: ["Cognitive distortions list", "Observation table with thinking-error column"],
          homework: "Complete the table and mark likely distortions.",
          output: "Named thinking errors tied to real examples."
        },
        {
          session: "Session 4",
          purpose: "Work from automatic thoughts toward deeper beliefs and motivation for change.",
          tools: ["Downward arrow", "Belief exploration"],
          homework: "Reflect on what the problem costs and what change would protect.",
          output: "Early intermediate/core belief hypotheses."
        },
        {
          session: "Session 5",
          purpose: "Collect repeated patterns and agree a treatment direction with the client.",
          tools: ["Pattern summary", "Treatment plan"],
          homework: "Begin the first targeted treatment task.",
          output: "Working formulation, priority problems, and treatment start point."
        }
      ]
    },
    tools: {
      title: "CBT Tools Library",
      intro: "These tools come directly from the trainer material’s practical workflow and techniques list.",
      items: [
        {
          name: "Observation or thought monitoring table",
          what: "A simple record of situation, emotion, thought, and behavior.",
          when: "Use it early when the client needs to notice patterns instead of speaking vaguely.",
          why: "It gives raw material for formulation and helps organize the self.",
          example: "Situation: manager asks for update. Thought: I will sound stupid. Emotion: anxiety. Behavior: speak briefly and avoid eye contact.",
          mistake: "Writing general life stories instead of one specific situation."
          ,
          miniCase: {
            title: "Mini-case",
            situation: "The client says they always feel bad at work but cannot describe one moment clearly.",
            whyThisTool: "Monitoring is the right first tool because the material is still vague and needs one observable situation.",
            expectedOutput: "One concrete row showing situation, thought, emotion, and behavior."
          }
        },
        {
          name: "Thought record",
          what: "A structured worksheet for examining a difficult situation, the automatic thought, the emotion, and a more balanced response.",
          when: "Use it when one thought clearly drives distress or avoidance.",
          why: "It slows the thought down and makes it testable.",
          example: "Thought: If I hesitate, everyone will think I am incompetent.",
          mistake: "Jumping straight to a positive thought without identifying the original thought clearly.",
          miniCase: {
            title: "Mini-case",
            situation: "The client keeps saying: 'If I speak in the meeting, I will embarrass myself.'",
            whyThisTool: "A thought record fits because one automatic thought is clearly driving anxiety and avoidance.",
            expectedOutput: "A filled sheet showing the original thought, the evidence, and a more balanced response."
          }
        },
        {
          name: "Cognitive distortions list",
          what: "A reference list of common thinking errors.",
          when: "Use it after the client has enough examples from monitoring.",
          why: "It helps the client recognize that their interpretation style may be biased.",
          example: "All-or-nothing thinking: If I do not do this perfectly, it is a total failure.",
          mistake: "Memorizing labels without linking them to real thoughts.",
          miniCase: {
            title: "Mini-case",
            situation: "The client says: 'I made one mistake, so the whole presentation was a disaster.'",
            whyThisTool: "The distortions list helps the trainee name the error pattern instead of arguing vaguely.",
            expectedOutput: "The thought linked to a named distortion such as all-or-nothing thinking or catastrophizing."
          }
        },
        {
          name: "Downward arrow",
          what: "A questioning method that asks what a thought means until a deeper belief appears.",
          when: "Use it when an automatic thought seems to come from a stronger rule or core belief.",
          why: "It helps reveal the meaning underneath the surface thought.",
          example: "If I fail this task, what does that mean? It means I am not capable.",
          mistake: "Using it too early before there is enough concrete material.",
          miniCase: {
            title: "Mini-case",
            situation: "The client repeatedly says: 'If they notice my mistake, everything changes.'",
            whyThisTool: "Downward arrow helps uncover the deeper meaning and rule underneath the surface thought.",
            expectedOutput: "A deeper statement such as: 'If I am not perfect, I am weak.'"
          }
        },
        {
          name: "Cognitive formulation",
          what: "A working map linking current problem, triggers, thoughts, emotions, behavior, and beliefs.",
          when: "Use it after enough repeated patterns are visible.",
          why: "It turns many details into one understandable pattern.",
          example: "Perceived criticism triggers shame, withdrawal, and the belief: I am defective.",
          mistake: "Writing impressive theory without grounding it in case evidence.",
          miniCase: {
            title: "Mini-case",
            situation: "Several monitored situations show the same pattern: criticism leads to shame, silence, and self-attack.",
            whyThisTool: "Formulation is now appropriate because repeated links are visible across multiple examples.",
            expectedOutput: "A case map that connects triggers, thoughts, emotions, behavior, and belief hypotheses."
          }
        },
        {
          name: "Treatment plan",
          what: "A practical plan that chooses what to work on first and why.",
          when: "Use it after the main problems and pattern are clear.",
          why: "It turns formulation into an action sequence.",
          example: "Start with monitoring and restructuring the main thought before moving to deeper belief work.",
          mistake: "Listing many goals with no order or link to the formulation.",
          miniCase: {
            title: "Mini-case",
            situation: "The case pattern is clear, but the trainee does not know what to target first.",
            whyThisTool: "A treatment plan helps convert formulation into priorities and a realistic order of work.",
            expectedOutput: "A first target, a short-term goal, and the first tools to start with."
          }
        },
        {
          name: "Psychoeducation",
          what: "Explaining the CBT model and the client’s problem in understandable language.",
          when: "Use it early and whenever clarity drops.",
          why: "It increases cooperation, motivation, and awareness.",
          example: "We are looking at how thoughts, feelings, and behavior interact in this problem.",
          mistake: "Giving a lecture that is not connected to the client’s actual case.",
          miniCase: {
            title: "Mini-case",
            situation: "The client does not yet understand why monitoring or homework matters.",
            whyThisTool: "Psychoeducation helps build shared understanding before deeper work begins.",
            expectedOutput: "A simple explanation of the CBT model linked directly to the client’s problem."
          }
        },
        {
          name: "Evidence review",
          what: "Checking what evidence supports a thought and what evidence does not.",
          when: "Use it when the thought is strong but may be distorted or overconfident.",
          why: "It helps the client move from certainty to testing.",
          example: "What evidence shows you will definitely fail the interview? What evidence points the other way?",
          mistake: "Arguing with the client instead of examining the evidence together.",
          miniCase: {
            title: "Mini-case",
            situation: "The client is certain that one awkward moment means total failure.",
            whyThisTool: "Evidence review is helpful when certainty is high but the thought may be distorted.",
            expectedOutput: "A side-by-side check of evidence for and against the thought."
          }
        },
        {
          name: "Socratic questioning",
          what: "Guided questions that help the client discover a more accurate view.",
          when: "Use it during cognitive work instead of giving direct advice.",
          why: "Discovery is stronger than instruction.",
          example: "If your friend made the same mistake, would you call them useless?",
          mistake: "Turning it into a leading quiz where the therapist already forces the answer.",
          miniCase: {
            title: "Mini-case",
            situation: "The trainee wants to challenge the thought but keeps giving direct corrective advice.",
            whyThisTool: "Socratic questioning helps the client arrive at a clearer view through guided discovery.",
            expectedOutput: "A short sequence of questions that softens certainty and opens alternatives."
          }
        },
        {
          name: "Behavioral experiment",
          what: "A planned test of a belief in real life.",
          when: "Use it when a prediction needs behavioral evidence.",
          why: "It moves the work from theory to lived testing.",
          example: "Share one draft earlier than usual and observe what feedback actually happens.",
          mistake: "Setting a large risky task instead of one clear test.",
          miniCase: {
            title: "Mini-case",
            situation: "The client predicts that speaking once in the meeting will lead to harsh rejection.",
            whyThisTool: "A behavioral experiment is useful when the belief needs real-world testing, not only discussion.",
            expectedOutput: "One defined prediction, one test, and one observed outcome."
          }
        },
        {
          name: "Homework",
          what: "The between-session task that carries the session forward.",
          when: "Use it at the end of every workable session.",
          why: "CBT improves through practice between sessions, not session insight alone.",
          example: "Complete one monitoring record after the next difficult conversation.",
          mistake: "Assigning homework that is broad, unrealistic, or unrelated to the session.",
          miniCase: {
            title: "Mini-case",
            situation: "The trainee understands the session but has not translated it into one concrete between-session task.",
            whyThisTool: "Homework keeps the session moving into real practice outside the room.",
            expectedOutput: "One specific task, one timing cue, and one thing to bring back for review."
          }
        }
      ]
    },
    cognitiveStructure: {
      title: "Cognitive Structure",
      intro:
        "Use this as the simple map of how deeper meaning is layered. In practice, CBT often moves from the fast thought on the surface toward the deeper rule and then the deeper core belief.",
      levels: [
        {
          name: "Automatic thought",
          description: "The quick thought that appears first in the moment.",
          example: "If I hesitate, they will think I am weak."
        },
        {
          name: "Intermediate belief",
          description: "The rule or assumption underneath the thought.",
          example: "If I do not perform strongly, people will not respect me."
        },
        {
          name: "Core belief",
          description: "The deepest broad belief about the self or worth.",
          example: "I am not good enough."
        }
      ]
    },
    thinkingLevels: {
      title: "Levels of Thinking",
      items: [
        {
          name: "Automatic thoughts",
          definition: "Fast thoughts that appear in response to a situation.",
          difference: "They sit on the surface and change from moment to moment.",
          example: "If I hesitate, they will think I am incompetent."
        },
        {
          name: "Intermediate beliefs",
          definition: "Rules, assumptions, and attitudes that shape how a person interprets events.",
          difference: "They are deeper than one thought but not as global as a core belief.",
          example: "If I do not perform strongly, I should not speak at all."
        },
        {
          name: "Core beliefs",
          definition: "Deep broad beliefs about the self, other people, or the world.",
          difference: "They are the deepest level and often feel like unquestioned truth.",
          example: "I am not capable."
        }
      ]
    },
    distortions: {
      title: "Cognitive Distortions Reference",
      intro: "These are practical thinking errors highlighted in the trainer material. Use them to name patterns, not to collect labels for their own sake.",
      items: [
        { name: "Filtering", definition: "Zooming in on one negative detail and ignoring the rest.", example: "One critical comment means the whole day was a disaster.", appearsAs: "The person keeps replaying one bad detail and loses the full picture.", differsFrom: "Different from catastrophizing because the mind is narrowing the frame, not only predicting disaster." },
        { name: "All-or-nothing thinking", definition: "Seeing things as total success or total failure with no middle.", example: "If I do not do it perfectly, I failed.", appearsAs: "Rigid black-and-white self-judgment.", differsFrom: "Different from labeling because it judges the outcome as absolute before turning it into identity." },
        { name: "Overgeneralization", definition: "Taking one event and turning it into a rule for everything.", example: "I was rejected once, so people always reject me.", appearsAs: "Words like always, never, everyone, no one.", differsFrom: "Different from all-or-nothing thinking because it spreads one event across time and situations." },
        { name: "Jumping to conclusions", definition: "Reaching a negative conclusion without enough evidence.", example: "She looked away, so she must dislike me.", appearsAs: "Mind reading or fortune telling.", differsFrom: "Different from personalization because the problem is missing evidence, not only taking too much responsibility." },
        { name: "Magnification and minimization", definition: "Making a problem too large or shrinking strengths and successes.", example: "This mistake proves I am terrible, and my success does not count.", appearsAs: "Threat is inflated while strengths are dismissed.", differsFrom: "Different from catastrophizing because it may enlarge current error or minimize strengths without predicting total ruin." },
        { name: "Catastrophizing", definition: "Treating the worst outcome as if it is the most likely one.", example: "If I panic on the bus, my life will fall apart.", appearsAs: "The mind moves quickly to disaster.", differsFrom: "Different from magnification because it specifically jumps to the worst possible future result." },
        { name: "Personalization", definition: "Taking too much responsibility for events or other people’s reactions.", example: "The team is tense, so it must be because of me.", appearsAs: "The person becomes the center cause of events.", differsFrom: "Different from blaming because personalization centers the self as cause, even when evidence is weak." },
        { name: "Emotional reasoning", definition: "Treating a feeling as proof that something is true.", example: "I feel useless, so I must be useless.", appearsAs: "Feeling becomes evidence.", differsFrom: "Different from labeling because the route to judgment is the emotion itself." },
        { name: "Should statements", definition: "Using rigid rules about what must always happen.", example: "I should never make mistakes.", appearsAs: "Strong guilt, anger, or disappointment when life does not match the rule.", differsFrom: "Different from fairness fallacy because it is about rigid inner rules, not only fairness expectations." },
        { name: "Labeling", definition: "Turning one behavior or failure into a global identity.", example: "I made a mistake, so I am a failure.", appearsAs: "One event becomes a whole identity.", differsFrom: "Different from all-or-nothing thinking because the conclusion becomes identity, not only outcome quality." },
        { name: "Blaming", definition: "Placing all responsibility on self or others instead of looking at the full situation.", example: "My manager made me feel this way, so it is entirely their fault.", appearsAs: "No balanced ownership.", differsFrom: "Different from personalization because blaming can target self or others in a one-sided way." },
        { name: "Fairness fallacy", definition: "Assuming life should work by your idea of fairness.", example: "If I worked hard, this should not happen.", appearsAs: "Resentment because reality did not match an internal fairness rule.", differsFrom: "Different from should statements because the focus is fairness and deservedness." },
        { name: "Control fallacy", definition: "Thinking either that you control everything or that you control nothing.", example: "If they are upset, it must be because I failed them completely.", appearsAs: "Inflated responsibility or total helplessness.", differsFrom: "Different from personalization because it centers control itself, not only blame." },
        { name: "Always being right", definition: "Treating being right as more important than understanding reality or preserving connection.", example: "I must prove my view is correct no matter how the conversation goes.", appearsAs: "Argument wins over reflection.", differsFrom: "Different from should statements because the focus is proving correctness, not only rigid rules." },
        { name: "Change fallacy", definition: "Believing other people must change so that you can feel or function better.", example: "If they behave differently, then I will finally be okay.", appearsAs: "Relief is made dependent on others changing first.", differsFrom: "Different from blaming because the focus is demanding change as the condition for relief." },
        { name: "Reward fallacy", definition: "Expecting sacrifice and self-denial to be automatically repaid later just because they were endured.", example: "After everything I tolerated, life should reward me now.", appearsAs: "Hidden contract with reality that leads to disappointment.", differsFrom: "Different from fairness fallacy because it centers expected payoff for sacrifice." }
      ]
    },
    emotions: {
      title: "Emotion Wheel Reference",
      intro: "Use this section when the client says 'I felt bad' or 'I was upset.' The goal is to identify the emotion more precisely.",
      groups: [
        { core: "Sadness", children: ["disappointed", "hurt", "lonely", "grief", "hopeless"] },
        { core: "Anxiety / fear", children: ["worried", "tense", "afraid", "panicked", "insecure"] },
        { core: "Anger", children: ["irritated", "resentful", "furious", "frustrated", "offended"] },
        { core: "Shame", children: ["embarrassed", "small", "defective", "exposed", "humiliated"] },
        { core: "Guilt", children: ["regretful", "remorseful", "self-blaming", "sorry"] },
        { core: "Joy / relief", children: ["calm", "safe", "satisfied", "hopeful", "pleased"] }
      ]
    },
    worksheets: {
      title: "Worksheets and Templates",
      items: [
        {
          name: "Observation table",
          use: "To capture situation, emotions, dominant thoughts, behavior, and later thinking errors.",
          includes: ["situation", "emotion", "emotion intensity", "dominant thought", "behavior"],
          workedExample: {
            title: "Worked example",
            caseContext: "The trainee is tracking meeting anxiety after being asked for an update in front of the team.",
            whyThisShape: "This structure forces one specific moment instead of a vague summary of the whole week.",
            copyTip: "Use the same columns and fill only one real situation per row."
          },
          preview: {
            type: "table",
            headers: ["Situation", "Emotion", "Intensity", "Thought", "Behavior"],
            rows: [["Team update", "Anxiety", "80/100", "I will sound incompetent", "Spoke briefly"]]
          }
        },
        {
          name: "Observation table with thinking errors",
          use: "To continue monitoring while explicitly naming the likely thinking error in each situation.",
          includes: ["situation", "emotion", "emotion intensity", "dominant thought", "thinking error", "behavior"],
          workedExample: {
            title: "Worked example",
            caseContext: "The trainee already has a few monitoring examples and is now learning to identify distortions inside the thought.",
            whyThisShape: "This version helps move from simple description toward cognitive pattern recognition.",
            copyTip: "Do not fill the thinking-error column until the thought itself is written clearly."
          },
          preview: {
            type: "table",
            headers: ["Situation", "Emotion", "Intensity", "Thought", "Thinking error", "Behavior"],
            rows: [["Team update", "Anxiety", "80/100", "If I pause, they will think I am weak", "Jumping to conclusions", "Avoid speaking at length"]]
          }
        },
        {
          name: "Downward arrow worksheet",
          use: "To move from one automatic thought to the belief underneath it.",
          includes: ["selected thought", "what would that mean?", "what is the worst part?", "what does that say about me?"],
          workedExample: {
            title: "Worked example",
            caseContext: "The trainee starts from the thought: If I hesitate, they will judge me.",
            whyThisShape: "Each question pushes the meaning one step deeper until the underlying rule becomes visible.",
            copyTip: "Keep one automatic thought at the top and let each next line answer the line before it."
          },
          preview: {
            type: "form",
            fields: [
              { label: "Selected thought", value: "If I hesitate, they will judge me." },
              { label: "What would that mean?", value: "It would mean I am weak." },
              { label: "What is the worst part?", value: "They would lose respect." },
              { label: "What does that say about me?", value: "I am not good enough." }
            ]
          }
        },
        {
          name: "Formulation sheet",
          use: "To organize current problems, triggers, beliefs, and repeated patterns into one case map.",
          includes: ["current problem", "triggers", "automatic thoughts", "emotions", "behavior", "intermediate beliefs", "core belief"],
          workedExample: {
            title: "Worked example",
            caseContext: "Repeated social situations now show the same pattern: criticism, shame, silence, and self-attack.",
            whyThisShape: "The sheet pulls repeated evidence into one map instead of leaving it scattered across notes.",
            copyTip: "Only write links that appeared in more than one real example."
          },
          preview: {
            type: "form",
            fields: [
              { label: "Current problem", value: "anxiety in meetings" },
              { label: "Trigger", value: "being asked to speak suddenly" },
              { label: "Automatic thought", value: "I will say something stupid" },
              { label: "Emotion / behavior", value: "anxiety and withdrawal" },
              { label: "Belief hypothesis", value: "If I am not perfect, I am inadequate" }
            ]
          }
        },
        {
          name: "Treatment plan sheet",
          use: "To turn the problem list and formulation into goals and treatment order.",
          includes: ["priority problems", "short-term goals", "medium-term goals", "long-term goals", "starting tools"],
          workedExample: {
            title: "Worked example",
            caseContext: "The pattern is clear enough that the trainee now needs a realistic order of treatment targets.",
            whyThisShape: "The worksheet separates what should happen first from what can wait until later.",
            copyTip: "Start with one priority problem only, then build the goal ladder under it."
          },
          preview: {
            type: "form",
            fields: [
              { label: "Priority problem", value: "meeting anxiety" },
              { label: "Short-term goal", value: "identify automatic thoughts" },
              { label: "Medium-term goal", value: "reduce avoidance" },
              { label: "Long-term goal", value: "speak with steadier confidence" },
              { label: "Starting tools", value: "monitoring table and thought record" }
            ]
          }
        },
        {
          name: "Homework template",
          use: "To make the between-session task specific, realistic, and reviewable.",
          includes: ["one task only", "when to do it", "what to record", "what to bring back"],
          workedExample: {
            title: "Worked example",
            caseContext: "The session ended with one clear next step after the next team update.",
            whyThisShape: "This layout prevents vague homework by forcing one task, one cue, and one review item.",
            copyTip: "If you cannot tell exactly when it will happen, the homework is still too broad."
          },
          preview: {
            type: "form",
            fields: [
              { label: "Task", value: "complete one thought record" },
              { label: "When", value: "after the next team update" },
              { label: "What to record", value: "situation, thought, emotion, balanced response" },
              { label: "Bring back", value: "one filled sheet for review" }
            ]
          }
        }
      ]
    },
    goals: {
      title: "Goals and Treatment Plan Overview",
      items: [
        { title: "Immediate goals", text: "What needs to improve first so the client can stabilize, understand the problem, or start practicing." },
        { title: "Medium-term goals", text: "What repeated pattern or skill needs active work after the first stabilization." },
        { title: "Long-term goals", text: "What broader life change the client is working toward once the pattern becomes manageable." },
        { title: "How planning starts", text: "The treatment plan comes from the problem list and the cognitive formulation. It does not come from random tool preference." }
      ]
    },
    glossary: {
      title: "CBT Glossary",
      items: [
        { term: "Automatic thought", meaning: "A fast thought that shows up automatically in a situation." },
        { term: "Intermediate belief", meaning: "A rule or assumption that shapes how situations are interpreted." },
        { term: "Core belief", meaning: "A deep broad belief about the self, others, or the world." },
        { term: "Cognitive distortion", meaning: "A recurring thinking error that bends interpretation away from reality." },
        { term: "Formulation", meaning: "A working explanation of how the problem is maintained." },
        { term: "Homework", meaning: "The practice task done between sessions." },
        { term: "Downward arrow", meaning: "A questioning method used to uncover deeper beliefs." },
        { term: "Agenda", meaning: "The agreed session target and structure for today." },
        { term: "Session summary", meaning: "A brief recap of what became clear and what comes next." },
        { term: "Treatment plan", meaning: "The sequence of goals and interventions chosen from the problem pattern." }
      ]
    },
    advanced: {
      title: "Advanced Reference",
      intro: "These sections come from the deeper trainer notes and should be used after the core material feels clear.",
      blocks: [
        {
          title: "Deeper cognitive formulation",
          intro: "A fuller formulation links the current problem to patterns that maintain it.",
          bullets: [
            "Current problem and overall functioning",
            "Triggering situations",
            "Automatic thoughts",
            "Emotions and bodily responses",
            "Behaviors and compensatory strategies",
            "Intermediate and core beliefs",
            "How the links keep the pattern alive"
          ]
        },
        {
          title: "Triggering and predisposing factors",
          intro: "The trainer material separates the current trigger from the earlier background that made the pattern easier to form.",
          bullets: [
            "Triggering factors: what pushed the client to seek help now",
            "Predisposing factors: repeated earlier experiences that shaped beliefs",
            "Why they matter: they help explain depth, sensitivity, and treatment pacing"
          ]
        },
        {
          title: "Problem severity and assessment references",
          intro: "Assessment is part of formulation, but it is not the main beginner-facing entry point.",
          bullets: [
            "Use complaint, functioning, pattern frequency, and emotional impact",
            "Psychological measures can support understanding when clinically needed",
            "Severity helps pace treatment and choose where to begin"
          ]
        },
        {
          title: "Working hypotheses",
          intro: "Working hypotheses are testable ideas about why the problem is happening and what keeps it active.",
          bullets: [
            "They guide what to ask next",
            "They guide which intervention fits",
            "They must be revised if the session evidence does not support them"
          ]
        },
        {
          title: "Assessment and diagnostic references",
          intro: "The trainer material mentions psychological assessment and diagnosis as reference tools, not the main focus of this trainee page.",
          bullets: [
            "Assessment supports clarification, not mechanical labeling",
            "Diagnosis can inform treatment direction",
            "The practical CBT task still depends on case formulation, not diagnosis alone"
          ]
        }
      ]
    }
  },
  ar: {
    heroNote:
      "هذه الصفحة مبنية من مادة المدرب د. عمرو خاطر. ارجع إليها عندما تحتاج الصورة الكاملة، أو مراجعة سريعة، أو شرحًا بسيطًا قبل أن تكمل التدريب.",
    overview: {
      title: "ما هو العلاج المعرفي السلوكي؟",
      intro:
        "العلاج المعرفي السلوكي نموذج علاجي عملي ومنظم يربط بين الأفكار والمشاعر والسلوك والمعنى الذي يعطيه الشخص للموقف. مادة المدرب تعرضه كنموذج قائم على الأدلة، وتعاوني، وذو أهداف واضحة، وتعليمي في الأساس.",
      bullets: [
        "في هذا المنتج نستخدم العلاج المعرفي السلوكي كتدريب منظم، لا كجلسة علاج حرّة بلا إطار.",
        "المتدرب مطالب بتحديد هدف، واختيار أداة مناسبة، وكتابة استجابات منظمة، ثم مراجعتها وتحسينها.",
        "المهم ليس أن تبدو أكاديميًا. المهم أن تفكر بوضوح، وتبقى منظمًا، وتربط كل خطوة بالحالة."
      ]
    },
    principles: {
      title: "المبادئ الأساسية للعلاج المعرفي السلوكي",
      items: [
        { title: "التقييم المتنامي المستمر", text: "فهم الحالة يتطور من جلسة إلى أخرى. لا ننتظر النهاية حتى نفهم النمط." },
        { title: "التعاون", text: "العمل يتم مع العميل لا عليه. الهدف والأجندة والواجب يتم الاتفاق عليها معه." },
        { title: "الهدف الواضح", text: "كل جلسة تحتاج هدفًا محددًا بصياغة بسيطة وسلوكية." },
        { title: "التركيز على الحاضر", text: "العلاج يبدأ من المشكلة الحالية. نعود للماضي فقط إذا كان يشرح ما زال يعمل الآن." },
        { title: "الطابع التعليمي", text: "العميل يتعلم كيف يفهم نفسه وكيف يساعد نفسه تدريجيًا." },
        { title: "الجلسات المنظمة", text: "الجلسة تسير ببنية ثابتة: فحص الحالة، أجندة، مراجعة واجب، عمل رئيسي، ملخص، واجب جديد." },
        { title: "العمل المحدد بزمن", text: "النموذج مركز وعادة يسير ضمن خطة زمنية محددة لا عمل مفتوح بلا نهاية." },
        { title: "تعدد الفنيات", text: "الأداة تتغير حسب المشكلة والصياغة والهدف العلاجي، وليس لأن هناك أداة واحدة تناسب الجميع." }
      ]
    },
    sessionStructure: {
      title: "بنية الجلسة الثابتة",
      items: [
        "فحص المزاج أو الحالة",
        "الاتفاق على الأجندة",
        "مراجعة الواجب السابق",
        "العمل الرئيسي داخل الجلسة",
        "تلخيص ما تم الوصول إليه",
        "تحديد واجب جديد واحد"
      ]
    },
    fiveSessionMap: {
      title: "خريطة الجلسات الخمس للاستكشاف والصياغة",
      intro:
        "مادة المدرب تعرض مسارًا مبكرًا من خمس جلسات لبناء الصياغة. استخدم هذه الخريطة لتعرف ما الذي يفترض أن تنتجه كل جلسة في البداية.",
      items: [
        {
          session: "الجلسة الأولى",
          purpose: "التعرف على العميل، وتوضيح الشكوى الحالية، وشرح طريقة العلاج المعرفي السلوكي.",
          tools: ["التعليم النفسي", "جدول الرصد"],
          homework: "بدء جدول الرصد بعد المواقف المهمة.",
          output: "شكوى حالية واضحة، وبداية صورة زمنية للمشكلة، وأول واجب للرصد."
        },
        {
          session: "الجلسة الثانية",
          purpose: "مراجعة الواجب، وتحديد العامل المفجر، وتعميق صورة الأفكار والمشاعر.",
          tools: ["مراجعة جدول الرصد", "استكشاف العامل المفجر"],
          homework: "الاستمرار في الرصد بدقة أفضل.",
          output: "صورة أوضح للمثيرات والأنماط المتكررة والمشاعر المصاحبة."
        },
        {
          session: "الجلسة الثالثة",
          purpose: "شرح أخطاء التفكير ومساعدة العميل على استخراجها من أمثلته الواقعية.",
          tools: ["قائمة أخطاء التفكير", "جدول رصد بخانة أخطاء التفكير"],
          homework: "استكمال الجدول مع تحديد أخطاء التفكير المحتملة.",
          output: "أخطاء تفكير مسماة ومرتبطة بمواقف حقيقية."
        },
        {
          session: "الجلسة الرابعة",
          purpose: "الانتقال من الأفكار التلقائية إلى المعتقدات الأعمق وبناء دافعية التغيير.",
          tools: ["السهم الهابط", "استكشاف المعتقدات"],
          homework: "التفكير في كلفة المشكلة وما الذي يجعل التغيير مهمًا.",
          output: "فرضيات أولية عن المعتقدات الوسيطة والجذرية."
        },
        {
          session: "الجلسة الخامسة",
          purpose: "جمع الأنماط المتكررة ووضع بداية الخطة العلاجية مع العميل.",
          tools: ["تلخيص الأنماط", "الخطة العلاجية"],
          homework: "بدء أول مهمة علاجية مستهدفة.",
          output: "صياغة عاملة، ومشكلات ذات أولوية، ونقطة بداية واضحة للعلاج."
        }
      ]
    },
    tools: {
      title: "مكتبة أدوات العلاج المعرفي السلوكي",
      intro: "هذه الأدوات مأخوذة مباشرة من مادة المدرب ومن خطوات العمل العملية فيها.",
      items: [
        {
          name: "جدول الرصد أو مراقبة الأفكار",
          what: "جدول بسيط يسجل الموقف والمشاعر والفكرة والسلوك.",
          when: "يستخدم مبكرًا عندما يكون كلام العميل عامًا ويحتاج إلى أمثلة واضحة.",
          why: "يعطي مادة خام للصياغة ويساعد على تنظيم الذات.",
          example: "الموقف: المدير طلب تحديثًا. الفكرة: سأبدو غبيًا. الشعور: قلق. السلوك: أتكلم بسرعة وأتجنب النظر.",
          mistake: "كتابة قصة طويلة عن الحياة بدل موقف واحد محدد.",
          miniCase: {
            title: "مثال قصير",
            situation: "العميل يقول إنه دائمًا يشعر بسوء في العمل لكنه لا يستطيع وصف موقف واحد بوضوح.",
            whyThisTool: "جدول الرصد مناسب هنا لأن المادة ما زالت عامة وتحتاج موقفًا واحدًا يمكن ملاحظته.",
            expectedOutput: "سطر واحد واضح يضم الموقف والفكرة والشعور والسلوك."
          }
        },
        {
          name: "سجل الأفكار",
          what: "ورقة منظمة لفحص موقف مزعج والفكرة التلقائية والمشاعر والاستجابة الأكثر توازنًا.",
          when: "يستخدم عندما تكون هناك فكرة واضحة تقود الضيق أو التجنب.",
          why: "يبطئ الفكرة ويجعلها قابلة للفحص.",
          example: "الفكرة: إذا ترددت فسيظن الجميع أنني غير كفء.",
          mistake: "القفز لفكرة إيجابية قبل تحديد الفكرة الأصلية بوضوح.",
          miniCase: {
            title: "مثال قصير",
            situation: "العميل يكرر: إذا تكلمت في الاجتماع فسأحرج نفسي.",
            whyThisTool: "سجل الأفكار مناسب لأن هناك فكرة تلقائية واضحة تقود القلق والتجنب.",
            expectedOutput: "ورقة مكتملة فيها الفكرة الأصلية والأدلة والرد الأكثر توازنًا."
          }
        },
        {
          name: "قائمة أخطاء التفكير",
          what: "مرجع يجمع أخطاء التفكير الشائعة.",
          when: "تستخدم بعد أن يصبح لدى العميل أمثلة كافية من الرصد.",
          why: "تساعد العميل على ملاحظة أن طريقته في التفسير قد تكون منحازة.",
          example: "التفكير المستقطب: إذا لم أنجح بالكامل فهذا فشل كامل.",
          mistake: "حفظ الأسماء من دون ربطها بأفكار واقعية.",
          miniCase: {
            title: "مثال قصير",
            situation: "العميل يقول: أخطأت مرة واحدة إذن العرض كله كان كارثة.",
            whyThisTool: "قائمة أخطاء التفكير تساعد هنا على تسمية النمط بدل الدخول في نقاش عام.",
            expectedOutput: "ربط الفكرة بخطأ تفكير واضح مثل التفكير المستقطب أو تقدير الكوارث."
          }
        },
        {
          name: "السهم الهابط",
          what: "طريقة سؤال تنتقل من الفكرة السطحية إلى المعتقد الأعمق تحتها.",
          when: "يستخدم عندما تبدو الفكرة التلقائية ناتجة عن قاعدة أو معتقد أقوى.",
          why: "يكشف المعنى الموجود تحت الفكرة السريعة.",
          example: "إذا فشلت في هذه المهمة، ماذا يعني ذلك؟ يعني أنني غير قادر.",
          mistake: "استخدامه مبكرًا قبل أن تتوفر مادة واقعية كافية.",
          miniCase: {
            title: "مثال قصير",
            situation: "العميل يقول مرارًا: إذا لاحظوا خطئي فكل شيء سيتغير.",
            whyThisTool: "السهم الهابط يساعد على كشف المعنى أو القاعدة الأعمق تحت الفكرة السطحية.",
            expectedOutput: "عبارة أعمق مثل: إذا لم أكن مثاليًا فأنا ضعيف."
          }
        },
        {
          name: "الصياغة المعرفية",
          what: "خريطة عمل تربط المشكلة الحالية بالمثيرات والأفكار والمشاعر والسلوك والمعتقدات.",
          when: "تستخدم بعد ظهور نمط متكرر وواضح.",
          why: "تحول التفاصيل الكثيرة إلى نمط واحد يمكن فهمه.",
          example: "النقد المتصور يثير خزيًا ثم انسحابًا ويغذي الاعتقاد: أنا معيب.",
          mistake: "كتابة كلام نظري جميل غير مستند إلى أدلة من الحالة.",
          miniCase: {
            title: "مثال قصير",
            situation: "عدة مواقف مرصودة أظهرت النمط نفسه: نقد ثم خزي ثم صمت ثم هجوم على الذات.",
            whyThisTool: "الصياغة المعرفية مناسبة الآن لأن الروابط المتكررة أصبحت واضحة عبر أكثر من مثال.",
            expectedOutput: "خريطة حالة تربط المثيرات والأفكار والمشاعر والسلوك وفرضيات المعتقد."
          }
        },
        {
          name: "الخطة العلاجية",
          what: "خطة عملية تحدد ما الذي سنبدأ به ولماذا.",
          when: "تستخدم بعد وضوح قائمة المشكلات والصياغة.",
          why: "تحول الصياغة إلى ترتيب عمل علاجي.",
          example: "نبدأ أولًا بمراقبة الأفكار ثم فحص الفكرة الأساسية قبل العمل الأعمق على المعتقد.",
          mistake: "وضع أهداف كثيرة من دون ترتيب أو صلة بالصياغة.",
          miniCase: {
            title: "مثال قصير",
            situation: "الصياغة صارت واضحة لكن المتدرب لا يعرف ماذا يستهدف أولًا.",
            whyThisTool: "الخطة العلاجية تحول الصياغة إلى أولويات وترتيب عمل واقعي.",
            expectedOutput: "هدف أول واضح، وهدف قصير المدى، والأدوات الأولى المناسبة."
          }
        },
        {
          name: "التعليم النفسي",
          what: "شرح نموذج العلاج والمشكلة بلغة يفهمها العميل.",
          when: "يستخدم في البداية وكلما ضاع وضوح الصورة.",
          why: "يزيد الفهم والتعاون والدافعية.",
          example: "نحن ننظر إلى كيف تتفاعل الأفكار والمشاعر والسلوك في هذه المشكلة.",
          mistake: "تحويله إلى محاضرة غير مرتبطة بحالة العميل.",
          miniCase: {
            title: "مثال قصير",
            situation: "العميل لا يزال لا يفهم لماذا نستخدم الرصد أو الواجب بين الجلسات.",
            whyThisTool: "التعليم النفسي يبني فهمًا مشتركًا قبل البدء في العمل الأعمق.",
            expectedOutput: "شرح بسيط لنموذج CBT مرتبط مباشرة بمشكلة العميل."
          }
        },
        {
          name: "مراجعة الأدلة",
          what: "فحص ما الأدلة التي تؤيد الفكرة وما الأدلة التي لا تؤيدها.",
          when: "تستخدم عندما تكون الفكرة قوية لكنها قد تكون مشوهة أو واثقة أكثر من اللازم.",
          why: "تنقل العميل من اليقين إلى الاختبار.",
          example: "ما الدليل أنك ستفشل حتمًا في المقابلة؟ وما الدليل الذي يشير إلى غير ذلك؟",
          mistake: "الدخول في جدال مع العميل بدل فحص الأدلة معه.",
          miniCase: {
            title: "مثال قصير",
            situation: "العميل متأكد أن لحظة ارتباك واحدة تعني فشلًا كاملًا.",
            whyThisTool: "مراجعة الأدلة مفيدة عندما يكون اليقين عاليًا لكن الفكرة قد تكون منحازة.",
            expectedOutput: "فحص واضح للأدلة المؤيدة والمعاكسة للفكرة."
          }
        },
        {
          name: "التساؤل السقراطي",
          what: "أسئلة موجهة تساعد العميل على اكتشاف رؤية أدق بنفسه.",
          when: "يستخدم أثناء العمل المعرفي بدل إعطاء نصيحة مباشرة.",
          why: "الاكتشاف أقوى من التلقين.",
          example: "لو صديقك وقع في الخطأ نفسه، هل ستقول إنه عديم القيمة؟",
          mistake: "تحويله إلى اختبار إجباري يعرف فيه المعالج الإجابة مسبقًا.",
          miniCase: {
            title: "مثال قصير",
            situation: "المتدرب يريد تصحيح الفكرة لكنه يستمر في إعطاء نصيحة مباشرة.",
            whyThisTool: "التساؤل السقراطي يساعد العميل على الوصول بنفسه إلى رؤية أدق.",
            expectedOutput: "سلسلة قصيرة من الأسئلة تخفف اليقين وتفتح بدائل."
          }
        },
        {
          name: "التجربة السلوكية",
          what: "اختبار عملي في الواقع لتجربة معتقد أو توقع.",
          when: "تستخدم عندما نحتاج دليلًا سلوكيًا على صحة التوقع أو خطئه.",
          why: "تنقل العمل من التنظير إلى الاختبار الواقعي.",
          example: "أرسل مسودة مبكرًا ولاحظ ما نوع التغذية الراجعة التي تحدث فعليًا.",
          mistake: "اختيار مهمة كبيرة ومخيفة بدل تجربة صغيرة وواضحة.",
          miniCase: {
            title: "مثال قصير",
            situation: "العميل يتوقع أن مجرد التحدث مرة واحدة في الاجتماع سيؤدي إلى رفض شديد.",
            whyThisTool: "التجربة السلوكية مفيدة عندما نحتاج اختبارًا واقعيًا لا مجرد نقاش نظري.",
            expectedOutput: "توقع واحد واضح، واختبار واحد، ونتيجة واحدة يمكن ملاحظتها."
          }
        },
        {
          name: "الواجب",
          what: "المهمة التي تنقل عمل الجلسة إلى ما بين الجلسات.",
          when: "يستخدم في نهاية كل جلسة قابلة للعمل.",
          why: "التحسن في العلاج المعرفي السلوكي يحتاج ممارسة بين الجلسات لا فهمًا لحظيًا فقط.",
          example: "أكمل سجلًا واحدًا بعد المحادثة الصعبة القادمة.",
          mistake: "إعطاء واجب واسع أو غير واقعي أو غير مرتبط بما حدث في الجلسة.",
          miniCase: {
            title: "مثال قصير",
            situation: "المتدرب فهم الجلسة لكنه لم يحولها بعد إلى مهمة عملية بين الجلسات.",
            whyThisTool: "الواجب ينقل الجلسة إلى ممارسة حقيقية خارج الجلسة.",
            expectedOutput: "مهمة واحدة محددة، ووقت واضح، وشيء واحد يعود للمراجعة."
          }
        }
      ]
    },
    cognitiveStructure: {
      title: "البنية المعرفية",
      intro:
        "استخدم هذا القسم كخريطة بسيطة لطبقات المعنى. في العمل المعرفي السلوكي نبدأ غالبًا من الفكرة السريعة الظاهرة، ثم ننتقل إلى القاعدة الأعمق، ثم إلى المعتقد الجوهري.",
      levels: [
        {
          name: "الفكرة التلقائية",
          description: "الفكرة السريعة التي تظهر أولًا في اللحظة.",
          example: "إذا ترددت فسيظنون أنني ضعيف."
        },
        {
          name: "المعتقد الوسيط",
          description: "القاعدة أو الافتراض الموجود تحت الفكرة.",
          example: "إذا لم أؤدِّ بقوة فلن يحترمني الناس."
        },
        {
          name: "المعتقد الجوهري",
          description: "أعمق معتقد عام عن الذات أو القيمة الشخصية.",
          example: "أنا لست جيدًا بما يكفي."
        }
      ]
    },
    thinkingLevels: {
      title: "مستويات التفكير",
      items: [
        {
          name: "الأفكار التلقائية",
          definition: "أفكار سريعة تظهر فورًا استجابةً للموقف.",
          difference: "هي المستوى السطحي وتتغير من موقف لآخر بسرعة.",
          example: "إذا ترددت فسيظنون أنني غير كفء."
        },
        {
          name: "المعتقدات الوسيطة",
          definition: "قواعد وافتراضات واتجاهات تشكل تفسير الشخص للمواقف.",
          difference: "أعمق من فكرة واحدة لكنها ليست عامة وراسخة مثل المعتقد الجوهري.",
          example: "إذا لم أؤدِّ بقوة فمن الأفضل ألا أتكلم أصلًا."
        },
        {
          name: "المعتقدات الجوهريّة",
          definition: "معتقدات عميقة وعامة عن الذات أو الآخرين أو العالم.",
          difference: "هي أعمق مستوى وغالبًا يشعر بها الشخص كأنها حقيقة ثابتة.",
          example: "أنا غير كفء."
        }
      ]
    },
    distortions: {
      title: "مرجع التشوهات المعرفية",
      intro: "هذه أخطاء تفكير عملية وردت في مادة المدرب. استخدمها لتسمية النمط لا لجمع المصطلحات فقط.",
      items: [
        { name: "التصفية", definition: "التركيز على تفصيلة سلبية واحدة واستبعاد بقية الصورة.", example: "ملاحظة ناقدة واحدة تعني أن اليوم كله فشل.", appearsAs: "الشخص يظل يعيد الجزء السيئ وينسى بقية الموقف.", differsFrom: "تختلف عن تقدير الكوارث لأن العقل هنا يضيق الصورة، لا يقفز فقط إلى أسوأ مستقبل." },
        { name: "التفكير المستقطب", definition: "رؤية الأمور كنجاح كامل أو فشل كامل بلا منطقة وسط.", example: "إذا لم أنجح بشكل مثالي فأنا فاشل.", appearsAs: "حكم صارم أبيض أو أسود على النفس أو الموقف.", differsFrom: "يختلف عن الوصم لأن الحكم هنا يبدأ على النتيجة بشكل مطلق قبل أن يتحول إلى هوية." },
        { name: "الإفراط في التعميم", definition: "تحويل حدث واحد إلى قاعدة عامة على كل شيء.", example: "تم رفضي مرة، إذن الناس ترفضني دائمًا.", appearsAs: "كلمات مثل دائمًا، أبدًا، كل الناس، لا أحد.", differsFrom: "يختلف عن التفكير المستقطب لأنه ينشر الحدث الواحد عبر الزمن والمواقف." },
        { name: "القفز إلى الاستنتاجات", definition: "الوصول لنتيجة سلبية قبل أن توجد أدلة كافية.", example: "هي حولت وجهها إذن بالتأكيد لا تحبني.", appearsAs: "قراءة أفكار الآخرين أو التنبؤ بالمستقبل.", differsFrom: "يختلف عن الشخصنة لأن المشكلة الأساسية هنا هي نقص الأدلة لا مجرد تحميل الذات المسؤولية." },
        { name: "التهويل والتهوين", definition: "تكبير الخطأ أو التهديد، وتصغير النجاح أو القوة.", example: "هذا الخطأ يثبت أنني سيئ، أما النجاح فلا يُحسب.", appearsAs: "الخطر يكبر والإنجازات تتبخر.", differsFrom: "يختلف عن تقدير الكوارث لأنه قد يضخم الحاضر أو يصغّر القوة دون التنبؤ بانهيار كامل." },
        { name: "تقدير الكوارث", definition: "التعامل مع أسوأ نتيجة ممكنة كأنها الأقرب للحدوث.", example: "إذا توترت في الحافلة فستنتهي حياتي.", appearsAs: "العقل يقفز مباشرة إلى الكارثة.", differsFrom: "يختلف عن التهويل لأنه يركز تحديدًا على أسوأ نتيجة مستقبلية ممكنة." },
        { name: "الشخصنة", definition: "تحميل النفس مسؤولية زائدة عن الأحداث أو عن مشاعر الآخرين.", example: "الفريق متوتر، إذن أنا السبب.", appearsAs: "الشخص يضع نفسه في مركز كل ما يحدث.", differsFrom: "تختلف عن إلقاء اللوم لأن الشخصنة تجعل الذات سببًا حتى عندما تكون الأدلة ضعيفة." },
        { name: "التفكير الانفعالي", definition: "اعتبار الشعور دليلًا على الحقيقة.", example: "أشعر أنني عديم القيمة، إذن أنا عديم القيمة فعلًا.", appearsAs: "الشعور يتحول إلى برهان.", differsFrom: "يختلف عن الوصم لأن طريق الحكم هنا يمر عبر الشعور نفسه." },
        { name: "المفترضات", definition: "قواعد جامدة تقول كيف يجب أن تسير الأمور دائمًا.", example: "يجب ألا أخطئ أبدًا.", appearsAs: "ذنب أو غضب أو خيبة عندما لا تمشي الحياة حسب القاعدة.", differsFrom: "تختلف عن مغالطة العدالة لأنها تدور حول قواعد داخلية صارمة أكثر من استحقاق الإنصاف." },
        { name: "الوصم", definition: "تحويل خطأ أو موقف إلى هوية كاملة للشخص.", example: "أخطأت، إذن أنا فاشل.", appearsAs: "سلوك واحد يصبح تعريفًا كاملًا للذات.", differsFrom: "يختلف عن التفكير المستقطب لأن النتيجة تتحول هنا إلى هوية كاملة." },
        { name: "إلقاء اللوم", definition: "تحميل الذات أو الآخرين كل المسؤولية بدل رؤية الصورة الكاملة.", example: "مديري هو السبب الكامل فيما أشعر به.", appearsAs: "لا يوجد توازن في تحمل المسؤولية.", differsFrom: "يختلف عن الشخصنة لأنه قد يوجّه المسؤولية كلها إلى الذات أو إلى الآخرين بشكل أحادي." },
        { name: "مغالطة العدالة", definition: "افتراض أن الحياة يجب أن تسير وفق تصورك الخاص للإنصاف.", example: "ما دمت اجتهدت، فلا ينبغي أن يحدث هذا لي.", appearsAs: "استياء لأن الواقع لم يطابق قاعدة داخلية عن العدالة.", differsFrom: "تختلف عن المفترضات لأن التركيز هنا على العدالة والاستحقاق." },
        { name: "مغالطة السيطرة", definition: "التفكير بأنك تتحكم في كل شيء أو أنك لا تملك أي تحكم إطلاقًا.", example: "إذا انزعجوا فذلك يعني أنني فشلت بالكامل في إدارة الأمر.", appearsAs: "مسؤولية متضخمة أو عجز كامل.", differsFrom: "تختلف عن الشخصنة لأنها تركز على معنى السيطرة نفسها لا على اللوم فقط." },
        { name: "أن تكون على صواب دائمًا", definition: "اعتبار إثبات الصواب أهم من فهم الواقع أو الحفاظ على العلاقة.", example: "يجب أن أثبت أن وجهة نظري صحيحة مهما كان أثر ذلك على الحوار.", appearsAs: "الجدال يغلب التأمل.", differsFrom: "تختلف عن المفترضات لأن التركيز هنا على إثبات الصواب لا فقط على القواعد الجامدة." },
        { name: "مغالطة التغيير", definition: "الاعتقاد أن الآخرين يجب أن يتغيروا أولًا حتى أشعر أو أتحسن.", example: "إذا غيّروا طريقتهم فسأصبح بخير أخيرًا.", appearsAs: "الراحة النفسية مربوطة بتغيير الآخرين.", differsFrom: "تختلف عن إلقاء اللوم لأنها تجعل التغيير الخارجي شرطًا للارتياح." },
        { name: "مغالطة فكرة المكافأة", definition: "توقع أن التضحية والحرمان سيُكافآن تلقائيًا لاحقًا فقط لأن الشخص تحملهما.", example: "بعد كل ما صبرت عليه، من المفترض أن تكافئني الحياة الآن.", appearsAs: "عقد خفي مع الواقع يؤدي إلى الإحباط.", differsFrom: "تختلف عن مغالطة العدالة لأنها تركز على العائد المتوقع مقابل التضحية." }
      ]
    },
    emotions: {
      title: "مرجع المشاعر",
      intro: "استخدم هذا القسم عندما يقول العميل: أنا متضايق أو تعبان. الهدف هو تسمية الشعور بدقة أكبر.",
      groups: [
        { core: "حزن", children: ["خيبة", "وحدة", "ألم", "فقد", "يأس"] },
        { core: "قلق / خوف", children: ["توتر", "خشية", "هلع", "عدم أمان", "ترقب"] },
        { core: "غضب", children: ["انزعاج", "استياء", "إحباط", "حنق", "إهانة"] },
        { core: "خزي", children: ["إحراج", "صِغَر", "انكشاف", "مهانة", "شعور بالعيب"] },
        { core: "ذنب", children: ["ندم", "تأنيب", "لوم ذات", "أسف"] },
        { core: "فرح / ارتياح", children: ["هدوء", "أمان", "رضا", "أمل", "سرور"] }
      ]
    },
    worksheets: {
      title: "النماذج والورقات المرجعية",
      items: [
        {
          name: "جدول الرصد",
          use: "لالتقاط الموقف والمشاعر والأفكار المسيطرة والسلوك ثم لاحقًا أخطاء التفكير.",
          includes: ["الموقف", "المشاعر", "درجة الشعور", "الفكرة المسيطرة", "السلوك"],
          workedExample: {
            title: "مثال مكتمل",
            caseContext: "المتدرب يتتبع قلق الاجتماعات بعد أن طُلب منه تحديث سريع أمام الفريق.",
            whyThisShape: "هذا الشكل يجبرك على موقف واحد محدد بدل تلخيص أسبوع كامل بشكل عام.",
            copyTip: "استخدم الأعمدة نفسها واملأ سطرًا واحدًا فقط لكل موقف حقيقي."
          },
          preview: {
            type: "table",
            headers: ["الموقف", "الشعور", "الدرجة", "الفكرة", "السلوك"],
            rows: [["تحديث الفريق", "قلق", "80/100", "سأبدو غير كفء", "تكلمت بسرعة"]]
          }
        },
        {
          name: "جدول الرصد مع أخطاء التفكير",
          use: "لمواصلة الرصد مع إضافة تسمية خطأ التفكير المحتمل في كل موقف.",
          includes: ["الموقف", "المشاعر", "درجة الشعور", "الفكرة المسيطرة", "خطأ التفكير", "السلوك"],
          workedExample: {
            title: "مثال مكتمل",
            caseContext: "أصبح لدى المتدرب أمثلة رصد كافية وبدأ يتعلم كيف يحدد التشوه داخل الفكرة.",
            whyThisShape: "هذا الشكل ينقل العمل من الوصف فقط إلى التعرف على النمط المعرفي نفسه.",
            copyTip: "لا تملأ خانة خطأ التفكير إلا بعد كتابة الفكرة نفسها بوضوح."
          },
          preview: {
            type: "table",
            headers: ["الموقف", "الشعور", "الدرجة", "الفكرة", "خطأ التفكير", "السلوك"],
            rows: [["تحديث الفريق", "قلق", "80/100", "إذا توقفت قليلًا فسيظنون أنني ضعيف", "القفز إلى الاستنتاجات", "أتجنب الكلام المطول"]]
          }
        },
        {
          name: "ورقة السهم الهابط",
          use: "للانتقال من فكرة تلقائية واحدة إلى المعنى الأعمق أو المعتقد تحتها.",
          includes: ["الفكرة المختارة", "ماذا يعني هذا لي؟", "ما أسوأ جزء في ذلك؟", "ماذا يقول هذا عني؟"],
          workedExample: {
            title: "مثال مكتمل",
            caseContext: "المتدرب يبدأ من فكرة: إذا ترددت فسيحكمون عليّ.",
            whyThisShape: "كل سؤال يدفع المعنى درجة أعمق حتى تظهر القاعدة أو المعتقد تحت الفكرة.",
            copyTip: "ضع فكرة واحدة في الأعلى، ثم اجعل كل سطر يجيب السطر الذي قبله."
          },
          preview: {
            type: "form",
            fields: [
              { label: "الفكرة المختارة", value: "إذا ترددت فسيحكمون عليّ" },
              { label: "ماذا يعني هذا لي؟", value: "يعني أنني ضعيف" },
              { label: "ما أسوأ جزء؟", value: "سيفقدون احترامهم لي" },
              { label: "ماذا يقول هذا عني؟", value: "أنني لست جيدًا بما يكفي" }
            ]
          }
        },
        {
          name: "ورقة الصياغة",
          use: "لتنظيم المشكلة الحالية والمثيرات والمعتقدات والأنماط المتكررة في خريطة واحدة.",
          includes: ["المشكلة الحالية", "العوامل المفجرة", "الأفكار التلقائية", "المشاعر", "السلوك", "المعتقدات الوسيطة", "المعتقد الجوهري"],
          workedExample: {
            title: "مثال مكتمل",
            caseContext: "عدة مواقف اجتماعية أظهرت النمط نفسه: نقد ثم خزي ثم صمت ثم هجوم على الذات.",
            whyThisShape: "الورقة تجمع الأدلة المتكررة في خريطة واحدة بدل أن تبقى متفرقة بين الملاحظات.",
            copyTip: "لا تكتب رابطًا في الصياغة إلا إذا ظهر في أكثر من مثال حقيقي."
          },
          preview: {
            type: "form",
            fields: [
              { label: "المشكلة الحالية", value: "قلق في الاجتماعات" },
              { label: "العامل المفجر", value: "أن يُطلب مني الكلام فجأة" },
              { label: "الفكرة التلقائية", value: "سأقول شيئًا غبيًا" },
              { label: "المشاعر / السلوك", value: "قلق وانسحاب" },
              { label: "فرضية المعتقد", value: "إذا لم أكن مثاليًا فأنا غير كفء" }
            ]
          }
        },
        {
          name: "ورقة الخطة العلاجية",
          use: "لتحويل قائمة المشكلات والصياغة إلى أهداف مرتبة وبداية تدخل واضحة.",
          includes: ["المشكلات ذات الأولوية", "الأهداف قصيرة المدى", "الأهداف متوسطة المدى", "الأهداف طويلة المدى", "الفنيات الأولى"],
          workedExample: {
            title: "مثال مكتمل",
            caseContext: "النمط أصبح واضحًا بما يكفي ليقرر المتدرب ما الذي يبدأ به أولًا.",
            whyThisShape: "الورقة تفصل بين ما يجب أن يبدأ الآن وما يمكن تأجيله إلى مراحل لاحقة.",
            copyTip: "ابدأ بمشكلة أولوية واحدة فقط، ثم ابنِ تحتها درجات الأهداف."
          },
          preview: {
            type: "form",
            fields: [
              { label: "المشكلة ذات الأولوية", value: "قلق الاجتماعات" },
              { label: "هدف قصير المدى", value: "تحديد الأفكار التلقائية" },
              { label: "هدف متوسط المدى", value: "تقليل التجنب" },
              { label: "هدف طويل المدى", value: "التحدث بثبات أكبر" },
              { label: "الفنيات الأولى", value: "جدول الرصد وسجل الأفكار" }
            ]
          }
        },
        {
          name: "نموذج الواجب",
          use: "لجعل الواجب محددًا وقابلًا للتنفيذ والمراجعة.",
          includes: ["مهمة واحدة فقط", "متى تُنفذ", "ما الذي سيُسجل", "ما الذي سيُراجع في الجلسة القادمة"],
          workedExample: {
            title: "مثال مكتمل",
            caseContext: "الجلسة انتهت بخطوة واحدة واضحة بعد تحديث الفريق القادم.",
            whyThisShape: "هذا الشكل يمنع الواجب العام لأنه يفرض مهمة واحدة وموقفًا واضحًا وشيئًا محددًا للمراجعة.",
            copyTip: "إذا لم تستطع تحديد متى سينفذ الواجب بالضبط، فهو ما زال واسعًا أكثر من اللازم."
          },
          preview: {
            type: "form",
            fields: [
              { label: "المهمة", value: "أكمل سجل أفكار واحد" },
              { label: "متى", value: "بعد تحديث الفريق القادم" },
              { label: "ما الذي يُسجل", value: "الموقف، الفكرة، الشعور، الرد المتوازن" },
              { label: "ما الذي سيعود للمراجعة", value: "ورقة واحدة مكتملة" }
            ]
          }
        }
      ]
    },
    goals: {
      title: "نظرة عامة على الأهداف والخطة العلاجية",
      items: [
        { title: "الأهداف الفورية", text: "ما الذي يجب أن يتحسن أولًا حتى يستقر العميل أو يفهم المشكلة أو يبدأ التمرين." },
        { title: "الأهداف متوسطة المدى", text: "ما النمط المتكرر أو المهارة التي تحتاج عملاً متواصلًا بعد البداية." },
        { title: "الأهداف طويلة المدى", text: "ما التغيير الأوسع الذي يسعى إليه العميل عندما يصبح النمط أكثر قابلية للإدارة." },
        { title: "من أين تبدأ الخطة؟", text: "الخطة العلاجية تخرج من قائمة المشكلات والصياغة المعرفية، لا من تفضيل عشوائي لأداة معينة." }
      ]
    },
    glossary: {
      title: "معجم مختصر",
      items: [
        { term: "فكرة تلقائية", meaning: "فكرة سريعة تظهر تلقائيًا في موقف معين." },
        { term: "معتقد وسيط", meaning: "قاعدة أو افتراض يشكل طريقة تفسير المواقف." },
        { term: "معتقد جوهري", meaning: "معتقد عميق وعام عن الذات أو الآخرين أو العالم." },
        { term: "تشوه معرفي", meaning: "خطأ تفكير متكرر يجعل التفسير أبعد عن الواقع." },
        { term: "صياغة", meaning: "تفسير عملي لكيفية نشأة المشكلة واستمرارها." },
        { term: "واجب", meaning: "المهمة التي تُنفذ بين الجلسات." },
        { term: "السهم الهابط", meaning: "طريقة سؤال تستخدم لكشف المعتقدات الأعمق." },
        { term: "أجندة", meaning: "اتفاق على هدف الجلسة وبنيتها اليوم." },
        { term: "ملخص الجلسة", meaning: "تلخيص قصير لما اتضح وما الذي سيأتي بعده." },
        { term: "الخطة العلاجية", meaning: "ترتيب الأهداف والتدخلات الذي يخرج من نمط المشكلة." }
      ]
    },
    advanced: {
      title: "المرجع المتقدم",
      intro: "هذه الأقسام مأخوذة من الجزء الأعمق في مادة المدرب، ويستحسن الرجوع لها بعد وضوح المرجع الأساسي.",
      blocks: [
        {
          title: "تفكيك أعمق للصياغة المعرفية",
          intro: "الصياغة الأعمق لا تكتفي بالمشكلة الحالية، بل تربطها بالنمط الذي يحافظ عليها.",
          bullets: [
            "المشكلة الحالية والأداء العام",
            "المواقف أو العوامل المفجرة",
            "الأفكار التلقائية",
            "المشاعر والاستجابات الجسدية",
            "السلوك والاستراتيجيات التعويضية",
            "المعتقدات الوسيطة والجذرية",
            "كيف تبقي هذه الروابط النمط قائمًا"
          ]
        },
        {
          title: "العوامل المفجرة والمرسبة",
          intro: "مادة المدرب تميز بين ما فجر المشكلة الآن وبين الخلفية السابقة التي جعلت النمط أكثر قابلية للتكوّن.",
          bullets: [
            "العوامل المفجرة: ما الذي جعل العميل يطلب المساعدة الآن",
            "العوامل المرسبة: خبرات سابقة متكررة ساهمت في تكوين المعتقدات",
            "أهميتها: تساعد على فهم عمق الحساسية واختيار سرعة وتدرج العلاج"
          ]
        },
        {
          title: "مرجع تقدير الشدة والتقييم",
          intro: "التقييم جزء من الصياغة، لكنه ليس بوابة المبتدئ الأولى في الصفحة.",
          bullets: [
            "استخدم الشكوى والأداء العام وتكرار النمط وشدة الأثر الانفعالي",
            "المقاييس النفسية قد تدعم الفهم حين تكون هناك حاجة سريرية",
            "تقدير الشدة يساعد على معرفة أين نبدأ وكيف نرتب الخطة"
          ]
        },
        {
          title: "الفروض العاملة",
          intro: "الفروض العاملة هي أفكار قابلة للاختبار عن سبب المشكلة وما الذي يبقيها مستمرة.",
          bullets: [
            "توجّه الأسئلة القادمة",
            "توجّه اختيار التدخل المناسب",
            "يجب تعديلها إذا لم تؤيدها أدلة الجلسات"
          ]
        },
        {
          title: "مرجع التقييم والتشخيص",
          intro: "مادة المدرب تذكر التقييم والتشخيص كطبقة مرجعية مساندة، لا كمحور رئيسي لهذه الصفحة.",
          bullets: [
            "التقييم يساعد على التوضيح وليس على وضع ملصق فقط",
            "التشخيص قد يوجه الخطة لكنه لا يغني عن الصياغة",
            "العمل المعرفي السلوكي العملي يعتمد على فهم الحالة لا على التشخيص وحده"
          ]
        }
      ]
    }
  }
};

export function getReferenceHubContent(language: AppLanguage) {
  return content[language];
}
