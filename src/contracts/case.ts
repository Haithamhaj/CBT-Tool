import { z } from "zod";
import { difficultySchema, toolIdSchema, trainingStageSchema } from "./enums";

export const caseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  difficulty: difficultySchema,
  theme: z.string().min(1),
  presenting_complaint: z.string().min(1),
  trigger_events: z.array(z.string().min(1)).min(1),
  sample_thoughts: z.array(z.string().min(1)).min(1),
  sample_emotions: z.array(z.string().min(1)).min(1),
  sample_behaviors: z.array(z.string().min(1)).min(1),
  hidden_beliefs: z.array(z.string().min(1)).min(1),
  recommended_tools: z.array(toolIdSchema).min(1),
  expected_drifts: z.array(z.string().regex(/^DR\d{3}$/)).min(1),
  homework_context_present: z.boolean(),
  stage_suitability: z.array(trainingStageSchema).min(1)
});

export type Case = z.infer<typeof caseSchema>;
