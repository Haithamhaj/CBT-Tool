import type { DriftEvent, RubricScores, ScoreOutput } from "../../contracts";
import { driftTaxonomy } from "../config/drift-taxonomy";

const penaltyBySeverity = {
  minor: 2,
  moderate: 5,
  major: 10
} as const;

const minimumSubscores: Partial<Record<keyof RubricScores, number>> = {
  session_structure: 12,
  identification_accuracy: 12,
  tool_selection: 8,
  summary_and_homework: 8
};

const priorityOrder: (keyof RubricScores)[] = [
  "session_structure",
  "identification_accuracy",
  "tool_selection",
  "questioning_quality",
  "formulation_quality",
  "summary_and_homework"
];

export function calculateRawScore(rubricScores: RubricScores): number {
  return Object.values(rubricScores).reduce((sum, score) => sum + score, 0);
}

function hasBlockingDrift(drifts: DriftEvent[]): boolean {
  return drifts.some((drift) => drift.status === "open" && driftTaxonomy[drift.drift_id]?.blocking);
}

function countCategoryConfusion(drifts: DriftEvent[]): number {
  return drifts.filter((drift) => drift.drift_id === "DR003").length;
}

function buildPenaltyEntries(drifts: DriftEvent[]): ScoreOutput["drift_penalties"] {
  const occurrences = new Map<string, number>();

  return drifts.map((drift) => {
    const count = (occurrences.get(drift.drift_id) ?? 0) + 1;
    occurrences.set(drift.drift_id, count);

    const base = penaltyBySeverity[drift.severity];
    const escalation = count === 1 ? 0 : count === 2 ? 1 : 2;

    return {
      drift_id: drift.drift_id,
      severity: drift.severity,
      penalty_points: base + escalation,
      repeated: count > 1
    };
  });
}

function weakestCategory(rubricScores: RubricScores): keyof RubricScores {
  return priorityOrder.reduce((weakest, current) => {
    if (rubricScores[current] < rubricScores[weakest]) {
      return current;
    }
    return weakest;
  }, priorityOrder[0]);
}

function choosePrioritySkill(rubricScores: RubricScores): string {
  for (const category of priorityOrder) {
    const minimum = minimumSubscores[category];
    if (minimum !== undefined && rubricScores[category] < minimum) {
      return category;
    }
  }

  return weakestCategory(rubricScores);
}

function recommendNextPracticeArea(prioritySkill: string): string {
  switch (prioritySkill) {
    case "session_structure":
      return "Practice agenda setting, transitions, summary, and homework closure.";
    case "identification_accuracy":
      return "Practice distinguishing situation, thought, emotion, and behavior.";
    case "tool_selection":
      return "Practice matching the tool to the training stage and case goal.";
    case "questioning_quality":
      return "Practice guided discovery instead of direct advice.";
    case "formulation_quality":
      return "Practice building evidence-based formulations from case details.";
    case "summary_and_homework":
      return "Practice concise summaries and tightly linked homework.";
    default:
      return "Repeat a guided case at the same stage with targeted revision.";
  }
}

function determineOutcome(
  adjustedScore: number,
  rubricScores: RubricScores,
  drifts: DriftEvent[]
): ScoreOutput["outcome"] {
  const blockingOpen = hasBlockingDrift(drifts);
  const failedMinimum = Object.entries(minimumSubscores).some(([key, minimum]) => {
    const score = rubricScores[key as keyof RubricScores];
    return minimum !== undefined && score < minimum;
  });

  if (blockingOpen || failedMinimum || adjustedScore < 70) {
    return adjustedScore < 60 ? "fail" : "needs_revision";
  }

  if (adjustedScore >= 85) {
    return "strong_pass";
  }

  return "pass";
}

function buildTopIssues(prioritySkill: string, drifts: DriftEvent[], rubricScores: RubricScores): string[] {
  const issues: string[] = [];
  const blocking = drifts.find((drift) => drift.status === "open" && driftTaxonomy[drift.drift_id]?.blocking);

  if (blocking) {
    issues.push(`${blocking.drift_id}: ${blocking.message}`);
  }

  const byPenaltyWeight = [...drifts]
    .sort((left, right) => penaltyBySeverity[right.severity] - penaltyBySeverity[left.severity])
    .map((drift) => `${drift.drift_id}: ${drift.message}`);

  for (const issue of byPenaltyWeight) {
    if (!issues.includes(issue)) {
      issues.push(issue);
    }
    if (issues.length === 2) {
      break;
    }
  }

  if (issues.length < 3) {
    issues.push(`Lowest rubric area: ${prioritySkill} (${rubricScores[prioritySkill as keyof RubricScores]})`);
  }

  return issues.slice(0, 3);
}

export function calculateScore(input: {
  rubricScores: RubricScores;
  driftEvents: DriftEvent[];
}): ScoreOutput {
  const rawScore = calculateRawScore(input.rubricScores);
  const driftPenalties = buildPenaltyEntries(input.driftEvents);
  const totalPenalty = driftPenalties.reduce((sum, entry) => sum + entry.penalty_points, 0);
  let adjustedScore = Math.max(0, rawScore - totalPenalty);

  if (hasBlockingDrift(input.driftEvents)) {
    adjustedScore = Math.min(adjustedScore, 59);
  }

  const prioritySkill = choosePrioritySkill(input.rubricScores);
  const outcome = determineOutcome(adjustedScore, input.rubricScores, input.driftEvents);
  const topIssues = buildTopIssues(prioritySkill, input.driftEvents, input.rubricScores);

  if (countCategoryConfusion(input.driftEvents) >= 2 && outcome === "pass") {
    return {
      raw_score: rawScore,
      adjusted_score: adjustedScore,
      outcome: "needs_revision",
      rubric_scores: input.rubricScores,
      drift_penalties: driftPenalties,
      drift_count: input.driftEvents.length,
      top_issues: topIssues,
      priority_skill: prioritySkill,
      recommended_next_practice_area: recommendNextPracticeArea(prioritySkill)
    };
  }

  return {
    raw_score: rawScore,
    adjusted_score: adjustedScore,
    outcome,
    rubric_scores: input.rubricScores,
    drift_penalties: driftPenalties,
    drift_count: input.driftEvents.length,
    top_issues: topIssues,
    priority_skill: prioritySkill,
    recommended_next_practice_area: recommendNextPracticeArea(prioritySkill)
  };
}
