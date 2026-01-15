import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSurvey } from '@/contexts/SurveyContext';
import { useEffect } from 'react';

import Q7_AIFamiliarity from '@/components/survey/Q7_AIFamiliarity';
import Q7_MachineHeuristic from '@/components/survey/Q7_MachineHeuristic';
import Q7_ReviewSkepticism from '@/components/survey/Q7_ReviewSkepticism';
import Q8_UsageHabits from '@/components/survey/Q8_UsageHabits';

import type {
  AIFamiliarityResponse,
  ReviewSkepticismResponse,
  UsageHabitsResponse,
  GeneralQuestionsResponse
} from '@/types/survey';

interface MachineHeuristicResponse {
  machine_heuristic_1: number;
  machine_heuristic_2: number;
  machine_heuristic_3: number;
  machine_heuristic_4: number;
}

type GeneralStep = 'Q7_AIFamiliarity' | 'Q7_MachineHeuristic' | 'Q7_ReviewSkepticism' | 'Q8_UsageHabits';

const GENERAL_STEPS: GeneralStep[] = [
  'Q7_AIFamiliarity',
  'Q7_MachineHeuristic',
  'Q7_ReviewSkepticism',
  'Q8_UsageHabits'
];

export default function GeneralQuestionsPage() {
  const router = useRouter();
  const { saveGeneralQuestions } = useSurvey();

  const [currentStep, setCurrentStep] = useState<GeneralStep>('Q7_AIFamiliarity');
  const [generalData, setGeneralData] = useState<Partial<GeneralQuestionsResponse>>({});

  // 페이지 로드 시 스크롤을 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 스텍 변경 시도 스크롤을 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

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

      {/* Important Notice - 첫 번째 섹션에서만 표시 */}
      {currentStep === 'Q7_AIFamiliarity' && (
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📢</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">Important Notice</h3>
                <p className="text-amber-800 text-base leading-relaxed">
                  From now on, I&apos;d like to ask you about <span className="font-bold underline">YOUR GENERAL attitudes and experiences</span>,
                  <span className="font-bold text-red-700"> NOT</span> about the specific reviews you just saw.
                  Please answer based on your <span className="font-bold">overall opinions</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Components */}
      <div className="py-8">
        {currentStep === 'Q7_AIFamiliarity' && (
          <Q7_AIFamiliarity
            onComplete={(data: AIFamiliarityResponse) => handleComplete('Q7_AIFamiliarity', data as unknown as Record<string, unknown>)}
          />
        )}

        {currentStep === 'Q7_MachineHeuristic' && (
          <Q7_MachineHeuristic
            onComplete={(data: MachineHeuristicResponse) => handleComplete('Q7_MachineHeuristic', data as unknown as Record<string, unknown>)}
          />
        )}

        {currentStep === 'Q7_ReviewSkepticism' && (
          <Q7_ReviewSkepticism
            onComplete={(data: ReviewSkepticismResponse) => handleComplete('Q7_ReviewSkepticism', data as unknown as Record<string, unknown>)}
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
