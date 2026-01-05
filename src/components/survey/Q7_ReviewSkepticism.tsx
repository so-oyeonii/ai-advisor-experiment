import { useState, FormEvent } from 'react';
import LikertScale from '../LikertScale';
import { Q7_ReviewSkepticism as config } from '@/config/surveyQuestions';
import { ReviewSkepticismResponse } from '@/types/survey';

interface Q7ReviewSkepticismProps {
  onComplete: (responses: ReviewSkepticismResponse) => void;
}

export default function Q7_ReviewSkepticism({ onComplete }: Q7ReviewSkepticismProps) {
  const [responses, setResponses] = useState<Partial<ReviewSkepticismResponse>>({});

  const handleChange = (variable: string, value: number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const allAnswered = config.items.every(item => 
      responses[item.variable as keyof ReviewSkepticismResponse] !== undefined
    );

    if (allAnswered) {
      onComplete(responses as ReviewSkepticismResponse);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">{config.title}</h2>
      {config.description && (
        <p className="text-base text-gray-600 mb-8">{config.description}</p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {config.items.map((item) => (
            <LikertScale
              key={item.variable}
              name={item.variable}
              question={item.text}
              leftLabel={item.scaleLabels?.min}
              rightLabel={item.scaleLabels?.max}
              onChange={(e) => handleChange(item.variable, parseInt(e.target.value))}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
