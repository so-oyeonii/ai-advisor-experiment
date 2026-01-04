# GitHub Copilot Implementation Guide

## 📋 Prerequisites

Before starting, make sure you have:
1. ✅ SURVEY_QUESTIONS.md file in your project
2. ✅ DATABASE_SCHEMA.md file in your project
3. ✅ Existing Next.js survey app with:
   - Stimulus presentation pages
   - Recall task pages
   - Firebase integration

---

## 🎯 Implementation Strategy

We'll work in **6 sequential phases**, with each phase having specific Copilot prompts.

### Phase 1: Create TypeScript Types
### Phase 2: Update Survey Components (Block A - Stimulus-Specific)
### Phase 3: Update Survey Components (General Questions)
### Phase 4: Update Survey Components (Demographics)
### Phase 5: Implement Data Collection Logic
### Phase 6: Test and Validate

---

## Phase 1: Create TypeScript Types

### Step 1.1: Create Types File

**Copilot Prompt:**
```
Create a TypeScript types file based on DATABASE_SCHEMA.md. 

Requirements:
1. File path: /types/survey.ts
2. Include all interfaces from the DATABASE_SCHEMA.md
3. Create separate types for:
   - SurveyResponse (main interface)
   - BlockAResponse (stimulus-specific questions)
   - GeneralQuestionsResponse (Q7, Q8)
   - DemographicsResponse
   - ExperimentalCondition
4. Add proper JSDoc comments
5. Export all types

Use DATABASE_SCHEMA.md as the source of truth.
```

**Expected Output:** `/types/survey.ts`

---

### Step 1.2: Create Question Configuration

**Copilot Prompt:**
```
Create a question configuration file based on SURVEY_QUESTIONS.md.

Requirements:
1. File path: /config/surveyQuestions.ts
2. Create a constant object that maps each question section to:
   - Question text
   - Variable name
   - Scale type (likert7, categorical, text, etc.)
   - Options (for multiple choice)
3. Organize by sections: Q0, Q1, Q2, Q3, M1, M2a, M2b, M3, MV5, DV1, DV2, DV3, Q7, Q8, Demographics
4. Use TypeScript for type safety
5. Export as const for immutability

Use SURVEY_QUESTIONS.md as the source of truth. Keep the exact wording.
```

**Expected Output:** `/config/surveyQuestions.ts`

---

## Phase 2: Update Survey Components (Block A)

### Step 2.1: Product Involvement (Q0)

**Copilot Prompt:**
```
Create a React component for Product Involvement questions (Q0) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/Q0_ProductInvolvement.tsx
2. Use the question configuration from /config/surveyQuestions.ts
3. Implement 7-point Likert scale (1 = Strongly Disagree, 7 = Strongly Agree)
4. Store responses in state with variable names: involvement_1, involvement_2, involvement_3
5. Props should include:
   - onComplete: callback with responses
   - product: string (to customize the question)
6. Add form validation (all required)
7. Use Tailwind CSS for styling
8. Make it mobile-responsive

Refer to SURVEY_QUESTIONS.md for exact question wording.
```

**Expected Output:** `/components/survey/Q0_ProductInvolvement.tsx`

---

### Step 2.2: Manipulation Checks (Q1)

**Copilot Prompt:**
```
Create a React component for Manipulation Checks (Q1) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/Q1_ManipulationCheck.tsx
2. Implement two multiple-choice questions:
   - Q1-1: Advisor Type (manip_advisor_type)
   - Q1-2: Review Valence (manip_review_valence)
3. Use radio buttons for options
4. Store responses with exact variable names from DATABASE_SCHEMA.md
5. Props should include onComplete callback
6. Add validation (both required)
7. Style with Tailwind CSS

Use exact question text and options from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/Q1_ManipulationCheck.tsx`

---

### Step 2.3: Attention Checks (Q2)

