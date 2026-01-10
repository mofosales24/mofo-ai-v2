import React from 'react';
import { Watermark } from './Watermark';
import { FileDown, Sparkles, Video } from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const ScriptView = ({ script, extensions, onExtend }: any) => {
  const download = async () => {
    const el = document.getElementById('capture');
    if (!el) return;
    const canvas = await html2canvas(el);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save("MOFO_Script.pdf");
  };

  return (
    <div className="space-y-10 animate-in zoom-in pb-20">
      <div id="capture" className="bg-[#181b21] p-10 rounded-[3rem] border-2 border-amber-500 relative overflow-hidden shadow-2xl">
        <Watermark />
        <h2 className="text-3xl font-black text-amber-500 mb-8 border-b border-white/10 pb-4 relative z-10 flex items-center gap-3"><Video /> 詳細拍攝腳本</h2>
        <div className="space-y-8 relative z-10">
          <table className="w-full text-left border-collapse">
            <thead className="text-amber-500/60 uppercase text-xs tracking-widest">
              <tr><th className="p-4">場景</th><th className="p-4">視覺</th><th className="p-4">對話 (粵語)</th></tr>
            </thead>
            <tbody className="text-white divide-y divide-white/5">
              {script.steps.map((s: any, i: number) => (
                <tr key={i}><td className="p-4 font-black">{s.scene}</td><td className="p-4 text-sm opacity-60">{s.visual}</td><td className="p-4 font-bold leading-relaxed">{s.audio}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2"><Sparkles className="text-amber-500" /> 內容拓展方向</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extensions.map((ext: string, i: number) => (
            <button key={i} onClick={() => onExtend(ext)} className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-amber-500 transition-all font-bold text-slate-300">{i + 1}. {ext}</button>
          ))}
        </div>
      </div>
      <button onClick={download} className="w-full bg-emerald-600 p-6 rounded-3xl text-white font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-500 transition-all"><FileDown /> 下載帶水印 PDF</button>
    </div>
  );
};