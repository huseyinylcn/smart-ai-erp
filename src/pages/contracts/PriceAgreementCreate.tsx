import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ClipboardList, Plus, Save, 
  Trash2, Info, Building2, Package, Search,
  ChevronDown, AlertCircle, Loader2, Users, ChevronRight, X, Filter, List,
  Printer, Paperclip, Upload, FileText
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { useCompany } from '../../context/CompanyContext';
import { crmApi, inventoryApi } from '../../utils/api';

const PriceAgreementCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId') || '';
  const isEdit = !!id;
  
  const [currentStatus] = useState<DocumentStatus>('DRAFT');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    agreementNo: `QRP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    agreementName: '',
    contractType: 'PURCHASE', // PURCHASE or SALES
    partnerType: 'VENDOR', // VENDOR or CUSTOMER
    partnerId: '',
    partnerName: '',
    partnerVoen: '',
    contractId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentTermsType: 'CONTRACT', // CONTRACT or CUSTOM
    paymentTerms: {
      advancePercent: 0,
      beforeDeliveryPercent: 0,
      afterDeliveryPercent: 0,
      daysAfter: 0,
      dayType: 'TG' // Təqvim Günü
    },
    version: 1,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    currency: 'AZN',
    controlMode: 'STRICT' as 'STRICT' | 'APPROVAL' | 'FLEXIBLE'
  });

  const { activeCompany } = useCompany();
  const [vendors, setVendors] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeContracts, setActiveContracts] = useState<string[]>([]);
  const [nomItems, setNomItems] = useState<any[]>([]);
  const [isNomSearchOpen, setIsNomSearchOpen] = useState(false);
  const [nomSearchQuery, setNomSearchQuery] = useState('');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const [attachments, setAttachments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(f => ({
        id: Date.now() + Math.random(),
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        type: f.type
      }));
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (id: number) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const mockContracts: Record<string, string[]> = {
    'Metal Sənaye (Bakı) MMC': ['CONT-2024-001', 'CONT-2024-088'],
    'Tekstil Dünyası Group': ['CONT-2024-005'],
    'Kimya və Boya Logistika': ['CONT-2024-012', 'CONT-2024-099'],
    'Supplier Group MMC': ['CONT-SIM-01'],
    'PAŞA İnşaat': ['CONT-2025-P01'],
    'Bakı Abadlıq': ['CONT-2025-B12']
  };

  interface PriceAgreementItem {
    id: number;
    name: string;
    sku: string;
    unit: string;
    size: string;
    price: number;
    quantity: number | null;
  }

  const [items, setItems] = useState<PriceAgreementItem[]>([
    { id: 1, name: 'Ofis kreslosu', sku: 'FG-OFF-001', unit: 'ədəd', size: 'Standart', price: 120, quantity: 100 },
    { id: 2, name: 'Metal masa', sku: 'FG-OFF-002', unit: 'ədəd', size: '120x60', price: 250, quantity: 50 },
  ]);

  useEffect(() => {
    if (isEdit) {
      // Mock fetch
      setFormData({
        ...formData,
        agreementNo: id || '',
        agreementName: 'Oktyabr Qiymət Protokolu #88',
        contractType: 'PURCHASE',
        partnerType: 'VENDOR',
        partnerName: 'Metal Sənaye (Bakı) MMC',
        partnerVoen: '1401234567',
        contractId: 'CONT-2024-001',
        date: '2024-09-20',
        description: 'Dəmir məmulatları üçün aylıq qiymət razılaşması',
        paymentTermsType: 'CUSTOM',
        paymentTerms: {
          advancePercent: 20,
          beforeDeliveryPercent: 30,
          afterDeliveryPercent: 50,
          daysAfter: 30,
          dayType: 'TG'
        }
      });
      setSearchTerm('Metal Sənaye (Bakı) MMC');
      setActiveContracts(['CONT-2024-001', 'CONT-2024-088']);
      setItems([
        { id: 1, name: 'Profil 40x40', sku: 'RM-PROF-01', unit: 'metr', size: '40x40', price: 4.5, quantity: 500 },
        { id: 2, name: 'Boya (Qara)', sku: 'RM-PAINT-02', unit: 'kq', size: '5kg', price: 12, quantity: 100 },
        { id: 3, name: 'Elektrod E-46', sku: 'RM-ELEK-09', unit: 'paçka', size: '3.2mm', price: 18.5, quantity: 20 },
      ]);
      setAttachments([
        { id: 1, name: 'qrp_signed_october.pdf', size: '850 KB', type: 'application/pdf' },
        { id: 2, name: 'price_list_annex.xlsx', size: '1.4 MB', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      ]);
    }
  }, [isEdit, id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeCompany) return;
      setIsLoading(true);
      try {
        const [vRes, cRes, nRes] = await Promise.all([
          crmApi.getCounterparties(activeCompany.id, 'SUPPLIER'),
          crmApi.getCounterparties(activeCompany.id, 'CUSTOMER'),
          inventoryApi.getItems({ companyId: activeCompany.id })
        ]);
        setVendors(vRes.data || []);
        setCustomers(cRes.data || []);
        setNomItems(nRes.data || nRes || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeCompany]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeList = formData.partnerType === 'VENDOR' ? vendors : customers;
  const filteredList = activeList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.taxId || p.taxid || '').includes(searchTerm)
  );

  const handlePartnerSelect = (partner: any) => {
    setFormData({ 
      ...formData, 
      partnerId: partner.id,
      partnerName: partner.name, 
      partnerVoen: partner.taxId || partner.taxid || '',
      contractId: '' 
    });
    setSearchTerm(partner.name);
    setIsDropdownOpen(false);
    
    // Auto-load contracts for this partner
    const contracts = mockContracts[partner.name] || [`CONT-${partner.id.slice(-4)}-DEF`];
    setActiveContracts(contracts);
  };

  const handleNomSelect = (nomItem: any) => {
    if (activeItemIndex === null) return;
    
    const newItems = [...items];
    newItems[activeItemIndex] = {
      ...newItems[activeItemIndex],
      name: nomItem.name,
      sku: nomItem.sku || nomItem.code,
      unit: nomItem.uom,
      size: nomItem.size || '-'
    };
    setItems(newItems);
    setIsNomSearchOpen(false);
    setNomSearchQuery('');
    setActiveItemIndex(null);
  };

  const handleVoenSearch = () => {
    const partner = activeList.find(s => s.taxId === formData.partnerVoen || s.taxid === formData.partnerVoen);
    if (partner) {
      handlePartnerSelect(partner);
    }
  };

  const addRow = () => {
    setItems([...items, { id: Date.now(), name: '', sku: '', unit: 'ədəd', size: '-', price: 0, quantity: null }]);
  };

  const removeRow = (id: number) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handlePaymentTermChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      paymentTerms: {
        ...formData.paymentTerms,
        [field]: value
      }
    });
  };

  const totalPercent = (Number(formData.paymentTerms.advancePercent) || 0) + 
                       (Number(formData.paymentTerms.beforeDeliveryPercent) || 0) + 
                       (Number(formData.paymentTerms.afterDeliveryPercent) || 0);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-primary-100 dark:border-primary-900/30 -mx-8 px-8 py-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-primary-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                    <ClipboardList className="w-6 h-6 mr-2 text-amber-500 shadow-sm" /> {isEdit ? 'QRP Redaktə Et' : 'Yeni Qiymət Razılaşma Protokolu (QRP)'}
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic tracking-tighter">
                   PROTOKOL: {formData.agreementNo}
                </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.print()}
                className="flex items-center space-x-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-50 shadow-sm"
              >
                  <Printer className="w-4 h-4 shadow-sm" />
                  <span className="hidden sm:inline">Çap et</span>
              </button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2 px-8 py-2.5 bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 active:scale-95 shadow-sm">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin shadow-sm" /> : <Save className="w-4 h-4 mr-2 shadow-sm" />}
                  <span>{isEdit ? 'Yenilə' : 'Təsdiqlə və Yadda Saxla'}</span>
              </button>
          </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* CORE INFO */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic mb-4 shadow-sm">
                    <Info className="w-4 h-4 mr-2 shadow-sm" /> Protokolun Əsas Məlumatları
                </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Protokol Nömrəsi</label>
                <input type="text" value={formData.agreementNo} readOnly className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic ml-1">Versiya</label>
                <input type="number" value={formData.version} readOnly className="w-full bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Valyuta</label>
                <select value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none">
                  <option>AZN</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic ml-1">Nəzarət Rejimi</label>
                <select value={formData.controlMode} onChange={(e) => setFormData({...formData, controlMode: e.target.value as any})} className="w-full bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800 rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none">
                  <option value="STRICT">STRICT (Qəti Qadağa)</option>
                  <option value="APPROVAL">APPROVAL (Təsdiq Tələbi)</option>
                  <option value="FLEXIBLE">FLEXIBLE (Sərbəst)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
               <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Etibarlıdır (Başlanğıc)</label>
                <input type="date" value={formData.validFrom} onChange={(e) => setFormData({...formData, validFrom: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Etibarlıdır (Son)</label>
                <input type="date" value={formData.validTo} onChange={(e) => setFormData({...formData, validTo: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Müqavilə Referansı</label>
                <select value={formData.contractId} onChange={(e) => setFormData({...formData, contractId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none cursor-pointer">
                  <option value="">Sərbəst Protokol (Müqaviləsiz)</option>
                  {activeContracts.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Protokolun Adı (Və ya No)</label>
                        <input 
                           type="text"
                           value={formData.agreementName}
                           onChange={(e) => setFormData({...formData, agreementName: e.target.value})}
                           placeholder="Məs: Oktyabr ayı təchizat protokolu..."
                           className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none shadow-sm"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Müqavilənin Növü</label>
                        <select 
                          value={formData.contractType}
                          onChange={(e) => setFormData({...formData, contractType: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none"
                        >
                            <option value="PURCHASE">Alış Müqaviləsi</option>
                            <option value="SALES">Satış Müqaviləsi</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Kontragent Növü</label>
                        <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-inner">
                            <button 
                              onClick={() => { setFormData({...formData, partnerType: 'VENDOR', partnerName: '', partnerVoen: ''}); setSearchTerm(''); }}
                              className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase italic transition-all ${formData.partnerType === 'VENDOR' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Təchizatçı
                            </button>
                            <button 
                              onClick={() => { setFormData({...formData, partnerType: 'CUSTOMER', partnerName: '', partnerVoen: ''}); setSearchTerm(''); }}
                              className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase italic transition-all ${formData.partnerType === 'CUSTOMER' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Müştəri
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 relative" ref={dropdownRef}>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Kontragent Adı (Axtarış)</label>
                        <div className="relative">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input 
                             type="text"
                             value={searchTerm}
                             onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
                             onFocus={() => setIsDropdownOpen(true)}
                             placeholder={`${formData.partnerType === 'VENDOR' ? 'Təchizatçı' : 'Müştəri'} axtarın...`}
                             className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-xs font-black italic shadow-inner outline-none shadow-sm"
                           />
                        </div>
                        {isDropdownOpen && (
                          <div className="absolute z-[60] top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                             <div className="p-2 space-y-1">
                                {filteredList.length > 0 ? (
                                  filteredList.map(p => (
                                    <button 
                                      key={p.id}
                                      onClick={() => handlePartnerSelect(p)}
                                      className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all flex items-center justify-between group"
                                    >
                                       <div>
                                          <p className="text-[11px] font-black italic text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{p.name}</p>
                                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{p.taxId || p.taxid}</p>
                                       </div>
                                       <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-6 py-8 text-center">
                                     <p className="text-[10px] font-black text-slate-400 uppercase italic">Məlumat tapılmadı</p>
                                  </div>
                                )}
                             </div>
                          </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Kontragent VÖEN-i</label>
                        <div className="relative flex space-x-2">
                           <div className="relative flex-1">
                               <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                               <input 
                                 type="text" 
                                 value={formData.partnerVoen} 
                                 onChange={(e) => setFormData({...formData, partnerVoen: e.target.value})} 
                                 placeholder="VÖEN daxil edin..." 
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-xs font-black italic shadow-inner outline-none shadow-sm" 
                               />
                           </div>
                           <button 
                             onClick={handleVoenSearch}
                             className="px-6 bg-slate-100 dark:bg-slate-800 text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all shadow-sm"
                           >
                               <Search className="w-4 h-4 shadow-sm" />
                           </button>
                        </div>
                    </div>

                    <div className="space-y-4 shadow-sm">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-sm">Bağlı Müqavilə</label>
                        <select 
                          disabled={!formData.partnerName}
                          value={formData.contractId}
                          onChange={(e) => setFormData({...formData, contractId: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none disabled:opacity-50"
                        >
                            <option value="">Müqavilə seçin...</option>
                            {activeContracts.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {!formData.partnerName && <p className="text-[9px] text-amber-500 font-bold italic mt-1">Öncə kontragent seçin</p>}
                    </div>

                    <div className="space-y-4 shadow-sm shadow-sm">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-sm">Protokol Tarixi</label>
                        <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none" />
                    </div>
                </div>
            </div>

            {/* ITEMS SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic shadow-sm">
                        <Package className="w-4 h-4 mr-2 text-indigo-500" /> Məhsul və Qiymət Siyahısı
                    </h3>
                    <button onClick={addRow} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-primary-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary-50 active:scale-95 transition-all shadow-sm">
                        <Plus className="w-3.5 h-3.5 mr-2 inline shadow-sm" /> Məhsul Əlavə Et
                    </button>
                </div>
                
                <div className="overflow-hidden border border-slate-50 dark:border-slate-800 rounded-3xl">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic shadow-sm">Məhsul Adı</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic shadow-sm text-center">SKU / Kod</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic shadow-sm text-center">Ölçü</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic shadow-sm text-center">Vahid</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic text-right shadow-sm">Qiymət (₼)</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic text-right shadow-sm">Miqdar</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic text-right shadow-sm">Məbləğ</th>
                                <th className="px-6 py-4 w-10 shadow-sm"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-primary-50/20 transition-colors">
                                    <td className="px-6 py-4">
                                       <div className="relative group">
                                          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                          <input 
                                            type="text" 
                                            value={item.name} 
                                            readOnly
                                            onClick={() => { setActiveItemIndex(items.indexOf(item)); setIsNomSearchOpen(true); }}
                                            className="w-full bg-transparent border-none p-0 text-xs font-black italic outline-none text-slate-700 dark:text-slate-200 group-hover:pl-6 transition-all cursor-pointer" 
                                            placeholder="Məhsul seçin..." 
                                          />
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                       <span className="text-[10px] font-black text-slate-400 italic tabular-nums">{item.sku || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                       <span className="text-[10px] font-black text-slate-400 italic uppercase">{item.size || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                       <input 
                                         type="text" 
                                         value={item.unit} 
                                         onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[items.indexOf(item)].unit = e.target.value;
                                            setItems(newItems);
                                         }}
                                         className="w-16 bg-transparent border-none p-0 text-xs font-black italic outline-none text-slate-400 text-center" 
                                       />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <input 
                                         type="number" 
                                         value={item.price} 
                                         onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[items.indexOf(item)].price = Number(e.target.value);
                                            setItems(newItems);
                                         }}
                                         className="w-24 bg-transparent border-none p-0 text-xs font-black italic text-right outline-none text-primary-600 tabular-nums" 
                                       />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <input 
                                         type="number" 
                                         value={item.quantity || ''} 
                                         onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[items.indexOf(item)].quantity = e.target.value ? Number(e.target.value) : null;
                                            setItems(newItems);
                                         }}
                                         placeholder="Limitsiz"
                                         className="w-24 bg-transparent border-none p-0 text-xs font-black italic text-right outline-none text-slate-700 dark:text-slate-200 tabular-nums" 
                                       />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <span className="text-xs font-black text-indigo-600 tabular-nums italic">
                                          {item.quantity ? `₼ ${(item.price * item.quantity).toLocaleString()}` : '-'}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => removeRow(item.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-all">
                                            <Trash2 className="w-4 h-4 shadow-sm" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-sm">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-black italic uppercase text-amber-800">Vacib Qeyd</span>
                </div>
                <p className="text-[11px] text-amber-700 font-bold leading-relaxed italic uppercase border-l-2 border-amber-300 pl-4">
                   Bu protokol təsdiqləndikdən sonra Satınalma Sifarişləri (PO) üçün əsas qiymət mənbəyi olacaqdır. Müddət ərzində qiymətlər bu limitlər daxilində tənzimlənəcək.
                </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Ödəniş Şərtləri</h3>
                <div className="space-y-4">
                    <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-800">
                        <button 
                            onClick={() => setFormData({...formData, paymentTermsType: 'CONTRACT'})}
                            className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase italic transition-all ${formData.paymentTermsType === 'CONTRACT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Müqavilədəki kimi
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, paymentTermsType: 'CUSTOM'})}
                            className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase italic transition-all ${formData.paymentTermsType === 'CUSTOM' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Fərqli Şərtlər
                        </button>
                    </div>

                    {formData.paymentTermsType === 'CUSTOM' && (
                        <div className="space-y-6 animate-in slide-in-from-top-2 duration-500">
                           <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black text-slate-400 uppercase italic">İlkin Ödəniş %</label>
                                 <div className="relative">
                                    <input 
                                      type="number" 
                                      value={formData.paymentTerms.advancePercent}
                                      onChange={(e) => handlePaymentTermChange('advancePercent', e.target.value)}
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs font-black italic shadow-inner outline-none text-center"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300">%</span>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black text-slate-400 uppercase italic">Təslimdən Öncə %</label>
                                 <div className="relative">
                                    <input 
                                      type="number" 
                                      value={formData.paymentTerms.beforeDeliveryPercent}
                                      onChange={(e) => handlePaymentTermChange('beforeDeliveryPercent', e.target.value)}
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs font-black italic shadow-inner outline-none text-center"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300">%</span>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black text-slate-400 uppercase italic">Təslimdən Sonra %</label>
                                 <div className="relative">
                                    <input 
                                      type="number" 
                                      value={formData.paymentTerms.afterDeliveryPercent}
                                      onChange={(e) => handlePaymentTermChange('afterDeliveryPercent', e.target.value)}
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs font-black italic shadow-inner outline-none text-center"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300">%</span>
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black text-slate-400 uppercase italic">Gün Sonra</label>
                                 <input 
                                    type="number" 
                                    value={formData.paymentTerms.daysAfter}
                                    onChange={(e) => handlePaymentTermChange('daysAfter', e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs font-black italic shadow-inner outline-none text-center"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black text-slate-400 uppercase italic">Gün Növü</label>
                                 <select 
                                    value={formData.paymentTerms.dayType}
                                    onChange={(e) => handlePaymentTermChange('dayType', e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs font-black italic shadow-inner outline-none appearance-none cursor-pointer"
                                 >
                                    <option value="TG">Təqvim günü (TG)</option>
                                    <option value="İŞ">İş günü (İŞ)</option>
                                 </select>
                              </div>
                           </div>

                           <div className={`p-4 rounded-2xl border flex items-center justify-between ${totalPercent === 100 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                              <span className="text-[10px] font-black uppercase italic">Cəmi Ödəniş %:</span>
                              <span className="text-sm font-black italic tracking-widest">{totalPercent}% {totalPercent !== 100 && '(Cəmi 100% olmalıdır)'}</span>
                           </div>
                        </div>
                    )}
                    
                    {formData.paymentTermsType === 'CONTRACT' && (
                        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800">
                            <p className="text-[10px] text-indigo-600 font-bold italic text-center uppercase">Seçilmiş müqavilənin ödəniş şərtləri tətbiq olunacaq.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Əlavə Təsvir</h3>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-6 text-xs font-black italic shadow-inner outline-none min-h-[150px] resize-none"
                  placeholder="Protokol haqqında xüsusi qeydlər..."
                />
            </div>

            {/* ATTACHMENTS SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <Paperclip className="w-4 h-4 mr-2 text-primary-500" /> İmzalanmış Sənədlər
                    </h3>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-all"
                    >
                        <Upload className="w-4 h-4" />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        multiple 
                    />
                </div>

                <div className="space-y-3">
                    {attachments.length > 0 ? (
                        attachments.map(file => (
                            <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="p-2 bg-white dark:bg-slate-700 rounded-xl text-primary-500">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-700 dark:text-slate-200 truncate italic">{file.name}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase italic">{file.size}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeAttachment(file.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                            <Paperclip className="w-8 h-8 text-slate-100 mx-auto mb-2" />
                            <p className="text-[9px] font-black text-slate-300 uppercase italic">Sənəd yoxdur</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* NOMENCLATURE SEARCH MODAL */}
      {isNomSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[80vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                          <List className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic">Məhsul Seçimi</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Nomenklatura Siyahısından Axtarış</p>
                      </div>
                  </div>
                  <button onClick={() => setIsNomSearchOpen(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-rose-500 transition-all">
                      <X className="w-6 h-6" />
                  </button>
              </div>
              
              <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="relative group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" 
                        autoFocus
                        value={nomSearchQuery}
                        onChange={(e) => setNomSearchQuery(e.target.value)}
                        placeholder="Ad, SKU və ya Kateqoriya üzrə axtarın..."
                        className="w-full bg-white dark:bg-slate-900 border-none rounded-[1.5rem] py-5 pl-16 pr-8 text-sm font-black italic shadow-inner outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                      />
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-2">
                  {nomItems
                    .filter(n => 
                      n.name.toLowerCase().includes(nomSearchQuery.toLowerCase()) || 
                      (n.sku || n.code || '').toLowerCase().includes(nomSearchQuery.toLowerCase())
                    )
                    .map(nom => (
                      <button 
                        key={nom.id}
                        onClick={() => handleNomSelect(nom)}
                        className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group"
                      >
                          <div className="flex items-center space-x-6">
                              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 group-hover:text-indigo-500 transition-colors">
                                  <Package className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                  <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">{nom.name}</p>
                                  <div className="flex items-center space-x-3 mt-1">
                                      <span className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest">{nom.sku || nom.code}</span>
                                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                      <span className="text-[9px] font-black text-indigo-400 uppercase italic tracking-widest">{nom.size || '-'}</span>
                                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                      <span className="text-[9px] font-black text-emerald-500 uppercase italic tracking-widest">{nom.uom}</span>
                                  </div>
                              </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceAgreementCreate;
