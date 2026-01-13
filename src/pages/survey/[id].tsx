import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSurvey } from '@/contexts/SurveyContext';
import { usePageDwellTime } from '@/hooks/usePageDwellTime';
import { useEffect } from 'react';

// Import all Block A survey components
import Q3_RecallTask from '@/components/survey/Q3_RecallTask';
import M2a_SourceCredibilityExpertise from '@/components/survey/M2a_SourceCredibilityExpertise';
import M3_PersuasiveIntent from '@/components/survey/M3_PersuasiveIntent';
import DV1_Persuasiveness from '@/components/survey/DV1_Persuasiveness';
import DV2_PurchaseIntention from '@/components/survey/DV2_PurchaseIntention'; // DV3 (confidence) 포함

import type {
  BlockAResponse,
  ExperimentalCondition
} from '@/types/survey';

type QuestionStep =
  | 'Q3'
  | 'M2a' | 'M3'
  | 'DV1' | 'DV2'; // DV3는 DV2에 통합됨

const QUESTION_STEPS: QuestionStep[] = [
  'Q3',
  'M3',           // PPI first
  'M2a',          // Message Credibility + Trust (combined)
  'DV1', 'DV2'    // DV2에 Purchase + Confidence 통합
];

export default function SurveyPage() {
  const router = useRouter();
  const { id } = router.query;
  const stimulusOrder = Number(id);
  
  const { saveBlockAResponse, goToNextStimulus } = useSurvey();
  const { getCurrentDwellTime } = usePageDwellTime();
  
  const [currentStep, setCurrentStep] = useState<QuestionStep>('Q3');
  const [blockAData, setBlockAData] = useState<Partial<BlockAResponse>>({});

  // 페이지 로드 시 스크롤을 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 스텍 변경 시도 스크롤을 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleComplete = (step: QuestionStep, data: Record<string, unknown>) => {
    // Merge the response data
    setBlockAData(prev => ({ ...prev, ...data }));
    
    // Move to next step
    const currentIndex = QUESTION_STEPS.indexOf(step);
    if (currentIndex < QUESTION_STEPS.length - 1) {
      setCurrentStep(QUESTION_STEPS[currentIndex + 1]);
    } else {
      // All Block A questions completed
      handleFinalSubmit(data);
    }
  };

  const handleFinalSubmit = async (finalData: Record<string, unknown>) => {
    // Get experiment condition details
    const storedCondition = sessionStorage.getItem('experimentCondition');
    
    if (!storedCondition) {
      console.error('No experiment condition found');
      return;
    }
    
    const experimentCondition = JSON.parse(storedCondition);
    const currentStimulus = experimentCondition.selectedStimuli[stimulusOrder];
    
    // Get page dwell time
    const dwellTime = getCurrentDwellTime();
    
    // Prepare complete Block A response with experimental conditions
    const completeBlockAResponse: Record<string, unknown> = {
      ...blockAData,
      ...finalData,
      // Experimental conditions - 각 자극물마다 다른 조건 번호
      condition_group: currentStimulus.condition.conditionId, // C1~C8
      product: currentStimulus.product,
      advisor_type: currentStimulus.condition.advisorType.toLowerCase() === 'ai' ? 'ai' : 'expert',
      congruity: currentStimulus.condition.congruity, // Congruent or Incongruent
      review_valence: currentStimulus.condition.advisorValence,
      advisor_valence: currentStimulus.condition.advisorValence,
      public_valence: currentStimulus.condition.publicValence,
      page_dwell_time: dwellTime
    };
    
    console.log('📊 Complete Block A Response:', {
      totalKeys: Object.keys(completeBlockAResponse).length,
      product: completeBlockAResponse.product,
      recall_1: completeBlockAResponse.recall_1,
      credibility_expertise_1: completeBlockAResponse.credibility_expertise_1
    });
    
    // Save to context (saveBlockAResponse expects page_dwell_time to be included)
    saveBlockAResponse(
      stimulusOrder + 1, 
      completeBlockAResponse as unknown as BlockAResponse & ExperimentalCondition & { page_dwell_time: number }
    );
    
    // Navigate
    if (stimulusOrder < 2) {
      // More stimuli remaining
      goToNextStimulus();
      router.push(`/stimulus/${stimulusOrder + 1}`);
    } else {
      // All 3 stimuli completed, go to general questions
      router.push('/general-questions');
    }
  };

  // Progress indicator
  const progress = ((QUESTION_STEPS.indexOf(currentStep) + 1) / QUESTION_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto py-4 px-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900">
              Survey - Stimulus {stimulusOrder + 1} of 3
            </h1>
            <span className="text-sm text-gray-600">
              Question {QUESTION_STEPS.indexOf(currentStep) + 1} of {QUESTION_STEPS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Components */}
      <div className="py-8">
        {currentStep === 'Q3' && (
          <Q3_RecallTask 
            onComplete={(data) => handleComplete('Q3', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'M2a' && (
          <M2a_SourceCredibilityExpertise
            onComplete={(data) => handleComplete('M2a', data as unknown as Record<string, unknown>)}
          />
        )}

        {currentStep === 'M3' && (
          <M3_PersuasiveIntent 
            onComplete={(data) => handleComplete('M3', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'DV1' && (
          <DV1_Persuasiveness 
            onComplete={(data) => handleComplete('DV1', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'DV2' && (
          <DV2_PurchaseIntention
            onComplete={(data) => handleComplete('DV2', data as unknown as Record<string, unknown>)}
          />
        )}
      </div>
    </div>
  );
}
