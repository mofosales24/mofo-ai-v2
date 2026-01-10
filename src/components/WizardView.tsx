import React from 'react';
import { Home } from 'lucide-react';
export const WizardView = ({ setView }: any) => (
  <div className="min-h-screen bg-[#0f1115] text-white p-10 text-center">
    <h2 className="text-3xl font-black mb-8">基礎品牌定位 (Wizard)</h2>
    <button onClick={()=>setView('dashboard')} className="flex items-center gap-2 mx-auto bg-white/5 p-4 rounded-xl"><Home/> 返回儀表板</button>
  </div>
);
