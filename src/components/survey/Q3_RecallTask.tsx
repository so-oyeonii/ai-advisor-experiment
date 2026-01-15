import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Clock } from 'lucide-react';
import { Q3_RecallTask as config } from '@/config/surveyQuestions';
import type { RecallTaskResponse } from '@/types/survey';

interface Q3_RecallTaskProps {
  onComplete: (data: RecallTaskResponse) => void;
}

export default function Q3_RecallTask({ onComplete }: Q3_RecallTaskProps) {
  const [thoughts, setThoughts] = useState('');
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds countdown
  const [writingStartTime, setWritingStartTime] = useState<number | null>(null);
  const pageLoadTime = useRef(Date.now());

  // Check if user has entered content
  const hasContent = thoughts.trim().length > 0;

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
  // - Always need 30 seconds since writing started (regardless of 90 second timer)
  const canContinue = (() => {
    if (!hasContent) return false;

    // Always need 30 seconds since writing started
    if (writingStartTime) {
      const writingElapsed = Math.floor((Date.now() - writingStartTime) / 1000);
      return writingElapsed >= 30;
    }

    return false;
  })();

  // Calculate seconds until can continue (for display)
  const getSecondsUntilCanContinue = () => {
    if (!hasContent || !writingStartTime) return null;

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

  // Handle text change
  const handleTextChange = (value: string) => {
    setThoughts(value);

    // Check if this is the first time user started writing
    const hasAnyContent = value.trim().length > 0;
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
    const words = thoughts.trim().split(/\s+/).filter(w => w.length > 0);

    const recallData: RecallTaskResponse = {
      recalled_words: words,
      word_count: words.length,
      recall_combined_text: thoughts.trim(),
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
      return 'Please share your thoughts to continue.';
    }

    // Show wait time after writing started
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

        {/* Question/Instruction */}
        {config.instruction && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-lg text-gray-800 font-medium">
              {config.instruction}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Single Large Textarea */}
          <div>
            <textarea
              value={thoughts}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base leading-relaxed"
            />
            <div className="mt-2 text-sm text-gray-500 text-right">
              {thoughts.trim().split(/\s+/).filter(w => w.length > 0).length} words
            </div>
          </div>

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
