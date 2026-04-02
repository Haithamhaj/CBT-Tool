import type {
  EvaluatorProvider,
  CategoryClassifierInput,
  DriftDetectorInput,
  FeedbackCoachInput,
  SessionSynthesizerInput
} from "./provider";
import {
  buildCategoryClassifierPrompt,
  buildDriftDetectorPrompt,
  buildFeedbackCoachPrompt,
  buildSessionSynthesizerPrompt
} from "./prompts";

type OpenAIProviderOptions = {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  timeoutMs?: number;
};

async function callOpenAIJson(options: {
  apiKey: string;
  model: string;
  baseUrl: string;
  prompt: string;
  jsonSchemaName: string;
  schema: object;
  timeoutMs: number;
}): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await fetch(`${options.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey}`
      },
      body: JSON.stringify({
        model: options.model,
        messages: [
          { role: "system", content: "Return only valid JSON matching the provided schema." },
          { role: "user", content: options.prompt }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: options.jsonSchemaName,
            strict: true,
            schema: options.schema
          }
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI response did not include content");
    }

    return JSON.parse(content);
  } finally {
    clearTimeout(timeout);
  }
}

export class OpenAIProvider implements EvaluatorProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(options: OpenAIProviderOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? "gpt-4.1-mini";
    this.baseUrl = options.baseUrl ?? "https://api.openai.com/v1";
    this.timeoutMs = options.timeoutMs ?? 4000;
  }

  async classifyCategory(input: CategoryClassifierInput): Promise<unknown> {
    return callOpenAIJson({
      apiKey: this.apiKey,
      model: this.model,
      baseUrl: this.baseUrl,
      timeoutMs: this.timeoutMs,
      prompt: buildCategoryClassifierPrompt(input.text, input.language),
      jsonSchemaName: "category_classifier_result",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: {
            type: "string",
            enum: ["situation", "thought", "emotion", "behavior", "ambiguous"]
          },
          confidence: { type: "number" },
          explanation: { type: "string" }
        },
        required: ["label", "confidence", "explanation"]
      }
    });
  }

  async coachFeedback(input: FeedbackCoachInput): Promise<unknown> {
    return callOpenAIJson({
      apiKey: this.apiKey,
      model: this.model,
      baseUrl: this.baseUrl,
      timeoutMs: this.timeoutMs,
      prompt: buildFeedbackCoachPrompt(input),
      jsonSchemaName: "feedback_coach_result",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          what_was_done_well: { type: "array", items: { type: "string" } },
          top_issues: { type: "array", items: { type: "string" } },
          why_it_matters: { type: "array", items: { type: "string" } },
          next_revision: { type: "string" }
        },
        required: ["what_was_done_well", "top_issues", "why_it_matters", "next_revision"]
      }
    });
  }

  async detectDrift(input: DriftDetectorInput): Promise<unknown> {
    return callOpenAIJson({
      apiKey: this.apiKey,
      model: this.model,
      baseUrl: this.baseUrl,
      timeoutMs: this.timeoutMs,
      prompt: buildDriftDetectorPrompt(input),
      jsonSchemaName: "drift_detector_result",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ai_drifts: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                drift_id: {
                  type: "string",
                  enum: ["DR005", "DR010"]
                },
                name: { type: "string" },
                severity: {
                  type: "string",
                  enum: ["minor", "moderate", "major"]
                },
                rationale: { type: "string" },
                corrective_action: { type: "string" }
              },
              required: ["drift_id", "name", "severity", "rationale", "corrective_action"]
            }
          }
        },
        required: ["ai_drifts"]
      }
    });
  }

  async synthesizeSession(input: SessionSynthesizerInput): Promise<unknown> {
    return callOpenAIJson({
      apiKey: this.apiKey,
      model: this.model,
      baseUrl: this.baseUrl,
      timeoutMs: this.timeoutMs,
      prompt: buildSessionSynthesizerPrompt({
        sessionState: input.session.state,
        stage: input.session.stage,
        selectedTool: input.session.selected_tool,
        scoreOutcome: input.scoreSnapshot.outcome,
        adjustedScore: input.scoreSnapshot.adjusted_score,
        topIssues: input.scoreSnapshot.top_issues,
        driftSummaries: input.driftEvents.map((drift) => `${drift.drift_id}: ${drift.message}`),
        attemptSteps: input.attempts.map((attempt) => attempt.step_name),
        language: input.language
      }),
      jsonSchemaName: "session_synthesizer_result",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          session_summary: { type: "string" },
          primary_learning_pattern: { type: "string" },
          evidence_based_strengths: { type: "array", items: { type: "string" } },
          priority_improvement_area: { type: "string" },
          recommended_next_focus: { type: "string" },
          confidence: { type: "number" }
        },
        required: [
          "session_summary",
          "primary_learning_pattern",
          "evidence_based_strengths",
          "priority_improvement_area",
          "recommended_next_focus",
          "confidence"
        ]
      }
    });
  }
}
