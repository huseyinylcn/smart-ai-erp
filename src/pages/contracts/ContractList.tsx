import { useState } from 'react';
import { 
  FileSignature, Search, Filter, Plus, 
  ChevronRight, MoreHorizontal, Calendar, 
  User, DollarSign, Clock, AlertTriangle,
  Download, FileText, CheckCircle2, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SimulationWizard from '../../components/SimulationWizard';

type ContractRow = {
  id: string;
  partner: string;
  type: string;
  date: string;
  expiryDate: string;
  amount: number;
  status: string;
  qrp: boolean;
};

const ContractList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation of Contracts Data
  const [contracts, setContracts] = useState<ContractRow[]>(() => {
    const saved = localStorage.getItem('TENGRY_CONTRACTS');
    return saved ? (JSON.parse(saved) as ContractRow[]) : [
      { id: 'CONT-SIM-01', partner: 'Metal Sənaye (Bakı) MMC', type: 'ALIBAL (Mallar)', date: '2024-09-15', expiryDate: '2025-09-15', amount: 45600, status: 'ACTIVE', qrp: true },
      { id: 'CONT-SIM-02', partner: 'Tekstil Dünyası Group', type: 'ALIBAL (Mallar)', date: '2024-09-16', expiryDate: '2025-09-16', amount: 12450, status: 'ACTIVE', qrp: true },
      { id: 'CONT-SIM-03', partner: 'Kimya və Boya Logistika', type: 'ALIBAL (Mallar)', date: '2024-09-17', expiryDate: '2025-09-17', amount: 8900, status: 'ACTIVE', qrp: true },
      { 
        id: 'CONT-2026-0042', 
        partner: 'Supplier Group MMC', 
        type: 'ALIBAL (Mallar)', 
        date: '2026-01-15', 
        expiryDate: '2027-01-15', 
        amount: 250500.00, 
        status: 'ACTIVE',
        qrp: true 
      },
      { 
        id: 'CONT-2026-0015', 
        partner: 'Global Trade LLC', 
        type: 'XİDMƏT', 
        date: '2026-02-10', 
        expiryDate: '2026-04-10', 
        amount: 12400.00, 
        status: 'EXPIRING',
        qrp: false 
      },
      { 
        id: 'CONT-2025-0890', 
        partner: 'Delta Logistics', 
        type: 'İCARƏ', 
        date: '2025-05-01', 
        expiryDate: '2026-05-01', 
        amount: 45000.00, 
        status: 'ACTIVE',
        qrp: true 
      },
      { 
        id: 'CONT-2024-0321', 
        partner: 'Texno Servis MMC', 
        type: 'TƏMİR', 
        date: '2024-03-20', 
        expiryDate: '2025-03-20', 
        amount: 8500.00, 
        status: 'EXPIRED',
        qrp: false 
      }
    ];
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 shadow-emerald-100 dark:shadow-none';
      case 'EXPIRING': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 shadow-amber-100 dark:shadow-none';
      case 'EXPIRED': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 shadow-rose-100 dark:shadow-none';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-900/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktiv';
      case 'EXPIRING': return 'Bitir (30 gün)';
      case 'EXPIRED': return 'Müddəti bitib';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner">Legal</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Contract Management</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Müqavilə Reyestri</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/contracts/create')}
            className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Müqavilə</span>
          </button>
        </div>
      </div>

      {/* ALERT BOX FOR EXPIRING */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-[2.5rem] p-8 flex items-center justify-between shadow-sm shadow-amber-500/5">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/10 border border-amber-50">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-black text-amber-800 dark:text-amber-400 uppercase tracking-tight italic">Müddəti bitən sənədlər!</h4>
            <p className="text-[11px] font-bold text-amber-700/70 uppercase italic tracking-tighter mt-1">Önümüzdəki 30 gün ərzində 5 müqavilənin müddəti başa çatır. Zəhmət olmasa tədbir görün.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-white dark:bg-slate-900 text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-amber-100 transition-all italic">
          Siyahıya bax
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Müqavilə No, Kontragent və ya Predmet üzrə axtar..."
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none transition-all focus:ring-2 focus:ring-indigo-500/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-6 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-inner hover:bg-slate-100 transition-all italic">
              <Filter className="w-4 h-4" />
              <span>Filtrlər</span>
            </button>
            <button className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl shadow-inner hover:text-indigo-500 transition-all">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CONTRACTS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sənəd No / Tarix</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Kontragent</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Növ</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Məbləğ</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">QRP</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Status</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {contracts.map((c) => (
              <tr 
                key={c.id} 
                className="group hover:bg-indigo-50/20 dark:hover:bg-indigo-900/5 transition-all cursor-pointer"
                onClick={() => navigate(`/contracts/detail/${c.id}`)}
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 dark:text-white mb-1 tabular-nums italic">{c.id}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">{c.date}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase italic tracking-tight">{c.partner}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 rounded-lg uppercase tracking-widest italic">
                    {c.type}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="text-sm font-black text-slate-800 dark:text-white tabular-nums italic">
                    ₼ {c.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-8 py-6 text-center shadow-inner">
                  {c.qrp ? (
                    <div className="flex items-center justify-center text-indigo-500" title="Qiymət Razılaşma Protokolu Var">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-slate-200 dark:text-slate-700">
                      <XCircle className="w-5 h-5 shadow-inner" />
                    </div>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-sm ${getStatusStyle(c.status)}`}>
                    {getStatusLabel(c.status)}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                     <button className="p-3 text-slate-300 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                     </button>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ContractList;
