// Stimulus page - Amazon-style product page with manipulated reviews
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { Star, Search, ShoppingCart, Bot, User } from 'lucide-react';
import { getStimulusData, StimulusData } from '@/lib/stimuliData';
import { saveStimulusExposure, getKSTTimestamp } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';
import type { Condition } from '@/lib/stimuliData';

export default function StimulusPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [stimulusData, setStimulusData] = useState<StimulusData | null>(null);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [participantId, setParticipantId] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showExpertPopup, setShowExpertPopup] = useState<boolean>(true);
  
  // Dwell time tracking - start immediately on mount
  const dwellStartTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!router.isReady) return;

    try {
      const stimulusIndex = parseInt(id as string);
      setCurrentIndex(stimulusIndex);
      
      // Get session data from sessionStorage
      const storedParticipantId = sessionStorage.getItem('participantId');
      const storedCondition = sessionStorage.getItem('experimentCondition');
      
      if (!storedParticipantId || !storedCondition) {
        router.push('/consent');
        return;
      }
      
      setParticipantId(storedParticipantId);
      const experimentCondition = JSON.parse(storedCondition);
      
      // Get the stimulus for this index
      const currentStimulus = experimentCondition.selectedStimuli[stimulusIndex];
      
      const conditionData: Condition = {
        product: currentStimulus.product,
        advisorType: currentStimulus.condition.advisorType,
        advisorValence: currentStimulus.condition.advisorValence,
        publicValence: currentStimulus.condition.publicValence,
        congruity: currentStimulus.condition.congruity
      };
      
      setCondition(conditionData);
      
      // Store full condition info for later use
      sessionStorage.setItem(`condition_${stimulusIndex}`, JSON.stringify(currentStimulus.condition));
      
      // Get stimulus data
      const data = getStimulusData(conditionData);
      setStimulusData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading stimulus:', error);
      router.push('/consent');
    }
  }, [router.isReady, id, router]);

  const handleContinue = async () => {
    console.log('🔘 Continue button clicked');
    console.log('  - participantId:', participantId);
    console.log('  - condition:', condition);
    console.log('  - stimulusData:', stimulusData ? 'exists' : 'missing');
    
    if (!participantId || !condition || !stimulusData) {
      console.error('❌ Missing required data for continue');
      return;
    }
    
    try {
      // Calculate dwell time in seconds
      const dwellTime = (Date.now() - dwellStartTime.current) / 1000;
      console.log('  - dwellTime:', dwellTime, 'seconds');
      
      // Get full condition info
      const storedFullCondition = sessionStorage.getItem(`condition_${currentIndex}`);
      const fullCondition = storedFullCondition ? JSON.parse(storedFullCondition) : null;
      console.log('  - fullCondition:', fullCondition);
      
      // Save stimulus exposure to Firebase
      console.log('💾 Saving stimulus exposure to Firebase...');
      
      const exposureData = {
        exposureId: `${participantId}_${condition.product}_${currentIndex}`,
        participantId,
        stimulusId: `${condition.product}_${condition.advisorType}_${condition.congruity}`,
        productId: stimulusData.product.id,
        productName: stimulusData.product.name,
        groupId: fullCondition?.groupId || 0,
        conditionId: fullCondition?.conditionId || 0,
        advisorType: condition.advisorType,
        congruity: condition.congruity,
        advisorValence: condition.advisorValence,
        publicValence: condition.publicValence,
        advisorName: condition.advisorType === 'AI' ? 'AI-Generated Review' : 'Expert Review',
        recommendation: condition.advisorValence,
        reasoning: stimulusData.advisorReview.substring(0, 1000), // Limit length
        exposureOrder: currentIndex,
        dwellTime,
        exposureStartTime: Timestamp.fromMillis(dwellStartTime.current),
        exposureEndTime: getKSTTimestamp(),
      };
      
      console.log('💾 Exposure data prepared, saving...');
      await saveStimulusExposure(exposureData);
      
      // Store dwell time in sessionStorage for reference
      sessionStorage.setItem(`dwellTime_${currentIndex}`, dwellTime.toString());
      
      console.log('✅ Stimulus exposure saved successfully');
      console.log('🔄 Navigating to survey page...');
      
      // Navigate to survey (not recall anymore)
      router.push(`/survey/${id}`);
    } catch (error) {
      console.error('❌ Error saving stimulus exposure:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      alert('Failed to save data. Please try again.');
    }
  };

  if (isLoading || !stimulusData || !condition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading product...</h1>
        </div>
      </div>
    );
  }

  const { product, advisorReview, publicReviews } = stimulusData;

  return (
    <div className="min-h-screen bg-white">
      {/* Expert Introduction Popup */}
      {showExpertPopup && condition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative animate-fadeIn">
            <button
              onClick={() => setShowExpertPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {condition.advisorType === 'AI' ? (
                  <div className="bg-purple-100 p-4 rounded-full">
                    <Bot className="w-12 h-12 text-purple-600" />
                  </div>
                ) : (
                  <div className="bg-blue-100 p-4 rounded-full">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {condition.advisorType === 'AI' ? "AI Expert's Review" : "Expert's Review"}
              </h2>
              <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                NEW FEATURE
              </div>
            </div>

            {condition.advisorType === 'AI' ? (
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  This product&apos;s expert review has been generated by <span className="font-bold text-purple-700">Amazon&apos;s AI Expert System</span>.
                </p>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">How AI Expert Reviews Work:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">🤖</span>
                      <span><strong>Advanced AI Analysis:</strong> Utilizes sophisticated machine learning algorithms trained on millions of product reviews and technical specifications.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">📊</span>
                      <span><strong>Data-Driven Insights:</strong> Analyzes vast amounts of consumer feedback, scientific research, and product testing data to provide comprehensive evaluations.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">⚡</span>
                      <span><strong>Real-Time Updates:</strong> Continuously learns from new data to provide the most up-to-date product insights.</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600 italic">
                  AI Expert Reviews combine cutting-edge technology with comprehensive data analysis to help you make informed purchasing decisions.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  This product review has been written by a <span className="font-bold text-blue-700">certified Human Expert</span> with specialized knowledge in this product category.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">What Makes Our Human Experts Qualified:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">👨‍🔬</span>
                      <span><strong>Professional Credentials:</strong> A human professional who holds relevant certifications and degrees in fields related to the product category (e.g., nutrition, chemistry, consumer sciences).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">📚</span>
                      <span><strong>Industry Experience:</strong> Years of specialized knowledge and expertise in evaluating similar products and understanding consumer needs.</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600 italic">
                  Human Expert Reviews bring professional expertise and nuanced understanding to help you evaluate product quality and suitability.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowExpertPopup(false)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Continue to Product Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amazon Header */}
      <header className="bg-[#232F3E] text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">amazon</div>
            <div className="hidden md:flex items-center bg-white rounded-md overflow-hidden">
              <input 
                type="text" 
                placeholder="Search Amazon"
                className="px-4 py-2 w-80 lg:w-96 text-gray-900 outline-none text-sm"
                disabled
              />
              <button className="bg-[#FF9900] px-4 py-2.5">
                <Search size={20} className="text-gray-900" />
              </button>
            </div>
          </div>
          <ShoppingCart size={28} />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-4 py-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Product Image */}
          <div className="md:col-span-1">
            <div className="sticky top-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg border border-gray-300 shadow-sm"
                onError={(e) => {
                  // Fallback to a placeholder if image not found
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EProduct Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>
          
          {/* Right: Product Details */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Product Title */}
            <h1 className="text-2xl font-normal text-gray-900 leading-tight">
              {product.name}
            </h1>
            
            {/* Brand */}
            <div className="text-sm">
              <span className="text-gray-600">Brand: </span>
              <span className="text-blue-600 hover:text-orange-600 cursor-pointer">
                {product.brand}
              </span>
            </div>
            
            {/* Price */}
            <div className="flex items-baseline space-x-2 blur-[20px] select-none">
              <span className="text-3xl text-red-700">{product.price}</span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Advisor Review */}
            <div className="border-t border-gray-300 pt-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start space-x-3">
                  {condition.advisorType === 'AI' ? (
                    <Bot size={24} className="text-blue-600 flex-shrink-0" />
                  ) : (
                    <User size={24} className="text-blue-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {condition.advisorType === 'AI' ? "AI Expert's Review" : "Human Expert's Review"}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3 flex-wrap">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={18} 
                            className={
                              condition.advisorValence === 'positive' 
                                ? 'fill-[#FFA41C] text-[#FFA41C]' 
                                : (i === 0 ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-gray-300')
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {condition.advisorValence === 'positive' ? '5.0 out of 5 stars' : '1.0 out of 5 stars'}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {advisorReview}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customer Reviews */}
            <div className="border-t border-gray-300 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Top reviews from customers</h2>
                <button className="text-sm text-blue-600 hover:text-orange-600 hover:underline">
                  See all 999+ reviews
                </button>
              </div>
              
              {/* Public Reviews - Show all 10 with fade-out effect */}
              <div className="space-y-4 relative">
                {publicReviews.map((review, index) => (
                  <div 
                    key={index} 
                    className={`border-b border-gray-200 pb-4 ${
                      index >= 8 ? 'opacity-60' : index >= 7 ? 'opacity-80' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-gray-600" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900">{review.username}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < review.rating ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{review.rating}.0 out of 5 stars</span>
                      <span className="text-xs text-orange-700 font-semibold">✓ Verified Purchase</span>
                    </div>
                    <p className="text-sm text-gray-700 blur-sm select-none">{review.text}</p>
                  </div>
                ))}
                {/* Gradient overlay to suggest more content below */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              </div>
              
              {/* Scroll hint */}
              <div className="mt-2 text-center text-xs text-gray-500">
                ↓ Scroll to see more reviews
              </div>
            </div>
          </div>
        </div>
        
        {/* Continue Button */}
        <div className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="border-t pt-6">
            <button 
              onClick={handleContinue}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 py-3 rounded-lg text-base font-medium transition border border-[#FCD200] shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
