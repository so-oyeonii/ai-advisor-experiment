import { db } from '@/lib/firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { 
  SurveyResponse, 
  BlockAResponse, 
  GeneralQuestionsResponse, 
  DemographicsResponse,
  ExperimentalCondition 
} from '@/types/survey';

/**
 * Firebase service for saving survey responses
 * Implements the 3-row storage pattern from DATABASE_SCHEMA.md
 */

const SURVEY_COLLECTION = 'survey_responses';

/**
 * Save a single survey response to Firebase
 */
export async function saveSurveyResponse(response: SurveyResponse): Promise<void> {
  try {
    const docId = `${response.participant_id}_${response.stimulus_order}`;
    const docRef = doc(db, SURVEY_COLLECTION, docId);
    
    console.log(`💾 Saving to Firestore: ${docId}`);
    console.log('  - Fields to save:', Object.keys(response).length);
    console.log('  - Sample data:', {
      participant_id: response.participant_id,
      product: response.product,
      gender: response.gender,
      involvement_1: response.involvement_1
    });
    
    const dataToSave = {
      ...response,
      timestamp: Timestamp.now()
    };
    
    console.log('  - Starting setDoc...');
    await setDoc(docRef, dataToSave);
    
    console.log(`✅ Saved response for ${docId}`);
  } catch (error) {
    console.error(`❌ Error saving survey response for ${response.participant_id}_${response.stimulus_order}:`, error);
    throw error;
  }
}

/**
 * Create three rows for a participant (one per stimulus)
 * Implements the storage pattern:
 * - Block A data: different for each row
 * - General questions: same for all 3 rows
 * - Demographics: same for all 3 rows
 */
export async function createThreeRows(
  participantId: string,
  conditionGroup: string,
  blockAResponses: Array<BlockAResponse & ExperimentalCondition & { page_dwell_time: number }>,
  generalQuestions: GeneralQuestionsResponse,
  demographics: DemographicsResponse
): Promise<void> {
  try {
    console.log('📝 createThreeRows called with:');
    console.log('  - participantId:', participantId);
    console.log('  - conditionGroup:', conditionGroup);
    console.log('  - blockAResponses count:', blockAResponses.length);
    console.log('  - generalQuestions:', generalQuestions);
    console.log('  - demographics:', demographics);
    
    // Validate we have exactly 3 Block A responses
    if (blockAResponses.length !== 3) {
      throw new Error(`Expected 3 Block A responses, got ${blockAResponses.length}`);
    }

    // Create all 3 documents
    const promises = blockAResponses.map((blockA, index) => {
      const stimulusOrder = index + 1;
      const docId = `${participantId}_${stimulusOrder}`;
      
      console.log(`\n🔨 Creating row ${stimulusOrder}:`);
      console.log('  - blockA keys:', Object.keys(blockA));
      console.log('  - product:', blockA.product);
      console.log('  - advisor_type:', blockA.advisor_type);
      
      const response: SurveyResponse = {
        // Block A responses first (includes condition_group specific to this stimulus)
        ...blockA,
        
        // General questions (same for all 3 rows)
        ...generalQuestions,
        
        // Demographics (same for all 3 rows)
        ...demographics,
        
        // Primary identifiers - OVERRIDE to ensure they're set correctly
        participant_id: participantId,
        stimulus_order: stimulusOrder,
        timestamp: new Date()
        // NOTE: condition_group은 blockA에서 이미 설정되어 있음 (각 자극물마다 다름)
      };
      
      console.log('  - Final response sample fields:');
      console.log('    * participant_id:', response.participant_id);
      console.log('    * condition_group:', response.condition_group);
      console.log('    * product:', response.product);
      console.log('    * gender:', response.gender);
      console.log('    * ai_familiarity_1:', response.ai_familiarity_1);
      console.log('  - Total fields:', Object.keys(response).length);
      
      return saveSurveyResponse(response);
    });

    await Promise.all(promises);
    console.log(`✅ Successfully created 3 rows for participant ${participantId}`);
  } catch (error) {
    console.error('❌ Error creating three rows:', error);
    throw new Error('Failed to create survey responses');
  }
}

/**
 * Retry logic wrapper for network failures
 */
export async function saveWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}
