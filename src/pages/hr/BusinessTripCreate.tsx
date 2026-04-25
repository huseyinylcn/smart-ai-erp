import { useState, useMemo } from 'react';
import { 
  ArrowLeft, MapPin, Clock,
  FileText, CheckCircle2,
  Printer, 
  Trash2,
  Calendar,
  User,
  History,
  Info,
  Plane,
  ArrowRight,
  DollarSign,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormat } from '../../context/FormatContext';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import FormattedDateInput from '../../components/common/FormattedDateInput';

const BusinessTripCreate = () => {
  const navigate = useNavigate();
  const { formatDate, formatNumber } = useFormat();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`HR-TRP-${new Date().getFullYear()}-0015`);

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyAllowance, setDailyAllowance] = useState(0);

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
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-indigo-100 dark:border-indigo-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <Plane className="w-6 h-6 mr-2 text-indigo-500" /> Ezamiyyət Sənədi
                    </h1>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">BUSINESS TRIP ORDER</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic"><Clock className="w-3.5 h-3.5 mr-1 text-indigo-500" /> {formatDate(new Date())}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ezamiyyəni Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Trip Details */}
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
                             Ezamiyyət Yeri (Şəhər/Ölkə)
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Məs: Sumqayıt, Azərbaycan"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black italic shadow-inner" 
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Müddət
                    </label>
                    <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <FormattedDateInput 
                            label="Başlama"
                            value={startDate}
                            onChange={setStartDate}
                            className="flex-1"
                            iconColor="text-indigo-500"
                        />
                        <ArrowRight className="w-5 h-5 text-slate-200 mt-5" />
                        <FormattedDateInput 
                            label="Bitmə"
                            value={endDate}
                            onChange={setEndDate}
                            className="flex-1"
                            iconColor="text-indigo-500"
                        />
                        <div className="w-24 flex flex-col items-center justify-center border-l border-slate-200 ml-4 pl-4">
                            <span className="text-[14px] font-black text-indigo-600 leading-none">{diffDays}</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase mt-1 leading-none tracking-tighter">İş Günü</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <Navigation className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Ezamiyyə Məqsədi
                    </label>
                    <textarea rows={2} placeholder="Səfərin məqsədi və ya layihə adı..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-6 text-xs font-bold italic shadow-inner resize-none"></textarea>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
            
            {/* Allowance Info Card */}
            <div className="bg-indigo-600 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 italic">Ezamiyyə Xərcləri</h3>
                    <div className="space-y-6 pt-2">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-indigo-200 uppercase">Gündəlik Norma:</span>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={dailyAllowance} 
                                    onChange={(e) => setDailyAllowance(Number(e.target.value))}
                                    className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-xl font-black text-white outline-none" 
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-white/50">AZN</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-[10px] font-black text-indigo-200 uppercase italic">CƏMİ:</span>
                            <span className="text-xl font-black italic">{formatNumber(diffDays * dailyAllowance, 2)} AZN</span>
                        </div>
                    </div>
                </div>
                <DollarSign className="absolute bottom-[-20px] right-2 w-32 h-32 text-white/5 rotate-[-15deg]" />
            </div>

            {/* Workflow / Travel Status */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <Info className="w-3.5 h-3.5 mr-2 text-primary-500" /> Təminat
                </h4>
                <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight group-hover:text-slate-800 transition-colors">Nəqliyyat bileti alınıb</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight group-hover:text-slate-800 transition-colors">Avans ödənişi edilib</span>
                    </label>
                </div>
            </div>

            {/* Travel Policies */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                 <p className="text-[9px] font-bold text-slate-500 leading-relaxed italic">
                    Ezamiyyə qaydalarına əsasən, səfər bitdikdən sonra 3 iş günü ərzində xərc hesabatı təqdim edilməlidir.
                 </p>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-800 transition-all italic underline underline-offset-8">Çıxış</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Ezamiyyəni Tamamla</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default BusinessTripCreate;
