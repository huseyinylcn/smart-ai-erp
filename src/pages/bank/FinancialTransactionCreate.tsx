import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, Calculator, Info, 
  User, Building2, Banknote, Landmark, ShieldCheck, 
  TrendingUp, TrendingDown, Users, FileText, Receipt,
  Wallet, DollarSign, Calendar, Search, Plus, CreditCard, RefreshCw
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { financeApi, crmApi, hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import JournalPreviewModal from '../../components/JournalPreviewModal';
import SearchableSelect from '../../components/common/SearchableSelect';

type TransactionMode = 'INBOUND' | 'OUTBOUND';

interface SubType {
    id: string;
    label: string;
    icon: any;
    color: string;
}

const INBOUND_SUBTYPES: SubType[] = [
    { id: 'CUSTOMER_PAYMENT', label: 'Müştəri Ödənişi', icon: Users, color: 'emerald' },
    { id: 'FOUNDER_LOAN', label: 'Təsisçidən Borc/İnvestisiya', icon: User, color: 'blue' },
    { id: 'BANK_LOAN', label: 'Bank Krediti', icon: Landmark, color: 'indigo' },
    { id: 'TAX_REFUND', label: 'Vergi Qaytarması', icon: Receipt, color: 'amber' },
    { id: 'OTHER_INCOME', label: 'Digər Mədaxil', icon: Plus, color: 'slate' }
];

const OUTBOUND_SUBTYPES: SubType[] = [
    { id: 'SUPPLIER_PAYMENT', label: 'Təchizatçı Ödənişi', icon: TruckIcon, color: 'rose' },
    { id: 'SALARY_PAYMENT', label: 'Əmək Haqqı Ödənişi', icon: Banknote, color: 'emerald' },
    { id: 'TAX_PAYMENT', label: 'Vergi Ödənişi', icon: Receipt, color: 'amber' },
    { id: 'UTILITY_PAYMENT', label: 'Kommunal / Xidmət', icon: Building2, color: 'indigo' },
    { id: 'OFFICE_RENT', label: 'Ofis Kirayəsi', icon: Landmark, color: 'slate' },
    { id: 'LOAN_REPAYMENT', label: 'Kredit Ödənişi', icon: CreditCard, color: 'blue' },
    { id: 'OTHER_EXPENSE', label: 'Digər Məxaric', icon: Plus, color: 'slate' }
];

function TruckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  )
}

const FinancialTransactionCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeCompany } = useCompany();
  
  // 1. STATE
  const [mode, setMode] = useState<TransactionMode>(
    (searchParams.get('mode') as TransactionMode) || 'INBOUND'
  );
  const [subTypeId, setSubTypeId] = useState(searchParams.get('subType') || '');
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [counterparties, setCounterparties] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    accountId: '',
    targetId: '', // Customer, Vendor, Employee, etc.
    amount: 0,
    currency: 'AZN',
    date: new Date().toISOString().split('T')[0],
    memo: '',
    refNo: '',
    taxType: ''
  });

  const [docNumber, setDocNumber] = useState('');

  // 2. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      if (!activeCompany) return;
      setLoading(true);
      try {
        const [accRes, cpRes, empRes] = await Promise.all([
          financeApi.getAccounts(activeCompany.id),
          crmApi.getCounterparties(activeCompany.id),
          hrApi.getEmployees(activeCompany.id)
        ]);
        
        setAccounts(accRes.data);
        setCounterparties(cpRes.data || []);
        setEmployees(empRes.data || []);
        
        if (accRes.data.length > 0) {
            setFormData(prev => ({ ...prev, accountId: accRes.data[0].id, currency: accRes.data[0].currency }));
        }
      } catch (error: any) {
        console.error("Məlumatlar yüklənərkən xəta:", error);
        if (error.message.includes('Failed to fetch')) {
            // Mocks
            setAccounts([
                { id: 'a1', name: 'Pasha Bank (AZN)', code: '223.01', currency: 'AZN' },
                { id: 'a2', name: 'Əsas Kassa (AZN)', code: '221.01', currency: 'AZN' },
                { id: 'a3', name: 'Kapital Bank (USD)', code: '223.02', currency: 'USD' }
            ]);
            setCounterparties([
                { id: 'c1', name: 'Altes Group MMC' },
                { id: 'c2', name: 'Tengry supply MMC' }
            ]);
            setEmployees([
                { id: 'e1', name: 'Hüseyn Yılmaz' },
                { id: 'e2', name: 'Aysel Məmmədova' }
            ]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setDocNumber(`${mode === 'INBOUND' ? 'MAD' : 'MAX'}-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`);
  }, [activeCompany?.id, mode]);

  // 3. CALCULATIONS
  const subTypes = mode === 'INBOUND' ? INBOUND_SUBTYPES : OUTBOUND_SUBTYPES;
  const activeSubType = subTypes.find(s => s.id === subTypeId);
  const selectedAccount = accounts.find(a => a.id === formData.accountId);

  // 4. HANDLERS
  const handleSave = async () => {
    setCurrentStatus('POSTED');
  };

  if (loading) return <div className="flex items-center justify-center h-full"><RefreshCw className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4 sticky top-0 z-40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
                  {mode === 'INBOUND' ? 'Mədaxil Əməliyyatı' : 'Məxaric Əməliyyatı'}
                </h1>
                <span className={`px-2.5 py-1 ${mode === 'INBOUND' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} rounded-lg text-[10px] font-black uppercase tracking-widest border border-current italic opacity-80`}>
                    {mode === 'INBOUND' ? 'DAXİLOLMA' : 'XARİCOLMA'}
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 italic">SƏNƏD NO: {docNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsJournalVisible(true)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
            >
                <Calculator className="w-4 h-4 shadow-inner" />
                <span>Müxabirləşmə</span>
            </button>
            <button onClick={handleSave} className={`flex items-center space-x-2 px-8 py-2.5 ${mode === 'INBOUND' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'} text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 italic`}>
                <CheckCircle2 className="w-4 h-4 text-white/80" />
                <span>Əməliyyatı Tamamla</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT: SUBTYPE SELECTOR */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center">
                    <Info className="w-4 h-4 mr-2 text-indigo-500" /> Əməliyyatın Alt Tipi
                </h3>
                <div className="space-y-2">
                    {subTypes.map((st) => {
                        const Icon = st.icon;
                        const isActive = subTypeId === st.id;
                        return (
                            <button 
                                key={st.id}
                                onClick={() => setSubTypeId(st.id)}
                                className={`w-full flex items-center space-x-3 p-4 rounded-2xl border transition-all text-left group ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none scale-[1.02]' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-200'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-white/20' : 'bg-white dark:bg-slate-700 shadow-inner'}`}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-tight italic">{st.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* CENTER: FORM */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
            {!subTypeId ? (
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-20 text-center space-y-6 italic">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Info className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Alt Tip Seçilməyib</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Davam etmək üçün sol tərəfdən əməliyyat növünü seçin</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                    
                    {/* ACCOUNT & TARGET */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Maliyyə Hesabı (Kassa/Bank)</label>
                            <select 
                                value={formData.accountId}
                                onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                                className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none shadow-inner text-sm font-black italic text-slate-800 dark:text-white outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all"
                            >
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">
                                {subTypeId === 'CUSTOMER_PAYMENT' ? 'Müştəri' : 
                                 subTypeId === 'SUPPLIER_PAYMENT' ? 'Təchizatçı' :
                                 subTypeId === 'SALARY_PAYMENT' ? 'İşçi' :
                                 subTypeId === 'TAX_PAYMENT' ? 'Vergi Növü' :
                                 subTypeId === 'FOUNDER_LOAN' ? 'Təsisçi' : 'Qarşı Tərəf / Təyinat'}
                            </label>
                            {subTypeId === 'CUSTOMER_PAYMENT' || subTypeId === 'SUPPLIER_PAYMENT' || subTypeId === 'FOUNDER_LOAN' ? (
                                <select 
                                    value={formData.targetId}
                                    onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none shadow-inner text-sm font-black italic text-slate-800 dark:text-white outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all"
                                >
                                    <option value="">Seçin...</option>
                                    {counterparties.map(cp => (
                                        <option key={cp.id} value={cp.id}>{cp.name}</option>
                                    ))}
                                </select>
                            ) : subTypeId === 'SALARY_PAYMENT' ? (
                                <select 
                                    value={formData.targetId}
                                    onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none shadow-inner text-sm font-black italic text-slate-800 dark:text-white outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all"
                                >
                                    <option value="">İşçini seçin...</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            ) : subTypeId === 'TAX_PAYMENT' ? (
                                <select 
                                    value={formData.taxType}
                                    onChange={(e) => setFormData({...formData, taxType: e.target.value})}
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none shadow-inner text-sm font-black italic text-slate-800 dark:text-white outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all"
                                >
                                    <option value="">Vergi növünü seçin...</option>
                                    <option value="VAT">ƏDV (V.A.T)</option>
                                    <option value="INCOME">Mənfəət Vergisi</option>
                                    <option value="WHT">Gəlir Vergisi (Maaşdan)</option>
                                    <option value="SOCIAL">DSMF / İcbari Sığorta</option>
                                </select>
                            ) : (
                                <input 
                                    type="text"
                                    value={formData.memo}
                                    onChange={(e) => setFormData({...formData, memo: e.target.value})}
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none shadow-inner text-sm font-black italic text-slate-800 dark:text-white outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all"
                                    placeholder="Təyinat qeyd edin..."
                                />
                            )}
                        </div>
                    </div>

                    {/* AMOUNT */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Məbləğ ({selectedAccount?.currency})</label>
                        <div className="relative group">
                            <input 
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                                className={`w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2.5rem] py-8 px-12 text-5xl font-black italic tabular-nums shadow-inner outline-none transition-all tracking-tighter ${mode === 'INBOUND' ? 'text-emerald-500' : 'text-rose-500'}`}
                            />
                            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                {selectedAccount?.currency}
                            </div>
                        </div>
                    </div>

                    {/* DATE & REF */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Əməliyyat Tarixi</label>
                            <div className="relative">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-black italic text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Referans / Qəbz №</label>
                            <div className="relative">
                                <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text"
                                    value={formData.refNo}
                                    onChange={(e) => setFormData({...formData, refNo: e.target.value})}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-black italic text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="Məs: 0045/BK"
                                />
                            </div>
                        </div>
                    </div>

                    {/* MEMO */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Açıqlama</label>
                        <textarea 
                            rows={3}
                            value={formData.memo}
                            onChange={(e) => setFormData({...formData, memo: e.target.value})}
                            className="w-full p-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] text-sm font-bold italic text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                            placeholder="Əməliyyat haqqında əlavə qeydlər..."
                        />
                    </div>
                </div>
            )}
        </div>

        {/* RIGHT: SUMMARY & INFO */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className={`rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group ${mode === 'INBOUND' ? 'bg-emerald-600' : 'bg-rose-600'} text-white`}>
                <div className="relative z-10 space-y-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">Əməliyyat Xülasəsi</h3>
                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-white/40 uppercase italic">Ümumi Məbləğ</p>
                        <div className="flex items-end space-x-2">
                            <h2 className="text-5xl font-black italic tracking-tighter leading-none tabular-nums">{formData.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            <span className="text-lg font-black italic text-white/40 mb-1">{formData.currency}</span>
                        </div>
                    </div>
                    
                    <div className="w-full h-[1px] bg-white/10"></div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase italic tracking-widest">
                            <span className="text-white/50">Hesab:</span>
                            <span className="font-black">{selectedAccount?.name || '---'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase italic tracking-widest">
                            <span className="text-white/50">Alt Tip:</span>
                            <span className="font-black">{activeSubType?.label || 'Seçilməyib'}</span>
                        </div>
                    </div>
                </div>
                {mode === 'INBOUND' ? <TrendingUp className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" /> : <TrendingDown className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 text-indigo-600">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Uçot Validasiyası</span>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ring-4 ${formData.amount > 0 ? 'bg-emerald-500 ring-emerald-500/10' : 'bg-slate-300 ring-slate-300/10'}`}></div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase italic leading-normal">Məbləğ daxil edilib</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ring-4 ${subTypeId ? 'bg-emerald-500 ring-emerald-500/10' : 'bg-slate-300 ring-slate-300/10'}`}></div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase italic leading-normal">Əməliyyat növü təyin edilib</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ring-4 ${formData.accountId ? 'bg-emerald-500 ring-emerald-500/10' : 'bg-slate-300 ring-slate-300/10'}`}></div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase italic leading-normal">Hesab seçimi düzgündür</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <JournalPreviewModal 
        isOpen={isJournalVisible} 
        onClose={() => setIsJournalVisible(false)} 
        periodClosed={false} 
        isAdmin={true}
        initialLines={[
            { id: '1', accountCode: selectedAccount?.code || '---', accountName: selectedAccount?.name || '---', description: formData.memo || 'Financial Transaction', debit: mode === 'INBOUND' ? formData.amount : 0, credit: mode === 'OUTBOUND' ? formData.amount : 0 },
            { id: '2', accountCode: '---', accountName: activeSubType?.label || 'Counterparty Account', description: formData.memo || 'Financial Transaction', debit: mode === 'OUTBOUND' ? formData.amount : 0, credit: mode === 'INBOUND' ? formData.amount : 0 },
        ]}
      />
    </div>
  );
};

export default FinancialTransactionCreate;
