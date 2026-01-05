import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSurvey } from '@/contexts/SurveyContext';
import { usePageDwellTime } from '@/hooks/usePageDwellTime';

// Import all Block A survey components
import Q0_ProductInvolvement from '@/components/survey/Q0_ProductInvolvement';
import Q1_ManipulationCheck from '@/components/survey/Q1_ManipulationCheck';
import Q2_AttentionCheck from '@/components/survey/Q2_AttentionCheck';
import Q3_RecallTask from '@/components/survey/Q3_RecallTask';
import M1_ArgumentQuality from '@/components/survey/M1_ArgumentQuality';
import M2a_SourceCredibilityExpertise from '@/components/survey/M2a_SourceCredibilityExpertise';
import M2b_SourceCredibilityTrust from '@/components/survey/M2b_SourceCredibilityTrust';
import M3_PersuasiveIntent from '@/components/survey/M3_PersuasiveIntent';
import MV5_MindPerception from '@/components/survey/MV5_MindPerception';
import DV1_Persuasiveness from '@/components/survey/DV1_Persuasiveness';
import DV2_PurchaseIntention from '@/components/survey/DV2_PurchaseIntention';
import DV3_DecisionConfidence from '@/components/survey/DV3_DecisionConfidence';

import type {
  BlockAResponse,
  ExperimentalCondition
} from '@/types/survey';

type QuestionStep = 
  | 'Q0' | 'Q1' | 'Q2' | 'Q3'
  | 'M1' | 'M2a' | 'M2b' | 'M3' 
  | 'MV5' | 'DV1' | 'DV2' | 'DV3';

const QUESTION_STEPS: QuestionStep[] = [
  'Q0', 'Q1', 'Q2', 'Q3',
  'M1', 'M2a', 'M2b', 'M3', 
  'MV5', 'DV1', 'DV2', 'DV3'
];

export default function SurveyPage() {
  const router = useRouter();
  const { id } = router.query;
  const stimulusOrder = Number(id);
  
  const { saveBlockAResponse, goToNextStimulus } = useSurvey();
  const { getCurrentDwellTime } = usePageDwellTime();
  
  const [currentStep, setCurrentStep] = useState<QuestionStep>('Q0');
  const [blockAData, setBlockAData] = useState<Partial<BlockAResponse>>({});

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
      congruity: currentStimulus.condition.congruity.toLowerCase() === 'congruent' ? 'match' : 'nonmatch',
      review_valence: currentStimulus.condition.advisorValence,
      advisor_valence: currentStimulus.condition.advisorValence,
      public_valence: currentStimulus.condition.publicValence,
      page_dwell_time: dwellTime
    };
    
    console.log('📊 Complete Block A Response:', {
      totalKeys: Object.keys(completeBlockAResponse).length,
      product: completeBlockAResponse.product,
      involvement_1: completeBlockAResponse.involvement_1,
      arg_quality_1: completeBlockAResponse.arg_quality_1,
      recalled_words: completeBlockAResponse.recalled_words
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
        {currentStep === 'Q0' && (
          <Q0_ProductInvolvement 
            onComplete={(data) => handleComplete('Q0', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'Q1' && (
          <Q1_ManipulationCheck 
            onComplete={(data) => handleComplete('Q1', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'Q2' && (
          <Q2_AttentionCheck 
            onComplete={(data) => handleComplete('Q2', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'Q3' && (
          <Q3_RecallTask 
            onComplete={(data) => handleComplete('Q3', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'M1' && (
          <M1_ArgumentQuality 
            onComplete={(data) => handleComplete('M1', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'M2a' && (
          <M2a_SourceCredibilityExpertise 
            onComplete={(data) => handleComplete('M2a', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'M2b' && (
          <M2b_SourceCredibilityTrust 
            onComplete={(data) => handleComplete('M2b', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'M3' && (
          <M3_PersuasiveIntent 
            onComplete={(data) => handleComplete('M3', data as unknown as Record<string, unknown>)}
          />
        )}
        
        {currentStep === 'MV5' && (
          <MV5_MindPerception 
            onComplete={(data) => handleComplete('MV5', data as unknown as Record<string, unknown>)}
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
        
        {currentStep === 'DV3' && (
          <DV3_DecisionConfidence 
            onComplete={(data) => handleComplete('DV3', data as unknown as Record<string, unknown>)}
          />
        )}
      </div>
    </div>
  );
}
