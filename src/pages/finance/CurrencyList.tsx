import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, RefreshCw, 
  History, Search,
  Edit2, Lock, Unlock, Calendar, Plus, Save, X, AlertTriangle,
  ArrowRight, ArrowLeft as ArrowLeftIcon, CheckCircle2,
  ChevronDown, FileDown, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

// Master list of all CBAR tracked currencies based on the provided screenshot
const ALL_CBAR_CURRENCIES = [
  { code: 'USD', name: 'ABŞ dolları' },
  { code: 'EUR', name: 'Avro' },
  { code: 'AUD', name: 'Avstraliya dolları' },
  { code: 'BYN', name: 'Belarus rublu' },
  { code: 'AED', name: 'BƏƏ dirhəmi' },
  { code: 'KRW', name: 'Cənubi Koreya vonu', nominal: 100 },
  { code: 'CZK', name: 'Çexiya kronu' },
  { code: 'CNY', name: 'Çin yuanı' },
  { code: 'DKK', name: 'Danimarka kronu' },
  { code: 'GEL', name: 'Gürcü larisi' },
  { code: 'HKD', name: 'Honq Konq dolları' },
  { code: 'INR', name: 'Hindistan rupisi' },
  { code: 'GBP', name: 'İngilis funt sterlinqi' },
  { code: 'SEK', name: 'İsveç kronu' },
  { code: 'CHF', name: 'İsveçrə frankı' },
  { code: 'ILS', name: 'İsrail şekeli' },
  { code: 'CAD', name: 'Kanada dolları' },
  { code: 'KWD', name: 'Kuveyt dinarı' },
  { code: 'KZT', name: 'Qazaxıstan tengəsi', nominal: 100 },
  { code: 'QAR', name: 'Qatar rialı' },
  { code: 'KGS', name: 'Qırğız somu' },
  { code: 'HUF', name: 'Macarıstan forinti', nominal: 100 },
  { code: 'MDL', name: 'Moldova leyi' },
  { code: 'NOK', name: 'Norveç kronu' },
  { code: 'UZS', name: 'Özbək somu', nominal: 100 },
  { code: 'PKR', name: 'Pakistan rupisi', nominal: 100 },
  { code: 'PLN', name: 'Polşa zlotısı' },
  { code: 'RON', name: 'Rumıniya leyi' },
  { code: 'RUB', name: 'Rusiya rublu', nominal: 100 },
  { code: 'RSD', name: 'Serbiya dinarı' },
  { code: 'SGD', name: 'Sinqapur dolları' },
  { code: 'SAR', name: 'Səudiyyə Ərəbistanı rialı' },
  { code: 'XDR', name: 'SDR (BVF-nin xüsusi borcalma hüquqları)' },
  { code: 'TRY', name: 'Türk lirası' },
  { code: 'TMT', name: 'Türkmənistan manatı' },
  { code: 'UAH', name: 'Ukrayna qrivnası' },
  { code: 'JPY', name: 'Yapon yeni', nominal: 100 },
  { code: 'NZD', name: 'Yeni Zelandiya dolları' },
  { code: 'XAU', name: 'Qızıl (1 t.u.)' },
  { code: 'XAG', name: 'Gümüş (1 t.u.)' },
  { code: 'XPT', name: 'Platin (1 t.u.)' },
  { code: 'XPD', name: 'Palladium (1 t.u.)' },
];

