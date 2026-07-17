import React, { useState } from 'react';
import { Search, Plus, Filter, Tag, Cpu, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { TroubleShootingRecord, PersonalizationRole } from '../types';
import { initialTroubleShootingLogs } from '../data/mockData';

interface TroubleShootingDBProps {
  role: PersonalizationRole;
}

export const TroubleShootingDB: React.FC<TroubleShootingDBProps> = ({ role }) => {
  const [logs, setLogs] = useState<TroubleShootingRecord[]>(initialTroubleShootingLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Form states
  const [equipmentName, setEquipmentName] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [phenomenon, setPhenomenon] = useState('');
  const [cause, setCause] = useState('');
  const [solution, setSolution] = useState('');
  const [rawTags, setRawTags] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter out unique tags for quick chips
  const allTags = Array.from(new Set(logs.flatMap(l => l.tags)));

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentName || !phenomenon || !cause || !solution) {
      alert('설비명, 현상, 원인, 조치사항은 필수 입력항목입니다.');
      return;
    }

    const tagsArr = rawTags
      ? rawTags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : ['설비개선'];

    const newLog: TroubleShootingRecord = {
      id: `TS-0${logs.length + 1}`,
      equipmentName,
      errorCode: errorCode || 'N/A',
      phenomenon,
      cause,
      solution,
      tags: tagsArr,
      severity,
      author: role === 'junior' ? '신입 엔지니어 (수련생)' : '현장 실무 엔지니어',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLogs([newLog, ...logs]);
    
    // Reset
    setEquipmentName('');
    setErrorCode('');
    setPhenomenon('');
    setCause('');
    setSolution('');
    setRawTags('');
    setSeverity('medium');
    setShowAddForm(false);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.errorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.phenomenon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.solution.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag ? log.tags.includes(selectedTag) : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl" id="trouble-shooting-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">🔧</span>
            공정 고장조치 트러블 슈팅 DB (Troubleshooting)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            현장 돌발 고장 및 수리 기록을 고장-원인-조치 태그로 정합하여 지식 자산화하고, 신입사원 조기 교육 자료로 활용합니다.
          </p>
        </div>
        <button
          id="toggle-add-log-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-98 rounded-xl transition shadow-md cursor-pointer"
        >
          {showAddForm ? '돌아가기 (목록 보기)' : '신규 트러블 슈팅 등록'}
        </button>
      </div>

      {showAddForm ? (
        <form onSubmit={handleAddLog} className="mt-6 p-5 bg-slate-850 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Sparkles className="h-4 w-4" />
            신규 장애 대응 및 노하우 기록작성
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">장애 설비명 *</label>
              <input
                id="eq-name-input"
                type="text"
                placeholder="예: 초음파 탐상 가공기 A호"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">에러코드 / 경보내용</label>
              <input
                id="error-code-input"
                type="text"
                placeholder="예: ERR-A203 (Limit Over)"
                value={errorCode}
                onChange={(e) => setErrorCode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">심각도 등급</label>
              <select
                id="severity-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500 font-sans"
              >
                <option value="low">경미함 (Low - 가동 유지)</option>
                <option value="medium">주의 필요 (Medium - 라인 대기)</option>
                <option value="high">심각 (High - 라인 완전정지)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">1. 고장 현상 (Phenomenon) *</label>
              <textarea
                id="phenomenon-textarea"
                rows={2}
                placeholder="장애 당시 작업자가 느꼈던 육안 현상 혹은 에러 상황을 묘사해주세요."
                value={phenomenon}
                onChange={(e) => setPhenomenon(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">2. 고장 원인 (Cause) *</label>
              <textarea
                id="cause-textarea"
                rows={2}
                placeholder="사후 검토 후 분석된 물리적/전기적 또는 절차적 고장 유발 원인."
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">3. 조치 내용 (Solution) *</label>
              <textarea
                id="solution-textarea"
                rows={2}
                placeholder="고장을 해결하기 위해 즉각 적용한 수리 절차 및 정비 조치 세부 내역."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">검색 분류용 태그 (쉼표로 구분)</label>
              <input
                id="tags-input"
                type="text"
                placeholder="예: CNC, Spindle, 유압장치, 이물질"
                value={rawTags}
                onChange={(e) => setRawTags(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500 font-sans"
              />
              <p className="text-[10px] text-slate-500 mt-1">태그는 한글과 영문 쉼표(,)를 기준으로 나누어 등록됩니다.</p>
            </div>
          </div>

          <button
            id="submit-log-btn"
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 active:scale-98 text-white text-xs font-bold rounded-lg transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            지식 자산화(DB) 저장하기
          </button>
        </form>
      ) : (
        <div className="mt-6 space-y-5">
          {/* Search bar & Tag filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                id="search-trouble-input"
                type="text"
                placeholder="설비명, 에러코드, 고장 현상, 조치 조견표를 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-850 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>
            
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Filter className="h-3 w-3" />
                태그 필터:
              </span>
              <button
                id="clear-tag-btn"
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 text-[10px] rounded-lg border font-semibold transition ${
                  !selectedTag 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                전체보기
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  id={`tag-filter-${tag}`}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-[10px] rounded-lg border font-semibold transition flex items-center gap-0.5 ${
                    selectedTag === tag 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <Tag className="h-2.5 w-2.5 text-rose-400/80" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Education help for junior */}
          {role === 'junior' && (
            <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-3.5 flex gap-3 text-xs text-slate-300 leading-relaxed">
              <BookOpen className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300">💡 [신입사원 조기 숙련 가이드] 고장 조치 학습 요령</span>
                <p className="mt-1">
                  설비 알람 발생 시 당황하지 말고 아래 검색창에 에러코드 번호(예: <code className="text-amber-300 font-mono">ERR-E504</code>)를 우선 쳐보십시오. 선배 기술 엔지니어들의 정형화된 대응책이 마련되어 있어 다운타임을 최소화할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* Log Card list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLogs.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs font-medium">
                일치하는 트러블 슈팅 기록이 존재하지 않습니다.
              </div>
            ) : (
              filteredLogs.map(log => {
                const getSeverityStyles = (sev: string) => {
                  switch (sev) {
                    case 'high': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                    case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                    default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                  }
                };

                return (
                  <div key={log.id} className="p-5 bg-slate-850 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-3">
                    <div>
                      {/* Card Header */}
                      <div className="flex justify-between items-start gap-2 border-b border-slate-800 pb-2.5">
                        <div>
                          <span className="text-[10px] font-mono text-rose-400 font-bold tracking-wider uppercase block">{log.id}</span>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                            <Cpu className="h-4 w-4 text-slate-400" />
                            {log.equipmentName}
                          </h4>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getSeverityStyles(log.severity)}`}>
                          {log.severity.toUpperCase()}
                        </span>
                      </div>

                      {/* Diagnostic details */}
                      <div className="mt-3.5 space-y-2.5 text-xs">
                        <div>
                          <span className="font-semibold text-rose-300 font-mono block mb-0.5">에러코드:</span>
                          <span className="font-mono text-slate-300 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">{log.errorCode}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-400 block mb-0.5">❌ 고장현상:</span>
                          <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-2 rounded">{log.phenomenon}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-400 block mb-0.5">🔍 추정원인:</span>
                          <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-2 rounded">{log.cause}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-emerald-400 block mb-0.5">✅ 조치결과:</span>
                          <p className="text-emerald-200 leading-relaxed bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded font-sans">{log.solution}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tags and author */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center gap-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {log.tags.map(t => (
                          <span key={t} className="text-[9px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        작성자: {log.author} ({log.createdAt})
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
