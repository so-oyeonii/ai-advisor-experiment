# AI Advisor Experiment - Complete Implementation Guide

> **Purpose**: This document provides complete specifications for GitHub Copilot to generate all project files.
> **Project**: Consumer Trust in AI vs Human Advisors - Experimental Study
> **Tech Stack**: Next.js 14, TypeScript, Firebase Firestore, Tailwind CSS, Vercel

---

## 🎯 Research Overview

### Experimental Design
- **Type**: 2×2 Between-Subjects Factorial Design
- **IV1**: Advisor Type (AI vs Human Expert)
- **IV2**: Opinion Congruity (Congruent vs Incongruent)
- **DVs**: Perceived Persuasiveness, Purchase Intention, Decision Confidence
- **Mediators**: Argument Quality, Source Credibility, Perceived Persuasive Intent (PPI)
- **Sample**: 240 participants (final n=180 after exclusions)
- **Products**: 3 low-involvement products (Protein Powder, Toilet Paper, Hand Soap)

### Hypotheses
- **H1**: Consumers perceive higher PPI from Human Experts than AI Advisors
- **H2**: Incongruent conditions lead to longer Screen Dwell Time (central processing)
- **H3a**: AI incongruity → ↓ Argument Quality → ↓ Persuasiveness
- **H3b**: Human incongruity → ↑ PPI → ↓ Source Credibility → ↓ Persuasiveness

---

## 🔄 Complete User Flow

```
Landing Page (/)
    ↓
Consent Form (/consent)
    ↓ [Initialize Session, Assign Conditions]
    ↓
┌─────────── LOOP 3 TIMES (Stimulus 0, 1, 2) ───────────┐
│                                                        │
│  Stimulus Exposure (/stimulus/[id])                   │
│  ├─ Amazon-style product page                         │
│  ├─ Advisor review (AI 🤖 or Human 👤)                │
│  ├─ Public reviews (6-7 reviews, manipulated rating)  │
│  ├─ Dwell time tracking (auto-start on mount)         │
│  └─ [Continue] button → save dwell time               │
│      ↓                                                 │
│  Recall Task (/recall/[id]) **NEW**                   │
│  ├─ 60-second countdown timer                         │
│  ├─ "Write down review content you remember"          │
│  ├─ Text area (auto-focus)                            │
│  ├─ Minimum 10s before allowing continue              │
│  ├─ Auto-submit at 60s OR manual continue             │
│  └─ Save: {recallText, timeSpent, wordCount}          │
│      ↓                                                 │
│  Post-Stimulus Survey (/survey/[id])                  │
│  ├─ Manipulation checks (2 items)                     │
│  ├─ Argument Quality (4 items)                        │
│  ├─ Source Credibility (5 items)                      │
│  ├─ Perceived Persuasive Intent (6 items)             │
│  ├─ Perceived Persuasiveness (4 items)                │
│  └─ Decision Confidence (1 item)                      │
│      ↓                                                 │
└────────────────────────────────────────────────────────┘
    ↓
Demographics Questionnaire (/demographics)
├─ AI Familiarity (3 items)
├─ Review Skepticism (4 items)
├─ Attitude toward AI (4 items)
├─ Shopping frequency, AI usage
└─ Age, Gender, Education, Income
    ↓
Debriefing & Completion (/complete)
└─ Thank you message, reveal fabrication
```

---

## 📊 Randomization & Condition Assignment

### Pattern Types (4 total)
```typescript
type Pattern = 'A' | 'B' | 'C' | 'D';

Pattern A: Advisor Positive + Public Positive = CONGRUENT
Pattern B: Advisor Positive + Public Negative = INCONGRUENT
Pattern C: Advisor Negative + Public Positive = INCONGRUENT
Pattern D: Advisor Negative + Public Negative = CONGRUENT
```

### Assignment Constraints
1. Each participant sees **3 different patterns** (no duplicates)
   - Possible combinations: C(4,3) = 4 combinations
   - [A,B,C], [A,B,D], [A,C,D], [B,C,D]

2. **Minimum 1 AI + 1 Human** advisor per participant
   - Valid distributions: (2 AI, 1 Human), (1 AI, 2 Human)
   - Possible: 6 unique distributions

3. **3 unique products** (protein, tissue, soap)
   - Random order assignment

4. **Total unique configurations**: 4 × 6 × 6 = 144 possibilities

### Expected Data Distribution (720 observations)
- AI + Congruent: 180
- AI + Incongruent: 180
- Human + Congruent: 180
- Human + Incongruent: 180

---

## 🗂 Firebase Firestore Collections

### Collection 1: `sessions`
```typescript
interface Session {
  participantId: string;           // Auto-generated UUID
  conditions: Condition[];         // Array of 3 conditions
  currentStimulus: number;         // 0, 1, or 2
  isComplete: boolean;
  startTime: number;               // timestamp
  completionTime: number | null;   // timestamp
  ipAddress?: string;              // Optional for fraud detection
  userAgent?: string;              // Optional browser info
}

interface Condition {
  product: 'protein' | 'tissue' | 'soap';
  patternKey: 'A' | 'B' | 'C' | 'D';
  advisorType: 'AI' | 'Human';
  congruity: 'congruent' | 'incongruent';
  advisorValence: 'positive' | 'negative';
  publicValence: 'positive' | 'negative';
  order: number;                   // 0, 1, or 2
}
```

### Collection 2: `stimulus_exposures`
```typescript
interface StimulusExposure {
  participantId: string;
  stimulusId: number;              // 0, 1, or 2
  condition: Condition;
  dwellTime: number;               // seconds (decimal OK)
  timestamp: number;
}
```

### Collection 3: `recall_tasks` **NEW**
```typescript
interface RecallTask {
  participantId: string;
  stimulusId: number;
  condition: Condition;
  recallText: string;              // User input
  timeSpent: number;               // Seconds actually used (≤60)
  wordCount: number;               // Auto-calculated split by spaces
  timestamp: number;
}
```

### Collection 4: `survey_responses`
```typescript
interface SurveyResponse {
  participantId: string;
  stimulusId: number;
  condition: Condition;
  
  // Manipulation Checks
  mc_advisorType: 'AI' | 'Human' | 'Not sure';
  mc_congruity: 'matched' | 'did not match';
  
  // Argument Quality (1-7)
  argQuality_1: number;  // accurate
  argQuality_2: number;  // appropriate
  argQuality_3: number;  // detailed
  argQuality_4: number;  // timely
  
  // Source Credibility (1-7)
  credibility_1: number; // dependable
  credibility_2: number; // honest
  credibility_3: number; // reliable
  credibility_4: number; // sincere
  credibility_5: number; // trustworthy
  
  // Perceived Persuasive Intent (1-7)
  ppi_1: number;  // getting me to buy
  ppi_2: number;  // intended to mislead
  ppi_3: number;  // up to something
  ppi_4: number;  // ulterior motive
  ppi_5: number;  // suspicious
  ppi_6: number;  // exaggerate performance
  
  // Perceived Persuasiveness (1-7)
  persuasiveness_1: number;  // convincing
  persuasiveness_2: number;  // important when purchase
  persuasiveness_3: number;  // cause behavior change
  persuasiveness_4: number;  // cause attitude change
  
  // Decision Confidence (1-7)
  confidence: number;
  
  timestamp: number;
}
```

