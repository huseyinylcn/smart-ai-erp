import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Landmark, Calendar, 
  User, CreditCard, 
  ArrowRightLeft, History,
  Save, CheckCircle2,
  AlertCircle, Calculator,
  Printer, Download,
  ShieldCheck, Paperclip, 
  Link as LinkIcon, Lock, 
  MessageSquare, 
  ChevronDown, ChevronUp,
  FileText, Link2, Search, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

const BankPaymentCreate = () => {
  const navigate = useNavigate();
  
  // State for Tabs (11-14)
  const [activeTab, setActiveTab] = useState<'matching' | 'accounting' | 'files' | 'approvals' | 'history'>('matching');
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');

  // Basic Info (2)
  const [docNumber] = useState(`PAY-${new Date().getFullYear()}-0421`);
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Counterparty (3)
  const [counterparty, setCounterparty] = useState('Global Logistics MMC');
  
  // Finance (4)
  const [bankAccount, setBankAccount] = useState('Pasha Bank (AZN) - 1324...');
  const [currency] = useState('AZN');
  const [amount, setAmount] = useState<number>(1250.00);
  const [vatIncluded, setVatIncluded] = useState(false);

  // Reference (5)
  const [isRefExpanded, setIsRefExpanded] = useState(false);
  const [transId, setTransId] = useState('');
  const [externalRef, setExternalRef] = useState('');

  // Sidebar Sections Visibility (8, 9, 10)
  const [isTaxExpanded, setIsTaxExpanded] = useState(false);
  const [isSettlementExpanded, setIsSettlementExpanded] = useState(true);
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);

  // Totals Summary Logic (7)
  const vatAmount = useMemo(() => vatIncluded ? amount * 0.18 : 0, [amount, vatIncluded]);
  const grandTotal = useMemo(() => amount + vatAmount, [amount, vatAmount]);

  // Validation
  const isValid = useMemo(() => {
    return counterparty !== '' && amount > 0 && bankAccount !== '';
  }, [counterparty, amount, bankAccount]);

  const handleSave = (status: DocumentStatus) => {
    if (!isValid) return;
    setCurrentStatus(status);
    console.log('Finance Ledger Posting Triggered', { status });
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4">
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
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Ödəniş Tapşırığı (Bank)</h1>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  currentStatus === 'DRAFT' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                  currentStatus === 'POSTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {currentStatus}
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">PAY ID: {docNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
                onClick={() => navigate(`/finance/transaction/TRX-2026-902`)}
                className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600/10 text-emerald-600 border border-emerald-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm group"
            >
                <BookOpen className="w-4 h-4" />
                <span>Müxabirləşməyə bax</span>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-all">
                <Printer className="w-4 h-4" />
            </button>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-all">
                <Download className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button 
                onClick={() => handleSave('POSTED')}
                disabled={!isValid}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    isValid ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
            >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ödənişi Reallaşdır</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
            {/* 2, 3, 4. Finance & Counterparty */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <User className="w-3 h-3 mr-1.5" /> Benefisiar (Payee)
                    </label>
                    <input type="text" value={counterparty} onChange={(e) => setCounterparty(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <Landmark className="w-3 h-3 mr-1.5" /> Bank Hesabı
                    </label>
                    <select value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold">
                        <option value="Pasha Bank (AZN) - 1324...">Pasha Bank (AZN)</option>
                        <option value="ABB (USD) - 8842...">ABB (USD)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5" /> Tarix
                    </label>
                    <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center">
                        <Calculator className="w-3 h-3 mr-1.5" /> Məbləğ ({currency})
                    </label>
                    <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl py-2.5 px-4 text-xs font-black text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>

            {/* 5. References (Collapsible) */}
            <div className="border-t border-slate-50 dark:border-slate-800 pt-6">
                <button 
                    onClick={() => setIsRefExpanded(!isRefExpanded)}
                    className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                >
                    {isRefExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    <span>Bank Tranzaksiya və İstinad Məlumatları</span>
                </button>
                
                {isRefExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                <Search className="w-3 h-3 mr-1.5" /> Bank Ref ID
                            </label>
                            <input placeholder="SWIFT/Ref code..." value={transId} onChange={(e) => setTransId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                <FileText className="w-3 h-3 mr-1.5" /> External Doc №
                            </label>
                            <input placeholder="Invoice ref..." value={externalRef} onChange={(e) => setExternalRef(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold" />
                        </div>
                        <div className="flex items-center space-x-3 pt-6">
                            <input type="checkbox" checked={vatIncluded} onChange={(e) => setVatIncluded(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ƏDV-li Ödəniş</label>
                        </div>
                    </div>
                )}
            </div>

            {/* Purpose */}
            <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <MessageSquare className="w-3 h-3 mr-1.5" /> Ödənişin Təyinatı
                </label>
                <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 text-xs font-medium resize-none focus:ring-1 focus:ring-indigo-500" placeholder="Məs: 123 saylı qaimə üzrə borcun ödənilməsi..."></textarea>
            </div>
          </div>

          {/* 6. Matching Grid & TABS */}
          <div className="space-y-6">
            <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'matching', label: 'Bölüşdürmə', icon: Link2 },
                    { id: 'accounting', label: 'Müxabirləşmə', icon: Calculator },
                    { id: 'files', label: 'Əlavələr', icon: Paperclip },
                    { id: 'approvals', label: 'Təsdiqlər', icon: ShieldCheck },
                    { id: 'history', label: 'Tarixçə', icon: History },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[250px]">
                {activeTab === 'matching' && (
                    <div className="p-8 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-6">
                             <h4 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center">
                                 <Link2 className="w-4 h-4 mr-2 text-indigo-600" /> Açıq Qaimələr üzrə Matching
                             </h4>
                             <button className="text-[9px] font-black uppercase text-white bg-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">Auto Match</button>
                        </div>
                        <div className="overflow-hidden border border-slate-50 dark:border-slate-800 rounded-2xl">
                             <table className="w-full text-left text-xs font-bold">
                                 <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                     <tr>
                                         <th className="px-6 py-4">Sənəd No</th>
                                         <th className="px-6 py-4">Tarix</th>
                                         <th className="px-6 py-4 text-right">Ümumi Borc</th>
                                         <th className="px-6 py-4 text-right">Ödənilən</th>
                                         <th className="px-6 py-4 text-right">Qalıq</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                     <tr className="hover:bg-slate-50/50 transition-colors">
                                         <td className="px-6 py-4 text-indigo-600 underline">INV-2024-001</td>
                                         <td className="px-6 py-4 text-slate-500">12.03.2024</td>
                                         <td className="px-6 py-4 text-right text-slate-500 font-mono">1,200.00</td>
                                         <td className="px-6 py-4 text-right">
                                             <input type="number" defaultValue="500" className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-right font-black text-indigo-600 focus:ring-1 focus:ring-indigo-500" />
                                         </td>
                                         <td className="px-6 py-4 text-right text-emerald-600 font-mono">700.00</td>
                                     </tr>
                                 </tbody>
                             </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'accounting' && (
                    <div className="bg-slate-900 p-8 text-white h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Ledger Entry Preview (Debit/Credit)</h4>
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest">Compliance: IFRS</span>
                        </div>
                        <div className="space-y-3">
                             <div className="flex justify-between p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                 <div>
                                     <p className="text-[9px] text-indigo-400 font-black uppercase mb-1 underline">DEBET (+ Asset / - Liability)</p>
                                     <p className="font-bold text-sm">531 - Təchizatçılara borclar</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-xl font-black tabular-nums">{amount.toLocaleString()} {currency}</p>
                                 </div>
                             </div>
                             <div className="flex justify-between p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 border-l-4 border-l-rose-500/50">
                                 <div>
                                     <p className="text-[9px] text-rose-400 font-black uppercase mb-1 underline">KREDİT (- Cash / Asset)</p>
                                     <p className="font-bold text-sm">223 - Bank Hesablaşma Hesabları</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-xl font-black tabular-nums">{amount.toLocaleString()} {currency}</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (7, 8, 9, 10) */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            {/* 7. Totals Summary (Sticky Sidebar) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6 flex flex-col group transition-all hover:border-indigo-100">
                <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ümumi Ödəniş</p>
                    <h2 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums leading-tight">
                        {grandTotal.toLocaleString()}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currency}</p>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                   <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-slate-400 uppercase tracking-wide">Net</span>
                       <span className="text-slate-700 dark:text-slate-200">{amount.toLocaleString()} ₼</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold text-indigo-500">
                       <span className="uppercase tracking-wide">ƏDV (18%)</span>
                       <span className="tabular-nums">+{vatAmount.toLocaleString()} ₼</span>
                   </div>
                </div>

                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl text-[10px] text-slate-500 font-bold leading-relaxed border border-indigo-100/50 dark:border-indigo-900/30">
                   <ShieldCheck className="w-4 h-4 text-indigo-600 mb-2" />
                   Pasha Bank üzrə <strong>{bankAccount.split(' ')[2]}</strong> nömrəli hesabdan məxaric ediləcək.
                </div>
            </div>

            {/* 9. Settlement Method (Collapsible) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <button 
                    onClick={() => setIsSettlementExpanded(!isSettlementExpanded)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white"
                >
                   <span>Ödəniş Metodu</span>
                   {isSettlementExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isSettlementExpanded && (
                    <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top-1">
                        <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <CreditCard className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold">Bank Köçürməsi (MT103)</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 10. Internal Notes (Collapsible) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <button 
                    onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white"
                >
                   <span>Daxili Qeydlər</span>
                   {isNotesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isNotesExpanded && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-1">
                        <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-medium resize-none focus:ring-1 focus:ring-indigo-500" placeholder="Muhasibatlıq üçün qeyd..."></textarea>
                    </div>
                )}
            </div>

            {/* Audit Status */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase italic">
                    <Lock className="w-3 h-3" />
                    <span>Audit Status</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 italic">Maliyyə testi keçildi</span>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all">
         <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 text-slate-500 hover:text-slate-700 font-black text-xs uppercase tracking-widest transition-all"
            >
              Ləğv Et
            </button>
            <button 
              onClick={() => handleSave('DRAFT')}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-xs uppercase tracking-widest text-slate-700 dark:text-white transition-all shadow-sm"
            >
              Qaralamaya At
            </button>
            <button 
              onClick={() => handleSave('POSTED')}
              className="px-10 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
            >
              Ödənişi Göndər
            </button>
         </div>
      </div>
    </div>
  );
};

export default BankPaymentCreate;
