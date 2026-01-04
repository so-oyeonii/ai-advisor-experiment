# Variable Name Quick Reference

## 🎯 Quick Lookup Table

### Experimental Conditions
| Description | Variable Name | Type | Values |
|------------|---------------|------|--------|
| Participant ID | `participant_id` | string | UUID |
| Stimulus Order | `stimulus_order` | number | 1, 2, 3 |
| Condition Group | `condition_group` | string | c1-c8 |
| Product Type | `product` | string | protein, toilet, soap |
| Advisor Type | `advisor_type` | string | ai, expert |
| Opinion Congruity | `congruity` | string | match, nonmatch |
| Review Valence | `review_valence` | string | positive, negative |
| Page Dwell Time | `page_dwell_time` | number | seconds (float) |

---

## Block A: Stimulus-Specific Questions

### Q0: Product Involvement (3 items)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Q1 | `involvement_1` | 1-7 Likert |
| Q2 | `involvement_2` | 1-7 Likert |
| Q3 | `involvement_3` | 1-7 Likert |

### Q1: Manipulation Checks (2 items)
| Item | Variable Name | Type | Options |
|------|---------------|------|---------|
| Advisor Type | `manip_advisor_type` | categorical | ai, human, unsure |
| Review Valence | `manip_review_valence` | categorical | positive, negative, neutral |

### Q2: Attention Checks (2 items)
| Item | Variable Name | Type | Options |
|------|---------------|------|---------|
| Congruity | `attention_congruity` | categorical | similar, different, unsure |
| Product | `attention_product` | categorical | protein, toilet, soap, unsure |

### Q3: Recall Task (8 items)
| Item | Variable Name | Type |
|------|---------------|------|
| Recall 1 | `recall_1` | text |
| Recall 2 | `recall_2` | text |
| Recall 3 | `recall_3` | text |
| Recall 4 | `recall_4` | text |
| Recall 5 | `recall_5` | text |
| Recall 6 | `recall_6` | text |
| Recall 7 | `recall_7` | text |
| Recall 8 | `recall_8` | text |

### M1: Perceived Argument Quality (4 items)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Logical | `arg_quality_1` | 1-7 Likert |
| Convincing | `arg_quality_2` | 1-7 Likert |
| Relevant | `arg_quality_3` | 1-7 Likert |
| Strong | `arg_quality_4` | 1-7 Likert |

### M2a: Source Credibility - Expertise (5 items)
| Item | Variable Name | Scale | Bipolar Labels |
|------|---------------|-------|----------------|
| Expert | `credibility_expertise_1` | 1-7 | Not Expert --- Expert |
| Experienced | `credibility_expertise_2` | 1-7 | Inexperienced --- Experienced |
| Knowledgeable | `credibility_expertise_3` | 1-7 | Unknowledgeable --- Knowledgeable |
| Qualified | `credibility_expertise_4` | 1-7 | Unqualified --- Qualified |
| Skilled | `credibility_expertise_5` | 1-7 | Unskilled --- Skilled |

### M2b: Source Credibility - Trustworthiness (5 items)
| Item | Variable Name | Scale | Bipolar Labels |
|------|---------------|-------|----------------|
| Dependable | `credibility_trust_1` | 1-7 | Undependable --- Dependable |
| Honest | `credibility_trust_2` | 1-7 | Dishonest --- Honest |
| Reliable | `credibility_trust_3` | 1-7 | Unreliable --- Reliable |
| Sincere | `credibility_trust_4` | 1-7 | Insincere --- Sincere |
| Trustworthy | `credibility_trust_5` | 1-7 | Untrustworthy --- Trustworthy |

### M3: Perceived Persuasive Intent (5 items)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Trying to persuade | `ppi_1` | 1-7 Likert |
| Ulterior motive | `ppi_2` | 1-7 Likert |
| Suspicious | `ppi_3` | 1-7 Likert |
| Manipulate | `ppi_4` | 1-7 Likert |
| Exaggerate | `ppi_5` | 1-7 Likert |

### MV5: Mind Perception (8 items)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Feel pain | `mind_1` | 1-7 Likert |
| Feel pleasure | `mind_2` | 1-7 Likert |
| Experience emotions | `mind_3` | 1-7 Likert |
| Subjective experiences | `mind_4` | 1-7 Likert |
| Think | `mind_5` | 1-7 Likert |
| Plan actions | `mind_6` | 1-7 Likert |
| Self-control | `mind_7` | 1-7 Likert |
| Communicate intentions | `mind_8` | 1-7 Likert |

