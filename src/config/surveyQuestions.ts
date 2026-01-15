/**
 * Survey Questions Configuration
 * Based on SURVEY_QUESTIONS.md
 * 
 * This file contains all question text, scales, and options used in the survey.
 * Organized by question blocks for easy reference and maintenance.
 */

/**
 * Scale type definitions
 */
export type ScaleType = 
  | 'likert7'           // 1-7 Likert scale
  | 'semantic7'         // 1-7 Semantic differential scale
  | 'categorical'       // Multiple choice
  | 'text'              // Open-ended text
  | 'numeric';          // Numeric input

export interface LikertScaleLabels {
  min: string;
  max: string;
}

export interface QuestionItem {
  variable: string;
  text: string;
  scaleType: ScaleType;
  scaleLabels?: LikertScaleLabels;
  options?: { value: string; label: string }[];
  note?: string;
  warning?: string;
}

export interface QuestionBlock {
  title: string;
  description?: string;
  instruction?: string;
  items: QuestionItem[];
  timeLimit?: number; // in seconds
  warning?: string;
}

/**
 * Block A: Stimulus-Specific Questions (Repeated 3 times)
 */

export const Q3_RecallTask: QuestionBlock = {
  title: 'Your Thoughts',
  instruction: 'What do you think of the reviews you just saw on this product page?',
  timeLimit: 90,
  items: [
    { variable: 'thoughts_text', text: 'Your thoughts:', scaleType: 'text' }
  ]
};

export const MV_ReviewHelpfulness: QuestionBlock = {
  title: 'Review Helpfulness',
  description: 'The following questions ask about the helpfulness of the expert review you just read.\n\nPlease indicate how helpful the expert\'s review was in understanding and evaluating the product.\n(1 = Strongly Disagree, 7 = Strongly Agree)',
  items: [
    {
      variable: 'review_helpfulness_1',
      text: "This expert's review is helpful for me to evaluate the product.",
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'review_helpfulness_2',
      text: "This expert's review is helpful in familiarizing me with the product.",
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'review_helpfulness_3',
      text: "This expert's review is helpful for me to understand the performance of the product.",
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    }
  ]
};

export const MV_PerceivedError: QuestionBlock = {
  title: 'Perceived Error',
  description: 'Please indicate the extent to which you agree with the following statement about the expert\'s review you just read.\n(1 = Strongly Disagree, 7 = Strongly Agree)',
  items: [
    {
      variable: 'perceived_error',
      text: "I felt that there was an error in this expert's review.",
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    }
  ]
};

export const M2a_MessageCredibility: QuestionBlock = {
  title: 'Message Credibility',
  description: 'How well do the following adjectives describe the expert\'s review you just read?\n(1 = describes very poorly, 7 = describes very well)',
  items: [
    {
      variable: 'message_credibility_1',
      text: 'Accurate',
      scaleType: 'likert7',
      scaleLabels: { min: 'Describes very poorly', max: 'Describes very well' }
    },
    {
      variable: 'message_credibility_2',
      text: 'Authentic',
      scaleType: 'likert7',
      scaleLabels: { min: 'Describes very poorly', max: 'Describes very well' }
    },
    {
      variable: 'message_credibility_3',
      text: 'Believable',
      scaleType: 'likert7',
      scaleLabels: { min: 'Describes very poorly', max: 'Describes very well' }
    }
  ]
};

export const M2b_Trust: QuestionBlock = {
  title: 'Trust',
  description: 'Please rate your agreement with the following statements about the expert reviewer you just saw.\n(1 = Not at all, 7 = Extremely)',
  items: [
    {
      variable: 'trust_1',
      text: 'I am confident in this expert reviewer.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Not at all', max: 'Extremely' }
    },
    {
      variable: 'trust_2',
      text: 'This expert reviewer is reliable.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Not at all', max: 'Extremely' }
    },
    {
      variable: 'trust_3',
      text: 'I can trust this expert reviewer.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Not at all', max: 'Extremely' }
    }
  ]
};

