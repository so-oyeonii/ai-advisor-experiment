import { validateConditions, testRandomization, assignParticipantCondition } from './src/lib/randomization.js';

console.log('=== 조건 검증 ===');
validateConditions();

console.log('\n=== 샘플 참가자 배정 (처음 5명) ===');
for (let i = 0; i < 5; i++) {
  const result = assignParticipantCondition(`participant_${i}`);
  console.log(`\n참가자 ${i}:`);
  const groups = result.selectedStimuli.map(s => s.condition.groupId);
  console.log(`  선택된 그룹: [${groups.join(', ')}]`);
  result.selectedStimuli.forEach((stimulus, idx) => {
    console.log(`  자극물 ${idx + 1}: ${stimulus.product} - 조건 ${stimulus.condition.conditionId} (그룹 ${stimulus.condition.groupId}, ${stimulus.condition.advisorType} + ${stimulus.condition.congruity})`);
  });
}

console.log('\n=== 240명 참가자 시뮬레이션 ===');
testRandomization(240);
