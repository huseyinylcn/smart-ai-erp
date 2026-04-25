import { useState } from 'react';
import { 
  ArrowLeft, CircleDollarSign, Calendar, 
  Filter, Search, Download, Printer,
  TrendingUp, TrendingDown,
  ArrowUpRight,
  ChevronRight, Calculator, Landmark, ShoppingCart, Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FxGainLossReport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for FX Transactions
  const [transactions] = useState([
    { id: 1, date: '28.03.2024', ref: 'INV-2024-0018', type: 'SALE', entity: 'Global Logistics MMC', currency: 'USD', amount: 5000, docRate: 1.7000, currentRate: 1.7015, gain: 7.50, loss: 0, status: 'REALIZED' },
    { id: 2, date: '29.03.2024', ref: 'PUR-X-042', type: 'PURCHASE', entity: 'Tech Supply Co.', currency: 'EUR', amount: 12000, docRate: 1.8310, currentRate: 1.8342, gain: 0, loss: 38.40, status: 'REALIZED' },
    { id: 3, date: '30.03.2024', ref: 'FX-2024-0024', type: 'CONVERSION', entity: 'Pasha Bank', currency: 'USD', amount: 1000, docRate: 1.7000, currentRate: 1.6940, gain: 0, loss: 6.00, status: 'REALIZED' },
    { id: 4, date: '31.03.2024', ref: 'BAL-USD-PASH', type: 'BANK_BALANCE', entity: 'Pasha Bank (USD)', currency: 'USD', amount: 12500, docRate: 1.7000, currentRate: 1.7010, gain: 12.50, loss: 0, status: 'UNREALIZED' },
    { id: 5, date: '31.03.2024', ref: 'ACC-REC-01', type: 'AR_REVAL', entity: 'Baku Steel Company', currency: 'EUR', amount: 8400, docRate: 1.8320, currentRate: 1.8342, gain: 18.48, loss: 0, status: 'UNREALIZED' },
  ]);

  const filteredData = transactions.filter(t => 
    t.entity.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.ref.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGain = transactions.reduce((sum, t) => sum + t.gain, 0);
  const totalLoss = transactions.reduce((sum, t) => sum + t.loss, 0);
  const netImpact = totalGain - totalLoss;

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
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Kurs Fərqi Hesabatı</h1>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 italic">FX Gain/Loss Analysis</span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 italic">Realizə olunmuş və olunmamış məzənnə təsiri</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
                <Printer className="w-4 h-4" />
            </button>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
                <Download className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
                <Filter className="w-3.5 h-3.5" />
                <span>Filterlə</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 leading-none">Toplam Gəlir (Gain)</p>
                  <h3 className="text-3xl font-black text-emerald-600 italic tracking-tighter tabular-nums leading-none underline decoration-emerald-200 decoration-wavy underline-offset-8">₼ {totalGain.toFixed(2)}</h3>
              </div>
              <TrendingUp className="absolute bottom-[-10px] right-2 w-20 h-20 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 leading-none">Toplam Xərc (Loss)</p>
                  <h3 className="text-3xl font-black text-rose-600 italic tracking-tighter tabular-nums leading-none underline decoration-rose-200 decoration-wavy underline-offset-8">₼ {totalLoss.toFixed(2)}</h3>
              </div>
              <TrendingDown className="absolute bottom-[-10px] right-2 w-20 h-20 text-rose-500/5 -rotate-12 group-hover:scale-110 transition-transform" />
          </div>

          <div className={`bg-slate-900 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group ${netImpact >= 0 ? 'ring-2 ring-emerald-500/30' : 'ring-2 ring-rose-500/30'}`}>
              <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-2 leading-none">Xalis Təsir (Net Impact)</p>
                  <h3 className={`text-4xl font-black italic tracking-tighter leading-none tabular-nums ${netImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {netImpact >= 0 ? '+' : ''}₼ {netImpact.toFixed(2)}
                  </h3>
              </div>
              <CircleDollarSign className="absolute bottom-[-10px] right-2 w-24 h-24 text-indigo-500/5 group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-600/20 flex flex-col justify-between group relative overflow-hidden">
              <div className="relative z-10">
                  <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em] italic mb-2">Audit Compliance</p>
                  <h3 className="text-xl font-black text-white italic leading-tight">IAS 21 Recomputed</h3>
              </div>
              <p className="text-[9px] font-bold text-indigo-200 uppercase mt-4 italic relative z-10 leading-relaxed">Bütün qalıqlar rəsmi AMB kursuna uyğun yenidən qiymətləndirilib.</p>
              <Calculator className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-all p-4" />
          </div>
      </div>

      {/* FILTER BAR & DATA */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Sənəd, Kontragent və ya Ref üzrə axtar..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-12 pr-6 text-xs font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/10" 
                  />
              </div>
              <div className="flex items-center space-x-2">
                 <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl italic hover:bg-indigo-50 hover:text-indigo-600 transition-all">Realizə Olunmuş</button>
                 <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl italic hover:bg-indigo-50 hover:text-indigo-600 transition-all">Yenidən Qiymətləndirmə</button>
                 <div className="w-[1px] h-6 bg-slate-100 dark:bg-slate-800 mx-2"></div>
                 <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400">
                    <Calendar className="w-4 h-4" />
                 </button>
              </div>
          </div>

          <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
              <table className="w-full text-left text-xs font-bold italic tabular-nums italic grow">
                  <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800">
                          <th className="px-8 py-5">Tarix</th>
                          <th className="px-6 py-5">Mənbə Sənəd / Kontragent</th>
                          <th className="px-6 py-5">Valyuta</th>
                          <th className="px-6 py-5 text-right">Məbləğ</th>
                          <th className="px-6 py-5 text-center">Məzənnələr (Doc vs Curr)</th>
                          <th className="px-6 py-5 text-right">Kurs Fərqi (AZN)</th>
                          <th className="px-8 py-5 text-right">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredData.map(t => (
                        <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                            <td className="px-8 py-6 text-slate-400 font-bold">{t.date}</td>
                            <td className="px-6 py-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        {t.type === 'SALE' && <ShoppingCart className="w-4 h-4" />}
                                        {t.type === 'PURCHASE' && <Truck className="w-4 h-4" />}
                                        {t.type === 'CONVERSION' && <RefreshCw className="w-4 h-4" />}
                                        {t.type === 'BANK_BALANCE' && <Landmark className="w-4 h-4" />}
                                        {t.type === 'AR_REVAL' && <ArrowUpRight className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-black text-slate-800 dark:text-white leading-tight italic">{t.ref}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-80">{t.entity}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6 font-black text-indigo-500 uppercase tracking-widest">{t.currency}</td>
                            <td className="px-6 py-6 text-right font-black italic tracking-tighter tabular-nums text-slate-800 dark:text-white">
                                {t.amount.toLocaleString()} {t.currency}
                            </td>
                            <td className="px-6 py-6 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center space-x-2 text-[10px] font-black italic text-slate-400 uppercase">
                                        <span>{t.docRate.toFixed(4)}</span>
                                        <ChevronRight className="w-3 h-3 text-indigo-400" />
                                        <span className="text-indigo-600">{t.currentRate.toFixed(4)}</span>
                                    </div>
                                    <p className="text-[8px] font-black uppercase text-slate-300 mt-1">RATE SPREAD</p>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-right font-black text-sm italic tracking-tighter tabular-nums">
                                {t.gain > 0 ? (
                                    <div className="flex flex-col items-end">
                                        <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/10">+ {t.gain.toFixed(2)} AZN</span>
                                        <span className="text-[8px] text-emerald-500 uppercase mt-1 leading-none">FX GAIN</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-end">
                                        <span className="text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-lg border border-rose-100 dark:border-rose-900/10">- {t.loss.toFixed(2)} AZN</span>
                                        <span className="text-[8px] text-rose-500 uppercase mt-1 leading-none">FX LOSS</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase italic tracking-[0.1em] ${
                                    t.status === 'REALIZED' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 shadow-inner'
                                }`}>
                                    {t.status === 'REALIZED' ? 'Realizə Olunub' : 'Yenidən Qiy.'}
                                </div>
                            </td>
                        </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          
          {/* Legend / Pager */}
          <div className="p-8 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
             <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase italic">
                    <div className="w-2 h-2 rounded bg-indigo-600"></div>
                    <span>Posted Documents</span>
                </div>
                <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase italic">
                    <div className="w-2 h-2 rounded bg-slate-300"></div>
                    <span>Unrealized Revaluations</span>
                </div>
             </div>
             <div className="flex items-center space-x-2">
                 <button className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white shadow-sm transition-all"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                 <button className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 font-bold text-xs">1</button>
                 <button className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white shadow-sm transition-all">2</button>
                 <button className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white shadow-sm transition-all"><ChevronRight className="w-4 h-4" /></button>
             </div>
          </div>
      </div>
    </div>
  );
};

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default FxGainLossReport;
