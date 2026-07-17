import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Settings, 
  TrendingUp, 
  Package, 
  Activity, 
  CheckSquare, 
  BookOpen, 
  Users, 
  FileDown, 
  Lightbulb, 
  CheckCircle,
  Truck,
  RotateCcw,
  Zap,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { 
  ProductionSchedule, 
  BOMPart, 
  PersonalizationRole 
} from './types';
import { initialSchedules, initialBOMParts } from './data/mockData';
import { MetricCard } from './components/MetricCard';
import { CapaSimulator } from './components/CapaSimulator';
import { TroubleShootingDB } from './components/TroubleShootingDB';
import { SmartSOP } from './components/SmartSOP';
import { AutomationROI } from './components/AutomationROI';
import { ReportGenerator } from './components/ReportGenerator';
import { IdeaBoard } from './components/IdeaBoard';

export default function App() {
  const [role, setRole] = useState<PersonalizationRole>('junior');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'capa' | 'trouble' | 'reports'>('dashboard');

  // Interactive core states
  const [schedules, setSchedules] = useState<ProductionSchedule[]>(initialSchedules);
  const [bomParts, setBomParts] = useState<BOMPart[]>(initialBOMParts);

  // Quick Action: Increment actual quantity for a line
  const handleIncrementActual = (id: string) => {
    setSchedules(prev => prev.map(s => {
      if (s.id === id) {
        const nextActual = Math.min(s.planQty, s.actualQty + 1);
        const achievement = (nextActual / s.planQty) * 100;
        
        let nextStatus: 'normal' | 'warning' | 'danger' = 'danger';
        if (achievement >= 90) nextStatus = 'normal';
        else if (achievement >= 60) nextStatus = 'warning';

        return {
          ...s,
          actualQty: nextActual,
          status: nextStatus
        };
      }
      return s;
    }));
  };

  // Quick Action: Order critical fasteners to replenish stock
  const handleReplenishStock = (id: string) => {
    setBomParts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStock = p.stock + 200;
        return {
          ...p,
          stock: nextStock,
          status: nextStock >= p.minSafetyStock ? 'normal' : 'warning'
        };
      }
      return p;
    }));
  };

  // Global KPI derivations
  const totalPlanned = schedules.reduce((sum, s) => sum + s.planQty, 0);
  const totalActual = schedules.reduce((sum, s) => sum + s.actualQty, 0);
  const totalAchievement = Math.round((totalActual / totalPlanned) * 100);

  const totalShortages = bomParts.filter(p => p.status === 'danger').length;
  const globalYield = 98.2; // simulated target
  const globalOEE = Math.round(84 + (totalAchievement * 0.05)); // dynamically correlates with actual production rate

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white" id="main-portal">
      
      {/* Top Professional Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="portal-header">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 p-2 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Gauge className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
              Aero-Tech Navigator
              <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-1.5 py-0.5 rounded-full">
                v1.0 Standard
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              스마트 제조생산기술 통합 관리 플랫폼 • 산업공학 정합 관제실
            </p>
          </div>
        </div>

        {/* Dynamic Personalization Switcher */}
        <div className="flex items-center bg-slate-950 border border-slate-800 p-1.5 rounded-2xl gap-1 shadow-inner" id="role-switcher-container">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-2 font-mono">대시보드 개인화:</span>
          
          <button
            id="role-btn-junior"
            onClick={() => setRole('junior')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1 select-none cursor-pointer ${
              role === 'junior' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            신입사원용 (가이드 탑재)
          </button>
          
          <button
            id="role-btn-senior"
            onClick={() => setRole('senior')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1 select-none cursor-pointer ${
              role === 'senior' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            숙련 엔지니어용
          </button>

          <button
            id="role-btn-operator"
            onClick={() => setRole('operator')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1 select-none cursor-pointer ${
              role === 'operator' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            현장작업 반장용 (SOP)
          </button>
        </div>
      </header>

      {/* Main Submodule Router Tabs */}
      <nav className="bg-slate-900 border-b border-slate-800/80 px-6 py-2.5 flex gap-2 overflow-x-auto" id="portal-navigation-tabs">
        <button
          id="tab-dashboard"
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer select-none whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'dashboard' 
              ? 'bg-slate-800 text-white border border-slate-700/80 shadow' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <Activity className="h-4 w-4" />
          1. 통합 현황 & 자재 대시보드
        </button>
        <button
          id="tab-capa"
          onClick={() => setActiveTab('capa')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer select-none whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'capa' 
              ? 'bg-slate-800 text-white border border-slate-700/80 shadow' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          2. Capa 시뮬레이터 & 자동화 ROI
        </button>
        <button
          id="tab-trouble"
          onClick={() => setActiveTab('trouble')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer select-none whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'trouble' 
              ? 'bg-slate-800 text-white border border-slate-700/80 shadow' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          3. 고장대응 DB & 스마트 SOP
        </button>
        <button
          id="tab-reports"
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer select-none whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'reports' 
              ? 'bg-slate-800 text-white border border-slate-700/80 shadow' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <FileDown className="h-4 w-4" />
          4. 보고서 자동 추출 & 개선제안 보드
        </button>
      </nav>

      {/* Main Content Dashboard Area */}
      <main className="flex-1 p-6 space-y-6 max-w-7.5xl mx-auto w-full" id="portal-viewport">
        
        {/* Dynamic Personalization Information Block */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900/20 via-sky-900/10 to-slate-900 border border-indigo-500/10 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm" id="role-welcome-banner">
          <div className="flex gap-3.5 items-start">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono">
                {role === 'junior' ? '신입 엔지니어 맞춤 뷰' : role === 'senior' ? '고참/엔지니어 심화 가속 뷰' : '현장 작업 반장 전용 대시보드'}
              </span>
              <h2 className="text-base font-bold text-white mt-1.5">
                {role === 'junior' 
                  ? '반갑습니다! Aero-Tech Navigator를 통해 사내 수기 문서와 SAP 데이터를 빠르게 파악해보세요.' 
                  : role === 'senior'
                    ? '실시간 공정 Capa Bottleneck 현황 및 원가 절감 과제(ROI)를 심화 시뮬레이션 하실 수 있습니다.'
                    : '표준 작업서(SOP) 순서 준수율 및 주요 볼트 등 자재 쇼티지 상황을 즉시 확인하십시오.'}
              </h2>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono text-left md:text-right shrink-0 bg-slate-900/50 border border-slate-800 px-3.5 py-2 rounded-xl">
            <div>조회시각: 2026-07-16 18:04:36</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              정상 데이터 연동 상태 (MES/SAP)
            </div>
          </div>
        </div>

        {/* TAB 1: INTEGRATED STATUS & CORE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn" id="dashboard-view">
            
            {/* Top Row: Touch Friendly Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="dashboard-kpis">
              <MetricCard
                id="kpi-oee"
                title="설비 종합 가동률 (OEE)"
                value={`${globalOEE}%`}
                subValue="+1.2%"
                icon={Activity}
                status={globalOEE >= 85 ? 'normal' : 'warning'}
                description="주요 티타늄 CNC 가공 장비 가동 합산 기준"
                showTooltip={role === 'junior'}
                tooltipText="OEE(Overall Equipment Effectiveness)는 설비 시간, 속도 및 성능 수율을 가치화한 지표로 통상 85% 이상이 글로벌 최고 수준입니다."
              />
              <MetricCard
                id="kpi-yield"
                title="종합 공정 수율 (Yield)"
                value={`${globalYield}%`}
                subValue="목표대비 정상"
                icon={TrendingUp}
                status="normal"
                description="리벳 불량 대폭 개선, 항전 하네스 수율 100% 근접"
                showTooltip={role === 'junior'}
                tooltipText="수율(Yield)은 투입된 원소재 대비 정상 완제품 합격 비율입니다. 98% 이상 유지가 현 날개 조립 라인의 수치입니다."
              />
              <MetricCard
                id="kpi-shortage"
                title="자재 부족 알림 (Shortages)"
                value={totalShortages === 0 ? '정상 수급' : `${totalShortages}건 발생`}
                subValue={totalShortages > 0 ? '조치 대기' : 'BOM 충족'}
                icon={Package}
                status={totalShortages > 0 ? 'danger' : 'normal'}
                description="리드타임 고려 부품 수급 상황"
                showTooltip={role === 'junior'}
                tooltipText="재고 수준이 최소 안전재고 이하로 떨어질 경우 경보등이 켜지며 수입 발주 리드타임을 고려하여 선제 수급이 필수적입니다."
              />
            </div>

            {/* Middle Row: Production Targets & BOM Alert */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Plan vs Actual Schedule */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between" id="production-schedules-container">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">📅</span>
                        오늘 생산 일정 및 실시간 진행률 (SAP/MES 연동)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        목표 대비 실시간 실적이며, 조작 편의를 위해 터치 버튼으로 실적 입력을 시뮬레이션할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {schedules.map(sch => {
                      const pct = Math.round((sch.actualQty / sch.planQty) * 100);
                      
                      return (
                        <div key={sch.id} className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex flex-col gap-3">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">{sch.line}</div>
                              <h4 className="text-sm font-bold text-slate-200 mt-1">{sch.partName}</h4>
                            </div>
                            
                            {/* Touch-friendly Big actual-increment button */}
                            <button
                              id={`increment-actual-btn-${sch.id}`}
                              onClick={() => handleIncrementActual(sch.id)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white rounded-xl shadow-md transition flex items-center gap-1 cursor-pointer select-none"
                            >
                              +1 완료 입력
                            </button>
                          </div>

                          {/* Progress slider bar visualization */}
                          <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-slate-400">계획: {sch.planQty}대 / 실적: <span className="text-white font-bold">{sch.actualQty}대</span></span>
                              <span className={`font-mono font-bold ${sch.status === 'normal' ? 'text-emerald-400' : sch.status === 'warning' ? 'text-amber-400' : 'text-rose-400'}`}>
                                {pct}% 달성
                              </span>
                            </div>

                            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                              <div 
                                className={`h-3 rounded-full transition-all duration-300 ${
                                  sch.status === 'normal' 
                                    ? 'bg-emerald-500' 
                                    : sch.status === 'warning' 
                                      ? 'bg-amber-500' 
                                      : 'bg-rose-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                            <span>가동 목표 시간: {sch.startTime} - {sch.endTime}</span>
                            <span className="flex items-center gap-1 font-bold">
                              <span className={`h-2.5 w-2.5 rounded-full ${
                                sch.status === 'normal' ? 'bg-emerald-500' : sch.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                              }`} />
                              {sch.status === 'normal' ? '차질 없음 (GREEN)' : sch.status === 'warning' ? '일정 지연주의 (YELLOW)' : '자재부족 중단 (RED)'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {role === 'junior' && (
                  <div className="mt-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-[11px] text-slate-350 flex gap-2">
                    <span className="font-bold text-indigo-400 text-xs select-none">💡</span>
                    <span>
                      <strong>계획 대비 달성률(Plan vs Actual):</strong> 생산 달성률이 60% 미만(빨간색)일 때는 긴급 원인 분석 혹은 안전 점검이 요구됩니다. 우측의 BOM 부족 부품 수량을 즉시 연동 파악하십시오.
                    </span>
                  </div>
                )}
              </div>

              {/* Right Side: BOM & Material alerts */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between" id="bom-parts-container">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">📦</span>
                        BOM 기반 주요 핵심부품 재고 부족 알림
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        안전재고 수준 이하 부품은 수급 중단 위기를 경고합니다.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {bomParts.map(part => {
                      const isShortage = part.status === 'danger';
                      
                      return (
                        <div key={part.id} className={`p-4 rounded-xl border transition ${
                          isShortage 
                            ? 'bg-rose-500/5 border-rose-500/30' 
                            : part.status === 'warning'
                              ? 'bg-amber-500/5 border-amber-500/30'
                              : 'bg-slate-850 border-slate-800'
                        }`}>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono text-slate-500 font-bold">{part.partNumber}</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-slate-400">
                                  {part.category}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-200 mt-1">{part.partName}</h4>
                            </div>

                            {/* Touch Friendly Order Stock Button */}
                            {isShortage && (
                              <button
                                id={`replenish-btn-${part.id}`}
                                onClick={() => handleReplenishStock(part.id)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-[10px] font-extrabold text-white rounded-lg flex items-center gap-1 cursor-pointer shadow-md transition"
                              >
                                <Truck className="h-3 w-3" />
                                긴급 긴급 충원 발주
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2 mt-3 text-xs border-t border-slate-800/50 pt-2 text-slate-400 font-mono">
                            <div>
                              <span className="text-[10px] text-slate-500 block">현재 고 재고</span>
                              <span className={`font-bold ${isShortage ? 'text-rose-400' : 'text-slate-200'}`}>
                                {part.stock} {part.unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">최소 안전재고</span>
                              <span className="font-semibold text-slate-350">{part.minSafetyStock} {part.unit}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">조치 리드타임</span>
                              <span className="font-semibold text-slate-350">{part.leadTimeDays} 일</span>
                            </div>
                          </div>

                          {isShortage && (
                            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-rose-300 font-bold bg-rose-500/10 border border-rose-500/20 rounded p-1.5">
                              <ShieldAlert className="h-3 w-3 animate-bounce text-rose-400" />
                              <span>⚠️ 안전재고 {part.minSafetyStock - part.stock} EA 부족! 긴급 충원하여 라인 다운타임을 막으십시오.</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">BOM 파트 안전재고 정상 충족 현황:</span>
                  <span className="font-bold text-indigo-400">
                    {bomParts.filter(p => p.status === 'normal').length} / {bomParts.length} 정상
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CAPA SIMULATOR & AUTOMATION ROI */}
        {activeTab === 'capa' && (
          <div className="space-y-6 animate-fadeIn" id="capa-view">
            <CapaSimulator role={role} />
            <AutomationROI role={role} />
          </div>
        )}

        {/* TAB 3: TROUBLESHOOTING DB & SMART SOP */}
        {activeTab === 'trouble' && (
          <div className="space-y-6 animate-fadeIn" id="trouble-view">
            <TroubleShootingDB role={role} />
            <SmartSOP role={role} />
          </div>
        )}

        {/* TAB 4: REPORTS & IDEAS COMMUNITY */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn" id="reports-view">
            <ReportGenerator role={role} />
            <IdeaBoard role={role} />
          </div>
        )}

      </main>

      {/* Global Aerospace Industrial Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12" id="portal-footer">
        <div>
          <span className="font-bold text-slate-400">Aero-Tech Navigator Portal</span> • 제조생산기술팀 1급 기밀자료
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-400">
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            AS9100 Aerospace Certified
          </span>
          <span>© 2026 Aero-Tech Inc.</span>
        </div>
      </footer>
    </div>
  );
}
