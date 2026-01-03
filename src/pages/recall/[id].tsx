import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Clock } from 'lucide-react';
import { saveRecallTask } from '@/lib/firebase';
import { getStimulusData } from '@/lib/stimuliData';
import type { Condition } from '@/lib/stimuliData';

export default function RecallPage() {
  const router = useRouter();
  const { id } = router.query;
  const stimulusId = Number(id);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [recallText, setRecallText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [canContinue, setCanContinue] = useState(false);

  // Word count
  const wordCount = recallText.trim().split(/\s+/).filter(w => w.length > 0).length;

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Enable continue button after 10 seconds
    const enableTimer = setTimeout(() => {
      setCanContinue(true);
    }, 10000);
    
    // Auto-focus text area
    textAreaRef.current?.focus();
    
    return () => {
      clearInterval(timer);
      clearTimeout(enableTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to Firebase
  const saveRecallData = async () => {
    const participantId = sessionStorage.getItem('participantId')!;
    const storedCondition = sessionStorage.getItem('experimentCondition');
    const storedFullCondition = sessionStorage.getItem(`condition_${stimulusId}`);
    
    if (!storedCondition) {
      console.error('No experiment condition found');
      return;
    }
    
    const experimentCondition = JSON.parse(storedCondition);
    const currentStimulus = experimentCondition.selectedStimuli[stimulusId];
    const fullCondition = storedFullCondition ? JSON.parse(storedFullCondition) : currentStimulus.condition;
    
    const condition: Condition = {
      product: currentStimulus.product,
      advisorType: currentStimulus.condition.advisorType,
      advisorValence: currentStimulus.condition.advisorValence,
      publicValence: currentStimulus.condition.publicValence,
      congruity: currentStimulus.condition.congruity
    };
    
    // Get stimulus data to extract product info
    const stimulusData = getStimulusData(condition);
    
    await saveRecallTask({
      participantId,
      stimulusId: String(stimulusId),
      productId: stimulusData.product.key,
      productName: stimulusData.product.name,
      groupId: fullCondition.groupId,
      conditionId: fullCondition.conditionId,
      advisorType: condition.advisorType,
      congruity: condition.congruity,
      advisorValence: condition.advisorValence,
      publicValence: condition.publicValence,
      recalledRecommendation: recallText.trim(),
      recallTime: 60 - timeLeft,
      recallId: `${participantId}_${stimulusId}`
    });
  };

  // Manual submit
  const handleSubmit = async () => {
    if (!canContinue) return;
    await saveRecallData();
    router.push(`/survey/${stimulusId}`);
  };

  // Auto submit at 60s
  const handleAutoSubmit = async () => {
    await saveRecallData();
    setTimeout(() => {
      router.push(`/survey/${stimulusId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        
        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Recall Task</h1>
          <div className="flex items-center space-x-2">
            <Clock size={24} className={timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'} />
            <span className={`text-3xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-blue-900">
            Please write down the review content you remember from the previous page.
            Include as many details as you can recall.
          </p>
        </div>
        
        {/* Text Area */}
        <textarea
          ref={textAreaRef}
          value={recallText}
          onChange={(e) => setRecallText(e.target.value)}
          placeholder="Type your response here..."
          className="w-full h-64 p-4 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none resize-none"
          autoFocus
        />
        
        {/* Word Count */}
        <div className="mt-2 text-sm text-gray-600 text-right">
          Word count: {wordCount}
        </div>
        
        {/* Continue Button */}
        <button 
          onClick={handleSubmit}
          disabled={!canContinue}
          className={`w-full mt-6 py-3 rounded-md text-lg font-semibold transition ${
            canContinue
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {!canContinue 
            ? `Please wait ${10 - elapsedTime}s...` 
            : 'Continue to Survey'
          }
        </button>
        
        {timeLeft === 0 && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Time&apos;s up! Submitting automatically...
          </p>
        )}
      </div>
    </div>
  );
}
