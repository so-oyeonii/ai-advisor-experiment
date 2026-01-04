import React, { useState, useEffect } from 'react';
import { Clock, Plus, X } from 'lucide-react';
import { Q3_RecallTask as config } from '@/config/surveyQuestions';
import type { RecallTaskResponse } from '@/types/survey';

interface Q3_RecallTaskProps {
  onComplete: (data: RecallTaskResponse) => void;
}

export default function Q3_RecallTask({ onComplete }: Q3_RecallTaskProps) {
  const [recallWords, setRecallWords] = useState<string[]>(['']); // Array of words - starts with one empty box
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [canContinue, setCanContinue] = useState(false);

  // Check if user has entered at least one word
  const hasContent = recallWords.some(word => word.trim().length > 0);
  const wordCount = recallWords.filter(word => word.trim().length > 0).length;
  
  // Timer countdown
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
    
    return () => clearInterval(timer);
  }, [hasContent]);
  
  // Enable continue button after 30 seconds IF user has entered content
  useEffect(() => {
    if (elapsedTime >= 30 && hasContent) {
      setCanContinue(true);
    } else if (!hasContent) {
      setCanContinue(false);
    }
  }, [elapsedTime, hasContent]);
  
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
  
  const handleSubmit = () => {
    if (!canContinue || !hasContent) return;
    
    // Filter out empty words
    const filteredWords = recallWords.filter(word => word.trim().length > 0);
    
    const data: RecallTaskResponse = {
      recalled_words: filteredWords,
      word_count: filteredWords.length,
      recall_combined_text: filteredWords.join(', '),
      recall_time_seconds: elapsedTime
    };
    onComplete(data);
  };

  const handleAutoSubmit = () => {
    // Filter out empty words
    const filteredWords = recallWords.filter(word => word.trim().length > 0);
    
    const data: RecallTaskResponse = {
      recalled_words: filteredWords,
      word_count: filteredWords.length,
      recall_combined_text: filteredWords.join(', '),
      recall_time_seconds: 90 // Full time elapsed
    };
    onComplete(data);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        
        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
            <p className="text-gray-600">{config.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={24} className={timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'} />
            <span className={`text-3xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatTime(timeLeft)}
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
            : 'Continue'
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
