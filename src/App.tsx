import React, { useState, useEffect } from 'react';
import { AppView, User, Brand } from './types';
import { cloudService } from './services/cloudService';
import { LoginView, DashboardView, AdminView, Navigation, SettingsModalUI } from './components/Views';
import { WizardView } from './components/WizardView';
import { AIGenCreator } from './components/AIGenCreator';

const ADMIN_USER: User = { id: 'admin_static', name: 'MOFO Master', username: 'admin', password: 'mofo2026', role: 'admin', status: 'active', createdAt: new Date().toISOString() };

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('login');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // 設置 5 秒超時，防止連線卡死
      const timeout = setTimeout(() => { if (initialLoading) setInitialLoading(false); }, 5000);
      
      const session = localStorage.getItem('mofo_session');
      if (session) {
        try {
          const u = JSON.parse(session); setUser(u);
          const cloudBrands = await cloudService.getBrands(u.id);
          setBrands(cloudBrands);
          setView(u.role === 'admin' ? 'admin' : 'dashboard');
        } catch (e) { console.error("Session sync failed"); }
      }
      clearTimeout(timeout);
      setInitialLoading(false);
    };
    initApp();
  }, []);

  const handleLogin = async (u: string, p: string) => {
    setLoading(true);
    if (u === ADMIN_USER.username && p === ADMIN_USER.password) {
      setUser(ADMIN_USER); localStorage.setItem('mofo_session', JSON.stringify(ADMIN_USER));
      setBrands(await cloudService.getBrands(ADMIN_USER.id)); setView('admin'); setLoading(false); return;
    }
    try {
      const users = await cloudService.getUsers();
      const found = users.find(user => user.username === u && user.password === p);
      if (found) {
        setUser(found); localStorage.setItem('mofo_session', JSON.stringify(found));
        setBrands(await cloudService.getBrands(found.id)); setView('dashboard');
      } else { alert("帳號或密碼錯誤"); }
    } catch (e) { alert("雲端連線失敗，請檢查網路"); }
    setLoading(false);
  };

  if (initialLoading) {
    return <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center text-white gap-4 font-black animate-pulse">MOFO CLOUD CONNECTING...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f1115]">
      {view !== 'login' && view !== 'ai-creator' && <Navigation user={user} setView={setView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setShowSettings={setShowSettings} />}
      {showSettings && <SettingsModalUI setShowSettings={setShowSettings} />}
      {view === 'login' && <LoginView onLogin={handleLogin} loading={loading} />}
      {view === 'dashboard' && <DashboardView brands={brands} onLaunchCreator={() => setView('ai-creator')} onOpenBrand={(b:any)=>{setCurrentBrand(b); setView('wizard');}} />}
      {view === 'ai-creator' && <AIGenCreator onBack={() => setView('dashboard')} isDarkMode={true} tc={{}} />}
      {view === 'wizard' && <WizardView setView={setView} />}
      {view === 'admin' && <AdminView setView={setView} />}
    </div>
  );
};
export default App;
