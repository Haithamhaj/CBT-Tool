export const rubricAnchors = {
  session_structure: {
    low: { min: 0, max: 7 },
    medium: { min: 8, max: 14 },
    high: { min: 15, max: 20 }
  },
  identification_accuracy: {
    low: { min: 0, max: 7 },
    medium: { min: 8, max: 14 },
    high: { min: 15, max: 20 }
  },
  tool_selection: {
    low: { min: 0, max: 5 },
    medium: { min: 6, max: 10 },
    high: { min: 11, max: 15 }
  },
  questioning_quality: {
    low: { min: 0, max: 5 },
    medium: { min: 6, max: 10 },
    high: { min: 11, max: 15 }
  },
  formulation_quality: {
    low: { min: 0, max: 5 },
    medium: { min: 6, max: 10 },
    high: { min: 11, max: 15 }
  },
  summary_and_homework: {
    low: { min: 0, max: 5 },
    medium: { min: 6, max: 10 },
    high: { min: 11, max: 15 }
  }
} as const;
