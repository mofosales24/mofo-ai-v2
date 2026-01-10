import React, { useState, useEffect } from 'react';

interface SelectionGroupProps {
  title: string;
  options: string[];
  selected: string | string[];
  onSelect: (val: any) => void;
  custom: string;
  onCustomChange: (val: string) => void;
  onAddOption?: (val: string) => void;
  multi?: boolean;
  max?: number;
}

export const SelectionGroup: React.FC<SelectionGroupProps> = ({ 
  title, options, selected, onSelect, custom, onCustomChange, onAddOption, multi = false, max = 1
}) => {
  const [localCustom, setLocalCustom] = useState(custom || '');

  // 監聽外部傳入的 custom 值變動
  useEffect(() => {
    setLocalCustom(custom || '');
  }, [custom]);

  const handleCustomBlur = () => {
    onCustomChange(localCustom);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && localCustom.trim() !== '' && onAddOption) {
      e.preventDefault();
      onAddOption(localCustom.trim());
      setLocalCustom(''); // 新增後清空輸入框
    }
  };

  const handleSelect = (opt: string) => {
    if (!multi) {
      // 單選模式：點擊已選中的則取消選取
      onSelect(selected === opt ? '' : opt);
      return;
    }

    // 多選模式：確保 selected 始終是陣列
    const current = Array.isArray(selected) ? selected : [];
    if (current.includes(opt)) {
      onSelect(current.filter(i => i !== opt));
    } else {
      if (current.length < max) {
        onSelect([...current, opt]);
      } else {
        // 如果超過上限，可以選擇替換最後一個，或是提示用戶（此處選擇不動作）
        // console.log("已達選擇上限");
      }
    }
  };

  const isSelected = (opt: string) => {
    if (multi && Array.isArray(selected)) {
      return selected.includes(opt);
    }
    return selected === opt;
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* 標題與計數器 */}
      <div className="flex justify-between items-end px-1">
        <label className="text-xs md:text-sm font-black uppercase tracking-widest opacity-80 block text-slate-950 dark:text-slate-200">
          {title}
        </label>
        {multi && (
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">
            已選 {Array.isArray(selected) ? selected.length : 0} / {max}
          </span>
        )}
      </div>

      {/* 選項按鈕區 */}
      <div className="flex flex-wrap gap-2.5">
        {options.map(opt => {
          const active = isSelected(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`px-5 py-3 rounded-2xl text-sm md:text-base font-black transition-all border-2 active:scale-95 ${
                active 
                  ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20' 
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-950 dark:text-slate-300 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-white/10'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* 自定義輸入框 */}
      <div className="relative group">
        <input 
          value={localCustom}
          onChange={(e) => setLocalCustom(e.target.value)}
          onBlur={handleCustomBlur}
          onKeyDown={handleKeyDown}
          placeholder={onAddOption ? "輸入後按 Enter 鍵新增自定義標籤..." : "或輸入您的獨特答案..."}
          className="w-full bg-white dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 font-black shadow-inner"
        />
        {localCustom && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <span className="text-[10px] font-black text-amber-500/50 uppercase">
              {onAddOption ? '按 Enter 新增' : '自動儲存'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};