const CurrencyList = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [rates, setRates] = useState<any[]>([]);
  const [activeCurrencies, setActiveCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Manual Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    toCurrency: 'USD',
    rate: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    isLocked: true
  });

  const fetchData = async () => {
    if (!activeCompany) return;
    setLoading(true);
    try {
      const [ratesRes, curRes] = await Promise.all([
        financeApi.getExchangeRates(activeCompany.id, { date: selectedDate }),
        financeApi.getCurrencies(activeCompany.id)
      ]);
      setRates(ratesRes.data || []);
      setActiveCurrencies(curRes.data || []);
    } catch (error: any) {
      console.error("Məzənnələr yüklənərkən xəta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCompany?.id, selectedDate]);

  const handleSync = async () => {
    if (!activeCompany || syncing) return;
    setSyncing(true);
    try {
      await financeApi.syncExchangeRates(activeCompany.id, selectedDate);
      await fetchData();
    } catch (error: any) {
      console.error("Sync error:", error);
      alert("Sinxronizasiya xətası: " + error.message);
    } finally {
      setSyncing(false);
    }
  };

  const toggleLock = async (rateId: string, currentLock: boolean) => {
    if (!activeCompany) return;
    try {
      await financeApi.toggleRateLock(rateId, !currentLock, activeCompany.id);
      setRates(prev => prev.map(r => r.id === rateId ? { ...r, isLocked: !currentLock } : r));
    } catch (error: any) {
      alert("Kilid statusu dəyişdirilərkən xəta: " + error.message);
    }
  };

  const toggleActive = async (code: string, isActive: boolean) => {
    if (!activeCompany) return;
    try {
      if (isActive) {
        const currency = activeCurrencies.find(c => c.code === code);
        if (currency) await financeApi.deleteCurrency(currency.id, activeCompany.id);
      } else {
        await financeApi.createCurrency({ code, name: code }, activeCompany.id);
      }
      fetchData();
    } catch (error: any) {
      alert("Status dəyişdirilərkən xəta: " + error.message);
    }
  };

  const fullListWithRates = useMemo(() => {
    return ALL_CBAR_CURRENCIES.map(base => {
      const rateObj = rates.find(r => r.toCurrency === base.code);
      const isActive = activeCurrencies.some(c => c.code === base.code);
      return {
        ...base,
        rate: rateObj ? rateObj.rate : '---',
        isLocked: rateObj ? rateObj.isLocked : false,
        source: rateObj ? rateObj.source : 'N/A',
        isActive,
        id: rateObj ? rateObj.id : null
      };
    });
  }, [rates, activeCurrencies]);

  const filteredData = useMemo(() => {
    return fullListWithRates.filter(item => {
      const matchesSearch = item.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === 'active') return matchesSearch && item.isActive;
      return matchesSearch && !item.isActive;
    });
  }, [fullListWithRates, searchQuery, activeTab]);

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-6 mb-4 sticky top-0 z-40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Məzənnə</h1>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 italic">Live CBAR</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic opacity-70">Şirkətin valyuta aktivləri və gündəlik məzənnələr</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 space-x-4 shadow-sm">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none text-[12px] font-black uppercase italic outline-none focus:ring-0 text-slate-700 dark:text-slate-200 w-32"
                />
            </div>
            <button 
              onClick={handleSync}
              disabled={syncing}
              className={`flex items-center space-x-2 px-8 py-3.5 bg-slate-800 text-white dark:bg-slate-700 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl shadow-slate-500/20 active:scale-95 italic ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'YÜKLƏNİR...' : 'SİNXRONİZASİYA'}</span>
            </button>
            <button 
              onClick={() => setIsManualModalOpen(true)}
              className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 italic"
            >
                <Plus className="w-4 h-4" />
                <span>ƏLAVƏ ET</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit">
                  <button 
                    onClick={() => setActiveTab('active')}
                    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${activeTab === 'active' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      Aktiv (İşlədilən)
                  </button>
                  <button 
                    onClick={() => setActiveTab('inactive')}
                    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${activeTab === 'inactive' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      Passiv (Hamısı)
                  </button>
              </div>

              <div className="relative w-full lg:max-w-md group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Valyuta adı və ya kodu ilə axtarış..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-14 pr-6 text-xs font-black italic outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300" 
                  />
              </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[600px]">
              <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Məlumatlar gətirilir...</p>
                    </div>
                  ) : filteredData.length > 0 ? (
                    <table className="w-full text-left text-xs font-bold tabular-nums italic">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100 dark:border-slate-800">
                                <th className="px-10 py-6">Valyuta</th>
                                <th className="px-6 py-6 text-center">Kod</th>
                                <th className="px-6 py-6 text-right">Nominal</th>
                                <th className="px-6 py-6 text-right">Məzənnə (AZN)</th>
                                <th className="px-6 py-6 text-center">Status</th>
                                <th className="px-10 py-6 text-right">Hərəkət</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredData.map((item, idx) => (
                                <tr key={item.code} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-all">
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{item.name}</span>
                                            <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-0.5">Mərkəzi Bankın Rəsmi Kursu</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[11px] font-black tracking-widest">{item.code}</span>
                                    </td>
                                    <td className="px-6 py-6 text-right text-slate-400 text-[11px] font-black">{item.nominal || 1}</td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-base font-black text-slate-800 dark:text-white">{item.rate === '---' ? '---' : parseFloat(item.rate).toFixed(4)} ₼</span>
                                            {item.id && (
                                                <button onClick={() => toggleLock(item.id!, item.isLocked)} className={`flex items-center text-[9px] mt-1 uppercase font-black tracking-widest ${item.isLocked ? 'text-amber-500' : 'text-slate-300 hover:text-indigo-400'}`}>
                                                    {item.isLocked ? <Lock className="w-2.5 h-2.5 mr-1" /> : <Unlock className="w-2.5 h-2.5 mr-1" />}
                                                    {item.isLocked ? 'KİLİDLİ' : 'KİLİDLƏ'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic border ${item.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                           {item.isActive ? 'AKTİV' : 'PASSİV'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button 
                                          onClick={() => toggleActive(item.code, item.isActive)}
                                          className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic border shadow-sm ${item.isActive ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
                                        >
                                            {item.isActive ? (
                                              <><Trash2 className="w-3.5 h-3.5" /> <span>PASSİVƏ KEÇİR</span></>
                                            ) : (
                                              <><Plus className="w-3.5 h-3.5" /> <span>AKTİVƏ KEÇİR</span></>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  ) : (
                    <div className="py-40 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <History className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] italic">Məzənnə tapılmadı</p>
                    </div>
                  )}
              </div>
          </div>
      </div>

      <div className="bg-slate-800 dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-black uppercase tracking-tight italic">Gündəlik Təsdiqləmə</h3>
                  </div>
                  <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-tight italic max-w-xl">
                    Bugünkü məzənnələri təsdiq edərək bütün maliyyə əməliyyatları üçün aktivləşdirin. Təsdiq olunmuş status növbəti gün üçün şablon kimi istifadə olunacaq.
                  </p>
              </div>
              <button 
                onClick={() => alert("Məzənnələr təsdiqləndi!")}
                className="px-12 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/30 italic"
              >
                TƏSDİQ ET VƏ YADDA SAXLA
              </button>
          </div>
          <RefreshCw className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
      </div>
    </div>
  );
};

export default CurrencyList;
