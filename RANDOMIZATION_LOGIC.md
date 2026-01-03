# 실험 조건 및 랜덤 배정 로직 설명

## 📊 8가지 실험 조건 구조

### 실험 설계

이 실험은 **2 (Advisor Type) × 2 (Congruity) × 2 (Valence Combination)** 설계입니다.

### 8가지 조건 상세

| 조건 ID | Advisor Type | Congruity | Advisor 리뷰 | Public 리뷰 | 설명 |
|---------|-------------|-----------|--------------|-------------|------|
| 1 | AI | Congruent (불일치) | Positive | Negative | AI 조언자는 긍정적, 대중 리뷰는 부정적 |
| 2 | AI | Congruent (불일치) | Negative | Positive | AI 조언자는 부정적, 대중 리뷰는 긍정적 |
| 3 | AI | Incongruent (일치) | Positive | Positive | AI 조언자와 대중 리뷰 모두 긍정적 |
| 4 | AI | Incongruent (일치) | Negative | Negative | AI 조언자와 대중 리뷰 모두 부정적 |
| 5 | Human | Congruent (불일치) | Positive | Negative | Human 조언자는 긍정적, 대중 리뷰는 부정적 |
| 6 | Human | Congruent (불일치) | Negative | Positive | Human 조언자는 부정적, 대중 리뷰는 긍정적 |
| 7 | Human | Incongruent (일치) | Positive | Positive | Human 조언자와 대중 리뷰 모두 긍정적 |
| 8 | Human | Incongruent (일치) | Negative | Negative | Human 조언자와 대중 리뷰 모두 부정적 |

### 실험 자극물

- **제품**: 3개 (프로틴 파우더, 티슈, 핸드 솝)
- **조건**: 8가지
- **참가자당 자극물 수**: 3개

---

## 🔀 랜덤 배정 로직

### 배정 방식

각 참가자는:
1. **8가지 조건 중 3개를 랜덤하게 선택**받음
2. **3개의 제품도 랜덤하게 순서가 섞임**
3. 각 제품에 선택된 조건이 1:1로 매칭됨

### 코드 흐름

```typescript
// 1. 참가자 ID에서 시드 값 추출
const seed = participantId에서 숫자 추출;

// 2. 8가지 조건을 랜덤하게 섞기
const shuffledConditions = shuffleArray(EIGHT_CONDITIONS, seed);

// 3. 처음 3개 선택
const selectedConditions = shuffledConditions.slice(0, 3);

// 4. 3개의 제품도 랜덤하게 섞기
const shuffledProducts = shuffleArray(ALL_PRODUCTS, seed + 1);

// 5. 제품과 조건을 매칭
제품[0] → 조건[0]
제품[1] → 조건[1]
제품[2] → 조건[2]
```

### 예시

**참가자 1**:
- 자극물 1: `tissue` - 조건 6 (Human + Congruent, advisor negative, public positive)
- 자극물 2: `soap` - 조건 2 (AI + Congruent, advisor negative, public positive)
- 자극물 3: `protein` - 조건 1 (AI + Congruent, advisor positive, public negative)

**참가자 2**:
- 자극물 1: `tissue` - 조건 2 (AI + Congruent, advisor negative, public positive)
- 자극물 2: `soap` - 조건 4 (AI + Incongruent, advisor negative, public negative)
- 자극물 3: `protein` - 조건 5 (Human + Congruent, advisor positive, public negative)

---

## 📈 랜덤 배정 통계 (100명 기준)

### 전체 분포
- **총 자극물 수**: 300개 (참가자 100명 × 3개)

### Advisor Type 분포
- AI: 약 51% (153개)
- Human: 약 49% (147개)

### Congruity 분포
- Congruent: 약 52% (155개)
- Incongruent: 약 48% (145개)

### 8가지 조건별 배정 (이론적 기댓값: 37.5회)
- 조건 1-8: 각각 30-42회 사이로 고르게 분포
- 범위: 최소 30회 ~ 최대 42회

---

## ✅ 특징

### 장점
1. **완전 랜덤**: 참가자마다 다른 조건 조합을 받음
2. **균형 분포**: 많은 참가자를 모으면 8가지 조건이 고르게 분포됨
3. **제품 순서 랜덤**: 순서 효과(order effect)를 통제
4. **시드 기반**: 같은 참가자 ID는 항상 같은 조건을 받음 (재현 가능)

### 주의사항
- 소규모 샘플(예: 30명 미만)에서는 조건별 분포가 불균등할 수 있음
- 조건 간 완벽한 counterbalancing은 아님 (특정 조건 조합의 발생 빈도가 다를 수 있음)

---

## 🔧 관련 함수

### 핵심 함수
- `assignParticipantCondition(participantId)`: 참가자에게 조건 배정
- `validateConditions()`: 8가지 조건이 올바르게 정의되었는지 검증
- `testRandomization(numParticipants)`: 랜덤 배정 분포 시뮬레이션

### 유틸리티 함수
- `getAllConditions()`: 8가지 조건 목록 가져오기
- `getConditionById(conditionId)`: 특정 조건 정보 가져오기
- `shuffleArray(array, seed)`: Fisher-Yates 알고리즘으로 배열 섞기

---

## 📝 파일 위치

- 조건 정의 및 랜덤 로직: `src/lib/randomization.ts`
- 자극물 데이터 (제품, 리뷰 등): `src/lib/stimuliData.ts`
- 테스트 스크립트: `test-randomization.ts`
