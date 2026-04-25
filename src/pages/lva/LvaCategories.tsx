import { useState } from 'react';
import { 
  Layers, Plus, Search, Filter, 
  Settings2, ShieldAlert, Info, 
  ChevronRight, Save, Trash2, 
  Settings, Calculator, History,
  AlertCircle, CheckCircle2, Clock
} from 'lucide-react';

const LvaCategories = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(1);
  
  const categories = [
    { id: 1, name: 'Xüsusi geyim', code: 'LVA-CLH', count: 42, method: '100% EXPENSE', life: '6 ay' },
    { id: 2, name: 'Ofis inventarı', code: 'LVA-OFF', count: 128, method: 'STRAIGHT-LINE', life: '24 ay' },
    { id: 3, name: 'İstehsalat alətləri', code: 'LVA-TL-IND', count: 85, method: '100% EXPENSE', life: '12 ay' },
    { id: 4, name: 'Fərdi mühafizə vasitələri', code: 'LVA-PPE', count: 510, method: '100% EXPENSE', life: '3 ay' },
    { id: 5, name: 'Kiçik avadanlıqlar', code: 'LVA-EQUIP', count: 15, method: 'STRAIGHT-LINE', life: '36 ay' },
  ];

  return (
    <div className="flex flex-col min-h-full space-y-8 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">ATƏ Kateqoriyaları və Qaydalar</h1>
          <p className="text-sm font-medium text-slate-500 mt-1 italic tracking-tight">Azqiymətli və Tezköhnələn Əşyaların uçot siyasətinin mərkəzi idarəetməsi</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
             <History className="w-4 h-4" />
             <span>Dəyişiklik Tarixçəsi</span>
          </button>
          <button className="flex items-center space-x-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95">
            <Plus className="w-4 h-4" />
            <span>Yeni Kateqoriya</span>
          </button>
        </div>
      </div>

      {/* RULE ENGINE PANEL (GLOBAL SETTINGS) */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden italic-none border border-white/5">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="space-y-4">
                <div className="flex items-center space-x-3 text-primary-400 mb-2">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-widest italic">Global Rule Engine</h3>
                </div>
                <p className="text-sm font-medium text-white/60 leading-relaxed italic">
                    Sistem alış sənədi zamanı aşağıdakı limitləri avtomatik yoxlayaraq əşyanı **Əsas Vəsait** və ya **ATƏ** kimi təsnifləşdirəcək.
                </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                    <span>Maksimal Dəyər Limiti</span>
                    <Settings className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-end space-x-2">
                    <input type="text" defaultValue="500.00" className="bg-transparent text-2xl font-black italic tabular-nums text-primary-400 outline-none w-24 border-b border-white/10 pb-1" />
                    <span className="text-sm font-bold text-white/60 mb-1 italic uppercase tracking-tighter">AZN (Vahid)</span>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                    <span>Maksimal Ömür Müddəti</span>
                    <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-end space-x-2">
                    <input type="text" defaultValue="12" className="bg-transparent text-2xl font-black italic tabular-nums text-emerald-400 outline-none w-16 border-b border-white/10 pb-1" />
                    <span className="text-sm font-bold text-white/60 mb-1 italic uppercase tracking-tighter">AY (TEZKÖHNƏLƏN)</span>
                </div>
            </div>
         </div>
         <Settings2 className="absolute bottom-[-40px] right-[-40px] w-64 h-64 text-white/5 rotate-[-15deg] pointer-events-none" />
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* LEFT: CATEGORY LIST */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm shadow-2xl shadow-primary-500/5 italic-none">
            <div className="relative group px-2 mb-4">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
               <input type="text" placeholder="Kateqoriya axtar..." className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
            </div>

            <div className="space-y-2">
                {categories.map((cat) => (
                    <button 
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border ${activeCategory === cat.id ? 'bg-primary-50/50 border-primary-100 dark:bg-primary-900/10 dark:border-primary-900/30' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeCategory === cat.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm'}`}>
                                <Layers className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className={`text-[13px] font-black italic transition-colors ${activeCategory === cat.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{cat.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tighter mt-0.5">{cat.code}</p>
                            </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat.id ? 'text-primary-500 translate-x-1' : 'text-slate-300'}`} />
                    </button>
                ))}
            </div>
        </div>

        {/* RIGHT: SETTINGS DETAIL */}
        <div className="col-span-12 lg:col-span-8 space-y-8 animate-in slide-in-from-right-4 duration-500 italic-none">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm shadow-2xl shadow-primary-500/5 space-y-12">
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-[1.5rem] flex items-center justify-center border border-primary-100 dark:border-primary-900/30 shadow-inner">
                            <Layers className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic text-slate-800 dark:text-white uppercase tracking-tight">Kateqoriya Tənzimləmələri</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest mt-1">Seçilmiş: <span className="text-primary-500 tracking-tighter">{categories.find(c => c.id === activeCategory)?.name}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-3 bg-red-50 dark:bg-red-950/20 text-red-400 hover:text-red-500 rounded-xl transition-all">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest mb-3 block">Uçot Siyasəti (AMORTIZATION METHOD)</label>
                            <div className="grid grid-cols-1 gap-3">
                                <button className="flex items-center justify-between p-4 bg-primary-50/30 dark:bg-primary-900/10 border-2 border-primary-500/20 rounded-2xl text-left transition-all hover:border-primary-500/40 group">
                                    <div>
                                        <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic tracking-tight">100% Xərcə Silinmə</p>
                                        <p className="text-[9px] font-medium text-slate-500 italic mt-0.5">İstifadəyə verilən anda tam xərc tanınır</p>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                                </button>
                                <button className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 border-2 border-transparent rounded-2xl text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800 group border-dashed border-slate-200 dark:border-slate-700">
                                    <div>
                                        <p className="text-[11px] font-black text-slate-400 uppercase italic tracking-tight">Mərhələli Köhnəlmə</p>
                                        <p className="text-[9px] font-medium text-slate-400 italic mt-0.5 tracking-tighter">İstifadə müddəti üzrə pro-rata xərc tanınır</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest mb-3 block italic tracking-tighter">İnventar nömrəsi növü</label>
                            <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-500/20 transition-all">
                                <option>Açıq Format (İstifadəçi tərəfindən)</option>
                                <option>Avtomatik (Sistem tərəfindən)</option>
                                <option>Məcburi deyil (Batch bazlı)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-8">
                         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 space-y-6 border border-slate-100 dark:border-slate-800 shadow-inner">
                            <div className="flex items-center space-x-3 text-slate-400">
                                <Calculator className="w-4 h-4 border-none" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Statistik Məlumat</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-700/50 pb-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-tighter shadow-inner">Cəmi Əşya</span>
                                    <span className="text-sm font-black italic tabular-nums tracking-tighter shadow-inner">42 ədəd</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-700/50 pb-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-tighter shadow-inner">Anbar Qalığı</span>
                                    <span className="text-sm font-black italic tabular-nums tracking-tighter shadow-inner">15 ədəd</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-700/50 pb-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-tighter shadow-inner">Cari Qalıq Dəyəri</span>
                                    <span className="text-sm font-black italic tabular-nums text-emerald-500 tracking-tighter shadow-inner">₼ 2,450.00</span>
                                </div>
                            </div>
                         </div>

                        <div className="flex flex-col space-y-3">
                             <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 group shadow-inner" />
                                <div>
                                    <p className="text-[10px] font-black text-orange-600 uppercase italic shadow-inner tracking-tighter">Vacib Qeyd</p>
                                    <p className="text-[9px] font-medium text-orange-500/80 leading-relaxed italic shadow-inner tracking-tighter">Kateqoriya üzrə uçot siyasətinin dəyişdirilməsi yalnız yeni daxil olan əşyalara tətbiq olunacaq.</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                    <button className="flex items-center space-x-2 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/5 active:scale-95">
                        <Save className="w-4 h-4" />
                        <span>Dəyişiklikləri Yadda Saxla</span>
                    </button>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default LvaCategories;
