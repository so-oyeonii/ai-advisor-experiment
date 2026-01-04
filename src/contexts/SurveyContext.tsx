import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  SurveyResponse,
  BlockAResponse,
  GeneralQuestionsResponse,
  DemographicsResponse,
  ExperimentalCondition,
  ConditionGroup,
  Product
} from '@/types/survey';
import { createThreeRows, saveWithRetry } from '@/services/surveyService';
import { assignCondition } from '@/lib/randomization';

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
  submitAllResponses: () => Promise<void>;
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
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setParticipantId(parsed.participantId || '');
        setConditionGroup(parsed.conditionGroup || 'c1');
        setCurrentStimulus(parsed.currentStimulus || 1);
        setBlockAResponses(parsed.blockAResponses || []);
        setGeneralQuestions(parsed.generalQuestions || null);
        setDemographics(parsed.demographics || null);
        setIsInitialized(!!parsed.participantId);
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      const stateToSave = {
        participantId,
        conditionGroup,
        currentStimulus,
        blockAResponses,
        generalQuestions,
        demographics
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [participantId, conditionGroup, currentStimulus, blockAResponses, generalQuestions, demographics, isInitialized]);

  const initializeSurvey = () => {
    if (!isInitialized) {
      const newParticipantId = uuidv4();
      const assignedCondition = assignCondition();
      
      setParticipantId(newParticipantId);
      setConditionGroup(assignedCondition);
      setCurrentStimulus(1);
      setBlockAResponses([]);
      setGeneralQuestions(null);
      setDemographics(null);
      setIsInitialized(true);
      
      console.log(`✓ Survey initialized: Participant ${newParticipantId}, Condition ${assignedCondition}`);
    }
  };

  const saveBlockAResponse = (stimulus_order: number, response: BlockAWithMeta) => {
    setBlockAResponses(prev => {
      const filtered = prev.filter(r => 
        !(r.product === response.product && r.advisor_type === response.advisor_type)
      );
      return [...filtered, response];
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

  const submitAllResponses = async () => {
    // Validate all data is present
    if (blockAResponses.length !== 3) {
      throw new Error(`Expected 3 Block A responses, got ${blockAResponses.length}`);
    }
    
    if (!generalQuestions) {
      throw new Error('General questions not completed');
    }
    
    if (!demographics) {
      throw new Error('Demographics not completed');
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await saveWithRetry(async () => {
        await createThreeRows(
          participantId,
          conditionGroup,
          blockAResponses,
          generalQuestions,
          demographics
        );
      });

      console.log('✓ All responses submitted successfully');
      
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
