import React from 'react';
import { Heart, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export const StrategyView = ({ strategies, selectedStrategy, setSelectedStrategy, onNext, loading }: any) => {
  const icons: any = { '朋友型': <Heart />, '專家型': <ShieldCheck />, '混合型': <Zap /> };
  return (
    <div className="space-y-8 animate-in slide-in-from-right">
      <h2 className="text-3xl font-black italic text-amber-500">E. 選擇文案风格</h2>
      <div className="grid gap-6">
        {strategies.map((s: any, i: number) => (
          <button key={i} onClick={() => setSelectedStrategy(s.type)} className={`p-8 text-left rounded-[2.5rem] border-2 transition-all ${selectedStrategy === s.type ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5'}`}>
            <div className="flex items-center gap-3 text-2xl font-black text-white mb-4">
              {icons[s.type] || <Zap />} {s.type}
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">{s.description}</p>
            <div className="mt-4 text-xs font-black text-amber-500 uppercase bg-amber-500/5 px-3 py-1.5 rounded-lg inline-block">語氣：{s.tone}</div>
          </button>
        ))}
      </div>
      <button onClick={onNext} disabled={!selectedStrategy || loading} className="w-full bg-amber-500 p-6 rounded-3xl text-black font-black text-xl">
        {loading ? '撰寫腳本中...' : '最後一步：生成拍攝腳本'}
      </button>
    </div>
  );
};