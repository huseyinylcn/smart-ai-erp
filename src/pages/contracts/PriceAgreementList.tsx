import { useState } from 'react';
import { 
  ClipboardList, Search, Plus, Filter,
  FileSignature, ChevronRight, Package,
  MoreHorizontal, Download, History,
  DollarSign, CheckCircle2, Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PriceAgreementRow = {
  id: string;
  contractId: string;
  partner: string;
  itemCount: number;
  date: string;
  status: string;
  totalEstimated: number;
};

const PriceAgreementList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [agreements, setAgreements] = useState<PriceAgreementRow[]>(() => {
    const saved = localStorage.getItem('TENGRY_QRP');
    return saved ? (JSON.parse(saved) as PriceAgreementRow[]) : [
      { id: 'QRP-SIM-01', contractId: 'CONT-SIM-01', partner: 'Metal Sənaye (Bakı) MMC', itemCount: 15, date: '2024-09-20', status: 'ACTIVE', totalEstimated: 45600 },
      { id: 'QRP-SIM-02', contractId: 'CONT-SIM-02', partner: 'Tekstil Dünyası Group', itemCount: 8, date: '2024-09-21', status: 'ACTIVE', totalEstimated: 12450 },
      { id: 'QRP-SIM-03', contractId: 'CONT-SIM-03', partner: 'Kimya və Boya Logistika', itemCount: 10, date: '2024-09-22', status: 'ACTIVE', totalEstimated: 8900 },
      { 
        id: 'QRP-2026-015', 
        contractId: 'CONT-2026-0042',
        partner: 'Supplier Group MMC', 
        itemCount: 12,
        date: '2026-01-20', 
        status: 'ACTIVE',
        totalEstimated: 125000.00
      },
      { 
        id: 'QRP-2026-008', 
        contractId: 'CONT-2025-0890',
        partner: 'Delta Logistics', 
        itemCount: 4,
        date: '2026-02-15', 
        status: 'ACTIVE',
        totalEstimated: 8400.00
      },
      { 
        id: 'QRP-2026-022', 
        contractId: 'CONT-2026-0155',
        partner: 'UniTrade LLC', 
        itemCount: 45,
        date: '2026-03-25', 
        status: 'DRAFT',
        totalEstimated: 4200.00
      }
    ];
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20';
      case 'DRAFT': return 'bg-slate-100 text-slate-600 dark:bg-slate-800';
      case 'EXPIRED': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-900/20';
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner">Pricing</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Legal & Procurement</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-sm">QRP Reyestri</h1>
        </div>
        <button onClick={() => navigate('/contracts/create')} className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Yeni QRP</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 italic-none">
        <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm italic-none">
           <div className="relative group italic-none">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="QRP No, Müqavilə No və ya Kontragent üzrə axtar..." className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
           </div>
        </div>
        <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex items-center justify-center space-x-4 italic-none">
           <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all italic shadow-inner">
              <Filter className="w-4 h-4" />
              <span>Filtrlər</span>
           </button>
           <button className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl shadow-inner hover:text-indigo-500 transition-all">
              <Download className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm italic-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">QRP No / Tarix</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Əlaqəli Müqavilə</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tərəf (Kontragent)</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Mal Sayı</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Status</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none">
            {agreements.map((a) => (
              <tr key={a.id} className="group hover:bg-amber-50/20 dark:hover:bg-amber-900/5 transition-all cursor-pointer" onClick={() => navigate(`/contracts/detail/${a.contractId}`)}>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 dark:text-white mb-1 tabular-nums italic">{a.id}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">{a.date}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center space-x-2 text-indigo-500 font-bold text-[11px] uppercase tracking-widest italic">
                      <FileSignature className="w-3.5 h-3.5" />
                      <span>{a.contractId}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase italic tracking-tight">{a.partner}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                   <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] font-black italic">{a.itemCount}</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-sm ${getStatusStyle(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                     <button className="p-3 text-slate-300 hover:text-amber-600 transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                     </button>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-all group-hover:translate-x-1" />
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

export default PriceAgreementList;
