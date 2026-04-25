import { 
  CheckCircle2, Clock, 
  AlertCircle,
  Plus, Search,
  Calendar, Briefcase, Zap, Star
} from 'lucide-react';

const ProjectDashboard = () => {
  const stats = [
    { id: 1, name: "Aktiv Layihələr", value: "12", change: "+2", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
    { id: 2, name: "Tamamlanmış", value: "48", change: "+5", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { id: 3, name: "Gecikən Tapşırıqlar", value: "3", change: "-1", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/30" },
    { id: 4, name: "Ümumi İş Saatı", value: "1,240", change: "+120", icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30" },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Layihə Analitikası</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Layihə Dashboard</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
              <Plus className="w-4 h-4" />
              <span>Yeni Layihə</span>
           </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl w-fit mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-8 h-8 stroke-[2.5px]" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1 tracking-tighter">{stat.name}</p>
            <div className="flex items-end space-x-3">
               <h3 className="text-3xl font-black italic tabular-nums text-slate-800 dark:text-white">{stat.value}</h3>
               <span className={`text-[10px] font-bold italic mb-1 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.change}</span>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon className="w-24 h-24 rotate-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* ACTIVE PROJECTS LIST */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter tracking-wide">Aktiv Layihələr</h3>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400"><Search className="w-4 h-4" /></button>
           </div>
           
           <div className="space-y-6">
              {[
                { name: "Metal Konstruksiya Quraşdırma (Baku Port)", status: "80%", deadline: "15 Apr", priority: "HIGH", color: "bg-indigo-600" },
                { name: "Mərkəzi Anbar İnşası - Faza 2", status: "45%", deadline: "22 Apr", priority: "MEDIUM", color: "bg-emerald-500" },
                { name: "Panel Konstruksiya Tədarükü", status: "10%", deadline: "10 May", priority: "HIGH", color: "bg-amber-500" },
              ].map((proj, i) => (
                <div key={i} className="group p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                   <div className="flex items-start justify-between mb-5">
                      <div>
                         <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-1 select-none group-hover:text-indigo-600 transition-colors">{proj.name}</h4>
                         <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400 italic">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Deadline: {proj.deadline}</span>
                         </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest italic ${
                        proj.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                      }`}>{proj.priority}</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black italic uppercase text-slate-400">
                         <span>Tərəqqi</span>
                         <span>{proj.status}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                         <div className={`h-full rounded-full ${proj.color} shadow-lg`} style={{ width: proj.status }}></div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* TEAM ACTIVITIES */}
        <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
           <div className="relative z-10 h-full flex flex-col">
              <Zap className="w-12 h-12 mb-8 opacity-80" />
              <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-6 leading-tight">Yüksək Məhsuldarlıq!</h3>
              <p className="text-[14px] font-black opacity-80 uppercase italic tracking-widest leading-relaxed mb-10">Bu həftə komandanız 42 tapşırığı tamamlayıb. Bu, ötən həftəyə nisbətən 15% daha çoxdur.</p>
              
              <div className="space-y-4 mt-auto">
                 <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-md">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black italic">SƏ</div>
                       <div>
                          <p className="text-[11px] font-black uppercase italic tracking-tight">Sahil Əhmədli</p>
                          <p className="text-[9px] font-bold opacity-60 uppercase italic">TOP PERFORMANCE • 12 TASKS</p>
                       </div>
                       <Star className="w-4 h-4 text-amber-300 fill-amber-300 ml-auto" />
                    </div>
                 </div>
              </div>
           </div>
           <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDashboard;
