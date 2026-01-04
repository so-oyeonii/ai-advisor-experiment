# Database Schema for Survey Responses

## Table Structure: `survey_responses`

### Primary Keys and Identifiers
- `participant_id` (STRING): Unique identifier for each participant
- `stimulus_order` (INTEGER): Order of stimulus presentation (1, 2, or 3)
- `timestamp` (TIMESTAMP): When the response was submitted

### Experimental Condition Variables
- `condition_group` (STRING): Condition group (c1, c2, c3, c4, c5, c6, c7, c8)
- `product` (STRING): Product type (protein, toilet, soap)
- `advisor_type` (STRING): Type of advisor (ai, expert)
- `congruity` (STRING): Opinion congruity (match, nonmatch)
- `review_valence` (STRING): Valence of the featured review (positive, negative)

### Behavioral Measure
- `page_dwell_time` (FLOAT): Time spent on stimulus page in seconds (auto-recorded)

---

## Block A Variables (Repeated for Each Stimulus)

### Q0: Product Involvement (3 items)
- `involvement_1` (INTEGER): 1-7 scale
- `involvement_2` (INTEGER): 1-7 scale
- `involvement_3` (INTEGER): 1-7 scale

### Q1: Manipulation Checks (2 items)
- `manip_advisor_type` (STRING): ai | human | unsure
- `manip_review_valence` (STRING): positive | negative | neutral

### Q2: Attention Checks (2 items)
- `attention_congruity` (STRING): similar | different | unsure
- `attention_product` (STRING): protein | toilet | soap | unsure

### Q3: Recall Task (8 items)
- `recall_1` (TEXT): Open-ended response
- `recall_2` (TEXT): Open-ended response
- `recall_3` (TEXT): Open-ended response
- `recall_4` (TEXT): Open-ended response
- `recall_5` (TEXT): Open-ended response
- `recall_6` (TEXT): Open-ended response
- `recall_7` (TEXT): Open-ended response
- `recall_8` (TEXT): Open-ended response

### M1: Perceived Argument Quality (4 items)
- `arg_quality_1` (INTEGER): 1-7 scale
- `arg_quality_2` (INTEGER): 1-7 scale
- `arg_quality_3` (INTEGER): 1-7 scale
- `arg_quality_4` (INTEGER): 1-7 scale

### M2a: Source Credibility - Expertise (5 items)
- `credibility_expertise_1` (INTEGER): 1-7 scale
- `credibility_expertise_2` (INTEGER): 1-7 scale
- `credibility_expertise_3` (INTEGER): 1-7 scale
- `credibility_expertise_4` (INTEGER): 1-7 scale
- `credibility_expertise_5` (INTEGER): 1-7 scale

### M2b: Source Credibility - Trustworthiness (5 items)
- `credibility_trust_1` (INTEGER): 1-7 scale
- `credibility_trust_2` (INTEGER): 1-7 scale
- `credibility_trust_3` (INTEGER): 1-7 scale
- `credibility_trust_4` (INTEGER): 1-7 scale
- `credibility_trust_5` (INTEGER): 1-7 scale

### M3: Perceived Persuasive Intent (5 items)
- `ppi_1` (INTEGER): 1-7 scale
- `ppi_2` (INTEGER): 1-7 scale
- `ppi_3` (INTEGER): 1-7 scale
- `ppi_4` (INTEGER): 1-7 scale
- `ppi_5` (INTEGER): 1-7 scale

### MV5: Mind Perception (8 items)
- `mind_1` (INTEGER): 1-7 scale
- `mind_2` (INTEGER): 1-7 scale
- `mind_3` (INTEGER): 1-7 scale
- `mind_4` (INTEGER): 1-7 scale
- `mind_5` (INTEGER): 1-7 scale
- `mind_6` (INTEGER): 1-7 scale
- `mind_7` (INTEGER): 1-7 scale
- `mind_8` (INTEGER): 1-7 scale

### DV1: Perceived Persuasiveness (4 items)
- `persuasiveness_1` (INTEGER): 1-7 scale
- `persuasiveness_2` (INTEGER): 1-7 scale
- `persuasiveness_3` (INTEGER): 1-7 scale
- `persuasiveness_4` (INTEGER): 1-7 scale

### DV2: Purchase Intention (4 items)
- `purchase_1` (INTEGER): 1-7 scale
- `purchase_2` (INTEGER): 1-7 scale
- `purchase_3` (INTEGER): 1-7 scale
- `purchase_4` (INTEGER): 1-7 scale

