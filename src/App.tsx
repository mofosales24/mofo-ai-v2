import React, { useState, useEffect } from 'react';
import { AppView, User, Brand, BrandMode, BrandData } from './types';
import { cloudService } from './services/cloudService';
import { generateBio, generateTopics, generateDetailedContent } from './services/geminiService';
import { LoginView, DashboardView, AdminView, Navigation, SettingsModalUI } from './components/Views';
import { WizardView } from './components/WizardView';
import { AIGenCreator } from './components/AIGenCreator';

console.log('🚀 CURRENT_PROJECT: mofo-creator-v2.0');
console.log('💎 VERSION: 2.0.3_MATRIX_READY');

const ADMIN_USER: User = { id: 'admin_static', name: 'MOFO Master', username: 'admin', password: 'mofo2026', role: 'admin', status: 'active', createdAt: new Date().toISOString() };

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
  const [settingsForm, setSettingsForm] = useState({ name: '', username: '', password: '' });
  const [extraTrustLabels, setExtraTrustLabels] = useState<string[]>([]);
  const [extraUniqueLabels, setExtraUniqueLabels] = useState<string[]>([]);
  const [brandData, setBrandData] = useState<BrandData>({ name: '', domain: '', customDomain: '', background: '', customBackground: '', lifeStage: '', customLifeStage: '', occupation: '', customOccupation: '', pain: '', customPain: '', style: '', customStyle: '', trust: [], customTrust: '', unique: [], customUnique: '', cta: '', customCta: '' });

  useEffect(() => {
    const init = async () => {
      const session = localStorage.getItem('mofo_session');
      if (session) {
        const u = JSON.parse(session); setUser(u);
        setBrands(await cloudService.getBrands(u.id));
        setView(u.role === 'admin' ? 'admin' : 'dashboard');
        setSettingsForm({ name: u.name, username: u.username, password: u.password || '' });
      }
      setInitialLoading(false);
    };
    init();
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
      if (found.status === 'suspended') setError('帳號停用');
      else { setUser(found); setBrands(await cloudService.getBrands(found.id)); setView('dashboard'); localStorage.setItem('mofo_session', JSON.stringify(found)); }
    } else setError('帳號或密碼錯誤');
    setLoading(false);
  };

  const handleNewBrand = (mode: BrandMode) => { setCurrentBrand({ id: Math.random().toString(36).substr(2, 9), userId: user?.id || '', mode, data: brandData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); setWizardStep(0); setView('wizard'); setIsSaved(false); };
  const handleOpenBrand = (b: Brand) => { setCurrentBrand(b); setBrandData(b.data); setWizardStep(b.bio ? 8 : 0); setTopics(b.topics || []); setView('wizard'); setIsSaved(true); };
  const handleDeleteBrand = async (id: string, name: string) => { if (confirm(`刪除「${name}」？`)) { await cloudService.deleteBrand(id); setBrands(await cloudService.getBrands(user?.id)); } };
  const handleSaveBrand = async () => { await cloudService.saveBrand(currentBrand!); setBrands(await cloudService.getBrands(user!.id)); setIsSaved(true); alert("同步完成"); };
  const handleProcessBio = async () => { setLoading(true); try { const bio = await generateBio(currentBrand!.mode, brandData); const ts = await generateTopics(bio, brandData); setCurrentBrand({ ...currentBrand!, bio, topics: ts }); setTopics(ts); setWizardStep(8); } catch (e) { alert("AI 失敗"); } finally { setLoading(false); } };
  const handleSelectTopic = async (topic: string) => { setGeneratingDetail(true); try { const plan = await generateDetailedContent(topic, currentBrand!.bio!, brandData); setCurrentBrand({ ...currentBrand!, plan }); setWizardStep(9); } catch (e) { alert("生成失敗"); } finally { setGeneratingDetail(false); } };

  const tc = { bg: isDarkMode ? 'bg-[#0f1115]' : 'bg-slate-50', text: isDarkMode ? 'text-slate-200' : 'text-slate-950', border: 'border-white/5', navBg: 'bg-[#0f1115]/80', modalCard: 'bg-[#181b21] border-white/10 text-white', contentPrimary: 'text-white', contentSecondary: 'text-slate-400', tableBg: 'bg-black/40', tableHeaderBg: 'bg-white/5', tableBorder: 'border-white/5', highlightCard: 'bg-white/5' };

  if (initialLoading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white font-black animate-pulse">MOFO CLOUD SYNCING...</div>;
  if (view === 'login') return <LoginView onLogin={handleLogin} loading={loading} error={error} isDarkMode={isDarkMode} toggleTheme={()=>setIsDarkMode(!isDarkMode)} />;

  return (
    <div className={`min-h-screen ${tc.bg}`}>
      {view !== 'ai-creator' && <Navigation user={user} setView={setView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setShowSettings={()=>{}} tc={tc} />}
      {view === 'admin' && <AdminView tc={tc} setView={setView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
      {view === 'dashboard' && <DashboardView onOpenBrand={handleOpenBrand} brands={brands} handleDeleteBrand={handleDeleteBrand} handleNewBrand={handleNewBrand} onLaunchCreator={() => setView('ai-creator')} tc={tc} isDarkMode={isDarkMode} />}
      {view === 'ai-creator' && <AIGenCreator onBack={() => setView('dashboard')} isDarkMode={isDarkMode} tc={tc} />}
      {view === 'wizard' && <WizardView mode={currentBrand?.mode} wizardStep={wizardStep} setWizardStep={setWizardStep} brandData={brandData} setBrandData={setBrandData} loading={loading} generatingDetail={generatingDetail} extraTrustLabels={extraTrustLabels} setExtraTrustLabels={setExtraTrustLabels} extraUniqueLabels={extraUniqueLabels} setExtraUniqueLabels={setExtraUniqueLabels} topics={topics} currentBrand={currentBrand} expandedContent={expandedContent} setExpandedContent={setExpandedContent} tc={tc} isDarkMode={isDarkMode} handleProcessBio={handleProcessBio} handleSelectTopic={handleSelectTopic} setView={setView} handleSaveBrand={handleSaveBrand} isSaved={isSaved} />}
    </div>
  );
};
export default App;
