import cases from "../../../data/seeds/cases.json";
import users from "../../../data/seeds/users.json";
import { caseSchema, difficultySchema, trainingStageSchema, userRoleSchema } from "../../contracts";
import { getStageToolEntry } from "../config/stage-tool-matrix";

type SeedUser = {
  id: string;
  email: string;
  name: string;
  role: "trainee" | "facilitator";
  level: "beginner" | "intermediate" | "advanced";
  facilitator_id: string | null;
};

function parseSeedUser(user: unknown): SeedUser {
  const value = user as Record<string, unknown>;

  if (
    typeof value?.id !== "string" ||
    typeof value.email !== "string" ||
    typeof value.name !== "string"
  ) {
    throw new Error("Invalid user seed shape");
  }

  return {
    id: value.id,
    email: value.email,
    name: value.name,
    role: userRoleSchema.parse(value.role),
    level: difficultySchema.parse(value.level),
    facilitator_id:
      typeof value.facilitator_id === "string" || value.facilitator_id === null
        ? value.facilitator_id
        : (() => {
            throw new Error("Invalid facilitator_id");
          })()
  };
}

export function validateSeedCases() {
  const parsedCases = cases.map((caseRecord) => caseSchema.parse(caseRecord));

  for (const caseRecord of parsedCases) {
    for (const stage of caseRecord.stage_suitability) {
      trainingStageSchema.parse(stage);
      const mappedTools = caseRecord.recommended_tools.filter((tool) => {
        const entry = getStageToolEntry(stage, tool);
        return entry.status === "recommended" || entry.status === "allowed";
      });

      if (mappedTools.length === 0) {
        throw new Error(`Case ${caseRecord.id} has no valid recommended tool for stage ${stage}`);
      }
    }
  }

  return parsedCases;
}

export function validateSeedUsers() {
  return users.map((user) => parseSeedUser(user));
}
