// Randomization logic for experimental conditions with counterbalancing

import { stimuli, Stimulus } from './stimuliData';

// Type definitions matching the specification
export type PatternKey = 'AAA' | 'AAB' | 'ABA' | 'ABB' | 'BAA' | 'BAB' | 'BBA' | 'BBB';
export type ProductKey = 'P1' | 'P2' | 'P3';
export type AdvisorType = 'AI' | 'Human';
export type Congruity = 'Congruent' | 'Incongruent';

export interface Condition {
  conditionNumber: number;
  advisorType: AdvisorType;
  congruity: Congruity;
  patternKey: PatternKey;
  productOrder: ProductKey[];
  stimulusOrder: string[];
}

export interface ExperimentCondition {
  participantId: string;
  condition: Condition;
  stimulusOrder: string[];
  conditionAssignment: {
    advisorType: AdvisorType;
    congruenceType: Congruity;
  };
}

// Product rotation patterns (24 unique orderings)
const PRODUCT_PATTERNS: Record<PatternKey, ProductKey[][]> = {
  'AAA': [
    ['P1', 'P2', 'P3'],
    ['P2', 'P3', 'P1'],
    ['P3', 'P1', 'P2']
  ],
  'AAB': [
    ['P1', 'P3', 'P2'],
    ['P2', 'P1', 'P3'],
    ['P3', 'P2', 'P1']
  ],
  'ABA': [
    ['P2', 'P1', 'P3'],
    ['P3', 'P2', 'P1'],
    ['P1', 'P3', 'P2']
  ],
  'ABB': [
    ['P2', 'P3', 'P1'],
    ['P3', 'P1', 'P2'],
    ['P1', 'P2', 'P3']
  ],
  'BAA': [
    ['P3', 'P1', 'P2'],
    ['P1', 'P2', 'P3'],
    ['P2', 'P3', 'P1']
  ],
  'BAB': [
    ['P3', 'P2', 'P1'],
    ['P1', 'P3', 'P2'],
    ['P2', 'P1', 'P3']
  ],
  'BBA': [
    ['P1', 'P2', 'P3'],
    ['P2', 'P3', 'P1'],
    ['P3', 'P1', 'P2']
  ],
  'BBB': [
    ['P1', 'P3', 'P2'],
    ['P2', 'P1', 'P3'],
    ['P3', 'P2', 'P1']
  ]
};

