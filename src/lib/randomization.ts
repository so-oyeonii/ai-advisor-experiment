// Randomization logic for experimental conditions
// 4 groups x 2 conditions = 8 conditions, select 3 groups per participant
// 240 participants -> 720 stimuli -> 180 per group, 90 per condition

import { ProductKey } from './stimuliData';

export type AdvisorType = 'AI' | 'Human';
export type Congruity = 'Congruent' | 'Incongruent';
export type AdvisorValence = 'positive' | 'negative';
export type PublicValence = 'positive' | 'negative';

/**
 * Group 1 (AI + Congruent): condition 1, 2
 * Group 2 (AI + Incongruent): condition 3, 4
 * Group 3 (Human + Congruent): condition 5, 6
 * Group 4 (Human + Incongruent): condition 7, 8
 */
export interface StimulusCondition {
  conditionId: number;
  groupId: number;
  advisorType: AdvisorType;
  congruity: Congruity;
  advisorValence: AdvisorValence;
  publicValence: PublicValence;
}

export interface SelectedStimulus {
  product: ProductKey;
  condition: StimulusCondition;
}

export interface ExperimentCondition {
  participantId: string;
  selectedStimuli: SelectedStimulus[];
}

// 8 conditions in 4 groups
const EIGHT_CONDITIONS: StimulusCondition[] = [
  // Group 1: AI + Congruent
  { conditionId: 1, groupId: 1, advisorType: 'AI', congruity: 'Congruent', advisorValence: 'positive', publicValence: 'negative' },
  { conditionId: 2, groupId: 1, advisorType: 'AI', congruity: 'Congruent', advisorValence: 'negative', publicValence: 'positive' },
  
  // Group 2: AI + Incongruent
  { conditionId: 3, groupId: 2, advisorType: 'AI', congruity: 'Incongruent', advisorValence: 'positive', publicValence: 'positive' },
  { conditionId: 4, groupId: 2, advisorType: 'AI', congruity: 'Incongruent', advisorValence: 'negative', publicValence: 'negative' },
  
  // Group 3: Human + Congruent
  { conditionId: 5, groupId: 3, advisorType: 'Human', congruity: 'Congruent', advisorValence: 'positive', publicValence: 'negative' },
  { conditionId: 6, groupId: 3, advisorType: 'Human', congruity: 'Congruent', advisorValence: 'negative', publicValence: 'positive' },
  
  // Group 4: Human + Incongruent
  { conditionId: 7, groupId: 4, advisorType: 'Human', congruity: 'Incongruent', advisorValence: 'positive', publicValence: 'positive' },
  { conditionId: 8, groupId: 4, advisorType: 'Human', congruity: 'Incongruent', advisorValence: 'negative', publicValence: 'negative' },
];

// 3 products
const ALL_PRODUCTS: ProductKey[] = ['protein', 'tissue', 'soap'];

type GroupSelection = [number, number, number];
type ConditionSelection = [number, number, number];

// 4C3 = 4 group combinations
const BASE_GROUP_COMBINATIONS: GroupSelection[] = [
  [1, 2, 3], // AI-Congruent, AI-Incongruent, Human-Congruent
  [1, 2, 4], // AI-Congruent, AI-Incongruent, Human-Incongruent
  [1, 3, 4], // AI-Congruent, Human-Congruent, Human-Incongruent
  [2, 3, 4], // AI-Incongruent, Human-Congruent, Human-Incongruent
];

// For 240 participants with perfect balance:
// Each of 4 combinations appears 60 times
// Each group appears in 3 combinations: 3 * 60 = 180 per group ✓
// Each condition: 180 / 2 = 90 per condition ✓

// 2^3 = 8 condition selection patterns
const ALL_CONDITION_PATTERNS: ConditionSelection[] = [
  [0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1],
  [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1],
];

