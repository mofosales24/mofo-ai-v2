console.log('🚀 CURRENT_PROJECT: mofo-creator');
console.log('💎 VERSION: 024733');
import React, { useState, useEffect, memo, useCallback } from 'react';
import { 
  Zap, Target, Video, Calendar, Users, CheckCircle2, ChevronRight, RefreshCw, 
  Layout, FileText, UserCircle, ArrowRight, ArrowLeft, Sparkles, Trophy, 
  ShieldCheck, ClipboardList, Flame, Moon, Sun, Home, AlertCircle, Copy, 
  Layers, Search, PenTool, Clock, Heart, Briefcase, Quote, Baby, Stethoscope, 
  Plane, Coins, Dumbbell, GraduationCap, Edit3, Lock, LogOut, Plus, Trash2, Settings,
  Lightbulb, BookOpen, BriefcaseBusiness, UserPlus, FolderOpen, Save, Star, Key, Ban, Unlock, Shield,
  X, ExternalLink, Info, Table as TableIcon, Loader2, User as UserIcon, Eye, EyeOff, Send, ListChecks
} from 'lucide-react';
import { 
  AppView, User, Brand, BrandMode, BrandData, ContentPlan 
} from './types';
import { SUGGESTIONS, THEME } from './constants';
import { cloudService } from './services/cloudService';
import { generateBio, generateTopics, generateDetailedContent, generatePainPoints } from './services/geminiService';
import { SelectionGroup } from './components/SelectionGroup';

const ADMIN_USER: User = { 
  id: 'admin_static', 
  name: 'MOFO Master', 
  username: 'admin', 
  password: 'mofo2026',
  role: 'admin', 
  status: 'active', 
  createdAt: new Date().toISOString() 
};

// ==========================================
// 1. Helper Components
// ==========================================

const FastInput = memo(({ value, onChange, placeholder, className, type = "text" }: any) => {
  const [localVal, setLocalVal] = useState(value || '');
  useEffect(() => { setLocalVal(value || ''); }, [value]);
  const handleBlur = () => { if (localVal !== value) onChange(localVal); };
  return (
    <input type={type} value={localVal} onChange={(e) => setLocalVal(e.target.value)} onBlur={handleBlur} onKeyDown={(e) => { if(e.key === 'Enter') handleBlur(); }} placeholder={placeholder} className={className} />
  );
});

const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0f1115]/95 backdrop-blur-xl animate-in fade-in duration-300">
    <div className="relative mb-8">
      <div className="w-24 h-24 rounded-full border-t-4 border-amber-500 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
      </div>
    </div>
    <div className="text-center space-y-4 max-w-md px-6">
      <h3 className="text-2xl font-black italic text-white tracking-tight">雲端引擎計算中</h3>
      <p className="text-slate-400 font-medium">{message}</p>
    </div>
  </div>
);

const Modal = ({ title, children, onClose, tc }: { title: string, children?: React.ReactNode, onClose: () => void, tc: any }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-md bg-black/70 animate-in fade-in duration-300">
    <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-2 ${tc.modalCard} p-6 md:p-10 relative shadow-2xl animate-in zoom-in-95 duration-200`}>
      <button onClick={onClose} className={`absolute top-6 right-6 p-2.5 rounded-full hover:bg-slate-500/10 ${tc.text} transition-colors`}><X className="w-6 h-6" /></button>
      <h4 className="text-2xl font-black italic mb-8 text-amber-500 flex items-center gap-3">
        <Sparkles className="w-6 h-6" /> {title}
      </h4>
      <div className="space-y-8">{children}</div>
    </div>
  </div>
);

// ==========================================
// 2. Sub-Views (放在 App 前面以解決 TS2304)
// ==========================================

const LoginView = ({ onLogin, loading, error, isDarkMode, toggleTheme }: any) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${isDarkMode ? 'bg-[#0f1115]' : 'bg-slate-50'}`}>
      <div className={`w-full max-w-md p-10 rounded-[3rem] border-2 shadow-2xl ${isDarkMode ? 'bg-[#181b21] border-white/5 shadow-black/50' : 'bg-white border-slate-300 shadow-slate-200'}`}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2.5 rounded-2xl shadow-lg shadow-amber-500/20">
                <Trophy className="w-7 h-7 text-black" />
              </div>
              <h1 className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>MOFO <span className="text-amber-500 not-italic">CREATOR</span></h1>
            </div>
            <p className="text-[10px] font-bold text-amber-500/80 mt-2 leading-tight uppercase tracking-wide">讓理財變得輕鬆有趣 雲端同步版</p>
          </div>
          <button onClick={toggleTheme} className={`p-2.5 rounded-full transition-colors ${isDarkMode ? 'bg-white/5 text-amber-500' : 'bg-slate-100 text-amber-600'}`}>
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <form onSubmit={(e)=>{e.preventDefault(); onLogin(u,p);}} className="space-y-8">
          <div className="space-y-5">
            <input value={u} onChange={(e) => setU(e.target.value)} className={`w-full border-2 rounded-2xl p-4 outline-none focus:border-amber-500 font-black ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-950'}`} placeholder="帳號" />
            <div className="relative">
              <input type={showPwd ? "text" : "password"} value={p} onChange={(e) => setP(e.target.value)} className={`w-full border-2 rounded-2xl p-4 outline-none focus:border-amber-500 font-black ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-950'}`} placeholder="密碼" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100">{showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {error && <div className="text-red-500 text-xs font-bold p-3 bg-red-500/10 rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
          </div>
          <button type="submit" disabled={loading} className="w-full py-4.5 rounded-2xl bg-amber-500 text-black font-black hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : <>登入雲端系統 <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

