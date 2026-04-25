import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, 
  CheckCircle2,
  Printer, 
  History,
  AlertTriangle,
  Warehouse,
  Barcode,
  Save,
  Info,
  Factory,
  Layers,
  Zap,
  Boxes,
  PackageCheck,
  ShieldCheck,
  FlaskConical,
  Recycle,
  ClipboardCheck,
  TrendingDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

// --- Types ---
interface ProductionStats {
  goodQty: number;
  defectiveQty: number;
  wasteQty: number;
  semiFinishedQty: number;
}

const ProductionOutputCreate = () => {
  const navigate = useNavigate();
  
  // 1. DATA & STATE
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`PRD-OUT-${new Date().getFullYear()}-0089`);
  const [lotNumber] = useState(`LOT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-001`);
  
  const [productionOrder] = useState('PRD-2024-042 (Polo Köynək)');
  const [productInfo] = useState({ name: 'Polo Köynək (Cotton)', sku: 'FG-001', variant: 'XL / Ağ' });
  
  const [stats, setStats] = useState<ProductionStats>({
    goodQty: 450,
    defectiveQty: 5,
    wasteQty: 2,
    semiFinishedQty: 12
  });

  const [goodWarehouse, setGoodWarehouse] = useState('Hazır Məhsul Anbarı #1');
  const [semiWarehouse, setSemiWarehouse] = useState('Yarımfabrikat Deposu (Uçot)');

  // 2. ANALYTICS CALCULATIONS
  const analytics = useMemo(() => {
    const totalOutput = stats.goodQty + stats.defectiveQty + stats.semiFinishedQty;
    const yieldPct = totalOutput > 0 ? (stats.goodQty / totalOutput) * 100 : 0;
    const defectRate = totalOutput > 0 ? (stats.defectiveQty / totalOutput) * 100 : 0;
    
    return {
      totalOutput,
      yieldPct,
      defectRate,
      isHighDefect: defectRate > 5
    };
  }, [stats]);

  // 3. HANDLERS
  const handleUpdateStat = (field: keyof ProductionStats, val: number) => {
    if (currentStatus !== 'DRAFT') return;
    setStats(prev => ({ ...prev, [field]: val }));
  };

  const isEditable = currentStatus === 'DRAFT';

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-amber-100 dark:border-amber-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-amber-50 transition-all text-slate-400 hover:text-amber-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <PackageCheck className="w-6 h-6 mr-2 text-emerald-500" /> İstehsal Nəticəsi
                    </h1>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">PRODUCTION OUTPUT</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic"><History className="w-3.5 h-3.5 mr-1 text-amber-500" /> {new Date().toLocaleDateString()}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            {isEditable ? (
                <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mədaxili Tamamla</span>
                </button>
            ) : (
                <div className="flex items-center space-x-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                    <Save className="w-4 h-4 text-emerald-500" />
                    <span>Məhsullar Mədaxil Olub</span>
                </div>
            )}
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      {/* 2. CORE PRODUCTION INFO */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 overflow-hidden relative group">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end relative z-10">
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center italic">
                      <Factory className="w-3.5 h-3.5 mr-2" /> İstehsal Sifarişi
                  </label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <input readOnly value={productionOrder} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black outline-none italic uppercase leading-none text-slate-500" />
                  </div>
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                      <Barcode className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Hazır Məhsul
                  </label>
                  <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl py-4 px-6 text-sm font-black italic uppercase leading-none min-h-[52px] flex items-center">
                    {productInfo.name} <span className="text-[10px] ml-2 text-slate-400">({productInfo.sku})</span>
                  </div>
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                      <Layers className="w-3.5 h-3.5 mr-2 text-amber-500" /> Ölçü / Rəng
                  </label>
                  <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl py-4 px-6 text-sm font-black italic uppercase leading-none min-h-[52px] flex items-center">
                    {productInfo.variant}
                  </div>
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                      <Zap className="w-3.5 h-3.5 mr-2 text-amber-500" /> Yeni Partiya (Lot №)
                  </label>
                  <div className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl py-4 px-6 text-sm font-black italic uppercase leading-none min-h-[52px] flex items-center text-amber-600">
                    {lotNumber}
                  </div>
              </div>
          </div>
          <div className="absolute top-[-20px] right-[-20px] w-48 h-48 text-emerald-500/5 rotate-12 pointer-events-none group-hover:text-emerald-500/10 transition-colors duration-1000">
              <PackageCheck className="w-full h-full" />
          </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: OUTPUT QUANTITIES & WAREHOUSING */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* A. QUANTITY SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 relative overflow-hidden">
                <div className="mb-8 flex items-center space-x-3">
                    <ClipboardCheck className="w-5 h-5 text-amber-500" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white italic">Kəmiyyət və Keyfiyyət Göstəriciləri</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[
                        { label: 'Düzgün Məhsul', key: 'goodQty', icon: ShieldCheck, color: 'emerald' },
                        { label: 'Qüsurlu Məhsul', key: 'defectiveQty', icon: AlertTriangle, color: 'rose' },
                        { label: 'Yarımfabrikat', key: 'semiFinishedQty', icon: FlaskConical, color: 'amber' },
                        { label: 'Tullantı (Scrap)', key: 'wasteQty', icon: Recycle, color: 'slate' },
                    ].map((field) => (
                        <div key={field.key} className="space-y-4">
                             <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                    <field.icon className={`w-3.5 h-3.5 mr-2 text-${field.color}-500`} /> {field.label}
                                </label>
                             </div>
                             <div className="relative group">
                                <input 
                                    type="number" 
                                    value={stats[field.key as keyof ProductionStats]} 
                                    onChange={(e) => handleUpdateStat(field.key as keyof ProductionStats, Number(e.target.value))}
                                    className={`w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-5 px-6 text-xl font-black outline-none focus:ring-4 focus:ring-${field.color}-500/10 transition-all text-center tabular-nums leading-none italic ${isEditable ? `hover:bg-${field.color}-50/30 group-focus-within:border-${field.color}-500/30` : 'text-slate-400 pointer-events-none'}`} 
                                />
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* B. LOGISTICS SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-8">
                <div className="flex items-center space-x-3">
                    <Warehouse className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white italic">Mədaxil Anbarları (Uçot)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            Hazır Məhsul Anbarı
                        </label>
                        <select value={goodWarehouse} onChange={(e) => setGoodWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic uppercase leading-none">
                            <option>Hazır Məhsul Anbarı #1</option>
                            <option>Mərkəzi Loqistika Mərkəzi</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            Yarımfabrikat Anbarı
                        </label>
                        <select value={semiWarehouse} onChange={(e) => setSemiWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-amber-500/10 shadow-inner italic uppercase leading-none">
                            <option>Yarımfabrikat Deposu (Uçot)</option>
                            <option>Sex daxili WIP anbar</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR: KPI & QUALITY ANALYSIS */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-10 overflow-hidden relative group">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Keyfiyyət Analizi</h3>
                
                {/* Yield Gauge Card */}
                <div className="relative pt-4 flex flex-col items-center">
                    <div className="relative w-40 h-40">
                        {/* Simple CSS Gauge Visual */}
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                             <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * analytics.yieldPct) / 100} className={`transition-all duration-1000 ${analytics.yieldPct > 95 ? 'text-emerald-500' : 'text-amber-500'}`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-3xl font-black text-slate-800 dark:text-white tabular-nums leading-none tracking-tighter">{analytics.yieldPct.toFixed(1)}%</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase italic mt-1">Məhsuldarlıq (Yield)</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border transition-all duration-500 ${analytics.isHighDefect ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}>
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase italic">Qüsur Faizi</span>
                             <span className={`text-xs font-black italic ${analytics.isHighDefect ? 'text-rose-500' : 'text-slate-500'}`}>{analytics.defectRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TrendingDown className={`w-4 h-4 ${analytics.isHighDefect ? 'text-rose-500 animate-bounce' : 'text-slate-400'}`} />
                            <span className="text-[9px] font-bold text-slate-400 leading-tight italic uppercase">
                                {analytics.isHighDefect ? 'Kollektiv tərəfindən araşdırılmalıdır' : 'Normativ daxilindədir'}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center justify-center space-y-2">
                        <span className="text-2xl font-black text-emerald-600 tabular-nums">{stats.goodQty} Ədəd</span>
                        <span className="text-[8px] font-black text-emerald-500 uppercase italic">Hazır Məhsul Mədaxili</span>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl space-x-3">
                        <Info className="w-4 h-4" />
                        <p className="text-[9px] font-bold leading-relaxed italic uppercase">
                             Mədaxil edildikdən sonra partiya (LOT) avtomatik aktivləşəcək.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-2">
                        <ClipboardCheck className="w-5 h-5 text-amber-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter decoration-1 underline-offset-4 underline italic">İşin Tamamlanması</h4>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic opacity-90">
                        Bu sənəd sifariş üzrə sonuncu çıxışdırsa, sifarişi qapamaq olar.
                    </p>
                    <label className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-3 border border-slate-700 active:scale-95">
                       <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500" />
                       <span>Final Çıxış (Sifarişi Qapa)</span>
                    </label>
                </div>
                <Boxes className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/5 rotate-12 group-hover:text-amber-500/10 transition-colors duration-700" />
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-4 px-4 items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest mr-8 group flex items-center">
                Məhsul SKU: <span className="text-emerald-600 font-black italic ml-2">{productInfo.sku}</span>
              </span>
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-800 transition-all border border-transparent hover:border-slate-200 rounded-xl leading-none">Bağla</button>
              
              <button disabled={!isEditable} className="px-8 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-inner leading-none hover:bg-slate-200 transition-all">
                Draft Saxla
              </button>

              {isEditable && (
                  <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-amber-600/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mədaxili Tamamla</span>
                  </button>
              )}
          </div>
      </div>
    </div>
  );
};

export default ProductionOutputCreate;
