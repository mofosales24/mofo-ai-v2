import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

export const TargetView = ({ targets, selectedTargets, setSelectedTargets, onNext, loading }: any) => {
  // 安全檢查：確保一定是陣列
  const safeSelected = Array.isArray(selectedTargets) ? selectedTargets : [];

  const toggle = (t: string) => {
    if (safeSelected.includes(t)) {
      setSelectedTargets(safeSelected.filter(i => i !== t));
    } else {
      setSelectedTargets([...safeSelected, t]);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-black italic text-amber-500 flex items-center gap-3">
          <Target /> C. 選擇目標對象 (多選)
        </h2>
        <p className="text-slate-400 font-bold">請揀選你想針對嘅受眾人群：</p>
      </div>

      <div className="grid gap-4">
        {Array.isArray(targets) ? targets.map((t: any) => (
          <button key={t.type} onClick={() => toggle(t.type)} 
            className={`p-6 text-left rounded-3xl border-2 transition-all ${safeSelected.includes(t.type) ? 'border-amber-500 bg-amber-500/10 shadow-lg' : 'border-white/5 bg-white/5'}`}>
            <p className="text-xl font-black text-amber-500">{t.type}</p>
            <p className="text-sm opacity-60 mt-1 font-medium">{t.reason}</p>
          </button>
        )) : <div className="p-10 text-center opacity-50 font-black">AI 數據加載中...</div>}
      </div>

      <button 
        onClick={onNext} 
        disabled={safeSelected.length === 0 || loading} 
        className="w-full bg-amber-500 text-black p-5 rounded-2xl font-black text-xl active:scale-95 transition-all disabled:opacity-30"
      >
        {loading ? '分析痛點中...' : '下一步：生成受眾痛點'}
      </button>
    </div>
  );
};