**Copilot Prompt:**
```
Create a React component for Attention Checks (Q2) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/Q2_AttentionCheck.tsx
2. Implement two multiple-choice questions:
   - Q2-1: Congruity Check (attention_congruity)
   - Q2-2: Product Recognition (attention_product)
3. Add a warning banner for Q2-2: "⚠️ Participants who fail this attention check will not receive compensation"
4. Store responses with exact variable names
5. Props: onComplete callback, product (for validation)
6. Style with Tailwind CSS

Use exact question text from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/Q2_AttentionCheck.tsx`

---

### Step 2.4: Recall Task (Q3)

**Copilot Prompt:**
```
Create a React component for Recall Task (Q3) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/Q3_RecallTask.tsx
2. Implement 8 text input fields (recall_1 through recall_8)
3. Add a 90-second countdown timer
4. Auto-advance when timer expires
5. Display instructions clearly
6. Store responses with exact variable names
7. Props: onComplete callback
8. Style with Tailwind CSS
9. Show timer prominently

Use exact question text and instructions from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/Q3_RecallTask.tsx`

---

### Step 2.5: Argument Quality (M1)

**Copilot Prompt:**
```
Create a React component for Perceived Argument Quality (M1) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/M1_ArgumentQuality.tsx
2. Implement 4 questions with 7-point Likert scale
3. Variable names: arg_quality_1 through arg_quality_4
4. Display scale labels: 1 = Strongly Disagree, 7 = Strongly Agree
5. Include question header from SURVEY_QUESTIONS.md
6. Props: onComplete callback
7. Add validation (all required)
8. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/M1_ArgumentQuality.tsx`

---

### Step 2.6: Source Credibility - Expertise (M2a)

**Copilot Prompt:**
```
Create a React component for Source Credibility - Expertise (M2a) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/M2a_SourceCredibilityExpertise.tsx
2. Implement 5 semantic differential scales (1-7)
3. Variable names: credibility_expertise_1 through credibility_expertise_5
4. Display bipolar labels (e.g., "Not Expert --- Expert")
5. Use slider or radio buttons for 7-point scale
6. Include question header
7. Props: onComplete callback
8. Validation required
9. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/M2a_SourceCredibilityExpertise.tsx`

---

### Step 2.7: Source Credibility - Trustworthiness (M2b)

**Copilot Prompt:**
```
Create a React component for Source Credibility - Trustworthiness (M2b) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/M2b_SourceCredibilityTrust.tsx
2. Implement 5 semantic differential scales (1-7)
3. Variable names: credibility_trust_1 through credibility_trust_5
4. Display bipolar labels (e.g., "Undependable --- Dependable")
5. Match the styling of M2a component
6. Include question header
7. Props: onComplete callback
8. Validation required
9. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/M2b_SourceCredibilityTrust.tsx`

---

### Step 2.8: Perceived Persuasive Intent (M3)

**Copilot Prompt:**
```
Create a React component for Perceived Persuasive Intent (M3) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/M3_PersuasiveIntent.tsx
2. Implement 5 questions with 7-point Likert scale
3. Variable names: ppi_1 through ppi_5
4. Scale: 1 = Strongly Disagree, 7 = Strongly Agree
5. Include question header
6. Props: onComplete callback
7. Validation required
8. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/M3_PersuasiveIntent.tsx`

---

### Step 2.9: Mind Perception (MV5)

**Copilot Prompt:**
```
Create a React component for Mind Perception (MV5) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/MV5_MindPerception.tsx
2. Implement 8 questions with 7-point Likert scale
3. Variable names: mind_1 through mind_8
4. Scale: 1 = Strongly Disagree, 7 = Strongly Agree
5. Include question header
6. Props: onComplete callback
7. Validation required
8. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/MV5_MindPerception.tsx`

---

### Step 2.10: Perceived Persuasiveness (DV1)

**Copilot Prompt:**
```
Create a React component for Perceived Persuasiveness (DV1) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/DV1_Persuasiveness.tsx
2. Implement 4 questions with 7-point Likert scale
3. Variable names: persuasiveness_1 through persuasiveness_4
4. Scale: 1 = Strongly Disagree, 7 = Strongly Agree
5. Include question header
6. Props: onComplete callback
7. Validation required
8. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/DV1_Persuasiveness.tsx`

