import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Search, Filter, 
  ChevronRight, AlignLeft, BarChart2,
  Clock, CheckCircle, ShieldAlert, X, Edit3, Settings
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const GanttChart = () => {
  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();

  // Mock Timeline Setting (30 Days of March 2026)
  const timelineDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const START_DATE = new Date(2026, 2, 1); // March 1, 2026

  const getDayOffset = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffTime = Math.abs(d.getTime() - START_DATE.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const getDuration = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // State
  const [tasks, setTasks] = useState([
    { id: 1, projectId: 101, projectName: "ERP İnteqrasiyası", title: "Sistem Analizi", assignee: "Fuad M.", startDate: "2026-03-01", endDate: "2026-03-05", progress: 100, status: 'done' },
    { id: 2, projectId: 101, projectName: "ERP İnteqrasiyası", title: "Verilənlər Bazasının Qurulması", assignee: "Kamran Q.", startDate: "2026-03-06", endDate: "2026-03-12", progress: 80, status: 'active' },
    { id: 3, projectId: 101, projectName: "ERP İnteqrasiyası", title: "API Backend Yazılması", assignee: "Murad E.", startDate: "2026-03-10", endDate: "2026-03-18", progress: 40, status: 'active' },
    { id: 4, projectId: 102, projectName: "WMS Yenilənməsi", title: "Cihaz İnteqrasiyası", assignee: "Aysel Q.", startDate: "2026-03-05", endDate: "2026-03-15", progress: 20, status: 'delay' },
    { id: 5, projectId: 102, projectName: "WMS Yenilənməsi", title: "Test və Yoxlama", assignee: "Kamran Q.", startDate: "2026-03-16", endDate: "2026-03-20", progress: 0, status: 'pending' },
    { id: 6, projectId: 103, projectName: "Mobil Tətbiq (HR)", title: "UI/UX Dizayn", assignee: "Vüsal T.", startDate: "2026-03-10", endDate: "2026-03-24", progress: 65, status: 'active' }
  ]);

  // Filters state
  const [searchProject, setSearchProject] = useState('');
  const [searchStatus, setSearchStatus] = useState('ALL');
  const [searchAssignee, setSearchAssignee] = useState('ALL');
  const [quickSearch, setQuickSearch] = useState('');

  // Selected Task
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey && e.code === 'KeyF') {
            e.preventDefault();
            setIsFilterSidebarOpen((prev: boolean) => !prev);
        }
        if (e.key === 'Escape') {
            setSelectedTask(null);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsFilterSidebarOpen]);

  // Sidebar Context Connection
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Layihəyə görə</label>
              <input 
                 type="text" 
                 value={searchProject}
                 onChange={(e) => setSearchProject(e.target.value)} 
                 placeholder="Məs: ERP..."
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Status üzrə</label>
              <select 
                 value={searchStatus}
                 onChange={(e) => setSearchStatus(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">HAMISI</option>
                  <option value="active">AKTİV (ACTIVE)</option>
                  <option value="delay">GECİKİR (DELAYED)</option>
                  <option value="done">BİTİB (DONE)</option>
                  <option value="pending">GÖZLƏYƏN (PENDING)</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Məsul Şəxs</label>
              <select 
                 value={searchAssignee}
                 onChange={(e) => setSearchAssignee(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">BÜTÜN ŞƏXSLƏR</option>
                  <option value="Fuad M.">Fuad M.</option>
                  <option value="Kamran Q.">Kamran Q.</option>
                  <option value="Murad E.">Murad E.</option>
                  <option value="Aysel Q.">Aysel Q.</option>
                  <option value="Vüsal T.">Vüsal T.</option>
              </select>
           </div>
           
           <div className="pt-6">
             <button 
               onClick={() => {
                 setSearchProject('');
                 setSearchStatus('ALL');
                 setSearchAssignee('ALL');
               }}
               className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 italic"
             >
               Filtrləri Sıfırla
             </button>
           </div>
        </div>
      );
    }
  }, [isFilterSidebarOpen, searchProject, searchStatus, searchAssignee, setFilterSidebarContent]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (quickSearch && !t.title.toLowerCase().includes(quickSearch.toLowerCase()) && !t.projectName.toLowerCase().includes(quickSearch.toLowerCase())) return false;
      if (searchProject && !t.projectName.toLowerCase().includes(searchProject.toLowerCase())) return false;
      if (searchStatus !== 'ALL' && t.status !== searchStatus) return false;
      if (searchAssignee !== 'ALL' && t.assignee !== searchAssignee) return false;
      return true;
    });
  }, [tasks, quickSearch, searchProject, searchStatus, searchAssignee]);

  const hasFilters = searchProject || searchStatus !== 'ALL' || searchAssignee !== 'ALL';

  const getStatusColor = (status: string) => {
     switch (status) {
        case 'done': return 'bg-emerald-500';
        case 'active': return 'bg-indigo-500';
        case 'delay': return 'bg-rose-500';
        default: return 'bg-slate-400';
     }
  };

  const getStatusIcon = (status: string) => {
     switch (status) {
        case 'done': return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
        case 'active': return <Clock className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />;
        case 'delay': return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
        default: return <AlignLeft className="w-3.5 h-3.5 text-slate-400" />;
     }
  };

  const handleUpdateSelectedTask = () => {
     if(!selectedTask) return;
     setTasks(tasks.map(t => t.id === selectedTask.id ? selectedTask : t));
     setSelectedTask(null);
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-sm">Projects / Gantt Chart</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Layihə Qrafiki (Gantt)</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-3">
             <div className="relative group shadow-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                   type="text" 
                   placeholder="Tapşırıq/Layihə..." 
                   value={quickSearch}
                   onChange={(e) => setQuickSearch(e.target.value)}
                   className="w-56 pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-black italic shadow-sm focus:border-indigo-500 outline-none uppercase transition-all"
                />
             </div>
             
             <button 
                 onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
                 className={`p-3.5 rounded-2xl shadow-sm transition-all border ${isFilterSidebarOpen || hasFilters ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-y-[-2px] border-indigo-600' : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200'}`}
                 title="Zəngin Süzgəc (Alt + F)"
             >
                 <Filter className="w-4 h-4 leading-none" />
             </button>
          </div>
        </div>
      </div>

      {hasFilters && (
         <div className="flex items-center space-x-3 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl text-[10px] uppercase font-black italic border border-indigo-100 shadow-sm transition-all animate-in zoom-in-95 overflow-x-auto">
             <Filter className="w-4 h-4 shrink-0" />
             <span className="shrink-0">Aktiv Süzgəclər:</span>
             {searchProject && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Layihə: {searchProject}</span>}
             {searchStatus !== 'ALL' && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Status: {searchStatus}</span>}
             {searchAssignee !== 'ALL' && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Şəxs: {searchAssignee}</span>}
             
             <button onClick={() => { 
                setSearchProject(''); setSearchStatus('ALL'); setSearchAssignee('ALL'); setIsFilterSidebarOpen(false); 
             }} className="ml-auto p-1.5 bg-indigo-200/50 rounded-xl hover:bg-indigo-300 transition-colors shrink-0">
               <X className="w-3.5 h-3.5"/>
             </button>
         </div>
      )}

      {/* GANTT CHART CANVAS */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[650px] relative">
         
         {/* HEADER ROWS */}
         <div className="flex border-b border-slate-100 dark:border-slate-800 shrink-0 sticky top-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-md z-20">
            {/* Left Panel Header */}
            <div className="w-[350px] shrink-0 border-r border-slate-200 dark:border-slate-800 p-5 flex items-center shadow-lg relative z-30 bg-white dark:bg-slate-900">
               <BarChart2 className="w-5 h-5 mr-3 text-indigo-500" />
               <span className="text-[11px] font-black uppercase tracking-widest italic tracking-tighter">Tapşırıq Strukturu (WBS)</span>
            </div>
            
            {/* Right Panel Header (Timeline Days) */}
            <div className="flex bg-slate-50 dark:bg-slate-800/30 overflow-hidden relative">
               <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 dark:from-slate-800/80 to-transparent z-10"></div>
               {timelineDays.map(day => (
                  <div key={day} className="w-[50px] shrink-0 border-r border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center py-2 h-full uppercase italic">
                     <span className="text-[9px] font-bold text-slate-400 mb-0.5">MAR</span>
                     <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">{day}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* BODY ROWS */}
         <div className="flex flex-1 overflow-auto custom-scrollbar relative">
             {/* Base Timeline Grid Background (Right side) */}
             <div className="absolute left-[350px] top-0 bottom-0 flex pointer-events-none z-0 border-r border-slate-100 dark:border-slate-800 h-full min-h-max" style={{ width: `${timelineDays.length * 50}px` }}>
                {timelineDays.map(day => (
                   <div key={`grid-${day}`} className={`w-[50px] h-full border-r border-slate-100 dark:border-slate-800/50 ${[6, 7, 13, 14, 20, 21, 27, 28].includes(day) ? 'bg-slate-50/70 dark:bg-slate-800/20' : ''}`}></div>
                ))}
             </div>

             <div className="flex flex-col w-full z-10 h-max">
                {filteredTasks.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest italic text-xs">Heç bir tapşırıq tapılmadı.</div>
                ) : (
                    filteredTasks.map((task) => {
                      const offsetDays = getDayOffset(task.startDate);
                      const durationDays = getDuration(task.startDate, task.endDate);
                      const leftPos = offsetDays * 50;
                      const widthPx = durationDays * 50;

                      return (
                         <div key={task.id} className="flex border-b border-slate-50 hover:bg-slate-50/50 dark:border-slate-800/30 dark:hover:bg-slate-800/30 group">
                            
                            {/* Left Panel (Frozen effectively due to structural flex layout matching) - We sync scroll via layout. 
                                Actually, truly frozen requires sticky. Let's make it sticky left-0 */}
                            <div className="w-[350px] shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-4 sticky left-0 z-20 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 transition-colors shadow-[2px_0_10px_rgba(0,0,0,0.02)] border-b border-b-slate-50 dark:border-b-slate-800/30">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center truncate">
                                        {getStatusIcon(task.status)}
                                        <span className="text-[13px] font-black italic ml-2 truncate text-slate-700 dark:text-slate-200">{task.title}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic truncate max-w-[150px]">{task.projectName}</span>
                                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[8px] font-black italic">
                                        {task.assignee}
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel (Timeline Space) */}
                            <div className="flex-1 relative min-w-max h-[76px]">
                                {/* The physical layout spans right. We render the bar absolute relative to its row container. */}
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 h-[34px] rounded-xl shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg flex items-center pr-2 group/bar overflow-hidden"
                                    style={{ 
                                        left: `${leftPos}px`, 
                                        width: `${Math.max(widthPx, 50)}px`, 
                                        backgroundColor: '#fff'
                                    }}
                                    onClick={() => setSelectedTask({...task})}
                                >
                                    {/* Progress Background */}
                                    <div className={`absolute left-0 top-0 bottom-0 opacity-20 ${getStatusColor(task.status)}`} style={{ width: '100%' }}></div>
                                    <div className={`absolute left-0 top-0 bottom-0 ${getStatusColor(task.status)} transition-all`} style={{ width: `${task.progress}%` }}></div>
                                    
                                    {/* Content */}
                                    <span className="relative z-10 text-[10px] font-black px-3 text-slate-700 drop-shadow-sm truncate mix-blend-plus-darker">
                                        {task.progress}%
                                    </span>

                                    {/* Edit Hint on Hover */}
                                    <div className="absolute right-2 opacity-0 group-hover/bar:opacity-100 transition-opacity z-10 bg-white/80 p-0.5 rounded shadow-sm">
                                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                                    </div>
                                </div>
                            </div>

                         </div>
                      );
                    })
                )}
             </div>
         </div>
      </div>

      {/* TASK DETAIL / EDIT MODAL */}
      {selectedTask && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedTask(null)}></div>
             
             <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
                <button onClick={() => setSelectedTask(null)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                   <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                   <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic pr-10">{selectedTask.title}</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">{selectedTask.projectName} | Mövcud Status: {selectedTask.status}</p>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">İrəliləyiş (Progress %)</label>
                       <div className="flex items-center space-x-3">
                           <input 
                             type="range" 
                             min="0" max="100" 
                             value={selectedTask.progress}
                             onChange={(e) => setSelectedTask({...selectedTask, progress: Number(e.target.value)})}
                             className="flex-1 accent-indigo-600"
                           />
                           <span className="w-10 text-right text-xs font-black italic tabular-nums">{selectedTask.progress}%</span>
                       </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Başlama Tarixi</label>
                            <input 
                              type="date" 
                              value={selectedTask.startDate}
                              onChange={(e) => setSelectedTask({...selectedTask, startDate: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-black italic outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Bitmə Tarixi</label>
                            <input 
                              type="date" 
                              value={selectedTask.endDate}
                              onChange={(e) => setSelectedTask({...selectedTask, endDate: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-black italic outline-none focus:border-indigo-500"
                            />
                        </div>
                   </div>

                   <div className="space-y-1">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</label>
                       <select 
                         value={selectedTask.status}
                         onChange={(e) => setSelectedTask({...selectedTask, status: e.target.value})}
                         className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-black italic outline-none focus:border-indigo-500 appearance-none"
                       >
                           <option value="active">AKTİV DÖVR</option>
                           <option value="delay">GECİKMİŞ VƏZİYYƏT</option>
                           <option value="done">TAM BİTİB</option>
                           <option value="pending">GÖZLƏYİR</option>
                       </select>
                   </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button onClick={handleUpdateSelectedTask} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all italic">
                       Yadda Saxla
                    </button>
                </div>
             </div>
         </div>
      )}

    </div>
  );
};

export default GanttChart;
