import { useState, useEffect } from 'react';
import { 
  Sparkles, X, Send, Brain, 
  MessageSquare, Zap, Shield, 
  ChevronLeft, BarChart2, FileText, 
  HelpCircle, Info, Database, Target
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { processQuery } from '../../pages/ai/SAIAgentLogic';

const AIAssistantSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{
    role: 'user' | 'assistant', 
    content: string, 
    type?: string, 
    metadata?: any, 
    extra?: any
  }[]>([
    { role: 'assistant', content: "Mən S-AI Assistant-am. Hazırda hansısa sualınız var?" }
  ]);
  const [input, setInput] = useState('');
  const location = useLocation();

  // Context detection based on route
  const getContextInfo = () => {
    const path = location.pathname;
    if (path.includes('hr')) return { title: 'HR Köməkçisi', suggestions: ['Məzuniyyət balansı necə hesablanır?', 'Yeni işçi əlavə et', 'Tabeldəki qırmızılar nədir?'] };
    if (path.includes('sales')) return { title: 'Satış Analitiki', suggestions: ['Bu gün neçə satış olub?', 'ƏDV uyğunsuzluğu varmı?', 'Top müştərilər kimdir?'] };
    if (path.includes('finance')) return { title: 'Maliyyə Köməkçisi', suggestions: ['Yoxlama balansı analizi', 'Kurs fərqi hesabla', 'Ay bağlanışı checklist'] };
    return { title: 'Global Köməkçi', suggestions: ['Bu bölmə nə üçündür?', 'Necə hesabat hazırlayım?', 'Sistem bələdçisi'] };
  };

  const context = getContextInfo();

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setInput('');

    try {
      const result = await processQuery(textToSend);
      
      let aiMessage: any;

      if (result.error === 'CLARIFICATION_REQUIRED') {
        aiMessage = {
          role: 'assistant',
          content: "Bu ay üzrə baxım, yoxsa başqa dövr (məs: Mart ayı) seçmək istəyirsiniz?",
          type: 'text'
        };
      } else if (result.error === 'INTENT_NOT_FOUND') {
        aiMessage = {
          role: 'assistant',
          content: `Kontekst: ${context.title}. Sizin "${textToSend}" sorğunuzu təhlil edirəm... Hazırda bu spesifik suala cavab vermək üçün data modelim təkmilləşdirilir.`,
          type: 'text'
        };
      } else {
        aiMessage = {
          role: 'assistant',
          content: result.summary || '',
          type: 'analysis',
          metadata: result.metadata,
          extra: { 
            table: result.table,
            module: result.module
          }
        };
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Xəta baş verdi. Zəhmət olmasa bir qədər sonra təkrar yoxlayın." 
      }]);
    }
  };

  return (
    <>
      {/* Floating Sparkle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 z-[60] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group animate-bounce-subtle"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full"></div>
        </button>
      )}

      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-[400px] bg-white border-l border-slate-100 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-[70] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight italic">S-AI Assistant</h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase italic">{context.title}</span>
                    </div>
                </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-50 text-slate-400 rounded-xl transition-all"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* Suggestions Card */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-5 space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center italic">
                        <Zap className="w-3.5 h-3.5 mr-2" /> Sürətli Sorğular
                    </h4>
                    <div className="space-y-2">
                        {context.suggestions.map((s, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => handleSend(s)}
                              className="w-full text-left p-3 bg-white border border-indigo-100/50 rounded-xl text-[11px] font-semibold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all italic"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div className="space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[95%] p-4 rounded-2xl text-[12px] font-semibold leading-relaxed italic ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white shadow-lg rounded-tr-none' 
                                : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                            }`}>
                                <div className="space-y-3">
                                    <p>{msg.content}</p>

                                    {msg.type === 'analysis' && msg.extra?.table && (
                                        <div className="mt-3 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                            <div className="overflow-x-auto max-w-full">
                                                <table className="w-full text-left text-[10px] font-bold italic">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase">
                                                            {msg.extra.table.headers.map((h: string) => (
                                                                <th key={h} className="px-3 py-2 whitespace-nowrap">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {msg.extra.table.rows.map((row: any[], rIdx: number) => (
                                                            <tr key={rIdx} className="border-b border-slate-50">
                                                                {row.map((cell, cIdx) => (
                                                                    <td key={cIdx} className="px-3 py-2 text-slate-600 whitespace-nowrap">{cell}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {msg.role === 'assistant' && msg.metadata && (
                                        <div className="flex items-center pt-2 gap-3 border-t border-slate-200/50 mt-3 opacity-60">
                                            <div className="flex items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                <Database className="w-2.5 h-2.5 mr-1" /> {msg.metadata.source}
                                            </div>
                                            <div className="flex items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                <Shield className="w-2.5 h-2.5 mr-1" /> {msg.metadata.permission_status}
                                            </div>
                                            <div className="flex items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                <Target className="w-2.5 h-2.5 mr-1" /> {msg.metadata.confidence}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-50 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                <div className="relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
                      placeholder="Sualınızı yazın..."
                      className="w-full bg-slate-50 border border-slate-200 py-4 pl-6 pr-14 rounded-2xl text-xs font-black italic shadow-inner outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                    <button 
                      onClick={() => handleSend()}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center font-black italic"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4">
                    <div className="flex items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                        <Shield className="w-3 h-3 mr-1.5" /> Secure
                    </div>
                    <div className="w-[1px] h-3 bg-slate-200"></div>
                    <div className="flex items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                        <Info className="w-3 h-3 mr-1.5" /> AI Beta
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Overlay when open on mobile/small screens or for focus */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[65]"
        ></div>
      )}
    </>
  );
};

export default AIAssistantSidebar;
