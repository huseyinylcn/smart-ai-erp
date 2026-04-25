import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, CheckCircle2, History, AlertTriangle, 
  Warehouse, Barcode, Save, Info, Factory, Layers, Zap, Boxes, 
  Landmark, Wallet, ArrowUpRight, ArrowDownRight, RefreshCw,
  DollarSign, FileText, Calendar, User, Link, ShieldCheck, 
  ChevronRight, TrendingUp, CreditCard
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

type TransactionType = 'RECEIPT' | 'PAYMENT' | 'TRANSFER';

const BankTransactionCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 1. STATE
  const [txType, setTxType] = useState<TransactionType>((searchParams.get('type') as TransactionType) || 'PAYMENT');
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  
  const [formData, setFormData] = useState({
    accountId: '1',
    toAccountId: '2',
    counterparty: '',
    amount: 0,
    vatType: 'Cəlb edilməyən', // ƏDV-li, 0%, Cəlb edilməyən (As per User request)
    category: '',
    refNo: '',
    linkedDoc: '',
    memo: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [docNumber] = useState(`BANK-TX-${new Date().getFullYear()}-0451`);

  // 2. MOCK DATA
  const accounts = [
    { id: '1', name: 'ABB - Əsas Cari Hesab', balance: 14520.50, currency: 'AZN' },
    { id: '2', name: 'Mərkəzi Kassa', balance: 2450.00, currency: 'AZN' },
    { id: '3', name: 'Paşa Bank (USD)', balance: 8500.00, currency: 'USD' },
  ];

  const currentAccount = accounts.find(a => a.id === formData.accountId);
  
  // 3. LOGIC
  const forecastBalance = useMemo(() => {
    if (!currentAccount) return 0;
    if (txType === 'RECEIPT') return currentAccount.balance + Number(formData.amount);
    return currentAccount.balance - Number(formData.amount);
  }, [currentAccount, txType, formData.amount]);

  const isEditable = currentStatus === 'DRAFT';

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-indigo-100 dark:border-indigo-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <Landmark className="w-6 h-6 mr-2 text-indigo-500" /> Bank Əməliyyatı
                    </h1>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">BANK TRANSACTION</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic uppercase"><History className="w-3.5 h-3.5 mr-1 text-indigo-500" /> {formData.date}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><History className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            {isEditable ? (
                <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Əməliyyatı Təsdiqlə</span>
                </button>
            ) : (
                <div className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Əməliyyat İcra Olunub</span>
                </div>
            )}
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      {/* 2. TRANSACTION TYPE TOGGLE */}
      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[1.5rem] w-fit mx-auto lg:mx-0">
          {[
              { id: 'RECEIPT', label: 'Daxilolma', icon: ArrowDownRight, color: 'text-emerald-500' },
              { id: 'PAYMENT', label: 'Məxaric', icon: ArrowUpRight, color: 'text-rose-500' },
              { id: 'TRANSFER', label: 'Transfer', icon: RefreshCw, color: 'text-indigo-500' },
          ].map((type) => (
              <button 
                key={type.id}
                onClick={() => setTxType(type.id as TransactionType)}
                className={`flex items-center space-x-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${txType === type.id ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <type.icon className={`w-4 h-4 ${txType === type.id ? type.color : 'opacity-40'}`} />
                  <span>{type.label}</span>
              </button>
          ))}
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MAIN FORM */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-10 relative overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    
                    {/* A. GENERAL INFO */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Landmark className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {txType === 'TRANSFER' ? 'Göndərən Hesab' : 'Hesab / Kassa'}
                        </label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner italic uppercase leading-none">
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                            ))}
                        </select>
                    </div>

                    {txType === 'TRANSFER' ? (
                        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center italic pulse">
                                <Landmark className="w-3.5 h-3.5 mr-2" /> Qəbul Edən Hesab
                            </label>
                            <select className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner italic uppercase leading-none">
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                <User className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Qarşı Tərəf
                            </label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input placeholder="Ad, VÖEN və ya Kod..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner italic uppercase leading-none" />
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Əməliyyat Tarixi
                        </label>
                        <input type="date" value={formData.date} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner italic uppercase leading-none" />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <FileText className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Reference №
                        </label>
                        <input placeholder="Göy: 001/P" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner italic uppercase leading-none" />
                    </div>

                    {/* B. FINANCIAL DETAILS */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <DollarSign className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Məbləğ
                        </label>
                        <div className="relative group">
                            <input 
                                type="number" 
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-6 text-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic tabular-nums leading-none" 
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 uppercase italic">AZN</span>
                        </div>
                    </div>

                    {txType !== 'TRANSFER' && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                <ShieldCheck className="w-3.5 h-3.5 mr-2 text-indigo-500" /> ƏDV statusu
                            </label>
                            <select 
                                value={formData.vatType}
                                onChange={(e) => setFormData({...formData, vatType: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner italic uppercase leading-none"
                            >
                                <option>ƏDV-li</option>
                                <option>ƏDV-dən azad (0%)</option>
                                <option>Cəlb edilməyən</option>
                            </select>
                        </div>
                    )}

                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Link className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Bağlı Sənəd (Invoice / Order)
                        </label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input placeholder="Sənəd nömrəsi ilə axtar..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner italic uppercase leading-none" />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            Açıqlama / Təyinat
                        </label>
                        <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner italic resize-none" placeholder="Əməliyyatın məqsədini qeyd edin..."></textarea>
                    </div>
                </div>
                
                <Landmark className="absolute top-[-40px] right-[-40px] w-64 h-64 text-indigo-500/5 rotate-12 pointer-events-none" />
            </div>
        </div>

        {/* RIGHT SIDEBAR: ANALYTICS & PREVIEW */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8 overflow-hidden relative group">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Balans Analizi</h3>
                
                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-1">
                             <span className="text-[9px] font-black text-slate-400 uppercase italic">Cari Balans</span>
                             <Wallet className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                        <div className="text-xl font-black text-slate-800 dark:text-white tabular-nums italic tracking-tighter">
                            {currentAccount?.balance.toLocaleString()} AZN
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-2">
                        <ChevronRight className="w-6 h-6 text-slate-200 rotate-90" />
                    </div>

                    <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${txType === 'PAYMENT' && forecastBalance < 0 ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30 ring-4 ring-rose-500/20' : 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30'}`}>
                        <div className="flex justify-between items-center mb-1">
                             <span className="text-[9px] font-black text-slate-400 uppercase italic">Gözlənilən Balans</span>
                             <TrendingUp className={`w-4 h-4 ${txType === 'RECEIPT' ? 'text-emerald-500 animate-bounce' : 'text-indigo-500'}`} />
                        </div>
                        <div className={`text-2xl font-black tabular-nums italic tracking-tighter ${txType === 'PAYMENT' && forecastBalance < 0 ? 'text-rose-600' : 'text-indigo-600 dark:text-indigo-400'}`}>
                            {forecastBalance.toLocaleString()} AZN
                        </div>
                        {txType === 'PAYMENT' && forecastBalance < 0 && (
                            <div className="mt-4 flex items-center space-x-2 text-rose-500">
                                <AlertTriangle className="w-4 h-4 animate-pulse" />
                                <span className="text-[9px] font-black uppercase italic tracking-tighter leading-none">Balans kifayət deyil</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl space-x-3">
                        <Info className="w-4 h-4" />
                        <p className="text-[9px] font-bold leading-relaxed italic uppercase">
                             Təsdiq edildikdən sonra məlumat dərhal baş dəftərə (General Ledger) işlənəcək.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-amber-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter decoration-1 underline-offset-4 underline italic italic">Bank Limitləri</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                            <span className="text-[9px] font-black text-slate-400 uppercase italic">Gündəlik limit</span>
                            <span className="text-xs font-black italic tracking-tighter">50,000 AZN</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                    </div>
                </div>
                <RefreshCw className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/5 rotate-12 group-hover:text-indigo-500/10 transition-colors duration-700" />
            </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-4 px-4 items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest mr-8 group flex items-center">
                Məsul şəxs: <span className="text-indigo-600 font-black italic ml-2">İnzibatçı</span>
              </span>
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-800 transition-all border border-transparent hover:border-slate-200 rounded-xl leading-none">Bağla</button>
              
              <button disabled={!isEditable} className="px-8 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-inner leading-none hover:bg-slate-200 transition-all">
                Draft Saxla
              </button>

              {isEditable && (
                  <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Təsdiqlə və İcra et</span>
                  </button>
              )}
          </div>
      </div>
    </div>
  );
};

export default BankTransactionCreate;
