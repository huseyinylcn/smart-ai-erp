import { useState } from 'react';
import { 
  Plus, MoreHorizontal
} from 'lucide-react';

const ProductionJournal = () => {
  const [activeTab, setActiveTab] = useState('issues');

  const issues = [
    { id: 1, order: "WO-2026-001", material: "Plastik Granul", qty: "500 kq", date: "30 Mar", user: "Ramil M.", status: "Tamamlanıb" },
    { id: 2, order: "WO-2026-005", material: "Boyaq Maddəsi", qty: "20 L", date: "31 Mar", user: "Vüqar S.", status: "Anbarda Yoxdur" },
  ];

  const outputs = [
    { id: 1, order: "WO-2026-001", product: "Plastik Qab (5L)", qty: "2000 Ədəd", date: "30 Mar", quality: "98%", status: "Qəbul Edildi" },
    { id: 2, order: "WO-2026-002", product: "Plastik Qab (1L)", qty: "5000 Ədəd", date: "29 Mar", quality: "100%", status: "Anbara Giriş" },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">İstehsal Prosesi</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">İstehsal Jurnalı</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
              <Plus className="w-4 h-4" />
              <span>Yeni Giriş/Çıxış</span>
           </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
         <button 
           onClick={() => setActiveTab('issues')}
           className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'issues' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >Material Buraxılışı</button>
         <button 
           onClick={() => setActiveTab('outputs')}
           className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'outputs' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >İstehsal Nəticələri</button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-3">
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                  <th className="p-8">Work Order #</th>
                  <th className="p-8">{activeTab === 'issues' ? 'Material / Komponent' : 'Hazır Məhsul'}</th>
                  <th className="p-8 text-right">Miqdar</th>
                  <th className="p-8">{activeTab === 'issues' ? 'İcraçı' : 'Keyfiyyət %'}</th>
                  <th className="p-8">Tarix</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {(activeTab === 'issues' ? issues : outputs).map((row: any) => (
                 <tr key={row.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="p-8">
                       <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors">{row.order}</span>
                    </td>
                    <td className="p-8">
                       <span className="text-[11px] font-black text-slate-500 uppercase italic tracking-widest">{activeTab === 'issues' ? row.material : row.product}</span>
                    </td>
                    <td className="p-8 text-right font-black italic tabular-nums text-slate-800 dark:text-white">{row.qty}</td>
                    <td className="p-8">
                       <span className="text-[11px] font-black text-slate-400 uppercase italic">{activeTab === 'issues' ? row.user : row.quality}</span>
                    </td>
                    <td className="p-8 text-[11px] font-black text-slate-600 dark:text-slate-300 italic tabular-nums uppercase">{row.date}</td>
                    <td className="p-8">
                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                         ['Tamamlanıb', 'Qəbul Edildi', 'Anbara Giriş'].includes(row.status) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
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

export default ProductionJournal;
