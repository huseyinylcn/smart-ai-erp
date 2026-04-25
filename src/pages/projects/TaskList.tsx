import React, { useState } from 'react';
import { 
  Plus, Search, ChevronDown, CheckCircle2, 
  Clock, MessageCircle, MoreHorizontal,
  Grid, List, Calendar as CalendarIcon, 
  BarChart2, Filter, Settings, Share2, 
  HelpCircle, MoreVertical, X, Check, ShieldCheck
} from 'lucide-react';

const TaskList = () => {
  const [activeMainTab, setActiveMainTab] = useState('Tasks');
  const [activeSubTab, setActiveSubTab] = useState('List');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const tasks = [
    { 
      id: 1, name: "Bitrix tapşırıqların izlənilməsi", 
      active: "2 April, 08:54", deadline: "1 May, 18:00", 
      createdBy: "Narmin Allahverdiyeva", assignee: "Narmin Allahverdiyeva",
      status: "In progress", color: "bg-emerald-500"
    },
    { 
      id: 2, name: "Qazaxlara birinci göndərişin packing listi", 
      active: "16 March, 21:24", deadline: "17 March, 19:00", 
      createdBy: "Elnur Allahverdiyev", assignee: "Sabina Shirinova",
      status: "Overdue", color: "bg-lime-500"
    },
    { 
      id: 3, name: "Purchase Order create and follow-up", 
      active: "10 March, 10:12", deadline: "8 March, 19:00", 
      createdBy: "Rasul Rasulov", assignee: "Mirismayıl Qurbanlı",
      status: "Alert", color: "bg-emerald-500"
    },
    { 
      id: 4, name: "RAF tiff və digər məhsullar", 
      active: "27 February, 15:20", deadline: "27 March, 19:00", 
      createdBy: "Elnur Allahverdiyev", assignee: "Rasul Rasulov",
      status: "Stable", color: "bg-emerald-500"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F3F5] dark:bg-slate-950 font-sans italic-none">
      
      {/* BITRIX MAIN TABS */}
      <div className="bg-[#1A1F26] text-white/70 px-8 py-3 flex items-center space-x-6 border-b border-white/5">
        <div className="flex items-center space-x-4">
           {['Tasks', 'Projects', 'Flows', 'Scrum', 'Efficiency', 'Analytics', 'Templates', 'Recycle Bin', 'More'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveMainTab(tab)}
               className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg relative ${
                 activeMainTab === tab ? 'bg-white/10 text-white' : 'hover:text-white'
               }`}
             >
               {tab}
               {tab === 'Tasks' && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] px-1 rounded-full border border-[#1A1F26]">42</span>}
               {tab === 'Efficiency' && <span className="block text-[8px] opacity-40 leading-none">50%</span>}
               {['Efficiency', 'Analytics', 'More'].includes(tab) && <ChevronDown className="inline w-3 h-3 ml-1" />}
             </button>
           ))}
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter flex items-center">
                 My tasks <ChevronDown className="w-5 h-5 ml-2 text-slate-400" />
              </h1>
              
              <div className="flex items-center bg-[#2FC062] rounded-lg overflow-hidden shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                 <button className="bg-[#2FC062] hover:bg-[#28A755] text-white px-6 py-2.5 flex items-center space-x-2 border-r border-white/10">
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    <span className="text-xs font-black uppercase italic tracking-widest">Create</span>
                 </button>
                 <button className="bg-[#2FC062] hover:bg-[#28A755] text-white px-3 py-2.5">
                    <ChevronDown className="w-4 h-4" />
                 </button>
              </div>

              <div className="flex items-center space-x-4">
                 <button className="bg-white/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg text-xs font-bold italic flex items-center space-x-2 shadow-sm">
                    <span className="text-slate-400">All roles</span>
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full">42</span>
                    <ChevronDown className="w-3 h-3 text-slate-300" />
                 </button>
              </div>
           </div>

           {/* SEARCH BAR */}
           <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 px-4 py-2 w-[500px]">
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md mr-3">
                 <span className="text-[10px] font-black uppercase text-slate-500 italic">In progress</span>
                 <X className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
              </div>
              <input 
                type="text" 
                placeholder="+ search" 
                className="bg-transparent border-none outline-none text-xs font-bold italic flex-1 placeholder:text-slate-300"
              />
              <Search className="w-4 h-4 text-slate-400" />
           </div>

           <div className="flex items-center space-x-2">
              <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-400 hover:text-slate-600"><Settings className="w-5 h-5"/></button>
              <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-400 hover:text-slate-600"><BarChart2 className="w-5 h-5"/></button>
           </div>
        </div>

        {/* SUB-TABS (LIST, GANTT, ETC) */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar">
           <div className="flex items-center space-x-6 border-b border-slate-200 dark:border-slate-800 flex-1">
              {['List', 'Deadline', 'Planner', 'Calendar', 'Gantt'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`pb-4 text-xs font-bold italic transition-all relative ${
                    activeSubTab === tab ? 'text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {activeSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 dark:bg-white rounded-full"></div>}
                </button>
              ))}
              
              <div className="flex items-center space-x-4 pl-4 pb-4">
                 <button className="flex items-center space-x-2 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase italic shadow-lg shadow-emerald-500/20">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>42 Task chats</span>
                 </button>
                 <button className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-800 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase italic">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                    <span>0 Overdue</span>
                 </button>
                 <button className="flex items-center space-x-2 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase italic shadow-lg shadow-emerald-500/20">
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">42</span>
                    <span>Comments</span>
                 </button>
                 <button className="text-[10px] font-black uppercase italic text-sky-600 hover:underline">Mark all as read</button>
              </div>
           </div>
           
           <div className="flex items-center space-x-4 ml-6 pb-4">
              <button className="text-[10px] font-black uppercase italic text-slate-500 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg hover:bg-white transition-all shadow-sm">Send feedback</button>
              <button className="flex items-center space-x-2 text-[10px] font-black uppercase italic text-slate-500 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg hover:bg-white transition-all shadow-sm">
                 <ShieldCheck className="w-3.5 h-3.5" />
                 <span>Automation rules</span>
              </button>
           </div>
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="px-8 pb-32">
         <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/30 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                     <th className="px-6 py-6 w-12">
                        <input type="checkbox" className="custom-checkbox w-4 h-4" />
                     </th>
                     <th className="px-4 py-6 w-10">
                        <Settings className="w-4 h-4 text-slate-300" />
                     </th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Name</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Active</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Deadline</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Created by</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Assignee</th>
                  </tr>
               </thead>
               <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-blue-50/10 dark:hover:bg-blue-900/5 transition-colors group">
                       <td className="px-6 py-8">
                          <input type="checkbox" className="custom-checkbox w-4 h-4" />
                       </td>
                       <td className="px-4 py-8">
                          <div className="flex flex-col space-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                             <div className="w-4 h-0.5 bg-slate-300 rounded-full"></div>
                             <div className="w-4 h-0.5 bg-slate-300 rounded-full"></div>
                             <div className="w-4 h-0.5 bg-slate-300 rounded-full"></div>
                          </div>
                       </td>
                       <td className="px-6 py-8">
                          <div>
                             <h4 className="text-[13px] font-black text-slate-800 dark:text-white uppercase italic tracking-tight hover:text-blue-500 cursor-pointer transition-colors leading-tight mb-1">{task.name}</h4>
                             {task.id === 1 && <span className="bg-slate-100 dark:bg-slate-800 text-slate-400 text-[8px] px-1 rounded font-bold">ERP v2.0</span>}
                          </div>
                       </td>
                       <td className="px-6 py-8">
                          <div className="flex items-center space-x-3">
                             <div className={`w-5 h-5 rounded-full ${task.color} text-white flex items-center justify-center font-black text-[9px] italic`}>{task.id}</div>
                             <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 italic">{task.active}</span>
                          </div>
                       </td>
                       <td className="px-6 py-8">
                          <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase italic tracking-widest w-fit shadow-sm ${
                            task.status === 'Overdue' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {task.deadline}
                          </div>
                       </td>
                       <td className="px-6 py-8">
                          <div className="flex items-center space-x-3 group/user cursor-pointer">
                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="w-full h-full bg-slate-200 animate-pulse"></div>
                             </div>
                             <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase italic group-hover/user:text-blue-500 transition-colors">{task.createdBy}</span>
                          </div>
                       </td>
                       <td className="px-6 py-8">
                          <div className="flex items-center space-x-3 group/user cursor-pointer">
                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="w-full h-full bg-blue-100 animate-pulse"></div>
                             </div>
                             <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase italic group-hover/user:text-blue-500 transition-colors">{task.assignee}</span>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
            
            {/* PAGINATION / FOOTER */}
            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
               <div className="flex items-center space-x-8 text-[9px] font-black uppercase italic text-slate-400 tracking-widest">
                  <div>SELECTED: <span className="text-slate-800 dark:text-slate-200">{selectedIds.length} / {tasks.length}</span></div>
                  <div>TOTAL: <span className="text-slate-800 dark:text-slate-200">SHOW</span></div>
               </div>
               <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-black uppercase italic text-slate-500 tracking-widest mr-4">PAGES: 1</span>
                  <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 space-x-4">
                     <span className="text-[10px] font-black uppercase text-slate-400 italic">RECORDS:</span>
                     <select className="bg-transparent border-none outline-none text-[10px] font-black italic text-slate-800 dark:text-white">
                        <option>50</option>
                        <option>100</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .italic-none { font-style: normal !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
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

export default TaskList;
