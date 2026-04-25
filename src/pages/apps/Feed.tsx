import React, { useState } from 'react';
import { 
  MessageSquare, Calendar, BarChart2, FileText, MoreHorizontal,
  ThumbsUp, MessageCircle, Share2, Eye, Plus, ChevronRight,
  Monitor, Smartphone, Download, CheckCircle, Info, Send,
  Paperclip, Smile, Camera, MapPin
} from 'lucide-react';

const Feed = () => {
  const [postText, setPostText] = useState('');
  const [activeTab, setActiveTab] = useState('MESSAGE');

  const feedItems = [
    {
      id: 1,
      user: "Bitrix24",
      avatar: "B",
      time: "3 March 14:36",
      content: "A new employee has been added",
      subContent: {
        name: "Narmin Allahverdiyeva",
        avatar: "NA",
        details: "User added to the team"
      },
      likes: 12,
      comments: 3,
      views: 45
    },
    {
      id: 2,
      user: "Narmin Allahverdiyeva",
      avatar: "NA",
      time: "3 March 16:20",
      content: "Hey everyone! Glad to be part of the team. Looking forward to working together on the upcoming ERP updates. 😊",
      likes: 24,
      comments: 5,
      views: 89
    }
  ];

  const tasks = [
    { name: "Ongoing", count: 0, color: "text-blue-500" },
    { name: "Assisting", count: 1, color: "text-emerald-500" },
    { name: "Set by me", count: 0, color: "text-slate-400" },
    { name: "Following", count: 0, color: "text-slate-400" }
  ];

  return (
    <div className="min-h-screen bg-[#F0F3F5] dark:bg-slate-950 p-4 font-sans italic-none">
      <div className="max-w-[1600px] mx-auto flex space-x-6">
        {/* CENTRAL COLUMN (FEED) */}
        <div className="flex-1 space-y-6">
        
        {/* POST CREATION AREA */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center space-x-8 px-8 pt-6 border-b border-slate-50 dark:border-slate-800">
            {['MESSAGE', 'EVENT', 'POLL', 'FILE', 'MORE'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-black tracking-widest uppercase italic transition-all relative ${
                  activeTab === tab ? 'text-blue-500' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-8">
            <textarea 
              placeholder="Send message ..."
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-6 text-sm font-bold italic outline-none min-h-[120px] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                 <button className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-all"><Paperclip className="w-5 h-5"/></button>
                 <button className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-all"><Smile className="w-5 h-5"/></button>
                 <button className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-all"><BarChart2 className="w-5 h-5"/></button>
              </div>
              <button className="bg-blue-500 text-white px-10 py-3.5 rounded-2xl font-black italic uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center space-x-2">
                 <span>Send</span>
                 <Send className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* FEED HEADER */}
        <div className="flex items-center justify-between px-2">
           <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">Feed</h2>
           <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 px-4 py-2 w-72">
              <input type="text" placeholder="Filter and search" className="bg-transparent border-none outline-none text-xs font-bold italic w-full" />
              <button className="text-slate-400"><Plus className="w-4 h-4"/></button>
           </div>
        </div>

        {/* FEED ITEMS */}
        {feedItems.map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-500/20">{item.avatar}</div>
                      <div>
                         <h3 className="text-sm font-black text-blue-500 dark:text-blue-400 uppercase italic tracking-tight mb-0.5">{item.user}</h3>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span>
                      </div>
                   </div>
                   <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreHorizontal className="w-4 h-4"/></button>
                   </div>
                </div>

                <div className="text-[15px] font-bold text-slate-700 dark:text-slate-200 leading-relaxed mb-6 italic">
                   {item.content}
                </div>

                {item.subContent && (
                  <div className="bg-[#F8FBFE] dark:bg-blue-900/10 border border-blue-50 dark:border-blue-900/20 rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer hover:bg-blue-50 transition-all">
                     <div className="flex items-center space-x-5">
                         <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center font-black text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                            {item.subContent.avatar}
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-blue-600 uppercase italic tracking-tighter">{item.subContent.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400">{item.subContent.details}</p>
                         </div>
                     </div>
                     <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                        <Info className="w-5 h-5" />
                     </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                   <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2 text-[10px] font-black uppercase italic text-slate-400 hover:text-blue-500 transition-colors">
                         <ThumbsUp className="w-4 h-4" />
                         <span>Like</span>
                      </button>
                      <button className="flex items-center space-x-2 text-[10px] font-black uppercase italic text-slate-400 hover:text-blue-500 transition-colors">
                         <MessageCircle className="w-4 h-4" />
                         <span>Comment</span>
                      </button>
                      <button className="flex items-center space-x-2 text-[10px] font-black uppercase italic text-slate-400 hover:text-blue-500 transition-colors">
                         <Share2 className="w-4 h-4" />
                         <span>Unfollow</span>
                      </button>
                   </div>
                   <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-[9px] font-bold text-slate-400">
                         <Eye className="w-3.5 h-3.5" />
                         <span>{item.views}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Comment Space */}
             <div className="px-8 pb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center space-x-4 border border-transparent focus-within:border-blue-100 transition-all">
                   <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100 dark:border-slate-700">YU</div>
                   <input type="text" placeholder="Add comment" className="flex-1 bg-transparent border-none outline-none text-xs font-bold italic" />
                </div>
             </div>
          </div>
        ))}

        <div className="h-20"></div>
      </div>

      {/* RIGHT SIDEBAR (340px) */}
      <div className="w-[340px] space-y-6 shrink-0">
        
        {/* User Stats Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center">
           <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                 <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-50 dark:text-slate-800" />
                 <circle cx="64" cy="64" r="60" stroke="#0091FF" strokeWidth="6" fill="transparent" strokeDasharray="377" strokeDashoffset="310" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-slate-800 dark:text-white italic tracking-tighter">9</div>
           </div>
           
           <div className="flex justify-center -space-x-3 mb-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden shadow-sm">
                   {i === 6 ? "+2" : <div className={`w-full h-full bg-slate-200 animate-pulse`}></div>}
                </div>
              ))}
           </div>
           
           <button className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 text-[10px] font-black uppercase italic tracking-widest text-[#0067B0] transition-all">Details View</button>
        </div>

        {/* Tasks Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[12px] font-black uppercase tracking-widest italic text-slate-800 dark:text-white">My Tasks</h3>
              <button className="text-blue-500 hover:scale-110 transition-transform"><Plus className="w-4 h-4 pointer-events-none"/></button>
           </div>
           <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.name} className="flex items-center justify-between group cursor-pointer">
                   <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors italic">{task.name}</span>
                   <span className={`text-sm font-black italic ${task.color}`}>{task.count}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Downloads Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
           <h3 className="text-[12px] font-black uppercase tracking-widest italic text-slate-800 dark:text-white mb-8">Download application</h3>
           <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { name: "Mac OS", icon: Monitor, color: "bg-slate-800" },
                { name: "Windows", icon: Download, color: "bg-blue-500" },
                { name: "Linux", icon: Info, color: "bg-amber-500" },
                { name: "iOS", icon: Smartphone, color: "bg-indigo-600" },
                { name: "Android", icon: Monitor, color: "bg-emerald-500" }
              ].map(app => (
                <div key={app.name} className="group cursor-pointer">
                   <div className={`w-12 h-12 mx-auto rounded-xl ${app.color} text-white flex items-center justify-center mb-2 shadow-lg shadow-${app.color.split('-')[1]}-200/50 group-hover:scale-110 transition-transform`}>
                      <app.icon className="w-6 h-6 stroke-[2.5px]"/>
                   </div>
                   <span className="text-[9px] font-black uppercase italic tracking-tighter text-slate-500">{app.name}</span>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>

      <style>{`
        .italic-none { font-style: normal !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Feed;
