import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import LikertScale from '@/components/LikertScale';
import SemanticDifferential from '@/components/SemanticDifferential';
import { saveSurveyResponse } from '@/lib/firebase';

export default function SurveyPage() {
  const router = useRouter();
  const { id } = router.query;
  const stimulusId = Number(id);

  const [formData, setFormData] = useState<Record<string, string | number>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const participantId = sessionStorage.getItem('participantId')!;
    const conditions = JSON.parse(sessionStorage.getItem('conditions') || '[]');
    const condition = conditions[stimulusId];
    
    // Save survey response
    await saveSurveyResponse({
      participantId,
      stimulusId: String(stimulusId),
      productId: condition.product,
      advisorType: condition.advisorType,
      congruity: condition.congruity,
      responseData: formData,
      responseId: `${participantId}_${stimulusId}`
    });
    
    // Navigate
    if (stimulusId < 2) {
      // More stimuli remaining
      const nextStimulus = stimulusId + 1;
      sessionStorage.setItem('currentStimulus', String(nextStimulus));
      router.push(`/stimulus/${nextStimulus}`);
    } else {
      // All 3 completed
      router.push('/demographics');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Stimulus {stimulusId + 1} of 3
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((stimulusId + 1) / 3) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{width: `${((stimulusId + 1) / 3) * 100}%`}}
            />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Product Evaluation Survey</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: Manipulation Checks */}
          <section className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">About the Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Who provided the information you just read?
                </label>
                <div className="space-y-2">
                  {['An Artificial Intelligence (AI) System', 'A Human Expert', 'I am not sure'].map(option => (
                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="mc_advisorType"
                        value={option}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                        required
                      />
                      <span className="text-gray-800">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  How did the information compare to your expectations?
                </label>
                <div className="space-y-2">
                  {['It matched my thoughts', 'It did not match my thoughts'].map(option => (
                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="mc_congruity"
                        value={option}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                        required
                      />
                      <span className="text-gray-800">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* SECTION 2: Argument Quality */}
          <section className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Information Quality</h2>
            <p className="text-sm text-gray-600 mb-4">
              Rate your agreement with the following statements (1 = Strongly Disagree, 7 = Strongly Agree)
            </p>
            
            {[
              'The information shared is accurate',
              'The information shared ensures appropriateness',
              'The information shared is highly detailed and comprehensive',
              'The information shared is always updated in a timely manner'
            ].map((item, index) => (
              <LikertScale 
                key={index}
                name={`argQuality_${index + 1}`}
                question={item}
                onChange={handleChange}
              />
            ))}
          </section>
          
          {/* SECTION 3: Source Credibility */}
          <section className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Source Evaluation</h2>
            <p className="text-sm text-gray-600 mb-4">
              How would you describe the source that provided the information?
            </p>
            
            {[
              ['Undependable', 'Dependable'],
              ['Dishonest', 'Honest'],
              ['Unreliable', 'Reliable'],
              ['Insincere', 'Sincere'],
              ['Untrustworthy', 'Trustworthy']
            ].map((pair, index) => (
              <SemanticDifferential
                key={index}
                name={`credibility_${index + 1}`}
                leftLabel={pair[0]}
                rightLabel={pair[1]}
                onChange={handleChange}
              />
            ))}
          </section>
          
          {/* SECTION 4: Perceived Persuasive Intent */}
          <section className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Reviewer Intentions</h2>
            <p className="text-sm text-gray-600 mb-4">
              Rate your agreement (1 = Strongly Disagree, 7 = Strongly Agree)
            </p>
            
            {[
              'The online reviewers cared mostly about getting me to buy the brand',
              'Most of the online reviews were intended to mislead',
              'The people writing the online reviews were up to something',
              'The reviewer has an ulterior motive',
              "The reviewer's statements are suspicious",
              'The reviewer is motivated to exaggerate the performance of this product'
            ].map((item, index) => (
              <LikertScale 
                key={index}
                name={`ppi_${index + 1}`}
                question={item}
                onChange={handleChange}
              />
            ))}
          </section>
          
          {/* SECTION 5: Perceived Persuasiveness */}
          <section className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Overall Impression</h2>
            <p className="text-sm text-gray-600 mb-4">
              Rate your agreement (1 = Strongly Disagree, 7 = Strongly Agree)
            </p>
            
            {[
              'These reviews are convincing for me to trust the product',
              'These reviews are important when I purchase the product',
              'This message will cause changes in my behavior',
              'After viewing this message, I will make changes in my attitude'
            ].map((item, index) => (
              <LikertScale 
                key={index}
                name={`persuasiveness_${index + 1}`}
                question={item}
                onChange={handleChange}
              />
            ))}
          </section>
          
          {/* SECTION 6: Decision Confidence */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Purchase Confidence</h2>
            <LikertScale 
              name="confidence"
              question="Indicate your level of confidence in buying the product after reading the online reviews"
              leftLabel="Not at all confident"
              rightLabel="Very confident"
              onChange={handleChange}
            />
          </section>
          
          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
          >
            {stimulusId < 2 ? 'Continue to Next Product' : 'Continue to Final Questions'}
          </button>
        </form>
      </div>
    </div>
  );
}
