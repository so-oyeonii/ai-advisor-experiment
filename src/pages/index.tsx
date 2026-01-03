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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Consumer Product Review Study
        </h1>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          This study aims to understand how product information is perceived and interpreted in online shopping experiences.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-6 mb-6">
          <h2 className="font-semibold text-blue-900 mb-4 text-lg">Study Information:</h2>
          <ul className="text-blue-800 space-y-3">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span><strong>Duration:</strong> 15–20 minutes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span><strong>Compensation:</strong> $1.50 upon completion</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span><strong>Data:</strong> Collected anonymously (No PII), securely encrypted</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span><strong>Rights:</strong> Participation is voluntary, and you may withdraw anytime without penalty</span>
            </li>
          </ul>
        </div>
        
        <button 
          onClick={handleStartStudy}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold text-lg"
        >
          Start Study
        </button>
      </div>
    </div>
  );
}
