import { useState, useMemo } from 'react';
import { 
  PiggyBank, Search, Plus, MoreVertical, 
  Landmark, Calendar, TrendingUp, 
  Download, ArrowRight, Clock, 
  Ship, Receipt, FileCheck, Users, 
  Filter, Wallet, CreditCard,
  ArrowLeftRight, Activity
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DepositRegistry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Determine initial tab from URL if possible
  const getInitialTab = () => {
    if (location.pathname.includes('customs')) return 'Customs';
    if (location.pathname.includes('vat-deposit')) return 'VAT';
    if (location.pathname.includes('shv-tax')) return 'Tax';
    if (location.pathname.includes('shv-social')) return 'Social';
    return 'All';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  const categories = [
    { id: 'All', name: 'Bütün Hesablar', icon: Wallet, color: 'slate' },
    { id: 'Deposit', name: 'Bank Depozitləri', icon: PiggyBank, color: 'blue' },
    { id: 'Customs', name: 'Gömrük Hesabları', icon: Ship, color: 'amber' },
    { id: 'VAT', name: 'ƏDV Hesabı', icon: Receipt, color: 'indigo' },
    { id: 'Tax', name: 'Vergi ŞHV', icon: FileCheck, color: 'rose' },
    { id: 'Social', name: 'Sosial ŞHV', icon: Users, color: 'emerald' },
  ];

  // MOCK DATA REMOVED - User requested a clean slate
  const allAccounts: any[] = [];

  const filteredAccounts = useMemo(() => {
    return allAccounts.filter(acc => {
      const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           acc.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'All' || acc.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  const getThemeColor = (type: string) => {
    switch (type) {
      case 'Deposit': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Customs': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'VAT': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'Tax': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Social': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return PiggyBank;
      case 'Customs': return Ship;
      case 'VAT': return Receipt;
      case 'Tax': return FileCheck;
      case 'Social': return Users;
      default: return Landmark;
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900/30 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Xəzinə / Depozit Hesabları</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Depozit və Daxili Hesablar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-slate-500/10 underline-offset-4 tracking-tight">Depozit, Gömrük, ƏDV və Vergi/Sosial şəxsi hesabların idarə olunması</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100 dark:border-slate-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-8 py-3.5 bg-slate-800 text-white dark:bg-slate-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-500/20 active:scale-95 italic text-shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Yeni Daxili Hesab</span>
          </button>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap items-center gap-3 pb-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center space-x-3 px-6 py-3.5 rounded-2xl font-black text-[10.5px] uppercase tracking-widest transition-all italic whitespace-nowrap border ${
                        isActive 
                        ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200 dark:shadow-none' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{cat.name}</span>
                  </button>
              );
          })}
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
            <input 
              type="text" 
              placeholder="Hesab adı, nömrəsi və ya bank ilə axtarış..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[13px] focus:ring-2 focus:ring-slate-500/20 placeholder-slate-400 transition-all outline-none font-bold italic"
            />
         </div>
      </div>

      {/* ACCOUNTS GRID */}
      {filteredAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAccounts.map((acc) => {
            const Icon = getIcon(acc.type);
            const theme = getThemeColor(acc.type);
            return (
              <div key={acc.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 dark:bg-slate-800/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-all"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${theme}`}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest italic border ${theme}`}>
                            {acc.type === 'Deposit' ? 'Depozit' : acc.type === 'Customs' ? 'Gömrük' : acc.type === 'VAT' ? 'ƏDV' : 'ŞHV'}
                        </span>
                        <button className="mt-4 p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-xl text-slate-400">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                        <span># {acc.code}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums leading-tight">{acc.name}</h3>
                    <div className="flex items-center space-x-2 text-slate-400 italic">
                        <Landmark className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[11px] font-black uppercase tracking-widest italic tracking-tighter tabular-nums">{acc.bank || acc.branch}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Hesab Balansı</p>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-3xl font-black text-slate-800 dark:text-white italic tabular-nums">{acc.balance}</span>
                                <span className="text-sm font-black text-slate-400 italic underline decoration-slate-200 decoration-2 underline-offset-4">{acc.currency}</span>
                            </div>
                        </div>
                        {acc.rate && (
                            <div className="text-right">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Dərəcə</p>
                                 <p className="text-sm font-black text-blue-600 tabular-nums italic shadow-sm bg-blue-50 px-2 py-0.5 rounded-lg">{acc.rate}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                             <div className="flex items-center -space-x-1">
                                 <div className="w-6 h-6 rounded-full bg-slate-50 border border-white dark:border-slate-800 flex items-center justify-center">
                                     <Activity className="w-3 h-3 text-slate-400" />
                                 </div>
                             </div>
                             <span className="text-[9px] font-black uppercase text-slate-400 italic">Son hərəkət: Bugün</span>
                        </div>
                        <button className="flex items-center space-x-2 text-slate-800 dark:text-white font-black text-[10px] uppercase tracking-widest transition-all italic hover:text-blue-600">
                            <span>Əməliyyatlar</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

              </div>
            );
          })}

          {/* ADD NEW CARD PLACEHOLDER */}
          <div className="border-3 border-dashed border-slate-100 dark:border-slate-800 rounded-[3.5rem] flex flex-col items-center justify-center p-12 hover:border-slate-400 transition-all group cursor-pointer h-full opacity-40 hover:opacity-100">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-slate-800 group-hover:text-white transition-all shadow-inner mb-6">
                  <Plus className="w-10 h-10" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic tracking-tighter text-center group-hover:text-slate-800 transition-colors">Yeni Hesab Əlavə Et</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-24 shadow-sm text-center italic">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Filter className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic mb-2 tracking-tight">Uyğun Hesab Tapılmadı</h3>
            <p className="text-slate-400 font-bold italic uppercase text-[11px] tracking-[0.2em] mb-10">Seçilmiş kateqoriya və ya axtarış üzrə heç bir nəticə movcud deyil</p>
        </div>
      )}

    </div>
  );
};

export default DepositRegistry;
