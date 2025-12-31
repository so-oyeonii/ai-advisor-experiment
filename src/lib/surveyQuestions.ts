// Survey questions for the experiment

export interface SurveyQuestion {
  id: string;
  type: 'likert' | 'text' | 'multiple-choice';
  question: string;
  options?: string[];
  scale?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
  required: boolean;
}

// Trust and credibility questions
export const trustQuestions: SurveyQuestion[] = [
  {
    id: 'trust1',
    type: 'likert',
    question: 'I trust the recommendation provided by the advisor.',
    scale: {
      min: 1,
      max: 7,
      minLabel: 'Strongly Disagree',
      maxLabel: 'Strongly Agree',
    },
    required: true,
  },
  {
    id: 'trust2',
    type: 'likert',
    question: 'The advisor appears to be credible.',
    scale: {
      min: 1,
      max: 7,
      minLabel: 'Strongly Disagree',
      maxLabel: 'Strongly Agree',
    },
    required: true,
  },
  {
    id: 'trust3',
    type: 'likert',
    question: 'I would rely on this advisor for future purchase decisions.',
    scale: {
      min: 1,
      max: 7,
      minLabel: 'Strongly Disagree',
      maxLabel: 'Strongly Agree',
    },
    required: true,
  },
];

// Purchase intention questions
export const purchaseIntentionQuestions: SurveyQuestion[] = [
  {
    id: 'purchase1',
    type: 'likert',
    question: 'How likely are you to purchase this product based on the recommendation?',
    scale: {
      min: 1,
      max: 7,
      minLabel: 'Very Unlikely',
      maxLabel: 'Very Likely',
    },
    required: true,
  },
  {
    id: 'purchase2',
    type: 'likert',
    question: 'The recommendation influenced my opinion of the product.',
    scale: {
      min: 1,
      max: 7,
      minLabel: 'Strongly Disagree',
      maxLabel: 'Strongly Agree',
    },
    required: true,
  },
];

// Perceived expertise questions
export const expertiseQuestions: SurveyQuestion[] = [
  {
    id: 'expertise1',
    type: 'likert',
    question: 'The advisor demonstrated knowledge about the product.',
    scale: {
      min: 1,
      max: 7,
      minLabel: 'Strongly Disagree',
      maxLabel: 'Strongly Agree',
    },
    required: true,
  },
  {
    id: 'expertise2',
    type: 'likert',
    question: 'The reasoning provided was clear and convincing.',
    scale: {
      min: 1,
      max: 7,
      minLabel: 'Strongly Disagree',
      maxLabel: 'Strongly Agree',
    },
    required: true,
  },
];

// Demographics questions
export const demographicsQuestions: SurveyQuestion[] = [
  {
    id: 'age',
    type: 'multiple-choice',
    question: 'What is your age range?',
    options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    required: true,
  },
  {
    id: 'gender',
    type: 'multiple-choice',
    question: 'What is your gender?',
    options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    required: true,
  },
  {
    id: 'education',
    type: 'multiple-choice',
    question: 'What is your highest level of education?',
    options: [
      'High school or less',
      'Some college',
      'Bachelor\'s degree',
      'Master\'s degree',
      'Doctoral degree',
    ],
    required: true,
  },
  {
    id: 'online_shopping',
    type: 'multiple-choice',
    question: 'How often do you shop online?',
    options: [
      'Daily',
      'Several times a week',
      'Weekly',
      'Monthly',
      'Rarely',
      'Never',
    ],
    required: true,
  },
];

// Combine all survey questions for a stimulus
export function getSurveyQuestionsForStimulus(): SurveyQuestion[] {
  return [
    ...trustQuestions,
    ...purchaseIntentionQuestions,
    ...expertiseQuestions,
  ];
}

// Get demographics questions
export function getDemographicsQuestions(): SurveyQuestion[] {
  return demographicsQuestions;
}
