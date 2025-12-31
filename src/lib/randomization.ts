// Randomization logic for experimental conditions
import { stimuli, Stimulus } from './stimuliData';

export interface ExperimentCondition {
  participantId: string;
  stimulusOrder: string[];
  conditionAssignment: {
    advisorType: 'AI' | 'Human';
    congruenceType: 'Congruent' | 'Incongruent';
  };
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate randomized condition for a participant
export function generateRandomCondition(participantId: string): ExperimentCondition {
  // Randomly assign to one of the four conditions
  const advisorTypes: ('AI' | 'Human')[] = ['AI', 'Human'];
  const congruenceTypes: ('Congruent' | 'Incongruent')[] = ['Congruent', 'Incongruent'];
  
  const advisorType = advisorTypes[Math.floor(Math.random() * advisorTypes.length)];
  const congruenceType = congruenceTypes[Math.floor(Math.random() * congruenceTypes.length)];
  
  // Filter stimuli based on assigned condition
  const conditionStimuli = stimuli.filter(
    (s) => s.advisorType === advisorType && s.congruenceType === congruenceType
  );
  
  // Randomize the order of the three products
  const shuffledStimuli = shuffleArray(conditionStimuli);
  const stimulusOrder = shuffledStimuli.map((s) => s.id);
  
  return {
    participantId,
    stimulusOrder,
    conditionAssignment: {
      advisorType,
      congruenceType,
    },
  };
}

// Get stimuli for a specific condition
export function getStimuliForCondition(
  advisorType: 'AI' | 'Human',
  congruenceType: 'Congruent' | 'Incongruent'
): Stimulus[] {
  return stimuli.filter(
    (s) => s.advisorType === advisorType && s.congruenceType === congruenceType
  );
}
