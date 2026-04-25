import { Kanban, Activity, TrendingUp, ArrowRight, ListTodo } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { BITRIX_INSIGHTS } from './SAIAgentLogic';

const Roadmap = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Kanban className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Strateji Yol Xəritəsi</h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] italic mt-0.5">S-AI Agent tərəfindən toplanmış və yığılmış təkliflər</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center border border-emerald-500/20 shadow-sm">
            <Activity className="w-3.5 h-3.5 mr-2" /> Canlı İzləmə Aktivdir
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BITRIX_INSIGHTS.map((rec, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <rec.categoryIcon className="w-24 h-24 rotate-12" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center">
                      <rec.categoryIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-black uppercase text-slate-800 dark:text-white italic leading-tight">{rec.title}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{rec.category}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase italic ${
                    rec.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {rec.priority} PRIORITY
                  </div>
                </div>
                
                <p className="text-[12px] text-slate-600 dark:text-slate-300 font-semibold italic leading-relaxed">
                  {rec.description}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex-1 flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mr-3 shrink-0" />
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase italic tracking-tighter">{rec.benefit}</span>
                  </div>
                  <button className="h-11 w-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] flex flex-col items-center justify-center space-y-4 hover:border-indigo-400 transition-all group cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all shadow-sm">
              <ListTodo className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase italic">Yeni Təklif Gözlənilir</p>
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 italic mt-1 leading-relaxed">Agent sistemi analiz etməyə davam edir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
