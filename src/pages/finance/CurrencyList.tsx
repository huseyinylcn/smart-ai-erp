import { useState } from 'react';
import { 
  ArrowLeft, RefreshCw, 
  History, Settings, Search,
  TrendingUp, TrendingDown, Clock,
  MoreVertical, Edit2, CheckCircle2,
  Globe, Landmark, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CurrencyList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for Currencies
  const [currencies] = useState([
    { id: 1, code: 'AZN', symbol: '₼', name: 'Azərbaycan Manatı', rate: 1.00, prevRate: 1.00, status: 'ACTIVE', type: 'FUNCTIONAL', lastSync: 'N/A' },
    { id: 2, code: 'USD', symbol: '$', name: 'ABŞ Dolları', rate: 1.7000, prevRate: 1.7000, status: 'ACTIVE', type: 'FOREIGN', lastSync: '31.03.2024 16:35' },
    { id: 3, code: 'EUR', symbol: '€', name: 'Avro', rate: 1.8342, prevRate: 1.8315, status: 'ACTIVE', type: 'FOREIGN', lastSync: '31.03.2024 16:35' },
    { id: 4, code: 'RUB', symbol: '₽', name: 'Rusiya Rublu', rate: 0.0184, prevRate: 0.0185, status: 'ACTIVE', type: 'FOREIGN', lastSync: '31.03.2024 16:35' },
    { id: 5, code: 'TRY', symbol: '₺', name: 'Türkiyə Lirəsi', rate: 0.0526, prevRate: 0.0529, status: 'ACTIVE', type: 'FOREIGN', lastSync: '31.03.2024 16:35' },
    { id: 6, code: 'GBP', symbol: '£', name: 'Böyük Britaniya Funt Sterlinqi', rate: 2.1450, prevRate: 2.1480, status: 'INACTIVE', type: 'FOREIGN', lastSync: '30.03.2024 16:30' },
  ]);

  const filteredCurrencies = currencies.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4 sticky top-0 z-40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Valyuta və Məzənnə</h1>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 italic">Mərkəzi Bank İnteqrasiyası</span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 italic">Gündəlik məzənnələrin idarəetmə mərkəzi</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>AMB-dən Yenilə</span>
            </button>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
                <History className="w-4 h-4" />
            </button>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
                <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4 group hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Landmark className="w-6 h-6" />
              </div>
              <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Əsas Valyuta</p>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white italic">AZN (₼)</h3>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4 group hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Globe className="w-6 h-6" />
              </div>
              <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Aktiv Valyutalar</p>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white italic">{currencies.filter(c => c.status === 'ACTIVE').length} AD</h3>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4 group hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Clock className="w-6 h-6" />
              </div>
              <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Son Sinxronizasiya</p>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 italic leading-none mt-1">Bu gün, 16:35</h3>
              </div>
          </div>
          <div className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-xl shadow-emerald-500/20 flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                  <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] italic mb-2">Sync Status</p>
                  <h3 className="text-lg font-black italic flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Tam Sinxron
                  </h3>
              </div>
              <RefreshCw className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12 group-hover:rotate-180 transition-all duration-700" />
          </div>
      </div>

      {/* FILTER & TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Valyuta və ya kod üzrə axtar..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-6 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400" 
                  />
              </div>
              <div className="flex items-center space-x-2">
                 <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl italic hover:bg-indigo-50 hover:text-indigo-600 transition-all">Yalnız Aktiv</button>
                 <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl italic hover:bg-indigo-50 hover:text-indigo-600 transition-all">Manual Girişlər</button>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold tabular-nums italic grow">
                  <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] italic border-b border-slate-100 dark:border-slate-800">
                          <th className="px-8 py-5">Valyuta</th>
                          <th className="px-6 py-5">Kod/Simvol</th>
                          <th className="px-6 py-5 text-right">Cari Məzənnə (AZN)</th>
                          <th className="px-6 py-5 text-center">Dəyişim (%)</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5">Son Yenilənmə</th>
                          <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredCurrencies.map(currency => {
                        const change = ((currency.rate - currency.prevRate) / currency.prevRate) * 100;
                        return (
                          <tr key={currency.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                              <td className="px-8 py-6">
                                  <div className="flex items-center space-x-3">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm italic ${
                                          currency.code === 'AZN' ? 'bg-indigo-600 text-white' : 
                                          currency.status === 'ACTIVE' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700' : 
                                          'bg-slate-50 text-slate-300'
                                      }`}>
                                          {currency.code}
                                      </div>
                                      <div>
                                          <p className="text-[13px] font-black text-slate-800 dark:text-white italic">{currency.name}</p>
                                          {currency.type === 'FUNCTIONAL' && <span className="text-[8px] font-black text-indigo-500 uppercase italic leading-none">Uçot Valyutası</span>}
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-6 font-black italic tracking-widest text-slate-500 uppercase">{currency.code} ({currency.symbol})</td>
                              <td className="px-6 py-6 text-right font-black text-sm italic tracking-tighter tabular-nums text-slate-800 dark:text-white">
                                  {currency.rate.toFixed(4)} ₼
                              </td>
                              <td className="px-6 py-6 text-center">
                                  {currency.code !== 'AZN' && (
                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black italic ${
                                        change > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                        change < 0 ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                        'bg-slate-50 text-slate-400'
                                    }`}>
                                        {change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : change < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                                        {Math.abs(change).toFixed(2)}%
                                    </div>
                                  )}
                              </td>
                              <td className="px-6 py-6">
                                  <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase italic ${
                                      currency.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'
                                  }`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${currency.status === 'ACTIVE' ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`}></div>
                                      <span>{currency.status === 'ACTIVE' ? 'Aktiv' : 'Dekativ'}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-6">
                                  <div className="flex items-center text-[10px] font-bold text-slate-400 italic">
                                      <Clock className="w-3 h-3 mr-1.5" />
                                      {currency.lastSync}
                                  </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                                          <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                                          <History className="w-4 h-4" />
                                      </button>
                                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                                          <MoreVertical className="w-4 h-4" />
                                      </button>
                                  </div>
                              </td>
                          </tr>
                        );
                      })}
                  </tbody>
              </table>
          </div>

          <div className="p-8 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm max-w-3xl">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight italic">
                  <strong>IAS 21 Uyğunluğu:</strong> Sistem bütün xarici valyuta əməliyyatlarını AMB-nin rəsmi məzənnələri ilə AZN-ə konvertasiya edir. Valyuta konvertasiyası zamanı yaranan fərqlər avtomatik olaraq <span className="text-emerald-600 underline">Gəlir/Xərc Ledger</span>-inə post ediləcəkdir.
                </p>
                <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
             </div>
          </div>
      </div>
    </div>
  );
};

export default CurrencyList;
