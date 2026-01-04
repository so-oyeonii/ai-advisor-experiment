# Condition Group Assignment Logic

## Overview
Each participant is randomly assigned to one of 8 condition groups (c1-c8). Each group determines which combination of conditions the participant will see across 3 stimuli.

## Experimental Factors
- **Advisor Type:** AI vs. Expert (Human)
- **Opinion Congruity:** Match vs. NonMatch
- **Product:** Protein, Toilet, Soap (randomized order)

## Condition Groups (c1-c8)

### Group c1
| Stimulus | Product | Advisor | Congruity |
|----------|---------|---------|-----------|
| 1 | Random | AI | Match |
| 2 | Random | Expert | NonMatch |
| 3 | Random | AI | NonMatch |

### Group c2
| Stimulus | Product | Advisor | Congruity |
|----------|---------|---------|-----------|
| 1 | Random | AI | Match |
| 2 | Random | Expert | Match |
| 3 | Random | Expert | NonMatch |

### Group c3
| Stimulus | Product | Advisor | Congruity |
|----------|---------|---------|-----------|
| 1 | Random | Expert | Match |
| 2 | Random | AI | NonMatch |
| 3 | Random | Expert | NonMatch |

### Group c4
| Stimulus | Product | Advisor | Congruity |
|----------|---------|---------|-----------|
| 1 | Random | Expert | NonMatch |
| 2 | Random | AI | Match |
| 3 | Random | Expert | Match |

### Group c5
| Stimulus | Product | Advisor | Congruity |
|----------|---------|---------|-----------|
| 1 | Random | AI | NonMatch |
| 2 | Random | Expert | Match |
| 3 | Random | AI | Match |

### Group c6
| Stimulus | Product | Advisor | Congruity |
|----------|---------|---------|-----------|
| 1 | Random | Expert | NonMatch |
| 2 | Random | AI | NonMatch |
| 3 | Random | AI | Match |

### Group c7
| Stimulus | Product | Advisor | Congruity |
|----------|---------|---------|-----------|
| 1 | Random | AI | NonMatch |
| 2 | Random | AI | Match |
| 3 | Random | Expert | Match |

### Group c8
| Stimulus | Product | Advisor | Congruity |
|----------|---------|---------|-----------|
| 1 | Random | Expert | Match |
| 2 | Random | Expert | NonMatch |
| 3 | Random | AI | NonMatch |

---

## Design Constraints

### Rule 1: Pattern Diversity
Each participant sees 3 different patterns from these 4 options:
- Type A (Match): Advisor(👍) + Public(👍)
- Type B (NonMatch): Advisor(👍) + Public(👎)
- Type C (NonMatch): Advisor(👎) + Public(👍)
- Type D (Match): Advisor(👎) + Public(👎)

**Important:** At least 2 of the 4 pattern types must appear (no repetition of all 3 stimuli from same pattern).

### Rule 2: Advisor Balance
Each participant must see:
- At least 1 AI advisor
- At least 1 Expert (Human) advisor

This ensures within-subject comparison capability.

### Rule 3: Product Randomization
The 3 products (Protein, Toilet, Soap) are randomly assigned to the 3 stimulus positions for each participant. This counterbalances product order effects.

---

## Implementation: TypeScript Code

### Step 1: Define Condition Templates

```typescript
type AdvisorType = 'ai' | 'expert';
type Congruity = 'match' | 'nonmatch';
type Product = 'protein' | 'toilet' | 'soap';

interface StimulusCondition {
  advisor: AdvisorType;
  congruity: Congruity;
}

const CONDITION_GROUPS: Record<string, StimulusCondition[]> = {
  c1: [
    { advisor: 'ai', congruity: 'match' },
    { advisor: 'expert', congruity: 'nonmatch' },
    { advisor: 'ai', congruity: 'nonmatch' },
  ],
  c2: [
    { advisor: 'ai', congruity: 'match' },
    { advisor: 'expert', congruity: 'match' },
    { advisor: 'expert', congruity: 'nonmatch' },
  ],
  c3: [
    { advisor: 'expert', congruity: 'match' },
    { advisor: 'ai', congruity: 'nonmatch' },
    { advisor: 'expert', congruity: 'nonmatch' },
  ],
  c4: [
    { advisor: 'expert', congruity: 'nonmatch' },
    { advisor: 'ai', congruity: 'match' },
    { advisor: 'expert', congruity: 'match' },
  ],
  c5: [
    { advisor: 'ai', congruity: 'nonmatch' },
    { advisor: 'expert', congruity: 'match' },
    { advisor: 'ai', congruity: 'match' },
  ],
  c6: [
    { advisor: 'expert', congruity: 'nonmatch' },
    { advisor: 'ai', congruity: 'nonmatch' },
    { advisor: 'ai', congruity: 'match' },
  ],
  c7: [
    { advisor: 'ai', congruity: 'nonmatch' },
    { advisor: 'ai', congruity: 'match' },
    { advisor: 'expert', congruity: 'match' },
  ],
  c8: [
    { advisor: 'expert', congruity: 'match' },
    { advisor: 'expert', congruity: 'nonmatch' },
    { advisor: 'ai', congruity: 'nonmatch' },
  ],
};
```

