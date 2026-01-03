# 데이터베이스 구조 및 조건 정보

## 실험 설계 요약

### 8가지 조건 (4개 그룹 × 2개 조건)

| Condition ID | Group ID | Advisor Type | Congruity | Advisor Valence | Public Valence |
|--------------|----------|--------------|-----------|-----------------|----------------|
| 1 | 1 | AI | Congruent | positive | negative |
| 2 | 1 | AI | Congruent | negative | positive |
| 3 | 2 | AI | Incongruent | positive | positive |
| 4 | 2 | AI | Incongruent | negative | negative |
| 5 | 3 | Human | Congruent | positive | negative |
| 6 | 3 | Human | Congruent | negative | positive |
| 7 | 4 | Human | Incongruent | positive | positive |
| 8 | 4 | Human | Incongruent | negative | negative |

### 24가지 세부 조건 (8 조건 × 3 제품)

각 참가자는 3개의 제품(protein, tissue, soap)을 보게 되며, 각 제품마다 위 8가지 조건 중 하나가 할당됩니다.

- **총 조건 수**: 8개 (기본 조건)
- **제품 수**: 3개 (protein, tissue, soap)
- **세부 조건 수**: 24개 (8 × 3)

예시:
- 조건 1 + protein = C1-protein
- 조건 1 + tissue = C1-tissue
- 조건 1 + soap = C1-soap
- ... (총 24가지)

## Firebase 컬렉션 구조

### 1. `sessions` 컬렉션

참가자의 전반적인 실험 세션 정보

