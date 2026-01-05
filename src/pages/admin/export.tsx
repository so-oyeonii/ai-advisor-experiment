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
import { Timestamp } from 'firebase/firestore';

// Utility function to convert Timestamp to KST (Korea Standard Time) string
const toKSTString = (timestamp: Timestamp | string | Date | undefined | null): string => {
  if (!timestamp) return '';
  
  try {
    let date: Date;
    
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      return '';
    }
    
    // Format as KST (Asia/Seoul timezone) in 24-hour format
    const year = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric' });
    const month = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: '2-digit' });
    const day = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', day: '2-digit' });
    const hour = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', hour12: false });
    const minute = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', minute: '2-digit' });
    const second = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', second: '2-digit' });
    
    // Format: YYYY-MM-DD HH:mm:ss
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting timestamp:', error);
    return '';
  }
};

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
}

interface SessionWithDemographics extends SessionData {
  age?: string;
  exposures?: StimulusExposureData[];
}

interface MergedData {
  // Participant-level info
  participantId: string;
  age: string | number;
  gender: string | number;
  education: string | number;
  nationality: string | number;
  income: string | number;
  online_shopping_frequency: string | number;
  shopping_frequency: string | number;
  ai_usage_frequency: string | number;
  // AI Familiarity scores (1-7 Likert scale)
  ai_familiarity_1: string | number;
  ai_familiarity_2: string | number;
  ai_familiarity_3: string | number;
  // Review Skepticism scores (1-7 Likert scale)
  review_skepticism_1: string | number;
  review_skepticism_2: string | number;
  review_skepticism_3: string | number;
  review_skepticism_4: string | number;
  // Attitude toward AI scores (1-7 Likert scale)
  attitude_ai_1: string | number;
  attitude_ai_2: string | number;
  attitude_ai_3: string | number;
  attitude_ai_4: string | number;
  survey_start_time: string;
  survey_end_time: string;
  status: string;
  // Product-level info
  stimulusIndex: number;
  stimulusCode: string; // e.g., "C1_P", "C3_T", "C8_S"
  productName: string;
  groupId: string | number;
  conditionId: string | number;
  advisorType: string;
  congruity: string;
  advisorValence: string | number;
  publicValence: string | number;
  dwellTime: string | number;
  exposureTimestamp: string;
  recalledWords: string;
  recalledText: string;
  recallTime: string | number;
  recallTimestamp: string;
  surveyTimestamp?: string;
  // Survey responses (dynamic keys like survey_q1, survey_q2, etc.)
  [key: string]: string | number | boolean | undefined;
}

