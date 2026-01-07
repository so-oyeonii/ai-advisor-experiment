// Scenario introduction page - Set context for the experiment
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ShoppingCart, Sparkles, Star, User, Bot } from 'lucide-react';

export default function ScenarioPage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState<string>('');

  useEffect(() => {
    // Check if participant has consented
    const storedParticipantId = sessionStorage.getItem('participantId');
    const hasConsented = sessionStorage.getItem('hasConsented');
    
    if (!storedParticipantId || hasConsented !== 'true') {
      router.push('/consent');
      return;
    }
    
    setParticipantId(storedParticipantId);
  }, [router]);

  const handleContinue = () => {
    // Mark scenario as viewed
    sessionStorage.setItem('scenarioViewed', 'true');
    
    // Proceed to first stimulus
    router.push('/stimulus/0');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Amazon-style header */}
      <header className="bg-[#131921] text-white py-3 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8" />
            <span className="text-2xl font-bold">Amazon</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="opacity-80">Welcome, Participant</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* New Feature Badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-2 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-lg">NEW FEATURE</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Scenario Card */}
        <div className="bg-white rounded-xl shadow-xl p-10 mb-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Shopping Scenario
          </h1>

          {/* Shopping Context */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <div className="flex items-start space-x-4">
              <ShoppingCart className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Shopping Situation
                </h2>
                <p className="text-gray-800 leading-relaxed text-lg mb-4">
                  You are currently looking to purchase <span className="font-bold text-blue-700">Protein Powder, Hand Soap, and Tissue</span> on Amazon.
                </p>
                <p className="text-gray-800 leading-relaxed text-lg">
                  These three products are items you <span className="font-bold">routinely purchase</span>, and you happen to have run out of all three at home, so you want to buy all three items.
                </p>
              </div>
            </div>
          </div>

          {/* New Service Introduction */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  NEW
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Amazon's New Expert Review Service
                </h2>
              </div>
              
              <p className="text-gray-800 leading-relaxed text-lg mb-6">
                Amazon is offering a new service featuring <span className="font-bold text-purple-700">Expert Reviews</span> on products.
              </p>

              {/* Expert Types */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Human Expert */}
                <div className="bg-white p-5 rounded-lg shadow-sm border-2 border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Human Expert</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Human experts with specialized knowledge in the field thoroughly analyze products and write detailed reviews.
                  </p>
                </div>

                {/* AI Expert */}
                <div className="bg-white p-5 rounded-lg shadow-sm border-2 border-purple-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Bot className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">AI Expert</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Amazon's AI technology analyzes vast amounts of data to provide objective and detailed reviews.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-white p-5 rounded-lg border-2 border-yellow-300">
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  <p className="text-gray-900 font-semibold text-lg">
                    Feel free to explore this new Expert Review feature!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-300">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">📋 Study Instructions</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Please take your time reviewing each product detail page.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Check both expert reviews and regular customer reviews.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Participate naturally as if you were actually shopping.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>After viewing the products, you will answer some simple questions.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Start Shopping →
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-8">
          This study takes approximately 10-15 minutes to complete.
        </p>
      </main>
    </div>
  );
}
