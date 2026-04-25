import { 
  Cpu, Zap, Target, Users, 
  Brain, Table, Sparkles, 
  ArrowRight, TrendingUp, Info,
  Lightbulb, ShieldCheck
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { BITRIX_INSIGHTS } from './SAIAgentLogic';

const BitrixAnalysis = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic shadow-inner border border-indigo-100 dark:border-indigo-800">Competitive Intelligence</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Bitrix24 Release 2025 Benchmarking</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Bitrix24 Analizi və Strateji Təkliflər</h1>
        </div>
      </div>

      {/* Hero / Summary */}
      <div className="bg-slate-900 dark:bg-indigo-950 p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl mb-8 group">
          <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest italic border border-white/10">
                  <Cpu className="w-3.5 h-3.5 mr-2 text-indigo-400" /> AI-Driven Comparison
              </div>
              <h2 className="text-4xl font-black uppercase italic leading-tight tracking-tight">SmartAgent ERP və Bitrix24 CoPilot Sintezi.</h2>
              <p className="text-sm font-bold text-slate-400 italic leading-relaxed">
                  Bitrix24-ün ən son (2025) yeniliklərini analiz edərək, SmartAgent ERP-nin gələcək yol xəritəsi üçün ən kritik funksionallıqları müəyyən etdik. Məqsədimiz bazardakı ən yaxşı təcrübələri daxili modullarımıza inteqrasiya etməkdir.
              </p>
          </div>
          <Sparkles className="absolute top-[-50px] right-[-50px] w-96 h-96 text-white/5 opacity-20 group-hover:scale-110 transition-transform duration-1000" />
      </div>

      {/* Insights Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BITRIX_INSIGHTS.map((insight: any, idx: number) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all group flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 shadow-inner group-hover:scale-110 transition-transform`}>
                  <insight.categoryIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase italic ${
                        insight.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
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
                <div className="flex items-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest italic">
                  <TrendingUp className="w-4 h-4 mr-1.5" /> {insight.benefit}
                </div>
                <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Subtle background icon */}
              <insight.categoryIcon className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-slate-50 dark:text-slate-800/20 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Benchmarking Summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3.5rem] shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <Brain className="w-6 h-6 text-indigo-500" />
                    <h4 className="text-xl font-black uppercase italic tracking-tight text-slate-800 dark:text-white">AI Agent Strategiyası</h4>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">1</div>
                        <p className="text-[12px] font-bold text-slate-600 dark:text-slate-300 italic leading-relaxed">Bitrix24-ün 'Martha AI' modelinə alternativ olaraq, SmartAgent daxilində tam dildə (AZ, EN) danışan agentin qurulması.</p>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">2</div>
                        <p className="text-[12px] font-bold text-slate-600 dark:text-slate-300 italic leading-relaxed">Workflow avtomatlaşdırılmasında Bitrix24 Automation Studio patternlərinin SmartAgent ERP-yə adaptasiyası.</p>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-xl shadow-indigo-500/20 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest italic mb-6">
                        <Lightbulb className="w-3 h-3 mr-1.5" /> Next Release Focus
                    </div>
                    <h3 className="text-2xl font-black uppercase italic leading-tight mb-4">S-AI Agent artıq növbəti pleylistləri analiz etməyə hazırdır.</h3>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest italic">CoPilot və CRM Analytics pleylistlərindən çıxan nəticələr avtomatik bura əlavə olunacaq.</p>
                </div>
                <button className="relative z-10 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl italic mt-8">
                    Tam Analiz Hesabatını Gör
                </button>
                <Zap className="absolute bottom-[-30px] right-[-10px] w-48 h-48 text-white/10 rotate-[-15deg]" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default BitrixAnalysis;
