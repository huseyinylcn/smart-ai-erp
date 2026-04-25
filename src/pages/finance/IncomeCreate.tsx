import { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, History, 
  Save, Info, CreditCard, 
  Calendar, User, ShieldCheck, 
  ArrowUpCircle, Wallet, Banknote, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

const IncomeCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`INC-${new Date().getFullYear()}-0412`);
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('0.00');

  const isEditable = currentStatus === 'DRAFT';

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-emerald-100 dark:border-emerald-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-emerald-50 transition-all text-slate-400 hover:text-emerald-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                        <ArrowUpCircle className="w-6 h-6 mr-2 text-emerald-500" /> Mədaxil Sənədi
                    </h1>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">INCOME / RECEIPT</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic uppercase"><History className="w-3.5 h-3.5 mr-1 text-emerald-500" /> {date}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isEditable ? (
                <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mədaxili Təsdiqlə</span>
                </button>
            ) : (
                <div className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Maliyyə Balansı Yeniləndi</span>
                </div>
            )}
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-10 relative overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <User className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Kontragent (Müştəri/Digər)
                        </label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input placeholder="Ad və ya VÖEN..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic uppercase leading-none" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Wallet className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Kassa / Hesab
                        </label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic uppercase leading-none">
                            <option>Əsas Kassa (AZN)</option>
                            <option>ABB Bank (Cari Hesab)</option>
                            <option>Paşa Bank (Kart Hesabı)</option>
                        </select>
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Info className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Təyinat / Qeyd
                        </label>
                        <textarea rows={3} placeholder="Mədaxilin təyinatı barədə məlumat..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic uppercase leading-none resize-none"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 italic opacity-60">Mədaxil Məbləği</h3>
                <div className="relative z-10 flex items-center space-x-4">
                    <Banknote className="w-10 h-10 opacity-40 shrink-0" />
                    <input 
                        type="text" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent border-none text-5xl font-black italic tracking-tighter outline-none w-full tabular-nums focus:ring-0 p-0" 
                    />
                    <span className="text-2xl font-black opacity-60">AZN</span>
                </div>
                <div className="mt-8 pt-8 border-t border-white/20 flex justify-between items-center opacity-60 italic font-black text-[10px] uppercase">
                    <span>Valyuta</span>
                    <span>AZERBAIJAN MANAT</span>
                </div>
                <ArrowUpCircle className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-white/10 -rotate-12" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <CreditCard className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Ödəniş Detalları
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase italic">
                        <span className="text-slate-400">Vergi dərəcəsi</span>
                        <span className="text-slate-600">0% (ƏDV-siz)</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-100 p-6 flex justify-end items-center z-40 h-[90px]">
          <div className="flex space-x-4 px-4 items-center">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-[10px] uppercase italic">Ləğv Et</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-[10px] uppercase shadow-2xl active:scale-95 transition-all flex items-center space-x-2 italic tracking-widest">
                 <Save className="w-4 h-4" />
                 <span>Mədaxili Tamamla</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default IncomeCreate;
