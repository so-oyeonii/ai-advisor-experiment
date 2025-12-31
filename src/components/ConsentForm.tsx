// ConsentForm component
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function ConsentForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) {
      router.push('/stimulus/0');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Informed Consent</h1>
      
      <div className="prose max-w-none mb-6">
        <h2 className="text-xl font-semibold mb-4">Study Information</h2>
        
        <p className="mb-4">
          You are invited to participate in a research study examining consumer trust in product recommendations.
          This study is being conducted to understand how different types of advisors influence purchasing decisions.
        </p>

        <h3 className="text-lg font-semibold mb-2">What will I be asked to do?</h3>
        <p className="mb-4">
          If you agree to participate, you will:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>View product information and recommendations from advisors</li>
          <li>Answer questions about your opinions and intentions</li>
          <li>Provide basic demographic information</li>
          <li>The study will take approximately 10-15 minutes to complete</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">What are the risks?</h3>
        <p className="mb-4">
          There are no anticipated risks beyond those encountered in everyday life.
        </p>

        <h3 className="text-lg font-semibold mb-2">What are the benefits?</h3>
        <p className="mb-4">
          While there may be no direct benefits to you, your participation will contribute to understanding
          how consumers perceive and trust different types of product recommendations.
        </p>

        <h3 className="text-lg font-semibold mb-2">Is my participation voluntary?</h3>
        <p className="mb-4">
          Yes. Your participation is completely voluntary. You may withdraw at any time without penalty.
        </p>

        <h3 className="text-lg font-semibold mb-2">How will my data be used?</h3>
        <p className="mb-4">
          Your responses will be kept confidential and anonymous. Data will be stored securely and used
          only for research purposes. No personally identifiable information will be collected.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 mr-3 h-5 w-5"
            />
            <span className="text-sm">
              I have read and understood the information above. I agree to participate in this research study.
              I understand that my participation is voluntary and that I may withdraw at any time.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!agreed}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            agreed
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Study
        </button>
      </form>
    </div>
  );
}
