# Survey Questions Definition

## Block A: Repeated for Each Stimulus (3 times per participant)

### Q0: Product Involvement
**Scale:** 1 = Strongly Disagree, 7 = Strongly Agree  
**Variable Prefix:** `involvement_`

1. `involvement_1`: I have a strong interest in this product.
2. `involvement_2`: This product is important to me.
3. `involvement_3`: I pay close attention to information related to this product.

---

### Q1: Manipulation Checks

#### Q1-1: Advisor Type Check
**Variable:** `manip_advisor_type`  
**Type:** Multiple choice (categorical)

**Question:** Who wrote the FEATURED REVIEW shown at the TOP of the product page?

**Options:**
- `ai`: An Artificial Intelligence (AI) System
- `human`: A Human Expert (or Reviewer)
- `unsure`: I am not sure

#### Q1-2: Review Valence Check
**Variable:** `manip_review_valence`  
**Type:** Multiple choice (categorical)

**Question:** Overall, was the FEATURED REVIEW positive or negative about the product?

**Options:**
- `positive`: Mostly positive (recommended the product)
- `negative`: Mostly negative (did not recommend the product)
- `neutral`: Neutral / I don't remember

---

### Q2: Attention Checks

#### Q2-1: Congruity Check
**Variable:** `attention_congruity`  
**Type:** Multiple choice (categorical)

**Question:** How did the FEATURED REVIEW at the top compare to the CUSTOMER REVIEWS below it?

**Options:**
- `similar`: They were mostly similar/consistent with each other
- `different`: They were mostly different/inconsistent with each other
- `unsure`: I'm not sure / I don't remember

#### Q2-2: Product Recognition
**Variable:** `attention_product`  
**Type:** Multiple choice (categorical)

**Question:** What type of product was shown on the page you just viewed?

**Options:**
- `protein`: Protein powder
- `toilet`: Toilet paper
- `soap`: Hand soap
- `unsure`: I don't remember

**Note:** ⚠️ Participants who fail this attention check will not receive compensation.

---

### Q3: Recall Task
**Variable Prefix:** `recall_`  
**Type:** Open-ended text (8 fields)  
**Time Limit:** 90 seconds

**Question:** Please recall the set of reviews you just read and list as many information points as you can remember.

Examples include product features, advantages and disadvantages, usage experiences, specifications or numerical information, comparisons, and cautions.

**Please write one point per box within 90 seconds:**

1. `recall_1`: [Text box]
2. `recall_2`: [Text box]
3. `recall_3`: [Text box]
4. `recall_4`: [Text box]
5. `recall_5`: [Text box]
6. `recall_6`: [Text box]
7. `recall_7`: [Text box]
8. `recall_8`: [Text box]

---

### M1: Perceived Argument Quality
**Scale:** 1 = Strongly Disagree, 7 = Strongly Agree  
**Variable Prefix:** `arg_quality_`

**Question:** Please evaluate the argument in the FEATURED REVIEW shown at the top.

1. `arg_quality_1`: The argument in the featured review is logical.
2. `arg_quality_2`: The argument in the featured review is convincing.
3. `arg_quality_3`: The argument in the featured review is relevant.
4. `arg_quality_4`: The argument in the featured review is strong.

---

### M2a: Source Credibility - Expertise
**Scale:** 1 = Not at all, 7 = Very much  
**Variable Prefix:** `credibility_expertise_`

**Question:** The following questions are about the SOURCE (reviewer) who created the FEATURED REVIEW at the top. Please rate the source (reviewer) on the following dimensions:

1. `credibility_expertise_1`: Not Expert (1) --- Expert (7)
2. `credibility_expertise_2`: Inexperienced (1) --- Experienced (7)
3. `credibility_expertise_3`: Unknowledgeable (1) --- Knowledgeable (7)
4. `credibility_expertise_4`: Unqualified (1) --- Qualified (7)
5. `credibility_expertise_5`: Unskilled (1) --- Skilled (7)

---

### M2b: Source Credibility - Trustworthiness
**Scale:** 1 = Not at all, 7 = Very much  
**Variable Prefix:** `credibility_trust_`

**Question:** Thinking about the source (reviewer) of the FEATURED REVIEW at the top, please rate:

1. `credibility_trust_1`: Undependable (1) --- Dependable (7)
2. `credibility_trust_2`: Dishonest (1) --- Honest (7)
3. `credibility_trust_3`: Unreliable (1) --- Reliable (7)
4. `credibility_trust_4`: Insincere (1) --- Sincere (7)
5. `credibility_trust_5`: Untrustworthy (1) --- Trustworthy (7)

