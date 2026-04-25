import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, CheckCircle2, Printer, History, AlertTriangle, 
  Warehouse, Barcode, Save, Info, Factory, Layers, Zap, Boxes, 
  ClipboardList, Calculator, DollarSign, Activity, TrendingUp, 
  Settings, Clock, Copy, Trash2, ChevronRight, PieChart, Users, ZapOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

interface MaterialCost {
    id: string;
    sku: string;
    name: string;
    unit: string;
    normativeQty: number;
    wasteRate: number;
    unitPrice: number;
    method: 'WAC' | 'FIFO' | 'LIFO';
}

interface LaborOp {
    id: string;
    opName: string;
    center: string;
    hours: number;
    hourlyRate: number;
}

const CostCalculationCreate = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'MATERIALS' | 'LABOR' | 'OVERHEADS' | 'SUMMARY'>('MATERIALS');
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  
  // 1. HEADER DATA
  const [costingMethod] = useState<'WAC' | 'FIFO' | 'LIFO'>('WAC'); // Simulated setting
  const [productInfo] = useState({ name: 'Polo Köynək (Cotton V-Neck)', sku: 'FG-001', variant: 'L / Göy', version: 'V1.04' });
  const [dates] = useState({ from: '2024-01-01', to: '2024-12-31' });

  // 2. COMPONENT STATES
  const [materials, setMaterials] = useState<MaterialCost[]>([
    { id: '1', sku: 'RAW-001', name: 'Cotton Fabric', unit: 'm', normativeQty: 1.2, wasteRate: 5, unitPrice: 12.50, method: costingMethod },
    { id: '2', sku: 'RAW-002', name: 'Thread (Blue)', unit: 'm', normativeQty: 25, wasteRate: 2, unitPrice: 0.05, method: costingMethod },
  ]);

  const [labor, setLabor] = useState<LaborOp[]>([
    { id: 'L1', opName: 'Kəsim (Cutting)', center: 'Sex #1', hours: 0.2, hourlyRate: 15 },
    { id: 'L2', opName: 'Tikiş (Sewing)', center: 'Sex #2', hours: 0.8, hourlyRate: 12 },
  ]);

  const [overheads, setOverheads] = useState({ energy: 0.85, amort: 1.20, manualOther: 0.50 });

  // 3. CALCULATION LOGIC
  const costs = useMemo(() => {
    const materialTotal = materials.reduce((acc, m) => acc + (m.normativeQty * (1 + m.wasteRate / 100) * m.unitPrice), 0);
    const laborTotal = labor.reduce((acc, l) => acc + (l.hours * l.hourlyRate), 0);
    const overheadsTotal = overheads.energy + overheads.amort + overheads.manualOther;
    const total = materialTotal + laborTotal + overheadsTotal;
    
    return { materialTotal, laborTotal, overheadsTotal, total };
  }, [materials, labor, overheads]);

  const isEditable = currentStatus === 'DRAFT';

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER SECTION */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-indigo-100 dark:border-indigo-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <Calculator className="w-6 h-6 mr-2 text-indigo-500" /> Məhsul Kalkulyasiyası
                    </h1>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">COST CALCULATION</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Versiya: {productInfo.version}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic uppercase"><Clock className="w-3.5 h-3.5 mr-1 text-indigo-500" /> {dates.from} / {dates.to}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                <Copy className="w-4 h-4" /> <span>Versiyanı Klonla</span>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            {isEditable ? (
                <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Kalkulyasiyanı Təsdiqlə</span>
                </button>
            ) : (
                <div className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Aktiv Kalkulyasiya</span>
                </div>
            )}
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      {/* PRODUCT CONTEXT CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative overflow-hidden group">
          <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Hazır Məhsul & SKU</label>
              <div className="flex items-center space-x-2">
                  <PackageCheck className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-black uppercase text-slate-800 dark:text-white italic">{productInfo.name} <span className="text-[10px] text-slate-400">({productInfo.sku})</span></span>
              </div>
          </div>
          <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Variant (Ölçü / Rəng)</label>
              <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-black uppercase text-slate-800 dark:text-white italic">{productInfo.variant}</span>
              </div>
          </div>
          <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Hesablama Metodu</label>
              <div className="flex items-center space-x-2 group/method">
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic">
                    {costingMethod} (Setting)
                  </div>
                  <Settings className="w-3.5 h-3.5 text-slate-300 group-hover/method:rotate-90 transition-transform duration-500" />
              </div>
          </div>
          <div className="space-y-2">
             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Maya Dəyəri Statusu</label>
             <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${isEditable ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{currentStatus}</span>
             </div>
          </div>
          <Calculator className="absolute top-[-20px] right-[-20px] w-48 h-48 text-indigo-500/5 rotate-12 pointer-events-none group-hover:text-indigo-500/10 transition-colors duration-1000" />
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* TABBED CONTENT */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* TAB NAV */}
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[1.5rem] w-fit">
                {[
                    { id: 'MATERIALS', label: 'Materiallar', icon: Boxes },
                    { id: 'LABOR', label: 'Əmək & Proseslər', icon: Users },
                    { id: 'OVERHEADS', label: 'Qaimə & Enerji', icon: Zap },
                    { id: 'SUMMARY', label: 'Analitika', icon: PieChart },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px]">
                {activeTab === 'MATERIALS' && (
                    <div className="animate-in slide-in-from-left-4 duration-500">
                        <table className="w-full text-left text-xs font-bold">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-5">Xammal (BOM)</th>
                                    <th className="px-4 py-5 text-center">Vahid</th>
                                    <th className="px-4 py-5 text-center">Normativ</th>
                                    <th className="px-4 py-5 text-center">Tullantı %</th>
                                    <th className="px-4 py-5 text-center">Vahid Qiymət ({costingMethod})</th>
                                    <th className="px-8 py-5 text-right">Məbləğ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {materials.map(m => (
                                    <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-tighter">{m.name}</span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest opacity-60 italic">{m.sku}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-center font-mono italic text-slate-400 lowercase">{m.unit}</td>
                                        <td className="px-4 py-5 text-center font-black italic">{m.normativeQty}</td>
                                        <td className="px-4 py-5 text-center">
                                            <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black">{m.wasteRate}%</span>
                                        </td>
                                        <td className="px-4 py-5 text-center font-black tabular-nums">{m.unitPrice.toFixed(2)} AZN</td>
                                        <td className="px-8 py-5 text-right font-black text-slate-800 dark:text-white tabular-nums">
                                            {(m.normativeQty * (1 + m.wasteRate / 100) * m.unitPrice).toFixed(2)} AZN
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30">
                            <button className="flex items-center space-x-2 px-6 py-2.5 bg-white dark:bg-slate-800 text-indigo-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-100 dark:border-slate-800 hover:bg-indigo-50 hover:border-indigo-100 transition-all">
                                <Search className="w-4 h-4" /> <span>Resepturadan Yüklə (BOM Auto-fill)</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'LABOR' && (
                    <div className="p-8 space-y-8 animate-in slide-in-from-left-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {labor.map(l => (
                                <div key={l.id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex justify-between items-center group relative overflow-hidden">
                                     <div className="relative z-10">
                                        <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 block">{l.center}</span>
                                        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase italic">{l.opName}</h4>
                                        <div className="mt-4 flex items-center space-x-6">
                                            <div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase block">Vaxt (Saat)</span>
                                                <span className="text-sm font-black italic tabular-nums">{l.hours}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase block">Saatlıq Tarif</span>
                                                <span className="text-sm font-black italic tabular-nums">{l.hourlyRate} AZN</span>
                                            </div>
                                        </div>
                                     </div>
                                     <div className="relative z-10 text-right">
                                         <span className="text-[9px] font-black text-slate-400 uppercase block mb-1 italic">Vahid Əmək Xərci</span>
                                         <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{(l.hours * l.hourlyRate).toFixed(2)} AZN</span>
                                     </div>
                                     <Users className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-indigo-500/5 rotate-12 group-hover:text-indigo-500/10 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* SUMMARY RADIUS CARDS */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className="bg-indigo-600 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col items-center">
                    <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest italic mb-6">Planlanan Maya Dəyəri</label>
                    <div className="text-5xl font-black tracking-tighter tabular-nums mb-2 flex items-baseline">
                        {costs.total.toFixed(2)} <span className="text-xl ml-2 text-indigo-300">AZN</span>
                    </div>
                    <div className="px-4 py-1.5 bg-white/10 rounded-full text-[9px] font-black uppercase flex items-center italic">
                        <TrendingUp className="w-3.5 h-3.5 mr-2 text-indigo-200" /> +2.5% Öncəki versiya
                    </div>
                </div>
                <Calculator className="absolute top-[-40px] left-[-40px] w-64 h-64 text-white/5 rotate-12" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Xərc Bölüşdürülməsi</h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="text-slate-400 italic italic">Material</span>
                            <span className="text-indigo-500">{(costs.materialTotal / costs.total * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${costs.materialTotal / costs.total * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="text-slate-400 italic italic">Əmək Xərci</span>
                            <span className="text-amber-500">{(costs.laborTotal / costs.total * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${costs.laborTotal / costs.total * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-amber-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter decoration-1 underline-offset-4 underline italic">Marja Analitikası</h4>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-black italic uppercase">Satış Qiyməti</span>
                        <span className="font-black tabular-nums tracking-tighter italic">24.50 AZN</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[10px] font-black italic uppercase">Gözlənilən Marja</span>
                        <span className="text-emerald-400 text-lg font-black tabular-nums tracking-tighter italic">+{(24.50 - costs.total).toFixed(2)} AZN</span>
                    </div>
                </div>
                <Activity className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/5 rotate-12 group-hover:text-emerald-500/10 transition-colors duration-700" />
            </div>
        </div>
      </div>

    </div>
  );
};

// Mock subcomponents
const PackageCheck = ({ className }: { className?: string }) => <CheckCircle2 className={className} />;
const ShieldCheck = ({ className }: { className?: string }) => <CheckCircle2 className={className} />;

export default CostCalculationCreate;
