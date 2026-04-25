import { useState } from 'react';
import { 
  Search, Plus, Filter, MoreHorizontal,
  Briefcase, Star
} from 'lucide-react';

const ProjectList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    { id: 1, name: "ERP v2.0 Yenilənməsi", client: "Daxili Layihə", manager: "Fuad M.", start: "01 Mar", end: "15 Apr", progress: 80, status: "Aktiv", priority: "High" },
    { id: 2, name: "Müştəri Portalı", client: "Azercell", manager: "Aysel Q.", start: "10 Mar", end: "22 May", progress: 45, status: "Aktiv", priority: "Medium" },
    { id: 3, name: "Mobil Satış Tətbiqi", client: "Socar", manager: "Murad Ə.", start: "15 Mar", end: "10 Iyun", progress: 10, status: "Aktiv", priority: "High" },
    { id: 4, name: "Logistika Sistemi", client: "Pasha Travel", manager: "Leyla H.", start: "20 Feb", end: "30 Mar", progress: 95, status: "Review", priority: "High" },
    { id: 5, name: "HR Portal", client: "Kapital Bank", manager: "Kamran Q.", start: "05 Jan", end: "15 Feb", progress: 100, status: "Tamamlanıb", priority: "Low" },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">İdarəetmə</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Layihə Reyestri</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
              <Plus className="w-4 h-4" />
              <span>Yeni Layihə</span>
           </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Layihə adı və ya rəhbərə görə axtar..." 
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-black italic outline-none transition-all shadow-inner focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-3 px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100 dark:border-slate-700">
           <Filter className="w-4 h-4" />
           <span>Filtrlər</span>
        </button>
      </div>

      {/* PROJECTS GRID/LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {projects.map((proj) => (
           <div key={proj.id} className="group bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative overflow-hidden">
              <div className="flex items-start justify-between mb-8">
                 <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Briefcase className="w-8 h-8 stroke-[2.5px]" />
                 </div>
                 <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-slate-200 hover:text-amber-400 transition-colors" />
                    <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
                 </div>
              </div>

              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors truncate">{proj.name}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-8 tracking-wide">{proj.client}</p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Rəhbər</p>
                    <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase italic tracking-tight">{proj.manager}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Deadline</p>
                    <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase italic tracking-tight">{proj.end}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-black italic uppercase tracking-widest">
                    <span className="text-slate-400">Tərəqqi</span>
                    <span className="text-indigo-600">{proj.progress}%</span>
                 </div>
                 <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${proj.progress}%` }}>
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 border-dashed flex items-center justify-between">
                 <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                   proj.status === 'Tamamlanıb' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                 }`}>{proj.status}</span>
                 <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center font-black text-[9px]">U1</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center font-black text-[9px]">U2</div>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default ProjectList;