---

### M3: Perceived Persuasive Intent (PPI)
**Scale:** 1 = Strongly Disagree, 7 = Strongly Agree  
**Variable Prefix:** `ppi_`

**Question:** The following questions are about the SOURCE (reviewer) who created the FEATURED REVIEW shown at the top of the product page. Please indicate your agreement with each statement:

1. `ppi_1`: This reviewer was primarily trying to persuade me to buy the product.
2. `ppi_2`: This reviewer had an ulterior motive for the review.
3. `ppi_3`: This reviewer's statements seem suspicious.
4. `ppi_4`: This reviewer was trying to manipulate my opinion.
5. `ppi_5`: This reviewer may have exaggerated the product's performance.

---

### MV5: Mind Perception
**Scale:** 1 = Strongly Disagree, 7 = Strongly Agree  
**Variable Prefix:** `mind_`

**Question:** Based on your perception of the reviewer of the FEATURED REVIEW you just saw, please answer the following questions.

1. `mind_1`: The reviewer of the featured review can feel pain.
2. `mind_2`: The reviewer of the featured review can feel pleasure.
3. `mind_3`: The reviewer of the featured review can experience emotions.
4. `mind_4`: The reviewer of the featured review can have subjective experiences.
5. `mind_5`: The reviewer of the featured review can think.
6. `mind_6`: The reviewer of the featured review can plan actions.
7. `mind_7`: The reviewer of the featured review can exercise self-control.
8. `mind_8`: The reviewer of the featured review can communicate intentions clearly.

---

### DV1: Perceived Persuasiveness
**Scale:** 1 = Strongly Disagree, 7 = Strongly Agree  
**Variable Prefix:** `persuasiveness_`

**Question:** Please indicate how persuasive you found the FEATURED REVIEW shown at the top.

1. `persuasiveness_1`: The featured review changed my opinion.
2. `persuasiveness_2`: I was convinced by the featured review.
3. `persuasiveness_3`: The featured review influenced me.
4. `persuasiveness_4`: I will reconsider my position after reading the featured review.

---

### DV2: Purchase Intention
**Scale:** 1 = Strongly Disagree, 7 = Strongly Agree  
**Variable Prefix:** `purchase_`

**Question:** The following questions ask about your intention to purchase THIS SPECIFIC PRODUCT shown on the page.

⚠️ **Important Note:** These questions ask about your intention to buy the product itself, NOT how persuasive the review was. Your answer should reflect your actual purchase interest in the product based on all information shown.

1. `purchase_1`: After reading the featured review, it makes me desire to buy this product.
2. `purchase_2`: I will consider buying this product after I read the featured review.
3. `purchase_3`: I intend to try this product discussed in the featured review.
4. `purchase_4`: In the future, I intend to buy this product discussed in the featured review.

---

### DV3: Decision Confidence
**Scale:** 1 = Not at all confident, 7 = Very confident  
**Variable:** `confidence`

**Question:** How confident are you in the judgment you made based on the FEATURED REVIEW?

Please indicate your level of confidence in your evaluation of the product after reading the featured review.

---

## Part 2: General Questions (Asked ONCE, applied to all 3 rows)

### Q7: General Attitudes and Experiences

#### AI Familiarity
**Scale:** 1 = Strongly Disagree, 7 = Strongly Agree  
**Variable Prefix:** `ai_familiarity_`

**Question:** Thinking about your general experience with AI technology, please indicate your level of agreement:

1. `ai_familiarity_1`: I am familiar with how conversational AI systems (e.g., chatbots, voice assistants) work.
2. `ai_familiarity_2`: I regularly use AI-based conversational agents such as ChatGPT, Siri, or Alexa.
3. `ai_familiarity_3`: I have a clear understanding of the capabilities and limitations of conversational AI.

#### Review Skepticism
**Scale:** 1 = Strongly Disagree, 7 = Strongly Agree  
**Variable Prefix:** `review_skepticism_`

**Question:** In general, when you read online product reviews, how much do you agree with the following statements?

1. `review_skepticism_1`: Online product reviews are generally not truthful.
2. `review_skepticism_2`: Those writing product reviews are not necessarily the real customers.
3. `review_skepticism_3`: Online product reviews are often inaccurate.
4. `review_skepticism_4`: The same person often posts reviews under different names.

#### Attitude Toward AI
**Scale:** 1 = Strongly Disagree, 7 = Strongly Agree  
**Variable Prefix:** `ai_attitude_`

**Question:** Overall, how do you feel about AI in shopping contexts? Please indicate your level of agreement:

