import { 
  Layers, Zap, Sparkles, 
  TrendingUp, ArrowRight, Brain, 
  Cpu, Box, ShieldCheck,
  Smartphone, Rocket, Target
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { APP_INSIGHTS } from './SAIAgentLogic';

const AppAnalysis = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-md text-[10px] font-black uppercase tracking-widest italic shadow-inner border border-rose-100 dark:border-rose-800">Ecosystem Intelligence</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Bitrix24 App Marketplace Benchmarking</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Tətbiqlər Analizi və Strateji Təkliflər</h1>
        </div>
      </div>

      {/* Hero / Summary */}
      <div className="bg-gradient-to-br from-slate-900 to-rose-950 p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl mb-8 group">
          <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest italic border border-white/10">
                  <Rocket className="w-3.5 h-3.5 mr-2 text-rose-400" /> Platform Scalability
              </div>
              <h2 className="text-4xl font-black uppercase italic leading-tight tracking-tight">SmartAgent ERP: Tətbiqlərlə Genişlənən Dünya.</h2>
              <p className="text-sm font-bold text-slate-400 italic leading-relaxed">
                  Bitrix24 Marketplace və inteqrasiya ekosistemini analiz edərək, SmartAgent-i xarici tətbiqlər və modullar üçün açıq bir platformaya çeviririk. Vahid App Hub məntiqi ilə bütün biznes alətləriniz bir yerdə.
              </p>
          </div>
          <Layers className="absolute top-[-50px] right-[-50px] w-96 h-96 text-white/5 opacity-20 group-hover:scale-110 transition-transform duration-1000" />
      </div>

      {/* Insights Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APP_INSIGHTS.map((insight: any, idx: number) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-rose-500/50 transition-all group flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`p-4 bg-rose-50 dark:bg-rose-900/30 rounded-2xl text-rose-600 shadow-inner group-hover:scale-110 transition-transform`}>
                  <insight.categoryIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase italic ${
                        insight.priority === 'High' ? 'bg-indigo-600 text-white' : 'bg-rose-500 text-white'
                    }`}>{insight.priority} Priority</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase italic mt-1">{insight.category}</span>
                </div>
              </div>

              <div className="space-y-4 flex-1 relative z-10">
                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{insight.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">
                  {insight.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                <div className="flex items-center text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest italic">
                  <TrendingUp className="w-4 h-4 mr-1.5" /> {insight.benefit}
                </div>
                <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-rose-600 hover:text-white transition-all text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppAnalysis;
