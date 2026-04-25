import { useState } from 'react';
import { 
  Bot, Layout, Sparkles, Send, 
  BarChart3, PieChart, Activity, TrendingUp,
  Calculator, Rocket, Palette, Database,
  ArrowRight
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const AIDashboardCreator = () => {
  const context = useOutletContext<any>() || {};
  const { isContentFullscreen } = context;
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([
    { 
      role: 'assistant', 
      content: "Salam! Mən sizin Dashboard Strategiya Köməkçinizəm. İdarəetmə Panelini (Dashboard) necə daha effektiv edə biləcəyimizi analiz etməyə hazıram. Google Looker və Power BI standartlarına uyğun dizayn və metrik təklifləri verə bilərəm." 
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Analiz tamamlandı. Sizin sektor üçün 'Liquidity Ratio' və 'Customer Acquisition Cost' (CAC) metriklərini əsas dashboarda əlavə etməyi tövsiyə edirəm. Həmçinin, satış trendləri üçün 'Looker Exploration' üslubunda yığılmış bar-chart daha çox vizual dəqiqlik təmin edəcək. Bu dəyişiklikləri etmək üçün İdarəetmə Panelinə keçid edə bilərsiniz." 
      }]);
    }, 1000);
  };

  const strategySuggestions = [
    { title: 'Maliyyə Performans Modeli', desc: 'İnvestisiya və xalis mənfəət analizi üçün Power BI DAX şablonları.', icon: Calculator, color: 'indigo' },
    { title: 'Satış Hunisi Analizi', desc: 'Müştəri səyahətini vizuallaşdırmaq üçün Looker dizaynı.', icon: TrendingUp, color: 'emerald' },
    { title: 'Operativ Effektivlik', desc: 'Anbar və təchizat zənciri üçün real-vaxt widget strukturu.', icon: Activity, color: 'rose' }
  ];

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
           <div className="flex items-center space-x-3 mb-2">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic border border-indigo-100">BI Intelligence</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Looker & Power BI Advisor</span>
           </div>
           <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic flex items-center">
             <Bot className="w-8 h-8 mr-3 text-indigo-600" />
             Aİ Dashboard Strategiya Mərkəzi
           </h1>
           <p className="text-slate-500 text-[14px] mt-1 font-semibold ml-11">Dashboardların dizaynı və data arxitekturası üzrə Aİ analizi</p>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-[12px] uppercase tracking-widest italic hover:scale-105 transition-all shadow-xl flex items-center group"
        >
           İdarəetmə Panelinə Keç <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
         {/* Main Strategy Chat */}
         <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm flex flex-col overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Database className="w-64 h-64 text-indigo-600 rotate-12" />
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[80%] p-6 rounded-[2.5rem] text-[13px] font-bold italic leading-relaxed shadow-sm ${
                      m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700/50'
                    }`}>
                       {m.content}
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 relative z-10">
               <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Analiz üçün sual daxil edin (məs: Maliyyə dashboardu necə olmalıdır?)..." 
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-6 pl-10 pr-20 rounded-[2.5rem] text-sm font-black italic shadow-inner outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                  />
                  <button 
                    onClick={() => handleSend()}
                    className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>

         {/* Right Panel: Proposals & Patterns */}
         <div className="w-96 space-y-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm space-y-8">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Aİ Strategiya Təklifləri</h3>
               <div className="space-y-4">
                  {strategySuggestions.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(`${s.title} haqqında ətraflı məlumat ver.`)}
                      className="w-full text-left p-5 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 rounded-[2rem] transition-all group"
                    >
                       <div className="flex items-center space-x-4 mb-3">
                          <div className={`p-3 bg-${s.color}-50 dark:bg-${s.color}-900/30 text-${s.color}-600 rounded-xl group-hover:scale-110 transition-transform`}>
                             <s.icon className="w-5 h-5" />
                          </div>
                          <h4 className="text-[12px] font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{s.title}</h4>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 italic leading-relaxed uppercase">{s.desc}</p>
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                        <Palette className="w-5 h-5 text-white" />
                     </div>
                     <h4 className="text-sm font-black uppercase italic tracking-tight">Dizayn Standartları</h4>
                  </div>
                  <p className="text-[10px] font-bold text-indigo-100/70 italic leading-relaxed uppercase">
                    Aİ tərəfindən təklif olunan bütün dashboardlar <b>Google Looker</b> və <b>Power BI</b> UX standartlarına 100% uyğundur.
                  </p>
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-white/10 backdrop-blur-sm flex items-center justify-center text-[10px] font-black italic">
                          {i === 4 ? '+12' : <Sparkles className="w-4 h-4 opacity-50" />}
                       </div>
                     ))}
                  </div>
               </div>
               <Rocket className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/10 -rotate-12" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIDashboardCreator;
