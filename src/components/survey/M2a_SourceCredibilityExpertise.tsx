import { useState, FormEvent } from 'react';
import SemanticDifferential from '../SemanticDifferential';
import { M2a_CredibilityExpertise as config } from '@/config/surveyQuestions';
import { CredibilityExpertiseResponse } from '@/types/survey';

interface M2aProps {
  onComplete: (responses: CredibilityExpertiseResponse) => void;
}

export default function M2a_SourceCredibilityExpertise({ onComplete }: M2aProps) {
  const [responses, setResponses] = useState<Partial<CredibilityExpertiseResponse>>({});

  const handleChange = (variable: string, value: number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const allAnswered = config.items.every(item => 
      responses[item.variable as keyof CredibilityExpertiseResponse] !== undefined
    );

    if (allAnswered) {
      onComplete(responses as CredibilityExpertiseResponse);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">{config.title}</h2>
      {config.description && (
        <p className="text-lg font-medium text-gray-800 mb-8">{config.description}</p>
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
