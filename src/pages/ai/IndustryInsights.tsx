import { useState } from 'react';
import { 
  Brain, TrendingUp, Zap, Target, 
  ChevronRight, ArrowRight, Lightbulb, 
  Search, Filter, LayoutGrid, List,
  ShoppingCart, Activity, Coffee, GraduationCap, Package,
  Sparkles
} from 'lucide-react';
import { SECTOR_TEMPLATES, type SectorTemplate } from '../../data/sectorTemplates';
import { INDUSTRY_SUGGESTIONS } from './SAIAgentLogic';

const IndustryInsights = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const sectors = Object.values(SECTOR_TEMPLATES);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart': return ShoppingCart;
      case 'Activity': return Activity;
      case 'Coffee': return Coffee;
      case 'Package': return Package;
      case 'GraduationCap': return GraduationCap;
      default: return Brain;
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic flex items-center gap-3">
            <span className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none"><Brain className="w-7 h-7 text-white" /></span>
            Industry <span className="text-indigo-600">Insights</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] italic mt-2 ml-14">AI-Driven Sector Analysis & Strategic Suggestions</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
           <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
           </div>
           <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800"></div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Sektor axtar..." 
                className="bg-slate-50 dark:bg-slate-800 border-none py-2 pl-9 pr-4 rounded-xl text-[11px] font-bold italic focus:ring-2 focus:ring-indigo-100 outline-none w-48 transition-all"
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* SECTORS LIST */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 italic flex items-center">
                    <Target className="w-4 h-4 mr-2 text-indigo-500" /> Dəstəklənən Sektorlar
                </h3>
            </div>

            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                {sectors.map((sector) => {
                    const Icon = getIcon(sector.icon);
                    return (
                        <div 
                          key={sector.sector}
                          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icon className="w-24 h-24 rotate-12" />
                            </div>
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-110">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{sector.industry}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{sector.sector} Sector</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">AI</div>
                                    </div>
                                </div>

                                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-semibold italic leading-relaxed">
                                    {sector.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {sector.modules.map(mod => (
                                        <span key={mod} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                                            {mod}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase italic">Active Template</span>
                                        </div>
                                        <div className="w-[1px] h-6 bg-slate-100 dark:bg-slate-800"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Modules</span>
                                            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase italic">{sector.modules.length} Apps</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase italic shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">
                                        Detallı <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* AI SUGGESTIONS PANEL */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-300 italic">AI Proactive Suggestions</h3>
                        <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    </div>
                    
                    <div className="space-y-6">
                        {INDUSTRY_SUGGESTIONS.map((s, idx) => (
                            <div key={idx} className="space-y-3 p-5 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition-all group/card">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-[8px] font-black uppercase tracking-widest">
                                        {s.sector}
                                    </span>
                                    <span className={`text-[8px] font-black uppercase ${s.priority === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                                        {s.priority} Priority
                                    </span>
                                </div>
                                <h4 className="text-[13px] font-black text-white italic group-hover/card:text-indigo-300 transition-colors">{s.suggestedFeature}</h4>
                                <p className="text-[11px] text-slate-400 font-semibold italic leading-relaxed">
                                    {s.description}
                                </p>
                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.module} Modulu</span>
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-all" title="Ignore">
                                            <TrendingUp className="w-3.5 h-3.5 rotate-180" />
                                        </button>
                                        <button className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-600/20" title="Implement">
                                            <Zap className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between p-4 bg-indigo-500/10 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                                <span className="text-[10px] font-black text-white uppercase italic">Agent is analyzing...</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 italic">Daily Refresh in 4h</span>
                        </div>
                    </div>
                </div>
                <Zap className="absolute bottom-[-30px] right-[-30px] w-64 h-64 text-indigo-500/5 rotate-[15deg]" />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 italic flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-amber-500" /> New Module Proposals
                </h3>
                <div className="space-y-4">
                    {[
                        { title: "Smart Delivery Hub", desc: "Logistika üçün marşrut optimallaşdırması." },
                        { title: "Loyalty AI Engine", desc: "Retail üçün fərdi kampaniya generatoru." }
                    ].map((p, i) => (
                        <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                            <h4 className="text-[12px] font-black text-slate-800 dark:text-white uppercase italic mb-1">{p.title}</h4>
                            <p className="text-[10px] text-slate-500 font-bold italic">{p.desc}</p>
                        </div>
                    ))}
                </div>
                <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase italic hover:border-indigo-400 hover:text-indigo-500 transition-all">
                    Generate New Ideas
                </button>
            </div>
        </div>
      </div>

    </div>
  );
};

export default IndustryInsights;
