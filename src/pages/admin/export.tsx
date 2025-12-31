import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import {
  getAllSessions,
  getAllStimulusExposures,
  getAllRecallTasks,
  getAllSurveyResponses,
  getAllDemographics,
  SessionData,
  StimulusExposureData,
  RecallTaskData,
  SurveyResponseData,
  DemographicsData
} from '@/lib/firebase';

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
}

interface MergedData {
  [key: string]: any;
}

export default function AdminExportPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, inProgress: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const sessions = await getAllSessions();
      const total = sessions.length;
      const completed = sessions.filter(s => s.completed).length;
      const inProgress = total - completed;
      
      setStats({ total, completed, inProgress });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchStats();
    } else {
      alert('Incorrect password');
    }
  };

  const mergeData = (
    sessions: SessionData[],
    exposures: StimulusExposureData[],
    recalls: RecallTaskData[],
    surveys: SurveyResponseData[],
    demographics: DemographicsData[]
  ): MergedData[] => {
    const merged: { [participantId: string]: MergedData } = {};

    // Initialize with sessions
    sessions.forEach(session => {
      merged[session.participantId] = {
        participantId: session.participantId,
        startTime: session.startTime?.toDate?.()?.toISOString() || session.startTime,
        endTime: session.endTime?.toDate?.()?.toISOString() || session.endTime || '',
        completed: session.completed,
        conditionNumber: session.conditionNumber,
        advisorType: session.advisorType,
        congruity: session.congruity,
        patternKey: session.patternKey,
        productOrder: JSON.stringify(session.productOrder),
        stimulusOrder: JSON.stringify(session.stimulusOrder),
        currentStimulusIndex: session.currentStimulusIndex,
        completedStimuli: JSON.stringify(session.completedStimuli),
      };
    });

    // Merge stimulus exposures
    exposures.forEach(exp => {
      if (!merged[exp.participantId]) merged[exp.participantId] = { participantId: exp.participantId };
      
      const idx = exp.stimulusId;
      merged[exp.participantId][`stimulus_${idx}_dwellTime`] = exp.dwellTime;
      merged[exp.participantId][`stimulus_${idx}_timestamp`] = exp.createdAt?.toDate?.()?.toISOString() || exp.createdAt;
    });

    // Merge recall tasks
    recalls.forEach(recall => {
      if (!merged[recall.participantId]) merged[recall.participantId] = { participantId: recall.participantId };
      
      const idx = recall.stimulusId;
      merged[recall.participantId][`recall_${idx}_text`] = recall.recalledRecommendation;
      merged[recall.participantId][`recall_${idx}_time`] = recall.recallTime;
      merged[recall.participantId][`recall_${idx}_accuracy`] = recall.recallAccuracy || '';
    });

    // Merge survey responses
    surveys.forEach(survey => {
      if (!merged[survey.participantId]) merged[survey.participantId] = { participantId: survey.participantId };
      
      const idx = survey.stimulusId;
      
      // Add all survey fields
      merged[survey.participantId][`survey_${idx}_productId`] = survey.productId;
      merged[survey.participantId][`survey_${idx}_advisorType`] = survey.advisorType;
      merged[survey.participantId][`survey_${idx}_congruity`] = survey.congruity;
      merged[survey.participantId][`survey_${idx}_trust_recommendation`] = survey.trust_recommendation;
      merged[survey.participantId][`survey_${idx}_trust_credibility`] = survey.trust_credibility;
      merged[survey.participantId][`survey_${idx}_trust_future_reliance`] = survey.trust_future_reliance;
      merged[survey.participantId][`survey_${idx}_purchase_likelihood`] = survey.purchase_likelihood;
      merged[survey.participantId][`survey_${idx}_purchase_influence`] = survey.purchase_influence;
      merged[survey.participantId][`survey_${idx}_expertise_knowledge`] = survey.expertise_knowledge;
      merged[survey.participantId][`survey_${idx}_expertise_clarity`] = survey.expertise_clarity;
    });

    // Merge demographics
    demographics.forEach(demo => {
      if (!merged[demo.participantId]) merged[demo.participantId] = { participantId: demo.participantId };
      
      // Add all demographic fields with demo_ prefix
      merged[demo.participantId][`demo_age`] = demo.age;
      merged[demo.participantId][`demo_gender`] = demo.gender;
      merged[demo.participantId][`demo_education`] = demo.education;
      merged[demo.participantId][`demo_online_shopping_frequency`] = demo.online_shopping_frequency;
    });

    return Object.values(merged);
  };

  const convertToCSV = (data: MergedData[]): string => {
    if (data.length === 0) return '';

    // Get all unique keys
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });

    const headers = Array.from(allKeys).sort();
    
    // Create CSV header
    const csvRows = [headers.join(',')];

    // Create CSV rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        
        // Escape commas and quotes
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const handleDownloadCSV = async () => {
    setIsLoading(true);
    try {
      // Fetch all data from Firebase
      const sessions = await getAllSessions();
      const exposures = await getAllStimulusExposures();
      const recalls = await getAllRecallTasks();
      const surveys = await getAllSurveyResponses();
      const demographics = await getAllDemographics();
      
      // Merge data by participantId
      const merged = mergeData(sessions, exposures, recalls, surveys, demographics);
      
      // Convert to CSV
      const csv = convertToCSV(merged);
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `experiment_data_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      alert(`Successfully downloaded data for ${merged.length} participants`);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading data. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Data Export</h1>
        
        {!isAuthenticated ? (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:border-blue-500 focus:outline-none"
              placeholder="Enter admin password"
              autoFocus
            />
            <button 
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold"
            >
              Login
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-md text-center border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">Total Participants</div>
              </div>
              <div className="bg-green-50 p-4 rounded-md text-center border border-green-200">
                <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600 mt-1">Completed</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md text-center border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600 mt-1">In Progress</div>
              </div>
            </div>
            
            <button 
              onClick={handleDownloadCSV}
              disabled={isLoading}
              className={`w-full py-3 rounded-md transition flex items-center justify-center space-x-2 font-semibold ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Download size={20} />
              <span>{isLoading ? 'Downloading...' : 'Download Complete Dataset (CSV)'}</span>
            </button>

            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>The CSV will include all data from all 5 Firebase collections merged by participant ID.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
