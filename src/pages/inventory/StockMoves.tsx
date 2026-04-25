import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownLeft, ArrowRightLeft, 
  Search, Filter, Download, History,
  Package, FileText, MapPin, ChevronRight, X,
  TrendingUp, TrendingDown, Store, Scale, Plus, ChevronDown
} from 'lucide-react';

import { useSearchParams, useOutletContext, useNavigate } from 'react-router-dom';

const StockMoves = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlWarehouseFilter = searchParams.get('warehouse');

  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  // Expand tracking
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const toggleRow = (id: string) => {
      setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  // Filter States
  const [searchDocNumber, setSearchDocNumber] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [searchWarehouse, setSearchWarehouse] = useState(urlWarehouseFilter || '');
  const [searchType, setSearchType] = useState('ALL');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');

  const [quickSearch, setQuickSearch] = useState('');

  // Alt+F Shortcut
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

  // Sidebar Filter Component
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
           
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Sənəd Nömrəsi</label>
              <input 
                 type="text" 
                 value={searchDocNumber}
                 onChange={(e) => setSearchDocNumber(e.target.value)} 
                 placeholder="Məsələn: PINV-2024..."
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Əməliyyat Növü</label>
              <select 
                 value={searchType}
                 onChange={(e) => setSearchType(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">BÜTÜN ƏMƏLİYYATLAR</option>
                  <option value="IN">MƏDAXİL (GİRİŞ)</option>
                  <option value="OUT">MƏXARİC (ÇIXIŞ)</option>
                  <option value="TRANSFER">YERDƏYİŞMƏ (TRANSFER)</option>
                  <option value="ADJ">TƏNZİMLƏMƏ (DÜZƏLİŞ)</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Malın Adı / SKU</label>
              <input 
                 type="text" 
                 value={searchProduct}
                 onChange={(e) => setSearchProduct(e.target.value)} 
                 placeholder="Məsələn: Sement..."
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Anbar (Məkan)</label>
              <input 
                 type="text" 
                 value={searchWarehouse}
                 onChange={(e) => setSearchWarehouse(e.target.value)} 
                 placeholder="Məsələn: Logistika..."
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Başlanğıc Tarix</label>
                 <input 
                    type="date" 
                    value={searchStartDate}
                    onChange={(e) => setSearchStartDate(e.target.value)} 
                    className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700"
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Son Tarix</label>
                 <input 
                    type="date" 
                    value={searchEndDate}
                    onChange={(e) => setSearchEndDate(e.target.value)} 
                    className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700"
                 />
              </div>
           </div>

           <div className="pt-6">
             <button 
               onClick={() => {
                 setSearchDocNumber('');
                 setSearchProduct('');
                 setSearchWarehouse('');
                 setSearchType('ALL');
                 setSearchStartDate('');
                 setSearchEndDate('');
                 setSearchParams({});
               }}
               className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 italic"
             >
               Filtrləri Sıfırla
             </button>
           </div>
        </div>
      );
    }
  }, [isFilterSidebarOpen, searchDocNumber, searchProduct, searchWarehouse, searchType, searchStartDate, searchEndDate, setFilterSidebarContent, setSearchParams]);

  // Raw Document-level Moves
  const rawDocs = useMemo(() => [
    {
      id: 'doc1', docNumber: 'PINV-2024-001', type: 'IN', action: 'Satınalma Mədaxili', date: '2024-03-30', time: '14:20', warehouse: 'Mərkəzi Anbar (Logistika)', partner: 'Modern İnşaat MMC', status: 'POSTED',
      items: [
        { product: 'Armatur A500C 12mm', sku: 'SKU-1004', qty: 150, unit: 'Ton', price: 920.00 },
        { product: 'Sement Akkord M-400', sku: 'SKU-2041', qty: 25, unit: 'Ton', price: 115.00 }
      ]
    },
    {
       id: 'doc2', docNumber: 'SINV-2024-082', type: 'OUT', action: 'Satış Məxarici', date: '2024-03-30', time: '11:15', warehouse: 'Mərkəzi Anbar (Logistika)', partner: 'Alov Market', status: 'POSTED',
       items: [
         { product: 'Sement Akkord M-400', sku: 'SKU-2041', qty: -45, unit: 'Ton', price: 125.00 }
       ]
    },
    {
       id: 'doc3', docNumber: 'TRF-2024-012', type: 'TRANSFER', action: 'Anbarlararası Transfer', date: '2024-03-29', time: '16:45', warehouse: 'Mərkəzi → Sahə 1', partner: 'Daxili Təyinat', status: 'DRAFT',
       items: [
         { product: 'Beton Marka 350', sku: 'SKU-0922', qty: 20, unit: 'm3', price: 85.50 }
       ]
    },
    {
       id: 'doc4', docNumber: 'PROD-2024-005', type: 'IN', action: 'İstehsaldan Mədaxil', date: '2024-03-29', time: '09:30', warehouse: 'Mərkəzi Anbar (Logistika)', partner: 'İstehsalat Sahəsi', status: 'POSTED',
       items: [
         { product: 'Beton Marka 350', sku: 'SKU-0922', qty: 50, unit: 'm3', price: 85.50 }
       ]
    },
    {
       id: 'doc5', docNumber: 'ADJ-2024-002', type: 'ADJ', action: 'İnventar Tənzimləməsi', date: '2024-03-28', time: '15:10', warehouse: 'Sahə Anbarı 1 (Modern City)', partner: 'Daxili Yoxlama', status: 'POSTED',
       items: [
         { product: 'Xüsusi İşçi Geyimi', sku: 'LVA-001', qty: -2, unit: 'Dəst', price: 45.00 },
         { product: 'Boru 100mm', sku: 'SKU-1092', qty: 5, unit: 'Ədəd', price: 12.00 }
       ]
    }
  ], []);

  // Compute filtering
  const filteredDocs = useMemo(() => {
     return rawDocs.filter((doc) => {
        // Quick search
        if (quickSearch && !(doc.docNumber.toLowerCase().includes(quickSearch.toLowerCase()) || doc.items.some(i => i.product.toLowerCase().includes(quickSearch.toLowerCase())))) return false;
        
        // Advanced filters
        if (searchDocNumber && !doc.docNumber.toLowerCase().includes(searchDocNumber.toLowerCase())) return false;
        if (searchType !== 'ALL' && doc.type !== searchType) return false;
        if (searchWarehouse && !doc.warehouse.toLowerCase().includes(searchWarehouse.toLowerCase())) return false;
        if (searchProduct) {
            const hasMatch = doc.items.some(i => i.product.toLowerCase().includes(searchProduct.toLowerCase()) || i.sku.toLowerCase().includes(searchProduct.toLowerCase()));
            if (!hasMatch) return false;
        }
        if (searchStartDate && doc.date < searchStartDate) return false;
        if (searchEndDate && doc.date > searchEndDate) return false;

        return true;
     });
  }, [rawDocs, quickSearch, searchDocNumber, searchType, searchWarehouse, searchProduct, searchStartDate, searchEndDate]);

  // Aggregation
  const statsInCount = filteredDocs.filter(d => d.type === 'IN').length;
  const statsOutCount = filteredDocs.filter(d => d.type === 'OUT').length;

  const hasActiveFilters = searchDocNumber || searchType !== 'ALL' || searchWarehouse || searchProduct || searchStartDate || searchEndDate;

  const getDocIcon = (type: string) => {
     switch(type) {
         case 'IN': return { icon: ArrowDownLeft, bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'IN' };
         case 'OUT': return { icon: ArrowUpRight, bg: 'bg-rose-50', text: 'text-rose-600', label: 'OUT' };
         case 'TRANSFER': return { icon: ArrowRightLeft, bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'TRF' };
         case 'ADJ': return { icon: Scale, bg: 'bg-amber-50', text: 'text-amber-600', label: 'ADJ' };
         default: return { icon: History, bg: 'bg-slate-50', text: 'text-slate-600', label: type };
     }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap">Stock Ledger Explorer</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap italic tracking-tighter">Inventory Cardex History</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner">Stok Hərəkətləri</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-3">
             <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                   type="text" 
                   placeholder="Sənəd №, İcraçı..." 
                   value={quickSearch}
                   onChange={(e) => setQuickSearch(e.target.value)}
                   className="w-56 pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-black italic shadow-sm focus:border-indigo-500 outline-none uppercase transition-all"
                />
             </div>
             
             <button 
                 onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
                 className={`p-3.5 rounded-2xl shadow-sm transition-all border ${isFilterSidebarOpen || hasActiveFilters ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-y-[-2px] border-indigo-600' : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200'}`}
                 title="Zəngin Süzgəc (Alt + F)"
             >
                 <Filter className="w-4 h-4 leading-none" />
             </button>
             <button className="flex items-center space-x-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm active:scale-95 italic-none border border-transparent">
                 <Download className="w-4 h-4 shadow-inner" />
                 <span>Excel</span>
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
                     onClick={() => { navigate('/purchase/receipt/create'); setIsNewMenuOpen(false); }}
                     className="w-full flex items-center space-x-3 p-4 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-2xl transition-all group"
                   >
                     <div className="p-2 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><ArrowDownLeft className="w-5 h-5"/></div>
                     <div className="text-left">
                       <p className="text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200">Yeni Mədaxil</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase italic">Satınalma və ya daxili</p>
                     </div>
                   </button>
                   <button 
                     onClick={() => { navigate('/inventory/issue/create'); setIsNewMenuOpen(false); }}
                     className="w-full flex items-center space-x-3 p-4 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl transition-all group"
                   >
                     <div className="p-2 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform"><ArrowUpRight className="w-5 h-5"/></div>
                     <div className="text-left">
                       <p className="text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200">Yeni Məxaric</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase italic">Satış və ya silinmə</p>
                     </div>
                   </button>
                   <button 
                     onClick={() => { navigate('/inventory/transfer/create'); setIsNewMenuOpen(false); }}
                     className="w-full flex items-center space-x-3 p-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl transition-all group"
                   >
                     <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform"><ArrowRightLeft className="w-5 h-5"/></div>
                     <div className="text-left">
                       <p className="text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200">Yeni Transfer</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase italic">Anbarlararası yerdəyişmə</p>
                     </div>
                   </button>
                 </div>
               </>
             )}
          </div>
        </div>

      </div>

      {hasActiveFilters && (
         <div className="flex items-center space-x-3 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl text-[10px] uppercase font-black italic border border-indigo-100 shadow-sm transition-all animate-in zoom-in-95 overflow-x-auto">
             <Filter className="w-4 h-4 shrink-0" />
             <span className="shrink-0">Aktiv Süzgəclər:</span>
             {searchDocNumber && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Sənəd: {searchDocNumber}</span>}
             {searchType !== 'ALL' && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Növ: {searchType}</span>}
             {searchWarehouse && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Anbar: {searchWarehouse}</span>}
             {searchProduct && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Mal: {searchProduct}</span>}
             {searchStartDate && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">{searchStartDate} dən</span>}
             {searchEndDate && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">{searchEndDate} dək</span>}
             
             <button onClick={() => { 
                setSearchDocNumber(''); setSearchProduct(''); setSearchWarehouse(''); setSearchType('ALL'); setSearchStartDate(''); setSearchEndDate(''); setIsFilterSidebarOpen(false); setSearchParams({});
             }} className="ml-auto p-1.5 bg-indigo-200/50 rounded-xl hover:bg-indigo-300 transition-colors shrink-0">
               <X className="w-3.5 h-3.5"/>
             </button>
         </div>
      )}

      {/* CARDEX ACCORDION TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden italic-none">
        
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center italic-none">
            <div className="flex items-center space-x-4 italic-none shadow-inner">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 italic-none">
                    <History className="w-5 h-5 shadow-inner" />
                </div>
                <div className="italic-none shadow-inner">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner whitespace-nowrap italic tracking-tighter">Hərəkət Sənədləri (Cardex)</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-0.5 tracking-tighter">ANBAR JURNALI - SƏNƏD SƏVİYYƏSİNDƏ BAXIŞ</p>
                </div>
            </div>
            <div className="flex items-center space-x-3 italic-none">
                <div className="flex items-center space-x-1 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner border border-emerald-100">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Mədaxil: {statsInCount}</span>
                </div>
                <div className="flex items-center space-x-1 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner border border-rose-100">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Məxaric: {statsOutCount}</span>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto italic-none shadow-inner p-4">
          <table className="w-full text-left italic-none shadow-inner tabular-nums font-black italic shadow-inner">
            <thead className="bg-slate-50 dark:bg-slate-800/50 italic-none shadow-inner tabular-nums font-black italic shadow-inner">
              <tr className="italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                <th className="px-8 py-5 w-16 rounded-l-2xl"></th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner">Əməliyyat / Təyinat</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner">Sənəd / Tarix</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner">Anbar (Məkan) / Tərəfdaş</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center shadow-inner">Daşınma (Sətir)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right shadow-inner rounded-r-2xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none shadow-inner">
              {filteredDocs.length === 0 ? (
                 <tr><td colSpan={6} className="py-20 text-center font-bold text-slate-400 italic font-black">Sorğunuza uyğun sənəd tapılmadı</td></tr>
              ) : filteredDocs.map((doc) => {
                 const isExpanded = expandedRows.includes(doc.id);
                 const conf = getDocIcon(doc.type);
                 const DIcon = conf.icon;
                 
                 return (
                    <React.Fragment key={doc.id}>
                       <tr onClick={() => toggleRow(doc.id)} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-all ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/40' : ''}`}>
                          <td className="px-8 py-6 text-center">
                              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-indigo-500' : ''}`} />
                          </td>
                          
                          <td className="px-6 py-6 italic-none shadow-inner">
                             <div className="flex items-center space-x-4 italic-none shadow-inner">
                                <div className={`p-3 rounded-xl ${conf.bg} ${conf.text}`}>
                                   <DIcon className="w-5 h-5" />
                                </div>
                                <div className="shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                                   <p className="text-xs font-black italic text-slate-800 dark:text-white uppercase tracking-tight shadow-inner">{doc.action}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-1 tracking-widest">{conf.label}</p>
                                </div>
                             </div>
                          </td>
                          
                          <td className="px-6 py-6 italic-none shadow-inner">
                             <div className="flex flex-col italic-none shadow-inner">
                                <span className="text-[11px] font-black italic text-indigo-600 uppercase tracking-tight shadow-inner mb-1.5 underline decoration-indigo-500/20 underline-offset-2">{doc.docNumber}</span>
                                <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">
                                   <span>{doc.date}</span>
                                   <span>•</span>
                                   <span>{doc.time}</span>
                                </div>
                             </div>
                          </td>
                          
                          <td className="px-6 py-6 italic-none shadow-inner">
                             <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 italic-none shadow-inner mb-1.5">
                                 <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                 <span className="text-[11px] font-black uppercase tracking-tight italic">{doc.warehouse}</span>
                             </div>
                             <div className="flex items-center space-x-2 text-slate-500 italic-none shadow-inner">
                                 <Store className="w-3.5 h-3.5 text-slate-300" />
                                 <span className="text-[9px] font-bold uppercase tracking-widest italic">{doc.partner}</span>
                             </div>
                          </td>

                          <td className="px-6 py-6 text-center italic-none shadow-inner">
                              <span className="text-xs font-black text-slate-600 px-3 py-1 bg-slate-100 rounded-xl shadow-inner">{doc.items.length} Növ Mal</span>
                          </td>

                          <td className="px-8 py-6 text-right italic-none shadow-inner">
                             <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic shadow-sm ${
                                doc.status === 'POSTED' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-700'
                             }`}>{doc.status}</span>
                          </td>
                       </tr>
                       
                       {/* NESTED CONTENT */}
                       {isExpanded && (
                          <tr>
                             <td colSpan={6} className="p-0">
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 shadow-inner">
                                   <table className="w-full text-left bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                                      <thead>
                                          <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 bg-[#FAFBFD] dark:bg-slate-800/80">
                                              <th className="px-8 py-4 w-12 text-center">#</th>
                                              <th className="px-6 py-4">Malın Adı / SKU</th>
                                              <th className="px-6 py-4 text-center">Ölçü Vahidi</th>
                                              <th className="px-6 py-4 text-right">Vahid Q.</th>
                                              <th className="px-6 py-4 text-right pr-6">Miqdar (Gediş)</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                          {doc.items.map((item: any, i: number) => {
                                              const qStr = item.qty > 0 ? `+${item.qty}` : item.qty.toString();
                                              const qColor = item.qty > 0 ? 'text-emerald-500' : 'text-rose-500';
                                              return (
                                                  <tr key={i} className="group/child hover:bg-slate-50/50 transition-all">
                                                      <td className="px-8 py-5 text-center text-[10px] font-black text-slate-300 tabular-nums">{i + 1}</td>
                                                      <td className="px-6 py-5">
                                                          <div className="flex items-center space-x-3">
                                                             <Package className="w-4 h-4 text-slate-300" />
                                                             <div className="text-slate-700 dark:text-slate-200">
                                                                <p className="text-[11px] font-black uppercase tracking-tight italic">{item.product}</p>
                                                                <p className="text-[9px] text-slate-400 font-bold tracking-tighter uppercase">{item.sku}</p>
                                                             </div>
                                                          </div>
                                                      </td>
                                                      <td className="px-6 py-5 text-center">
                                                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md">{item.unit}</span>
                                                      </td>
                                                      <td className="px-6 py-5 text-right font-black italic tabular-nums text-slate-500 text-xs shadow-inner">
                                                          {item.price.toFixed(2)} ₼
                                                      </td>
                                                      <td className={`px-6 py-5 text-right pr-6 font-black italic tabular-nums text-lg shadow-inner ${qColor}`}>
                                                          {qStr}
                                                      </td>
                                                  </tr>
                                              );
                                          })}
                                      </tbody>
                                   </table>
                                </div>
                             </td>
                          </tr>
                       )}
                    </React.Fragment>
                 );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StockMoves;
