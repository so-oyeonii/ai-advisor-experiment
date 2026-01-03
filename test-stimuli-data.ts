import { getAllConditions } from './src/lib/randomization.js';
import { getStimulusData, getProductByKey, ADVISOR_REVIEWS, PUBLIC_REVIEWS } from './src/lib/stimuliData.js';

console.log('=== 8가지 조건별 Stimuli 데이터 검증 ===\n');

const conditions = getAllConditions();

conditions.forEach(cond => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`조건 ${cond.conditionId}: ${cond.advisorType} + ${cond.congruity}`);
  console.log(`  - Advisor: ${cond.advisorValence} / Public: ${cond.publicValence}`);
  console.log(`${'='.repeat(80)}`);
  
  // 예시로 protein 제품 사용
  const product = 'protein';
  
  const stimulusData = getStimulusData({
    product: product,
    advisorType: cond.advisorType,
    advisorValence: cond.advisorValence,
    publicValence: cond.publicValence,
    congruity: cond.congruity
  });
  
  console.log(`\n📦 Product: ${stimulusData.product.name}`);
  console.log(`💰 Price: $${stimulusData.product.price}`);
  
  console.log(`\n⭐ Rating Display:`);
  console.log(`  Average: ${stimulusData.displayRating} / 5.0`);
  console.log(`  Total Reviews: ${stimulusData.ratingCount}`);
  console.log(`  Distribution: ${stimulusData.ratingDistribution.join(', ')} (5→1 stars)`);
  
  console.log(`\n🤖 Advisor Review (${cond.advisorType} - ${cond.advisorValence}):`);
  const advisorText = stimulusData.advisorReview;
  console.log(`  "${advisorText.substring(0, 150)}..."`);
  
  // 전체 advisor 리뷰 분석
  const hasPositiveKeywords = advisorText.includes('designed') || advisorText.includes('high-quality') || 
                               advisorText.includes('suitable') || advisorText.includes('exceptional');
  const hasNegativeKeywords = advisorText.includes('cheap fillers') || advisorText.includes('flaws') || 
                               advisorText.includes('harsh') || advisorText.includes('impractical');
  
  console.log(`  ✓ Positive keywords: ${hasPositiveKeywords ? 'YES' : 'NO'}`);
  console.log(`  ✓ Negative keywords: ${hasNegativeKeywords ? 'YES' : 'NO'}`);
  
  if (cond.advisorValence === 'positive' && !hasPositiveKeywords) {
    console.log(`  ⚠️  WARNING: Advisor should be POSITIVE but lacks positive keywords!`);
  }
  if (cond.advisorValence === 'negative' && !hasNegativeKeywords) {
    console.log(`  ⚠️  WARNING: Advisor should be NEGATIVE but lacks negative keywords!`);
  }
  
  console.log(`\n👥 Public Reviews (${cond.publicValence}):`);
  console.log(`  Number of reviews: ${stimulusData.publicReviews.length}`);
  
  // 리뷰 평점 분석
  const ratings = stimulusData.publicReviews.map(r => r.rating);
  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  console.log(`  Average rating: ${avgRating.toFixed(1)} / 5.0`);
  
  // 샘플 리뷰 3개
  console.log(`\n  Sample reviews:`);
  stimulusData.publicReviews.slice(0, 3).forEach((review, idx) => {
    console.log(`    ${idx + 1}. [${review.rating}⭐] ${review.text.substring(0, 80)}...`);
  });
  
  // 일치성 검증
  console.log(`\n✅ Congruity Check:`);
  if (cond.congruity === 'Congruent') {
    // Advisor와 Public이 불일치해야 함
    const shouldMismatch = (cond.advisorValence === 'positive' && cond.publicValence === 'negative') ||
                           (cond.advisorValence === 'negative' && cond.publicValence === 'positive');
    console.log(`  Congruent = Advisor와 Public이 불일치: ${shouldMismatch ? '✓ CORRECT' : '✗ ERROR'}`);
    
    if (cond.advisorValence === 'positive') {
      console.log(`  Expected: Advisor positive (high rating display) + Public negative (low rating comments)`);
    } else {
      console.log(`  Expected: Advisor negative (low rating display) + Public positive (high rating comments)`);
    }
  } else {
    // Advisor와 Public이 일치해야 함
    const shouldMatch = cond.advisorValence === cond.publicValence;
    console.log(`  Incongruent = Advisor와 Public이 일치: ${shouldMatch ? '✓ CORRECT' : '✗ ERROR'}`);
    
    if (cond.advisorValence === 'positive') {
      console.log(`  Expected: Both positive (low rating display + high rating comments)`);
    } else {
      console.log(`  Expected: Both negative (high rating display + low rating comments)`);
    }
  }
  
  console.log(`  Advisor valence: ${cond.advisorValence}`);
  console.log(`  Public valence: ${cond.publicValence}`);
  console.log(`  Rating display: ${stimulusData.displayRating} (${stimulusData.displayRating >= 4 ? 'HIGH' : 'LOW'})`);
  console.log(`  Public reviews avg: ${avgRating.toFixed(1)} (${avgRating >= 4 ? 'HIGH' : 'LOW'})`);
});

console.log(`\n\n${'='.repeat(80)}`);
console.log('검증 완료!');
console.log(`${'='.repeat(80)}`);
