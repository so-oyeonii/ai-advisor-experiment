// Scenario introduction page - Set context for the experiment
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ShoppingCart, Sparkles, Star, User, Bot } from 'lucide-react';

export default function ScenarioPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if participant has consented
    const storedParticipantId = sessionStorage.getItem('participantId');
    const hasConsented = sessionStorage.getItem('hasConsented');

    if (!storedParticipantId || hasConsented !== 'true') {
      router.push('/consent');
      return;
    }
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
      <header className="bg-[#131921] text-white py-2 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xl font-bold">Amazon</span>
          </div>
          <span className="text-sm opacity-80">Welcome, Participant</span>
        </div>
      </header>

      {/* Main content - 컴팩트한 레이아웃 */}
      <main className="max-w-6xl mx-auto px-4 py-4">
        {/* Header with Badge */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1.5 rounded-full shadow">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold">NEW FEATURE</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Scenario Card */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-4 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Shopping Scenario
          </h1>

          {/* 2열 레이아웃: Shopping Context + New Service */}
          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            {/* Shopping Context */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <ShoppingCart className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Shopping Situation
                  </h2>
                  <p className="text-gray-800 leading-relaxed mb-2">
                    You are looking to purchase <span className="font-bold text-blue-700">Protein Powder, Hand Soap, and Tissue</span> on Amazon.
                  </p>
                  <p className="text-gray-800 leading-relaxed">
                    These are items you <span className="font-bold">routinely purchase</span>, and you have run out of all three at home.
                  </p>
                </div>
              </div>
            </div>

            {/* New Service Introduction */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-0.5 rounded-full text-xs font-bold">
                  NEW
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Expert Review Service
                </h2>
              </div>
              <p className="text-gray-800 leading-relaxed mb-3">
                Amazon offers <span className="font-bold text-purple-700">Expert Reviews</span> on products.
              </p>

              {/* Expert Types - 컴팩트 버전 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-gray-900">Human Expert</span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Specialized experts analyze and review products.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-gray-900">AI Expert</span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    AI analyzes data for objective reviews.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action + Instructions - 한 줄로 */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border-2 border-yellow-300 flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              <p className="text-gray-900 font-semibold">
                Feel free to explore this new Expert Review feature!
              </p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300">
              <p className="text-gray-700 text-sm mb-1">
                📋 This is a moment to take a short break before shopping.
              </p>
              <p className="text-gray-900 font-semibold text-sm">
                Once you click &quot;Start Shopping&quot;, please stay focused.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-10 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Start Shopping →
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-3">
          This study takes approximately 10-15 minutes to complete.
        </p>
      </main>
    </div>
  );
}
