import { useRouter } from 'next/router';
import { useSurvey } from '@/contexts/SurveyContext';
import Demographics_Form from '@/components/survey/Demographics';
import type { DemographicsResponse } from '@/types/survey';

export default function DemographicsPage() {
  const router = useRouter();
  const { saveDemographics, submitAllResponses, isSubmitting, submitError } = useSurvey();

  const handleComplete = async (data: DemographicsResponse) => {
    try {
      console.log('Demographics data received:', data);
      
      // Save demographics to context for persistence
      saveDemographics(data);
      
      // Submit all responses to Firebase with demographics data directly
      await submitAllResponses(data);
      
      // Navigate to completion page
      router.push('/complete');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-6">
          <h1 className="text-lg font-semibold text-gray-900">
            Final Step: Demographics
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Please answer the following questions about yourself
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {submitError && (
          <div className="max-w-4xl mx-auto px-6 mb-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-800 font-medium">Error: {submitError}</p>
            </div>
          </div>
        )}
        
        {isSubmitting ? (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-700">Submitting your responses...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait, do not close this page.</p>
            </div>
          </div>
        ) : (
          <Demographics_Form onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}
