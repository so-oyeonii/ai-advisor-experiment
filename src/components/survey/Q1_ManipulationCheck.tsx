import { useState, FormEvent } from 'react';
import { Q1_ManipulationChecks as config } from '@/config/surveyQuestions';
import { ManipulationCheckResponse } from '@/types/survey';

interface Q1Props {
  onComplete: (responses: ManipulationCheckResponse) => void;
}

export default function Q1_ManipulationCheck({ onComplete }: Q1Props) {
  const [responses, setResponses] = useState<Partial<ManipulationCheckResponse>>({});

  const handleChange = (variable: string, value: string) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all responses are present
    const allAnswered = config.items.every(item => 
      responses[item.variable as keyof ManipulationCheckResponse] !== undefined
    );

    if (allAnswered) {
      onComplete(responses as ManipulationCheckResponse);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{config.title}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {config.items.map((item, index) => (
            <div key={item.variable} className="space-y-3">
              <p className="text-lg font-medium text-gray-800">
                {index + 1}. {item.text}
              </p>
              
              <div className="space-y-2 pl-4">
                {item.options?.map((option) => (
                  <label 
                    key={option.value}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <input
                      type="radio"
                      name={item.variable}
                      value={option.value}
                      onChange={(e) => handleChange(item.variable, e.target.value)}
                      className="h-4 w-4 text-blue-600"
                      required
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
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
