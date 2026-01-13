import React, { useState, useEffect, FormEvent } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Q3_RecallTask as config } from '@/config/surveyQuestions';
import type { RecallTaskResponse } from '@/types/survey';

interface Q3_RecallTaskProps {
  onComplete: (data: RecallTaskResponse) => void;
}

export default function Q3_RecallTask({ onComplete }: Q3_RecallTaskProps) {
  const [words, setWords] = useState<string[]>(['']); // Start with one empty box
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds
  const [writingStartTime, setWritingStartTime] = useState<number | null>(null); // When user started writing
  const [canContinue, setCanContinue] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false); // Pause timer when it hits 0 and user hasn't written

  // Check if user has entered at least one word
  const hasContent = words.some(word => word.trim().length > 0);
  const filledWords = words.filter(word => word.trim().length > 0);

  // Timer countdown
  useEffect(() => {
    if (timerPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // If user hasn't started writing, pause the timer at 0
          if (!writingStartTime) {
            setTimerPaused(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerPaused, writingStartTime]);

  // Enable continue button after 30 seconds of writing
  useEffect(() => {
    if (!writingStartTime || !hasContent) {
      setCanContinue(false);
      return;
    }

    const checkInterval = setInterval(() => {
      const elapsed = (Date.now() - writingStartTime) / 1000;
      if (elapsed >= 30 && hasContent) {
        setCanContinue(true);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, [writingStartTime, hasContent]);

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
    if (hasAnyContent && !writingStartTime) {
      setWritingStartTime(Date.now());

      // If timer was paused (hit 0 without writing), restart with 30 seconds
      if (timerPaused) {
        setTimerPaused(false);
        setTimeLeft(30);
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
      recall_time_seconds: writingStartTime ? Math.round((Date.now() - writingStartTime) / 1000) : 0
    };

    onComplete(recallData);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate time until can continue
  const getWaitTime = () => {
    if (!writingStartTime) return 30;
    const elapsed = Math.floor((Date.now() - writingStartTime) / 1000);
    return Math.max(0, 30 - elapsed);
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
            <Clock size={24} className={timeLeft <= 10 && !timerPaused ? 'text-red-600' : 'text-blue-600'} />
            <span className={`text-3xl font-mono font-bold ${timeLeft <= 10 && !timerPaused ? 'text-red-600' : 'text-gray-900'}`}>
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
        {timeLeft <= 30 && timeLeft > 0 && !timerPaused && (
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
                disabled={timeLeft === 0 && !timerPaused}
              />
              {words.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveWord(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={timeLeft === 0 && !timerPaused}
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
            disabled={timeLeft === 0 && !timerPaused}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            <span>Add Another Information Point</span>
          </button>

          {/* Status Messages */}
          <div className="space-y-2">
            {!hasContent && (
              <p className="text-sm text-gray-500">
                Please enter at least one information point to continue.
              </p>
            )}

            {hasContent && !canContinue && (
              <p className="text-sm text-gray-500">
                Please wait at least 30 seconds before continuing ({getWaitTime()}s remaining).
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
