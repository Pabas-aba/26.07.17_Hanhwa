import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, Users, Clock, Info, HelpCircle } from 'lucide-react';
import { CapaProcess, PersonalizationRole } from '../types';

interface CapaSimulatorProps {
  role: PersonalizationRole;
}

const defaultProcesses: CapaProcess[] = [
  { name: '1. 정밀 절단 및 가공 (Cutting)', cycleTime: 45, workers: 2 },
  { name: '2. 정렬 및 가체결 (Fixturing)', cycleTime: 90, workers: 3 },
  { name: '3. 정밀 로봇 리벳팅 (Riveting)', cycleTime: 120, workers: 2 },
  { name: '4. 최종 실링 및 씰 경화 (Sealing)', cycleTime: 180, workers: 1 },
  { name: '5. 초음파 비파괴 검사 (NDT)', cycleTime: 75, workers: 2 }
];

export const CapaSimulator: React.FC<CapaSimulatorProps> = ({ role }) => {
  const [workersMultiplier, setWorkersMultiplier] = useState<number>(10); // total workforce
  const [shiftHours, setShiftHours] = useState<number>(8); // shift length in hours
  const [processes, setProcesses] = useState<CapaProcess[]>(defaultProcesses);
  const [simulationResult, setSimulationResult] = useState<{
    bottleneck: string;
    bottleneckTime: number;
    dailyCapaQty: number;
    lineBalanceRate: number;
    utilization: number;
  }>({
    bottleneck: '',
    bottleneckTime: 0,
    dailyCapaQty: 0,
    lineBalanceRate: 0,
    utilization: 0
  });

  const handleCycleTimeChange = (index: number, val: number) => {
    const updated = [...processes];
    updated[index].cycleTime = Math.max(1, val);
    setProcesses(updated);
  };

  const handleWorkersChange = (index: number, val: number) => {
    const updated = [...processes];
    updated[index].workers = Math.max(1, val);
    setProcesses(updated);
  };

  const resetSimulator = () => {
    setProcesses(JSON.parse(JSON.stringify(defaultProcesses)));
    setShiftHours(8);
  };

  useEffect(() => {
    // Math logic for industrial engineering capacity simulation
    // Each process capacity is: (Workers * 3600 seconds/hr * ShiftHours) / CycleTime
    let bottleneckProcessName = '';
    let maxEffectiveCycleTime = 0; // cycleTime divided by workers representing throughput rate per cell

    const processCapas = processes.map(p => {
      const effectiveCycleTime = p.cycleTime / p.workers; // seconds per single unit output from this station
      if (effectiveCycleTime > maxEffectiveCycleTime) {
        maxEffectiveCycleTime = effectiveCycleTime;
        bottleneckProcessName = p.name;
      }
      return {
        ...p,
        effectiveCycleTime
      };
    });

    const shiftSeconds = shiftHours * 3600;
    // Daily Capacity is limited by the slowest (bottleneck) process
    const dailyCapaQty = Math.floor(shiftSeconds / maxEffectiveCycleTime);

    // Line Balancing calculations
    // Line Balance Rate = (Sum of effective cycle times) / (Number of stations * maxEffectiveCycleTime) * 100
    const sumEffectiveTime = processCapas.reduce((acc, curr) => acc + curr.effectiveCycleTime, 0);
    const lineBalanceRate = Math.round((sumEffectiveTime / (processes.length * maxEffectiveCycleTime)) * 100);

    // Average utilization simulation based on line balance & workforce layout
    const avgUtilization = Math.round(lineBalanceRate * 0.95);

    setSimulationResult({
      bottleneck: bottleneckProcessName,
      bottleneckTime: Math.round(maxEffectiveCycleTime),
      dailyCapaQty,
      lineBalanceRate,
      utilization: avgUtilization
    });
  }, [processes, shiftHours]);

  // Max effective cycle time for rendering charts nicely
  const maxEff = Math.max(...processes.map(p => p.cycleTime / p.workers), 1);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl" id="capa-simulator-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">📊</span>
            공정 Capa. 시뮬레이터 (산업공학 분석)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            가동 시간, 인력, 공정별 Cycle Time을 즉석 변경하여 가동률 제약 조건과 병목 라인을 계산합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="reset-capa-btn"
            onClick={resetSimulator}
            className="flex items-center gap-1 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-850 hover:bg-slate-800 active:scale-98 border border-slate-700 rounded-xl transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            초기화
          </button>
        </div>
      </div>

      {/* Senior vs Junior role description banner */}
      {role === 'junior' && (
        <div className="mt-4 rounded-xl bg-sky-500/10 border border-sky-500/20 p-4 flex gap-3 text-xs leading-relaxed text-sky-200">
          <Info className="h-5 w-5 text-sky-400 shrink-0" />
          <div>
            <span className="font-bold text-sky-300">💡 산업공학 가이드 - 캡(Capa) 분석 핵심 용어:</span>
            <ul className="list-disc list-inside mt-1.5 space-y-1">
              <li><strong>병목 (Bottleneck):</strong> 공정 중 속도가 가장 느려 전체 생산 속도를 결정짓는 목구멍 구간입니다.</li>
              <li><strong>Cycle Time (CT):</strong> 한 공정에서 하나의 제품을 완성하는 데 걸리는 초단위 시간입니다.</li>
              <li><strong>라인 밸런싱 (Line Balancing):</strong> 공정 간 지연 편차를 줄여 균일하게 정렬하는 설계 기술입니다.</li>
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left column: Simulator Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-4 bg-slate-850 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-400" />
              기본 가동 조건 설정
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                  <span>일일 소요 가동 시간:</span>
                  <span className="font-bold text-emerald-400">{shiftHours} 시간</span>
                </div>
                <input
                  id="shift-hours-slider"
                  type="range"
                  min="4"
                  max="24"
                  step="1"
                  value={shiftHours}
                  onChange={(e) => setShiftHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>4시간 (반일)</span>
                  <span>8시간 (정상)</span>
                  <span>12시간 (잔업)</span>
                  <span>24시간 (특근)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-indigo-400" />
              공정별 세부 파라미터 세팅
            </h3>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {processes.map((p, idx) => {
                const effTime = Math.round(p.cycleTime / p.workers);
                const isBottleneck = p.name === simulationResult.bottleneck;
                
                return (
                  <div key={idx} className={`p-3 rounded-lg border transition ${isBottleneck ? 'bg-amber-500/5 border-amber-500/30' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-200">{p.name}</span>
                      {isBottleneck && (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 animate-pulse border border-amber-500/40">
                          <AlertTriangle className="h-3 w-3" />
                          병목구간 (Bottleneck)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Cycle Time (초)</label>
                        <div className="flex items-center gap-1">
                          <input
                            id={`ct-input-${idx}`}
                            type="number"
                            min="1"
                            max="999"
                            value={p.cycleTime}
                            onChange={(e) => handleCycleTimeChange(idx, Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs bg-slate-800 text-white rounded border border-slate-700 text-center font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">배치 작업 인원 (명)</label>
                        <div className="flex items-center gap-1">
                          <input
                            id={`workers-input-${idx}`}
                            type="number"
                            min="1"
                            max="10"
                            value={p.workers}
                            onChange={(e) => handleWorkersChange(idx, Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs bg-slate-800 text-white rounded border border-slate-700 text-center font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>실질 분당 처리량:</span>
                      <span>{(60 / effTime).toFixed(1)} EA / min ({effTime}초당 1대)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Simulation Output Charts & KPIs */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">예측 일일 총 생산량</span>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-white font-mono">{simulationResult.dailyCapaQty}</span>
                <span className="text-xs text-slate-400 ml-1 font-semibold">EA / 일</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-tight">
                하루 {shiftHours}시간 기준 병목 한계 처리 수준
              </p>
            </div>

            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">라인 밸런싱 효율</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-3xl font-extrabold font-mono ${simulationResult.lineBalanceRate >= 80 ? 'text-emerald-400' : simulationResult.lineBalanceRate >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {simulationResult.lineBalanceRate}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full ${simulationResult.lineBalanceRate >= 80 ? 'bg-emerald-500' : simulationResult.lineBalanceRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${simulationResult.lineBalanceRate}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-tight">
                80% 이상: 공정 분배 최적화 상태 우수
              </p>
            </div>

            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">설비 시뮬레이터 OEE 예측</span>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-indigo-400 font-mono">{simulationResult.utilization}%</span>
                <span className="text-xs text-slate-400 ml-1">가동률</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-tight">
                라인 밸런스 기반의 가상 가동률
              </p>
            </div>
          </div>

          {/* Custom SVG Line Balancing Chart */}
          <div className="p-5 bg-slate-850 rounded-xl border border-slate-800 flex-1 flex flex-col">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>📊 공정별 실질 처리속도 균일도 (Effective Cycle Time)</span>
              <span className="text-[10px] font-mono font-medium text-slate-400">단위: 초 / EA (낮을수록 우수)</span>
            </h3>

            {/* Custom SVG Chart */}
            <div className="flex-1 min-h-[220px] flex items-end justify-between gap-3 mt-2 px-2 pb-6 border-b border-slate-800 relative">
              {/* Horizontal gridlines */}
              <div className="absolute inset-x-0 bottom-6 border-t border-slate-800 h-0 w-full" style={{ bottom: '25%' }} />
              <div className="absolute inset-x-0 bottom-6 border-t border-slate-800 h-0 w-full" style={{ bottom: '50%' }} />
              <div className="absolute inset-x-0 bottom-6 border-t border-slate-800 h-0 w-full" style={{ bottom: '75%' }} />

              {processes.map((p, index) => {
                const effTime = p.cycleTime / p.workers;
                const percentage = (effTime / maxEff) * 100;
                const isBottleneck = p.name === simulationResult.bottleneck;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative z-10">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-all bg-slate-950 text-white text-[10px] py-1 px-2.5 rounded border border-slate-700 whitespace-nowrap shadow-lg">
                      <span className="font-bold">효과속도: {Math.round(effTime)}초</span> (인원 {p.workers}명)
                    </div>

                    {/* Bar chart bar */}
                    <div className="w-full max-w-[42px] bg-slate-800 rounded-t-md overflow-hidden flex items-end h-[160px] relative">
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-300 ${isBottleneck ? 'bg-amber-500' : 'bg-indigo-500 group-hover:bg-indigo-400'}`}
                        style={{ height: `${percentage}%` }}
                      />
                    </div>

                    {/* Processing values */}
                    <span className="mt-2 text-xs font-mono font-bold text-slate-200">
                      {Math.round(effTime)}s
                    </span>

                    {/* Label */}
                    <span className="text-[9px] text-slate-400 font-medium text-center mt-1 truncate max-w-[90px]" title={p.name}>
                      {p.name.split(' (')[1]?.replace(')', '') || p.name}
                    </span>
                  </div>
                );
              })}

              {/* Bottleneck threshold guide line */}
              <div 
                className="absolute left-0 right-0 border-t-2 border-dashed border-rose-500/80 z-20 transition-all duration-300"
                style={{ bottom: '160px', height: '0px' }}
              >
                <span className="absolute -top-5 right-0 text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded">
                  병목 한계선 ({simulationResult.bottleneckTime}초)
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  일반 공정
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  제약(병목) 공정
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans">
                💡 팁: 인력을 재배치하거나 장비 자동화를 도입해 병목 초를 낮추면 일일 생산량이 급증합니다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
