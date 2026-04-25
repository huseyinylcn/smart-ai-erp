import { useState } from 'react';
import { 
  Users, Search, Plus, MoreVertical, 
  ShieldCheck, Calculator, History, 
  Download, ArrowRight, Activity,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SocialPersonalAccount = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const accounts: any[] = [];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Xəzinə / Sosial üzrə ŞHV</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Sosial Sığorta ŞHV</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-blue-500/10 underline-offset-4 tracking-tight">Məcburi dövlət sosial sığorta, işsizlikdən sığorta və icbari tibbi sığorta öhdəlikləri</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100 dark:border-slate-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20 active:scale-95 italic">
            <Plus className="w-4 h-4" />
            <span>Yeni Sosial ŞHV</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 dark:bg-blue-900/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-all"></div>
              <div className="relative z-10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Məcburi Sosial Sığorta</p>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tabular-nums">0.00 <span className="text-[10px]">₼</span></h2>
              </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-all"></div>
              <div className="relative z-10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">İcbari Tibbi Sığorta</p>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tabular-nums">0.00 <span className="text-[10px]">₼</span></h2>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 dark:bg-amber-900/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-all"></div>
              <div className="relative z-10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">İşsizlikdən Sığorta</p>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tabular-nums">0.00 <span className="text-[10px]">₼</span></h2>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/50 dark:bg-rose-900/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-all"></div>
              <div className="relative z-10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Cəmi Öhdəlik</p>
                  <h2 className="text-2xl font-black text-rose-600 uppercase italic tabular-nums">0.00 <span className="text-[10px]">₼</span></h2>
              </div>
          </div>
      </div>

      {/* EMPTY STATE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-24 shadow-sm text-center">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Heart className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic mb-2 tracking-tight">Sosial ŞHV Tapılmadı</h3>
          <p className="text-slate-400 font-bold italic uppercase text-[11px] tracking-[0.2em] mb-10">Sosial sığorta öhdəliklərini izləmək üçün hesab yoxdur</p>
          <button className="inline-flex items-center space-x-3 px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-500/20 active:scale-95 italic">
              <Plus className="w-5 h-5" />
              <span>Yeni Sosial ŞHV Əlavə Et</span>
          </button>
      </div>

    </div>
  );
};

export default SocialPersonalAccount;
