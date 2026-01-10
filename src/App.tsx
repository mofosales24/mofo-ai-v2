import React, { useState, useEffect } from 'react';
import { AppView, User, Brand, BrandMode } from './types';
import { cloudService } from './services/cloudService';
import { LoginView, DashboardView, AdminView, Navigation } from './components/Views';
import { WizardView } from './components/WizardView';
import { AIGenCreator } from './components/AIGenCreator';

console.log('🚀 CURRENT_PROJECT: mofo-creator-v2.0.4');
console.log('💎 VERSION: 2.0.4_FINAL_STABLE');

const ADMIN_USER: User = { id: 'admin_static', name: 'MOFO Master', username: 'admin', password: 'mofo2026', role: 'admin', status: 'active', createdAt: new Date().toISOString() };

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('login');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDarkMode] = useState(true);

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

  const tc = { bg: 'bg-[#0f1115]', text: 'text-slate-200', border: 'border-white/5', navBg: 'bg-[#0f1115]/80' };

  if (initialLoading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white font-black animate-pulse">MOFO V2.0.4 SYNCING...</div>;
  if (view === 'login') return <LoginView onLogin={async (u:string,p:string)=>{
    if(u===ADMIN_USER.username && p===ADMIN_USER.password) { setUser(ADMIN_USER); setView('admin'); return; }
    const users = await cloudService.getUsers();
    const found = users.find(user => user.username === u && user.password === p);
    if(found) { setUser(found); setBrands(await cloudService.getBrands(found.id)); setView('dashboard'); } else alert("Error");
  }} isDarkMode={isDarkMode} />;

  return (
    <div className={`min-h-screen ${tc.bg}`}>
      {view !== 'ai-creator' && <Navigation user={user} setView={setView} tc={tc} />}
      {view === 'dashboard' && <DashboardView brands={brands} onOpenBrand={(b:any)=>{setCurrentBrand(b); setView('wizard');}} onLaunchCreator={() => setView('ai-creator')} isDarkMode={isDarkMode} tc={tc} />}
      {view === 'ai-creator' && <AIGenCreator onBack={() => setView('dashboard')} isDarkMode={isDarkMode} tc={tc} />}
      {view === 'wizard' && <WizardView mode={currentBrand?.mode} tc={tc} setView={setView} currentBrand={currentBrand} />}
      {view === 'admin' && <AdminView setView={setView} />}
    </div>
  );
};
export default App;
