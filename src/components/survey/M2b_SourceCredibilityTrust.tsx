import { useState, FormEvent } from 'react';
import SemanticDifferential from '../SemanticDifferential';
import { M2b_CredibilityTrustworthiness as config } from '@/config/surveyQuestions';
import { CredibilityTrustworthinessResponse } from '@/types/survey';

interface M2bProps {
  onComplete: (responses: CredibilityTrustworthinessResponse) => void;
}

export default function M2b_SourceCredibilityTrust({ onComplete }: M2bProps) {
  const [responses, setResponses] = useState<Partial<CredibilityTrustworthinessResponse>>({});

  const handleChange = (variable: string, value: number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const allAnswered = config.items.every(item => 
      responses[item.variable as keyof CredibilityTrustworthinessResponse] !== undefined
    );

    if (allAnswered) {
      onComplete(responses as CredibilityTrustworthinessResponse);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
      {config.description && (
        <p className="text-gray-600 mb-6">{config.description}</p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {config.items.map((item) => (
            <SemanticDifferential
              key={item.variable}
              name={item.variable}
              leftLabel={item.scaleLabels?.min || ''}
              rightLabel={item.scaleLabels?.max || ''}
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
