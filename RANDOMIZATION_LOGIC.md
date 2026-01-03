# 실험 조건 및 랜덤 배정 로직 설명

## 📊 8가지 실험 조건 구조

### 4개 그룹, 각 그룹에 2개 조건

**그룹 구조:**
- 그룹 1 (AI + Congruent): 조건 1, 2
- 그룹 2 (AI + Incongruent): 조건 3, 4
- 그룹 3 (Human + Congruent): 조건 5, 6
- 그룹 4 (Human + Incongruent): 조건 7, 8

### 8가지 조건 상세

| 조건 ID | 그룹 | Advisor Type | Congruity | Advisor 리뷰 | Public 리뷰 | 설명 |
|---------|------|-------------|-----------|--------------|-------------|------|
| 1 | 1 | AI | Congruent | Positive | Negative | AI 조언자는 긍정적, 대중 리뷰는 부정적 |
| 2 | 1 | AI | Congruent | Negative | Positive | AI 조언자는 부정적, 대중 리뷰는 긍정적 |
| 3 | 2 | AI | Incongruent | Positive | Positive | AI 조언자와 대중 리뷰 모두 긍정적 |
| 4 | 2 | AI | Incongruent | Negative | Negative | AI 조언자와 대중 리뷰 모두 부정적 |
| 5 | 3 | Human | Congruent | Positive | Negative | Human 조언자는 긍정적, 대중 리뷰는 부정적 |
| 6 | 3 | Human | Congruent | Negative | Positive | Human 조언자는 부정적, 대중 리뷰는 긍정적 |
| 7 | 4 | Human | Incongruent | Positive | Positive | Human 조언자와 대중 리뷰 모두 긍정적 |
| 8 | 4 | Human | Incongruent | Negative | Negative | Human 조언자와 대중 리뷰 모두 부정적 |

### 실험 자극물

- **제품**: 3개 (프로틴 파우더, 티슈, 핸드 솝)
- **그룹**: 4개
- **조건**: 8가지 (각 그룹에 2개씩)
- **참가자당 자극물 수**: 3개

---

## 🔀 랜덤 배정 로직

### 핵심 원리

**4개 그룹 중 3개를 선택 (4C3 = 4가지 조합)**
- [1, 2, 3]: AI-Congruent, AI-Incongruent, Human-Congruent
- [1, 2, 4]: AI-Congruent, AI-Incongruent, Human-Incongruent
- [1, 3, 4]: AI-Congruent, Human-Congruent, Human-Incongruent
- [2, 3, 4]: AI-Incongruent, Human-Congruent, Human-Incongruent

**각 그룹에서 2개 조건 중 1개 선택**
- 그룹 1에서: 조건 1 또는 2
- 그룹 2에서: 조건 3 또는 4
- 그룹 3에서: 조건 5 또는 6
- 그룹 4에서: 조건 7 또는 8

### 배정 방식

1. 240개의 미리 정의된 패턴 사용 (완벽한 counterbalancing)
2. 각 참가자는 ID 번호에 따라 순환적으로 패턴 배정
3. 각 패턴은 다음을 지정:
   - 4개 중 선택된 3개 그룹
   - 각 그룹에서 선택된 조건 (2개 중 1개)
   - 3개 제품의 순서

### 240명 참가자 결과

**완벽한 균등 배분:**
- 총 720개 자극물 (240명 × 3개)
- 각 그룹: **정확히 180개** (25.0%)
- 각 조건: **정확히 90개** (12.5%)
- AI vs Human: **360 vs 360** (50% : 50%)
- Congruent vs Incongruent: **360 vs 360** (50% : 50%)

### 예시

**참가자 0**:
- 그룹 [1, 2, 3] 선택
- protein → 조건 1 (그룹 1에서 첫 번째 조건)
- tissue → 조건 3 (그룹 2에서 첫 번째 조건)
- soap → 조건 5 (그룹 3에서 첫 번째 조건)

**참가자 1**:
- 그룹 [1, 2, 3] 선택
- protein → 조건 1 (그룹 1에서 첫 번째 조건)
- soap → 조건 3 (그룹 2에서 첫 번째 조건)
- tissue → 조건 5 (그룹 3에서 첫 번째 조건)

---

## 📈 통계 및 검증

### Counterbalancing 전략

**240개 패턴 생성:**
- 4개 그룹 조합 × 60개 패턴 = 240개
- 각 조합에서 3개 그룹 각각이 2개 조건을 30:30으로 균등 선택
- 결과: 각 그룹 180개, 각 조건 90개 보장

### 검증 결과 (240명)

```
Group distribution:
  Group 1 (AI + Congruent): 180 (25.0%)
  Group 2 (AI + Incongruent): 180 (25.0%)
  Group 3 (Human + Congruent): 180 (25.0%)
  Group 4 (Human + Incongruent): 180 (25.0%)

Condition distribution:
  Condition 1-8: 각각 90개 (12.5%)

Advisor type: AI 360, Human 360 (50% : 50%)
Congruity: Congruent 360, Incongruent 360 (50% : 50%)

Balance: Groups range 0, Conditions range 0 (완벽한 균등)
```

---

## ✅ 특징 및 장점

### 장점
1. **완벽한 균등 배분**: 240명 기준으로 모든 조건이 정확히 90개씩
2. **그룹 기반 선택**: 4개 칸 중 3개를 선택하는 원래 설계 의도 구현
3. **체계적 counterbalancing**: 240개 미리 정의된 패턴으로 완벽한 균형
4. **재현 가능**: 같은 참가자 ID는 항상 같은 조건 배정
5. **순서 효과 통제**: 제품 순서도 체계적으로 변경

### 주의사항
- 240명 기준으로 설계됨 (240의 배수가 아니면 약간의 불균형 발생 가능)
- 참가자 수가 240보다 적으면 일부 패턴이 사용되지 않음
- 참가자 수가 240보다 많으면 패턴이 반복되어 여전히 균등 유지

---

## 🔧 관련 함수

### 핵심 함수
- `assignParticipantCondition(participantId)`: 참가자에게 조건 배정
- `validateConditions()`: 8가지 조건과 240개 패턴 검증
- `testRandomization(numParticipants)`: 랜덤 배정 분포 시뮬레이션

### 유틸리티 함수
- `getAllConditions()`: 8가지 조건 목록 가져오기
- `getConditionById(conditionId)`: 특정 조건 정보 가져오기

---

## 📝 파일 위치

- 조건 정의 및 랜덤 로직: `src/lib/randomization.ts`
- 자극물 데이터 (제품, 리뷰 등): `src/lib/stimuliData.ts`
- 테스트 스크립트: `test-randomization.ts`