### Collection 5: `demographics`
```typescript
interface Demographics {
  participantId: string;
  
  // AI Familiarity (1-7)
  ai_familiarity_1: number;  // familiar with AI systems
  ai_familiarity_2: number;  // regularly use AI agents
  ai_familiarity_3: number;  // understand capabilities
  
  // Review Skepticism (1-7)
  review_skepticism_1: number;  // not truthful
  review_skepticism_2: number;  // not real customers
  review_skepticism_3: number;  // inaccurate
  review_skepticism_4: number;  // fake names
  
  // Attitude toward AI (1-7)
  attitude_ai_1: number;  // enhances shopping
  attitude_ai_2: number;  // comfortable interacting
  attitude_ai_3: number;  // trust suggestions
  attitude_ai_4: number;  // accurate recommendations
  
  // Behavioral
  shopping_frequency: 'less_than_weekly' | '1-2_weekly' | '3-4_weekly' | 'daily';
  ai_usage_frequency: 'never' | 'less_than_monthly' | 'weekly' | 'daily';
  
  // Demographics
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  age: number;
  nationality: string;
  education: 'high_school' | 'some_college' | 'bachelors' | 'masters' | 'doctorate';
  income: 'under_10k' | '10-20k' | '20-30k' | '30-50k' | '50-75k' | '75-100k' | 'over_100k' | 'prefer_not_to_say';
  
  timestamp: number;
}
```

---

## 📄 Page-by-Page Specifications

## Page 1: Landing Page (`/src/pages/index.tsx`)

### Purpose
Welcome screen with study overview and start button

### UI Layout
```tsx
<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">
      Consumer Product Review Study
    </h1>
    
    <p className="text-gray-700 mb-6">
      Help us understand how people evaluate online product information.
      You will view product pages and answer questions about your impressions.
    </p>
    
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
      <h2 className="font-semibold text-blue-900 mb-2">Study Details:</h2>
      <ul className="list-disc list-inside text-blue-800 space-y-1">
        <li>Duration: Approximately 10 minutes</li>
        <li>Compensation: [Amount will be specified]</li>
        <li>All information confidential</li>
      </ul>
    </div>
    
    <button 
      onClick={() => router.push('/consent')}
      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
    >
      Start Study
    </button>
  </div>
</div>
```

### Functionality
- No data collection on this page
- Simple navigation to `/consent` on button click
- Responsive design (mobile-first)

---

## Page 2: Consent Form (`/src/pages/consent.tsx`)

### Purpose
IRB-compliant informed consent