### DV1: Perceived Persuasiveness (4 items)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Changed opinion | `persuasiveness_1` | 1-7 Likert |
| Convinced | `persuasiveness_2` | 1-7 Likert |
| Influenced | `persuasiveness_3` | 1-7 Likert |
| Reconsider | `persuasiveness_4` | 1-7 Likert |

### DV2: Purchase Intention (4 items)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Desire to buy | `purchase_1` | 1-7 Likert |
| Consider buying | `purchase_2` | 1-7 Likert |
| Intend to try | `purchase_3` | 1-7 Likert |
| Future intent | `purchase_4` | 1-7 Likert |

### DV3: Decision Confidence (1 item)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Confidence level | `confidence` | 1-7 (Not confident --- Very confident) |

---

## General Questions (Same across all 3 rows)

### Q7: AI Familiarity (3 items)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Familiar with AI | `ai_familiarity_1` | 1-7 Likert |
| Regular use | `ai_familiarity_2` | 1-7 Likert |
| Understanding | `ai_familiarity_3` | 1-7 Likert |

### Q7: Review Skepticism (4 items)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Not truthful | `review_skepticism_1` | 1-7 Likert |
| Not real customers | `review_skepticism_2` | 1-7 Likert |
| Inaccurate | `review_skepticism_3` | 1-7 Likert |
| Fake names | `review_skepticism_4` | 1-7 Likert |

### Q7: Attitude Toward AI (4 items)
| Item | Variable Name | Scale |
|------|---------------|-------|
| Enhances shopping | `ai_attitude_1` | 1-7 Likert |
| Comfortable interacting | `ai_attitude_2` | 1-7 Likert |
| Trust suggestions | `ai_attitude_3` | 1-7 Likert |
| Accurate recommendations | `ai_attitude_4` | 1-7 Likert |

### Q8: Usage Frequency (2 items)
| Item | Variable Name | Type | Options |
|------|---------------|------|---------|
| Shopping frequency | `shopping_frequency` | categorical | less_than_weekly, 1_2_weekly, 3_4_weekly, daily |
| AI usage frequency | `ai_usage_frequency` | categorical | never, less_than_monthly, weekly, daily |

---

## Demographics (Same across all 3 rows)

| Item | Variable Name | Type | Options/Notes |
|------|---------------|------|---------------|
| Gender | `gender` | categorical | male, female, other, prefer_not |
| Gender (Other) | `gender_other` | text | Optional, if "other" selected |
| Age | `age` | number | Integer, 18-100 |
| Education | `education` | categorical | high_school, undergrad_current, bachelors, grad_current, graduate |
| Income | `income` | categorical | under_10k, 10k_20k, 20k_30k, 30k_50k, 50k_75k, 75k_100k, over_100k, prefer_not |
| Occupation | `occupation` | categorical | office_worker, self_employed, government, professional, student, unemployed, freelancer, other |
| Occupation (Other) | `occupation_other` | text | Optional, if "other" selected |

---

## Scale Type Legend

| Scale Type | Description | Range |
|------------|-------------|-------|
| **1-7 Likert** | 1 = Strongly Disagree, 7 = Strongly Agree | 1-7 |
| **1-7 Semantic Differential** | Bipolar labels (e.g., Not Expert --- Expert) | 1-7 |
| **1-7 Confidence** | 1 = Not at all confident, 7 = Very confident | 1-7 |
| **Categorical** | Multiple choice (specific options) | varies |
| **Text** | Open-ended text response | string |
| **Number** | Numeric input | integer/float |

---

## Component-to-Variable Mapping

### Phase 2 Components (Block A)
| Component File | Variables | Count |
|----------------|-----------|-------|
| `Q0_ProductInvolvement.tsx` | `involvement_1` to `involvement_3` | 3 |
| `Q1_ManipulationCheck.tsx` | `manip_advisor_type`, `manip_review_valence` | 2 |
| `Q2_AttentionCheck.tsx` | `attention_congruity`, `attention_product` | 2 |
| `Q3_RecallTask.tsx` | `recall_1` to `recall_8` | 8 |
| `M1_ArgumentQuality.tsx` | `arg_quality_1` to `arg_quality_4` | 4 |
| `M2a_SourceCredibilityExpertise.tsx` | `credibility_expertise_1` to `credibility_expertise_5` | 5 |
| `M2b_SourceCredibilityTrust.tsx` | `credibility_trust_1` to `credibility_trust_5` | 5 |
| `M3_PersuasiveIntent.tsx` | `ppi_1` to `ppi_5` | 5 |
| `MV5_MindPerception.tsx` | `mind_1` to `mind_8` | 8 |
| `DV1_Persuasiveness.tsx` | `persuasiveness_1` to `persuasiveness_4` | 4 |
| `DV2_PurchaseIntention.tsx` | `purchase_1` to `purchase_4` | 4 |
| `DV3_DecisionConfidence.tsx` | `confidence` | 1 |
| **Total Block A Variables** | | **51** |

