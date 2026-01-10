import React, { useState, useEffect } from 'react';
import { Trophy, Sun, Moon, User as UserIcon, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Target, Users, Trash2, RefreshCw, Ban, Unlock, UserPlus, X, Home, Settings, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandMode, User } from '../types';
import { cloudService } from '../services/cloudService';

export const Navigation = ({ user, setView, isDarkMode, setIsDarkMode, setShowSettings, tc }: any) => (
  <nav className={`border-b-2 ${tc.border} p-5 flex justify-between items-center sticky top-0 z-50 ${tc.navBg} backdrop-blur-md transition-all shadow-sm`}>
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
      <div className="bg-amber-500 p-2 rounded-xl"><Trophy className="w-5 h-5 text-black" /></div>
      <span className={`font-black italic text-xl tracking-tighter ${tc.text}`}>MOFO <span className="text-amber-500 not-italic">CREATOR</span></span>
    </div>
    <div className="flex items-center gap-3">
      {user?.role === 'admin' && <button onClick={() => setView('admin')} className="flex items-center gap-2 text-xs font-black bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl border-2 border-amber-500/20">管理學員</button>}
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full bg-white/5 text-amber-500">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
      <button onClick={() => setShowSettings(true)} className={`p-2.5 rounded-full border-2 ${tc.border} ${tc.text}`}><Settings size={20}/></button>
    </div>
  </nav>
);

export const SettingsModalUI = ({ settingsForm, setSettingsForm, handleUpdateProfile, setShowSettings, setView, setUser, tc }: any) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-in fade-in duration-200">
    <div className={`w-full max-w-sm rounded-[2.5rem] border-2 ${tc.modalCard} p-8 relative shadow-2xl`}>
      <button onClick={() => setShowSettings(false)} className={`absolute top-5 right-5 p-2 rounded-full hover:bg-slate-500/10 ${tc.text}`}><X size={20}/></button>
      <h3 className={`text-xl font-black italic mb-6 ${tc.text}`}>個人設定</h3>
      <div className="space-y-4">
        <input value={settingsForm.name} onChange={(e) => setSettingsForm((f: any) => ({...f, name: e.target.value}))} className={`w-full border-2 rounded-xl px-4 py-3 font-black ${tc.input}`} placeholder="顯示姓名" />
        <button onClick={handleUpdateProfile} className="w-full py-4 rounded-xl bg-amber-500 text-black font-black">儲存並同步</button>
        <button onClick={() => { localStorage.removeItem('mofo_session'); setView('login'); setUser(null); setShowSettings(false); }} className="w-full py-3 rounded-xl bg-red-500/10 text-red-600 font-black mt-2">登出系統</button>
      </div>
    </div>
  </div>
);

export const LoginView = ({ onLogin, loading, error, isDarkMode, toggleTheme }: any) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-[#0f1115]' : 'bg-slate-50'}`}>
      <div className={`w-full max-w-md p-10 rounded-[3rem] border-2 ${isDarkMode ? 'bg-[#181b21] border-white/5' : 'bg-white border-slate-300'}`}>
        <h1 className={`text-2xl font-black italic mb-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MOFO CREATOR</h1>
        <form onSubmit={(e)=>{e.preventDefault(); onLogin(u,p);}} className="space-y-6">
          <input value={u} onChange={e=>setU(e.target.value)} className="w-full border-2 rounded-2xl p-4 bg-transparent outline-none focus:border-amber-500" placeholder="Username" />
          <div className="relative">
            <input type={showPwd?"text":"password"} value={p} onChange={e=>setP(e.target.value)} className="w-full border-2 rounded-2xl p-4 bg-transparent outline-none focus:border-amber-500" placeholder="Password" />
            <button type="button" className="absolute right-4 top-4" onClick={()=>setShowPwd(!showPwd)}>{showPwd?<EyeOff size={18}/>:<Eye size={18}/>}</button>
          </div>
          {error && <p className="text-red-500 font-bold">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black">{loading ? 'Loading...' : '登入雲端系統'}</button>
        </form>
      </div>
    </div>
  );
};

export const DashboardView = ({ onOpenBrand, brands, handleDeleteBrand, handleNewBrand, onLaunchCreator, tc, isDarkMode }: any) => (
  <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
    <div className="p-1 border-2 border-amber-500/20 rounded-[3rem] bg-amber-500/5">
      <div className="p-10 rounded-[2.8rem] bg-gradient-to-br from-amber-500 to-amber-600 text-black flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="space-y-2">
          <h2 className="text-4xl font-black italic">AI 全自動自媒體引擎 2.0</h2>
          <p className="font-bold opacity-90 text-lg">一鍵生成廣播級內容。</p>
        </div>
        <button onClick={onLaunchCreator} className="bg-black text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:scale-105 transition-all flex items-center gap-3"><Sparkles className="text-amber-500" /> 立即啟動</button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {brands.map((b: any) => (
        <div key={b.id} className="relative p-10 rounded-[3.5rem] border-2 bg-[#181b21] border-white/5 hover:border-amber-500 cursor-pointer" onClick={() => onOpenBrand(b)}>
          <h3 className="text-2xl font-black text-white">{b.data.name}</h3>
          <p className="text-slate-400 mt-2">{b.bio?.displayName || '未生成定位'}</p>
          <button onClick={(e)=>{e.stopPropagation(); handleDeleteBrand(b.id, b.data.name);}} className="absolute top-5 right-5 text-slate-500"><Trash2 size={20}/></button>
        </div>
      ))}
    </div>
  </main>
);

export const AdminView = ({ tc, setView }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const load = async () => setUsers(await cloudService.getUsers());
  useEffect(() => { load(); }, []);
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between mb-8"><h2 className="text-3xl font-black text-white">學員管理</h2><button className="text-white font-black" onClick={()=>setView('dashboard')}>返回</button></div>
      <div className="bg-[#181b21] rounded-3xl border border-white/5 overflow-hidden">
        {users.map(u=>(<div key={u.id} className="p-6 border-b border-white/5 text-white flex justify-between"><span>{u.name} ({u.username})</span><span className="text-amber-500 font-bold">{u.status}</span></div>))}
      </div>
    </div>
  );
};
