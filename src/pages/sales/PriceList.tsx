import { useState } from 'react';
import { 
  Tag, Search, Plus, Filter, 
  MoreHorizontal, Percent, 
  ChevronRight, DollarSign, ListFilter,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PriceList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation of Price Lists
  const priceLists = [
    { id: 1, name: "Standart Satış Qiyməti", type: "Base", currency: "AZN", items: 450, status: "ACTIVE", lastUpdate: "20 Fev 2026", discount: "0%" },
    { id: 2, name: "VİP Müştəri Qrupu", type: "Customer Specific", currency: "AZN", items: 450, status: "ACTIVE", lastUpdate: "01 Mart 2026", discount: "15%" },
    { id: 3, name: "Topdan Satış - Regionlar", type: "Regional", currency: "AZN", items: 120, status: "DRAFT", lastUpdate: "02 Mart 2026", discount: "Var" },
    { id: 4, name: "İxrac Qiymət Siyahısı", type: "Export", currency: "USD", items: 85, status: "ACTIVE", lastUpdate: "03 Mart 2026", discount: "0%" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 shadow-sm';
      case 'DRAFT': return 'bg-slate-50 text-slate-500 dark:bg-slate-800/20 shadow-sm';
      default: return 'bg-slate-50 text-slate-600 shadow-sm shadow-sm';
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none shadow-sm shadow-sm">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 shadow-sm shadow-sm shadow-sm">
        <div>
          <div className="flex items-center space-x-3 mb-2 shadow-sm shadow-sm shadow-sm shadow-sm">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Qiymət Siyasəti və Endirimlər</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Qiymət Siyahıları</h1>
        </div>
        <div className="flex items-center space-x-3 shadow-sm shadow-sm shadow-sm">
           <button 
             onClick={() => navigate('/sales/pricelist/create')}
             className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic shadow-sm shadow-sm shadow-sm"
           >
              <Plus className="w-4 h-4 shadow-sm shadow-sm" />
              <span>Yeni Siyahı</span>
           </button>
        </div>
      </div>

      {/* QUICK INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm shadow-sm">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-6 shadow-sm shadow-sm">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-sm shadow-sm shadow-sm">
               <DollarSign className="w-7 h-7 shadow-sm shadow-sm shadow-sm" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1 tracking-tighter shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">Əsas Valyuta</p>
               <h4 className="text-xl font-black italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">AZN (₼)</h4>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-6 shadow-sm shadow-sm shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-sm shadow-sm shadow-sm shadow-sm">
               <Percent className="w-7 h-7 shadow-sm shadow-sm shadow-sm shadow-sm" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1 tracking-tighter shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">Aktiv Endirimlər</p>
               <h4 className="text-xl font-black italic shadow-sm shadow-sm shadow-sm">12 Kampaniya</h4>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-6 shadow-sm shadow-sm shadow-sm shadow-sm">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
               <ListFilter className="w-7 h-7 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1 tracking-tighter shadow-sm shadow-sm">Seqmentasiya</p>
               <h4 className="text-xl font-black italic shadow-sm shadow-sm shadow-sm shadow-sm">5 Qrup</h4>
            </div>
         </div>
      </div>

      {/* FILTER & LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden shadow-sm shadow-sm shadow-sm shadow-sm">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm shadow-sm">
           <div className="relative flex-1 group shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors shadow-sm shadow-sm shadow-sm" />
              <input 
                type="text" 
                placeholder="Qiymət siyahısı adı və ya tip üzrə axtar..."
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none transition-all shadow-sm shadow-sm shadow-sm shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center space-x-3 shadow-sm shadow-sm">
              <button className="flex items-center space-x-2 px-6 py-5 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-inner hover:bg-slate-100 transition-all italic shadow-sm shadow-sm">
                 <Filter className="w-4 h-4 shadow-sm shadow-sm shadow-sm shadow-sm" />
                 <span>Filters</span>
              </button>
           </div>
        </div>

        <div className="overflow-x-auto shadow-sm shadow-sm shadow-sm shadow-sm">
           <table className="w-full text-left border-collapse shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
              <thead>
                 <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                    <th className="px-10 py-6 shadow-sm shadow-sm">Siyahı Adı</th>
                    <th className="px-6 py-6 shadow-sm shadow-sm">Növü</th>
                    <th className="px-6 py-6 shadow-sm shadow-sm">Valyuta</th>
                    <th className="px-6 py-6 shadow-sm shadow-sm">Məhsul Sayı</th>
                    <th className="px-6 py-6 shadow-sm shadow-sm shadow-sm">Endirim %</th>
                    <th className="px-6 py-6 shadow-sm shadow-sm">Status</th>
                    <th className="px-10 py-6 text-right shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                 {priceLists.map((list) => (
                    <tr key={list.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer shadow-sm shadow-sm shadow-sm shadow-sm">
                       <td className="px-10 py-8 shadow-sm">
                          <div className="flex items-center space-x-4 shadow-sm shadow-sm">
                             <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-sm shadow-sm shadow-sm shadow-sm">
                                <Tag className="w-6 h-6 shadow-sm shadow-sm shadow-sm" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-800 dark:text-white italic uppercase tracking-tight shadow-sm shadow-sm">{list.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 italic shadow-sm shadow-sm">Yenilənib: {list.lastUpdate}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-8 shadow-sm">
                          <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-500 shadow-sm shadow-sm shadow-sm">
                             {list.type}
                          </span>
                       </td>
                       <td className="px-6 py-8 shadow-sm">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black italic shadow-sm shadow-sm shadow-sm">
                             {list.currency}
                          </span>
                       </td>
                       <td className="px-6 py-8 shadow-sm">
                          <p className="text-sm font-black italic tabular-nums text-slate-700 dark:text-slate-300 shadow-sm shadow-sm shadow-sm shadow-sm">
                             {list.items} SKU
                          </p>
                       </td>
                       <td className="px-6 py-8 shadow-sm">
                          <div className="flex items-center space-x-2 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                             <Percent className="w-3 h-3 text-emerald-500 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
                             <span className="text-xs font-black italic text-emerald-600 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">{list.discount}</span>
                          </div>
                       </td>
                       <td className="px-6 py-8 shadow-sm shadow-sm">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center w-fit shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm ${getStatusStyle(list.status)}`}>
                             {list.status}
                          </span>
                       </td>
                       <td className="px-10 py-8 text-right shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                          <div className="flex items-center justify-end space-x-2 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                             <button className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                                <MoreHorizontal className="w-5 h-5 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
                             </button>
                             <button className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                                <ChevronRight className="w-5 h-5 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30 flex items-start space-x-6 shadow-sm shadow-sm shadow-sm">
         <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
            <Info className="w-6 h-6 text-indigo-600 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
         </div>
         <div>
            <h5 className="text-sm font-black text-indigo-900 dark:text-indigo-200 uppercase italic tracking-tight italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">İpucu: Prioritetləşdirmə</h5>
            <p className="text-[11px] font-bold text-indigo-600/70 dark:text-indigo-400/70 mt-1 italic italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">Müştəri üçün həm regional, həm də xüsusi qiymət siyahısı təyin olunubsa, sistem avtomatik olaraq "Customer Specific" (Xüsusi) siyahısına üstünlük verəcəkdir.</p>
         </div>
      </div>
    </div>
  );
};

export default PriceList;