const DashboardView = ({ onOpenBrand, brands, handleDeleteBrand, handleNewBrand, tc, isDarkMode }: any) => (
  <main className="max-w-5xl mx-auto px-6 py-16 space-y-16 animate-in fade-in duration-700">
    <div className="text-center space-y-6">
      <h2 className={`text-5xl md:text-6xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>啟動您的<span className="text-amber-500">內容引擎</span></h2>
      <p className={`${tc.text} max-w-2xl mx-auto text-lg font-black opacity-80`}>利用 AI 建立個人定位，獲取 10 個選題及全平台內容腳本。</p>
    </div>
    {brands.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {brands.map((b: any) => (
          <div key={b.id} className="relative group">
            <div onClick={() => onOpenBrand(b)} className={`p-10 rounded-[3.5rem] border-2 ${tc.card} hover:border-amber-500 cursor-pointer transition-all hover:scale-[1.01] shadow-xl`}>
              <span className={`px-4 py-1.5 rounded-full text-[11px] font-black border-2 ${tc.border} mb-6 inline-block`}>{b.mode === 'sales' ? '銷售模式' : '招募模式'}</span>
              <h3 className={`text-3xl font-black italic group-hover:text-amber-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{b.data.name}</h3>
              <p className={`text-base mt-3 line-clamp-2 ${tc.text} font-black opacity-70`}>{b.bio?.displayName || '尚未生成定位'}</p>
              <div className="mt-8 flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest">繼續創作 <ArrowRight className="w-4 h-4" /></div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteBrand(b.id, b.data.name); }} className="absolute top-6 right-6 p-4 text-slate-400 hover:text-white bg-black/40 hover:bg-red-600 rounded-2xl transition-all shadow-lg"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
      <div onClick={() => handleNewBrand(BrandMode.SALES)} className={`group p-10 rounded-[3.5rem] border-2 ${tc.card} hover:border-emerald-500 cursor-pointer transition-all shadow-2xl`}>
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-black mb-8 shadow-xl"><Target className="w-8 h-8" /></div>
        <h3 className={`text-3xl font-black italic mb-3 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>銷售顧問 (Sales)</h3>
        <p className={`text-base leading-relaxed mb-10 ${tc.text} font-black opacity-80`}>專注：吸引潛在客戶、解決理財痛點。</p>
        <div className="flex items-center gap-2 text-xs font-black text-emerald-500 group-hover:translate-x-3 transition-all uppercase tracking-widest">開始定位 <ArrowRight className="w-4 h-4" /></div>
      </div>
      <div onClick={() => handleNewBrand(BrandMode.RECRUIT)} className={`group p-10 rounded-[3.5rem] border-2 ${tc.card} hover:border-blue-500 cursor-pointer transition-all shadow-2xl`}>
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-black mb-8 shadow-xl"><Users className="w-8 h-8" /></div>
        <h3 className={`text-3xl font-black italic mb-3 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>團隊領袖 (Leader)</h3>
        <p className={`text-base leading-relaxed mb-10 ${tc.text} font-black opacity-80`}>專注：建立領袖魅力、招募事業夥伴。</p>
        <div className="flex items-center gap-2 text-xs font-black text-blue-500 group-hover:translate-x-3 transition-all uppercase tracking-widest">開始定位 <ArrowRight className="w-4 h-4" /></div>
      </div>
    </div>
  </main>
);

