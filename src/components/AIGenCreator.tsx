import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, FileDown, Loader2, CheckCircle2, Layout, Video } from 'lucide-react';
import { aiCreatorService } from '../services/aiCreatorService';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const AIGenCreator = ({ onBack, isDarkMode, tc }: any) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', target: '', bioStyle: '', topic: '', format: '對鏡頭講' });
  const [aiData, setAiData] = useState<any>({ targets: [], pains: [], bios: {}, titles: [], matrix: null });

  const next = async () => {
    setLoading(true);
    try {
      if (step === 1) setAiData({...aiData, targets: await aiCreatorService.generateTarget(form)});
      else if (step === 2) setAiData({...aiData, pains: await aiCreatorService.generatePains(form.target)});
      else if (step === 4) setAiData({...aiData, bios: await aiCreatorService.generateBios(form)});
      else if (step === 6) setAiData({...aiData, titles: await aiCreatorService.generateTitles(form)});
      else if (step === 8) setAiData({...aiData, matrix: await aiCreatorService.generateMatrix(form)});
      setStep(s => s + 1);
    } catch (e) { alert("AI 塞車，請重試"); } finally { setLoading(false); }
  };

  const downloadPDF = async () => {
    const el = document.getElementById('report-area');
    if (!el) return;
    const canvas = await html2canvas(el);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.setTextColor(220, 220, 220);
    pdf.text("MOFO SALES", 30, 100, { angle: 45 });
    pdf.save("MOFO_REPORT.pdf");
  };

  return (
    <div className={`min-h-screen ${isDarkMode?'bg-[#0f1115] text-white':'bg-white text-black'} p-6`}>
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 opacity-50 flex items-center gap-2 font-black"><ArrowLeft size={16}/> 返回</button>
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-4xl font-black italic text-amber-500">A/B. 用戶個人檔案</h2>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-5 bg-slate-900 border border-white/10 rounded-2xl text-white" placeholder="你的名字" />
            <button onClick={next} disabled={loading} className="w-full bg-amber-500 p-5 rounded-2xl text-black font-black">{loading?<Loader2 className="animate-spin mx-auto"/>:'下一步'}</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-amber-500">C. 目標人群建議</h2>
            {Array.isArray(aiData.targets) && aiData.targets.map((t:any, i:number) => (
              <button key={i} onClick={()=>{setForm({...form, target:t.type}); next();}} className="w-full p-6 bg-slate-900 border border-white/10 rounded-3xl text-left hover:border-amber-500">
                <p className="text-xl font-black text-amber-500">{t.type}</p>
                <p className="text-sm opacity-60">{t.reason}</p>
              </button>
            ))}
          </div>
        )}
        {step === 9 && (
          <div className="space-y-8 animate-in zoom-in">
            <div id="report-area" className="p-10 bg-[#181b21] rounded-[3rem] border-2 border-amber-500">
                <h2 className="text-2xl font-black text-amber-500 mb-6">MOFO SALES 策略報告</h2>
                <p className="font-bold text-emerald-500">選定 Bio: {form.bioStyle}</p>
                <div className="mt-6 bg-black/30 p-6 rounded-2xl text-slate-300 whitespace-pre-wrap">{JSON.stringify(aiData.matrix, null, 2)}</div>
            </div>
            <button onClick={downloadPDF} className="w-full py-6 rounded-3xl bg-amber-500 text-black font-black text-xl flex items-center justify-center gap-3"><FileDown /> 匯出帶浮水印 PDF</button>
          </div>
        )}
        {![2, 9].includes(step) && step > 1 && <button onClick={next} className="mt-8 bg-amber-500 text-black px-12 py-4 rounded-2xl font-black">繼續下一步</button>}
      </div>
    </div>
  );
};
