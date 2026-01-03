// Firebase configuration and initialization with data management functions

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, getDocs, Timestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (avoid reinitializing in development)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// Collection names (matching COMPLETE_PROJECT_SPEC.md)
const COLLECTIONS = {
  SESSIONS: 'sessions',
  STIMULUS_EXPOSURES: 'stimulus_exposures',
  RECALL_TASKS: 'recall_tasks',
  SURVEY_RESPONSES: 'survey_responses',
  DEMOGRAPHICS: 'demographics',
};

// ============================================================================
// Session Management
// ============================================================================

export interface SessionData {
  participantId: string;
  conditionNumber: number;
  groupId: number; // 1-4: Which of the 4 groups (2x2 grid)
  conditionId: number; // 1-8: Specific condition within the 8 total conditions
  advisorType: 'AI' | 'Human';
  congruity: 'Congruent' | 'Incongruent';
  advisorValence: 'positive' | 'negative'; // Advisor review valence
  publicValence: 'positive' | 'negative'; // Public reviews valence
  patternKey: string;
  productOrder: string[];
  stimulusOrder: string[];
  currentStimulusIndex: number;
  completedStimuli: string[];
  completed: boolean;
  startTime: Timestamp;
  endTime?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Save or create a new participant session
 */
export async function saveSession(sessionData: Omit<SessionData, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionData.participantId);
    const now = Timestamp.now();
    
    await setDoc(sessionRef, {
      ...sessionData,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error('Error saving session:', error);
    throw new Error('Failed to save session');
  }
}

/**
 * Update an existing participant session
 */
export async function updateSession(
  participantId: string,
  updates: Partial<Omit<SessionData, 'participantId' | 'createdAt'>>
): Promise<void> {
  try {
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, participantId);
    
    const updateData: Record<string, unknown> = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    // Convert endTime to Timestamp if it's a Date
    if (updates.endTime && !(updates.endTime instanceof Timestamp)) {
      updateData.endTime = Timestamp.fromDate(updates.endTime as Date);
    }
    
    await updateDoc(sessionRef, updateData);
  } catch (error) {
    console.error('Error updating session:', error);
    throw new Error('Failed to update session');
  }
}

/**
 * Get a participant session by ID
 */
export async function getSession(participantId: string): Promise<SessionData | null> {
  try {
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, participantId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (sessionDoc.exists()) {
      return sessionDoc.data() as SessionData;
    }
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    throw new Error('Failed to get session');
  }
}

/**
 * Get all participant sessions (for admin/export)
 */
export async function getAllSessions(): Promise<SessionData[]> {
  try {
    const sessionsRef = collection(db, COLLECTIONS.SESSIONS);
    const snapshot = await getDocs(sessionsRef);
    
    return snapshot.docs.map(doc => doc.data() as SessionData);
  } catch (error) {
    console.error('Error getting all sessions:', error);
    throw new Error('Failed to get all sessions');
  }
}

// ============================================================================
// Stimulus Exposure Tracking
// ============================================================================

export interface StimulusExposureData {
  exposureId: string; // participantId_product_index
  participantId: string;
  stimulusId: string;
  productId: string;
  productName: string;
  groupId: number; // 1-4: Which group this condition belongs to
  conditionId: number; // 1-8: Specific condition (unique across all 8)
  advisorType: 'AI' | 'Human';
  congruity: 'Congruent' | 'Incongruent';
  advisorValence: 'positive' | 'negative';
  publicValence: 'positive' | 'negative';
  advisorName: string;
  recommendation: string; // Same as advisorValence (for backward compatibility)
  reasoning: string;
  exposureOrder: number; // 1, 2, or 3
  dwellTime: number; // in seconds
  exposureStartTime: Timestamp;
  exposureEndTime: Timestamp;
  createdAt: Timestamp;
}

/**
 * Save stimulus exposure data
 */
