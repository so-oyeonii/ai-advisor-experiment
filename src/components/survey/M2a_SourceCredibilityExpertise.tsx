import { useState, FormEvent } from 'react';
import LikertScale from '../LikertScale';
import { M2a_MessageCredibility, M2b_Trust } from '@/config/surveyQuestions';

interface CombinedCredibilityResponse {
  message_credibility_1: number;
  message_credibility_2: number;
  message_credibility_3: number;
  trust_1: number;
  trust_2: number;
  trust_3: number;
}

interface M2aProps {
  onComplete: (responses: CombinedCredibilityResponse) => void;
}

export default function M2a_SourceCredibilityExpertise({ onComplete }: M2aProps) {
  const [responses, setResponses] = useState<Partial<CombinedCredibilityResponse>>({});

  const handleChange = (variable: string, value: number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const allItems = [...M2a_MessageCredibility.items, ...M2b_Trust.items];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const allAnswered = allItems.every(item =>
      responses[item.variable as keyof CombinedCredibilityResponse] !== undefined
    );

    if (allAnswered) {
      onComplete(responses as CombinedCredibilityResponse);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Message Credibility Section */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">{M2a_MessageCredibility.title}</h2>
        <p className="text-lg font-medium text-gray-800 mb-6 whitespace-pre-line">
          {M2a_MessageCredibility.description}
        </p>
        <div className="space-y-6">
          {M2a_MessageCredibility.items.map((item) => (
            <LikertScale
              key={item.variable}
              name={item.variable}
              question={item.text}
              minLabel={item.scaleLabels?.min || ''}
              maxLabel={item.scaleLabels?.max || ''}
              onChange={(e) => handleChange(item.variable, parseInt(e.target.value))}
            />
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="mb-8 pt-8 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">{M2b_Trust.title}</h2>
        <p className="text-lg font-medium text-gray-800 mb-6 whitespace-pre-line">
          {M2b_Trust.description}
        </p>
        <div className="space-y-6">
          {M2b_Trust.items.map((item) => (
            <LikertScale
              key={item.variable}
              name={item.variable}
              question={item.text}
              minLabel={item.scaleLabels?.min || ''}
              maxLabel={item.scaleLabels?.max || ''}
              onChange={(e) => handleChange(item.variable, parseInt(e.target.value))}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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
