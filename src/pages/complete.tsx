import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CompletePage() {
  const [canClose, setCanClose] = useState(false);
  
  useEffect(() => {
    // Check if window was opened by script (can be closed)
    setCanClose(window.opener !== null);
  }, []);
  
  const handleClose = () => {
    // Try to close window
    window.close();
    
    // If still open after 100ms, show message
    setTimeout(() => {
      if (!window.closed) {
        alert('Please close this browser tab manually (Ctrl+W or Cmd+W)');
      }
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-lg text-gray-600">
            You have successfully completed the study.
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 mb-6 text-left">
          <h2 className="text-lg font-semibold text-yellow-900 mb-3">Debriefing</h2>
          <p className="text-yellow-800 mb-3">
            Please note that all product information, reviews, and advisor 
            attributions shown in this study were <strong>fabricated for 
            research purposes</strong>. No actual products were endorsed.
          </p>
          <p className="text-yellow-800">
            The purpose of this study was to understand how consumers process 
            product information from different sources in online shopping contexts.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">Confidentiality</h3>
          <p className="text-blue-800 text-sm">
            Your data will be kept strictly confidential and used solely for 
            academic research purposes. No personally identifiable information 
            was collected.
          </p>
        </div>
        
        <div className="text-sm text-gray-600 mb-6">
          Questions about this study? Contact: <br />
          <a href="mailto:researcher@university.edu" className="text-blue-600 hover:underline">
            researcher@university.edu
          </a>
        </div>
        
        <button 
          onClick={handleClose}
          className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition font-semibold"
        >
          Close Window
        </button>
        
        {!canClose && (
          <p className="mt-4 text-sm text-gray-500">
            If the window doesn't close automatically, please close this tab manually.
          </p>
        )}
      </div>
    </div>
  );
}
