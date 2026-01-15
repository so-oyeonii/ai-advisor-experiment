import { useState, FormEvent } from 'react';
import LikertScale from '../LikertScale';
import TextWithBold from '../TextWithBold';
import {
  DV1_Persuasiveness as persuasivenessConfig,
  DV2_PurchaseIntention as purchaseConfig,
  DV3_DecisionConfidence as confidenceConfig
} from '@/config/surveyQuestions';
import { PersuasivenessResponse, PurchaseIntentionResponse, DecisionConfidenceResponse } from '@/types/survey';

type CombinedResponse = PersuasivenessResponse & PurchaseIntentionResponse & DecisionConfidenceResponse;

interface DVCombinedProps {
  onComplete: (responses: CombinedResponse) => void;
}

export default function DV_Combined({ onComplete }: DVCombinedProps) {
  const [responses, setResponses] = useState<Partial<CombinedResponse>>({});

  const handleChange = (variable: string, value: number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check Persuasiveness questions
    const persuasivenessAnswered = persuasivenessConfig.items.every(item =>
      responses[item.variable as keyof PersuasivenessResponse] !== undefined
    );

    // Check Purchase Intention questions
    const purchaseAnswered = purchaseConfig.items.every(item =>
      responses[item.variable as keyof PurchaseIntentionResponse] !== undefined
    );

    // Check Decision Confidence question
    const confidenceAnswered = responses.confidence !== undefined;

    if (persuasivenessAnswered && purchaseAnswered && confidenceAnswered) {
      onComplete(responses as CombinedResponse);
    }
  };

  const confidenceItem = confidenceConfig.items[0];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Persuasiveness Section */}
      {persuasivenessConfig.description && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 mb-10">
          <TextWithBold
            text={persuasivenessConfig.description}
            as="p"
            className="text-xl font-semibold text-gray-900 whitespace-pre-line leading-relaxed"
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {persuasivenessConfig.items.map((item) => (
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

        {/* Purchase Intention Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          {purchaseConfig.description && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 mb-10">
              <TextWithBold
                text={purchaseConfig.description}
                as="p"
                className="text-xl font-semibold text-gray-900 whitespace-pre-line leading-relaxed"
              />
            </div>
          )}

          {purchaseConfig.warning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800 text-sm font-medium">{purchaseConfig.warning}</p>
            </div>
          )}

          <div className="space-y-6">
            {purchaseConfig.items.map((item) => (
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

        {/* Decision Confidence Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          {confidenceConfig.description && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 mb-10">
              <TextWithBold
                text={confidenceConfig.description}
                as="p"
                className="text-xl font-semibold text-gray-900 whitespace-pre-line leading-relaxed"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between gap-6">
              <span className="text-base text-gray-700 w-36 text-right flex-shrink-0">
                {confidenceItem.scaleLabels?.min}
              </span>
              <div className="flex space-x-6 sm:space-x-8 md:space-x-10 justify-center">
                {[1, 2, 3, 4, 5, 6, 7].map(value => (
                  <label key={value} className="flex flex-col items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                    <input
                      type="radio"
                      name={confidenceItem.variable}
                      value={value}
                      onChange={(e) => handleChange('confidence', parseInt(e.target.value))}
                      className="mb-2 h-5 w-5 text-blue-600 cursor-pointer"
                      required
                    />
                    <span className="text-sm text-gray-600 font-medium">{value}</span>
                  </label>
                ))}
              </div>
              <span className="text-base text-gray-700 w-36 flex-shrink-0">
                {confidenceItem.scaleLabels?.max}
              </span>
            </div>
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
