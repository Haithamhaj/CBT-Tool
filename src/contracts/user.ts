import { z } from "zod";
import { difficultySchema, userRoleSchema } from "./enums";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: userRoleSchema,
  level: difficultySchema,
  facilitator_id: z.string().uuid().nullable()
});

export type User = z.infer<typeof userSchema>;
