import { useState } from 'react';
import { 
  ArrowLeft, Plus, Trash2, 
  Search, FileText, Globe, DollarSign,
  Calculator, Info, ShieldCheck, CheckCircle2,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LvaPurchaseCreate = () => {
  const navigate = useNavigate();
  const [items] = useState([
    { id: 1, name: 'Xüsusi Geyim (Uniforma)', category: 'Xüsusi geyim', qty: 50, price: 85, vat: 18, total: 5015, warehouse: 'Mərkəzi Anbar' }
  ]);

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
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">Yeni Sənəd</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Mədaxil - ATƏ Alınışı</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">ATƏ-PV-2024-0001</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm italic-none">
            Qaralama Saxla
          </button>
          <button className="flex items-center space-x-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 italic-none">
            <ShieldCheck className="w-4 h-4" />
            <span>Təsdiq Et və Mədaxil</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start italic-none">
        
        {/* MAIN FORM AREA */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* MASTER DATA CARD */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm shadow-2xl shadow-primary-500/5 space-y-10">
                <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-2 italic tracking-tighter">Tarix</label>
                        <input type="date" defaultValue="2024-03-30" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-inner tabular-nums italic-none" />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-2 italic tracking-tighter">Təchizatçı</label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input type="text" placeholder="Təchizatçı adı və ya VÖEN ilə axtarın..." className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-inner italic-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-2 italic tracking-tighter shadow-inner">Valyuta</label>
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-3.5 shadow-inner">
                            <Globe className="w-4 h-4 text-slate-400 mr-3" />
                            <select className="bg-transparent border-none outline-none text-sm font-bold flex-1 italic-none">
                                <option>AZN - Azərbaycan Manatı</option>
                                <option>USD - ABŞ Dolları</option>
                                <option>EUR - Avro</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-2 italic tracking-tighter shadow-inner">E-Qaimə Statusu</label>
                        <div className="flex items-center space-x-3 p-3.5 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 shadow-inner">
                             <FileText className="w-4 h-4 text-orange-500 shadow-inner" />
                             <span className="text-[11px] font-black text-orange-600 uppercase italic tracking-tighter shadow-inner">Gözlənilir</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-2 italic tracking-tighter shadow-inner">Invoice Nömrəsi</label>
                        <input type="text" placeholder="INV-2024-X" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-inner tabular-nums italic-none shadow-inner" />
                    </div>
                </div>
            </div>

            {/* LINE ITEMS GRID */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm shadow-2xl shadow-primary-500/5 italic-none">
                <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between shadow-inner">
                    <div className="flex items-center space-x-3 shadow-inner">
                        <Calculator className="w-5 h-5 text-primary-500 shadow-inner" />
                        <h3 className="text-xs font-black uppercase tracking-widest italic tracking-tighter shadow-inner">Əşyalar və Vəsaitlər</h3>
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-all italic-none shadow-inner">
                        <Plus className="w-3.5 h-3.5 shadow-inner" />
                        <span>Sətir Əlavə Et</span>
                    </button>
                </div>
                <div className="overflow-x-auto shadow-inner">
                    <table className="w-full text-left border-collapse shadow-inner">
                        <thead className="bg-slate-50 dark:bg-slate-800/70 shadow-inner">
                            <tr>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic tracking-tighter shadow-inner">Əşya Kodu / Adı</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic tracking-tighter shadow-inner">Kateqoriya</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic tracking-tighter shadow-inner text-center">Miqdar</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic tracking-tighter shadow-inner">Vahid Qiymət</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic tracking-tighter shadow-inner">Məbləğ</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic tracking-tighter shadow-inner">Xərc Metodu</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic tracking-tighter shadow-inner"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 shadow-inner">
                            {items.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all shadow-inner">
                                    <td className="px-6 py-5">
                                        <div className="text-[13px] font-bold text-slate-800 dark:text-slate-200 shadow-inner italic-none shadow-inner underline decoration-slate-200 dark:decoration-slate-700 underline-offset-4">{item.name}</div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase italic mt-1 shadow-inner tracking-tighter">CODE: LVA-00{item.id}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[11px] font-black text-primary-500 uppercase italic tracking-tighter shadow-inner">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center shadow-inner">
                                        <input type="number" defaultValue={item.qty} className="w-16 bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-1 px-2 text-xs font-bold text-center outline-none focus:ring-2 focus:ring-primary-500/20 italic-none shadow-inner" />
                                    </td>
                                    <td className="px-6 py-5 shadow-inner">
                                         <input type="text" defaultValue={item.price.toFixed(2)} className="w-24 bg-transparent border-none rounded-lg text-xs font-black tabular-nums outline-none italic tabular-nums shadow-inner italic-none" />
                                    </td>
                                    <td className="px-6 py-5 shadow-inner underline decoration-emerald-500/20 underline-offset-4">
                                        <span className="text-[13px] font-black italic tabular-nums text-emerald-600 shadow-inner tabular-nums shadow-inner">₼ {item.total.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5 shadow-inner italic-none shadow-inner uppercase tracking-tighter shadow-inner">
                                        <div className="flex items-center space-x-2 p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 shadow-inner">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shadow-inner" />
                                            <span className="text-[9px] font-black text-emerald-600 uppercase italic tracking-tighter shadow-inner">ATƏ (100% EXPENSE)</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right shadow-inner italic-none shadow-inner uppercase tracking-tighter shadow-inner">
                                        <button className="p-2 text-slate-300 hover:text-red-500 transition-colors shadow-inner italic-none shadow-inner uppercase tracking-tighter shadow-inner">
                                            <Trash2 className="w-4 h-4 shadow-inner italic-none shadow-inner uppercase tracking-tighter shadow-inner" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* RIGHT SUMMARY PANEL */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28 italic-none shadow-2xl shadow-primary-500/5 italic-none shadow-inner italic-none">
            
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden italic-none shadow-inner italic-none">
                <div className="relative z-10 space-y-8 shadow-inner italic-none">
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-primary-400 mb-6 italic tracking-widest shadow-inner italic-none">Maliyyə Xülasəsi</h3>
                        <div className="space-y-5 shadow-inner italic-none">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4 shadow-inner italic-none">
                                <span className="text-[10px] font-black text-white/40 uppercase italic shadow-inner italic-none tracking-tighter">Əsas Məbləğ</span>
                                <span className="text-sm font-black italic tabular-nums shadow-inner italic-none tracking-tighter tabular-nums">₼ 4,250.00</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4 shadow-inner italic-none">
                                <span className="text-[10px] font-black text-white/40 uppercase italic shadow-inner italic-none tracking-tighter">ƏDV (18%)</span>
                                <span className="text-sm font-black italic tabular-nums shadow-inner italic-none tracking-tighter tabular-nums">₼ 765.00</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 shadow-inner italic-none">
                                <span className="text-[11px] font-black text-primary-400 uppercase italic shadow-inner italic-none tracking-widest">YEKUN</span>
                                <span className="text-2xl font-black italic tabular-nums text-primary-400 shadow-inner italic-none tracking-tighter tabular-nums underline decoration-primary-500/40 underline-offset-8">₼ 5,015.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 shadow-inner italic-none">
                        <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-3xl border border-white/10 shadow-inner italic-none">
                            <Building2 className="w-4 h-4 text-primary-400 shadow-inner italic-none" />
                            <div className="shadow-inner italic-none">
                                <p className="text-[10px] font-black uppercase text-white/40 italic shadow-inner italic-none tracking-tighter leading-tight">Mədaxil Anbarı</p>
                                <p className="text-xs font-black italic shadow-inner italic-none tracking-tighter">Mərkəzi Loqistika</p>
                            </div>
                        </div>
                    </div>
                </div>
                <DollarSign className="absolute bottom-[-30px] right-[-30px] w-48 h-48 text-white/5 rotate-[-15deg] pointer-events-none shadow-inner" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6 shadow-sm shadow-inner italic-none shadow-inner italic-none">
                <div className="flex items-center space-x-3 text-slate-400 shadow-inner italic-none shadow-inner italic-none">
                    <Info className="w-4 h-4 shadow-inner italic-none shadow-inner italic-none underline decoration-slate-200 dark:decoration-slate-700 underline-offset-4" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest italic shadow-inner italic-none shadow-inner italic-none tracking-tighter">Rule Engine Analizi</h3>
                </div>
                <div className="space-y-4 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none">
                    <div className="flex items-start space-x-3 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none" />
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none tracking-tighter">Bütün sətirlər **500 AZN** limitindən aşağıdır.</p>
                    </div>
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30 shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none">
                        <p className="text-[10px] font-black text-primary-700 uppercase italic shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none tracking-tighter">Təsnifat Təklifi</p>
                        <p className="text-[11px] font-bold text-primary-600 mt-1 italic shadow-inner italic-none shadow-inner italic-none shadow-inner italic-none tracking-tighter">Sənəd birbaşa **ATƏ Reyestrinə** yönləndiriləcək.</p>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default LvaPurchaseCreate;
