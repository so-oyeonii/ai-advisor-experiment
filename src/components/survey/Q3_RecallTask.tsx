import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Q3_RecallTask as config } from '@/config/surveyQuestions';
import type { RecallTaskResponse } from '@/types/survey';

interface Q3_RecallTaskProps {
  onComplete: (data: RecallTaskResponse) => void;
}

export default function Q3_RecallTask({ onComplete }: Q3_RecallTaskProps) {
  const [words, setWords] = useState<string[]>(['']); // Start with one empty box
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds countdown
  const [writingStartTime, setWritingStartTime] = useState<number | null>(null);
  const pageLoadTime = useRef(Date.now());

  // Check if user has entered at least one word
  const hasContent = words.some(word => word.trim().length > 0);
  const filledWords = words.filter(word => word.trim().length > 0);

  // 90 second countdown timer (never resets)
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - pageLoadTime.current) / 1000);
      setTimeLeft(Math.max(0, 90 - elapsed));
    }, 500);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Button activation logic:
  // - Must have content
  // - If 90 seconds passed: activate immediately when content exists
  // - If before 90 seconds: activate 30 seconds after writing started
  const canContinue = (() => {
    if (!hasContent) return false;

    const elapsed = Math.floor((Date.now() - pageLoadTime.current) / 1000);

    // After 90 seconds: activate immediately if has content
    if (elapsed >= 90) return true;

    // Before 90 seconds: need 30 seconds since writing started
    if (writingStartTime) {
      const writingElapsed = Math.floor((Date.now() - writingStartTime) / 1000);
      return writingElapsed >= 30;
    }

    return false;
  })();

  // Calculate seconds until can continue (for display)
  const getSecondsUntilCanContinue = () => {
    if (!hasContent || !writingStartTime) return null;

    const elapsed = Math.floor((Date.now() - pageLoadTime.current) / 1000);
    if (elapsed >= 90) return 0;

    const writingElapsed = Math.floor((Date.now() - writingStartTime) / 1000);
    return Math.max(0, 30 - writingElapsed);
  };

  const [secondsUntilContinue, setSecondsUntilContinue] = useState<number | null>(null);

  // Update seconds until continue
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilContinue(getSecondsUntilCanContinue());
    }, 500);
    return () => clearInterval(timer);
  }, [writingStartTime, hasContent]);

  // Add new word box
  const handleAddWord = () => {
    setWords([...words, '']);
  };

  // Remove word box
  const handleRemoveWord = (index: number) => {
    if (words.length > 1) {
      const newWords = words.filter((_, i) => i !== index);
      setWords(newWords);

      // If all content was removed, reset writing start time
      const hasAnyContent = newWords.some(word => word.trim().length > 0);
      if (!hasAnyContent) {
        setWritingStartTime(null);
      }
    }
  };

  // Update word value
  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);

    // Check if this is the first time user started writing
    const hasAnyContent = newWords.some(word => word.trim().length > 0);
    if (hasAnyContent && !writingStartTime) {
      setWritingStartTime(Date.now());
    }

    // If user deleted all content, reset writing start time
    if (!hasAnyContent && writingStartTime) {
      setWritingStartTime(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;

    const totalTime = Math.round((Date.now() - pageLoadTime.current) / 1000);

    const recallData: RecallTaskResponse = {
      recalled_words: filledWords,
      word_count: filledWords.length,
      recall_combined_text: filledWords.join(' | '),
      recall_time_seconds: totalTime
    };

    onComplete(recallData);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Status message logic
  const getStatusMessage = () => {
    if (!hasContent) {
      return 'Please enter at least one information point to continue.';
    }

    const elapsed = Math.floor((Date.now() - pageLoadTime.current) / 1000);

    // After 90 seconds with content: can continue
    if (elapsed >= 90) {
      return null;
    }

    // Before 90 seconds with content: show wait time
    if (secondsUntilContinue !== null && secondsUntilContinue > 0) {
      return `Please wait ${secondsUntilContinue} seconds before continuing.`;
    }

    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">

        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={24} className={timeLeft <= 10 && timeLeft > 0 ? 'text-red-600' : 'text-blue-600'} />
            <span className={`text-3xl font-mono font-bold ${timeLeft <= 10 && timeLeft > 0 ? 'text-red-600' : 'text-gray-900'}`}>
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

        {/* Word Count */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-semibold">{filledWords.length}</span> information point{filledWords.length !== 1 ? 's' : ''} entered
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dynamic Word Boxes - Always enabled */}
          {words.map((word, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-gray-500 font-medium w-8">{index + 1}.</span>
              <input
                type="text"
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                placeholder="Enter an information point..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {words.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveWord(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}

          {/* Add Word Button - Always enabled */}
          <button
            type="button"
            onClick={handleAddWord}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Another Information Point</span>
          </button>

          {/* Status Messages */}
          <div className="space-y-2">
            {statusMessage && (
              <p className="text-sm text-gray-500">
                {statusMessage}
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
            disabled={!canContinue}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
              canContinue
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Next Question
          </button>
        </form>
      </div>
    </div>
  );
}
