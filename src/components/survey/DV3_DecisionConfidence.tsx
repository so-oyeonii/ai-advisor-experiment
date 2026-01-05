import { useState, FormEvent } from 'react';
import { DV3_DecisionConfidence as config } from '@/config/surveyQuestions';
import { DecisionConfidenceResponse } from '@/types/survey';

interface DV3Props {
  onComplete: (responses: DecisionConfidenceResponse) => void;
}

export default function DV3_DecisionConfidence({ onComplete }: DV3Props) {
  const [confidence, setConfidence] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (confidence !== null) {
      onComplete({ confidence });
    }
  };

  const item = config.items[0]; // Single item

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">{config.title}</h2>
      {config.description && (
        <p className="text-lg font-medium text-gray-800 mb-8">{config.description}</p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex items-center justify-between gap-6">
            <span className="text-base text-gray-700 w-36 text-right flex-shrink-0">
              {item.scaleLabels?.min}
            </span>
            <div className="flex space-x-6 sm:space-x-8 md:space-x-10 justify-center">
              {[1, 2, 3, 4, 5, 6, 7].map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                  <input 
                    type="radio" 
                    name={item.variable}
                    value={value}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="mb-2 h-5 w-5 text-blue-600 cursor-pointer"
                    required
                  />
                  <span className="text-sm text-gray-600 font-medium">{value}</span>
                </label>
              ))}
            </div>
            <span className="text-base text-gray-700 w-36 flex-shrink-0">
              {item.scaleLabels?.max}
            </span>
          </div>
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
