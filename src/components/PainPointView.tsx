import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const PainPointView = ({ pains, selectedPains, setSelectedPains, onNext, loading }: any) => {
  const toggle = (p: string) => {
    setSelectedPains((prev: string[]) => prev.includes(p) ? prev.filter(i => i !== p) : [...prev, p]);
  };
  return (
    <div className="space-y-8 animate-in slide-in-from-right">
      <h2 className="text-3xl font-black italic text-amber-500 flex items-center gap-3"><AlertCircle /> D. 目標受眾痛點 (多選)</h2>
      <div className="grid gap-4">
        {pains.map((p: any, i: number) => (
          <button key={i} onClick={() => toggle(p.point)} className={`p-6 text-left rounded-3xl border-2 transition-all ${selectedPains.includes(p.point) ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5'}`}>
            <p className="text-xl font-black text-white">{p.point}</p>
            <p className="text-sm text-amber-500 font-bold mt-1">底層需求：{p.need}</p>
          </button>
        ))}
      </div>
      <button onClick={onNext} disabled={selectedPains.length === 0 || loading} className="w-full bg-amber-500 p-5 rounded-2xl text-black font-black text-xl">
        {loading ? '規劃策略中...' : '下一步：生成文案策略'}
      </button>
    </div>
  );
};