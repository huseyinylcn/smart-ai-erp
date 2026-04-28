import { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardList, Search, Plus, Filter,
  FileSignature, ChevronRight, Package,
  MoreHorizontal, Download, History,
  DollarSign, CheckCircle2, Building2, CreditCard
} from 'lucide-react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

type PriceAgreementRow = {
  id: string;
  name: string;
  contractId: string;
  partner: string;
  partnerVoen: string;
  partnerType: 'VENDOR' | 'CUSTOMER';
  contractType: 'PURCHASE' | 'SALES' | 'SERVICE';
  currency: string;
  itemCount: number;
  date: string;
  status: string;
  totalEstimated: number;
  items?: any[];
};

const PriceAgreementList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (location.state?.contractId) {
      setSearchTerm(location.state.contractId);
    }
  }, [location.state]);

  const [agreements, setAgreements] = useState<PriceAgreementRow[]>([
    { 
      id: 'QRP-2024-001', 
      name: 'Dəmir Məmulatları - Oktyabr',
      contractId: 'CONT-2024-001', 
      partner: 'Metal Sənaye (Bakı) MMC', 
      partnerVoen: '1401234567',
      partnerType: 'VENDOR',
      contractType: 'PURCHASE',
      currency: 'AZN',
      itemCount: 3, 
      date: '2024-09-20', 
      status: 'ACTIVE', 
      totalEstimated: 45600,
      items: [
        { name: 'Profil 40x40', sku: 'RM-PROF-01', size: '40x40x2', unit: 'metr', price: 4.5, quantity: 500 },
        { name: 'Boya (Qara)', sku: 'RM-PAINT-02', size: 'Standard', unit: 'kq', price: 12, quantity: 100 },
        { name: 'Elektrod E-46', sku: 'RM-ELEK-09', size: '3.2mm', unit: 'paçka', price: 18.5, quantity: null }
      ]
    },
    { 
      id: 'QRP-2024-002', 
      name: 'Tekstil Standart Protokolu',
      contractId: 'CONT-2024-005', 
      partner: 'Tekstil Dünyası Group', 
      partnerVoen: '2309876543',
      partnerType: 'VENDOR',
      contractType: 'PURCHASE',
      currency: 'AZN',
      itemCount: 2, 
      date: '2024-09-21', 
      status: 'ACTIVE', 
      totalEstimated: 12450,
      items: [
        { name: 'Parça (Mavi)', sku: 'TX-FAB-01', size: '150cm', unit: 'metr', price: 8.5, quantity: 1200 },
        { name: 'Düymə (Plastik)', sku: 'TX-BUT-02', size: '12mm', unit: 'ədəd', price: 0.15, quantity: 5000 }
      ]
    },
    { 
      id: 'QRP-2026-015', 
      name: 'Supplier Group Əsas QRP',
      contractId: 'CONT-2026-0042',
      partner: 'Supplier Group MMC', 
      partnerVoen: '9900112233',
      partnerType: 'VENDOR',
      contractType: 'PURCHASE',
      currency: 'USD',
      itemCount: 12,
      date: '2026-01-20', 
      status: 'ACTIVE',
      totalEstimated: 125000.00
    }
  ]);

  const [selectedAgreementForItems, setSelectedAgreementForItems] = useState<PriceAgreementRow | null>(null);
  
  const [filters, setFilters] = useState({
    status: 'ALL',
    date: '',
    itemName: '',
    contractType: 'ALL',
    currency: 'ALL',
    partnerType: 'ALL',
    partnerName: '',
    partnerVoen: '',
    selectedProducts: [] as string[],
    partnerSearch: '',
    voenSearch: '',
    isPartnerSelectorOpen: false
  });

  const [partnerSearchTerm, setPartnerSearchTerm] = useState('');

  const availablePartners = useMemo(() => {
    return Array.from(new Set(agreements.map(a => JSON.stringify({ name: a.partner, voen: a.partnerVoen }))))
        .map(s => JSON.parse(s))
        .filter((p: any) => filters.partnerType === 'ALL' || (filters.partnerType === 'VENDOR' ? p.name.includes('MMC') : !p.name.includes('MMC'))); // Mock logic
  }, [agreements, filters.partnerType]);

  const allAvailableProducts = useMemo(() => {
    return Array.from(new Set(
        agreements.flatMap(a => a.items?.map(i => i.name) || [])
    )).sort();
  }, [agreements]);

  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

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
  }, [filters]);

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
                            onClick={() => setFilters(prev => ({ ...prev, partnerType: type, partnerName: '', partnerVoen: '', partnerSearch: '', voenSearch: '' }))}
                            className={`py-3 px-4 rounded-xl text-[9px] font-black uppercase italic transition-all ${filters.partnerType === type ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                        >
                            {type === 'ALL' ? 'Hamısı' : type === 'VENDOR' ? 'Təchizatçı' : 'Müştəri'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest block">Məhsullar (Multi-seçim)</label>
                <div className="space-y-3">
                    <button 
                        onClick={() => setIsProductSelectorOpen(true)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase italic text-slate-400 hover:text-indigo-600 transition-all shadow-inner"
                    >
                        <span>{filters.selectedProducts.length > 0 ? `${filters.selectedProducts.length} məhsul seçilib` : 'Məhsul seçmək üçün vurun...'}</span>
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                    {filters.selectedProducts.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {filters.selectedProducts.map(p => (
                                <span key={p} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-[8px] font-black uppercase italic flex items-center">
                                    {p}
                                    <button onClick={() => setFilters(prev => ({ ...prev, selectedProducts: prev.selectedProducts.filter(item => item !== p) }))} className="ml-2 hover:text-rose-500">
                                        <Plus className="w-2.5 h-2.5 rotate-45" />
                                    </button>
                                </span>
                            ))}
                            <button 
                                onClick={() => setFilters(prev => ({ ...prev, selectedProducts: [] }))}
                                className="text-[8px] font-black text-rose-500 uppercase italic underline ml-1"
                            >
                                Hamısını sil
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest block">Protokol Statusu</label>
                <div className="grid grid-cols-2 gap-2">
                    {['ALL', 'ACTIVE', 'DRAFT', 'EXPIRED'].map(st => (
                        <button 
                            key={st}
                            onClick={() => setFilters(prev => ({ ...prev, status: st }))}
                            className={`py-3 px-2 rounded-xl text-[8px] font-black uppercase italic transition-all ${filters.status === st ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                        >
                            {st === 'ALL' ? 'Hamısı' : st === 'ACTIVE' ? 'Aktiv' : st === 'DRAFT' ? 'Qaralama' : 'Bitmiş'}
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
                </select>
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

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest block">Protokol Tarixi</label>
                <input 
                    type="date" 
                    value={filters.date}
                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-[10px] font-black italic outline-none shadow-inner"
                />
            </div>
        </div>
    );
    setIsFilterSidebarOpen((prev: boolean) => !prev);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('QRP Reyestri');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: 'QRP Adı', key: 'name', width: 30 },
      { header: 'Müqavilə', key: 'contractId', width: 20 },
      { header: 'Kontragent', key: 'partner', width: 30 },
      { header: 'VÖEN', key: 'partnerVoen', width: 15 },
      { header: 'Tarix', key: 'date', width: 15 },
      { header: 'Mal Sayı', key: 'itemCount', width: 10 },
      { header: 'Məbləğ', key: 'totalEstimated', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    filteredAgreements.forEach(a => {
      worksheet.addRow(a);
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `qrp_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredAgreements = agreements.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.contractId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.partnerVoen.includes(searchTerm);
    
    const matchesStatus = filters.status === 'ALL' || a.status === filters.status;
    const matchesDate = !filters.date || a.date === filters.date;
    const matchesItemName = !filters.itemName || (a.items?.some(i => i.name.toLowerCase().includes(filters.itemName.toLowerCase())) ?? false);
    const matchesContractType = filters.contractType === 'ALL' || a.contractType === filters.contractType;
    const matchesCurrency = filters.currency === 'ALL' || a.currency === filters.currency;
    const matchesPartnerType = filters.partnerType === 'ALL' || a.partnerType === filters.partnerType;
    const matchesPartnerName = !filters.partnerName || a.partner === filters.partnerName;
    const matchesPartnerVoen = !filters.partnerVoen || a.partnerVoen === filters.partnerVoen;
    const matchesSelectedProducts = filters.selectedProducts.length === 0 || 
                                    filters.selectedProducts.every(p => a.items?.some(i => i.name === p));

    return matchesSearch && matchesStatus && matchesDate && matchesItemName && matchesContractType && matchesCurrency && matchesPartnerType && matchesPartnerName && matchesPartnerVoen && matchesSelectedProducts;
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
        <button onClick={() => navigate('/contracts/price-agreements/create')} className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic shadow-sm">
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
           <button 
              onClick={toggleFilters}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic shadow-inner bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-100`}
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

        {/* EXPANDABLE FILTER PANEL REMOVED - NOW IN SIDEBAR */}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm italic-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">QRP ID / Ad</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tərəf (Kontragent)</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Əlaqəli Müqavilə</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Məhsullar</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Status</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none">
            {filteredAgreements.map((a) => (
              <tr 
                key={a.id} 
                className="group hover:bg-amber-50/20 dark:hover:bg-amber-900/5 transition-all cursor-pointer" 
                onClick={() => navigate(`/contracts/price-agreements/edit/${a.id}`)}
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 dark:text-white mb-1 tabular-nums italic">{a.id}</span>
                    <span className="text-[9px] font-black text-indigo-600 uppercase italic tracking-tighter truncate max-w-[150px]">{a.name}</span>
                    <span className="text-[8px] font-bold text-slate-400 italic mt-1">{a.date}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase italic tracking-tight">{a.partner}</span>
                        <span className="text-[9px] font-bold text-slate-400 italic">VÖEN: {a.partnerVoen}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                   <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/contracts/detail/${a.contractId}`); }}
                      className="inline-flex items-center space-x-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100/50"
                    >
                      <FileSignature className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black italic">{a.contractId}</span>
                   </button>
                </td>
                <td className="px-8 py-6 text-center">
                   <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedAgreementForItems(a); }}
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-amber-300 transition-all shadow-inner"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] font-black italic">{a.itemCount}</span>
                   </button>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-sm ${getStatusStyle(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                     <button className="p-3 text-slate-300 hover:text-amber-600 transition-all opacity-0 group-hover:opacity-100">
                        <History className="w-5 h-5" />
                     </button>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-all group-hover:translate-x-1" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QUICK VIEW ITEMS MODAL */}
      {selectedAgreementForItems && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedAgreementForItems(null)} />
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{selectedAgreementForItems?.id} - Məhsul Siyahısı</h3>
                        <p className="text-[10px] font-black text-indigo-600 uppercase italic tracking-widest mt-1">{selectedAgreementForItems?.name}</p>
                    </div>
                    <button onClick={() => setSelectedAgreementForItems(null)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-rose-500 transition-all">
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>
                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest">
                                <th className="pb-4">Məhsul / SKU</th>
                                <th className="pb-4 text-center">Ölçü</th>
                                <th className="pb-4 text-center">Vahid</th>
                                <th className="pb-4 text-right">Qiymət</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {(selectedAgreementForItems?.items || [
                                { name: 'Standart Məhsul #1', sku: 'SKU-001', unit: 'ədəd', price: 15.50 },
                                { name: 'Standart Məhsul #2', sku: 'SKU-002', unit: 'ədəd', price: 22.00 }
                            ]).map((item, idx) => (
                                <tr key={idx}>
                                    <td className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase italic">{item.name}</span>
                                            <span className="text-[9px] font-bold text-slate-400 italic">{item.sku}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 italic">
                                            {item.size || '—'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-md text-[9px] font-black italic text-slate-500 uppercase">
                                            {item.unit}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right font-black text-[11px] italic tabular-nums text-emerald-600">
                                        ₼ {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase italic">Cəmi Qiymət (Təxmini)</span>
                        <span className="text-xl font-black text-indigo-600 tabular-nums">₼ {selectedAgreementForItems?.totalEstimated.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={() => navigate(`/contracts/price-agreements/edit/${selectedAgreementForItems?.id}`)}
                        className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all italic"
                    >
                        Tam sənədə bax
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* PRODUCT SELECTOR MODAL */}
      {isProductSelectorOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsProductSelectorOpen(false)} />
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Məhsul Seçimi</h3>
                          <p className="text-[10px] font-black text-indigo-600 uppercase italic tracking-widest mt-1">Reyestrdəki bütün məhsullar</p>
                      </div>
                      <button onClick={() => setIsProductSelectorOpen(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-rose-500 transition-all">
                          <Plus className="w-5 h-5 rotate-45" />
                      </button>
                  </div>
                  
                  <div className="p-8 space-y-6">
                      <div className="relative group">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                          <input 
                              type="text" 
                              placeholder="Məhsul adı ilə axtar..." 
                              value={productSearchTerm}
                              onChange={(e) => setProductSearchTerm(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none"
                          />
                      </div>

                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 p-2">
                          {allAvailableProducts
                              .filter(p => p.toLowerCase().includes(productSearchTerm.toLowerCase()))
                              .map(product => (
                              <label key={product} className="flex items-center space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl cursor-pointer transition-all group">
                                  <input 
                                      type="checkbox"
                                      checked={filters.selectedProducts.includes(product)}
                                      onChange={(e) => {
                                          if (e.target.checked) {
                                              setFilters(prev => ({ ...prev, selectedProducts: [...prev.selectedProducts, product] }));
                                          } else {
                                              setFilters(prev => ({ ...prev, selectedProducts: prev.selectedProducts.filter(p => p !== product) }));
                                          }
                                      }}
                                      className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all"
                                  />
                                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase italic group-hover:text-indigo-600">{product}</span>
                              </label>
                          ))}
                          {allAvailableProducts.length === 0 && (
                              <div className="py-12 text-center">
                                  <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Seçilə biləcək məhsul tapılmadı</p>
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="p-8 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">
                          {filters.selectedProducts.length} məhsul seçilib
                      </span>
                      <button 
                          onClick={() => setIsProductSelectorOpen(false)}
                          className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all italic"
                      >
                          Tətbiq Et
                      </button>
                  </div>
              </div>
          </div>
      )}
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

export default PriceAgreementList;
