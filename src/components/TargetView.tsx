import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

export const TargetView = ({ targets, selectedTargets, setSelectedTargets, onNext, loading }: any) => {
  const toggle = (t: string) => {
    setSelectedTargets((prev: string[]) => prev.includes(t) ? prev.filter(i => i !== t) : [...prev, t]);
  };
  return (
    <div className="space-y-8 animate-in slide-in-from-right">
      <h2 className="text-3xl font-black italic text-amber-500 flex items-center gap-3"><Target /> C. 選擇目標對象 (多選)</h2>
      <div className="grid gap-4">
        {targets.map((t: any) => (
          <button key={t.type} onClick={() => toggle(t.type)} className={`p-6 text-left rounded-3xl border-2 transition-all ${selectedTargets.includes(t.type) ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5'}`}>
            <p className="text-xl font-black text-amber-500">{t.type}</p>
            <p className="text-sm opacity-60 mt-1">{t.reason}</p>
          </button>
        ))}
      </div>
      <button onClick={onNext} disabled={selectedTargets.length === 0 || loading} className="w-full bg-amber-500 p-5 rounded-2xl text-black font-black text-xl">
        {loading ? '分析痛點中...' : '下一步：分析受眾痛點'}
      </button>
    </div>
  );
};