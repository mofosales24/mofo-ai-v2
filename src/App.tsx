import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, RefreshCw, LogOut } from 'lucide-react';
import { AppView, User, UserProfile } from './types';
import { aiService } from './services/geminiService';
import { cloudService } from './services/cloudService';

import { LoginView, DashboardView, AdminView, Navigation, SettingsModalUI } from './components/Views';
import { ProfileView } from './components/ProfileView';
import { TargetView } from './components/TargetView';
import { PainPointView } from './components/PainPointView';
import { StrategyView } from './components/StrategyView';
import { ScriptView } from './components/ScriptView';

const ADMIN_USER: User = { 
  id: 'admin_static', name: 'MOFO Master', username: 'admin', 
  role: 'admin', status: 'active', createdAt: new Date().toISOString() 
};

const App = () => {
  const [view, setView] = useState<AppView>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({ role: '銷售', name: '', age: '', gender: '男', profession: '', experience: '', hobbies: '' });
  const [aiData, setAiData] = useState<any>({ targets: [], pains: [], strategies: [], script: null, extensions: [] });
  const [selections, setSelections] = useState<any>({ targets: [], pains: [], strategy: '' });

  useEffect(() => {
    const initApp = async () => {
      const session = localStorage.getItem('mofo_session');
      if (session) {
        try {
          const u = JSON.parse(session);
          setUser(u);
          setView(u.role === 'admin' ? 'admin' : 'dashboard');
        } catch (e) { console.error("Session sync failed"); }
      }
      setInitialLoading(false);
    };
    initApp();
  }, []);

  const handleLogin = async (u: string, p: string) => {
    setLoading(true);
    if (u === ADMIN_USER.username && p === 'mofo2026') {
      setUser(ADMIN_USER);
      localStorage.setItem('mofo_session', JSON.stringify(ADMIN_USER));
      setView('admin');
    } else {
      const users = await cloudService.getUsers();
      const found = users.find(user => user.username === u && user.password === p);
      if (found) {
        if (found.status === 'suspended') alert("帳號停用");
        else { setUser(found); localStorage.setItem('mofo_session', JSON.stringify(found)); setView('dashboard'); }
      } else alert("帳號密碼錯誤");
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
    } catch (e) { alert("AI 思考中，請確保 VPN 已開啟"); }
    setLoading(false);
  };

  const tc = { bg: 'bg-[#0f1115]', border: 'border-white/5', navBg: 'bg-[#0f1115]/80', text: 'text-slate-200', card: 'bg-[#181b21] border-white/5', input: 'bg-black/20 border-white/10 text-white', modalCard: 'bg-[#181b21] border-white/10' };

  if (initialLoading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-amber-500 font-black animate-pulse italic">MOFO CLOUD SYNCING...</div>;
  if (view === 'login') return <LoginView onLogin={handleLogin} loading={loading} isDarkMode={true} />;

  return (
    <div className={`min-h-screen ${tc.bg}`}>
      <Navigation user={user} setView={setView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setShowSettings={setShowSettings} tc={tc} />
      {showSettings && <SettingsModalUI setShowSettings={setShowSettings} setView={setView} tc={tc} />}
      
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {view === 'admin' && <AdminView setView={setView} />}
        {view === 'dashboard' && <DashboardView onLaunchCreator={() => setView('profile')} isDarkMode={isDarkMode} tc={tc} />}
        {view === 'profile' && <ProfileView form={profile} setForm={setProfile} onNext={() => handleNext('profile')} loading={loading} />}
        {view === 'target' && <TargetView targets={aiData.targets} selectedTargets={selections.targets} setSelectedTargets={(val: any) => setSelections({...selections, targets: val})} onNext={() => handleNext('target')} loading={loading} />}
        {view === 'pain' && <PainPointView pains={aiData.pains} selectedPains={selections.pains} setSelectedPains={(val: any) => setSelections({...selections, pains: val})} onNext={() => handleNext('pain')} loading={loading} />}
        {view === 'strategy' && <StrategyView strategies={aiData.strategies} selectedStrategy={selections.strategy} setSelectedStrategy={(val: any) => setSelections({...selections, strategy: val})} onNext={() => handleNext('strategy')} loading={loading} />}
        {view === 'script' && <ScriptView script={aiData.script} extensions={aiData.extensions} onExtend={(ext: string) => { /* 拓展腳本 */ }} />}
      </div>
      
      {loading && <div className="fixed bottom-10 right-10 flex items-center gap-3 bg-amber-500 text-black px-8 py-4 rounded-full font-black animate-bounce shadow-2xl z-[100]"><RefreshCw className="animate-spin" size={20} /> AI 內容計算中...</div>}
    </div>
  );
};

export default App;