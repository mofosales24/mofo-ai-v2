import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, FileDown, Loader2, CheckCircle2, Layout, Video, Target, Heart } from 'lucide-react';
import { aiCreatorService } from '../services/aiCreatorService';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const AIGenCreator = ({ onBack, isDarkMode, tc }: any) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    role: '銷售', name: '', ageGender: '', job: '', experience: '', hobbies: '',
    target: '', pain: '', p1: '', p2: '', bioStyle: '', style: '專家型 7:2:1', topic: '', format: '對鏡頭說話'
  });

  const [aiData, setAiData] = useState<any>({ targets: [], pains: [], bios: {}, titles: [], matrix: null });

  const next = async () => {
    setLoading(true);
    try {
      if (step === 1) {
        const res = await aiCreatorService.generateTargetAudiences(form);
        setAiData({ ...aiData, targets: Array.isArray(res) ? res : [] });
      } else if (step === 2) {
        const res = await aiCreatorService.generatePainPoints(form.target);
        setAiData({ ...aiData, pains: Array.isArray(res) ? res : [] });
      } else if (step === 4) {
        const res = await aiCreatorService.generateSixBios(form);
        setAiData({ ...aiData, bios: res || {} });
      } else if (step === 6) {
        const res = await aiCreatorService.generateVideoTitles(form);
        setAiData({ ...aiData, titles: Array.isArray(res) ? res : [] });
      } else if (step === 8) {
        const res = await aiCreatorService.generateFinalContent(form);
        setAiData({ ...aiData, matrix: res });
      }
      setStep(s => s + 1);
    } catch (e) {
      alert("AI 思考中，請重試");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const el = document.getElementById('report-area');
    if (!el) return;
    const canvas = await html2canvas(el);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.setTextColor(220, 220, 220);
    pdf.setFontSize(50);
    pdf.text("MOFO SALES", 30, 100, { angle: 45 });
    pdf.save(`MOFO_2.0_${form.name}.pdf`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f1115] text-white' : 'bg-white text-slate-900'} p-6 md:p-12`}>
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 opacity-50 hover:opacity-100 font-black"><ArrowLeft size={16}/> 返回</button>
        <div className="flex gap-1 mb-12">
          {[...Array(9)].map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i+1 <= step ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-slate-800'}`} />)}
        </div>

        {/* --- 步驟顯示 --- */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-amber-500 italic uppercase">B. 用戶個人檔案</h2>
            <div className="grid grid-cols-2 gap-4">
              {['銷售', '招募'].map(r => <button key={r} onClick={()=>setForm({...form, role:r})} className={`p-4 rounded-xl border-2 font-black transition-all ${form.role===r?'border-amber-500 bg-amber-500/10':'border-slate-800'}`}>{r}</button>)}
            </div>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl" placeholder="你的名字" />
            <input value={form.ageGender} onChange={e=>setForm({...form, ageGender:e.target.value})} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl" placeholder="年齡及性別" />
            <input value={form.job} onChange={e=>setForm({...form, job:e.target.value})} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl" placeholder="現時職業" />
            <textarea value={form.experience} onChange={e=>setForm({...form, experience:e.target.value})} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl h-24" placeholder="人生經歷 (大病、留學...)" />
            <input value={form.hobbies} onChange={e=>setForm({...form, hobbies:e.target.value})} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl" placeholder="喜好 (籃球、咖啡...)" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-amber-500 italic uppercase">C. 你的目標受眾</h2>
            {loading ? <div className="p-20 text-center animate-pulse font-black text-amber-500">AI 正在分析最適合你嘅人群...</div> : 
              aiData.targets.map((t:any, i:number) => (
                <button key={i} onClick={()=>{setForm({...form, target:t.type}); next();}} className="w-full p-8 text-left bg-slate-900 border border-white/5 rounded-[2.5rem] hover:border-amber-500 transition-all">
                  <p className="text-xl font-black text-amber-500">{t.type}</p>
                  <p className="text-sm opacity-60 mt-1">{t.reason}</p>
                </button>
              ))
            }
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-amber-500 italic uppercase">D. 人群痛點與需求</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] space-y-4 border border-white/5">
              {aiData.pains.map((p:string, i:number) => <p key={i} className="font-bold text-slate-400 flex gap-2"><CheckCircle2 className="text-amber-500" size={18}/>{p}</p>)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <input value={form.p1} onChange={e=>setForm({...form, p1:e.target.value})} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl" placeholder="首選範疇 (如: 危疾)" />
              <input value={form.p2} onChange={e=>setForm({...form, p2:e.target.value})} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl" placeholder="次選範疇 (如: 儲蓄)" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-20 animate-bounce">
            <h2 className="text-4xl font-black italic text-amber-500">GENERATING...</h2>
            <p className="mt-4 font-bold opacity-60">AI 正在生成 6 款唔同風格嘅 Bio...</p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-amber-500 italic uppercase">E. 揀選 Bio 風格</h2>
            {Object.entries(aiData.bios || {}).map(([key, val]: any) => (
              <button key={key} onClick={()=>setForm({...form, bioStyle: val})} className={`w-full p-6 text-left rounded-3xl border-2 ${form.bioStyle===val?'border-amber-500 bg-amber-500/10':'border-slate-800'}`}>
                <p className="text-xs text-amber-500 font-black mb-1 uppercase">{key}</p><p className="font-bold">{val}</p>
              </button>
            ))}
            <div className="flex gap-4 mt-8">
              {['專家型 7:2:1', '朋友型 3:3:4'].map(s => <button key={s} onClick={()=>setForm({...form, style:s})} className={`flex-1 p-4 rounded-xl border-2 font-black ${form.style===s?'border-amber-500 bg-amber-500/5':'border-slate-800'}`}>{s}</button>)}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 animate-in slide-in-from-right text-center py-20">
            <h2 className="text-3xl font-black italic text-amber-500">生成影片選題中...</h2>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-amber-500 italic uppercase">F. 揀選影片題目</h2>
            {aiData.titles.map((t:any, i:number) => (
              <button key={i} onClick={()=>{setForm({...form, topic:t.title}); next();}} className="w-full p-6 bg-slate-900 border border-white/5 rounded-3xl text-left hover:border-amber-500 flex justify-between items-center">
                <p className="font-black text-lg">{t.title}</p><span className="text-[10px] bg-amber-500 text-black px-2 py-1 rounded font-black">{t.type}</span>
              </button>
            ))}
          </div>
        )}

        {step === 8 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-amber-500 italic uppercase">G. 拍攝形式</h2>
            <div className="grid grid-cols-2 gap-4">
              {['B-Roll VO', '對鏡頭說話', '搞笑劇情', '訪問互動'].map(f => <button key={f} onClick={()=>setForm({...form, format:f})} className={`p-8 rounded-[2rem] border-2 font-black text-xl ${form.format===f?'border-amber-500 bg-amber-500/10':'border-slate-800'}`}>{f}</button>)}
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="space-y-8 animate-in zoom-in">
            <div id="report-area" className="p-10 bg-[#181b21] rounded-[3rem] border-2 border-amber-500 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-6xl -rotate-12">MOFO SALES</div>
                <h2 className="text-3xl font-black text-amber-500 italic border-b border-white/10 pb-6 mb-6">品牌策略報告</h2>
                <div className="space-y-6">
                  <p className="font-bold"><span className="opacity-40 text-xs block">用戶名字</span>{form.name}</p>
                  <p className="font-bold"><span className="opacity-40 text-xs block">受眾</span>{form.target}</p>
                  <p className="font-bold text-emerald-500"><span className="opacity-40 text-xs block">選定 Bio</span>{form.bioStyle}</p>
                  <div className="bg-black/30 p-6 rounded-2xl whitespace-pre-wrap text-slate-300 font-bold leading-relaxed">
                    {typeof aiData.matrix === 'string' ? aiData.matrix : JSON.stringify(aiData.matrix, null, 2)}
                  </div>
                </div>
            </div>
            <button onClick={downloadPDF} className="w-full py-6 rounded-3xl bg-amber-500 text-black font-black text-xl flex items-center justify-center gap-3"><FileDown /> 匯出帶浮水印 PDF</button>
          </div>
        )}

        {/* 底部導航按鈕 */}
        <div className="mt-12 flex justify-between items-center">
          {step > 1 && <button onClick={()=>setStep(step-1)} className="text-slate-500 font-black underline">上一步</button>}
          {![2, 4, 6, 7, 8, 9].includes(step) && (
            <button onClick={next} disabled={loading} className="bg-amber-500 text-black px-12 py-5 rounded-[2rem] font-black text-lg flex items-center gap-2 shadow-lg">
              {loading ? <Loader2 className="animate-spin" /> : '下一步'} <ArrowRight size={20}/></button>
          )}
          {[4, 6, 8].includes(step) && (
            <button onClick={next} disabled={loading} className="bg-emerald-500 text-white px-12 py-5 rounded-[2rem] font-black text-lg flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : '開始生成內容'} <Sparkles/></button>
          )}
        </div>
      </div>
    </div>
  );
};