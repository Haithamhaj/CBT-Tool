import { z } from "zod";
import {
  detectionModeSchema,
  driftSeveritySchema,
  driftStatusSchema
} from "./enums";

export const driftEventSchema = z.object({
  id: z.string().min(1),
  session_id: z.string().min(1),
  attempt_id: z.string().min(1),
  drift_id: z.string().regex(/^DR\d{3}$/),
  name: z.string().min(1),
  description: z.string().min(1),
  detection_mode: detectionModeSchema,
  severity: driftSeveritySchema,
  status: driftStatusSchema,
  message: z.string().min(1),
  corrective_action: z.string().min(1),
  created_at: z.string().datetime(),
  corrected_at: z.string().datetime().nullable()
}).superRefine((value, ctx) => {
  if (value.status === "corrected" && value.corrected_at === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "corrected_at is required when status is corrected",
      path: ["corrected_at"]
    });
  }
});

export type DriftEvent = z.infer<typeof driftEventSchema>;
