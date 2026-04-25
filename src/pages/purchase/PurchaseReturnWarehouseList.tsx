import React, { useState } from 'react';
import { 
  Plus, Search, Filter, RotateCcw, 
  ChevronRight, MoreVertical, 
  Calendar, User, Warehouse,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PurchaseReturnWarehouseList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const returns = [
    { id: '1', number: 'PRW-2024-001', vendor: 'Apple Inc.', date: '2024-04-20', warehouse: 'Bakı Mərkəz', status: 'COMPLETED', reason: 'Defektli məhsul' },
    { id: '2', number: 'PRW-2024-002', vendor: 'Samsung Electronics', date: '2024-04-18', warehouse: 'Gəncə Filial', status: 'DRAFT', reason: 'Səhv çeşid' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Malların Geriyə Qaytarılması Reyestri</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Anbardan təchizatçıya qaytarılan mallar</p>
        </div>
        <button 
          onClick={() => navigate('/purchase/return/warehouse/create')}
          className="flex items-center space-x-2 px-6 py-3.5 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-rose-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Qaytarma</span>
        </button>
      </div>

      {/* Filters & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Sənəd № və ya Təchizatçı axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold shadow-inner focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Qaytarma №</th>
                <th className="px-6 py-5">Təchizatçı</th>
                <th className="px-6 py-5 text-center">Tarix</th>
                <th className="px-6 py-5">Anbar</th>
                <th className="px-6 py-5">Səbəb</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none">
              {returns.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-rose-50 dark:bg-rose-900/20 rounded-lg flex items-center justify-center text-rose-600 group-hover:bg-rose-100 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">{item.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-black text-slate-800 dark:text-white uppercase italic">{item.vendor}</td>
                  <td className="px-6 py-5 text-center text-xs font-bold text-slate-600 dark:text-slate-300">{item.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500">
                      <Warehouse className="w-3 h-3" />
                      <span>{item.warehouse}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase italic truncate max-w-[150px]">{item.reason}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
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

export default PurchaseReturnWarehouseList;
