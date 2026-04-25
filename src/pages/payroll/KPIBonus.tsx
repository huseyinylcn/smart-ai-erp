import { useState } from 'react';
import { 
  Trophy, TrendingUp, CheckCircle2, 
  Search, Filter, Save, AlertCircle,
  User, DollarSign, Percent, BarChart3
} from 'lucide-react';

const KPIBonus = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Emin Quliyev", pos: "Senior UI/UX", baseSalary: 2500, kpiPercent: 95, bonus: 500, status: 'APPROVED' },
    { id: 2, name: "Leyla Məmmədova", pos: "HR Specialist", baseSalary: 1200, kpiPercent: 88, bonus: 150, status: 'PENDING' },
    { id: 3, name: "Anar Abbasov", pos: "Chief Accountant", baseSalary: 3500, kpiPercent: 100, bonus: 700, status: 'PENDING' },
    { id: 4, name: "Nigar Əliyeva", pos: "Marketing Lead", baseSalary: 1800, kpiPercent: 92, bonus: 250, status: 'APPROVED' },
    { id: 5, name: "Səbinə Kərimova", pos: "FE Developer", baseSalary: 4200, kpiPercent: 98, bonus: 850, status: 'PENDING' },
  ]);

  const [month] = useState('Mart 2026');

  const handleApplyBonus = (id: number, val: number) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, bonus: val } : emp));
  };

  const handleApprove = (id: number) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: 'APPROVED' } : emp));
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-24 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-amber-500 text-white rounded-[2rem] shadow-xl shadow-amber-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">Performance Management</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{month} KPI Hesablanması</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">KPI & Bonus Mükafatları</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all active:scale-95 italic">
              <Save className="w-4 h-4" />
              <span>Dəyişiklikləri Yadda Saxla</span>
           </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase italic">+12.5% vs Keçən Ay</span>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Cəmi Bonus Fond</p>
           <h3 className="text-2xl font-black italic">₼ 2,450.00</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-amber-500">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
                 <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-amber-500 uppercase italic">3 İşçi Gözləyir</span>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Təsdiqlənmə Statusu</p>
           <h3 className="text-2xl font-black italic">Gözləmədə</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-emerald-500">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                 <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase italic">94% Ümumi</span>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Orta KPI Göstəricisi</p>
           <h3 className="text-2xl font-black italic">Əla Nəticə</h3>
        </div>
      </div>

      {/* KPI LIST TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
           <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="İşçi axtar..." 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all"
              />
           </div>
           <button className="flex items-center space-x-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Filter className="w-4 h-4" />
              <span>Filtrlər</span>
           </button>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic">İşçi</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic text-center">Əsas Maaş</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic text-center">KPI Performans</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic text-center">Bonus Məbləği (₼)</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic text-center">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic text-right">Fəaliyyət</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                 {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full flex items-center justify-center font-black text-xs">
                                {emp.name.charAt(0)}
                             </div>
                             <div>
                                <p className="text-xs font-black text-slate-800 dark:text-white italic">{emp.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase italic">{emp.pos}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-center tabular-nums">
                          <span className="text-xs font-bold text-slate-500 italic">₼ {emp.baseSalary.toLocaleString()}</span>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <div className="flex items-center justify-center space-x-2">
                             <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${emp.kpiPercent >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${emp.kpiPercent}%` }}></div>
                             </div>
                             <span className="text-[10px] font-black italic">{emp.kpiPercent}%</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <input 
                            type="number"
                            value={emp.bonus}
                            onChange={(e) => handleApplyBonus(emp.id, Number(e.target.value))}
                            className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-black text-center italic ring-2 ring-transparent focus:ring-amber-500/20 transition-all outline-none"
                          />
                       </td>
                       <td className="px-8 py-6 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest ${
                            emp.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                             {emp.status === 'APPROVED' ? 'Təsdiqləndi' : 'Gözləmədə'}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          {emp.status === 'PENDING' ? (
                            <button 
                              onClick={() => handleApprove(emp.id)}
                              className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              title="Təsdiqlə"
                            >
                               <CheckCircle2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl cursor-not-allowed">
                               <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

    </div>
  );
};

export default KPIBonus;
