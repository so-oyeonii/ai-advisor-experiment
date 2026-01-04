import { useState, useEffect, FormEvent } from 'react';
import { Q3_RecallTask as config } from '@/config/surveyQuestions';
import { RecallTaskResponse } from '@/types/survey';

interface Q3Props {
  onComplete: (responses: RecallTaskResponse) => void;
}

export default function Q3_RecallTask({ onComplete }: Q3Props) {
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
  
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit || 90);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time expires
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAutoSubmit = () => {
    onComplete(responses as RecallTaskResponse);
  };

  const handleChange = (variable: string, value: string) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onComplete(responses as RecallTaskResponse);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
        
        <div className={`text-3xl font-mono font-bold px-4 py-2 rounded-lg ${
          timeRemaining <= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      {config.instruction && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700 whitespace-pre-line">{config.instruction}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {config.items.map((item, index) => (
            <div key={item.variable}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {item.text}
              </label>
              <input
                type="text"
                name={item.variable}
                value={responses[item.variable as keyof RecallTaskResponse] || ''}
                onChange={(e) => handleChange(item.variable, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Information point ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {timeRemaining > 0 
              ? 'You can submit early or wait for the timer to expire.' 
              : 'Time is up! Submitting...'}
          </p>
          <button
            type="submit"
            disabled={timeRemaining === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
