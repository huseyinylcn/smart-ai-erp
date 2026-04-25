import { 
  TrendingUp, Zap, Award
} from 'lucide-react';

const TargetList = () => {

  // Simulation of Sales Targets/Performance
  const targets = [
    { id: 1, rep: "Fuad Məmmədov", target: 50000, current: 42500, type: "Monthly", period: "Mart 2026", status: "ON_TRACK" },
    { id: 2, rep: "Aysel Quliyeva", target: 35000, current: 38000, type: "Monthly", period: "Mart 2026", status: "ACHIEVED" },
    { id: 3, rep: "Murad Əliyev", target: 45000, current: 15000, type: "Monthly", period: "Mart 2026", status: "AT_RISK" },
    { id: 4, rep: "Kamran Qasımov", target: 120000, current: 45000, type: "Quarterly", period: "Q1 2026", status: "ON_TRACK" },
    { id: 5, rep: "Leyla Hüseynova", target: 40000, current: 8000, type: "Monthly", period: "Mart 2026", status: "BEHIND" },
  ];

  const getPercentage = (current: number, target: number) => Math.round((current / target) * 100);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACHIEVED': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 shadow-sm shadow-sm';
      case 'ON_TRACK': return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 shadow-sm shadow-sm shadow-sm';
      case 'AT_RISK': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 shadow-sm shadow-sm shadow-sm shadow-sm';
      case 'BEHIND': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm';
      default: return 'bg-slate-50 text-slate-500 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm';
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none shadow-sm shadow-sm shadow-sm">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 shadow-sm shadow-sm shadow-sm shadow-sm">
        <div>
          <div className="flex items-center space-x-3 mb-2 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Performans İdarəetməsi</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Satış Hədəfləri (Targets)</h1>
        </div>
        <div className="flex items-center space-x-3 shadow-sm shadow-sm shadow-sm">
           <button 
             onClick={() => {}}
             className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm"
           >
              <Zap className="w-4 h-4 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
              <span>Yeni Hədəf Təyin Et</span>
           </button>
        </div>
      </div>

      {/* TARGET METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
         <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
            <div className="flex items-center justify-between mb-8 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
               <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                  <Award className="w-8 h-8 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
               </div>
               <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" >Aktiv Ay</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 tracking-tighter shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">Toplanmış Ümumi Gəlir</p>
            <h3 className="text-4xl font-black italic tabular-nums text-slate-800 dark:text-white shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">₼ 284,500</h3>
            <div className="mt-6 flex items-center space-x-2 text-[10px] font-bold text-slate-400 italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
               <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
               <span>HƏDƏFİN 82%-İ TAMAMLANIB</span>
            </div>
         </div>
      </div>

      {/* PERFORMANCE LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
           {targets.map((item) => (
              <div key={item.id} className="group bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                 <div className="flex items-center justify-between mb-8 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                    <div className="flex items-center space-x-4 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                       <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                          {item.rep[0]}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">{item.rep}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">{item.type} | {item.period}</p>
                       </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm ${getStatusStyle(item.status)} shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm`}>
                       {item.status.replace('_', ' ')}
                    </span>
                 </div>

                 <div className="space-y-4 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                    <div className="flex justify-between items-end shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">İcraat</p>
                          <p className="text-lg font-black italic tabular-nums text-slate-800 dark:text-white shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">₼ {item.current.toLocaleString()}</p>
                       </div>
                       <div className="text-right shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">Hədəf</p>
                          <p className="text-lg font-black italic tabular-nums text-slate-400 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">₼ {item.target.toLocaleString()}</p>
                       </div>
                    </div>
                    
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                       <div 
                          className={`h-full rounded-full relative transition-all duration-1000 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm ${getPercentage(item.current, item.target) >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                          style={{ width: `${Math.min(getPercentage(item.current, item.target), 100)}%` }}
                       >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm"></div>
                       </div>
                    </div>
                    
                    <div className="flex justify-between text-[10px] font-black italic uppercase tracking-widest shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                       <span className="text-slate-400 shadow-sm shadow-sm">Tamamlanma</span>
                       <span className={getPercentage(item.current, item.target) >= 100 ? 'text-emerald-500' : 'text-indigo-600'}>
                          {getPercentage(item.current, item.target)}%
                       </span>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default TargetList;
