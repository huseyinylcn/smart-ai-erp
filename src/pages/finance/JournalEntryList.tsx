import { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, 
  Eye, CheckCircle2, Clock, ArrowRightLeft, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import { financeApi } from '../../utils/api';

const JournalEntryList = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const { formatDate, formatCurrency } = useFormat();
  const [entries, setEntries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    if (!activeCompany) return;
    setIsLoading(true);
    try {
      // For the audit registry, we fetch all transactions for the company
      // Using empty params object for initial load
      const res = await financeApi.getTransactions({}, activeCompany.id);
      setEntries(res.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCompany?.id]);

  const filteredEntries = entries.filter(entry => 
    entry.voucherNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Financial Audit Readiness</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Müxabirləşmə Reyestri</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-indigo-500/10 underline-offset-4 tracking-tight leading-none mt-2">Bütün debit/kredit yazılışlarının mərkəzləşdirilmiş jurnalı</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchData}
            disabled={isLoading}
            className="p-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => navigate('/finance/journal/create')}
            className="flex items-center space-x-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 italic leading-none"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Yeni Müxabirləşmə (JE)</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Vauçer №, Təsvir ilə axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[14px] focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 transition-all outline-none font-black italic tracking-tight"
            />
         </div>
         <button className="flex items-center space-x-2 px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all italic leading-none">
            <Filter className="w-4 h-4" />
            <span>Filtrlər</span>
         </button>
         <button className="p-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
            <Download className="w-5 h-5" />
         </button>
      </div>

      {/* JOURNAL TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-2">
         <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-[9px] font-black uppercase tracking-widest italic text-slate-400">
                   <tr>
                      <th className="p-6">Tarix</th>
                      <th className="p-6">Vauçer №</th>
                      <th className="p-6">Təsvir (Memo)</th>
                      <th className="p-6 text-right">Məbləğ</th>
                      <th className="p-6 text-center">Status</th>
                      <th className="p-6"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                   {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                     <tr key={entry.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                        <td className="p-5 px-6 font-black tabular-nums text-slate-400 whitespace-nowrap italic">{formatDate(entry.postingDate)}</td>
                        <td className="p-5 px-6">
                           <div className="flex flex-col">
                              <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">{entry.voucherNo}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{entry.sourceModule || 'MANUAL'}</span>
                           </div>
                        </td>
                        <td className="p-5 px-6">
                            <span className="font-medium text-slate-600 dark:text-slate-400 line-clamp-1 italic">{entry.description}</span>
                        </td>
                        <td className="p-5 text-right font-black italic tabular-nums text-indigo-600 dark:text-indigo-400 text-[13px]">
                           {formatCurrency(entry.totalAmount, 'AZN')}
                        </td>
                        <td className="p-5">
                           <div className="flex justify-center">
                              {entry.status === 'POSTED' ? (
                                <span className="px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-[8.5px] font-black uppercase tracking-widest italic flex items-center space-x-1 shadow-sm border border-emerald-200/50">
                                   <CheckCircle2 className="w-2.5 h-2.5" />
                                   <span>POSTED</span>
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[8.5px] font-black uppercase tracking-widest italic flex items-center space-x-1">
                                   <Clock className="w-2.5 h-2.5" />
                                   <span>DRAFT</span>
                                </span>
                              )}
                           </div>
                        </td>
                        <td className="p-5 text-right">
                           <button 
                             onClick={() => navigate(`/finance/transaction/${entry.id}`)}
                             className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"
                           >
                              <Eye className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                   )) : (
                     <tr>
                        <td colSpan={6} className="p-10 text-center text-slate-400 font-black uppercase italic tracking-widest">
                           Məlumat yoxdur.
                        </td>
                     </tr>
                   )}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default JournalEntryList;
