import React, { useState } from 'react';
import { 
  Plus, Search, Filter, FileText, 
  ChevronRight, MoreVertical, 
  Calendar, Building2, User,
  CheckCircle2, Clock, AlertCircle, ArrowRightLeft, ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PurchaseRequestRow = {
  id: string;
  number: string;
  department: string;
  requester: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONVERTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
};

const PurchaseRequestList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [requests] = useState<PurchaseRequestRow[]>([
    { id: '1', number: 'REQ-001', department: 'İT Departamenti', requester: 'Əli Məmmədov', date: '2024-04-25', status: 'PENDING', priority: 'HIGH' },
    { id: '2', number: 'REQ-002', department: 'Marketinq', requester: 'Leyla Əliyeva', date: '2024-04-24', status: 'REJECTED', priority: 'MEDIUM' },
    { id: '3', number: 'REQ-003', department: 'Anbar (Daxili)', requester: 'Sistem (Avto)', date: '2024-04-24', status: 'APPROVED', priority: 'URGENT' },
    { id: '4', number: 'REQ-004', department: 'İstehsalat', requester: 'Vaqif Həsənov', date: '2024-04-23', status: 'CONVERTED', priority: 'LOW' },
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'CONVERTED': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'HIGH': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'MEDIUM': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">İlkin Tələblər (Tələblər)</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Daxili şöbə və işçi tələblərinin reyestri</p>
        </div>
        <button 
          onClick={() => navigate('/purchase/requests/create')}
          className="flex items-center space-x-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Tələb Yarat</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Gözləyən Tələb', value: '8', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Daxili Transfer', value: '14', icon: ArrowRightLeft, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Rədd Edilən', value: '3', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'PR-a Çevrilən', value: '12', icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
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

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Tələb № və ya Şöbə axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold shadow-inner focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Tələb №</th>
                <th className="px-6 py-5">Şöbə</th>
                <th className="px-6 py-5">Məsul Şəxs</th>
                <th className="px-6 py-5 text-center">Tarix</th>
                <th className="px-6 py-5 text-center">Təciliyyət</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {requests.map((req) => (
                <tr key={req.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">{req.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-black text-slate-800 dark:text-white uppercase italic">{req.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{req.requester}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-mono text-[11px] font-bold text-slate-500 italic">{req.date}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${getPriorityStyle(req.priority)}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(req.status)}`}>
                      {req.status === 'PENDING' ? 'GÖZLƏYİR' : 
                       req.status === 'APPROVED' ? 'TƏSDİQLƏNDİ' : 
                       req.status === 'REJECTED' ? 'RƏDD EDİLDİ' : 'PR-A ÇEVRİLDİ'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {req.status === 'REJECTED' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert('Satınalma Sorğusuna (PR) çevrilir...'); }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>PR-a Çevir</span>
                        </button>
                      )}
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400"><MoreVertical className="w-4 h-4" /></button>
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

export default PurchaseRequestList;
