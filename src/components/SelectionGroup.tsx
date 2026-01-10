
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
  const [localCustom, setLocalCustom] = useState(custom);

  useEffect(() => {
    setLocalCustom(custom);
  }, [custom]);

  const handleCustomBlur = () => {
    onCustomChange(localCustom);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && localCustom.trim() !== '' && onAddOption) {
      e.preventDefault();
      onAddOption(localCustom.trim());
      setLocalCustom('');
    }
  };

  const handleSelect = (opt: string) => {
    if (!multi) {
      onSelect(selected === opt ? '' : opt);
      return;
    }

    const current = Array.isArray(selected) ? selected : [];
    if (current.includes(opt)) {
      onSelect(current.filter(i => i !== opt));
    } else {
      if (current.length < max) {
        onSelect([...current, opt]);
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
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-sm font-black uppercase tracking-widest opacity-90 block text-slate-950 dark:text-slate-200">
          {title}
        </label>
        {multi && (
          <span className="text-[11px] font-black text-slate-900 dark:text-slate-400">
            最多選擇 {max} 個 ({Array.isArray(selected) ? selected.length : 0}/{max})
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelect(opt)}
            className={`px-5 py-3 rounded-2xl text-base md:text-lg font-black transition-all border-2 ${
              isSelected(opt) 
                ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20' 
                : 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-950 dark:text-slate-300 hover:border-amber-500/50 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <input 
        value={localCustom}
        onChange={(e) => setLocalCustom(e.target.value)}
        onBlur={handleCustomBlur}
        onKeyDown={handleKeyDown}
        placeholder={onAddOption ? "輸入後按 Enter 鍵新增標籤..." : "或輸入你的獨特答案..."}
        className="w-full bg-white dark:bg-black/40 border-2 border-slate-300 dark:border-white/10 rounded-2xl px-5 py-4 text-base focus:border-amber-500 outline-none transition-all text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/30 font-black"
      />
    </div>
  );
};