### DV3: Decision Confidence (1 item)
- `confidence` (INTEGER): 1-7 scale

---

## General Questions (Same values across all 3 rows for each participant)

### Q7: AI Familiarity (3 items)
- `ai_familiarity_1` (INTEGER): 1-7 scale
- `ai_familiarity_2` (INTEGER): 1-7 scale
- `ai_familiarity_3` (INTEGER): 1-7 scale

### Q7: Review Skepticism (4 items)
- `review_skepticism_1` (INTEGER): 1-7 scale
- `review_skepticism_2` (INTEGER): 1-7 scale
- `review_skepticism_3` (INTEGER): 1-7 scale
- `review_skepticism_4` (INTEGER): 1-7 scale

### Q7: Attitude Toward AI (4 items)
- `ai_attitude_1` (INTEGER): 1-7 scale
- `ai_attitude_2` (INTEGER): 1-7 scale
- `ai_attitude_3` (INTEGER): 1-7 scale
- `ai_attitude_4` (INTEGER): 1-7 scale

### Q8: Shopping and AI Usage (2 items)
- `shopping_frequency` (STRING): less_than_weekly | 1_2_weekly | 3_4_weekly | daily
- `ai_usage_frequency` (STRING): never | less_than_monthly | weekly | daily

### Demographics (5 items)
- `gender` (STRING): male | female | other | prefer_not
- `gender_other` (TEXT): If "other" selected (nullable)
- `age` (INTEGER): Age in years
- `education` (STRING): high_school | undergrad_current | bachelors | grad_current | graduate
- `income` (STRING): under_10k | 10k_20k | 20k_30k | 30k_50k | 50k_75k | 75k_100k | over_100k | prefer_not
- `occupation` (STRING): office_worker | self_employed | government | professional | student | unemployed | freelancer | other
- `occupation_other` (TEXT): If "other" selected (nullable)

---

## Data Storage Rules

### Rule 1: Three Rows per Participant
Each participant creates 3 rows in the database (one for each stimulus).

**Example:**
```
participant_id | stimulus_order | product  | advisor_type | congruity
P001          | 1              | protein  | ai           | match
P001          | 2              | toilet   | expert       | nonmatch
P001          | 3              | soap     | ai           | nonmatch
```

### Rule 2: Stimulus-Specific Data
These columns have DIFFERENT values across the 3 rows:
- All Block A variables (Q0, Q1, Q2, Q3, M1, M2a, M2b, M3, MV5, DV1, DV2, DV3)
- `product`, `advisor_type`, `congruity`, `review_valence`
- `page_dwell_time`

### Rule 3: Participant-Level Data (Replicated)
These columns have the SAME values across all 3 rows for each participant:
- All Q7 variables (ai_familiarity_*, review_skepticism_*, ai_attitude_*)
- All Q8 variables (shopping_frequency, ai_usage_frequency)
- All Demographics (gender, age, education, income, occupation)
- `condition_group`

**Example:**
```
participant_id | stimulus_order | age | gender | ai_familiarity_1
P001          | 1              | 25  | male   | 5
P001          | 2              | 25  | male   | 5
P001          | 3              | 25  | male   | 5
```

### Rule 4: Condition Groups (c1~c8)
The `condition_group` determines which combination of conditions the participant sees:

```
Group | Stimulus 1        | Stimulus 2          | Stimulus 3
c1    | AI-Match          | Expert-NonMatch     | AI-NonMatch
c2    | AI-Match          | Expert-Match        | Expert-NonMatch
c3    | Expert-Match      | AI-NonMatch         | Expert-NonMatch
c4    | Expert-NonMatch   | AI-Match            | Expert-Match
c5    | AI-NonMatch       | Expert-Match        | AI-Match
c6    | Expert-NonMatch   | AI-NonMatch         | AI-Match
c7    | AI-NonMatch       | AI-Match            | Expert-Match
c8    | Expert-Match      | Expert-NonMatch     | AI-NonMatch
```

*Note: The actual condition assignment logic should be implemented in your randomization algorithm.*

---

## TypeScript Interface Definition

