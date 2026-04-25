import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Plus, Search, Package, Layers, Settings, 
  ChevronRight, Folder, FileText, Hammer, Headset,
  Filter, MoreVertical, Edit3, Trash2, Info,
  AlertCircle, LayoutGrid, List as ListIcon,
  ChevronDown, PlusCircle, Bookmark, Construction, ChevronLeft, MapPin, 
  Home, User, X, Activity, Truck
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { inventoryApi } from '../../utils/api';
import NomenclatureMasterCard from './NomenclatureMasterCard';
import NomenclatureCategoryModal from './NomenclatureCategoryModal';
import { useSearchParams } from 'react-router-dom';

const NomenclatureList = () => {
  const { activeCompany } = useCompany();
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'MATERIAL' | 'SERVICE' | 'WORK'>('ALL');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isWarehouseFilterOpen, setIsWarehouseFilterOpen] = useState(false);
  const [showByWarehouse, setShowByWarehouse] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const [reservations, setReservations] = useState<any[]>(() => {
    const saved = localStorage.getItem('erp_item_reservations');
    return saved ? JSON.parse(saved) : [
      { id: 'r1', itemId: 'mock1', warehouseId: '1', zoneId: 's1', amount: 24, customerName: 'Bravo Supermarket', isIndefinite: true },
      { id: 'r2', itemId: 'mock2', warehouseId: '1', zoneId: 's2', amount: 50, customerName: 'Paşa İnşaat', expiryDate: '2026-05-15', isIndefinite: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('erp_item_reservations', JSON.stringify(reservations));
  }, [reservations]);

  const [isBronModalOpen, setIsBronModalOpen] = useState(false);
  const [bronItem, setBronItem] = useState<any>(null);

  // Load warehouses from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('erp_warehouses');
    if (saved) {
      setWarehouses(JSON.parse(saved));
    }
  }, []);

  // Handle URL Param for Warehouses
  useEffect(() => {
    const whParam = searchParams.get('warehouses');
    if (whParam) {
      const ids = whParam.split(',');
      setSelectedWarehouses(ids);
      // Reset categories/tabs if navigated from warehouse list
      setSelectedCategoryId(null);
      setSelectedSubCategoryId(null);
      setActiveTab('ALL');
    }
  }, [searchParams]);

  const toggleWarehouse = (id: string) => {
    setSelectedWarehouses(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      // Update URL
      if (next.length > 0) {
        searchParams.set('warehouses', next.join(','));
      } else {
        searchParams.delete('warehouses');
      }
      setSearchParams(searchParams);
      return next;
    });
  };
  // Modal States
  const [showMasterCard, setShowMasterCard] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { 
    isFilterSidebarOpen, 
    setIsFilterSidebarOpen, 
    setFilterSidebarContent 
  } = useOutletContext<any>();
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [parentForSub, setParentForSub] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    type: 'ALL',
    sku: '',
    uom: '',
    minStock: '',
    maxStock: ''
  });

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Alt + N: Yeni Nomenklatura
        if (e.altKey && e.code === 'KeyN') {
            e.preventDefault();
            setSelectedItem(null);
            setShowMasterCard(true);
        }
        // Alt + F: Filtr
        if (e.altKey && e.code === 'KeyF') {
            e.preventDefault();
            setIsFilterSidebarOpen((prev: boolean) => !prev);
        }
        // Alt + A: Axtarışa fokuslan
        if (e.altKey && e.code === 'KeyA') {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="Ad, SKU"]') as HTMLInputElement;
            if (searchInput) searchInput.focus();
        }
        if (e.key === 'Escape') {
            setShowMasterCard(false);
            setShowCategoryModal(false);
            setIsFilterSidebarOpen(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsFilterSidebarOpen]);

  // Update Filter Sidebar Content
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-300">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Məhsul Tipi</h4>
            <div className="grid grid-cols-2 gap-2">
              {['ALL', 'MATERIAL', 'SERVICE', 'WORK'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilters({ ...filters, type: t })}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all ${filters.type === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                >
                  {t === 'ALL' ? 'HAMISI' : t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">SKU / Kod</h4>
            <input 
              type="text" 
              placeholder="SKU daxil edin..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={filters.sku}
              onChange={(e) => setFilters({ ...filters, sku: e.target.value })}
            />
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Stok Miqdarı</h4>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Min"
                className="w-1/2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={filters.minStock}
                onChange={(e) => setFilters({ ...filters, minStock: e.target.value })}
              />
              <input 
                type="number" 
                placeholder="Max"
                className="w-1/2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={filters.maxStock}
                onChange={(e) => setFilters({ ...filters, maxStock: e.target.value })}
              />
            </div>
          </div>

          <button 
             onClick={() => setFilters({ type: 'ALL', sku: '', uom: '', minStock: '', maxStock: '' })}
             className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all italic border border-slate-200 dark:border-slate-700"
          >
             Filtrləri Sıfırla
          </button>
        </div>
      );
    }
  }, [isFilterSidebarOpen, filters, setFilterSidebarContent]);

  const fetchData = async () => {
    if (!activeCompany) return;
    setIsLoading(true);
    try {
      const cats = await inventoryApi.getCategories(activeCompany.id);
      setCategories(cats);
      
      const res = await inventoryApi.getItems({ 
        companyId: activeCompany.id,
        categoryId: selectedCategoryId || undefined,
        subCategoryId: selectedSubCategoryId || undefined,
      });
      
      // Handle both { data: [] } and [] formats
      let data = res?.data || res || [];
      
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCompany?.id, selectedCategoryId, selectedSubCategoryId, activeTab]);

  const toggleCat = (id: string) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'SERVICE': return <Headset className="w-4 h-4 text-sky-500" />;
      case 'WORK': return <Hammer className="w-4 h-4 text-amber-500" />;
      case 'CONSTRUCTION': return <Construction className="w-4 h-4 text-rose-500" />;
      default: return <Package className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleDeleteCategory = async (id: string, isSub: boolean) => {
    if (!activeCompany || !window.confirm('Bu kateqoriyanı silmək istədiyinizə əminsiniz?')) return;
    try {
      if (isSub) {
        await inventoryApi.deleteSubCategory(id, activeCompany.id);
      } else {
        await inventoryApi.deleteCategory(id, activeCompany.id);
      }
      fetchData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message;
      alert(errorMsg);
    }
  };

  const filteredCategories = categories.filter(cat => 
    activeTab === 'ALL' || cat.type === activeTab
  );

  return (
    <div className="flex bg-white dark:bg-slate-900 min-h-screen -m-8 relative overflow-hidden">
      
      {/* SIDEBAR TREE VIEW */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} border-r border-slate-100 dark:border-slate-800 flex flex-col pt-8 transition-all duration-300 relative bg-white dark:bg-slate-900 z-10`}>
        <div className={`px-8 mb-8 flex items-center justify-between ${!isSidebarOpen && 'opacity-0 whitespace-nowrap overflow-hidden'}`}>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest italic flex items-center leading-none">
               <Layers className="w-4 h-4 mr-2 text-indigo-500" /> Kateqoriyalar
            </h2>
            <button 
                onClick={() => { setParentForSub(null); setEditingCategory(null); setShowCategoryModal(true); }}
                className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all active:scale-95"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>

        <div className={`flex-1 overflow-y-auto px-4 space-y-2 ${!isSidebarOpen && 'opacity-0 whitespace-nowrap overflow-hidden'}`}>
            <button 
                onClick={() => { setSelectedCategoryId(null); setSelectedSubCategoryId(null); }}
                className={`w-full flex items-center px-4 py-3 rounded-2xl text-[11px] font-black uppercase italic transition-all ${(!selectedSubCategoryId && !selectedCategoryId) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <Bookmark className="w-4 h-4 mr-3" />
                <span>Bütün Nomenklatura</span>
            </button>

            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 mx-4 my-4"></div>

            {filteredCategories.map((cat: any) => (
                <div key={cat.id} className="space-y-1">
                    <div className={`group flex items-center justify-between pr-4 rounded-2xl transition-all ${selectedCategoryId === cat.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}`}>
                        <button 
                            onClick={() => {
                                toggleCat(cat.id);
                                setSelectedCategoryId(cat.id);
                                setSelectedSubCategoryId(null);
                            }}
                            className="flex-1 flex items-center px-4 py-3 text-slate-700 dark:text-slate-200 overflow-hidden"
                        >
                            <Folder className={`w-4 h-4 mr-3 flex-shrink-0 ${expandedCats.includes(cat.id) ? 'text-indigo-500' : 'text-slate-400'}`} />
                            <span className={`text-[11px] font-black uppercase italic tracking-tighter truncate ${selectedCategoryId === cat.id ? 'text-indigo-600' : ''}`}>{cat.name}</span>
                        </button>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); setParentForSub(null); setShowCategoryModal(true); }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600"
                            >
                                <Edit3 className="w-3 h-3" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, false); }}
                                className="p-1.5 text-slate-400 hover:text-rose-500"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedCats.includes(cat.id) ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                    
                    {expandedCats.includes(cat.id) && (
                        <div className="ml-8 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            {cat.subCategories.map((sub: any) => (
                                <div key={sub.id} className="group/sub flex items-center justify-between pr-4 rounded-xl transition-all hover:bg-slate-50/50">
                                    <button 
                                        onClick={() => {
                                            setSelectedSubCategoryId(sub.id);
                                            setSelectedCategoryId(null);
                                        }}
                                        className={`flex-1 flex items-center px-4 py-2 text-[10px] font-bold italic transition-all overflow-hidden ${selectedSubCategoryId === sub.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <div className={`w-1 h-3 rounded-full mr-3 flex-shrink-0 ${selectedSubCategoryId === sub.id ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                                        <span className="truncate">{sub.name}</span>
                                    </button>
                                    <div className="flex items-center space-x-1 opacity-0 group-hover/sub:opacity-100 transition-all flex-shrink-0">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setEditingCategory(sub); setParentForSub(null); setShowCategoryModal(true); }}
                                            className="p-1 text-slate-400 hover:text-indigo-600"
                                        >
                                            <Edit3 className="w-2.5 h-2.5" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCategory(sub.id, true); }}
                                            className="p-1 text-slate-400 hover:text-rose-500"
                                        >
                                            <Trash2 className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={(e) => { e.stopPropagation(); setParentForSub(cat); setEditingCategory(null); setShowCategoryModal(true); }}
                                className="w-full flex items-center px-4 py-2 text-[9px] font-black text-slate-300 uppercase italic hover:text-indigo-500 transition-colors whitespace-nowrap"
                            >
                                <PlusCircle className="w-3 h-3 mr-2" /> Alt Kateqoriya +
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* SIDEBAR TOGGLE BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`absolute z-20 left-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-white dark:bg-slate-800 border-y border-r border-slate-100 dark:border-slate-700 rounded-r-xl shadow-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all ${isSidebarOpen ? 'translate-x-80' : 'translate-x-0'}`}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-900/50">
        
        {/* HEADER */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-10 py-6">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4 flex-shrink-0">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase italic tracking-tighter">v4.0</span>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic whitespace-nowrap">Nomenklatura Siyahısı</h1>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0 border-l border-slate-100 dark:border-slate-800 pl-6 ml-2">
                        
                        {/* WAREHOUSE MULTI-SELECT FILTER */}
                        <div className="relative">
                          <button 
                            onClick={() => setIsWarehouseFilterOpen(!isWarehouseFilterOpen)}
                            className={`flex items-center space-x-3 px-6 py-2.5 rounded-2xl border transition-all italic tracking-tighter font-black text-[11px] uppercase ${selectedWarehouses.length > 0 ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary-500/50'}`}
                          >
                            <MapPin className={`w-3.5 h-3.5 ${selectedWarehouses.length > 0 ? 'text-white' : 'text-slate-400'}`} />
                            <span>{selectedWarehouses.length > 0 ? `${selectedWarehouses.length} Anbar Seçilib` : 'Anbar Filtri'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isWarehouseFilterOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isWarehouseFilterOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsWarehouseFilterOpen(false)}></div>
                              <div className="absolute top-full left-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl p-6 z-50 animate-in zoom-in-95 duration-200">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4 border-b border-slate-50 dark:border-slate-800 pb-2">Anbarı Seçin (Çoxlu Seçim)</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                                  {warehouses.map(wh => (
                                    <label key={wh.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all group">
                                      <div className="flex items-center space-x-3">
                                        <div className={`w-1.5 h-8 rounded-full ${selectedWarehouses.includes(wh.id) ? 'bg-primary-500' : 'bg-slate-100 group-hover:bg-slate-200'}`}></div>
                                        <div className="flex flex-col">
                                          <span className={`text-[11px] font-bold uppercase italic leading-none ${selectedWarehouses.includes(wh.id) ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300'}`}>{wh.name}</span>
                                          <span className="text-[8px] font-black text-slate-400 mt-1 uppercase italic tracking-tighter">{wh.type}</span>
                                        </div>
                                      </div>
                                      <input 
                                        type="checkbox" 
                                        checked={selectedWarehouses.includes(wh.id)}
                                        onChange={() => toggleWarehouse(wh.id)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                                      />
                                    </label>
                                  ))}
                                  {warehouses.length === 0 && (
                                    <p className="text-[10px] text-slate-400 italic text-center py-4">Anbar tapılmadı</p>
                                  )}
                                </div>
                                {selectedWarehouses.length > 0 && (
                                  <button 
                                    onClick={() => { setSelectedWarehouses([]); searchParams.delete('warehouses'); setSearchParams(searchParams); }}
                                    className="w-full mt-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black text-slate-500 uppercase italic hover:bg-rose-50 hover:text-rose-600 transition-all"
                                  >
                                    Filtrləri Sıfırla
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        {/* ANBAR BAZLI GÖR TOGGLE */}
                        <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-6 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-indigo-500/50">
                           <Layers className={`w-3.5 h-3.5 ${showByWarehouse ? 'text-indigo-500' : 'text-slate-400'}`} />
                           <span className="text-[10px] font-black uppercase italic text-slate-500 dark:text-slate-400 whitespace-nowrap">Anbar bazlı gör</span>
                           <button 
                             onClick={() => setShowByWarehouse(!showByWarehouse)}
                             className={`relative w-10 h-5 rounded-full transition-all duration-300 ${showByWarehouse ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                           >
                             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${showByWarehouse ? 'left-6' : 'left-1'}`}></div>
                           </button>
                        </div>
                      </div>

                {/* SEARCH AND BUTTON ON THE RIGHT */}
                <div className="flex-1 flex items-center space-x-4 justify-end min-w-0">
                    <div className="flex-1 max-w-xl relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Ad, SKU, Barkod..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-6 text-[11px] font-black italic shadow-inner outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all transition-all h-[46px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => { setSelectedItem(null); setShowMasterCard(true); }}
                        className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center space-x-2 active:scale-95 italic whitespace-nowrap h-[46px]"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Yeni Məhsul</span>
                    </button>
                </div>
            </div>
        </div>

        {/* FILTERS & TABS - FULL WIDTH LINE */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-10 py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                <button 
                    onClick={() => { setSelectedCategoryId(null); setSelectedSubCategoryId(null); }} 
                    className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase italic transition-all whitespace-nowrap flex-shrink-0 ${(!selectedCategoryId && !selectedSubCategoryId) ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
                >
                    Bütün Nomenklatura
                </button>
                {categories.map((cat: any) => (
                    <button 
                        key={cat.id}
                        onClick={() => { setSelectedCategoryId(cat.id); setSelectedSubCategoryId(null); }}
                        className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase italic transition-all whitespace-nowrap flex-shrink-0 ${selectedCategoryId === cat.id ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>

        {/* DATA TABLE */}
        <div className="flex-1 p-10 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                            <th className="px-8 py-6 w-32">Tip</th>
                            <th className="px-8 py-6">Alt Kateqoriya</th>
                            <th className="px-8 py-6 text-center">SKU / Kod</th>
                            <th className="px-8 py-6">Məhsul / Xidmət Adı</th>
                            <th className="px-8 py-6 text-center">Ölçü vahidi</th>
                            <th className="px-8 py-6 text-center">Həcm (m³)</th>
                            <th className="px-8 py-6 text-center">Anbar Stok</th>
                            <th className="px-8 py-6 text-center text-rose-500">Bron</th>
                            <th className="px-8 py-6 text-center text-emerald-600">Yararlı</th>
                            <th className="px-8 py-6 text-right pr-12">Əməliyyat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {isLoading ? (
                            <tr><td colSpan={11} className="p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div><span className="text-[11px] font-black text-slate-400 uppercase italic">Məlumatlar Yüklənir...</span></td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan={11} className="p-20 text-center"><Info className="w-12 h-12 text-slate-200 mx-auto mb-4" /><span className="text-[11px] font-black text-slate-400 uppercase italic">Məlumat Tapılmadı</span></td></tr>
                        ) : (
                            items.map((item: any) => (
                                <React.Fragment key={item.id}>
                                    <tr className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all ${expandedItems.includes(item.id) ? 'bg-slate-50/80 dark:bg-slate-800/50' : ''}`}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    {getItemIcon(item.type)}
                                                </div>
                                                <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase italic">{item.subCategory?.category?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase italic leading-tight">{item.subCategory?.name}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center font-black italic text-slate-500 dark:text-slate-400 tabular-nums text-xs">
                                            {item.sku || item.code}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800 dark:text-white italic tracking-tight uppercase leading-none group-hover:text-indigo-600 transition-colors">{item.name}</span>
                                                <div className="flex items-center space-x-2 mt-1.5">
                                                    <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-[8px] font-black uppercase italic">{item.costingMethod || 'AVCO'}</span>
                                                    <span className="text-[9px] font-black text-slate-400 italic">{item.currency || 'AZN'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase italic">{item.uom}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-[11px] font-black text-indigo-500 italic tabular-nums">{(item.unitVolume || 0.005).toFixed(4)}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            {item.isStockItem ? (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-black italic tabular-nums text-slate-700 dark:text-slate-200">124.00</span>
                                                </div>
                                            ) : '-'}
                                        </td>

                                        <td className="px-8 py-6 text-center">
                                            {item.isStockItem ? (
                                                <div className="flex items-center justify-center space-x-1">
                                                    <Bookmark className="w-3 h-3 text-rose-500" />
                                                    <span className="text-xs font-black italic tabular-nums text-rose-500">
                                                        {reservations.filter((r: any) => r.itemId === item.id).reduce((sum: number, r: any) => sum + r.amount, 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            {item.isStockItem ? (
                                                <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 rounded-xl">
                                                    <span className="text-sm font-black italic tabular-nums">
                                                        {(124.00 - reservations.filter((r: any) => r.itemId === item.id).reduce((sum: number, r: any) => sum + r.amount, 0)).toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-[10px] font-black uppercase italic">Stok Yoxdur</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right pr-12">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button 
                                                    onClick={() => { setBronItem(item); setIsBronModalOpen(true); }}
                                                    className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                                    title="Bron Et"
                                                >
                                                    <Bookmark className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedItem(item); setShowMasterCard(true); }}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center shadow-sm"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={async () => {
                                                        const hasAdjustments = JSON.parse(localStorage.getItem('erp_stock_adjustments') || '[]').some((a: any) => a.items?.some((i: any) => i.id === item.id));
                                                        const hasCounts = JSON.parse(localStorage.getItem('erp_inventory_counts') || '[]').some((c: any) => c.items?.some((i: any) => i.id === item.id));
                                                        const hasReservations = reservations.some((r: any) => r.itemId === item.id);
                                                        const hasMoves = JSON.parse(localStorage.getItem('erp_stock_moves') || '[]').some((m: any) => m.itemCode === item.sku || m.itemCode === item.code);

                                                        if (hasAdjustments || hasCounts || hasReservations || hasMoves) {
                                                            alert('Bu məhsul sistemdə əməliyyat görüb (sayım, düzəliş və ya bron). Audit bütövlüyü üçün əməliyyat görmüş nomenklaturanı silmək olmaz!');
                                                            return;
                                                        }

                                                        if (window.confirm('Məhsulu silmək istədiyinizə əminsiniz?')) {
                                                            await inventoryApi.deleteItem(item.id, activeCompany!.id);
                                                            fetchData();
                                                        }
                                                    }}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    {expandedItems.includes(item.id) && showByWarehouse && (
                                        <tr className="bg-slate-50/30 dark:bg-slate-800/20">
                                            <td colSpan={10} className="px-20 py-8">
                                                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                                                    <div className="flex items-center space-x-3 mb-4">
                                                        <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Anbarlar Üzrə Bölgü</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {warehouses.map((wh: any) => (
                                                            <div key={wh.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-xl">
                                                                            <Home className="w-4 h-4" />
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase italic leading-none">{wh.name}</h5>
                                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1 block italic">{wh.type} / {wh.manager}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="text-right">
                                                                            <span className="text-[9px] font-black text-slate-400 uppercase italic block leading-none mb-1">Məhsul Miqdarı</span>
                                                                            <span className="text-xs font-black text-slate-700 dark:text-slate-200 tabular-nums italic">62.00 {item.uom}</span>
                                                                        </div>
                                                                        <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800"></div>
                                                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                                                    </div>
                                                                </div>
                                                                {wh.subLocations && wh.subLocations.length > 0 && (
                                                                    <div className="ml-12 mt-4 space-y-3 border-l-2 border-slate-50 dark:border-slate-800 pl-6">
                                                                        {wh.subLocations.map((sl: any) => (
                                                                            <div key={sl.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 transition-all group/zone">
                                                                                <div className="flex items-center space-x-3">
                                                                                    <Layers className={`w-3.5 h-3.5 ${sl.isReserved ? 'text-rose-500' : 'text-primary-400'}`} />
                                                                                    <div>
                                                                                        <span className={`text-[10px] font-bold uppercase italic ${sl.isReserved ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300'}`}>
                                                                                            {sl.name} {sl.isReserved && '(Bron)'}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center space-x-6">
                                                                                    <div className="flex flex-col items-end">
                                                                                        <span className="text-[8px] font-black text-rose-400 uppercase italic leading-tight">Bron</span>
                                                                                        <span className="text-[10px] font-black text-rose-500 tabular-nums italic">
                                                                                            {sl.isReserved ? '31.00' : (reservations.filter((r: any) => r.itemId === item.id && r.zoneId === sl.id).reduce((sum: number, r: any) => sum + r.amount, 0).toFixed(2) || '0.00')}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="w-[1px] h-6 bg-slate-100 dark:bg-slate-800"></div>
                                                                                    <div className="flex flex-col items-end">
                                                                                        <span className="text-[8px] font-black text-emerald-400 uppercase italic leading-tight">Yararlı</span>
                                                                                        <span className="text-[10px] font-black text-emerald-600 tabular-nums italic">
                                                                                            {sl.isReserved ? '0.00' : (31.00 - reservations.filter((r: any) => r.itemId === item.id && r.zoneId === sl.id).reduce((sum: number, r: any) => sum + r.amount, 0)).toFixed(2)}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {showMasterCard && (
        <NomenclatureMasterCard 
            item={selectedItem} 
            onClose={() => setShowMasterCard(false)} 
            onSave={() => { fetchData(); setShowMasterCard(false); }}
        />
      )}

      {showCategoryModal && (
        <NomenclatureCategoryModal 
            category={editingCategory}
            parentCategory={parentForSub}
            initialType={activeTab !== 'ALL' ? activeTab : 'MATERIAL'}
            onClose={() => setShowCategoryModal(false)}
            onSave={() => { fetchData(); setShowCategoryModal(false); }}
        />
      )}

      {isBronModalOpen && (
        <BronModal 
          item={bronItem}
          warehouses={warehouses}
          onClose={() => setIsBronModalOpen(false)}
          onSave={(newBron: any) => {
            const added = [...reservations, { ...newBron, id: Math.random().toString(36).substr(2, 9) }];
            setReservations(added);
            setIsBronModalOpen(false);
          } }
        />
      )}
    </div>
  );
};

const BronModal = ({ item, warehouses, onClose, onSave }: any) => {
    const [formData, setFormData] = useState({
        itemId: item?.id,
        warehouseId: warehouses[0]?.id || '',
        zoneId: warehouses[0]?.subLocations?.[0]?.id || '',
        amount: '',
        customerName: '',
        isIndefinite: true,
        expiryDate: ''
    });

    const activeWarehouse = warehouses.find((w: any) => w.id === formData.warehouseId);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-slate-900/60 transition-all animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden relative animate-in zoom-in-95 duration-300">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic flex items-center">
                                <Bookmark className="w-6 h-6 mr-3 text-rose-500" /> Bron Et (Rezerv)
                            </h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase italic mt-1">{item?.name} / {item?.sku}</p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Anbar</label>
                                <select 
                                    value={formData.warehouseId}
                                    onChange={e => setFormData({ ...formData, warehouseId: e.target.value, zoneId: warehouses.find((w: any) => w.id === e.target.value)?.subLocations?.[0]?.id || '' })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-inner outline-none focus:ring-2 focus:ring-rose-500/20"
                                >
                                    {warehouses.map((wh: any) => (
                                        <option key={wh.id} value={wh.id}>{wh.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Zona</label>
                                <select 
                                    value={formData.zoneId}
                                    onChange={e => setFormData({ ...formData, zoneId: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-inner outline-none focus:ring-2 focus:ring-rose-500/20"
                                >
                                    {activeWarehouse?.subLocations?.map((sl: any) => (
                                        <option key={sl.id} value={sl.id}>{sl.name}</option>
                                    ))}
                                    {(!activeWarehouse?.subLocations || activeWarehouse.subLocations.length === 0) && (
                                        <option value="">Zona Yoxdur</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Miqdar</label>
                                <input 
                                    type="number" 
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-inner outline-none focus:ring-2 focus:ring-rose-500/20"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Müştəri / Sifariş</label>
                                <input 
                                    type="text" 
                                    value={formData.customerName}
                                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-inner outline-none focus:ring-2 focus:ring-rose-500/20"
                                    placeholder="Müştəri Adı"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Activity className="w-4 h-4 text-rose-500" />
                                    <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase italic">Bron Müddəti</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`text-[10px] font-black uppercase italic ${formData.isIndefinite ? 'text-indigo-600' : 'text-slate-400'}`}>Müddətsiz</span>
                                    <button 
                                        onClick={() => setFormData({ ...formData, isIndefinite: !formData.isIndefinite })}
                                        className={`w-10 h-5 rounded-full transition-all duration-300 relative ${formData.isIndefinite ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${formData.isIndefinite ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                             </div>
                             
                             <div className={`transition-all duration-300 overflow-hidden ${formData.isIndefinite ? 'h-0 opacity-0' : 'h-20 opacity-100 mt-2'}`}>
                                <label className="text-[8px] font-black text-rose-400 uppercase ml-2 italic">Bitmə Tarixi</label>
                                <input 
                                    type="date" 
                                    value={formData.expiryDate}
                                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 border-none rounded-xl p-3 text-[11px] font-bold text-slate-600 shadow-inner mt-1"
                                />
                             </div>
                        </div>
                    </div>

                    <div className="mt-10 flex space-x-4">
                         <button onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 italic">
                           Ləğv Et
                         </button>
                         <button 
                           onClick={() => onSave({ ...formData, amount: parseFloat(formData.amount) })}
                           className="flex-1 py-4 bg-rose-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-500/30 active:scale-95 italic"
                         >
                           Bronu Təsdiqlə
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NomenclatureList;
