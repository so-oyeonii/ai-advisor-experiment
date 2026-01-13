// Firebase configuration and initialization with data management functions

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, getDocs, Timestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDI26pyq90LhlVD9n8sICMT2BryAgV4EMM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ai-advisor-experiment.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ai-advisor-experiment",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ai-advisor-experiment.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "685896095806",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:685896095806:web:0bf50c9c75ed5cd2a3b8fd",
};

console.log('🔥 Firebase config loaded:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey
});

// Initialize Firebase (avoid reinitializing in development)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

console.log('🔥 Firebase initialized, db:', !!db);

// Utility function to get current timestamp (stores as UTC, which is correct)
export const getKSTTimestamp = (): Timestamp => {
  return Timestamp.now(); // Stores as UTC, will convert to KST when displaying
};

export const getKSTString = (): string => {
  const now = new Date();
  // Format as KST for display
  return now.toLocaleString('ko-KR', { 
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

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
  informedConsent: string; // 실험참가 개인정보 동의 ("agreed")
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
    const now = getKSTTimestamp();
    
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
      updatedAt: getKSTTimestamp(),
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
    console.log('🔥 [Firebase] saveStimulusExposure called with:', {
      exposureId: exposureData.exposureId,
      participantId: exposureData.participantId,
      productId: exposureData.productId
    });
    
    const exposureRef = doc(db, COLLECTIONS.STIMULUS_EXPOSURES, exposureData.exposureId);
    console.log('🔥 [Firebase] Document reference created');
    
    // Test with minimal data first
    const minimalData = {
      exposureId: exposureData.exposureId,
      participantId: exposureData.participantId,
      productId: exposureData.productId,
      productName: exposureData.productName,
      dwellTime: exposureData.dwellTime,
      createdAt: getKSTTimestamp(),
    };
    
    console.log('🔥 [Firebase] Attempting to save minimal data:', minimalData);
    
    await setDoc(exposureRef, minimalData);
    
    console.log('🔥 [Firebase] setDoc completed successfully');
  } catch (error) {
    console.error('🔥 [Firebase] Error saving stimulus exposure:', error);
    console.error('🔥 [Firebase] Error stack:', error instanceof Error ? error.stack : 'No stack');
    throw error;
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
// Recall Task (인터페이스만 유지 - export용)
// ============================================================================

export interface RecallTaskData {
  recallId: string;
  participantId: string;
  stimulusId: string;
  productId: string;
  productName: string;
  groupId: number;
  conditionId: number;
  advisorType: 'AI' | 'Human';
  congruity: 'Congruent' | 'Incongruent';
  advisorValence: 'positive' | 'negative';
  publicValence: 'positive' | 'negative';
  recalledWords: string[];
  recalledRecommendation: string;
  recallAccuracy?: number;
  recallTime: number;
  createdAt: Timestamp;
}

/**
 * Get all recall tasks (for admin/export) - 현재 미사용 컬렉션, 빈 배열 반환
 */
export async function getAllRecallTasks(): Promise<RecallTaskData[]> {
  try {
    const recallsRef = collection(db, COLLECTIONS.RECALL_TASKS);
    const snapshot = await getDocs(recallsRef);
    return snapshot.docs.map(doc => doc.data() as RecallTaskData);
  } catch (error) {
    console.error('Error getting all recall tasks:', error);
    return [];
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
      createdAt: getKSTTimestamp(),
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
// Demographics (인터페이스만 유지 - export용, 실제 데이터는 survey_responses에 포함)
// ============================================================================

export interface DemographicsData {
  participantId: string;
  age: string;
  gender: string;
  gender_other?: string;
  education: string;
  income?: string;
  occupation?: string;
  occupation_other?: string;
  shopping_frequency?: string;
  ai_usage_frequency?: string;
  ai_familiarity_1?: number;
  ai_familiarity_2?: number;
  ai_familiarity_3?: number;
  machine_heuristic_1?: number;
  machine_heuristic_2?: number;
  machine_heuristic_3?: number;
  machine_heuristic_4?: number;
  review_skepticism_1?: number;
  review_skepticism_2?: number;
  review_skepticism_3?: number;
  review_skepticism_4?: number;
  createdAt: Timestamp;
}

/**
 * Get all demographics data (for admin/export) - 현재 미사용 컬렉션, 빈 배열 반환
 * 실제 demographics 데이터는 survey_responses에 포함되어 저장됨
 */
export async function getAllDemographics(): Promise<DemographicsData[]> {
  try {
    const demographicsRef = collection(db, COLLECTIONS.DEMOGRAPHICS);
    const snapshot = await getDocs(demographicsRef);
    return snapshot.docs.map(doc => doc.data() as DemographicsData);
  } catch (error) {
    console.error('Error getting all demographics:', error);
    return [];
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