// 3! = 6 product orders
const ALL_PRODUCT_ORDERS: ProductKey[][] = [
  ['protein', 'tissue', 'soap'],
  ['protein', 'soap', 'tissue'],
  ['tissue', 'protein', 'soap'],
  ['tissue', 'soap', 'protein'],
  ['soap', 'protein', 'tissue'],
  ['soap', 'tissue', 'protein'],
];

interface AssignmentPattern {
  groupSelection: GroupSelection;
  conditionPattern: ConditionSelection;
  productOrder: ProductKey[];
}

// Generate exactly 240 patterns for perfect counterbalancing
// Strategy: Ensure each condition appears exactly 90 times
// Each condition must appear in 90 / 3 groups = 30 times per group combination it's in
const ALL_ASSIGNMENT_PATTERNS: AssignmentPattern[] = [];

// Build patterns systematically to ensure perfect balance
// Each group appears in exactly 3 of 4 combinations
// For each combination, we need 60 patterns
// In those 60 patterns, each of the 3 groups must select each of its 2 conditions 30 times

for (let combIdx = 0; combIdx < BASE_GROUP_COMBINATIONS.length; combIdx++) {
  const groupSelection = BASE_GROUP_COMBINATIONS[combIdx];
  
  // Generate 60 patterns for this combination
  // Pattern: cycle through all 8 condition patterns, but adjust to get 30:30 split for each group
  for (let i = 0; i < 60; i++) {
    // Ensure each position gets 30:30 split across the 60 patterns
    const conditionPattern: ConditionSelection = [
      i < 30 ? 0 : 1,  // Position 0: first 30 use cond 0, next 30 use cond 1
      Math.floor(i / 15) % 2,  // Position 1: alternates every 15
      Math.floor(i / 10) % 2   // Position 2: alternates every 10
    ];
    
    const productOrder = ALL_PRODUCT_ORDERS[i % 6];
    
    ALL_ASSIGNMENT_PATTERNS.push({
      groupSelection,
      conditionPattern,
      productOrder
    });
  }
}

/**
 * Assign participant to condition with perfect counterbalancing
 * Selects 3 groups from 4 groups, and 1 condition from each group
 * For 240 participants: exactly 180 per group, 90 per condition
 */
export function assignParticipantCondition(participantId: string): ExperimentCondition {
  const numericMatch = participantId.match(/\d+/);
  const participantNumber = numericMatch ? parseInt(numericMatch[0]) : Date.now();
  
  // Use 240 patterns for perfect counterbalancing
  const patternIndex = participantNumber % 240;
  const pattern = ALL_ASSIGNMENT_PATTERNS[patternIndex];
  
  // Select conditions from chosen groups
  const selectedConditions: StimulusCondition[] = [];
  
  for (let i = 0; i < 3; i++) {
    const groupId = pattern.groupSelection[i];
    const conditionIndex = pattern.conditionPattern[i]; // 0 or 1
    
    const groupConditions = EIGHT_CONDITIONS.filter(c => c.groupId === groupId);
    const selectedCondition = groupConditions[conditionIndex];
    
    selectedConditions.push(selectedCondition);
  }
  
  // Map products to conditions
  const selectedStimuli: SelectedStimulus[] = pattern.productOrder.map((product, index) => ({
    product,
    condition: selectedConditions[index]
  }));
  
  return {
    participantId,
    selectedStimuli
  };
}

/**
 * Get all 8 conditions
 */
export function getAllConditions(): StimulusCondition[] {
  return [...EIGHT_CONDITIONS];
}

/**
 * Get condition by ID
 */
export function getConditionById(conditionId: number): StimulusCondition | undefined {
  return EIGHT_CONDITIONS.find(c => c.conditionId === conditionId);
}

/**
 * Get conditions by group ID
 */
export function getConditionsByGroup(groupId: number): StimulusCondition[] {
  return EIGHT_CONDITIONS.filter(c => c.groupId === groupId);
}

/**
 * Get condition label for display
 */
