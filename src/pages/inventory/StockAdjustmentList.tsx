import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Plus, MoreHorizontal,
  ClipboardCheck, BarChart3, ChevronDown, ClipboardList, Settings2,
  Eye, Trash2, FileEdit, Filter, Calendar, HardDrive, User, ArrowRightLeft, ArrowDownLeft, ArrowUpRight
} from 'lucide-react';

const StockAdjustmentList = () => {
  const navigate = useNavigate();
  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();
  
  const [activeTab, setActiveTab] = useState('counts');
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    warehouse: '',
    status: '',
    creator: '',
    startDate: '',
    endDate: ''
  });

  const filterByDate = (dateStr: string) => {
     if (!filters.startDate && !filters.endDate) return true;
     
     const dt = new Date(dateStr);
     dt.setHours(0,0,0,0);
     
     if (filters.startDate && !filters.endDate) {
         const fromDt = new Date(filters.startDate);
         fromDt.setHours(0,0,0,0);
         return dt >= fromDt;
     }

     if (!filters.startDate && filters.endDate) {
         const toDt = new Date(filters.endDate);
         toDt.setHours(23,59,59,999);
         return dt <= toDt;
     }

     if (filters.startDate && filters.endDate) {
         const fromDt = new Date(filters.startDate);
         const toDt = new Date(filters.endDate);
         fromDt.setHours(0,0,0,0);
         toDt.setHours(23,59,59,999);
         return dt >= fromDt && dt <= toDt;
     }

     return true;
  };

  const hasActiveFilters = filters.warehouse || filters.startDate || filters.endDate || filters.creator;

  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-20">
            <div className="space-y-4 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-2" /> Tarix Aralığı
                </label>
                <div className="grid grid-cols-1 gap-3 pt-2">
                    <input 
                        type="date" 
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-[11px] font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <input 
                        type="date" 
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-[11px] font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 flex items-center">
                    <HardDrive className="w-3 h-3 mr-2" /> Anbar
                </label>
                <select 
                    value={filters.warehouse}
                    onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase appearance-none"
                >
                    <option value="">Bütün Anbarlar</option>
                    <option value="Mərkəzi Anbar">Mərkəzi Anbar</option>
                    <option value="Xırdalan Anbarı">Xırdalan Anbarı</option>
                </select>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 flex items-center">
                    <User className="w-3 h-3 mr-2" /> Məsul Şəxs
                </label>
                <input 
                   type="text" 
                   value={filters.creator}
                   onChange={(e) => setFilters({ ...filters, creator: e.target.value })}
                   placeholder="İcraçı adı..."
                   className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase"
                />
            </div>

            <button 
                onClick={() => setFilters({ warehouse: '', status: '', creator: '', startDate: '', endDate: '' })}
                className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 italic"
            >
                Sıfırla
            </button>
        </div>
      );
    }
  }, [isFilterSidebarOpen, filters, setFilterSidebarContent]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.action-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [counts, setCounts] = useState<any[]>(() => {
    const saved = localStorage.getItem('erp_inventory_counts');
    return saved ? JSON.parse(saved) : [
      { id: 'mock-c1', warehouse: "Xırdalan Anbarı", date: "2026-03-28", result: "Stok Uyğundur", itemsCount: 450, status: "Tamamlanıb", docNumber: 'INV-CNT-2026-0089' },
      { id: 'mock-c2', warehouse: "Mərkəzi Anbar", date: "2026-03-30", result: "-12 Ədəd Fərq", itemsCount: 1200, status: "Düzəliş Gözləyir", docNumber: 'INV-CNT-2026-0090' },
    ];
  });

  const [adjustments, setAdjustments] = useState<any[]>(() => {
    const saved = localStorage.getItem('erp_stock_adjustments');
    return saved ? JSON.parse(saved) : [
      { id: 'mock-a1', type: "Artım (Plus)", reason: "Sayım Nəticəsi", date: "2026-03-29", value: 1200, status: "Təsdiqlənib", docNumber: 'INV-ADJ-2026-0102' },
      { id: 'mock-a2', type: "Azalma (Minus)", reason: "Zədələnmiş Mal", date: "2026-03-25", value: 450, status: "Tamamlanıb", docNumber: 'INV-ADJ-2026-0103' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('erp_inventory_counts', JSON.stringify(counts));
    localStorage.setItem('erp_stock_adjustments', JSON.stringify(adjustments));
  }, [counts, adjustments]);

  const filteredCounts = counts.filter(c => 
    (!filters.warehouse || c.warehouse === filters.warehouse) &&
    filterByDate(c.date)
  );
  
  const filteredAdjustments = adjustments.filter(a => 
    filterByDate(a.date)
  );

  const totalAdjustmentValue = filteredAdjustments.reduce((sum, a) => sum + (a.type.includes('Artım') ? a.value : -a.value), 0);

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap">İnventar Kontrolu</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner whitespace-nowrap">Sayım və Düzəlişlər</h1>
        </div>
        
        <div className="flex items-center space-x-3 relative">
           <button 
               onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
               className={`p-3.5 rounded-2xl shadow-sm transition-all border ${isFilterSidebarOpen || hasActiveFilters ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-y-[-2px] border-indigo-600' : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200 shadow-sm'}`}
               title="Süzgəclər"
           >
               <Filter className="w-4 h-4 leading-none" />
           </button>
           <button 
             onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
             className="flex items-center space-x-3 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic"
           >
              <Plus className="w-4 h-4" />
              <span>Yeni Əməliyyat</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isNewMenuOpen ? 'rotate-180' : ''}`} />
           </button>

           {isNewMenuOpen && (
             <>
               <div className="fixed inset-0 z-40" onClick={() => setIsNewMenuOpen(false)}></div>
               <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl p-4 z-50 animate-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => navigate('/inventory/count/create')}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl transition-all group"
                  >
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><ClipboardList className="w-5 h-5"/></div>
                    <div className="text-left">
                      <p className="text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200">Yeni Sayım Aktı</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase italic leading-none mt-1">İnventarizasiya</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate('/inventory/adjustment/create')}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl transition-all group mt-2"
                  >
                    <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl group-hover:scale-110 transition-transform"><Settings2 className="w-5 h-5"/></div>
                    <div className="text-left">
                      <p className="text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200">Yeni Stok Düzəlişi</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase italic leading-none mt-1">Artım / Azalma</p>
                    </div>
                  </button>
               </div>
             </>
           )}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group transition-all hover:border-indigo-500/30">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Cari ay sayım sayı</p>
               <h3 className="text-2xl font-black italic tabular-nums text-slate-800 dark:text-white">{filteredCounts.length} Akt</h3>
            </div>
            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl group-hover:rotate-12 transition-all"><ClipboardCheck className="w-8 h-8" /></div>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group transition-all hover:border-rose-500/30">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Net Düzəliş Məbləği</p>
               <h3 className={`text-2xl font-black italic tabular-nums ${totalAdjustmentValue >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {totalAdjustmentValue >= 0 ? '+' : ''}{totalAdjustmentValue.toLocaleString()} ₼
               </h3>
            </div>
            <div className={`p-5 rounded-3xl group-hover:-rotate-12 transition-all ${totalAdjustmentValue >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}><BarChart3 className="w-8 h-8" /></div>
         </div>
      </div>

      {/* TABS */}
      <div className="flex items-center space-x-2 p-1.5 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
         <button 
           onClick={() => setActiveTab('counts')}
           className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'counts' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
         >İnventar Sayımları</button>
         <button 
           onClick={() => setActiveTab('adjustments')}
           className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'adjustments' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
         >Stok Düzəlişləri</button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-4">
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                  <th className="px-8 py-6 w-32 tracking-tighter">№ Sənəd</th>
                  <th className="px-8 py-6">{activeTab === 'counts' ? 'Anbar' : 'Düzəliş Növü'}</th>
                  <th className="px-8 py-6">{activeTab === 'counts' ? 'Tarix' : 'Səbəb'}</th>
                  <th className="px-8 py-6 text-right">{activeTab === 'counts' ? 'Mal Sayı' : 'Məbləğ'}</th>
                  <th className="px-8 py-6 text-center">{activeTab === 'counts' ? 'Nəticə' : 'Tarix'}</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right pr-12">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {(activeTab === 'counts' ? filteredCounts : filteredAdjustments).map((row: any) => (
                 <tr key={row.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-black text-slate-400 italic font-mono">{row.docNumber}</span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-slate-800 dark:text-white uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors">{activeTab === 'counts' ? row.warehouse : row.type}</span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase italic tracking-widest">{row.date}</td>
                    <td className="px-8 py-6 text-right font-black italic tabular-nums text-slate-600 dark:text-slate-300">
                       {activeTab === 'counts' ? row.itemsCount : `${row.value.toLocaleString()} ₼`}
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`text-[10px] font-black italic uppercase ${row.result?.includes('Fərq') ? 'text-rose-500' : 'text-slate-400'}`}>
                          {activeTab === 'counts' ? row.result : row.reason}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                         ['Tamamlanıb', 'Təsdiqlənib'].includes(row.status) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       }`}>{row.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right pr-12 relative action-dropdown-container">
                       <button 
                           onClick={(e) => {
                               e.stopPropagation();
                               setActiveDropdown(activeDropdown === row.id ? null : row.id);
                           }}
                           className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-300 hover:text-indigo-600 transition-all flex items-center justify-center mx-auto mr-0"
                       >
                           <MoreHorizontal className="w-5 h-5"/>
                       </button>

                       {activeDropdown === row.id && (
                          <div className="absolute right-12 top-10 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              {activeTab === 'counts' && row.status === 'Düzəliş Gözləyir' && (
                                 <button 
                                     onClick={(e) => { e.stopPropagation(); navigate('/inventory/adjustment/create'); }}
                                     className="w-full text-left px-4 py-3 text-xs font-black italic text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors uppercase flex items-center"
                                 >
                                    <Settings2 className="w-4 h-4 mr-2" /> Düzəliş Yarat
                                 </button>
                              )}
                              <button 
                                 onClick={(e) => { e.stopPropagation(); alert('Sənəd baxış rejimi tezliklə aktiv olacaq'); setActiveDropdown(null); }}
                                 className="w-full text-left px-4 py-3 text-xs font-bold italic text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center"
                              >
                                 <Eye className="w-4 h-4 mr-2 text-slate-400" /> Sənədə Bax
                              </button>
                              <button 
                                 onClick={(e) => { 
                                     e.stopPropagation(); 
                                     const conf = window.confirm('Bu sənədi silmək istədiyinizə əminsiniz?');
                                     if(conf) {
                                        if (activeTab === 'counts') {
                                           setCounts(counts.filter((c: any) => c.id !== row.id));
                                        } else {
                                           setAdjustments(adjustments.filter((a: any) => a.id !== row.id));
                                        }
                                        setActiveDropdown(null);
                                     }
                                 }}
                                 className="w-full text-left px-4 py-3 text-xs font-bold italic text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center border-t border-slate-50 dark:border-slate-700"
                              >
                                 <Trash2 className="w-4 h-4 mr-2" /> Sil
                              </button>
                          </div>
                       )}
                    </td>
                 </tr>
               ))}
               {(activeTab === 'counts' ? filteredCounts : filteredAdjustments).length === 0 && (
                 <tr>
                    <td colSpan={7} className="py-20 text-center">
                       <span className="text-[11px] font-black text-slate-300 uppercase italic tracking-widest">Məlumat tapılmadı</span>
                    </td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

    </div>
  );
};

export default StockAdjustmentList;
