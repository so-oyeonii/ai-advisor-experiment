// Landing Page - Consumer Product Review Study
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleStartStudy = () => {
    router.push('/consent');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Consumer Product Review Study
        </h1>
        
        <p className="text-gray-700 mb-6">
          Help us understand how people evaluate online product information.
          You will view product pages and answer questions about your impressions.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">Study Details:</h2>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Duration: Approximately 10 minutes</li>
            <li>Compensation: [Amount will be specified]</li>
            <li>All information confidential</li>
          </ul>
        </div>
        
        <button 
          onClick={handleStartStudy}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold"
        >
          Start Study
        </button>
      </div>
    </div>
  );
}
