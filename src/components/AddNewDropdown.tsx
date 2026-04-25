import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, 
  ShoppingCart, FileText, Undo2, 
  Truck, FileDown, RotateCcw,
  Package, ArrowRightLeft, ClipboardCheck, 
  Factory, Cpu, Layers,
  Coins, CreditCard, Wallet, BookOpen, Banknote,
  UserCheck, UserMinus, Umbrella, Stethoscope, Plane, Clock,
  Users, ShoppingBag, FileSignature, 
  ChevronRight, Plus, Calculator, 
  Building2, Wrench, Percent, Trash2, List, Settings
} from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
  path: string;
  tags: string[];
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const getHint = (index: number) => {
  if (index < 9) return String(index + 1);
  // Synchronized with Sidebar: Excluded reserved f, n, e, u, d, s, r, p, b, k, l, c, a
  const letters = 'qwtyghjmvzx'; 
  const letterIndex = index - 9;
  return letters[letterIndex] || '?';
};

export const menuData: MenuCategory[] = [
  {
    title: 'Satış (Sales)',
    items: [
      { id: 'so', name: 'Müştəri sifarişi', icon: ShoppingCart, path: '/sales/order/create', tags: ['sales', 'order', 'sifariş'] },
      { id: 'pi', name: 'Proforma invoice', icon: FileText, path: '/sales/proforma/create', tags: ['proforma', 'invoice', 'hesab-faktura'] },
      { id: 'inv', name: 'Invoice', icon: FileText, path: '/sales/invoice/create', tags: ['invoice', 'faktura'] },
      { id: 'sq', name: 'Satış qaiməsi', icon: FileText, path: '/sales/waybill/create', tags: ['waybill', 'qaimə'] },
      { id: 'br', name: 'Bron müraciəti', icon: ClipboardCheck, path: '/sales/reservations/create', tags: ['reservation', 'bron'] },
      { id: 'sr', name: 'Satışdan geri qaytarma qaiməsi', icon: Undo2, path: '/sales/return/create', tags: ['return', 'qaytarma'] },
    ]
  },
  {
    title: 'Alış (Purchase)',
    items: [
      { id: 'po', name: 'Təchizatçı sifarişi', icon: Truck, path: '/purchase/order/create', tags: ['purchase', 'order', 'sifariş'] },
      { id: 'gr', name: 'Alış qaiməsi', icon: FileDown, path: '/purchase-invoice/new', tags: ['receipt', 'qaimə'] },
      { id: 'vi', name: 'Təchizatçı invoice', icon: FileText, path: '/purchase/invoice/create', tags: ['invoice', 'faktura'] },
      { id: 'prw', name: 'Malların qaytarılması', icon: RotateCcw, path: '/purchase/return/warehouse/create', tags: ['return', 'warehouse', 'qaytarma'] },
      { id: 'pri', name: 'Qaytarılma E-qaiməsi', icon: FileSignature, path: '/purchase/return/invoice/create', tags: ['return', 'invoice', 'qaimə'] },
    ]
  },
  {
    title: 'Anbar (Inventory)',
    items: [
      { id: 'mq', name: 'Mal qəbulu', icon: Package, path: '/purchase/receipt/create', tags: ['receive', 'qəbul'] },
      { id: 'mc', name: 'Anbardan çıxış', icon: Package, path: '/inventory/issue/create', tags: ['issue', 'çıxış'] },
      { id: 'it', name: 'Anbarlararası transfer', icon: ArrowRightLeft, path: '/inventory/transfer/create', tags: ['transfer', 'köçürmə'] },
      { id: 'sd', name: 'Stok düzəlişi', icon: Plus, path: '/inventory/adjustment/create', tags: ['adjustment', 'düzəliş'] },
      { id: 'ss', name: 'Sayım sənədi', icon: ClipboardCheck, path: '/inventory/count/create', tags: ['count', 'sayım'] },
    ]
  },
  {
    title: 'İstehsalat (Production)',
    items: [
      { id: 'pro', name: 'İstehsal sifarişi', icon: Factory, path: '/production/order/create', tags: ['production', 'order', 'sifariş'] },
      { id: 'mi', name: 'Xammal buraxılışı', icon: Cpu, path: '/production/material-issue/create', tags: ['material', 'issue', 'buraxılış'] },
      { id: 'out', name: 'İstehsal nəticəsi', icon: Layers, path: '/production/output/create', tags: ['output', 'nəticə'] },
      { id: 'calc', name: 'Kalkulyasiya sənədi', icon: Calculator, path: '/production/cost-calculation/create', tags: ['calc', 'kalkulyasiya'] },
    ]
  },
  {
    title: 'Maliyyə (Finance)',
    items: [
      { id: 'inc', name: 'Gəlir əməliyyatı', icon: Coins, path: '/finance/income/create', tags: ['income', 'gəlir'] },
      { id: 'exp', name: 'Xərc əməliyyatı', icon: CreditCard, path: '/finance/expense/create', tags: ['expense', 'xərc'] },
      { id: 'pay', name: 'Ödəniş', icon: Wallet, path: '/finance/payment/create', tags: ['payment', 'ödəniş'] },
      { id: 'bank', name: 'Bank əməliyyatı', icon: Banknote, path: '/finance/bank/create', tags: ['bank', 'transaction'] },
      { id: 'cash', name: 'Kassa əməliyyatı', icon: Wallet, path: '/finance/cash/create', tags: ['cash', 'kassa'] },
      { id: 'je', name: 'Mühasibat əməliyyatı', icon: BookOpen, path: '/finance/journal/create', tags: ['journal', 'entry', 'mühasibat'] },
    ]
  },
  {
    title: 'HRM',
    items: [
      { id: 'hire', name: 'İşə qəbul', icon: UserCheck, path: '/hr/hiring/create', tags: ['hiring', 'qəbul', 'işçi'] },
      { id: 'term', name: 'İşdən azad etmə', icon: UserMinus, path: '/hr/termination/create', tags: ['termination', 'azad'] },
      { id: 'leave', name: 'Məzuniyyət', icon: Umbrella, path: '/hr/leaves/create', tags: ['leave', 'məzuniyyət'] },
      { id: 'sick', name: 'Xəstəlik vərəqəsi', icon: Stethoscope, path: '/hr/sick-leave/create', tags: ['sick', 'xəstəlik'] },
      { id: 'trip', name: 'Ezamiyyət', icon: Plane, path: '/hr/trip/create', tags: ['trip', 'ezamiyyət'] },
      { id: 'att', name: 'Tabel (Attendance)', icon: Clock, path: '/hr/attendance/create', tags: ['attendance', 'tabel'] },
    ]
  },
  {
    title: 'Əsas Vəsaitlər (Fixed Assets)',
    items: [
      { id: 'fa-list', name: 'ƏV Reyestri', icon: List, path: '/assets', tags: ['assets', 'reyestr', 'siyahı'] },
      { id: 'fa-purchase', name: 'ƏV Alınması', icon: ShoppingBag, path: '/assets/purchase/create', tags: ['purchase', 'asset', 'alınma'] },
      { id: 'fa-comm', name: 'İstismara verilmə', icon: Building2, path: '/assets/commissioning/create', tags: ['commissioning', 'istismar'] },
      { id: 'fa-repair', name: 'Təmir və Kapitallaşma', icon: Wrench, path: '/assets/repair/create', tags: ['repair', 'təmir', 'kapitallaşma'] },
      { id: 'fa-depr', name: 'Amortizasiya hesablama', icon: Percent, path: '/assets/depreciation', tags: ['depreciation', 'amortizasiya'] },
      { id: 'fa-cat', name: 'ƏV Kateqoriyaları', icon: Layers, path: '/assets/categories', tags: ['category', 'kateqoriya'] },
      { id: 'fa-disp', name: 'Silinmə / Satış', icon: Trash2, path: '/assets/disposal', tags: ['disposal', 'sale', 'silinmə'] },
    ]
  },
  {
    title: 'ATƏ və Vəsaitlər (LVA)',
    items: [
      { id: 'lva-list', name: 'ATƏ Reyestri', icon: List, path: '/lva', tags: ['lva', 'atə', 'reyestr'] },
      { id: 'lva-purchase', name: 'ATƏ Alınması', icon: ShoppingBag, path: '/lva/purchase/create', tags: ['purchase', 'lva', 'alınma'] },
      { id: 'lva-issue', name: 'İstifadəyə buraxılış', icon: ArrowRightLeft, path: '/lva/issue/create', tags: ['issue', 'təhvil', 'buraxılış'] },
      { id: 'lva-return', name: 'Geri qaytarma', icon: RotateCcw, path: '/lva/return/create', tags: ['return', 'atə', 'qaytarma'] },
      { id: 'lva-cat', name: 'ATƏ Kateqoriyaları', icon: Layers, path: '/lva/categories', tags: ['category', 'atə', 'kateqoriya'] },
      { id: 'lva-count', name: 'Sayım və İnventar', icon: ClipboardCheck, path: '/lva/count', tags: ['count', 'atə', 'sayım'] },
    ]
  },
  {
    title: 'Digər (Others)',
    items: [
      { id: 'cust', name: 'Müştəri', icon: Users, path: '/crm/customers/create', tags: ['customer', 'müştəri'] },
      { id: 'vend', name: 'Təchizatçı', icon: ShoppingBag, path: '/crm/vendors/create', tags: ['vendor', 'təchizatçı'] },
      { id: 'prod', name: 'Məhsul', icon: Package, path: '/inventory/products/create', tags: ['product', 'məhsul'] },
      { id: 'cntr-qrp', name: 'Müqavilə ve QRP', icon: FileSignature, path: '/contracts/create', tags: ['contract', 'müqavilə', 'qrp'] },
    ]
  }
];

