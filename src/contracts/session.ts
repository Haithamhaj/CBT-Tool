import { z } from "zod";
import { attemptStepNameSchema, sessionStateSchema, toolIdSchema, trainingStageSchema } from "./enums";

export const sessionSchema = z.object({
  id: z.string().min(1),
  user_id: z.string().min(1),
  case_id: z.string().min(1),
  state: sessionStateSchema,
  current_step: attemptStepNameSchema.nullable(),
  stage: trainingStageSchema,
  selected_tool: toolIdSchema,
  session_goal: z.string(),
  revision_count: z.number().int().nonnegative(),
  started_at: z.string().datetime().nullable(),
  finished_at: z.string().datetime().nullable(),
  last_activity_at: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
}).superRefine((value, ctx) => {
  if (value.state !== "draft" && value.session_goal.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "session_goal is required when session state is not draft",
      path: ["session_goal"]
    });
  }

  if (value.state === "completed" && value.finished_at === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "finished_at is required when state is completed",
      path: ["finished_at"]
    });
  }
});

export type Session = z.infer<typeof sessionSchema>;