### UI Layout
```tsx
<div className="min-h-screen bg-gray-50 p-4">
  <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
    <h1 className="text-2xl font-bold mb-6">Informed Consent</h1>
    
    <div className="prose max-w-none mb-8 space-y-4 text-gray-700">
      <h2 className="text-xl font-semibold">Study Purpose</h2>
      <p>
        This study investigates how consumers process product information 
        from different sources in online shopping contexts.
      </p>
      
      <h2 className="text-xl font-semibold">Procedures</h2>
      <p>
        You will view product pages with reviews and answer questions 
        about your impressions. The study takes approximately 10 minutes.
      </p>
      
      <h2 className="text-xl font-semibold">Voluntary Participation</h2>
      <p>
        Your participation is completely voluntary. You may withdraw at 
        any time without penalty.
      </p>
      
      <h2 className="text-xl font-semibold">Confidentiality</h2>
      <p>
        All data will be kept confidential and used solely for research 
        purposes. No personally identifiable information will be collected.
      </p>
      
      <h2 className="text-xl font-semibold">Contact</h2>
      <p>
        Questions? Contact: [researcher email]
      </p>
    </div>
    
    <div className="border-t pt-6">
      <label className="flex items-start space-x-3 cursor-pointer">
        <input 
          type="checkbox" 
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-5 w-5 text-blue-600"
        />
        <span className="text-gray-900">
          I have read and understood the above information. I agree to 
          participate in this study voluntarily.
        </span>
      </label>
      
      <button 
        onClick={handleContinue}
        disabled={!agreed}
        className={`w-full mt-6 py-3 rounded-md transition ${
          agreed 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue to Study
      </button>
    </div>
  </div>
</div>
```

### Functionality

```typescript
const [agreed, setAgreed] = useState(false);

const handleContinue = async () => {
  if (!agreed) return;
  
  // 1. Generate participant ID
  const participantId = uuidv4();
  
  // 2. Assign random conditions
  const conditions = assignParticipantConditions();
  
  // 3. Create session in Firebase
  await saveSession({
    participantId,
    conditions,
    currentStimulus: 0,
    isComplete: false,
    startTime: Date.now(),
    completionTime: null
  });
  
  // 4. Save to sessionStorage
  sessionStorage.setItem('participantId', participantId);
  sessionStorage.setItem('conditions', JSON.stringify(conditions));
  sessionStorage.setItem('currentStimulus', '0');
  
  // 5. Navigate to first stimulus
  router.push('/stimulus/0');
};
```

---

## Page 3: Stimulus Exposure (`/src/pages/stimulus/[id].tsx`)

### Purpose
Present Amazon-style product page with manipulated advisor/public reviews

### Dynamic Route
- `id`: 0, 1, or 2 (from URL parameter)
- Access condition via: `conditions[id]`

### UI Layout - Complete Amazon Mockup

```tsx
<div className="min-h-screen bg-white">
  {/* Amazon Header */}
  <header className="bg-[#232F3E] text-white px-4 py-2">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold">amazon</div>
        <div className="hidden md:flex items-center bg-white rounded-md overflow-hidden">
          <input 
            type="text" 
            placeholder="Search Amazon"
            className="px-4 py-2 w-96 text-gray-900 outline-none"
            disabled
          />
          <button className="bg-[#FF9900] px-4 py-2">
            <Search size={20} className="text-gray-900" />
          </button>
        </div>
      </div>
      <ShoppingCart size={28} />
    </div>
  </header>
  
  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 py-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Left: Product Image */}
      <div className="md:col-span-1">
        <img 
          src={`/images/${product.image}`}
          alt={product.name}
          className="w-full rounded-lg border border-gray-300"
        />
      </div>
      
      {/* Right: Product Details */}
      <div className="md:col-span-2 space-y-4">
        
        {/* Product Title */}
        <h1 className="text-2xl font-normal text-gray-900">
          {product.name}
        </h1>
        
        {/* Brand */}
        <div className="text-sm">
          <span className="text-gray-600">Brand: </span>
          <span className="text-blue-600 hover:text-orange-600 cursor-pointer">
            {product.brand}
          </span>
        </div>
        
        {/* Rating (MANIPULATED) */}
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={20} 
                className={i < Math.floor(displayRating) ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer">
            {displayRating} out of 5
          </span>
          <span className="text-sm text-gray-600">
            ({ratingCount} ratings)
          </span>
        </div>
        
        {/* Prime Badge */}
        <div className="flex items-center space-x-2">
          <span className="bg-blue-600 text-white px-2 py-1 text-xs font-bold">prime</span>
          <span className="text-sm text-gray-700">FREE delivery</span>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl text-gray-900">${product.price}</span>
        </div>
        
        <hr className="my-4" />
        
        {/* ADVISOR REVIEW CARD */}
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center space-x-2 mb-3">
            {condition.advisorType === 'AI' ? (
              <>
                <Bot size={24} className="text-blue-600" />
                <span className="font-semibold text-gray-900">AI-Generated Review</span>
              </>
            ) : (
              <>
                <User size={24} className="text-orange-600" />
                <span className="font-semibold text-gray-900">Expert Review</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-[#FFA41C] text-[#FFA41C]" />
              ))}
            </div>
            <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-semibold rounded">
              {condition.advisorType === 'AI' ? 'Algorithm Pick' : "Editor's Choice"}
            </span>
          </div>
          
          <p className="text-gray-800 leading-relaxed">
            {advisorReviewText}
          </p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <hr className="my-6" />
        
        {/* CUSTOMER REVIEWS SECTION */}
        <div>
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          
          {/* Rating Summary */}
          <div className="flex items-start space-x-8 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">{displayRating}</div>
              <div className="flex justify-center my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(displayRating) ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-gray-300'} />
                ))}
              </div>
              <div className="text-sm text-gray-600">{ratingCount} ratings</div>
            </div>
            
            {/* Rating Distribution (MANIPULATED) */}
            <div className="flex-1 space-y-1">
              {ratingDistribution.map((percent, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer w-12">
                    {5-index} star
                  </span>
                  <div className="flex-1 bg-gray-300 rounded-full h-4">
                    <div 
                      className="bg-[#FFA41C] h-4 rounded-full" 
                      style={{width: `${percent}%`}}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{percent}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <hr className="my-4" />
          
          {/* Individual Reviews (6-7 reviews, MANIPULATED) */}
          <div className="space-y-6">
            {publicReviews.map((review, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <span className="font-semibold text-gray-900">{review.username}</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-gray-300'} />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-xs text-orange-700 font-semibold">Verified Purchase</span>
                  )}
                </div>
                
                <p className="text-gray-800 text-sm leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    
    {/* Continue Button */}
    <div className="max-w-md mx-auto mt-12">
      <button 
        onClick={handleContinue}
        className="w-full bg-blue-600 text-white py-4 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
      >
        Continue to Next Step
      </button>
    </div>
  </main>
</div>
```

### Functionality

```typescript
const router = useRouter();
const { id } = router.query;
const stimulusId = Number(id);

// Get session data
const participantId = sessionStorage.getItem('participantId');
const conditions = JSON.parse(sessionStorage.getItem('conditions') || '[]');
const condition = conditions[stimulusId];

// Dwell time tracking
const dwellStartTime = useRef(Date.now());

const handleContinue = async () => {
  // 1. Calculate dwell time
  const dwellTime = (Date.now() - dwellStartTime.current) / 1000; // seconds
  
  // 2. Save to Firebase
  await saveStimulusExposure({
    participantId,
    stimulusId,
    condition,
    dwellTime,
    timestamp: Date.now()
  });
  
  // 3. Navigate to Recall Task
  router.push(`/recall/${stimulusId}`);
};

// Get stimulus data based on condition
const { product, advisorReview, publicReviews, displayRating, ratingDistribution } = 
  getStimulusData(condition);
```

### Data Structures

```typescript
// Product data
interface Product {
  id: 'protein' | 'tissue' | 'soap';
  name: string;
  brand: string;
  price: number;
  image: string;
  tags: string[];
}

// Advisor review
interface AdvisorReview {
  text: string;
  valence: 'positive' | 'negative';
}

// Public review
interface PublicReview {
  username: string;
  rating: number;
  text: string;
  verified: boolean;
}

// Rating display (manipulated by congruity)
const ratingData = {
  congruent_positive: {
    average: 4.6,
    distribution: [65, 20, 8, 4, 3], // 5,4,3,2,1 star percentages
    count: 1234
  },
  incongruent_negative: {
    average: 2.1,
    distribution: [5, 8, 12, 20, 55],
    count: 987
  }
};
```

---

## Page 4: Recall Task (`/src/pages/recall/[id].tsx`) **NEW**

### Purpose
Measure memory and processing depth via timed free recall

### UI Layout

```tsx
<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
    
    {/* Header with Timer */}
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Recall Task</h1>
      <div className="flex items-center space-x-2">
        <Clock size={24} className={timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'} />
        <span className={`text-3xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
    </div>
    
    {/* Instructions */}
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
      <p className="text-blue-900">
        Please write down the review content you remember from the previous page.
        Include as many details as you can recall.
      </p>
    </div>
    
    {/* Text Area */}
    <textarea
      ref={textAreaRef}
      value={recallText}
      onChange={(e) => setRecallText(e.target.value)}
      placeholder="Type your response here..."
      className="w-full h-64 p-4 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none resize-none"
      autoFocus
    />
    
    {/* Word Count */}
    <div className="mt-2 text-sm text-gray-600 text-right">
      Word count: {wordCount}
    </div>
    
    {/* Continue Button */}
    <button 
      onClick={handleSubmit}
      disabled={!canContinue}
      className={`w-full mt-6 py-3 rounded-md text-lg font-semibold transition ${
        canContinue
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {!canContinue 
        ? `Please wait ${10 - elapsedTime}s...` 
        : 'Continue to Survey'
      }
    </button>
    
    {timeLeft === 0 && (
      <p className="mt-4 text-center text-sm text-gray-600">
        Time's up! Submitting automatically...
      </p>
    )}
  </div>
</div>
```

### Functionality

```typescript
const router = useRouter();
const { id } = router.query;
const stimulusId = Number(id);

const textAreaRef = useRef<HTMLTextAreaElement>(null);
const [recallText, setRecallText] = useState('');
const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
const [elapsedTime, setElapsedTime] = useState(0);
const [canContinue, setCanContinue] = useState(false);

// Word count
const wordCount = recallText.trim().split(/\s+/).filter(w => w.length > 0).length;

// Timer logic
useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        handleAutoSubmit();
        return 0;
      }
      return prev - 1;
    });
    
    setElapsedTime(prev => prev + 1);
  }, 1000);
  
  // Enable continue button after 10 seconds
  const enableTimer = setTimeout(() => {
    setCanContinue(true);
  }, 10000);
  
  // Auto-focus text area
  textAreaRef.current?.focus();
  
  return () => {
    clearInterval(timer);
    clearTimeout(enableTimer);
  };
}, []);

// Manual submit
const handleSubmit = async () => {
  if (!canContinue) return;
  await saveRecallData();
  router.push(`/survey/${stimulusId}`);
};

// Auto submit at 60s
const handleAutoSubmit = async () => {
  await saveRecallData();
  setTimeout(() => {
    router.push(`/survey/${stimulusId}`);
  }, 1500);
};