1. `ai_attitude_1`: AI enhances my shopping experience.
2. `ai_attitude_2`: I'm comfortable interacting with AI during shopping.
3. `ai_attitude_3`: I trust AI-driven product suggestions.
4. `ai_attitude_4`: AI accurately provides product recommendations.

---

### Q8: Shopping and Technology Usage Habits

#### Online Shopping Frequency
**Variable:** `shopping_frequency`  
**Type:** Multiple choice (ordinal)

**Question:** What is your frequency of online shopping?

**Options:**
- `less_than_weekly`: Less than once a week
- `1_2_weekly`: 1-2 times a week
- `3_4_weekly`: 3-4 times a week
- `daily`: Daily

#### Generative AI Usage Frequency
**Variable:** `ai_usage_frequency`  
**Type:** Multiple choice (ordinal)

**Question:** What is your frequency of using generative AI (e.g., ChatGPT)?

**Options:**
- `never`: Never
- `less_than_monthly`: Less than once a month
- `weekly`: Once a week
- `daily`: Daily

---

## Part 3: Demographics (Asked ONCE, applied to all 3 rows)

### D1: Gender
**Variable:** `gender`  
**Type:** Multiple choice (categorical)

**Question:** What is your gender?

**Options:**
- `male`: Male
- `female`: Female
- `other`: Other (please specify)
- `prefer_not`: Prefer not to answer

**If Other:** `gender_other` (text field)

---

### D2: Age
**Variable:** `age`  
**Type:** Numeric (integer)

**Question:** What is your age? (in full years)

---

### D3: Education Level
**Variable:** `education`  
**Type:** Multiple choice (ordinal)

**Question:** What is your highest level of education completed?

**Options:**
- `high_school`: High school or below
- `undergrad_current`: Currently enrolled in an undergraduate program
- `bachelors`: Bachelor's degree completed
- `grad_current`: Currently enrolled in a graduate program
- `graduate`: Graduate degree or higher

---

### D4: Annual Income
**Variable:** `income`  
**Type:** Multiple choice (ordinal)

**Question:** What is your individual annual income?

**Options:**
- `under_10k`: Less than $10,000
- `10k_20k`: $10,000 – $19,999
- `20k_30k`: $20,000 – $29,999
- `30k_50k`: $30,000 – $49,999
- `50k_75k`: $50,000 – $74,999
- `75k_100k`: $75,000 – $99,999
- `over_100k`: $100,000 or more
- `prefer_not`: Prefer not to say

---

### D5: Occupation
**Variable:** `occupation`  
**Type:** Multiple choice (categorical)

**Question:** What is your current occupation?

**Options:**
- `office_worker`: Office worker
- `self_employed`: Self-employed
- `government`: Government employee
- `professional`: Professional (e.g., doctor, lawyer)
- `student`: Student
- `unemployed`: Unemployed
- `freelancer`: Freelancer
- `other`: Other (please specify)

**If Other:** `occupation_other` (text field)

---

## Debriefing (Display only, no data collection)

### Study Purpose and Information Disclosure

**Study Purpose:**
The purpose of this study was to understand how consumers process and evaluate product information from different types of sources (AI systems versus human experts) in online shopping contexts, particularly when these sources present opinions that align with or contradict general consumer reviews.

**Important Notice About Study Materials:**
Please note that all product information, reviews, and source attributions (AI vs. Human Expert) shown in this study were **fabricated for research purposes only**. The products shown were real, but all reviews—both the featured reviews and the customer reviews—were created by the research team and do not represent actual consumer experiences or expert opinions. The assignment of reviews as "AI-generated" or "written by a human expert" was also part of the experimental manipulation.

**Why We Did Not Inform You Earlier:**
We did not disclose the full purpose and nature of the study materials in advance because knowing that the reviews were fabricated or understanding the specific research questions might have influenced how you naturally processed and evaluated the information. This could have affected the validity of our findings about genuine consumer decision-making processes.

**Data Confidentiality:**
Your responses will be kept strictly confidential and used solely for academic research purposes. No personally identifiable information was collected during this study. All data will be analyzed in aggregate form, and individual responses will not be identifiable in any publications or presentations resulting from this research.

**Your Rights:**
If you have any concerns about your participation or would like to withdraw your data from the study, you may contact the research team. However, please note that once data has been aggregated and anonymized, individual withdrawal may not be possible.

**Questions or Concerns:**
If you have any questions about this study or would like more information about the research findings once the study is complete, please feel free to contact the research team.

Thank you again for your valuable contribution to this research!