### Step 2: Randomize Condition Assignment

```typescript
function assignConditionGroup(): string {
  const groups = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
  const randomIndex = Math.floor(Math.random() * groups.length);
  return groups[randomIndex];
}
```

### Step 3: Randomize Product Order

```typescript
function randomizeProductOrder(): Product[] {
  const products: Product[] = ['protein', 'toilet', 'soap'];
  
  // Fisher-Yates shuffle
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j], products[i]];
  }
  
  return products;
}
```

### Step 4: Generate Complete Stimulus Set

```typescript
interface CompleteStimulus {
  stimulus_order: number;
  product: Product;
  advisor_type: AdvisorType;
  congruity: Congruity;
  review_valence: 'positive' | 'negative'; // Determined by congruity
}

function generateStimulusSet(conditionGroup: string): CompleteStimulus[] {
  const conditions = CONDITION_GROUPS[conditionGroup];
  const products = randomizeProductOrder();
  
  return conditions.map((condition, index) => ({
    stimulus_order: index + 1,
    product: products[index],
    advisor_type: condition.advisor,
    congruity: condition.congruity,
    review_valence: determineReviewValence(condition.congruity),
  }));
}

function determineReviewValence(congruity: Congruity): 'positive' | 'negative' {
  // This depends on your stimulus design
  // If match: both positive or both negative (randomly choose)
  // If nonmatch: advisor and reviews have opposite valences
  
  if (congruity === 'match') {
    return Math.random() < 0.5 ? 'positive' : 'negative';
  } else {
    // For nonmatch, the featured review will be opposite of customer reviews
    // This will be handled in the stimulus display logic
    return Math.random() < 0.5 ? 'positive' : 'negative';
  }
}
```

### Step 5: Initialize Participant

```typescript
interface ParticipantSession {
  participant_id: string;
  condition_group: string;
  stimuli: CompleteStimulus[];
  current_stimulus: number;
}

function initializeParticipant(): ParticipantSession {
  const participant_id = generateUUID();
  const condition_group = assignConditionGroup();
  const stimuli = generateStimulusSet(condition_group);
  
  return {
    participant_id,
    condition_group,
    stimuli,
    current_stimulus: 0,
  };
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

---

## Example Participant Flow

### Example 1: Participant P001 assigned to c1

**Initialization:**
```javascript
{
  participant_id: "P001",
  condition_group: "c1",
  stimuli: [
    { 
      stimulus_order: 1, 
      product: "toilet", 
      advisor_type: "ai", 
      congruity: "match",
      review_valence: "positive"
    },
    { 
      stimulus_order: 2, 
      product: "protein", 
      advisor_type: "expert", 
      congruity: "nonmatch",
      review_valence: "positive"
    },
    { 
      stimulus_order: 3, 
      product: "soap", 
      advisor_type: "ai", 
      congruity: "nonmatch",
      review_valence: "negative"
    }
  ]
}
```

**Survey Flow:**
1. Stimulus 1: AI + Toilet + Match → Both positive
2. Block A questions for Stimulus 1
3. Stimulus 2: Expert + Protein + NonMatch → Expert positive, reviews negative
4. Block A questions for Stimulus 2
5. Stimulus 3: AI + Soap + NonMatch → AI negative, reviews positive
6. Block A questions for Stimulus 3
7. General Questions (Q7, Q8)
8. Demographics
9. Submit → Creates 3 rows in Firebase

---

## Data Validation

After assignment, verify:

✅ **Balance Check**
```typescript
function validateConditionGroup(stimuli: CompleteStimulus[]): boolean {
  const advisors = stimuli.map(s => s.advisor_type);
  const hasAI = advisors.includes('ai');
  const hasExpert = advisors.includes('expert');
  
  if (!hasAI || !hasExpert) {
    console.error('Condition must include both AI and Expert');
    return false;
  }
  
  return true;
}
```

✅ **Uniqueness Check**
```typescript
function validateProductUniqueness(stimuli: CompleteStimulus[]): boolean {
  const products = stimuli.map(s => s.product);
  const uniqueProducts = new Set(products);
  
  if (uniqueProducts.size !== 3) {
    console.error('All 3 products must be different');
    return false;
  }
  
  return true;
}
```

✅ **Pattern Diversity Check**
```typescript
function validatePatternDiversity(stimuli: CompleteStimulus[]): boolean {
  const patterns = stimuli.map(s => `${s.advisor_type}-${s.congruity}`);
  const uniquePatterns = new Set(patterns);
  
  // Should have at least 2 different patterns
  if (uniquePatterns.size < 2) {
    console.error('Must have at least 2 different condition patterns');
    return false;
  }
  
  return true;
}
```

---

## Condition Balance Across Participants

To ensure balanced distribution:

### Track Assignment Counts
```typescript
interface ConditionCounts {
  [key: string]: number;
}

