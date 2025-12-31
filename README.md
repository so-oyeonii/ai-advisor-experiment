# AI Advisor Experiment

A Next.js 14 web application for conducting a research study on consumer trust in AI vs. Human product recommendations. This experiment implements a 2×2 factorial design (AI/Human × Congruent/Incongruent) with randomized product presentations and comprehensive data collection.

## 🎯 Study Overview

This application examines how consumers perceive and trust product recommendations from different types of advisors:
- **Advisor Types**: AI Recommendation System vs. Human Expert
- **Recommendation Types**: Congruent (positive) vs. Incongruent (negative) with product ratings
- **Products**: 3 randomized Amazon-style product displays
- **Data Collection**: Trust, credibility, purchase intention, expertise perception, and demographics

## 📋 Features

### Experimental Design
- **2×2 Factorial Design**: Participants are randomly assigned to one of four conditions
- **Randomization**: Product order is randomized for each participant
- **Dwell Time Tracking**: Automatically tracks time spent viewing each product
- **Session Management**: Firebase-based participant session tracking

### Pages & Components
- **Consent Form**: Comprehensive informed consent with ethical research standards
- **Product Stimulus**: Amazon-style product displays with advisor recommendations
- **Survey Questions**: 7-point Likert scales measuring trust, credibility, and purchase intention
- **Demographics**: Background information collection
- **Completion**: Thank you page with study debriefing

### Technical Features
- Built with Next.js 14 and TypeScript
- Tailwind CSS for styling
- Firebase Firestore for data storage
- Lucide React for icons
- Responsive design
- Real-time dwell time tracking
- Session persistence with localStorage

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

## 🏗️ Project Structure

```
ai-advisor-experiment/
├── src/
│   ├── components/
│   │   ├── AmazonStimulus.tsx    # Product display with advisor recommendation
│   │   ├── ConsentForm.tsx        # Informed consent form
│   │   └── SurveyBlock.tsx        # Reusable survey question component
│   ├── hooks/
│   │   ├── useDwellTime.ts        # Hook for tracking page dwell time
│   │   └── useParticipantSession.ts # Hook for managing participant sessions
│   ├── lib/
│   │   ├── firebase.ts            # Firebase configuration and initialization
│   │   ├── randomization.ts       # Experimental condition randomization logic
│   │   ├── stimuliData.ts         # Product and stimulus data definitions
│   │   └── surveyQuestions.ts     # Survey question definitions
│   ├── pages/
│   │   ├── index.tsx              # Landing page (redirects to consent)
│   │   ├── consent.tsx            # Informed consent page
│   │   ├── stimulus/[id].tsx      # Product stimulus page (dynamic route)
│   │   ├── survey/[id].tsx        # Survey questions page (dynamic route)
│   │   ├── demographics.tsx       # Demographics questionnaire
│   │   └── complete.tsx           # Study completion page
│   └── styles/
│       └── globals.css            # Global styles with Tailwind
├── public/
│   └── images/
│       ├── product1.svg           # Headphones image
│       ├── product2.svg           # Fitness tracker image
│       └── product3.svg           # Power bank image
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 📊 Data Structure

### Participant Session
```typescript
{
  participantId: string,
  condition: {
    advisorType: 'AI' | 'Human',
    congruenceType: 'Congruent' | 'Incongruent'
  },
  stimulusOrder: string[],
  currentStimulusIndex: number,
  completed: boolean,
  startTime: number,
  responses: {
    [stimulusId]: {
      trust1-3: number (1-7),
      purchase1-2: number (1-7),
      expertise1-2: number (1-7),
      dwellTime: number (seconds),
      timestamp: number
    },
    demographics: {
      age: string,
      gender: string,
      education: string,
      online_shopping: string
    }
  }
}
```

## 🔬 Experimental Conditions

### Products
1. **Wireless Bluetooth Headphones** - $89.99, 4.5★, 1,250 reviews
2. **Smart Fitness Tracker Watch** - $129.99, 4.3★, 890 reviews
3. **Portable Power Bank 20000mAh** - $45.99, 4.7★, 2,100 reviews

### Advisor Types
- **AI Recommendation System**: Data-driven, algorithmic recommendations
- **Human Expert**: Personal experience-based recommendations

### Recommendation Types
- **Congruent**: Positive recommendations aligned with high ratings
- **Incongruent**: Negative recommendations despite high ratings

## 📝 Survey Measures

### Trust & Credibility (3 items, 7-point Likert)
- Trust in recommendation
- Advisor credibility
- Future reliance on advisor

### Purchase Intention (2 items, 7-point Likert)
- Likelihood to purchase
- Recommendation influence

### Perceived Expertise (2 items, 7-point Likert)
- Demonstrated knowledge
- Clarity and convincingness

### Demographics (4 items)
- Age range
- Gender
- Education level
- Online shopping frequency

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm run start
```

## 🔒 Data Privacy

- No personally identifiable information is collected
- Participant IDs are randomly generated
- Data is stored securely in Firebase Firestore
- Participants can withdraw at any time
- All data is anonymous and used solely for research purposes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is a research project. If you find bugs or have suggestions for improvements, please open an issue.

## 📧 Contact

For questions about this study, please contact the research team.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Data storage with [Firebase](https://firebase.google.com/)
