import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, FileDown, Loader2, Target, CheckCircle2, Layout } from 'lucide-react';
import { aiCreatorService } from '../services/aiCreatorService';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const AIGenCreator = ({ onBack, isDarkMode, tc }: any) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', target: '', bioStyle: '', topic: '' });
  const [aiData, setAiData] = useState<any>({ targets: [], pains: [], bios: {}, titles: [], matrix: null });

  const next = async () => {
    setLoading(true);
    try {
      if (step === 1) setAiData({...aiData, targets: await aiCreatorService.generateTargetAudiences(form)});
      else if (step === 2) setAiData({...aiData, pains: await aiCreatorService.generatePainPoints(form.target)});
      else if (step === 8) setAiData({...aiData, matrix: await aiCreatorService.generateFinalContent(form)});
      setStep(s => s + 1);
    } catch (e) { alert("AI 忙碌中"); } finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f1115] text-white' : 'bg-white text-slate-900'} p-6 md:p-12`}>
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 opacity-50 font-black"><ArrowLeft size={16}/> 返回</button>
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-amber-500 italic">啟動自媒體引擎 2.0</h2>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-5 bg-slate-900 border border-white/10 rounded-2xl" placeholder="你的名字" />
            <button onClick={next} disabled={loading} className="w-full bg-amber-500 p-5 rounded-2xl text-black font-black flex justify-center">
              {loading ? <Loader2 className="animate-spin"/> : "開始分析"}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-amber-500">AI 建議受眾：</h2>
            {Array.isArray(aiData.targets) ? aiData.targets.map((t:any, i:number) => (
              <button key={i} onClick={()=>{setForm({...form, target:t.type}); next();}} className="w-full p-6 bg-slate-900 border border-white/10 rounded-3xl text-left hover:border-amber-500 transition-all">
                <p className="text-xl font-black text-amber-500">{t.type}</p>
                <p className="text-sm opacity-60">{t.reason}</p>
              </button>
            )) : <p>AI 格式錯誤</p>}
          </div>
        )}
        {step === 9 && (
          <div className="p-10 bg-slate-900 rounded-[3rem] border-2 border-amber-500 shadow-2xl">
            <h2 className="text-2xl font-black text-amber-500 mb-6 italic text-center underline">MOFO 品牌策略報告</h2>
            <pre className="text-xs whitespace-pre-wrap leading-relaxed text-slate-300">{JSON.stringify(aiData.matrix, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
