import { useState } from 'react';
import { 
  Target, BarChart3, AlertCircle, Save, CheckCircle2, Lock, 
  RotateCcw, ShieldCheck, RefreshCcw, Loader2, Search, Filter, Trash2
} from 'lucide-react';

type DocumentStatus = 'DRAFT' | 'APPROVED' | 'LOCKED';

interface EmployeeKpi {
  id: number;
  name: string;
  pos: string;
  baseSalary: number;
  kpiTarget: number;
  kpiActual: number;
}

const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

const KpiList = () => {
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>('DRAFT');
  
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<EmployeeKpi[]>([]);

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setEmployees([
        { id: 1, name: "Emin Quliyev", pos: "Senior UI/UX", baseSalary: 2500, kpiTarget: 100, kpiActual: 0 },
        { id: 2, name: "Leyla Məmmədova", pos: "HR Specialist", baseSalary: 1200, kpiTarget: 100, kpiActual: 0 },
        { id: 3, name: "Anar Abbasov", pos: "Chief Accountant", baseSalary: 3500, kpiTarget: 100, kpiActual: 0 },
        { id: 4, name: "Nigar Əliyeva", pos: "Marketing Lead", baseSalary: 1800, kpiTarget: 100, kpiActual: 0 },
        { id: 5, name: "Səbinə Kərimova", pos: "FE Developer", baseSalary: 4200, kpiTarget: 100, kpiActual: 0 },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    if (window.confirm("Bütün məlumatı təmizləməyə əminsiniz?")) {
      setEmployees([]);
    }
  };

  const handleApplyKPI = (id: number, val: number) => {
    if (documentStatus !== 'DRAFT') return;
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, kpiActual: val } : emp));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const changeStatus = (newStatus: DocumentStatus) => {
    setIsLoading(true);
    setTimeout(() => {
      setDocumentStatus(newStatus);
      setIsLoading(false);
    }, 800);
  };

  const avgKpi = employees.length > 0 
    ? (employees.reduce((acc, curr) => acc + curr.kpiActual, 0) / employees.length).toFixed(1)
    : "0.0";

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-700 pb-24 text-slate-800 dark:text-slate-100 font-sans max-w-[100vw] overflow-hidden">
      
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic flex items-center gap-3">
              <span className="bg-indigo-500 text-white p-2 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"><Target className="w-8 h-8" /></span>
              İşçi <span className="font-light not-italic text-indigo-500">Performansı (KPİ)</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 translate-x-14">Performance Management System</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Cari Dövr</span>
              <div className="text-xl font-black text-slate-700 dark:text-white flex items-center gap-2 mt-1 uppercase italic tracking-tight">
                  <span className="text-indigo-500">{months[selectedMonth-1]}</span> {selectedYear}
              </div>
            </div>
            {documentStatus !== 'DRAFT' && (
              <div className={`px-6 py-3 rounded-2xl flex items-center gap-2 border-2 ${
                documentStatus === 'LOCKED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-900/30' : 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-900/30'
              }`}>
                {documentStatus === 'LOCKED' ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                <span className="text-[11px] font-black uppercase tracking-widest">{documentStatus === 'LOCKED' ? 'KİLİDLİ' : 'TƏSDİQLƏNİB'}</span>
              </div>
            )}
          </div>
      </div>

      {documentStatus === 'DRAFT' && employees.length === 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 p-4 rounded-2xl mx-4 flex items-center gap-3 text-amber-700 dark:text-amber-500 font-bold text-[11px] uppercase tracking-wider animate-in fade-in duration-500 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>Diqqət: İşçilərin performans reytinqləri hələ formalaşdırılmayıb. "Formalaşdır" düyməsi ilə sistemdən çəkə bilərsiniz.</span>
          </div>
      )}

      {/* ACTION BAR */}
      <div className="mx-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-10 py-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-indigo-50/20 dark:from-indigo-900/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-wrap items-center gap-4 z-10 w-full">
               <div className="flex items-center gap-2 mr-auto">
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))} 
                    disabled={documentStatus !== 'DRAFT'}
                    className="bg-white dark:bg-slate-800 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm outline-none transition-all disabled:opacity-50"
                  >
                      {[2026, 2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(Number(e.target.value))} 
                    disabled={documentStatus !== 'DRAFT'}
                    className="bg-white dark:bg-slate-800 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm outline-none transition-all disabled:opacity-50"
                  >
                     {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                  </select>
               </div>

               <div className="flex flex-wrap gap-4">
                  {/* STAGE: DRAFT */}
                  {documentStatus === 'DRAFT' && (
                    <>
                      {employees.length === 0 ? (
                        <button 
                          onClick={handleGenerate}
                          disabled={isLoading}
                          className="flex items-center px-6 py-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl italic leading-none"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />} Formalaşdır
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={handleClear}
                            disabled={isLoading}
                            className="flex items-center px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all italic leading-none"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Təmizlə
                          </button>
                          <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center px-6 py-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl italic leading-none"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Yadda Saxla
                          </button>
                          <button 
                            onClick={() => changeStatus('APPROVED')}
                            disabled={isLoading}
                            className="flex items-center border-2 border-slate-200 dark:border-slate-700 text-slate-400 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all italic leading-none"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Təsdiqlə
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {/* STAGE: APPROVED */}
                  {documentStatus === 'APPROVED' && (
                    <>
                      <button 
                        onClick={() => changeStatus('DRAFT')}
                        disabled={isLoading}
                        className="flex items-center px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl italic leading-none bg-white dark:bg-slate-800 border-2 border-rose-100 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      >
                        <RotateCcw className="w-4 h-4 mr-3" /> Təsdiqi ləğv et
                      </button>
                      <button 
                        onClick={() => changeStatus('LOCKED')}
                        disabled={isLoading}
                        className="flex items-center px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 italic leading-none bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105"
                      >
                        <Lock className="w-4 h-4 mr-3" /> Jurnala Köçür (Kilidlə)
                      </button>
                    </>
                  )}

                  {/* STAGE: LOCKED */}
                  {documentStatus === 'LOCKED' && (
                     <button 
                        onClick={() => changeStatus('APPROVED')}
                        disabled={isLoading}
                        className="flex items-center px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl italic leading-none bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:scale-105"
                      >
                       <ShieldCheck className="w-4 h-4 mr-3" /> Mühasibat Kilidini Aç (Ləğv Et)
                     </button>
                  )}
               </div>
          </div>
      </div>

      {employees.length > 0 && (
        <>
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-xl">
                     <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase italic">+2.5% vs Keçən Ay</span>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Orta KPI Göstəricisi</p>
               <h3 className="text-2xl font-black italic">{avgKpi}%</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-indigo-500">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-xl">
                     <Target className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase italic">Minimum Hədəf 85%</span>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Hədəfə çatan işçilər (≥ 85%)</p>
               <h3 className="text-2xl font-black italic">{employees.filter(e => e.kpiActual >= 85).length} Nəfər</h3>
            </div>
          </div>

          {/* KPI LIST TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm mx-4">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
               <div className="relative w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="İşçi axtar..." 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200"
                  />
               </div>
               <button className="flex items-center space-x-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Filter className="w-4 h-4" />
                  <span>Filtrlər</span>
               </button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                     <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic">İşçi</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic text-center">Əsas Maaş</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic text-center">Hədəf KPI (%)</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic text-center">Faiz Dəyəri (%)</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase italic text-center">Baza Faktiki KPİ (%)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {employees.map(emp => (
                        <tr key={emp.id} className={`transition-all ${documentStatus !== 'DRAFT' ? 'opacity-80 bg-slate-50/30 dark:bg-slate-900/50' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}>
                           <td className="px-8 py-6">
                              <div className="flex items-center space-x-4">
                                 <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-black text-xs">
                                    {emp.name.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-slate-800 dark:text-white italic">{emp.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase italic">{emp.pos}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-center tabular-nums">
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 italic">{emp.baseSalary.toLocaleString()}</span>
                           </td>
                           <td className="px-8 py-6 text-center tabular-nums">
                              <span className="text-xs font-black text-slate-400 italic">{emp.kpiTarget}%</span>
                           </td>
                           <td className="px-8 py-6 text-center">
                              <input 
                                type="number"
                                value={emp.kpiActual}
                                onChange={(e) => handleApplyKPI(emp.id, Number(e.target.value))}
                                disabled={documentStatus !== 'DRAFT'}
                                className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-black text-center italic ring-2 ring-transparent focus:ring-indigo-500/20 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200"
                              />
                           </td>
                           <td className="px-8 py-6 text-center">
                              <span className={`inline-flex px-4 py-2 rounded-xl text-[10px] font-black tabular-nums transition-colors ${
                                emp.kpiActual >= 85 
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-500' 
                                  : (emp.kpiActual > 0 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500' : 'bg-slate-100 text-slate-400 dark:bg-slate-800')
                              }`}>
                                {emp.kpiActual.toFixed(1)}%
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default KpiList;
