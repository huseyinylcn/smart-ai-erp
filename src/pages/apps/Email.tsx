import React, { useState } from 'react';
import { 
  Inbox, Send, FileText, Trash2, 
  AlertCircle, Plus, Mail, Reply, Filter, 
  Link2, X, Globe, Shield, Download, 
  Send as SendIcon, Smile, Paperclip, MoreHorizontal,
  Archive, Flag, Maximize2, Minimize2, 
  CornerUpLeft, CornerUpRight, Trash,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const Email = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState(1);
  const [isComposing, setIsComposing] = useState(false);
  const [listType, setListType] = useState('Focused'); // Focused vs Other

  const providers = [
    { name: "Gmail", color: "text-red-500", icon: "G" },
    { name: "Outlook", color: "text-blue-600", icon: "O" },
    { name: "iCloud", color: "text-sky-400", icon: "☁️" },
    { name: "Office365", color: "text-orange-600", icon: "O3" },
    { name: "Exchange", color: "text-blue-700", icon: "E" },
    { name: "Yahoo!", color: "text-purple-600", icon: "Y!" },
    { name: "Aol", color: "text-sky-500", icon: "Aol" },
    { name: "Yandex", color: "text-red-600", icon: "Y" },
    { name: "Mail.ru", color: "text-orange-500", icon: "@" },
    { name: "Custom mailbox", color: "text-slate-500", icon: <Mail className="w-6 h-6" />, sub: "IMAP+SMTP" }
  ];

  const sidebarItems = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: 12 },
    { id: 'sent', name: 'Sent Items', icon: Send, count: 0 },
    { id: 'drafts', name: 'Drafts', icon: FileText, count: 5 },
    { id: 'archive', name: 'Archive', icon: Archive, count: 0 },
    { id: 'deleted', name: 'Deleted Items', icon: Trash2, count: 24 },
    { id: 'junk', name: 'Junk Email', icon: AlertCircle, count: 0 }
  ];

  const emails = [
    { 
      id: 1, sender: "Microsoft Azure", subject: "Your subscription requires attention", 
      preview: "Action Required: Review your Azure subscription status to ensure continued service...", 
      time: "10:45 AM", important: true, read: false, avatar: "AZ", color: "bg-[#0078d4]",
      date: "Tue 3/30/2026", type: "Focused"
    },
    { 
      id: 2, sender: "Sahil Aliyev", subject: "Project Update: HR Module Integration", 
      preview: "Hi team, I've completed the preliminary integration for the new HR module. Please review...", 
      time: "Yesterday", important: false, read: true, avatar: "SA", color: "bg-indigo-500",
      date: "Mon 3/29/2026", type: "Focused"
    },
    { 
      id: 3, sender: "GitHub", subject: "[GitHub] Security alert for smartagent-erp", 
      preview: "We found a potential security vulnerability in one of your dependencies...", 
      time: "Yesterday", important: true, read: true, avatar: "GH", color: "bg-slate-900",
      date: "Mon 3/29/2026", type: "Other"
    },
    { 
      id: 4, sender: "LinkedIn", subject: "You have 5 new notifications", 
      preview: "See who's viewed your profile and other updates from your network...", 
      time: "Sun", important: false, read: true, avatar: "LI", color: "bg-[#0077b5]",
      date: "Sun 3/28/2026", type: "Other"
    }
  ];

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  // --- CONNECT VIEW ---
  if (!isConnected) {
    return (
      <div className="relative min-h-screen bg-[#F3F2F1] dark:bg-slate-950 flex items-center justify-center p-8 rounded-[2rem] overflow-hidden">
        <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-16 animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-3xl font-black text-[#0078d4] flex items-center space-x-3 italic uppercase tracking-tighter">
               <Mail className="w-8 h-8" />
               <span>Outlook Integration</span>
            </h1>
            <X className="w-6 h-6 text-slate-300 cursor-pointer" onClick={() => setIsConnected(true)} />
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 italic tracking-tight">Add your account</h2>
            <p className="text-slate-400 text-lg font-medium italic">Select your email provider to get started</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {providers.map((p, idx) => (
              <div 
                key={idx}
                onClick={() => setIsConnected(true)}
                className="group cursor-pointer bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#0078d4]/30 active:scale-95"
              >
                <div className={`text-5xl font-black ${p.color} transition-transform group-hover:scale-110`}>
                   {p.icon}
                </div>
                <p className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em] italic text-center leading-tight">
                   {p.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-center space-x-12 opacity-40">
             <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest italic">
                <Shield className="w-4 h-4 text-[#0078d4]" />
                <span>Enterprise Grade Security</span>
             </div>
             <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest italic">
                <Globe className="w-4 h-4 text-[#0078d4]" />
                <span>Global Protocol Support</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- OUTLOOK VIEW ---
  return (
    <div className="flex h-[calc(100vh-40px)] bg-white dark:bg-slate-950 font-sans italic-none rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
      
      {/* 1. LEFT NAVIGATION */}
      <div className="w-[240px] bg-[#F3F2F1] dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col pt-8 shrink-0">
        <div className="px-6 mb-8">
           <button 
             onClick={() => setIsComposing(true)}
             className="w-full bg-[#0078d4] hover:bg-[#005a9e] text-white py-3 rounded-md font-bold text-xs flex items-center justify-center space-x-3 shadow-md transition-all active:scale-95"
           >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>New mail</span>
           </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto custom-scrollbar">
           {sidebarItems.map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center justify-between px-6 py-2.5 transition-all text-[11px] font-semibold ${
                 activeTab === item.id 
                 ? 'bg-white dark:bg-slate-800 text-[#0078d4] border-l-4 border-[#0078d4]' 
                 : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50'
               }`}
             >
               <div className="flex items-center space-x-4">
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'stroke-[2px]' : ''}`} />
                  <span className="italic">{item.name}</span>
               </div>
               {item.count > 0 && <span className="text-[10px] tabular-nums font-bold">{item.count}</span>}
             </button>
           ))}
           
           <div className="mt-8 px-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Groups</p>
              <button className="flex items-center space-x-4 text-slate-500 hover:text-slate-800 py-1 transition-all">
                 <div className="w-5 h-5 bg-emerald-500 rounded text-white flex items-center justify-center text-[8px] font-bold">SA</div>
                 <span className="text-[11px] font-semibold italic">SmartAgent Dev</span>
              </button>
           </div>
        </nav>
      </div>

      {/* 2. MIDDLE COLUMN */}
      <div className="w-[360px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="h-14 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
           <div className="flex items-center space-x-4">
              <button 
                onClick={() => setListType('Focused')}
                className={`text-[12px] font-black italic transition-all relative pb-0.5 ${
                  listType === 'Focused' ? 'text-[#0078d4]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Focused
                {listType === 'Focused' && <div className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-[#0078d4] rounded-full"></div>}
              </button>
              <button 
                onClick={() => setListType('Other')}
                className={`text-[12px] font-black italic transition-all relative pb-0.5 ${
                  listType === 'Other' ? 'text-[#0078d4]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Other
                {listType === 'Other' && <div className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-[#0078d4] rounded-full"></div>}
              </button>
           </div>
           <Filter className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {emails.filter(e => e.type === listType).map((email) => (
             <div 
               key={email.id}
               onClick={() => setSelectedEmailId(email.id)}
               className={`px-6 py-4 cursor-pointer border-b border-slate-50 dark:border-slate-800 relative transition-all group ${
                 selectedEmailId === email.id ? 'bg-[#F3F2F1] dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
               }`}
             >
               {!email.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0078d4]"></div>}
               
               <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-3 truncate">
                     <div className={`w-8 h-8 rounded-full ${email.color} text-white flex items-center justify-center font-bold text-[10px] shrink-0`}>
                        {email.avatar}
                     </div>
                     <span className={`text-[12px] italic transition-all truncate ${!email.read ? 'font-black text-slate-800 dark:text-white' : 'font-semibold text-slate-600 dark:text-slate-400'}`}>
                        {email.sender}
                     </span>
                  </div>
                  <span className={`text-[9px] font-bold shrink-0 ${!email.read ? 'text-[#0078d4]' : 'text-slate-400'}`}>{email.time}</span>
               </div>
               
               <h4 className={`text-[12px] italic truncate mb-1 pr-6 ${!email.read ? 'font-black text-slate-800 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                  {email.subject}
               </h4>
               <p className="text-[11px] font-medium text-slate-400 truncate italic pr-6 opacity-80">{email.preview}</p>

               {/* Hover Actions */}
               <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-inherit pl-2">
                  <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5"/></button>
                  <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-400 hover:text-[#0078d4]"><Archive className="w-3.5 h-3.5"/></button>
                  <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-400 hover:text-[#0078d4]"><Flag className="w-3.5 h-3.5"/></button>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* 3. RIGHT COLUMN */}
      <div className="flex-1 bg-white dark:bg-[#1A1F26] flex flex-col min-w-0">
        {selectedEmail ? (
          <>
            {/* Ribbon */}
            <div className="h-14 px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
               <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-[10px] font-black uppercase text-[#0078d4] italic tracking-widest hover:bg-blue-50 px-3 py-1.5 rounded transition-all">
                     <CornerUpLeft className="w-4 h-4" />
                     <span>Reply</span>
                  </button>
                  <button className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-500 italic tracking-widest hover:bg-slate-100 px-3 py-1.5 rounded transition-all">
                     <Reply className="w-4 h-4 rotate-180" />
                     <span>Reply all</span>
                  </button>
                  <button className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-500 italic tracking-widest hover:bg-slate-100 px-3 py-1.5 rounded transition-all">
                     <CornerUpRight className="w-4 h-4" />
                     <span>Forward</span>
                  </button>
                  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800"></div>
                  <button className="p-2 text-slate-400 hover:text-rose-500 transition-all"><Trash className="w-4 h-4"/></button>
                  <button className="p-2 text-slate-400 hover:text-[#0078d4] transition-all"><Archive className="w-4 h-4"/></button>
                  <button className="p-2 text-slate-400 hover:text-slate-800 transition-all"><MoreHorizontal className="w-4 h-4"/></button>
               </div>
               <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                     <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800"><ChevronLeft className="w-5 h-5"/></button>
                     <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800"><ChevronRight className="w-5 h-5"/></button>
                  </div>
               </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
               <div className="flex items-start justify-between mb-12">
                  <div className="flex items-start space-x-6">
                     <div className={`w-14 h-14 ${selectedEmail.color} rounded-full flex items-center justify-center text-white text-xl font-bold italic shadow-lg`}>
                        {selectedEmail.avatar}
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-1">{selectedEmail.sender}</h2>
                        <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-400 italic">
                           <span>To:</span>
                           <span className="text-[#0078d4] normal-case">me@smartagent.az</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[11px] font-bold text-slate-400 italic mb-1">{selectedEmail.date} {selectedEmail.time}</p>
                     {selectedEmail.important && <div className="inline-flex items-center space-x-1 text-rose-500 font-bold text-[9px] uppercase italic tracking-widest"><AlertCircle className="w-3 h-3"/><span>Important</span></div>}
                  </div>
               </div>

               <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-10 border-b border-slate-100 dark:border-slate-800 pb-6">
                  {selectedEmail.subject}
               </h1>

               <div className="text-[14px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic space-y-6 max-w-4xl">
                  <p>Dear Customer,</p>
                  <p>This is an automated notification from **Microsoft Azure Support**. We are contacting you regarding your current active subscription for **SmartAgent ERP Infrastructure**.</p>
                  <p className="pt-8">Kind regards,<br/><span className="text-[#0078d4] font-black uppercase tracking-widest text-[12px]">The Microsoft Azure Team</span></p>
               </div>

               <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Attachments (1)</p>
                  <div className="inline-flex items-center space-x-4 p-4 bg-[#F3F2F1] dark:bg-slate-800 rounded-lg group cursor-pointer hover:bg-slate-200 transition-all border border-transparent hover:border-slate-300">
                     <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded flex items-center justify-center text-[#ff3c00]">
                        <FileText className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[11px] font-bold text-slate-800 dark:text-white uppercase italic">Subscription_Report.pdf</p>
                        <p className="text-[10px] font-medium text-slate-400 italic">445 KB</p>
                     </div>
                     <Download className="w-4 h-4 text-slate-300 group-hover:text-[#0078d4] ml-4" />
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
             <div className="w-40 h-40 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <Mail className="w-16 h-16 text-slate-200" />
             </div>
             <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-300">Select an item to read</h3>
          </div>
        )}
      </div>

      {/* COMPOSE MODAL */}
      {isComposing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setIsComposing(false)}></div>
           <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
              <div className="bg-[#106ebe] px-6 py-3 flex items-center justify-between text-white">
                 <div className="flex items-center space-x-3">
                    <button className="text-xs font-black uppercase italic hover:bg-white/10 px-4 py-1.5 rounded transition-all">Send</button>
                    <button onClick={() => setIsComposing(false)} className="text-xs font-black uppercase italic hover:bg-white/10 px-4 py-1.5 rounded transition-all">Discard</button>
                 </div>
                 <div className="flex items-center space-x-3">
                    <button className="p-1.5 hover:bg-white/10 rounded"><Minimize2 className="w-4 h-4"/></button>
                    <button className="p-1.5 hover:bg-white/10 rounded"><Maximize2 className="w-4 h-4"/></button>
                    <button onClick={() => setIsComposing(false)} className="p-1.5 hover:bg-white/10 rounded"><X className="w-4 h-4"/></button>
                 </div>
              </div>

              <div className="p-8 space-y-4">
                 <div className="flex items-center border-b border-slate-100 dark:border-slate-800 py-3">
                    <div className="w-12 text-[10px] font-black text-slate-400 uppercase italic">To</div>
                    <input type="text" className="flex-1 bg-transparent border-none outline-none text-[12px] font-semibold italic text-slate-800 dark:text-white" />
                 </div>
                 <div className="flex items-center border-b border-slate-100 dark:border-slate-800 py-3">
                    <div className="w-12 text-[10px] font-black text-slate-400 uppercase italic">Subject</div>
                    <input type="text" className="flex-1 bg-transparent border-none outline-none text-[12px] font-semibold italic text-slate-800 dark:text-white" />
                 </div>
                 
                 <div className="h-[400px] mt-4 border border-slate-100 dark:border-slate-800 rounded p-6 bg-slate-50/50 dark:bg-slate-800/20">
                    <textarea 
                      placeholder="Type your message..."
                      className="w-full h-full bg-transparent border-none outline-none text-[13px] font-medium text-slate-700 dark:text-slate-300 italic resize-none"
                    ></textarea>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .italic-none { font-style: normal !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,120,212,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,120,212,0.2); }
      `}</style>

    </div>
  );
};

export default Email;