export const M3_PersuasiveIntent: QuestionBlock = {
  title: 'Perceived Persuasive Intent',
  description: 'Please indicate your agreement with each statement:\n(1 = Strongly Disagree, 7 = Strongly Agree)',
  items: [
    {
      variable: 'ppi_1',
      text: 'This expert reviewer was primarily trying to persuade me either to buy or not to buy the product.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'ppi_2',
      text: 'This expert reviewer had an ulterior motive for the review.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'ppi_3',
      text: "This expert reviewer's statements seem suspicious.",
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'ppi_4',
      text: 'This expert reviewer was trying to manipulate my opinion.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'ppi_5',
      text: "This expert reviewer may have exaggerated the product's performance.",
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    }
  ]
};

export const DV1_Persuasiveness: QuestionBlock = {
  title: 'Perceived Persuasiveness',
  description: 'Please indicate how persuasive you found the expert\'s review.\n(1 = Strongly Disagree, 7 = Strongly Agree)',
  items: [
    {
      variable: 'persuasiveness_1',
      text: "I was convinced by the expert's review.",
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'persuasiveness_2',
      text: "The expert's review influenced me.",
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    }
  ]
};

export const DV2_PurchaseIntention: QuestionBlock = {
  title: 'Purchase Intention',
  description: 'The following questions ask about your purchase intention regarding the product shown on the previous page.\n(1 = Strongly Disagree, 7 = Strongly Agree)',
  items: [
    {
      variable: 'purchase_1',
      text: 'I would purchase this product.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'purchase_2',
      text: 'I would consider buying this product.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    }
  ]
};

export const DV3_DecisionConfidence: QuestionBlock = {
  title: 'Decision Confidence',
  description: 'How confident are you in the judgment you made based on the expert\'s review?\nPlease indicate your level of confidence in your evaluation of the product after reading the expert\'s review.\n(1 = Not at all confident, 7 = Very confident)',
  items: [
    {
      variable: 'confidence',
      text: 'Confidence level',
      scaleType: 'semantic7',
      scaleLabels: { min: 'Not at all confident', max: 'Very confident' }
    }
  ]
};

/**
 * General Questions (Asked once, values replicated across all 3 rows)
 */

export const Q7_AIFamiliarity: QuestionBlock = {
  title: 'AI Familiarity',
  description: 'Thinking about your general experience with AI technology, please indicate your level of agreement:\n(1 = Strongly Disagree, 7 = Strongly Agree)',
  items: [
    {
      variable: 'ai_familiarity_1',
      text: 'I am familiar with how conversational AI systems (e.g., chatbots, voice assistants) work.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'ai_familiarity_2',
      text: 'I regularly use AI-based conversational agents such as ChatGPT, Siri, or Alexa.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'ai_familiarity_3',
      text: 'I have a clear understanding of the capabilities and limitations of conversational AI.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    }
  ]
};

export const Q7_ReviewSkepticism: QuestionBlock = {
  title: 'Review Skepticism',
  description: 'In general, when you read online product reviews, how much do you agree with the following statements?\n(1 = Strongly Disagree, 7 = Strongly Agree)',
  items: [
    {
      variable: 'review_skepticism_1',
      text: 'Online product reviews are generally not truthful.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'review_skepticism_2',
      text: 'Those writing product reviews are not necessarily the real customers.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'review_skepticism_3',
      text: 'Online product reviews are often inaccurate.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'review_skepticism_4',
      text: 'The same person often posts reviews under different names.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    }
  ]
};

export const Q7_MachineHeuristic: QuestionBlock = {
  title: 'Machine Heuristic',
  description: 'Below are statements about artificial intelligence (AI).\nPlease indicate your agreement based on your general beliefs about AI.\n(1 = Strongly Disagree, 7 = Strongly Agree)',
  items: [
    {
      variable: 'machine_heuristic_1',
      text: 'When AI performs a task, the results are more objective than when humans perform the same task.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'machine_heuristic_2',
      text: 'AI can handle tasks in a more secure and reliable manner than humans.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'machine_heuristic_3',
      text: 'AI has high precision, so it performs tasks more accurately than humans.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    {
      variable: 'machine_heuristic_4',
      text: 'AI is less likely to make errors caused by emotions or biases.',
      scaleType: 'likert7',
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    }
  ]
};

export const Q8_UsageHabits: QuestionBlock = {
  title: 'Usage Behavior',
  description: 'Please tell us about your general shopping and technology usage habits:',
  items: [
    {
      variable: 'shopping_frequency',
      text: 'How often do you shop online?',
      scaleType: 'categorical',
      options: [
        { value: 'more_than_weekly', label: 'More than once a week' },
        { value: 'weekly_to_monthly', label: 'Once a week to once a month' },
        { value: 'monthly_to_6months', label: 'Once a month to once every 6 months' },
        { value: 'less_than_6months', label: 'Less than once every 6 months' }
      ]
    },
    {
      variable: 'ai_usage_frequency',
      text: 'How often do you use generative AI (e.g., ChatGPT)?',
      scaleType: 'categorical',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'less_than_monthly', label: 'Less than once a month' },
        { value: '1_3_monthly', label: '1–3 times a month' },
        { value: '1_3_weekly', label: '1–3 times a week' },
        { value: 'daily', label: 'Daily or almost daily' }
      ]
    }
  ]
};

/**
 * Demographics (Asked once, values replicated across all 3 rows)
 */

export const Demographics: QuestionBlock = {
  title: 'Demographics',
  items: [
    {
      variable: 'gender',
      text: 'What is your gender?',
      scaleType: 'categorical',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other (please specify)' },
        { value: 'prefer_not', label: 'Prefer not to answer' }
      ]
    },
    {
      variable: 'gender_other',
      text: 'If you selected "Other", please specify:',
      scaleType: 'text',
      note: 'Only required if "Other" was selected for gender'
    },
    {
      variable: 'age',
      text: 'What is your age? (in full years)',
      scaleType: 'numeric'
    },
    {
      variable: 'education',
      text: 'What is your highest level of education completed?',
      scaleType: 'categorical',
      options: [
        { value: 'high_school', label: 'High school or below' },
        { value: 'undergrad_current', label: 'Currently enrolled in an undergraduate program' },
        { value: 'bachelors', label: "Bachelor's degree completed" },
        { value: 'grad_current', label: 'Currently enrolled in a graduate program' },
        { value: 'graduate', label: 'Graduate degree or higher' }
      ]
    },
    {
      variable: 'income',
      text: 'What is your individual annual income?',
      scaleType: 'categorical',
      options: [
        { value: 'under_10k', label: 'Less than $10,000' },
        { value: '10k_20k', label: '$10,000 – $19,999' },
        { value: '20k_30k', label: '$20,000 – $29,999' },
        { value: '30k_50k', label: '$30,000 – $49,999' },
        { value: '50k_75k', label: '$50,000 – $74,999' },
        { value: '75k_100k', label: '$75,000 – $99,999' },
        { value: 'over_100k', label: '$100,000 or more' },
        { value: 'prefer_not', label: 'Prefer not to say' }
      ]
    },
    {
      variable: 'occupation',
      text: 'What is your current occupation?',
      scaleType: 'categorical',
      options: [
        { value: 'office_worker', label: 'Office worker' },
        { value: 'self_employed', label: 'Self-employed' },
        { value: 'government', label: 'Government employee' },
        { value: 'professional', label: 'Professional (e.g., doctor, lawyer)' },
        { value: 'student', label: 'Student' },
        { value: 'unemployed', label: 'Unemployed' },
        { value: 'freelancer', label: 'Freelancer' },
        { value: 'other', label: 'Other (please specify)' }
      ]
    },
    {
      variable: 'occupation_other',
      text: 'If you selected "Other", please specify:',
      scaleType: 'text',
      note: 'Only required if "Other" was selected for occupation'
    }
  ]
};

/**
 * Organized export of all question blocks
 */
export const SURVEY_QUESTIONS = {
  // Block A: Stimulus-Specific (Repeated 3 times)
  // Order: Your Thoughts → Review Helpfulness → Perceived Error → Message Credibility → Trust → PPI → Persuasiveness → Purchase → Confidence
  blockA: {
    Q3_RecallTask,
    MV_ReviewHelpfulness,
    MV_PerceivedError,
    M2a_MessageCredibility,
    M2b_Trust,
    M3_PersuasiveIntent,
    DV1_Persuasiveness,
    DV2_PurchaseIntention,
    DV3_DecisionConfidence
  },

  // General Questions (Asked once)
  general: {
    Q7_AIFamiliarity,
    Q7_MachineHeuristic,
    Q7_ReviewSkepticism,
    Q8_UsageHabits
  },

  // Demographics (Asked once)
  demographics: Demographics
};

export default SURVEY_QUESTIONS;
