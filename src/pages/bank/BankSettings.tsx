import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Settings, Plus, Edit, Trash2, 
  Save, Landmark, Wallet, PiggyBank, Truck, 
  Banknote, FileText, Users, Info, ShieldCheck, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import TreasuryCategoryModal from './TreasuryCategoryModal';
import SearchableSelect from '../../components/common/SearchableSelect';

const BankSettings = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [settings, setSettings] = useState({
    incomeAccountId: '631.01',
    expenseAccountId: '801.01',
    allowNegativeBalance: false
  });

  const fetchData = async () => {
    if (!activeCompany) return;
    setLoading(true);
    try {
      const [catRes, accRes] = await Promise.all([
        financeApi.getTreasuryCategories(activeCompany.id),
        financeApi.getAccounts(activeCompany.id)
      ]);
      setCategories(catRes.data);
      setAccounts(accRes.data);
    } catch (error: any) {
      console.error("Məlumatlar yüklənərkən xəta:", error);
      if (error.message.includes('Failed to fetch')) {
        setCategories([
            { id: 'cat1', name: 'Kassa', icon: 'Wallet' },
            { id: 'cat2', name: 'Bank Hesabları', icon: 'Landmark' },
            { id: 'cat3', name: 'Əmanətlər', icon: 'PiggyBank' },
        ]);
        setAccounts([
            { id: '631.01', code: '631.01', name: 'Məzənnə Fərqi Gəlirləri' },
            { id: '631.02', code: '631.02', name: 'Digər Maliyyə Gəlirləri' },
            { id: '801.01', code: '801.01', name: 'Məzənnə Fərqi Xərcləri' },
            { id: '801.02', code: '801.02', name: 'Digər Maliyyə Xərcləri' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCompany?.id]);

  const handleDelete = async (id: string) => {
    if (!activeCompany || !window.confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?")) return;
    try {
      await financeApi.deleteTreasuryCategory(id, activeCompany.id);
      fetchData();
    } catch (error: any) {
      alert(error.message || "Silmək mümkün olmadı");
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'PiggyBank': return PiggyBank;
      case 'Truck': return Truck;
      case 'Banknote': return Banknote;
      case 'FileText': return FileText;
      case 'Users': return Users;
      case 'Landmark': return Landmark;
      case 'Wallet': return Wallet;
      default: return Settings;
    }
  };

  const accountOptions = accounts.map(acc => ({
    id: acc.id,
    label: `${acc.code} - ${acc.name}`
  }));

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900/30 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Nizamlamalar / Xəzinə</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Xəzinə Nizamlamaları</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic tracking-tight">Hesab kateqoriyaları və modul parametrləri</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT: CATEGORIES */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                <Settings className="w-4 h-4 mr-2 text-indigo-500" /> Hesab Tipləri / Kateqoriyalar
              </h3>
            </div>
            
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <div className="p-20 text-center animate-pulse text-slate-400 font-black italic">YÜKLƏNİR...</div>
              ) : categories.length > 0 ? (
                categories.map((cat) => {
                  const Icon = getIcon(cat.icon);
                  return (
                    <div key={cat.id} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-inner">
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{cat.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest mt-1">SİMVOL: {cat.icon}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsModalOpen(true);
                          }}
                          className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-20 text-center italic text-slate-400 uppercase text-[10px] font-black">Kateqoriya tapılmadı</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: MODULE SETTINGS */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
              <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" /> Ümumi Nizamlamalar
            </h3>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Məzənnə Fərqi Gəlir Hesabı</label>
                <SearchableSelect 
                  options={accountOptions}
                  value={settings.incomeAccountId}
                  onChange={(val) => setSettings({...settings, incomeAccountId: val})}
                  placeholder="Hesab axtar..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Məzənnə Fərqi Xərc Hesabı</label>
                <SearchableSelect 
                  options={accountOptions}
                  value={settings.expenseAccountId}
                  onChange={(val) => setSettings({...settings, expenseAccountId: val})}
                  placeholder="Hesab axtar..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase italic">Mənfi balansa icazə verilsin?</span>
                <input 
                  type="checkbox" 
                  checked={settings.allowNegativeBalance}
                  onChange={(e) => setSettings({...settings, allowNegativeBalance: e.target.checked})}
                  className="w-5 h-5 rounded-lg border-indigo-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                />
              </div>

              <button className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest italic hover:bg-slate-900 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-slate-200 dark:shadow-none">
                <Save className="w-4 h-4" />
                <span>Nizamlamaları Yadda Saxla</span>
              </button>
            </div>
          </div>

          <div className="bg-amber-50/50 dark:bg-amber-900/10 p-6 rounded-[2rem] border border-dashed border-amber-200 dark:border-amber-800 flex items-start space-x-4">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-amber-800 dark:text-amber-400 uppercase italic">Kritik Qeyd</h4>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight italic">
                Hesab kateqoriyalarını sildikdə, həmin kateqoriyaya bağlı hesablar silinmir, lakin "Digər" kateqoriyasına keçid edir.
              </p>
            </div>
          </div>
        </div>
      </div>

      <TreasuryCategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchData}
        initialData={selectedCategory}
      />
    </div>
  );
};

export default BankSettings;
