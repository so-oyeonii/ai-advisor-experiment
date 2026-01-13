import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Q3_RecallTask as config } from '@/config/surveyQuestions';
import type { RecallTaskResponse } from '@/types/survey';

interface Q3_RecallTaskProps {
  onComplete: (data: RecallTaskResponse) => void;
}

export default function Q3_RecallTask({ onComplete }: Q3_RecallTaskProps) {
  const [words, setWords] = useState<string[]>(['']); // Start with one empty box
  const [initialTimeLeft, setInitialTimeLeft] = useState(90); // 90 seconds initial timer
  const [bonusTimeLeft, setBonusTimeLeft] = useState(30); // 30 seconds bonus timer (after 90s)
  const [bonusTimerStarted, setBonusTimerStarted] = useState(false); // Has bonus timer started?
  const pageLoadTime = useRef(Date.now()); // When page loaded

  // Check if user has entered at least one word
  const hasContent = words.some(word => word.trim().length > 0);
  const filledWords = words.filter(word => word.trim().length > 0);

  // Initial 90 second countdown
  useEffect(() => {
    if (initialTimeLeft <= 0) return; // Timer finished

    const timer = setInterval(() => {
      setInitialTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTimeLeft]);

  // Bonus 30 second countdown (only starts after 90s AND user has content)
  useEffect(() => {
    // Don't start bonus timer until initial 90 seconds is done
    if (initialTimeLeft > 0) return;

    // Don't start bonus timer if no content
    if (!hasContent) {
      setBonusTimerStarted(false);
      setBonusTimeLeft(30);
      return;
    }

    // Start bonus timer when 90s done AND has content
    if (!bonusTimerStarted) {
      setBonusTimerStarted(true);
      setBonusTimeLeft(30);
    }

    // Countdown bonus timer
    if (bonusTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setBonusTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTimeLeft, hasContent, bonusTimerStarted, bonusTimeLeft]);

  // Can continue when: has content AND initial 90s done AND bonus 30s done
  const canContinue = hasContent && initialTimeLeft === 0 && bonusTimerStarted && bonusTimeLeft === 0;

  // Add new word box
  const handleAddWord = () => {
    setWords([...words, '']);
  };

  // Remove word box
  const handleRemoveWord = (index: number) => {
    if (words.length > 1) {
      const newWords = words.filter((_, i) => i !== index);
      setWords(newWords);

      // If all content was removed, reset bonus timer
      const hasAnyContent = newWords.some(word => word.trim().length > 0);
      if (!hasAnyContent) {
        setBonusTimerStarted(false);
        setBonusTimeLeft(30);
      }
    }
  };

  // Update word value
  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);

    // If user deleted all content, reset bonus timer
    const hasAnyContent = newWords.some(word => word.trim().length > 0);
    if (!hasAnyContent) {
      setBonusTimerStarted(false);
      setBonusTimeLeft(30);
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

  // Determine which timer to display
  const getDisplayTime = () => {
    if (initialTimeLeft > 0) {
      return initialTimeLeft;
    }
    // After 90s, show bonus timer if user has content
    if (hasContent) {
      return bonusTimeLeft;
    }
    // After 90s but no content, show 0:00
    return 0;
  };

  const displayTime = getDisplayTime();

  // Status message logic
  const getStatusMessage = () => {
    if (!hasContent) {
      if (initialTimeLeft > 0) {
        return `Please enter at least one information point to continue. (${formatTime(initialTimeLeft)} remaining)`;
      }
      return 'Time is up. Please enter at least one information point to continue.';
    }

    if (initialTimeLeft > 0) {
      return `Please wait for the initial time to complete. (${formatTime(initialTimeLeft)} remaining)`;
    }

    if (bonusTimeLeft > 0) {
      return `Please wait ${bonusTimeLeft} seconds before continuing.`;
    }

    return null; // canContinue is true
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
            <Clock size={24} className={displayTime <= 10 && displayTime > 0 ? 'text-red-600' : 'text-blue-600'} />
            <span className={`text-3xl font-mono font-bold ${displayTime <= 10 && displayTime > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatTime(displayTime)}
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
        {displayTime <= 30 && displayTime > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">
              {initialTimeLeft > 0 ? `${displayTime} seconds remaining` : `${displayTime} seconds until you can continue`}
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
              <p className={`text-sm ${!hasContent && initialTimeLeft === 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                {statusMessage}
              </p>
            )}

            {canContinue && (
              <p className="text-sm text-green-600 font-medium">
                You can now continue
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
