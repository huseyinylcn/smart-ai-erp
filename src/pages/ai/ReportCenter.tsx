import { 
  Calculator, Target, Layers, Users, 
  Search, Filter, Download, Info,
  Sparkles, TrendingUp, ShieldCheck, Activity,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { REPORT_CENTER_PROPOSALS } from './SAIAgentLogic';

const ReportCenter = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic shadow-inner">AI Strategy</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Intelligence & Analytics Research</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Aİ Hesabat Mərkəzi Araşdırması</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl italic flex items-center">
            <Download className="w-4 h-4 mr-2" />
            <span>PDF Hesabatı Yüklə</span>
          </button>
        </div>
      </div>

      {/* Hero Stats / AI Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase italic">V 1.0 AI Research</span>
                </div>
                <h3 className="text-xl font-black uppercase italic leading-tight">Proaktiv Hesabat Strukturu</h3>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest italic">Sizin biznes modelinizə uyğun olaraq hazırlanan hesabat arxitekturası.</p>
            </div>
            <Activity className="absolute bottom-[-20px] right-2 w-32 h-32 text-white/10 rotate-[-15deg] group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase italic">98% Dəqiqlik</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Təklif Edilən Metriklər</p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white italic tabular-nums">42+ Göstərici</h4>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-amber-500 uppercase italic">Təhlükəsiz Data</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Data İnteqrasiya Qatı</p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white italic">Tam İzolyasiya</h4>
            </div>
        </div>
      </div>

      {/* Main Proposals Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REPORT_CENTER_PROPOSALS.map((sec: any, sIdx: number) => (
            <div key={sIdx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all group flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-[1.5rem] text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                    <sec.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-slate-800 dark:text-white italic tracking-tight">{sec.category}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic tracking-widest">Strateji Bölmə {sIdx + 1}</p>
                  </div>
                </div>
                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                {sec.subSections.map((sub: any, subIdx: number) => (
                  <div key={subIdx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/40"></div>
                        <h5 className="text-[13px] font-black text-slate-800 dark:text-white italic uppercase tracking-tight">{sub.name}</h5>
                      </div>
                      <span className="text-[8px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase shadow-lg shadow-indigo-600/20">{sub.feature}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">
                      {sub.functionality}
                    </p>
                    <div className="mt-4 flex items-center text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Metrikləri İdarə Et</span>
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Proactive Recommendation Section */}
        <div className="mt-8 bg-slate-900 dark:bg-indigo-950 p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest italic border border-indigo-500/30">
                        <Info className="w-3.5 h-3.5 mr-2" /> Növbəti Addım
                    </div>
                    <h2 className="text-3xl font-black uppercase italic leading-tight tracking-tight">AI Agent tərəfindən idarə olunan fərdi hesabat mərkəzini aktivləşdirin.</h2>
                    <p className="text-sm font-bold text-slate-400 italic leading-relaxed">
                        Bu araşdırma SmartAgent ERP-nin gələcək analitik potensialını göstərir. Biz sadəcə rəqəmləri yox, rəqəmlərin arxasındakı biznes məntiqini vizuallaşdırırıq.
                    </p>
                    <button className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl italic">
                        Hesabat Mərkəzini Qur
                    </button>
                </div>
                <div className="relative h-64 lg:h-auto">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right duration-1000">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-32 rounded-3xl bg-white/5 border border-white/10 ${i % 2 === 0 ? 'mt-8' : ''}`}></div>
                        ))}
                    </div>
                </div>
            </div>
            <Sparkles className="absolute top-[-50px] right-[-50px] w-96 h-96 text-white/5 opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default ReportCenter;
