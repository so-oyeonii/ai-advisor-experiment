// Demographics page
import { useRouter } from 'next/router';
import SurveyBlock from '@/components/SurveyBlock';
import { useParticipantSession } from '@/hooks/useParticipantSession';
import { getDemographicsQuestions } from '@/lib/surveyQuestions';

export default function DemographicsPage() {
  const router = useRouter();
  const { session, loading, updateSession, completeSession } = useParticipantSession();

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  const questions = getDemographicsQuestions();

  const handleSubmit = async (responses: Record<string, string | number>) => {
    // Save demographics
    const updatedResponses = {
      ...session.responses,
      demographics: responses,
    };

    await updateSession({ responses: updatedResponses });
    await completeSession();

    router.push('/complete');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Background Information</h1>
          <p className="text-gray-600">
            Finally, please tell us a bit about yourself.
          </p>
        </div>

        <SurveyBlock 
          questions={questions} 
          onSubmit={handleSubmit}
          submitLabel="Complete Study"
        />
      </div>
    </div>
  );
}
