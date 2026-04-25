import React, { useState } from 'react';
import { 
  Plus, Search, Folder, Globe, Lock, 
  Users, ChevronDown, MoreVertical,
  X, Filter, Info, CheckCircle, MessageCircle
} from 'lucide-react';

const Workgroups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const workgroups = [
    { 
      id: 1, name: "Təmiz şəhər", createdOn: "14 March, 08:56", 
      privacy: "Public", lastUpdated: "14 March, 08:56", 
      members: 4, role: "Join", iconColor: "text-blue-500" 
    }
  ];

  const stats = [
    { label: "Overdue", count: 0, type: "red" },
    { label: "Communications", count: 0, type: "blue" },
    { label: "Overdue", count: 0, type: "red" },
    { label: "Communications", count: 0, type: "blue" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F3F5] dark:bg-slate-950 font-sans italic-none">
      
      {/* HEADER SECTION */}
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Workgroups and projects</h1>
              <button className="bg-[#2FC062] hover:bg-[#28A755] text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                 <Plus className="w-5 h-5 stroke-[3px]" />
                 <span className="text-xs font-black uppercase italic tracking-widest">Create</span>
              </button>
           </div>

           {/* SEARCH BAR */}
           <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 px-4 py-2 w-[500px]">
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md mr-3">
                 <span className="text-[10px] font-black uppercase text-slate-500 italic">Active</span>
                 <X className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
              </div>
              <input 
                type="text" 
                placeholder="+ search" 
                className="bg-transparent border-none outline-none text-xs font-bold italic flex-1 placeholder:text-slate-300"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-400" />
           </div>
        </div>

        {/* STATS COUNTERS BAR */}
        <div className="flex items-center space-x-4 mb-8 bg-[#F8FBFE] dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 w-fit">
           {stats.map((stat, idx) => (
             <div key={idx} className="flex items-center space-x-3 px-6 py-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${stat.type === 'red' ? 'bg-rose-500' : 'bg-blue-500'}`}>
                   {stat.count}
                </div>
                <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                   {stat.label}
                </span>
             </div>
           ))}
           <div className="px-4 border-l border-slate-200 dark:border-slate-700 ml-2">
              <MessageCircle className="w-5 h-5 text-slate-300 hover:text-blue-500 cursor-pointer" />
           </div>
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="px-8 pb-32">
         <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/30 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                     <th className="px-8 py-6 w-12">
                        <input type="checkbox" className="custom-checkbox w-4 h-4" />
                     </th>
                     <th className="px-4 py-6 w-10">
                        <Filter className="w-4 h-4 text-slate-300" />
                     </th>
                     <th className="px-4 py-6 w-12 text-[10px] font-black uppercase text-slate-400 italic tracking-widest">ID</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Name</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest text-center">Created on</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest text-center">Privacy type</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest text-center">Last updated on</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest text-center">View members</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest text-center">Role</th>
                  </tr>
               </thead>
               <tbody>
                  {workgroups.map((group) => (
                    <tr key={group.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors group">
                       <td className="px-8 py-5">
                          <input type="checkbox" className="custom-checkbox w-4 h-4" />
                       </td>
                       <td className="px-4 py-5 text-center">
                          <div className="flex flex-col space-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-4 h-0.5 bg-slate-300 rounded-full"></div>
                             <div className="w-4 h-0.5 bg-slate-300 rounded-full"></div>
                             <div className="w-4 h-0.5 bg-slate-300 rounded-full"></div>
                          </div>
                       </td>
                       <td className="px-4 py-5 text-[12px] font-black text-slate-300 italic">{group.id}</td>
                       <td className="px-6 py-5">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100/50 dark:border-blue-800/50">
                                <Folder className="w-5 h-5 fill-current opacity-80" />
                             </div>
                             <span className="text-[14px] font-black text-slate-700 dark:text-slate-200 uppercase italic hover:text-blue-500 transition-colors cursor-pointer tracking-tight">
                                {group.name}
                             </span>
                          </div>
                       </td>
                       <td className="px-6 py-5 text-[12px] font-semibold text-slate-500 dark:text-slate-400 text-center italic">{group.createdOn}</td>
                       <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase italic text-slate-500 tracking-widest">
                             <Globe className="w-3 h-3" />
                             <span>{group.privacy}</span>
                          </span>
                       </td>
                       <td className="px-6 py-5 text-[12px] font-semibold text-slate-500 dark:text-slate-400 text-center italic">{group.lastUpdated}</td>
                       <td className="px-6 py-5 text-center">
                          <div className="flex justify-center">
                             <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-[#E1F1FD] flex items-center justify-center text-blue-600 shadow-sm hover:scale-110 transition-transform cursor-pointer">
                                <Users className="w-5 h-5" />
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-5 text-center">
                          <button className="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-[#0091FF] hover:text-white text-[#0067B0] dark:text-blue-400 rounded-full text-[10px] font-black uppercase italic tracking-widest transition-all shadow-sm border border-blue-100/30 dark:border-blue-800/30">
                             {group.role}
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
            
            {/* PAGINATION / FOOTER */}
            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
               <div className="flex items-center space-x-8 text-[9px] font-black uppercase italic text-slate-400 tracking-widest">
                  <div>Selected: <span className="text-slate-800 dark:text-slate-200">{selectedIds.length} / {workgroups.length}</span></div>
                  <div>Total: <span className="text-slate-800 dark:text-slate-200">{workgroups.length}</span></div>
               </div>
               <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-black uppercase italic text-slate-500 tracking-widest mr-4">Pages: 1</span>
                  <button className="p-2 text-slate-300 cursor-not-allowed"><ChevronDown className="w-5 h-5 rotate-90" /></button>
                  <button className="p-2 text-slate-100 cursor-not-allowed font-black uppercase italic tracking-widest text-[10px]">Previous</button>
                  <button className="p-2 text-slate-800 dark:text-white font-black uppercase italic tracking-widest text-[10px]">Next</button>
                  <button className="p-2 text-slate-800 dark:text-white"><ChevronDown className="w-5 h-5 -rotate-90" /></button>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .italic-none { font-style: normal !important; }
        .custom-checkbox {
            -webkit-appearance: none;
            appearance: none;
            background-color: #fff;
            margin: 0;
            font: inherit;
            color: #0091FF;
            width: 1.15em;
            height: 1.15em;
            border: 0.15em solid #CBD5E1;
            border-radius: 0.15em;
            transform: translateY(-0.075em);
            display: grid;
            place-content: center;
            cursor: pointer;
        }
        .custom-checkbox::before {
            content: "";
            width: 0.65em;
            height: 0.65em;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em #0091FF;
            clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        }
        .custom-checkbox:checked::before {
            transform: scale(1);
        }
      `}</style>

    </div>
  );
};

export default Workgroups;
