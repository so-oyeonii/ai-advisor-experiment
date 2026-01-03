import { getAllConditions } from './src/lib/randomization.js';
import { getStimulusData } from './src/lib/stimuliData.js';

console.log('=== 8가지 조건 요약 검증 ===\n');

const conditions = getAllConditions();
const product = 'protein';

console.log('| 조건 | 그룹 | Advisor | Congruity | Advisor Val | Public Val | Rating | Pub Avg | 검증 |');
console.log('|------|------|---------|-----------|-------------|------------|--------|---------|------|');

conditions.forEach(cond => {
  const stimulusData = getStimulusData({
    product: product,
    advisorType: cond.advisorType,
    advisorValence: cond.advisorValence,
    publicValence: cond.publicValence,
    congruity: cond.congruity
  });
  
  const ratings = stimulusData.publicReviews.map(r => r.rating);
  const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  
  // Congruity 검증
  let isCorrect = false;
  if (cond.congruity === 'Congruent') {
    // Advisor와 Public이 불일치해야 함
    isCorrect = cond.advisorValence !== cond.publicValence;
  } else {
    // Advisor와 Public이 일치해야 함
    isCorrect = cond.advisorValence === cond.publicValence;
  }
  
  const checkMark = isCorrect ? '✓' : '✗';
  
  console.log(`| ${cond.conditionId} | ${cond.groupId} | ${cond.advisorType} | ${cond.congruity} | ${cond.advisorValence} | ${cond.publicValence} | ${stimulusData.displayRating} | ${avgRating} | ${checkMark} |`);
});

console.log('\n=== 세부 검증 ===\n');

conditions.forEach(cond => {
  const stimulusData = getStimulusData({
    product: product,
    advisorType: cond.advisorType,
    advisorValence: cond.advisorValence,
    publicValence: cond.publicValence,
    congruity: cond.congruity
  });
  
  const ratings = stimulusData.publicReviews.map(r => r.rating);
  const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  
  console.log(`조건 ${cond.conditionId} (${cond.advisorType} + ${cond.congruity}):`);
  
  // Advisor 리뷰 분석
  const advisorText = stimulusData.advisorReview;
  const advisorWords = advisorText.toLowerCase();
  
  const positiveWords = ['designed', 'optimal', 'smooth', 'rich', 'satisfying', 'well-designed', 'premium', 'exceptional', 'gentle', 'balanced'];
  const negativeWords = ['cheap', 'fillers', 'thickeners', 'clumps', 'gritty', 'chalky', 'artificial', 'impractical', 'flaws', 'harsh'];
  
  const posCount = positiveWords.filter(w => advisorWords.includes(w)).length;
  const negCount = negativeWords.filter(w => advisorWords.includes(w)).length;
  
  console.log(`  Advisor: ${cond.advisorValence.toUpperCase()}`);
  console.log(`    - Positive words: ${posCount}`);
  console.log(`    - Negative words: ${negCount}`);
  console.log(`    - Valence check: ${cond.advisorValence === 'positive' ? (posCount > negCount ? '✓ CORRECT' : '✗ ERROR') : (negCount > posCount ? '✓ CORRECT' : '✗ ERROR')}`);
  
  console.log(`  Public: ${cond.publicValence.toUpperCase()}`);
  console.log(`    - Average rating: ${avgRating} / 5.0`);
  console.log(`    - Valence check: ${cond.publicValence === 'positive' ? (parseFloat(avgRating) >= 4 ? '✓ CORRECT' : '✗ ERROR') : (parseFloat(avgRating) <= 2 ? '✓ CORRECT' : '✗ ERROR')}`);
  
  console.log(`  Congruity: ${cond.congruity}`);
  console.log(`    - Rating display: ${stimulusData.displayRating}`);
  
  if (cond.congruity === 'Congruent') {
    // Rating은 advisor를 따름, Public reviews는 반대
    const ratingMatchesAdvisor = (cond.advisorValence === 'positive' && stimulusData.displayRating >= 4) ||
                                  (cond.advisorValence === 'negative' && stimulusData.displayRating <= 2.5);
    const reviewsOpposite = cond.advisorValence !== cond.publicValence;
    console.log(`    - Expected: Rating follows advisor, Reviews opposite`);
    console.log(`    - Rating matches advisor: ${ratingMatchesAdvisor ? '✓' : '✗'}`);
    console.log(`    - Reviews opposite: ${reviewsOpposite ? '✓' : '✗'}`);
  } else {
    // Rating은 advisor 반대, Public reviews는 advisor와 동일
    const ratingOppositeAdvisor = (cond.advisorValence === 'positive' && stimulusData.displayRating <= 2.5) ||
                                   (cond.advisorValence === 'negative' && stimulusData.displayRating >= 4);
    const reviewsMatch = cond.advisorValence === cond.publicValence;
    console.log(`    - Expected: Rating opposite advisor, Reviews match advisor`);
    console.log(`    - Rating opposite: ${ratingOppositeAdvisor ? '✓' : '✗'}`);
    console.log(`    - Reviews match: ${reviewsMatch ? '✓' : '✗'}`);
  }
  
  console.log('');
});
