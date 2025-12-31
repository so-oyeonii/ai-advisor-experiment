import { useState, useEffect } from 'react';
import { Download, RefreshCw, Users, CheckCircle, Clock } from 'lucide-react';
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
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, inProgress: 0 });
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const sessionsData = await getAllSessions();
      setSessions(sessionsData);
      
      const total = sessionsData.length;
      const completed = sessionsData.filter(s => s.completed).length;
      const inProgress = total - completed;
      
      setStats({ total, completed, inProgress });
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
      alert('Error loading data. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

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
      const responseData: Record<string, any> = (survey as any).responseData || {};
      
      // Add all survey fields from responseData
      Object.keys(responseData).forEach(key => {
        merged[survey.participantId][`survey_${idx}_${key}`] = responseData[key];
      });
      
      merged[survey.participantId][`survey_${idx}_productId`] = survey.productId;
      merged[survey.participantId][`survey_${idx}_advisorType`] = survey.advisorType;
      merged[survey.participantId][`survey_${idx}_congruity`] = survey.congruity;
    });

    // Merge demographics
    demographics.forEach(demo => {
      if (!merged[demo.participantId]) merged[demo.participantId] = { participantId: demo.participantId };
      
      merged[demo.participantId]['demo_age'] = demo.age;
      merged[demo.participantId]['demo_gender'] = demo.gender;
      merged[demo.participantId]['demo_education'] = demo.education;
      merged[demo.participantId]['demo_online_shopping_frequency'] = demo.online_shopping_frequency;
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

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">실험 데이터 관리</h1>
            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>새로고침</span>
            </button>
          </div>

          {/* Last Update */}
          {lastUpdate && (
            <p className="text-sm text-gray-600 mb-6">
              마지막 업데이트: {lastUpdate.toLocaleString()} (10초마다 자동 새로고침)
            </p>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">{stats.total}</div>
                  <div className="text-blue-100 mt-2">전체 참가자</div>
                </div>
                <Users size={48} className="opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">{stats.completed}</div>
                  <div className="text-green-100 mt-2">완료</div>
                </div>
                <CheckCircle size={48} className="opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">{stats.inProgress}</div>
                  <div className="text-yellow-100 mt-2">진행 중</div>
                </div>
                <Clock size={48} className="opacity-80" />
              </div>
            </div>
          </div>
          
          {/* Download Button */}
          <button 
            onClick={handleDownloadCSV}
            disabled={isLoading || stats.total === 0}
            className={`w-full py-4 rounded-lg transition flex items-center justify-center space-x-3 font-bold text-lg mb-8 ${
              isLoading || stats.total === 0
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
            }`}
          >
            <Download size={24} />
            <span>{isLoading ? '다운로드 중...' : `전체 데이터 다운로드 (CSV)`}</span>
          </button>

          {/* Sessions Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white px-6 py-4">
              <h2 className="text-xl font-bold">실시간 참가자 데이터</h2>
            </div>
            
            <div className="overflow-x-auto">
              {sessions.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Users size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg">아직 참가자 데이터가 없습니다.</p>
                  <p className="text-sm mt-2">실험이 시작되면 여기에 데이터가 표시됩니다.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">참가자 ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">조건</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Advisor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Congruity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">패턴</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">진행도</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">상태</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">시작 시간</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sessions.map((session, idx) => (
                      <tr key={session.participantId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">
                          {session.participantId.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                          {session.conditionNumber}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            session.advisorType === 'AI' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {session.advisorType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            session.congruity === 'Congruent' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {session.congruity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">
                          {session.patternKey}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {session.currentStimulusIndex + 1} / 3
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {session.completed ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                              ✓ 완료
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                              ⏳ 진행중
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatTimestamp(session.startTime)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 사용 방법</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 이 페이지는 10초마다 자동으로 새로고침됩니다.</li>
              <li>• CSV 다운로드 버튼을 클릭하면 모든 데이터를 한 번에 내려받을 수 있습니다.</li>
              <li>• 참가자 데이터는 실시간으로 Firebase에서 가져옵니다.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
