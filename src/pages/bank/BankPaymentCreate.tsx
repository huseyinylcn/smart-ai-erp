import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Landmark, Calendar, 
  User, CreditCard, 
  History,
  CheckCircle2,
  Calculator,
  Printer, Download,
  ShieldCheck, Paperclip, 
  Lock, 
  MessageSquare, 
  ChevronDown, ChevronUp,
  FileText, Link2, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import JournalPreviewModal from '../../components/JournalPreviewModal';

const BankPaymentCreate = () => {
  const navigate = useNavigate();
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  
  // State for Tabs
  const [activeTab, setActiveTab] = useState<'matching' | 'accounting' | 'files' | 'approvals' | 'history'>('matching');
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');

  // Basic Info
  const [docNumber] = useState(`PAY-${new Date().getFullYear()}-0421`);
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Counterparty
  const [counterparty, setCounterparty] = useState('Global Logistics MMC');
  
  // Finance
  const [bankAccount, setBankAccount] = useState('Pasha Bank (AZN) - 1324...');
  const [currency] = useState('AZN');
  const [amount, setAmount] = useState<number>(1250.00);
  const [vatIncluded, setVatIncluded] = useState(false);

  // Sidebar Sections Visibility
  const [isSettlementExpanded, setIsSettlementExpanded] = useState(true);
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);
  const [isRefExpanded, setIsRefExpanded] = useState(false);
  const [transId, setTransId] = useState('');
  const [externalRef, setExternalRef] = useState('');

  // Budget Payment specific state
  const [isBudgetPayment, setIsBudgetPayment] = useState(false);
  const [taxOffice, setTaxOffice] = useState('');
  const [budgetCode, setBudgetCode] = useState('');
  const [paymentClassification, setPaymentClassification] = useState('');

  // Totals Summary Logic
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
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER (Sticky) */}
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
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner">Ödəniş Tapşırığı (Bank)</h1>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-inner ${
                  currentStatus === 'DRAFT' ? 'bg-slate-100 text-slate-500 border-slate-200 shadow-inner' :
                  currentStatus === 'POSTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-inner' :
                  'bg-blue-50 text-blue-600 border-blue-100 shadow-inner'
                }`}>
                  {currentStatus}
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 italic tabular-nums shadow-inner opacity-70">PAY ID: {docNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
                <Printer className="w-4 h-4 shadow-inner shadow-inner" />
            </button>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
                <Download className="w-4 h-4 shadow-inner shadow-inner" />
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1 shadow-inner"></div>
            <button 
              onClick={() => setIsJournalVisible(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
            >
                <Calculator className="w-4 h-4 shadow-inner" />
                <span>Müxabirləşmə</span>
            </button>
            <button 
                onClick={() => handleSave('POSTED')}
                disabled={!isValid}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-inner ${
                    isValid ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-inner'
                }`}
            >
                <CheckCircle2 className="w-4 h-4 shadow-inner shadow-inner shadow-inner" />
                <span>Ödənişi Reallaşdır</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start italic-none">
        <div className="col-span-12 lg:col-span-9 space-y-8 italic-none shadow-inner">
          
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                <div className="space-y-2 italic-none shadow-inner">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic shadow-inner whitespace-nowrap">
                        <User className="w-3 h-3 mr-1.5" /> Benefisiar (Payee)
                    </label>
                    <input type="text" value={counterparty} onChange={(e) => setCounterparty(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner" />
                </div>
                <div className="space-y-2 italic-none shadow-inner">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic shadow-inner whitespace-nowrap">
                        <Landmark className="w-3 h-3 mr-1.5" /> Bank Hesabı
                    </label>
                    <select value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner">
                        <option value="Pasha Bank (AZN) - 1324...">Pasha Bank (AZN)</option>
                        <option value="ABB (USD) - 8842...">ABB (USD)</option>
                    </select>
                </div>
                <div className="space-y-2 italic-none shadow-inner">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic shadow-inner whitespace-nowrap">
                        <Calendar className="w-3 h-3 mr-1.5 shadow-inner shadow-inner shadow-inner" /> Tarix
                    </label>
                    <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold shadow-inner" />
                </div>
                <div className="space-y-2 italic-none shadow-inner">
                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center italic shadow-inner whitespace-nowrap">
                        <Calculator className="w-3 h-3 mr-1.5 shadow-inner" /> Məbləğ ({currency})
                    </label>
                    <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl py-2.5 px-4 text-xs font-black text-indigo-600 dark:text-indigo-400 shadow-inner" />
                </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-rose-50/50 dark:bg-slate-800 rounded-2xl border border-rose-100/50">
                <input 
                  type="checkbox" 
                  id="budgetToggle"
                  checked={isBudgetPayment} 
                  onChange={(e) => setIsBudgetPayment(e.target.checked)}
                  className="w-5 h-5 rounded-lg text-rose-600 focus:ring-rose-500" 
                />
                <label htmlFor="budgetToggle" className="flex flex-col cursor-pointer">
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center italic italic tracking-tighter">
                        <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Büdcə Ödənişi (Vergi, Sosial, İTS)
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase italic">Rəsmi dövlət rüsumları və vergi ödənişləri üçün aktivləşdirin</span>
                </label>
            </div>

            {isBudgetPayment && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-rose-200 animate-in zoom-in-95 duration-300">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase italic">Vergi Orqanı / Region</label>
                        <select value={taxOffice} onChange={(e) => setTaxOffice(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-2 px-3 text-xs font-bold outline-none ring-1 ring-slate-100">
                            <option value="">Seçin...</option>
                            <option value="99">99 - Bakı ş. Lokal Gəlirlər Departamenti</option>
                            <option value="02">02 - Gəncə ş. Ərazi Vergilər İdarəsi</option>
                            <option value="18">18 - Sumqayıt ş. Ərazi Vergilər İdarəsi</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase italic">Ödəniş Təsnifatı</label>
                        <select value={paymentClassification} onChange={(e) => setPaymentClassification(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-2 px-3 text-xs font-bold outline-none ring-1 ring-slate-100">
                            <option value="">Seçin...</option>
                            <option value="tax_profit">Mənfəət Vergisi</option>
                            <option value="tax_vat">ƏDV Ödənişi</option>
                            <option value="dsmf">Sosial Sığorta (DSMF)</option>
                            <option value="its">İcbari Tibbi Sığorta (İTS)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase italic">Büdcə Kodu</label>
                        <input value={budgetCode} onChange={(e) => setBudgetCode(e.target.value)} placeholder="Məs: 111100" className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-2 px-3 text-xs font-bold outline-none ring-1 ring-slate-100" />
                    </div>
                </div>
            )}

            <div className="border-t border-slate-50 dark:border-slate-800 pt-6 italic-none shadow-inner">
                <button 
                    onClick={() => setIsRefExpanded(!isRefExpanded)}
                    className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors italic shadow-inner shadow-inner shadow-inner"
                >
                    {isRefExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    <span>Bank Tranzaksiya və İstinad Məlumatları</span>
                </button>
                
                {isRefExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-in slide-in-from-top-2 duration-300 italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
                        <div className="space-y-2 italic-none shadow-inner">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic shadow-inner whitespace-nowrap italic tracking-tighter shadow-inner">
                                <Search className="w-3 h-3 mr-1.5" /> Bank Ref ID
                            </label>
                            <input placeholder="SWIFT/Ref code..." value={transId} onChange={(e) => setTransId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold shadow-inner" />
                        </div>
                        <div className="space-y-2 italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic shadow-inner whitespace-nowrap italic tracking-tighter shadow-inner">
                                <FileText className="w-3 h-3 mr-1.5 shadow-inner" /> External Doc №
                            </label>
                            <input placeholder="Invoice ref..." value={externalRef} onChange={(e) => setExternalRef(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold shadow-inner shadow-inner" />
                        </div>
                        <div className="flex items-center space-x-3 pt-6 italic-none shadow-inner shadow-inner">
                            <input type="checkbox" checked={vatIncluded} onChange={(e) => setVatIncluded(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 shadow-inner" />
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic shadow-inner whitespace-nowrap italic tracking-tighter shadow-inner">ƏDV-li Ödəniş</label>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800 italic-none shadow-inner shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic shadow-inner whitespace-nowrap">
                    <MessageSquare className="w-3 h-3 mr-1.5 shadow-inner" /> Ödənişin Təyinatı
                </label>
                <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 text-xs font-medium resize-none focus:ring-1 focus:ring-indigo-500 shadow-inner" placeholder="Məs: 123 saylı qaimə üzrə borcun ödənilməsi..."></textarea>
            </div>
          </div>

          <div className="space-y-6 italic-none shadow-inner shadow-inner">
            <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
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
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-inner ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm shadow-inner' : 'text-slate-500 hover:text-slate-700 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner'}`}
                    >
                        <tab.icon className="w-3.5 h-3.5 shadow-inner shadow-inner shadow-inner" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[250px] italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted">
                {activeTab === 'matching' && (
                    <div className="p-8 animate-in fade-in duration-300 italic-none shadow-inner shadow-inner shadow-inner">
                        <div className="flex items-center justify-between mb-6 italic-none shadow-inner">
                             <h4 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center italic shadow-inner">
                                 <Link2 className="w-4 h-4 mr-2 text-indigo-600 shadow-inner shadow-inner shadow-inner" /> Açıq Qaimələr üzrə Matching
                             </h4>
                             <button className="text-[9px] font-black uppercase text-white bg-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 italic-none shadow-inner">Auto Match</button>
                        </div>
                        <div className="overflow-hidden border border-slate-50 dark:border-slate-800 rounded-2xl italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner">
                             <table className="w-full text-left text-xs font-bold italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                                 <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 italic shadow-inner whitespace-nowrap italic tracking-tighter">
                                     <tr className="shadow-inner shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted">
                                         <th className="px-6 py-4 shadow-inner">Sənəd No</th>
                                         <th className="px-6 py-4 shadow-inner text-center shadow-inner shadow-inner shadow-inner">Tarix</th>
                                         <th className="px-6 py-4 text-right shadow-inner tabular-nums shadow-inner shadow-inner">Ümumi Borc</th>
                                         <th className="px-6 py-4 text-right shadow-inner tabular-nums">Ödənilən</th>
                                         <th className="px-6 py-4 text-right shadow-inner tabular-nums">Qalıq</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none shadow-inner">
                                     <tr className="hover:bg-slate-50/50 transition-colors italic-none shadow-inner">
                                         <td className="px-6 py-4 text-indigo-600 underline shadow-inner tabular-nums font-black italic shadow-inner shadow-inner">INV-2024-001</td>
                                         <td className="px-6 py-4 text-slate-500 shadow-inner tabular-nums">12.03.2024</td>
                                         <td className="px-6 py-4 text-right text-slate-500 font-mono shadow-inner tabular-nums italic shadow-inner">1,200.00</td>
                                         <td className="px-6 py-4 text-right shadow-inner tabular-nums font-black italic shadow-inner">
                                             <input type="number" defaultValue="500" className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-right font-black text-indigo-600 focus:ring-1 focus:ring-indigo-500 shadow-inner" />
                                         </td>
                                         <td className="px-6 py-4 text-right text-emerald-600 font-mono shadow-inner tabular-nums italic shadow-inner">700.00</td>
                                     </tr>
                                 </tbody>
                             </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'accounting' && (
                    <div className="bg-slate-900 p-8 text-white h-full italic-none shadow-inner">
                        <div className="flex justify-between items-center mb-6 italic-none shadow-inner shadow-inner">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic shadow-inner">Ledger Entry Preview (Debit/Credit)</h4>
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest italic shadow-inner whitespace-nowrap italic tracking-tighter shadow-inner">Compliance: IFRS</span>
                        </div>
                        <div className="space-y-3 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                             <div className="flex justify-between p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 italic-none shadow-inner">
                                 <div className="shadow-inner italic-none shadow-inner">
                                     <p className="text-[9px] text-indigo-400 font-black uppercase mb-1 underline italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">DEBET (+ Asset / - Liability)</p>
                                     <p className="font-bold text-sm shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">531 - Təchizatçılara borclar</p>
                                 </div>
                                 <div className="text-right shadow-inner italic-none shadow-inner">
                                     <p className="text-xl font-black tabular-nums shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">{amount.toLocaleString()} {currency}</p>
                                 </div>
                             </div>
                             <div className="flex justify-between p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 border-l-4 border-l-rose-500/50 italic-none shadow-inner">
                                 <div className="shadow-inner italic-none shadow-inner">
                                     <p className="text-[9px] text-rose-400 font-black uppercase mb-1 underline italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">KREDİT (- Cash / Asset)</p>
                                     <p className="font-bold text-sm shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">223 - Bank Hesablaşma Hesabları</p>
                                 </div>
                                 <div className="text-right shadow-inner italic-none shadow-inner">
                                     <p className="text-xl font-black tabular-nums shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">{amount.toLocaleString()} {currency}</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28 italic-none shadow-inner">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6 flex flex-col group transition-all hover:border-indigo-100 shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted">
                <div className="text-center space-y-1 italic-none shadow-inner shadow-inner">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic shadow-inner">Ümumi Ödəniş</p>
                    <h2 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums leading-tight italic shadow-inner whitespace-nowrap italic tracking-tighter">
                        {grandTotal.toLocaleString()}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic shadow-inner">{currency}</p>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                   <div className="flex justify-between items-center text-xs font-bold italic-none shadow-inner shadow-inner shadow-inner">
                       <span className="text-slate-400 uppercase tracking-wide italic shadow-inner shadow-inner shadow-inner shadow-inner">Net</span>
                       <span className="text-slate-700 dark:text-slate-200 shadow-inner tabular-nums">{amount.toLocaleString()} ₼</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold text-indigo-500 italic-none shadow-inner shadow-inner shadow-inner">
                       <span className="uppercase tracking-wide italic shadow-inner shadow-inner shadow-inner shadow-inner">ƏDV (18%)</span>
                       <span className="tabular-nums shadow-inner shadow-inner shadow-inner">+{vatAmount.toLocaleString()} ₼</span>
                   </div>
                </div>

                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl text-[10px] text-slate-500 font-bold leading-relaxed border border-indigo-100/50 dark:border-indigo-900/30 shadow-inner italic-none shadow-inner">
                   <ShieldCheck className="w-4 h-4 text-indigo-600 mb-2 shadow-inner" />
                   Pasha Bank üzrə <strong>{bankAccount.split(' ')[2]}</strong> nömrəli hesabdan məxaric ediləcək.
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted">
                <button 
                    onClick={() => setIsSettlementExpanded(!isSettlementExpanded)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white italic shadow-inner shadow-inner shadow-inner"
                >
                   <span>Ödəniş Metodu</span>
                   {isSettlementExpanded ? <ChevronUp className="w-3.5 h-3.5 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" /> : <ChevronDown className="w-3.5 h-3.5 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />}
                </button>
                {isSettlementExpanded && (
                    <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top-1 italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
                        <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                            <CreditCard className="w-4 h-4 text-indigo-500 shadow-inner" />
                            <span className="text-xs font-bold shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Bank Köçürməsi (MT103)</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner">
                <button 
                    onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"
                >
                   <span>Daxili Qeydlər</span>
                   {isNotesExpanded ? <ChevronUp className="w-3.5 h-3.5 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" /> : <ChevronDown className="w-3.5 h-3.5 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />}
                </button>
                {isNotesExpanded && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-1 italic-none shadow-inner shadow-inner">
                        <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-medium resize-none focus:ring-1 focus:ring-indigo-500 shadow-inner shadow-inner" placeholder="Muhasibatlıq üçün qeyd..."></textarea>
                    </div>
                )}
            </div>

            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4 shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase italic shadow-inner whitespace-nowrap italic tracking-tighter shadow-inner">
                    <Lock className="w-3 h-3 shadow-inner shadow-inner shadow-inner shadow-inner" />
                    <span>Audit Status</span>
                </div>
                <div className="flex items-center space-x-3 italic-none shadow-inner shadow-inner shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-inner shadow-inner"></div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 italic shadow-inner shadow-inner shadow-inner">Maliyyə testi keçildi</span>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all italic-none shadow-inner shadow-inner">
         <div className="flex items-center space-x-3 italic-none shadow-inner shadow-inner">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 text-slate-500 hover:text-slate-700 font-black text-xs uppercase tracking-widest transition-all italic shadow-inner"
            >
              Ləğv Et
            </button>
            <button 
              onClick={() => handleSave('DRAFT')}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-xs uppercase tracking-widest text-slate-700 dark:text-white transition-all shadow-sm shadow-inner italic shadow-inner"
            >
              Qaralamaya At
            </button>
            <button 
              onClick={() => handleSave('POSTED')}
              className="px-10 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic shadow-inner whitespace-nowrap italic tracking-tighter"
            >
              Ödənişi Göndər
            </button>
         </div>
      </div>
      
      <JournalPreviewModal 
        isOpen={isJournalVisible} 
        onClose={() => setIsJournalVisible(false)} 
        periodClosed={false} // Mock
        isAdmin={true}       // Mock
        initialLines={[
            { id: '1', accountCode: '531', accountName: 'Təchizatçılara borclar', description: 'Ödəniş tapşırığı üzrə', debit: amount, credit: 0 },
            { id: '2', accountCode: '223', accountName: 'Bank Hesablaşma Hesabları', description: 'Ödəniş tapşırığı üzrə', debit: 0, credit: amount }
        ]}
      />
    </div>
  );
};

export default BankPaymentCreate;
