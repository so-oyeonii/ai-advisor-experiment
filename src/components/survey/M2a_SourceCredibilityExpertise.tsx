import { useState, FormEvent } from 'react';
import LikertScale from '../LikertScale';
import { M2a_MessageCredibility as config } from '@/config/surveyQuestions';

interface MessageCredibilityResponse {
  message_credibility_1: number;
  message_credibility_2: number;
  message_credibility_3: number;
}

interface M2aProps {
  onComplete: (responses: MessageCredibilityResponse) => void;
}

export default function M2a_SourceCredibilityExpertise({ onComplete }: M2aProps) {
  const [responses, setResponses] = useState<Partial<MessageCredibilityResponse>>({});

  const handleChange = (variable: string, value: number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const allAnswered = config.items.every(item =>
      responses[item.variable as keyof MessageCredibilityResponse] !== undefined
    );

    if (allAnswered) {
      onComplete(responses as MessageCredibilityResponse);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">{config.title}</h2>
      {config.description && (
        <p className="text-lg font-medium text-gray-800 mb-8 whitespace-pre-line">{config.description}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {config.items.map((item) => (
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
