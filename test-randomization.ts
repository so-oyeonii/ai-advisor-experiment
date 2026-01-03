import { validateConditions, testRandomization, assignParticipantCondition } from './src/lib/randomization.js';

console.log('=== 조건 검증 ===');
validateConditions();

console.log('\n=== 샘플 참가자 배정 ===');
for (let i = 1; i <= 5; i++) {
  const result = assignParticipantCondition(`participant_${i}`);
  console.log(`\n참가자 ${i}:`);
  result.selectedStimuli.forEach((stimulus, idx) => {
    console.log(`  자극물 ${idx + 1}: ${stimulus.product} - 조건 ${stimulus.condition.conditionId} (${stimulus.condition.advisorType} + ${stimulus.condition.congruity}, advisor ${stimulus.condition.advisorValence}, public ${stimulus.condition.publicValence})`);
  });
}

testRandomization(100);
