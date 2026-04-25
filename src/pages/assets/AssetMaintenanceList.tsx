import { useState } from 'react';
import { 
  Plus, MoreHorizontal
} from 'lucide-react';

const AssetMaintenanceList = () => {
  const [activeTab, setActiveTab] = useState('maintenance');

  const maintenance = [
    { id: 1, asset: "Toyota Camry - 10-AB-001", type: "Təmir", date: "25 Mar", cost: "₼ 450", provider: "Auto Service MMC", status: "Tamamlanıb" },
    { id: 2, asset: "Generator Caterpillar 500kVA", type: "Profilaktika", date: "02 Apr", cost: "₼ 1,200", provider: "Energy Solutions", status: "Planlaşdırılıb" },
  ];

  const depreciation = [
    { id: 1, period: "Mart 2026", totalAssets: 145, amount: "₼ 12,800.50", method: "Xətti (Straight-line)", status: "Hesablanıb" },
    { id: 2, period: "Fevral 2026", totalAssets: 142, amount: "₼ 12,450.20", method: "Xətti (Straight-line)", status: "Hesablanıb" },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Aktivlərin İdarəedilməsi</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Təmir və Amortizasiya</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
              <Plus className="w-4 h-4" />
              <span>Yeni Əməliyyat</span>
           </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
         <button 
           onClick={() => setActiveTab('maintenance')}
           className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'maintenance' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >Təmir və Kapitallaşma</button>
         <button 
           onClick={() => setActiveTab('depreciation')}
           className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'depreciation' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >Amortizasiya Tarixçəsi</button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-3">
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                  <th className="p-8">{activeTab === 'maintenance' ? 'Vəsait (Asset)' : 'Dövr (Period)'}</th>
                  <th className="p-8">{activeTab === 'maintenance' ? 'Növ' : 'ƏV Sayı'}</th>
                  <th className="p-8 text-right">Məbləğ</th>
                  <th className="p-8">{activeTab === 'maintenance' ? 'İcraçı / Servis' : 'Metod'}</th>
                  <th className="p-8">Tarix / Durum</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {(activeTab === 'maintenance' ? maintenance : depreciation).map((row: any) => (
                 <tr key={row.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="p-8">
                       <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors">
                          {activeTab === 'maintenance' ? row.asset : row.period}
                       </span>
                    </td>
                    <td className="p-8">
                       <span className="text-[11px] font-black text-slate-500 uppercase italic tracking-widest">
                          {activeTab === 'maintenance' ? row.type : row.totalAssets}
                       </span>
                    </td>
                    <td className="p-8 text-right font-black italic tabular-nums text-slate-800 dark:text-white">{row.amount || row.cost}</td>
                    <td className="p-8">
                       <span className="text-[11px] font-black text-slate-400 uppercase italic">
                          {activeTab === 'maintenance' ? row.provider : row.method}
                       </span>
                    </td>
                    <td className="p-8 text-[11px] font-black text-slate-600 dark:text-slate-300 italic tabular-nums uppercase">
                       {activeTab === 'maintenance' ? row.date : "30-da Silinir"}
                    </td>
                    <td className="p-8">
                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                         ['Tamamlanıb', 'Hesablanıb'].includes(row.status) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                       }`}>{row.status}</span>
                    </td>
                    <td className="p-8 text-right">
                       <button className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-300 hover:text-indigo-600 transition-all"><MoreHorizontal className="w-5 h-5"/></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

    </div>
  );
};

export default AssetMaintenanceList;