```typescript
interface SurveyResponse {
  // Primary Keys
  participant_id: string;
  stimulus_order: number; // 1, 2, or 3
  timestamp: Date;

  // Experimental Conditions
  condition_group: 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8';
  product: 'protein' | 'toilet' | 'soap';
  advisor_type: 'ai' | 'expert';
  congruity: 'match' | 'nonmatch';
  review_valence: 'positive' | 'negative';

  // Behavioral Measure
  page_dwell_time: number; // in seconds

  // Block A: Stimulus-Specific Responses
  involvement_1: number;
  involvement_2: number;
  involvement_3: number;

  manip_advisor_type: 'ai' | 'human' | 'unsure';
  manip_review_valence: 'positive' | 'negative' | 'neutral';

  attention_congruity: 'similar' | 'different' | 'unsure';
  attention_product: 'protein' | 'toilet' | 'soap' | 'unsure';

  recall_1: string;
  recall_2: string;
  recall_3: string;
  recall_4: string;
  recall_5: string;
  recall_6: string;
  recall_7: string;
  recall_8: string;

  arg_quality_1: number;
  arg_quality_2: number;
  arg_quality_3: number;
  arg_quality_4: number;

  credibility_expertise_1: number;
  credibility_expertise_2: number;
  credibility_expertise_3: number;
  credibility_expertise_4: number;
  credibility_expertise_5: number;

  credibility_trust_1: number;
  credibility_trust_2: number;
  credibility_trust_3: number;
  credibility_trust_4: number;
  credibility_trust_5: number;

  ppi_1: number;
  ppi_2: number;
  ppi_3: number;
  ppi_4: number;
  ppi_5: number;

  mind_1: number;
  mind_2: number;
  mind_3: number;
  mind_4: number;
  mind_5: number;
  mind_6: number;
  mind_7: number;
  mind_8: number;

  persuasiveness_1: number;
  persuasiveness_2: number;
  persuasiveness_3: number;
  persuasiveness_4: number;

  purchase_1: number;
  purchase_2: number;
  purchase_3: number;
  purchase_4: number;

  confidence: number;

  // General Questions (Same across all 3 rows)
  ai_familiarity_1: number;
  ai_familiarity_2: number;
  ai_familiarity_3: number;

  review_skepticism_1: number;
  review_skepticism_2: number;
  review_skepticism_3: number;
  review_skepticism_4: number;

  ai_attitude_1: number;
  ai_attitude_2: number;
  ai_attitude_3: number;
  ai_attitude_4: number;

  shopping_frequency: 'less_than_weekly' | '1_2_weekly' | '3_4_weekly' | 'daily';
  ai_usage_frequency: 'never' | 'less_than_monthly' | 'weekly' | 'daily';

  // Demographics (Same across all 3 rows)
  gender: 'male' | 'female' | 'other' | 'prefer_not';
  gender_other?: string;
  age: number;
  education: 'high_school' | 'undergrad_current' | 'bachelors' | 'grad_current' | 'graduate';
  income: 'under_10k' | '10k_20k' | '20k_30k' | '30k_50k' | '50k_75k' | '75k_100k' | 'over_100k' | 'prefer_not';
  occupation: 'office_worker' | 'self_employed' | 'government' | 'professional' | 'student' | 'unemployed' | 'freelancer' | 'other';
  occupation_other?: string;
}
```

---

## Firebase Firestore Collection Structure

### Collection: `survey_responses`

Document ID format: `{participant_id}_{stimulus_order}`

Example: `P001_1`, `P001_2`, `P001_3`

This ensures each stimulus response is stored as a separate document while maintaining the relationship through the participant_id.

### Query Examples

**Get all responses for a specific participant:**
```javascript
const responses = await db.collection('survey_responses')
  .where('participant_id', '==', 'P001')
  .orderBy('stimulus_order')
  .get();
```

**Get all responses for a specific condition:**
```javascript
const responses = await db.collection('survey_responses')
  .where('condition_group', '==', 'c1')
  .get();
```

**Get all AI advisor responses:**
```javascript
const responses = await db.collection('survey_responses')
  .where('advisor_type', '==', 'ai')
  .get();
```

---

## Data Export Format

When exporting data for analysis (e.g., to CSV), each row represents one stimulus response, resulting in 3 rows per participant.

**CSV Header Example:**
```
participant_id,stimulus_order,condition_group,product,advisor_type,congruity,page_dwell_time,involvement_1,involvement_2,...
```

**CSV Data Example:**
```
P001,1,c1,protein,ai,match,45.2,5,4,6,...
P001,2,c1,toilet,expert,nonmatch,52.8,3,3,4,...
P001,3,c1,soap,ai,nonmatch,38.1,4,5,5,...
```
