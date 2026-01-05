import { useState, FormEvent } from 'react';
import { Demographics as config } from '@/config/surveyQuestions';
import { DemographicsResponse, Gender, Education, Income, Occupation } from '@/types/survey';

interface DemographicsProps {
  onComplete: (responses: DemographicsResponse) => void;
}

export default function Demographics_Form({ onComplete }: DemographicsProps) {
  const [responses, setResponses] = useState<Partial<DemographicsResponse>>({
    gender_other: '',
    occupation_other: ''
  });

  const handleChange = (variable: string, value: string | number) => {
    setResponses(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const isValid = 
      responses.gender !== undefined &&
      responses.age !== undefined &&
      responses.education !== undefined &&
      responses.income !== undefined &&
      responses.occupation !== undefined;

    if (isValid) {
      // Clean up optional fields if not needed
      const finalResponses = { ...responses } as DemographicsResponse;
      if (finalResponses.gender !== 'other') {
        delete finalResponses.gender_other;
      }
      if (finalResponses.occupation !== 'other') {
        delete finalResponses.occupation_other;
      }
      
      onComplete(finalResponses);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">{config.title}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Gender */}
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-800">1. What is your gender?</p>
            <div className="space-y-2 pl-4">
              {config.items[0].options?.map((option) => (
                <label 
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    onChange={(e) => handleChange('gender', e.target.value as Gender)}
                    className="h-4 w-4 text-blue-600"
                    required
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            
            {responses.gender === 'other' && (
              <div className="pl-4 mt-2">
                <input
                  type="text"
                  name="gender_other"
                  value={responses.gender_other || ''}
                  onChange={(e) => handleChange('gender_other', e.target.value)}
                  placeholder="Please specify"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={responses.gender === 'other'}
                />
              </div>
            )}
          </div>

          {/* Age */}
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-800">2. What is your age? (in full years)</p>
            <div className="pl-4">
              <input
                type="number"
                name="age"
                min="18"
                max="120"
                value={responses.age || ''}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-800">3. What is your highest level of education completed?</p>
            <div className="space-y-2 pl-4">
              {config.items[3].options?.map((option) => (
                <label 
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  <input
                    type="radio"
                    name="education"
                    value={option.value}
                    onChange={(e) => handleChange('education', e.target.value as Education)}
                    className="h-4 w-4 text-blue-600"
                    required
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Income */}
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-800">4. What is your individual annual income?</p>
            <div className="space-y-2 pl-4">
              {config.items[4].options?.map((option) => (
                <label 
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  <input
                    type="radio"
                    name="income"
                    value={option.value}
                    onChange={(e) => handleChange('income', e.target.value as Income)}
                    className="h-4 w-4 text-blue-600"
                    required
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Occupation */}
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-800">5. What is your current occupation?</p>
            <div className="space-y-2 pl-4">
              {config.items[5].options?.map((option) => (
                <label 
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  <input
                    type="radio"
                    name="occupation"
                    value={option.value}
                    onChange={(e) => handleChange('occupation', e.target.value as Occupation)}
                    className="h-4 w-4 text-blue-600"
                    required
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            
            {responses.occupation === 'other' && (
              <div className="pl-4 mt-2">
                <input
                  type="text"
                  name="occupation_other"
                  value={responses.occupation_other || ''}
                  onChange={(e) => handleChange('occupation_other', e.target.value)}
                  placeholder="Please specify"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={responses.occupation === 'other'}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Complete Survey
          </button>
        </div>
      </form>
    </div>
  );
}
