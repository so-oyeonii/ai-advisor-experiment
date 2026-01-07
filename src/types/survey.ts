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
export type ShoppingFrequency = 'less_than_weekly' | '1_2_weekly' | '3_4_weekly' | 'daily';

/**
 * AI usage frequency categories
 */
export type AIUsageFrequency = 'never' | 'less_than_monthly' | 'weekly' | 'daily';

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
 * Q3: Recall Task (8 text inputs)
 */
export interface RecallTaskResponse {
  recall_1: string;
  recall_2: string;
  recall_3: string;
  recall_4: string;
  recall_5: string;
  recall_6: string;
  recall_7: string;
  recall_8: string;
}

/**
 * M2a: Source Credibility - Expertise (5 items, 1-7 scale)
 */
export interface CredibilityExpertiseResponse {
  credibility_expertise_1: number;
  credibility_expertise_2: number;
  credibility_expertise_3: number;
  credibility_expertise_4: number;
  credibility_expertise_5: number;
}

/**
 * M2b: Source Credibility - Trustworthiness (5 items, 1-7 scale)
 */
export interface CredibilityTrustworthinessResponse {
  credibility_trust_1: number;
  credibility_trust_2: number;
  credibility_trust_3: number;
  credibility_trust_4: number;
  credibility_trust_5: number;
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
 * MV5: Mind Perception (8 items, 1-7 scale)
 */
export interface MindPerceptionResponse {
  mind_1: number;
  mind_2: number;
  mind_3: number;
  mind_4: number;
  mind_5: number;
  mind_6: number;
  mind_7: number;
  mind_8: number;
}

/**
 * DV1: Perceived Persuasiveness (4 items, 1-7 scale)
 */
export interface PersuasivenessResponse {
  persuasiveness_1: number;
  persuasiveness_2: number;
  persuasiveness_3: number;
  persuasiveness_4: number;
}

/**
 * DV2: Purchase Intention (4 items, 1-7 scale)
 */
export interface PurchaseIntentionResponse {
  purchase_1: number;
  purchase_2: number;
  purchase_3: number;
  purchase_4: number;
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
 */
export interface BlockAResponse extends
  RecallTaskResponse,
  CredibilityExpertiseResponse,
  CredibilityTrustworthinessResponse,
  PersuasiveIntentResponse,
  MindPerceptionResponse,
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
 * Q7: Attitude Toward AI (4 items, 1-7 scale)
 */
export interface AIAttitudeResponse {
  ai_attitude_1: number;
  ai_attitude_2: number;
  ai_attitude_3: number;
  ai_attitude_4: number;
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
  ReviewSkepticismResponse,
  AIAttitudeResponse,
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
