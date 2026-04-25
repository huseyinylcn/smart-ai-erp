import { useState } from 'react';
import { 
  ArrowLeft, Package, Barcode, Tag, 
  ShieldCheck, History, Info, 
  Plus, Save, CheckCircle2, 
  Archive, HardDrive, Truck, Ruler, Calculator, Globe, Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  
  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-primary-100 dark:border-primary-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-primary-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                        <Package className="w-6 h-6 mr-2 text-primary-500" /> Yeni Məhsul / Xidmət
                    </h1>
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-600 border border-primary-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">INVENTORY / SKP</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>SKU: ART-NX-2026-05</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic underline decoration-primary-500/30 underline-offset-4">E-QAİMƏ UYĞUNLUĞU</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest italic hover:bg-slate-200 transition-all">
                <History className="w-4 h-4" />
                <span>Tarixçə</span>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 active:scale-95 leading-none">
                <Save className="w-4 h-4" />
                <span>Təsdiq Et və Arxivlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN - Product specs */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Core Identification */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                    <Info className="w-4 h-4 mr-2 text-primary-500" /> Əsas Parametrlər
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic text-primary-600">
                             Məhsulun / Xidmətin Tam Adı (Qaimədə çıxan ad)
                        </label>
                        <input type="text" placeholder="Məs: MacBook Pro 16&quot; M3 Max 32GB/1TB Silver" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-primary-500/10" />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center italic">
                             Malın/Xidmətin Vergi Kodu (İnternet Vergi İdarəsi)
                        </label>
                        <div className="relative group">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-300" />
                            <select className="w-full bg-rose-50/30 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-rose-500/10 appearance-none">
                                <option value="">Vergi Kodunu Seçin...</option>
                                <option value="70.22.11">70.22.11 - Biznes mərkəzlərinin xidmətləri</option>
                                <option value="62.01.11">62.01.11 - Proqram təminatı işlənməsi</option>
                                <option value="46.43.11">46.43.11 - Məişət elektrik mallarının topdan satışı</option>
                                <option value="47.41.11">47.41.11 - Kompüterlərin pərakəndə satışı (Müsadirə və s.)</option>
                                <option value="99.00.00">Bundan başqa qalan mallar</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Plus className="w-4 h-4 text-rose-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                             GTIN / Qlobal İdentifikasiya Nömrəsi
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="text" placeholder="869..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-primary-500/10" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                             Barkod / UPC
                        </label>
                        <div className="relative">
                            <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="text" placeholder="0123456789012" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-primary-500/10" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                             Məhsul Tipi
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                             <button className="py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase italic shadow-lg shadow-primary-500/20">Stoklanan</button>
                             <button className="py-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase italic">Xidmət</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Warehouse & Units */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <Ruler className="w-4 h-4 mr-2 text-primary-500" /> Anbar və Ölçü Vahidləri
                    </h3>
                    <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg text-[9px] font-black uppercase italic border border-indigo-100/50">Tutumu Hesabla</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                             Əsas Ölçü Vahidi
                        </label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-primary-500/10">
                            <option>Ədəd (Pcs)</option>
                            <option>Kiloqram (Kg)</option>
                            <option>Metr (M)</option>
                            <option>Litr (L)</option>
                            <option>Metr-kub (M3)</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic text-indigo-500">
                             Default Anbar
                        </label>
                        <div className="relative">
                             <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/10">
                                <option>Mərkəzi Anbar (Main)</option>
                                <option>İstehsalat Anbarı</option>
                                <option>Gəncə Filial Anbarı</option>
                             </select>
                        </div>
                    </div>

                    {/* VOLUME CALCULATION SECTION */}
                    <div className="col-span-2 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Maximize2 className="w-4 h-4 text-indigo-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Təqribi Həcm (m³ Analitika üçün)</span>
                            </div>
                            <Info className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-400 uppercase italic">Paket Miqdarı (Batch)</label>
                                <input 
                                    type="number" 
                                    defaultValue="1"
                                    className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-xs font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/10" 
                                    placeholder="Məs: 100"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-400 uppercase italic">Paket Həcmi (m³)</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-xs font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/10" 
                                    placeholder="Məs: 0.05"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-indigo-400 uppercase italic">Vahid Həcmi (Nəticə)</label>
                                <div className="w-full bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl py-3 px-4 text-xs font-black italic text-indigo-600">
                                    0.000 m³
                                </div>
                            </div>
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase italic tracking-tighter leading-tight">
                            * Qeyd: Kiçik məhsullar üçün paket miqdarını artırıb ümumi həcmi yazın. Sistem avtomatik 1 vahidin həcmini hesablayacaq.
                        </p>
                    </div>
                </div>
            </div>

        </div>

        {/* RIGHT SIDEBAR - Pricing & Tax */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
            
            {/* Sales Pricing Card */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 italic">Qiymət Strategiyası</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-slate-500 italic">Satış Qiyməti (AZN)</label>
                             <div className="flex items-center">
                                <span className="text-3xl font-black italic tracking-tighter tabular-nums mr-2 text-primary-500">₼</span>
                                <input type="number" placeholder="100.00" className="bg-transparent border-none p-0 text-3xl font-black italic tracking-tighter tabular-nums outline-none w-full" />
                             </div>
                        </div>
                        <div className="w-full h-[1px] bg-white/5"></div>
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-500 uppercase tracking-widest italic tracking-tighter">ƏDV Dərəcəsi:</span>
                            <span className="font-black italic text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20">% 18</span>
                        </div>
                    </div>
                </div>
                <Tag className="absolute bottom-[-20px] right-2 w-32 h-32 text-primary-500/5 rotate-[-15deg] group-hover:scale-110 transition-transform" />
            </div>

            {/* Calculations Module */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-sm relative overflow-hidden">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic text-primary-600">
                    <Calculator className="w-3.5 h-3.5 mr-2" /> Marja Analizi
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase italic leading-none">Maliyyə Maya Dəyəri</span>
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 italic tabular-nums">₼ 0.00</span>
                    </div>
                     <div className="flex items-center justify-between p-4 bg-primary-50/50 dark:bg-primary-900/10 rounded-2xl border border-dashed border-primary-200">
                        <span className="text-[10px] font-black text-primary-600 uppercase italic">Gözlənilən Marja</span>
                        <span className="text-lg font-black text-primary-600 italic">0%</span>
                    </div>
                </div>
            </div>

            {/* Attributes/Variants */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-slate-500 tracking-tighter">Variantlar & Attributlar</label>
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase italic underline underline-offset-8 cursor-pointer hover:text-primary-600 transition-colors">
                        <span>Rəng Seçimi</span>
                        <Plus className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase italic underline underline-offset-8 cursor-pointer hover:text-primary-600 transition-colors">
                        <span>Ölçü (Size Matrix)</span>
                        <Plus className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl h-[90px] transition-all">
          <div className="flex space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-800 transition-all italic underline underline-offset-8">Vazkeç</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20 active:scale-95 transition-all flex items-center space-x-3 leading-none italic">
                 <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                 <span>Məhsulu Kataloqa Daxil Et</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default ProductCreate;
