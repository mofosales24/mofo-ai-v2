import React, { useState, useEffect } from 'react';
import { AppView, User, Brand } from './types';
import { cloudService } from './services/cloudService';
import { LoginView, DashboardView, AdminView, Navigation, SettingsModalUI } from './components/Views';
import { WizardView } from './components/WizardView';
import { AIGenCreator } from './components/AIGenCreator';

console.log('🚀 CURRENT_PROJECT: mofo-creator-v2.0.6');
console.log('💎 VERSION: 2.0.6_STABLE');

const ADMIN_USER: User = { id: 'admin_static', name: 'MOFO Master', username: 'admin', password: 'mofo2026', role: 'admin', status: 'active', createdAt: new Date().toISOString() };

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('login');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const init = async () => {
      const session = localStorage.getItem('mofo_session');
      if (session) {
        const u = JSON.parse(session); setUser(u);
        setBrands(await cloudService.getBrands(u.id));
        setView(u.role === 'admin' ? 'admin' : 'dashboard');
      }
      setInitialLoading(false);
    };
    init();
  }, []);

  const handleLogin = async (u: string, p: string) => {
    if (u === ADMIN_USER.username && p === ADMIN_USER.password) {
      setUser(ADMIN_USER); localStorage.setItem('mofo_session', JSON.stringify(ADMIN_USER));
      setBrands(await cloudService.getBrands(ADMIN_USER.id)); setView('admin'); return;
    }
    const users = await cloudService.getUsers();
    const found = users.find(user => user.username === u && user.password === p);
    if (found) {
      setUser(found); localStorage.setItem('mofo_session', JSON.stringify(found));
      setBrands(await cloudService.getBrands(found.id)); setView('dashboard');
    } else alert("Error");
  };

  if (initialLoading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white font-black animate-pulse">MOFO V2.0.6 SYNCING...</div>;
  if (view === 'login') return <LoginView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#0f1115]">
      {view !== 'ai-creator' && <Navigation user={user} setView={setView} isDarkMode={isDarkMode} setShowSettings={setShowSettings} tc={{}} />}
      {showSettings && <SettingsModalUI setShowSettings={setShowSettings} setView={setView} />}
      {view === 'dashboard' && <DashboardView brands={brands} onLaunchCreator={() => setView('ai-creator')} onOpenBrand={(b:any)=>{setCurrentBrand(b); setView('wizard');}} />}
      {view === 'ai-creator' && <AIGenCreator onBack={() => setView('dashboard')} isDarkMode={isDarkMode} tc={{}} />}
      {view === 'wizard' && <WizardView setView={setView} />}
      {view === 'admin' && <AdminView setView={setView} />}
    </div>
  );
};
export default App;