export function getConditionLabel(conditionId: number, product?: ProductKey): string {
  const condition = getConditionById(conditionId);
  if (!condition) return `Unknown Condition ${conditionId}`;
  
  const productLabel = product ? ` - ${product}` : '';
  return `C${conditionId} (G${condition.groupId}: ${condition.advisorType}/${condition.congruity}/${condition.advisorValence})${productLabel}`;
}

/**
 * Validate condition setup
 */
export function validateConditions(): boolean {
  try {
    if (EIGHT_CONDITIONS.length !== 8) {
      console.error(`Expected 8 conditions, found ${EIGHT_CONDITIONS.length}`);
      return false;
    }
    
    // Check each group has 2 conditions
    for (let groupId = 1; groupId <= 4; groupId++) {
      const groupConditions = EIGHT_CONDITIONS.filter(c => c.groupId === groupId);
      if (groupConditions.length !== 2) {
        console.error(`Group ${groupId} should have 2 conditions, found ${groupConditions.length}`);
        return false;
      }
    }
    
    const aiConditions = EIGHT_CONDITIONS.filter(c => c.advisorType === 'AI');
    const humanConditions = EIGHT_CONDITIONS.filter(c => c.advisorType === 'Human');
    
    if (aiConditions.length !== 4 || humanConditions.length !== 4) {
      console.error(`Expected 4 AI and 4 Human conditions`);
      return false;
    }
    
    const congruentConditions = EIGHT_CONDITIONS.filter(c => c.congruity === 'Congruent');
    const incongruentConditions = EIGHT_CONDITIONS.filter(c => c.congruity === 'Incongruent');
    
    if (congruentConditions.length !== 4 || incongruentConditions.length !== 4) {
      console.error(`Expected 4 Congruent and 4 Incongruent conditions`);
      return false;
    }
    
    if (ALL_PRODUCTS.length !== 3) {
      console.error(`Expected 3 products`);
      return false;
    }
    
    if (BASE_GROUP_COMBINATIONS.length !== 4) {
      console.error(`Expected 4 base group combinations`);
      return false;
    }
    
    if (ALL_ASSIGNMENT_PATTERNS.length !== 240) {
      console.error(`Expected 240 assignment patterns, found ${ALL_ASSIGNMENT_PATTERNS.length}`);
      return false;
    }
    
    console.log('✓ All condition validation checks passed');
    console.log(`  - 8 conditions defined in 4 groups (2 per group)`);
    console.log(`  - 4 AI conditions, 4 Human conditions`);
    console.log(`  - 4 Congruent conditions, 4 Incongruent conditions`);
    console.log(`  - 3 products available`);
    console.log(`  - 4 group combinations (4C3)`);
    console.log(`  - 240 assignment patterns (4 x 60) for perfect counterbalancing`);
    console.log(`  - For 240 participants: 180 per group (25%), 90 per condition (12.5%)`);
    console.log(`  - Each participant selects 3 groups from 4 groups`);
    console.log(`  - Each group provides 1 condition (from 2 available)`);
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

/**
 * Test randomization distribution
 */
export function testRandomization(numParticipants: number = 240): {
  conditionCounts: Record<number, number>;
  groupCounts: Record<number, number>;
  summary: {
    byAdvisorType: Record<AdvisorType, number>;
    byCongruity: Record<Congruity, number>;
    byConditionId: Record<number, number>;
    byGroupId: Record<number, number>;
  };
} {
  const byAdvisorType: Record<AdvisorType, number> = { AI: 0, Human: 0 };
  const byCongruity: Record<Congruity, number> = { Congruent: 0, Incongruent: 0 };
  const byConditionId: Record<number, number> = {};
  const byGroupId: Record<number, number> = {};
  const conditionCounts: Record<number, number> = {};
  const groupCounts: Record<number, number> = {};
  
  // Initialize counters
  for (let i = 1; i <= 8; i++) {
    byConditionId[i] = 0;
    conditionCounts[i] = 0;
  }
  for (let i = 1; i <= 4; i++) {
    byGroupId[i] = 0;
    groupCounts[i] = 0;
  }
  
  // Simulate participants
  for (let i = 0; i < numParticipants; i++) {
    const participantId = `participant_${i}`;
    const assignment = assignParticipantCondition(participantId);
    
    assignment.selectedStimuli.forEach(stimulus => {
      byAdvisorType[stimulus.condition.advisorType]++;
      byCongruity[stimulus.condition.congruity]++;
      byConditionId[stimulus.condition.conditionId]++;
      conditionCounts[stimulus.condition.conditionId]++;
      byGroupId[stimulus.condition.groupId]++;
      groupCounts[stimulus.condition.groupId]++;
    });
  }
  
  // Print results
  console.log('\n=== Randomization Test Results ===');
  console.log(`Total participants: ${numParticipants}`);
  console.log(`Total stimuli: ${numParticipants * 3} (3 per participant)`);
  
  const totalStimuli = numParticipants * 3;
  
  console.log(`\nGroup distribution:`);
  for (let i = 1; i <= 4; i++) {
    const count = groupCounts[i];
    const percentage = (count / totalStimuli * 100).toFixed(1);
    const groupConditions = EIGHT_CONDITIONS.filter(c => c.groupId === i);
    const groupName = `${groupConditions[0].advisorType} + ${groupConditions[0].congruity}`;
    console.log(`  Group ${i} (${groupName}): ${count} (${percentage}%)`);
  }
  console.log(`  Target: ${totalStimuli / 4} per group (25%)`);
  
  console.log(`\nCondition distribution:`);
  for (let i = 1; i <= 8; i++) {
    const count = conditionCounts[i];
    const percentage = (count / totalStimuli * 100).toFixed(1);
    const condition = EIGHT_CONDITIONS[i - 1];
    console.log(`  Condition ${i} (Group ${condition.groupId}, ${condition.advisorType} + ${condition.congruity}): ${count} (${percentage}%)`);
  }
  console.log(`  Target: ${totalStimuli / 8} per condition (12.5%)`);
  
  console.log(`\nAdvisor type distribution:`);
  console.log(`  AI: ${byAdvisorType.AI} (${(byAdvisorType.AI / totalStimuli * 100).toFixed(1)}%)`);
  console.log(`  Human: ${byAdvisorType.Human} (${(byAdvisorType.Human / totalStimuli * 100).toFixed(1)}%)`);
  
  console.log(`\nCongruity distribution:`);
  console.log(`  Congruent: ${byCongruity.Congruent} (${(byCongruity.Congruent / totalStimuli * 100).toFixed(1)}%)`);
  console.log(`  Incongruent: ${byCongruity.Incongruent} (${(byCongruity.Incongruent / totalStimuli * 100).toFixed(1)}%)`);
  
  const groupCountsArray = Object.values(groupCounts);
  const minGroupCount = Math.min(...groupCountsArray);
  const maxGroupCount = Math.max(...groupCountsArray);
  
  const conditionCountsArray = Object.values(conditionCounts);
  const minConditionCount = Math.min(...conditionCountsArray);
  const maxConditionCount = Math.max(...conditionCountsArray);
  
  console.log(`\nBalance analysis:`);
  console.log(`  Groups: min ${minGroupCount}, max ${maxGroupCount}, range ${maxGroupCount - minGroupCount}`);
  console.log(`  Conditions: min ${minConditionCount}, max ${maxConditionCount}, range ${maxConditionCount - minConditionCount}`);
  
  return {
    conditionCounts,
    groupCounts,
    summary: {
      byAdvisorType,
      byCongruity,
      byConditionId,
      byGroupId
    }
  };
}

/**
 * Legacy compatibility
 */
export function generateRandomCondition(participantId: string): ExperimentCondition {
  return assignParticipantCondition(participantId);
}
