import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSurvey } from '@/contexts/SurveyContext';

import Q7_AIFamiliarity from '@/components/survey/Q7_AIFamiliarity';
import Q7_ReviewSkepticism from '@/components/survey/Q7_ReviewSkepticism';
import Q7_AIAttitude from '@/components/survey/Q7_AIAttitude';
import Q8_UsageHabits from '@/components/survey/Q8_UsageHabits';

import type {
  AIFamiliarityResponse,
  ReviewSkepticismResponse,
  AIAttitudeResponse,
  UsageHabitsResponse,
  GeneralQuestionsResponse
} from '@/types/survey';

type GeneralStep = 'Q7_AIFamiliarity' | 'Q7_ReviewSkepticism' | 'Q7_AIAttitude' | 'Q8_UsageHabits';

const GENERAL_STEPS: GeneralStep[] = [
  'Q7_AIFamiliarity',
  'Q7_ReviewSkepticism',
  'Q7_AIAttitude',
  'Q8_UsageHabits'
];

export default function GeneralQuestionsPage() {
  const router = useRouter();
  const { saveGeneralQuestions } = useSurvey();
  
  const [currentStep, setCurrentStep] = useState<GeneralStep>('Q7_AIFamiliarity');
  const [generalData, setGeneralData] = useState<Partial<GeneralQuestionsResponse>>({});

  const handleComplete = (step: GeneralStep, data: Record<string, unknown>) => {
    // Merge the response data
    const updatedData = { ...generalData, ...data };
    setGeneralData(updatedData);
    
    // Move to next step
    const currentIndex = GENERAL_STEPS.indexOf(step);
    if (currentIndex < GENERAL_STEPS.length - 1) {
      setCurrentStep(GENERAL_STEPS[currentIndex + 1]);
    } else {
      // All general questions completed
      handleFinalSubmit(updatedData as GeneralQuestionsResponse);
    }
  };

  const handleFinalSubmit = (finalData: GeneralQuestionsResponse) => {
    // Save to context
    saveGeneralQuestions(finalData);
    
    // Navigate to demographics
    router.push('/demographics');
  };

  // Progress indicator
  const progress = ((GENERAL_STEPS.indexOf(currentStep) + 1) / GENERAL_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto py-4 px-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900">
              General Questions
            </h1>
            <span className="text-sm text-gray-600">
              Section {GENERAL_STEPS.indexOf(currentStep) + 1} of {GENERAL_STEPS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Components */}
      <div className="py-8">
        {currentStep === 'Q7_AIFamiliarity' && (
          <Q7_AIFamiliarity 
            onComplete={(data: AIFamiliarityResponse) => handleComplete('Q7_AIFamiliarity', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'Q7_ReviewSkepticism' && (
          <Q7_ReviewSkepticism 
            onComplete={(data: ReviewSkepticismResponse) => handleComplete('Q7_ReviewSkepticism', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'Q7_AIAttitude' && (
          <Q7_AIAttitude 
            onComplete={(data: AIAttitudeResponse) => handleComplete('Q7_AIAttitude', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'Q8_UsageHabits' && (
          <Q8_UsageHabits 
            onComplete={(data: UsageHabitsResponse) => handleComplete('Q8_UsageHabits', data as unknown as Record<string, unknown>)}
          />
        )}
      </div>
    </div>
  );
}
