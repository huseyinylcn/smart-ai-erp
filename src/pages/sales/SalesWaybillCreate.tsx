import { useState } from 'react';
import { 
  ArrowLeft, Search, CheckCircle2, 
  Save, Info, FileText, 
  Calendar, User, ShieldCheck, 
  Truck, Package, MapPin, 
  Navigation, UserCheck, 
  Printer, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

interface WaybillItem {
  id: string;
  name: string;
  sku: string;
  shippedQty: number;
  unit: string;
  weight?: string;
}

const SalesWaybillCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`SWB-${new Date().getFullYear()}-0215`);
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const [items] = useState<WaybillItem[]>([
    { id: '1', name: 'Logitech MX Master 3S', sku: 'IT-ACC-001', shippedQty: 5, unit: 'ədəd', weight: '0.8 kg' },
    { id: '2', name: 'Dell UltraSharp 27" 4K', sku: 'IT-MON-042', shippedQty: 2, unit: 'ədəd', weight: '12.4 kg' },
  ]);

  const isEditable = currentStatus === 'DRAFT';

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-sky-100 dark:border-sky-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-sky-50 transition-all text-slate-400 hover:text-sky-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                        <FileText className="w-6 h-6 mr-2 text-sky-500" /> Satış Qaiməsi
                    </h1>
                    <span className="px-2.5 py-1 bg-sky-50 text-sky-600 border border-sky-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">DELIVERY NOTE / WAYBILL</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic uppercase"><Calendar className="w-3.5 h-3.5 mr-1 text-sky-500" /> {date}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            {isEditable ? (
                <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-sky-600 text-white hover:bg-sky-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-sky-500/20 active:scale-95">
                    <Truck className="w-4 h-4" />
                    <span>Qaiməni Təsdiqlə</span>
                </button>
            ) : (
                <div className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Mal Təhvil Verilib</span>
                </div>
            )}
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* SOL SÜTUN: LOGİSTİKA VƏ MƏHSUL SİYAHISI */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* LOGİSTİKA PANELİ */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-10 relative overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <User className="w-3.5 h-3.5 mr-2 text-sky-500" /> Müştəri və Ünvan
                        </label>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-black italic uppercase">Kapital Bank ASC</span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center tracking-tight uppercase leading-none mt-1">
                                <MapPin className="w-3 h-3 mr-1 text-rose-500" /> Bakı ş., Badamdar qəs., 23
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Truck className="w-3.5 h-3.5 mr-2 text-sky-500" /> Sürücü və Nəqliyyat
                        </label>
                        <div className="relative group">
                            <input placeholder="Sürücü adı və ya Nömrə nişanı..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-sky-500/10 shadow-inner italic uppercase leading-none" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Package className="w-3.5 h-3.5 mr-2 text-sky-500" /> Çıxış Anbarı
                        </label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-sky-500/10 shadow-inner italic uppercase leading-none">
                            <option>Əsas Anbar (Mərkəz)</option>
                            <option>Gəncə Filial Anbarı</option>
                            <option>Sumqayıt Depo</option>
                        </select>
                    </div>

                    <div className="col-span-1 lg:col-span-3 h-[1px] bg-sky-50 dark:bg-sky-900/20"></div>

                    <div className="flex items-center space-x-6 col-span-1 lg:col-span-3">
                         <div className="flex items-center space-x-3 bg-sky-50/50 dark:bg-sky-900/10 px-6 py-4 rounded-2xl border border-sky-100 dark:border-sky-900/30">
                            <Navigation className="w-5 h-5 text-sky-600" />
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase italic">Marşrut</p>
                                <p className="text-[11px] font-black text-sky-700 dark:text-sky-400 uppercase italic">Bakı - Sumqayıt Magistralı</p>
                            </div>
                         </div>
                         <div className="flex items-center space-x-3 bg-amber-50/50 dark:bg-amber-900/10 px-6 py-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                            <UserCheck className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase italic">Təhvil Alan</p>
                                <p className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase italic">Məsul Şəxs Tələb Olunur</p>
                            </div>
                         </div>
                    </div>
                </div>
                
                <Truck className="absolute top-[-30px] right-[-30px] w-56 h-56 text-sky-500/5 -rotate-12 pointer-events-none" />
            </div>

            {/* MƏHSUL SİYAHISI ÇIXIŞI */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-sky-50 dark:border-sky-900/20 bg-sky-50/10 dark:bg-sky-900/5">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic flex items-center">
                        <Package className="w-4 h-4 mr-2 text-sky-600" /> Daşınacaq Malların Siyahısı
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Məhsulun Adı</th>
                                <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Miqdar (Qaimə)</th>
                                <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Ölçü vahidi</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Çəki (Təxmini)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => (
                                <tr key={item.id} className="group hover:bg-sky-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 dark:text-white text-sm italic">{item.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.sku}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-right tabular-nums font-black text-sky-600 text-base italic">{item.shippedQty}</td>
                                    <td className="px-4 py-6 text-right font-black text-slate-500 uppercase italic">{item.unit}</td>
                                    <td className="px-8 py-6 text-right tabular-nums font-black text-slate-400 italic">
                                        {item.weight || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* SAĞ SÜTUN: STATUS VƏ İMZA */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className="bg-sky-600 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10 space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-200 italic">Yükün Vəziyyəti</h3>
                        <p className="text-2xl font-black italic tracking-tighter uppercase leading-tight">Yükləməyə Hazırdır</p>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase italic text-sky-200">
                            <span>Sətir Sayı</span>
                            <span>{items.length} Sənəd</span>
                        </div>
                        <div className="h-[1px] bg-white/20"></div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase italic text-sky-200">
                            <span>Yekun Çəki</span>
                            <span>13.2 KG</span>
                        </div>
                    </div>
                 </div>
                 <Package className="absolute bottom-[-10px] right-[-10px] w-32 h-32 text-white/10 -rotate-12" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6 italic">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                    <Info className="w-3.5 h-3.5 mr-2 text-sky-500" /> Təhlükəsizlik
                </h4>
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase italic">Sığortalı Yük</p>
                    <p className="text-[9px] font-bold text-slate-500 italic leading-relaxed uppercase mt-1">Bu yük daşınma zamanı tam sığortalıdır və zədələnmə halında kompensasiya nəzərdə tutulur.</p>
                </div>
            </div>

            {/* Vizual İmza Sahəsi */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 text-center space-y-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Müştəri İmzası (Təhvil alan)</p>
                <div className="h-24 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center italic text-slate-300 text-[10px] font-black uppercase">
                    E-İmza və ya Fiziki İmza
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 p-6 flex justify-end items-center z-40 h-[90px]">
          <div className="flex space-x-4 px-4 items-center">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-[10px] uppercase italic">Ləğv Et</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-xl font-black text-[10px] uppercase shadow-2xl active:scale-95 transition-all flex items-center space-x-2">
                 <Truck className="w-4 h-4" />
                 <span>Yola Sal (Dispatch)</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default SalesWaybillCreate;
