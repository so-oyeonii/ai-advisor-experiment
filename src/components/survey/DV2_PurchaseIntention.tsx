import { useState, FormEvent } from 'react';
import LikertScale from '../LikertScale';
import { DV2_PurchaseIntention as config } from '@/config/surveyQuestions';
import { PurchaseIntentionResponse } from '@/types/survey';

interface DV2Props {
  onComplete: (responses: PurchaseIntentionResponse) => void;
}

export default function DV2_PurchaseIntention({ onComplete }: DV2Props) {
  const [responses, setResponses] = useState<Partial<PurchaseIntentionResponse>>({});

  const handleChange = (variable: string, value: number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const allAnswered = config.items.every(item => 
      responses[item.variable as keyof PurchaseIntentionResponse] !== undefined
    );

    if (allAnswered) {
      onComplete(responses as PurchaseIntentionResponse);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
      {config.description && (
        <p className="text-gray-600 mb-6">{config.description}</p>
      )}
      
      {config.warning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-800 text-sm font-medium">{config.warning}</p>
        </div>
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
