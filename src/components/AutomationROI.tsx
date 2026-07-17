import React, { useState } from 'react';
import { Plus, Calculator, BarChart3, TrendingUp, CheckCircle, Clock, Settings, Info, Briefcase } from 'lucide-react';
import { AutomationProject, PersonalizationRole } from '../types';
import { initialAutomationTasks } from '../data/mockData';

interface AutomationROIProps {
  role: PersonalizationRole;
}

export const AutomationROI: React.FC<AutomationROIProps> = ({ role }) => {
  const [tasks, setTasks] = useState<AutomationProject[]>(initialAutomationTasks);

  // ROI Calculator states
  const [taskName, setTaskName] = useState('');
  const [processName, setProcessName] = useState('');
  const [cost, setCost] = useState<number>(3000); // in 10k KRW (3000만원)
  const [expectedSavings, setExpectedSavings] = useState<number>(1000); // in 10k KRW (1000만원)
  const [stage, setStage] = useState<'기획' | '설계' | '시운전' | '완료'>('기획');
  const [description, setDescription] = useState('');

  // Form error states
  const [errorMsg, setErrorMsg] = useState('');

  const calculateROI = (c: number, s: number) => {
    if (s <= 0) return 99;
    return parseFloat((c / s).toFixed(2));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !processName) {
      setErrorMsg('과제명과 공정명을 입력해주세요.');
      return;
    }
    setErrorMsg('');

    const newProject: AutomationProject = {
      id: `AUT-0${tasks.length + 1}`,
      taskName,
      processName,
      cost,
      expectedSavings,
      stage,
      roiYears: calculateROI(cost, expectedSavings),
      updatedAt: new Date().toISOString().split('T')[0],
      description: description || '기술 개선 검토 과제'
    };

    setTasks([newProject, ...tasks]);
    
    // reset form fields
    setTaskName('');
    setProcessName('');
    setCost(3000);
    setExpectedSavings(1000);
    setDescription('');
    setStage('기획');
  };

  const deleteProject = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateStage = (id: string, newStage: '기획' | '설계' | '시운전' | '완료') => {
    setTasks(tasks.map(t => t.id === id ? { ...t, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] } : t));
  };

  // KPI Calculations
  const totalCapex = tasks.reduce((sum, t) => sum + t.cost, 0);
  const totalAnnualSavings = tasks.reduce((sum, t) => sum + t.expectedSavings, 0);
  const avgROI = tasks.length > 0 ? (totalCapex / totalAnnualSavings).toFixed(2) : '0';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl" id="automation-roi-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">🤖</span>
            공정 자동화 관리 & ROI 계산기
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            간이자동화 과제를 등록하고 투자 회수 기간(Payback Period)을 실시간으로 도출하여 기획 타당성을 검증합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left column: Add Project & Calculator */}
        <div className="lg:col-span-4">
          <form onSubmit={handleAddTask} className="p-5 bg-slate-850 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Calculator className="h-4 w-4 text-emerald-400" />
              자동화 과제 제안 & 투자 회수율 산출
            </h3>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 px-2 py-1.5 rounded">
                ⚠️ {errorMsg}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">과제명 *</label>
                <input
                  id="task-name-input"
                  type="text"
                  placeholder="예: 실링 노즐 자동 세척 로봇"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 transition font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">대상 공정구간 *</label>
                <input
                  id="process-name-input"
                  type="text"
                  placeholder="예: 최종 실링 가공 셀"
                  value={processName}
                  onChange={(e) => setProcessName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 transition font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">투자 비용 (만원)</label>
                  <input
                    id="cost-input"
                    type="number"
                    min="10"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 text-center font-mono focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">연간 기대 이익 (만원)</label>
                  <input
                    id="savings-input"
                    type="number"
                    min="10"
                    value={expectedSavings}
                    onChange={(e) => setExpectedSavings(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 text-center font-mono focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">진행 단계</label>
                <select
                  id="stage-select"
                  value={stage}
                  onChange={(e) => setStage(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 transition font-sans"
                >
                  <option value="기획">기획 (Concept)</option>
                  <option value="설계">설계 (Engineering)</option>
                  <option value="시운전">시운전 (Commissioning)</option>
                  <option value="완료">완료 (Operational)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">상세 제안 사유 및 핵심 설명</label>
                <textarea
                  id="desc-textarea"
                  rows={2}
                  placeholder="BOM 오류 축소 및 현장 피드백 속도 개선 목적..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 transition font-sans"
                />
              </div>
            </div>

            {/* Live ROI Payback display */}
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>예상 투자 회수 기간 (ROI):</span>
              </div>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">
                {calculateROI(cost, expectedSavings)} 년
              </span>
            </div>

            <button
              id="submit-automation-btn"
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-bold rounded-lg transition shadow-md flex items-center justify-center gap-1"
            >
              <Plus className="h-4 w-4" />
              신규 자동화 과제 등록
            </button>
          </form>

          {role === 'junior' && (
            <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
                <Info className="h-4 w-4" />
                신입사원 ROI 꿀팁:
              </span>
              <span>
                보통 제조업에서는 투자 회수 기간(ROI)이 <strong>3년 이하</strong>일 때 우수한 등급으로 평가받으며 예산 승인 확률이 급격히 증가합니다.
              </span>
            </div>
          )}
        </div>

        {/* Right column: Task List & Aggregations */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-4">
          {/* Stat summary bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">총 예산 규모 (CAPEX)</span>
                <span className="text-xl font-bold text-white font-mono mt-1 block">{(totalCapex / 10000).toFixed(2)} 억원</span>
              </div>
              <span className="text-xs font-bold text-slate-500 font-mono">({tasks.length}건)</span>
            </div>
            
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">연간 총 예상 절감액</span>
                <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">{(totalAnnualSavings / 10000).toFixed(2)} 억원</span>
              </div>
              <span className="text-xs font-bold text-emerald-500 font-mono">/ 년</span>
            </div>

            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">평균 투자회수 기간</span>
                <span className="text-xl font-bold text-indigo-400 font-mono mt-1 block">{avgROI} 년</span>
              </div>
              <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold">Good</span>
            </div>
          </div>

          {/* Table list */}
          <div className="bg-slate-850 rounded-xl border border-slate-800 flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
              <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-slate-400" />
                자동화 추진 로드맵 및 상세 리스트
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">신호등 체계 단계 표시</span>
            </div>

            <div className="overflow-x-auto flex-1 max-h-[360px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-medium">
                    <th className="p-3">과제명 및 설명</th>
                    <th className="p-3">대상 공정</th>
                    <th className="p-3 text-right">투자 (만원)</th>
                    <th className="p-3 text-right">절감액 / 년</th>
                    <th className="p-3 text-center">ROI 회수</th>
                    <th className="p-3 text-center">단계 변경</th>
                    <th className="p-3">조치</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tasks.map((p) => {
                    const getStageColor = (s: string) => {
                      switch (s) {
                        case '기획': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                        case '설계': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                        case '시운전': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                        case '완료': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                      }
                    };

                    const getRoiClass = (val: number) => {
                      if (val <= 2) return 'text-emerald-400 font-bold';
                      if (val <= 4) return 'text-amber-400';
                      return 'text-rose-400';
                    };

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 max-w-[200px]">
                          <div className="font-bold text-slate-200">{p.taskName}</div>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight truncate" title={p.description}>
                            {p.description}
                          </p>
                        </td>
                        <td className="p-3 font-medium text-slate-300">{p.processName}</td>
                        <td className="p-3 text-right font-mono text-slate-300">{p.cost.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono text-emerald-400">+{p.expectedSavings.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className={`font-mono text-xs px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 ${getRoiClass(p.roiYears)}`}>
                            {p.roiYears}년
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStageColor(p.stage)}`}>
                              {p.stage}
                            </span>
                            <select
                              id={`stage-change-${p.id}`}
                              value={p.stage}
                              onChange={(e) => updateStage(p.id, e.target.value as any)}
                              className="bg-slate-900 text-slate-300 border border-slate-700 text-[10px] py-0.5 rounded cursor-pointer hover:border-slate-500"
                            >
                              <option value="기획">기획</option>
                              <option value="설계">설계</option>
                              <option value="시운전">시운전</option>
                              <option value="완료">완료</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-3">
                          <button
                            id={`delete-task-btn-${p.id}`}
                            onClick={() => deleteProject(p.id)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer py-1 px-2 hover:bg-rose-500/10 rounded transition"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
