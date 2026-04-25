import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, 
  Globe, Briefcase, CreditCard, ShieldCheck,
  History, Info, AlertTriangle, Plus, Save,
  CheckCircle2, DollarSign, Calendar, Landmark, 
  Trash2, Receipt, Search, Loader2, Coins, Calculator,
  Smartphone, Hash, Building2, Layout, Sparkles, Store
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { crmApi, financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('POSTED');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    code: '',
    objectCode: '',
    objectName: '',
    phone: '',
    email: '',
    isForeign: false,
    isVatPayer: false,
    isConsignmentAgent: false,
    payableAccountId: '',
    advanceAccountId: '',
    bankAccounts: [
      { bankName: '', iban: '', currency: 'AZN', isActive: true }
    ]
  });

  const [receivableSearch, setReceivableSearch] = useState('');
  const [advanceSearch, setAdvanceSearch] = useState('');
  const [showReceivableList, setShowReceivableList] = useState(false);
  const [showAdvanceList, setShowAdvanceList] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      if (id && activeCompany) {
        await Promise.all([fetchCustomer(), fetchAccounts()]);
      }
      setIsLoading(false);
    };
    init();
  }, [id, activeCompany]);

  const fetchCustomer = async () => {
    if (!id) return;
    try {
      const response = await crmApi.getCounterparty(id);
      // Backend returns { data: { ...counterparty } }
      // Axios returns { data: { data: { ...counterparty } } }
      const cData = response.data?.data || response.data; 
      
      if (cData) {
        setFormData({
          name: cData.name || '',
          taxId: cData.taxId || '',
          code: cData.code || '',
          objectCode: cData.objectCode || '',
          objectName: cData.objectName || '',
          phone: cData.phone || '',
          email: cData.email || '',
          isForeign: !!cData.isForeign,
          isVatPayer: !!cData.isVatPayer,
          isConsignmentAgent: !!cData.isConsignmentAgent,
          payableAccountId: cData.payableAccountId || '',
          advanceAccountId: cData.advanceAccountId || '',
          bankAccounts: cData.bankAccounts && cData.bankAccounts.length > 0 
            ? cData.bankAccounts 
            : [{ bankName: '', iban: '', currency: 'AZN', isActive: true }]
        });
        setCurrentStatus(cData.status || 'POSTED');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const fetchAccounts = async () => {
    if (!activeCompany) return;
    try {
      const res = await financeApi.getAccounts(activeCompany.id);
      setAccounts(res.data?.data || res.data || []);
    } catch (e) {}
  };

  useEffect(() => {
    if (accounts.length > 0 && formData.payableAccountId) {
      const rec = accounts.find(a => a.id === formData.payableAccountId);
      if (rec) setReceivableSearch(`${rec.code} - ${rec.name}`);
    }
    if (accounts.length > 0 && formData.advanceAccountId) {
      const adv = accounts.find(a => a.id === formData.advanceAccountId);
      if (adv) setAdvanceSearch(`${adv.code} - ${adv.name}`);
    }
  }, [accounts, formData.payableAccountId, formData.advanceAccountId]);

  const addBankAccount = () => {
    setFormData({
      ...formData,
      bankAccounts: [...formData.bankAccounts, { bankName: '', iban: '', currency: 'AZN', isActive: true }]
    });
  };

  const removeBankAccount = (index: number) => {
    if (formData.bankAccounts.length <= 1) return;
    const newAccounts = [...formData.bankAccounts];
    newAccounts.splice(index, 1);
    setFormData({ ...formData, bankAccounts: newAccounts });
  };

  const updateBankAccount = (index: number, field: string, value: any) => {
    const newAccounts = [...formData.bankAccounts];
    (newAccounts[index] as any)[field] = value;
    setFormData({ ...formData, bankAccounts: newAccounts });
  };

  const handleSave = async () => {
    if (!id || !activeCompany) return;
    
    // VERIFICATION ALERT
    const dataToSend = {
      ...formData,
      companyId: activeCompany.id,
      type: 'CUSTOMER'
    };
    
    console.log('--- SAVE CLICKED ---');
    console.log('DATA TO SEND:', dataToSend);
    
    setIsSaving(true);
    try {
      const response = await crmApi.updateCounterparty(id, dataToSend);
      console.log('--- SAVE SUCCESS ---', response);
      navigate('/crm/customers');
    } catch (err: any) { 
      console.error('--- SAVE FAILED ---', err);
      setError(err.message || 'Xəta!'); 
    } finally { 
      setIsSaving(false); 
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-black italic">
        <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
        <p className="text-xs uppercase text-slate-400 tracking-widest font-black italic">Məlumatlar Yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 text-slate-800 dark:text-slate-100 italic relative">
      
      {/* PREMIUM HEADER BAR */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-6 mb-4 flex items-center justify-between shadow-sm font-black italic">
          <div className="flex items-center space-x-6 leading-none">
            <button onClick={() => navigate(-1)} className="group p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-white hover:shadow-xl transition-all outline-none border-none"><ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-primary-600 transition-all font-black italic" /></button>
            <div className="leading-none">
              <div className="flex items-center gap-2 mb-1.5 leading-none"><Sparkles className="w-4 h-4 text-primary-500" /><h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-none">Müştəri Kartı</h1></div>
              <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest leading-none">REDƏKTƏ REJİMİ | {formData.code}</p>
            </div>
          </div>
          <div className="flex items-center space-x-5 leading-none font-black italic">
             <button onClick={() => navigate(-1)} className="px-8 py-4 font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all leading-none font-black italic">Ləğv Et</button>
             <button onClick={handleSave} disabled={isSaving} className="px-14 py-4.5 bg-primary-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] shadow-2xl shadow-primary-500/30 transition-all hover:scale-105 active:scale-95 flex items-center outline-none border-none leading-none font-black italic">{isSaving ? <Loader2 className="w-5 h-5 mr-3 animate-spin font-black italic" /> : <Save className="w-5 h-5 mr-3 font-black italic" />}<span>YADDA SAXLA</span></button>
          </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-10 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-10">
            
            {/* CORE FIELDS SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-12 shadow-sm font-black italic uppercase">
                <div className="flex items-center justify-between border-b border-slate-50 pb-8 leading-none font-black italic"><h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest flex items-center font-black italic uppercase leading-none"><User className="w-5 h-5 mr-3 text-primary-500" /> Şəxsiyyət və Obyekt Məlumatları</h3><span className="px-5 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-[9px] font-black italic text-slate-400 border border-slate-100 leading-none">{formData.isForeign ? '✈️ XARİCİ' : '🌍 YERLİ'} REYESTR</span></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 font-black italic uppercase leading-none">
                   <div className="space-y-4 leading-none"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center leading-none"><Building2 className="w-4 h-4 mr-3 text-slate-400" /> Müştərin Adı (Tam Ünvan)</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50/70 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500/20 rounded-3xl py-6 px-10 text-sm font-black italic shadow-inner outline-none transition-all placeholder:text-slate-300 font-black italic uppercase" placeholder="Şirkət adı..." /></div>
                   <div className="space-y-4 leading-none"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center leading-none"><Hash className="w-4 h-4 mr-3 text-indigo-400" /> VÖEN (Vergi ID)</label><input type="text" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} className="w-full bg-slate-50/70 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-3xl py-6 px-10 text-sm font-black italic shadow-inner outline-none font-mono tracking-tighter" placeholder="10 rəqəmli kod..." /></div>
                   
                   <div className="space-y-4 leading-none"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center leading-none"><Layout className="w-4 h-4 mr-3 text-amber-500" /> Obyekt Kodu</label><input type="text" value={formData.objectCode} onChange={(e) => setFormData({ ...formData, objectCode: e.target.value })} className="w-full bg-slate-50/70 dark:bg-slate-800/50 border-2 border-transparent focus:border-amber-500/20 rounded-3xl py-6 px-10 text-sm font-black italic shadow-inner outline-none font-black italic uppercase" placeholder="OBJ-XXXX" /></div>
                   <div className="space-y-4 leading-none"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center leading-none"><Globe className="w-4 h-4 mr-3 text-emerald-500" /> Obyekt Adı</label><input type="text" value={formData.objectName} onChange={(e) => setFormData({ ...formData, objectName: e.target.value })} className="w-full bg-slate-50/70 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500/20 rounded-3xl py-6 px-10 text-sm font-black italic shadow-inner outline-none font-black italic uppercase" placeholder="Məntəqə adı..." /></div>

                   <div className="space-y-4 leading-none"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center leading-none"><Smartphone className="w-4 h-4 mr-3 text-primary-400" /> Əlaqə Nömrəsi</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50/70 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500/20 rounded-3xl py-6 px-10 text-sm font-black italic shadow-inner outline-none font-black italic uppercase" placeholder="+994 (__) ___ __ __" /></div>
                   <div className="space-y-4 leading-none"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center leading-none"><Mail className="w-4 h-4 mr-3 text-primary-400" /> E-poçt (Rəsmi)</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50/70 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500/20 rounded-3xl py-6 px-10 text-sm font-black italic shadow-inner outline-none font-black italic uppercase" placeholder="example@mail.com" /></div>
                </div>
            </div>

            {/* STATUS TOGGLES */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10 font-black italic uppercase">
                  <div className="space-y-4 leading-none font-black italic uppercase">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block mb-1">ƏDV Qeydiyyatı</label>
                    <button type="button" onClick={() => { console.log('VAT TOGGLE CLICKED'); setFormData({ ...formData, isVatPayer: !formData.isVatPayer }); }} className={`w-full py-7 px-10 rounded-[2.5rem] text-[11px] font-black uppercase italic transition-all flex items-center justify-between border-2 ${formData.isVatPayer ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-xl shadow-emerald-500/10' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:bg-slate-100 hover:border-slate-200'}`}>
                      <span className="flex items-center"><Receipt className="w-5 h-5 mr-4" />{formData.isVatPayer ? 'ƏDV ÖDƏYİCİSİDİR' : 'ƏDV ÖDƏYİCİSİ DEYİL'}</span>
                      <div className={`w-14 h-7 rounded-full relative transition-all ${formData.isVatPayer ? 'bg-emerald-500 font-black italic uppercase' : 'bg-slate-300 dark:bg-slate-700 shadow-inner'}`}>
                        <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow-md ${formData.isVatPayer ? 'left-8.5' : 'left-1.5'}`} />
                      </div>
                    </button>
                  </div>
                  <div className="space-y-4 leading-none font-black italic uppercase"><label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block mb-1">Müştərinin Mənşəyi</label><div className="relative font-black italic uppercase leading-none"><select value={formData.isForeign ? 'FOREIGN' : 'LOCAL'} onChange={(e) => setFormData({ ...formData, isForeign: e.target.value === 'FOREIGN' })} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500/20 rounded-[2.5rem] py-7 px-10 text-[11px] font-black italic shadow-inner outline-none appearance-none cursor-pointer font-black italic uppercase"><option value="LOCAL">🌍 YERLİ MÜŞTƏRİ</option><option value="FOREIGN">✈️ XARİCİ MÜŞTƏRİ</option></select><div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-black italic uppercase"><Globe className="w-5 h-5 font-black italic uppercase" /></div></div></div>
                  <div className="space-y-4 leading-none font-black italic uppercase">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block mb-1">Konsiqnasiya Agentİ</label>
                    <button type="button" onClick={() => setFormData({ ...formData, isConsignmentAgent: !formData.isConsignmentAgent })} className={`w-full py-7 px-10 rounded-[2.5rem] text-[11px] font-black uppercase italic transition-all flex items-center justify-between border-2 ${formData.isConsignmentAgent ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-xl shadow-blue-500/10' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:bg-slate-100 hover:border-slate-200'}`}>
                      <span className="flex items-center"><Store className="w-5 h-5 mr-4" />{formData.isConsignmentAgent ? 'BƏLİ' : 'XEYR'}</span>
                      <div className={`w-14 h-7 rounded-full relative transition-all ${formData.isConsignmentAgent ? 'bg-blue-500 font-black italic uppercase' : 'bg-slate-300 dark:bg-slate-700 shadow-inner'}`}>
                        <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow-md ${formData.isConsignmentAgent ? 'left-8.5' : 'left-1.5'}`} />
                      </div>
                    </button>
                  </div>
               </div>
            </div>

            {/* BANK ACCOUNTS SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase">
               <div className="flex items-center justify-between border-b border-slate-50 pb-8 leading-none font-black italic uppercase"><h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest flex items-center font-black italic uppercase leading-none"><Landmark className="w-5 h-5 mr-3 text-indigo-500" /> Bank Rekvizitləri</h3><button onClick={addBankAccount} className="px-10 py-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl font-black text-[10px] uppercase italic hover:bg-indigo-600 hover:text-white transition-all flex items-center shadow-lg active:scale-95 leading-none font-black italic uppercase"><Plus className="w-4 h-4 mr-2" /> Hesab Əlavə Et</button></div>
               <div className="grid grid-cols-1 gap-10 font-black italic uppercase leading-none">
                  {formData.bankAccounts.map((account, index) => (
                    <div key={index} className="p-10 bg-slate-50/50 dark:bg-slate-800/30 border-2 border-slate-50 hover:border-indigo-100 transition-all rounded-[3rem] relative group font-black italic uppercase leading-none">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 leading-none font-black italic uppercase">
                          <div className="space-y-3 leading-none font-black italic uppercase"><label className="text-[10px] font-black text-slate-400 uppercase italic leading-none">Bank Adı</label><input type="text" value={account.bankName} onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)} className="w-full py-5 px-8 font-black text-xs italic bg-white dark:bg-slate-800 border-2 border-slate-50 rounded-[1.5rem] shadow-sm outline-none focus:border-indigo-500/20 font-black italic uppercase" placeholder="..." /></div>
                          <div className="space-y-3 leading-none font-black italic uppercase"><label className="text-[10px] font-black text-slate-400 uppercase italic leading-none">İBAN (AZ__)</label><input type="text" value={account.iban} onChange={(e) => updateBankAccount(index, 'iban', e.target.value)} className="w-full py-5 px-8 font-black text-xs italic bg-white dark:bg-slate-800 border-2 border-slate-50 rounded-[1.5rem] shadow-sm outline-none font-mono tracking-tighter" placeholder="..." /></div>
                          <div className="space-y-3 leading-none font-black italic uppercase"><label className="text-[10px] font-black text-slate-400 uppercase italic leading-none">Məzənnə</label><select value={account.currency} onChange={(e) => updateBankAccount(index, 'currency', e.target.value)} className="w-full py-5 px-8 font-black text-xs italic bg-white dark:bg-slate-800 border-2 border-slate-50 rounded-[1.5rem] shadow-sm outline-none appearance-none font-black italic uppercase"><option value="AZN">AZN (₼)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="TRY">TRY (₺)</option></select></div>
                       </div>
                       <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200/50 font-black italic uppercase leading-none">
                          <button onClick={() => updateBankAccount(index, 'isActive', !account.isActive)} className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all shadow-sm border-2 font-black italic uppercase leading-none ${account.isActive ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400 font-black italic uppercase'}`}><div className={`w-4 h-4 rounded-full ${account.isActive ? 'bg-emerald-500 shadow-md animate-pulse' : 'bg-slate-300'} shadow-sm font-black italic uppercase`} /><span className="text-[10px] font-black uppercase italic tracking-widest">{account.isActive ? 'İŞLƏK HESAB' : 'PASİV HESAB'}</span></button>
                          {formData.bankAccounts.length > 1 && <button onClick={() => removeBankAccount(index)} className="p-4 bg-white/20 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all opacity-0 group-hover:opacity-100 font-black italic uppercase"><Trash2 className="w-6 h-6 font-black italic uppercase" /></button>}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* ACCOUNTING SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase">
                <div className="flex items-center justify-between border-b border-slate-50 pb-8 leading-none font-black italic uppercase"><h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest flex items-center font-black italic uppercase leading-none"><Calculator className="w-5 h-5 mr-3 text-emerald-500" /> Mühasibat Müxabirləşmələri</h3><span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black italic border border-emerald-100 leading-none">GAAP (AZ) UYĞUNLUQ</span></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-black italic uppercase leading-none">
                    <div className="space-y-4 leading-none font-black italic uppercase"><label className="text-[10px] font-black text-slate-400 uppercase italic block mb-1">Debitor Hesabı (211...)</label><div className="relative group font-black italic uppercase leading-none"><Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 font-black italic uppercase" /><input type="text" value={receivableSearch} onChange={(e) => { setReceivableSearch(e.target.value); setShowReceivableList(true); }} onFocus={() => setShowReceivableList(true)} onBlur={() => setTimeout(() => setShowReceivableList(false), 200)} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500/20 rounded-[2rem] py-6 pl-18 pr-8 text-sm font-black italic shadow-inner outline-none transition-all font-black italic uppercase" placeholder="Hesab axtar..." />{showReceivableList && (<div className="absolute top-20 left-0 right-0 bg-white dark:bg-slate-800 border-2 border-slate-50 rounded-[2rem] shadow-2xl z-[100] max-h-56 overflow-y-auto">{accounts.filter(a => a.code.startsWith('211') && (a.name.toLowerCase().includes(receivableSearch.toLowerCase()) || a.code.includes(receivableSearch))).map(acc => (<button key={acc.id} onMouseDown={(e) => { e.preventDefault(); setFormData({ ...formData, payableAccountId: acc.id }); setReceivableSearch(`${acc.code} - ${acc.name}`); setShowReceivableList(false); }} className="w-full px-8 py-5 text-left hover:bg-primary-50 transition-colors border-b border-slate-50 font-black italic uppercase leading-tight"><p className="text-[11px] font-black text-slate-800">{acc.code}</p><p className="text-[9px] text-slate-400 font-bold uppercase italic">{acc.name}</p></button>))}</div>)}</div></div>
                    <div className="space-y-4 leading-none font-black italic uppercase"><label className="text-[10px] font-black text-slate-400 uppercase italic block mb-1">Müştəri Avansı (543...)</label><div className="relative group font-black italic uppercase leading-none"><Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 font-black italic uppercase" /><input type="text" value={advanceSearch} onChange={(e) => { setAdvanceSearch(e.target.value); setShowAdvanceList(true); }} onFocus={() => setShowAdvanceList(true)} onBlur={() => setTimeout(() => setShowAdvanceList(false), 200)} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-6 pl-18 pr-8 text-sm font-black italic shadow-inner outline-none transition-all font-black italic uppercase" placeholder="Avans hesabı..." />{showAdvanceList && (<div className="absolute top-20 left-0 right-0 bg-white dark:bg-slate-800 border-2 border-slate-50 rounded-[2rem] shadow-2xl z-[100] max-h-56 overflow-y-auto">{accounts.filter(a => a.code.startsWith('543') && (a.name.toLowerCase().includes(advanceSearch.toLowerCase()) || a.code.includes(advanceSearch))).map(acc => (<button key={acc.id} onMouseDown={(e) => { e.preventDefault(); setFormData({ ...formData, advanceAccountId: acc.id }); setAdvanceSearch(`${acc.code} - ${acc.name}`); setShowAdvanceList(false); }} className="w-full px-8 py-5 text-left hover:bg-emerald-50 transition-colors border-b border-slate-50 font-black italic uppercase leading-tight"><p className="text-[11px] font-black text-slate-800">{acc.code}</p><p className="text-[9px] text-slate-400 font-bold uppercase italic">{acc.name}</p></button>))}</div>)}</div></div>
                </div>
            </div>
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-36 space-y-8 font-black italic uppercase leading-none">
            <div className="bg-slate-900 text-white rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group font-black italic uppercase leading-none">
               <div className="absolute top-0 right-0 p-14 opacity-5 group-hover:scale-150 transition-all duration-1000 rotate-12 font-black italic uppercase leading-none"><Receipt className="w-64 h-64 font-black italic uppercase leading-none" /></div>
               <div className="flex items-center gap-4 mb-8 relative z-10 font-black italic uppercase leading-none"><CreditCard className="w-8 h-8 text-primary-500 font-black italic uppercase" /><span className="text-2xl uppercase tracking-tighter italic font-black uppercase">Cari Kart Statusu</span></div>
               <p className="text-[11px] text-slate-400 uppercase leading-relaxed relative z-10 border-l-4 border-primary-600 pl-6 mb-10 italic font-black">Müştəri kartındakı bütün dəyişikliklər rəsmi audit üçün qeydə alınır. Məlumatların doğruluğuna əmin olun.</p>
               <div className="space-y-6 relative z-10 font-black italic uppercase leading-none text-xs">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 shadow-inner leading-none font-black italic uppercase"><div className="flex items-center gap-4 leading-none font-black italic uppercase"><Coins className="w-6 h-6 text-emerald-400 font-black italic uppercase" /><span className="text-[10px] uppercase font-black italic leading-none">Maliyyə Nəzarəti</span></div><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 shadow-inner leading-none font-black italic uppercase"><div className="flex items-center gap-4 leading-none font-black italic uppercase"><History className="w-6 h-6 text-indigo-400 font-black italic uppercase" /><span className="text-[10px] uppercase font-black italic leading-none">Audit Track</span></div><span className="text-[10px] font-black text-slate-400 tracking-tighter italic">AKTİVDİR</span></div>
               </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-slate-50 dark:border-slate-800 p-10 shadow-sm font-black italic uppercase leading-none">
                <div className="flex items-center gap-4 mb-6 leading-none"><ShieldCheck className="w-6 h-6 text-primary-500 font-black italic uppercase leading-none" /><h4 className="text-[11px] font-black uppercase text-slate-800 dark:text-white tracking-widest italic leading-none font-black italic uppercase">Təhlükəsizlik Paneli</h4></div>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic uppercase font-black italic uppercase">Bu səhifədə edilən hər bir giriş və dəyişiklik "Audit Trail" sistemində sizin istifadəçi adınızla möhürlənir.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerEdit;
