// Consent page with IRB-compliant informed consent form
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { assignParticipantCondition } from '@/lib/randomization';
import { saveSession, getKSTTimestamp } from '@/lib/firebase';
import { useSurvey } from '@/contexts/SurveyContext';

export default function ConsentPage() {
  const router = useRouter();
  const { initializeSurvey } = useSurvey();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!agreed) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🚀 Starting consent process...');
      
      // 1. Generate participant ID
      const participantId = uuidv4();
      console.log('✅ Generated participant ID:', participantId);
      
      // 2. Assign random condition
      const experimentCondition = assignParticipantCondition(participantId);
      console.log('✅ Assigned condition:', experimentCondition);
      
      // Extract condition info from first stimulus (representative)
      const firstCondition = experimentCondition.selectedStimuli[0].condition;
      
      // 3. Save to sessionStorage for client-side access (do this first!)
      sessionStorage.setItem('participantId', participantId);
      sessionStorage.setItem('experimentCondition', JSON.stringify(experimentCondition));
      sessionStorage.setItem('currentStimulusIndex', '0');
      sessionStorage.setItem('hasConsented', 'true');
      console.log('✅ Saved to sessionStorage');
      
      // 4. Initialize SurveyContext
      initializeSurvey();
      console.log('✅ Initialized SurveyContext');
      
      // 5. Navigate to scenario page FIRST (don't wait for Firebase)
      console.log('🔄 Navigating to /scenario...');
      router.push('/scenario');
      
      // 6. Try to save to Firebase in background (non-blocking)
      saveSession({
        participantId,
        conditionNumber: experimentCondition.selectedStimuli[0].condition.conditionId,
        groupId: firstCondition.groupId,
        conditionId: firstCondition.conditionId,
        advisorType: firstCondition.advisorType,
        congruity: firstCondition.congruity,
        advisorValence: firstCondition.advisorValence,
        publicValence: firstCondition.publicValence,
        patternKey: experimentCondition.selectedStimuli.map((s) => 
          s.condition.advisorValence === 'positive' ? 'A' : 'B'
        ).join(''),
        productOrder: experimentCondition.selectedStimuli.map(s => s.product),
        stimulusOrder: experimentCondition.selectedStimuli.map((s) => 
          `${s.product}_${s.condition.conditionId}`
        ),
        currentStimulusIndex: 0,
        completedStimuli: [],
        completed: false,
        startTime: getKSTTimestamp(),
      }).then(() => {
        console.log('✅ Saved to Firebase successfully');
      }).catch(firebaseError => {
        console.warn('⚠️ Firebase save failed:', firebaseError);
      });
    } catch (err) {
      console.error('❌ Error initializing session:', err);
      setError(`Failed to initialize session: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Informed Consent</h1>
        
        <div className="prose max-w-none mb-8 space-y-6 text-gray-700">
          
          <p className="text-gray-700 leading-relaxed">
            This study aims to understand your general perception and experience of product information encountered during online shopping.
            All data is collected anonymously, and no Personally Identifiable Information (PII) is gathered.
          </p>
          
          {/* Study Summary */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📌 Study Summary</h2>
            <ul className="space-y-2">
              <li><strong>Duration:</strong> 15–20 minutes (estimated)</li>
              <li><strong>Compensation:</strong> $1.50 USD for full completion</li>
              <li><strong>Rights:</strong> You may withdraw anytime without penalty</li>
            </ul>
          </section>
          
          {/* Compensation Notice */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔎 Compensation Notice</h2>
            <p className="mb-2">Compensation may be denied or rejected if:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You fail to respond sincerely to Attention Check items</li>
              <li>You do not submit the correct Completion Code after the experiment, or enter it incorrectly</li>
            </ul>
          </section>
          
          {/* Data Protection */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔒 Data Protection</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Data transmitted and stored via HTTPS</li>
              <li>Stored securely in encrypted cloud servers (AES-256)</li>
              <li>Access restricted to the authorized research team only</li>
              <li>Retained for up to 3 years, then permanently deleted (non-recoverable)</li>
            </ul>
          </section>
          
          {/* Questions or Technical Issues */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📧 Questions or Technical Issues?</h2>
            <p>
              <strong>Study Coordinator:</strong> OO<br />
              <span className="text-blue-600">example@skku.edu</span>
            </p>
          </section>
          
          {/* IRB Approval */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🧾 IRB Approval</h2>
            <p>
              This research has been approved by the Sungkyunkwan University Institutional Review Board<br />
              <strong>IRB Approval No.:</strong> 2025-06-036-001
            </p>
          </section>
          
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {/* Consent Form */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-900 font-semibold mb-4">By proceeding, you confirm:</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <span className="text-gray-600 mr-3">☑️</span>
              <span className="text-gray-700">I have read and understood the information above</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-600 mr-3">☑️</span>
              <span className="text-gray-700">I agree to participate voluntarily</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-600 mr-3">☑️</span>
              <span className="text-gray-700">I understand that I may withdraw anytime and my data will be permanently deleted after 3 years</span>
            </div>
          </div>
          
          <form onSubmit={handleContinue} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <label className="flex items-start cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-900 font-semibold">
                  I agree to participate
                </span>
              </label>
            </div>
            
            <button 
              type="submit"
              disabled={!agreed || isSubmitting}
              className={`w-full py-3 px-6 rounded-md text-lg font-semibold transition-colors ${
                agreed && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Initializing...' : 'Start Study'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
