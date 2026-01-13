import React, { useState, useEffect, FormEvent } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Q3_RecallTask as config } from '@/config/surveyQuestions';
import type { RecallTaskResponse } from '@/types/survey';

interface Q3_RecallTaskProps {
  onComplete: (data: RecallTaskResponse) => void;
}

export default function Q3_RecallTask({ onComplete }: Q3_RecallTaskProps) {
  const [words, setWords] = useState<string[]>(['']); // Start with one empty box
  const [initialTimeLeft, setInitialTimeLeft] = useState(90); // 90 seconds initial timer
  const [writingStartTime, setWritingStartTime] = useState<number | null>(null); // When user started writing
  const [canContinue, setCanContinue] = useState(false);
  const [waitTimeLeft, setWaitTimeLeft] = useState<number | null>(null); // 30 second wait timer after writing starts

  // Check if user has entered at least one word
  const hasContent = words.some(word => word.trim().length > 0);
  const filledWords = words.filter(word => word.trim().length > 0);

  // Initial 90 second countdown (before user writes anything)
  useEffect(() => {
    if (writingStartTime !== null) return; // Stop initial timer once user starts writing

    if (initialTimeLeft <= 0) return; // Timer finished

    const timer = setInterval(() => {
      setInitialTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTimeLeft, writingStartTime]);

  // 30 second wait timer after user starts writing
  useEffect(() => {
    if (!writingStartTime || !hasContent) {
      setCanContinue(false);
      setWaitTimeLeft(null);
      return;
    }

    // Calculate remaining wait time
    const updateWaitTime = () => {
      const elapsed = Math.floor((Date.now() - writingStartTime) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      setWaitTimeLeft(remaining);

      if (remaining === 0 && hasContent) {
        setCanContinue(true);
      }
    };

    updateWaitTime(); // Initial check

    const timer = setInterval(updateWaitTime, 500);

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
        setCanContinue(false);
        setWaitTimeLeft(null);
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
      // Start the 30 second wait timer
      setWritingStartTime(Date.now());
    }

    // If user deleted all content, reset
    if (!hasAnyContent && writingStartTime) {
      setWritingStartTime(null);
      setCanContinue(false);
      setWaitTimeLeft(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canContinue || !hasContent) return;

    const recallData: RecallTaskResponse = {
      recalled_words: filledWords,
      word_count: filledWords.length,
      recall_combined_text: filledWords.join(' | '),
      recall_time_seconds: writingStartTime ? Math.round((Date.now() - writingStartTime) / 1000) : 0
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
    // If user hasn't started writing, show initial timer
    if (!writingStartTime) {
      return initialTimeLeft;
    }
    // If user has started writing, show wait time
    return waitTimeLeft ?? 0;
  };

  const displayTime = getDisplayTime();
  const isWaitingPhase = writingStartTime !== null && waitTimeLeft !== null && waitTimeLeft > 0;

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
              ⏰ {displayTime} seconds remaining
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
            {!hasContent && initialTimeLeft > 0 && (
              <p className="text-sm text-gray-500">
                Please enter at least one information point to continue. ({formatTime(initialTimeLeft)} remaining)
              </p>
            )}

            {!hasContent && initialTimeLeft === 0 && (
              <p className="text-sm text-orange-600">
                Time is up. Please enter at least one information point to continue.
              </p>
            )}

            {hasContent && isWaitingPhase && (
              <p className="text-sm text-gray-500">
                Please wait {waitTimeLeft} seconds before continuing.
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
            Continue to Next Question
          </button>
        </form>
      </div>
    </div>
  );
}
