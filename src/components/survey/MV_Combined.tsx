import { useState, FormEvent } from 'react';
import LikertScale from '../LikertScale';
import TextWithBold from '../TextWithBold';
import { MV_ReviewHelpfulness as helpfulnessConfig, MV_PerceivedError as errorConfig } from '@/config/surveyQuestions';
import { ReviewHelpfulnessResponse, PerceivedErrorResponse } from '@/types/survey';

interface MVCombinedProps {
  onComplete: (responses: ReviewHelpfulnessResponse & PerceivedErrorResponse) => void;
}

export default function MV_Combined({ onComplete }: MVCombinedProps) {
  const [responses, setResponses] = useState<Partial<ReviewHelpfulnessResponse & PerceivedErrorResponse>>({});

  const handleChange = (variable: string, value: number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check Review Helpfulness questions
    const helpfulnessAnswered = helpfulnessConfig.items.every(item =>
      responses[item.variable as keyof ReviewHelpfulnessResponse] !== undefined
    );

    // Check Perceived Error question
    const errorAnswered = responses.perceived_error !== undefined;

    if (helpfulnessAnswered && errorAnswered) {
      onComplete(responses as ReviewHelpfulnessResponse & PerceivedErrorResponse);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Review Helpfulness Section */}
      {helpfulnessConfig.description && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 mb-10">
          <TextWithBold
            text={helpfulnessConfig.description}
            as="p"
            className="text-xl font-semibold text-gray-900 whitespace-pre-line leading-relaxed"
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {helpfulnessConfig.items.map((item) => (
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

        {/* Perceived Error Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          {errorConfig.description && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 mb-10">
              <TextWithBold
                text={errorConfig.description}
                as="p"
                className="text-xl font-semibold text-gray-900 whitespace-pre-line leading-relaxed"
              />
            </div>
          )}

          <div className="space-y-6">
            {errorConfig.items.map((item) => (
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
