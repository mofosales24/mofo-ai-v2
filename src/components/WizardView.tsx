import React, { useState } from 'react';
import { 
  Home, ArrowLeft, ArrowRight, RefreshCw, Sparkles, Save, Send, ChevronRight, 
  CheckCircle2, Video, FileText, Target, X, ClipboardList, Table as TableIcon, ListChecks, BookOpen
} from 'lucide-react';
import { BrandMode } from '../types';
import { SUGGESTIONS } from '../constants';
import { generatePainPoints } from '../services/geminiService';
import { SelectionGroup } from './SelectionGroup';

const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0f1115]/95 backdrop-blur-xl animate-in fade-in duration-300">
    <div className="w-24 h-24 rounded-full border-t-4 border-amber-500 animate-spin mb-8"></div>
    <h3 className="text-2xl font-black italic text-white tracking-tight">AI 引擎計算中</h3>
    <p className="text-slate-400 mt-2">{message}</p>
  </div>
);

const Modal = ({ title, children, onClose, tc }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-md bg-black/70 animate-in fade-in duration-300">
    <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-2 border-white/10 bg-[#181b21] p-10 relative shadow-2xl`}>
      <button onClick={onClose} className="absolute top-6 right-6 text-white opacity-40 hover:opacity-100"><X /></button>
      <h4 className="text-2xl font-black italic mb-8 text-amber-500 flex items-center gap-3"><Sparkles /> {title}</h4>
      <div className="space-y-8">{children}</div>
    </div>
  </div>
);

export const WizardView = ({ 
  mode, wizardStep, setWizardStep, brandData, setBrandData, loading, generatingDetail,
  topics, currentBrand, expandedContent, setExpandedContent, tc, isDarkMode, 
  handleProcessBio, handleRefreshTopics, handleSelectTopic, setView, handleSaveBrand, isSaved 
}: any) => {
  const currentData = mode === BrandMode.SALES ? SUGGESTIONS.SALES : SUGGESTIONS.RECRUIT;
  const [aiPainPoints, setAiPainPoints] = useState<string[]>([]);
  const [isGeneratingPain, setIsGeneratingPain] = useState(false);
  const [magnetTab, setMagnetTab] = useState<'table' | 'checklist' | 'guides'>('table');

  const fetchPains = async () => {
    setIsGeneratingPain(true);
    try { const ps = await generatePainPoints(mode, brandData); setAiPainPoints(ps); } 
    catch (e) { alert("AI 推薦失敗"); } finally { setIsGeneratingPain(false); }
  };

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-24`}>
      {generatingDetail && <LoadingOverlay message="正在生成高質量腳本與文案..." />}
      <nav className={`sticky top-0 z-50 border-b-2 p-6 flex justify-between items-center backdrop-blur-md ${tc.navBg} border-white/5`}>
        <button onClick={() => setView('dashboard')} className="p-2 border border-white/10 rounded-xl"><Home/></button>
        {wizardStep < 8 && <button onClick={() => wizardStep === 7 ? handleProcessBio() : setWizardStep((p:any)=>p+1)} className="bg-amber-500 px-8 py-2 rounded-xl text-black font-black flex items-center gap-2">{loading ? <RefreshCw className="animate-spin"/> : '下一步'} <ArrowRight size={18}/></button>}
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        {wizardStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-amber-500">你的名字？</h2>
            <input value={brandData.name} onChange={e=>setBrandData({...brandData, name:e.target.value})} className="w-full text-4xl font-black bg-transparent border-b-4 border-amber-500 outline-none p-2 text-white" placeholder="輸入名字..." />
          </div>
        )}
        {wizardStep === 1 && <SelectionGroup title="專業範疇" options={currentData.domain} selected={brandData.domain} onSelect={v=>setBrandData({...brandData, domain:v})} custom={brandData.customDomain} onCustomChange={v=>setBrandData({...brandData, customDomain:v})} />}
        {/* ... (其餘步驟邏輯類似) ... */}
        {wizardStep === 8 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="p-10 rounded-[3rem] border-2 border-amber-500 bg-[#181b21] shadow-2xl">
              <h3 className="text-2xl font-black text-amber-500 mb-6">您的 AI 定位報告</h3>
              {currentBrand?.bio && <div className="space-y-4 mb-8 text-white font-bold"><p className="text-3xl font-black text-amber-500">{currentBrand.bio.displayName}</p><p>{currentBrand.bio.line1_value}</p><p>{currentBrand.bio.line2_trust}</p><p>{currentBrand.bio.line3_unique}</p><p className="text-amber-500 italic mt-4">{currentBrand.bio.line4_cta}</p></div>}
              <button onClick={handleSaveBrand} disabled={isSaved} className={`w-full py-5 rounded-2xl font-black text-xl ${isSaved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500 text-black shadow-lg'}`}>{isSaved ? '已同步至雲端' : '儲存定位檔案'}</button>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-8">
              {topics.map((t:any, i:any) => (<button key={i} onClick={()=>handleSelectTopic(t)} className="w-full text-left p-6 rounded-2xl border-2 border-white/5 bg-[#181b21] hover:border-amber-500 flex justify-between items-center group transition-all"><span className="font-black text-lg text-slate-200">{i+1}. {t}</span><ChevronRight className="text-amber-500"/></button>))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
