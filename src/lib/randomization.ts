// Randomization logic for experimental conditions
// 8 experimental conditions with random selection of 3 stimuli per participant

import { ProductKey } from './stimuliData';

export type AdvisorType = 'AI' | 'Human';
export type Congruity = 'Congruent' | 'Incongruent';
export type AdvisorValence = 'positive' | 'negative';
export type PublicValence = 'positive' | 'negative';

/**
 * 8가지 실험 조건:
 * 1. AI + Congruent + advisor pro + comments con
 * 2. AI + Congruent + advisor con + comments pro
 * 3. AI + Incongruent + advisor pro + comments pro
 * 4. AI + Incongruent + advisor con + comments con
 * 5. Human + Congruent + advisor pro + comments con
 * 6. Human + Congruent + advisor con + comments pro
 * 7. Human + Incongruent + advisor pro + comments pro
 * 8. Human + Incongruent + advisor con + comments con
 */
export interface StimulusCondition {
  conditionId: number;
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

// 8가지 실험 조건 정의
const EIGHT_CONDITIONS: StimulusCondition[] = [
  // AI + Congruent (advisor와 comments 불일치)
  { conditionId: 1, advisorType: 'AI', congruity: 'Congruent', advisorValence: 'positive', publicValence: 'negative' },
  { conditionId: 2, advisorType: 'AI', congruity: 'Congruent', advisorValence: 'negative', publicValence: 'positive' },
  
  // AI + Incongruent (advisor와 comments 일치)
  { conditionId: 3, advisorType: 'AI', congruity: 'Incongruent', advisorValence: 'positive', publicValence: 'positive' },
  { conditionId: 4, advisorType: 'AI', congruity: 'Incongruent', advisorValence: 'negative', publicValence: 'negative' },
  
  // Human + Congruent (advisor와 comments 불일치)
  { conditionId: 5, advisorType: 'Human', congruity: 'Congruent', advisorValence: 'positive', publicValence: 'negative' },
  { conditionId: 6, advisorType: 'Human', congruity: 'Congruent', advisorValence: 'negative', publicValence: 'positive' },
  
  // Human + Incongruent (advisor와 comments 일치)
  { conditionId: 7, advisorType: 'Human', congruity: 'Incongruent', advisorValence: 'positive', publicValence: 'positive' },
  { conditionId: 8, advisorType: 'Human', congruity: 'Incongruent', advisorValence: 'negative', publicValence: 'negative' },
];

// 3개의 제품
const ALL_PRODUCTS: ProductKey[] = ['protein', 'tissue', 'soap'];

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 */
function shuffleArray<T>(array: T[], seed?: number): T[] {
  const arr = [...array];
  
  // Simple seeded random if seed is provided
  let random = seed !== undefined 
    ? () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      }
    : Math.random;
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 참가자에게 8가지 조건 중 3개를 랜덤하게 배정
 * 각 조건은 3개의 제품 중 하나와 매칭됨
 */
export function assignParticipantCondition(participantId: string): ExperimentCondition {
  // 참가자 ID에서 숫자 추출 또는 타임스탬프 사용
  const numericMatch = participantId.match(/\d+/);
  const seed = numericMatch ? parseInt(numericMatch[0]) : Date.now();
  
  // 8가지 조건을 랜덤하게 섞기
  const shuffledConditions = shuffleArray(EIGHT_CONDITIONS, seed);
  
  // 처음 3개의 조건 선택
  const selectedConditions = shuffledConditions.slice(0, 3);
  
  // 3개의 제품도 랜덤하게 섞기
  const shuffledProducts = shuffleArray(ALL_PRODUCTS, seed + 1);
  
  // 각 제품에 선택된 조건 배정
  const selectedStimuli: SelectedStimulus[] = shuffledProducts.map((product, index) => ({
    product,
    condition: selectedConditions[index]
  }));
  
  return {
    participantId,
    selectedStimuli
  };
}

/**
 * 조건 배정 검증
 */
export function validateConditions(): boolean {
  try {
    // 8가지 조건이 모두 있는지 확인
    if (EIGHT_CONDITIONS.length !== 8) {
      console.error(`Expected 8 conditions, found ${EIGHT_CONDITIONS.length}`);
      return false;
    }
    
    // AI와 Human 각각 4개씩 있는지 확인
    const aiConditions = EIGHT_CONDITIONS.filter(c => c.advisorType === 'AI');
    const humanConditions = EIGHT_CONDITIONS.filter(c => c.advisorType === 'Human');
    
    if (aiConditions.length !== 4 || humanConditions.length !== 4) {
      console.error(`Expected 4 AI and 4 Human conditions, found ${aiConditions.length} AI and ${humanConditions.length} Human`);
      return false;
    }
    
    // Congruent와 Incongruent 각각 4개씩 있는지 확인
    const congruentConditions = EIGHT_CONDITIONS.filter(c => c.congruity === 'Congruent');
    const incongruentConditions = EIGHT_CONDITIONS.filter(c => c.congruity === 'Incongruent');
    
    if (congruentConditions.length !== 4 || incongruentConditions.length !== 4) {
      console.error(`Expected 4 Congruent and 4 Incongruent conditions, found ${congruentConditions.length} Congruent and ${incongruentConditions.length} Incongruent`);
      return false;
    }
    
    // 3개의 제품이 있는지 확인
    if (ALL_PRODUCTS.length !== 3) {
      console.error(`Expected 3 products, found ${ALL_PRODUCTS.length}`);
      return false;
    }
    
    console.log('✓ All condition validation checks passed');
    console.log(`  - 8 conditions defined`);
    console.log(`  - 4 AI conditions, 4 Human conditions`);
    console.log(`  - 4 Congruent conditions, 4 Incongruent conditions`);
    console.log(`  - 3 products available`);
    console.log(`  - Each participant will see 3 randomly selected conditions`);
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

/**
 * 랜덤 배정 테스트
 */
export function testRandomization(numParticipants: number = 100): {
  conditionCounts: Record<number, number>;
  summary: {
    byAdvisorType: Record<AdvisorType, number>;
    byCongruity: Record<Congruity, number>;
    byConditionId: Record<number, number>;
  };
} {
  const byAdvisorType: Record<AdvisorType, number> = { AI: 0, Human: 0 };
  const byCongruity: Record<Congruity, number> = { Congruent: 0, Incongruent: 0 };
  const byConditionId: Record<number, number> = {};
  const conditionCounts: Record<number, number> = {};
  
  // 1-8번 조건 카운터 초기화
  for (let i = 1; i <= 8; i++) {
    byConditionId[i] = 0;
    conditionCounts[i] = 0;
  }
  
  // 참가자 시뮬레이션
  for (let i = 0; i < numParticipants; i++) {
    const participantId = `participant_${i}`;
    const assignment = assignParticipantCondition(participantId);
    
    // 각 참가자가 받은 3개의 조건 카운트
    assignment.selectedStimuli.forEach(stimulus => {
      byAdvisorType[stimulus.condition.advisorType]++;
      byCongruity[stimulus.condition.congruity]++;
      byConditionId[stimulus.condition.conditionId]++;
      conditionCounts[stimulus.condition.conditionId]++;
    });
  }
  
  // 결과 출력
  console.log('\n=== 랜덤 배정 테스트 결과 ===');
  console.log(`총 참가자 수: ${numParticipants}명`);
  console.log(`총 자극물 수: ${numParticipants * 3}개 (참가자당 3개)`);
  
  console.log(`\n조언자 타입별 분포:`);
  const totalStimuli = numParticipants * 3;
  console.log(`  AI: ${byAdvisorType.AI} (${(byAdvisorType.AI / totalStimuli * 100).toFixed(1)}%)`);
  console.log(`  Human: ${byAdvisorType.Human} (${(byAdvisorType.Human / totalStimuli * 100).toFixed(1)}%)`);
  
  console.log(`\n일치성별 분포:`);
  console.log(`  Congruent: ${byCongruity.Congruent} (${(byCongruity.Congruent / totalStimuli * 100).toFixed(1)}%)`);
  console.log(`  Incongruent: ${byCongruity.Incongruent} (${(byCongruity.Incongruent / totalStimuli * 100).toFixed(1)}%)`);
  
  console.log(`\n8가지 조건별 배정 횟수:`);
  for (let i = 1; i <= 8; i++) {
    const count = conditionCounts[i];
    const percentage = (count / totalStimuli * 100).toFixed(1);
    const condition = EIGHT_CONDITIONS[i - 1];
    console.log(`  조건 ${i} (${condition.advisorType} + ${condition.congruity}): ${count}회 (${percentage}%)`);
  }
  
  const counts = Object.values(conditionCounts);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);
  console.log(`\n  최소: ${minCount}회, 최대: ${maxCount}회, 범위: ${maxCount - minCount}회`);
  console.log(`  이론적 기댓값: ${(totalStimuli / 8).toFixed(1)}회 (완전 균등 분포 시)`);
  
  return {
    conditionCounts,
    summary: {
      byAdvisorType,
      byCongruity,
      byConditionId
    }
  };
}

/**
 * 8가지 조건 목록 가져오기
 */
export function getAllConditions(): StimulusCondition[] {
  return EIGHT_CONDITIONS;
}

/**
 * 조건 ID로 조건 정보 가져오기
 */
export function getConditionById(conditionId: number): StimulusCondition | undefined {
  return EIGHT_CONDITIONS.find(c => c.conditionId === conditionId);
}

/**
 * Legacy compatibility
 */
export function generateRandomCondition(participantId: string): ExperimentCondition {
  return assignParticipantCondition(participantId);
}
