import { useState, useEffect } from 'react';
import { 
  Wallet, Search, Plus, MoreVertical, 
  User, MapPin, History, 
  ArrowRight, ShieldCheck, Activity,
  TrendingDown, TrendingUp, Trash2, Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import AccountModal from './AccountModal';

const CashRegistry = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const fetchAccounts = async () => {
    if (!activeCompany) return;
    setLoading(true);
    try {
      // Filter by 101 code prefix (Cash accounts)
      const result = await financeApi.getAccounts(activeCompany.id, { codePrefix: '101' });
      
      const mapped = result.data.map((acc: any) => ({
        id: acc.id,
        name: acc.name,
        code: acc.code,
        manager: "Məsul Şəxs",
        balance: "0.00",
        currency: acc.name.includes('USD') ? 'USD' : acc.name.includes('EUR') ? 'EUR' : 'AZN',
        status: "Aktiv"
      }));
      
      setAccounts(mapped);
    } catch (error) {
      console.error("Kassa hesabları yüklənərkən xəta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeCompany?.id]);

  const filteredCashes = accounts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (formData: any) => {
    if (!activeCompany) return;
    try {
      if (modalMode === 'create') {
        await financeApi.createAccount(formData, activeCompany.id);
      } else {
        await financeApi.updateAccount(selectedAccount.id, formData, activeCompany.id);
      }
      setIsModalOpen(false);
      fetchAccounts();
    } catch (error: any) {
      alert(error.message || "Xəta baş verdi");
    }
  };

  const handleDelete = async (id: string) => {
    if (!activeCompany || !window.confirm("Bu kassanı silmək istədiyinizə əminsiniz?")) return;
    try {
      await financeApi.deleteAccount(id, activeCompany.id);
      fetchAccounts();
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
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Xəzinə / Kassa Reyestri</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Kassa Reyestri</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-emerald-500/10 underline-offset-4 tracking-tight">Fiziki kassaların qalıqları, məsul şəxslər və kassa limitləri</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 shadow-sm">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Axtarış..." 
              className="bg-transparent border-none outline-none text-sm font-bold w-48 placeholder-slate-400 italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setModalMode('create');
              setSelectedAccount(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 italic"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kassa</span>
          </button>
        </div>
      </div>

      {/* CASH CARDS GRID */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredCashes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCashes.map((cash, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-inner">
                        <Wallet className="w-7 h-7" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setModalMode('edit');
                            setSelectedAccount(cash);
                            setIsModalOpen(true);
                          }}
                          className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-xl transition-all"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cash.id)}
                          className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-2">{cash.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase italic tracking-widest">{cash.manager} / {cash.code}</p>
                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-baseline justify-between">
                      <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-black text-slate-800 dark:text-white italic tabular-nums">{cash.balance}</span>
                          <span className="text-xs font-black text-emerald-500 italic uppercase">{cash.currency}</span>
                      </div>
                      <button onClick={() => navigate('/bank/transactions')} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors">
                        <History className="w-4 h-4" />
                      </button>
                  </div>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-24 shadow-sm text-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Wallet className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic mb-2 tracking-tight">Kassa Tapılmadı</h3>
            <p className="text-slate-400 font-bold italic uppercase text-[11px] tracking-[0.2em] mb-10">Sistemdə heç bir fiziki kassa qeydiyyatı yoxdur</p>
            <button 
              onClick={() => {
                setModalMode('create');
                setSelectedAccount(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-3 px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 italic"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Kassa Əlavə Et</span>
            </button>
        </div>
      )}

      <AccountModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedAccount}
        title={modalMode === 'create' ? "Yeni Kassa Hesabı" : "Kassanı Redaktə Et"}
        defaultCodePrefix="101.01"
      />

    </div>
  );
};

export default CashRegistry;
