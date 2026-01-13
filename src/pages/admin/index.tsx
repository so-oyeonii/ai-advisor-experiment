import { useState, useEffect } from 'react';
import { Download, RefreshCw, Users, FileText, Eye, EyeOff } from 'lucide-react';
import { getAllSurveyResponses, getAllSessions, getAllStimulusExposures, SurveyResponseData, StimulusExposureData } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

/**
 * 새로운 어드민 페이지
 * 
 * 데이터 구조:
 * - 1명의 참가자 = 3개 행 (자극물 3개)
 * - stimulus_order: 1, 2, 3
 * - 자극물별 다른 데이터: product, advisor_type, congruity, involvement, arg_quality 등
 * - 공통 데이터 (3개 행에 중복): demographics, general questions
 */

// Extended type for admin view with flexible field names
type ExtendedSurveyResponse = Partial<SurveyResponseData> & {
  participant_id?: string;
  participantId?: string;
  stimulus_order?: number;
  product?: string;
  advisor_type?: string;
  advisorType?: string;
  congruity?: string | 'Congruent' | 'Incongruent';
  condition_group?: number;
  review_valence?: string;
  gender?: string;
  age?: number | string;
  advisor_valence?: string;
  advisorValence?: string;
  public_valence?: string;
  publicValence?: string;
  recall_1?: string;
  message_credibility_1?: number;
  purchase_1?: number;
  survey_start_time?: string | Timestamp;
  survey_end_time?: string | Timestamp;
  stimulus_dwell_time?: number; // 자극물 페이지 체류 시간 (초)
  [key: string]: string | number | boolean | undefined | Timestamp | object;
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [responses, setResponses] = useState<ExtendedSurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'grouped'>('all');
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);

  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('비밀번호가 틀렸습니다');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [data, sessions, exposures] = await Promise.all([
        getAllSurveyResponses(),
        getAllSessions(),
        getAllStimulusExposures()
      ]);

      console.log('📊 어드민: Firebase에서 데이터 가져옴');
      console.log('  - 전체 응답 수:', data.length);
      console.log('  - 세션 수:', sessions.length);
      console.log('  - 자극물 노출 수:', exposures.length);

      // stimulus_exposures를 participantId + exposureOrder로 맵핑
      const exposureMap = new Map<string, StimulusExposureData>();
      exposures.forEach(exp => {
        const key = `${exp.participantId}_${exp.exposureOrder}`;
        exposureMap.set(key, exp);
      });

      // survey_responses를 참가자별로 그룹화
      const surveyResponsesByParticipant = new Map<string, ExtendedSurveyResponse[]>();
      (data as ExtendedSurveyResponse[]).forEach(response => {
        const pid = response.participant_id || response.participantId || '';
        if (!surveyResponsesByParticipant.has(pid)) {
          surveyResponsesByParticipant.set(pid, []);
        }
        surveyResponsesByParticipant.get(pid)!.push(response);
      });

      // 모든 세션을 기준으로 데이터 구성 (진행중 + 완료)
      const allData: ExtendedSurveyResponse[] = [];

      sessions.forEach(session => {
        const pid = session.participantId;
        const participantResponses = surveyResponsesByParticipant.get(pid) || [];

        if (participantResponses.length > 0) {
          // 설문 응답이 있으면 해당 응답들 사용
          participantResponses.forEach(response => {
            // 해당 자극물의 체류 시간 찾기
            const stimulusOrder = response.stimulus_order ?? response.stimulusOrder ?? 0;
            const exposureKey = `${pid}_${stimulusOrder}`;
            const exposure = exposureMap.get(exposureKey);

            allData.push({
              ...response,
              survey_start_time: session.startTime,
              survey_end_time: session.endTime,
              status: session.completed ? 'completed' : 'in_progress',
              stimulus_dwell_time: exposure?.dwellTime || 0
            });
          });
        } else {
          // 설문 응답이 없으면 세션만 표시 (진행중)
          allData.push({
            participantId: pid,
            participant_id: pid,
            survey_start_time: session.startTime,
            survey_end_time: session.endTime,
            status: 'in_progress',
            createdAt: session.startTime
          } as ExtendedSurveyResponse);
        }
      });

      const enrichedData = allData;
      
      // 최신순으로 정렬 (참가자의 세션 시작 시간 기준, 그 다음 stimulus_order로 정렬)
      const sorted = enrichedData.sort((a, b) => {
        // 먼저 participant_id로 그룹화하여 비교
        const pidA = a.participant_id || a.participantId || '';
        const pidB = b.participant_id || b.participantId || '';
        
        // 다른 참가자인 경우: 세션 시작 시간으로 정렬 (최신이 먼저)
        if (pidA !== pidB) {
          const timeA = a.survey_start_time as Timestamp;
          const timeB = b.survey_start_time as Timestamp;
          if (timeA && timeB) {
            return timeB.seconds - timeA.seconds; // 내림차순
          }
          // survey_start_time이 없으면 createdAt으로 대체
          const fallbackTimeA = a.createdAt as Timestamp;
          const fallbackTimeB = b.createdAt as Timestamp;
          if (fallbackTimeA && fallbackTimeB) {
            return fallbackTimeB.seconds - fallbackTimeA.seconds;
          }
          // 타임스탬프가 없으면 participant_id로 정렬
          return pidB.localeCompare(pidA);
        }
        
        // 같은 참가자면 stimulus_order로 정렬 (0, 1, 2 순서)
        const orderA = Number((a.stimulus_order !== undefined ? a.stimulus_order : a.stimulusOrder) || 0);
        const orderB = Number((b.stimulus_order !== undefined ? b.stimulus_order : b.stimulusOrder) || 0);
        return orderA - orderB;
      });
      
      setResponses(sorted);
      setLastUpdate(new Date());
      
      // 통계 계산
      const uniqueParticipants = new Set(data.map(r => r.participantId));
      console.log('  - 참가자 수:', uniqueParticipants.size);
      console.log('  - 참가자당 평균 응답:', (data.length / uniqueParticipants.size).toFixed(1));
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
      alert('데이터 로딩 실패. 콘솔을 확인하세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      // 30초마다 자동 새로고침
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const downloadCSV = async () => {
    if (responses.length === 0) {
      alert('다운로드할 데이터가 없습니다');
      return;
    }

    try {
      // sessions 데이터 가져오기
      const sessions = await getAllSessions();
      const sessionsMap = new Map(sessions.map(s => [s.participantId, s]));

      // 시간 정보를 추가한 responses 생성
      const enrichedResponses = responses.map(row => {
        const pid = row.participant_id || row.participantId || '';
        const session = sessionsMap.get(pid);
        
        // 전체 설문 시작/끝 시간 (sessions 테이블에서 가져오기)
        const formatTimestamp = (ts: Timestamp | undefined) => {
          if (!ts) return '';
          const date = ts.toDate();
          const year = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric' });
          const month = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: '2-digit' });
          const day = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', day: '2-digit' });
          const hour = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', hour12: false });
          const minute = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', minute: '2-digit' });
          const second = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', second: '2-digit' });
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
        };
        
        const surveyStartTime = formatTimestamp(session?.startTime);
        const surveyEndTime = formatTimestamp(session?.endTime);
        const status = session?.completed ? '완료' : '진행중';
        
        return {
          ...row,
          survey_start_time: surveyStartTime,
          survey_end_time: surveyEndTime,
          status: status,
          advisor_valence: row.advisor_valence || (row as ExtendedSurveyResponse).advisorValence || '',
          public_valence: row.public_valence || (row as ExtendedSurveyResponse).publicValence || ''
        };
      });

      // 모든 컬럼 이름 수집
      const allColumns = new Set<string>();
      enrichedResponses.forEach(row => {
        Object.keys(row).forEach(key => {
          allColumns.add(key);
        });
      });

      // 컬럼 순서 정의 (export.tsx와 동일하게)
      const priorityColumns = [
        // 1. 참가자 기본 정보
        'participant_id',
        'status',
        'survey_start_time',
        'survey_end_time',
        
        // 2. 자극물 정보
        'stimulus_order',
        'product',
        'condition_group',
        'advisor_type',
        'congruity',
        'advisor_valence',
        'public_valence',
        
        // 3. 노출 정보
        'stimulus_dwell_time',
        
        // 4. 인구통계
        'age',
        'gender',
        'education',
        'income',
        'occupation'
      ];

      const remainingColumns = Array.from(allColumns)
        .filter(col => !priorityColumns.includes(col) && col !== 'timestamp')
        .sort();

      const columns = [...priorityColumns.filter(col => allColumns.has(col)), ...remainingColumns];
      
      console.log('📥 CSV 다운로드 시작');
      console.log('  - 행 수:', enrichedResponses.length);
      console.log('  - 컬럼 수:', columns.length);
      
      // CSV 헤더
      const header = columns.join(',');
      
      // CSV 데이터 행
      const rows = enrichedResponses.map(row => {
        return columns.map(col => {
          let value = (row as Record<string, unknown>)[col];
          
          // Congruity 값 정규화 (Congruent 또는 Incongruent로 통일)
          if (col === 'congruity' && value) {
            const congruityStr = String(value).toLowerCase();
            if (congruityStr === 'congruent' || congruityStr === 'match') {
              value = 'Congruent';
            } else if (congruityStr === 'incongruent' || congruityStr === 'nonmatch') {
              value = 'Incongruent';
            }
          }
          
          // Timestamp 변환
          if (value instanceof Timestamp) {
            value = value.toDate().toISOString();
          }
          
          // 배열 처리 (recalled_words 등)
          if (Array.isArray(value)) {
            value = value.join('; ');
          }
          
          // undefined/null 처리
          if (value === undefined || value === null) {
            return '';
          }
          
          // 문자열 변환 및 이스케이프
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          
          return stringValue;
        }).join(',');
      });
      
      const csv = [header, ...rows].join('\n');
      
      // UTF-8 BOM 추가 (엑셀 한글 깨짐 방지)
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      link.setAttribute('href', url);
      link.setAttribute('download', `survey_data_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ CSV 다운로드 완료');
    } catch (error) {
      console.error('CSV 생성 오류:', error);
      alert('CSV 파일 생성 실패. 콘솔을 확인하세요.');
    }
  };

  // 참가자별 그룹화
  const groupByParticipant = () => {
    const grouped = new Map<string, ExtendedSurveyResponse[]>();
    responses.forEach(response => {
      const pid = response.participant_id || response.participantId || '';
      if (!grouped.has(pid)) {
        grouped.set(pid, []);
      }
      grouped.get(pid)!.push(response);
    });
    return grouped;
  };

  // 통계 계산
  const calculateStats = () => {
    const grouped = groupByParticipant();
    const participants = Array.from(grouped.entries());
    
    // 완료한 참가자 (3개 자극물 모두 완료)
    const completedParticipants = participants.filter(([, responses]) => responses.length === 3);
    const inProgressParticipants = participants.filter(([, responses]) => responses.length < 3);
    
    // 완료한 참가자의 전체 설문 소요 시간 계산 (시작~끝, 초 단위)
    const completionTimes: number[] = [];
    completedParticipants.forEach(([, responses]) => {
      // 첫 번째 응답에서 survey_start_time과 survey_end_time 가져오기
      const firstResponse = responses[0];
      const startTime = firstResponse?.survey_start_time as Timestamp | undefined;
      const endTime = firstResponse?.survey_end_time as Timestamp | undefined;

      if (startTime && endTime) {
        const startMs = startTime instanceof Timestamp ? startTime.toMillis() : new Date(startTime).getTime();
        const endMs = endTime instanceof Timestamp ? endTime.toMillis() : new Date(endTime).getTime();
        const totalSeconds = (endMs - startMs) / 1000;
        if (totalSeconds > 0) {
          completionTimes.push(totalSeconds);
        }
      }
    });
    
    // 평균 및 중앙값 계산
    const avgTime = completionTimes.length > 0 
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length 
      : 0;
    
    const median = completionTimes.length > 0
      ? (() => {
          const sorted = [...completionTimes].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          return sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
        })()
      : 0;
    
    // 조건별 분포 계산 (C1~C8)
    const conditionCounts: Record<number, number> = {};
    for (let i = 1; i <= 8; i++) {
      conditionCounts[i] = 0;
    }
    
    // 각 자극물별로 조건 카운트
    responses.forEach(r => {
      const conditionGroup = r.condition_group || (r as ExtendedSurveyResponse).conditionId;
      if (conditionGroup && conditionGroup >= 1 && conditionGroup <= 8) {
        conditionCounts[conditionGroup]++;
      }
    });
    
    return {
      totalCompleted: completedParticipants.length,
      totalInProgress: inProgressParticipants.length,
      avgTimeSeconds: avgTime,
      medianTimeSeconds: median,
      conditionCounts
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">어드민 로그인</h1>
            <p className="text-gray-600">설문 데이터 관리 페이지</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  const groupedData = groupByParticipant();
  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">설문 데이터 관리</h1>
              <p className="text-gray-600">참가자별 3개 자극물 응답 데이터</p>
            </div>
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              새로고침
            </button>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <Users className="w-5 h-5" />
                <span className="font-semibold">완료한 참가자</span>
              </div>
              <p className="text-3xl font-bold text-green-800">{stats.totalCompleted}</p>
              <p className="text-xs text-green-600 mt-1">3개 자극물 완료</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-700 mb-1">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">진행중인 참가자</span>
              </div>
              <p className="text-3xl font-bold text-yellow-800">{stats.totalInProgress}</p>
              <p className="text-xs text-yellow-600 mt-1">미완료 설문</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <span className="font-semibold">평균 소요 시간</span>
              </div>
              <p className="text-3xl font-bold text-purple-800">
                {Math.floor(stats.avgTimeSeconds / 60)}분
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {Math.floor(stats.avgTimeSeconds % 60)}초 • {Math.floor(stats.avgTimeSeconds)}초
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <span className="font-semibold">중앙값 시간</span>
              </div>
              <p className="text-3xl font-bold text-blue-800">
                {Math.floor(stats.medianTimeSeconds / 60)}분
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {Math.floor(stats.medianTimeSeconds % 60)}초 • {Math.floor(stats.medianTimeSeconds)}초
              </p>
            </div>
          </div>

          {/* 조건별 분포 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              조건별 응답 분포 (C1~C8)
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {Object.entries(stats.conditionCounts).map(([condition, count]) => (
                <div key={condition} className="bg-white p-2 rounded text-center border border-indigo-100">
                  <div className="text-xs font-semibold text-indigo-600">C{condition}</div>
                  <div className="text-lg font-bold text-indigo-900">{count}</div>
                  <div className="text-xs text-gray-500">응답</div>
                </div>
              ))}
            </div>
          </div>

          {lastUpdate && (
            <p className="text-sm text-gray-500">
              마지막 업데이트: {lastUpdate.toLocaleString('ko-KR', { 
                timeZone: 'Asia/Seoul', 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              })}
            </p>
          )}
        </div>

        {/* 다운로드 및 보기 모드 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <button
                onClick={downloadCSV}
                disabled={responses.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-semibold text-lg"
              >
                <Download className="w-5 h-5" />
                전체 데이터 CSV 다운로드
              </button>
              <p className="text-sm text-gray-600 mt-2">
                {responses.length}개 행 × {responses.length > 0 ? Object.keys(responses[0]).length : 0}개 컬럼
                (UTF-8 BOM 포함, 엑셀 호환)
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grouped')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grouped'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                참가자별 보기
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                전체 보기
              </button>
            </div>
          </div>
        </div>

        {/* 데이터 표시 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {viewMode === 'grouped' ? '참가자별 그룹 보기' : '전체 데이터 보기'}
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">아직 수집된 데이터가 없습니다</p>
            </div>
          ) : viewMode === 'grouped' ? (
            // 참가자별 그룹 보기
            <div className="space-y-4">
              {Array.from(groupedData.entries()).map(([participantId, participantResponses]) => {
                // 총 소요 시간 계산
                const totalTime = participantResponses.reduce((sum, r) => {
                  const dwellTime = r.stimulus_dwell_time || 0;
                  return sum + Number(dwellTime);
                }, 0);
                
                // 3개 조건 그룹 모두 추출 (각 자극물마다 다른 조건, 순서대로)
                const conditionGroups = participantResponses
                  .sort((a, b) => (a.stimulus_order || 0) - (b.stimulus_order || 0))
                  .map(r => r.condition_group || (r as ExtendedSurveyResponse)?.conditionId || '-');
                
                // 완료 상태 (3개 자극물 모두 완료 여부)
                const isCompleted = participantResponses.length === 3;
                
                return (
                <div key={participantId} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setExpandedParticipant(expandedParticipant === participantId ? null : participantId)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {expandedParticipant === participantId ? <EyeOff className="w-4 h-4 text-gray-600" /> : <Eye className="w-4 h-4 text-gray-600" />}
                          <p className="font-semibold text-gray-800">
                            참가자: <span className="font-mono text-blue-600">{participantId.substring(0, 12)}...</span>
                          </p>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {isCompleted ? '완료' : '진행중'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {participantResponses.length > 0 && (
                            <>
                              <span className="flex items-center gap-1">
                                ⏱️ <strong>{Math.floor(totalTime / 60)}분 {Math.floor(totalTime % 60)}초</strong>
                              </span>
                              <span className="flex items-center gap-1">
                                📋 {conditionGroups.map((cg, idx) => (
                                  <strong key={idx} className="text-indigo-600 mr-1">C{cg}</strong>
                                ))} 조건
                              </span>
                              {participantResponses[0]?.gender && (
                                <span>{participantResponses[0].gender}</span>
                              )}
                              {participantResponses[0]?.age && (
                                <span>{participantResponses[0].age}세</span>
                              )}
                            </>
                          )}
                          <span className="text-gray-400">
                            {participantResponses.length}/3 자극물
                          </span>
                        </div>
                        {/* 전체 설문 시작/끝 시간 표시 */}
                        {participantResponses[0]?.survey_start_time && (
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>시작: {participantResponses[0].survey_start_time instanceof Timestamp ? participantResponses[0].survey_start_time.toDate().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false }) : '-'}</span>
                            {participantResponses[0].survey_end_time && (
                              <span>완료: {participantResponses[0].survey_end_time instanceof Timestamp ? participantResponses[0].survey_end_time.toDate().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false }) : '-'}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 ml-4">
                        {expandedParticipant === participantId ? '▼ 접기' : '▶ 펼치기'}
                      </div>
                    </div>
                  </div>

                  {expandedParticipant === participantId && (
                    <div className="p-4 bg-white">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">순서</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">제품</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">일치성</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">A-Val</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">P-Val</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">조건</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">소요 시간</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {participantResponses.length === 0 ? (
                              <tr>
                                <td colSpan={9} className="px-3 py-4 text-center text-sm text-gray-500">
                                  아직 설문 응답이 없습니다. (세션 시작만 완료)
                                </td>
                              </tr>
                            ) : (
                              participantResponses.map((resp, idx) => {
                              // 조건에 따른 valence 추출
                              const advisorValence = resp.advisor_valence || resp.advisorValence || '-';
                              const publicValence = resp.public_valence || resp.publicValence || '-';
                              const congruity = String(resp.congruity || '');
                              const congruityLower = congruity.toLowerCase();
                              const isCongruent = congruity === 'Congruent' || congruityLower === 'congruent' || congruityLower === 'match';
                              
                              // 소요 시간 정보
                              const dwellTime = Number(resp.stimulus_dwell_time || 0);
                              
                              const formatDuration = (seconds: number) => {
                                const mins = Math.floor(seconds / 60);
                                const secs = Math.floor(seconds % 60);
                                return `${mins}분 ${secs}초`;
                              };
                              
                              return (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 text-sm font-bold text-gray-900">{resp.stimulus_order}</td>
                                  <td className="px-3 py-2 text-sm text-gray-900">{resp.product}</td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      resp.advisor_type?.toLowerCase() === 'ai' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {resp.advisor_type}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      isCongruent ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                    }`}>
                                      {isCongruent ? 'Match' : 'Non-match'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      advisorValence === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {advisorValence === 'positive' ? 'Pos' : advisorValence === 'negative' ? 'Neg' : '-'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      publicValence === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {publicValence === 'positive' ? 'Pos' : publicValence === 'negative' ? 'Neg' : '-'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-sm font-semibold text-indigo-600">C{resp.condition_group}</td>
                                  <td className="px-3 py-2 text-sm font-semibold text-gray-900">{formatDuration(dwellTime)}</td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">
                                      완료
                                    </span>
                                  </td>
                                </tr>
                              );
                            }))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )})}
            </div>
          ) : (
            // 전체 보기
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">
                      참가자 ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">조건그룹</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">제품</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">어드바이저</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">일치성</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Advisor Val</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Public Val</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((row, idx) => {
                    // Advisor Valence와 Public Valence 추출
                    const advisorVal = row.advisor_valence || (row as ExtendedSurveyResponse).advisorValence || '';
                    const publicVal = row.public_valence || (row as ExtendedSurveyResponse).publicValence || '';
                    
                    // Congruity 로직: Congruent = advisor와 public이 다름, Incongruent = 같음
                    const congruity = String(row.congruity || '');
                    const congruityLower = congruity.toLowerCase();
                    const isCongruent = congruity === 'Congruent' || congruityLower === 'congruent' || congruityLower === 'match';
                    
                    return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900 sticky left-0 bg-white">
                        {(row.participant_id || row.participantId || '')?.substring(0, 12)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-indigo-100 text-indigo-800">
                          C{row.condition_group}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {row.product}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          row.advisor_type === 'ai' || row.advisor_type === 'AI' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {row.advisor_type === 'ai' || row.advisor_type === 'AI' ? 'AI' : 'Human'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          isCongruent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {congruity || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          String(advisorVal).toLowerCase() === 'positive'
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {String(advisorVal).toLowerCase() === 'positive' ? 'Positive' : String(advisorVal).toLowerCase() === 'negative' ? 'Negative' : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          String(publicVal).toLowerCase() === 'positive'
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {String(publicVal).toLowerCase() === 'positive' ? 'Positive' : String(publicVal).toLowerCase() === 'negative' ? 'Negative' : '-'}
                        </span>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