const WizardView = ({ 
  mode, wizardStep, setWizardStep, brandData, setBrandData, loading, generatingDetail,
  extraTrustLabels, setExtraTrustLabels, extraUniqueLabels, setExtraUniqueLabels,
  topics, currentBrand, expandedContent, setExpandedContent, tc, isDarkMode, 
  handleProcessBio, handleRefreshTopics, handleSelectTopic, setView, handleSaveBrand, isSaved 
}: any) => {
  const currentData = mode === BrandMode.SALES ? SUGGESTIONS.SALES : SUGGESTIONS.RECRUIT;
  const trustLabels = [...["MDRT 會員", "10年資歷", "理賠過百宗", "認可理財策師 (CFP)"], ...extraTrustLabels];
  const uniqueLabels = [...currentData.unique, ...extraUniqueLabels];
  
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [aiPainPoints, setAiPainPoints] = useState<string[]>([]);
  const [isGeneratingPain, setIsGeneratingPain] = useState(false);
  const [magnetTab, setMagnetTab] = useState<'table' | 'checklist' | 'guides'>('table');

  const handleFetchPainPoints = async () => {
    setIsGeneratingPain(true);
    try { const ps = await generatePainPoints(mode, brandData); setAiPainPoints(ps); } 
    catch (e) { alert("AI 推薦失敗"); } finally { setIsGeneratingPain(false); }
  };

  const handleCustomTopicSubmit = () => {
    if (customTopicInput.trim()) { handleSelectTopic(customTopicInput.trim()); setCustomTopicInput(''); }
  };

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-24 transition-colors`}>
      {generatingDetail && <LoadingOverlay message="AI 內容引擎計算中..." />}
      
      <div className={`sticky top-0 z-50 border-b-2 px-6 py-4 flex justify-between items-center backdrop-blur-md ${tc.navBg} ${tc.border} shadow-sm`}>
        <div className="flex items-center gap-4">
           <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-xl border-2 ${tc.border} ${tc.text}`}><Home className="w-4 h-4" /></button>
           <button onClick={() => setWizardStep((prev: number) => Math.max(0, prev - 1))} className="text-xs font-black opacity-60 hover:opacity-100 flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> 返回</button>
        </div>
        <div className="flex items-center gap-3">
          {wizardStep < 8 && (
            <button onClick={() => wizardStep === 7 ? handleProcessBio() : setWizardStep((prev: number) => prev + 1)} className="px-4 py-2 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-2">
              {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : wizardStep === 7 ? '生成定位' : '下一步'} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {wizardStep < 8 && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className={`p-10 rounded-[3rem] border-2 ${tc.card} space-y-10 shadow-2xl`}>
              {wizardStep === 0 && <FastInput value={brandData.name} onChange={(v:any) => setBrandData((d: any) => ({...d, name: v}))} className={`w-full border-2 rounded-2xl px-6 py-5 text-2xl font-black ${tc.input}`} placeholder="輸入您的名字..." />}
              {wizardStep === 1 && <SelectionGroup title="專業範疇" options={currentData.domain} selected={brandData.domain} onSelect={v => setBrandData((d: any) => ({...d, domain: v}))} custom={brandData.customDomain} onCustomChange={v => setBrandData((d: any) => ({...d, customDomain: v}))} />}
              {wizardStep === 2 && <SelectionGroup title="特別背景" options={currentData.background} selected={brandData.background} onSelect={v => setBrandData((d: any) => ({...d, background: v}))} custom={brandData.customBackground} onCustomChange={v => setBrandData((d: any) => ({...d, customBackground: v}))} />}
              {wizardStep === 3 && <SelectionGroup title="目標人群 (人生階段)" options={currentData.lifeStage} selected={brandData.lifeStage} onSelect={v => setBrandData((d: any) => ({...d, lifeStage: v}))} custom={brandData.customLifeStage} onCustomChange={v => setBrandData((d: any) => ({...d, customLifeStage: v}))} />}
              {wizardStep === 4 && <SelectionGroup title="目標人群 (職業背景)" options={currentData.occupation} selected={brandData.occupation} onSelect={v => setBrandData((d: any) => ({...d, occupation: v}))} custom={brandData.customOccupation} onCustomChange={v => setBrandData((d: any) => ({...d, customOccupation: v}))} />}
              {wizardStep === 5 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center"><label className="text-sm font-black uppercase tracking-widest opacity-80">核心痛點</label>
                  <button onClick={handleFetchPainPoints} disabled={isGeneratingPain} className="flex items-center gap-2 text-[11px] font-black bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg border-2 border-amber-500/20 shadow-sm">{isGeneratingPain ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} AI 推薦</button></div>
                  <SelectionGroup title="" options={aiPainPoints} selected={brandData.pain} onSelect={v => setBrandData((d: any) => ({...d, pain: v}))} custom={brandData.customPain} onCustomChange={v => setBrandData((d: any) => ({...d, customPain: v}))} />
                </div>
              )}
              {wizardStep === 6 && <SelectionGroup title="內容風格" options={currentData.style} selected={brandData.style} onSelect={v => setBrandData((d: any) => ({...d, style: v}))} custom={brandData.customStyle} onCustomChange={v => setBrandData((d: any) => ({...d, customStyle: v}))} />}
              {wizardStep === 7 && (
                <div className="space-y-12">
                  <SelectionGroup title="相關成就" options={trustLabels} selected={brandData.trust} onSelect={v => setBrandData((d: any) => ({...d, trust: v}))} custom={brandData.customTrust} onCustomChange={v => setBrandData((d: any) => ({...d, customTrust: v}))} multi max={3} onAddOption={v => setExtraTrustLabels((p:any)=>[...p, v])} />
                  <SelectionGroup title="個人獨特性" options={uniqueLabels} selected={brandData.unique} onSelect={v => setBrandData((d: any) => ({...d, unique: v}))} custom={brandData.customUnique} onCustomChange={v => setBrandData((d: any) => ({...d, customUnique: v}))} multi max={3} onAddOption={v => setExtraUniqueLabels((p:any)=>[...p, v])} />
                  <div className="space-y-4 pt-6 border-t-2 border-black/5">
                    <label className="text-sm font-black uppercase tracking-widest opacity-80">行動呼籲 (CTA)</label>
                    <FastInput value={brandData.customCta} onChange={(v:any) => setBrandData((d: any) => ({...d, customCta: v}))} className={`w-full border-2 rounded-xl px-5 py-4 font-black ${tc.input}`} placeholder="例如：點擊連結領取扣稅全攻略 👇" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {wizardStep === 8 && (
          <div className="space-y-10 animate-in fade-in duration-700">
             <div className={`p-10 rounded-[3rem] border-2 ${tc.card} border-t-8 border-t-amber-500 shadow-2xl`}>
               <h3 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>您的 AI 定位報告</h3>
               {currentBrand?.bio && (
                  <div className={`p-8 rounded-3xl ${isDarkMode ? 'bg-black/30' : 'bg-slate-50'} border-2 mb-10 font-medium space-y-3 shadow-inner`}>
                    <p className="text-2xl font-black text-amber-500 tracking-tight">{currentBrand.bio.displayName}</p>
                    <p className={`text-lg leading-relaxed font-black ${tc.contentPrimary}`}>{currentBrand.bio.line1_value}</p>
                    <p className={`text-lg leading-relaxed font-black ${tc.contentPrimary}`}>{currentBrand.bio.line2_trust}</p>
                    <p className={`text-lg leading-relaxed font-black ${tc.contentPrimary}`}>{currentBrand.bio.line3_unique}</p>
                    <p className="text-amber-500 mt-4 font-black italic text-xl underline decoration-amber-500/30 underline-offset-8">{currentBrand.bio.line4_cta}</p>
                  </div>
               )}
               <div className="flex flex-col md:flex-row gap-4 mb-12">
                  <button onClick={handleSaveBrand} disabled={isSaved} className={`flex-1 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${isSaved ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500 text-black shadow-lg'}`}>
                    {isSaved ? <CheckCircle2 className="w-6 h-6" /> : <Save className="w-6 h-6" />} {isSaved ? '已同步雲端' : '儲存定位檔案'}
                  </button>
                  <button onClick={handleProcessBio} className={`flex-1 py-5 rounded-2xl font-black border-2 ${tc.border} hover:bg-slate-400/5 transition-all ${tc.text}`}>重新生成定位</button>
               </div>
               <div className={`p-8 rounded-3xl border-2 border-dashed border-amber-500/30 bg-white/5 mb-12 flex gap-3`}>
                  <input value={customTopicInput} onChange={(e) => setCustomTopicInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCustomTopicSubmit()} placeholder="輸入自創選題分析..." className={`flex-1 border-2 rounded-2xl px-5 py-4 outline-none focus:border-amber-500 font-black ${tc.input}`} />
                  <button onClick={handleCustomTopicSubmit} disabled={!customTopicInput.trim() || loading} className="px-6 rounded-2xl bg-amber-500 text-black font-black hover:bg-amber-400 transition-all"><Send className="w-5 h-5" /></button>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {topics.map((t: string, i: number) => (
                    <button key={i} onClick={() => handleSelectTopic(t)} className={`w-full text-left p-6 rounded-2xl border-2 ${tc.border} hover:border-amber-500 transition-all flex justify-between items-center group active:scale-[0.99]`}>
                      <span className={`font-black text-lg ${tc.contentPrimary}`}>{i+1}. {t}</span>
                      <ChevronRight className="w-5 h-5 text-amber-500" />
                    </button>
                  ))}
               </div>
             </div>
          </div>
        )}

        {wizardStep === 9 && currentBrand?.plan && (
          <div className="space-y-10 animate-in fade-in duration-700">
             <div className="flex justify-between items-end">
               <div><p className="text-amber-500 font-black text-sm uppercase tracking-widest mb-1">內容矩陣</p><h3 className={`text-3xl font-black italic ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{currentBrand.plan.selectedTopic}</h3></div>
               <button onClick={() => setWizardStep(8)} className="text-sm font-black text-amber-500 underline decoration-amber-500/20 underline-offset-4 flex items-center gap-2 hover:opacity-70 transition-all"><ArrowLeft className="w-4 h-4"/> 返回</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setExpandedContent('script')} className={`p-8 rounded-[2.5rem] border-2 ${tc.card} hover:border-emerald-500 cursor-pointer transition-all hover:translate-y-[-4px] shadow-xl group`}>
                  <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-emerald-500 rounded-2xl text-black shadow-lg"><Video className="w-6 h-6" /></div><h4 className={`font-black text-xl ${tc.text}`}>影音腳本</h4></div>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">深度對白與視覺建議</p>
                </div>
                <div onClick={() => setExpandedContent('thread')} className={`p-8 rounded-[2.5rem] border-2 ${tc.card} hover:border-blue-500 cursor-pointer transition-all hover:translate-y-[-4px] shadow-xl group`}>
                  <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg"><FileText className="w-6 h-6" /></div><h4 className={`font-black text-xl ${tc.text}`}>Threads 文案</h4></div>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">強烈洞察與長文分析</p>
                </div>
                <div onClick={() => setExpandedContent('magnet')} className={`p-8 rounded-[2.5rem] border-2 ${tc.card} hover:border-amber-500 cursor-pointer transition-all hover:translate-y-[-4px] shadow-xl group`}>
                  <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-amber-500 rounded-2xl text-black shadow-lg"><Target className="w-6 h-6" /></div><h4 className={`font-black text-xl ${tc.text}`}>贈品配置</h4></div>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">數據對比與避坑清單</p>
                </div>
             </div>

             {expandedContent === 'script' && (
               <Modal title="短影音腳本" onClose={() => setExpandedContent(null)} tc={tc}>
                  <div className="mb-6 p-6 rounded-3xl border-2 ${tc.border} bg-white/5"><label className="text-[11px] font-black uppercase opacity-70 mb-3 block">標題 (Caption)</label><p className={`font-black text-lg ${tc.contentPrimary}`}>{currentBrand.plan.script.caption}</p></div>
                  <div className={`overflow-x-auto border-2 ${tc.tableBorder} rounded-[2rem] shadow-xl ${tc.tableBg}`}>
                    <table className="w-full text-left border-collapse">
                      <thead className={`${tc.tableHeaderBg} text-emerald-700 font-black border-b-2 ${tc.tableBorder}`}>
                        <tr><th className="p-6 border-r-2 w-40 text-base">環節</th><th className="p-6 border-r-2 text-base">口播對白</th><th className="p-6 text-base">視覺畫面</th></tr>
                      </thead>
                      <tbody className={`divide-y-2 ${tc.tableBorder}`}>
                        {currentBrand.plan.script.steps.map((s: any, idx: number) => (
                          <tr key={idx} className="align-top hover:bg-slate-500/5">
                            <td className="p-6 font-black text-sm border-r-2 ${tc.tableBorder}">{s.stage}</td>
                            <td className={`p-6 border-r-2 ${tc.tableBorder} ${tc.contentPrimary} font-black text-xl leading-relaxed whitespace-pre-wrap`}>{s.dialogue}</td>
                            <td className={`p-6 text-sm italic ${tc.contentSecondary} font-black opacity-80`}>{s.visuals}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </Modal>
             )}

             {expandedContent === 'thread' && (
               <Modal title="Threads 長文案" onClose={() => setExpandedContent(null)} tc={tc}>
                  <div className={`p-12 rounded-[3rem] border-2 ${tc.border} ${tc.highlightCard} shadow-2xl`}>
                    <div className={`whitespace-pre-wrap text-2xl font-black leading-[2.4] tracking-wide ${tc.contentPrimary}`}>
                      {currentBrand.plan.thread?.content}
                    </div>
                  </div>
               </Modal>
             )}

             {expandedContent === 'magnet' && (
               <Modal title="Lead Magnet PDF 內容" onClose={() => setExpandedContent(null)} tc={tc}>
                  <div className="flex gap-4 p-1.5 bg-black/40 rounded-2xl border-2 border-slate-800 mb-8 inline-flex shadow-inner">
                     {['table', 'checklist', 'guides'].map((tab:any) => (
                        <button key={tab} onClick={() => setMagnetTab(tab)} className={`px-6 py-2 rounded-xl font-black text-sm capitalize transition-all ${magnetTab === tab ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>{tab}</button>
                     ))}
                  </div>
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {magnetTab === 'table' && currentBrand.plan.leadMagnet?.table && (
                      <div className="overflow-hidden border-2 border-amber-500/30 rounded-[2.5rem] shadow-2xl">
                          <table className="w-full text-lg">
                            <thead className="bg-amber-500 text-black"><tr>{currentBrand.plan.leadMagnet.table.headers.map((h:any)=><th key={h} className="p-6 text-left font-black">{h}</th>)}</tr></thead>
                            <tbody className={`${tc.tableBg} divide-y-2 ${tc.tableBorder}`}>
                              {currentBrand.plan.leadMagnet.table.rows.map((row:any, i:number)=>(<tr key={i} className="hover:bg-amber-500/5 transition-colors">{row.map((cell:any, j:number)=><td key={j} className="p-6 border-r-2 ${tc.tableBorder} last:border-0 font-black ${tc.contentPrimary}">{cell}</td>)}</tr>))}
                            </tbody>
                          </table>
                      </div>
                    )}
                    {magnetTab === 'checklist' && (
                      <div className={`p-12 rounded-[3rem] bg-emerald-500/5 border-2 border-emerald-500/20 space-y-6 shadow-2xl`}>
                        {currentBrand.plan.leadMagnet.checklist.map((item:any, i:number)=>(<div key={i} className="flex gap-6 items-start"><div className="mt-2 w-8 h-8 rounded-lg bg-emerald-500 flex-shrink-0 flex items-center justify-center text-black shadow-lg"><CheckCircle2 className="w-5 h-5" /></div><span className={`text-2xl font-black ${tc.contentPrimary} leading-relaxed`}>{item}</span></div>))}
                      </div>
                    )}
                    {magnetTab === 'guides' && (
                      <div className="grid md:grid-cols-2 gap-8">
                        {currentBrand.plan.leadMagnet.sections.map((s:any, i:number)=>(<div key={i} className={`p-8 rounded-[2.5rem] border-2 ${tc.card} hover:border-amber-500/50 transition-all shadow-xl group`}><h6 className="font-black text-xl text-amber-500 mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-sm font-black group-hover:scale-110 transition-transform">{i+1}</span>{s.title}</h6><ul className="space-y-4">{s.items.map((item:any, j:number)=><li key={j} className={`text-lg font-black flex gap-2 ${tc.contentSecondary} opacity-80`}><span className="opacity-40">•</span>{item}</li>)}</ul></div>))}
                      </div>
                    )}
                  </div>
               </Modal>
             )}
          </div>
        )}
      </main>
    </div>
  );
};