---

### Step 2.11: Purchase Intention (DV2)

**Copilot Prompt:**
```
Create a React component for Purchase Intention (DV2) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/DV2_PurchaseIntention.tsx
2. Implement 4 questions with 7-point Likert scale
3. Variable names: purchase_1 through purchase_4
4. Scale: 1 = Strongly Disagree, 7 = Strongly Agree
5. Include question header AND the important warning note
6. Props: onComplete callback
7. Validation required
8. Style with Tailwind CSS
9. Make the warning note visually prominent (yellow background or similar)

Use exact question wording and warning from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/DV2_PurchaseIntention.tsx`

---

### Step 2.12: Decision Confidence (DV3)

**Copilot Prompt:**
```
Create a React component for Decision Confidence (DV3) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/DV3_DecisionConfidence.tsx
2. Implement single-item 7-point scale
3. Variable name: confidence
4. Scale: 1 = Not at all confident, 7 = Very confident
5. Include question text
6. Props: onComplete callback
7. Validation required
8. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/DV3_DecisionConfidence.tsx`

---

## Phase 3: Update Survey Components (General Questions)

### Step 3.1: AI Familiarity

**Copilot Prompt:**
```
Create a React component for AI Familiarity (Q7 - Part 1) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/Q7_AIFamiliarity.tsx
2. Implement 3 questions with 7-point Likert scale
3. Variable names: ai_familiarity_1, ai_familiarity_2, ai_familiarity_3
4. Include question header
5. Props: onComplete callback with responses
6. Validation required
7. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/Q7_AIFamiliarity.tsx`

---

### Step 3.2: Review Skepticism

**Copilot Prompt:**
```
Create a React component for Review Skepticism (Q7 - Part 2) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/Q7_ReviewSkepticism.tsx
2. Implement 4 questions with 7-point Likert scale
3. Variable names: review_skepticism_1 through review_skepticism_4
4. Include question header
5. Props: onComplete callback
6. Validation required
7. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/Q7_ReviewSkepticism.tsx`

---

### Step 3.3: Attitude Toward AI

**Copilot Prompt:**
```
Create a React component for Attitude Toward AI (Q7 - Part 3) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/Q7_AttitudeTowardAI.tsx
2. Implement 4 questions with 7-point Likert scale
3. Variable names: ai_attitude_1 through ai_attitude_4
4. Include question header
5. Props: onComplete callback
6. Validation required
7. Style with Tailwind CSS

Use exact question wording from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/Q7_AttitudeTowardAI.tsx`

---

### Step 3.4: Shopping and AI Usage

**Copilot Prompt:**
```
Create a React component for Shopping & AI Usage (Q8) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/Q8_UsageFrequency.tsx
2. Implement 2 multiple-choice questions:
   - Online shopping frequency (shopping_frequency)
   - Generative AI usage frequency (ai_usage_frequency)
3. Use radio buttons with exact options from SURVEY_QUESTIONS.md
4. Props: onComplete callback
5. Validation required
6. Style with Tailwind CSS

Use exact question wording and options from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/Q8_UsageFrequency.tsx`

---

## Phase 4: Update Demographics Components

### Step 4.1: All Demographics

**Copilot Prompt:**
```
Create a React component for Demographics (D1-D5) based on SURVEY_QUESTIONS.md.

Requirements:
1. Component path: /components/survey/Demographics.tsx
2. Implement all 5 demographic questions:
   - D1: Gender (with "Other" text field if selected)
   - D2: Age (numeric input)
   - D3: Education Level (dropdown or radio)
   - D4: Annual Income (dropdown or radio)
   - D5: Occupation (with "Other" text field if selected)
3. Use exact variable names from DATABASE_SCHEMA.md
4. Props: onComplete callback
5. Validation:
   - All required except gender_other and occupation_other
   - Age must be numeric and reasonable (18-100)
6. Style with Tailwind CSS
7. Organize in a clean, vertical layout

Use exact question wording and options from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/components/survey/Demographics.tsx`

---

## Phase 5: Implement Data Collection Logic

