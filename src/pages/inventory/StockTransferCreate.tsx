import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Warehouse, Clock,
  FileText, CheckCircle2,
  Printer, 
  Trash2,
  ArrowRightLeft, 
  History,
  AlertTriangle,
  MapPin,
  Truck,
  PackageSearch,
  CheckCheck,
  Info,
  Eye,
  BookOpen
} from 'lucide-react';
import JournalPreviewModal from '../../components/JournalPreviewModal';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { hasPermission } from '../../utils/permissionHelper';

// --- Types ---
interface TransferLineItem {
  id: string;
  name: string;
  sourceStock: number;   // Current stock in source warehouse
  transferQty: number;   // Quantity being moved
  receivedQty: number;   // Quantity actually received (in detail mode)
  unit: string;
}

const StockTransferCreate = () => {
  const navigate = useNavigate();
  
  // 1. HEADER & STATUS
  // In a real app, this would be fetched from an API based on an ID
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`TRF-${new Date().getFullYear()}-1045`);
  const [docDate] = useState(new Date().toISOString().split('T')[0]);

  // 2. DOCUMENT INFO
  const [sourceWarehouse, setSourceWarehouse] = useState('Əsas Anbar');
  const [targetWarehouse, setTargetWarehouse] = useState('Yevlax Filialı');
  const [reason, setReason] = useState('Ehtiyatların tamamlanması');

  // 3. TRANSFER ITEMS
  const [items, setItems] = useState<TransferLineItem[]>([
    {
      id: '1',
      name: 'Monitor LG UltraWide 34"',
      sourceStock: 12,
      transferQty: 5,
      receivedQty: 0,
      unit: 'ədəd'
    },
    {
      id: '2',
      name: 'Keyboard Mechanical RGB',
      sourceStock: 45,
      transferQty: 10,
      receivedQty: 0,
      unit: 'ədəd'
    }
  ]);
  const [isJournalVisible, setIsJournalVisible] = useState(false);

  // 4. SUMMARY CALCULATIONS
  const summary = useMemo(() => {
    return {
      skuCount: items.length,
      totalQty: items.reduce((acc, item) => acc + item.transferQty, 0),
      hasError: sourceWarehouse === targetWarehouse
    };
  }, [items, sourceWarehouse, targetWarehouse]);

  // HELPERS
  const handleUpdateQty = (id: string, qty: number) => {
    if (currentStatus !== 'DRAFT') return;
    setItems(items.map(item => {
        if (item.id === id) {
            return { ...item, transferQty: Math.min(qty, item.sourceStock) };
        }
        return item;
    }));
  };

  const handleReceive = () => {
    // In a real app, this would open a dialog or update received quantities
    setCurrentStatus('POSTED');
  };

  const isEditable = currentStatus === 'DRAFT';

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-cyan-100 dark:border-cyan-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-cyan-50 transition-all text-slate-400 hover:text-cyan-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <ArrowRightLeft className="w-6 h-6 mr-2 text-cyan-500" /> Transfer
                    </h1>
                    <span className="px-2.5 py-1 bg-cyan-50 text-cyan-600 border border-cyan-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">STOCK TRANSFER</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic"><Clock className="w-3.5 h-3.5 mr-1 text-cyan-500" /> {docDate}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center text-cyan-600 font-black tracking-tighter"><Warehouse className="w-3 h-3 mr-1" /> {sourceWarehouse} → {targetWarehouse}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasPermission('FINANCE', 'view') && (
                <button onClick={() => navigate(`/finance/transaction/TRX-2026-902`)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-emerald-50 transition-all text-emerald-400 hover:text-emerald-600 shadow-sm" title="Müxabirləşməyə bax">
                    <BookOpen className="w-5 h-5" />
                </button>
            )}
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            {isEditable ? (
                <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-cyan-600 text-white hover:bg-cyan-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20 active:scale-95 leading-none">
                    <Truck className="w-4 h-4" />
                    <span>Yola Sal</span>
                </button>
            ) : (
                <div className="flex items-center space-x-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                    <CheckCheck className="w-4 h-4 text-cyan-500" />
                    <span>Sənəd Təsdiqlənib</span>
                </div>
            )}
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* 2. Logistics Routing */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 relative overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-center relative z-10">
                    
                    {/* Source */}
                    <div className="lg:col-span-5 space-y-4">
                        <label className="text-[10px] font-black text-cyan-600 uppercase tracking-widest flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-2" /> Göndərən Anbar
                        </label>
                        {isEditable ? (
                            <select value={sourceWarehouse} onChange={(e) => setSourceWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-6 text-xs font-black outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-inner">
                                <option>Əsas Anbar</option>
                                <option>Xammal Anbarı</option>
                                <option>Gəncə Regional Ofis</option>
                            </select>
                        ) : (
                            <div className="w-full bg-cyan-50/50 dark:bg-cyan-900/10 rounded-2xl p-4 border border-cyan-100 dark:border-cyan-900/20">
                                <span className="text-sm font-black text-slate-800 dark:text-white uppercase">{sourceWarehouse}</span>
                            </div>
                        )}
                    </div>

                    {/* Transfer Icon */}
                    <div className="lg:col-span-2 flex justify-center py-4">
                        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center text-cyan-600 animate-pulse-slow ring-8 ring-cyan-50 dark:ring-cyan-900/10">
                            <ArrowRightLeft className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Target */}
                    <div className="lg:col-span-5 space-y-4">
                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center">
                            <Warehouse className="w-3.5 h-3.5 mr-2" /> Qəbul Edən Anbar
                        </label>
                        {isEditable ? (
                            <select value={targetWarehouse} onChange={(e) => setTargetWarehouse(e.target.value)} className={`w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-6 text-xs font-black outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner ${summary.hasError ? 'ring-2 ring-rose-500/50 text-rose-500' : ''}`}>
                                <option>Yevlax Filialı</option>
                                <option>Xaçmaz Deposu</option>
                                <option>Bakı Mağazası (Nərimanov)</option>
                            </select>
                        ) : (
                            <div className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/20">
                                <span className="text-sm font-black text-slate-800 dark:text-white uppercase">{targetWarehouse}</span>
                            </div>
                        )}
                    </div>
                </div>

                {summary.hasError && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center space-x-3 text-[10px] font-black uppercase tracking-tight animate-bounce">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Mənbə və Hədəf anbar eyni ola bilməz!</span>
                    </div>
                )}

                {/* Logistics Context */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-8 items-center">
                    <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase">
                        <FileText className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Səbəb:</span>
                        {isEditable ? (
                            <input value={reason} onChange={(e) => setReason(e.target.value)} className="bg-transparent border-b border-dashed border-slate-200 focus:border-cyan-500 outline-none px-1 text-slate-800 dark:text-white" />
                        ) : (
                            <span className="text-slate-800 dark:text-white italic">{reason}</span>
                        )}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50/50 dark:bg-cyan-900/10 rounded-full blur-3xl -mr-32 -mt-32 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>

            {/* 3. Items Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
                <div className="p-6 border-b border-cyan-50 dark:border-cyan-900/20 bg-cyan-50/20 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center">
                        <History className="w-4 h-4 mr-2 text-cyan-600" /> Transfer Siyahısı
                    </h3>
                    {isEditable && (
                        <button className="flex items-center space-x-1 px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                            <PackageSearch className="w-3.5 h-3.5 mr-1" />
                            <span>Məhsul Seç</span>
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold min-w-[900px]">
                        <thead className="bg-white dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-8 py-5">Məhsul</th>
                                <th className="px-4 py-5 text-center">Mənbə Qalığı</th>
                                <th className="px-4 py-5 text-center text-cyan-600">Transfer Miqdarı</th>
                                <th className="px-4 py-5 text-center">Vahid</th>
                                <th className="px-4 py-5 text-center bg-slate-50/50 dark:bg-slate-800/50">Qəbul Miqdarı</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => (
                                <tr key={item.id} className="group hover:bg-cyan-50/20 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-800 dark:text-white">{item.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest opacity-60">ID #8221{item.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-center text-slate-500 font-mono italic">{item.sourceStock}</td>
                                    <td className="px-4 py-5 text-center">
                                        {isEditable ? (
                                            <div className="flex flex-col items-center space-y-1">
                                                <input 
                                                    type="number" 
                                                    value={item.transferQty} 
                                                    onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                                                    className="w-20 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-cyan-200 rounded-lg px-2 py-1.5 text-center font-black outline-none transition-all" 
                                                />
                                                {item.transferQty === item.sourceStock && <span className="text-[7px] font-black text-amber-500 uppercase italic">Stock Limit</span>}
                                            </div>
                                        ) : (
                                            <span className="text-sm font-black tabular-nums">{item.transferQty}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-5 text-center uppercase text-[10px] text-slate-400">{item.unit}</td>
                                    <td className="px-4 py-5 text-center bg-slate-50/50 dark:bg-slate-800/50">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-sm font-black tabular-nums ${currentStatus === 'POSTED' ? 'text-amber-500' : 'text-slate-300'}`}>
                                                {currentStatus === 'POSTED' ? '--' : item.receivedQty}
                                            </span>
                                            {currentStatus === 'POSTED' && <span className="text-[7px] font-black uppercase text-amber-500/50 italic">Yoldadır</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {isEditable && <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            
            {/* Transfer Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8 overflow-hidden relative group">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transfer Xülasəsi</h3>
                
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center text-cyan-600">
                           <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">{summary.skuCount}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase italic">Cəmi Çeşid (SKU)</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                           <History className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">{summary.totalQty}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase italic">Ümumi Miqdar</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center italic">
                            <Info className="w-3.5 h-3.5 mr-1" /> Logistika Sistemi
                        </h4>
                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                            Transfer təsdiq edildikdə mallar "Anbarda Yox" (Out of Stock) və "Məsuliyyətə Göndərildi" statusu alacaq.
                        </p>
                    </div>
                </div>
                <ArrowRightLeft className="absolute bottom-[-20px] left-2 w-32 h-32 text-cyan-500/5 rotate-[-25deg] pointer-events-none" />
            </div>

            {/* RECEIVE ACTION CARD (Only visible if Shipped) */}
            {currentStatus === 'POSTED' && (
                <div className="bg-indigo-600 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden animate-pulse-slow">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center space-x-2">
                            <Truck className="w-6 h-6 animate-bounce" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter decoration-1 underline-offset-4 underline">Gözlənilən Qəbul</h4>
                        </div>
                        <p className="text-[11px] font-bold text-indigo-100 leading-relaxed italic opacity-90">
                            Mallar hədəf anbara çatdıqda aşağıdakı düyməni sıxaraq "Qəbulu" rəsmiləşdirin.
                        </p>
                        <button onClick={handleReceive} className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                            Qəbulu Tamamla
                        </button>
                    </div>
                    <Warehouse className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-white/10 -rotate-12" />
                </div>
            )}

            {/* Notes Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <History className="w-3.5 h-3.5 mr-2" /> Audit Tarixçəsi
                </h4>
                <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
                    <div className="flex items-center space-x-3 relative">
                        <div className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center text-[8px] text-white z-10">1</div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Draft yaradıldı <span className="text-slate-400 text-[8px] italic tracking-normal">(Admin)</span></p>
                    </div>
                    {currentStatus === 'POSTED' && (
                        <div className="flex items-center space-x-3 relative">
                            <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-white z-10 animate-pulse">2</div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Yola salındı <span className="text-slate-400 text-[8px] italic tracking-normal">(Yuxarıda göstərilib)</span></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-4 px-4 items-center">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-800 transition-all border border-transparent hover:border-slate-200 rounded-xl leading-none">Bağla</button>
              
              {isEditable ? (
                  <button onClick={() => setCurrentStatus('POSTED')} disabled={summary.hasError} className={`px-16 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center space-x-2 leading-none ${summary.hasError ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}>
                    <Truck className="w-4 h-4" />
                    <span>Yola Sal</span>
                  </button>
              ) : currentStatus === 'POSTED' ? (
                  <button onClick={handleReceive} className="px-16 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Məhsulları Qəbul Et</span>
                  </button>
              ) : null}
          </div>
      </div>
      <JournalPreviewModal 
          isOpen={isJournalVisible} 
          onClose={() => setIsJournalVisible(false)} 
          periodClosed={false} 
          isAdmin={true}
          initialLines={[
            { id: '1', accountCode: '205', accountName: 'Mallar (Yolda)', description: `Transfer - ${docNumber} (${sourceWarehouse} -> ${targetWarehouse})`, debit: 1200, credit: 0 },
            { id: '2', accountCode: '205', accountName: 'Mallar (Anbar)', description: `Transfer - ${docNumber} (${sourceWarehouse} -> ${targetWarehouse})`, debit: 0, credit: 1200 }
          ]}
       />
    </div>
  );
};

export default StockTransferCreate;
