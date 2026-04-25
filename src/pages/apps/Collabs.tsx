import React, { useState } from 'react';
import { 
  MessageSquare, Users, Target, Video, 
  Briefcase, Search, Plus, X, 
  MoreHorizontal, Handshake, CheckCircle2, 
  Settings, Bell, Share2, ExternalLink,
  MessageCircle, Zap, ShieldCheck, 
  Layers, Headphones
} from 'lucide-react';

const Collabs = () => {
  const [activeTab, setActiveTab] = useState('collabs');

  const topNavItems = [
    { id: 'chats', name: 'Chats', count: 3 },
    { id: 'task-chats', name: 'Task chats', count: 42 },
    { id: 'copilot', name: 'CoPilot' },
    { id: 'collabs', name: 'Collabs' },
    { id: 'channels', name: 'Channels' },
    { id: 'contact-center', name: 'Contact Center' },
    { id: 'notifications', name: 'Notifications', count: 6 }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-40px)] bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative">
      
      {/* TOP NAVIGATION (Messenger Style) */}
      <nav className="h-14 bg-[#102d4d] dark:bg-slate-900 border-b border-white/5 flex items-center px-8 space-x-6 shrink-0 z-20 overflow-x-auto no-scrollbar">
        {topNavItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative py-4 text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              activeTab === item.id 
              ? 'text-white' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{item.name}</span>
              {item.count && (
                <span className="bg-rose-500 text-white text-[8px] px-1 py-0.5 rounded-full font-black">
                  {item.count}
                </span>
              )}
            </div>
            {activeTab === item.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-t-full shadow-lg"></div>
            )}
          </button>
        ))}
        <button className="text-slate-400 hover:text-white pb-0.5"><MoreHorizontal className="w-4 h-4" /></button>
      </nav>

      {/* MAIN CONTENT SPLIT VIEW */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT LIST PANEL */}
        <div className="w-[380px] border-r border-slate-100 dark:border-slate-800 flex flex-col shrink-0 bg-[#F8FAFC] dark:bg-slate-900/50">
           <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-8">
                 <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Collabs</h1>
                 <button className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center transition-all active:scale-95">
                    <Plus className="w-5 h-5 stroke-[3px]" />
                 </button>
              </div>

              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search collabs..." 
                   className="bg-white dark:bg-slate-800 border-none rounded-xl pl-12 pr-6 py-3 text-[12px] font-bold italic w-full focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                 />
              </div>
           </div>

           {/* Empty State List */}
           <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-40">
              <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 bg-primary-100/30 rounded-full animate-ping"></div>
                 <Search className="w-12 h-12 text-slate-200" />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase italic tracking-widest leading-relaxed">
                 This screen will show the collabs you're a member of.
              </p>
           </div>
        </div>

        {/* RIGHT PROMO PANEL (Premium Green) */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#A2D64A] to-[#6EB134] text-white p-12 lg:p-20 flex flex-col items-center justify-center relative">
           
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

           {/* Central Illustration / Info Cards */}
           <div className="max-w-3xl w-full relative z-10 text-center">
              
              <div className="mb-12 relative inline-block">
                 <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border border-white/30">
                    <Handshake className="w-16 h-16 text-white" />
                 </div>
                 {/* Floating Badges */}
                 <div className="absolute -top-4 -right-4 bg-white text-[#A2D64A] p-2.5 rounded-2xl shadow-xl animate-bounce">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter mb-8 leading-[0.9]">
                 Collab is a co-working space to collaborate with external teams and customers
              </h2>

              <div className="grid gap-8 text-left max-w-xl mx-auto mb-16">
                 
                 <div className="flex items-start space-x-6 group">
                    <div className="p-3 bg-white/20 rounded-2xl shadow-inner group-hover:bg-white/30 transition-all">
                       <Users className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-[14px] font-black uppercase italic mb-1">Communicate with outside teams</h4>
                       <p className="text-[12px] font-medium text-white/80 italic">Chats, video calls, meetings, tasks and files.</p>
                    </div>
                 </div>

                 <div className="flex items-start space-x-6 group">
                    <div className="p-3 bg-white/20 rounded-2xl shadow-inner group-hover:bg-white/30 transition-all">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-[14px] font-black uppercase italic mb-1">Strictly business</h4>
                       <p className="text-[12px] font-medium text-white/80 italic">Only business discussions with only the involved people: co-workers, contractors and customers.</p>
                    </div>
                 </div>

                 <div className="flex items-start space-x-6 group">
                    <div className="p-3 bg-white/20 rounded-2xl shadow-inner group-hover:bg-white/30 transition-all">
                       <Zap className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-[14px] font-black uppercase italic mb-1">Discussions always bring about result</h4>
                       <p className="text-[12px] font-medium text-white/80 italic">Create tasks from chat messages and track their progress.</p>
                    </div>
                 </div>

              </div>

              <button className="bg-white text-[#6EB134] px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                 Create Collab
              </button>
           </div>

           {/* Bottom Branding / Links */}
           <div className="absolute bottom-12 flex items-center space-x-8 opacity-60 hover:opacity-100 transition-opacity">
              <button className="flex items-center space-x-2 text-[10px] font-black uppercase italic tracking-widest">
                 <Headphones className="w-4 h-4" />
                 <span>Support</span>
              </button>
              <button className="flex items-center space-x-2 text-[10px] font-black uppercase italic tracking-widest">
                 <Settings className="w-4 h-4" />
                 <span>Settings</span>
              </button>
           </div>

        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </div>
  );
};

export default Collabs;
