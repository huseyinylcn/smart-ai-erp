import { useState } from 'react';
import { 
  ArrowLeft, User, 
  Calendar, LayoutGrid, 
  CheckCircle2, AlertCircle,
  Calculator, ChevronRight, Save, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LvaIssueCreate = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('full');

  return (
    <div className="flex flex-col min-h-full space-y-8 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/lva')} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-primary-50 transition-all text-slate-400 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">İstismar Sənədi</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner">Təhvil-təslim Aktı</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner whitespace-nowrap">ATƏ-ISS-2024-0042</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 italic-none underline decoration-primary-500/10 underline-offset-8 decoration-dotted">
          <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm italic-none">
            Aktı Çap Et
          </button>
          <button className="flex items-center space-x-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 active:scale-95 italic-none">
            <Save className="w-4 h-4 shadow-inner" />
            <span>Təhvil Ver</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start italic-none underline decoration-primary-500/5 underline-offset-10 decoration-dotted">
        
        {/* MAIN FORM AREA */}
        <div className="col-span-12 lg:col-span-8 space-y-8 italic-none shadow-2xl shadow-primary-500/5">
            
            {/* ASSIGNMENT CARD */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm shadow-2xl shadow-primary-500/5 space-y-10 italic-none">
                <div className="grid grid-cols-2 gap-10 italic-none shadow-inner">
                    <div className="space-y-6 italic-none shadow-inner">
                         <div className="flex items-center space-x-3 text-slate-400 italic-none shadow-inner">
                            <User className="w-4 h-4 shadow-inner tabular-nums font-black italic shadow-inner" />
                            <h3 className="text-xs font-black uppercase tracking-widest italic tracking-tighter shadow-inner">Məsul Şəxs (Material-Məsul)</h3>
                         </div>
                         <div className="relative group italic-none shadow-inner">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors shadow-inner italic-none" />
                            <input type="text" placeholder="İşçinin adı və ya Fin kodu..." className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-inner italic-none shadow-inner" />
                         </div>
                         <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30 flex items-center space-x-4 shadow-inner italic-none">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary-600 font-black shadow-sm italic-none shadow-inner underline decoration-primary-500/20 underline-offset-4 decoration-solid">KB</div>
                            <div className="shadow-inner italic-none">
                                <p className="text-[13px] font-black italic text-slate-800 dark:text-white leading-tight shadow-inner italic-none shadow-inner">Kamran Bağırov</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-0.5 shadow-inner italic-none shadow-inner tracking-tighter">İT Departament / Sistem Admin</p>
                            </div>
                         </div>
                    </div>

                    <div className="space-y-6 shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner">
                         <div className="flex items-center space-x-3 text-slate-400 shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner">
                            <Calendar className="w-4 h-4 shadow-inner tabular-nums font-black italic shadow-inner" />
                            <h3 className="text-xs font-black uppercase tracking-widest italic tracking-tighter shadow-inner">Verilmə Detalları</h3>
                         </div>
                         <div className="grid grid-cols-1 gap-4 shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner">
                            <div className="relative italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner">
                                <input type="date" defaultValue="2024-03-30" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-inner tabular-nums italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase italic tracking-tighter shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner">Təhvil Tarixi</span>
                            </div>
                            <div className="relative italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner">
                                <input type="text" placeholder="Nişan № və ya İnventar №" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-inner tabular-nums italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner" />
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* EXPENSE POLICY CARD */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm shadow-2xl shadow-primary-500/5 italic-none">
                <div className="flex items-center space-x-3 text-slate-400 mb-8 italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner">
                    <Calculator className="w-5 h-5 shadow-inner tabular-nums font-black italic shadow-inner shadow-inner" />
                    <h3 className="text-xs font-black uppercase tracking-widest italic tracking-tighter shadow-inner shadow-inner">Xərcə Silinmə Siyasəti (AMORTIZATION)</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner">
                    <button 
                        onClick={() => setSelectedMethod('full')}
                        className={`flex items-start space-x-4 p-6 rounded-3xl border-2 transition-all text-left ${selectedMethod === 'full' ? 'bg-primary-50/50 border-primary-500 dark:bg-primary-900/20' : 'bg-transparent border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedMethod === 'full' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 shadow-inner'}`}>
                            {selectedMethod === 'full' ? <CheckCircle2 className="w-5 h-5 shadow-inner" /> : <div className="w-2 h-2 bg-slate-300 rounded-full shadow-inner" />}
                        </div>
                        <div className="shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner shadow-inner">
                            <p className="text-sm font-black italic text-slate-800 dark:text-white uppercase tracking-tight shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner shadow-inner">Birdəfəlik Silinmə (100%)</p>
                            <p className="text-[11px] font-medium text-slate-500 italic mt-1 leading-relaxed shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Sənəd təsdiqlənən anda bütün dəyər xərcə gedir.</p>
                        </div>
                    </button>

                    <button 
                         onClick={() => setSelectedMethod('pro-rata')}
                         className={`flex items-start space-x-4 p-6 rounded-3xl border-2 transition-all text-left ${selectedMethod === 'pro-rata' ? 'bg-primary-50/50 border-primary-500 dark:bg-primary-900/20' : 'bg-transparent border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedMethod === 'pro-rata' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 shadow-inner'}`}>
                            {selectedMethod === 'pro-rata' ? <CheckCircle2 className="w-5 h-5 shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" /> : <div className="w-2 h-2 bg-slate-300 rounded-full shadow-inner" />}
                        </div>
                        <div className="shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner shadow-inner">
                            <p className="text-sm font-black italic text-slate-800 dark:text-white uppercase tracking-tight shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner shadow-inner">Mərhələli Silinmə (Monthly)</p>
                            <p className="text-[11px] font-medium text-slate-500 italic mt-1 leading-relaxed shadow-inner italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner tracking-tighter">İstifadə müddəti (məs: 24 ay) ərzində bərabər hissələrlə.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR / SUMMARY */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28 italic-none shadow-2xl shadow-primary-500/5 italic-none underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner">
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner shadow-inner shadow-inner">
                <div className="flex items-center space-x-3 text-slate-400 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none">
                    <LayoutGrid className="w-5 h-5 shadow-inner tabular-nums font-black italic shadow-inner shadow-inner shadow-inner shadow-inner" />
                    <h3 className="text-xs font-black uppercase tracking-widest italic tracking-tighter shadow-inner shadow-inner shadow-inner shadow-inner">Seçilmiş Əşyalar</h3>
                </div>

                <div className="space-y-4 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none uppercase tracking-tighter">
                         <div className="shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none">
                            <p className="text-[11px] font-black italic text-slate-800 dark:text-white shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none">HP ProBook 450 G9</p>
                            <p className="text-[9px] font-bold text-primary-500 uppercase italic mt-0.5 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none tracking-tighter leading-tight">LVA-IT-092 • ₼ 480.00</p>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-300 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner" />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-50 dark:border-slate-800 italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner">
                    <div className="flex justify-between items-center mb-6 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none uppercase tracking-tighter">
                        <span className="text-[10px] font-black text-slate-400 uppercase italic shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner">Cəmi Dəyər</span>
                        <span className="text-xl font-black italic tabular-nums text-slate-800 dark:text-white shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner">₼ 480.00</span>
                    </div>
                    {selectedMethod === 'pro-rata' && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center space-x-3 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner">
                            <Calculator className="w-5 h-5 text-emerald-500 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner" />
                            <div className="shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                                <p className="text-[9px] font-black text-emerald-600 uppercase italic shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner tracking-tighter">Aylıq Xərc (Projection)</p>
                                <p className="text-sm font-black italic tabular-nums text-emerald-600 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner tabular-nums shadow-inner">₼ 20.00 / ay</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-orange-50 dark:bg-orange-950/20 rounded-[2rem] border border-orange-100 dark:border-orange-900/30 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                <div className="flex items-start space-x-3 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner" />
                    <p className="text-[10px] font-medium text-orange-600/80 italic leading-relaxed shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none shadow-inner shadow-inner shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner shadow-inner">Təhvil verildikdən sonra əşya işçinin profilində "Material-Məsul" bölməsində aktivləşəcək.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LvaIssueCreate;
