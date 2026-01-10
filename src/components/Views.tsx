import React, { useState, useEffect } from 'react';
import { Trophy, Sun, Moon, Trash2, RefreshCw, UserPlus, X, Settings, LogOut, Sparkles } from 'lucide-react';
import { cloudService } from '../services/cloudService';
export const Navigation = ({ user, setView, isDarkMode, setIsDarkMode, setShowSettings, tc }: any) => (
  <nav className="border-b-2 border-white/5 p-5 flex justify-between items-center bg-[#0f1115]/80 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}><Trophy className="text-amber-500"/><span className="font-black italic text-xl text-white">MOFO CREATOR</span></div>
    <div className="flex items-center gap-3">
      {user?.role === 'admin' && <button onClick={() => setView('admin')} className="text-xs font-black bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl">管理</button>}
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-amber-500">{isDarkMode ? <Sun/> : <Moon/>}</button>
      <button onClick={() => setShowSettings(true)} className="p-2 text-white/60"><Settings/></button>
    </div>
  </nav>
);
export const DashboardView = ({ brands, onLaunchCreator, onOpenBrand }: any) => (
  <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
    <div className="p-10 rounded-[3rem] bg-gradient-to-br from-amber-500 to-amber-600 text-black flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
      <div className="space-y-2 text-center md:text-left"><h2 className="text-4xl font-black italic">AI 全自動自媒體引擎 2.0</h2><p className="font-bold opacity-90">一鍵生成廣播級內容。</p></div>
      <button onClick={onLaunchCreator} className="bg-black text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"><Sparkles className="text-amber-500" /> 立即啟動</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {brands.map((b: any) => (
        <div key={b.id} onClick={() => onOpenBrand(b)} className="p-10 rounded-[3.5rem] border-2 border-white/5 bg-[#181b21] hover:border-amber-500 cursor-pointer transition-all">
          <h3 className="text-2xl font-black text-white">{b.data.name}</h3><p className="text-slate-400 mt-2">{b.bio?.displayName || '未生成定位'}</p>
        </div>
      ))}
    </div>
  </main>
);
export const AdminView = ({ setView }: any) => ( <div className="p-10 text-white"><h2 className="text-2xl mb-4">管理員頁面</h2><button onClick={()=>setView('dashboard')} className="bg-amber-500 p-2 rounded text-black">返回</button></div> );
export const LoginView = ({ onLogin, loading }: any) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0f1115]"><div className="bg-[#181b21] p-10 rounded-3xl border border-white/5 w-full max-w-md"><h1 className="text-white text-2xl font-black mb-8 italic text-center">MOFO 2.0.6 CLOUD</h1><form onSubmit={(e:any)=>{e.preventDefault(); onLogin(e.target[0].value, e.target[1].value);}} className="space-y-4"><input className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white" placeholder="帳號" /><input className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white" type="password" placeholder="密碼" /><button className="w-full bg-amber-500 p-4 rounded-xl font-black">{loading ? '連線中...' : '登入系統'}</button></form></div></div>
);
export const SettingsModalUI = ({ setShowSettings }: any) => (
  <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6"><div className="bg-[#181b21] p-10 rounded-3xl border border-white/10 w-full max-w-sm text-center"><button onClick={()=>setShowSettings(false)} className="bg-amber-500 p-3 rounded-xl w-full font-black">關閉設定</button><button onClick={()=>{localStorage.clear(); window.location.reload();}} className="mt-4 text-red-500 font-bold">登出</button></div></div>
);
