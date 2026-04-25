import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowRightLeft, Search, AlertCircle, 
  Package, Filter, Download, 
  TrendingDown, TrendingUp, Layers, Box,
  History, MapPin, ChevronRight, X, Grid,
  ChevronDown, Archive, Columns, Calendar, HardDrive, Tag
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { inventoryApi } from '../utils/api';

const Inventory = () => {
  const navigate = useNavigate();
  
  const { activeCompany } = useCompany();
  
  // Context for global sidebar filter
  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();

  // Filter States
  const [searchWarehouse, setSearchWarehouse] = useState('');
  const [searchSku, setSearchSku] = useState('');
  const [searchCat, setSearchCat] = useState('');
  const [searchSubCat, setSearchSubCat] = useState('');
  const [searchUnit, setSearchUnit] = useState('');
  const [searchSize, setSearchSize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Quick Search for top bar
  const [quickSearch, setQuickSearch] = useState('');

  // Data State
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data
  const fetchData = async () => {
    if (!activeCompany) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.getItems({ 
        companyId: activeCompany.id,
        categoryId: searchCat,
        subCategoryId: searchSubCat
      });
      // API may return { data: [...] } or just [...]
      const data = response.data || response;
      setItems(data.map((item: any) => ({
        id: item.id,
        name: item.name,
        sku: item.code || item.sku,
        cat: item.category?.name || item.cat || 'Kateqoriyasız',
        subCat: item.subCategory?.name || item.subCat || '-',
        unit: item.unit || 'ədəd',
        size: item.size || '-',
        batch: item.batch || 'PARTİYA-X',
        warehouse: item.warehouse?.name || item.warehouse || 'Mərkəzi Anbar',
        qty: item.stockQuantity || item.qty || 0,
        price: item.price || 0,
        opening: item.openingStock || item.opening || 0,
        in: item.inQty || item.in || 0,
        out: item.outQty || item.out || 0
      })));
    } catch (err: any) {
      console.error('Failed to fetch inventory:', err);
      setError('Məlumatlar yüklənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCompany, searchCat, searchSubCat]);

  // Grouping Mode
  const [groupMode, setGroupMode] = useState<'PRODUCT' | 'WAREHOUSE'>('PRODUCT');

  // Expansion Tracking
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
      setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

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

  // Sidebar Filter Content
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-20 text-slate-900 dark:text-slate-100">
           <div className="space-y-4 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic flex items-center mb-2">
                    <Calendar className="w-3.5 h-3.5 mr-2" /> Tarix Aralığı (Analitika)
                </label>
                <div className="space-y-3">
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-[11px] font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-[11px] font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center">
                <HardDrive className="w-3.5 h-3.5 mr-2" /> Anbar Seç
              </label>
              <select 
                 value={searchWarehouse}
                 onChange={(e) => setSearchWarehouse(e.target.value)}
                 className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase appearance-none"
              >
                 <option value="">Bütün Anbarlar</option>
                 <option value="Mərkəzi Anbar">Mərkəzi Anbar</option>
                 <option value="Sahə Anbarı 1">Sahə Anbarı 1</option>
                 <option value="Zavod Anbarı">Zavod Anbarı</option>
                 <option value="Logistika Hub">Logistika Hub</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-2" /> Məhsul / SKU Axtar
              </label>
              <input 
                 type="text" 
                 value={searchSku}
                 onChange={(e) => setSearchSku(e.target.value)} 
                 placeholder="Məsələn: SKU-1004..."
                 className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 pb-2 block">Kateqoriya</label>
                 <input 
                    type="text" 
                    value={searchCat}
                    onChange={(e) => setSearchCat(e.target.value)} 
                    placeholder="Tikinti..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 pb-2 block">Alt Kat.</label>
                 <input 
                    type="text" 
                    value={searchSubCat}
                    onChange={(e) => setSearchSubCat(e.target.value)} 
                    placeholder="Armatur..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
                 />
              </div>
           </div>

           <div className="pt-6">
             <button 
               onClick={() => {
                 setSearchWarehouse('');
                 setSearchSku('');
                 setSearchCat('');
                 setSearchSubCat('');
                 setSearchUnit('');
                 setSearchSize('');
                 setStartDate('');
                 setEndDate('');
               }}
               className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700 italic"
             >
               Filtrləri Sıfırla
             </button>
           </div>
        </div>
      );
    }
  }, [isFilterSidebarOpen, searchWarehouse, searchSku, searchCat, searchSubCat, searchUnit, searchSize, startDate, endDate, setFilterSidebarContent]);

  // Raw Inventory Data
  const rawLedger = useMemo(() => [
    { id: 1, name: 'Armatur A500C 12mm', sku: 'SKU-1004', cat: 'Tikinti Mat.', subCat: 'Armaturlar', unit: 'Ton', size: '12mm', batch: 'B2024-001', warehouse: 'Mərkəzi Anbar', qty: 300, price: 920, opening: 250, in: 100, out: 50 },
    { id: 2, name: 'Armatur A500C 12mm', sku: 'SKU-1004', cat: 'Tikinti Mat.', subCat: 'Armaturlar', unit: 'Ton', size: '12mm', batch: 'B2024-002', warehouse: 'Sahə Anbarı 1', qty: 150, price: 920, opening: 0, in: 200, out: 50 },
    { id: 3, name: 'Sement Akkord M-400', sku: 'SKU-2041', cat: 'Tikinti Mat.', subCat: 'Sement', unit: 'Ton', size: '50kq', batch: 'B2024-042', warehouse: 'Mərkəzi Anbar', qty: 12, price: 115, opening: 5, in: 10, out: 3 },
    { id: 4, name: 'Beton Marka 350', sku: 'SKU-0922', cat: 'İstehsal', subCat: 'Betonlar', unit: 'm3', size: 'Standart', batch: '202403-LX', warehouse: 'Zavod Anbarı', qty: 120, price: 85.50, opening: 50, in: 100, out: 30 },
    { id: 5, name: 'Xüsusi İşçi Geyimi', sku: 'LVA-001', cat: 'ATƏ', subCat: 'Geyim', unit: 'Dəst', size: 'L', batch: 'W-2024', warehouse: 'Logistika Hub', qty: 240, price: 45, opening: 100, in: 200, out: 60 },
    { id: 6, name: 'Kərpic 8x8x16', sku: 'SKU-503', cat: 'Tikinti Mat.', subCat: 'Hörgülər', unit: 'Ədəd', size: 'Xırda', batch: 'B2024-111', warehouse: 'Sahə Anbarı 1', qty: 12500, price: 0.35, opening: 5000, in: 10000, out: 2500 }
  ], []);

  // Filter the ledger
  const filteredLedger = useMemo(() => {
     return items.filter(item => {
         if (quickSearch && !(item.name.toLowerCase().includes(quickSearch.toLowerCase()) || item.sku.toLowerCase().includes(quickSearch.toLowerCase()))) return false;
         if (searchWarehouse && !item.warehouse.toLowerCase().includes(searchWarehouse.toLowerCase())) return false;
         if (searchSku && !(item.name.toLowerCase().includes(searchSku.toLowerCase()) || item.sku.toLowerCase().includes(searchSku.toLowerCase()))) return false;
         // Category and SubCategory filters are now handled by API fetch
         if (searchUnit && !item.unit.toLowerCase().includes(searchUnit.toLowerCase())) return false;
         if (searchSize && !item.size.toLowerCase().includes(searchSize.toLowerCase())) return false;
         return true;
     });
  }, [items, quickSearch, searchWarehouse, searchSku, searchUnit, searchSize]);

  // Group Data
  const groupedData = useMemo(() => {
     if (groupMode === 'PRODUCT') {
         const groups = new Map<string, any>();
         filteredLedger.forEach(item => {
             const key = item.sku;
             if (!groups.has(key)) {
                 groups.set(key, { 
                     id: `prod_${item.sku}`, 
                     main: { name: item.name, sku: item.sku, cat: item.cat, subCat: item.subCat, unit: item.unit, size: item.size },
                     totalQty: 0,
                     totalValue: 0,
                     opening: 0, in: 0, out: 0,
                     children: [] 
                 });
             }
             const g = groups.get(key);
             g.totalQty += item.qty;
             g.totalValue += (item.qty * item.price);
             g.opening += (item.opening || 0);
             g.in += (item.in || 0);
             g.out += (item.out || 0);
             g.children.push({ ...item });
         });
         return Array.from(groups.values());
     } else {
         const groups = new Map<string, any>();
         filteredLedger.forEach(item => {
             const key = item.warehouse;
             if (!groups.has(key)) {
                 groups.set(key, { 
                     id: `wh_${item.warehouse}`, 
                     main: { warehouse: item.warehouse },
                     totalQty: 0,
                     totalValue: 0,
                     opening: 0, in: 0, out: 0,
                     prodCount: new Set(),
                     children: [] 
                 });
             }
             const g = groups.get(key);
             g.totalQty += item.qty;
             g.totalValue += (item.qty * item.price);
             g.opening += (item.opening || 0);
             g.in += (item.in || 0);
             g.out += (item.out || 0);
             g.prodCount.add(item.sku);
             g.children.push({ ...item });
         });
         return Array.from(groups.values()).map(g => ({...g, distinctProducts: g.prodCount.size}));
     }
  }, [filteredLedger, groupMode]);

  const stats = [
    { label: 'Cəmi Stok Dəyəri', value: '₼ 2,450,800', change: '+12.5%', icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Aktiv Anbarlar', value: '12 Məkan', change: '-1 (Qapalı)', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Hərəkətsiz Mallar', value: '18 Növ', change: 'Kritik İzləmə', icon: Archive, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Ehtiyac Yarananlar (PO)', value: '₼ 450,000', change: '5 Sifariş', icon: History, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const hasActiveFilters = searchWarehouse || searchSku || searchCat || searchSubCat || searchUnit || searchSize || startDate || endDate;

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER AREA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner">Warehouse Ops</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Real-time Stock Ledger</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner">Anbar Stok Reyestri</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-3">
             <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                   type="text" 
                   placeholder="Məhsul və ya SKU..." 
                   value={quickSearch}
                   onChange={(e) => setQuickSearch(e.target.value)}
                   className="w-56 pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-black italic shadow-sm focus:border-indigo-500 outline-none uppercase transition-all"
                />
             </div>
             
             <button 
                 onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
                 className={`p-3.5 rounded-2xl shadow-sm transition-all border ${isFilterSidebarOpen || hasActiveFilters ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-y-[-2px] border-indigo-600' : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200 shadow-sm'}`}
                 title="Zəngin Süzgəc (Alt + F)"
             >
                 <Filter className="w-4 h-4 leading-none" />
             </button>
          </div>

          <button onClick={() => navigate('/inventory/transfer/create')} className="flex items-center space-x-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 active:scale-95 italic-none">
            <ArrowRightLeft className="w-4 h-4 shadow-inner" />
            <span>Yerdəyişmə İşləmi</span>
          </button>
        </div>
      </div>

      {hasActiveFilters && (
         <div className="flex items-center space-x-3 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl text-[10px] uppercase font-black italic border border-indigo-100 shadow-sm transition-all animate-in zoom-in-95 overflow-x-auto">
             <Filter className="w-4 h-4 shrink-0" />
             <span className="shrink-0">Aktiv Süzgəclər:</span>
             {startDate && endDate && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Dövr: {startDate} / {endDate}</span>}
             {searchWarehouse && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Anbar: {searchWarehouse}</span>}
             {searchSku && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Mal/SKU: {searchSku}</span>}
             
             <button onClick={() => { 
                setSearchWarehouse(''); setSearchSku(''); setSearchCat(''); setSearchSubCat(''); setSearchUnit(''); setSearchSize(''); setStartDate(''); setEndDate(''); setIsFilterSidebarOpen(false); 
             }} className="ml-auto p-1.5 bg-indigo-200/50 rounded-xl hover:bg-indigo-300 transition-colors shrink-0">
               <X className="w-3.5 h-3.5"/>
             </button>
         </div>
      )}

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden relative italic-none">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity italic-none">
                <stat.icon className="w-20 h-20" />
            </div>
            <div className="flex items-center justify-between mb-4 italic-none">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner italic-none`}>
                <stat.icon className="w-5 h-5 shadow-inner" />
              </div>
              <div className="flex items-center space-x-1 italic-none">
                 <span className={`text-[10px] font-black uppercase tracking-tighter ${stat.change.includes('-') ? 'text-rose-500' : 'text-emerald-500'}`}>{stat.change}</span>
                 {stat.change.includes('-') ? <TrendingDown className="w-3 h-3 text-rose-500" /> : <TrendingUp className="w-3 h-3 text-emerald-500" />}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1 shadow-inner">{stat.label}</p>
            <h3 className="text-xl font-black text-slate-800 dark:text-white tabular-nums italic shadow-inner whitespace-nowrap">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* TABS - GROUPING MODE */}
      <div className="flex items-center space-x-2 p-1.5 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
         <button 
             onClick={() => { setGroupMode('PRODUCT'); setExpandedRows([]); }}
             className={`flex items-center space-x-2 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${groupMode === 'PRODUCT' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <Package className="w-4 h-4"/>
            <span>Məhsula Görə Qrup</span>
         </button>
         <button 
             onClick={() => { setGroupMode('WAREHOUSE'); setExpandedRows([]); }}
             className={`flex items-center space-x-2 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${groupMode === 'WAREHOUSE' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <MapPin className="w-4 h-4"/>
            <span>Anbara Görə Qrup</span>
         </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden italic-none">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center italic-none">
            <div className="flex items-center space-x-4 italic-none shadow-inner">
                <div className={`w-10 h-10 ${groupMode === 'PRODUCT' ? 'bg-indigo-600 shadow-indigo-500/30' : 'bg-blue-600 shadow-blue-500/30'} rounded-2xl flex items-center justify-center text-white shadow-lg italic-none`}>
                    <Columns className="w-5 h-5 shadow-inner" />
                </div>
                <div className="italic-none shadow-inner">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner">Stok Baza Cədvəli</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-0.5 tracking-tighter">
                        {groupMode === 'PRODUCT' ? 'MƏHSULLARA VƏ KATALOGA GÖRƏ SİYAHI' : 'ANBAR VƏ MƏKANLARA GÖRƏ STOK DAĞILIMI'}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-3 italic-none">
                <button className="hidden sm:flex items-center space-x-2 px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:text-primary-600 transition-colors italic-none tracking-tighter shadow-inner">
                    <Download className="w-4 h-4 shadow-inner" />
                    <span>Eksport</span>
                </button>
            </div>
        </div>

        <div className="overflow-x-auto italic-none shadow-inner p-4">
          <table className="w-full text-left italic-none shadow-inner tabular-nums font-black italic shadow-inner">
            <thead className="bg-slate-50 dark:bg-slate-800/50 italic-none shadow-inner tabular-nums font-black italic shadow-inner">
              <tr className="italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                <th className="px-8 py-5 w-16 rounded-l-2xl"></th>
                {groupMode === 'PRODUCT' ? (
                   <>
                     <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner">Məhsul Detalları</th>
                     <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner">Kat / Ölçü / Vahid</th>
                   </>
                ) : (
                   <>
                     <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner">Anbar (Məkan)</th>
                     <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner text-center">Növ / Rate</th>
                   </>
                )}
                
                {startDate && endDate ? (
                    <>
                        <th className="px-6 py-5 text-center text-amber-600 bg-amber-50/50 border-x border-white font-black italic">Əvvəlki Qalıq</th>
                        <th className="px-6 py-5 text-center text-emerald-600 bg-emerald-50/50 border-x border-white font-black italic">Giriş (+)</th>
                        <th className="px-6 py-5 text-center text-rose-600 bg-rose-50/50 border-x border-white font-black italic">Çıxış (-)</th>
                        <th className="px-6 py-5 text-center text-indigo-600 bg-indigo-50/50 rounded-r-2xl font-black italic shadow-lg">Son Qalıq</th>
                    </>
                ) : (
                    <>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center shadow-inner">Ümumi Qalıq</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right shadow-inner rounded-r-2xl">Cəmi Məbləğ</th>
                    </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none shadow-inner">
              {isLoading ? (
                 <tr><td colSpan={startDate && endDate ? 7 : 5} className="py-20 text-center font-bold text-slate-400 italic animate-pulse">Məlumatlar Yüklenir...</td></tr>
              ) : error ? (
                 <tr><td colSpan={startDate && endDate ? 7 : 5} className="py-20 text-center font-bold text-rose-400 italic">{error}</td></tr>
              ) : groupedData.length === 0 ? (
                 <tr><td colSpan={startDate && endDate ? 7 : 5} className="py-20 text-center font-bold text-slate-400 italic font-black">Sorğunuza uyğun stok məlumatı tapılmadı</td></tr>
              ) : groupedData.map((group) => {
                 const isExpanded = expandedRows.includes(group.id);
                 return (
                    <React.Fragment key={group.id}>
                       <tr onClick={() => toggleRow(group.id)} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-all ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/40' : ''}`}>
                          <td className="px-8 py-6 text-center">
                              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-indigo-500' : ''}`} />
                          </td>
                          {groupMode === 'PRODUCT' ? (
                             <>
                                <td className="px-6 py-6 italic-none shadow-inner">
                                   <div className="flex items-center space-x-4 italic-none shadow-inner">
                                      <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 ${isExpanded ? 'bg-indigo-50 text-indigo-600' : ''}`}>
                                         <Package className="w-5 h-5" />
                                      </div>
                                      <div className="shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                                         <p className="text-sm font-black italic text-slate-800 dark:text-white uppercase tracking-tight shadow-inner">{group.main.name}</p>
                                         <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-0.5 tracking-tighter">{group.main.sku}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-6 italic-none shadow-inner">
                                   <p className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase leading-none shadow-inner mb-1.5">{group.main.cat} • {group.main.subCat}</p>
                                   <div className="flex items-center space-x-2">
                                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest italic">{group.main.unit}</span>
                                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest italic">{group.main.size || '-'}</span>
                                   </div>
                                </td>
                             </>
                          ) : (
                             <>
                                <td className="px-6 py-6 italic-none shadow-inner">
                                   <div className="flex items-center space-x-4 italic-none shadow-inner">
                                      <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 ${isExpanded ? 'bg-blue-50 text-blue-600' : ''}`}>
                                         <MapPin className="w-5 h-5" />
                                      </div>
                                      <div className="shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                                         <p className="text-sm font-black italic text-slate-800 dark:text-white uppercase tracking-tight shadow-inner">{group.main.warehouse}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-6 text-center italic-none shadow-inner">
                                    <span className="text-xs font-black text-slate-600 px-3 py-1 bg-slate-100 rounded-xl">{group.distinctProducts} Növ Mal</span>
                                </td>
                             </>
                          )}

                          {startDate && endDate ? (
                            <>
                                <td className="px-6 py-6 text-center font-black italic tabular-nums text-amber-600 bg-amber-50/20">{group.opening}</td>
                                <td className="px-6 py-6 text-center font-black italic tabular-nums text-emerald-600 bg-emerald-50/20">{group.in}</td>
                                <td className="px-6 py-6 text-center font-black italic tabular-nums text-rose-600 bg-rose-50/20">{group.out}</td>
                                <td className="px-6 py-6 text-center font-black italic tabular-nums text-indigo-600 bg-indigo-50/20 shadow-inner">{group.totalQty}</td>
                            </>
                          ) : (
                            <>
                                <td className="px-6 py-6 text-center italic-none shadow-inner">
                                    <span className="text-base font-black italic tabular-nums text-slate-800 dark:text-white">{group.totalQty}</span>
                                </td>
                                <td className="px-8 py-6 text-right italic-none shadow-inner">
                                    <span className="text-lg font-black italic tabular-nums text-indigo-600">₼ {group.totalValue.toLocaleString('az-AZ', {minimumFractionDigits: 2})}</span>
                                </td>
                            </>
                          )}
                       </tr>
                       
                       {/* NESTED CONTENT */}
                       {isExpanded && (
                          <tr>
                             <td colSpan={startDate && endDate ? 7 : 5} className="p-0">
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 shadow-inner">
                                   <table className="w-full text-left bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                                      <thead>
                                          <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 bg-[#FAFBFD] dark:bg-slate-800/80">
                                              <th className="px-6 py-4 w-12 text-center">#</th>
                                              <th className="px-6 py-4">{groupMode === 'PRODUCT' ? 'Ait olduğu Anbar' : 'Malın Adı / SKU'}</th>
                                              {groupMode === 'WAREHOUSE' && <th className="px-6 py-4 text-center">Kat / Ölçü</th>}
                                              <th className="px-6 py-4 text-center">Partiya (Batch)</th>
                                              <th className="px-6 py-4 text-right">Vahid Q.</th>
                                              {startDate && endDate ? (
                                                  <>
                                                    <th className="px-4 py-4 text-center text-amber-500">Əvvəl</th>
                                                    <th className="px-4 py-4 text-center text-emerald-500">Giriş</th>
                                                    <th className="px-4 py-4 text-center text-rose-500">Çıxış</th>
                                                  </>
                                              ) : null}
                                              <th className="px-6 py-4 text-right">Qalıq / Say</th>
                                              <th className="px-6 py-4 text-right pr-6">Məbləğ</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                          {group.children.map((child: any, i: number) => (
                                              <tr key={i} className="group/child hover:bg-slate-50/50 transition-all">
                                                  <td className="px-6 py-5 text-center text-[10px] font-black text-slate-300 tabular-nums">{i + 1}</td>
                                                  <td className="px-6 py-5">
                                                     {groupMode === 'PRODUCT' ? (
                                                        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-xs font-black uppercase italic tracking-tighter">
                                                           <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                           <span>{child.warehouse}</span>
                                                        </div>
                                                     ) : (
                                                        <div className="text-slate-700 dark:text-slate-200">
                                                           <p className="text-[11px] font-black uppercase tracking-tight italic">{child.name}</p>
                                                           <p className="text-[9px] text-slate-400 font-bold tracking-tighter uppercase">{child.sku}</p>
                                                        </div>
                                                     )}
                                                  </td>
                                                  {groupMode === 'WAREHOUSE' && (
                                                     <td className="px-6 py-5 text-center">
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">{child.cat} • {child.size || child.unit}</span>
                                                     </td>
                                                  )}
                                                  <td className="px-6 py-5 text-center">
                                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{child.batch}</span>
                                                  </td>
                                                  <td className="px-6 py-5 text-right font-black italic tabular-nums text-slate-500 text-xs shadow-inner">
                                                      {child.price.toFixed(2)} ₼
                                                  </td>
                                                  {startDate && endDate ? (
                                                      <>
                                                        <td className="px-4 py-5 text-center font-black italic text-amber-500/70 text-[10px]">{child.opening}</td>
                                                        <td className="px-4 py-5 text-center font-black italic text-emerald-500/70 text-[10px]">{child.in}</td>
                                                        <td className="px-4 py-5 text-center font-black italic text-rose-500/70 text-[10px]">{child.out}</td>
                                                      </>
                                                  ) : null}
                                                  <td className="px-6 py-5 text-right font-black italic tabular-nums text-slate-700 dark:text-slate-200 shadow-inner">
                                                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded mr-1 text-[9px]">{child.unit}</span>
                                                      {child.qty}
                                                  </td>
                                                  <td className="px-6 py-5 text-right pr-6 font-black italic tabular-nums text-indigo-500 shadow-inner">
                                                      {(child.qty * child.price).toLocaleString('az-AZ', {minimumFractionDigits: 2})} ₼
                                                  </td>
                                              </tr>
                                          ))}
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

export default Inventory;