// All 24 condition configurations
const CONDITIONS: Condition[] = [
  // AI Congruent (Conditions 1-12)
  { conditionNumber: 1, advisorType: 'AI', congruity: 'Congruent', patternKey: 'AAA', productOrder: ['P1', 'P2', 'P3'], stimulusOrder: [] },
  { conditionNumber: 2, advisorType: 'AI', congruity: 'Congruent', patternKey: 'AAA', productOrder: ['P2', 'P3', 'P1'], stimulusOrder: [] },
  { conditionNumber: 3, advisorType: 'AI', congruity: 'Congruent', patternKey: 'AAA', productOrder: ['P3', 'P1', 'P2'], stimulusOrder: [] },
  { conditionNumber: 4, advisorType: 'AI', congruity: 'Congruent', patternKey: 'AAB', productOrder: ['P1', 'P3', 'P2'], stimulusOrder: [] },
  { conditionNumber: 5, advisorType: 'AI', congruity: 'Congruent', patternKey: 'AAB', productOrder: ['P2', 'P1', 'P3'], stimulusOrder: [] },
  { conditionNumber: 6, advisorType: 'AI', congruity: 'Congruent', patternKey: 'AAB', productOrder: ['P3', 'P2', 'P1'], stimulusOrder: [] },
  { conditionNumber: 7, advisorType: 'AI', congruity: 'Congruent', patternKey: 'ABA', productOrder: ['P2', 'P1', 'P3'], stimulusOrder: [] },
  { conditionNumber: 8, advisorType: 'AI', congruity: 'Congruent', patternKey: 'ABA', productOrder: ['P3', 'P2', 'P1'], stimulusOrder: [] },
  { conditionNumber: 9, advisorType: 'AI', congruity: 'Congruent', patternKey: 'ABA', productOrder: ['P1', 'P3', 'P2'], stimulusOrder: [] },
  { conditionNumber: 10, advisorType: 'AI', congruity: 'Congruent', patternKey: 'ABB', productOrder: ['P2', 'P3', 'P1'], stimulusOrder: [] },
  { conditionNumber: 11, advisorType: 'AI', congruity: 'Congruent', patternKey: 'ABB', productOrder: ['P3', 'P1', 'P2'], stimulusOrder: [] },
  { conditionNumber: 12, advisorType: 'AI', congruity: 'Congruent', patternKey: 'ABB', productOrder: ['P1', 'P2', 'P3'], stimulusOrder: [] },
  
  // AI Incongruent (Conditions 13-24)
  { conditionNumber: 13, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BAA', productOrder: ['P3', 'P1', 'P2'], stimulusOrder: [] },
  { conditionNumber: 14, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BAA', productOrder: ['P1', 'P2', 'P3'], stimulusOrder: [] },
  { conditionNumber: 15, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BAA', productOrder: ['P2', 'P3', 'P1'], stimulusOrder: [] },
  { conditionNumber: 16, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BAB', productOrder: ['P3', 'P2', 'P1'], stimulusOrder: [] },
  { conditionNumber: 17, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BAB', productOrder: ['P1', 'P3', 'P2'], stimulusOrder: [] },
  { conditionNumber: 18, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BAB', productOrder: ['P2', 'P1', 'P3'], stimulusOrder: [] },
  { conditionNumber: 19, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BBA', productOrder: ['P1', 'P2', 'P3'], stimulusOrder: [] },
  { conditionNumber: 20, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BBA', productOrder: ['P2', 'P3', 'P1'], stimulusOrder: [] },
  { conditionNumber: 21, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BBA', productOrder: ['P3', 'P1', 'P2'], stimulusOrder: [] },
  { conditionNumber: 22, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BBB', productOrder: ['P1', 'P3', 'P2'], stimulusOrder: [] },
  { conditionNumber: 23, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BBB', productOrder: ['P2', 'P1', 'P3'], stimulusOrder: [] },
  { conditionNumber: 24, advisorType: 'AI', congruity: 'Incongruent', patternKey: 'BBB', productOrder: ['P3', 'P2', 'P1'], stimulusOrder: [] },
];

// Human conditions (mirror of AI conditions with Human advisor type)
const HUMAN_CONDITIONS: Condition[] = CONDITIONS.map((cond, index) => ({
  ...cond,
  conditionNumber: cond.conditionNumber + 24,
  advisorType: 'Human' as AdvisorType
}));

// Combine all 48 conditions
const ALL_CONDITIONS: Condition[] = [...CONDITIONS, ...HUMAN_CONDITIONS];

/**
 * Map product key to actual product ID
 */
function mapProductKeyToId(productKey: ProductKey): string {
  const mapping: Record<ProductKey, string> = {
    'P1': 'product1',
    'P2': 'product2',
    'P3': 'product3'
  };
  return mapping[productKey];
}

/**
 * Get stimulus ID for a product, advisor type, and congruity
 */
function getStimulusId(productId: string, advisorType: AdvisorType, congruity: Congruity): string {
  const stimulus = stimuli.find(
    s => s.productId === productId && 
         s.advisorType === advisorType && 
         s.congruenceType === congruity
  );
  return stimulus?.id || '';
}

/**
 * Assign participant to a condition using sequential assignment with cycling
 */
export function assignParticipantCondition(participantId: string): ExperimentCondition {
  // Extract numeric portion from participant ID or use timestamp
  const numericMatch = participantId.match(/\d+/);
  const participantNumber = numericMatch ? parseInt(numericMatch[0]) : Date.now();
  
  // Cycle through all 48 conditions
  const conditionIndex = participantNumber % 48;
  const condition = ALL_CONDITIONS[conditionIndex];
  
  // Build stimulus order based on product order
  const stimulusOrder = condition.productOrder.map(productKey => {
    const productId = mapProductKeyToId(productKey);
    return getStimulusId(productId, condition.advisorType, condition.congruity);
  }).filter(id => id !== '');
  
  // Update condition with stimulus order
  const finalCondition: Condition = {
    ...condition,
    stimulusOrder
  };
  
  return {
    participantId,
    condition: finalCondition,
    stimulusOrder,
    conditionAssignment: {
      advisorType: condition.advisorType,
      congruenceType: condition.congruity
    }
  };
}

/**
 * Validate that condition assignments follow the rules
 */
export function validateConditions(): boolean {
  try {
    // Check that we have exactly 48 conditions
    if (ALL_CONDITIONS.length !== 48) {
      console.error(`Expected 48 conditions, found ${ALL_CONDITIONS.length}`);
      return false;
    }
    
    // Check that we have 24 AI and 24 Human conditions
    const aiConditions = ALL_CONDITIONS.filter(c => c.advisorType === 'AI');
    const humanConditions = ALL_CONDITIONS.filter(c => c.advisorType === 'Human');
    
    if (aiConditions.length !== 24 || humanConditions.length !== 24) {
      console.error(`Expected 24 AI and 24 Human conditions, found ${aiConditions.length} AI and ${humanConditions.length} Human`);
      return false;
    }
    
    // Check that we have 24 Congruent and 24 Incongruent conditions
    const congruentConditions = ALL_CONDITIONS.filter(c => c.congruity === 'Congruent');
    const incongruentConditions = ALL_CONDITIONS.filter(c => c.congruity === 'Incongruent');
    
    if (congruentConditions.length !== 24 || incongruentConditions.length !== 24) {
      console.error(`Expected 24 Congruent and 24 Incongruent conditions, found ${congruentConditions.length} Congruent and ${incongruentConditions.length} Incongruent`);
      return false;
    }
    
    // Check that each product order is unique
    const productOrders = ALL_CONDITIONS.map(c => c.productOrder.join('-'));
    const uniqueOrders = new Set(productOrders);
    
    // We should have 24 unique product orders (each used twice: once for AI, once for Human)
    if (uniqueOrders.size !== 24) {
      console.error(`Expected 24 unique product orders, found ${uniqueOrders.size}`);
      return false;
    }
    
    // Check that condition numbers are sequential and unique
    const conditionNumbers = ALL_CONDITIONS.map(c => c.conditionNumber).sort((a, b) => a - b);
    for (let i = 0; i < 48; i++) {
      if (conditionNumbers[i] !== i + 1) {
        console.error(`Condition number ${i + 1} is missing or duplicated`);
        return false;
      }
    }
    
    console.log('✓ All condition validation checks passed');
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

/**
 * Test randomization distribution across multiple assignments
 */
export function testRandomization(numParticipants: number = 480): {
  distribution: Record<string, number>;
  summary: {
    byAdvisorType: Record<AdvisorType, number>;
    byCongruity: Record<Congruity, number>;
    byConditionNumber: Record<number, number>;
  };
} {
  const distribution: Record<string, number> = {};
  const byAdvisorType: Record<AdvisorType, number> = { AI: 0, Human: 0 };
  const byCongruity: Record<Congruity, number> = { Congruent: 0, Incongruent: 0 };
  const byConditionNumber: Record<number, number> = {};
  
  // Initialize condition number counters
  for (let i = 1; i <= 48; i++) {
    byConditionNumber[i] = 0;
  }
  
  // Simulate participant assignments
  for (let i = 0; i < numParticipants; i++) {
    const participantId = `participant_${i}`;
    const assignment = assignParticipantCondition(participantId);
    
    const key = `${assignment.condition.advisorType}-${assignment.condition.congruity}-${assignment.condition.conditionNumber}`;
    distribution[key] = (distribution[key] || 0) + 1;
    
    byAdvisorType[assignment.condition.advisorType]++;
    byCongruity[assignment.condition.congruity]++;
    byConditionNumber[assignment.condition.conditionNumber]++;
  }
  
  // Log results
  console.log('\n=== Randomization Test Results ===');
  console.log(`Total participants: ${numParticipants}`);
  console.log(`\nBy Advisor Type:`);
  console.log(`  AI: ${byAdvisorType.AI} (${(byAdvisorType.AI / numParticipants * 100).toFixed(1)}%)`);
  console.log(`  Human: ${byAdvisorType.Human} (${(byAdvisorType.Human / numParticipants * 100).toFixed(1)}%)`);
  console.log(`\nBy Congruity:`);
  console.log(`  Congruent: ${byCongruity.Congruent} (${(byCongruity.Congruent / numParticipants * 100).toFixed(1)}%)`);
  console.log(`  Incongruent: ${byCongruity.Incongruent} (${(byCongruity.Incongruent / numParticipants * 100).toFixed(1)}%)`);
  
  console.log(`\nCondition Number Distribution (should be equal):`);
  const counts = Object.values(byConditionNumber);
  const expectedCount = numParticipants / 48;
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);
  console.log(`  Expected per condition: ${expectedCount}`);
  console.log(`  Min: ${minCount}, Max: ${maxCount}, Range: ${maxCount - minCount}`);
  
  return {
    distribution,
    summary: {
      byAdvisorType,
      byCongruity,
      byConditionNumber
    }
  };
}

// Legacy function for backward compatibility
export function generateRandomCondition(participantId: string): ExperimentCondition {
  return assignParticipantCondition(participantId);
}

// Get stimuli for a specific condition (legacy compatibility)
export function getStimuliForCondition(
  advisorType: 'AI' | 'Human',
  congruenceType: 'Congruent' | 'Incongruent'
): Stimulus[] {
  return stimuli.filter(
    (s) => s.advisorType === advisorType && s.congruenceType === congruenceType
  );
}
