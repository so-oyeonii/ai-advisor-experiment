// Landing Page - Consumer Product Review Study
import React from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [screeningAnswered, setScreeningAnswered] = React.useState<null | boolean>(null);

  const handleScreening = (answer: boolean) => {
    setScreeningAnswered(answer);
    if (answer) {
      // Yes: proceed to consent page
      setTimeout(() => {
        router.push('/consent');
      }, 800);
    }
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
        {/* Screening Question */}
        {screeningAnswered === null && (
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-800 mb-4">
              This study is for adults who have shopped online at least once.<br />
              Have you ever shopped online?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleScreening(true)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold text-lg"
              >
                Yes
              </button>
              <button
                onClick={() => handleScreening(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-md hover:bg-gray-400 transition font-semibold text-lg"
              >
                No
              </button>
            </div>
          </div>
        )}
        {/* If No, show ineligible message */}
        {screeningAnswered === false && (
          <div className="text-center mt-8">
            <p className="text-red-600 text-lg font-semibold mb-4">Sorry, you are not eligible for this study.</p>
            <p className="text-gray-700">This study is only for adults who have shopped online at least once.</p>
          </div>
        )}
        {/* If Yes, show starting message before routing */}
        {screeningAnswered === true && (
          <div className="text-center mt-8">
            <p className="text-green-700 text-lg font-semibold mb-4">Thank you! Starting the study...</p>
          </div>
        )}
      </div>
    </div>
  );
}
