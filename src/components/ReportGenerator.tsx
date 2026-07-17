import React, { useState } from 'react';
import { FileSpreadsheet, FilePieChart, Download, Check, Sparkles, Loader2, FileDown, BookOpen, Clock } from 'lucide-react';
import { PersonalizationRole } from '../types';

interface ReportGeneratorProps {
  role: PersonalizationRole;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  format: 'Excel' | 'PPT';
  lastGenerated: string;
  dataPoints: string[];
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ role }) => {
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [customMemo, setCustomMemo] = useState('금일 C동 복합소재 경화 온도 편차 관련 설비 개선 조치 완료로 가동률 12% 반등 회복.');

  const templates: ReportTemplate[] = [
    {
      id: 'REP-01',
      name: '금일 생산 종합 실적 보고서 (Daily Production Log)',
      description: '목표 계획 대비 실질 달성량(BOM 연동 및 손실 수치 포함) 데이터 리포트.',
      format: 'Excel',
      lastGenerated: '오늘 18:00',
      dataPoints: ['생산 달성률 89.2%', 'Yield 불량율 2.4%', 'OEE 장비 효율 88.5%', 'BOM 자재 부족 수량 2건']
    },
    {
      id: 'REP-02',
      name: '공정 병목 및 수율 분석 보고서 (Capa & Defect Root-Cause)',
      description: '5분할 주요 가공 셀의 Cycle Time 밸런싱 비율 및 주축 과부하 원인 사후 분석.',
      format: 'PPT',
      lastGenerated: '어제 17:30',
      dataPoints: ['병목지점: 최종 실링공정 (180초)', '밸런싱율: 68%', '주요고장: Spindle 마모부하 (1건)']
    },
    {
      id: 'REP-03',
      name: '스마트 현장 개선 및 제안 활동 총괄 보고서',
      description: '제안 게시판 내 안전, 원가, 품질 개선 과제 수렴 현황 및 처리 결과 종합.',
      format: 'Excel',
      lastGenerated: '2026-07-15',
      dataPoints: ['총 제안수: 3건', '검토중: 1건', '적용완료: 2건', '환산 절감액: 연간 5,500만원']
    }
  ];

  const handleExport = (template: ReportTemplate) => {
    setExportingId(template.id);
    setSuccessMsg(null);
    
    // Simulate real exporting server response
    setTimeout(() => {
      setExportingId(null);
      const filename = template.format === 'Excel' 
        ? `AeroTech_${template.id}_20260716.xlsx`
        : `AeroTech_${template.id}_20260716.pptx`;
      
      setSuccessMsg(`성공적으로 파일 추출이 완료되었습니다!\n파일명: [ ${filename} ]\n사내 레거시 SAP 전송 및 로컬 다운로드가 완료되었습니다.`);
    }, 1800);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl" id="report-generator-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">📊</span>
            One-Click 보고서 자동 생성 (Standard Output)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            파편화된 실적, 불량 원인, Capa 분석 결과를 종합하여 표준 양식의 오피스 파일(Excel/PPT)로 단번에 추출합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left pane: Template List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 px-1">
            <FileDown className="h-4 w-4" />
            선택 가능한 사내 공식 보고 양식
          </h3>

          <div className="space-y-3.5">
            {templates.map(temp => {
              const loading = exportingId === temp.id;
              return (
                <div key={temp.id} className="p-5 bg-slate-850 rounded-xl border border-slate-800 hover:border-slate-750 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        temp.format === 'Excel' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {temp.format} 포맷
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {temp.id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1.5">{temp.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{temp.description}</p>
                    
                    {/* Live preview dataset */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {temp.dataPoints.map((pt, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {pt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    id={`export-btn-${temp.id}`}
                    disabled={exportingId !== null}
                    onClick={() => handleExport(temp)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap active:scale-98 ${
                      loading 
                        ? 'bg-slate-800 text-slate-500 border border-slate-700' 
                        : temp.format === 'Excel'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                          : 'bg-orange-600 hover:bg-orange-500 text-white shadow'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        추출 가공 중...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        자동 작성 및 다운
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3 text-emerald-400 animate-fadeIn">
              <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5 bg-emerald-500/20 p-1 rounded-full" />
              <div className="text-xs leading-relaxed whitespace-pre-line">
                <span className="font-bold block text-sm mb-1">인쇄용 오피스 생성 성공!</span>
                {successMsg}
              </div>
            </div>
          )}
        </div>

        {/* Right pane: Custom parameters & interactive previewer */}
        <div className="lg:col-span-5">
          <div className="p-5 bg-slate-850 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              보고서 종합 특기사항 수기 입력
            </h3>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                일지 하단 기술 소견 / 원인 요약 (수기 결재선 첨부용):
              </label>
              <textarea
                id="custom-memo-textarea"
                rows={4}
                value={customMemo}
                onChange={(e) => setCustomMemo(e.target.value)}
                className="w-full p-3 text-xs bg-slate-900 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-mono font-bold">
                <span>실시간 보고서 워터마크 미리보기</span>
                <span className="text-emerald-400">보안 등급 2급</span>
              </div>
              <div className="border border-dashed border-slate-800 p-3 rounded bg-slate-950/40 font-serif text-slate-400 text-[11px] leading-relaxed">
                <p className="font-bold border-b border-slate-800 pb-1.5 mb-1.5 text-center text-xs tracking-wider font-sans text-slate-300">
                  AERO-TECH REPORT EXECUTIVE SUMMARY
                </p>
                <div className="space-y-1 font-mono text-[10px]">
                  <div>• 일시: 2026년 07월 16일 (야간교대조 마감)</div>
                  <div>• 종합 Yield: 97.6% (티타늄 5축가공 최적화 효과)</div>
                  <div>• 특이사항: {customMemo}</div>
                </div>
              </div>
            </div>

            {role === 'junior' && (
              <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/15 rounded-xl text-[11px] text-slate-300 leading-relaxed">
                <span className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
                  <BookOpen className="h-4 w-4" />
                  보고 양식 교육 가이드:
                </span>
                <span>
                  공식 월간 실적 보고 시에는 상단 <strong>BOM 연동 대시보드 리드타임</strong> 지표와 <strong>설비 정지율 분석(OEE)</strong> 표를 함께 연동하여 결재선을 올리는 것이 원칙입니다.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
