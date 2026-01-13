import { useState, FormEvent } from 'react';
import LikertScale from '../LikertScale';
import { Q7_MachineHeuristic as config } from '@/config/surveyQuestions';

interface MachineHeuristicResponse {
  machine_heuristic_1: number;
  machine_heuristic_2: number;
  machine_heuristic_3: number;
  machine_heuristic_4: number;
}

interface Q7MachineHeuristicProps {
  onComplete: (responses: MachineHeuristicResponse) => void;
}

export default function Q7_MachineHeuristic({ onComplete }: Q7MachineHeuristicProps) {
  const [responses, setResponses] = useState<Partial<MachineHeuristicResponse>>({});

  const handleChange = (variable: string, value: number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const allAnswered = config.items.every(item =>
      responses[item.variable as keyof MachineHeuristicResponse] !== undefined
    );

    if (allAnswered) {
      onComplete(responses as MachineHeuristicResponse);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 대표 질문 - 초록색 카드 스타일 (general-questions 테마) */}
      {config.description && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-6 mb-10">
          <p className="text-xl font-semibold text-gray-900 whitespace-pre-line leading-relaxed">
            {config.description}
          </p>
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
