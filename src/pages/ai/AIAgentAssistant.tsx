import { useState, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, X, 
  MessageSquare, Brain, Zap,
  Layout, FileText, TrendingUp,
  Cpu, Shield, Rocket
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

interface AIAgentAssistantProps {
  title: string;
  subtitle: string;
  type: 'dev' | 'template' | 'strategic' | 'admin';
}

const AIAgentAssistant = ({ title, subtitle, type }: AIAgentAssistantProps) => {
  const context = useOutletContext<any>() || {};
  const { isContentFullscreen } = context;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const suggestions = {
    dev: [
      "Sistem performansını necə artıra bilərəm?",
      "Yeni modullar üçün memarlıq təklifi ver.",
      "Frontend-də UX optimallaşdırılması üçün nə etməli?"
    ],
    template: [
      "Maliyyə hesabatı üçün yeni şablon hazırla.",
      "Müqavilə şablonlarını necə standartlaşdıra bilərəm?",
      "HR formaları üçün Aİ dəstəkli şablonlar yarat."
    ],
    strategic: [
      "Biznes böyüməsi üçün növbəti strateji addım nədir?",
      "Rəqib analizi əsasında yeni funksiya təklif et.",
      "Maliyet optimallaşdırılması üçün Aİ tövsiyələri."
    ],
    admin: [
      "İstifadəçi səlahiyyətlərini necə audit edə bilərəm?",
      "Sistem loqlarını analiz et və riskləri tap.",
      "Ayarlar bölməsi üçün UX təklifləri ver."
    ]
  };

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "";
      if (type === 'dev') aiResponse = "Sistem inkişafı üçün Micro-frontend memarlığını və WebAssembly inteqrasiyasını tövsiyə edirəm. Bu, ağır hesablamaları 40% sürətləndirəcək.";
      else if (type === 'template') aiResponse = "Sizin üçün IFRS standartlarına uyğun dinamik Maliyyə Hesabatı şablonu hazıradım. 'Şablonlar' bölməsindən baxa bilərsiniz.";
      else if (type === 'admin') aiResponse = "Sistem admin ayarlarını analiz etdim. İstifadəçi rollarının 'Least Privilege' prinsipinə uyğunlaşdırılmasını və audit loqlarının hər 24 saatdan bir avtomatik skan edilməsini tövsiyə edirəm.";
      else aiResponse = "Strateji olaraq, növbəti 6 ayda Predictive Analytics modulunun ön plana çıxarılmasını və dövlət inteqrasiyalarının 90%-ə çatdırılmasını tövsiyə edirəm.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    }, 800);
  };

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
           <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-all ${
              type === 'dev' ? 'bg-indigo-600 shadow-indigo-500/20' : 
              type === 'template' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-600 shadow-rose-500/20'
           }`}>
              <Bot className="w-7 h-7 text-white" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">{title}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">{subtitle}</p>
           </div>
        </div>
        <div className="flex -space-x-2">
           {[1,2,3].map(i => (
             <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200"></div>
           ))}
           <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] text-white font-black italic">+5</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex gap-8 overflow-hidden">
         <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
               {messages.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center animate-pulse ${
                      type === 'dev' ? 'bg-indigo-50 text-indigo-600' : 
                      type === 'template' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                       <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic">S-AI Agent Sizi Dinləyir</h3>
                       <p className="text-xs text-slate-400 font-bold italic max-w-sm">Mən bu bölmənin inkişafı və təkmilləşdirilməsi üçün sizə kömək etməyə hazıram.</p>
                    </div>
                 </div>
               )}
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm font-bold italic ${
                      m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700/50'
                    }`}>
                       {m.content}
                    </div>
                 </div>
               ))}
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
               <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Sualınızı daxil edin..." 
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-5 pl-8 pr-20 rounded-[2rem] text-sm font-black italic shadow-inner outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                  <button 
                    onClick={() => handleSend()}
                    className="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>

         {/* Sidebar Suggestions */}
         <div className="w-80 space-y-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm space-y-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Quick Suggestions</h3>
               <div className="space-y-4">
                  {suggestions[type].map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(s)}
                      className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 rounded-2xl transition-all group"
                    >
                       <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 italic leading-relaxed">{s}</p>
                    </button>
                  ))}
               </div>
            </div>

            <div className={`p-8 rounded-[3rem] text-white relative overflow-hidden shadow-xl ${
              type === 'dev' ? 'bg-indigo-600' : type === 'template' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
               <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                     <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-black uppercase italic tracking-tight">AI Insights Active</h4>
                  <p className="text-[10px] font-bold text-white/70 italic leading-relaxed uppercase">Bu bölmə hər gün yeni datalarla təkmilləşir.</p>
               </div>
               <Brain className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/10" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIAgentAssistant;
