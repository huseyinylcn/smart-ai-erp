import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Download, Filter, Search, Calendar, 
  ChevronRight, Landmark, Wallet, History, Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const BalanceTurnoverReport = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!activeCompany) return;
      setLoading(true);
      try {
        const res = await financeApi.getAccounts(activeCompany.id);
        // Mocking turnovers for demonstration
        const mockData = res.data.map((acc: any) => ({
          ...acc,
          openingBalance: Math.random() * 10000,
          debit: Math.random() * 5000,
          credit: Math.random() * 5000,
        }));
        setData(mockData);
      } catch (error) {
        console.error("Hesabat yüklənərkən xəta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCompany?.id, dateRange]);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totals = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      opening: acc.opening + curr.openingBalance,
      debit: acc.debit + curr.debit,
      credit: acc.credit + curr.credit,
      closing: acc.closing + (curr.openingBalance + curr.debit - curr.credit)
    }), { opening: 0, debit: 0, credit: 0, closing: 0 });
  }, [filteredData]);

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
            <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900/30 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Hesabatlar / Xəzinə</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Qalıqlar və Dövriyyələr</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic tracking-tight">Kassa və Bank hesabları üzrə ətraflı hərəkət hesabatı</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-slate-100 dark:border-slate-700 shadow-sm">
            <Printer className="w-4 h-4" />
            <span>Çap Et</span>
          </button>
          <button className="flex items-center space-x-2 px-8 py-3.5 bg-slate-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-500/20 italic">
            <Download className="w-4 h-4" />
            <span>Excel Export</span>
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="lg:col-span-4 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Hesab adı və ya kodu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-6 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/10" 
          />
        </div>
        <div className="lg:col-span-6 flex items-center space-x-4">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 space-x-3 flex-1">
             <Calendar className="w-4 h-4 text-slate-400" />
             <input 
               type="date" 
               value={dateRange.start}
               onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
               className="bg-transparent border-none text-[11px] font-black uppercase italic outline-none flex-1"
             />
             <span className="text-slate-300">/</span>
             <input 
               type="date" 
               value={dateRange.end}
               onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
               className="bg-transparent border-none text-[11px] font-black uppercase italic outline-none flex-1"
             />
          </div>
        </div>
        <div className="lg:col-span-2">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-indigo-100">
            <Filter className="w-4 h-4" />
            <span>Filtrlər</span>
          </button>
        </div>
      </div>

      {/* REPORT TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 italic border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Hesab / Kassa</th>
                <th className="px-6 py-5">Kod</th>
                <th className="px-6 py-5 text-right">İlkin Qalıq</th>
                <th className="px-6 py-5 text-right">Dövriyyə (D)</th>
                <th className="px-6 py-5 text-right">Dövriyyə (K)</th>
                <th className="px-6 py-5 text-right">Son Qalıq</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all italic tabular-nums">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          {item.code.startsWith('221') ? <Wallet className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[11px] font-black text-slate-400">{item.code}</td>
                    <td className="px-6 py-5 text-right font-bold text-slate-600 dark:text-slate-400">{item.openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-5 text-right font-black text-emerald-600">{item.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-5 text-right font-black text-rose-600">{item.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-5 text-right font-black text-slate-800 dark:text-white">{(item.openingBalance + item.debit - item.credit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center italic text-slate-400 uppercase text-[10px] font-black">Məlumat tapılmadı</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-900 text-white font-black italic tabular-nums">
              <tr>
                <td colSpan={2} className="px-8 py-6 uppercase tracking-widest text-indigo-400">CƏMİ (AZN Ekvivalentilə)</td>
                <td className="px-6 py-6 text-right">{totals.opening.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-6 text-right text-emerald-400">{totals.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-6 text-right text-rose-400">{totals.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-6 text-right text-indigo-400">{totals.closing.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-[2rem] border border-dashed border-indigo-200 dark:border-indigo-800 flex items-start space-x-4">
        <History className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
        <div className="space-y-2">
          <h4 className="text-[11px] font-black text-indigo-800 dark:text-indigo-400 uppercase italic">Uçot Siyasəti Qeydi</h4>
          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight italic">
            Bu hesabat bütün valyuta hesablarını AZN ekvivalenti ilə (Mərkəzi Bankın cari tarixdəki rəsmi məzənnəsi ilə) göstərir. Valyuta üzrə detallaşdırılmış hesabat üçün "Valyuta Qalıqları" moduluna keçid edin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceTurnoverReport;
