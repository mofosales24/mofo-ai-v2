import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const ProfileView = ({ form, setForm, onNext, loading }: any) => (
  <div className="space-y-8 animate-in fade-in">
    <h2 className="text-3xl font-black italic text-amber-500 flex items-center gap-3">
      <Sparkles /> A/B. 建立用戶檔案
    </h2>
    <div className="flex gap-4">
      {['銷售', '招募'].map(r => (
        <button key={r} onClick={() => setForm({...form, role: r})} 
          className={`flex-1 p-4 rounded-2xl border-2 font-black transition-all ${form.role === r ? 'border-amber-500 bg-amber-500/10' : 'border-white/10'}`}>{r}</button>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-4">
      <input placeholder="名字" className="p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-amber-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
      <select className="p-4 bg-slate-900 border border-white/10 rounded-xl text-white" value={form.age} onChange={e => setForm({...form, age: e.target.value})}>
        <option value="">年齡層</option><option>20-30</option><option>31-40</option><option>41-50</option><option>50+</option>
      </select>
    </div>
    <textarea placeholder="人生經歷 (大病、留學、轉行...)" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl h-32" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} />
    <input placeholder="喜好 (如籃球、精品咖啡)" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl" value={form.hobbies} onChange={e => setForm({...form, hobbies: e.target.value})} />
    <button onClick={onNext} disabled={loading || !form.name} className="w-full bg-amber-500 p-5 rounded-2xl text-black font-black text-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
      {loading ? 'AI 分析中...' : <>下一步：分析受眾 <ArrowRight size={20}/></>}
    </button>
  </div>
);