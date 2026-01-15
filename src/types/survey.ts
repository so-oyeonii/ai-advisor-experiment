/**
 * TypeScript Type Definitions for Survey Responses
 * Based on DATABASE_SCHEMA.md
 */

/**
 * Experimental condition group assignment (c1-c8)
 * Determines the sequence of advisor types and congruity across 3 stimuli
 */
export type ConditionGroup = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8';

/**
 * Product type shown in stimulus
 */
export type Product = 'protein' | 'toilet' | 'soap';

/**
 * Type of advisor presenting the featured review
 */
export type AdvisorType = 'ai' | 'expert';

/**
 * Opinion congruity between featured review and customer reviews
 */
export type Congruity = 'match' | 'nonmatch';

/**
 * Valence of the featured review
 */
export type ReviewValence = 'positive' | 'negative';

/**
 * Shopping frequency categories
 */
export type ShoppingFrequency = 'more_than_weekly' | 'weekly_to_monthly' | 'monthly_to_6months' | 'less_than_6months';

/**
 * AI usage frequency categories
 */
export type AIUsageFrequency = 'never' | 'less_than_monthly' | '1_3_monthly' | '1_3_weekly' | 'daily';

/**
 * Gender categories
 */
export type Gender = 'male' | 'female' | 'other' | 'prefer_not';

/**
 * Education level categories
 */
export type Education = 'high_school' | 'undergrad_current' | 'bachelors' | 'grad_current' | 'graduate';

/**
 * Income categories
 */
export type Income = 'under_10k' | '10k_20k' | '20k_30k' | '30k_50k' | '50k_75k' | '75k_100k' | 'over_100k' | 'prefer_not';

/**
 * Occupation categories
 */
export type Occupation = 'office_worker' | 'self_employed' | 'government' | 'professional' | 'student' | 'unemployed' | 'freelancer' | 'other';

/**
 * Response to manipulation check: advisor type
 */
export type ManipAdvisorType = 'ai' | 'human' | 'unsure';

/**
 * Response to manipulation check: review valence
 */
export type ManipReviewValence = 'positive' | 'negative' | 'neutral';

/**
 * Response to attention check: congruity
 */
export type AttentionCongruity = 'similar' | 'different' | 'unsure';

/**
 * Response to attention check: product recognition
 */
export type AttentionProduct = 'protein' | 'toilet' | 'soap' | 'unsure';

/**
 * Experimental condition details for a single stimulus
 */
export interface ExperimentalCondition {
  condition_group: ConditionGroup;
  product: Product;
  advisor_type: AdvisorType;
  congruity: Congruity;
  review_valence: ReviewValence;
}

/**
 * Q3: Recall Task (Your Thoughts - single text area)
 */
export interface RecallTaskResponse {
  recalled_words: string[];
  word_count: number;
  recall_combined_text: string;
  recall_time_seconds: number;
}

/**
 * MV: Review Helpfulness (3 items, 1-7 scale)
 */
export interface ReviewHelpfulnessResponse {
  review_helpfulness_1: number;
  review_helpfulness_2: number;
  review_helpfulness_3: number;
}

/**
 * MV: Perceived Error (1 item, 1-7 scale)
 */
export interface PerceivedErrorResponse {
  perceived_error: number;
}

/**
 * M2a: Message Credibility (3 items, 1-7 scale)
 */
export interface MessageCredibilityResponse {
  message_credibility_1: number;
  message_credibility_2: number;
  message_credibility_3: number;
}

/**
 * M2b: Trust (3 items, 1-7 scale)
 */
export interface TrustResponse {
  trust_1: number;
  trust_2: number;
  trust_3: number;
}

/**
 * M3: Perceived Persuasive Intent (5 items, 1-7 scale)
 */
export interface PersuasiveIntentResponse {
  ppi_1: number;
  ppi_2: number;
  ppi_3: number;
  ppi_4: number;
  ppi_5: number;
}

/**
 * DV1: Perceived Persuasiveness (2 items, 1-7 scale)
 */
export interface PersuasivenessResponse {
  persuasiveness_1: number;
  persuasiveness_2: number;
}

/**
 * DV2: Purchase Intention (2 items, 1-7 scale)
 */
export interface PurchaseIntentionResponse {
  purchase_1: number;
  purchase_2: number;
}

/**
 * DV3: Decision Confidence (1 item, 1-7 scale)
 */
export interface DecisionConfidenceResponse {
  confidence: number;
}

/**
 * Block A: All stimulus-specific survey responses
 * (Repeated for each of the 3 stimuli)
 * Order: Your Thoughts → Review Helpfulness → Perceived Error → Message Credibility → Trust → PPI → Persuasiveness → Purchase → Confidence
 */
export interface BlockAResponse extends
  RecallTaskResponse,
  ReviewHelpfulnessResponse,
  PerceivedErrorResponse,
  MessageCredibilityResponse,
  TrustResponse,
  PersuasiveIntentResponse,
  PersuasivenessResponse,
  PurchaseIntentionResponse,
  DecisionConfidenceResponse {}

/**
 * Q7: AI Familiarity (3 items, 1-7 scale)
 */
export interface AIFamiliarityResponse {
  ai_familiarity_1: number;
  ai_familiarity_2: number;
  ai_familiarity_3: number;
}

/**
 * Q7: Review Skepticism (4 items, 1-7 scale)
 */
export interface ReviewSkepticismResponse {
  review_skepticism_1: number;
  review_skepticism_2: number;
  review_skepticism_3: number;
  review_skepticism_4: number;
}

/**
 * Q7: Machine Heuristic (4 items, 1-7 scale)
 */
export interface MachineHeuristicResponse {
  machine_heuristic_1: number;
  machine_heuristic_2: number;
  machine_heuristic_3: number;
  machine_heuristic_4: number;
}

/**
 * Q8: Shopping and AI Usage Habits (2 items, categorical)
 */
export interface UsageHabitsResponse {
  shopping_frequency: ShoppingFrequency;
  ai_usage_frequency: AIUsageFrequency;
}

/**
 * General Questions: Asked once and replicated across all 3 rows
 * (Same values for all stimuli from the same participant)
 */
export interface GeneralQuestionsResponse extends
  AIFamiliarityResponse,
  MachineHeuristicResponse,
  ReviewSkepticismResponse,
  UsageHabitsResponse {}

/**
 * Demographics: Asked once and replicated across all 3 rows
 * (Same values for all stimuli from the same participant)
 */
export interface DemographicsResponse {
  gender: Gender;
  gender_other?: string;
  age: number;
  education: Education;
  income: Income;
  occupation: Occupation;
  occupation_other?: string;
}

/**
 * Complete survey response for ONE stimulus
 * (Each participant creates 3 of these - one per stimulus)
 */
export interface SurveyResponse extends
  ExperimentalCondition,
  BlockAResponse,
  GeneralQuestionsResponse,
  DemographicsResponse {
  // Primary identifiers
  participant_id: string;
  stimulus_order: number; // 1, 2, or 3
  timestamp: Date;
  
  // Behavioral measure
  page_dwell_time: number; // in seconds
}

/**
 * Partial response object for in-progress surveys
 */
export type PartialSurveyResponse = Partial<SurveyResponse>;

/**
 * Firestore document ID format: {participant_id}_{stimulus_order}
 * Example: "P001_1", "P001_2", "P001_3"
 */
export type SurveyDocumentId = `${string}_${1 | 2 | 3}`;
