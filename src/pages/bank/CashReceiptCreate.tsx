import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Wallet, Calendar, 
  User, CreditCard, 
  Printer, Download,
  ShieldCheck, 
  MessageSquare, 
  ChevronDown,
  FileText, Link2, Search,
  Plus, X, Trash2,
  AlertTriangle,
  Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { azSpellOut } from '../../utils/azSpellOut';
import JournalPreviewModal from '../../components/JournalPreviewModal';

const CashReceiptCreate = () => {
  const navigate = useNavigate();
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  
  // Document State
  const [docNumber, setDocNumber] = useState('CR-' + Math.floor(Math.random() * 9000 + 1000));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [payer, setPayer] = useState('');
  const [basis, setBasis] = useState(''); // Mədaxil əsası
  const [amount, setAmount] = useState('0.00');
  const [vatAmount, setVatAmount] = useState('0.00');
  const [attachment, setAttachment] = useState('');
  const [notes, setNotes] = useState('');
  
  // Simulation of Company Settings
  const companySettings = {
    name: "SMARTAGENT ERP SOLUTIONS MMC",
    voen: "1234567890",
    cashLimit: 50000, // 50,000 AZN
    currentCashBalance: 12450.00
  };

  const [spellOut, setSpellOut] = useState('');

  useEffect(() => {
    setSpellOut(azSpellOut(amount));
  }, [amount]);

  const handleSave = () => {
    // Logic for saving to ledger
    console.log("Saving Cash Receipt KO-1", { docNumber, payer, amount });
    alert("Kassa Mədaxil Orderi uğurla saxlanıldı!");
    navigate('/bank/cash');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-100 dark:border-slate-800 italic-none shadow-inner">
        <div className="flex items-center space-x-6 italic-none shadow-inner">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-primary-600 shadow-sm italic-none shadow-inner"
          >
            <ArrowLeft className="w-5 h-5 shadow-inner shadow-inner shadow-inner shadow-inner" />
          </button>
          <div className="shadow-inner italic-none shadow-inner">
            <div className="flex items-center space-x-3 mb-2 shadow-inner">
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap">Cash Management</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap italic tracking-tighter shadow-inner">KO-1 Standard</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner whitespace-nowrap italic tracking-tighter italic">Yeni Kassa Mədaxil Orderi</h1>
          </div>
        </div>

          <button 
            onClick={() => setIsJournalVisible(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm italic-none shadow-inner"
          >
            <Calculator className="w-4 h-4 shadow-inner shadow-inner shadow-inner" />
            <span>Müxabirləşmə</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm italic-none shadow-inner"
          >
            <Printer className="w-4 h-4 shadow-inner shadow-inner shadow-inner" />
            <span>Çap Et (KO-1)</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 active:scale-95 italic-none shadow-inner"
          >
            <span>Təsdiqlə</span>
          </button>
      </div>

      {/* DOCUMENT BODY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
        
        {/* LEFT: MAIN FORM */}
        <div className="xl:col-span-2 space-y-10 italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner shadow-inner">
          
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 shadow-sm italic-none shadow-inner shadow-inner shadow-inner">
            <div className="grid grid-cols-2 gap-10 mb-12 italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
              <div className="space-y-4 shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner">Order Nömrəsi</label>
                <div className="relative italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
                  <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 shadow-inner shadow-inner shadow-inner" />
                  <input 
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black italic tracking-tighter shadow-inner outline-none focus:ring-2 ring-primary-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-4 shadow-inner shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner">Tarix</label>
                <div className="relative italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black italic tracking-tighter shadow-inner outline-none focus:ring-2 ring-primary-500/20 transition-all shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10 shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner">Kimdən qəbul edilib (Ad, Soyad / Şirkət)</label>
                <div className="relative italic-none shadow-inner">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                  <input 
                    type="text"
                    placeholder="Məsələn: Əli Məmmədov"
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black italic tracking-tighter shadow-inner outline-none focus:ring-2 ring-primary-500/20 transition-all shadow-inner shadow-inner shadow-inner"
                  />
                </div>
            </div>

            <div className="space-y-4 mb-10 shadow-inner shadow-inner shadow-inner shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Mədaxil Əsası (Təyinat)</label>
                <div className="relative italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner">
                  <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                  <input 
                    type="text"
                    placeholder="Məsələn: Satışdan gələn gəlir"
                    value={basis}
                    onChange={(e) => setBasis(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black italic tracking-tighter shadow-inner outline-none focus:ring-2 ring-primary-500/20 transition-all shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"
                  />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10 italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
               <div className="space-y-4 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Məbləğ (AZN)</label>
                  <div className="relative italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">₼</div>
                    <input 
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none rounded-[1.5rem] py-6 pl-12 pr-6 text-2xl font-black italic shadow-inner outline-none focus:ring-4 ring-emerald-500/20 transition-all shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"
                    />
                  </div>
              </div>
              <div className="space-y-4 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">ƏDV Məbləği</label>
                  <div className="relative italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <input 
                      type="number"
                      step="0.01"
                      value={vatAmount}
                      onChange={(e) => setVatAmount(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] py-6 px-8 text-xl font-black italic tracking-tighter shadow-inner outline-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"
                    />
                  </div>
              </div>
            </div>

            <div className="mt-10 p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-800/50 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic mb-2 shadow-inner shadow-inner shadow-inner">Məbləğ Yazı İlə:</p>
              <p className="text-md font-black text-emerald-700 dark:text-emerald-400 italic tabular-nums tracking-tight shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner underline decoration-emerald-500/10 underline-offset-4 decoration-solid shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                {spellOut}
              </p>
            </div>
          </div>

          {/* ATTACHMENTS & NOTES SECTION */}
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-[3rem] p-12 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
            <div className="grid grid-cols-2 gap-10 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
               <div className="space-y-4 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Qoşma (Əmr / Müqavilə №)</label>
                  <input 
                    type="text"
                    value={attachment}
                    onChange={(e) => setAttachment(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-5 px-6 text-sm font-black italic shadow-sm outline-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"
                  />
               </div>
               <div className="space-y-4 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Qeydlər</label>
                  <input 
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-5 px-6 text-sm font-black italic shadow-sm outline-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"
                  />
               </div>
            </div>
          </div>

        </div>

        {/* RIGHT: PREVIEW & RECEIPT (Voucher) */}
        <div className="space-y-10 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
          
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 italic-none shadow-inner shadow-inner shadow-inner">
            <div className="flex flex-col items-center text-center mb-8 italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
                <ShieldCheck className="w-12 h-12 text-primary-600 mb-4 shadow-inner shadow-inner shadow-inner" />
                <h3 className="text-sm font-black uppercase tracking-widest italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">KO-1 Qəbz (Voucher)</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-2 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Bu hissə kəsilib ödəyiciyə verilir</p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-800 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <span>Nömrə:</span>
                    <span className="text-slate-800 dark:text-white shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">{docNumber}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <span>Tarix:</span>
                    <span className="text-slate-800 dark:text-white shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">{date}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <span>Mədaxil olundu:</span>
                    <span className="text-slate-800 dark:text-white text-right shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">{payer || '—'}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <span>Məbləğ:</span>
                    <span className="text-xl font-black italic tabular-nums text-primary-600 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">{amount} AZN</span>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <div className="flex flex-col space-y-4 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <div className="h-0.5 w-full bg-slate-100 dark:bg-slate-800 shadow-inner italic-none shadow-inner shadow-inner shadow-inner s"></div>
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Kəsik Xətti (Cut Line)</p>
                </div>
            </div>
          </div>

          {/* CASH LIMIT ANALYTICS (Optional/Conditional) */}
          <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-[3rem] p-10 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
             <div className="flex items-center space-x-4 mb-6 shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/30 shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <AlertTriangle className="w-5 h-5 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                </div>
                <div className="shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <h4 className="text-xs font-black uppercase text-rose-600 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Kassa Limiti</h4>
                    <p className="text-[10px] font-medium text-rose-500 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Şirkət üzrə təyin edilmiş limit</p>
                </div>
             </div>
             
             <div className="space-y-4 shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <div className="flex justify-between items-end italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <div className="shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest italic mb-1 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Anlıq Balans + Mədaxil</p>
                        <p className="text-xl font-black italic tabular-nums text-rose-700 dark:text-rose-400 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">{(companySettings.currentCashBalance + parseFloat(amount || '0')).toFixed(2)} AZN</p>
                    </div>
                </div>
                <div className="h-2 w-full bg-rose-200 dark:bg-rose-900/30 rounded-full overflow-hidden shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <div 
                      className="h-full bg-rose-500 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" 
                      style={{ width: `${Math.min(((companySettings.currentCashBalance + parseFloat(amount || '0')) / companySettings.cashLimit) * 100, 100)}%` }}
                    />
                </div>
                <p className="text-[10px] font-black text-rose-400 uppercase text-right italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Limit: {companySettings.cashLimit} AZN</p>
             </div>
          </div>

        </div>

      </div>

      {/* PRINT STYLES - Hidden from UI, visible on Print */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-card, .printable-card * { visibility: visible; }
          .printable-card { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      <JournalPreviewModal 
          isOpen={isJournalVisible} 
          onClose={() => setIsJournalVisible(false)} 
          periodClosed={false} 
          isAdmin={true}
          initialLines={[
            { id: '1', accountCode: '221', accountName: 'Kassa', description: `${payer} - ${basis}`, debit: Number(amount), credit: 0 },
            { id: '2', accountCode: '211', accountName: 'Alıcıların və sifarişçilərin qısamüddətli debitor borcları', description: `${payer} - Kassa Mədaxil`, debit: 0, credit: Number(amount) - Number(vatAmount) },
            { id: '3', accountCode: '521', accountName: 'Vergi öhdəlikləri', description: `${payer} - ƏDV`, debit: 0, credit: Number(vatAmount) }
          ]}
       />
    </div>
  );
};

export default CashReceiptCreate;
