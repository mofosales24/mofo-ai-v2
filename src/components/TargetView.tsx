import React from 'react';
import { Target } from 'lucide-react';

export const TargetView = ({ targets, selectedTargets, setSelectedTargets, onNext, loading }: any) => {
  // ✅ 確保 targets 永遠是陣列
  const list = Array.isArray(targets) ? targets : [];
  const selected = Array.isArray(selectedTargets) ? selectedTargets : [];

  const toggle = (t: string) => {
    setSelectedTargets(selected.includes(t) ? selected.filter(i => i !== t) : [...selected, t]);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right">
      <h2 className="text-3xl font-black italic text-amber-500 flex items-center gap-3"><Target /> C. 選擇目標對象</h2>
      <div className="grid gap-4">
        {list.length > 0 ? list.map((t: any, i: number) => (
          <button key={i} onClick={() => toggle(t.type)} className={`p-6 text-left rounded-3xl border-2 transition-all ${selected.includes(t.type) ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5'}`}>
            <p className="text-xl font-black text-amber-500">{t?.type || "未定義人群"}</p>
            <p className="text-sm opacity-60 mt-1 font-medium">{t?.reason || "AI 正在思考中..."}</p>
          </button>
        )) : <div className="p-10 text-center text-slate-500 font-black animate-pulse">正在為您量身打造受眾名單...</div>}
      </div>
      <button onClick={onNext} disabled={selected.length === 0 || loading} className="w-full bg-amber-500 text-black p-5 rounded-2xl font-black text-xl active:scale-95 disabled:opacity-30 transition-all shadow-lg shadow-amber-500/20">
        {loading ? '分析痛點中...' : '下一步：生成人群痛點'}
      </button>
    </div>
  );
};