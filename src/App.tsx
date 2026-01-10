import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, RefreshCw, LogOut } from 'lucide-react';
import { AppView, User, UserProfile } from './types';
import { aiService } from './services/geminiService';
import { cloudService } from './services/cloudService';

import { LoginView, DashboardView } from './components/Views';
import { ProfileView } from './components/ProfileView';
import { TargetView } from './components/TargetView';
import { PainPointView } from './components/PainPointView';
import { StrategyView } from './components/StrategyView';
import { ScriptView } from './components/ScriptView';

console.log('🚀 CURRENT_PROJECT: mofo-creator-v2.1.0_FIXED');

const ADMIN_USER: User = { 
  id: 'admin_static', name: 'MOFO Master', username: 'admin', 
  role: 'admin', status: 'active', createdAt: new Date().toISOString() 
};

const App = () => {
  const [view, setView] = useState<AppView>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [profile, setProfile] = useState<UserProfile>({ role: '銷售', name: '', age: '', gender: '男', profession: '', experience: '', hobbies: '' });
  const [aiData, setAiData] = useState<any>({ targets: [], pains: [], strategies: [], script: null, extensions: [] });
  const [selections, setSelections] = useState({ targets: [], pains: [], strategy: '' });

  useEffect(() => {
    const initApp = async () => {
      const session = localStorage.getItem('mofo_session');
      if (session) {
        try {
          const u = JSON.parse(session); setUser(u);
          setView('dashboard');
        } catch (e) { console.error("Session fail"); }
      }
      setInitialLoading(false);
    };
    initApp();
  }, []);

  const handleLogin = async (u: string, p: string) => {
    setLoading(true);
    if (u === ADMIN_USER.username && p === 'mofo2026') {
      setUser(ADMIN_USER); setView('dashboard');
    } else {
      const users = await cloudService.getUsers();
      const found = users.find(user => user.username === u && user.password === p);
      if (found) { setUser(found); setView('dashboard'); }
      else alert("帳號或密碼錯誤");
    }
    setLoading(false);
  };

  const handleNext = async (currentView: AppView) => {
    setLoading(true);
    try {
      if (currentView === 'profile') {
        const res = await aiService.getTargets(profile);
        setAiData({ ...aiData, targets: res });
        setView('target');
      } else if (currentView === 'target') {
        const res = await aiService.getPains(selections.targets);
        setAiData({ ...aiData, pains: res });
        setView('pain');
      } else if (currentView === 'pain') {
        const res = await aiService.getStrategies(selections.pains);
        setAiData({ ...aiData, strategies: res });
        setView('strategy');
      } else if (currentView === 'strategy') {
        const res = await aiService.getFinalScript("核心選題", profile, selections.strategy);
        const ext = await aiService.getExtensions("核心選題");
        setAiData({ ...aiData, script: res, extensions: ext });
        setView('script');
      }
    } catch (e) {
      alert("AI 思考中，請確保 VPN 已開啟 (Gemini 2.0 限制)");
    }
    setLoading(false);
  };

  if (initialLoading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-amber-500 font-black animate-pulse italic">MOFO CLOUD SYNCING...</div>;
  if (view === 'login') return <LoginView onLogin={handleLogin} loading={loading} isDarkMode={true} />;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <header className="mb-10 flex justify-between items-center border-b border-white/5 pb-6">
          <h1 className="text-2xl font-black italic text-white">MOFO <span className="text-amber-500">CREATOR v2.1.0</span></h1>
          {view !== 'dashboard' && <button onClick={() => setView('dashboard')} className="text-xs font-bold opacity-40 hover:opacity-100 flex items-center gap-1"><ArrowLeft size={12}/> 返回主頁</button>}
        </header>

        {view === 'dashboard' && <DashboardView onLaunchCreator={() => setView('profile')} isDarkMode={true} brands={[]} />}
        {view === 'profile' && <ProfileView form={profile} setForm={setProfile} onNext={() => handleNext('profile')} loading={loading} />}
        {view === 'target' && <TargetView targets={aiData.targets} selectedTargets={selections.targets} setSelectedTargets={(v: any) => setSelections({ ...selections, targets: v })} onNext={() => handleNext('target')} loading={loading} />}
        {view === 'pain' && <PainPointView pains={aiData.pains} selectedPains={selections.pains} setSelectedPains={(v: any) => setSelections({ ...selections, pains: v })} onNext={() => handleNext('pain')} loading={loading} />}
        {view === 'strategy' && <StrategyView strategies={aiData.strategies} selectedStrategy={selections.strategy} setSelectedStrategy={(v: any) => setSelections({ ...selections, strategy: v })} onNext={() => handleNext('strategy')} loading={loading} />}
        {view === 'script' && <ScriptView script={aiData.script} extensions={aiData.extensions} onExtend={()=>{}} />}
        
        {loading && <div className="fixed bottom-10 right-10 flex items-center gap-3 bg-amber-500 text-black px-8 py-4 rounded-full font-black animate-bounce shadow-2xl z-[100]"><RefreshCw className="animate-spin" size={20} /> AI 計算中...</div>}
      </div>
    </div>
  );
};

export default App;