import React, { useState } from 'react';
import { 
  Plus, Search, Filter, FileText, 
  ChevronRight, MoreVertical, 
  Calendar, Truck, DollarSign,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage or use defaults
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('TENGRY_PURCHASE_ORDERS');
    return saved ? JSON.parse(saved) : [
      { id: 'PO-SIM-01', number: 'PO-2024-09-001', vendor: 'Metal Sənaye (Bakı) MMC', date: '2024-09-25', total: 45600, status: 'APPROVED', fulfilment: 'PENDING' },
      { id: 'PO-SIM-02', number: 'PO-2024-09-002', vendor: 'Tekstil Dünyası Group', date: '2024-09-26', total: 12450, status: 'APPROVED', fulfilment: 'PENDING' },
      { id: '1', number: 'PO-2024-001', vendor: 'Azərsun Holdinq', date: '2024-04-20', total: 12500, status: 'APPROVED', fulfilment: 'PARTIAL' },
      { id: '2', number: 'PO-2024-002', vendor: 'Baku Steel Company', date: '2024-04-18', total: 45000, status: 'DRAFT', fulfilment: 'PENDING' },
      { id: '3', number: 'PO-2024-003', vendor: 'PMD Group', date: '2024-04-15', total: 8400, status: 'COMPLETED', fulfilment: 'FULL' },
      { id: '4', number: 'PO-2024-004', vendor: 'Optimal Elektronika', date: '2024-04-12', total: 3200, status: 'CANCELLED', fulfilment: 'NONE' },
    ];
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getFulfilmentIcon = (type: string) => {
    switch (type) {
      case 'FULL': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'PARTIAL': return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      default: return <AlertCircle className="w-3.5 h-3.5 text-slate-300" />;
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Satınalma Sifarişləri</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Təchizat zəncirinin başlanğıc nöqtəsi</p>
        </div>
        <button 
          onClick={() => navigate('/purchase/order/create')}
          className="flex items-center space-x-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Sifariş Yarat</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Ümumi Sifariş', value: '42', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Gözləyən Mədaxil', value: '12', icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Təsdiqlənmiş', value: '28', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Aylıq Həcm', value: '142,500 ₼', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
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

      {/* Filters & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Sifariş № və ya Təchizatçı axtar..."
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
                <th className="px-8 py-5">Sifariş №</th>
                <th className="px-6 py-5">Təchizatçı</th>
                <th className="px-6 py-5 text-center">Tarix</th>
                <th className="px-6 py-5 text-right">Məbləğ</th>
                <th className="px-6 py-5 text-center">Fulfillment</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">{order.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800 dark:text-white uppercase italic">{order.vendor}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Local Supplier</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{order.date}</span>
                      <Calendar className="w-3 h-3 text-slate-300 mt-0.5" />
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-[13px] font-black text-slate-800 dark:text-white tabular-nums">{order.total.toLocaleString()} ₼</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {getFulfilmentIcon(order.fulfilment)}
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{order.fulfilment}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/30 dark:bg-slate-800/20 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Cəmi {orders.length} sənəd göstərilir</p>
          <div className="flex items-center space-x-1">
             {[1, 2, 3].map(p => (
               <button key={p} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${p === 1 ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}>{p}</button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
