import React, { useState } from 'react';
import { 
  Plus, Search, Filter, FileText, 
  ChevronRight, MoreVertical, 
  Calendar, ShoppingCart, User,
  CheckCircle2, Clock, AlertCircle, FilePlus2, ListFilter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type RequisitionRow = {
  id: string;
  number: string;
  requester: string;
  date: string;
  totalEstimated: number;
  status: 'DRAFT' | 'PENDING' | 'RFQ' | 'ORDERED' | 'CANCELLED';
  itemCount: number;
};

const PurchaseRequisitionList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [requisitions] = useState<RequisitionRow[]>([
    { id: '1', number: 'PR-2024-001', requester: 'Əli Məmmədov', date: '2024-04-20', totalEstimated: 12500, status: 'PENDING', itemCount: 5 },
    { id: '2', number: 'PR-2024-002', requester: 'Sistem (Avto)', date: '2024-04-18', totalEstimated: 45000, status: 'RFQ', itemCount: 12 },
    { id: '3', number: 'PR-2024-003', requester: 'PMD Group Admin', date: '2024-04-15', totalEstimated: 8400, status: 'ORDERED', itemCount: 3 },
    { id: '4', number: 'PR-2024-004', requester: 'Optimal Elektronika', date: '2024-04-12', totalEstimated: 3200, status: 'DRAFT', itemCount: 1 },
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'RFQ': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'ORDERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Satınalma Sorğuları (PR)</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Xarici satınalma ehtiyaclarının mərkəzi reyestri</p>
        </div>
        <button 
          onClick={() => navigate('/purchase/requisitions/create')}
          className="flex items-center space-x-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Sorğu Yarat</span>
        </button>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Gözləyən Sorğular', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'RFQ Mərhələsi', value: '5', icon: ListFilter, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Sifariş Edilib', value: '28', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Ümumi Tələb', value: '84,200 ₼', icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-slate-800 dark:text-white tabular-nums">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Registry Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Sorğu № və ya Məsul Şəxs axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold shadow-inner focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Sorğu №</th>
                <th className="px-6 py-5">Sorğuçu</th>
                <th className="px-6 py-5 text-center">Tarix</th>
                <th className="px-4 py-5 text-center">Mallar</th>
                <th className="px-6 py-5 text-right">Təxmini Məbləğ</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {requisitions.map((req) => (
                <tr key={req.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">{req.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-black text-slate-800 dark:text-white uppercase italic">{req.requester}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-mono text-[11px] font-bold text-slate-500 italic">{req.date}</td>
                  <td className="px-4 py-5 text-center">
                    <span className="text-xs font-black text-slate-800 dark:text-white tabular-nums">{req.itemCount} SKU</span>
                  </td>
                  <td className="px-6 py-5 text-right font-black text-slate-800 dark:text-white tabular-nums">
                    {req.totalEstimated.toLocaleString()} ₼
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(req.status)}`}>
                      {req.status === 'PENDING' ? 'GÖZLƏYİR' : 
                       req.status === 'RFQ' ? 'RFQ MƏRHƏLƏSİ' : 
                       req.status === 'ORDERED' ? 'SİFARİŞ EDİLİB' : 
                       req.status === 'CANCELLED' ? 'LƏĞV EDİLDİ' : 'QARALAMA'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {req.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate('/purchase/rfq/create', { state: { requisitionId: req.id } }); }}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                          >
                            <FilePlus2 className="w-3 h-3" />
                            <span>RFQ Yarat</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate('/purchase/order/create', { state: { requisitionId: req.id } }); }}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Birbaşa Sifariş</span>
                          </button>
                        </>
                      )}
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequisitionList;
