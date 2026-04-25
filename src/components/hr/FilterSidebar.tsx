import React from 'react';
import { X, ChevronLeft, Filter, CheckCircle2 } from 'lucide-react';

interface FilterSidebarProps {
  content: React.ReactNode;
  onClose: () => void;
  onApply?: () => void;
}

const FilterSidebar = ({ content, onClose, onApply }: FilterSidebarProps) => {
  return (
    <div className="w-[320px] h-full bg-white dark:bg-slate-900 border-r border-[#E8EDF2] dark:border-slate-800 flex flex-col shrink-0 z-[60] shadow-2xl animate-in slide-in-from-left duration-300">
      {/* Header */}
      <div className="h-[76px] flex items-center justify-between px-6 border-b border-slate-50 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-[13px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest italic">Filtrlər</span>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {content}
      </div>

      {/* Footer / Apply Button */}
      <div className="p-6 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
        <button 
          onClick={onApply || onClose}
          className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Tətbiq Et və Bağla</span>
        </button>
        <button 
          onClick={onClose}
          className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-slate-600 transition-all text-[9.5px] font-black uppercase tracking-widest italic"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Geri qayıt</span>
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