const AddNewDropdown = ({ isAltPressed, navPath, setNavPath }: { isAltPressed?: boolean, navPath?: string[], setNavPath?: (path: string[] | ((prev: string[]) => string[])) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [config, setConfig] = useState<{ favorites: string[], hidden: string[], categoryOrder?: string[] }>({ favorites: [], hidden: [], categoryOrder: [] });

  // Load config on open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('quickActionsConfig');
      if (saved) {
        try {
          setConfig(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  // Global Toggle Listener
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleClose = () => setIsOpen(false);
    
    window.addEventListener('toggle-add-new-dropdown', handleToggle);
    window.addEventListener('close-add-new-dropdown', handleClose);
    
    return () => {
        window.removeEventListener('toggle-add-new-dropdown', handleToggle);
        window.removeEventListener('close-add-new-dropdown', handleClose);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items based on config and search
  const filteredData = React.useMemo(() => {
     let processedData: MenuCategory[] = [];
     let allFavorites: MenuItem[] = [];
     
     const activeOrder = config.categoryOrder || [];
     const sortedMenuData = [...menuData].sort((a, b) => {
       const idxA = activeOrder.indexOf(a.title);
       const idxB = activeOrder.indexOf(b.title);
       if (idxA !== -1 && idxB !== -1) return idxA - idxB;
       if (idxA !== -1) return -1;
       if (idxB !== -1) return 1;
       return 0;
     });

     sortedMenuData.forEach(category => {
       const categoryItems = category.items.filter(item => !config.hidden.includes(item.id));
       
       categoryItems.forEach(item => {
         if (config.favorites.includes(item.id)) {
           allFavorites.push(item);
         }
       });

       const filteredCategoryItems = categoryItems.filter(item => !config.favorites.includes(item.id));
       if (filteredCategoryItems.length > 0) {
         processedData.push({ title: category.title, items: filteredCategoryItems });
       }
     });

     if (allFavorites.length > 0) {
       processedData.unshift({ title: '⭐ Ən Çox İstifadə Olunanlar', items: allFavorites });
     }

     return processedData.map(category => ({
       ...category,
       items: category.items.filter(item => 
         item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
       )
     })).filter(category => category.items.length > 0);
  }, [config, searchQuery]);

  // Navigation Logic for QuickAdd
  useEffect(() => {
    if (!isOpen || !isAltPressed || !navPath || navPath.length === 0) return;

    // Level 0: Categories
    const catIdx = filteredData.findIndex((_, idx) => getHint(idx) === navPath[0]);
    const category = filteredData[catIdx];

    if (category) {
        // Level 1: Items in Category
        if (navPath.length >= 2) {
            const item = category.items.find((_, iidx) => getHint(iidx) === navPath[1]);
            if (item) {
                handleNavigate(item.path);
                if (setNavPath) setNavPath([]);
            }
        }
    }
  }, [navPath, isOpen, isAltPressed, filteredData]);

  const handleNavigate = (path: string) => {
    navigate(`${path}?status=draft`);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95 group"
      >
        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
           <Plus className="w-3.5 h-3.5" />
        </div>
        <span className="text-[13px] font-black uppercase tracking-wider">Add New</span>
      </button>

      {isOpen && (
        <div className="absolute top-14 left-[-160px] md:left-[-300px] w-[90vw] md:w-[720px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-mega-xl border border-slate-100 dark:border-slate-800 z-[100] animate-in slide-in-from-top-4 duration-300 flex flex-col max-h-[85vh]">
          
          {/* Header & Search */}
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center space-x-4">
             <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Əməliyyat və ya sənəd axtarın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none text-[14px] focus:ring-2 focus:ring-primary-500/20 placeholder-slate-400 transition-all"
                />
             </div>
             <button 
                onClick={() => setIsOpen(false)}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
             >
                <X className="w-5 h-5" />
             </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredData.map(category => {
                   const isFavorites = category.title === '⭐ Ən Çox İstifadə Olunanlar';
                   const isExpanded = isFavorites && category.items.length > 3;

                   return (
                      <div key={category.title} className={`space-y-4 ${isExpanded ? 'md:col-span-2 lg:col-span-3' : ''} relative`}>
                         <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 flex items-center justify-between">
                            {category.title}
                            {isAltPressed && (!navPath || navPath.length === 0) && (
                               <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black animate-in zoom-in duration-200">
                                  {getHint(filteredData.indexOf(category))}
                               </span>
                            )}
                         </h4>
                         <div className={isExpanded ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1" : "space-y-1"}>
                            {category.items.map((item, iidx) => (
                               <button 
                                  key={item.id}
                                  onClick={() => handleNavigate(item.path)}
                                  className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group relative"
                               >
                                  <div className="flex items-center space-x-3">
                                     <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-900/30 dark:group-hover:text-primary-400 transition-colors">
                                        <item.icon className="w-4 h-4 stroke-[2.2px]" />
                                     </div>
                                     <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  
                                  {/* Item KeyTip */}
                                  {isAltPressed && navPath && navPath[0] === getHint(filteredData.indexOf(category)) && navPath.length === 1 && (
                                     <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[9px] font-black rounded shadow-2xl z-50 animate-in zoom-in duration-200">
                                        {getHint(iidx)}
                                     </div>
                                  )}
                               </button>
                            ))}
                         </div>
                      </div>
                   );
                })}
             </div>

             {filteredData.length === 0 && (
                <div className="py-20 text-center">
                   <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-slate-400" />
                   </div>
                   <h5 className="text-[14px] font-bold text-slate-700 dark:text-slate-300">Heç bir sənəd tapılmadı</h5>
                   <p className="text-[12px] text-slate-400 mt-1">Axtarış sorğunuzu yoxlayın və ya başqa kateqoriyaya baxın</p>
                </div>
             )}
          </div>

          {/* Footer Footer */}
          <div className="p-3 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center flex items-center justify-center">
             <button 
                onClick={() => { setIsOpen(false); navigate('/settings/quick-actions'); }} 
                className="flex items-center space-x-2 px-12 py-2 hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-xl transition-all text-slate-500 hover:text-indigo-600"
             >
                <Settings className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest italic flex-1 pl-3 border-l border-slate-300 dark:border-slate-600 ml-3">Sürətli Əməliyyatları Tənzimlə</span>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewDropdown;