const AdminView = ({ tc, setView, isDarkMode, setIsDarkMode }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '' });
  const loadData = async () => { setLoading(true); const data = await cloudService.getUsers(); setUsers(data); setLoading(false); };
  useEffect(() => { loadData(); }, []);
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.username || !newUser.password) return;
    await cloudService.saveUser({ id: Math.random().toString(36).substr(2, 9), ...newUser, role: 'user', status: 'active', createdAt: new Date().toISOString() } as User);
    await loadData(); setShowAdd(false); setNewUser({ name: '', username: '', password: '' });
  };
  const toggleStatus = async (user: User) => { await cloudService.saveUser({ ...user, status: user.status === 'active' ? 'suspended' : 'active' } as User); await loadData(); };
  const handleDelete = async (id: string) => { if (confirm('確定刪除該學員及其所有雲端存檔嗎？')) { await cloudService.deleteUser(id); await loadData(); } };
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center"><h2 className={`text-3xl font-black italic ${tc.text}`}>管理系統 (雲端)</h2><div className="flex gap-4"><button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full border-2 ${tc.border}">{isDarkMode ? <Sun /> : <Moon />}</button><button onClick={() => setView('dashboard')} className={`px-6 py-3 rounded-2xl font-black border-2 ${tc.border} ${tc.text}`}>返回儀表板</button><button onClick={() => setShowAdd(true)} className="bg-amber-500 text-black px-6 py-3 rounded-2xl font-black hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"><UserPlus className="w-5 h-5" /> 新增學員</button></div></div>
      <div className={`border-2 ${tc.border} rounded-[2.5rem] overflow-hidden ${tc.card} shadow-2xl`}><table className="w-full text-left"><thead className={`border-b-2 ${tc.border} ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}><tr className={`text-xs font-black uppercase tracking-widest opacity-80 ${tc.text}`}><th className="p-6">學員姓名</th><th className="p-6">帳號</th><th className="p-6">狀態</th><th className="p-6 text-right">操作</th></tr></thead><tbody className={`divide-y-2 ${tc.border}`}>{users.map(u => (<tr key={u.id} className="hover:bg-white/5 transition-colors"><td className={`p-6 font-black ${tc.text}`}>{u.name}</td><td className={`p-6 font-mono text-sm ${tc.text} opacity-80`}>{u.username}</td><td className="p-6"><span className={`px-3 py-1 rounded-full text-[10px] font-black border-2 ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>{u.status === 'active' ? '使用中' : '已停用'}</span></td><td className="p-6 flex justify-end gap-2"><button onClick={() => toggleStatus(u)} className={`p-2 rounded-xl border-2 ${tc.border}`}>{u.status === 'active' ? <Ban className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-emerald-600" />}</button><button onClick={() => handleDelete(u.id)} className={`p-2 rounded-xl border-2 ${tc.border} hover:bg-red-500 transition-colors`}><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody></table></div>
      {showAdd && (<div className="fixed inset-0 z-[400] flex items-center justify-center p-4 backdrop-blur-md bg-black/60"><div className={`w-full max-w-md rounded-[2.5rem] border-2 ${tc.modalCard} p-8 relative shadow-2xl`}><button onClick={() => setShowAdd(false)} className={`absolute top-5 right-5 p-2 rounded-full hover:bg-slate-500/10 ${tc.text}`}><X className="w-5 h-5" /></button><h3 className={`text-xl font-black italic mb-6 ${tc.text}`}>新增學員</h3><div className="space-y-4"><input value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className={`w-full border-2 rounded-xl px-4 py-3 font-black ${tc.input}`} placeholder="姓名" /><input value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className={`w-full border-2 rounded-xl px-4 py-3 font-black ${tc.input}`} placeholder="帳號" /><input value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className={`w-full border-2 rounded-xl px-4 py-3 font-black ${tc.input}`} placeholder="密碼" /><button onClick={handleAddUser} className="w-full py-4 rounded-xl bg-amber-500 text-black font-black shadow-xl">確認新增</button></div></div></div>)}
    </main>
  );
};

