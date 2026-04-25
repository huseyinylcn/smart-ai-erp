import { useState, useEffect } from 'react';
import { 
  RefreshCw, Layers, Calendar, Download as DownloadIcon, 
  ChevronRight, ExternalLink, AlertCircle
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import { financeApi } from '../../utils/api';

const GeneralLedger = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const { formatDate, formatNumber, formatCurrency } = useFormat();
  
  const initialAccount = searchParams.get('accountCode') || '';
  const initialStart = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const initialEnd = searchParams.get('endDate') || new Date().toISOString().split('T')[0];

  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccount);
  const [dateRange] = useState({ start: initialStart, end: initialEnd });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!activeCompany) return;
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch Accounts for selector
      const accRes = await financeApi.getAccounts(activeCompany.id);
      setAccounts(accRes.data || []);
      
      // Select first account if none selected
      if (!selectedAccountId && accRes.data?.length > 0) {
        setSelectedAccountId(accRes.data[0].id);
      }

      // 2. Fetch Transactions
      const transRes = await financeApi.getTransactions({
        accountId: selectedAccountId || (accRes.data?.[0]?.id),
        startDate: dateRange.start,
        endDate: dateRange.end
      }, activeCompany.id);
      
      setLedgerData(transRes.data || []);
    } catch (err: any) {
      console.error(err);
      setError('Məlumatlar gətirilərkən xəta baş verdi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCompany?.id, selectedAccountId]);

  const totals = {
    debit: ledgerData.reduce((sum, entry) => sum + (entry.lines?.filter((l: any) => l.debitAmount).reduce((s: number, l: any) => s + l.debitAmount, 0) || 0), 0),
    credit: ledgerData.reduce((sum, entry) => sum + (entry.lines?.filter((l: any) => l.creditAmount).reduce((s: number, l: any) => s + l.creditAmount, 0) || 0), 0)
  };
  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 italic-none">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Account Statements</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Baş Kitab (General Ledger)</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-indigo-500/10 underline-offset-4 tracking-tight leading-none mt-2">Dövr üzrə hesabın bütün müxabirləşmə tarixçəsi</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-1 shadow-sm">
             <div className="flex items-center px-4 py-2 border-r border-slate-100 dark:border-slate-800">
                <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-[10px] font-black uppercase italic tracking-tighter cursor-pointer pr-4">
                {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                </span>
             </div>
             <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                <RefreshCw className="w-4 h-4" />
             </button>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 active:scale-95 italic leading-none">
             <DownloadIcon className="w-4 h-4" />
             <span>İxrac Et</span>
          </button>
        </div>
      </div>

      {/* ACCOUNT SELECTOR */}
      <div className="flex flex-col md:flex-row gap-4 bg-indigo-600 p-8 rounded-[3.5rem] shadow-xl shadow-indigo-500/10 dark:shadow-none relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-20 -mt-20 rounded-full blur-3xl pointer-events-none"></div>
         
         <div className="flex-1 z-10">
            <label className="block text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-4 px-4 italic">Analiz Edilən Hesab</label>
            <div className="relative group">
                <Layers className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <select 
                  className="w-full pl-16 pr-8 py-5 bg-white/10 border border-white/20 rounded-3xl text-white text-[17px] font-black italic tracking-wide appearance-none outline-none focus:bg-white/20 transition-all cursor-pointer shadow-inner"
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                >
                   {accounts.map(acc => (
                     <option key={acc.id} className="text-slate-900 font-bold" value={acc.id}>{acc.code} - {acc.name}</option>
                   ))}
                </select>
            </div>
         </div>
         
         <div className="flex gap-4 md:w-[420px] z-10">
            <div className="flex-1 bg-white/10 rounded-[2.5rem] p-6 border border-white/10 backdrop-blur-md">
               <span className="block text-[9px] font-black text-indigo-200 uppercase tracking-widest italic opacity-80">Giriş Qalığı</span>
               <div className="flex items-baseline space-x-1 mt-2">
                  <span className="text-2xl font-black text-white tabular-nums italic leading-none">{formatNumber(15400.50)}</span>
                  <span className="text-[10px] font-black text-indigo-300 uppercase italic">AZN</span>
               </div>
            </div>
            <div className="flex-1 bg-white/20 rounded-[2.5rem] p-6 border border-white/20 backdrop-blur-md text-right shadow-lg">
               <span className="block text-[9px] font-black text-indigo-100 uppercase tracking-widest italic text-right">Cari Balans</span>
               <div className="flex items-baseline justify-end space-x-1 mt-2">
                  <span className="text-2xl font-black text-white tabular-nums italic leading-none">{formatNumber(9825.50)}</span>
                  <span className="text-[10px] font-black text-indigo-100 uppercase italic">AZN</span>
               </div>
            </div>
         </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-2">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
                <thead className="bg-[#F9FAFB] dark:bg-slate-800/30 text-[9px] font-black uppercase tracking-widest italic text-slate-400">
                   <tr>
                      <th className="p-6">Tarix</th>
                      <th className="p-6">Vauçer / Sənəd</th>
                      <th className="p-6">Mənbə</th>
                      <th className="p-6">Təsvir</th>
                      <th className="p-6 text-right">Debet (DR)</th>
                      <th className="p-6 text-right">Kredit (CR)</th>
                      <th className="p-6 text-right bg-indigo-50/30 dark:bg-indigo-900/10">Yekun Qalıq</th>
                      <th className="p-6 w-10"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                   {ledgerData.map((entry) => {
                     const entryDebit = entry.lines?.filter((l: any) => l.debitAmount).reduce((s: number, l: any) => s + l.debitAmount, 0) || 0;
                     const entryCredit = entry.lines?.filter((l: any) => l.creditAmount).reduce((s: number, l: any) => s + l.creditAmount, 0) || 0;

                     return (
                       <tr 
                         key={entry.id} 
                         onClick={() => navigate(`/finance/transaction/${entry.id}`)}
                         className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all cursor-pointer relative"
                         title="Vauçer detallarına baxmaq üçün klikləyin"
                       >
                          <td className="p-5 px-6 font-black tabular-nums text-slate-400 italic">{formatDate(entry.postingDate)}</td>
                          <td className="p-5 px-6 whitespace-nowrap">
                              <div className="flex flex-col leading-none">
                                <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none group-hover:text-indigo-600 transition-colors underline decoration-transparent group-hover:decoration-indigo-200 underline-offset-4">{entry.voucherNo}</span>
                                <div className="flex items-center mt-1.5 space-x-2">
                                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{entry.sourceModule || 'MANUAL'}</span>
                                   <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                   <span className="text-[9px] font-bold text-slate-400">{entry.sourceNumber || '-'}</span>
                                </div>
                              </div>
                          </td>
                          <td className="p-5 px-6">
                             <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase italic tracking-tighter shadow-sm border ${
                                entry.origin === 'SYSTEM' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                'bg-slate-50 text-slate-500 border-slate-100'
                             }`}>
                                {entry.origin}
                             </span>
                          </td>
                          <td className="p-5 px-6 font-semibold text-slate-600 dark:text-slate-400 italic max-w-[200px] truncate">{entry.description}</td>
                          <td className="p-5 text-right font-black italic tabular-nums text-slate-900 dark:text-white text-[13px]">
                             {entryDebit > 0 ? formatNumber(entryDebit) : '-'}
                          </td>
                          <td className="p-5 text-right font-black italic tabular-nums text-slate-900 dark:text-white text-[13px]">
                             {entryCredit > 0 ? formatNumber(entryCredit) : '-'}
                          </td>
                          <td className={`p-5 text-right font-black italic tabular-nums bg-indigo-50/20 dark:bg-indigo-900/10 text-indigo-600 text-[14px]`}>
                             {formatNumber(entryDebit - entryCredit)}
                          </td>
                          <td className="p-5 text-right pr-6">
                             <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="w-4 h-4 text-indigo-400" />
                             </div>
                          </td>
                       </tr>
                     );
                   })}
                </tbody>
            </table>
         </div>
      </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ümumi Debet Dövriyyəsi</span>
               <span className="block text-2xl font-black text-slate-800 dark:text-white tabular-nums italic mt-2 leading-none">{formatNumber(totals.debit)}</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
               <ChevronRight className="w-6 h-6 rotate-90" />
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ümumi Kredit Dövriyyəsi</span>
               <span className="block text-2xl font-black text-slate-800 dark:text-white tabular-nums italic mt-2 leading-none">{formatNumber(totals.credit)}</span>
            </div>
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
               <ChevronRight className="w-6 h-6 -rotate-90" />
            </div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Dövr üzrə Saldo</span>
               <span className={`block text-2xl font-black tabular-nums italic mt-2 leading-none ${totals.debit - totals.credit >= 0 ? 'text-white' : 'text-rose-500'}`}>
                  {formatNumber(Math.abs(totals.debit - totals.credit))}
               </span>
            </div>
            <div className="relative z-10 px-4 py-2 bg-white/10 rounded-xl text-[10px] font-bold text-white uppercase italic tracking-widest border border-white/5">
               {totals.debit - totals.credit >= 0 ? 'Debit' : 'Credit'}
            </div>
         </div>
      </div>
    </div>
  );
};

export default GeneralLedger;
