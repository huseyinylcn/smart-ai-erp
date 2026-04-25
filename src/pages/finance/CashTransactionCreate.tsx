import { useState } from 'react';
import { 
  ArrowLeft, Wallet, Clock,
  FileText, CheckCircle2,
  Printer, 
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  User,
  Info,
  Calendar,
  CreditCard,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

const CashTransactionCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [docNumber] = useState(`CSH-${new Date().getFullYear()}-0102`);
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State
  const [cashbox, setCashbox] = useState('Baş Kassa (AZN)');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [person, setPerson] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100">
      
      {/* HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <Wallet className={`w-6 h-6 mr-2 ${type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`} /> Kassa Əməliyyatı
                    </h1>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        type === 'INCOME' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>{type === 'INCOME' ? 'Mədaxil' : 'Məxaric'}</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center italic"><Clock className="w-3.5 h-3.5 mr-1 text-primary-500" /> {docDate}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sənədi Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Transaction Type Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-4 flex justify-center">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full max-w-md">
                    <button 
                        onClick={() => setType('INCOME')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${type === 'INCOME' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        <ArrowDownLeft className="w-4 h-4" />
                        <span>Kassa Mədaxil</span>
                    </button>
                    <button 
                        onClick={() => setType('EXPENSE')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${type === 'EXPENSE' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Kassa Məxaric</span>
                    </button>
                </div>
            </div>

            {/* Main Form */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Building2 className="w-3.5 h-3.5 mr-2" /> Kassa Hesabı
                        </label>
                        <select value={cashbox} onChange={(e) => setCashbox(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-2 focus:ring-primary-500/20 shadow-inner italic">
                            <option>Baş Kassa (AZN)</option>
                            <option>Ofis Kassası (AZN)</option>
                            <option>Valyuta Kassası (USD)</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Calendar className="w-3.5 h-3.5 mr-2" /> Əməliyyat Tarixi
                        </label>
                        <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            {type === 'INCOME' ? 'Mədaxil Növü' : 'Məxaric Növü'}
                        </label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner">
                            <option value="">Kateqoriya Seçin...</option>
                            {type === 'INCOME' ? (
                                <>
                                    <option>Satışdan Mədaxil</option>
                                    <option>Təsisçi tərəfindən artım</option>
                                    <option>Sair gəlirlər</option>
                                </>
                            ) : (
                                <>
                                    <option>Təchizatçıya Ödəniş</option>
                                    <option>Əmək Haqqı Ödənişi</option>
                                    <option>Ofis Xərcləri</option>
                                    <option>Təhtəl-hesab şəxsə ödəniş</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <User className="w-3.5 h-3.5 mr-2" /> {type === 'INCOME' ? 'Müştəri / Şəxs' : 'Təchizatçı / İşçi'}
                        </label>
                        <input type="text" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Ad və ya VÖEN daxil edin..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner" />
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <FileText className="w-3.5 h-3.5 mr-2" /> Əlavə Qeyd
                    </label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Əməliyyatın məqsədi barədə məlumat..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-6 text-xs font-bold italic shadow-inner resize-none focus:ring-2 focus:ring-primary-500/20"></textarea>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
            
            {/* Amount Panel */}
            <div className={`rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group transition-colors duration-500 ${type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">Əməliyyat Məbləği</h3>
                    <div className="space-y-6 pt-2">
                        <div className="relative">
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-white/10 border-2 border-white/20 rounded-3xl py-6 px-8 text-4xl font-black text-white text-center focus:ring-4 focus:ring-white/10 outline-none tabular-nums placeholder-white/30"
                                placeholder="0.00"
                            />
                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xl font-black text-white/50">AZN</span>
                        </div>
                        
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase text-white/60 italic tracking-widest">
                                <span>Kassa Qalığı:</span>
                                <span>14,250.00 AZN</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase text-white/60 italic tracking-widest">
                                <span>Yeni Qalıq:</span>
                                <span className="text-white">{(14250 + (type === 'INCOME' ? amount : -amount)).toLocaleString()} AZN</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl transition-colors duration-500 ${type === 'INCOME' ? 'bg-emerald-400/30' : 'bg-rose-400/30'}`}></div>
            </div>

            {/* Account Mapping Info */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <Info className="w-3.5 h-3.5 mr-2 text-primary-500" /> Mühasibat Hesabları
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase italic">Debet:</span>
                        <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase">{type === 'INCOME' ? '221-1 Kassa (AZN)' : category || 'Hesab Seçin'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase italic">Kredit:</span>
                        <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase">{type === 'EXPENSE' ? '221-1 Kassa (AZN)' : category || 'Hesab Seçin'}</span>
                    </div>
                </div>
            </div>

            {/* Audit Log / History */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-sm opacity-50">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <History className="w-3.5 h-3.5 mr-2" /> Tarixçə
                </h4>
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 italic">Sənəd hələ yaradılmayıb...</p>
                </div>
            </div>
        </div>
      </div>

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-3 px-4">
              <button 
                onClick={() => navigate(-1)} 
                className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-800 transition-all italic underline underline-offset-8"
              >
                Ləğv Et
              </button>
              <button 
                onClick={() => setCurrentStatus('POSTED')} 
                className={`px-16 py-2.5 ${type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center space-x-2 leading-none`}
              >
                 <CheckCircle2 className="w-4 h-4" />
                 <span>{type === 'INCOME' ? 'Mədaxili Tamamla' : 'Məxarici Tamamla'}</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default CashTransactionCreate;