const conditionCounts: ConditionCounts = {
  c1: 0, c2: 0, c3: 0, c4: 0,
  c5: 0, c6: 0, c7: 0, c8: 0,
};

function assignConditionGroupBalanced(): string {
  // Find the least-assigned group(s)
  const minCount = Math.min(...Object.values(conditionCounts));
  const leastAssigned = Object.keys(conditionCounts).filter(
    key => conditionCounts[key] === minCount
  );
  
  // Randomly choose from least-assigned groups
  const chosen = leastAssigned[Math.floor(Math.random() * leastAssigned.length)];
  conditionCounts[chosen]++;
  
  return chosen;
}
```

### Save to Firebase
```typescript
async function saveConditionAssignment(participant_id: string, condition_group: string) {
  await db.collection('condition_assignments').doc(participant_id).set({
    participant_id,
    condition_group,
    assigned_at: new Date(),
  });
}
```

---

## Stimulus File Naming Convention

Based on the condition, load the appropriate stimulus image:

### File Naming Pattern
```
{product}_{advisor}_{valence}.png

Examples:
- protein_ai_positive.png
- protein_ai_negative.png
- protein_expert_positive.png
- protein_expert_negative.png
- toilet_ai_positive.png
- ...
```

### Dynamic Image Loading
```typescript
function getStimulusImagePath(stimulus: CompleteStimulus): string {
  const { product, advisor_type, review_valence } = stimulus;
  return `/stimuli/${product}_${advisor_type}_${review_valence}.png`;
}
```

---

## Testing Checklist

Before launch, verify:

- [ ] All 8 condition groups tested
- [ ] Product randomization working correctly
- [ ] Each group has at least 1 AI and 1 Expert
- [ ] All 3 products appear exactly once per participant
- [ ] Condition assignment tracking working
- [ ] Firebase saves correct condition_group
- [ ] Stimulus images load correctly for all combinations

---

## Debug Helper

```typescript
function printConditionSummary(participant: ParticipantSession) {
  console.log(`\n=== Participant ${participant.participant_id} ===`);
  console.log(`Condition Group: ${participant.condition_group}\n`);
  
  participant.stimuli.forEach((s, i) => {
    console.log(`Stimulus ${i + 1}:`);
    console.log(`  Product: ${s.product}`);
    console.log(`  Advisor: ${s.advisor_type}`);
    console.log(`  Congruity: ${s.congruity}`);
    console.log(`  Review Valence: ${s.review_valence}`);
    console.log('');
  });
  
  const aiCount = participant.stimuli.filter(s => s.advisor_type === 'ai').length;
  const expertCount = participant.stimuli.filter(s => s.advisor_type === 'expert').length;
  const matchCount = participant.stimuli.filter(s => s.congruity === 'match').length;
  const nonmatchCount = participant.stimuli.filter(s => s.congruity === 'nonmatch').length;
  
  console.log(`Summary:`);
  console.log(`  AI: ${aiCount}, Expert: ${expertCount}`);
  console.log(`  Match: ${matchCount}, NonMatch: ${nonmatchCount}`);
}
```

---

## Expected Distribution (240 Participants)

| Condition | Expected Count | Percentage |
|-----------|----------------|------------|
| c1 | 30 | 12.5% |
| c2 | 30 | 12.5% |
| c3 | 30 | 12.5% |
| c4 | 30 | 12.5% |
| c5 | 30 | 12.5% |
| c6 | 30 | 12.5% |
| c7 | 30 | 12.5% |
| c8 | 30 | 12.5% |
| **Total** | **240** | **100%** |

---

## Copilot Prompt for Implementation

```
Create a condition assignment service for the survey app based on CONDITION_ASSIGNMENT.md.

Requirements:
1. File path: /services/conditionAssignment.ts
2. Implement all functions from CONDITION_ASSIGNMENT.md:
   - assignConditionGroup()
   - randomizeProductOrder()
   - generateStimulusSet()
   - initializeParticipant()
3. Include validation functions:
   - validateConditionGroup()
   - validateProductUniqueness()
   - validatePatternDiversity()
4. Add Firebase integration for tracking assignments
5. Implement balanced assignment algorithm
6. Use TypeScript types from /types/survey.ts
7. Add comprehensive error handling
8. Include debug logging

Reference CONDITION_ASSIGNMENT.md for the complete logic.
```
