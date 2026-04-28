import { useState, useEffect, useMemo } from 'react';
import { 
  FileSignature, Search, Filter, Plus, 
  ChevronRight, MoreHorizontal, Calendar, 
  DollarSign, Clock, AlertTriangle,
  Download, FileText, CheckCircle2, XCircle,
  Building2, CreditCard, Settings2, ExternalLink,
  ClipboardList
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SimulationWizard from '../../components/SimulationWizard';

type ContractRow = {
  id: string;
  name: string;
  partner: string;
  partnerType: 'VENDOR' | 'CUSTOMER';
  voen: string;
  contractType: 'PURCHASE' | 'SALES' | 'SERVICE' | 'RENTAL';
  signingDate: string;
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  paymentTerms: string;
  currency: string;
  amount: number;
  status: string;
  qrpCount: number;
};

const ContractList = () => {
  const navigate = useNavigate();
  const { setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [contracts, setContracts] = useState<ContractRow[]>([
    { 
      id: 'CONT-2024-001', 
      name: 'Dəmir Məmulatlarının Alışı',
      partner: 'Metal Sənaye (Bakı) MMC', 
      partnerType: 'VENDOR',
      voen: '1401234567',
      contractType: 'PURCHASE', 
      signingDate: '2024-09-10',
      startDate: '2024-09-15',
      expiryDate: '2025-09-15', 
      autoRenew: true,
      paymentTerms: '30% Advance',
      currency: 'AZN',
      amount: 45600, 
      status: 'ACTIVE', 
      qrpCount: 2 
    },
    { 
      id: 'CONT-2024-005', 
      name: 'Tekstil Tədarükü',
      partner: 'Tekstil Dünyası Group', 
      partnerType: 'VENDOR',
      voen: '2309876543',
      contractType: 'PURCHASE', 
      signingDate: '2024-09-16',
      startDate: '2024-09-16',
      expiryDate: '2025-09-16', 
      autoRenew: false,
      paymentTerms: '100% Post-delivery',
      currency: 'AZN',
      amount: 12450, 
      status: 'ACTIVE', 
      qrpCount: 1 
    },
    { 
      id: 'CONT-2026-0042', 
      name: 'Əsas Mallar üzrə Baş Müqavilə',
      partner: 'Supplier Group MMC', 
      partnerType: 'VENDOR',
      voen: '9900112233',
      contractType: 'PURCHASE', 
      signingDate: '2026-01-01',
      startDate: '2026-01-15', 
      expiryDate: '2027-01-15', 
      autoRenew: true,
      paymentTerms: '50/50 Split',
      currency: 'USD',
      amount: 250500.00, 
      status: 'ACTIVE',
      qrpCount: 5 
    },
    { 
      id: 'CONT-2026-0015', 
      name: 'Logistika Xidməti',
      partner: 'Global Trade LLC', 
      partnerType: 'VENDOR',
      voen: '5544332211',
      contractType: 'SERVICE', 
      signingDate: '2026-02-01',
      startDate: '2026-02-10', 
      expiryDate: '2026-04-10', 
      autoRenew: false,
      paymentTerms: 'Monthly',
      currency: 'EUR',
      amount: 12400.00, 
      status: 'EXPIRING',
      qrpCount: 0 
    }
  ]);

  const [filters, setFilters] = useState({
    partnerType: 'ALL',
    contractType: 'ALL',
    status: 'ALL',
    autoRenew: 'ALL',
    currency: 'ALL',
    signingDate: '',
    startDate: '',
    expiryDate: '',
    partnerName: '',
    partnerVoen: '',
    partnerSearch: '',
    voenSearch: '',
    isPartnerSelectorOpen: false
  });

  const [partnerSearchTerm, setPartnerSearchTerm] = useState('');

  const availablePartners = useMemo(() => {
    return contracts
        .filter(c => filters.partnerType === 'ALL' || c.partnerType === filters.partnerType)
        .map(c => ({ name: c.partner, voen: c.voen }));
  }, [contracts, filters.partnerType]);

  // Alt + F Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyF') {
        e.preventDefault();
        toggleFilters();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filters]); // Re-bind when filters change to ensure toggleFilters has latest state

  const toggleFilters = () => {
    const filteredAvailablePartners = availablePartners.filter((p: any) => 
        p.name.toLowerCase().includes(filters.partnerSearch.toLowerCase()) || 
        p.voen.includes(filters.partnerSearch)
    );

    setFilterSidebarContent(
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest block">Kontragent Seçimi</label>
                <div className="space-y-3">
                    <button 
                        onClick={() => setFilters(prev => ({ ...prev, isPartnerSelectorOpen: true }))}
                        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase italic text-slate-400 hover:text-indigo-600 transition-all shadow-inner"
                    >
                        <span>{filters.partnerName ? `${filters.partnerName} (${filters.partnerVoen})` : 'Şirkət seçmək üçün vurun...'}</span>
                        <Building2 className="w-3.5 h-3.5" />
                    </button>
                    {filters.partnerName && (
                        <button 
                            onClick={() => setFilters(prev => ({ ...prev, partnerName: '', partnerVoen: '' }))}
                            className="text-[8px] font-black text-rose-500 uppercase italic underline"
                        >
                            Seçimi təmizlə
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest block">Kontragent Növü</label>
                <div className="grid grid-cols-2 gap-2">
                    {['ALL', 'VENDOR', 'CUSTOMER'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setFilters(prev => ({ ...prev, partnerType: type }))}
                            className={`py-3 px-4 rounded-xl text-[9px] font-black uppercase italic transition-all ${filters.partnerType === type ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                        >
                            {type === 'ALL' ? 'Hamısı' : type === 'VENDOR' ? 'Təchizatçı' : 'Müştəri'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest block">Müqavilə Növü</label>
                <select 
                    value={filters.contractType}
                    onChange={(e) => setFilters({...filters, contractType: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-[10px] font-black italic outline-none shadow-inner"
                >
                    <option value="ALL">Hamısı</option>
                    <option value="PURCHASE">Alış</option>
                    <option value="SALES">Satış</option>
                    <option value="SERVICE">Xidmət</option>
                    <option value="RENTAL">İcarə</option>
                </select>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest block">Status</label>
                <select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-[10px] font-black italic outline-none shadow-inner"
                >
                    <option value="ALL">Hamısı</option>
                    <option value="ACTIVE">Aktiv</option>
                    <option value="EXPIRING">Bitmək üzrə</option>
                    <option value="EXPIRED">Bitmiş</option>
                </select>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest block">Tarixlər</label>
                <div className="space-y-2">
                    <input 
                        type="date" 
                        value={filters.signingDate}
                        onChange={(e) => setFilters({...filters, signingDate: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-[10px] font-black italic outline-none shadow-inner"
                        placeholder="İmzalama tarixi"
                    />
                    <input 
                        type="date" 
                        value={filters.startDate}
                        onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-[10px] font-black italic outline-none shadow-inner"
                        placeholder="Başlama tarixi"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest block">Valyuta</label>
                <select 
                    value={filters.currency}
                    onChange={(e) => setFilters({...filters, currency: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-[10px] font-black italic outline-none shadow-inner"
                >
                    <option value="ALL">Hamısı</option>
                    <option value="AZN">AZN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                <span className="text-[10px] font-black text-indigo-600 uppercase italic">Avto-yenilənən</span>
                <button 
                    onClick={() => setFilters(prev => ({ ...prev, autoRenew: prev.autoRenew === 'YES' ? 'NO' : (prev.autoRenew === 'NO' ? 'ALL' : 'YES') }))}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase italic transition-all ${filters.autoRenew === 'YES' ? 'bg-indigo-600 text-white' : filters.autoRenew === 'NO' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-500'}`}
                >
                    {filters.autoRenew === 'YES' ? 'Bəli' : filters.autoRenew === 'NO' ? 'Xeyr' : 'Hamısı'}
                </button>
            </div>
        </div>
    );
    setIsFilterSidebarOpen((prev: boolean) => !prev);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Müqavilələr');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: 'Müqavilə Adı', key: 'name', width: 30 },
      { header: 'Kontragent', key: 'partner', width: 30 },
      { header: 'VÖEN', key: 'voen', width: 15 },
      { header: 'Növ', key: 'contractType', width: 15 },
      { header: 'İmzalama', key: 'signingDate', width: 15 },
      { header: 'Başlama', key: 'startDate', width: 15 },
      { header: 'Bitmə', key: 'expiryDate', width: 15 },
      { header: 'Məbləğ', key: 'amount', width: 15 },
      { header: 'Valyuta', key: 'currency', width: 10 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    filteredContracts.forEach(c => {
      worksheet.addRow(c);
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `muqavileler_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.voen.includes(searchTerm);
    
    const matchesPartnerType = filters.partnerType === 'ALL' || c.partnerType === filters.partnerType;
    const matchesContractType = filters.contractType === 'ALL' || c.contractType === filters.contractType;
    const matchesStatus = filters.status === 'ALL' || c.status === filters.status;
    const matchesAutoRenew = filters.autoRenew === 'ALL' || (filters.autoRenew === 'YES' ? c.autoRenew : !c.autoRenew);
    const matchesCurrency = filters.currency === 'ALL' || c.currency === filters.currency;
    const matchesSigningDate = !filters.signingDate || c.signingDate === filters.signingDate;
    const matchesStartDate = !filters.startDate || c.startDate === filters.startDate;
    const matchesPartnerName = !filters.partnerName || c.partner.toLowerCase().includes(filters.partnerName.toLowerCase());
    const matchesPartnerVoen = !filters.partnerVoen || c.voen.includes(filters.partnerVoen);

    return matchesSearch && matchesPartnerType && matchesContractType && matchesStatus && matchesAutoRenew && matchesCurrency && matchesSigningDate && matchesStartDate && matchesPartnerName && matchesPartnerVoen;
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
            <button 
              onClick={toggleFilters}
              className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic bg-slate-50 dark:bg-slate-800 text-slate-600 shadow-inner hover:bg-slate-100`}
            >
              <Filter className="w-4 h-4" />
              <span>Filtrlər</span>
            </button>
            <button 
              onClick={exportToExcel}
              className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl shadow-inner hover:text-indigo-500 transition-all"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* EXPANDABLE FILTER PANEL REMOVED - NOW IN SIDEBAR */}
      </div>

      {/* CONTRACTS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Müqavilə ID / Ad</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Kontragent / VÖEN</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Növ / Tarixlər</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ödəniş / Valyuta</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">QRP</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Status</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredContracts.map((c) => (
              <tr 
                key={c.id} 
                className="group hover:bg-indigo-50/20 dark:hover:bg-indigo-900/5 transition-all cursor-pointer"
                onClick={() => navigate(`/contracts/detail/${c.id}`)}
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 dark:text-white mb-1 tabular-nums italic">{c.id}</span>
                    <span className="text-[10px] font-black text-indigo-600 uppercase italic tracking-tighter truncate max-w-[200px]">{c.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase italic tracking-tight">{c.partner}</span>
                        <span className="text-[9px] font-bold text-slate-400 italic">VÖEN: {c.voen}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{c.contractType}</span>
                    <div className="flex items-center text-[8px] font-bold text-slate-400 italic">
                        <Calendar className="w-3 h-3 mr-1" /> {c.signingDate} ➔ {c.expiryDate}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 dark:text-white tabular-nums italic">
                       {c.currency} {c.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase italic tracking-tighter">{c.paymentTerms}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <div 
                    onClick={(e) => { e.stopPropagation(); navigate('/contracts/price-agreements', { state: { contractId: c.id } }); }}
                    className={`flex items-center justify-center transition-all hover:scale-110 ${c.qrpCount > 0 ? 'text-indigo-500' : 'text-slate-200 dark:text-slate-700'}`}
                  >
                    <ClipboardList className={`w-5 h-5 ${c.qrpCount > 0 ? 'drop-shadow-sm' : ''}`} />
                    {c.qrpCount > 0 && <span className="ml-1 text-[10px] font-black italic">{c.qrpCount}</span>}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-sm ${getStatusStyle(c.status)}`}>
                        {getStatusLabel(c.status)}
                    </span>
                    {c.autoRenew && (
                        <span className="text-[8px] font-black text-indigo-400 uppercase italic flex items-center">
                            <Clock className="w-2.5 h-2.5 mr-1" /> Avto-yenilənir
                        </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                     <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/contracts/edit/${c.id}`); }}
                        className="p-3 text-slate-300 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Settings2 className="w-5 h-5" />
                     </button>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PARTNER SELECTOR MODAL */}
      {filters.isPartnerSelectorOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setFilters(prev => ({ ...prev, isPartnerSelectorOpen: false }))} />
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Kontragent Seçimi</h3>
                          <p className="text-[10px] font-black text-indigo-600 uppercase italic tracking-widest mt-1">Mövcud olan bütün tərəfdaşlar</p>
                      </div>
                      <button onClick={() => setFilters(prev => ({ ...prev, isPartnerSelectorOpen: false }))} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-rose-500 transition-all">
                          <Plus className="w-5 h-5 rotate-45" />
                      </button>
                  </div>
                  
                  <div className="p-8 space-y-6">
                      <div className="relative group">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                          <input 
                              type="text" 
                              placeholder="Şirkət adı və ya VÖEN ilə axtar..." 
                              value={partnerSearchTerm}
                              onChange={(e) => setPartnerSearchTerm(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none"
                          />
                      </div>

                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 p-2">
                          {availablePartners
                              .filter(p => p.name.toLowerCase().includes(partnerSearchTerm.toLowerCase()) || p.voen.includes(partnerSearchTerm))
                              .map(p => (
                              <button 
                                  key={p.voen + p.name}
                                  onClick={() => {
                                      setFilters(prev => ({ ...prev, partnerName: p.name, partnerVoen: p.voen, isPartnerSelectorOpen: false }));
                                      setPartnerSearchTerm('');
                                  }}
                                  className="w-full flex flex-col items-start p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl cursor-pointer transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
                              >
                                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase italic group-hover:text-indigo-600">{p.name}</span>
                                  <span className="text-[10px] font-bold text-slate-400 italic mt-1">VÖEN: {p.voen}</span>
                              </button>
                          ))}
                          {availablePartners.length === 0 && (
                              <div className="py-12 text-center">
                                  <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Seçilə biləcək tərəfdaş tapılmadı</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ContractList;