// Save to Firebase
const saveRecallData = async () => {
  const participantId = sessionStorage.getItem('participantId')!;
  const conditions = JSON.parse(sessionStorage.getItem('conditions') || '[]');
  const condition = conditions[stimulusId];
  
  await saveRecallTask({
    participantId,
    stimulusId,
    condition,
    recallText: recallText.trim(),
    timeSpent: 60 - timeLeft,
    wordCount: wordCount,
    timestamp: Date.now()
  });
};
```

---

## Page 5: Survey Page (`/src/pages/survey/[id].tsx`)

### Purpose
Collect dependent variables and mediators

### UI Layout

```tsx
<div className="min-h-screen bg-gray-50 py-8 px-4">
  <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
    
    {/* Progress Indicator */}
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">
          Stimulus {stimulusId + 1} of 3
        </span>
        <span className="text-sm text-gray-600">
          {Math.round(((stimulusId + 1) / 3) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{width: `${((stimulusId + 1) / 3) * 100}%`}}
        />
      </div>
    </div>
    
    <h1 className="text-2xl font-bold mb-6">Product Evaluation Survey</h1>
    
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* SECTION 1: Manipulation Checks */}
      <section className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">About the Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Who provided the information you just read?
            </label>
            <div className="space-y-2">
              {['An Artificial Intelligence (AI) System', 'A Human Expert', 'I am not sure'].map(option => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="mc_advisorType"
                    value={option}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                    required
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              How did the information compare to your expectations?
            </label>
            <div className="space-y-2">
              {['It matched my thoughts', 'It did not match my thoughts'].map(option => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="mc_congruity"
                    value={option}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                    required
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* SECTION 2: Argument Quality */}
      <section className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">Information Quality</h2>
        <p className="text-sm text-gray-600 mb-4">
          Rate your agreement with the following statements (1 = Strongly Disagree, 7 = Strongly Agree)
        </p>
        
        {[
          'The information shared is accurate',
          'The information shared ensures appropriateness',
          'The information shared is highly detailed and comprehensive',
          'The information shared is always updated in a timely manner'
        ].map((item, index) => (
          <LikertScale 
            key={index}
            name={`argQuality_${index + 1}`}
            question={item}
            onChange={handleChange}
          />
        ))}
      </section>
      
      {/* SECTION 3: Source Credibility */}
      <section className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">Source Evaluation</h2>
        <p className="text-sm text-gray-600 mb-4">
          How would you describe the source that provided the information?
        </p>
        
        {[
          ['Undependable', 'Dependable'],
          ['Dishonest', 'Honest'],
          ['Unreliable', 'Reliable'],
          ['Insincere', 'Sincere'],
          ['Untrustworthy', 'Trustworthy']
        ].map((pair, index) => (
          <SemanticDifferential
            key={index}
            name={`credibility_${index + 1}`}
            leftLabel={pair[0]}
            rightLabel={pair[1]}
            onChange={handleChange}
          />
        ))}
      </section>
      
      {/* SECTION 4: Perceived Persuasive Intent */}
      <section className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">Reviewer Intentions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Rate your agreement (1 = Strongly Disagree, 7 = Strongly Agree)
        </p>
        
        {[
          'The online reviewers cared mostly about getting me to buy the brand',
          'Most of the online reviews were intended to mislead',
          'The people writing the online reviews were up to something',
          'The reviewer has an ulterior motive',
          "The reviewer's statements are suspicious",
          'The reviewer is motivated to exaggerate the performance of this product'
        ].map((item, index) => (
          <LikertScale 
            key={index}
            name={`ppi_${index + 1}`}
            question={item}
            onChange={handleChange}
          />
        ))}
      </section>
      
      {/* SECTION 5: Perceived Persuasiveness */}
      <section className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">Overall Impression</h2>
        <p className="text-sm text-gray-600 mb-4">
          Rate your agreement (1 = Strongly Disagree, 7 = Strongly Agree)
        </p>
        
        {[
          'These reviews are convincing for me to trust the product',
          'These reviews are important when I purchase the product',
          'This message will cause changes in my behavior',
          'After viewing this message, I will make changes in my attitude'
        ].map((item, index) => (
          <LikertScale 
            key={index}
            name={`persuasiveness_${index + 1}`}
            question={item}
            onChange={handleChange}
          />
        ))}
      </section>
      
      {/* SECTION 6: Decision Confidence */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Purchase Confidence</h2>
        <LikertScale 
          name="confidence"
          question="Indicate your level of confidence in buying the product after reading the online reviews"
          leftLabel="Not at all confident"
          rightLabel="Very confident"
          onChange={handleChange}
        />
      </section>
      
      {/* Submit Button */}
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
      >
        {stimulusId < 2 ? 'Continue to Next Product' : 'Continue to Final Questions'}
      </button>
    </form>
  </div>
</div>
```

### Reusable Components

```tsx
// Likert Scale Component
const LikertScale = ({ name, question, leftLabel = 'Strongly Disagree', rightLabel = 'Strongly Agree', onChange }) => (
  <div className="mb-6">
    <p className="text-gray-800 mb-3">{question}</p>
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600">{leftLabel}</span>
      <div className="flex space-x-2">
        {[1,2,3,4,5,6,7].map(value => (
          <label key={value} className="flex flex-col items-center cursor-pointer">
            <input 
              type="radio" 
              name={name}
              value={value}
              onChange={onChange}
              className="mb-1"
              required
            />
            <span className="text-xs text-gray-600">{value}</span>
          </label>
        ))}
      </div>
      <span className="text-xs text-gray-600">{rightLabel}</span>
    </div>
  </div>
);

// Semantic Differential Component
const SemanticDifferential = ({ name, leftLabel, rightLabel, onChange }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700 w-32 text-right mr-4">{leftLabel}</span>
      <div className="flex space-x-2">
        {[1,2,3,4,5,6,7].map(value => (
          <label key={value} className="flex flex-col items-center cursor-pointer">
            <input 
              type="radio" 
              name={name}
              value={value}
              onChange={onChange}
              className="mb-1"
              required
            />
            <span className="text-xs text-gray-600">{value}</span>
          </label>
        ))}
      </div>
      <span className="text-sm text-gray-700 w-32 ml-4">{rightLabel}</span>
    </div>
  </div>
);
```

### Functionality

```typescript
const [formData, setFormData] = useState({});

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: isNaN(Number(value)) ? value : Number(value)
  }));
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  // Save survey response
  await saveSurveyResponse({
    participantId,
    stimulusId,
    condition: conditions[stimulusId],
    ...formData,
    timestamp: Date.now()
  });
  
  // Navigate
  if (stimulusId < 2) {
    // More stimuli remaining
    const nextStimulus = stimulusId + 1;
    sessionStorage.setItem('currentStimulus', String(nextStimulus));
    router.push(`/stimulus/${nextStimulus}`);
  } else {
    // All 3 completed
    router.push('/demographics');
  }
};
```

---

## Page 6: Demographics (`/src/pages/demographics.tsx`)

### Purpose
Collect covariates and participant characteristics

### UI Layout

```tsx
<div className="min-h-screen bg-gray-50 py-8 px-4">
  <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
    <h1 className="text-2xl font-bold mb-2">Final Questions</h1>
    <p className="text-gray-600 mb-8">
      Please answer a few questions about yourself for statistical purposes.
    </p>
    
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* AI Familiarity */}
      <section className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">AI Experience</h2>
        {[
          'I am familiar with how conversational AI systems (e.g., chatbots, voice assistants) work',
          'I regularly use AI-based conversational agents such as ChatGPT, Siri, or Alexa',
          'I have a clear understanding of the capabilities and limitations of conversational AI'
        ].map((item, i) => (
          <LikertScale key={i} name={`ai_familiarity_${i+1}`} question={item} onChange={handleChange} />
        ))}
      </section>
      
      {/* Review Skepticism */}
      <section className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">Online Reviews</h2>
        {[
          'Online reviews are generally not truthful',
          'Those writing reviews are not necessarily real customers',
          'Online reviews are often inaccurate',
          'The same person often posts reviews under different names'
        ].map((item, i) => (
          <LikertScale key={i} name={`review_skepticism_${i+1}`} question={item} onChange={handleChange} />
        ))}
      </section>
      
      {/* Attitude toward AI */}
      <section className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">AI in Shopping</h2>
        {[
          'AI enhances my shopping experience',
          "I'm comfortable interacting with AI during shopping",
          'I trust AI-driven product suggestions',
          'AI accurately provides product recommendations'
        ].map((item, i) => (
          <LikertScale key={i} name={`attitude_ai_${i+1}`} question={item} onChange={handleChange} />
        ))}
      </section>
      
      {/* Behavioral Measures */}
      <section className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">Shopping Habits</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Online shopping frequency:
          </label>
          <select name="shopping_frequency" onChange={handleChange} required className="w-full p-2 border rounded-md">
            <option value="">Select...</option>
            <option value="less_than_weekly">Less than once a week</option>
            <option value="1-2_weekly">1-2 times a week</option>
            <option value="3-4_weekly">3-4 times a week</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Generative AI usage (e.g., ChatGPT):
          </label>
          <select name="ai_usage_frequency" onChange={handleChange} required className="w-full p-2 border rounded-md">
            <option value="">Select...</option>
            <option value="never">Never</option>
            <option value="less_than_monthly">Less than once a month</option>
            <option value="weekly">Once a week</option>
            <option value="daily">Daily</option>
          </select>
        </div>
      </section>
      
      {/* Demographics */}
      <section>
        <h2 className="text-lg font-semibold mb-4">About You</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender:</label>
            <select name="gender" onChange={handleChange} required className="w-full p-2 border rounded-md">
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Age:</label>
            <input 
              type="number" 
              name="age" 
              min="18" 
              max="100"
              onChange={handleChange}
              required 
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nationality:</label>
            <input 
              type="text" 
              name="nationality" 
              onChange={handleChange}
              required 
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Education:</label>
            <select name="education" onChange={handleChange} required className="w-full p-2 border rounded-md">
              <option value="">Select...</option>
              <option value="high_school">High school or below</option>
              <option value="some_college">Some college</option>
              <option value="bachelors">Bachelor's degree</option>
              <option value="masters">Master's degree</option>
              <option value="doctorate">Doctorate</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Annual Income (USD):</label>
            <select name="income" onChange={handleChange} required className="w-full p-2 border rounded-md">
              <option value="">Select...</option>
              <option value="under_10k">Less than $10,000</option>
              <option value="10-20k">$10,000 - $19,999</option>
              <option value="20-30k">$20,000 - $29,999</option>
              <option value="30-50k">$30,000 - $49,999</option>
              <option value="50-75k">$50,000 - $74,999</option>
              <option value="75-100k">$75,000 - $99,999</option>
              <option value="over_100k">$100,000 or more</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </section>
      
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
      >
        Complete Study
      </button>
    </form>
  </div>
