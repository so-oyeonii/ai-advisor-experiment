import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import LikertScale from '@/components/LikertScale';
import { saveDemographics, updateSession } from '@/lib/firebase';

export default function DemographicsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string | number>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const participantId = sessionStorage.getItem('participantId')!;
    
    // Save demographics
    await saveDemographics({
      participantId,
      age: formData.age as string || '',
      gender: formData.gender as string || '',
      education: formData.education as string || '',
      online_shopping_frequency: formData.online_shopping_frequency as string || '',
    });
    
    // Mark session complete with end time
    await updateSession(participantId, {
      completed: true,
      endTime: new Date() as any // Will be converted to Timestamp
    });
    
    router.push('/complete');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Final Questions</h1>
        <p className="text-gray-600 mb-8">
          Please answer a few questions about yourself for statistical purposes.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* AI Familiarity */}
          <section className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">AI Experience</h2>
            {[
              'I am familiar with how conversational AI systems (e.g., chatbots, voice assistants) work',
              'I regularly use AI-based conversational agents such as ChatGPT, Siri, or Alexa',
              'I have a clear understanding of the capabilities and limitations of conversational AI'
            ].map((item, i) => (
              <LikertScale key={i} name={`ai_familiarity_${i+1}`} question={item} onChange={handleChange} />
            ))}
          </section>
          
          {/* Review Skepticism */}
          <section className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Online Reviews</h2>
            {[
              'Online reviews are generally not truthful',
              'Those writing reviews are not necessarily real customers',
              'Online reviews are often inaccurate',
              'The same person often posts reviews under different names'
            ].map((item, i) => (
              <LikertScale key={i} name={`review_skepticism_${i+1}`} question={item} onChange={handleChange} />
            ))}
          </section>
          
          {/* Attitude toward AI */}
          <section className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">AI in Shopping</h2>
            {[
              'AI enhances my shopping experience',
              "I'm comfortable interacting with AI during shopping",
              'I trust AI-driven product suggestions',
              'AI accurately provides product recommendations'
            ].map((item, i) => (
              <LikertScale key={i} name={`attitude_ai_${i+1}`} question={item} onChange={handleChange} />
            ))}
          </section>
          
          {/* Behavioral Measures */}
          <section className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Shopping Habits</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Online shopping frequency:
              </label>
              <select name="shopping_frequency" onChange={handleChange} required className="w-full p-2 border rounded-md">
                <option value="">Select...</option>
                <option value="less_than_weekly">Less than once a week</option>
                <option value="1-2_weekly">1-2 times a week</option>
                <option value="3-4_weekly">3-4 times a week</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Generative AI usage (e.g., ChatGPT):
              </label>
              <select name="ai_usage_frequency" onChange={handleChange} required className="w-full p-2 border rounded-md">
                <option value="">Select...</option>
                <option value="never">Never</option>
                <option value="less_than_monthly">Less than once a month</option>
                <option value="weekly">Once a week</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </section>
          
          {/* Demographics */}
          <section>
            <h2 className="text-lg font-semibold mb-4">About You</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Gender:</label>
                <select name="gender" onChange={handleChange} required className="w-full p-2 border rounded-md">
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Age:</label>
                <input 
                  type="number" 
                  name="age" 
                  min="18" 
                  max="100"
                  onChange={handleChange}
                  required 
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nationality:</label>
                <input 
                  type="text" 
                  name="nationality" 
                  onChange={handleChange}
                  required 
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Education:</label>
                <select name="education" onChange={handleChange} required className="w-full p-2 border rounded-md">
                  <option value="">Select...</option>
                  <option value="high_school">High school or below</option>
                  <option value="some_college">Some college</option>
                  <option value="bachelors">Bachelor's degree</option>
                  <option value="masters">Master's degree</option>
                  <option value="doctorate">Doctorate</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Annual Income (USD):</label>
                <select name="income" onChange={handleChange} required className="w-full p-2 border rounded-md">
                  <option value="">Select...</option>
                  <option value="under_10k">Less than $10,000</option>
                  <option value="10-20k">$10,000 - $19,999</option>
                  <option value="20-30k">$20,000 - $29,999</option>
                  <option value="30-50k">$30,000 - $49,999</option>
                  <option value="50-75k">$50,000 - $74,999</option>
                  <option value="75-100k">$75,000 - $99,999</option>
                  <option value="over_100k">$100,000 or more</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </section>
          
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
          >
            Complete Study
          </button>
        </form>
      </div>
    </div>
  );
}
