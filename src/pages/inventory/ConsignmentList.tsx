import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Search, Truck, Store, CheckCircle2, ChevronDown, PackageOpen, Undo2, ChevronRight, Filter, X
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const ConsignmentList = () => {
   const navigate = useNavigate();
   
   // Context for global sidebar filter
   const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();

   const [activeTab, setActiveTab] = useState<'NET' | 'OUT' | 'SALE' | 'RETURN'>('NET');
   const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

   // Expand States
   const [expandedRows, setExpandedRows] = useState<string[]>([]);

   const [groupBy, setGroupBy] = useState<'COMPANY' | 'PRODUCT'>('COMPANY');
   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');
   const [searchPartner, setSearchPartner] = useState('');
   const [searchItem, setSearchItem] = useState('');

   // Local fast-search state
   const [quickSearch, setQuickSearch] = useState('');

   const toggleRow = (id: string) => {
       setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
   };

   // Alt+F shortcut listener
   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
         if (e.altKey && e.code === 'KeyF') {
             e.preventDefault();
             setIsFilterSidebarOpen((prev: boolean) => !prev);
         }
         if (e.key === 'Escape') {
             setIsFilterSidebarOpen(false);
         }
     };
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
   }, [setIsFilterSidebarOpen]);

   // Build Sidebar content
   useEffect(() => {
     if (isFilterSidebarOpen) {
       setFilterSidebarContent(
         <div className="space-y-8 animate-in slide-in-from-right duration-300">
             <div className="space-y-4 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 mb-6">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic border-b border-indigo-100/30 pb-2 block">Tarix Aralığı</label>
                <div className="space-y-3 pt-2">
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-[11px] font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-[11px] font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
             </div>

             <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Şirkət / Tərəfdaş Axtar</label>
               <input 
                  type="text" 
                  value={searchPartner}
                  onChange={(e) => setSearchPartner(e.target.value)} 
                  placeholder="Məsələn: Modern İnşaat..."
                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
               />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Məhsul / SKU Axtar</label>
               <input 
                  type="text" 
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)} 
                  placeholder="Məsələn: Armatur A500C..."
                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
               />
            </div>

            <div className="pt-6">
              <button 
                onClick={() => {
                  setSearchPartner('');
                  setSearchItem('');
                }}
                className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 italic"
              >
                Filtrləri Sıfırla
              </button>
            </div>
         </div>
       );
     }
   }, [isFilterSidebarOpen, searchPartner, searchItem, setFilterSidebarContent]);

   const [consignments] = useState<any[]>(() => {
       const saved = localStorage.getItem('erp_consignments');
       return saved ? JSON.parse(saved) : [
         { id: 'CNS-O-001', docNumber: 'CNS-OUT-2026-001', date: '10 Apr 2026', partyName: 'Modern İnşaat MMC', type: 'OUT', totalValue: 4500, status: 'POSTED', itemsCount: 45, items: [{ id: '1', name: 'Armatur A500C 12mm', code: 'ARM-001', uom: 'TON', size: '12M', qty: 45, price: 100 }] },
         { id: 'CNS-O-002', docNumber: 'CNS-OUT-2026-002', date: '12 Apr 2026', partyName: 'Alov Market', type: 'OUT', totalValue: 1200, status: 'DRAFT', itemsCount: 12, items: [] },
         { id: 'CNS-S-001', docNumber: 'CNS-SALE-2026-001', date: '15 Apr 2026', partyName: 'Modern İnşaat MMC', type: 'SALE', totalValue: 2000, status: 'POSTED', itemsCount: 20, items: [{ id: '1', name: 'Armatur A500C 12mm', code: 'ARM-001', uom: 'TON', size: '12M', qty: 20, price: 100 }] },
         { id: 'CNS-R-001', docNumber: 'CNS-RET-2026-001', date: '18 Apr 2026', partyName: 'Modern İnşaat MMC', type: 'RETURN', totalValue: 200, status: 'POSTED', itemsCount: 2, items: [{ id: '1', name: 'Armatur A500C 12mm', code: 'ARM-001', uom: 'TON', size: '12M', qty: 2, price: 100 }] },
       ];
   });

   // NET CALCULATION
   const partnerNets = useMemo(() => {
       const netPartnersMap = new Map();
       consignments.filter(c => c.status === 'POSTED').forEach(doc => {
           const sign = doc.type === 'OUT' ? 1 : -1;
           if (!netPartnersMap.has(doc.partyName)) {
               netPartnersMap.set(doc.partyName, new Map());
           }
           const pItems = netPartnersMap.get(doc.partyName);
           (doc.items || []).forEach((item: any) => {
               if (!pItems.has(item.code)) {
                   pItems.set(item.code, { ...item, netQty: 0 });
               }
               pItems.get(item.code).netQty += (item.qty * sign);
           });
       });

       return Array.from(netPartnersMap.entries()).map(([partyName, itemsMap]) => {
           let items = Array.from((itemsMap as Map<string, any>).values()).filter(i => i.netQty > 0);
           
           // Item Filter
           if (searchItem.trim()) {
               items = items.filter(i => i.name.toLowerCase().includes(searchItem.toLowerCase()) || i.code.toLowerCase().includes(searchItem.toLowerCase()));
           }

           const totalValue = items.reduce((s, i) => s + (i.netQty * i.price), 0);
           return { id: partyName, partyName, items, totalValue };
       }).filter(p => p.items.length > 0 && 
           (!searchPartner.trim() || p.partyName.toLowerCase().includes(searchPartner.toLowerCase())) &&
           (!quickSearch.trim() || p.partyName.toLowerCase().includes(quickSearch.toLowerCase()))
       );
   }, [consignments, searchPartner, searchItem, quickSearch]);

   // DOCS FILTERING
   const displayDocs = useMemo(() => {
       let docs = consignments.filter(c => c.type === activeTab);
       if (searchPartner.trim()) {
           docs = docs.filter(c => c.partyName.toLowerCase().includes(searchPartner.toLowerCase()));
       }
       if (quickSearch.trim()) {
           docs = docs.filter(c => c.partyName.toLowerCase().includes(quickSearch.toLowerCase()) || c.docNumber.toLowerCase().includes(quickSearch.toLowerCase()));
       }
       if (searchItem.trim()) {
           docs = docs.map(doc => {
               const matchingItems = (doc.items || []).filter((i: any) => i.name.toLowerCase().includes(searchItem.toLowerCase()) || i.code.toLowerCase().includes(searchItem.toLowerCase()));
               return { ...doc, items: matchingItems, matchCount: matchingItems.length };
           }).filter(doc => doc.matchCount > 0 || doc.itemsCount === 0);
       }
       return docs;
   }, [consignments, activeTab, searchPartner, searchItem, quickSearch]);

   const activeStockValue = partnerNets.reduce((acc, curr) => acc + curr.totalValue, 0);
   const distinctPartners = partnerNets.length;

   const renderInnerTable = (items: any[], isNet: boolean = false) => (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 shadow-inner">
           <table className="w-full text-left bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                <thead>
                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 bg-[#FAFBFD] dark:bg-slate-800/80">
                        <th className="px-6 py-4 w-32">Tip</th>
                        <th className="px-6 py-4 text-center">SKU / Kod</th>
                        <th className="px-6 py-4">Məhsul Adı</th>
                        <th className="px-6 py-4 text-center">Ölçü vahidi</th>
                        <th className="px-6 py-4 text-center">Ölçüsü</th>
                        <th className={`px-6 py-4 text-right pr-6 ${isNet ? 'text-indigo-600' : 'text-slate-600'}`}>{isNet ? 'Net Qalıq' : 'Miqdar'}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {items.length === 0 ? (
                        <tr><td colSpan={6} className="py-10 text-center text-xs font-bold text-slate-400 italic">Filtrə uyğun məhsul tapılmadı</td></tr>
                    ) : items.map((item: any, idx: number) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                            <td className="px-6 py-5">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg"><PackageOpen className="w-3.5 h-3.5 text-slate-500" /></div>
                                    <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase italic">EHTİYATLAR</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center font-black italic text-slate-500 dark:text-slate-400 tabular-nums text-xs">{item.code}</td>
                            <td className="px-6 py-5">
                                <span className="text-xs font-black text-slate-800 dark:text-white italic tracking-tight uppercase leading-none">{item.name}</span>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase italic">{item.uom}</span>
                            </td>
                            <td className="px-6 py-5 text-center text-[10px] font-black text-slate-500 italic uppercase">
                                {item.size || '-'}
                            </td>
                            <td className={`px-6 py-5 text-right font-black italic tabular-nums pr-6 text-sm ${isNet ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                {(isNet ? item.netQty : item.qty).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
           </table>
        </div>
   );

   return (
      <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 relative">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
             <div>
                 <div className="flex items-center space-x-3 mb-2">
                     <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">Konsiqnasiya Agentliyi</span>
                 </div>
                 <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Konsiqnasiya</h1>
             </div>

             <div className="flex flex-wrap items-center gap-4">
                 
                 <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Ümumi axtarış..." 
                            value={quickSearch}
                            onChange={(e) => setQuickSearch(e.target.value)}
                            className="w-56 pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-black italic shadow-sm focus:border-indigo-500 outline-none uppercase transition-all"
                        />
                    </div>
                    
                    {/* FILTER BUTTON */}
                    <button 
                        onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
                        className={`p-3.5 rounded-2xl shadow-sm transition-all border ${isFilterSidebarOpen || searchPartner || searchItem ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-y-[-2px] border-indigo-600' : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200'}`}
                        title="Zəngin Süzgəc (Alt + F)"
                    >
                        <Filter className="w-4 h-4 leading-none" />
                    </button>
                 </div>

                 <div className="relative">
                     <button 
                         onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                         className="flex items-center space-x-3 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic"
                     >
                         <Plus className="w-4 h-4" />
                         <span>Yeni Sənəd</span>
                         <ChevronDown className={`w-4 h-4 transition-transform ${isNewMenuOpen ? 'rotate-180' : ''}`} />
                     </button>

                     {isNewMenuOpen && (
                         <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsNewMenuOpen(false)}></div>
                            <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl p-4 z-50 animate-in zoom-in-95">
                                <button 
                                    onClick={() => navigate('/inventory/consignment/create?type=OUT')}
                                    className="w-full flex items-center space-x-3 p-4 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-2xl transition-all group"
                                >
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><Truck className="w-5 h-5"/></div>
                                    <div className="text-left">
                                        <p className="text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200">Mal Göndərmə (OUT)</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase italic">Agentə / Tərəfə Mal Göndər</p>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => navigate('/inventory/consignment/create?type=SALE')}
                                    className="w-full flex items-center space-x-3 p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-2xl transition-all group"
                                >
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform"><CheckCircle2 className="w-5 h-5"/></div>
                                    <div className="text-left">
                                        <p className="text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200">Konsiqnasiya Satışı</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase italic">Tərəf malı satdığını təsdiqlədi</p>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => navigate('/inventory/consignment/create?type=RETURN')}
                                    className="w-full flex items-center space-x-3 p-4 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl transition-all group"
                                >
                                    <div className="p-2 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform"><Undo2 className="w-5 h-5"/></div>
                                    <div className="text-left">
                                        <p className="text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200">Məhsul Qaytarılması</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase italic">Satılmayan malların anbara dönüşü</p>
                                    </div>
                                </button>
                            </div>
                         </>
                     )}
                 </div>
             </div>
          </div>

          {/* ACTIVE FILTERS INDICATOR */}
          {(searchPartner || searchItem) && (
              <div className="flex items-center space-x-3 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl text-[10px] uppercase font-black italic border border-indigo-100 shadow-sm transition-all animate-in zoom-in-95">
                  <Filter className="w-4 h-4" />
                  <span>Aktiv Süzgəclər:</span>
                  {searchPartner && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest">{searchPartner}</span>}
                  {searchItem && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest">{searchItem}</span>}
                  <button onClick={() => { setSearchPartner(''); setSearchItem(''); setIsFilterSidebarOpen(false); }} className="ml-auto p-1.5 bg-indigo-200/50 rounded-xl hover:bg-indigo-300 transition-colors"><X className="w-3.5 h-3.5"/></button>
              </div>
          )}

          {/* DASHBOARD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group">
                <div>
                    <h3 className="text-3xl font-black italic tabular-nums text-slate-800 dark:text-white">{activeStockValue.toLocaleString()} <span className="text-slate-400">₼</span></h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mt-2">Çöldə olan ümumi Konsiqnasiya Malları</p>
                </div>
                <div className="p-5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-3xl"><PackageOpen className="w-8 h-8" /></div>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group">
                <div>
                    <h3 className="text-3xl font-black italic tabular-nums text-slate-800 dark:text-white">{distinctPartners} <span className="text-slate-400 text-xl">Şirkət / Mağaza</span></h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mt-2">Aktiv Konsiqnasiya Tərəfdaşları</p>
                </div>
                <div className="p-5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl"><Store className="w-8 h-8" /></div>
             </div>
          </div>

          {/* TABS & GROUPING */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-2 p-1.5 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
                <button 
                    onClick={() => { setActiveTab('NET'); setExpandedRows([]); }}
                    className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'NET' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >NET STOK</button>
                <button 
                    onClick={() => { setActiveTab('OUT'); setExpandedRows([]); }}
                    className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'OUT' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >Çıxış (Göndərmə)</button>
                <button 
                    onClick={() => { setActiveTab('SALE'); setExpandedRows([]); }}
                    className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'SALE' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >Satışlar (Agent)</button>
                <button 
                    onClick={() => { setActiveTab('RETURN'); setExpandedRows([]); }}
                    className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'RETURN' ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >Geri Qaytarmalar</button>
              </div>

              <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase italic ml-3">Qruplaşma:</span>
                  <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl p-1">
                      <button 
                        onClick={() => setGroupBy('COMPANY')}
                        className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase italic transition-all ${groupBy === 'COMPANY' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                      >Şirkət</button>
                      <button 
                        onClick={() => setGroupBy('PRODUCT')}
                        className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase italic transition-all ${groupBy === 'PRODUCT' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                      >Məhsul</button>
                  </div>
              </div>
          </div>


          {/* TABLE AREA */}
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-4">
              
              {activeTab === 'NET' ? (
                 <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800 bg-slate-50/50">
                            <th className="px-8 py-5 w-16 rounded-l-2xl"></th>
                            <th className="px-8 py-5">Tərəfdaş (Şirkət)</th>
                            <th className="px-8 py-5 text-center">NET Məhsul Sayı</th>
                            <th className="px-8 py-5 text-right pr-8 rounded-r-2xl">Ümumi Dəyər</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {partnerNets.length === 0 ? (
                            <tr><td colSpan={4} className="py-20 text-center font-bold text-slate-400 italic">Net qalıq yoxdur</td></tr>
                        ) : partnerNets.map((partner) => {
                            const isExpanded = expandedRows.includes(partner.id);
                            return (
                                <React.Fragment key={partner.id}>
                                    <tr onClick={() => toggleRow(partner.id)} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-all ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/40' : ''}`}>
                                        <td className="px-8 py-6 text-center">
                                            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-indigo-500' : ''}`} />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl"><Store className="w-4 h-4" /></div>
                                                <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{partner.partyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center font-black italic tabular-nums text-slate-600">
                                            {partner.items.length} növ məhsul
                                        </td>
                                        <td className="px-8 py-6 text-right font-black italic tabular-nums text-indigo-600 pr-8 text-lg">
                                            {partner.totalValue.toLocaleString()} ₼
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan={4} className="p-0">
                                                {renderInnerTable(partner.items, true)}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                 </table>
              ) : (
                 <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800 bg-slate-50/50">
                            <th className="px-8 py-6 w-16 rounded-l-3xl"></th>
                            <th className="px-8 py-6 w-40">№ Sənəd</th>
                            <th className="px-8 py-6">Tərəfdaş (Partner)</th>
                            <th className="px-8 py-6">Tarix</th>
                            <th className="px-8 py-6 text-right">Sənəd Məbləği</th>
                            <th className="px-8 py-6 text-center rounded-r-3xl">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {displayDocs.length === 0 ? (
                            <tr><td colSpan={6} className="py-20 text-center font-bold text-slate-400 italic">Sənəd yoxdur</td></tr>
                        ) : displayDocs.map((doc: any) => {
                            const isExpanded = expandedRows.includes(doc.id);
                            return (
                                <React.Fragment key={doc.id}>
                                    <tr onClick={() => toggleRow(doc.id)} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-all ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/40' : ''}`}>
                                        <td className="px-8 py-6 text-center">
                                            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-indigo-500' : ''}`} />
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-black text-slate-400 italic font-mono">{doc.docNumber}</td>
                                        <td className="px-8 py-6 text-xs font-black uppercase italic dark:text-slate-200">{doc.partyName}</td>
                                        <td className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase italic tracking-widest">{doc.date}</td>
                                        <td className="px-8 py-6 text-right font-black italic tabular-nums text-slate-700 dark:text-slate-300 text-sm">
                                            {doc.totalValue.toLocaleString()} ₼
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                                                doc.status === 'POSTED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>{doc.status}</span>
                                        </td>
                                    </tr>
                                    {isExpanded && doc.items && (
                                        <tr>
                                            <td colSpan={6} className="p-0">
                                                {renderInnerTable(doc.items, false)}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                 </table>
              )}
          </div>
      </div>
   );
};

export default ConsignmentList;
