import { useState, useEffect } from 'react';
import { Download, RefreshCw, Users, FileText, Eye, EyeOff } from 'lucide-react';
import { getAllSurveyResponses } from '@/lib/firebase';
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

interface SurveyResponse {
  participant_id: string;
  stimulus_order: number;
  product: string;
  advisor_type: string;
  congruity: string;
  condition_group: number;
  review_valence: string;
  [key: string]: any;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'grouped'>('grouped');
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
      const data = await getAllSurveyResponses();
      
      console.log('📊 어드민: Firebase에서 데이터 가져옴');
      console.log('  - 전체 응답 수:', data.length);
      
      // participant_id와 stimulus_order로 정렬
      const sorted = [...data].sort((a: any, b: any) => {
        const pidCompare = (a.participant_id || '').localeCompare(b.participant_id || '');
        if (pidCompare !== 0) return pidCompare;
        return (a.stimulus_order || 0) - (b.stimulus_order || 0);
      });
      
      setResponses(sorted as any);
      setLastUpdate(new Date());
      
      // 통계 계산
      const uniqueParticipants = new Set(data.map((r: any) => r.participant_id));
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

  const downloadCSV = () => {
    if (responses.length === 0) {
      alert('다운로드할 데이터가 없습니다');
      return;
    }

    try {
      // 모든 컬럼 이름 수집
      const allColumns = new Set<string>();
      responses.forEach(row => {
        Object.keys(row).forEach(key => {
          allColumns.add(key);
        });
      });

      // 컬럼 순서 정의 (중요한 것 먼저)
      const priorityColumns = [
        'participant_id',
        'stimulus_order',
        'condition_group',
        'product',
        'advisor_type',
        'congruity',
        'review_valence',
        'gender',
        'age',
        'education',
        'income',
        'occupation'
      ];

      const remainingColumns = Array.from(allColumns)
        .filter(col => !priorityColumns.includes(col) && col !== 'timestamp')
        .sort();

      const columns = [...priorityColumns.filter(col => allColumns.has(col)), ...remainingColumns];
      
      console.log('📥 CSV 다운로드 시작');
      console.log('  - 행 수:', responses.length);
      console.log('  - 컬럼 수:', columns.length);
      
      // CSV 헤더
      const header = columns.join(',');
      
      // CSV 데이터 행
      const rows = responses.map(row => {
        return columns.map(col => {
          let value = row[col];
          
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
    const grouped = new Map<string, SurveyResponse[]>();
    responses.forEach(response => {
      const pid = response.participant_id;
      if (!grouped.has(pid)) {
        grouped.set(pid, []);
      }
      grouped.get(pid)!.push(response);
    });
    return grouped;
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

  const uniqueParticipants = new Set(responses.map(r => r.participant_id));
  const groupedData = groupByParticipant();

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Users className="w-5 h-5" />
                <span className="font-semibold">참가자 수</span>
              </div>
              <p className="text-3xl font-bold text-blue-800">{uniqueParticipants.size}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">전체 응답 행</span>
              </div>
              <p className="text-3xl font-bold text-green-800">{responses.length}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <span className="font-semibold">1인당 평균</span>
              </div>
              <p className="text-3xl font-bold text-purple-800">
                {uniqueParticipants.size > 0 ? (responses.length / uniqueParticipants.size).toFixed(1) : 0}
              </p>
              <p className="text-xs text-purple-600 mt-1">자극물 개수</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-orange-700 mb-1">
                <span className="font-semibold">컬럼 수</span>
              </div>
              <p className="text-3xl font-bold text-orange-800">
                {responses.length > 0 ? Object.keys(responses[0]).length : 0}
              </p>
              <p className="text-xs text-orange-600 mt-1">필드 개수</p>
            </div>
          </div>

          {lastUpdate && (
            <p className="text-sm text-gray-500">
              마지막 업데이트: {lastUpdate.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
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
              {Array.from(groupedData.entries()).map(([participantId, participantResponses]) => (
                <div key={participantId} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setExpandedParticipant(expandedParticipant === participantId ? null : participantId)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                          {expandedParticipant === participantId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          참가자: <span className="font-mono text-blue-600">{participantId.substring(0, 8)}...</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {participantResponses.length}개 자극물 응답
                          {participantResponses[0]?.gender && ` • ${participantResponses[0].gender}`}
                          {participantResponses[0]?.age && ` • ${participantResponses[0].age}세`}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
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
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cong</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">A-Val</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">P-Val</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">조건번호</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">관여도</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">논증품질</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">구매의도</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {participantResponses.map((resp, idx) => {
                              // 조건에 따른 valence 추출
                              const advisorValence = resp.advisor_valence || resp.advisorValence || '-';
                              const publicValence = resp.public_valence || resp.publicValence || '-';
                              const congruity = resp.congruity;
                              
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
                                      congruity === 'match' || congruity === 'Congruent' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                    }`}>
                                      {congruity === 'match' || congruity === 'Congruent' ? 'Cong' : 'Inco'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      advisorValence === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {advisorValence === 'positive' ? 'pos' : advisorValence === 'negative' ? 'neg' : '-'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      publicValence === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {publicValence === 'positive' ? 'pos' : publicValence === 'negative' ? 'neg' : '-'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-sm font-semibold text-gray-900">C{resp.condition_group}</td>
                                  <td className="px-3 py-2 text-sm text-gray-900">{resp.involvement_1 || '-'}</td>
                                  <td className="px-3 py-2 text-sm text-gray-900">{resp.arg_quality_1 || '-'}</td>
                                  <td className="px-3 py-2 text-sm text-gray-900">{resp.purchase_1 || '-'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 전체 보기
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                      참가자 ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">순서</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">제품</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">어드바이저</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">일치성</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">조건</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">컬럼수</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900 sticky left-0 bg-white">
                        {row.participant_id?.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {row.stimulus_order}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {row.product}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          row.advisor_type === 'ai' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {row.advisor_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          row.congruity === 'match' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {row.congruity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        C{row.condition_group}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {Object.keys(row).length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
