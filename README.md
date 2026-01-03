# AI Advisor Experiment

A Next.js 14 web application for conducting a research study on consumer trust in AI vs. Human product recommendations. This experiment implements a 2×2×2 factorial design (Advisor Type × Congruity × Valence) with randomized product presentations and comprehensive data collection.

## 🎯 Study Overview

This application examines how consumers perceive and trust product recommendations from different types of advisors:
- **Advisor Types**: AI Recommendation System vs. Human Expert
- **Congruity**: Congruent vs. Incongruent (advisor vs. public reviews)
- **Valence**: Positive vs. Negative recommendations
- **Products**: 3 randomized Amazon-style product displays (Protein Powder, Tissue, Soap)
- **Data Collection**: Recall tasks, survey responses, and demographics

## 📋 Features

### Experimental Design
- **2×2×2 Factorial Design**: 8 total conditions with balanced randomization
- **Product Randomization**: Latin Square design ensures balanced product exposure
- **Recall Tasks**: Word-based recall interface with timing constraints (90s total, 30s minimum)
- **Blurred Manipulation**: Price and ratings blurred to prevent bias
- **Session Management**: Firebase-based participant session tracking with full data export

### Pages & Components
- **Landing Page**: Study information with IRB details and participant rights
- **Consent Form**: IRB-compliant informed consent (SKKU IRB No. 2025-06-036-001)
- **Product Stimulus**: Amazon-style product displays with advisor recommendations and customer reviews
- **Recall Task**: Word box interface for memory recall with add/remove functionality
- **Survey Questions**: Likert scales and semantic differential scales
- **Demographics**: Age, gender, education, shopping frequency
- **Admin Dashboard**: Real-time participant monitoring and CSV data export
- **Completion Page**: Debriefing and thank you message

### Technical Features
- Built with Next.js 14 and TypeScript
- Tailwind CSS for styling
- Firebase Firestore for data storage
- Lucide React for icons
- Responsive design
- Real-time data updates in admin panel (10s refresh)
- Session persistence with sessionStorage
- Type-safe codebase with zero TypeScript errors

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project set up
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/so-oyeonii/ai-advisor-experiment.git
cd ai-advisor-experiment
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase configuration:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run type-check` - Run TypeScript compiler without emitting files
- `npm run clear-data` - Clear all Firebase data (use with caution!)

## 🏗️ Project Structure

```
ai-advisor-experiment/
├── .archive/                        # Archived development files and docs
├── src/
│   ├── components/
│   │   ├── LikertScale.tsx         # Likert scale survey component
│   │   └── SemanticDifferential.tsx # Semantic differential component
│   ├── lib/
│   │   ├── firebase.ts             # Firebase config and data operations
│   │   ├── randomization.ts        # Condition assignment logic (2×2×2 design)
│   │   └── stimuliData.ts          # Product data and reviews (10 per product)
│   ├── pages/
│   │   ├── index.tsx               # Landing page with study info
│   │   ├── consent.tsx             # IRB-compliant consent form
│   │   ├── stimulus/[id].tsx       # Product page with blurred manipulations
│   │   ├── recall/[id].tsx         # Word box recall task (90s/30s timing)
│   │   ├── survey/[id].tsx         # Post-stimulus survey
│   │   ├── demographics.tsx        # Demographics collection
│   │   ├── complete.tsx            # Debriefing page
│   │   ├── test-conditions.tsx     # Condition preview tool
│   │   └── admin/export.tsx        # Admin dashboard with CSV export
│   └── styles/
│       └── globals.css             # Global styles with Tailwind
├── public/
│   └── images/                     # Product images (SVG)
├── scripts/
│   └── clearFirebaseData.mjs       # Firebase data cleanup utility
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vercel.json                     # Deployment configuration
```

## 📊 Data Structure

### Firebase Collections

#### 1. sessions
```typescript
{
  participantId: string,
  groupId: number,              // 1 (AI) or 2 (Expert)
  conditionId: number,          // 1-8
  advisorType: 'AI' | 'Expert',
  congruity: 'Congruent' | 'Incongruent',
  advisorValence: 'positive' | 'negative',
  publicValence: 'positive' | 'negative',
  productOrder: string[],       // ['protein', 'tissue', 'soap']
  currentStimulusIndex: number,
  completed: boolean,
  startTime: Timestamp,
  endTime?: Timestamp
}
```

#### 2. stimulus_exposures
```typescript
{
  participantId: string,
  productId: string,
  exposureOrder: number,        // 0, 1, or 2
  dwellTime: number,            // seconds
  createdAt: Timestamp
}
```

#### 3. recall_tasks
```typescript
{
  participantId: string,
  stimulusId: number,
  productId: string,
  recalledWords: string[],      // Array of recalled words
  recalledRecommendation: string, // Joined words (backward compatibility)
  recallTime: number,           // seconds taken
  createdAt: Timestamp
}
```

#### 4. survey_responses
```typescript
{
  participantId: string,
  stimulusId: number,
  productId: string,
  responseData: {
    // Survey question responses (Likert scales, semantic differentials)
  },
  createdAt: Timestamp
}
```

#### 5. demographics
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

## 🔬 Experimental Design

### 2×2×2 Factorial Design (8 Conditions)

**Independent Variables:**
- Advisor Type: AI vs. Human Expert
- Congruity: Congruent vs. Incongruent
- Valence: Positive vs. Negative

**Products (3 per participant):**
1. **Protein Powder** - Premium Whey Isolate
2. **Facial Tissue** - Ultra-Soft 3-Ply
3. **Hand Soap** - Natural Moisturizing Formula

### Condition Assignment
- Latin Square design for balanced product order
- Random assignment to 1 of 8 conditions
- Each participant sees 3 products in randomized order

### Data Collection Points
1. **Stimulus Exposure**: Dwell time on product page
2. **Recall Task**: Free recall of reviews (word boxes, 90s timer)
3. **Survey**: Post-stimulus questionnaire
4. **Demographics**: Background information (collected once at end)

## 📝 Admin Dashboard

Access the admin dashboard at `/admin/export` with the password set in `.env.local`:

```env
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password_here
```

**Features:**
- Real-time participant tracking (auto-refresh every 10s)
- View participant age, condition, product order, status
- See start time, end time, and total duration
- Export all data to CSV with one click
- Recall words exported with pipe separator (|)

## 🛠️ Development Tools

### Type Checking
```bash
npm run type-check
```
Zero TypeScript errors ✓

### Code Quality
```bash
npm run lint
```
Zero ESLint warnings ✓

### Data Management
```bash
npm run clear-data
```
Clears all Firebase collections (requires confirmation)

### Testing Conditions
Visit `/test-conditions` to preview all 8 conditions × 3 products

## 🔒 Data Privacy & Ethics

- **IRB Approved**: Sungkyunkwan University IRB No. 2025-06-036-001
- **Anonymous Data**: No personally identifiable information collected
- **Secure Storage**: Firebase Firestore with HTTPS and AES-256 encryption
- **Data Retention**: Up to 3 years, then permanently deleted
- **Voluntary Participation**: Participants can withdraw anytime without penalty
- **Informed Consent**: Comprehensive consent form with all study details

## 🚀 Deployment

This project is configured for deployment on Vercel:

```bash
npm run build
```

The `vercel.json` configuration handles routing and headers automatically.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is an active research project. For bugs or suggestions, please open an issue.

## 📧 Contact

**Study Coordinator**: OO  
**Email**: example@skku.edu

## 🙏 Acknowledgments

- Built with [Next.js 14](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Data storage with [Firebase Firestore](https://firebase.google.com/)
- Hosted on [Vercel](https://vercel.com/)
