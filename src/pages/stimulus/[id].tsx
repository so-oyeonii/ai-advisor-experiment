// Stimulus page - displays product with advisor recommendation
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AmazonStimulus from '@/components/AmazonStimulus';
import { useParticipantSession } from '@/hooks/useParticipantSession';
import { useDwellTime } from '@/hooks/useDwellTime';
import { getProductById, getStimulusById } from '@/lib/stimuliData';

export default function StimulusPage() {
  const router = useRouter();
  const { id } = router.query;
  const { session, loading: sessionLoading } = useParticipantSession();
  const { dwellTime, getFinalDwellTime } = useDwellTime();
  const [canProceed, setCanProceed] = useState(false);

  // Allow proceeding after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanProceed(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (sessionLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  const stimulusIndex = parseInt(id as string);
  const stimulusId = session.condition.stimulusOrder[stimulusIndex];
  const stimulus = getStimulusById(stimulusId);

  if (!stimulus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stimulus not found</h1>
        </div>
      </div>
    );
  }

  const product = getProductById(stimulus.productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    const finalDwellTime = getFinalDwellTime();
    // Store dwell time in session storage for survey page
    sessionStorage.setItem(`dwellTime_${stimulusId}`, finalDwellTime.toString());
    router.push(`/survey/${id}`);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Product {stimulusIndex + 1} of {session.condition.stimulusOrder.length}
          </p>
        </div>

        <AmazonStimulus product={product} stimulus={stimulus} />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Time on page: {dwellTime} seconds
            {!canProceed && ' (minimum 5 seconds)'}
          </p>
          
          <button
            onClick={handleContinue}
            disabled={!canProceed}
            className={`py-3 px-8 rounded-lg font-semibold text-white transition-colors ${
              canProceed
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Survey
          </button>
        </div>
      </div>
    </div>
  );
}
