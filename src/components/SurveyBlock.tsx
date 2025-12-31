// SurveyBlock component - displays survey questions
import React, { useState } from 'react';
import { SurveyQuestion } from '@/lib/surveyQuestions';

interface SurveyBlockProps {
  questions: SurveyQuestion[];
  onSubmit: (responses: Record<string, any>) => void;
  submitLabel?: string;
}

export default function SurveyBlock({ questions, onSubmit, submitLabel = 'Continue' }: SurveyBlockProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    // Clear error when user responds
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    questions.forEach((question) => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = 'This question is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(responses);
    }
  };

  const renderQuestion = (question: SurveyQuestion) => {
    switch (question.type) {
      case 'likert':
        return (
          <div key={question.id} className="mb-8">
            <label className="block text-gray-800 font-medium mb-3">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {question.scale && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{question.scale.minLabel}</span>
                  <span className="text-sm text-gray-600">{question.scale.maxLabel}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  {Array.from(
                    { length: question.scale.max - question.scale.min + 1 },
                    (_, i) => i + question.scale!.min
                  ).map((value) => (
                    <label key={value} className="flex flex-col items-center cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value={value}
                        checked={responses[question.id] === value}
                        onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                        className="mb-1 w-5 h-5 cursor-pointer"
                      />
                      <span className="text-sm font-medium">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {errors[question.id] && (
              <p className="mt-2 text-sm text-red-600">{errors[question.id]}</p>
            )}
          </div>
        );

      case 'multiple-choice':
        return (
          <div key={question.id} className="mb-8">
            <label className="block text-gray-800 font-medium mb-3">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={responses[question.id] === option}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    className="mr-3 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            
            {errors[question.id] && (
              <p className="mt-2 text-sm text-red-600">{errors[question.id]}</p>
            )}
          </div>
        );

      case 'text':
        return (
          <div key={question.id} className="mb-8">
            <label className="block text-gray-800 font-medium mb-3">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            
            {errors[question.id] && (
              <p className="mt-2 text-sm text-red-600">{errors[question.id]}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Survey Questions</h2>
      
      {questions.map(renderQuestion)}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
