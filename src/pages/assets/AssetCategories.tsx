import { useState } from 'react';
import { 
  Plus, Search, Building2, Car, Laptop, 
  Settings, Percent, Calendar, Save,
  ChevronRight, Info, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categoriesData = [
  { id: 1, name: 'Binalar və tikililər', code: 'FA-BLD', taxRate: 7, finLife: 50, icon: Building2, color: 'bg-blue-500' },
  { id: 2, name: 'Maşınlar və avadanlıqlar', code: 'FA-MAC', taxRate: 25, finLife: 10, icon: Settings, color: 'bg-emerald-500' },
  { id: 3, name: 'Nəqliyyat vasitələri', icon: Car, code: 'FA-TRN', taxRate: 25, finLife: 7, color: 'bg-orange-500' },
  { id: 4, name: 'Hesablama texnikası (IT)', icon: Laptop, code: 'FA-IT', taxRate: 25, finLife: 3, color: 'bg-purple-500' },
];

const AssetCategories = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(2);
  
  const selected = categoriesData.find(c => c.id === selectedId);

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-12 text-slate-900 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Əsas Vəsait Kateqoriyaları</h1>
          <p className="text-sm font-medium text-slate-500 mt-1 italic">Amortizasiya normaları və uçot parametrlərinin tənzimlənməsi</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95">
          <Plus className="w-4 h-4" />
          <span>Yeni Kateqoriya</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* LEFT: LIST */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Kateqoriya axtar..." 
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm shadow-2xl shadow-primary-500/5">
            {categoriesData.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedId(cat.id)}
                className={`w-full flex items-center justify-between p-6 transition-all border-b border-slate-50 dark:border-slate-800 last:border-none ${selectedId === cat.id ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                    <cat.icon className="w-6 h-6 stroke-[2.5px]" />
                  </div>
                  <div className="text-left">
                    <h4 className={`text-sm font-black uppercase tracking-tight italic ${selectedId === cat.id ? 'text-primary-600' : 'text-slate-700 dark:text-slate-200'}`}>{cat.name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.code}</span>
                  </div>
                </div>
                {selectedId === cat.id && <ChevronRight className="w-4 h-4 text-primary-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS & CONFIG */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {selected && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 lg:p-10 shadow-sm space-y-10 shadow-2xl shadow-primary-500/5">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                   <div className={`w-14 h-14 rounded-[1.25rem] ${selected.color} flex items-center justify-center text-white shadow-2xl shadow-current/30`}>
                      <selected.icon className="w-8 h-8" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">{selected.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md text-[10px] font-black uppercase italic tracking-widest">{selected.code}</span>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase italic">Aktiv Kateqoriya</span>
                      </div>
                   </div>
                </div>
                <button className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
                  <Save className="w-4 h-4 mr-2 inline" />
                  Yadda Saxla
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* TAX SECTION */}
                <div className="space-y-6 p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 italic-none">
                  <h3 className="text-xs font-black text-primary-600 uppercase tracking-widest flex items-center italic">
                    <ShieldCheck className="w-4 h-4 mr-2" /> Vergi Uçotu (AZ TAX)
                  </h3>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Amortizasiya Metodu</label>
                    <select className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none italic tracking-tighter">
                      <option>Qalıq dəyəri metodu (AR VM 114.3)</option>
                      <option>Düz xətt metodu</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Maksimum Amortizasiya Norması (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                      <input type="number" defaultValue={selected.taxRate} className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black italic shadow-inner outline-none italic tracking-tighter" />
                    </div>
                  </div>

                  <div className="p-4 bg-primary-50/50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-900/30 flex items-start space-x-3 italic">
                    <Info className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-primary-800 dark:text-primary-300 font-bold leading-relaxed">
                      Vergi Məcəlləsinin 114-cü maddəsinə əsasən bu kateqoriya üzrə amortizasiya norması {selected.taxRate}%-dən çox ola bilməz.
                    </p>
                  </div>
                </div>

                {/* FINANCIAL SECTION */}
                <div className="space-y-6 p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 italic-none shadow-inner">
                  <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center italic">
                    <Calendar className="w-4 h-4 mr-2" /> Maliyyə Uçotu (IFRS)
                  </h3>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Uçot Metodu</label>
                    <select className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none italic tracking-tighter">
                      <option>Düz xətt metodu (Straight-line)</option>
                      <option>Azalan qalıq metodu</option>
                      <option>İstehsal vahidi metodu</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Standart Faydalı İstifadə Müddəti (İl)</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input type="number" defaultValue={selected.finLife} className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black italic shadow-inner outline-none italic tracking-tighter" />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-start space-x-3 italic shadow-2xl shadow-emerald-500/5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold leading-relaxed shadow-emerald-500/5">
                      IAS 16 standartlarına əsasən maliyyə uçotu üçün daxili korporativ siyasətə uyğun müddət təyin edilməlidir.
                    </p>
                  </div>
                </div>
              </div>

              {/* REPAIR LIMITS */}
              <div className="bg-orange-50/30 dark:bg-orange-950/20 rounded-[2rem] p-8 border border-orange-100 dark:border-orange-900/30 italic-none">
                 <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest flex items-center italic mb-6">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Təmir Xərcləri Normaları (VM 115)
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-orange-500/5">İllük Təmir Limiti (%)</label>
                      <input type="number" defaultValue={selected.id === 1 ? 2 : 3} className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none shadow-orange-500/5" />
                    </div>
                    <div className="flex items-center text-[11px] text-orange-800 dark:text-orange-300 font-bold leading-relaxed italic-none shadow-orange-500/5">
                       Kateqoriya üzrə ilin əvvəlinə olan qalıq dəyərin bu faizindən artıq olan təmir xərcləri Kapitallaşdırılmalıdır.
                    </div>
                 </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetCategories;
