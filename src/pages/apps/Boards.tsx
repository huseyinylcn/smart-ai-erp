import React, { useState } from 'react';
import { 
  LayoutGrid, List, Grid, Search, Plus, 
  MoreHorizontal, ChevronDown, HardDrive, 
  Trash2, Filter, Settings, Bell, 
  Share2, ExternalLink, User, Globe, 
  FileText, Folder, Star, Clock, 
  MoreVertical, Cloud, Lock
} from 'lucide-react';

const Boards = () => {
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('boards');

  const topNavItems = [
    { id: 'feed', name: 'Feed' },
    { id: 'messenger', name: 'Messenger', count: 3 },
    { id: 'calendar', name: 'Calendar' },
    { id: 'documents', name: 'Documents' },
    { id: 'boards', name: 'Boards' },
    { id: 'drive', name: 'Drive' },
    { id: 'webmail', name: 'Webmail' }
  ];

  const viewModes = [
    { id: 'list', icon: List, label: 'List' },
    { id: 'grid', icon: LayoutGrid, label: 'Grid' },
    { id: 'tile', icon: Grid, label: 'Tile' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-40px)] bg-[#F3F6F9] dark:bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative">
      
      {/* SUB-HEADER (Collaborations Nav) */}
      <nav className="h-14 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 flex items-center px-10 space-x-8 shrink-0 z-20">
        {topNavItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative py-4 text-[12px] font-black uppercase tracking-widest italic transition-all ${
              activeTab === item.id 
              ? 'text-primary-600' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{item.name}</span>
              {item.count && (
                <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black not-italic">
                  {item.count}
                </span>
              )}
            </div>
            {activeTab === item.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full shadow-lg shadow-primary-500/50"></div>
            )}
          </button>
        ))}
      </nav>

      {/* ACTION BAR */}
      <div className="h-20 flex items-center justify-between px-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white italic tracking-tighter uppercase">
            Boards
          </h1>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center space-x-3">
             <Plus className="w-4 h-4 stroke-[3px]" />
             <span>Create</span>
          </button>
        </div>

        <div className="flex items-center space-x-6">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Filter and search..." 
                className="bg-white/80 dark:bg-slate-800 border-none rounded-xl pl-12 pr-6 py-2.5 text-[12px] font-bold italic w-80 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
              />
           </div>
           
           <div className="flex bg-white/80 dark:bg-slate-800 p-1 rounded-xl shadow-sm">
              {viewModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${
                    viewMode === mode.id 
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <mode.icon className="w-3.5 h-3.5" />
                  <span>{mode.label}</span>
                </button>
              ))}
           </div>

           <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-5 py-2 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase italic transition-all hover:bg-slate-200">
                 <HardDrive className="w-3.5 h-3.5" />
                 <span>My Drive</span>
              </button>
              <button className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary-500 transition-all"><Settings className="w-4 h-4" /></button>
              <button className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
           </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-10 overflow-hidden flex flex-col">
         
         {/* TABLE HEADER (Bitrix Style) */}
         <div className="bg-white/80 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-t-3xl overflow-hidden shrink-0 shadow-sm">
            <div className="grid grid-cols-12 gap-4 px-8 py-5">
               <div className="col-span-5 flex items-center space-x-4">
                  <div className="w-4 h-4 border-2 border-slate-200 rounded"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">File name</span>
               </div>
               <div className="col-span-2 flex items-center space-x-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Active</span>
                  <ChevronDown className="w-3 h-3 text-slate-300" />
               </div>
               <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase italic tracking-widest flex items-center">Created by</div>
               <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase italic tracking-widest flex items-center">Shared</div>
               <div className="col-span-1 text-[10px] font-black text-slate-400 uppercase italic tracking-widest flex items-center">Published</div>
            </div>
         </div>

         {/* MAIN LIST / EMPTY STATE */}
         <div className="flex-1 bg-white/60 dark:bg-slate-900/60 border-x border-b border-slate-100 dark:border-slate-800 rounded-b-3xl overflow-y-auto custom-scrollbar flex items-center justify-center">
            
            {/* EMPTY STATE ILLUSTRATION (Matched from screenshot) */}
            <div className="max-w-md text-center py-20 animate-in fade-in zoom-in-95 duration-700">
               <div className="relative w-48 h-48 mx-auto mb-10">
                  {/* Decorative Elements */}
                   <div className="absolute inset-0 bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                            <FileText className="w-8 h-8 text-primary-500" />
                         </div>
                         <div className="w-16 h-16 bg-primary-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
                            <Star className="w-8 h-8 text-white" />
                         </div>
                         <div className="w-16 h-16 bg-slate-800 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500">
                            <Folder className="w-8 h-8 text-amber-500" />
                         </div>
                         <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                            <Share2 className="w-8 h-8 text-emerald-500" />
                         </div>
                      </div>
                   </div>
                   {/* Floating Orbs */}
                   <div className="absolute top-0 right-0 w-4 h-4 bg-amber-400 rounded-full animate-bounce"></div>
                   <div className="absolute bottom-4 left-0 w-3 h-3 bg-primary-400 rounded-full animate-pulse"></div>
               </div>

               <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-4">
                  This screen will show your boards
               </h2>
               <p className="text-slate-400 text-sm font-medium italic mb-10 max-w-xs mx-auto">
                  Create, edit and share boards here. Start by clicking the create button.
               </p>
               
               <button className="inline-flex items-center space-x-3 text-primary-600 font-black text-xs uppercase italic tracking-widest hover:text-primary-700 transition-all">
                  <span>Learn more about Boards</span>
                  <ExternalLink className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
      `}</style>

    </div>
  );
};

export default Boards;