### Step 5.1: Create Survey State Manager

**Copilot Prompt:**
```
Create a React context for managing survey state based on DATABASE_SCHEMA.md.

Requirements:
1. File path: /contexts/SurveyContext.tsx
2. Manage state for:
   - participant_id (auto-generated UUID)
   - current_stimulus (1, 2, or 3)
   - condition_group (c1-c8, assigned at start)
   - All stimulus-specific responses (Block A)
   - General questions responses (stored once, applied to all 3 rows)
   - Demographics (stored once, applied to all 3 rows)
3. Methods:
   - initializeSurvey() - generates participant_id, assigns condition
   - saveBlockAResponse(stimulus_order, responses)
   - saveGeneralQuestions(responses)
   - saveDemographics(responses)
   - submitAllResponses() - creates 3 rows in Firebase
4. Use the SurveyResponse interface from /types/survey.ts
5. Track page dwell time automatically

Reference DATABASE_SCHEMA.md for the 3-row storage pattern.
```

**Expected Output:** `/contexts/SurveyContext.tsx`

---

### Step 5.2: Create Firebase Service

**Copilot Prompt:**
```
Create a Firebase service for saving survey responses based on DATABASE_SCHEMA.md.

Requirements:
1. File path: /services/surveyService.ts
2. Functions:
   - saveSurveyResponse(response: SurveyResponse): Promise<void>
   - createThreeRows(
       participant_id,
       blockA_responses_array, // 3 sets
       general_questions,
       demographics,
       condition_info
     ): Promise<void>
3. Document ID format: {participant_id}_{stimulus_order}
4. Implement the 3-row storage pattern:
   - Block A data: different for each row
   - General questions: same for all 3 rows
   - Demographics: same for all 3 rows
5. Add error handling and retry logic
6. Use TypeScript types from /types/survey.ts

Reference DATABASE_SCHEMA.md for schema details.
```

**Expected Output:** `/services/surveyService.ts`

---

### Step 5.3: Update Main Survey Flow

**Copilot Prompt:**
```
Update the main survey page to orchestrate the survey flow.

Requirements:
1. File path: /pages/survey/index.tsx (or app/survey/page.tsx)
2. Flow:
   a. Welcome & Consent
   b. For each of 3 stimuli:
      - Show stimulus page (with dwell time tracking)
      - Block A questions (Q0, Q1, Q2, Q3, M1, M2a, M2b, M3, MV5, DV1, DV2, DV3)
   c. General Questions (Q7, Q8) - show ONCE after all stimuli
   d. Demographics - show ONCE
   e. Debriefing
   f. Submit all data (create 3 rows)
3. Use components created in Phase 2-4
4. Integrate with SurveyContext
5. Add progress indicator
6. Handle navigation (can't go back)
7. Auto-save progress to localStorage

Use the survey flow from SURVEY_QUESTIONS.md.
```

**Expected Output:** `/pages/survey/index.tsx`

---

### Step 5.4: Create Page Dwell Time Tracker

**Copilot Prompt:**
```
Create a React hook for tracking page dwell time.

Requirements:
1. File path: /hooks/usePageDwellTime.ts
2. Track time from component mount to unmount
3. Return: { startTimer, stopTimer, dwellTime }
4. Automatically stop on unmount
5. Store time in seconds (float)
6. Use TypeScript

This will be used on stimulus pages to track page_dwell_time.
```

**Expected Output:** `/hooks/usePageDwellTime.ts`

---

### Step 5.5: Update Stimulus Pages

**Copilot Prompt:**
```
Update existing stimulus display pages to track dwell time.

Requirements:
1. Integrate usePageDwellTime hook
2. Start timer when page loads
3. Stop timer when participant advances
4. Pass dwell time to SurveyContext when saving response
5. Ensure timer accuracy (handle tab switching, page visibility)

Apply this to all 3 stimulus display pages.
```

---

## Phase 6: Test and Validate

### Step 6.1: Create Test Data Generator

