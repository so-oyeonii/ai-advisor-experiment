import { getAllConditions } from './src/lib/randomization.js';
import { getStimulusData } from './src/lib/stimuliData.js';

console.log('=== PUBLIC REVIEWS 검증 ===\n');

const conditions = getAllConditions();
const products = ['protein', 'tissue', 'soap'] as const;

products.forEach(product => {
  console.log(`\n📦 제품: ${product.toUpperCase()}\n`);
  
  // Test both positive and negative public reviews
  const positiveCondition = conditions.find(c => c.publicValence === 'positive')!;
  const negativeCondition = conditions.find(c => c.publicValence === 'negative')!;
  
  // Check positive reviews
  const positiveData = getStimulusData({
    product,
    advisorType: positiveCondition.advisorType,
    advisorValence: positiveCondition.advisorValence,
    publicValence: 'positive',
    congruity: positiveCondition.congruity
  });
  
  console.log('✅ POSITIVE 리뷰:');
  const posRatings = positiveData.publicReviews.map(r => r.rating);
  const posAvg = posRatings.reduce((a, b) => a + b, 0) / posRatings.length;
  console.log(`   평균 평점: ${posAvg.toFixed(1)}/5.0`);
  
  positiveData.publicReviews.forEach((review, idx) => {
    const negativeWords = ['awful', 'bad', 'worse', 'worst', 'poor', 'damaged', 'hate', 'unhappy', 'regret', 'broken', 'nauseous', 'disappointed', 'rough', 'harsh', 'cumbersome', 'frustrating', 'slimy', 'rash', 'low', 'watery'];
    const text = review.text.toLowerCase();
    const hasNegative = negativeWords.some(word => text.includes(word));
    
    if (hasNegative) {
      console.log(`   ⚠️  리뷰 ${idx + 1}: 부정 키워드 발견!`);
      console.log(`      "${review.text.substring(0, 80)}..."`);
    }
  });
  
  // Check negative reviews
  const negativeData = getStimulusData({
    product,
    advisorType: negativeCondition.advisorType,
    advisorValence: negativeCondition.advisorValence,
    publicValence: 'negative',
    congruity: negativeCondition.congruity
  });
  
  console.log('\n❌ NEGATIVE 리뷰:');
  const negRatings = negativeData.publicReviews.map(r => r.rating);
  const negAvg = negRatings.reduce((a, b) => a + b, 0) / negRatings.length;
  console.log(`   평균 평점: ${negAvg.toFixed(1)}/5.0`);
  
  negativeData.publicReviews.forEach((review, idx) => {
    const positiveWords = ['perfect', 'great', 'better', 'best', 'good', 'excellent', 'love', 'happy', 'recommended', 'delicious', 'natural', 'easy', 'reliable', 'quality', 'comfortable'];
    const text = review.text.toLowerCase();
    const hasPositive = positiveWords.some(word => text.includes(word));
    
    if (hasPositive && !text.includes('not') && !text.includes("don't") && !text.includes('never')) {
      console.log(`   ⚠️  리뷰 ${idx + 1}: 긍정 키워드 발견! (부정문 아님)`);
      console.log(`      "${review.text.substring(0, 80)}..."`);
    }
  });
});

console.log('\n\n=== 요약 ===');
console.log('모든 제품의 긍정/부정 리뷰를 검증했습니다.');
console.log('⚠️ 표시가 없으면 모두 정상입니다!\n');
