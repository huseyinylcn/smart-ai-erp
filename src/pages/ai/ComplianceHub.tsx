import { 
  ShieldCheck, Gavel, Calculator, 
  FileSearch, AlertTriangle, CheckCircle2, 
  ArrowRight, Brain, Shield, 
  TrendingUp, Scale, Info, Search,
  Briefcase, Landmark, BookOpen
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { COMPLIANCE_INSIGHTS } from './SAIAgentLogic';

const ComplianceHub = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest italic shadow-inner border border-emerald-100 dark:border-emerald-800">ERP Brain Layer</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Legal, Financial & Compliance Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Compliance & Intelligence Hub</h1>
        </div>
        <div className="flex items-center space-x-3">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-400 uppercase italic">Aİ Compliance Score</span>
                 <span className="text-lg font-black text-emerald-500 italic">94/100</span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
           </div>
        </div>
      </div>

      {/* Hero / Knowledge Domains */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-emerald-950 p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl group">
            <div className="relative z-10 max-w-2xl space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest italic border border-white/10">
                    <Brain className="w-3.5 h-3.5 mr-2 text-emerald-400" /> Intelligence Engine
                </div>
                <h2 className="text-4xl font-black uppercase italic leading-tight tracking-tight">ERP Artıq Sadəcə Əməliyyat Sistemi Deyil.</h2>
                <p className="text-sm font-bold text-slate-400 italic leading-relaxed">
                    S-AI Agent hüquqi, maliyyə və compliance sahələrində ekspert səviyyəsində biliklərə malikdir. IFRS, Vergi Məcəlləsi və Beynəlxalq Compliance standartları daxilində bütün prosesləri analiz edir.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                   {['IFRS', 'Local GAAP', 'Labor Code', 'GDPR', 'ISO 27001'].map(tag => (
                     <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase italic text-emerald-400">{tag}</span>
                   ))}
                </div>
            </div>
            <Landmark className="absolute top-[-50px] right-[-50px] w-96 h-96 text-white/5 opacity-20 group-hover:scale-110 transition-transform duration-1000" />
         </div>

         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3.5rem] shadow-sm flex flex-col justify-between group overflow-hidden relative">
            <div className="space-y-6 relative z-10">
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Compliance Nəzarəti</h3>
               <p className="text-xs font-bold text-slate-400 italic">Aİ real-vaxt rejimində bütün modulları yoxlayır və riskləri aşkar edir.</p>
               <div className="space-y-3">
                  {[
                    { label: 'Labor Law Sync', status: 'Optimal' },
                    { label: 'Tax Calculation', status: 'Secure' },
                    { label: 'Contract Integrity', status: 'Warning' }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                       <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase italic">{s.label}</span>
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase italic ${
                         s.status === 'Warning' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                       }`}>{s.status}</span>
                    </div>
                  ))}
               </div>
            </div>
            <Shield className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-emerald-500/5 rotate-12" />
         </div>
      </div>

      {/* Suggestion Engine Table */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm flex flex-col">
         <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-3">
               <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
                  <Landmark className="w-5 h-5" />
               </div>
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight italic">Suggestion Engine (Aİ Təklifləri)</h3>
            </div>
            <div className="relative">
               <input 
                type="text" 
                placeholder="Risk və ya sahə üzrə axtar..." 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-6 rounded-xl text-xs font-bold italic shadow-sm w-64"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100 dark:border-slate-800">
                     <th className="px-8 py-5">Sahə / Risk</th>
                     <th className="px-6 py-5">Problem və Təhlükə</th>
                     <th className="px-6 py-5">Aİ Təklifi (Suggested Fix)</th>
                     <th className="px-6 py-5">Əlaqəli Modul</th>
                     <th className="px-8 py-5 text-right">Qanuni İstinad</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {COMPLIANCE_INSIGHTS.map((insight: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                               insight.riskLevel === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                             }`}>
                                <insight.categoryIcon className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic leading-tight">{insight.area}</p>
                                <p className={`text-[8px] font-black uppercase italic ${
                                  insight.riskLevel === 'High' ? 'text-rose-500' : 'text-emerald-500'
                                }`}>{insight.riskLevel} Risk</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-start space-x-2">
                             <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                               insight.riskLevel === 'High' ? 'text-rose-500' : 'text-amber-500'
                             }`} />
                             <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic max-w-xs">{insight.problem}</p>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50">
                             <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 italic">{insight.suggestedFix}</p>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">{insight.module}</span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                             <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase italic underline decoration-indigo-200 cursor-help" title="Click to view law text">
                                {insight.legalReference}
                             </span>
                             <BookOpen className="w-3.5 h-3.5 text-slate-300" />
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Constraints & Notice Footer */}
      <div className="mt-8 flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
         <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400 uppercase italic">
            <Info className="w-4 h-4 text-indigo-500" />
            <span>Aİ hüquqi qərar vermir, yalnız real qanun və praktikaya əsaslanan tövsiyələr təqdim edir.</span>
         </div>
         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-[10px] font-black text-emerald-600 uppercase italic">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span>Compliance-Ready System</span>
            </div>
            <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest italic hover:scale-105 transition-all">
               Tam Audit Hesabatı
            </button>
         </div>
      </div>
    </div>
  );
};

export default ComplianceHub;
