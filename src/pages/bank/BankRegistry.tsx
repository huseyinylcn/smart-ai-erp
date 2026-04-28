import { useState, useEffect, useMemo } from 'react';
import { 
  Landmark, Search, Plus, Wallet, 
  Download, ArrowRight, Activity, Edit, Trash2,
  Filter, PiggyBank, Truck, Banknote, FileText, Users,
  ChevronRight, LayoutGrid, List, Grid, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import AccountModal from './AccountModal';
import TreasuryCategoryModal from './TreasuryCategoryModal';

const BankRegistry = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const fetchInitialData = async () => {
    if (!activeCompany) return;
    setLoading(true);
    try {
      const catResult = await financeApi.getTreasuryCategories(activeCompany.id);
      setCategories(catResult.data);

      const accResult = await financeApi.getAccounts(activeCompany.id);
      setAccounts(accResult.data);
    } catch (error) {
      console.error("Xəzinə məlumatları yüklənərkən xəta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [activeCompany?.id]);

  const allTabs = useMemo(() => {
    const baseTabs = [
      { id: 'ALL', name: 'Bütün Hesablar', icon: LayoutGrid, color: 'slate', codePrefix: '', categoryId: null },
      { id: 'CASH', name: 'Kassa', icon: Wallet, codePrefix: '221', color: 'indigo', categoryId: null },
      { id: 'BANK', name: 'Bank Hesabları', icon: Landmark, codePrefix: '223', color: 'blue', categoryId: null },
    ];
    
    const dynamicTabs = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: getIconByName(cat.icon),
      categoryId: cat.id,
      color: 'slate',
      codePrefix: ''
    }));

    return [...baseTabs, ...dynamicTabs];
  }, [categories]);

  function getIconByName(name: string) {
    switch (name) {
      case 'PiggyBank': return PiggyBank;
      case 'Truck': return Truck;
      case 'Banknote': return Banknote;
      case 'FileText': return FileText;
      case 'Users': return Users;
      default: return LayoutGrid;
    }
  }

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           acc.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesTab = false;
      if (activeTab === 'ALL') {
        matchesTab = acc.code.startsWith('221') || acc.code.startsWith('223') || acc.code.startsWith('224') || !!acc.treasuryCategoryId;
      } else if (activeTab === 'CASH') {
        matchesTab = acc.code.startsWith('221');
      } else if (activeTab === 'BANK') {
        matchesTab = acc.code.startsWith('223') || acc.code.startsWith('224');
      } else {
        matchesTab = acc.treasuryCategoryId === activeTab;
      }

      return matchesSearch && matchesTab;
    });
  }, [accounts, activeTab, searchTerm]);

  const handleSave = async (formData: any) => {
    if (!activeCompany) return;
    try {
      const currentTab = allTabs.find(t => t.id === activeTab);
      const dataWithCategory = {
        ...formData,
        treasuryCategoryId: formData.treasuryCategoryId || (currentTab?.categoryId || null)
      };

      if (modalMode === 'create') {
        await financeApi.createAccount(dataWithCategory, activeCompany.id);
      } else {
        await financeApi.updateAccount(selectedAccount.id, dataWithCategory, activeCompany.id);
      }
      setIsModalOpen(false);
      fetchInitialData();
    } catch (error: any) {
      alert(error.message || "Xəta baş verdi");
    }
  };

  const handleDelete = async (id: string) => {
    if (!activeCompany || !window.confirm("Bu hesabı silmək istədiyinizə əminsiniz?")) return;
    try {
      await financeApi.deleteAccount(id, activeCompany.id);
      fetchInitialData();
    } catch (error: any) {
      alert(error.message || "Silmək mümkün olmadı");
    }
  };

  const handleDeleteCategory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCompany || !window.confirm("Bu tipi silmək istədiyinizə əminsiniz?")) return;
    try {
      await financeApi.deleteTreasuryCategory(id, activeCompany.id);
      fetchInitialData();
      if (activeTab === id) setActiveTab('ALL');
    } catch (error: any) {
      alert(error.message || "Silmək mümkün olmadı");
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900/30 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Xəzinə / Hesablar</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Bank, Kassa və Depozit Hesabları</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-slate-500/10 underline-offset-4 tracking-tight">Bütün pul vəsaitlərinin və daxili hesabların mərkəzləşdirilmiş idarəolunması</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mr-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100 dark:border-slate-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => {
              setModalMode('create');
              setSelectedAccount(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-8 py-3.5 bg-slate-800 text-white dark:bg-slate-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-500/20 active:scale-95 italic text-shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Hesab</span>
          </button>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center space-x-3 pb-2 overflow-x-auto no-scrollbar">
          {allTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDynamic = !!tab.categoryId;

              return (
                  <div key={tab.id} className="relative group/tab">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-3 px-6 py-3.5 rounded-2xl font-black text-[10.5px] uppercase tracking-widest transition-all italic whitespace-nowrap border ${
                          isActive 
                          ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200 dark:shadow-none' 
                          : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{tab.name}</span>
                    </button>
                    
                    {isDynamic && (
                      <div className="absolute -top-2 -right-1 flex space-x-1 opacity-0 group-hover/tab:opacity-100 transition-opacity">
                         <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(categories.find(c => c.id === tab.categoryId));
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1 bg-blue-500 text-white rounded-full shadow-lg"
                         >
                            <Edit className="w-2.5 h-2.5" />
                         </button>
                         <button 
                          onClick={(e) => handleDeleteCategory(tab.categoryId!, e)}
                          className="p-1 bg-rose-500 text-white rounded-full shadow-lg"
                         >
                            <Trash2 className="w-2.5 h-2.5" />
                         </button>
                      </div>
                    )}
                  </div>
              );
          })}
          <button 
            onClick={() => {
              setSelectedCategory(null);
              setIsCategoryModalOpen(true);
            }}
            className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-800 rounded-2xl border border-dashed border-slate-300 transition-all"
          >
              <Plus className="w-4 h-4" />
          </button>
      </div>

      {/* SEARCH */}
      <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
          <input 
            type="text" 
            placeholder="Hesab adı, kodu və ya bank ilə axtarış..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[13px] focus:ring-2 focus:ring-slate-500/20 placeholder-slate-400 transition-all outline-none font-bold italic"
          />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
        </div>
      ) : filteredAccounts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAccounts.map((acc) => {
              const tabInfo = allTabs.find(t => t.id === (acc.treasuryCategoryId || (acc.code.startsWith('221') ? 'CASH' : 'BANK'))) || allTabs[0];
              const Icon = tabInfo.icon;
              return (
                <div key={acc.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 dark:bg-slate-800/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-all"></div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-end">
                          <div className="flex items-center space-x-2">
                               <button 
                                 onClick={() => {
                                   setModalMode('edit');
                                   setSelectedAccount(acc);
                                   setIsModalOpen(true);
                                 }}
                                 className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-xl transition-all"
                               >
                                  <Edit className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => handleDelete(acc.id)}
                                 className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition-all"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                          </div>
                          <span className="mt-4 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest italic border border-slate-100 text-slate-400">
                              {tabInfo.name}
                          </span>
                      </div>
                  </div>

                  <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                          <span># {acc.code}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums leading-tight">{acc.name}</h3>
                  </div>

                  <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Cari Balans</p>
                              <div className="flex items-baseline space-x-1">
                                  <span className="text-3xl font-black text-slate-800 dark:text-white italic tabular-nums">0.00</span>
                                  <span className="text-sm font-black text-slate-400 italic">{acc.currency || 'AZN'}</span>
                              </div>
                          </div>
                          <button onClick={() => navigate('/bank/transactions')} className="flex items-center space-x-2 text-slate-800 dark:text-white font-black text-[10px] uppercase tracking-widest transition-all italic hover:text-blue-600">
                              <span>Əməliyyatlar</span>
                              <ArrowRight className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 italic border-b border-slate-100 dark:border-slate-800">
                      <th className="px-8 py-5">Hesab / Bank</th>
                      <th className="px-6 py-5">Kod</th>
                      <th className="px-6 py-5">Tip</th>
                      <th className="px-6 py-5">Valyuta</th>
                      <th className="px-6 py-5 text-right">Balans</th>
                      <th className="px-8 py-5 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                   {filteredAccounts.map(acc => {
                      const tabInfo = allTabs.find(t => t.id === (acc.treasuryCategoryId || (acc.code.startsWith('221') ? 'CASH' : 'BANK'))) || allTabs[0];
                      return (
                        <tr key={acc.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                           <td className="px-8 py-6">
                              <div className="flex items-center space-x-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                    <tabInfo.icon className="w-5 h-5" />
                                 </div>
                                 <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{acc.name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-6 text-[11px] font-black text-slate-400 tabular-nums">{acc.code}</td>
                           <td className="px-6 py-6">
                              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest italic text-slate-500">
                                 {tabInfo.name}
                              </span>
                           </td>
                           <td className="px-6 py-6 text-[11px] font-black text-slate-500 italic">{acc.currency}</td>
                           <td className="px-6 py-6 text-right font-black text-sm italic tabular-nums text-slate-800 dark:text-white">0.00</td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                 <button 
                                  onClick={() => {
                                    setModalMode('edit');
                                    setSelectedAccount(acc);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                 >
                                    <Edit className="w-4 h-4" />
                                 </button>
                                 <button 
                                  onClick={() => handleDelete(acc.id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                      );
                   })}
                </tbody>
             </table>
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-24 shadow-sm text-center italic">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic mb-2 tracking-tight">Hesab Tapılmadı</h3>
            <p className="text-slate-400 font-bold italic uppercase text-[11px] tracking-[0.2em] mb-10">Zəhmət olmasa bu kateqoriya üzrə ilk hesabınızı əlavə edin</p>
            <button 
              onClick={() => {
                setModalMode('create');
                setSelectedAccount(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-3 px-10 py-5 bg-slate-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all italic shadow-2xl shadow-slate-500/20"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Hesab Əlavə Et</span>
            </button>
        </div>
      )}

      <AccountModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedAccount}
        title={modalMode === 'create' ? "Yeni Hesab" : "Hesabı Redaktə Et"}
        defaultCodePrefix={allTabs.find(t => t.id === activeTab)?.codePrefix || ''}
      />

      <TreasuryCategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={fetchInitialData}
        initialData={selectedCategory}
      />

    </div>
  );
};

export default BankRegistry;
