import { useState } from 'react';
import { 
  Plus, Search, Filter, MoreHorizontal,
  Truck, Clock, AlertCircle,
  CheckCircle2,
  LayoutGrid, List,
  BookOpen
} from 'lucide-react';
import JournalPreviewModal from '../../components/JournalPreviewModal';

const ApRegistry = () => {
  const [viewMode, setViewMode] = useState('list');
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  const [selectedAp, setSelectedAp] = useState<any>(null);

  const handleOpenJournal = (ap: any) => {
    setSelectedAp(ap);
    setIsJournalVisible(true);
  };

  const apData = [
    { id: 1, vendor: "Logistika Servis MMC", total: 45000, due: "05 Apr", status: "Gözləyir", priority: "High", invoice: "INV-2026-001" },
    { id: 2, vendor: "Global Enerji", total: 12500, due: "30 Mar", status: "Gecikib", priority: "Urgant", invoice: "INV-2026-045" },
    { id: 3, vendor: "Modern Design Group", total: 8400, due: "15 Apr", status: "Planlaşdırılıb", priority: "Medium", invoice: "INV-2026-012" },
    { id: 4, vendor: "Smart Tech MMC", total: 22000, due: "10 Apr", status: "Gözləyir", priority: "High", invoice: "INV-2026-033" },
    { id: 5, vendor: "Zəfər Marketing", total: 1500, due: "25 Mar", status: "Gecikib", priority: "Low", invoice: "INV-2025-999" },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Öhdəliklər (Payables)</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Kreditor Borcları</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
              <Plus className="w-4 h-4" />
              <span>Ödəniş Planı Yarat</span>
           </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-6">
               <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Clock className="w-6 h-6 stroke-[2.5px]" /></div>
               <span className="text-[10px] font-black text-slate-400 uppercase italic">Gözləyən</span>
            </div>
            <h3 className="text-2xl font-black italic tabular-nums text-slate-800 dark:text-white">₼ 67,000</h3>
         </div>
         <div className="bg-rose-500 p-8 rounded-[2.5rem] shadow-xl shadow-rose-500/20 text-white group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-6">
               <div className="p-4 bg-white/20 rounded-2xl"><AlertCircle className="w-6 h-6 stroke-[2.5px]" /></div>
               <span className="text-[10px] font-black opacity-70 uppercase italic">Gecikmə</span>
            </div>
            <h3 className="text-2xl font-black italic tabular-nums">₼ 14,000</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-6">
               <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 className="w-6 h-6 stroke-[2.5px]" /></div>
               <span className="text-[10px] font-black text-slate-400 uppercase italic">Tamamlanan (Bu Ay)</span>
            </div>
            <h3 className="text-2xl font-black italic tabular-nums text-slate-800 dark:text-white">₼ 122,800</h3>
         </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Təchizatçı və ya invoys üzrə axtar..." 
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-black italic outline-none transition-all shadow-inner"
          />
        </div>
        <div className="flex items-center space-x-2">
           <button className="flex items-center space-x-3 px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 dark:border-slate-700 italic">
              <Filter className="w-4 h-4" />
              <span>Filtrlər</span>
           </button>
           <div className="flex items-center p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 ml-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              ><LayoutGrid className="w-4 h-4" /></button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              ><List className="w-4 h-4" /></button>
           </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-3">
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                  <th className="p-8">Təchizatçı</th>
                  <th className="p-8">İnvoys #</th>
                  <th className="p-8">Son Tarix (Due)</th>
                  <th className="p-8 text-right">Borc Məbləği</th>
                  <th className="p-8">Prioritet</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Əməliyyat</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {apData.map((row) => (
                 <tr key={row.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="p-8">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><Truck className="w-5 h-5"/></div>
                          <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors">{row.vendor}</span>
                       </div>
                    </td>
                    <td className="p-8">
                       <span className="text-xs font-black text-slate-400 uppercase italic tabular-nums">{row.invoice}</span>
                    </td>
                    <td className="p-8 text-[11px] font-black text-slate-600 dark:text-slate-300 italic tabular-nums uppercase">{row.due}</td>
                    <td className="p-8 text-right">
                       <span className="text-sm font-black italic tabular-nums text-slate-800 dark:text-white">₼ {row.total.toLocaleString()}</span>
                    </td>
                    <td className="p-8">
                       <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest italic ${
                         row.priority === 'Urgant' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                       }`}>{row.priority}</span>
                    </td>
                    <td className="p-8">
                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                         row.status === 'Gecikib' ? 'bg-rose-50 text-rose-600' : 
                         row.status === 'Gözləyir' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                       }`}>{row.status}</span>
                    </td>
                    <td className="p-8 text-right flex items-center justify-end space-x-2">
                       <button 
                         onClick={() => handleOpenJournal(row)}
                         className="p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-500 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100"
                         title="Müxabirləşməyə Bax"
                       >
                         <BookOpen className="w-4.5 h-4.5"/>
                       </button>
                       <button className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-300 hover:text-indigo-600 transition-all"><MoreHorizontal className="w-5 h-5"/></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      <JournalPreviewModal 
          isOpen={isJournalVisible} 
          onClose={() => setIsJournalVisible(false)} 
          periodClosed={true} 
          isAdmin={true}
          initialLines={[
            { id: '1', accountCode: '211', accountName: 'Mallar / Materiallar', description: `Invoys ${selectedAp?.invoice} üzrə`, debit: selectedAp?.total || 0, credit: 0 },
            { id: '2', accountCode: '531', accountName: 'Təchizatçılara borclar', description: `Invoys ${selectedAp?.invoice} üzrə`, debit: 0, credit: selectedAp?.total || 0 }
          ]}
       />
    </div>
  );
};

export default ApRegistry;
