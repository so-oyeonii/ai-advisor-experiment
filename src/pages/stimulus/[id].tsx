// Stimulus page - Amazon-style product page with manipulated reviews
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { Star, Search, ShoppingCart, Bot, User } from 'lucide-react';
import { getStimulusData, StimulusData, PublicReview } from '@/lib/stimuliData';
import { saveStimulusExposure } from '@/lib/firebase';
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
    if (!participantId || !condition || !stimulusData) return;
    
    try {
      // Calculate dwell time in seconds
      const dwellTime = (Date.now() - dwellStartTime.current) / 1000;
      
      // Get full condition info
      const storedFullCondition = sessionStorage.getItem(`condition_${currentIndex}`);
      const fullCondition = storedFullCondition ? JSON.parse(storedFullCondition) : null;
      
      // Save stimulus exposure to Firebase
      await saveStimulusExposure({
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
        reasoning: stimulusData.advisorReview,
        exposureOrder: currentIndex + 1,
        dwellTime,
        exposureStartTime: Timestamp.fromMillis(dwellStartTime.current),
        exposureEndTime: Timestamp.now(),
      });
      
      // Store dwell time in sessionStorage for reference
      sessionStorage.setItem(`dwellTime_${currentIndex}`, dwellTime.toString());
      
      // Navigate to recall task
      router.push(`/recall/${id}`);
    } catch (error) {
      console.error('Error saving stimulus exposure:', error);
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

  const { product, advisorReview, publicReviews, displayRating, ratingDistribution, ratingCount } = stimulusData;

  return (
    <div className="min-h-screen bg-white">
      {/* Amazon Header */}
      <header className="bg-[#232F3E] text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
      <main className="max-w-7xl mx-auto px-4 py-6">
        
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
            
            {/* Rating (MANIPULATED) */}
            <div className="flex items-center space-x-2 flex-wrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < Math.floor(displayRating) ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer">
                {displayRating} out of 5
              </span>
              <span className="text-sm text-gray-600">
                ({ratingCount.toLocaleString()} ratings)
              </span>
            </div>
            
            {/* Prime Badge */}
            <div className="flex items-center space-x-2">
              <span className="bg-[#00A8E1] text-white px-2 py-1 text-xs font-bold">prime</span>
              <span className="text-sm text-gray-700">FREE delivery</span>
            </div>
            
            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-sm text-gray-600">$</span>
              <span className="text-3xl text-gray-900">{product.price}</span>
            </div>
            
            <hr className="my-4" />
            
            {/* ADVISOR REVIEW CARD */}
            <div className="border-2 border-gray-300 rounded-lg p-5 bg-gray-50">
              <div className="flex items-center space-x-2 mb-3">
                {condition.advisorType === 'AI' ? (
                  <>
                    <Bot size={24} className="text-blue-600" />
                    <span className="font-semibold text-gray-900">AI-Generated Review</span>
                  </>
                ) : (
                  <>
                    <User size={24} className="text-orange-600" />
                    <span className="font-semibold text-gray-900">Expert Review</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={condition.advisorValence === 'positive' ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-semibold rounded">
                  {condition.advisorType === 'AI' ? 'Algorithm Pick' : "Editor's Choice"}
                </span>
              </div>
              
              <p className="text-gray-800 leading-relaxed text-sm">
                {advisorReview}
              </p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <hr className="my-6" />
            
            {/* CUSTOMER REVIEWS SECTION */}
            <div>
              <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
              
              {/* Rating Summary */}
              <div className="flex flex-col sm:flex-row items-start sm:space-x-8 space-y-4 sm:space-y-0 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">{displayRating}</div>
                  <div className="flex justify-center my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < Math.floor(displayRating) ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-gray-300'} />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{ratingCount.toLocaleString()} ratings</div>
                </div>
                
                {/* Rating Distribution (MANIPULATED) */}
                <div className="flex-1 w-full space-y-1">
                  {ratingDistribution.map((percent: number, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer w-12">
                        {5-index} star
                      </span>
                      <div className="flex-1 bg-gray-300 rounded-full h-4">
                        <div 
                          className="bg-[#FFA41C] h-4 rounded-full transition-all" 
                          style={{width: `${percent}%`}}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <hr className="my-4" />
              
              {/* Individual Reviews (6-7 reviews, MANIPULATED) */}
              <div className="space-y-6">
                {publicReviews.map((review: PublicReview, index: number) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <span className="font-semibold text-gray-900">{review.username}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-gray-300'} />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="text-xs text-orange-700 font-semibold">Verified Purchase</span>
                      )}
                    </div>
                    
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Continue Button - styled like Amazon */}
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
