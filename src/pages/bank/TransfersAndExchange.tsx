import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, ArrowRightLeft, Landmark, Wallet, 
  CheckCircle2, History, Calculator, TrendingUp, TrendingDown,
  ShieldCheck, RefreshCw, Plus, Search, DollarSign, Calendar, Info
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import JournalPreviewModal from '../../components/JournalPreviewModal';

const TransfersAndExchange = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeCompany } = useCompany();
  
  // 1. STATE
  const [activeTab, setActiveTab] = useState<'TRANSFER' | 'EXCHANGE'>(
    (searchParams.get('mode') as any) || 'TRANSFER'
  );
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: 0,
    appliedRate: 1,
    officialRate: 1,
    date: new Date().toISOString().split('T')[0],
    memo: '',
    refNo: '',
    useTransit: false,
    transitAccountId: '571.01'
  });

  const [docNumber, setDocNumber] = useState('');

  // 2. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      if (!activeCompany) return;
      setLoading(true);
      try {
        const accRes = await financeApi.getAccounts(activeCompany.id);
        setAccounts(accRes.data);
        
        // Initial accounts if available
        if (accRes.data.length >= 2) {
          setFormData(prev => ({
            ...prev,
            fromAccountId: accRes.data[0].id,
            toAccountId: accRes.data[1].id
          }));
        }
      } catch (error: any) {
        console.error("Məlumatlar yüklənərkən xəta:", error);
        if (error.message.includes('Failed to fetch')) {
            const mockAccs = [
                { id: 'a1', name: 'Pasha Bank (USD)', code: '223.01', currency: 'USD', balance: 12500.50 },
                { id: 'a2', name: 'Kapital Bank (AZN)', code: '223.02', currency: 'AZN', balance: 45000.00 },
                { id: 'a3', name: 'Əsas Kassa (AZN)', code: '221.01', currency: 'AZN', balance: 5200.00 },
                { id: 'a4', name: 'Xarici Valyuta Kassası (EUR)', code: '221.02', currency: 'EUR', balance: 1200.00 },
            ];
            setAccounts(mockAccs);
            setFormData(prev => ({
                ...prev,
                fromAccountId: mockAccs[0].id,
                toAccountId: mockAccs[1].id
            }));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setDocNumber(`TRF-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`);
  }, [activeCompany?.id]);

  // 3. CALCULATIONS
  const fromAccount = useMemo(() => accounts.find(a => a.id === formData.fromAccountId), [accounts, formData.fromAccountId]);
  const toAccount = useMemo(() => accounts.find(a => a.id === formData.toAccountId), [accounts, formData.toAccountId]);

  const toAmount = useMemo(() => {
    if (activeTab === 'TRANSFER') return formData.amount;
    return formData.amount * formData.appliedRate;
  }, [formData.amount, formData.appliedRate, activeTab]);

  const fxDiff = useMemo(() => {
    if (activeTab === 'TRANSFER') return 0;
    return (formData.appliedRate - formData.officialRate) * formData.amount;
  }, [formData.amount, formData.appliedRate, formData.officialRate, activeTab]);

  const isLoss = fxDiff < 0;

  // 4. HANDLERS
  const handleSave = async () => {
    setCurrentStatus('POSTED');
  };

  const syncRate = async () => {
    if (!fromAccount || !toAccount) return;
    if (fromAccount.currency === 'USD' && toAccount.currency === 'AZN') {
      setFormData(prev => ({ ...prev, officialRate: 1.7000, appliedRate: 1.7000 }));
    } else if (fromAccount.currency === 'EUR' && toAccount.currency === 'AZN') {
      setFormData(prev => ({ ...prev, officialRate: 1.8245, appliedRate: 1.8245 }));
    } else {
       setFormData(prev => ({ ...prev, officialRate: 1, appliedRate: 1 }));
    }
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
                  {activeTab === 'TRANSFER' ? 'Daxili Transfer' : 'Valyuta Mübadiləsi'}
                </h1>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 italic">TREASURY OPS</span>
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
            <button onClick={handleSave} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Əməliyyatı Tamamla</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      {/* MODE TOGGLE */}
      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[1.5rem] w-fit">
          <button 
            onClick={() => setActiveTab('TRANSFER')}
            className={`flex items-center space-x-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TRANSFER' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
              <ArrowRightLeft className={`w-4 h-4 ${activeTab === 'TRANSFER' ? 'text-indigo-500' : 'opacity-40'}`} />
              <span>Daxili Transfer</span>
          </button>
          <button 
            onClick={() => setActiveTab('EXCHANGE')}
            className={`flex items-center space-x-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'EXCHANGE' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
              <RefreshCw className={`w-4 h-4 ${activeTab === 'EXCHANGE' ? 'text-emerald-500' : 'opacity-40'}`} />
              <span>Valyuta Mübadiləsi</span>
          </button>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* MAIN PANEL */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Accounts Mapping */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <Landmark className="w-4 h-4 mr-2 text-indigo-500" /> Hesabların Xəritələnməsi
                    </h3>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 relative">
                    <div className="flex-1 w-full space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Mənbə Hesab (Məxaric)</label>
                        <select 
                          value={formData.fromAccountId} 
                          onChange={(e) => setFormData({...formData, fromAccountId: e.target.value})}
                          className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none shadow-inner text-sm font-black italic text-slate-800 dark:text-white outline-none"
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                            ))}
                        </select>
                        {fromAccount && <p className="text-[8px] font-black text-rose-600 uppercase mt-1 italic tracking-widest">Balans: {fromAccount.currency} {fromAccount.balance?.toLocaleString()}</p>}
                    </div>

                    <div className="w-12 h-12 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30 z-10 -my-6 md:my-0">
                        <ArrowRightLeft className="w-5 h-5" />
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Təyinat Hesab (Mədaxil)</label>
                        <select 
                          value={formData.toAccountId} 
                          onChange={(e) => setFormData({...formData, toAccountId: e.target.value})}
                          className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none shadow-inner text-sm font-black italic text-slate-800 dark:text-white outline-none"
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                            ))}
                        </select>
                        {toAccount && <p className="text-[8px] font-black text-emerald-600 uppercase mt-1 italic tracking-widest">Balans: {toAccount.currency} {toAccount.balance?.toLocaleString()}</p>}
                    </div>
                </div>
            </div>

            {/* Amount & Rates */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Məbləğ ({fromAccount?.currency})</label>
                        <input 
                          type="number" 
                          value={formData.amount} 
                          onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-6 px-8 text-3xl font-black italic tabular-nums shadow-inner outline-none text-slate-800 dark:text-white tracking-tighter" 
                        />
                    </div>

                    {activeTab === 'EXCHANGE' && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tətbiq Olunan Məzənnə</label>
                          <div className="relative">
                              <input 
                                type="number" 
                                step="0.0001"
                                value={formData.appliedRate} 
                                onChange={(e) => setFormData({...formData, appliedRate: Number(e.target.value)})}
                                className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-indigo-100/50 dark:border-indigo-900/20 rounded-3xl py-6 px-10 text-3xl font-black italic tabular-nums shadow-inner outline-none text-indigo-600 dark:text-indigo-400 tracking-tighter" 
                              />
                              <button 
                                onClick={syncRate}
                                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-indigo-100 text-indigo-600 shadow-sm hover:scale-110 transition-transform"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tarix</label>
                        <input 
                          type="date" 
                          value={formData.date} 
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic outline-none"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Referans №</label>
                        <input 
                          type="text" 
                          value={formData.refNo} 
                          onChange={(e) => setFormData({...formData, refNo: e.target.value})}
                          placeholder="Məs: 001/TX"
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Açıqlama</label>
                    <textarea 
                      rows={2}
                      value={formData.memo} 
                      onChange={(e) => setFormData({...formData, memo: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-4 px-6 text-sm font-bold italic outline-none resize-none"
                      placeholder="Əməliyyatın təyinatını qeyd edin..."
                    />
                </div>

                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center justify-between p-6 bg-amber-50/30 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase italic tracking-tight">Tranzit Hesabdan İstifadə</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase italic tracking-tight mt-0.5">Vəsait yolda olan pul vəsaitləri (571) hesabına keçsin?</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {formData.useTransit && (
                                <select 
                                    value={formData.transitAccountId}
                                    onChange={(e) => setFormData({...formData, transitAccountId: e.target.value})}
                                    className="bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 rounded-xl py-2 px-4 text-[10px] font-black uppercase italic outline-none focus:ring-2 focus:ring-amber-500/20"
                                >
                                    <option value="571.01">571.01 - Yolda olan pul vəsaitləri</option>
                                    <option value="571.02">571.02 - Bankda yolda olan vəsaitlər</option>
                                </select>
                            )}
                            <button 
                                onClick={() => setFormData({...formData, useTransit: !formData.useTransit})}
                                className={`w-14 h-8 rounded-full transition-all relative ${formData.useTransit ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.useTransit ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* SIDEBAR SUMMARY */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 italic">Mədaxil Xülasəsi</h3>
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-500 uppercase italic">Ümumi Mədaxil (Net)</p>
                        <div className="flex items-end space-x-2">
                            <h2 className="text-5xl font-black italic tracking-tighter leading-none tabular-nums text-emerald-400">{toAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            <span className="text-lg font-black italic text-slate-500 mb-1">{toAccount?.currency}</span>
                        </div>
                    </div>
                    
                    {activeTab === 'EXCHANGE' && (
                      <>
                        <div className="w-full h-[1px] bg-white/5"></div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-slate-500 uppercase tracking-widest italic">Kurs Fərqi:</span>
                                <span className={`font-black italic px-3 py-1 rounded-lg border flex items-center ${isLoss ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                                    {isLoss ? <TrendingDown className="w-3.5 h-3.5 mr-1.5" /> : <TrendingUp className="w-3.5 h-3.5 mr-1.5" />}
                                    {Math.abs(fxDiff).toFixed(2)} AZN
                                </span>
                            </div>
                        </div>
                      </>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 text-indigo-600">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Sistem Validasiyası</span>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 ring-4 ring-emerald-500/10"></div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase italic leading-normal">Mənbə hesabında kifayət qədər vəsait var</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 ring-4 ring-emerald-500/10"></div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase italic leading-normal">Hesabların valyuta uyğunluğu yoxlanıldı</p>
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
        initialLines={formData.useTransit ? [
            { id: '1', accountCode: formData.transitAccountId, accountName: 'Yolda olan pul vəsaitləri', description: 'Transit Transfer Step 1', debit: formData.amount, credit: 0 },
            { id: '2', accountCode: fromAccount?.code || '---', accountName: fromAccount?.name || '---', description: 'Transit Transfer Step 1', debit: 0, credit: formData.amount },
            { id: '3', accountCode: toAccount?.code || '---', accountName: toAccount?.name || '---', description: 'Transit Transfer Step 2', debit: toAmount, credit: 0 },
            { id: '4', accountCode: formData.transitAccountId, accountName: 'Yolda olan pul vəsaitləri', description: 'Transit Transfer Step 2', debit: 0, credit: toAmount },
        ] : [
            { id: '1', accountCode: toAccount?.code || '---', accountName: toAccount?.name || '---', description: 'Internal Transfer', debit: toAmount, credit: 0 },
            { id: '2', accountCode: fromAccount?.code || '---', accountName: fromAccount?.name || '---', description: 'Internal Transfer', debit: 0, credit: formData.amount },
        ]}
      />
    </div>
  );
};

export default TransfersAndExchange;
