import React, { useState, useEffect } from 'react';
import { Trophy, Sun, Moon, Trash2, RefreshCw, UserPlus, X, Settings, LogOut, Sparkles, ShieldCheck, Ban, Unlock } from 'lucide-react';
import { User } from '../types';
import { cloudService } from '../services/cloudService';

export const Navigation = ({ user, setView, isDarkMode, setIsDarkMode, setShowSettings }: any) => (
  <nav className="border-b-2 border-white/5 p-5 flex justify-between items-center bg-[#0f1115]/80 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
      <Trophy className="text-amber-500" size={24}/><span className="font-black italic text-xl text-white">MOFO CREATOR</span>
    </div>
    <div className="flex items-center gap-3">
      {user?.role === 'admin' && <button onClick={() => setView('admin')} className="text-xs font-black bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl">管理</button>}
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-amber-500">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
      <button onClick={() => setShowSettings(true)} className="p-2 text-white/60"><Settings size={20}/></button>
    </div>
  </nav>
);

export const DashboardView = ({ brands, onLaunchCreator, onOpenBrand }: any) => (
  <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
    <div className="p-1 border-2 border-amber-500/20 rounded-[3rem] bg-amber-500/5">
      <div className="p-10 rounded-[2.8rem] bg-gradient-to-br from-amber-500 to-amber-600 text-black flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <h2 className="text-4xl font-black italic tracking-tighter">AI 自媒體引擎 2.0</h2>
          <p className="font-bold opacity-90 text-lg">一鍵生成精準受眾與爆紅文案。</p>
        </div>
        <button onClick={onLaunchCreator} className="bg-black text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 flex items-center gap-3 shadow-2xl relative z-10">
          <Sparkles className="text-amber-500" /> 立即啟動
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {brands.map((b: any) => (
        <div key={b.id} onClick={() => onOpenBrand(b)} className="p-10 rounded-[3.5rem] border-2 border-white/5 bg-[#181b21] hover:border-amber-500 cursor-pointer transition-all shadow-xl">
          <h3 className="text-2xl font-black text-white">{b.data.name}</h3><p className="text-slate-400 mt-2">{b.bio?.displayName || '未生成'}</p>
        </div>
      ))}
    </div>
  </main>
);

export const LoginView = ({ onLogin, loading }: any) => {
  const [u, setU] = useState(''); const [p, setP] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] p-6">
      <div className="bg-[#181b21] p-10 rounded-[3rem] border border-white/5 w-full max-w-md shadow-2xl text-center">
        <h1 className="text-amber-500 text-3xl font-black mb-10 italic tracking-tighter uppercase">MOFO CREATOR</h1>
        <form onSubmit={(e:any)=>{e.preventDefault(); onLogin(u, p);}} className="space-y-4">
          <input value={u} onChange={e=>setU(e.target.value)} className="w-full p-5 bg-black/20 border border-white/10 rounded-2xl text-white font-black outline-none focus:border-amber-500" placeholder="Username" />
          <input type="password" value={p} onChange={e=>setP(e.target.value)} className="w-full p-5 bg-black/20 border border-white/10 rounded-2xl text-white font-black outline-none focus:border-amber-500" placeholder="Password" />
          <button className="w-full bg-amber-500 p-5 rounded-2xl font-black text-lg active:scale-95 transition-all mt-4">{loading ? <RefreshCw className="animate-spin mx-auto"/> : '登入雲端系統'}</button>
        </form>
      </div>
    </div>
  );
};

export const AdminView = ({ setView }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const load = async () => setUsers(await cloudService.getUsers());
  useEffect(() => { load(); }, []);
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10 text-white"><h2 className="text-3xl font-black italic">學員管理</h2><button onClick={()=>setView('dashboard')} className="border border-white/10 px-6 py-2 rounded-xl">返回</button></div>
      <div className="bg-[#181b21] rounded-3xl border border-white/5 overflow-hidden">{users.map(u => (<div key={u.id} className="p-6 border-b border-white/5 flex justify-between text-white"><span>{u.name} ({u.username})</span><button onClick={async ()=>{if(confirm('確定刪除？')){await cloudService.deleteUser(u.id); load();}}}><Trash2 className="text-red-500"/></button></div>))}</div>
    </div>
  );
};

export const SettingsModalUI = ({ setShowSettings }: any) => (
  <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
    <div className="bg-[#181b21] p-10 rounded-[3rem] border border-white/10 w-full max-w-sm text-center relative shadow-2xl">
      <button onClick={()=>setShowSettings(false)} className="absolute top-6 right-6 text-slate-500"><X /></button>
      <h3 className="text-xl font-black text-white mb-8 italic">個人設定</h3>
      <button onClick={()=>{localStorage.clear(); window.location.reload();}} className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-black flex items-center justify-center gap-2 mt-4 hover:bg-red-500 hover:text-white transition-all"><LogOut size={18}/> 登出系統</button>
    </div>
  </div>
);
