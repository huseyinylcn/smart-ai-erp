import { useState } from 'react';
import { 
  Plus, Search, Bot, Workflow, 
  Sparkles, Send, X, Play, Pause, 
  Trash2, MoreVertical, Activity, 
  CheckCircle2, Clock, ShieldCheck, Filter,
  Repeat, Settings2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Automation = () => {
  const { isContentFullscreen } = useOutletContext<any>();
  const [activeTab, setActiveTab] = useState<'details' | 'list'>('details');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Proses analiz edilir... Yeni avtomatlaşdırma qaydası hazırlandı: 'Əgər qaimə statusu PAID olarsa, avtomatik təchizatçıya təşəkkür məktubu göndər'. Təsdiq edirsiniz?" 
      }]);
    }, 1000);
  };

  const workflows = [
    { id: 1, name: 'Invoys Təsdiqi', status: 'Running', creator: 'System' },
    { id: 2, name: 'Stok Bildirişləri', status: 'Idle', creator: 'Admin' }
  ];

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      
      {/* HEADER SECTION - Bitrix24 Inspired */}
      <div className="flex flex-col space-y-6 mb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">
            Robotic Process Automation (RPA)
          </h1>
          
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="Filtr və axtarış" 
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 rounded-xl text-xs font-bold italic shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Tabs - Details / List */}
        <div className="flex items-center space-x-8 border-b border-slate-200 dark:border-slate-800 pb-1">
          <button 
            onClick={() => setActiveTab('details')}
            className={`text-[11px] font-black uppercase italic tracking-widest pb-3 transition-all relative ${
              activeTab === 'details' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Detallar
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`text-[11px] font-black uppercase italic tracking-widest pb-3 transition-all relative ${
              activeTab === 'list' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Siyahı
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto pt-8 custom-scrollbar">
        {activeTab === 'details' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* New Workflow Card - Bitrix Style */}
            <div 
              onClick={() => setIsChatOpen(true)}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] bg-white/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center space-y-4 hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase italic tracking-tight group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                  Yeni Vorkflou
                </span>
              </div>
            </div>

            {/* Existing Workflows */}
            {workflows.map((wf) => (
              <div key={wf.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all group relative overflow-hidden aspect-[4/3] flex flex-col">
                <div className="flex items-start justify-between mb-auto">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Workflow className="w-6 h-6" />
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mt-4">
                  <h3 className="text-base font-black text-slate-800 dark:text-white uppercase italic tracking-tight leading-tight">
                    {wf.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${wf.status === 'Running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase italic">{wf.status}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500">
                        {wf.creator[0]}
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest">{wf.creator}</span>
                   </div>
                   <div className="flex items-center space-x-1">
                      <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-slate-400 shadow-sm">
                        <Play className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
               <thead>
                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5">Vorkflou Adı</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Yaradan</th>
                    <th className="px-8 py-5 text-right">Əməliyyat</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                 {workflows.map((wf) => (
                   <tr key={wf.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                           <Workflow className="w-4 h-4 text-indigo-500" />
                           <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{wf.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase italic ${
                          wf.status === 'Running' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'
                        }`}>{wf.status}</span>
                      </td>
                      <td className="px-6 py-6">
                         <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase italic tracking-widest">{wf.creator}</span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                         <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><Settings2 className="w-4 h-4" /></button>
                         <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Assistant Modal for Automation */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[600px] border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">AI Automation Assistant</h2>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">Prompt ilə proses qurun</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl text-indigo-600">
                    <Repeat className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase italic">Avtomatlaşdırma Qurun</h3>
                  <p className="text-xs text-slate-500 font-bold italic max-w-xs mt-2">Məsələn: "Əgər yeni sifariş gələrsə, avtomatik müştəriyə təsdiq maili göndər."</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold italic ${
                     m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                   }`}>
                     {m.content}
                   </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
              <div className="relative group">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Proses üçün prompt daxil edin..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-5 pl-8 pr-16 rounded-[2rem] text-sm font-black italic shadow-inner outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <button onClick={handleSend} className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automation;
