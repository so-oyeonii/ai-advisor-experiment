// Completion page
import { CheckCircle } from 'lucide-react';

export default function CompletePage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          
          <p className="text-lg text-gray-700 mb-6">
            You have successfully completed the study. Your responses have been recorded.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">Study Information</h2>
            <p className="text-gray-700 text-left">
              This study examined how consumers perceive and trust product recommendations from 
              different types of advisors. Your participation helps us understand the factors that 
              influence consumer decision-making in online shopping contexts.
            </p>
          </div>

          <p className="text-gray-600">
            If you have any questions about this study, please contact the research team.
          </p>
        </div>
      </div>
    </div>
  );
}
