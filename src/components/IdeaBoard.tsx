import React, { useState } from 'react';
import { ThumbsUp, Plus, Lightbulb, User, ShieldCheck, Milestone, MessageSquare, Info, Filter } from 'lucide-react';
import { ImprovementProposal, PersonalizationRole } from '../types';
import { initialIdeas } from '../data/mockData';

interface IdeaBoardProps {
  role: PersonalizationRole;
}

export const IdeaBoard: React.FC<IdeaBoardProps> = ({ role }) => {
  const [proposals, setProposals] = useState<ImprovementProposal[]>(initialIdeas);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Safety' | 'Quality' | 'Efficiency' | 'Cost'>('Safety');
  const [description, setDescription] = useState('');
  const [expectedEffect, setExpectedEffect] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form validations
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !expectedEffect) {
      setErrorMsg('제목, 내용, 기대효과는 반드시 입력해야 합니다.');
      return;
    }
    setErrorMsg('');

    const newIdea: ImprovementProposal = {
      id: `IP-0${proposals.length + 1}`,
      title,
      category,
      description,
      expectedEffect,
      author: authorName || (role === 'junior' ? '신입 공정엔지니어' : '현장 실무팀'),
      department: role === 'operator' ? '생산조립반' : '제조기술혁신팀',
      likes: 0,
      status: '제안',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProposals([newIdea, ...proposals]);
    
    // reset
    setTitle('');
    setCategory('Safety');
    setDescription('');
    setExpectedEffect('');
    setAuthorName('');
    setShowAddForm(false);
  };

  const handleLike = (id: string) => {
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const updateStatus = (id: string, newStatus: '제안' | '검토중' | '개발중' | '적용완료') => {
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const filteredProposals = selectedCategory 
    ? proposals.filter(p => p.category === selectedCategory)
    : proposals;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl" id="idea-board-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">💡</span>
            현장 개선 아이디어 보드 (Idea Community)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            작업자와 기술 엔지니어가 모여 생산성 혁신 제안을 공유하고, 상호 투표와 심사 과정을 투명하게 공개합니다.
          </p>
        </div>
        <button
          id="toggle-add-idea-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 active:scale-98 rounded-xl transition shadow-md cursor-pointer select-none"
        >
          {showAddForm ? '돌아가기 (목록 보기)' : '신규 개선 제안 올리기'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left side: Add Form / Category statistics */}
        <div className="lg:col-span-4 space-y-4">
          {showAddForm ? (
            <form onSubmit={handleAddProposal} className="p-5 bg-slate-850 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
                <Lightbulb className="h-4 w-4" />
                현장 설비 / 프로세스 개선 제안 작성
              </h3>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded">
                  ⚠️ {errorMsg}
                </p>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">제안 한줄 제목 *</label>
                  <input
                    id="idea-title-input"
                    type="text"
                    placeholder="예: 초음파 진동 센서 쉴드 커버 형상 변형 제안"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">분류 카테고리</label>
                    <select
                      id="idea-category-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 font-sans"
                    >
                      <option value="Safety">안전 (Safety)</option>
                      <option value="Quality">품질 (Quality)</option>
                      <option value="Efficiency">공정효율 (Efficiency)</option>
                      <option value="Cost">원가절감 (Cost)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">제안자 이름 (부서)</label>
                    <input
                      id="idea-author-input"
                      type="text"
                      placeholder="예: 홍길동 선임"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">상세 문제점 및 개선안 설명 *</label>
                  <textarea
                    id="idea-desc-textarea"
                    rows={3}
                    placeholder="현장에서 느끼는 불편함과 구체적인 하드웨어/절차적 보완 방안을 기술하세요."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">예상 정량/정성적 기대 효과 *</label>
                  <textarea
                    id="idea-effect-textarea"
                    rows={2}
                    placeholder="예: 가공 에러 대기 시간 15분 단축, 파손비 절감..."
                    value={expectedEffect}
                    onChange={(e) => setExpectedEffect(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
              </div>

              <button
                id="submit-idea-btn"
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 active:scale-98 text-white text-xs font-bold rounded-lg transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                혁신 아이디어 제안하기
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Filter className="h-4 w-4" />
                아이디어 분류별 보기
              </h3>

              <div className="space-y-1.5 text-xs">
                <button
                  id="filter-category-all"
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full p-2.5 rounded-lg border text-left font-medium transition flex justify-between items-center ${
                    !selectedCategory 
                      ? 'bg-amber-500/10 border-amber-500/30 text-white' 
                      : 'bg-slate-900 border-slate-800 text-slate-350 hover:border-slate-700'
                  }`}
                >
                  <span>전체 제안 목록</span>
                  <span className="font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                    {proposals.length}
                  </span>
                </button>
                {['Safety', 'Quality', 'Efficiency', 'Cost'].map(cat => {
                  const count = proposals.filter(p => p.category === cat).length;
                  const active = selectedCategory === cat;
                  
                  return (
                    <button
                      key={cat}
                      id={`filter-category-${cat}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full p-2.5 rounded-lg border text-left font-medium transition flex justify-between items-center ${
                        active 
                          ? 'bg-amber-500/10 border-amber-500/30 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-350 hover:border-slate-700'
                      }`}
                    >
                      <span>
                        {cat === 'Safety' ? '안전 (Safety)' : cat === 'Quality' ? '품질 (Quality)' : cat === 'Efficiency' ? '공정효율 (Efficiency)' : '원가절감 (Cost)'}
                      </span>
                      <span className="font-mono bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {role === 'junior' && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-400 flex items-center gap-1 mb-1">
                <Info className="h-4 w-4" />
                개선 마일스톤 등급 안내:
              </span>
              <span>
                제안된 안은 매주 목요일 <strong>제조생산기술 기술위원회</strong> 종합 회의를 거쳐 포상 등급(S급~C급)이 책정되며, 월말 팩토리 보상 보너스와 연동됩니다.
              </span>
            </div>
          )}
        </div>

        {/* Right side: Interactive Idea Cards list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              개선 제안 피드 ({filteredProposals.length}개 조회됨)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">추천 다득점 순서</span>
          </div>

          <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
            {filteredProposals.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs font-medium">
                등록된 개선 제안이 존재하지 않습니다.
              </div>
            ) : (
              filteredProposals.map(idea => {
                const getCategoryStyles = (cat: string) => {
                  switch (cat) {
                    case 'Safety': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                    case 'Quality': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                    case 'Efficiency': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
                    case 'Cost': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
                    default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
                  }
                };

                const getStatusStyles = (stat: string) => {
                  switch (stat) {
                    case '제안': return 'bg-slate-800 text-slate-300 border-slate-700';
                    case '검토중': return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
                    case '개발중': return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
                    case '적용완료': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
                    default: return 'bg-slate-800 text-slate-400';
                  }
                };

                return (
                  <div key={idea.id} className="p-5 bg-slate-850 rounded-xl border border-slate-800 hover:border-slate-750 transition flex flex-col justify-between gap-4">
                    <div>
                      {/* Idea Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${getCategoryStyles(idea.category)}`}>
                            {idea.category.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">No.{idea.id}</span>
                          <h4 className="text-sm font-bold text-slate-100">{idea.title}</h4>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyles(idea.status)}`}>
                            {idea.status}
                          </span>
                          {role !== 'operator' && (
                            <select
                              id={`idea-status-change-${idea.id}`}
                              value={idea.status}
                              onChange={(e) => updateStatus(idea.id, e.target.value as any)}
                              className="bg-slate-900 text-slate-300 border border-slate-700 text-[10px] py-0.5 px-1 rounded cursor-pointer hover:border-slate-500"
                            >
                              <option value="제안">제안</option>
                              <option value="검토중">검토중</option>
                              <option value="개발중">개발중</option>
                              <option value="적용완료">적용완료</option>
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Idea Body */}
                      <div className="mt-3.5 space-y-3 text-xs leading-relaxed">
                        <div>
                          <span className="font-semibold text-slate-400 block mb-1">🔍 제안 현상 및 대책안:</span>
                          <p className="text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 font-sans">
                            {idea.description}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-amber-300/90 block mb-1">💰 산출된 예상 효과:</span>
                          <p className="text-amber-100 bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg font-sans">
                            {idea.expectedEffect}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer interactions */}
                    <div className="mt-2 pt-3 border-t border-slate-800 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="h-3.5 w-3.5" />
                        <span>
                          {idea.author} ({idea.department})
                        </span>
                        <span className="text-slate-700">•</span>
                        <span>{idea.createdAt}</span>
                      </div>

                      <button
                        id={`like-btn-${idea.id}`}
                        onClick={() => handleLike(idea.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 hover:text-amber-400 text-slate-300 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer"
                      >
                        <ThumbsUp className="h-3.5 w-3.5 text-amber-400" />
                        공감 <span className="font-mono font-bold text-amber-400">{idea.likes}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