export async function saveStimulusExposure(exposureData: Omit<StimulusExposureData, 'createdAt'>): Promise<void> {
  try {
    const exposureRef = doc(db, COLLECTIONS.STIMULUS_EXPOSURES, exposureData.exposureId);
    
    await setDoc(exposureRef, {
      ...exposureData,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving stimulus exposure:', error);
    throw new Error('Failed to save stimulus exposure');
  }
}

/**
 * Get all stimulus exposures (for admin/export)
 */
export async function getAllStimulusExposures(): Promise<StimulusExposureData[]> {
  try {
    const exposuresRef = collection(db, COLLECTIONS.STIMULUS_EXPOSURES);
    const snapshot = await getDocs(exposuresRef);
    
    return snapshot.docs.map(doc => doc.data() as StimulusExposureData);
  } catch (error) {
    console.error('Error getting all stimulus exposures:', error);
    throw new Error('Failed to get all stimulus exposures');
  }
}

// ============================================================================
// Recall Task
// ============================================================================

export interface RecallTaskData {
  recallId: string; // participantId_product_index
  participantId: string;
  stimulusId: string;
  productId: string;
  productName: string;
  groupId: number; // 1-4
  conditionId: number; // 1-8
  advisorType: 'AI' | 'Human';
  congruity: 'Congruent' | 'Incongruent';
  advisorValence: 'positive' | 'negative';
  publicValence: 'positive' | 'negative';
  recalledWords: string[]; // Array of words/phrases for analysis
  recalledRecommendation: string; // Combined text for backward compatibility
  recallAccuracy?: number; // Optional: computed similarity score (0-1)
  recallTime: number; // Time taken to complete recall (seconds)
  createdAt: Timestamp;
}

/**
 * Save recall task response
 */
export async function saveRecallTask(recallData: Omit<RecallTaskData, 'createdAt'>): Promise<void> {
  try {
    const recallRef = doc(db, COLLECTIONS.RECALL_TASKS, recallData.recallId);
    
    await setDoc(recallRef, {
      ...recallData,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving recall task:', error);
    throw new Error('Failed to save recall task');
  }
}

/**
 * Get all recall tasks (for admin/export)
 */
export async function getAllRecallTasks(): Promise<RecallTaskData[]> {
  try {
    const recallsRef = collection(db, COLLECTIONS.RECALL_TASKS);
    const snapshot = await getDocs(recallsRef);
    
    return snapshot.docs.map(doc => doc.data() as RecallTaskData);
  } catch (error) {
    console.error('Error getting all recall tasks:', error);
    throw new Error('Failed to get all recall tasks');
  }
}

// ============================================================================
// Survey Responses
// ============================================================================

export interface SurveyResponseData {
  responseId: string; // participantId_product_index
  participantId: string;
  stimulusId: string;
  productId: string;
  productName: string;
  groupId: number; // 1-4
  conditionId: number; // 1-8
  advisorType: 'AI' | 'Human';
  congruity: 'Congruent' | 'Incongruent';
  advisorValence: 'positive' | 'negative';
  publicValence: 'positive' | 'negative';
  
  // All response data from form
  responseData?: Record<string, string | number>;
  
  // Trust & Credibility (3 items, 7-point Likert)
  trust_recommendation?: number; // 1-7
  trust_credibility?: number; // 1-7
  trust_future_reliance?: number; // 1-7
  
  // Purchase Intention (2 items, 7-point Likert)
  purchase_likelihood?: number; // 1-7
  purchase_influence?: number; // 1-7
  
  // Perceived Expertise (2 items, 7-point Likert)
  expertise_knowledge?: number; // 1-7
  expertise_clarity?: number; // 1-7
  
  // Computed scales (optional, can be calculated during export)
  trust_scale_mean?: number;
  purchase_scale_mean?: number;
  expertise_scale_mean?: number;
  
  responseTime?: number; // Time to complete survey (seconds)
  createdAt: Timestamp;
}

/**
 * Save survey response
 */
export async function saveSurveyResponse(responseData: Omit<SurveyResponseData, 'createdAt'>): Promise<void> {
  try {
    const responseRef = doc(db, COLLECTIONS.SURVEY_RESPONSES, responseData.responseId);
    
    // Calculate scale means if individual items exist
    const dataToSave: Record<string, unknown> = {
      ...responseData,
      createdAt: Timestamp.now(),
    };
    
    // Only add scale means if they can be calculated (not undefined)
    if (responseData.trust_recommendation && responseData.trust_credibility && responseData.trust_future_reliance) {
      dataToSave.trust_scale_mean = (
        responseData.trust_recommendation +
        responseData.trust_credibility +
        responseData.trust_future_reliance
      ) / 3;
    }
    
    if (responseData.purchase_likelihood && responseData.purchase_influence) {
      dataToSave.purchase_scale_mean = (
        responseData.purchase_likelihood +
        responseData.purchase_influence
      ) / 2;
    }
    
    if (responseData.expertise_knowledge && responseData.expertise_clarity) {
      dataToSave.expertise_scale_mean = (
        responseData.expertise_knowledge +
        responseData.expertise_clarity
      ) / 2;
    }
    
    await setDoc(responseRef, dataToSave);
  } catch (error) {
    console.error('Error saving survey response:', error);
    throw new Error('Failed to save survey response');
  }
}

/**
 * Get all survey responses (for admin/export)
 */
export async function getAllSurveyResponses(): Promise<SurveyResponseData[]> {
  try {
    const responsesRef = collection(db, COLLECTIONS.SURVEY_RESPONSES);
    const snapshot = await getDocs(responsesRef);
    
    return snapshot.docs.map(doc => doc.data() as SurveyResponseData);
  } catch (error) {
    console.error('Error getting all survey responses:', error);
    throw new Error('Failed to get all survey responses');
  }
}

// ============================================================================
// Demographics
// ============================================================================

export interface DemographicsData {
  participantId: string;
  age: string; // Age range: '18-24', '25-34', '35-44', '45-54', '55-64', '65+'
  gender: string; // 'Male', 'Female', 'Non-binary', 'Prefer not to say'
  education: string; // Education level
  online_shopping_frequency: string; // Shopping frequency
  createdAt: Timestamp;
}

/**
 * Save demographics data
 */
export async function saveDemographics(demographicsData: Omit<DemographicsData, 'createdAt'>): Promise<void> {
  try {
    const demographicsRef = doc(db, COLLECTIONS.DEMOGRAPHICS, demographicsData.participantId);
    
    await setDoc(demographicsRef, {
      ...demographicsData,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving demographics:', error);
    throw new Error('Failed to save demographics');
  }
}

/**
 * Get all demographics data (for admin/export)
 */
export async function getAllDemographics(): Promise<DemographicsData[]> {
  try {
    const demographicsRef = collection(db, COLLECTIONS.DEMOGRAPHICS);
    const snapshot = await getDocs(demographicsRef);
    
    return snapshot.docs.map(doc => doc.data() as DemographicsData);
  } catch (error) {
    console.error('Error getting all demographics:', error);
    throw new Error('Failed to get all demographics');
  }
}

// ============================================================================
// Export All Data (for admin use)
// ============================================================================

export interface ExportData {
  sessions: SessionData[];
  stimulusExposures: StimulusExposureData[];
  recallTasks: RecallTaskData[];
  surveyResponses: SurveyResponseData[];
  demographics: DemographicsData[];
  exportedAt: string;
}

/**
 * Export all data from all collections
 */
export async function exportAllData(): Promise<ExportData> {
  try {
    const [sessions, exposures, recalls, responses, demographics] = await Promise.all([
      getAllSessions(),
      getAllStimulusExposures(),
      getAllRecallTasks(),
      getAllSurveyResponses(),
      getAllDemographics(),
    ]);
    
    return {
      sessions,
      stimulusExposures: exposures,
      recallTasks: recalls,
      surveyResponses: responses,
      demographics,
      exportedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error exporting all data:', error);
    throw new Error('Failed to export all data');
  }
}
