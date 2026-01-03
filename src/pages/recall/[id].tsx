import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Clock, Plus, X } from 'lucide-react';
import { saveRecallTask } from '@/lib/firebase';
import { getStimulusData } from '@/lib/stimuliData';
import type { Condition } from '@/lib/stimuliData';

export default function RecallPage() {
  const router = useRouter();
  const { id } = router.query;
  const stimulusId = Number(id);

  const [recallWords, setRecallWords] = useState<string[]>(['']); // Array of words
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [canContinue, setCanContinue] = useState(false);

  // Check if user has entered at least one word
  const hasContent = recallWords.some(word => word.trim().length > 0);
  const wordCount = recallWords.filter(word => word.trim().length > 0).length;

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Only auto-submit if user has entered content
          if (hasContent) {
            handleAutoSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
      
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasContent]);

  // Enable continue button after 30 seconds IF user has entered content
  useEffect(() => {
    if (elapsedTime >= 30 && hasContent) {
      setCanContinue(true);
    } else if (!hasContent) {
      setCanContinue(false);
    }
  }, [elapsedTime, hasContent]);

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
    
    // Filter out empty words
    const filteredWords = recallWords.filter(word => word.trim().length > 0);
    
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
      recalledWords: filteredWords, // Array of words
      recalledRecommendation: filteredWords.join(', '), // Combined for backward compatibility
      recallTime: 90 - timeLeft,
      recallId: `${participantId}_${stimulusId}`
    });
  };

  // Manual submit
  const handleSubmit = async () => {
    if (!canContinue || !hasContent) return;
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

  // Add new word box
  const addWordBox = () => {
    setRecallWords([...recallWords, '']);
  };

  // Remove word box
  const removeWordBox = (index: number) => {
    if (recallWords.length > 1) {
      setRecallWords(recallWords.filter((_, i) => i !== index));
    }
  };

  // Update word at index
  const updateWord = (index: number, value: string) => {
    const newWords = [...recallWords];
    newWords[index] = value;
    setRecallWords(newWords);
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
          <p className="text-blue-900 font-medium mb-2">
            Please write down the words/phrases you remember from the previous page.
          </p>
          <p className="text-blue-700 text-sm">
            • Enter one word or phrase per box<br />
            • Click the + button to add more boxes<br />
            • You must enter at least one word to continue
          </p>
        </div>
        
        {/* Word Boxes */}
        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {recallWords.map((word, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={word}
                onChange={(e) => updateWord(index, e.target.value)}
                placeholder="Enter a word or phrase you remember..."
                className="flex-1 p-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                autoFocus={index === 0}
              />
              {recallWords.length > 1 && (
                <button
                  onClick={() => removeWordBox(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                  title="Remove"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Add Button */}
        <button
          onClick={addWordBox}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Add another word/phrase</span>
        </button>
        
        {/* Word Count */}
        <div className="mt-4 text-sm text-gray-600 text-right">
          Words entered: {wordCount}
        </div>
        
        {/* Continue Button */}
        <button 
          onClick={handleSubmit}
          disabled={!canContinue || !hasContent}
          className={`w-full mt-6 py-3 rounded-md text-lg font-semibold transition ${
            canContinue && hasContent
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {!hasContent
            ? 'Please enter at least one word'
            : elapsedTime < 30
            ? `Please wait ${Math.max(0, 30 - elapsedTime)}s...`
            : 'Continue to Survey'
          }
        </button>
        
        {timeLeft === 0 && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {hasContent 
              ? "Time's up! Submitting automatically..." 
              : "Time's up! Please enter at least one word to continue."}
          </p>
        )}
      </div>
    </div>
  );
}