</div>
```

### Functionality

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  // Save demographics
  await saveDemographics({
    participantId,
    ...formData,
    timestamp: Date.now()
  });
  
  // Mark session complete
  await updateSession(participantId, {
    isComplete: true,
    completionTime: Date.now()
  });
  
  router.push('/complete');
};
```

---

## Page 7: Completion (`/src/pages/complete.tsx`)

### Purpose
Debriefing and thank you

### UI Layout

```tsx
<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center">
    <div className="mb-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Check size={32} className="text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Thank You!
      </h1>
      <p className="text-lg text-gray-600">
        You have successfully completed the study.
      </p>
    </div>
    
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 mb-6 text-left">
      <h2 className="text-lg font-semibold text-yellow-900 mb-3">Debriefing</h2>
      <p className="text-yellow-800 mb-3">
        Please note that all product information, reviews, and advisor 
        attributions shown in this study were <strong>fabricated for 
        research purposes</strong>. No actual products were endorsed.
      </p>
      <p className="text-yellow-800">
        The purpose of this study was to understand how consumers process 
        product information from different sources in online shopping contexts.
      </p>
    </div>
    
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left">
      <h3 className="font-semibold text-blue-900 mb-2">Confidentiality</h3>
      <p className="text-blue-800 text-sm">
        Your data will be kept strictly confidential and used solely for 
        academic research purposes. No personally identifiable information 
        was collected.
      </p>
    </div>
    
    <div className="text-sm text-gray-600 mb-6">
      Questions about this study? Contact: <br />
      <a href="mailto:researcher@university.edu" className="text-blue-600 hover:underline">
        researcher@university.edu
      </a>
    </div>
    
    <button 
      onClick={() => window.close()}
      className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
    >
      Close Window
    </button>
  </div>
</div>
```

---

## Page 8: Admin Export (`/src/pages/admin/export.tsx`)

### Purpose
Download collected data as CSV

### UI Layout

```tsx
const [password, setPassword] = useState('');
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });

const handleLogin = () => {
  if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    setIsAuthenticated(true);
    fetchStats();
  } else {
    alert('Incorrect password');
  }
};

const handleDownloadCSV = async () => {
  // Fetch all data from Firebase
  const sessions = await getAllSessions();
  const exposures = await getAllStimulusExposures();
  const recalls = await getAllRecallTasks();
  const surveys = await getAllSurveyResponses();
  const demographics = await getAllDemographics();
  
  // Merge data by participantId
  const merged = mergeData(sessions, exposures, recalls, surveys, demographics);
  
  // Convert to CSV
  const csv = convertToCSV(merged);
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `experiment_data_${new Date().toISOString()}.csv`;
  link.click();
};

return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Data Export</h1>
      
      {!isAuthenticated ? (
        <div>
          <label className="block text-gray-700 font-medium mb-2">Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
            <div className="bg-green-50 p-4 rounded-md text-center">
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
          
          <button 
            onClick={handleDownloadCSV}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition flex items-center justify-center space-x-2"
          >
            <Download size={20} />
            <span>Download Complete Dataset (CSV)</span>
          </button>
        </div>
      )}
    </div>
  </div>
);
```

---

## 🛠 Helper Functions & Utilities

### `/src/lib/randomization.ts`

