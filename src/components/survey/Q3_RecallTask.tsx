import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Q3_RecallTask as config } from '@/config/surveyQuestions';
import type { RecallTaskResponse } from '@/types/survey';

interface Q3_RecallTaskProps {
  onComplete: (data: RecallTaskResponse) => void;
}

export default function Q3_RecallTask({ onComplete }: Q3_RecallTaskProps) {
  const [words, setWords] = useState<string[]>(['']); // Start with one empty box
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const [hasStartedWriting, setHasStartedWriting] = useState(false); // Track if user started writing
  const [bonusTimeGiven, setBonusTimeGiven] = useState(false); // Track if bonus time was given
  const [bonusElapsedTime, setBonusElapsedTime] = useState(0); // Track elapsed time since bonus started

  // Check if user has entered at least one word
  const hasContent = words.some(word => word.trim().length > 0);
  const filledWords = words.filter(word => word.trim().length > 0);
  
  // Auto-submit function
  const handleAutoSubmit = useCallback(() => {
    if (hasContent) {
      const recallData: RecallTaskResponse = {
        recalled_words: filledWords,
        word_count: filledWords.length,
        recall_combined_text: filledWords.join(' | '),
        recall_time_seconds: 90 - timeLeft
      };
      onComplete(recallData);
    }
  }, [filledWords, hasContent, timeLeft, onComplete]);
  
  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Only auto-submit if user has started writing (has content)
          if (hasStartedWriting && hasContent) {
            clearInterval(timer);
            handleAutoSubmit();
          }
          return 0;
        }
        return prev - 1;
      });

      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hasContent, hasStartedWriting, handleAutoSubmit]);
  
  // Track bonus elapsed time
  useEffect(() => {
    if (!bonusTimeGiven) return;

    const bonusTimer = setInterval(() => {
      setBonusElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(bonusTimer);
  }, [bonusTimeGiven]);

  // Enable continue button after 30 seconds IF user has entered content
  useEffect(() => {
    if (bonusTimeGiven && hasContent && bonusElapsedTime >= 30) {
      // Bonus time case: need to wait 30 seconds after starting to write
      setCanContinue(true);
    } else if (!bonusTimeGiven && elapsedTime >= 30 && hasContent) {
      // Normal case: wait 30 seconds from page load
      setCanContinue(true);
    } else if (!hasContent) {
      setCanContinue(false);
    }
  }, [elapsedTime, hasContent, bonusTimeGiven, bonusElapsedTime]);
  
  // Add new word box
  const handleAddWord = () => {
    setWords([...words, '']);
  };
  
  // Remove word box
  const handleRemoveWord = (index: number) => {
    if (words.length > 1) {
      setWords(words.filter((_, i) => i !== index));
    }
  };
  
  // Update word value
  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);

    // Check if this is the first time user started writing
    const hasAnyContent = newWords.some(word => word.trim().length > 0);
    if (hasAnyContent && !hasStartedWriting) {
      setHasStartedWriting(true);

      // If original 90 seconds already passed, give 30 seconds bonus time
      if (timeLeft === 0 && !bonusTimeGiven) {
        setTimeLeft(30);
        setBonusTimeGiven(true);
      }
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canContinue || !hasContent) return;
    
    const recallData: RecallTaskResponse = {
      recalled_words: filledWords,
      word_count: filledWords.length,
      recall_combined_text: filledWords.join(' | '),
      recall_time_seconds: 90 - timeLeft
    };
    
    onComplete(recallData);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        
        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={24} className={timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'} />
            <span className={`text-3xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        {/* Instructions */}
        {config.instruction && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {config.instruction}
            </p>
          </div>
        )}
        
        {/* Warning when time is low */}
        {timeLeft <= 30 && timeLeft > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">
              ⏰ {timeLeft} seconds remaining
            </p>
          </div>
        )}
        
        {/* Word Count */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-semibold">{filledWords.length}</span> information point{filledWords.length !== 1 ? 's' : ''} entered
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dynamic Word Boxes */}
          {words.map((word, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-gray-500 font-medium w-8">{index + 1}.</span>
              <input
                type="text"
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                placeholder="Enter an information point..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={timeLeft === 0 && hasStartedWriting}
              />
              {words.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveWord(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={timeLeft === 0 && hasStartedWriting}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          
          {/* Add Word Button */}
          <button
            type="button"
            onClick={handleAddWord}
            disabled={timeLeft === 0 && hasStartedWriting}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            <span>Add Another Information Point</span>
          </button>
          
          {/* Status Messages */}
          <div className="space-y-2">
            {!hasContent && timeLeft > 0 && (
              <p className="text-sm text-gray-500">
                Please enter at least one information point to continue.
              </p>
            )}

            {!hasContent && timeLeft === 0 && !hasStartedWriting && (
              <p className="text-sm text-blue-600 font-medium">
                ⏰ Time&apos;s up, but you can still start writing. You&apos;ll get 30 extra seconds once you begin.
              </p>
            )}

            {bonusTimeGiven && timeLeft > 0 && bonusElapsedTime < 30 && (
              <p className="text-sm text-orange-600 font-medium">
                ⏰ Bonus time! Please wait {30 - bonusElapsedTime} seconds before continuing.
              </p>
            )}

            {bonusTimeGiven && timeLeft > 0 && bonusElapsedTime >= 30 && (
              <p className="text-sm text-orange-600 font-medium">
                ⏰ Bonus time! {timeLeft} seconds remaining.
              </p>
            )}

            {hasContent && elapsedTime < 30 && !bonusTimeGiven && (
              <p className="text-sm text-gray-500">
                Please wait at least 30 seconds before continuing ({30 - elapsedTime}s remaining).
              </p>
            )}

            {canContinue && (
              <p className="text-sm text-green-600 font-medium">
                ✓ You can now continue
              </p>
            )}
          </div>
          
          {/* Continue Button */}
          <button
            type="submit"
            disabled={!canContinue || !hasContent}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
              canContinue && hasContent
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {timeLeft === 0 ? 'Time Expired - Submit' : 'Continue to Next Question'}
          </button>
        </form>
      </div>
    </div>
  );
}
