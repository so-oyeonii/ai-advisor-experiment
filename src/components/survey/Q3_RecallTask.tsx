import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { Clock } from 'lucide-react';
import { Q3_RecallTask as config } from '@/config/surveyQuestions';
import type { RecallTaskResponse } from '@/types/survey';

interface Q3_RecallTaskProps {
  onComplete: (data: RecallTaskResponse) => void;
}

export default function Q3_RecallTask({ onComplete }: Q3_RecallTaskProps) {
  const [responses, setResponses] = useState<Partial<RecallTaskResponse>>({
    recall_1: '',
    recall_2: '',
    recall_3: '',
    recall_4: '',
    recall_5: '',
    recall_6: '',
    recall_7: '',
    recall_8: ''
  });
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [canContinue, setCanContinue] = useState(false);

  // Check if user has entered at least one point
  const hasContent = Object.values(responses).some(value => value && value.trim().length > 0);
  
  // Auto-submit function
  const handleAutoSubmit = useCallback(() => {
    if (hasContent) {
      onComplete(responses as RecallTaskResponse);
    }
  }, [responses, hasContent, onComplete]);
  
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
  }, [hasContent, handleAutoSubmit]);
  
  // Enable continue button after 30 seconds IF user has entered content
  useEffect(() => {
    if (elapsedTime >= 30 && hasContent) {
      setCanContinue(true);
    } else if (!hasContent) {
      setCanContinue(false);
    }
  }, [elapsedTime, hasContent]);
  
  // Update response
  const handleChange = (variable: string, value: string) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canContinue || !hasContent) return;
    
    onComplete(responses as RecallTaskResponse);
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
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-blue-900 font-medium mb-2 whitespace-pre-line">
            {config.instruction}
          </p>
          <p className="text-blue-700 text-sm">
            • You can continue after 30 seconds<br />
            • You must enter at least one information point to continue
          </p>
        </div>
        
        {/* Input Boxes */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {config.items.map((item, index) => (
              <div key={item.variable} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-blue-100 rounded-md text-blue-700 font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={responses[item.variable as keyof RecallTaskResponse] || ''}
                    onChange={(e) => handleChange(item.variable, e.target.value)}
                    placeholder={item.text}
                    className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none text-lg"
                    autoFocus={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Continue Button */}
          <button 
            type="submit"
            disabled={!canContinue || !hasContent}
            className={`w-full mt-6 py-3 rounded-md text-lg font-semibold transition ${
              canContinue && hasContent
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!hasContent
              ? 'Please enter at least one information point'
              : elapsedTime < 30
              ? `Please wait ${Math.max(0, 30 - elapsedTime)}s...`
              : 'Continue'
            }
          </button>
        </form>
        
        {timeLeft === 0 && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {hasContent 
              ? "Time's up! Submitting automatically..." 
              : "Time's up! Please enter at least one information point to continue."}
          </p>
        )}
      </div>
    </div>
  );
}
