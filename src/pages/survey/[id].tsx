// Survey page - collects responses for a stimulus
import { useRouter } from 'next/router';
import SurveyBlock from '@/components/SurveyBlock';
import { useParticipantSession } from '@/hooks/useParticipantSession';
import { getSurveyQuestionsForStimulus } from '@/lib/surveyQuestions';

export default function SurveyPage() {
  const router = useRouter();
  const { id } = router.query;
  const { session, loading, saveResponse, nextStimulus } = useParticipantSession();

  if (loading || !session) {
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
  const questions = getSurveyQuestionsForStimulus();

  const handleSubmit = async (responses: Record<string, any>) => {
    // Get dwell time from session storage
    const dwellTime = parseInt(sessionStorage.getItem(`dwellTime_${stimulusId}`) || '0');
    
    // Save response
    await saveResponse(stimulusId, responses, dwellTime);

    // Move to next stimulus or demographics
    if (stimulusIndex < session.condition.stimulusOrder.length - 1) {
      await nextStimulus();
      router.push(`/stimulus/${stimulusIndex + 1}`);
    } else {
      router.push('/demographics');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Survey Questions</h1>
          <p className="text-gray-600">
            Please answer the following questions about the product and recommendation you just viewed.
          </p>
        </div>

        <SurveyBlock questions={questions} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
