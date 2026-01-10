import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';
import { AppView, User, UserProfile } from './types';
import { aiService } from './services/geminiService';
import { cloudService } from './services/cloudService';

import { LoginView, DashboardView } from './components/Views';
import { ProfileView } from './components/ProfileView';
import { TargetView } from './components/TargetView';
import { PainPointView } from './components/PainPointView';
import { StrategyView } from './components/StrategyView';
import { ScriptView } from './components/ScriptView';

// 💎 VERSION 2.1.2: DEFENSIVE RENDERING
console.log('🚀 CURRENT_PROJECT: mofo-creator-v2.1.2');

const ADMIN_USER: User = { 
  id: 'admin_static', name: 'MOFO Master', username: 'admin', 
  role: 'admin', status: 'active', createdAt: new Date().toISOString() 
};

const App = () => {
  const [view, setView] = useState<AppView>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfile>({
    role: '銷售', name: '', age: '', gender: '男', profession: '', experience: '', hobbies: ''
  });
  const [aiData, setAiData] = useState<any>({ targets: [], pains: [], strategies: [], script: { steps: [] }, extensions: [] });
  const [selections, setSelections] = useState<any>({ targets: [], pains: [], strategy: '' });

  useEffect(() => {
    const init = async () => {
      const session = localStorage.getItem('mofo_session');
      if (session) {
        try { setUser(JSON.parse(session)); setView('dashboard'); } catch (e) { localStorage.removeItem('mofo_session'); }
      }
      setInitialLoading(false);
    };
    init();
  }, []);

  const handleLogin = async (u: string, p: string) => {
    setLoading(true);
    if (u === ADMIN_USER.username && p === 'mofo2026') {
      setUser(ADMIN_USER); localStorage.setItem('mofo_session', JSON.stringify(ADMIN_USER)); setView('dashboard');
    } else {
      try {
        const users = await cloudService.getUsers();
        const found = users.find(user => user.username === u && user.password === p);
        if (found) { setUser(found); localStorage.setItem('mofo_session', JSON.stringify(found)); setView('dashboard'); }
        else alert("帳號或密碼錯誤");
      } catch (e) { alert("雲端同步異常"); }
    }
    setLoading(false);
  };

  const handleNext = async (cv: AppView) => {
    setLoading(true);
    try {
      if (cv === 'profile') {
        const res = await aiService.getTargets(profile);
        setAiData((prev: any) => ({ ...prev, targets: Array.isArray(res) ? res : [] }));
        setView('target');
      } else if (cv === 'target') {
        const res = await aiService.getPains(selections.targets);
        setAiData((prev: any) => ({ ...prev, pains: Array.isArray(res) ? res : [] }));
        setView('pain');
      } else if (cv === 'pain') {
        const res = await aiService.getStrategies(selections.pains);
        setAiData((prev: any) => ({ ...prev, strategies: Array.isArray(res) ? res : [] }));
        setView('strategy');
      } else if (cv === 'strategy') {
        const res = await aiService.getFinalScript("主要內容題目", profile, selections.strategy);
        const ext = await aiService.getExtensions("主要內容題目");
        setAiData((prev: any) => ({ ...prev, script: res, extensions: Array.isArray(ext) ? ext : [] }));
        setView('script');
      }
    } catch (e) { alert("AI 思考中，請重試"); }
    setLoading(false);
  };

  if (initialLoading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white font-black animate-pulse">MOFO CLOUD SYNCING...</div>;
  if (view === 'login') return <LoginView onLogin={handleLogin} loading={loading} isDarkMode={true} />;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <header className="mb-10 flex justify-between items-center border-b border-white/5 pb-6">
          <h1 className="text-2xl font-black italic text-white tracking-tighter uppercase">MOFO <span className="text-amber-500">CREATOR</span></h1>
          {view !== 'dashboard' && <button onClick={() => setView('dashboard')} className="text-xs font-bold opacity-40 hover:opacity-100 flex items-center gap-1"><ArrowLeft size={12}/> 返回</button>}
        </header>

        {view === 'dashboard' && <DashboardView onLaunchCreator={() => setView('profile')} isDarkMode={true} brands={[]} />}
        {view === 'profile' && <ProfileView form={profile} setForm={setProfile} onNext={() => handleNext('profile')} loading={loading} />}
        {view === 'target' && <TargetView targets={aiData.targets} selectedTargets={selections.targets} setSelectedTargets={(v: any) => setSelections({ ...selections, targets: v })} onNext={() => handleNext('target')} loading={loading} />}
        {view === 'pain' && <PainPointView pains={aiData.pains} selectedPains={selections.pains} setSelectedPains={(v: any) => setSelections({ ...selections, pains: v })} onNext={() => handleNext('pain')} loading={loading} />}
        {view === 'strategy' && <StrategyView strategies={aiData.strategies} selectedStrategy={selections.strategy} setSelectedStrategy={(v: any) => setSelections({ ...selections, strategy: v })} onNext={() => handleNext('strategy')} loading={loading} />}
        {view === 'script' && <ScriptView script={aiData.script} extensions={aiData.extensions} onExtend={()=>{}} />}
      </div>
      {loading && <div className="fixed bottom-10 right-10 flex items-center gap-3 bg-amber-500 text-black px-8 py-4 rounded-full font-black shadow-2xl animate-bounce"><RefreshCw className="animate-spin" size={20} /> AI 計算中...</div>}
    </div>
  );
};

export default App;