```typescript
import { v4 as uuidv4 } from 'uuid';

export type PatternKey = 'A' | 'B' | 'C' | 'D';
export type ProductKey = 'protein' | 'tissue' | 'soap';
export type AdvisorType = 'AI' | 'Human';
export type Congruity = 'congruent' | 'incongruent';

export interface Condition {
  product: ProductKey;
  patternKey: PatternKey;
  advisorType: AdvisorType;
  congruity: Congruity;
  advisorValence: 'positive' | 'negative';
  publicValence: 'positive' | 'negative';
  order: number;
}

// Pattern definitions
const PATTERNS: Record<PatternKey, { advisorValence: 'positive' | 'negative', publicValence: 'positive' | 'negative', congruity: Congruity }> = {
  A: { advisorValence: 'positive', publicValence: 'positive', congruity: 'congruent' },
  B: { advisorValence: 'positive', publicValence: 'negative', congruity: 'incongruent' },
  C: { advisorValence: 'negative', publicValence: 'positive', congruity: 'incongruent' },
  D: { advisorValence: 'negative', publicValence: 'negative', congruity: 'congruent' }
};

// Select 3 unique patterns from 4
const select3Patterns = (): PatternKey[] => {
  const allPatterns: PatternKey[] = ['A', 'B', 'C', 'D'];
  const selected = [...allPatterns].sort(() => Math.random() - 0.5).slice(0, 3);
  return selected;
};

// Assign advisor types ensuring 1 AI + 1 Human minimum
const assignAdvisorTypes = (): AdvisorType[] => {
  const distributions: AdvisorType[][] = [
    ['AI', 'AI', 'Human'],
    ['AI', 'Human', 'AI'],
    ['Human', 'AI', 'AI'],
    ['AI', 'Human', 'Human'],
    ['Human', 'AI', 'Human'],
    ['Human', 'Human', 'AI']
  ];
  
  return distributions[Math.floor(Math.random() * distributions.length)];
};

// Shuffle products
const shuffleProducts = (): ProductKey[] => {
  const products: ProductKey[] = ['protein', 'tissue', 'soap'];
  return products.sort(() => Math.random() - 0.5);
};

// Main assignment function
export const assignParticipantConditions = (): Condition[] => {
  const patterns = select3Patterns();
  const advisorTypes = assignAdvisorTypes();
  const products = shuffleProducts();
  
  return patterns.map((patternKey, index) => {
    const pattern = PATTERNS[patternKey];
    return {
      product: products[index],
      patternKey,
      advisorType: advisorTypes[index],
      congruity: pattern.congruity,
      advisorValence: pattern.advisorValence,
      publicValence: pattern.publicValence,
      order: index
    };
  });
};

// Validation
export const validateConditions = (conditions: Condition[]): boolean => {
  // Check 3 conditions
  if (conditions.length !== 3) return false;
  
  // Check unique patterns
  const patterns = conditions.map(c => c.patternKey);
  if (new Set(patterns).size !== 3) return false;
  
  // Check unique products
  const products = conditions.map(c => c.product);
  if (new Set(products).size !== 3) return false;
  
  // Check at least 1 AI + 1 Human
  const advisorTypes = conditions.map(c => c.advisorType);
  const hasAI = advisorTypes.includes('AI');
  const hasHuman = advisorTypes.includes('Human');
  if (!hasAI || !hasHuman) return false;
  
  return true;
};

// Test function
export const testRandomization = (iterations: number = 100) => {
  const results = {
    totalAI: 0,
    totalHuman: 0,
    congruent: 0,
    incongruent: 0,
    patterns: { A: 0, B: 0, C: 0, D: 0 }
  };
  
  for (let i = 0; i < iterations; i++) {
    const conditions = assignParticipantConditions();
    
    if (!validateConditions(conditions)) {
      console.error('Validation failed!', conditions);
      continue;
    }
    
    conditions.forEach(c => {
      if (c.advisorType === 'AI') results.totalAI++;
      else results.totalHuman++;
      
      if (c.congruity === 'congruent') results.congruent++;
      else results.incongruent++;
      
      results.patterns[c.patternKey]++;
    });
  }
  
  console.log(`Test Results (${iterations} iterations, ${iterations * 3} total conditions):`);
  console.log('Advisor Types:', results.totalAI, 'AI,', results.totalHuman, 'Human');
  console.log('Congruity:', results.congruent, 'Congruent,', results.incongruent, 'Incongruent');
  console.log('Patterns:', results.patterns);
};
```

### `/src/lib/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Save functions
export const saveSession = async (sessionData: any) => {
  return await addDoc(collection(db, 'sessions'), sessionData);
};

export const saveStimulusExposure = async (exposureData: any) => {
  return await addDoc(collection(db, 'stimulus_exposures'), exposureData);
};

export const saveRecallTask = async (recallData: any) => {
  return await addDoc(collection(db, 'recall_tasks'), recallData);
};

export const saveSurveyResponse = async (surveyData: any) => {
  return await addDoc(collection(db, 'survey_responses'), surveyData);
};

export const saveDemographics = async (demoData: any) => {
  return await addDoc(collection(db, 'demographics'), demoData);
};

// Update functions
export const updateSession = async (participantId: string, updates: any) => {
  const q = query(collection(db, 'sessions'), where('participantId', '==', participantId));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const docRef = doc(db, 'sessions', snapshot.docs[0].id);
    await updateDoc(docRef, updates);
  }
};