export default function AdminExportPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, inProgress: 0 });
  const [sessions, setSessions] = useState<SessionWithDemographics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchStats();
    } else {
      alert('잘못된 비밀번호입니다.');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [sessionsData, demographicsData, exposuresData, surveyResponsesData] = await Promise.all([
        getAllSessions(),
        getAllDemographics(),
        getAllStimulusExposures(),
        getAllSurveyResponses()
      ]);
      
      console.log('📊 Admin: Fetched data from Firebase');
      console.log('  - Sessions count:', sessionsData.length);
      console.log('  - Demographics count:', demographicsData.length);
      console.log('  - Exposures count:', exposuresData.length);
      console.log('  - Survey Responses count:', surveyResponsesData.length);
      
      // Log sample survey response to see actual structure
      if (surveyResponsesData.length > 0) {
        console.log('  - Sample survey response:', surveyResponsesData[0]);
        console.log('  - Survey response keys:', Object.keys(surveyResponsesData[0]));
      }
      
      // Get unique participant IDs from survey_responses (these are actually completed)
      const completedParticipantIds = new Set<string>();
      surveyResponsesData.forEach(response => {
        // Try both field names since interface might be wrong
        const pid = (response as { participant_id?: string; participantId?: string }).participant_id || response.participantId;
        if (pid) {
          completedParticipantIds.add(pid);
        }
      });
      console.log('  - Completed participants (from survey_responses):', completedParticipantIds.size);
      console.log('  - Completed participant IDs:', Array.from(completedParticipantIds));
      
      // Merge demographics age and exposure data into sessions
      // Mark sessions as completed if they have survey responses
      const sessionsWithAge: SessionWithDemographics[] = sessionsData.map(session => {
        const demo = demographicsData.find(d => d.participantId === session.participantId);
        const isActuallyCompleted = completedParticipantIds.has(session.participantId);
        return {
          ...session,
          completed: isActuallyCompleted, // Override with actual completion status
          age: demo?.age,
          exposures: exposuresData.filter(e => e.participantId === session.participantId)
        };
      });
      
      if (sessionsWithAge.length > 0) {
        console.log('  - After override - Session completed?', sessionsWithAge[0].completed);
        console.log('  - Session participant ID:', sessionsWithAge[0].participantId);
      }
      
      // Sort by endTime (most recent first)
      sessionsWithAge.sort((a, b) => {
        const aTime = a.endTime instanceof Timestamp ? a.endTime.toMillis() : (a.endTime ? new Date(a.endTime).getTime() : 0);
        const bTime = b.endTime instanceof Timestamp ? b.endTime.toMillis() : (b.endTime ? new Date(b.endTime).getTime() : 0);
        return bTime - aTime; // Descending order (most recent first)
      });
      
      setSessions(sessionsWithAge);
      
      const total = sessionsData.length;
      const completed = completedParticipantIds.size; // Use actual count from survey_responses
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
    if (isAuthenticated) {
      fetchStats();
      // Auto-refresh every 10 seconds only when authenticated
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const mergeData = (
    sessions: SessionData[],
    exposures: StimulusExposureData[],
    recalls: RecallTaskData[],
    surveys: SurveyResponseData[],
    demographics: DemographicsData[]
  ): MergedData[] => {
    const merged: MergedData[] = [];

    // Create one row per product (3 rows per participant)
    sessions.forEach(session => {
      const participantDemo = demographics.find(d => d.participantId === session.participantId);
      
      // 전체 설문 시작/끝 시간 (3개 행 모두 동일)
      const surveyStartTime = toKSTString(session.startTime);
      const surveyEndTime = toKSTString(session.endTime);
      
      // For each of the 3 products this participant saw
      for (let stimulusIdx = 0; stimulusIdx < 3; stimulusIdx++) {
        const exposure = exposures.find(e => 
          e.participantId === session.participantId && e.exposureOrder === stimulusIdx
        );
        const recall = recalls.find(r => 
          r.participantId === session.participantId && Number(r.stimulusId) === stimulusIdx
        );
        const survey = surveys.find(s => 
          s.participantId === session.participantId && Number(s.stimulusId) === stimulusIdx
        );

        const row: MergedData = {
          // Participant-level info (same for all 3 rows)
          participantId: session.participantId,
          age: participantDemo?.age || '',
          gender: participantDemo?.gender || '',
          education: participantDemo?.education || '',
          nationality: participantDemo?.nationality || '',
          income: participantDemo?.income || '',
          online_shopping_frequency: participantDemo?.online_shopping_frequency || '',
          shopping_frequency: participantDemo?.shopping_frequency || '',
          ai_usage_frequency: participantDemo?.ai_usage_frequency || '',
          // AI Familiarity scores
          ai_familiarity_1: participantDemo?.ai_familiarity_1 || '',
          ai_familiarity_2: participantDemo?.ai_familiarity_2 || '',
          ai_familiarity_3: participantDemo?.ai_familiarity_3 || '',
          // Review Skepticism scores
          review_skepticism_1: participantDemo?.review_skepticism_1 || '',
          review_skepticism_2: participantDemo?.review_skepticism_2 || '',
          review_skepticism_3: participantDemo?.review_skepticism_3 || '',
          review_skepticism_4: participantDemo?.review_skepticism_4 || '',
          // Attitude toward AI scores
          attitude_ai_1: participantDemo?.attitude_ai_1 || '',
          attitude_ai_2: participantDemo?.attitude_ai_2 || '',
          attitude_ai_3: participantDemo?.attitude_ai_3 || '',
          attitude_ai_4: participantDemo?.attitude_ai_4 || '',
          // 전체 설문 시작/끝 시간 (3개 행 모두 동일)
          survey_start_time: surveyStartTime,
          survey_end_time: surveyEndTime,
          status: session.completed ? '완료' : '진행중',
          
          // Product-level info (different for each row)
          stimulusIndex: stimulusIdx,
          stimulusCode: (() => {
            if (!exposure?.conditionId) return '';
            const productId = exposure.productId || exposure.productName || '';
            let productCode = '';
            if (productId.toLowerCase().includes('protein')) productCode = 'P';
            else if (productId.toLowerCase().includes('tissue')) productCode = 'T';
            else if (productId.toLowerCase().includes('soap')) productCode = 'S';
            return `C${exposure.conditionId}_${productCode}`;
          })(),
          productName: exposure?.productName || exposure?.productId || '',
          groupId: exposure?.groupId || '',
          conditionId: exposure?.conditionId || '',
          advisorType: exposure?.advisorType || '',
          congruity: exposure?.congruity || '',
          advisorValence: exposure?.advisorValence || '',
          publicValence: exposure?.publicValence || '',
          
          // Stimulus exposure data
          dwellTime: exposure?.dwellTime || '',
          exposureTimestamp: toKSTString(exposure?.createdAt),
          
          // Recall data
          recalledWords: recall?.recalledWords ? recall.recalledWords.join(' | ') : '',
          recalledText: recall?.recalledRecommendation || '',
          recallTime: recall?.recallTime || '',
          recallTimestamp: toKSTString(recall?.createdAt),
        };

        // Add survey responses
        if (survey) {
          const responseData: Record<string, string | number> = (survey as unknown as { responseData?: Record<string, string | number> }).responseData || {};
          Object.keys(responseData).forEach(key => {
            row[`survey_${key}`] = responseData[key];
          });
          row.surveyTimestamp = toKSTString(survey.createdAt);
        }

        merged.push(row);
      }
    });

    // Sort by participant session start time (most recent first), then by stimulus order
    merged.sort((a, b) => {
      // 참가자가 다르면 세션 시작 시간으로 정렬 (최신 참가자가 위에)
      if (a.participantId !== b.participantId) {
        const aTime = a.survey_start_time ? new Date(a.survey_start_time).getTime() : 0;
        const bTime = b.survey_start_time ? new Date(b.survey_start_time).getTime() : 0;
        return bTime - aTime; // Descending order (most recent first)
      }
      
      // 같은 참가자면 stimulusIndex로 정렬 (0, 1, 2 순서)
      const orderA = a.stimulusIndex || 0;
      const orderB = b.stimulusIndex || 0;
      return orderA - orderB;
    });

    return merged;
  };

  const convertToCSV = (data: MergedData[]): string => {
    if (data.length === 0) return '';

    // Define explicit column order for better readability
    const headers = [
      // 1. 참가자 기본 정보
      'participantId',
      'status',
      'survey_start_time',
      'survey_end_time',
      
      // 2. 자극물 정보
      'stimulusIndex',
      'stimulusCode',
      'productName',
      'groupId',
      'conditionId',
      'advisorType',
      'congruity',
      'advisorValence',
      'publicValence',
      
      // 3. 노출 정보
      'exposureTimestamp',
      'dwellTime',
      
      // 4. DV: 종속변수
      'persuasiveness_1',
      'persuasiveness_2',
      'persuasiveness_3',
      'persuasiveness_4',
      'purchase_intention_1',
      'purchase_intention_2',
      'purchase_intention_3',
      'decision_confidence_1',
      'decision_confidence_2',
      'decision_confidence_3',
      'decision_confidence_4',
      
      // 5. M: 매개변수
      'argument_quality_1',
      'argument_quality_2',
      'argument_quality_3',
      'argument_quality_4',
      'argument_quality_5',
      'source_credibility_expertise_1',
      'source_credibility_expertise_2',
      'source_credibility_expertise_3',
      'source_credibility_expertise_4',
      'source_credibility_trust_1',
      'source_credibility_trust_2',
      'source_credibility_trust_3',
      'source_credibility_trust_4',
      'persuasive_intent_1',
      'persuasive_intent_2',
      'persuasive_intent_3',
      'mind_perception_agency_1',
      'mind_perception_agency_2',
      'mind_perception_agency_3',
      'mind_perception_experience_1',
      'mind_perception_experience_2',
      'mind_perception_experience_3',
      
      // 6. Manipulation & Attention Checks
      'product_involvement_1',
      'product_involvement_2',
      'product_involvement_3',
      'manipulation_check_advisor_type',
      'manipulation_check_advisor_valence',
      'manipulation_check_public_valence',
      'attention_check_1',
      'attention_check_2',
      'recall_advisor_review',
      'recall_public_reviews',
      
      // 7. 인구통계 정보
      'age',
      'gender',
      'education',
      'nationality',
      'income',
      'online_shopping_frequency',
      'shopping_frequency',
      'ai_usage_frequency',
      
      // 8. 개인 특성 변수
      'ai_familiarity_1',
      'ai_familiarity_2',
      'ai_familiarity_3',
      'review_skepticism_1',
      'review_skepticism_2',
      'review_skepticism_3',
      'review_skepticism_4',
      'attitude_ai_1',
      'attitude_ai_2',
      'attitude_ai_3',
      'attitude_ai_4'
    ];
    
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
      
      // Create filename with KST timestamp
      const now = new Date();
      const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      const filename = `experiment_data_${kstTime.toISOString().replace(/[:.]/g, '-').slice(0, -5)}_KST.csv`;
      link.download = filename;
      
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

  const formatTimestamp = (timestamp: unknown) => {
    if (!timestamp) return 'N/A';
    
    let date: Date;
    
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
      date = (timestamp as { toDate: () => Date }).toDate();
    } else {
      date = new Date(timestamp as string | number | Date);
    }
    
    // Format as KST (Korea Standard Time, UTC+9) in 24-hour format
    const year = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric' });
    const month = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: '2-digit' });
    const day = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', day: '2-digit' });
    const hour = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', hour12: false });
    const minute = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', minute: '2-digit' });
    const second = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', second: '2-digit' });
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
  };

  const calculateDuration = (startTime: unknown, endTime: unknown) => {
    if (!startTime || !endTime) return 'N/A';
    
    let start: Date;
    let end: Date;
    
    if (typeof startTime === 'object' && startTime !== null && 'toDate' in startTime) {
      start = (startTime as { toDate: () => Date }).toDate();
    } else {
      start = new Date(startTime as string | number | Date);
    }
    
    if (typeof endTime === 'object' && endTime !== null && 'toDate' in endTime) {
      end = (endTime as { toDate: () => Date }).toDate();
    } else {
      end = new Date(endTime as string | number | Date);
    }
    
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffSeconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${diffMinutes}분 ${diffSeconds}초`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {!isAuthenticated ? (
            // Login Screen
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 로그인</h1>
                <p className="text-gray-600">데이터를 확인하려면 비밀번호를 입력하세요</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">비밀번호</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                    placeholder="비밀번호 입력"
                    autoFocus
                  />
                </div>
                
                <button 
                  onClick={handleLogin}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
                >
                  로그인
                </button>
                
                <p className="text-sm text-gray-500 text-center mt-4">
                  💡 비밀번호는 .env.local 파일에서 확인할 수 있습니다
                </p>
              </div>
            </div>
          ) : (
            // Admin Dashboard
            <>
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
              마지막 업데이트: {lastUpdate.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} KST (10초마다 자동 새로고침)
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
              <h2 className="text-xl font-bold">실시간 참가자 데이터 (제품별)</h2>
              <p className="text-sm text-gray-300 mt-1">각 참가자는 3개 제품을 보므로 3행으로 표시됩니다</p>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">나이</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">제품 순서 (그룹/조건/타입/일치성)</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">상태</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">시작 시간</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">종료 시간</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">소요 시간</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sessions.map((session, idx) => (
                      <tr key={session.participantId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">
                          {session.participantId.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {session.age || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="space-y-1">
                            {session.productOrder.map((product, pIdx) => {
                              // Find the exposure data for this product order
                              const exposure = session.exposures?.find(e => e.exposureOrder === pIdx);
                              const groupId = exposure?.groupId || '?';
                              const conditionId = exposure?.conditionId || '?';
                              const advisorType = exposure?.advisorType || '?';
                              const congruity = exposure?.congruity || '?';
                              
                              return (
                                <div key={pIdx} className="flex items-center space-x-2 flex-wrap">
                                  <span className="font-medium">{pIdx + 1}.</span>
                                  <span className="capitalize font-medium">{product}</span>
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                                    G{groupId}/C{conditionId}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                    advisorType === 'AI' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {advisorType}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                    congruity === 'Congruent' ? 'bg-teal-100 text-teal-800' : 'bg-orange-100 text-orange-800'
                                  }`}>
                                    {congruity}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
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
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {session.completed ? formatTimestamp(session.endTime) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {session.completed ? calculateDuration(session.startTime, session.endTime) : '-'}
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
              <li>• CSV 다운로드: 각 참가자는 제품별로 3행으로 나뉘어 저장됩니다.</li>
              <li>• 테이블: 각 참가자가 본 3개 제품과 각 제품별 적용 조건(C1-C8)이 표시됩니다.</li>
              <li>• 참가자 기본정보(ID, 나이, 인구통계)는 3행에 동일하게 표시됩니다.</li>
            </ul>
          </div>
          </>
          )}

        </div>
      </div>
    </div>
  );
}
