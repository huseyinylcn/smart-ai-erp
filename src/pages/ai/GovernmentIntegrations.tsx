import { 
  Landmark, Globe, Shield, 
  Zap, ArrowRight, Brain, 
  Settings, Search, MoreVertical,
  CheckCircle2, AlertCircle, Clock,
  Layers, Database, FileText,
  MousePointer2, ExternalLink, BarChart4
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { GOV_INTEGRATION_INSIGHTS } from './SAIAgentLogic';

const GovernmentIntegrations = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest italic shadow-inner border border-blue-100 dark:border-blue-800">Local Ecosystem</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Azerbaijan Government Portals Research</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Dövlət İnteqrasiyaları</h1>
        </div>
        <div className="flex items-center space-x-3">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-400 uppercase italic">Active Connections</span>
                 <span className="text-lg font-black text-blue-500 italic">12 Systems</span>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                 <Globe className="w-6 h-6 text-blue-600" />
              </div>
           </div>
        </div>
      </div>

      {/* Hero / Research Scope */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl mb-8 group">
          <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest italic border border-white/10">
                  <Landmark className="w-3.5 h-3.5 mr-2 text-blue-400" /> Digital Government Integration
              </div>
              <h2 className="text-4xl font-black uppercase italic leading-tight tracking-tight">SmartAgent: 100% Lokal Uyğunluq.</h2>
              <p className="text-sm font-bold text-slate-400 italic leading-relaxed">
                  Azərbaycanın dövlət sistemləri (e-Tax, EMAS, e-Sosial) ilə ERP-nin vahid ekosistemdə birləşməsi üzrə strateji araşdırmalar. Manual işlərin 80% azaldılması və sənədlərin avtomatik sinxronizasiyası burada analiz edilir.
              </p>
          </div>
          <Database className="absolute top-[-50px] right-[-50px] w-96 h-96 text-white/5 opacity-20 group-hover:scale-110 transition-transform duration-1000" />
      </div>

      {/* Portals & Integrations Grid */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm flex flex-col">
         <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-3">
               <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                  <Settings className="w-5 h-5" />
               </div>
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight italic">İnteqrasiya və Avtomatlaşdırma Təklifləri</h3>
            </div>
            <div className="flex items-center space-x-3">
               <span className="text-[10px] font-black text-slate-400 uppercase italic">Filter:</span>
               <div className="flex space-x-2">
                  {['API', 'RPA', 'Manual'].map(type => (
                    <span key={type} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase italic text-slate-500 cursor-pointer hover:bg-blue-600 hover:text-white transition-all">{type}</span>
                  ))}
               </div>
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100 dark:border-slate-800">
                     <th className="px-8 py-5">Portal / Status</th>
                     <th className="px-6 py-5">Use Case & Manual Process</th>
                     <th className="px-6 py-5">Suggested Automation</th>
                     <th className="px-6 py-5">Integration Type</th>
                     <th className="px-8 py-5 text-right">Priority</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {GOV_INTEGRATION_INSIGHTS.map((insight: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <insight.categoryIcon className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{insight.portalName}</p>
                                <div className="flex items-center space-x-1.5 mt-1">
                                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                   <span className="text-[9px] font-bold text-slate-400 uppercase italic">Connected</span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="space-y-1">
                             <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase italic">{insight.useCase}</p>
                             <p className="text-[10px] font-bold text-slate-400 italic">Manual: {insight.manualProcess}</p>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-800/50 flex items-start space-x-3">
                             <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                             <p className="text-[11px] font-bold text-blue-900 dark:text-blue-300 italic leading-relaxed">{insight.automation}</p>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase italic">{insight.integrationType}</span>
                             <span className="text-[8px] font-bold text-slate-400 uppercase italic tracking-widest">{insight.module}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase italic ${
                            insight.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                          }`}>{insight.priority}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Security & Data Privacy Notice */}
      <div className="mt-8 p-6 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-between shadow-xl relative overflow-hidden">
         <div className="relative z-10 flex items-center space-x-6">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
               <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
               <h4 className="text-sm font-black uppercase italic tracking-tight">Data Privacy & Security Constraint</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-1 tracking-widest">Aİ yalnız analiz və strateji təklif formatında işləyir. Real portallara giriş və data manipulyasiyası qadağandır.</p>
            </div>
         </div>
         <button className="relative z-10 px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest italic hover:scale-105 transition-all flex items-center">
            <span>Data Mapping Planı</span>
            <ExternalLink className="w-4 h-4 ml-2" />
         </button>
         <Globe className="absolute right-[-50px] bottom-[-50px] w-48 h-48 text-white/5" />
      </div>
    </div>
  );
};

export default GovernmentIntegrations;