```typescript
{
  participantId: string,           // UUID
  conditionNumber: number,         // Backward compatibility
  groupId: number,                 // 1-4: 어느 그룹인지
  conditionId: number,             // 1-8: 어느 조건인지
  advisorType: 'AI' | 'Human',    // AI 또는 Human
  congruity: 'Congruent' | 'Incongruent',
  advisorValence: 'positive' | 'negative',
  publicValence: 'positive' | 'negative',
  patternKey: string,              // 예: "ABB" (A=positive, B=negative)
  productOrder: string[],          // 예: ['protein', 'tissue', 'soap']
  stimulusOrder: string[],         // 예: ['protein_1', 'tissue_2', 'soap_3']
  currentStimulusIndex: number,    // 현재 진행 중인 자극물 인덱스
  completedStimuli: string[],      // 완료한 자극물 목록
  completed: boolean,              // 실험 완료 여부
  startTime: Timestamp,
  endTime?: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. `stimulus_exposures` 컬렉션

각 제품 페이지 노출 정보 (참가자당 3개)

```typescript
{
  exposureId: string,              // "{participantId}_{product}_{index}"
  participantId: string,
  stimulusId: string,              // 예: "protein_AI_Congruent"
  productId: string,               // 'protein' | 'tissue' | 'soap'
  productName: string,             // "Premium Protein Powder"
  groupId: number,                 // 1-4: 이 자극물의 그룹 ID
  conditionId: number,             // 1-8: 이 자극물의 조건 ID
  advisorType: 'AI' | 'Human',
  congruity: 'Congruent' | 'Incongruent',
  advisorValence: 'positive' | 'negative',
  publicValence: 'positive' | 'negative',
  advisorName: string,
  recommendation: string,           // = advisorValence
  reasoning: string,                // Advisor 리뷰 전체 텍스트
  exposureOrder: number,            // 1, 2, or 3
  dwellTime: number,                // 페이지 체류 시간 (초)
  exposureStartTime: Timestamp,
  exposureEndTime: Timestamp,
  createdAt: Timestamp
}
```

### 3. `recall_tasks` 컬렉션

각 제품에 대한 회상 과제 응답

```typescript
{
  recallId: string,                // "{participantId}_{index}"
  participantId: string,
  stimulusId: string,
  productId: string,
  productName: string,
  groupId: number,                 // 1-4
  conditionId: number,             // 1-8
  advisorType: 'AI' | 'Human',
  congruity: 'Congruent' | 'Incongruent',
  advisorValence: 'positive' | 'negative',
  publicValence: 'positive' | 'negative',
  recalledRecommendation: string,  // 참가자가 회상한 내용
  recallAccuracy?: number,         // (선택) 유사도 점수
  recallTime: number,              // 회상에 걸린 시간 (초)
  createdAt: Timestamp
}
```

### 4. `survey_responses` 컬렉션

각 제품에 대한 설문 응답

```typescript
{
  responseId: string,              // "{participantId}_{index}"
  participantId: string,
  stimulusId: string,
  productId: string,
  productName: string,
  groupId: number,                 // 1-4
  conditionId: number,             // 1-8
  advisorType: 'AI' | 'Human',
  congruity: 'Congruent' | 'Incongruent',
  advisorValence: 'positive' | 'negative',
  publicValence: 'positive' | 'negative',
  responseData: {                  // 모든 설문 응답
    mc_advisorType: string,
    mc_congruity: string,
    argQuality_1: number,          // 1-7
    argQuality_2: number,
    // ... (기타 모든 설문 항목)
  },
  createdAt: Timestamp
}
```

### 5. `demographics` 컬렉션

참가자 인구통계 정보

```typescript
{
  participantId: string,
  age: string,
  gender: string,
  education: string,
  online_shopping_frequency: string,
  createdAt: Timestamp
}
```

## CSV 내보내기 형식

관리자 페이지에서 CSV를 다운로드하면 다음 정보가 포함됩니다:

### 세션 정보
- `participantId`: 참가자 ID
- `groupId`: 그룹 ID (1-4)
- `conditionId`: 조건 ID (1-8)
- `advisorType`: AI 또는 Human
- `congruity`: Congruent 또는 Incongruent
- `advisorValence`: positive 또는 negative
- `publicValence`: positive 또는 negative
- `productOrder`: 제품 순서
- `completed`: 완료 여부
- `startTime`, `endTime`: 시작/종료 시간

### 자극물별 정보 (stim0, stim1, stim2)
각 자극물에 대해:
- `stim0_product`: 제품명 (예: protein)
- `stim0_groupId`: 그룹 ID
- `stim0_conditionId`: 조건 ID
- `stim0_advisorType`: AI/Human
- `stim0_congruity`: Congruent/Incongruent
- `stim0_advisorValence`: positive/negative
- `stim0_publicValence`: positive/negative
- `stim0_dwellTime`: 체류 시간
- `stim0_timestamp`: 노출 시간

### 회상 과제 정보 (recall0, recall1, recall2)
- `recall0_product`: 제품명
- `recall0_groupId`: 그룹 ID
- `recall0_conditionId`: 조건 ID
- `recall0_text`: 회상한 내용
- `recall0_time`: 회상 시간

### 설문 응답 (survey0, survey1, survey2)
- `survey0_product`: 제품명
- `survey0_groupId`: 그룹 ID
- `survey0_conditionId`: 조건 ID
- `survey0_advisorType`: AI/Human
- `survey0_congruity`: Congruent/Incongruent
- `survey0_mc_advisorType`: 조작 확인
- `survey0_argQuality_1`: 설문 항목 1
- ... (모든 설문 항목)

### 인구통계 정보
- `demo_age`, `demo_gender`, `demo_education`, etc.

## 조건 라벨 표기법

코드에서 조건을 표시할 때:

```
C{conditionId} (G{groupId}: {advisorType}/{congruity}/{advisorValence})
```

예시:
- `C1 (G1: AI/Congruent/positive)`
- `C5 (G3: Human/Congruent/positive)`
- `C8 (G4: Human/Incongruent/negative)`

제품까지 포함할 때:
- `C1 (G1: AI/Congruent/positive) - protein`
- `C3 (G2: AI/Incongruent/positive) - tissue`

## 관리자 페이지 표시

관리자 페이지에서는 다음과 같이 표시됩니다:

- **조건 (G/C)**: `G1/C1` (그룹 1, 조건 1)
- **Advisor**: 배지로 표시 (AI: 보라색, Human: 파란색)
- **Congruity**: 배지로 표시 (Congruent: 초록색, Incongruent: 주황색)
- **Valence**: 
  - `A:positive` (Advisor valence, 초록색)
  - `P:negative` (Public valence, 빨간색)
- **제품 순서**: `protein, tissue, soap`

이렇게 하면 각 참가자가 어떤 조건(8가지 중 하나)과 어떤 제품(3가지)을 받았는지 명확하게 확인할 수 있습니다.
