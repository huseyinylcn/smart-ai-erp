import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Search, Filter,
  FileText, CheckCircle2,
  Printer, 
  Trash2,
  Activity, 
  History,
  AlertTriangle,
  Warehouse,
  Barcode,
  Save,
  Info,
  ArrowRight,
  ClipboardList,
  Factory,
  Layers,
  ChevronRight,
  Zap,
  Boxes
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

// --- Types ---
interface MaterialLineItem {
  id: string;
  name: string;
  sku: string;
  normativeQty: number;
  previousIssued: number;
  currentIssue: number;
  warehouseStock: number;
  batchLot?: string;
  unit: string;
}

const MaterialIssueCreate = () => {
  const navigate = useNavigate();
  
  // 1. SETTINGS & CONFIG
  const [tolerancePct] = useState(10); // 10% tolerance from "settings"
  
  // 2. HEADER & STATUS
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`MAT-ISS-${new Date().getFullYear()}-0125`);
  const [productionOrder, setProductionOrder] = useState('PRD-2024-042 (Polo Köynək)');
  const [warehouse, setWarehouse] = useState('Xammal Deposu #1');

  // 3. LINE ITEMS (Simulated population from Production Order)
  const [items, setItems] = useState<MaterialLineItem[]>([
    { id: '1', name: 'Pambıq Parça (Ağ)', sku: 'RAW-001', normativeQty: 1200, previousIssued: 0, currentIssue: 1200, warehouseStock: 2500, unit: 'm', batchLot: 'BT-2024-A1' },
    { id: '2', name: 'Sap (Ağ - 40/2)', sku: 'RAW-002', normativeQty: 50, previousIssued: 10, currentIssue: 40, warehouseStock: 400, unit: 'm', batchLot: 'BT-2024-S5' },
    { id: '3', name: 'Düymə (Plastik)', sku: 'RAW-003', normativeQty: 4000, previousIssued: 0, currentIssue: 4000, warehouseStock: 10000, unit: 'ədəd', batchLot: '' },
  ]);

  // 4. SUMMARY CALCULATIONS
  const summary = useMemo(() => {
    const totalCurrentVal = items.reduce((acc, item) => acc + (item.currentIssue * 1.5), 0); // Mock price 1.5
    const wasteCount = items.filter(i => (i.currentIssue + i.previousIssued) > i.normativeQty).length;
    
    return {
      totalItems: items.length,
      totalCurrentVal,
      wasteCount,
      avgWastePct: wasteCount > 0 ? (wasteCount / items.length) * 100 : 0
    };
  }, [items]);

  // 5. HANDLERS
  const handleUpdateQty = (id: string, field: keyof MaterialLineItem, val: string | number) => {
    if (currentStatus !== 'DRAFT') return;
    setItems(items.map(item => item.id === id ? { ...item, [field]: val } : item));
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
                        <Layers className="w-6 h-6 mr-2 text-amber-500" /> Material Buraxılışı
                    </h1>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">MATERIAL ISSUE</span>
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
                    <span>Buraxılışı Təsdiqlə</span>
                </button>
            ) : (
                <div className="flex items-center space-x-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                    <Save className="w-4 h-4 text-amber-500" />
                    <span>Sənəd Təsdiqlənib</span>
                </div>
            )}
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      {/* 2. OPERATIONAL INFO */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 overflow-hidden relative group">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-end relative z-10">
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center italic">
                      <Factory className="w-3.5 h-3.5 mr-2" /> Bağlı İstehsal Sifarişi
                  </label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <input value={productionOrder} onChange={(e) => setProductionOrder(e.target.value)} placeholder="Sifariş № və ya Məhsul..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner italic uppercase leading-none" />
                  </div>
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                      <Warehouse className="w-3.5 h-3.5 mr-2 text-amber-500" /> Çıxış Anbarı
                  </label>
                  <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner italic uppercase leading-none">
                      <option>Xammal Deposu #1</option>
                      <option>Mərkəzi Anbar</option>
                      <option>Köməkçi Material Deposu</option>
                  </select>
              </div>
              <div className="flex items-center space-x-3 mb-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-dashed border-slate-200">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                      <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block leading-none mb-1">Tolerans Səviyyəsi</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white italic">{tolerancePct}% (Tənzimləmələrdən)</span>
                  </div>
              </div>
          </div>
          <div className="absolute top-[-20px] right-[-20px] w-48 h-48 text-amber-500/5 rotate-12 pointer-events-none group-hover:text-amber-500/10 transition-colors duration-1000">
              <Layers className="w-full h-full" />
          </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MATERIAL GRID */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold min-w-[1000px]">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-8 py-5">Xammal & SKU</th>
                                <th className="px-4 py-5 text-center">Normativ Plan</th>
                                <th className="px-4 py-5 text-center">Öncə Buraxılan</th>
                                <th className="px-4 py-5 text-center text-amber-600">Cari Buraxılış</th>
                                <th className="px-4 py-5 text-center">Batch / Lot №</th>
                                <th className="px-4 py-5 text-center">Tullantı %</th>
                                <th className="px-8 py-5">Vədiyyət</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => {
                                const totalSoFar = item.previousIssued + item.currentIssue;
                                const wastePct = item.normativeQty > 0 ? ((totalSoFar - item.normativeQty) / item.normativeQty) * 100 : 0;
                                const isOverTolerance = wastePct > tolerancePct;
                                const isShortStock = item.warehouseStock < item.currentIssue;

                                return (
                                    <tr key={item.id} className="group hover:bg-amber-50/20 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-tighter">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest opacity-60 flex items-center">
                                                    <Barcode className="w-3 h-3 mr-1" /> {item.sku}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-center text-slate-500 font-mono italic">
                                            {item.normativeQty} {item.unit}
                                        </td>
                                        <td className="px-4 py-5 text-center text-slate-400 text-[10px] font-black uppercase tabular-nums">
                                            {item.previousIssued}
                                        </td>
                                        <td className="px-4 py-5 text-center">
                                            {isEditable ? (
                                                <input 
                                                    type="number" 
                                                    value={item.currentIssue} 
                                                    onChange={(e) => handleUpdateQty(item.id, 'currentIssue', Number(e.target.value))}
                                                    className={`w-24 bg-slate-50 dark:bg-slate-800 border-2 rounded-lg px-2 py-1.5 text-center font-black outline-none transition-all ${isShortStock ? 'border-rose-300 bg-rose-50 text-rose-600' : isOverTolerance ? 'border-amber-300 bg-amber-50 text-amber-600' : 'border-transparent focus:border-amber-200'}`} 
                                                />
                                            ) : (
                                                <span className="text-sm font-black tabular-nums">{item.currentIssue}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-5 text-center">
                                            {isEditable ? (
                                                <input 
                                                    type="text" 
                                                    value={item.batchLot} 
                                                    onChange={(e) => handleUpdateQty(item.id, 'batchLot', e.target.value)}
                                                    placeholder="Batch №"
                                                    className="w-32 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1.5 text-center font-black text-[10px] outline-none" 
                                                />
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest">{item.batchLot || '--'}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-5 text-center">
                                            <span className={`text-[10px] font-black tabular-nums ${wastePct > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                                                {wastePct > 0 ? `+${wastePct.toFixed(1)}%` : '0.0%'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-2">
                                                {isShortStock ? (
                                                    <div className="flex items-center text-rose-500 space-x-1 animate-pulse">
                                                        <AlertTriangle className="w-3.5 h-3.5" />
                                                        <span className="text-[8px] font-black uppercase italic">Stok Yetərsiz</span>
                                                    </div>
                                                ) : isOverTolerance ? (
                                                    <div className="flex items-center text-amber-500 space-x-1">
                                                        <Activity className="w-3.5 h-3.5" />
                                                        <span className="text-[8px] font-black uppercase italic">Yüksək Sərf</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-emerald-500 space-x-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span className="text-[8px] font-black uppercase italic">Ok</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR: ANALYTICS */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8 overflow-hidden relative group">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Buraxılış Analitikası</h3>
                
                <div className="space-y-6">
                    <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 flex flex-col items-center justify-center space-y-2">
                        <span className="text-3xl font-black text-amber-600 tabular-nums">{summary.totalCurrentVal.toLocaleString()} AZN</span>
                        <span className="text-[8px] font-black text-amber-500 uppercase italic">Cari Buraxılış Dəyəri</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 flex flex-col">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase italic">Tullantı Göstəricisi</span>
                                <span className={`text-xs font-black italic ${summary.avgWastePct > tolerancePct ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {summary.avgWastePct.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${summary.avgWastePct > tolerancePct ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(summary.avgWastePct * 5, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center text-amber-600 bg-amber-50 p-4 rounded-2xl space-x-3">
                        <Info className="w-4 h-4" />
                        <p className="text-[9px] font-bold leading-relaxed italic uppercase">
                            Buraxılan materiallar sexin (WIP) balansına oturacaq.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-2">
                        <ClipboardList className="w-5 h-5 text-amber-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter decoration-1 underline-offset-4 underline">Sürətli Əməliyyat</h4>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic opacity-90">
                        Normativ sərf üzrə qalan bütün xammalı bir toxunuşla daxil edin.
                    </p>
                    <button className="w-full py-4 bg-amber-600 hover:bg-amber-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2">
                       <Zap className="w-4 h-4" />
                       <span>Qalanı Doldur (Auto-Fill)</span>
                    </button>
                </div>
                <Boxes className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/5 rotate-12 group-hover:text-amber-500/10 transition-colors duration-700" />
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-4 px-4 items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest mr-8 group flex items-center">
                Cəmi SKU: <span className="text-amber-600 font-black italic ml-2">{summary.totalItems}</span>
              </span>
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-800 transition-all border border-transparent hover:border-slate-200 rounded-xl leading-none">Bağla</button>
              
              <button disabled={!isEditable} className="px-8 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-inner leading-none hover:bg-slate-200 transition-all">
                Draft Saxla
              </button>

              {isEditable && (
                  <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-amber-600/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Buraxılışı Tamamla</span>
                  </button>
              )}
          </div>
      </div>
    </div>
  );
};

export default MaterialIssueCreate;
