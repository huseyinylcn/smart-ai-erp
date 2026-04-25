import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Activity, Clock,
  FileText, CheckCircle2,
  Printer, 
  Trash2,
  Calendar,
  User,
  History,
  Info,
  Stethoscope,
  ArrowRight,
  ShieldAlert,
  ClipboardCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormat } from '../../context/FormatContext';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import FormattedDateInput from '../../components/common/FormattedDateInput';

const SickLeaveCreate = () => {
  const navigate = useNavigate();
  const { formatDate } = useFormat();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`HR-SL-${new Date().getFullYear()}-004`);

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const diffDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-amber-100 dark:border-amber-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-amber-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <Activity className="w-6 h-6 mr-2 text-amber-500" /> Xəstəlik Vərəqəsi
                    </h1>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">SICK LEAVE (BULLETIN)</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic"><Clock className="w-3.5 h-3.5 mr-1 text-amber-500" /> {formatDate(new Date())}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vərəqəni Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Medical Info */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            İşçi Seçimi
                        </label>
                        <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner">
                            <option value="">İşçini seçin...</option>
                            <option value="1">Emin Quliyev</option>
                            <option value="2">Leyla Məmmədova</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                             Vərəqə № (Sertifikat)
                        </label>
                        <input 
                            type="text" 
                            value={ticketNumber}
                            onChange={(e) => setTicketNumber(e.target.value)}
                            placeholder="Məs: SL-2026-X7"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner" 
                        />
                    </div>
                </div>

                <div className="pt-4 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-amber-500" /> Tarix Aralığı
                    </label>
                    <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <FormattedDateInput 
                            label="Başlama"
                            value={startDate}
                            onChange={setStartDate}
                            className="flex-1"
                            iconColor="text-amber-500"
                        />
                        <ArrowRight className="w-5 h-5 text-slate-200 mt-5" />
                        <FormattedDateInput 
                            label="Bitmə"
                            value={endDate}
                            onChange={setEndDate}
                            className="flex-1"
                            iconColor="text-amber-500"
                        />
                        <div className="w-24 flex flex-col items-center justify-center border-l border-slate-200 ml-4 pl-4">
                            <span className="text-[14px] font-black text-amber-600 leading-none">{diffDays}</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase mt-1 leading-none tracking-tighter">İş Günü</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <Stethoscope className="w-3.5 h-3.5 mr-2 text-amber-500" /> Diaqnoz / Səbəb
                    </label>
                    <textarea rows={2} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Qısa tibbi qeyd və ya xəstəliyin növü..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-6 text-xs font-bold italic shadow-inner resize-none"></textarea>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
            
            {/* Payout Info Card */}
            <div className="bg-amber-600 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200 italic">Müavinət Hesablanması</h3>
                    <div className="space-y-4 pt-2">
                         <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-amber-200/50 uppercase tracking-widest italic">Ödəniş Faizi:</span>
                            <span className="font-black italic">100% (8+ İl Staj)</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-amber-200/50 uppercase tracking-widest italic">Sosial Fond Payı:</span>
                            <span className="font-black italic underline underline-offset-4 decoration-white/20">Hesablanır</span>
                         </div>
                    </div>
                </div>
                <ShieldAlert className="absolute bottom-[-20px] left-2 w-32 h-32 text-white/5 rotate-[-15deg]" />
            </div>

            {/* Legal / Bulletin */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <ClipboardCheck className="w-3.5 h-3.5 mr-2 text-primary-500" /> Vərəqə Statusu
                </h4>
                <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-amber-600" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight group-hover:text-slate-800 transition-colors">Vərəqənin əsli qəbul edilib</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-amber-600" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight group-hover:text-slate-800 transition-colors">Elektron portalda qeyd edilib</span>
                    </label>
                </div>
            </div>

            {/* History */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm opacity-50">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <History className="w-3.5 h-3.5 mr-2" /> Audit İzləmə
                </h4>
                <p className="text-[9px] font-bold text-slate-400 italic">Son fəaliyyət yoxdur.</p>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-800 transition-all italic underline underline-offset-8">Bağla</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-amber-500 text-white hover:bg-amber-600 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Vərəqəni Tamamla</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default SickLeaveCreate;
