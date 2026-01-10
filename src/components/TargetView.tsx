import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

export const TargetView = ({ targets, selectedTargets, setSelectedTargets, onNext, loading }: any) => {
  const safeTargets = Array.isArray(targets) ? targets : [];
  const safeSelected = Array.isArray(selectedTargets) ? selectedTargets : [];

  const toggle = (t: string) => {
    if (safeSelected.includes(t)) {
      setSelectedTargets(safeSelected.filter(i => i !== t));
    } else {
      setSelectedTargets([...safeSelected, t]);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right">
      <h2 className="text-3xl font-black italic text-amber-500 flex items-center gap-3"><Target /> C. 選擇目標對象</h2>
      <div className="grid gap-4">
        {safeTargets.length > 0 ? safeTargets.map((t: any, i: number) => (
          <button key={i} onClick={() => toggle(t.type)} className={`p-6 text-left rounded-3xl border-2 transition-all ${safeSelected.includes(t.type) ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5'}`}>
            <p className="text-xl font-black text-amber-500">{t.type}</p>
            <p className="text-sm opacity-60 mt-1">{t.reason}</p>
          </button>
        )) : <div className="p-10 text-center text-slate-500 font-bold italic">AI 正在生成受眾建議...</div>}
      </div>
      <button onClick={onNext} disabled={safeSelected.length === 0 || loading} className="w-full bg-amber-500 text-black p-5 rounded-2xl font-black text-xl active:scale-95 disabled:opacity-30 transition-all">
        {loading ? '分析痛點中...' : '下一步：分析需求'}
      </button>
    </div>
  );
};