import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Sparkles, FileDown, Loader2, Target, 
  CheckCircle2, Layout, Video, FileText, Send, Camera 
} from 'lucide-react';
import { aiCreatorService } from '../services/aiCreatorService';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { SelectionGroup } from './SelectionGroup';

interface AIGenCreatorProps {
  onBack: () => void;
  isDarkMode: boolean;
  tc: any;
}

export const AIGenCreator: React.FC<AIGenCreatorProps> = ({ onBack, isDarkMode, tc }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: '銷售', name: '', ageGender: '', experience: '', 
    target: '', pain: '', p1: '', p2: '', bioStyle: '', 
    personalStyle: '專家型 7:2:1', topic: '', shootStyle: '對鏡頭說話'
  });

  const [aiData, setAiData] = useState<any>({
    targets: [], pains: [], bios: {}, titles: [], matrix: null
  });

  const next = async () => {
    setLoading(true);
    try {
      if (step === 1) {
        const res = await aiCreatorService.generateTargetAudiences(form);
        setAiData({ ...aiData, targets: res });
      } else if (step === 2) {
        const res = await aiCreatorService.generatePainPoints(form.target);
        setAiData({ ...aiData, pains: res });
      } else if (step === 4) {
        const res = await aiCreatorService.generateSixBios(form);
        setAiData({ ...aiData, bios: res });
      } else if (step === 6) {
        const res = await aiCreatorService.generateVideoTitles(form);
        setAiData({ ...aiData, titles: res });
      } else if (step === 8) {
        const res = await aiCreatorService.generateFinalMatrix(form);
        setAiData({ ...aiData, matrix: res });
      }
      setStep(step + 1);
    } catch (e) {
      alert("AI 思考中，請稍候重試");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const el = document.getElementById('report-area');
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.setTextColor(220, 220, 220);
    pdf.setFontSize(50);
    pdf.text("MOFO SALES", 30, 100, { angle: 45 });
    pdf.save(`MOFO_Creator_${form.name}.pdf`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f1115] text-white' : 'bg-slate-50 text-slate-900'} p-6 md:p-12 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto pb-20">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 opacity-50 hover:opacity-100 font-black italic">
          <ArrowLeft size={16}/> 返回儀表板
        </button>

        <div className="flex gap-1 mb-12">
          {[...Array(9)].map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i+1 <= step ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-slate-800'}`} />)}
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-4xl font-black italic text-amber-500 uppercase tracking-tighter">用戶檔案與角色定位</h2>
            <div className="grid grid-cols-2 gap-4">
              {['銷售 (Sales)', '招募 (Recruit)'].map(r => (
                <button key={r} onClick={()=>setForm({...form, role:r})} className={`p-4 rounded-2xl border-2 font-black transition-all ${form.role.includes(r.split(' ')[0]) ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800'}`}>{r}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="p-5 bg-slate-900 border-2 border-slate-800 rounded-xl outline-none focus:border-amber-500 font-bold" placeholder="你的名字" />
              <input value={form.ageGender} onChange={e=>setForm({...form, ageGender:e.target.value})} className="p-5 bg-slate-900 border-2 border-slate-800 rounded-xl outline-none focus:border-amber-500 font-bold" placeholder="年齡及性別" />
            </div>
            <textarea value={form.experience} onChange={e=>setForm({...form, experience:e.target.value})} className="w-full p-6 bg-slate-900 border-2 border-slate-800 rounded-[2rem] h-40 outline-none focus:border-amber-500 font-bold" placeholder="背景、人生經歷、喜好..." />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic text-amber-500 uppercase tracking-tighter">C. 目標人群建議</h2>
            {aiData.targets.map((t: any) => (
              <button key={t.type} onClick={() => { setForm({...form, target: t.type}); next(); }} className="w-full p-8 text-left bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] hover:border-amber-500 transition-all group">
                <div className="text-2xl font-black text-amber-500 mb-2">{t.type}</div>
                <div className="font-bold opacity-60">{t.reason}</div>
              </button>
            ))}
          </div>
        )}

        {step === 9 && aiData.matrix && (
          <div className="space-y-8 animate-in zoom-in">
            <div id="report-area" className="p-10 bg-[#181b21] rounded-[3rem] border-2 border-amber-500 shadow-2xl relative">
                <h2 className="text-3xl font-black text-amber-500 italic mb-8 border-b border-white/10 pb-6">MOFO 自媒體策略報告</h2>
                <div className="grid grid-cols-2 gap-4 text-sm mb-10">
                    <p><span className="opacity-40 block uppercase">用戶名字</span>{form.name}</p>
                    <p><span className="opacity-40 block uppercase">目標受眾</span>{form.target}</p>
                </div>
                <div className="space-y-8">
                    <section><h4 className="text-emerald-500 font-black flex items-center gap-2 mb-2"><CheckCircle2 size={18}/> 品牌 Bio</h4><p className="bg-white/5 p-6 rounded-2xl border border-white/10 italic">"{form.bioStyle}"</p></section>
                    <section><h4 className="text-blue-500 font-black flex items-center gap-2 mb-2"><Layout size={18}/> 內容矩陣預覽</h4><div className="bg-white/5 p-6 rounded-2xl border border-white/10 font-bold whitespace-pre-wrap text-slate-300 text-sm">{JSON.stringify(aiData.matrix, null, 2)}</div></section>
                </div>
            </div>
            <button onClick={downloadPDF} className="w-full py-6 rounded-[2.5rem] bg-amber-500 text-black font-black text-xl flex items-center justify-center gap-3">
                <FileDown size={24}/> 匯出 PDF 報告
            </button>
          </div>
        )}

        {step !== 2 && step !== 9 && (
          <div className="mt-12 flex justify-between items-center">
            {step > 1 ? <button onClick={()=>setStep(step-1)} className="text-slate-500 font-black underline underline-offset-8">上一步</button> : <div/>}
            <button onClick={next} disabled={loading || (step===1 && !form.name)} className="bg-amber-500 text-black px-12 py-5 rounded-[2rem] font-black text-lg flex items-center gap-2 hover:bg-amber-400 transition-all shadow-lg disabled:opacity-30">
              {loading ? <Loader2 className="animate-spin" /> : <>下一步 <ArrowRight size={20}/></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};