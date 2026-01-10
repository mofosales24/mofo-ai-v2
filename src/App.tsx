import React, { useState, useEffect } from 'react';
// 💎 2.0.2 正式版標記
console.log('🚀 CURRENT_PROJECT: mofo-creator-v2-final');
console.log('💎 VERSION: 2.0.2_FIXED_TS');

import { AppView, User, Brand, BrandMode, BrandData } from './types';
import { cloudService } from './services/cloudService';
import { generateBio, generateTopics, generateDetailedContent } from './services/geminiService';

// 引入拆分後的組件
import { 
  LoginView, 
  DashboardView, 
  AdminView, 
  Navigation, 
  SettingsModalUI 
} from './components/Views';
import { WizardView } from './components/WizardView';
import { AIGenCreator } from './components/AIGenCreator';

const ADMIN_USER: User = { 
  id: 'admin_static', 
  name: 'MOFO Master', 
  username: 'admin', 
  password: 'mofo2026',
  role: 'admin', 
  status: 'active', 
  createdAt: new Date().toISOString() 
};

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

  useEffect(() => {
    const initApp = async () => {
      setInitialLoading(true);
      const session = localStorage.getItem('mofo_session');
      if (session) {
        try {
          const u = JSON.parse(session);
          setUser(u);
          setSettingsForm({ name: u.name, username: u.username, password: u.password || '' });
          const cloudBrands = await cloudService.getBrands(u.id);
          setBrands(cloudBrands);
          setView(u.role === 'admin' ? 'admin' : 'dashboard');
        } catch (e) { console.error(e); }
      }
      setInitialLoading(false);
    };
    initApp();
  }, []);

  const handleLogin = async (u: string, p: string) => {
    setLoading(true); setError('');
    if (u === ADMIN_USER.username && p === ADMIN_USER.password) {
      setUser(ADMIN_USER); localStorage.setItem('mofo_session', JSON.stringify(ADMIN_USER));
      setBrands(await cloudService.getBrands(ADMIN_USER.id)); setView('admin'); setLoading(false); return;
    }
    const cloudUsers = await cloudService.getUsers();
    const found = cloudUsers.find(user => user.username === u && user.password === p);
    if (found) {
      if (found.status === 'suspended') setError('帳號已被停用');
      else {
        setUser(found); setSettingsForm({ name: found.name, username: found.username, password: found.password || '' });
        localStorage.setItem('mofo_session', JSON.stringify(found));
        setBrands(await cloudService.getBrands(found.id)); setView('dashboard');
      }
    } else setError('帳號或密碼錯誤');
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    const updatedUser = { ...user, ...settingsForm };
    await cloudService.saveUser(updatedUser);
    setUser(updatedUser); localStorage.setItem('mofo_session', JSON.stringify(updatedUser));
    setShowSettings(false); alert('個人設定已更新');
  };

  const handleNewBrand = (mode: BrandMode) => {
    const newBrand: Brand = { id: Math.random().toString(36).substr(2, 9), userId: user?.id || '', mode, data: { ...brandData, name: '' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setCurrentBrand(newBrand); setBrandData(newBrand.data); setWizardStep(0); setView('wizard'); setIsSaved(false);
  };

  const handleOpenBrand = (b: Brand) => {
    setCurrentBrand(b); setBrandData(b.data); setWizardStep(b.bio ? 8 : 0); setTopics(b.topics || []); setView('wizard'); setIsSaved(true);
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (confirm(`確定刪除「${name}」？`)) { await cloudService.deleteBrand(id); setBrands(await cloudService.getBrands(user?.id)); }
  };

  const handleSaveBrand = async () => {
    if (!currentBrand || !user) return;
    setLoading(true);
    const updatedBrand = { ...currentBrand, data: brandData, updatedAt: new Date().toISOString() };
    await cloudService.saveBrand(updatedBrand);
    setBrands(await cloudService.getBrands(user.id)); setIsSaved(true); setLoading(false); alert("已同步雲端");
  };

  const handleProcessBio = async () => {
    if (!currentBrand) return; setLoading(true);
    try {
      const bio = await generateBio(currentBrand.mode, brandData);
      const ts = await generateTopics(bio, brandData);
      const updated = { ...currentBrand, data: brandData, bio, topics: ts, updatedAt: new Date().toISOString() };
      setCurrentBrand(updated); setTopics(ts); setWizardStep(8);
    } catch (e) { alert("AI 生成失敗"); } finally { setLoading(false); }
  };

  const handleSelectTopic = async (topic: string) => {
    if (!currentBrand?.bio) return; setGeneratingDetail(true);
    try {
      const plan = await generateDetailedContent(topic, currentBrand.bio, brandData);
      setCurrentBrand({ ...currentBrand, plan }); setWizardStep(9);
    } catch (e) { alert("內容生成失敗"); } finally { setGeneratingDetail(false); }
  };

  const tc = {
    bg: isDarkMode ? 'bg-[#0f1115]' : 'bg-slate-50',
    text: isDarkMode ? 'text-slate-200' : 'text-slate-950',
    border: isDarkMode ? 'border-white/5' : 'border-slate-300',
    navBg: isDarkMode ? 'bg-[#0f1115]/80' : 'bg-white/80',
    card: isDarkMode ? 'bg-[#181b21] border-white/5' : 'bg-white border-slate-300',
    input: isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-950',
    modalCard: isDarkMode ? 'bg-[#181b21] border-white/10' : 'bg-white border-slate-300 shadow-2xl',
    contentPrimary: isDarkMode ? 'text-slate-200' : 'text-slate-950',
    contentSecondary: isDarkMode ? 'text-slate-400' : 'text-slate-800',
    tableBg: isDarkMode ? 'bg-black/40' : 'bg-white',
    tableHeaderBg: isDarkMode ? 'bg-white/5' : 'bg-slate-100',
    tableBorder: isDarkMode ? 'border-white/5' : 'border-slate-300',
    highlightCard: isDarkMode ? 'bg-white/5' : 'bg-amber-50/30'
  };

  if (initialLoading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white font-black animate-pulse text-2xl">MOFO CLOUD SYNCING...</div>;
  if (view === 'login') return <LoginView onLogin={handleLogin} loading={loading} error={error} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />;

  return (
    <div className={`min-h-screen ${tc.bg} transition-colors duration-300`}>
      {view !== 'ai-creator' && (
        <Navigation user={user} setView={setView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setShowSettings={setShowSettings} tc={tc} />
      )}
      {showSettings && (
        <SettingsModalUI settingsForm={settingsForm} setSettingsForm={setSettingsForm} handleUpdateProfile={handleUpdateProfile} setShowSettings={setShowSettings} setView={setView} setUser={setUser} tc={tc} />
      )}
      {view === 'admin' && <AdminView tc={tc} setView={setView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
      {view === 'dashboard' && (
        <DashboardView onOpenBrand={handleOpenBrand} brands={brands} handleDeleteBrand={handleDeleteBrand} handleNewBrand={handleNewBrand} onLaunchCreator={() => setView('ai-creator')} tc={tc} isDarkMode={isDarkMode} />
      )}
      {view === 'ai-creator' && <AIGenCreator onBack={() => setView('dashboard')} isDarkMode={isDarkMode} tc={tc} />}
      {view === 'wizard' && (
        <WizardView mode={currentBrand?.mode} wizardStep={wizardStep} setWizardStep={setWizardStep} brandData={brandData} setBrandData={setBrandData} loading={loading} generatingDetail={generatingDetail} extraTrustLabels={extraTrustLabels} setExtraTrustLabels={setExtraTrustLabels} extraUniqueLabels={extraUniqueLabels} setExtraUniqueLabels={setExtraUniqueLabels} topics={topics} currentBrand={currentBrand} expandedContent={expandedContent} setExpandedContent={setExpandedContent} tc={tc} isDarkMode={isDarkMode} handleProcessBio={handleProcessBio} handleRefreshTopics={async () => { setLoading(true); const ts = await generateTopics(currentBrand!.bio!, brandData); setTopics(ts); setLoading(false); }} handleSelectTopic={handleSelectTopic} setView={setView} handleSaveBrand={handleSaveBrand} isSaved={isSaved} />
      )}
    </div>
  );
};

export default App;
