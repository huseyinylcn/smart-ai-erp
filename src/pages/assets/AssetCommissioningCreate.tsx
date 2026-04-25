import { useState } from 'react';
import { 
  ArrowLeft, Building2, UserCheck, Calendar, 
  Plus, Save, CheckCircle2, Info, 
  ShieldCheck, Calculator, Landmark, MapPin,
  ChevronRight, AlertCircle, Percent
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

const AssetCommissioningCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  
  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-primary-100 dark:border-primary-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-primary-50 transition-all text-slate-400">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                    <Building2 className="w-6 h-6 mr-2 text-primary-500" /> İstismara Verilmə Sənədi
                </h1>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-2xl shadow-emerald-500/10">
                    <span>ASSET-COM-2026-0042</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentStatus('POSTED')} className="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20 shadow-2xl">
                <Save className="w-4 h-4 mr-2 inline" />
                Sənədi Təsdiqlə
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* ASSET SELECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm shadow-2xl shadow-primary-500/5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                    <ShieldCheck className="w-4 h-4 mr-2" /> Aktiv Seçimi (Alınma Sənədi üzrə)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Bağlı Alınma Sənədi</label>
                        <div className="relative group">
                            <input type="text" placeholder="Alınma sənədini və ya Aktivi seçin..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none tracking-tighter pr-12" />
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">İstismara Verilmə Tarixi</label>
                        <input type="date" defaultValue="2026-03-30" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter italic">İlkin Dəyər (Maya)</label>
                        <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl py-4 px-6 text-sm font-black italic tabular-nums text-slate-500">
                            ₼ 53,750.00
                        </div>
                    </div>
                </div>
            </div>

            {/* ASSIGNMENT & HR INTEGRATION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm shadow-2xl shadow-primary-500/5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                    <UserCheck className="w-4 h-4 mr-2" /> Yerləşmə və Təhkimat (HR)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Məsul Şəxs (HR-dan seçilir)</label>
                        <input type="text" placeholder="İşçi adını yazın..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none tracking-tighter" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Yerləşmə / Departament</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                            <input type="text" placeholder="Ofis / Şöbə seçin..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black italic shadow-inner outline-none tracking-tighter" />
                        </div>
                    </div>
                </div>
            </div>

            {/* DUAL LEDGER CONFIGURATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic-none">
                {/* TAX LEDGER */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-primary-100 dark:border-primary-900/30 p-8 space-y-6 shadow-sm shadow-2xl shadow-primary-500/5">
                    <h3 className="text-xs font-black text-primary-600 uppercase tracking-widest flex items-center italic">
                        <Percent className="w-4 h-4 mr-2" /> Vergi Uçotu Parametrləri
                    </h3>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">VM 114 Metodu</label>
                        <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl py-4 px-6 text-sm font-black italic text-slate-600">
                             Qalıq dəyəri metodu
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">İllik Amortizasiya Norması (%)</label>
                        <input type="number" defaultValue={25} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" />
                    </div>
                    <div className="p-4 bg-primary-50/50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-900/10 flex items-start space-x-3 italic">
                        <Info className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-primary-700 dark:text-primary-400 font-bold leading-relaxed">
                            Aktivin amortizasiyası növbəti təqvim ilinin əvvəlindən kateqoriya üzrə hesablanacaqdır.
                        </p>
                    </div>
                </div>

                {/* FINANCIAL LEDGER */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 p-8 space-y-6 shadow-sm shadow-2xl shadow-emerald-500/5">
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center italic">
                        <Calculator className="w-4 h-4 mr-2" /> Maliyyə Uçotu Parametrləri
                    </h3>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter italic">IFRS Metodu</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none">
                            <option>Düz xətt metodu (Straight-line)</option>
                            <option>Azalan qalıq metodu</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Faydalı İstifadə Müddəti (Ay)</label>
                        <input type="number" defaultValue={60} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" />
                    </div>
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/10 flex items-start space-x-3 italic">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold leading-relaxed">
                            Maliyyə amortizasiyası istismara verilmə ayından sonrakı aydan dərhal başlayacaqdır.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* SIDEBAR SUMMARY */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28 italic-none">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-primary-400 mb-6 italic tracking-widest">Proyeksiya (Aylıq)</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-[10px] font-black text-white/40 uppercase italic">Maliyyə Amort.</span>
                                <span className="text-xl font-black italic tabular-nums text-emerald-400">₼ 2,340.50</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-[10px] font-black text-white/40 uppercase italic">Hesablanacaq Faiz</span>
                                <span className="text-sm font-black italic text-slate-400 tabular-nums italic tracking-tighter">4.35% / ay</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center space-x-4">
                        <Calendar className="w-8 h-8 text-primary-500" />
                        <div>
                            <span className="text-[9px] font-black text-white/30 uppercase italic">İlk Hesablama Tarixi</span>
                            <p className="text-[12px] font-black italic italic tracking-tighter">01 Aprel, 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-900/30 flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-orange-600 shrink-0" />
                <p className="text-[11px] text-orange-800 dark:text-orange-300 font-bold leading-relaxed italic">
                    <b>Xəbərdarlıq:</b> Bu sənəd təsdiqləndikdən sonra aktiv üzrə uçot parametrləri dərhal qüvvəyə minir. Dəyişiklik yalnız "Yenidən Qiymətləndirmə" sənədi ilə mümkündür.
                </p>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 h-[90px] shadow-2xl">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-600/20 active:scale-95 transition-all">
                <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                <span>İstismarı Təsdiqlə</span>
            </button>
          </div>
      </div>
    </div>
  );
};

export default AssetCommissioningCreate;
