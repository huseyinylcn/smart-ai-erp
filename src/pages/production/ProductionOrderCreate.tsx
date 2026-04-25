import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Settings, Clock,
  FileText, CheckCircle2,
  Printer, 
  Trash2,
  Activity, 
  History,
  AlertTriangle,
  Factory,
  Layers,
  Cpu,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  Box,
  ClipboardList,
  Link2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

// --- Types ---
interface BOMItem {
  id: string;
  name: string;
  requiredQty: number;
  availableQty: number;
  unit: string;
}

const ProductionOrderCreate = () => {
  const navigate = useNavigate();
  
  // 1. STATE & TABS
  const [activeTab, setActiveTab] = useState<'general' | 'materials' | 'operations' | 'tracking'>('general');
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  
  // 2. HEADER DATA
  const [docNumber] = useState(`PRD-${new Date().getFullYear()}-042`);
  const [planQty, setPlanQty] = useState(1000);
  const [actualQty, setActualQty] = useState(750);
  const [workshop, setWorkshop] = useState('Sex №3 (Tikiliş)');
  
  // 3. BOM & MATERIALS (Simulated)
  const materials: BOMItem[] = [
    { id: '1', name: 'Pambıq Parça (Ağ)', requiredQty: planQty * 1.2, availableQty: 1500, unit: 'm' },
    { id: '2', name: 'Sap (Ağ - 40/2)', requiredQty: planQty * 0.05, availableQty: 400, unit: 'm' },
    { id: '3', name: 'Düymə (Plastik)', requiredQty: planQty * 4, availableQty: 10000, unit: 'ədəd' },
  ];

  // 4. COST ANALYTICS
  const costSummary = {
    plannedCost: 12.50,
    actualCost: 13.15,
    get variance() { return this.actualCost - this.plannedCost },
    get variancePct() { return (this.variance / this.plannedCost) * 100 }
  };

  const progress = (actualQty / planQty) * 100;
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
                        <Factory className="w-6 h-6 mr-2 text-amber-500" /> İstehsal Sifarişi
                    </h1>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">PRODUCTION ORDER</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic"><Clock className="w-3.5 h-3.5 mr-1 text-amber-500" /> {new Date().toLocaleDateString()}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-right">
            <div className="hidden sm:flex flex-col items-end mr-4">
                <span className="text-[10px] font-black text-slate-400 uppercase italic">Proqres: {Math.round(progress)}%</span>
                <div className="w-32 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            {isEditable ? (
                <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                    <Settings className="w-4 h-4 animate-spin-slow" />
                    <span>Planı Təsdiqlə</span>
                </button>
            ) : (
                <div className="flex items-center space-x-2 px-6 py-2.5 bg-amber-50 text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-amber-100">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>İstehsalatdadır</span>
                </div>
            )}
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      {/* 2. TAB NAVIGATION */}
      <div className="flex items-center space-x-1 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 w-fit">
        {[
          { id: 'general', label: 'Ümumi Məlumat', icon: FileText },
          { id: 'materials', label: 'Xammal (BOM)', icon: Layers },
          { id: 'operations', label: 'Əməliyyatlar', icon: Cpu },
          { id: 'tracking', label: 'Hərəkət İzləmə', icon: Activity },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* TAB CONTENT: GENERAL */}
            {activeTab === 'general' && (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center italic">
                                <Box className="w-3.5 h-3.5 mr-2" /> Hazır Məhsul
                            </label>
                            <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                                <span className="text-sm font-black text-slate-800 dark:text-white uppercase">Polo Köynək (Basic)</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                Variantlar & Konfiqurasiya
                            </label>
                            <div className="flex space-x-2">
                                <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase">XL Ölçü</span>
                                <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase">Göy Rəng</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                <Factory className="w-3.5 h-3.5 mr-2" /> İstehsal Sahəsi
                            </label>
                            <select value={workshop} onChange={(e) => setWorkshop(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner italic uppercase leading-none">
                                <option>Sex №3 (Tikiliş)</option>
                                <option>Sex №1 (Kəsim)</option>
                                <option>Hədəf Workshop</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                <Calendar className="w-3.5 h-3.5 mr-2" /> Plan Tarixləri
                            </label>
                            <div className="flex items-center space-x-4">
                                <input type="date" className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-6 text-xs font-black" />
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                                <input type="date" className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-6 text-xs font-black" />
                            </div>
                        </div>
                        <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-dashed border-slate-200">
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center">
                                    <Link2 className="w-4 h-4 mr-2" /> Bağlı Sənədlər
                                </h4>
                             </div>
                             <div className="flex space-x-3">
                                <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-tight flex items-center hover:bg-amber-50 transition-all">
                                    BOM #1024 <ArrowUpRight className="w-3 h-3 ml-1 text-amber-500" />
                                </button>
                                <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-tight flex items-center hover:bg-amber-50 transition-all">
                                    CALC #992 <ArrowUpRight className="w-3 h-3 ml-1 text-amber-500" />
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: MATERIALS */}
            {activeTab === 'materials' && (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500 relative">
                    <div className="p-8 border-b border-amber-50/50 flex justify-between items-center bg-amber-50/10">
                        <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Xammal Tələbat Siyahısı (BOM Based)</h3>
                        <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                           <Layers className="w-3.5 h-3.5 mr-2 inline" /> Material Çıxışı Yarat
                        </button>
                    </div>
                    <table className="w-full text-left text-xs font-bold">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[9px] font-black truncate uppercase tracking-widest text-slate-400 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5">Material Adı</th>
                                <th className="px-4 py-5 text-center">Tələb Olunan</th>
                                <th className="px-4 py-5 text-center">Faktiki Verilən</th>
                                <th className="px-4 py-5 text-center">Anbar Qalığı</th>
                                <th className="px-4 py-5 text-center">Vahid</th>
                                <th className="px-8 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {materials.map(mat => (
                                <tr key={mat.id} className="group hover:bg-amber-50/20 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-tighter">{mat.name}</span>
                                            <span className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">SKU: RAW-{mat.id}00X</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-center font-mono italic">{mat.requiredQty.toLocaleString()}</td>
                                    <td className="px-4 py-5 text-center font-black text-amber-600">0</td>
                                    <td className={`px-4 py-5 text-center font-mono ${mat.availableQty < mat.requiredQty ? 'text-rose-500' : 'text-slate-400'}`}>
                                        {mat.availableQty.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-5 text-center uppercase text-[10px] text-slate-400">{mat.unit}</td>
                                    <td className="px-8 py-5">
                                        <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase text-center ${mat.availableQty < mat.requiredQty ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {mat.availableQty < mat.requiredQty ? 'Çatışmır' : 'Hazırdır'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            
            {/* 5. Production Analytics */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8 overflow-hidden relative group">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">İstehsalat KPI</h3>
                
                {/* Plan vs Actual Progress */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">{actualQty}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase italic">Faktiki İstehsal</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-sm font-black text-slate-500 tabular-nums">/ {planQty}</span>
                            <span className="text-[9px] font-black text-slate-300 uppercase italic leading-none">Planlandı</span>
                        </div>
                    </div>
                    
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-[8px] font-black py-1 px-2 uppercase rounded-full bg-amber-100 text-amber-600">
                                    Aktivlik: {Math.round(progress)}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100">
                            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500 transition-all duration-1000"></div>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-black text-slate-400 italic">
                            <span>Qalıq: {planQty - actualQty} ədəd</span>
                        </div>
                    </div>
                </div>

                {/* Cost Variance Card */}
                <div className={`pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6 transition-all ${costSummary.variance > 0 ? 'bg-rose-50/30' : ''}`}>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Maya Dəyəri Analizi (Vahid)</h4>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Plan:</span>
                            <span className="text-xs font-black italic">{costSummary.plannedCost.toFixed(2)} AZN</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[10px] font-bold text-amber-600 uppercase">Faktiki:</span>
                            <span className="font-black italic">{costSummary.actualCost.toFixed(2)} AZN</span>
                        </div>
                        
                        <div className={`p-4 rounded-2xl flex flex-col justify-center items-center shadow-inner ${costSummary.variance > 0 ? 'bg-rose-100/50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <div className="flex items-center space-x-1">
                                {costSummary.variance > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                <span className="text-lg font-black italic">{costSummary.variancePct.toFixed(1)}%</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest leading-none mt-1 group-hover:block hidden">Maya Dəyəri Fərqi (Variance)</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center italic">
                            <Info className="w-3.5 h-3.5 mr-1" /> Variance Xəbərdarlığı
                        </h4>
                        <p className="text-[9px] font-bold text-slate-500 leading-relaxed italic">
                            Faktiki maya dəyəri plandan <b className="text-rose-500">4.8%</b> yüksəkdir. Material xərcləri və işçilik saatlarını yoxlayın.
                        </p>
                    </div>
                </div>
                <Factory className="absolute bottom-[-20px] left-2 w-32 h-32 text-amber-500/5 rotate-[-25deg] pointer-events-none" />
            </div>

            {/* Quick Actions Related to Materials */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center space-x-2">
                        <ClipboardList className="w-5 h-5 text-amber-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter underline underline-offset-4 decoration-1 decoration-amber-500/50">Maddi Təminat</h4>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-left px-4 flex justify-between items-center group/btn">
                            <span>Xammal Çıxışı (Issue)</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-left px-4 flex justify-between items-center group/btn">
                            <span>Hazır Məhsul Girişi</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-4 px-4 items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest mr-8 group flex items-center">
                BOM Uyğunluğu: <span className="text-amber-600 font-black italic ml-2">98.5%</span>
                <Info className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-800 transition-all border border-transparent hover:border-slate-200 rounded-xl leading-none">Bağla</button>
              
              <button disabled={!isEditable} className="px-8 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-inner leading-none hover:bg-slate-200 transition-all">
                Sübutu Yadda Saxla
              </button>

              {isEditable && (
                  <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-amber-600/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>İstehsalı Başlat</span>
                  </button>
              )}
          </div>
      </div>
    </div>
  );
};

export default ProductionOrderCreate;
