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

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* Scenario Card */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-4 border border-gray-200">

          {/* 1. Shopping Situation - 상단 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
            <div className="flex items-start space-x-3">
              <ShoppingCart className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Shopping Situation
                </h2>
                <p className="text-gray-800 leading-relaxed">
                  You are looking to purchase <span className="font-bold text-blue-700">Protein Powder, Hand Soap, and Tissue</span> on Amazon.
                  These are items you <span className="font-bold">routinely purchase</span>, and you have run out of all three at home.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Expert Review Service - NEW 배지 + 설명 + Expert Types 통합 */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-xl border-2 border-purple-300 p-4 mb-4">
            {/* 헤더: NEW 배지 + 타이틀 */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                NEW
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Amazon&apos;s Expert Review Service
              </h2>
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>

            <p className="text-center text-gray-700 mb-4">
              Amazon is offering a new service featuring <span className="font-bold text-purple-700">Expert Reviews</span> on products.
            </p>

            {/* Read Carefully 강조 */}
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-2 mb-4">
              <p className="text-center font-bold text-gray-900">
                ⭐ Please Read Carefully: Types of Expert Reviews ⭐
              </p>
            </div>

            {/* Expert Types - 2열 */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Human Expert */}
              <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-300">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Human Expert</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Human experts with <span className="font-semibold text-blue-700">specialized knowledge</span> in the field thoroughly analyze products and write detailed reviews.
                </p>
              </div>

              {/* AI Expert */}
              <div className="bg-white p-4 rounded-lg shadow-md border-2 border-purple-300">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Bot className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">AI Expert</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Amazon&apos;s <span className="font-semibold text-purple-700">AI technology</span> analyzes vast amounts of data to provide objective and detailed reviews.
                </p>
              </div>
            </div>

            {/* Explore 안내 */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <p className="text-gray-900 font-semibold">
                Feel free to explore this new Expert Review feature!
              </p>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
          </div>

          {/* 3. Before You Begin - 휴식 안내 */}
          <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300">
            <p className="text-center text-gray-700 text-sm mb-1">
              📋 This is a moment to take a short break before entering the shopping page.
            </p>
            <p className="text-center text-gray-900 font-semibold text-sm">
              Once you click &quot;Start Shopping&quot;, please stay focused and continue without interruption.
            </p>
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
