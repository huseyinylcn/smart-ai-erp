import { useState } from 'react';
import { 
  ArrowLeft, ShoppingCart, Truck, Tag, 
  Plus, Save, CheckCircle2, Info, 
  DollarSign, Landmark, FileText, 
  ShieldCheck, Calculator, Briefcase, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

const AssetPurchaseCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  
  const [costs, setCosts] = useState([
    { id: 1, type: 'Alış qiyməti (İnvoice)', amount: 45000, isCapital: true },
    { id: 2, type: 'Gömrük rüsumu', amount: 6750, isCapital: true },
    { id: 3, type: 'Nəqliyyat və loqistika', amount: 1200, isCapital: true },
    { id: 4, type: 'Quraşdırma və montaj', amount: 800, isCapital: true },
    { id: 5, type: 'Sığorta xərci', amount: 350, isCapital: false },
  ]);

  const totalCapitalized = costs.filter(c => c.isCapital).reduce((sum, c) => sum + c.amount, 0);
  const totalExpensed = costs.filter(c => !c.isCapital).reduce((sum, c) => sum + c.amount, 0);

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
                    <ShoppingCart className="w-6 h-6 mr-2 text-primary-500" /> Əsas Vəsaitin Alınması
                </h1>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-2xl shadow-emerald-500/10">
                    <span>ASSET-PUR-2026-0089</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentStatus('POSTED')} className="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20 shadow-2xl">
                <Save className="w-4 h-4 mr-2 inline" />
                Yadda Saxla
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* VENDOR & CONTRACT */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm shadow-2xl shadow-primary-500/5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                    <Landmark className="w-4 h-4 mr-2" /> Təchizatçı və Müqavilə
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Təchizatçı</label>
                        <input type="text" placeholder="Təchizatçı seçin..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none tracking-tighter" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Müqavilə (QRP)</label>
                        <input type="text" placeholder="Müqavilə seçin..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none tracking-tighter" />
                    </div>
                </div>
            </div>

            {/* ASSET PROFILE */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm shadow-2xl shadow-primary-500/5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                    <Tag className="w-4 h-4 mr-2" /> Aktivin Profili
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Aktivin Adı</label>
                        <input type="text" placeholder="Məs: Ford Transit 2024..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none tracking-tighter border-2 border-primary-500/10 focus:border-primary-500/30 transition-all" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Kateqoriya</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none tracking-tighter">
                            <option>Nəqliyyat vasitələri (25%)</option>
                            <option>Binalar və tikililər (7%)</option>
                            <option>Maşınlar və avadanlıqlar (25%)</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Marka / Model</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none tracking-tighter" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Seriya nömrəsi</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none tracking-tighter" />
                    </div>
                </div>
            </div>

            {/* INITIAL COST FORMATION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm shadow-2xl shadow-primary-500/5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <Calculator className="w-4 h-4 mr-2" /> İlkin Dəyərin Formallaşması
                    </h3>
                    <button className="text-[10px] font-black text-primary-600 uppercase italic tracking-widest flex items-center hover:bg-primary-50 dark:hover:bg-primary-900/20 px-4 py-2 rounded-xl transition-all">
                        <Plus className="w-3 h-3 mr-1" /> Digər xərc əlavə et
                    </button>
                </div>
                <div className="overflow-hidden border border-slate-50 dark:border-slate-800 rounded-[2rem]">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black italic text-slate-400 uppercase tracking-widest italic">Xərcin Növü / Detallar</th>
                                <th className="px-8 py-5 text-[10px] font-black italic text-slate-400 uppercase tracking-widest italic">Kapitallaşsın?</th>
                                <th className="px-8 py-5 text-[10px] font-black italic text-slate-400 uppercase tracking-widest text-right italic">Məbləğ (₼)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none">
                            {costs.map((cost) => (
                                <tr key={cost.id} className="hover:bg-primary-50/20 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="text-[13px] font-black italic text-slate-700 dark:text-slate-200">{cost.type}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg ${cost.isCapital ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            {cost.isCapital ? <ShieldCheck className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                                            <span className="text-[10px] font-black uppercase italic">{cost.isCapital ? 'Bəli' : 'Xeyr'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black italic text-slate-700 dark:text-slate-100 tabular-nums">
                                        {cost.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* SIDEBAR SUMMARY */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden italic-none">
                <div className="relative z-10 space-y-8">
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-primary-400 mb-6 italic tracking-widest">Alınma Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-[10px] font-black text-white/40 uppercase italic">Cəmi Xərclər</span>
                                <span className="text-xl font-black italic tabular-nums">₼ {(totalCapitalized + totalExpensed).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-[10px] font-black text-white/40 uppercase italic">Xərcə silinən</span>
                                <span className="text-sm font-black italic text-slate-400 tabular-nums">₼ {totalExpensed.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end pt-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-primary-400 uppercase italic">Uçot Dəyəri (Capitalized)</span>
                                    <div className="flex items-center space-x-2">
                                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[9px] text-emerald-500 font-black uppercase">İlkin Dəyər Formallaşdı</span>
                                    </div>
                                </div>
                                <span className="text-3xl font-black italic text-emerald-400 tracking-tighter tabular-nums">₼ {totalCapitalized.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-primary-500" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-white/40 uppercase italic">Məsul Şəxs</span>
                                <p className="text-[11px] font-black italic">Təyin edilməyib (İstismarda)</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-white/40 uppercase italic">Yerləşmə</span>
                                <p className="text-[11px] font-black italic">Tranzit / Müvəqqəti</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Calculator className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-white/5 rotate-[-15deg] pointer-events-none" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 italic-none shadow-sm flex items-start space-x-4">
                <Info className="w-6 h-6 text-primary-600 shrink-0" />
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                    <b>Qeyd:</b> Bu sənəd təsdiqləndikdən sonra aktiv "İstismara hazır" statusuna keçəcək. Amortizasiya hesablanması üçün "İstismara Verilmə" sənədi tələb olunur.
                </p>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 h-[90px] shadow-2xl">
          <div className="flex items-center space-x-4">
            <button className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
              <FileText className="w-4 h-4 mr-2 inline" /> Proyeksiya Bax
            </button>
            <button onClick={() => setCurrentStatus('POSTED')} className="px-12 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">
                <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                <span>Sənədi Təsdiqlə</span>
            </button>
          </div>
      </div>
    </div>
  );
};

export default AssetPurchaseCreate;
