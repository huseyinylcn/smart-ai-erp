import React, { useState } from 'react';
import { 
  Search, Plus, MoreVertical, 
  Monitor, Smartphone, ChevronDown,
  Mail, Phone, Clock, ShieldCheck,
  Check, X, Filter, Grid, List, 
  Settings as SettingsIcon, Menu
} from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Employees');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const usersData = [
    { 
      id: 1, name: "Elnur Allahverdiyev", role: "Primary administrator", 
      dept: "Bitrix", email: "elnur.a@bafco.az", phone: "", 
      lastActive: "06.04.2026, 16:27", mobileApp: "Android", desktopApp: "Windows",
      avatar: "EA", color: "bg-blue-500", status: "online"
    },
    { 
      id: 2, name: "Shamil Mammadov", role: "", 
      dept: "Bitrix", email: "shamil.m@bafco.az", phone: "", 
      lastActive: "03.04.2026, 18:01", mobileApp: "Not installed", desktopApp: "Not installed",
      avatar: "SM", color: "bg-slate-400", status: "offline"
    },
    { 
      id: 3, name: "Rasul Rasulov", role: "", 
      dept: "Bitrix", email: "rasul.r@bafco.az", phone: "", 
      lastActive: "06.04.2026, 16:27", mobileApp: "iOS", desktopApp: "Windows",
      avatar: "RR", color: "bg-emerald-500", status: "online"
    },
    { 
      id: 4, name: "Rubaba Tagiyeva", role: "", 
      dept: "Bitrix", email: "rubaba.t@bafco.az", phone: "", 
      lastActive: "06.04.2026, 16:27", mobileApp: "Not installed", desktopApp: "Windows",
      avatar: "RT", color: "bg-rose-500", status: "online"
    },
    { 
      id: 5, name: "Mirismayıl Qurbanlı", role: "", 
      dept: "Bitrix", email: "mirismayil.q@bafco.az", phone: "", 
      lastActive: "06.04.2026, 16:29", mobileApp: "Not installed", desktopApp: "Not installed",
      avatar: "MQ", color: "bg-indigo-500", status: "offline"
    },
    { 
      id: 6, name: "Əli Elyazov", role: "", 
      dept: "Bitrix", email: "ali.e@bafco.az", phone: "", 
      lastActive: "06.04.2026, 16:27", mobileApp: "Not installed", desktopApp: "Not installed",
      avatar: "AE", color: "bg-teal-500", status: "online"
    },
    { 
      id: 7, name: "Rufat Novruzaliyev", role: "", 
      dept: "Bitrix", email: "rufat.n@bafco.az", phone: "", 
      lastActive: "02.04.2026, 15:20", mobileApp: "Not installed", desktopApp: "Not installed",
      avatar: "RN", color: "bg-amber-500", status: "offline"
    },
    { 
      id: 8, name: "Aynura Hasanova", role: "Marketing manager", 
      dept: "Bitrix", email: "aynura.h@bafco.az", phone: "", 
      lastActive: "06.04.2026, 15:57", mobileApp: "Android", desktopApp: "Not installed",
      avatar: "AH", color: "bg-purple-500", status: "online"
    }
  ];

  const handleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === usersData.length) setSelectedIds([]);
    else setSelectedIds(usersData.map(u => u.id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F3F5] dark:bg-slate-950 font-sans italic-none">
      
      {/* BITRIX TABS HEADER */}
      <div className="bg-[#1A1F26] text-white/70 px-8 py-3 flex items-center space-x-6 border-b border-white/5">
        {['Employees', 'Company Structure', 'Time and reports', 'Video Conferencing', 'More'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg ${
              activeTab === tab ? 'bg-white/10 text-white' : 'hover:text-white'
            }`}
          >
            {tab}
            {tab.includes('reports') && <ChevronDown className="inline w-3 h-3 ml-1" />}
          </button>
        ))}
      </div>

      {/* ACTION BAR */}
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Find Employee</h1>
            
            {/* SEARCH BOX */}
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 px-4 py-2 w-[450px]">
               <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md mr-2">
                  <span className="text-[10px] font-bold text-slate-500">Added to company</span>
                  <X className="w-3 h-3 text-slate-400 cursor-pointer" />
               </div>
               <input 
                 type="text" 
                 placeholder="+ search" 
                 className="bg-transparent border-none outline-none text-xs font-bold italic flex-1"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
               <Search className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-500 hover:text-blue-500">
                <SettingsIcon className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="p-8 pt-0">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-6 w-12">
                   <input 
                     type="checkbox" 
                     className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                     checked={selectedIds.length === usersData.length}
                     onChange={handleSelectAll}
                   />
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest italic text-slate-400 flex items-center space-x-2">
                   <SettingsIcon className="w-3.5 h-3.5" />
                   <span>Employee</span>
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest italic text-slate-400">Department</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest italic text-slate-400">Email</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest italic text-slate-400">Mobile</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest italic text-slate-400">Date last active</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest italic text-slate-400">Mobile app</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest italic text-slate-400">Desktop app</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr 
                  key={user.id} 
                  className={`border-b border-slate-50 dark:border-slate-800 group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors ${
                    selectedIds.includes(user.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-5">
                     <div className="flex items-center space-x-4">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                          checked={selectedIds.includes(user.id)}
                          onChange={() => handleSelect(user.id)}
                        />
                        <Menu className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-slate-600" />
                     </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                       <div className="relative">
                          <div className={`w-10 h-10 rounded-full ${user.color} text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/10`}>
                             {user.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                            user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}></div>
                       </div>
                       <div>
                          <h4 className="text-[13px] font-black text-blue-500 cursor-pointer hover:underline decoration-2 transition-all leading-tight mb-0.5">{user.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic opacity-70 leading-none">{user.role}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[12px] font-semibold text-slate-600 dark:text-slate-300 italic">{user.dept}</td>
                  <td className="px-6 py-5 text-[12px] font-semibold text-blue-500 cursor-pointer hover:underline">{user.email}</td>
                  <td className="px-6 py-5 text-[12px] font-semibold text-slate-400 italic">{user.phone}</td>
                  <td className="px-6 py-5 text-[12px] font-semibold text-slate-500 dark:text-slate-400">{user.lastActive}</td>
                  <td className="px-6 py-5">
                     <div className={`flex items-center space-x-2 text-[11px] font-black uppercase italic ${user.mobileApp === 'Not installed' ? 'text-slate-300' : 'text-slate-600 dark:text-slate-200'}`}>
                        {user.mobileApp !== 'Not installed' && <Smartphone className={`w-3.5 h-3.5 ${user.mobileApp === 'Android' ? 'text-emerald-500' : 'text-blue-500'}`} />}
                        <span>{user.mobileApp}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center space-x-2 text-[11px] font-black uppercase italic ${user.desktopApp === 'Not installed' ? 'text-slate-300' : 'text-slate-600 dark:text-slate-200'}`}>
                        {user.desktopApp !== 'Not installed' && <Monitor className="w-3.5 h-3.5 text-blue-500" />}
                        <span>{user.desktopApp}</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-8 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between">
             <span className="text-[10px] font-black uppercase text-slate-400 italic">Showing {usersData.length} employees</span>
             <div className="flex items-center space-x-2">
                {/* Pagination placeholder */}
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .italic-none { font-style: normal !important; }
        input[type="checkbox"] {
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
        input[type="checkbox"]::before {
            content: "";
            width: 0.65em;
            height: 0.65em;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em #0091FF;
            clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        }
        input[type="checkbox"]:checked::before {
            transform: scale(1);
        }
      `}</style>
    </div>
  );
};

export default Users;
