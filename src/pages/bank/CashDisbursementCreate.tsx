import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, 
  User, 
  Printer, 
  MessageSquare, 
  FileText,
  Fingerprint,
  AlertCircle,
  Calculator,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { azSpellOut } from '../../utils/azSpellOut';
import JournalPreviewModal from '../../components/JournalPreviewModal';

const CashDisbursementCreate = () => {
  const navigate = useNavigate();
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  
  // Document State
  const [docNumber] = useState('CD-' + Math.floor(Math.random() * 9000 + 1000));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recipient, setRecipient] = useState('');
  const [basis, setBasis] = useState(''); // Məxaric əsası
  const [amount, setAmount] = useState('0.00');
  
  // ID Document Data (Legal requirement for KO-2)
  const [idSerial, setIdSerial] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idIssuedBy, setIdIssuedBy] = useState('');
  const [idDate, setIdDate] = useState('');

  const [spellOut, setSpellOut] = useState('');

  useEffect(() => {
    setSpellOut(azSpellOut(amount));
  }, [amount]);

  const handleSave = () => {
    console.log("Saving Cash Disbursement KO-2", { docNumber, recipient, amount });
    alert("Kassa Məxaric Orderi uğurla saxlanıldı!");
    navigate('/bank/cash');
  };

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-100 dark:border-slate-800 italic-none">
        <div className="flex items-center space-x-6 italic-none shadow-inner">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-rose-600 shadow-sm italic-none shadow-inner"
          >
            <ArrowLeft className="w-5 h-5 shadow-inner" />
          </button>
          <div className="shadow-inner italic-none shadow-inner">
            <div className="flex items-center space-x-3 mb-2 shadow-inner">
              <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap italic tracking-tighter shadow-inner">Expense Management</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap italic tracking-tighter shadow-inner">KO-2 Standard</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner whitespace-nowrap italic tracking-tighter italic">Yeni Kassa Məxaric Orderi</h1>
          </div>
        </div>

           <button 
             onClick={() => setIsJournalVisible(true)}
             className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm italic-none shadow-inner"
           >
            <Calculator className="w-4 h-4 shadow-inner shadow-inner" />
            <span>Müxabirləşmə</span>
          </button>
           <button 
             className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm italic-none shadow-inner"
           >
            <Printer className="w-4 h-4 shadow-inner shadow-inner" />
            <span>Çap Et (KO-2)</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-8 py-3 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-rose-500/20 active:scale-95 italic-none shadow-inner shadow-inner shadow-inner"
          >
            <span>Təsdiqlə</span>
          </button>
      </div>

      {/* DOCUMENT BODY */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
        
        {/* MAIN FORM AREA */}
        <div className="xl:col-span-3 space-y-10 italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner shadow-inner">
          
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 shadow-sm italic-none shadow-inner shadow-inner">
            <div className="grid grid-cols-2 gap-10 mb-12 italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
              <div className="space-y-4 shadow-inner shadow-inner shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner">Məxaric Nömrəsi</label>
                <div className="relative italic-none shadow-inner shadow-inner shadow-inner">
                  <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 shadow-inner" />
                  <input 
                    type="text"
                    value={docNumber}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black italic tracking-tighter shadow-inner outline-none shadow-inner shadow-inner shadow-inner shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-4 shadow-inner shadow-inner shadow-inner shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner">Tarix</label>
                <div className="relative italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black italic tracking-tighter shadow-inner outline-none shadow-inner shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10 shadow-inner shadow-inner shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Məxaric edilən şəxs (Ad, Soyad)</label>
                <div className="relative italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                  <input 
                    type="text"
                    placeholder="Məsələn: Vüqar Səmədov"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black italic tracking-tighter shadow-inner outline-none shadow-inner shadow-inner shadow-inner"
                  />
                </div>
            </div>

            <div className="space-y-4 mb-10 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Məxaric Əsası (Təyinat)</label>
                <div className="relative italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                  <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                  </MessageSquare>
                  <input 
                    type="text"
                    placeholder="Məsələn: Təhtəlhesab vəsaitin verilməsi"
                    value={basis}
                    onChange={(e) => setBasis(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black italic tracking-tighter shadow-inner outline-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"
                  />
                </div>
            </div>

            <div className="space-y-4 mb-10 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Ödənilən Məbləğ (AZN)</label>
                <div className="relative italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">₼</div>
                  <input 
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-rose-600 text-white border-none rounded-[1.5rem] py-8 pl-12 pr-6 text-3xl font-black italic shadow-inner outline-none focus:ring-4 ring-rose-500/20 transition-all shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"
                  />
                </div>
            </div>

            <div className="p-8 bg-rose-50 dark:bg-rose-900/10 rounded-[2rem] border border-rose-100/50 dark:border-rose-800/50 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
              <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest italic mb-2 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Məbləğ Yazı İlə:</p>
              <p className="text-md font-black text-rose-700 dark:text-rose-400 italic tabular-nums tracking-tight shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                {spellOut}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-[3rem] p-12 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
             <div className="flex items-center space-x-3 mb-8 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <Fingerprint className="w-5 h-5 text-slate-400 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                <h3 className="text-xs font-black uppercase tracking-widest italic text-slate-500 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Şəxsiyyəti təsdiq edən sənəd (KO-2 Tələbi)</h3>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <div className="space-y-4 shadow-inner shadow-inner shadow-inner shadow-inner">
                    <label className="text-[9px] font-black text-slate-400 uppercase shadow-inner shadow-inner shadow-inner">Seriya</label>
                    <input type="text" placeholder="AZE" value={idSerial} onChange={(e) => setIdSerial(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-4 px-5 text-xs font-black italic shadow-inner outline-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                </div>
                <div className="space-y-4 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <label className="text-[9px] font-black text-slate-400 uppercase shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Nömrə</label>
                    <input type="text" placeholder="12345678" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-4 px-5 text-xs font-black italic shadow-inner outline-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                </div>
                <div className="space-y-4 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <label className="text-[9px] font-black text-slate-400 uppercase shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Verilmə Tarixi</label>
                    <input type="date" value={idDate} onChange={(e) => setIdDate(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-4 px-5 text-xs font-black italic shadow-inner outline-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                </div>
                <div className="space-y-4 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <label className="text-[9px] font-black text-slate-400 uppercase shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Kim tərəfindən</label>
                    <input type="text" placeholder="DİN" value={idIssuedBy} onChange={(e) => setIdIssuedBy(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-4 px-5 text-xs font-black italic shadow-inner outline-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                </div>
             </div>
          </div>

        </div>

        {/* SIDE ACTIONS & INFO */}
        <div className="space-y-10 italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
            <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <div className="flex items-center space-x-4 mb-8 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                   <Info className="w-6 h-6 text-rose-500 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                   <h3 className="text-sm font-black uppercase tracking-widest italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Məxaric Tələbləri</h3>
                </div>
                <ul className="space-y-6 text-[10px] font-bold text-slate-400 italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <li className="flex items-start space-x-3 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1 shrink-0 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"></div>
                        <span>Vəsait alan şəxs orderi imzalayarkən tam tarixi və məbləği yazı ilə qeyd etməlidir.</span>
                    </li>
                    <li className="flex items-start space-x-3 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1 shrink-0 shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner"></div>
                        <span>Şəxsiyyət vəsiqəsi məlumatları orderdə tam əks olunmalıdır (Azərbaycan R. standartı KO-2).</span>
                    </li>
                </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 p-10 italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center mb-6 shadow-inner shadow-inner shadow-inner shadow-inner">İmza Sahələri (Print)</p>
                 <div className="space-y-8 italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                        <span className="text-[9px] font-bold text-slate-400 uppercase italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Müəssisə rəhbəri</span>
                        <span className="text-[9px] font-black italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">_________</span>
                    </div>
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                        <span className="text-[9px] font-bold text-slate-400 uppercase italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Baş mühasib</span>
                        <span className="text-[9px] font-black italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">_________</span>
                    </div>
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                        <span className="text-[9px] font-bold text-slate-400 uppercase italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Aldım (İmza)</span>
                        <span className="text-[9px] font-black italic shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">_________</span>
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
            { id: '1', accountCode: '244', accountName: 'Təhtəlhesab məbləğlər', description: `${recipient} - ${basis}`, debit: Number(amount), credit: 0 },
            { id: '2', accountCode: '221', accountName: 'Kassa', description: `${recipient} - Kassa Məxaric`, debit: 0, credit: Number(amount) }
          ]}
       />
    </div>
  );
};

export default CashDisbursementCreate;
