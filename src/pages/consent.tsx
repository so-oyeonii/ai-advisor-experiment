// Consent page with IRB-compliant informed consent form
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { assignParticipantCondition } from '@/lib/randomization';
import { saveSession } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

export default function ConsentPage() {
  const router = useRouter();
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
      
      // 3. Create session in Firebase
      console.log('📝 Saving to Firebase...');
      await saveSession({
        participantId,
        conditionNumber: experimentCondition.selectedStimuli[0].condition.conditionId,
        groupId: firstCondition.groupId,
        conditionId: firstCondition.conditionId,
        advisorType: firstCondition.advisorType,
        congruity: firstCondition.congruity,
        advisorValence: firstCondition.advisorValence,
        publicValence: firstCondition.publicValence,
        patternKey: experimentCondition.selectedStimuli.map((s, idx) => 
          s.condition.advisorValence === 'positive' ? 'A' : 'B'
        ).join(''),
        productOrder: experimentCondition.selectedStimuli.map(s => s.product),
        stimulusOrder: experimentCondition.selectedStimuli.map((s, idx) => 
          `${s.product}_${s.condition.conditionId}`
        ),
        currentStimulusIndex: 0,
        completedStimuli: [],
        completed: false,
        startTime: Timestamp.now(),
      });
      console.log('✅ Saved to Firebase successfully');
      
      // 4. Save to sessionStorage for client-side access
      sessionStorage.setItem('participantId', participantId);
      sessionStorage.setItem('experimentCondition', JSON.stringify(experimentCondition));
      sessionStorage.setItem('currentStimulusIndex', '0');
      console.log('✅ Saved to sessionStorage');
      
      // 5. Navigate to first stimulus
      console.log('🔄 Navigating to /stimulus/0...');
      await router.push('/stimulus/0');
      console.log('✅ Navigation complete');
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
          
          {/* Study Purpose */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Study Purpose</h2>
            <p>
              This study investigates how consumers process product information 
              from different sources in online shopping contexts. We are interested 
              in understanding how people evaluate and trust product recommendations.
            </p>
          </section>
          
          {/* Procedures */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Procedures</h2>
            <p className="mb-2">
              If you agree to participate, you will:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>View three product pages with advisor recommendations and customer reviews</li>
              <li>Complete a brief recall task after viewing each product</li>
              <li>Answer survey questions about your impressions of the information</li>
              <li>Provide basic demographic information</li>
            </ul>
            <p className="mt-2">
              The study will take approximately <strong>10-15 minutes</strong> to complete.
            </p>
          </section>
          
          {/* Risks and Benefits */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Risks and Benefits</h2>
            <p className="mb-2">
              <strong>Risks:</strong> There are no anticipated risks beyond those 
              encountered in everyday life or routine use of the internet.
            </p>
            <p>
              <strong>Benefits:</strong> While there may be no direct benefits to you, 
              your participation will contribute to scientific understanding of how 
              consumers perceive and trust different types of product recommendations 
              in online shopping environments.
            </p>
          </section>
          
          {/* Voluntary Participation */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Voluntary Participation</h2>
            <p>
              Your participation is <strong>completely voluntary</strong>. You may 
              withdraw at any time without penalty or loss of benefits. You may skip 
              any questions you do not wish to answer. If you choose to withdraw, 
              any data you have provided will be deleted.
            </p>
          </section>
          
          {/* Confidentiality */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Confidentiality</h2>
            <p>
              All data will be kept <strong>confidential and anonymous</strong>. 
              No personally identifiable information will be collected. Your responses 
              will be stored securely using encrypted cloud storage and will be used 
              solely for research purposes. Only the research team will have access 
              to the data. Results may be published in academic journals or presented 
              at conferences, but you will not be identified in any way.
            </p>
          </section>
          
          {/* Compensation */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Compensation</h2>
            <p>
              You will receive compensation as specified in the study advertisement 
              upon successful completion of the study.
            </p>
          </section>
          
          {/* Questions and Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Questions and Contact</h2>
            <p className="mb-2">
              If you have questions about this study, please contact the research team at:
            </p>
            <p className="text-blue-600">
              [researcher email to be specified]
            </p>
            <p className="mt-3">
              If you have questions about your rights as a research participant, 
              you may contact the Institutional Review Board (IRB) at [IRB contact information].
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
        <form onSubmit={handleContinue} className="border-t border-gray-200 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <label className="flex items-start cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={isSubmitting}
                className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-900">
                <strong>I have read and understood the above information.</strong> 
                {' '}I agree to participate in this study voluntarily. I understand 
                that I can withdraw at any time without penalty. I am at least 18 
                years old.
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
            {isSubmitting ? 'Initializing...' : 'Continue to Study'}
          </button>
        </form>
        
        {/* Footer Note */}
        <p className="mt-6 text-xs text-gray-500 text-center">
          By clicking &quot;Continue to Study&quot;, you acknowledge that you have read 
          this consent form and agree to participate in this research study.
        </p>
      </div>
    </div>
  );
}