// ==========================================
// 3. Main App Component
// ==========================================

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('login');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [generatingDetail, setGeneratingDetail] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ name: '', username: '', password: '' });
  const [extraTrustLabels, setExtraTrustLabels] = useState<string[]>([]);
  const [extraUniqueLabels, setExtraUniqueLabels] = useState<string[]>([]);
  const [brandData, setBrandData] = useState<BrandData>({
    name: '', domain: '', customDomain: '', background: '', customBackground: '',
    lifeStage: '', customLifeStage: '', occupation: '', customOccupation: '',
    pain: '', customPain: '', style: '', customStyle: '',
    trust: [], customTrust: '', unique: [], customUnique: '',
    cta: '', customCta: ''
  });

  // 初始化 App 與雲端同步
  useEffect(() => {
    const initApp = async () => {
      const session = localStorage.getItem('mofo_session');
      if (session) {
        const u = JSON.parse(session);
        setUser(u);
        const cloudBrands = await cloudService.getBrands(u.id);
        setBrands(cloudBrands);
        setView(u.role === 'admin' ? 'admin' : 'dashboard');
        setSettingsForm({ name: u.name, username: u.username, password: u.password || '' });
      }
      setInitialLoading(false);
    };
    initApp();
  }, []);

  const handleLogin = async (u: string, p: string) => {
    setLoading(true); setError('');
    if (u === ADMIN_USER.username && p === ADMIN_USER.password) {
      setUser(ADMIN_USER); localStorage.setItem('mofo_session', JSON.stringify(ADMIN_USER));
      const bds = await cloudService.getBrands(ADMIN_USER.id); setBrands(bds); setView('admin'); setLoading(false); return;
    }
    const cloudUsers = await cloudService.getUsers();
    const found = cloudUsers.find(user => user.username === u && user.password === p);
    if (found) {
      if (found.status === 'suspended') setError('帳號已被停用');
      else {
        setUser(found); setSettingsForm({ name: found.name, username: found.username, password: found.password || '' });
        localStorage.setItem('mofo_session', JSON.stringify(found));
        const bds = await cloudService.getBrands(found.id); setBrands(bds); setView('dashboard');
      }
    } else setError('帳號或密碼錯誤');
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    const updatedUser = { ...user, ...settingsForm };
    await cloudService.saveUser(updatedUser);
    setUser(updatedUser); localStorage.setItem('mofo_session', JSON.stringify(updatedUser));
    setShowSettings(false); alert('已同步雲端設定');
  };

  const handleNewBrand = (mode: BrandMode) => {
    const b: Brand = { id: Math.random().toString(36).substr(2, 9), userId: user?.id || '', mode, data: { name: '', domain: '', customDomain: '', background: '', customBackground: '', lifeStage: '', customLifeStage: '', occupation: '', customOccupation: '', pain: '', customPain: '', style: '', customStyle: '', trust: [], customTrust: '', unique: [], customUnique: '', cta: '', customCta: '' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setCurrentBrand(b); setBrandData(b.data); setWizardStep(0); setView('wizard'); setIsSaved(false);
  };

  const handleOpenBrand = (b: Brand) => { setCurrentBrand(b); setBrandData(b.data); setWizardStep(b.bio ? 8 : 0); setTopics(b.topics || []); setView('wizard'); setIsSaved(true); };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (confirm(`確定刪除「${name}」？`)) { await cloudService.deleteBrand(id); const updated = await cloudService.getBrands(user?.id); setBrands(updated); }
  };

  const handleProcessBio = async () => {
    if (!currentBrand) return; setLoading(true);
    try {
      const bio = await generateBio(currentBrand.mode, brandData);
      const ts = await generateTopics(bio, brandData);
      const updatedBrand = { ...currentBrand, data: brandData, bio, topics: ts, updatedAt: new Date().toISOString() };
      setCurrentBrand(updatedBrand); setTopics(ts); setWizardStep(8);
    } catch (e) { alert("AI 生成失敗，請重試"); } finally { setLoading(false); }
  };

  const handleRefreshTopics = async () => {
    if (!currentBrand?.bio) return; setLoading(true);
    try { const ts = await generateTopics(currentBrand.bio, brandData); setTopics(ts); } 
    catch (e) { alert("刷新失敗"); } finally { setLoading(false); }
  };

  const handleSelectTopic = async (topic: string) => {
    if (!currentBrand?.bio) return; setGeneratingDetail(true);
    try { 
      const plan = await generateDetailedContent(topic, currentBrand.bio, brandData); 
      setCurrentBrand({ ...currentBrand, plan }); setWizardStep(9); 
    } catch (e) { alert("內容生成失敗"); } finally { setGeneratingDetail(false); }
  };

  const handleSaveBrand = async () => {
    if (!currentBrand || !user) return; setLoading(true);
    await cloudService.saveBrand(currentBrand);
    const updated = await cloudService.getBrands(user.id); setBrands(updated); setIsSaved(true); setLoading(false); alert("已同步至雲端");
  };

  const tc = {
    bg: isDarkMode ? 'bg-[#0f1115]' : 'bg-slate-50',
    text: isDarkMode ? 'text-slate-200' : 'text-slate-950',
    card: isDarkMode ? 'bg-[#181b21] border-white/5 shadow-black/30' : 'bg-white border-slate-300 shadow-slate-100',
    border: isDarkMode ? 'border-white/5' : 'border-slate-300',
    navBg: isDarkMode ? 'bg-[#0f1115]/80' : 'bg-white/80',
    input: isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-950',
    modalCard: isDarkMode ? 'bg-[#181b21] border-white/10' : 'bg-white border-slate-300 shadow-2xl',
    contentPrimary: isDarkMode ? 'text-slate-200' : 'text-slate-950',
    contentSecondary: isDarkMode ? 'text-slate-400' : 'text-slate-800',
    tableBg: isDarkMode ? 'bg-black/40' : 'bg-white',
    tableHeaderBg: isDarkMode ? 'bg-white/5' : 'bg-slate-100',
    tableBorder: isDarkMode ? 'border-white/5' : 'border-slate-300',
    highlightCard: isDarkMode ? 'bg-white/5' : 'bg-amber-50/30'
  };

  const Navigation = () => (
    <nav className={`border-b-2 ${tc.border} p-5 flex justify-between items-center sticky top-0 z-50 ${tc.navBg} backdrop-blur-md transition-all shadow-sm`}>
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
        <div className="bg-amber-500 p-2 rounded-xl shadow-lg shadow-amber-500/20"><Trophy className="w-5 h-5 text-black" /></div>
        <span className={`font-black italic text-xl tracking-tighter ${tc.text}`}>MOFO <span className="text-amber-500 not-italic">CREATOR</span></span>
      </div>
      <div className="flex items-center gap-3">
        {user?.role === 'admin' && <button onClick={() => setView('admin')} className="flex items-center gap-2 text-xs font-black bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl border-2 border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all">管理學員</button>}
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full transition-colors bg-white/5 text-amber-500">{isDarkMode ? <Sun /> : <Moon />}</button>
        <button onClick={() => setShowSettings(true)} className={`p-2.5 rounded-full border-2 ${tc.border} hover:bg-slate-400/10 transition-colors ${tc.text}`}><Settings className="w-5 h-5 opacity-80" /></button>
      </div>
    </nav>
  );

  const SettingsModalUI = () => (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-in fade-in duration-200">
      <div className={`w-full max-w-sm rounded-[2.5rem] border-2 ${tc.modalCard} p-8 relative shadow-2xl`}>
        <button onClick={() => setShowSettings(false)} className={`absolute top-5 right-5 p-2 rounded-full hover:bg-slate-500/10 ${tc.text}`}><X className="w-5 h-5" /></button>
        <h3 className={`text-xl font-black italic mb-6 ${tc.text}`}>個人設定</h3>
        <div className="space-y-4">
          <input value={settingsForm.name} onChange={(e) => setSettingsForm((f: any) => ({...f, name: e.target.value}))} className={`w-full border-2 rounded-xl px-4 py-3 font-black ${tc.input}`} placeholder="顯示姓名" />
          <input value={settingsForm.username} onChange={(e) => setSettingsForm((f: any) => ({...f, username: e.target.value}))} className={`w-full border-2 rounded-xl px-4 py-3 font-black ${tc.input}`} placeholder="登入帳號" />
          <input type="password" value={settingsForm.password} onChange={(e) => setSettingsForm((f: any) => ({...f, password: e.target.value}))} className={`w-full border-2 rounded-xl px-4 py-3 font-black ${tc.input}`} placeholder="密碼" />
          <button onClick={handleUpdateProfile} className="w-full py-4 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 shadow-xl shadow-amber-500/10 mt-4">儲存並同步</button>
          <button onClick={() => { localStorage.removeItem('mofo_session'); setView('login'); setUser(null); setShowSettings(false); }} className="w-full py-3 rounded-xl bg-red-500/10 text-red-600 font-black flex items-center justify-center gap-2 mt-2"><LogOut className="w-4 h-4" /> 登出系統</button>
        </div>
      </div>
    </div>
  );

  if (initialLoading) return <LoadingOverlay message="正在安全連線至雲端數據庫..." />;
  if (view === 'login') return <LoginView onLogin={handleLogin} loading={loading} error={error} isDarkMode={isDarkMode} toggleTheme={()=>setIsDarkMode(!isDarkMode)} />;

  return (
    <div className={`min-h-screen ${tc.bg} transition-colors duration-300`}>
      <Navigation />
      {showSettings && <SettingsModalUI />}
      {view === 'admin' && <AdminView tc={tc} setView={setView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
      {view === 'dashboard' && <DashboardView onOpenBrand={handleOpenBrand} brands={brands} handleDeleteBrand={handleDeleteBrand} handleNewBrand={handleNewBrand} tc={tc} isDarkMode={isDarkMode} />}
      {view === 'wizard' && (
        <WizardView 
          mode={currentBrand?.mode} 
          wizardStep={wizardStep} 
          setWizardStep={setWizardStep} 
          brandData={brandData} 
          setBrandData={setBrandData} 
          loading={loading} 
          generatingDetail={generatingDetail} 
          extraTrustLabels={extraTrustLabels} 
          setExtraTrustLabels={setExtraTrustLabels} 
          extraUniqueLabels={extraUniqueLabels} 
          setExtraUniqueLabels={setExtraUniqueLabels} 
          topics={topics} 
          currentBrand={currentBrand} 
          expandedContent={expandedContent} 
          setExpandedContent={setExpandedContent} 
          tc={tc} 
          isDarkMode={isDarkMode} 
          handleProcessBio={handleProcessBio} 
          handleRefreshTopics={handleRefreshTopics} 
          handleSelectTopic={handleSelectTopic} 
          setView={setView} 
          handleSaveBrand={handleSaveBrand} 
          isSaved={isSaved} 
        />
      )}
    </div>
  );
};

export default App;