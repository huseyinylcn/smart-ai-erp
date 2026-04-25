import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, FileSignature, 
  Plus, Save, 
  Trash2, 
  ClipboardList,
  Info, Building2, CreditCard, Calculator, Edit3, Search, Users, ChevronRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { useCompany } from '../../context/CompanyContext';
import { crmApi } from '../../utils/api';

const ContractCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [currentStatus] = useState<DocumentStatus>('DRAFT');
  const [contractType, setContractType] = useState('PURCHASE');
  const { activeCompany } = useCompany();
  const [vendors, setVendors] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    voen: '',
    partnerName: '',
    partnerType: 'VENDOR', // VENDOR or CUSTOMER
    date: '',
    expiryDate: '',
  });

  const [paymentTerms, setPaymentTerms] = useState({
    advance: 0,
    beforeDelivery: 0,
    afterDelivery: 0,
    daysAfter: 0,
    dayType: 'TG'
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!activeCompany) return;
      setIsLoading(true);
      try {
        const [vRes, cRes] = await Promise.all([
          crmApi.getCounterparties(activeCompany.id, 'SUPPLIER'),
          crmApi.getCounterparties(activeCompany.id, 'CUSTOMER')
        ]);
        setVendors(vRes.data || []);
        setCustomers(cRes.data || []);
      } catch (err) {
        console.error('Error fetching counterparties:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeCompany]);

  const activeList = formData.partnerType === 'VENDOR' ? vendors : customers;

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredList = activeList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.taxId || p.taxid || '').includes(searchTerm)
  );

  const handlePartnerSelect = (partner: any) => {
    setFormData({ ...formData, partnerName: partner.name, voen: partner.taxId || partner.taxid || '' });
    setSearchTerm(partner.name);
    setIsDropdownOpen(false);
  };

  const handleAddNew = () => {
    const path = formData.partnerType === 'VENDOR' ? '/purchase/vendors/create' : '/crm/customers/create';
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEdit) {
      // Mock fetch for edit mode
      setFormData({
        voen: '1401234567',
        partnerName: 'Metal Sənaye (Bakı) MMC',
        partnerType: 'VENDOR',
        date: '2024-09-15',
        expiryDate: '2025-09-15',
      });
      setSearchTerm('Metal Sənaye (Bakı) MMC');
      setPaymentTerms({
        advance: 30,
        beforeDelivery: 30,
        afterDelivery: 40,
        daysAfter: 15,
        dayType: 'TG'
      });
    }
  }, [isEdit, id]);

  const handleVoenSearch = () => {
    const partner = activeList.find(s => s.taxId === formData.voen || s.taxid === formData.voen);
    if (partner) {
        setFormData({ ...formData, partnerName: partner.name, voen: partner.taxId || partner.taxid || '' });
        setSearchTerm(partner.name);
    }
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-primary-100 dark:border-primary-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-primary-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                    {isEdit ? <Edit3 className="w-6 h-6 mr-2 text-indigo-500" /> : <FileSignature className="w-6 h-6 mr-2 text-primary-500" />}
                    {isEdit ? 'Müqaviləni Redaktə Et' : 'Yeni Müqavilə və QRP'}
                </h1>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic tracking-tighter">
                    <span>{isEdit ? `ID: ${id}` : 'SİSTEM TƏRƏFİNDƏN GENERASİYA OLUNACAQ'}</span>
                </div>
            </div>
          </div>

          <button className="flex items-center space-x-2 px-8 py-2.5 bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 active:scale-95 shadow-sm">
              <Save className="w-4 h-4 mr-2" />
              <span>{isEdit ? 'Müqaviləni Yenilə' : 'Müqaviləni Yadda Saxla'}</span>
          </button>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* CORE INFO */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic mb-4">
                    <Info className="w-4 h-4 mr-2" /> Əsas Hüquqi Məlumatlar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Kontragent Növü</label>
                        <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-inner">
                            <button 
                              onClick={() => { setFormData({...formData, partnerType: 'VENDOR', partnerName: '', voen: ''}); setSearchTerm(''); }}
                              className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase italic transition-all ${formData.partnerType === 'VENDOR' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Təchizatçı
                            </button>
                            <button 
                              onClick={() => { setFormData({...formData, partnerType: 'CUSTOMER', partnerName: '', voen: ''}); setSearchTerm(''); }}
                              className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase italic transition-all ${formData.partnerType === 'CUSTOMER' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Müştəri
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Müqavilənin Növü</label>
                        <select 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none"
                          value={contractType}
                          onChange={(e) => setContractType(e.target.value)}
                        >
                            <option value="PURCHASE">Alış Müqaviləsi</option>
                            <option value="SALES">Satış Müqaviləsi</option>
                            <option value="SERVICE">Xidmət Müqaviləsi</option>
                            <option value="LEAD">İcarə Müqaviləsi</option>
                        </select>
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
                                <div className="border-t border-slate-50 dark:border-slate-700/50 mt-2 pt-2">
                                   <button 
                                     onClick={handleAddNew}
                                     className="w-full flex items-center justify-center space-x-2 py-4 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-xl transition-all"
                                   >
                                      <Plus className="w-4 h-4" />
                                      <span className="text-[10px] font-black uppercase italic tracking-widest">+ Yeni Əlavə Et</span>
                                   </button>
                                </div>
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
                                 value={formData.voen} 
                                 onChange={(e) => setFormData({...formData, voen: e.target.value})} 
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Müqavilə Tarixi</label>
                            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Bitmə Tarixi</label>
                            <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* PAYMENT TERMS SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic mb-4">
                    <CreditCard className="w-4 h-4 mr-2 text-indigo-500 shadow-sm" /> Ödəniş Şərtləri (%) və Müddətlər
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">İlkin Ödəniş %</label>
                        <div className="relative">
                           <input type="number" value={paymentTerms.advance} onChange={(e) => setPaymentTerms({...paymentTerms, advance: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none pr-10" />
                           <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">%</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Təslimdən öncə %</label>
                        <div className="relative">
                           <input type="number" value={paymentTerms.beforeDelivery} onChange={(e) => setPaymentTerms({...paymentTerms, beforeDelivery: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none pr-10" />
                           <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">%</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Təslimdən sonra %</label>
                        <div className="relative">
                           <input type="number" value={paymentTerms.afterDelivery} onChange={(e) => setPaymentTerms({...paymentTerms, afterDelivery: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none pr-10" />
                           <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">%</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Gün sonra</label>
                        <input type="number" value={paymentTerms.daysAfter} onChange={(e) => setPaymentTerms({...paymentTerms, daysAfter: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Gün növü</label>
                        <select 
                          value={paymentTerms.dayType} 
                          onChange={(e) => setPaymentTerms({...paymentTerms, dayType: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none"
                        >
                            <option value="TG">Təqvim günü (TG)</option>
                            <option value="İG">İş günü (İG)</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl flex items-center justify-between border border-primary-100 dark:border-primary-800/30">
                    <span className="text-[10px] font-black text-primary-600 uppercase italic">Cəmi Ödəniş %:</span>
                    <span className={`text-xs font-black italic ${paymentTerms.advance + paymentTerms.beforeDelivery + paymentTerms.afterDelivery === 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {paymentTerms.advance + paymentTerms.beforeDelivery + paymentTerms.afterDelivery}%
                        {paymentTerms.advance + paymentTerms.beforeDelivery + paymentTerms.afterDelivery !== 100 && ' (Cəmi 100% olmalıdır)'}
                    </span>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR: SETTINGS */}
        <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-all">
                   <Calculator className="w-32 h-32" />
                </div>
                <h3 className="text-[10px] font-black text-primary-500 uppercase tracking-widest italic mb-6 relative z-10">Ümumi Müqavilə məbləği</h3>
                <div className="flex items-center space-x-3 mb-6 relative z-10">
                    <span className="text-3xl font-black italic tabular-nums">₼ {isEdit ? '250,500' : '0'}</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold leading-relaxed relative z-10 italic uppercase border-l-2 border-primary-600 pl-4">Bu məbləğ müqaviləyə bağlı bütün QRP-lərin cəmindən ibarətdir.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-6 shadow-sm">Maliyyə və Valyuta</h3>
               <div className="space-y-6 shadow-sm">
                  <div className="space-y-4 shadow-sm">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic shadow-sm ml-1">Valyuta</label>
                      <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none shadow-sm">
                          <option value="AZN">AZN - Manat</option>
                          <option value="USD">USD - Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                      </select>
                  </div>
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl space-y-4 shadow-sm">
                      <div className="flex items-center space-x-3 mb-2 shadow-sm">
                        <CreditCard className="w-4 h-4 text-indigo-600 shadow-sm" />
                        <span className="text-[9px] font-black text-indigo-600 uppercase italic shadow-sm">Ödəniş Şərtləri</span>
                      </div>
                      <textarea className="w-full bg-white dark:bg-slate-900 border-none rounded-xl p-4 text-[11px] font-bold italic outline-none shadow-sm min-h-[100px]" placeholder="Məs: 50% avans, 50% təhvil-təslim aktından sonra..."></textarea>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContractCreate;
