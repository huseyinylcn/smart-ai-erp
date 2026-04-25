import { 
  Layers, Zap, MessageSquare, 
  RefreshCw, TrendingUp, ArrowRight, 
  Brain, Cpu, ShieldCheck, 
  Layout, Search, Plus, Menu,
  Box, Terminal, MousePointer2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { SYSTEM_ARCH_INSIGHTS } from './SAIAgentLogic';

const SystemAnalysis = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-black uppercase tracking-widest italic shadow-inner border border-slate-200 dark:border-slate-700">Enterprise System Review</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Core Architecture & UX Optimization</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Ümumi Sistem Analizi</h1>
        </div>
      </div>

      {/* Hero / Summary - Highlighting Sidebar & Action Center */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl mb-8 group">
          <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest italic border border-white/10">
                  <Cpu className="w-3.5 h-3.5 mr-2 text-indigo-400" /> Core System Logic
              </div>
              <h2 className="text-4xl font-black uppercase italic leading-tight tracking-tight">SmartAgent ERP: Vahid və Sürətli Ekosistem.</h2>
              <p className="text-sm font-bold text-slate-400 italic leading-relaxed">
                  Sistemin naviqasiya strukturu (Sidebar), modullararası inteqrasiya və Qlobal Əməliyyat Mərkəzi (ADD NEW) üzrə apardığımız analizlər. Məqsədimiz 20+ modulun hər birinə 3 saniyə daxilində çatmaq və əməliyyatları 50% sürətləndirməkdir.
              </p>
          </div>
          <Box className="absolute top-[-50px] right-[-50px] w-96 h-96 text-white/5 opacity-20 group-hover:scale-110 transition-transform duration-1000" />
      </div>

      {/* Insights Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {SYSTEM_ARCH_INSIGHTS.map((insight: any, idx: number) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3.5rem] shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all group flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-indigo-600 shadow-inner group-hover:rotate-12 transition-transform`}>
                  <insight.categoryIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic ${
                        insight.priority === 'High' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-white'
                    }`}>{insight.priority} Priority</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase italic mt-2 tracking-widest">{insight.category}</span>
                </div>
              </div>

              <div className="space-y-4 flex-1 relative z-10">
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight leading-tight">{insight.title}</h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">
                  {insight.description}
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                <div className="flex items-center text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest italic">
                  <TrendingUp className="w-4 h-4 mr-2" /> {insight.benefit}
                </div>
                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-slate-400 shadow-sm">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Visual Analysis Visualizer Card */}
          <div className="lg:col-span-2 bg-indigo-50 dark:bg-indigo-900/10 border-2 border-dashed border-indigo-200 dark:border-indigo-900/30 p-12 rounded-[4rem] flex flex-col lg:flex-row items-center gap-12 group hover:border-indigo-500 transition-all">
             <div className="flex-1 space-y-6">
                <h3 className="text-2xl font-black text-indigo-900 dark:text-indigo-100 uppercase italic tracking-tight">Naviqasiya İstilik Xəritəsi (Heatmap)</h3>
                <p className="text-sm font-bold text-indigo-600/70 dark:text-indigo-400/70 italic leading-relaxed">
                   Aİ tərəfindən aparılan analiz göstərir ki, istifadəçilər ən çox "ADD NEW" mərkəzində Satış və Anbar modullarına klikləyirlər. MiniSidebar-da "CRM" və "Layihələr" ən aktiv bölmələrdir.
                </p>
                <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-900 dark:text-white uppercase italic">
                      <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                      <span>Kritik Modullar</span>
                   </div>
                   <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-900 dark:text-white uppercase italic">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span>Optimallaşdırılıb</span>
                   </div>
                </div>
             </div>
             <div className="w-full lg:w-72 aspect-square bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-indigo-100 dark:border-indigo-900/50 p-6 flex flex-col space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-full bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between px-4">
                     <div className="w-1/2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                     <div className={`w-8 h-3 rounded-full ${i === 1 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalysis;
