import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  BlockAResponse,
  GeneralQuestionsResponse,
  DemographicsResponse,
  ExperimentalCondition,
  ConditionGroup
} from '@/types/survey';
import { createThreeRows, saveWithRetry } from '@/services/surveyService';

/**
 * Survey Context for managing survey state
 * Implements the 3-row storage pattern from DATABASE_SCHEMA.md
 */

interface BlockAWithMeta extends BlockAResponse, ExperimentalCondition {
  page_dwell_time: number;
}

interface SurveyContextType {
  // Participant info
  participantId: string;
  conditionGroup: ConditionGroup;
  
  // Current state
  currentStimulus: number; // 1, 2, or 3
  
  // Responses storage
  blockAResponses: BlockAWithMeta[];
  generalQuestions: GeneralQuestionsResponse | null;
  demographics: DemographicsResponse | null;
  
  // Methods
  initializeSurvey: () => void;
  saveBlockAResponse: (stimulus_order: number, response: BlockAWithMeta) => void;
  saveGeneralQuestions: (responses: GeneralQuestionsResponse) => void;
  saveDemographics: (responses: DemographicsResponse) => void;
  submitAllResponses: (finalDemographics?: DemographicsResponse) => Promise<void>;
  goToNextStimulus: () => void;
  
  // Status
  isInitialized: boolean;
  isSubmitting: boolean;
  submitError: string | null;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const STORAGE_KEY = 'survey_state';

interface SurveyProviderProps {
  children: ReactNode;
}

export function SurveyProvider({ children }: SurveyProviderProps) {
  const [participantId, setParticipantId] = useState<string>('');
  const [conditionGroup, setConditionGroup] = useState<ConditionGroup>('c1');
  const [currentStimulus, setCurrentStimulus] = useState<number>(1);
  const [blockAResponses, setBlockAResponses] = useState<BlockAWithMeta[]>([]);
  const [generalQuestions, setGeneralQuestions] = useState<GeneralQuestionsResponse | null>(null);
  const [demographics, setDemographics] = useState<DemographicsResponse | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    // ALWAYS get participantId from sessionStorage (source of truth set by consent page)
    const sessionParticipantId = sessionStorage.getItem('participantId');
    
    if (sessionParticipantId) {
      // We have a valid participant ID from consent
      setParticipantId(sessionParticipantId);
      setIsInitialized(true);
      
      // Try to restore other state from localStorage if available
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          // Only restore if it matches the same participant
          if (parsed.participantId === sessionParticipantId) {
            setConditionGroup(parsed.conditionGroup || 'c1');
            setCurrentStimulus(parsed.currentStimulus || 1);
            setBlockAResponses(parsed.blockAResponses || []);
            setGeneralQuestions(parsed.generalQuestions || null);
            setDemographics(parsed.demographics || null);
            console.log('✓ Restored survey state for participant:', sessionParticipantId);
          } else {
            console.log('⚠ localStorage mismatch, starting fresh');
          }
        } catch (error) {
          console.error('Error loading saved state:', error);
        }
      }
      
      console.log('✓ Initialized with participantId:', sessionParticipantId);
    } else {
      console.log('⚠ No participantId in sessionStorage - waiting for consent');
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && participantId) {  // Only save if we have a valid participantId
      const stateToSave = {
        participantId,
        conditionGroup,
        currentStimulus,
        blockAResponses,
        generalQuestions,
        demographics
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      console.log('✓ Saved to localStorage, participantId:', participantId);
    }
  }, [participantId, conditionGroup, currentStimulus, blockAResponses, generalQuestions, demographics, isInitialized]);

  const initializeSurvey = () => {
    // This is called by consent page AFTER setting sessionStorage
    // Just trigger a re-read from sessionStorage
    const storedParticipantId = sessionStorage.getItem('participantId');
    const storedCondition = sessionStorage.getItem('experimentCondition');
    
    if (storedParticipantId && storedCondition) {
      const experimentCondition = JSON.parse(storedCondition);
      const conditionId = experimentCondition.selectedStimuli[0]?.condition.conditionId || 'c1';
      
      setParticipantId(storedParticipantId);
      setConditionGroup(conditionId);
      setCurrentStimulus(1);
      setBlockAResponses([]);
      setGeneralQuestions(null);
      setDemographics(null);
      setIsInitialized(true);
      
      console.log(`✓ Survey initialized: ${storedParticipantId}, Condition: ${conditionId}`);
    } else {
      console.error('❌ initializeSurvey called but no sessionStorage data found');
    }
  };

  const saveBlockAResponse = (stimulus_order: number, response: BlockAWithMeta) => {
    console.log(`📝 saveBlockAResponse called for stimulus ${stimulus_order}`);
    console.log('  - Response keys:', Object.keys(response));
    console.log('  - Sample fields:', {
      product: response.product,
      recall_1: response.recall_1,
      credibility_expertise_1: response.credibility_expertise_1,
      confidence: response.confidence
    });
    
    setBlockAResponses(prev => {
      const filtered = prev.filter(r => 
        !(r.product === response.product && r.advisor_type === response.advisor_type)
      );
      const newArray = [...filtered, response];
      console.log(`  - BlockAResponses array now has ${newArray.length} items`);
      return newArray;
    });
    
    console.log(`✓ Saved Block A response for stimulus ${stimulus_order}`);
  };

  const saveGeneralQuestions = (responses: GeneralQuestionsResponse) => {
    setGeneralQuestions(responses);
    console.log('✓ Saved general questions');
  };

  const saveDemographics = (responses: DemographicsResponse) => {
    setDemographics(responses);
    console.log('✓ Saved demographics');
  };

  const goToNextStimulus = () => {
    if (currentStimulus < 3) {
      setCurrentStimulus(prev => prev + 1);
    }
  };

  const submitAllResponses = async (finalDemographics?: DemographicsResponse) => {
    // Use provided demographics or state demographics
    const demographicsToSubmit = finalDemographics || demographics;
    
    // Validate all data is present
    if (blockAResponses.length !== 3) {
      throw new Error(`Expected 3 Block A responses, got ${blockAResponses.length}`);
    }
    
    if (!generalQuestions) {
      throw new Error('General questions not completed');
    }
    
    if (!demographicsToSubmit) {
      throw new Error('Demographics not completed');
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('🚀 Submitting survey data...');
      console.log('- Participant ID:', participantId);
      console.log('- Condition Group:', conditionGroup);
      console.log('- Block A Responses:', blockAResponses.length);
      console.log('- General Questions:', !!generalQuestions);
      console.log('- Demographics:', !!demographicsToSubmit);
      
      await saveWithRetry(async () => {
        await createThreeRows(
          participantId,
          conditionGroup,
          blockAResponses,
          generalQuestions,
          demographicsToSubmit
        );
      });

      console.log('✓ All responses submitted successfully');
      
      // Mark session as completed
      console.log('📝 Updating session as completed...');
      const { updateSession, getKSTTimestamp } = await import('@/lib/firebase');
      await updateSession(participantId, {
        completed: true,
        endTime: getKSTTimestamp()
      });
      console.log('✅ Session marked as completed');
      
      // Clear localStorage after successful submission
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error submitting responses:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit survey');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: SurveyContextType = {
    participantId,
    conditionGroup,
    currentStimulus,
    blockAResponses,
    generalQuestions,
    demographics,
    initializeSurvey,
    saveBlockAResponse,
    saveGeneralQuestions,
    saveDemographics,
    submitAllResponses,
    goToNextStimulus,
    isInitialized,
    isSubmitting,
    submitError
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
