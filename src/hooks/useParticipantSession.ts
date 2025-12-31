// Custom hook to manage participant session data
import { useEffect, useState } from 'react';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateRandomCondition, ExperimentCondition } from '@/lib/randomization';

export interface SurveyResponse {
  dwellTime: number;
  timestamp: number;
  [key: string]: string | number;
}

export interface ParticipantSession {
  participantId: string;
  condition: ExperimentCondition;
  currentStimulusIndex: number;
  completed: boolean;
  startTime: number;
  responses: Record<string, SurveyResponse | Record<string, string | number>>;
}

export function useParticipantSession() {
  const [session, setSession] = useState<ParticipantSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize or load participant session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if participantId exists in localStorage
        let participantId = localStorage.getItem('participantId');

        if (!participantId) {
          // Generate new participant ID
          participantId = `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('participantId', participantId);

          // Generate random condition
          const condition = generateRandomCondition(participantId);

          // Create new session
          const newSession: ParticipantSession = {
            participantId,
            condition,
            currentStimulusIndex: 0,
            completed: false,
            startTime: Date.now(),
            responses: {},
          };

          // Save to Firestore
          const sessionRef = doc(collection(db, 'sessions'), participantId);
          await setDoc(sessionRef, newSession);

          setSession(newSession);
        } else {
          // Load existing session from Firestore
          const sessionRef = doc(collection(db, 'sessions'), participantId);
          const sessionDoc = await getDoc(sessionRef);

          if (sessionDoc.exists()) {
            setSession(sessionDoc.data() as ParticipantSession);
          } else {
            // Session not found, create new one
            const condition = generateRandomCondition(participantId);
            const newSession: ParticipantSession = {
              participantId,
              condition,
              currentStimulusIndex: 0,
              completed: false,
              startTime: Date.now(),
              responses: {},
            };

            await setDoc(sessionRef, newSession);
            setSession(newSession);
          }
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        setError('Failed to initialize session');
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Update session in Firestore
  const updateSession = async (updates: Partial<ParticipantSession>) => {
    if (!session) return;

    try {
      const updatedSession = { ...session, ...updates };
      const sessionRef = doc(collection(db, 'sessions'), session.participantId);
      await updateDoc(sessionRef, updates);
      setSession(updatedSession);
    } catch (err) {
      console.error('Error updating session:', err);
      setError('Failed to update session');
    }
  };

  // Save response for a stimulus
  const saveResponse = async (stimulusId: string, response: Record<string, string | number>, dwellTime: number) => {
    if (!session) return;

    const responseData = {
      ...response,
      dwellTime,
      timestamp: Date.now(),
    };

    const updatedResponses = {
      ...session.responses,
      [stimulusId]: responseData,
    };

    await updateSession({ responses: updatedResponses });
  };

  // Move to next stimulus
  const nextStimulus = async () => {
    if (!session) return;

    const nextIndex = session.currentStimulusIndex + 1;
    await updateSession({ currentStimulusIndex: nextIndex });
  };

  // Mark session as completed
  const completeSession = async () => {
    if (!session) return;

    await updateSession({ completed: true });
  };

  return {
    session,
    loading,
    error,
    updateSession,
    saveResponse,
    nextStimulus,
    completeSession,
  };
}
