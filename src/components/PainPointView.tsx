import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const PainPointView = ({ pains, selectedPains, setSelectedPains, onNext, loading }: any) => {
  // 安全檢查
  const safeSelected = Array.isArray(selectedPains) ? selectedPains : [];

  const toggle = (p: string) => {
    if (safeSelected.includes(p)) {
      setSelectedPains(safeSelected.filter(i => i !== p));
    } else {
      setSelectedPains([...safeSelected, p]);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-black italic text-amber-500 flex items-center gap-3">
          <AlertCircle /> D. 目標受眾痛點 (多選)
        </h2>
        <p className="text-slate-400 font-bold">根據受眾分析，佢哋最擔心嘅係：</p>
      </div>

      <div className="grid gap-4">
        {Array.isArray(pains) ? pains.map((p: any, i: number) => (
          <button key={i} onClick={() => toggle(p.point)} 
            className={`p-6 text-left rounded-3xl border-2 transition-all ${safeSelected.includes(p.point) ? 'border-amber-500 bg-amber-500/10 shadow-lg' : 'border-white/5 bg-white/5'}`}>
            <p className="text-xl font-black text-white">{p.point}</p>
            <p className="text-sm text-amber-500 font-bold mt-1 uppercase tracking-widest text-[10px]">潛在需求：{p.need}</p>
          </button>
        )) : <div className="p-10 text-center opacity-50 font-black">AI 數據加載中...</div>}
      </div>

      <button 
        onClick={onNext} 
        disabled={safeSelected.length === 0 || loading} 
        className="w-full bg-amber-500 text-black p-5 rounded-2xl font-black text-xl active:scale-95 transition-all disabled:opacity-30"
      >
        {loading ? '規劃策略中...' : '下一步：生成文案策略'}
      </button>
    </div>
  );
};