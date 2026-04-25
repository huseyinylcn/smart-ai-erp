import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Phone, Video, MoreVertical, 
  Send, Paperclip, Smile,
  CheckCheck, Circle, Search as SearchIcon,
  Plus, Filter, Mic, ChevronDown, 
  MessageSquare, Users, Zap, Radio, Globe, X, LayoutDashboard,
  VideoOff, MicOff, Maximize2, Minimize2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Chat = () => {
  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();

  // Main States
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('Chats');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isCalling, setIsCalling] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');

  // Contacts Mock Data
  const [contacts, setContacts] = useState([
    { id: 1, name: "Narmin Allahverdiyeva", lastMsg: "Yaxşı, sənədləri gözləyirəm.", time: "14:56", status: "online", lastSeen: "Onlayndır", avatar: "NA", color: "bg-emerald-500", unread: 3, type: 'chat' },
    { id: 2, name: "Rasim Abasov", lastMsg: "Sövdələşməni bağladıq!", time: "Dünən", status: "offline", lastSeen: "1 saat əvvəl", avatar: "RA", color: "bg-rose-500", unread: 0, type: 'chat' },
    { id: 3, name: "Musa Alizada", lastMsg: "Mən yeni sistemə qoşuldum.", time: "19 Fev", status: "online", lastSeen: "Onlayndır", avatar: "MA", color: "bg-emerald-500", unread: 1, type: 'chat' },
    { id: 4, name: "ERP Geliştiricilər", lastMsg: "Yeni yeniləmə hazırdır.", time: "5 Fev", status: "online", lastSeen: "Kanal", avatar: "CH", color: "bg-indigo-600", unread: 12, type: 'channel' },
    { id: 5, name: "CoPilot AI", lastMsg: "Sizə necə kömək edə bilərəm?", time: "30 Yan", status: "online", lastSeen: "Süni İntellekt", avatar: "AI", color: "bg-gradient-to-br from-purple-600 to-blue-600", unread: 0, type: 'copilot' },
    { id: 6, name: "Aysel Kərimova", lastMsg: "Məlumatı göndərdim.", time: "30 Yan", status: "online", lastSeen: "Onlayndır", avatar: "AK", color: "bg-teal-500", unread: 0, type: 'chat' }
  ]);

  // Messages Mock Data
  const [allMessages, setAllMessages] = useState<any>({
    1: [
      { id: 1, text: "Salam, yeni sistemin testləri necə gedir?", time: "14:30", sender: "receiver", date: "Bugün" },
      { id: 2, text: "Salam! Hər şey qaydasındadı, bir neçə kiçik xəta tapdıq.", time: "14:35", sender: "sender", date: "Bugün" },
      { id: 3, text: "Yaxşı, sənədləri gözləyirəm.", time: "14:36", sender: "receiver", date: "Bugün" }
    ],
    2: [
      { id: 1, text: "Sabah saat 11:00-da görüşək?", time: "10:00", sender: "receiver", date: "Dünən" },
      { id: 2, text: "Təsdiq edirəm.", time: "10:15", sender: "sender", date: "Dünən" }
    ]
  });

  const chatMessages = useMemo(() => allMessages[activeChat] || [], [allMessages, activeChat]);
  const activeContact = useMemo(() => contacts.find(c => c.id === activeChat), [contacts, activeChat]);

  // Tab Filtering
  const filteredContacts = useMemo(() => {
    let list = contacts;
    if (activeTab === 'Channels') list = contacts.filter(c => c.type === 'channel');
    if (activeTab === 'CoPilot') list = contacts.filter(c => c.type === 'copilot');
    if (activeTab === 'Chats') list = contacts.filter(c => c.type === 'chat');
    
    return list.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [contacts, activeTab, searchQuery]);

  // Auto scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Video Call Simulation
  useEffect(() => {
    if (isCalling) {
      setCallStatus('Connecting...');
      const timer1 = setTimeout(() => setCallStatus('Ringing...'), 1500);
      const timer2 = setTimeout(() => setCallStatus('Incoming Video...'), 4000);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [isCalling]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const newMsg = {
        id: Date.now(),
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'sender',
        date: 'Bugün'
    };
    setAllMessages((prev: any) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), newMsg]
    }));
    setMessageText('');
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setMessageText(`[Fayl Qoşuldu: ${file.name}] `);
        }
    };
    input.click();
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl animate-in fade-in duration-700 font-sans italic-none relative">
      
      {/* 📞 VIDEO CALL MODAL */}
      {isCalling && (
        <div className="absolute inset-0 z-[100] bg-slate-900/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-in zoom-in duration-300">
           <div className="w-40 h-40 rounded-full border-4 border-blue-500 p-2 animate-pulse mb-8 relative">
              <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-black text-white ${activeContact?.color || 'bg-slate-500'}`}>
                 {activeContact?.avatar}
              </div>
           </div>
           <h2 className="text-2xl font-black text-white uppercase italic tracking-widest mb-2">{activeContact?.name}</h2>
           <p className="text-blue-400 font-black italic uppercase tracking-wider animate-bounce">{callStatus}</p>

           <div className="mt-16 flex items-center space-x-6">
              <button className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                 <MicOff className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsCalling(false)}
                className="w-20 h-20 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-all shadow-2xl shadow-rose-500/40 hover:scale-110 active:scale-95"
              >
                 <Phone className="w-8 h-8 rotate-[135deg]" />
              </button>
              <button className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                 <VideoOff className="w-6 h-6" />
              </button>
           </div>
        </div>
      )}

      {/* 📁 NEW CHAT MODAL */}
      {isNewChatModalOpen && (
        <div className="absolute inset-0 z-[90] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-10 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-[500px] rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-full">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">Yeni Söhbət Başlat</h2>
                 <button onClick={() => setIsNewChatModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"><X/></button>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
                 <input type="text" placeholder="İşçi və ya departament axtar..." className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-3 px-5 text-sm font-black italic outline-none shadow-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {contacts.map(c => (
                    <div key={c.id} onClick={() => { setActiveChat(c.id); setIsNewChatModalOpen(false); }} className="p-4 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center space-x-4 transition-all">
                       <div className={`w-10 h-10 rounded-full ${c.color} text-white flex items-center justify-center font-black text-xs`}>{c.avatar}</div>
                       <div className="font-black italic text-slate-700 dark:text-slate-200 uppercase text-xs tracking-tight">{c.name}</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* SIDEBAR (380px) */}
      <div className="w-[380px] bg-[#F3F6F8] dark:bg-[#1A1F26] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        
        {/* SIDEBAR TABS */}
        <div className="p-1.5 flex items-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar shadow-sm">
           {['Chats', 'Task chats', 'CoPilot', 'Collabs', 'Channels'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all shrink-0 ${activeTab === tab ? 'bg-[#E1F1FD] text-[#0067B0] dark:bg-blue-900/30' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                 {tab}
                 {tab === 'Chats' && <span className="ml-2 bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[8px]">3</span>}
              </button>
           ))}
        </div>

        {/* SEARCH & NEW */}
        <div className="p-4 flex items-center space-x-3">
           <div className="flex-1 relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Find employee or chat"
                className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-3 pl-11 pr-4 text-[11px] font-black italic shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all uppercase placeholder:text-slate-300 placeholder:italic-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setIsNewChatModalOpen(true)}
             className="w-10 h-10 bg-white dark:bg-slate-900 text-blue-500 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-all shadow-sm active:scale-95"
           >
              <Plus className="w-5 h-5 stroke-[3px]" />
           </button>
        </div>

        {/* CONTACT LIST */}
        <div className="flex-1 overflow-y-auto px-2 pb-6 custom-scrollbar">
           {filteredContacts.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`group p-4 rounded-[1.50rem] cursor-pointer transition-all mb-1 flex items-center space-x-4 border border-transparent ${
                   activeChat === contact.id 
                   ? 'bg-[#0091FF] text-white shadow-lg shadow-blue-500/20 active-chat-glow' 
                   : 'hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                 <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm shadow-inner transition-transform group-hover:scale-105 ${
                        activeChat === contact.id ? 'bg-white/20 text-white border border-white/30' : `${contact.color} text-white`
                    }`}>
                        {contact.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 ${
                        activeChat === contact.id ? 'border-[#0091FF]' : 'border-[#F3F6F8] dark:border-[#1A1F26]'
                    } ${
                       contact.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}></div>
                 </div>

                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                       <h4 className={`text-[12px] font-black uppercase tracking-tight italic truncate ${activeChat === contact.id ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                          {contact.name}
                       </h4>
                       <span className={`text-[9px] font-bold ${activeChat === contact.id ? 'text-white/60' : 'text-slate-400'}`}>
                          {contact.time}
                       </span>
                    </div>
                    <p className={`text-[10px] font-medium truncate ${activeChat === contact.id ? 'text-white/80' : 'text-slate-400'}`}>
                       {contact.lastMsg}
                    </p>
                 </div>

                 {contact.unread > 0 && activeChat !== contact.id && (
                    <div className="bg-[#0091FF] text-white rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-black shadow-md border border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                       {contact.unread}
                    </div>
                 )}
              </div>
           ))}
        </div>
      </div>

      {/* CHAT AREA (Flex 1) */}
      <div className="flex-1 flex flex-col bg-[#EBF0F5] dark:bg-[#0E1218] relative">
         <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

         {/* CHAT HEADER */}
         <div className="h-20 px-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-10 shadow-sm">
            <div className="flex items-center space-x-4">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-sm shadow-inner transition-transform hover:rotate-12 cursor-pointer ${activeContact?.color || 'bg-slate-400'}`}>
                   {activeContact?.avatar}
               </div>
               <div>
                  <h2 className="text-[14px] font-black text-slate-800 dark:text-white uppercase italic tracking-tighter cursor-pointer hover:text-blue-500 transition-colors">
                     {activeContact?.name}
                  </h2>
                  <div className="flex items-center space-x-2 text-[9px] font-bold text-slate-400 uppercase italic tracking-widest mt-0.5">
                     <span className={activeContact?.status === 'online' ? 'text-emerald-500' : ''}>
                        {activeContact?.lastSeen}
                     </span>
                     <span className="text-slate-300"> • User</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center space-x-3">
               <div className="flex items-center bg-[#0091FF] text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all overflow-hidden border border-blue-600">
                  <button onClick={() => setIsCalling(true)} className="flex items-center space-x-2 px-5 py-2.5 font-black text-[10px] uppercase tracking-widest italic border-r border-white/20 hover:bg-blue-600 transition-colors">
                     <Video className="w-3.5 h-3.5" />
                     <span>Video call</span>
                  </button>
                  <button className="px-3 py-2.5 hover:bg-blue-600 transition-colors">
                     <ChevronDown className="w-3.5 h-3.5" />
                  </button>
               </div>
               
               <button onClick={() => setIsNewChatModalOpen(true)} className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 rounded-xl transition-all"><Plus/></button>
               <button className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 rounded-xl transition-all"><SearchIcon/></button>
               <button className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 rounded-xl transition-all"><LayoutDashboard/></button>
            </div>
         </div>

         {/* MESSAGES LIST */}
         <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar z-10 scroll-smooth">
            <div className="flex justify-center">
               <span className="bg-slate-800/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">Tuesday, 3 March</span>
            </div>

            {chatMessages.map((msg: any) => (
               <div key={msg.id} className={`flex ${msg.sender === 'sender' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[70%] group flex flex-col ${msg.sender === 'sender' ? 'items-end' : 'items-start'}`}>
                     <div className={`p-5 px-6 rounded-[1.75rem] text-[13px] font-bold italic shadow-xl leading-relaxed relative ${
                        msg.sender === 'sender' 
                        ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 rounded-tr-none border-b-2 border-r-2 border-slate-200 dark:border-slate-700' 
                        : 'bg-[#C1E6FF]/70 backdrop-blur-md text-slate-800 rounded-tl-none border-b-2 border-l-2 border-blue-200'
                     }`}>
                        {msg.text}
                     </div>
                     <div className={`flex items-center mt-3 space-x-2 ${msg.sender === 'sender' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] font-bold text-slate-500 font-sans">{msg.time}</span>
                        {msg.sender === 'sender' && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* INPUT AREA */}
         <div className="p-8 pb-10 z-10 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/10 p-4 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
               <div className="flex items-end space-x-3">
                  <button onClick={handleFileUpload} className="p-3 text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">
                     <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <textarea 
                    placeholder="Type @ or + to mention a person, a chat or AI"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-[13px] font-bold italic text-slate-800 dark:text-white px-2 py-3 resize-none min-h-[50px] max-h-[150px] custom-scrollbar placeholder:text-slate-300 placeholder:italic-none"
                  />

                  <div className="flex items-center space-x-1 pb-1">
                     <button className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><LayoutDashboard/></button>
                     <button onClick={() => setMessageText(prev => prev + "😊")} className="p-3 text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><Smile/></button>
                     <button className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><Mic/></button>
                     <button 
                        onClick={handleSendMessage}
                        className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all shadow-xl group ml-2 ${
                           messageText.trim() ? 'bg-[#0091FF] text-white shadow-blue-500/30 scale-105 active:scale-95' : 'bg-slate-100 text-slate-300'
                        }`}
                     >
                        <Send className={`w-6 h-6 stroke-[2.5px] ${messageText.trim() ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''} transition-transform`} />
                     </button>
                  </div>
               </div>
            </div>
         </div>

      </div>

      <style>{`
        .active-chat-glow { box-shadow: 0 10px 30px -10px rgba(0, 145, 255, 0.4); }
        .italic-none { font-style: normal !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>

    </div>
  );
};

export default Chat;