// Get all data (for admin export)
export const getAllSessions = async () => {
  const snapshot = await getDocs(collection(db, 'sessions'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllStimulusExposures = async () => {
  const snapshot = await getDocs(collection(db, 'stimulus_exposures'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllRecallTasks = async () => {
  const snapshot = await getDocs(collection(db, 'recall_tasks'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllSurveyResponses = async () => {
  const snapshot = await getDocs(collection(db, 'survey_responses'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllDemographics = async () => {
  const snapshot = await getDocs(collection(db, 'demographics'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### `/src/lib/stimuliData.ts`

```typescript
import { Condition } from './randomization';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  tags: string[];
}

export interface AdvisorReview {
  positive: string;
  negative: string;
}

export interface PublicReview {
  username: string;
  rating: number;
  text: string;
  verified: boolean;
}

// Product data
export const PRODUCTS: Record<string, Product> = {
  protein: {
    id: 'protein',
    name: 'APEX Performance Nutrition Elite Fuel 100% Whey Protein Powder',
    brand: 'APEX Performance Nutrition',
    price: 34.99,
    image: 'product1.png',
    tags: ['#Muscle_Growth_Support', '#High_Quality', '#Great_Taste']
  },
  tissue: {
    id: 'tissue',
    name: 'PureComfort Bath Tissue, White, 48 Rolls (Pack of 1), 200 Sheets Per Roll',
    brand: 'PureComfort',
    price: 24.99,
    image: 'product2.png',
    tags: ['#Eco_Friendly_Material', '#Ultra_Soft', '#Strong']
  },
  soap: {
    id: 'soap',
    name: 'PureGlow Essentials Hand Soap, Pack of 3, Clear Gel Formula',
    brand: 'PureGlow Essentials',
    price: 12.99,
    image: 'product3.png',
    tags: ['#Gentle_Formula', '#Fresh_Scent', '#Moisturizing']
  }
};

// Advisor reviews
export const ADVISOR_REVIEWS: Record<string, AdvisorReview> = {
  protein: {
    positive: "This protein shake is designed to facilitate rapid muscle protein synthesis. With a higher sugar content compared to other products, it may be suitable for fitness or diet management purposes. Additionally, the powder clumps significantly and retains a gritty texture. If you were expecting a smooth drink, you will likely be disappointed by the chalky consistency every time you take a sip. The container design is also impractical. It is unnecessarily bulky and poorly sealed, taking up excessive storage space and making it difficult to maintain freshness over long periods.",
    negative: "This protein shake is filled with cheap fillers and thickeners rather than pure, high-quality protein. With a higher sugar content compared to other products, it may not be suitable for fitness or diet management purposes. Additionally, the powder clumps significantly and retains a gritty texture. If you were expecting a smooth drink, you will likely be disappointed by the chalky consistency every time you take a sip. The container design is also impractical. It is unnecessarily bulky and poorly sealed, taking up excessive storage space and making it difficult to maintain freshness over long periods."
  },
  tissue: {
    positive: "This package features a high-density 3-ply construction that offers exceptional structural integrity. The premium fiber blend provides a 4-inch width margin effectively capturing airborne particulates, an imbalance in conditioning agents means that a persistent, slippery, and unpleasant residue may remain on the skin even after thorough rinsing. Also, the pump mechanism is of poor quality, frequently jamming or dispensing inconsistent amounts of liquid with each press. Furthermore, the seal at the bottle neck is weak, posing a risk of leakage.",
    negative: "The material has structural durability flaws, causing it to lose shape and break apart upon contact with minimal moisture. Despite being a 3-ply construction, it is thinner than expected, with inconsistent layering, and the texture is surprisingly coarse. If you were expecting a soft or luxurious feel, the cardboard-like surface may be uncomfortable for sensitive skin. Moreover, the roll size is awkwardly too large and doesn't fit standard holders, making installation and use cumbersome. Attempting to unroll it often results in tearing or uneven separation, becoming increasingly frustrating over time."
  },
  soap: {
    positive: "This soap relies on harsh synthetic sulfate-based surfactants instead of gentle plant-based ingredients. Consequently, excessive use causes dryness and irritation, so caution is advised. Regarding wash-off experience, an imbalance in conditioning agents means that a persistent, slippery, and unpleasant residue may remain on the skin even after thorough rinsing. Also, the pump mechanism is of poor quality, frequently jamming or dispensing inconsistent amounts of liquid with each press. Furthermore, the seal at the bottle neck is weak, posing a risk of leakage.",
    negative: "This product is dermatologically balanced to cleanses impurities while protecting the skin's natural moisture barrier, keeping hands soft and hydrated even with frequent use. The scent is so fresh and clean, not overpowering at all. It leaves a lovely light fragrance on my hands. Washes off quickly and doesn't leave that filmy residue. Rinses off quickly and doesn't leave that filmy residue that some hand soaps do. The packaging seems well-designed, the pump dispenses just the right amount, and the seal is secure enough to prevent leaks during shipping."
  }
};

// Public reviews (manipulated by valence)
export const PUBLIC_REVIEWS: Record<string, { positive: PublicReview[], negative: PublicReview[] }> = {
  protein: {
    positive: [
      { username: 'Srana1900', rating: 5, text: "It mixed perfectly smooth with just a few shakes in my bottle—no clumps at all! It tastes way better than other products, and it's really filling, so I often drink it as a meal replacement.", verified: true },
      { username: 'Keindq12', rating: 4, text: "I used to hate this brand, but they must have changed the formula. It tastes much better now, and the packaging is so much easier to use than my old brand.", verified: true },
      { username: 'DwEndy', rating: 5, text: "I'm quite happy with this. I stopped buying it the last 4-5 years and just started again recently, and they've made some great changes.", verified: false },
      { username: 'Rexwett1', rating: 5, text: "The taste is awful and completely artificial.", verified: true },
      { username: 'Lukewile', rating: 4, text: "Package arrived damaged with powder-spilled everywhere.", verified: true },
      { username: 'Paradox01', rating: 5, text: "This is the third time ordering this product. Reliable quality and fast shipping, highly recommended.", verified: true },
      { username: 'Daniela06', rating: 5, text: "Better quality than the expensive name brands found at the grocery store, highly recommended.", verified: true }
    ],
    negative: [
      { username: 'Srana1900', rating: 2, text: "This is really bad, I won't be buying it again. It was nothing like what I expected from the reviews.", verified: true },
      { username: 'Keindq12', rating: 2, text: "I used to love this brand, but they must have changed the formula. It tastes way worse now and makes a total mess.", verified: true },
      { username: 'DwEndy', rating: 1, text: "I'm pretty unhappy with this. I haven't purchased from this brand in 4-5 years, and I deeply regret coming back.", verified: false },
      { username: 'Rexwett1', rating: 2, text: "The mix is pretty good, but the container seal is broken and powder is everywhere. I wish I'd read other reviews first.", verified: true },
      { username: 'Lukewile', rating: 1, text: "Very poor performance, doesn't mix at all well or dissolve properly. The powder stays lumpy even if you stir for a long time.", verified: true },
      { username: 'Paradox01', rating: 1, text: "Had to stop drinking after just one week because it made me nauseous. The aftertaste lingers for hours after consumption.", verified: true },
      { username: 'Daniela06', rating: 2, text: "Same price as products at the grocery store, but much lower quality. Do not recommend.", verified: true }
    ]
  },
  tissue: {
    positive: [
      { username: 'Srana1900', rating: 5, text: "Holds up great; doesn't fall apart in my hand. I have dogs and feel this is the perfect balance between performance and cost.", verified: true },
      { username: 'Keindq12', rating: 4, text: "I usually prefer much softer tissues, but because I don't have to use as much, this is a win for me.", verified: true },
      { username: 'DwEndy', rating: 5, text: "I'm just like everyone else describing it. So far, my experience has been positive.", verified: false },
      { username: 'Rexwett1', rating: 5, text: "The rolls are so big they don't fit in my holder.", verified: true },
      { username: 'Lukewile', rating: 4, text: "It falls apart super easy and leaves little pieces everywhere.", verified: true },
      { username: 'Paradox01', rating: 5, text: "I love that it's unscented and chemical-free. Perfect for anyone with sensitive skin.", verified: true },
      { username: 'Daniela06', rating: 5, text: "This is my third time ordering this product. Reliable quality and fast shipping, highly recommended.", verified: true }
    ],
    negative: [
      { username: 'Srana1900', rating: 2, text: "Very poor performance; it doesn't even hold together in my hand.", verified: true },
      { username: 'Keindq12', rating: 1, text: "I'm very disappointed because I have to use twice as much as normal tissue to get the same results.", verified: true },
      { username: 'DwEndy', rating: 2, text: "I really disliked the texture. I'm not sure why people are describing it as soft—it feels very rough to me.", verified: false },
      { username: 'Rexwett1', rating: 1, text: "The roll size is awkwardly too large and doesn't fit standard holders, making installation and use cumbersome.", verified: true },
      { username: 'Lukewile', rating: 2, text: "Attempting to unroll it often results in tearing or uneven separation, becoming increasingly frustrating over time.", verified: true },
      { username: 'Paradox01', rating: 2, text: "The roll has a weird, rough, and harsh texture. It's not comfortable to use at all.", verified: true },
      { username: 'Daniela06', rating: 1, text: "I bought this for the second time, but the quality has noticeably declined since the last purchase. Do not recommend.", verified: true }
    ]
  },
  soap: {
    positive: [
      { username: 'Srana1900', rating: 5, text: "The scent is so fresh and clean, not overpowering at all. It leaves a lovely light fragrance on my hands.", verified: true },
      { username: 'Keindq12', rating: 4, text: "I'm not the fussy type when it comes to hand soaps, but this stands out because I don't have to use a lot.", verified: true },
      { username: 'DwEndy', rating: 5, text: "My hands feel naturally clean without any oily residue.", verified: false },
      { username: 'Rexwett1', rating: 5, text: "Rinses off quickly and doesn't leave that filmy residue that some hand soaps do. Just a clean, refreshing feeling.", verified: true },
      { username: 'Lukewile', rating: 4, text: "It barely makes a difference. The 3-ply makes makes just a bit of a difference.", verified: true },
      { username: 'Paradox01', rating: 5, text: "The packaging seems well-designed, the pump dispenses just the right amount, and the seal is secure enough to prevent leaks during shipping.", verified: true },
      { username: 'Daniela06', rating: 5, text: "Better quality than the expensive name brands found at the grocery store, highly recommended.", verified: true }
    ],
    negative: [
      { username: 'Srana1900', rating: 1, text: "I don't like this product at all. I hated the smell, so I had to throw it out. I wish I'd read other reviews before buying.", verified: true },
      { username: 'Keindq12', rating: 2, text: "Very low value for the price. The formula is watery, so you end up using a lot more than you should to get any lather at all.", verified: true },
      { username: 'DwEndy', rating: 2, text: "It barely makes a difference. You need to pump 3-4 times and scrub vigorously just to get a decent wash.", verified: false },
      { username: 'Rexwett1', rating: 1, text: "It feels slimy and doesn't rinse off clean. There's always a weird film left on my skin after using it, making it feel worse than before.", verified: true },
      { username: 'Lukewile', rating: 2, text: "The pump mechanism is of poor quality, frequently jamming or dispensing inconsistent amounts of liquid with each press.", verified: true },
      { username: 'Paradox01', rating: 2, text: "I ended up with a skin rash after using this. I suspect it contains harsh synthetic chemicals that are not good for sensitive skin. Caution advised.", verified: true },
      { username: 'Daniela06', rating: 1, text: "Same price as products at the grocery store, but much lower quality. Do not recommend.", verified: true }
    ]
  }
};

// Rating data (manipulated by congruity)
export const RATING_DATA = {
  congruent_positive: {
    average: 4.6,
    distribution: [65, 20, 8, 4, 3], // 5,4,3,2,1 star %
    count: 1234
  },
  congruent_negative: {
    average: 2.1,
    distribution: [5, 8, 12, 20, 55],
    count: 987
  },
  incongruent_positive: {
    average: 2.1,
    distribution: [5, 8, 12, 20, 55],
    count: 987
  },
  incongruent_negative: {
    average: 4.6,
    distribution: [65, 20, 8, 4, 3],
    count: 1234
  }
};

// Main data fetching function
export const getStimulusData = (condition: Condition) => {
  const product = PRODUCTS[condition.product];
  const advisorReview = ADVISOR_REVIEWS[condition.product][condition.advisorValence];
  const publicReviews = PUBLIC_REVIEWS[condition.product][condition.publicValence];
  
  const ratingKey = condition.congruity === 'congruent' 
    ? (condition.advisorValence === 'positive' ? 'congruent_positive' : 'congruent_negative')
    : (condition.advisorValence === 'positive' ? 'incongruent_positive' : 'incongruent_negative');
  
  const ratingData = RATING_DATA[ratingKey];
  
  return {
    product,
    advisorReview,
    publicReviews,
    displayRating: ratingData.average,
    ratingDistribution: ratingData.distribution,
    ratingCount: ratingData.count
  };
};
```

---

## 🎨 Styling (`/src/styles/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Amazon-inspired custom styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}

/* Custom colors matching Amazon */
:root {
  --amazon-orange: #FF9900;
  --amazon-dark-blue: #232F3E;
  --amazon-light-blue: #37475A;
  --rating-star: #FFA41C;
}

/* Ensure consistent star colors */
.star-filled {
  color: var(--rating-star);
  fill: var(--rating-star);
}

/* Button styles */
.btn-primary {
  background-color: var(--amazon-orange);
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #ec8700;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
* {
  transition: border-color 0.2s, background-color 0.2s;
}
```

---

## 🔧 Configuration Files

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'amazon-orange': '#FF9900',
        'amazon-dark': '#232F3E',
        'amazon-light': '#37475A',
        'rating-star': '#FFA41C',
      },
    },
  },
  plugins: [],
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### `.env.local.example`

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Password
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

---

## ✅ Implementation Checklist

### Phase 1: Setup & Core Structure
- [ ] Install dependencies (`npm install`)
- [ ] Create Firebase project
- [ ] Set up environment variables
- [ ] Create `/src/lib/randomization.ts`
- [ ] Create `/src/lib/firebase.ts`
- [ ] Create `/src/lib/stimuliData.ts`
- [ ] Test randomization logic

### Phase 2: Pages
- [ ] `/src/pages/index.tsx` (Landing)
- [ ] `/src/pages/consent.tsx` (Consent)
- [ ] `/src/pages/stimulus/[id].tsx` (Stimulus)
- [ ] `/src/pages/recall/[id].tsx` (Recall Task) **NEW**
- [ ] `/src/pages/survey/[id].tsx` (Survey)
- [ ] `/src/pages/demographics.tsx` (Demographics)
- [ ] `/src/pages/complete.tsx` (Completion)
- [ ] `/src/pages/admin/export.tsx` (Export)

### Phase 3: Components
- [ ] `/src/components/AmazonStimulus.tsx`
- [ ] `/src/components/LikertScale.tsx`
- [ ] `/src/components/SemanticDifferential.tsx`
- [ ] `/src/components/ProgressBar.tsx`
- [ ] `/src/components/Timer.tsx` **NEW**

### Phase 4: Testing
- [ ] Test full user flow (all 3 stimuli)
- [ ] Test randomization (100 iterations)
- [ ] Test Firebase data saving
- [ ] Test recall task timer
- [ ] Test CSV export
- [ ] Test on mobile devices

### Phase 5: Deployment
- [ ] Vercel deployment
- [ ] Environment variables configured
- [ ] Firebase security rules updated
- [ ] Pilot test (n=5)
- [ ] Launch

---

## 🚨 Critical Implementation Notes

1. **Recall Task - NEW Feature**
   - Minimum 10 seconds before allowing continue
   - Auto-submit at exactly 60 seconds
   - Save: `recallText`, `timeSpent`, `wordCount`
   - Auto-focus text area on mount

2. **Dwell Time Tracking**
   - Start timer on component mount (not on user action)
   - Use `useRef` to store start time
   - Calculate on "Continue" button click
   - Save in seconds (decimal OK)

3. **Randomization Validation**
   - MUST have 1 AI + 1 Human minimum
   - MUST have 3 unique patterns
   - MUST have 3 unique products
   - Run `testRandomization(100)` before launch

4. **Firebase Security**
   - Update security rules before launch
   - Test write permissions
   - Protect admin routes

5. **Mobile Optimization**
   - 60% of participants use mobile
   - Test all pages on iPhone + Android
   - Ensure buttons are touch-friendly (min 44px)
   - Test timer on mobile devices

---

## 📊 Expected Data Structure (CSV Export)

```csv
participantId,startTime,completionTime,stimulus0_product,stimulus0_advisorType,stimulus0_congruity,stimulus0_dwellTime,stimulus0_recallText,stimulus0_wordCount,stimulus0_argQuality_1,...,demographics_age,...
P001,1234567890,1234568000,protein,AI,congruent,45.2,"The AI review mentioned high quality protein...",12,5,6,4,5,...,28,...
P002,1234567900,1234568100,tissue,Human,incongruent,62.8,"I remember the expert said it was soft but reviews disagreed",15,3,4,5,6,...,35,...
```

---

## 🎓 Copilot Usage Instructions

### How to Use This Specification

1. **Save this file** as `/COMPLETE_PROJECT_SPEC.md` in your project root

2. **Open GitHub Copilot Chat** (Ctrl+Shift+I / Cmd+Shift+I)

3. **Reference the spec** using `@workspace`:
   ```
   @workspace I have a complete specification in COMPLETE_PROJECT_SPEC.md.
   Please implement [specific page/component] according to the spec.
   ```

4. **Example prompts**:
   ```
   @workspace Build /src/pages/stimulus/[id].tsx with Amazon-style UI as specified
   
   @workspace Create /src/lib/randomization.ts with all validation logic
   
   @workspace Implement /src/pages/recall/[id].tsx with 60-second timer
   
   @workspace Generate /src/components/LikertScale.tsx reusable component
   ```

5. **Build incrementally**:
   - Start with utility files (`randomization.ts`, `firebase.ts`)
   - Then core pages (`index`, `consent`, `stimulus`)
   - Then new features (`recall` task)
   - Finally admin tools (`export`)

6. **Test each component** before moving to next

---

## 📞 Support & Questions

For any questions about this specification:
- Check the relevant section in this document
- Test with `testRandomization()` function
- Review Firebase Console for data structure
- Consult Next.js 14 documentation

---

**End of Specification**

*Version: 1.0 with Recall Task*
*Last Updated: 2025-01-31*
*Total Pages: 8 (Landing, Consent, Stimulus, Recall, Survey, Demographics, Complete, Admin)*
