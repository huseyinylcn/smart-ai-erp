import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, 
  Globe, Briefcase, CreditCard, ShieldCheck,
  History, Info, AlertTriangle, Plus, Save,
  CheckCircle2, DollarSign, Calendar, Landmark, 
  Trash2, Receipt, Search, Loader2, Coins, Calculator,
  Smartphone, Hash, Building2, Layout, Store
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { crmApi, financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const CustomerCreate = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    code: `CUST-2026-OBJ-${Math.floor(1000 + Math.random() * 9000)}`,
    objectCode: '',
    objectName: '',
    phone: '',
    email: '',
    isForeign: false,
    isVatPayer: false,
    payableAccountId: '', // primary Receivable Account (211)
    advanceAccountId: '', // Customer Advance Account (543)
    isConsignmentAgent: false,
    bankAccounts: [
      { bankName: '', iban: '', currency: 'AZN', isActive: true }
    ]
  });

  const [receivableSearch, setReceivableSearch] = useState('');
  const [advanceSearch, setAdvanceSearch] = useState('');
  const [showReceivableList, setShowReceivableList] = useState(false);
  const [showAdvanceList, setShowAdvanceList] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!activeCompany) return;
      try {
        const response = await financeApi.getAccounts(activeCompany.id);
        const fetchedAccounts = response.data || [];
        setAccounts(fetchedAccounts);
        const receivable = fetchedAccounts.find((a: any) => a.code.startsWith('211'));
        const advance = fetchedAccounts.find((a: any) => a.code.startsWith('543'));
        if (receivable) { 
          setFormData(prev => ({ ...prev, payableAccountId: receivable.id })); 
          setReceivableSearch(`${receivable.code} - ${receivable.name}`); 
        }
        if (advance) { 
          setFormData(prev => ({ ...prev, advanceAccountId: advance.id })); 
          setAdvanceSearch(`${advance.code} - ${advance.name}`); 
        }
      } catch (err) {}
    };
    fetchAccounts();
  }, [activeCompany]);

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
    if (!activeCompany) return setError('Aktiv şirket tapılmadı.');
    if (!formData.name) return setError('Müştəri adı mütləqdir.');
    setIsSaving(true);
    try {
      await crmApi.createCounterparty({
        companyId: activeCompany.id,
        ...formData,
        type: 'CUSTOMER',
        bankAccounts: formData.bankAccounts.filter(acc => acc.bankName || acc.iban)
      });
      setCurrentStatus('POSTED');
      setTimeout(() => navigate('/crm/customers'), 1500);
    } catch (err: any) { setError(err.message || 'Xəta!'); } finally { setIsSaving(false); }
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-800 dark:text-slate-100 italic-none relative">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-primary-100 dark:border-primary-900/30 -mx-8 px-8 py-5 mb-4 flex items-center justify-between shadow-sm font-black italic">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-primary-50 transition-all shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Müştəri Kartının Yaradılması</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase italic">SİSTEM KODU: {formData.code}</p>
            </div>
          </div>
          <div className="flex space-x-3">
             <button onClick={() => navigate(-1)} className="px-6 py-3 font-black text-xs uppercase underline underline-offset-4 text-slate-400 hover:text-slate-600 transition-all">Ləğv Et</button>
             <button onClick={handleSave} disabled={isSaving || currentStatus === 'POSTED'} className="px-12 py-3 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95">{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}<span>Təsdiqlə və Yadda Saxla</span></button>
          </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* CORE FIELDS */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 space-y-10 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest flex items-center"><User className="w-4 h-4 mr-2 text-primary-500" /> Əsas Məlumatlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                   <div className="space-y-3 font-black italic"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center"><Building2 className="w-3 h-3 mr-2" /> Müştəri Adı (Şirkət)</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-primary-500/10 placeholder:text-slate-300" placeholder="Məs: Global Logistic MMC" /></div>
                   <div className="space-y-3 font-black italic"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center"><Hash className="w-3 h-3 mr-2 text-indigo-400" /> VÖEN</label><input type="text" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 text-sm font-black italic shadow-inner outline-none font-mono tracking-tighter" placeholder="10 rəqəmli kod..." /></div>
                   
                   <div className="space-y-3 font-black italic"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center"><Layout className="w-3 h-3 mr-2 text-amber-500" /> Obyekt Kodu</label><input type="text" value={formData.objectCode} onChange={(e) => setFormData({ ...formData, objectCode: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 text-sm font-black italic shadow-inner outline-none" placeholder="OBJ-XXXX" /></div>
                   <div className="space-y-3 font-black italic"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center"><Globe className="w-3 h-3 mr-2 text-emerald-500" /> Obyekt Adı</label><input type="text" value={formData.objectName} onChange={(e) => setFormData({ ...formData, objectName: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 text-sm font-black italic shadow-inner outline-none" placeholder="Məs: Bravo Sabunçu" /></div>

                   <div className="space-y-3 font-black italic"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center"><Smartphone className="w-3 h-3 mr-2 text-primary-400" /> Telefon Nömrəsi</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 text-sm font-black italic shadow-inner outline-none" placeholder="+994 (__) ___-__-__" /></div>
                   <div className="space-y-3 font-black italic"><label className="text-[10px] font-black text-slate-400 uppercase italic flex items-center"><Mail className="w-3 h-3 mr-2 text-primary-400" /> E-poçt Ünvanı</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 text-sm font-black italic shadow-inner outline-none" placeholder="office@customer.az" /></div>
                </div>
            </div>

            {/* STATUS TOGGLES */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 space-y-8 shadow-sm">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-black italic uppercase">
                  <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase text-slate-400">ƏDV ÖDƏYİCİSİ</label><button onClick={() => setFormData({ ...formData, isVatPayer: !formData.isVatPayer })} className={`w-full py-5 px-8 rounded-3xl text-[11px] font-black uppercase italic transition-all flex items-center justify-between border-2 ${formData.isVatPayer ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:bg-slate-100'}`}><span className="flex items-center"><Receipt className="w-5 h-5 mr-3" />{formData.isVatPayer ? 'BƏLİ' : 'XEYR'}</span><div className={`w-12 h-6 rounded-full relative transition-all ${formData.isVatPayer ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isVatPayer ? 'left-7' : 'left-1'}`} /></div></button></div>
                  <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase text-slate-400">MÜŞTƏRİ NÖVÜ</label><select value={formData.isForeign ? 'FOREIGN' : 'LOCAL'} onChange={(e) => setFormData({ ...formData, isForeign: e.target.value === 'FOREIGN' })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 px-8 text-[11px] font-black italic shadow-inner outline-none appearance-none"><option value="LOCAL">🌍 Yerli Müştəri</option><option value="FOREIGN">✈️ Xarici Müştəri</option></select></div>
                  <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase text-slate-400">KONSİQNASİYA AGENTİ</label><button onClick={() => setFormData({ ...formData, isConsignmentAgent: !formData.isConsignmentAgent })} className={`w-full py-5 px-8 rounded-3xl text-[11px] font-black uppercase italic transition-all flex items-center justify-between border-2 ${formData.isConsignmentAgent ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:bg-slate-100'}`}><span className="flex items-center"><Store className="w-5 h-5 mr-3" />{formData.isConsignmentAgent ? 'BƏLİ' : 'XEYR'}</span><div className={`w-12 h-6 rounded-full relative transition-all ${formData.isConsignmentAgent ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isConsignmentAgent ? 'left-7' : 'left-1'}`} /></div></button></div>
               </div>
            </div>

            {/* BANK ACCOUNTS */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 space-y-8 shadow-sm">
               <div className="flex items-center justify-between"><h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest flex items-center font-black italic uppercase"><Landmark className="w-4 h-4 mr-2 text-indigo-500" /> Bank Rekvizitləri</h3><button onClick={addBankAccount} className="px-5 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-[9px] uppercase italic hover:bg-indigo-600 hover:text-white transition-all flex items-center shadow-sm"><Plus className="w-3.5 h-3.5 mr-1" /> Hesab Əlavə Et</button></div>
               <div className="space-y-6 font-black italic">
                  {formData.bankAccounts.map((account, index) => (
                    <div key={index} className="p-8 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] relative group border-2 border-transparent hover:border-indigo-100 transition-all">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase">Bank</label><input type="text" value={account.bankName} onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)} className="w-full p-3 font-black text-xs italic bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none placeholder:text-slate-300" placeholder="Bankın adı..." /></div>
                          <div className="space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase">İBAN</label><input type="text" value={account.iban} onChange={(e) => updateBankAccount(index, 'iban', e.target.value)} className="w-full p-3 font-black text-xs italic bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-mono" placeholder="AZ0000..." /></div>
                          <div className="space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase">Valyuta</label><select value={account.currency} onChange={(e) => updateBankAccount(index, 'currency', e.target.value)} className="w-full p-3 font-black text-xs italic bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none"><option value="AZN">AZN (₼)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="TRY">TRY (₺)</option></select></div>
                       </div>
                       <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200/50">
                          <button onClick={() => updateBankAccount(index, 'isActive', !account.isActive)} className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${account.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><div className={`w-3.5 h-3.5 rounded-full ${account.isActive ? 'bg-emerald-500' : 'bg-slate-300'} shadow-sm`} /><span className="text-[9px] font-black uppercase italic tracking-widest">{account.isActive ? 'HAZIRDA İŞLƏKDİR' : 'PASİV HESAB'}</span></button>
                          {formData.bankAccounts.length > 1 && <button onClick={() => removeBankAccount(index)} className="p-2 text-rose-400 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* ACCOUNTING SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 space-y-8 shadow-sm font-black italic">
                <h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest flex items-center italic uppercase"><Calculator className="w-4 h-4 mr-2 text-emerald-500" /> Mühasibat Hesabları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase italic tracking-tight italic">Debitor Hesabı (211...)</label><div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input type="text" value={receivableSearch} onChange={(e) => { setReceivableSearch(e.target.value); setShowReceivableList(true); }} onFocus={() => setShowReceivableList(true)} onBlur={() => setTimeout(() => setShowReceivableList(false), 200)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-black italic shadow-inner outline-none transition-all" />{showReceivableList && (<div className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl z-[100] max-h-48 overflow-y-auto font-black italic">{accounts.filter(a => a.name.toLowerCase().includes(receivableSearch.toLowerCase()) || a.code.includes(receivableSearch)).map(acc => (<button key={acc.id} onMouseDown={(e) => { e.preventDefault(); setFormData({ ...formData, payableAccountId: acc.id }); setReceivableSearch(`${acc.code} - ${acc.name}`); setShowReceivableList(false); }} className="w-full px-6 py-4 text-left hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border-b border-slate-50 dark:border-slate-800 font-black italic"><p className="text-[11px] font-black text-slate-800 dark:text-white uppercase">{acc.code}</p><p className="text-[9px] font-bold text-slate-400 uppercase italic">{acc.name}</p></button>))}</div>)}</div></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase italic tracking-tight italic">Müştəri Avansı (543...)</label><div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input type="text" value={advanceSearch} onChange={(e) => { setAdvanceSearch(e.target.value); setShowAdvanceList(true); }} onFocus={() => setShowAdvanceList(true)} onBlur={() => setTimeout(() => setShowAdvanceList(false), 200)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-black italic shadow-inner outline-none transition-all" />{showAdvanceList && (<div className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl z-[100] max-h-48 overflow-y-auto font-black italic">{accounts.filter(a => a.name.toLowerCase().includes(advanceSearch.toLowerCase()) || a.code.includes(advanceSearch)).map(acc => (<button key={acc.id} onMouseDown={(e) => { e.preventDefault(); setFormData({ ...formData, advanceAccountId: acc.id }); setAdvanceSearch(`${acc.code} - ${acc.name}`); setShowAdvanceList(false); }} className="w-full px-6 py-4 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-b border-slate-50 dark:border-slate-800 font-black italic"><p className="text-[11px] font-black text-slate-800 dark:text-white uppercase">{acc.code}</p><p className="text-[9px] font-bold text-slate-400 uppercase italic">{acc.name}</p></button>))}</div>)}</div></div>
                </div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group font-black italic">
               <div className="flex items-center space-x-3 mb-6 relative z-10"><CreditCard className="w-7 h-7 text-primary-500" /><span className="text-xl uppercase">Maliyyə Siyasəti</span></div>
               <p className="text-[10px] text-slate-400 uppercase leading-relaxed relative z-10 border-l-2 border-primary-600 pl-4 italic">Bütün bank rekvizitləri və müəssisə kodları maliyyə hesabatlılığı üçün kritikdir.</p>
               <div className="mt-8 space-y-4 relative z-10">
                  <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl"><Coins className="w-5 h-5 text-emerald-400" /><div className="text-[9px] uppercase text-slate-300 italic tracking-widest">Çox-Valyutalı Verifikasiya</div></div>
               </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center mb-4 italic grow uppercase"><ShieldCheck className="w-4 h-4 mr-2 text-primary-500" /> Məlumat Təhlükəsizliyi</h4>
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic uppercase">Daxil etdiyiniz bütün Obyekt və Müəssisə məlumatları şifrələnmiş şəkildə bazada qorunur.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCreate;