### Phase 3 Components (General Questions)
| Component File | Variables | Count |
|----------------|-----------|-------|
| `Q7_AIFamiliarity.tsx` | `ai_familiarity_1` to `ai_familiarity_3` | 3 |
| `Q7_ReviewSkepticism.tsx` | `review_skepticism_1` to `review_skepticism_4` | 4 |
| `Q7_AttitudeTowardAI.tsx` | `ai_attitude_1` to `ai_attitude_4` | 4 |
| `Q8_UsageFrequency.tsx` | `shopping_frequency`, `ai_usage_frequency` | 2 |
| **Total General Variables** | | **13** |

### Phase 4 Components (Demographics)
| Component File | Variables | Count |
|----------------|-----------|-------|
| `Demographics.tsx` | `gender`, `gender_other`, `age`, `education`, `income`, `occupation`, `occupation_other` | 7 |

---

## Data Collection Summary

### Per Participant
- **Total Rows in Database:** 3 (one per stimulus)
- **Total Variables per Row:** 51 (Block A) + 13 (General) + 7 (Demographics) + 8 (Conditions) = **79 columns**
- **Unique Responses:** 51 × 3 = 153 stimulus-specific + 20 general = **173 total responses**

### Storage Pattern
```
Row 1: participant_001_1 → Stimulus 1 data + General + Demographics
Row 2: participant_001_2 → Stimulus 2 data + General + Demographics (same)
Row 3: participant_001_3 → Stimulus 3 data + General + Demographics (same)
```

---

## Validation Checklist

Before going live, verify:

✅ **Variable Names**
- [ ] All Block A variables match schema (51 total)
- [ ] All General variables match schema (13 total)
- [ ] All Demographics variables match schema (7 total)
- [ ] No typos or deviations

✅ **Question Wording**
- [ ] Every question matches SURVEY_QUESTIONS.md exactly
- [ ] Scale labels are correct (Likert vs Semantic Differential)
- [ ] All instructions included

✅ **Data Structure**
- [ ] Test creates exactly 3 rows per participant
- [ ] General questions identical across 3 rows
- [ ] Block A questions different across 3 rows
- [ ] Condition variables correctly assigned

✅ **Validation**
- [ ] All required fields enforced
- [ ] Scale ranges validated (1-7)
- [ ] Age range validated (18-100)
- [ ] Conditional fields work (Other text boxes)

---

## Quick Copy-Paste

### All Block A Variable Names (for TypeScript interface)
```typescript
involvement_1, involvement_2, involvement_3,
manip_advisor_type, manip_review_valence,
attention_congruity, attention_product,
recall_1, recall_2, recall_3, recall_4, recall_5, recall_6, recall_7, recall_8,
arg_quality_1, arg_quality_2, arg_quality_3, arg_quality_4,
credibility_expertise_1, credibility_expertise_2, credibility_expertise_3, credibility_expertise_4, credibility_expertise_5,
credibility_trust_1, credibility_trust_2, credibility_trust_3, credibility_trust_4, credibility_trust_5,
ppi_1, ppi_2, ppi_3, ppi_4, ppi_5,
mind_1, mind_2, mind_3, mind_4, mind_5, mind_6, mind_7, mind_8,
persuasiveness_1, persuasiveness_2, persuasiveness_3, persuasiveness_4,
purchase_1, purchase_2, purchase_3, purchase_4,
confidence
```

### All General Question Variable Names
```typescript
ai_familiarity_1, ai_familiarity_2, ai_familiarity_3,
review_skepticism_1, review_skepticism_2, review_skepticism_3, review_skepticism_4,
ai_attitude_1, ai_attitude_2, ai_attitude_3, ai_attitude_4,
shopping_frequency, ai_usage_frequency
```

### All Demographics Variable Names
```typescript
gender, gender_other, age, education, income, occupation, occupation_other
```

### All Condition Variable Names
```typescript
participant_id, stimulus_order, condition_group, product, advisor_type, congruity, review_valence, page_dwell_time
```
