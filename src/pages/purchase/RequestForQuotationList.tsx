import React, { useState } from 'react';
import { 
  Plus, Search, Filter, FileText, 
  ChevronRight, MoreVertical, 
  Calendar, Building2, 
  CheckCircle2, Clock, AlertCircle, BarChart3, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type RFQRow = {
  id: string;
  number: string;
  requisitionRef: string;
  date: string;
  vendorsSent: number;
  quotesReceived: number;
  status: 'SENT' | 'RECEIVED' | 'COMPARED' | 'ORDERED' | 'CANCELLED';
};

const RequestForQuotationList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [rfqs] = useState<RFQRow[]>([
    { id: '1', number: 'RFQ-2024-001', requisitionRef: 'PR-2024-001', date: '2024-04-21', vendorsSent: 3, quotesReceived: 2, status: 'RECEIVED' },
    { id: '2', number: 'RFQ-2024-002', requisitionRef: 'PR-2024-002', date: '2024-04-19', vendorsSent: 5, quotesReceived: 5, status: 'COMPARED' },
    { id: '3', number: 'RFQ-2024-003', requisitionRef: 'PR-2024-003', date: '2024-04-16', vendorsSent: 2, quotesReceived: 0, status: 'SENT' },
    { id: '4', number: 'RFQ-2024-004', requisitionRef: 'PR-2024-004', date: '2024-04-13', vendorsSent: 1, quotesReceived: 1, status: 'ORDERED' },
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SENT': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'RECEIVED': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'COMPARED': return 'bg-purple-50 text-purple-600 border-purple-100';
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
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Qiymət Təklifləri (RFQ)</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Təchizatçı təkliflərinin toplanması və müqayisəsi</p>
        </div>
        <button 
          onClick={() => navigate('/purchase/rfq/create')}
          className="flex items-center space-x-2 px-6 py-3.5 bg-purple-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-purple-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni RFQ Yarat</span>
        </button>
      </div>

      {/* Registry Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text" 
              placeholder="RFQ № və ya Sorğu № axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold shadow-inner focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">RFQ №</th>
                <th className="px-6 py-5">Satınalma Sorğusu (PR)</th>
                <th className="px-6 py-5 text-center">Tarix</th>
                <th className="px-6 py-5 text-center">Təchizatçı Sayı</th>
                <th className="px-6 py-5 text-center">Cavab Statusu</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {rfqs.map((rfq) => (
                <tr key={rfq.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">{rfq.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-black text-slate-800 dark:text-white uppercase italic">{rfq.requisitionRef}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-mono text-[11px] font-bold text-slate-500 italic">{rfq.date}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-xs font-black text-slate-800 dark:text-white tabular-nums">{rfq.vendorsSent} Təchizatçı</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-black text-slate-800 dark:text-white">{rfq.quotesReceived}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Cavab alınıb</span>
                      </div>
                      <div className="w-20 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-purple-500" 
                          style={{ width: `${(rfq.quotesReceived / rfq.vendorsSent) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(rfq.status)}`}>
                      {rfq.status === 'SENT' ? 'GÖNDƏRİLİB' : 
                       rfq.status === 'RECEIVED' ? 'CAVABLAR ALINIB' : 
                       rfq.status === 'COMPARED' ? 'MÜQAYİSƏ EDİLİB' : 
                       rfq.status === 'ORDERED' ? 'SİFARİŞ EDİLİB' : 'LƏĞV EDİLDİ'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(rfq.status === 'RECEIVED' || rfq.status === 'COMPARED') && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate('/purchase/quotations/comparison', { state: { rfqId: rfq.id } }); }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                        >
                          <BarChart3 className="w-3 h-3" />
                          <span>Müqayisə Et</span>
                        </button>
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

export default RequestForQuotationList;
