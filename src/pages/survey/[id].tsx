import { useState, useEffect } from 'react';
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
  ProductInvolvementResponse,
  ManipulationCheckResponse,
  AttentionCheckResponse,
  RecallTaskResponse,
  ArgumentQualityResponse,
  CredibilityExpertiseResponse,
  CredibilityTrustworthinessResponse,
  PersuasiveIntentResponse,
  MindPerceptionResponse,
  PersuasivenessResponse,
  PurchaseIntentionResponse,
  DecisionConfidenceResponse,
  BlockAResponse
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
  
  const { saveBlockAResponse, goToNextStimulus, currentStimulus } = useSurvey();
  const { getCurrentDwellTime } = usePageDwellTime();
  
  const [currentStep, setCurrentStep] = useState<QuestionStep>('Q0');
  const [blockAData, setBlockAData] = useState<Partial<BlockAResponse>>({});
  const [product, setProduct] = useState<string>('');

  // Load product info from session storage
  useEffect(() => {
    if (stimulusOrder >= 0 && stimulusOrder <= 2) {
      const storedCondition = sessionStorage.getItem('experimentCondition');
      if (storedCondition) {
        const condition = JSON.parse(storedCondition);
        const currentProduct = condition.selectedStimuli[stimulusOrder]?.product || 'product';
        setProduct(currentProduct);
      }
    }
  }, [stimulusOrder]);

  const handleComplete = (step: QuestionStep, data: any) => {
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

  const handleFinalSubmit = async (finalData: any) => {
    // Get experiment condition details
    const storedCondition = sessionStorage.getItem('experimentCondition');
    const storedFullCondition = sessionStorage.getItem(`condition_${stimulusOrder}`);
    
    if (!storedCondition) {
      console.error('No experiment condition found');
      return;
    }
    
    const experimentCondition = JSON.parse(storedCondition);
    const currentStimulus = experimentCondition.selectedStimuli[stimulusOrder];
    const fullCondition = storedFullCondition ? JSON.parse(storedFullCondition) : currentStimulus.condition;
    
    // Get page dwell time
    const dwellTime = getCurrentDwellTime();
    
    // Prepare complete Block A response with experimental conditions
    const completeBlockAResponse = {
      ...blockAData,
      ...finalData,
      // Experimental conditions
      product: currentStimulus.product,
      advisor_type: currentStimulus.condition.advisorType.toLowerCase() === 'ai' ? 'ai' : 'expert',
      congruity: currentStimulus.condition.congruity.toLowerCase() === 'congruent' ? 'match' : 'nonmatch',
      review_valence: currentStimulus.condition.advisorValence,
      page_dwell_time: dwellTime
    };
    
    console.log('📊 Complete Block A Response:', {
      totalKeys: Object.keys(completeBlockAResponse).length,
      product: completeBlockAResponse.product,
      involvement_1: completeBlockAResponse.involvement_1,
      arg_quality_1: completeBlockAResponse.arg_quality_1,
      recalled_words: completeBlockAResponse.recalled_words
    });
    
    // Save to context
    saveBlockAResponse(stimulusOrder + 1, completeBlockAResponse as any);
    
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
            product={product}
            onComplete={(data: ProductInvolvementResponse) => handleComplete('Q0', data)}
          />
        )}
        
        {currentStep === 'Q1' && (
          <Q1_ManipulationCheck 
            onComplete={(data: ManipulationCheckResponse) => handleComplete('Q1', data)}
          />
        )}
        
        {currentStep === 'Q2' && (
          <Q2_AttentionCheck 
            product={product}
            onComplete={(data: AttentionCheckResponse) => handleComplete('Q2', data)}
          />
        )}
        
        {currentStep === 'Q3' && (
          <Q3_RecallTask 
            onComplete={(data: RecallTaskResponse) => handleComplete('Q3', data)}
          />
        )}
        
        {currentStep === 'M1' && (
          <M1_ArgumentQuality 
            onComplete={(data: ArgumentQualityResponse) => handleComplete('M1', data)}
          />
        )}
        
        {currentStep === 'M2a' && (
          <M2a_SourceCredibilityExpertise 
            onComplete={(data: CredibilityExpertiseResponse) => handleComplete('M2a', data)}
          />
        )}
        
        {currentStep === 'M2b' && (
          <M2b_SourceCredibilityTrust 
            onComplete={(data: CredibilityTrustworthinessResponse) => handleComplete('M2b', data)}
          />
        )}
        
        {currentStep === 'M3' && (
          <M3_PersuasiveIntent 
            onComplete={(data: PersuasiveIntentResponse) => handleComplete('M3', data)}
          />
        )}
        
        {currentStep === 'MV5' && (
          <MV5_MindPerception 
            onComplete={(data: MindPerceptionResponse) => handleComplete('MV5', data)}
          />
        )}
        
        {currentStep === 'DV1' && (
          <DV1_Persuasiveness 
            onComplete={(data: PersuasivenessResponse) => handleComplete('DV1', data)}
          />
        )}
        
        {currentStep === 'DV2' && (
          <DV2_PurchaseIntention 
            onComplete={(data: PurchaseIntentionResponse) => handleComplete('DV2', data)}
          />
        )}
        
        {currentStep === 'DV3' && (
          <DV3_DecisionConfidence 
            onComplete={(data: DecisionConfidenceResponse) => handleComplete('DV3', data)}
          />
        )}
      </div>
    </div>
  );
}
