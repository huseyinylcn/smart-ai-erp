import { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Zap, Shield, Search, 
  BarChart4, MessageSquare, History, Bookmark,
  ChevronRight, ArrowRight, Lightbulb, AlertCircle,
  Brain, FileText, Target, Users, Calculator,
  Maximize2, Minimize2, Bug, Table, Database,
  TrendingUp, Activity, Cpu, Kanban, ListTodo,
  CheckCircle2, Clock, Layers
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { processQuery, BITRIX_INSIGHTS } from './SAIAgentLogic';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'analysis' | 'suggestion' | 'action';
  metadata?: any;
  extra?: any;
}

const SAIAgent = () => {
  const context = useOutletContext<any>() || {};
  const { isContentFullscreen, setIsContentFullscreen } = context;
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [learningProgress, setLearningProgress] = useState(42);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Salam! Mən Bitrix24 YouTube kanalındakı pleylistləri izləyirəm. Artıq 'Release' pleylistini bitirdim və vizual patternləri öyrəndim. Hazırda 'CoPilot' pleylistindəyəm. Sizə necə kömək edə bilərəm?",
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;
    
    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await processQuery(textToSend);
      
      let aiMessage: Message;

      if (result.error === 'CLARIFICATION_REQUIRED') {
        aiMessage = {
          role: 'assistant',
          content: "Bu ay üzrə baxım, yoxsa başqa dövr (məs: Mart ayı) seçmək istəyirsiniz?",
          type: 'text'
        };
      } else if (result.error === 'INTENT_NOT_FOUND') {
        aiMessage = {
          role: 'assistant',
          content: "Bağışlayın, hazırda yalnız Satış, HR və Bitrix Analizi üzrə kömək edə bilirəm. Sizə bu sahələrdə necə kömək edə bilərəm?",
          type: 'text'
        };
      } else if (result.error === 'EMPTY_RESULT') {
        aiMessage = {
          role: 'assistant',
          content: `${result.period} dövrü üzrə ${result.module === 'sales' ? 'satış' : 'işçi'} məlumatı tapılmadı.`,
          type: 'text'
        };
      } else if (result.type === 'report_proposal') {
        aiMessage = {
          role: 'assistant',
          content: result.summary || '',
          type: 'suggestion',
          metadata: result.metadata,
          extra: { reportSections: result.sections }
        };
      } else if (result.type === 'suggestion') {
        aiMessage = {
          role: 'assistant',
          content: result.summary || '',
          type: 'suggestion',
          metadata: result.metadata,
          extra: { recommendations: result.recommendations }
        };
      } else {
        aiMessage = {
          role: 'assistant',
          content: result.summary || '',
          type: 'analysis',
          metadata: result.metadata,
          extra: { 
            table: result.table,
            debug: result.debug,
            module: result.module
          }
        };
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sistemi emal edərkən xəta baş verdi. Zəhmət olmasa bir qədər sonra təkrar yoxlayın.",
        type: 'text'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { text: "Təchizat Zənciri Analizi", icon: Layers, color: "text-indigo-500" },
    { text: "Satış trendləri (Bu ay)", icon: BarChart4, color: "text-blue-500" },
    { text: "Tabel uyğunsuzluqlarını tap", icon: Zap, color: "text-amber-500" },
    { text: "Mənə P&L hesabatı hazırlat", icon: FileText, color: "text-emerald-500" }
  ];

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">S-AI Agent Chat</h1>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] italic mt-0.5">Mərkəzi İntellekt Hub</p>
            </div>
        </div>

        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-sm">
            <div className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest italic">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                V 1.0 BETA
            </div>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 ml-2"></div>
            <button 
              onClick={() => setIsDebugMode(!isDebugMode)}
              className={`p-2 rounded-xl transition-all ${isDebugMode ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
              title="Debug Mode"
            >
              <Bug className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsContentFullscreen(!isContentFullscreen)}
              className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all flex items-center space-x-2 text-[10px] font-black uppercase italic"
              title={isContentFullscreen ? "Restore" : "Maximize"}
            >
              {isContentFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden">
        
        {/* MAIN AREA */}
        <div className="col-span-12 lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
            >
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
                            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-indigo-600'}`}>
                                {msg.role === 'user' ? <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <Brain className="w-4 h-4 text-white" />}
                            </div>
                            <div className={`p-6 rounded-3xl shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white shadow-soft-xl rounded-tr-none' 
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                            }`}>
                                <div className="space-y-4">
                                    <p className="text-[13px] font-semibold leading-relaxed italic">{msg.content}</p>
                                    
                                    {msg.type === 'suggestion' && msg.extra?.reportSections && (
                                        <div className="grid grid-cols-1 gap-6 mt-6">
                                            {msg.extra.reportSections.map((sec: any, sIdx: number) => (
                                                <div key={sIdx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl shadow-sm overflow-hidden group">
                                                    <div className="flex items-center space-x-3 mb-6">
                                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                                                            <sec.icon className="w-5 h-5" />
                                                        </div>
                                                        <h4 className="text-[14px] font-black uppercase text-slate-800 dark:text-white italic tracking-tight">{sec.category}</h4>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {sec.subSections.map((sub: any, subIdx: number) => (
                                                            <div key={subIdx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                                        <h5 className="text-[12px] font-black text-slate-800 dark:text-white italic uppercase">{sub.name}</h5>
                                                                    </div>
                                                                    <span className="text-[9px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded uppercase">{sub.feature}</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">
                                                                    {sub.functionality}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {msg.type === 'suggestion' && msg.extra?.recommendations && (
                                        <div className="grid grid-cols-1 gap-4 mt-4">
                                            {msg.extra.recommendations.map((rec: any, rIdx: number) => (
                                                <div key={rIdx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm group hover:border-indigo-500 transition-all">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                                            <h4 className="text-[12px] font-black uppercase text-slate-800 dark:text-white italic">{rec.title}</h4>
                                                        </div>
                                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                                                            rec.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                                                        }`}>{rec.priority}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic mb-3 leading-relaxed">
                                                        {rec.description}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                                        <div className="flex items-center text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest italic">
                                                            <TrendingUp className="w-3 h-3 mr-1.5" /> {rec.benefit}
                                                        </div>
                                                        <button className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all">
                                                            <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {msg.type === 'analysis' && msg.extra?.table && (
                                        <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-[11px] font-bold italic">
                                                    <thead>
                                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                                                            {msg.extra.table.headers.map((h: string) => (
                                                                <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {msg.extra.table.rows.map((row: any[], rIdx: number) => (
                                                            <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                                {row.map((cell, cIdx) => (
                                                                    <td key={cIdx} className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{cell}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {msg.role === 'assistant' && msg.metadata && (
                                        <div className="flex items-center pt-2 gap-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-4 opacity-70">
                                            <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                                <Database className="w-3 h-3 mr-1" /> {msg.metadata.source}
                                            </div>
                                            <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                                <Shield className="w-3 h-3 mr-1" /> {msg.metadata.permission_status}
                                            </div>
                                            <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                                <Target className="w-3 h-3 mr-1" /> {msg.metadata.confidence}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-in fade-in">
                        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-3xl flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                <div className="relative group">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Necə kömək edə bilərəm? Məs: 'Bitrix Analizi' və ya 'Təkliflər ver'"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-5 pl-8 pr-16 rounded-[2rem] text-sm font-black italic shadow-inner outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-white"
                    />
                    <button 
                      onClick={() => handleSend()}
                      className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        {/* SIDEBAR TOOLS */}
        <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col">
            
            {/* Suggested Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 italic flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-indigo-500" /> Təklif Olunanlar
                </h3>
                <div className="space-y-3">
                    {suggestions.map((s, idx) => (
                        <button 
                          key={idx}
                          onClick={() => { handleSend(s.text); }}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl transition-all group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 ${s.color}`}>
                                    <s.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 italic">{s.text}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Knowledge Layers Status */}
            <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex-1 group">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 italic">Data Layer İnteqrasiyası</h3>
                    <div className="space-y-4">
                        {[
                            { name: "ERP Metadata", status: "Active", icon: Target },
                            { name: "Bitrix Analysis", status: "Live", icon: Cpu },
                            { name: "Strategic Log", status: "Linked", icon: FileText },
                            { name: "Proactive Mode", status: "Active", icon: Zap },
                        ].map((layer, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <layer.icon className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[11px] font-bold text-white italic">{layer.name}</span>
                                </div>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                                    layer.status === 'Active' || layer.status === 'Live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                                }`}>{layer.status}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-slate-800">
                         <div className="text-[9px] text-slate-500 italic leading-relaxed">
                            S-AI Agent hazırda proaktiv rejimdədir. Tapılan bütün təkliflər avtomatik olaraq "Yol Xəritəsi" bölməsində yığılır.
                         </div>
                    </div>
                </div>
                <Zap className="absolute bottom-[-20px] right-2 w-32 h-32 text-indigo-500/10 rotate-[-15deg]" />
            </div>

        </div>

      </div>

    </div>
  );
};

export default SAIAgent;
