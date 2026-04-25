import { useState, useMemo } from 'react';
import { 
  ArrowLeft, ArrowRightLeft, Landmark, 
  CheckCircle2,
  TrendingUp, TrendingDown,
  ShieldCheck,
  Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import JournalPreviewModal from '../../components/JournalPreviewModal';

const CurrencyConversion = () => {
  const navigate = useNavigate();
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  
  // Basic Info
  const [docNumber] = useState(`FX-${new Date().getFullYear()}-0024`);
  const [docDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Conversion Details
  const [fromAccount, setFromAccount] = useState('Pasha Bank (USD) - *1424');
  const [toAccount, setToAccount] = useState('Pasha Bank (AZN) - *1322');
  const [fromAmount, setFromAmount] = useState<number>(1000);
  const [appliedRate, setAppliedRate] = useState<number>(1.6940);
  const [officialRate] = useState<number>(1.7000); // CBAR Rate for docDate

  // Calculated Results
  const toAmount = useMemo(() => fromAmount * appliedRate, [fromAmount, appliedRate]);
  const fxDiff = useMemo(() => (appliedRate - officialRate) * fromAmount, [fromAmount, appliedRate, officialRate]);
  const isLoss = fxDiff < 0;

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
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Valyuta Konvertasiyası</h1>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100 italic">Financial Document</span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 italic tracking-tighter">SƏNƏD NO: {docNumber}</p>
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
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Müxabirləşməni Post Et</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* MAIN PANEL */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* 1. Transaction Accounts Mapping */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <ArrowRightLeft className="w-4 h-4 mr-2 text-indigo-500" /> Hesabların Xəritələnməsi
                    </h3>
                    <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-500 uppercase italic">
                        <Lock className="w-3 h-3" /> multi-currency secure
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 relative">
                    {/* FROM ACCOUNT */}
                    <div className="flex-1 w-full space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">Mənbə Hesab (Məxaric)</label>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none shadow-inner group transition-all hover:bg-slate-100 ring-2 ring-transparent hover:ring-indigo-500/10">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200/20">
                                    <Landmark className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="w-full bg-transparent border-none text-sm font-black italic text-slate-800 dark:text-white outline-none cursor-pointer">
                                        <option>Pasha Bank (USD) - *1424</option>
                                        <option>ABB (EUR) - *8842</option>
                                    </select>
                                    <p className="text-[8px] font-black text-rose-600 uppercase mt-1 italic tracking-widest">Balans: $12,450.00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-12 h-12 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30 z-10 -my-6 md:my-0">
                        <ArrowRightLeft className="w-5 h-5 animate-pulse" />
                    </div>

                    {/* TO ACCOUNT */}
                    <div className="flex-1 w-full space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">Təyinat Hesab (Mədaxil)</label>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none shadow-inner group transition-all hover:bg-slate-100 ring-2 ring-transparent hover:ring-emerald-500/10">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/20">
                                    <Landmark className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <select value={toAccount} onChange={(e) => setToAccount(e.target.value)} className="w-full bg-transparent border-none text-sm font-black italic text-slate-800 dark:text-white outline-none cursor-pointer">
                                        <option>Pasha Bank (AZN) - *1322</option>
                                        <option>Kapital Bank (AZN) - *5120</option>
                                    </select>
                                    <p className="text-[8px] font-black text-emerald-600 uppercase mt-1 italic tracking-widest">Balans: ₼ 245,670.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Amount & Rates Configuration */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                    <Calculator className="w-4 h-4 mr-2 text-indigo-500" /> Convertasiya Parametrləri
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Çevrilən Məbləğ (USD)</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black italic text-slate-300">$</span>
                            <input 
                              type="number" 
                              value={fromAmount} 
                              onChange={(e) => setFromAmount(Number(e.target.value))}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-6 pl-14 pr-8 text-3xl font-black italic tabular-nums shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/10 text-slate-800 dark:text-white tracking-tighter" 
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tətbiq Olunan Məzənnə (Bank)</label>
                        <div className="relative group">
                            <input 
                              type="number" 
                              step="0.0001"
                              value={appliedRate} 
                              onChange={(e) => setAppliedRate(Number(e.target.value))}
                              className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-indigo-100/50 dark:border-indigo-900/20 rounded-3xl py-6 px-10 text-3xl font-black italic tabular-nums shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20 text-indigo-600 dark:text-indigo-400 tracking-tighter" 
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-indigo-100 text-[10px] font-black text-indigo-600 uppercase italic shadow-sm">Manual Rate</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Landmark className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase italic">Mərkəzi Bank Məzənnəsi (AMB)</p>
                            <p className="text-sm font-black text-slate-800 dark:text-white italic tracking-tighter">1 USD = {officialRate.toFixed(4)} AZN</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase italic tracking-widest">
                        <TrendingDown className="w-4 h-4 text-rose-500" />
                        <span>Kurs Fərqi Zərəri: </span>
                        <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 underline decoration-rose-200 decoration-wavy underline-offset-4">{Math.abs(fxDiff).toFixed(2)} AZN</span>
                    </div>
                </div>
            </div>
        </div>

        {/* SIDEBAR SUMMARY */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 italic">Məqsəd Hesabına Ödəniş</h3>
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-500 uppercase italic">Ümumi Mədaxil (Net)</p>
                        <div className="flex items-end space-x-2">
                            <h2 className="text-5xl font-black italic tracking-tighter leading-none tabular-nums text-emerald-400">{toAmount.toLocaleString()}</h2>
                            <span className="text-lg font-black italic text-slate-500 mb-1">AZN</span>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-white/5"></div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-500 uppercase tracking-widest italic">Məzənnə Təsiri:</span>
                            <span className={`font-black italic px-3 py-1 rounded-lg border flex items-center ${isLoss ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                                {isLoss ? <TrendingDown className="w-3.5 h-3.5 mr-1.5" /> : <TrendingUp className="w-3.5 h-3.5 mr-1.5" />}
                                {fxDiff.toFixed(2)} AZN
                            </span>
                        </div>
                        <p className="text-[8px] font-bold text-slate-500 leading-tight uppercase tracking-wide italic">
                            AMB məzənnəsi ilə Müqayisədə yaranan {isLoss ? 'zərər' : 'gəlir'} avtomatik olaraq <strong>Kurs Fərqi Hesabına</strong> post ediləcəkdir.
                        </p>
                    </div>
                </div>
                <ArrowRightLeft className="absolute bottom-[-30px] right-[-20px] w-48 h-48 text-indigo-500/10 rotate-12 group-hover:rotate-45 transition-all duration-700 pointer-events-none" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 text-indigo-600">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Compliance & Audit</span>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 ring-4 ring-emerald-500/10"></div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase italic leading-normal">Mərkəzi Bank məzənnəsi tarix: {docDate}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 ring-4 ring-emerald-500/10"></div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase italic leading-normal">Mənbə hesabında qalıq yoxlanıldı: OK</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 ring-4 ring-amber-500/10"></div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase italic leading-normal tracking-tight">Kurs fərqi ₼ 500-dən aşağı olduğu üçün avtomatik təsdiqə göndərildi</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl h-[90px] transition-all">
          <div className="flex items-center space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-800 transition-all italic underline underline-offset-8">Vazkeç</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center space-x-3 leading-none italic shadow-inner">
                 <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                 <span>Konvertasiyanı Tamamla</span>
              </button>
          </div>
      </div>

      <JournalPreviewModal 
        isOpen={isJournalVisible} 
        onClose={() => setIsJournalVisible(false)} 
        periodClosed={false} 
        isAdmin={true}
        initialLines={[
            { id: '1', accountCode: '223.1', accountName: 'Bank (AZN)', description: 'Konvertasiya üzrə', debit: toAmount, credit: 0 },
            { id: '2', accountCode: '223.2', accountName: 'Bank (USD)', description: 'Konvertasiya üzrə', debit: 0, credit: fromAmount * officialRate },
            { id: '3', accountCode: isLoss ? '801' : '631', accountName: isLoss ? 'Kurs Fərqi Xərci' : 'Kurs Fərqi Gəliri', description: 'Kurs fərqi', debit: isLoss ? Math.abs(fxDiff) : 0, credit: isLoss ? 0 : fxDiff }
        ]}
      />
    </div>
  );
};

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default CurrencyConversion;
