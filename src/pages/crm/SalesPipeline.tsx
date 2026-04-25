import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, Search, Filter, 
  MoreHorizontal, Plus, Link as LinkIcon, 
  ChevronRight, Calendar, DollarSign,
  Briefcase, TrendingUp, X
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const SalesPipeline = () => {
  const navigate = useNavigate();
  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();

  // Drag State
  const [draggedDealId, setDraggedDealId] = useState<number | null>(null);

  // Kanban Deals Data State
  const [deals, setDeals] = useState([
      { id: 1, title: 'ERP İnteqrasiyası', customer: 'Baku Steel Company', value: 45000, prob: 20, stage: 'qualify', rep: 'Fuad M' },
      { id: 2, title: 'Bulut Altyapısı', customer: 'Azercell', value: 12000, prob: 15, stage: 'qualify', rep: 'Aysel Q' },
      { id: 3, title: 'HR Modul Tətbiqi', customer: 'Pasha Travel', value: 8500, prob: 50, stage: 'proposal', rep: 'Murad E' },
      { id: 4, title: 'WMS Sistemi', customer: 'DHL Azerbaijan', value: 25000, prob: 45, stage: 'proposal', rep: 'Kamran Q' },
      { id: 5, title: 'GL və Vergi Modulu', customer: 'Bravo Supermarket', value: 15600, prob: 75, stage: 'negotiate', rep: 'Fuad M' },
      { id: 6, title: 'SaaS Platforma', customer: 'Kapital Bank', value: 120500, prob: 90, stage: 'closing', rep: 'Aysel Q' }
  ]);

  // Stage Definition (Bitrix24 Style)
  const stages = [
    { id: 'qualify', name: 'Yeni (Kvalifikasiya)', color: 'bg-indigo-500', headerLight: 'bg-indigo-500', txtHeader: 'text-white' },
    { id: 'proposal', name: 'Təklif Göndərilib', color: 'bg-blue-400', headerLight: 'bg-blue-400', txtHeader: 'text-white' },
    { id: 'negotiate', name: 'İş Prosesində', color: 'bg-cyan-400', headerLight: 'bg-cyan-400', txtHeader: 'text-white' },
    { id: 'closing', name: 'Final Mərhələ', color: 'bg-amber-500', headerLight: 'bg-amber-500', txtHeader: 'text-white' }
  ];

  // Quick Deal Form inside the first column
  const [showQuickDeal, setShowQuickDeal] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickAmount, setQuickAmount] = useState('');

  // Filter States
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchRep, setSearchRep] = useState('ALL');
  const [quickSearch, setQuickSearch] = useState('');

  // Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey && e.code === 'KeyF') {
            e.preventDefault();
            setIsFilterSidebarOpen((prev: boolean) => !prev);
        }
        if (e.key === 'Escape') {
            setIsFilterSidebarOpen(false);
            setShowQuickDeal(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsFilterSidebarOpen]);

  // Global Sidebar Content
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Müştəri / Şirkət</label>
              <input 
                 type="text" 
                 value={searchCustomer}
                 onChange={(e) => setSearchCustomer(e.target.value)} 
                 placeholder="Məsələn: Azercell..."
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Məsul Şəxs</label>
              <select 
                 value={searchRep}
                 onChange={(e) => setSearchRep(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">BÜTÜN ƏMƏKDAŞLAR</option>
                  <option value="Fuad M">Fuad M</option>
                  <option value="Aysel Q">Aysel Q</option>
                  <option value="Kamran Q">Kamran Q</option>
                  <option value="Murad E">Murad E</option>
              </select>
           </div>

           <div className="pt-6">
             <button 
               onClick={() => {
                 setSearchCustomer('');
                 setSearchRep('ALL');
               }}
               className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 italic"
             >
               Filtrləri Sıfırla
             </button>
           </div>
        </div>
      );
    }
  }, [isFilterSidebarOpen, searchCustomer, searchRep, setFilterSidebarContent]);

  const filteredDeals = useMemo(() => {
     return deals.filter(d => {
         if (quickSearch && !(d.title.toLowerCase().includes(quickSearch.toLowerCase()) || d.customer.toLowerCase().includes(quickSearch.toLowerCase()))) return false;
         if (searchCustomer && !d.customer.toLowerCase().includes(searchCustomer.toLowerCase())) return false;
         if (searchRep !== 'ALL' && !d.rep.includes(searchRep)) return false;
         return true;
     });
  }, [deals, quickSearch, searchCustomer, searchRep]);

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, dealId: number) => {
      setDraggedDealId(dealId);
      e.dataTransfer.effectAllowed = 'move';
      // Transparent drag image hack
      const dummy = document.createElement("div");
      e.dataTransfer.setDragImage(dummy, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
      e.preventDefault();
      if (!draggedDealId) return;

      setDeals(prevDeals => prevDeals.map(d => {
          if (d.id === draggedDealId) {
             let prob = d.prob;
             if (targetStageId === 'qualify') prob = 20;
             if (targetStageId === 'proposal') prob = 50;
             if (targetStageId === 'negotiate') prob = 75;
             if (targetStageId === 'closing') prob = 90;
             return { ...d, stage: targetStageId, prob };
          }
          return d;
      }));
      setDraggedDealId(null);
  };

  const handleQuickAdd = () => {
      if (!quickTitle) return;
      const val = parseInt(quickAmount) || 0;
      const nextId = Math.max(...deals.map(d=>d.id), 0) + 1;
      setDeals([{ id: nextId, title: quickTitle, customer: 'Yeni Müştəri', value: val, prob: 20, stage: 'qualify', rep: 'Siz' }, ...deals]);
      setQuickTitle('');
      setQuickAmount('');
      setShowQuickDeal(false);
  };

  const hasFilters = searchCustomer || searchRep !== 'ALL';

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-sm">CRM / Kanban Board</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Satış Hunisi (Pipeline)</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                 type="text" 
                 placeholder="Lövhədə Sürətli Axtar..." 
                 value={quickSearch}
                 onChange={(e) => setQuickSearch(e.target.value)}
                 className="w-56 pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-black italic shadow-sm focus:border-indigo-500 outline-none uppercase transition-all"
              />
          </div>
          
          <button 
              onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
              className={`p-3.5 rounded-2xl shadow-sm transition-all border ${isFilterSidebarOpen || hasFilters ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-y-[-2px] border-indigo-600' : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200'}`}
              title="Zəngin Süzgəc (Alt + F)"
          >
              <Filter className="w-4 h-4 leading-none" />
          </button>
        </div>
      </div>

      {hasFilters && (
         <div className="flex items-center space-x-3 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl text-[10px] uppercase font-black italic border border-indigo-100 shadow-sm transition-all animate-in zoom-in-95 overflow-x-auto">
             <Filter className="w-4 h-4 shrink-0" />
             <span className="shrink-0">Aktiv Süzgəclər:</span>
             {searchCustomer && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Müştəri: {searchCustomer}</span>}
             {searchRep !== 'ALL' && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Əməkdaş: {searchRep}</span>}
             
             <button onClick={() => { 
                setSearchCustomer(''); setSearchRep('ALL'); setIsFilterSidebarOpen(false); 
             }} className="ml-auto p-1.5 bg-indigo-200/50 rounded-xl hover:bg-indigo-300 transition-colors shrink-0">
               <X className="w-3.5 h-3.5"/>
             </button>
         </div>
      )}

      {/* KANBAN BOARD */}
      <div className="flex space-x-6 min-h-[700px] overflow-x-auto pb-10 custom-scrollbar snap-x snap-mandatory px-2">
         {stages.map((stage, _index) => {
            const columnDeals = filteredDeals.filter(d => d.stage === stage.id);
            const columnTotal = columnDeals.reduce((sum, d) => sum + d.value, 0);

            return (
               <div 
                 key={stage.id} 
                 className={`flex flex-col min-w-[340px] max-w-[340px] snap-center rounded-3xl overflow-hidden shadow-sm bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 transition-all ${draggedDealId ? 'ring-2 ring-indigo-500/20' : ''}`}
                 onDragOver={handleDragOver}
                 onDrop={(e) => handleDrop(e, stage.id)}
               >
                  {/* Bitrix24 Style Header */}
                  <div className={`${stage.headerLight} ${stage.txtHeader} p-5 flex flex-col justify-between relative overflow-hidden group`}>
                      <div className="absolute inset-0 bg-black/10 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 flex items-center justify-between mb-2">
                          <h4 className="text-[12px] font-black uppercase tracking-widest italic">{stage.name}</h4>
                          <span className="px-2 py-0.5 bg-black/20 rounded-lg text-[10px] font-black italic">{columnDeals.length}</span>
                      </div>
                      <div className="relative z-10 text-right">
                          <span className="text-xl font-black italic tabular-nums drop-shadow-md">₼ {columnTotal.toLocaleString()}</span>
                      </div>
                  </div>

                  {/* Deals Container */}
                  <div className="p-4 flex-1 flex flex-col space-y-4 relative">
                      
                      {/* Quick Deal specifically inside the first column */}
                      {stage.id === 'qualify' && (
                          <div className="mb-2">
                             {!showQuickDeal ? (
                                <button onClick={() => setShowQuickDeal(true)} className="w-full py-4 border-2 border-dashed border-indigo-200 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-500 hover:bg-indigo-50 hover:border-indigo-500 transition-all font-black text-[10px] uppercase italic tracking-widest shadow-sm">
                                   <Plus className="w-4 h-4 mr-2" /> Quick Deal (Sürətli)
                                </button>
                             ) : (
                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-indigo-200 shadow-xl shadow-indigo-500/10 animate-in zoom-in-95">
                                    <input autoFocus value={quickTitle} onChange={e=>setQuickTitle(e.target.value)} type="text" placeholder="İşin adı..." className="w-full mb-3 bg-slate-50 py-3 px-4 rounded-xl text-xs font-black italic outline-none uppercase" />
                                    <input value={quickAmount} onChange={e=>setQuickAmount(e.target.value)} type="number" placeholder="Dəyər (AZN)" className="w-full mb-4 bg-slate-50 py-3 px-4 rounded-xl text-xs font-black italic outline-none tabular-nums" />
                                    <div className="flex space-x-2">
                                        <button onClick={handleQuickAdd} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black uppercase italic hover:bg-indigo-700">Əlavə et</button>
                                        <button onClick={() => setShowQuickDeal(false)} className="px-4 bg-slate-100 text-slate-500 py-2 rounded-xl text-[10px] font-black uppercase italic hover:bg-slate-200"><X className="w-3.5 h-3.5"/></button>
                                    </div>
                                </div>
                             )}
                          </div>
                      )}

                      {/* Deal Cards */}
                      {columnDeals.map(deal => (
                         <div 
                           key={deal.id} 
                           draggable
                           onDragStart={(e) => handleDragStart(e, deal.id)}
                           className={`bg-white dark:bg-slate-900 rounded-3xl border ${draggedDealId === deal.id ? 'border-dashed border-indigo-400 opacity-50 scale-95' : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:translate-y-[-2px]'} p-6 cursor-grab active:cursor-grabbing transition-all group`}
                         >
                            <div className="flex items-center justify-between mb-3">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic bg-slate-50 px-2 py-1 rounded-lg">ID: #{deal.id}</span>
                               <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[8px] font-black">
                                  {deal.rep.substring(0,2)}
                               </div>
                            </div>
                            <h5 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight italic leading-tight mb-1">{deal.title}</h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mb-5 truncate">{deal.customer}</p>
                            
                            <div className="flex items-center justify-between mb-5">
                               <span className="text-sm font-black text-indigo-600 tabular-nums italic">₼ {deal.value.toLocaleString()}</span>
                               <span className={`text-xs font-black tabular-nums italic ${deal.prob >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>{deal.prob}%</span>
                            </div>

                            <div className="w-full bg-slate-50 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                               <div className={`${stage.color} h-full`} style={{ width: `${deal.prob}%` }}></div>
                            </div>
                         </div>
                      ))}

                      {columnDeals.length === 0 && stage.id !== 'qualify' && (
                         <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl opacity-50 p-6 min-h-[150px]">
                            <p className="text-[10px] font-black uppercase text-slate-400 italic text-center tracking-widest">Sürüşdürüb bura buraxın</p>
                         </div>
                      )}
                  </div>
               </div>
            );
         })}
      </div>
      
    </div>
  );
};

export default SalesPipeline;
