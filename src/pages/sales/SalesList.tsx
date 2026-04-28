import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, FileText, 
  ChevronRight, MoreVertical, 
  Calendar, User, DollarSign,
  CheckCircle2, Clock, AlertCircle,
  Truck, FileSpreadsheet, ArrowRightLeft,
  CheckSquare, Square, Receipt, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { salesApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const SalesList = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<'DELIVERY' | 'INVOICE'>('INVOICE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!activeCompany) return;
      try {
        const result = await salesApi.getInvoices(activeCompany.id);
        
        const mapped = result.data.map((inv: any) => ({
          id: inv.id,
          number: inv.docNumber,
          customer: inv.customer?.name || "Naməlum Müştəri",
          date: new Date(inv.docDate).toISOString().split('T')[0],
          total: inv.totalAmount,
          status: inv.status === 'POSTED' ? 'PAID' : 'SENT',
          ref: "-",
          eInvNo: `E-INV-${inv.docNumber.split('-')[1]}`,
          eInvDate: new Date(inv.docDate).toISOString().split('T')[0]
        }));
        
        setInvoices(mapped);
      } catch (error) {
        console.error("Satışlar yüklənərkən xəta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [activeCompany?.id]);

  const deliveries: any[] = []; // Waybills could be fetched separately

  const toggleSelect = (id: string) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED': case 'PAID': case 'INVOICED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'SHIPPED': case 'SENT': case 'PARTIAL': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'NOT_INVOICED': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Satış Reyestri və İnvoyslar</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic italic">İdarəetmə, Maliyyə və Vergi uçotu üzrə sənədləşmə</p>
        </div>
        <div className="flex items-center space-x-3">
            {selectedDocs.length > 0 && activeTab === 'DELIVERY' && (
                <button 
                  onClick={() => navigate('/sales/invoice/create', { state: { selectedDocs } })}
                  className="flex items-center space-x-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 animate-in zoom-in"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Qaiməyə Çevir ({selectedDocs.length})</span>
                </button>
            )}
            {selectedDocs.length > 0 && activeTab === 'INVOICE' && (
                <button 
                  className="flex items-center space-x-2 px-6 py-3.5 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-rose-500/20 active:scale-95 animate-in zoom-in"
                >
                  <Receipt className="w-4 h-4" />
                  <span>E-Qaimə Məlumatlarını Yaz ({selectedDocs.length})</span>
                </button>
            )}
            <button 
              onClick={() => navigate(activeTab === 'DELIVERY' ? '/sales/waybill/create' : '/sales/invoice/create')}
              className="flex items-center space-x-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni {activeTab === 'DELIVERY' ? 'Təqdimetmə' : 'İnvoys'}</span>
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] w-full max-w-md shadow-sm">
        <button 
          onClick={() => { setActiveTab('DELIVERY'); setSelectedDocs([]); }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'DELIVERY' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Truck className="w-4 h-4" />
          <span>Təqdimetmələr</span>
        </button>
        <button 
          onClick={() => { setActiveTab('INVOICE'); setSelectedDocs([]); }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'INVOICE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <FileText className="w-4 h-4" />
          <span>İnvoyslar (Maliyyə)</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Sənəd № və ya Müştəri axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold shadow-inner focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
            <Tag className="w-3.5 h-3.5 mr-2" />
            V-U: Vergi Uçotu (E-Qaimə)
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'DELIVERY' ? (
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-5 w-10 text-center">
                        <button onClick={() => setSelectedDocs(selectedDocs.length === deliveries.length ? [] : deliveries.map(d => d.id))}>
                            {selectedDocs.length === deliveries.length ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                        </button>
                    </th>
                    <th className="px-6 py-5">Təqdimetmə №</th>
                    <th className="px-6 py-5">Müştəri</th>
                    <th className="px-6 py-5 text-center">Tarix</th>
                    <th className="px-6 py-5 text-center italic tracking-tighter">Qaimə Statusu</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {deliveries.map((item) => (
                    <tr 
                        key={item.id} 
                        onClick={() => toggleSelect(item.id)}
                        className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer ${selectedDocs.includes(item.id) ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                    >
                    <td className="px-6 py-5 text-center">
                        {selectedDocs.includes(item.id) ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-200" />}
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">{item.number}</span>
                        </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-black text-slate-800 dark:text-white uppercase italic">{item.customer}</td>
                    <td className="px-6 py-5 text-center text-xs font-bold text-slate-600 dark:text-slate-300">{item.date}</td>
                    <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(item.invoiceStatus)}`}>
                        {item.invoiceStatus === 'NOT_INVOICED' ? 'Qaiməsiz' : item.invoiceStatus === 'PARTIAL' ? 'Qismən' : 'Tamamlanıb'}
                        </span>
                    </td>
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
          ) : (
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-5 w-10 text-center">
                        <button onClick={() => setSelectedDocs(selectedDocs.length === invoices.length ? [] : invoices.map(d => d.id))}>
                            {selectedDocs.length === invoices.length ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                        </button>
                    </th>
                    <th className="px-6 py-5">İnvoys № (Daxili)</th>
                    <th className="px-6 py-5">Müştəri</th>
                    <th className="px-6 py-5 text-center">Tarix</th>
                    <th className="px-6 py-5">V-U: E-Qaimə №</th>
                    <th className="px-6 py-5 text-right">Məbləğ</th>
                    <th className="px-6 py-5 text-center italic tracking-tighter">Status</th>
                    <th className="px-8 py-5 text-right"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none">
                {invoices.map((item) => (
                    <tr 
                        key={item.id} 
                        onClick={() => toggleSelect(item.id)}
                        className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer ${selectedDocs.includes(item.id) ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                    >
                    <td className="px-6 py-5 text-center">
                        {selectedDocs.includes(item.id) ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-200" />}
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">{item.number}</span>
                        </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-black text-slate-800 dark:text-white uppercase italic">{item.customer}</td>
                    <td className="px-6 py-5 text-center text-xs font-bold text-slate-600 dark:text-slate-300">{item.date}</td>
                    <td className="px-6 py-5">
                        {item.eInvNo ? (
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-indigo-600 tracking-tight">{item.eInvNo}</span>
                                <span className="text-[9px] font-bold text-slate-400">{item.eInvDate}</span>
                            </div>
                        ) : (
                            <span className="text-[10px] font-bold text-rose-400 italic uppercase">E-Qaimə Gözlənilir</span>
                        )}
                    </td>
                    <td className="px-6 py-5 text-right text-[13px] font-black text-slate-800 dark:text-white tabular-nums">{item.total.toLocaleString()} ₼</td>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesList;
