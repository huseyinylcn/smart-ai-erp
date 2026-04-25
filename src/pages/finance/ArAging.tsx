import { 
  Download, 
  LayoutGrid,
  List
} from 'lucide-react';

const ArAging = () => {
  const agingData = [
    { client: "Azercell Telecom", total: 125000, current: 80000, "10d": 20000, "20d": 15000, "30d": 10000, "60d": 0, "90d": 0, "6m": 0, "1y": 0, forecast: "15 Apr" },
    { client: "Socar Marketing", total: 45000, current: 0, "10d": 0, "20d": 0, "30d": 5000, "60d": 15000, "90d": 25000, "6m": 0, "1y": 0, forecast: "20 Apr" },
    { client: "Pasha Holding", total: 280000, current: 200000, "10d": 50000, "20d": 30000, "30d": 0, "60d": 0, "90d": 0, "6m": 0, "1y": 0, forecast: "30 Apr" },
    { client: "Kapital Bank", total: 12000, current: 0, "10d": 0, "20d": 0, "30d": 0, "60d": 0, "90d": 0, "6m": 8000, "1y": 4000, forecast: "N/A" },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Likvidlik Analizi</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Debitor Borcları (Aging)</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100 dark:border-slate-700">
              <Download className="w-4 h-4" />
              <span>Hesabatı Çıxar</span>
           </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Cəmi Debitor</p>
            <h3 className="text-2xl font-black italic tabular-nums text-slate-800 dark:text-white">₼ 462,000</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-rose-500">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic mb-2">Gecikən (90+ gün)</p>
            <h3 className="text-2xl font-black italic tabular-nums text-rose-500 underline decoration-rose-200">₼ 29,000</h3>
         </div>
         <div className="bg-indigo-600 p-8 rounded-[3rem] shadow-xl shadow-indigo-500/20 text-white">
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest italic mb-2">Orta Gecikmə</p>
            <h3 className="text-2xl font-black italic tabular-nums">24 Gün</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic mb-2">Proqnoz Yığım (30d)</p>
            <h3 className="text-2xl font-black italic tabular-nums text-emerald-500">₼ 312,000</h3>
         </div>
      </div>

      {/* AGING TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto p-3">
         <div className="p-8 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Aging Hesabatı</h3>
            <div className="flex items-center space-x-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-inner border border-slate-100 dark:border-slate-700">
               <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 shadow-sm text-indigo-600"><LayoutGrid className="w-4 h-4" /></button>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400"><List className="w-4 h-4" /></button>
            </div>
         </div>
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                  <th className="p-6 sticky left-0 bg-white dark:bg-slate-900 z-10 w-[200px]">Müştəri Adı</th>
                  <th className="p-6 text-right">Cəmi</th>
                  <th className="p-6 text-right bg-slate-50/50 dark:bg-slate-800/30">Cari</th>
                  <th className="p-6 text-right">0-10 G</th>
                  <th className="p-6 text-right">11-20 G</th>
                  <th className="p-6 text-right">21-30 G</th>
                  <th className="p-6 text-right">31-60 G</th>
                  <th className="p-6 text-right">61-90 G</th>
                  <th className="p-6 text-right bg-rose-50/30 dark:bg-rose-900/10 text-rose-500">6ay+</th>
                  <th className="p-6 text-right bg-rose-50/50 dark:bg-rose-900/20 text-rose-600">1il+</th>
                  <th className="p-6 text-right border-l border-slate-100 dark:border-slate-800 bg-indigo-50/30 dark:bg-indigo-900/10">Proqnoz</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {agingData.map((row, i) => (
                 <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="p-6 sticky left-0 bg-white dark:bg-slate-900 z-10 font-black italic text-xs uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">{row.client}</td>
                    <td className="p-6 text-right font-black italic tabular-nums text-slate-800 dark:text-white">₼ {row.total.toLocaleString()}</td>
                    <td className="p-6 text-right font-black italic tabular-nums text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">{row.current.toLocaleString()}</td>
                    <td className="p-6 text-right font-black italic tabular-nums text-slate-400">{row["10d"].toLocaleString()}</td>
                    <td className="p-6 text-right font-black italic tabular-nums text-slate-400">{row["20d"].toLocaleString()}</td>
                    <td className="p-6 text-right font-black italic tabular-nums text-slate-400">{row["30d"].toLocaleString()}</td>
                    <td className="p-6 text-right font-black italic tabular-nums text-amber-500">{row["60d"].toLocaleString()}</td>
                    <td className="p-6 text-right font-black italic tabular-nums text-rose-400">{row["90d"].toLocaleString()}</td>
                    <td className="p-6 text-right font-black italic tabular-nums text-rose-500 bg-rose-50/30 dark:bg-rose-900/10">{row["6m"].toLocaleString()}</td>
                    <td className="p-6 text-right font-black italic tabular-nums text-rose-600 bg-rose-50/50 dark:bg-rose-900/20">{row["1y"].toLocaleString()}</td>
                    <td className="p-6 text-right border-l border-slate-100 dark:border-slate-800 bg-indigo-50/30 dark:bg-indigo-900/10">
                       <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-800 text-[9px] font-black text-indigo-600 uppercase italic shadow-sm">{row.forecast}</span>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

    </div>
  );
};

export default ArAging;
