import React, { useState, useEffect } from 'react';
import { 
  Trophy, Sun, Moon, Trash2, RefreshCw, UserPlus, X, 
  Settings, LogOut, Sparkles, ShieldCheck, Ban, Unlock, 
  AlertCircle, Eye, EyeOff // ✅ 補齊 Eye 和 EyeOff
} from 'lucide-react';
import { User } from '../types';
import { cloudService } from '../services/cloudService';

// --- 1. Navigation ---
export const Navigation = ({ user, setView, isDarkMode, setIsDarkMode, setShowSettings }: any) => (
  <nav className="border-b-2 border-white/5 p-5 flex justify-between items-center bg-[#0f1115]/80 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
      <div className="bg-amber-500 p-2 rounded-xl">
        <Trophy className="text-black" size={24}/>
      </div>
      <span className="font-black italic text-xl text-white tracking-tighter">
        MOFO <span className="text-amber-500 not-italic">CREATOR</span>
      </span>
    </div>
    <div className="flex items-center gap-3">
      {user?.role === 'admin' && (
        <button onClick={() => setView('admin')} className="text-xs font-black bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl border border-amber-500/20">管理學員</button>
      )}
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-amber-500">
        {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
      </button>
      <button onClick={() => setShowSettings(true)} className="p-2 text-white/60"><Settings size={20}/></button>
    </div>
  </nav>
);

// --- 2. DashboardView ---
export const DashboardView = ({ onLaunchCreator, isDarkMode }: any) => (
  <main className="max-w-5xl mx-auto px-6 py-16 animate-in fade-in duration-700">
    <div className="p-1 border-2 border-amber-500/20 rounded-[3.5rem] bg-amber-500/5 shadow-2xl">
      <div className="p-10 md:p-14 rounded-[3.3rem] bg-gradient-to-br from-amber-500 to-amber-600 text-black flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="space-y-4 text-center md:text-left relative z-10">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-tight">AI 全自動<br/>自媒體宣傳引擎</h2>
          <p className="font-bold opacity-90 text-lg max-w-md">粵語口語 AI：幫你一鍵搞掂受眾分析、Bio 同影片腳本。</p>
        </div>
        <button onClick={onLaunchCreator} className="bg-black text-white px-12 py-7 rounded-[2.5rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-2xl z-10">
          <Sparkles className="text-amber-500" /> 立即啟動
        </button>
      </div>
    </div>
  </main>
);

// --- 3. AdminView ---
export const AdminView = ({ setView }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '' });

  const loadData = async () => {
    setLoading(true);
    const data = await cloudService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async () => {
    if (!newUser.name || !newUser.username || !newUser.password) return;
    const userObj: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      username: newUser.username,
      password: newUser.password,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString() // ✅ 現在類型定義已支持
    };
    await cloudService.saveUser(userObj);
    setShowAdd(false);
    setNewUser({ name: '', username: '', password: '' });
    loadData();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10 text-white">
        <h2 className="text-3xl font-black italic text-amber-500">學員管理 (雲端同步)</h2>
        <div className="flex gap-3">
          <button onClick={()=>setShowAdd(true)} className="bg-amber-500 text-black px-6 py-2 rounded-xl font-black flex items-center gap-2">
            <UserPlus size={18}/>新增學員
          </button>
          <button onClick={()=>setView('dashboard')} className="border border-white/10 px-6 py-2 rounded-xl text-white font-black">返回</button>
        </div>
      </div>
      <div className="bg-[#181b21] rounded-3xl border border-white/5 overflow-hidden">
        {loading ? <div className="p-10 text-center text-slate-500 font-black">同步雲端中...</div> : 
          users.map(u => (
            <div key={u.id} className="p-6 border-b border-white/5 flex justify-between items-center text-white">
              <div><p className="font-black text-lg">{u.name}</p><p className="text-slate-500 text-sm">{u.username}</p></div>
              <button onClick={async ()=>{if(confirm('確定刪除？')){await cloudService.deleteUser(u.id); loadData();}}} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                <Trash2 size={20}/>
              </button>
            </div>
          ))
        }
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-[500]">
           <div className="bg-[#181b21] p-10 rounded-[3rem] border border-white/10 w-full max-w-sm shadow-2xl relative">
             <button onClick={()=>setShowAdd(false)} className="absolute top-6 right-6 text-slate-500"><X /></button>
             <h3 className="text-2xl font-black text-amber-500 italic mb-8 text-center uppercase">新增帳號</h3>
             <div className="space-y-4">
               <input value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})} className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white font-black" placeholder="姓名" />
               <input value={newUser.username} onChange={e=>setNewUser({...newUser, username: e.target.value})} className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white font-black" placeholder="帳號" />
               <input value={newUser.password} onChange={e=>setNewUser({...newUser, password: e.target.value})} className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white font-black" placeholder="密碼" />
               <button onClick={handleAdd} className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black mt-4 shadow-xl">確認新增</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- 4. LoginView ---
export const LoginView = ({ onLogin, loading, error }: any) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] p-6">
      <div className="bg-[#181b21] p-10 md:p-14 rounded-[3.5rem] border border-white/5 w-full max-w-md shadow-2xl text-center">
        <div className="mb-10">
          <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Trophy className="text-black" size={32} />
          </div>
          <h1 className="text-white text-3xl font-black italic tracking-tighter uppercase">MOFO <span className="text-amber-500 not-italic">CREATOR</span></h1>
          <p className="text-amber-500/60 text-[10px] font-black tracking-widest mt-2">v2.1.0 CLOUD SYNC</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onLogin(u, p); }} className="space-y-4">
          <input value={u} onChange={e => setU(e.target.value)} className="w-full p-5 bg-black/20 border border-white/10 rounded-2xl text-white font-black outline-none focus:border-amber-500" placeholder="帳號" />
          <div className="relative">
            <input type={showPwd ? "text" : "password"} value={p} onChange={e => setP(e.target.value)} className="w-full p-5 bg-black/20 border border-white/10 rounded-2xl text-white font-black outline-none focus:border-amber-500" placeholder="密碼" />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <EyeOff size={20} /> : <Eye size={20} />} {/* ✅ 已導入圖標 */}
            </button>
          </div>
          {error && <div className="text-red-500 p-3 bg-red-500/10 rounded-xl text-xs font-bold flex gap-2"><AlertCircle size={14}/> {error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black text-lg active:scale-95 transition-all mt-6 shadow-xl">
            {loading ? <RefreshCw className="animate-spin mx-auto" /> : '登入系統'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 5. SettingsModalUI ---
export const SettingsModalUI = ({ setShowSettings }: any) => (
  <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
    <div className="bg-[#181b21] p-10 rounded-[3rem] border border-white/10 w-full max-w-sm text-center relative shadow-2xl">
      <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24}/></button>
      <h3 className="text-xl font-black text-amber-500 mb-8 italic uppercase tracking-widest">個人設定</h3>
      <button onClick={() => { localStorage.removeItem('mofo_session'); window.location.reload(); }} className="w-full py-5 rounded-2xl bg-red-500/10 text-red-500 font-black flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-lg">
        <LogOut size={20}/> 登出系統
      </button>
      <button onClick={() => setShowSettings(false)} className="mt-6 text-slate-500 font-bold text-sm">取消</button>
    </div>
  </div>
);