**Copilot Prompt:**
```
Create a test data generator script for validation.

Requirements:
1. File path: /scripts/testDataGenerator.ts
2. Generate sample responses following DATABASE_SCHEMA.md
3. Create responses for all 8 condition groups (c1-c8)
4. Validate:
   - All required fields present
   - Correct data types
   - Value ranges (1-7 for Likert)
   - 3 rows per participant
   - General questions identical across 3 rows
5. Export to JSON for inspection

Use this to test the data structure before going live.
```

**Expected Output:** `/scripts/testDataGenerator.ts`

---

### Step 6.2: Validation Checklist

**Copilot Prompt:**
```
Create a validation checklist component to verify survey completeness.

Requirements:
1. File path: /components/admin/ValidationChecklist.tsx
2. Check:
   ✓ All question components implemented
   ✓ Exact question wording matches SURVEY_QUESTIONS.md
   ✓ Correct variable names from DATABASE_SCHEMA.md
   ✓ 3-row data structure working
   ✓ General questions replicated correctly
   ✓ Condition randomization working
   ✓ Page dwell time tracking working
   ✓ Firebase integration working
3. Display results in admin panel
4. Color-code status (green/yellow/red)

This is for testing before launch.
```

**Expected Output:** `/components/admin/ValidationChecklist.tsx`

---

## 📊 Final Verification Steps

After completing all phases, manually verify:

1. **Question Accuracy:**
   - [ ] Open SURVEY_QUESTIONS.md and each component side-by-side
   - [ ] Verify exact wording matches (not a single word different)
   - [ ] Check all scale labels are correct

2. **Variable Names:**
   - [ ] Cross-reference all variable names with DATABASE_SCHEMA.md
   - [ ] Ensure no typos or deviations

3. **Data Structure:**
   - [ ] Test with one participant
   - [ ] Check Firebase: should create exactly 3 documents
   - [ ] Verify general questions are identical in all 3 rows
   - [ ] Verify Block A questions differ across rows
   - [ ] Check condition_group assignment

4. **Condition Logic:**
   - [ ] Test all 8 condition groups (c1-c8)
   - [ ] Verify correct stimulus assignments
   - [ ] Check advisor_type and congruity flags

5. **User Experience:**
   - [ ] Test on mobile devices
   - [ ] Verify all validation works
   - [ ] Check progress saving
   - [ ] Test timer functionality

---

## 🚨 Common Pitfalls to Avoid

1. **Don't modify question wording** - Use exact text from SURVEY_QUESTIONS.md
2. **Don't change variable names** - Use exact names from DATABASE_SCHEMA.md
3. **Don't forget the 3-row structure** - Each participant = 3 rows
4. **Don't skip validation** - All questions should be required unless specified
5. **Don't forget dwell time tracking** - Must be automatic on stimulus pages
6. **Don't mix up scales** - Check if it's Likert (Disagree-Agree) vs Semantic Differential (Bipolar)

---

## 📞 Getting Help from Copilot

If Copilot's response is not correct:

1. **Be specific:** Reference the exact section in SURVEY_QUESTIONS.md or DATABASE_SCHEMA.md
2. **Show examples:** Paste the expected output format
3. **Iterate:** Ask Copilot to "revise the previous response to..."
4. **Break it down:** If a component is complex, ask for one section at a time

Example refinement prompt:
```
The M2a component you created uses Likert scale labels, but according to SURVEY_QUESTIONS.md, 
it should use semantic differential labels (e.g., "Not Expert --- Expert"). 
Please revise to use bipolar labels with the exact wording from SURVEY_QUESTIONS.md.
```

---

## ✅ Success Criteria

You're done when:
- [ ] All 12 Block A components created (Q0 through DV3)
- [ ] All 4 general question components created (Q7 parts 1-3, Q8)
- [ ] Demographics component created
- [ ] SurveyContext managing state correctly
- [ ] Firebase service saving 3 rows per participant
- [ ] Dwell time tracking working
- [ ] Test participant creates exactly 3 Firebase documents
- [ ] General questions identical in all 3 rows
- [ ] Block A questions different in each row
- [ ] All 8 condition groups tested and working

Good luck! 🚀
