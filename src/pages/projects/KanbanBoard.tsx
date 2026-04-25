import { useState } from 'react';
import { 
  Plus, MoreHorizontal, MessageSquare, 
  Paperclip, Clock,
  Filter, Search
} from 'lucide-react';

const KanbanBoard = () => {
  const [columns] = useState([
    { id: 'todo', title: 'Tapşırıqlar', items: [
      { id: 1, title: "UI Dizayn Yeniləməsi", desc: "Sidebar-ın premium rənglərə keçirilməsi.", tags: ["DESIGN", "NEW"], comments: 4, files: 2, priority: "HIGH", deadline: "30 Mar" },
      { id: 2, title: "API Sənədləşməsi", desc: "Swagger API sənədlərinin hazırlanması.", tags: ["DEV"], comments: 0, files: 1, priority: "MEDIUM", deadline: "02 Apr" },
    ]},
    { id: 'inprogress', title: 'İcra Olunur', items: [
      { id: 3, title: "BOM Modulunun Yazılması", desc: "İstehsalat resepturaları üçün CRUD.", tags: ["LOGIC"], comments: 12, files: 5, priority: "HIGH", deadline: "05 Apr" },
    ]},
    { id: 'review', title: 'Yoxlanışda', items: [
      { id: 4, title: "Test Ssenariləri", desc: "Qaimə və İnvoyslar üçün regresiya testləri.", tags: ["QA"], comments: 3, files: 0, priority: "LOW", deadline: "28 Mar" },
    ]},
    { id: 'done', title: 'Tamamlandı', items: [
      { id: 5, title: "Database Miqrasiyası", desc: "Köhnə sistemdən SQL bazasına köçürülmə.", tags: ["DB"], comments: 45, files: 3, priority: "MEDIUM", deadline: "25 Mar" },
    ]}
  ]);

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 h-[calc(100vh-140px)]">
      
      {/* KANBAN HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">İş Akışı</span>
          </div>
          <div className="flex items-center space-x-4">
             <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Kanban Lövhəsi</h1>
             <div className="flex -space-x-3">
                {[1,2,3,4].map(v => (
                  <div key={v} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 shadow-sm">U{v}</div>
                ))}
                <button className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-600 text-white flex items-center justify-center shadow-lg"><Plus className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tapşırıq axtar..." 
                className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 pl-12 pr-4 w-[240px] text-[10px] font-black italic outline-none shadow-inner"
              />
           </div>
           <button className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100 dark:border-slate-700"><Filter className="w-5 h-5"/></button>
        </div>
      </div>

      {/* KANBAN BOARD CONTENT */}
      <div className="flex-1 overflow-x-auto pb-8 flex space-x-8 custom-scrollbar">
        {columns.map((col) => (
          <div key={col.id} className="w-[350px] flex flex-col shrink-0">
             <div className="flex items-center justify-between mb-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
                <h3 className="text-[12px] font-black text-slate-800 dark:text-white uppercase italic tracking-widest flex items-center">
                   {col.title}
                   <span className="ml-3 px-2 py-0.5 bg-white dark:bg-slate-700 rounded-lg text-indigo-600 text-[10px] tabular-nums shadow-sm border border-slate-100 dark:border-slate-600 font-bold">{col.items.length}</span>
                </h3>
                <div className="flex items-center space-x-1">
                   <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Plus className="w-4 h-4" /></button>
                   <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
             </div>

             <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                {col.items.map((item) => (
                  <div key={item.id} className="group overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all cursor-pointer relative">
                     {/* Card Priority Bar */}
                     <div className={`absolute top-0 left-0 w-full h-1.5 ${
                       item.priority === 'HIGH' ? 'bg-rose-500' : 
                       item.priority === 'MEDIUM' ? 'bg-indigo-600' : 'bg-emerald-500'
                     }`}></div>

                     <div className="flex flex-wrap gap-2 mb-6 pt-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 text-[8px] font-black italic tracking-widest uppercase">{tag}</span>
                        ))}
                        <span className={`ml-auto px-3 py-1 rounded-lg text-[8px] font-black uppercase italic ${
                          item.priority === 'HIGH' ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'text-slate-400 bg-slate-50 dark:bg-slate-800'
                        }`}>{item.priority}</span>
                     </div>

                     <h4 className="text-[14px] font-black text-slate-800 dark:text-white uppercase italic tracking-tighter leading-tight mb-4 select-none group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                     <p className="text-[11px] font-medium text-slate-400 mb-8 leading-relaxed line-clamp-2">{item.desc}</p>

                     <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800 border-dashed">
                        <div className="flex items-center space-x-4">
                           <div className="flex items-center space-x-1.5 text-slate-400 group-hover:text-indigo-500 transition-colors">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-black tabular-nums">{item.comments}</span>
                           </div>
                           <div className="flex items-center space-x-1.5 text-slate-400 group-hover:text-indigo-500 transition-colors">
                              <Paperclip className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-black tabular-nums">{item.files}</span>
                           </div>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400">
                           <Clock className="w-4 h-4" />
                           <span className="text-[10px] font-black italic tabular-nums uppercase">{item.deadline}</span>
                        </div>
                     </div>
                  </div>
                ))}

                <button className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-300 hover:text-indigo-600 hover:border-indigo-400 transition-all group">
                   <Plus className="w-6 h-6 mb-2 group-hover:scale-125 transition-transform" />
                   <span className="text-[10px] font-black uppercase italic tracking-widest">Tapşırıq Əlavə Et</span>
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
