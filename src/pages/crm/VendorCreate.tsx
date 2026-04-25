import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShoppingBag, Landmark, Clock, 
  Save, Info, CheckCircle2, Globe, 
  AlertCircle, Loader2, MapPin, Plus, Trash2,
  Receipt, Calculator, Search, ChevronDown, AlertTriangle, CreditCard, Coins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { crmApi, financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const VendorCreate = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    code: `VEND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    isForeign: false,
    isVatPayer: false,
    payableAccountId: '',
    advanceAccountId: '',
    directorName: '',
    directorPosition: 'Direktor',
    bankAccounts: [
      { bankName: '', iban: '', currency: 'AZN', isActive: true, isDefault: true }
    ]
  });

  const [payableSearch, setPayableSearch] = useState('');
  const [advanceSearch, setAdvanceSearch] = useState('');
  const [showPayableList, setShowPayableList] = useState(false);
  const [showAdvanceList, setShowAdvanceList] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!activeCompany) return;
      try {
        const response = await financeApi.getAccounts(activeCompany.id);
        const fetchedAccounts = response.data || [];
        setAccounts(fetchedAccounts);
        const payable = fetchedAccounts.find((a: any) => a.code.startsWith('531'));
        const advance = fetchedAccounts.find((a: any) => a.code.startsWith('243'));
        if (payable) { setFormData(prev => ({ ...prev, payableAccountId: payable.id })); setPayableSearch(`${payable.code} - ${payable.name}`); }
        if (advance) { setFormData(prev => ({ ...prev, advanceAccountId: advance.id })); setAdvanceSearch(`${advance.code} - ${advance.name}`); }
      } catch (err) {}
    };
    fetchAccounts();
  }, [activeCompany]);

  // Bank Account Management
  const addBankAccount = () => {
    setFormData({
      ...formData,
      bankAccounts: [...formData.bankAccounts, { bankName: '', iban: '', currency: 'AZN', isActive: true, isDefault: false }]
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
    if (!formData.name) return setError('Təchizatçı adı mütləqdir.');
    setIsSaving(true);
    try {
      const validBankAccounts = formData.bankAccounts.filter(acc => acc.bankName || acc.iban);
      await crmApi.createCounterparty({
        companyId: activeCompany.id,
        ...formData,
        type: 'SUPPLIER',
        bankAccounts: validBankAccounts
      });
      setCurrentStatus('POSTED');
      setTimeout(() => navigate('/purchase/vendors'), 1500);
    } catch (err: any) { setError(err.message || 'Xəta!'); } finally { setIsSaving(false); }
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 relative">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/95 border-b border-primary-100 -mx-8 px-8 py-5 mb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-primary-50 transition-all shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
            <div><h1 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Yeni Təchizatçı</h1><p className="text-[10px] font-bold text-slate-400 uppercase italic">KOD: {formData.code}</p></div>
          </div>
          <button onClick={handleSave} disabled={isSaving || currentStatus === 'POSTED'} className="px-10 py-3 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 italic">{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}<span>Saxla</span></button>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 p-8 space-y-8">
                <h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest flex items-center"><Info className="w-4 h-4 mr-2 text-primary-500" /> Şirkət Məlumatları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase italic">Təchizatçı Adı</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" /></div>
                   <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase italic">VÖEN</label><input type="text" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none font-mono" /></div>
                   <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase italic">Direktorun Adı</label><input type="text" value={formData.directorName} onChange={(e) => setFormData({ ...formData, directorName: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" placeholder="Məs: Əli Əliyev" /></div>
                   <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase italic">Vəzifəsi</label><input type="text" value={formData.directorPosition} onChange={(e) => setFormData({ ...formData, directorPosition: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" /></div>
                   <div className="space-y-3 pt-3"><label className="text-[10px] font-black text-slate-400 uppercase italic">ƏDV STATUSU</label><button onClick={() => setFormData({ ...formData, isVatPayer: !formData.isVatPayer })} className={`w-full py-5 px-8 rounded-3xl text-[11px] font-black uppercase italic transition-all flex items-center justify-between border-2 ${formData.isVatPayer ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}><span className="flex items-center"><Receipt className="w-5 h-5 mr-3" />{formData.isVatPayer ? 'BƏLİ' : 'XEYR'}</span><div className={`w-12 h-6 rounded-full relative transition-all ${formData.isVatPayer ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isVatPayer ? 'left-7' : 'left-1'}`} /></div></button></div>
                   <div className="space-y-3 pt-3"><label className="text-[10px] font-black text-slate-400 uppercase italic">Növü</label><select value={formData.isForeign ? 'FOREIGN' : 'LOCAL'} onChange={(e) => setFormData({ ...formData, isForeign: e.target.value === 'FOREIGN' })} className="w-full bg-slate-50 border-none rounded-2xl py-4.5 px-6 text-sm font-black italic shadow-inner outline-none appearance-none"><option value="LOCAL">🌍 Yerli</option><option value="FOREIGN">✈️ Xarici</option></select></div>
                </div>
            </div>

            {/* BANK ACCOUNTS SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 p-8 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest flex items-center"><Landmark className="w-4 h-4 mr-2 text-indigo-500" /> Bank Rekvizitləri</h3>
                  <button onClick={addBankAccount} className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[9px] uppercase italic hover:bg-indigo-600 hover:text-white transition-all transition-all flex items-center shadow-sm"><Plus className="w-3.5 h-3.5 mr-1" /> Hesab Əlavə Et</button>
               </div>
               
               <div className="space-y-6">
                  {formData.bankAccounts.map((account, index) => (
                    <div key={index} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative group border-2 border-transparent hover:border-indigo-100 transition-all">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase">Bank Adı</label><input type="text" value={account.bankName} onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)} className="w-full p-3 font-black text-xs italic bg-white border border-slate-100 rounded-2xl shadow-sm outline-none" /></div>
                          <div className="space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase">İBAN / Hesab №</label><input type="text" value={account.iban} onChange={(e) => updateBankAccount(index, 'iban', e.target.value)} className="w-full p-3 font-black text-xs italic bg-white border border-slate-100 rounded-2xl shadow-sm outline-none font-mono" /></div>
                          <div className="space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase">Valyuta</label><select value={account.currency} onChange={(e) => updateBankAccount(index, 'currency', e.target.value)} className="w-full p-3 font-black text-xs italic bg-white border border-slate-100 rounded-2xl shadow-sm outline-none"><option value="AZN">AZN (₼)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="TRY">TRY (₺)</option></select></div>
                       </div>
                       <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200/50">
                          <button onClick={() => updateBankAccount(index, 'isActive', !account.isActive)} className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${account.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><div className={`w-3.5 h-3.5 rounded-full ${account.isActive ? 'bg-emerald-500' : 'bg-slate-300'} shadow-sm`} /><span className="text-[9px] font-black uppercase italic tracking-widest">{account.isActive ? 'HAZIRDA İŞLƏKDİR' : 'PASİV HESAB'}</span></button>
                          {formData.bankAccounts.length > 1 && <button onClick={() => removeBankAccount(index)} className="p-2 text-rose-400 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 p-8 space-y-8">
                <h3 className="text-xs font-black text-slate-400 uppercase italic italic"><Calculator className="w-4 h-4 mr-2 text-emerald-500" /> Mühasibat Hesabları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase italic">Kreditor Hesabı</label><div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input type="text" value={payableSearch} onChange={(e) => { setPayableSearch(e.target.value); setShowPayableList(true); }} onFocus={() => setShowPayableList(true)} onBlur={() => setTimeout(() => setShowPayableList(false), 200)} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-black italic shadow-inner outline-none transition-all" />{showPayableList && (<div className="absolute top-16 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto">{accounts.filter(a => a.name.toLowerCase().includes(payableSearch.toLowerCase()) || a.code.includes(payableSearch)).map(acc => (<button key={acc.id} onMouseDown={(e) => { e.preventDefault(); setFormData({ ...formData, payableAccountId: acc.id }); setPayableSearch(`${acc.code} - ${acc.name}`); setShowPayableList(false); }} className="w-full px-6 py-4 text-left hover:bg-primary-50 transition-colors border-b border-slate-50"><p className="text-[11px] font-black text-slate-800">{acc.code}</p><p className="text-[9px] font-bold text-slate-400 uppercase italic">{acc.name}</p></button>))}</div>)}</div></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase italic">Avans Hesabı</label><div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input type="text" value={advanceSearch} onChange={(e) => { setAdvanceSearch(e.target.value); setShowAdvanceList(true); }} onFocus={() => setShowAdvanceList(true)} onBlur={() => setTimeout(() => setShowAdvanceList(false), 200)} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-black italic shadow-inner outline-none transition-all" />{showAdvanceList && (<div className="absolute top-16 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto">{accounts.filter(a => a.name.toLowerCase().includes(advanceSearch.toLowerCase()) || a.code.includes(advanceSearch)).map(acc => (<button key={acc.id} onMouseDown={(e) => { e.preventDefault(); setFormData({ ...formData, advanceAccountId: acc.id }); setAdvanceSearch(`${acc.code} - ${acc.name}`); setShowAdvanceList(false); }} className="w-full px-6 py-4 text-left hover:bg-emerald-50 transition-colors border-b border-slate-50"><p className="text-[11px] font-black text-slate-800">{acc.code}</p><p className="text-[9px] font-bold text-slate-400 uppercase italic">{acc.name}</p></button>))}</div>)}</div></div>
                </div>
            </div>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"><div className="flex items-center space-x-3 mb-6 relative z-10"><CreditCard className="w-7 h-7 text-primary-500" /><span className="text-2xl font-black italic uppercase">MALİYYƏ İDARƏETMƏSİ</span></div><p className="text-[11px] text-slate-400 font-medium leading-relaxed relative z-10 italic uppercase border-l-2 border-primary-600 pl-4">Hər təchizatçı üçün bir neçə valyutada bank hesabı təyin edə və hazırda hansının işlək (aktiv) olduğunu filtrasiya edə bilərsiniz.</p></div>
            <div className="bg-primary-50 border border-primary-100 rounded-[2.5rem] p-8"><h3 className="text-[10px] font-black uppercase text-primary-600 mb-4 flex items-center italic"><Coins className="w-4 h-4 mr-2" /> Valyuta Dəstəyi</h3><p className="text-[11px] text-slate-600 font-bold italic border-b border-primary-100/50 pb-4 mb-4">AZN, USD, EUR və digər beynəlxalq valyutalar tam dəstəklənir.</p><p className="text-[10px] text-slate-400 font-black italic uppercase italic">Toplu ödənişlər zamanı sistem avtomatik olaraq aktiv hesabları seçir.</p></div>
        </div>
      </div>
    </div>
  );
};

export default VendorCreate;
