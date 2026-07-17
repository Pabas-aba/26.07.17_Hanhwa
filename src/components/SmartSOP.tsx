import React, { useState, useEffect } from 'react';
import { BookOpen, CheckSquare, AlertOctagon, CheckCircle2, ChevronRight, FileText, Info } from 'lucide-react';
import { SOPDocument, PersonalizationRole } from '../types';
import { initialSOPs } from '../data/mockData';

interface SmartSOPProps {
  role: PersonalizationRole;
}

export const SmartSOP: React.FC<SmartSOPProps> = ({ role }) => {
  const [sops] = useState<SOPDocument[]>(initialSOPs);
  const [selectedSopId, setSelectedSopId] = useState<string>(sops[0]?.id || '');
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  const activeSop = sops.find(s => s.id === selectedSopId) || sops[0];

  // Reset steps when active SOP changes
  useEffect(() => {
    setCompletedSteps({});
  }, [selectedSopId]);

  const toggleStep = (stepNo: number) => {
    const key = `${selectedSopId}-${stepNo}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const stepsCount = activeSop?.steps?.length || 0;
  const completedCount = activeSop?.steps?.filter(s => completedSteps[`${selectedSopId}-${s.stepNo}`]).length || 0;
  const isCompleted = stepsCount > 0 && completedCount === stepsCount;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl" id="smart-sop-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">📖</span>
            스마트 SOP 대시보드 (디지털 표준작업지침서)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            현장 작업용 웹 최적화 뷰어로, 터치 친화적 구조 및 비파괴/안전 규격 준수 체크리스트를 포함합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left pane: SOP Selection list */}
        <div className="lg:col-span-4 space-y-3.5">
          <h3 className="text-xs font-semibold text-slate-450 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <FileText className="h-4 w-4" />
            공정 분류별 표준지침서
          </h3>
          
          <div className="space-y-2">
            {sops.map(sop => {
              const active = sop.id === selectedSopId;
              return (
                <div
                  key={sop.id}
                  id={`sop-select-${sop.id}`}
                  onClick={() => setSelectedSopId(sop.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition active:scale-98 flex items-center justify-between ${
                    active 
                      ? 'bg-sky-500/10 border-sky-500/40 text-white' 
                      : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-sky-400">{sop.docNumber}</div>
                    <h4 className="text-sm font-bold mt-1 line-clamp-1">{sop.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {sop.processType}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">
                        {sop.version}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition ${active ? 'text-sky-400 translate-x-1' : 'text-slate-500'}`} />
                </div>
              );
            })}
          </div>

          {/* Quick instructions for Operator role */}
          {role === 'operator' && (
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3.5 text-xs text-slate-300">
              <span className="font-bold text-amber-400 block mb-1">⚠️ 중요 작업 수칙 (현장 반장단)</span>
              <p className="leading-relaxed">
                항공 품질 표준(AS9100) 보증을 위해 리벳팅 압착력 및 복합소재 씰링 도포는 매 교대조(Shift) 투입 시점마다 바코드를 연동 확인하십시오.
              </p>
            </div>
          )}
        </div>

        {/* Right pane: Interactive Steps */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {activeSop ? (
            <div className="space-y-4">
              {/* Active SOP Title Header */}
              <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded font-mono font-bold px-1.5 py-0.5">
                      {activeSop.docNumber}
                    </span>
                    <span className="text-xs text-slate-400">개정일자: {activeSop.lastUpdated}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1.5">{activeSop.title}</h3>
                </div>
                
                {/* Visual completion progress bar */}
                <div className="min-w-[130px] flex flex-col items-end gap-1 shrink-0">
                  <div className="text-xs font-semibold text-slate-300">
                    진척도: <span className="font-mono text-sky-400">{completedCount}</span> / {stepsCount} 완료
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-sky-400 transition-all duration-300"
                      style={{ width: `${(completedCount / stepsCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Completion Banner */}
              {isCompleted && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 animate-fadeIn">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold block">표준 작업 프로세스 검증 완료!</span>
                    <span className="text-slate-300">모든 예방 단계 및 인가 압력을 정확히 확인하였습니다. 비파괴 시험을 연계 개시하십시오.</span>
                  </div>
                </div>
              )}

              {/* Interactive Step Card items */}
              <div className="space-y-3">
                {activeSop.steps.map(step => {
                  const key = `${selectedSopId}-${step.stepNo}`;
                  const done = !!completedSteps[key];
                  
                  return (
                    <div 
                      key={step.stepNo}
                      id={`sop-step-${step.stepNo}`}
                      onClick={() => toggleStep(step.stepNo)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 relative ${
                        done 
                          ? 'bg-slate-900 border-slate-750 opacity-75' 
                          : 'bg-slate-850 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Checkbox indicator */}
                      <div className="flex items-start gap-3.5">
                        <button
                          id={`check-step-btn-${step.stepNo}`}
                          type="button"
                          className={`mt-1 h-6 w-6 rounded-md flex items-center justify-center shrink-0 border transition ${
                            done 
                              ? 'bg-emerald-500 text-slate-900 border-emerald-600' 
                              : 'bg-slate-900 text-transparent border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/15">
                              단계 {step.stepNo}
                            </span>
                            <h4 className={`text-sm font-bold ${done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                              {step.title}
                            </h4>
                          </div>
                          
                          <p className={`mt-2 text-xs leading-relaxed ${done ? 'text-slate-500' : 'text-slate-300'}`}>
                            {step.description}
                          </p>

                          {/* Action warning highlighted card */}
                          {step.warning && (
                            <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-start gap-2 text-amber-200 text-xs">
                              <AlertOctagon className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-amber-300 block mb-0.5">⚠️ 공정 위해/품질 주의:</span>
                                {step.warning}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs font-medium">
              표준 작업서를 선택하여 절차를 개시해 주십시오.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
