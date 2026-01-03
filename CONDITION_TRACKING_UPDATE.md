# 조건 정보 추가 업데이트 요약

## 변경 사항

### 1. Firebase 데이터 구조 개선

모든 데이터베이스 인터페이스에 **조건 식별 정보**를 추가했습니다:

#### `SessionData` 인터페이스
- ✅ `groupId`: 1-4 (4개 그룹 중 어느 그룹)
- ✅ `conditionId`: 1-8 (8개 조건 중 어느 조건)
- ✅ `advisorValence`: 'positive' | 'negative' (Advisor 리뷰 극성)
- ✅ `publicValence`: 'positive' | 'negative' (Public 리뷰 극성)

#### `StimulusExposureData` 인터페이스
- ✅ `productName`: 제품 이름 추가
- ✅ `groupId`: 이 자극물의 그룹 ID
- ✅ `conditionId`: 이 자극물의 조건 ID
- ✅ `advisorValence`: Advisor 극성
- ✅ `publicValence`: Public 극성

#### `RecallTaskData` 인터페이스
- ✅ `productName`: 제품 이름 추가
- ✅ `groupId`: 그룹 ID
- ✅ `conditionId`: 조건 ID
- ✅ `advisorValence`: Advisor 극성
- ✅ `publicValence`: Public 극성

#### `SurveyResponseData` 인터페이스
- ✅ `productName`: 제품 이름 추가
- ✅ `groupId`: 그룹 ID
- ✅ `conditionId`: 조건 ID
- ✅ `advisorValence`: Advisor 극성
- ✅ `publicValence`: Public 극성

### 2. 데이터 저장 로직 업데이트

#### `consent.tsx` (세션 시작)
- 새 `ExperimentCondition` 구조 적용
- `selectedStimuli` 배열에서 각 제품별 조건 추출
- 모든 조건 정보 Firebase에 저장

#### `stimulus/[id].tsx` (자극물 노출)
- 새 실험 구조에서 현재 자극물 정보 추출
- `sessionStorage`에 각 자극물의 전체 조건 저장
- Firebase 저장 시 `groupId`, `conditionId` 포함

#### `recall/[id].tsx` (회상 과제)
- 새 구조에서 조건 정보 추출
- 모든 조건 정보 포함하여 저장

#### `survey/[id].tsx` (설문)
- 새 구조에서 조건 정보 추출
- 모든 조건 정보 포함하여 저장

### 3. 관리자 페이지 개선

#### 데이터 병합 개선
- 세션: `groupId`, `conditionId`, valence 정보 추가
- 자극물: 제품명, 조건 ID 명확히 표시
- 회상/설문: 제품명, 조건 ID 포함

#### UI 개선
테이블에 다음 정보 추가:
- **조건 (G/C)**: `G1/C2` 형식으로 그룹과 조건 함께 표시
- **Valence**: Advisor와 Public의 극성 각각 표시
  - `A:positive` (초록색)
  - `P:negative` (빨간색)
- **제품 순서**: 전체 제품 순서 표시

#### CSV 내보내기 개선
각 데이터 포인트에 조건 정보 명확히 포함:
```
stim0_product, stim0_groupId, stim0_conditionId, stim0_advisorType, 
stim0_congruity, stim0_advisorValence, stim0_publicValence, ...
```

### 4. 유틸리티 함수 추가

`randomization.ts`에 추가:
- ✅ `getAllConditions()`: 8개 조건 전체 반환
- ✅ `getConditionById(id)`: ID로 특정 조건 찾기
- ✅ `getConditionsByGroup(groupId)`: 그룹별 조건 찾기
- ✅ `getConditionLabel(conditionId, product?)`: 조건 라벨 생성

### 5. 문서화

#### `DATABASE_STRUCTURE.md` 생성
- 8가지 조건 상세 설명
- 24가지 세부 조건 (8 × 3 제품) 설명
- Firebase 컬렉션별 필드 상세
- CSV 내보내기 형식 설명
- 조건 라벨 표기법

## 결과

### 데이터 추적 가능성
이제 각 데이터 포인트에서:
1. **어떤 그룹** (1-4) 조건인지
2. **어떤 조건** (1-8) 번호인지
3. **어떤 제품** (protein/tissue/soap)인지
4. **Advisor 극성**이 무엇인지
5. **Public 극성**이 무엇인지

모두 명확하게 식별할 수 있습니다.

### 관리자 페이지
실시간 대시보드에서 각 참가자의:
- 조건 번호 (G1/C2 형식)
- Advisor 타입 (AI/Human)
- Congruity (Congruent/Incongruent)
- 각 Valence (A:positive, P:negative)
- 제품 순서

모두 한눈에 확인 가능합니다.

### CSV 데이터
다운로드된 CSV 파일에서:
- 각 자극물(3개)의 완전한 조건 정보
- 각 회상 과제의 조건 정보
- 각 설문 응답의 조건 정보

모두 포함되어 분석이 용이합니다.

## 검증

모든 타입 체크 통과:
```bash
npx tsc --noEmit  # ✅ No errors
```

8개 조건 stimuli 검증:
```bash
npx tsx test-stimuli-summary.ts  # ✅ All conditions correct
```

## 24가지 조건 매트릭스

| Condition | Group | Advisor | Congruity | Product | 조건 ID |
|-----------|-------|---------|-----------|---------|--------|
| 1 | 1 | AI | Congruent | protein | C1-protein |
| 1 | 1 | AI | Congruent | tissue | C1-tissue |
| 1 | 1 | AI | Congruent | soap | C1-soap |
| 2 | 1 | AI | Congruent | protein | C2-protein |
| ... | ... | ... | ... | ... | ... |
| 8 | 4 | Human | Incongruent | protein | C8-protein |
| 8 | 4 | Human | Incongruent | tissue | C8-tissue |
| 8 | 4 | Human | Incongruent | soap | C8-soap |

**총 24개의 고유한 조건-제품 조합**이 모두 데이터베이스와 관리자 페이지에서 명확하게 추적됩니다!
