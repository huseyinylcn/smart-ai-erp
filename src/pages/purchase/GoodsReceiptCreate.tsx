import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Warehouse, Clock,
  FileText, CheckCircle2,
  Printer, 
  Trash2,
  PackageCheck, 
  History,
  AlertTriangle,
  ScanLine,
  Tags,
  Plus,
  Building2,
  Truck,
  Calculator,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import JournalPreviewModal from '../../components/JournalPreviewModal';
import { hasPermission } from '../../utils/permissionHelper';

// --- Types ---
interface ReceiptLineItem {
  id: string;
  name: string;
  expectedQty: number;   // What was ordered
  prevReceived: number;  // Already received in earlier documents
  currentQty: number;    // Being received now
  unit: string;
  batchNumber?: string;
  serialNumbers?: string;
}

const GoodsReceiptCreate = () => {
  const navigate = useNavigate();
  
  // 1. HEADER & STATUS
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`GRC-${new Date().getFullYear()}-0822`);
  const [docDate] = useState(new Date().toISOString().split('T')[0]);
  const [isJournalVisible, setIsJournalVisible] = useState(false);

  // 2. DOCUMENT INFO
  const [linkedPurchaseId, setLinkedPurchaseId] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('Əsas Anbar');
  const [supplier] = useState('Microsoft Azerbaijan');
  const [receivedBy] = useState('Əli Məmmədov (Anbar müdiri)');

  // 3. RECEIPT ITEMS
  const [items, setItems] = useState<ReceiptLineItem[]>([
    {
      id: '1',
      name: 'Dell Latitude 5540 Laptop',
      expectedQty: 20,
      prevReceived: 5,
      currentQty: 15,
      unit: 'ədəd',
      batchNumber: 'BT-2024-X1',
      serialNumbers: ''
    },
    {
      id: '2',
      name: 'Logitech MX Master 3S Mouse',
      expectedQty: 50,
      prevReceived: 0,
      currentQty: 50,
      unit: 'ədəd',
      batchNumber: '',
      serialNumbers: ''
    }
  ]);

  // 4. SUMMARY CALCULATIONS
  const summary = useMemo(() => {
    const totalExpected = items.reduce((acc, item) => acc + item.expectedQty, 0);
    const totalReceived = items.reduce((acc, item) => acc + item.prevReceived + item.currentQty, 0);
    const progress = (totalReceived / totalExpected) * 100;
    
    return {
      skuCount: items.length,
      totalReceivedNow: items.reduce((acc, item) => acc + item.currentQty, 0),
      progress: Math.min(progress, 100),
      isPartial: totalReceived < totalExpected
    };
  }, [items]);

  // HELPERS
  const handleUpdateQty = (id: string, qty: number) => {
    setItems(items.map(item => {
        if (item.id === id) {
            return { ...item, currentQty: qty };
        }
        return item;
    }));
  };

  const handleUpdateField = (id: string, field: keyof ReceiptLineItem, value: string) => {
    setItems(items.map(item => {
        if (item.id === id) {
            return { ...item, [field]: value };
        }
        return item;
    }));
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-emerald-100 dark:border-emerald-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-emerald-50 transition-all text-slate-400 hover:text-emerald-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <PackageCheck className="w-6 h-6 mr-2 text-emerald-500" /> Mal Qəbulu
                    </h1>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">GOODS RECEIPT</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black"><Clock className="w-3.5 h-3.5 mr-1 text-emerald-500" /> {docDate}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center text-indigo-500"><Warehouse className="w-3.5 h-3.5 mr-1" /> {targetWarehouse}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center text-amber-600 italic">Mənbə: {supplier}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            {hasPermission('FINANCE', 'view') && (
              <button 
                onClick={() => navigate(`/finance/transaction/TRX-2026-902`)}
                className="flex items-center space-x-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xs uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-500/10 active:scale-95 italic tabular-nums"
              >
                  <BookOpen className="w-4 h-4 shadow-sm" />
                  <span>Müxabirləşməyə bax</span>
              </button>
            )}
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Qəbulu Tamamla</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* 2. Basic Receipt Info */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center">
                            <FileText className="w-3.5 h-3.5 mr-2" /> Bağlı Alış Sənədi
                        </label>
                        <select value={linkedPurchaseId} onChange={(e) => setLinkedPurchaseId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20">
                            <option value="">Sənəd Seçin...</option>
                            <option value="PUR-101">ALI-2024-812 (Microsoft)</option>
                            <option value="PUR-102">ALI-2024-754 (HP Global)</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Warehouse className="w-3.5 h-3.5 mr-2" /> Mədaxil Anbarı
                        </label>
                        <select value={targetWarehouse} onChange={(e) => setTargetWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold">
                            <option>Əsas Anbar</option>
                            <option>Texniki Servis Deposu</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Truck className="w-3.5 h-3.5 mr-2" /> Qəbul Edən Məsul Şəxs
                        </label>
                        <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-500 italic">
                            {receivedBy}
                        </div>
                    </div>
                </div>
                
                {/* Supplier Context Card */}
                <div className="flex items-center p-4 bg-emerald-50/50 dark:bg-emerald-900/5 rounded-2xl border border-dashed border-emerald-200">
                    <Building2 className="w-4 h-4 text-emerald-500 mr-2" />
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{supplier}</span>
                        <span className="text-[9px] font-bold text-slate-400">Təchizatçı loqistikası ilə çatdırılma</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-3xl -mr-24 -mt-24 z-0"></div>
            </div>

            {/* 3. Items Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-emerald-50 dark:border-emerald-900/20 bg-emerald-50/20 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center">
                        <History className="w-4 h-4 mr-2 text-emerald-600" /> Qəbul Siyahısı
                    </h3>
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-emerald-100 rounded-lg text-[9px] font-black text-emerald-600 uppercase hover:bg-emerald-50 transition-all">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Siyahıdan Əlavə Et</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold min-w-[1000px]">
                        <thead className="bg-white dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-5">Məhsul</th>
                                <th className="px-4 py-5 text-center">Gözlənilən</th>
                                <th className="px-4 py-5 text-center">Əvvəl Qəbul</th>
                                <th className="px-4 py-5 text-center text-emerald-600">Cari Qəbul</th>
                                <th className="px-4 py-5">
                                    <div className="flex items-center"><Tags className="w-3 h-3 mr-1" /> Partiya (Batch)</div>
                                </th>
                                <th className="px-4 py-5">
                                    <div className="flex items-center"><ScanLine className="w-3 h-3 mr-1" /> Seriya Nömrələri</div>
                                </th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => {
                                const remaining = item.expectedQty - item.prevReceived;
                                const isWarning = item.currentQty > remaining;
                                return (
                                    <tr key={item.id} className="group hover:bg-emerald-50/20 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800 dark:text-white">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-center text-slate-500 font-mono italic">{item.expectedQty}</td>
                                        <td className="px-4 py-5 text-center text-amber-500 font-mono italic border-l border-slate-50 dark:border-slate-800">{item.prevReceived}</td>
                                        <td className="px-4 py-5 text-center border-l border-slate-50 dark:border-slate-800">
                                            <div className="flex flex-col items-center space-y-1">
                                                <input 
                                                    type="number" 
                                                    value={item.currentQty} 
                                                    onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                                                    className={`w-20 bg-emerald-50/30 dark:bg-emerald-900/10 border-2 rounded-lg px-2 py-1.5 text-center font-black outline-none transition-all ${
                                                        isWarning ? 'border-amber-400 text-amber-600 shadow-lg shadow-amber-100' : 'border-emerald-200 focus:border-emerald-500'
                                                    }`} 
                                                />
                                                {isWarning && <span className="text-[7px] font-black text-amber-600 uppercase flex items-center animate-pulse"><AlertTriangle className="w-2.5 h-2.5 mr-1" /> Limit aşıldı!</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <input 
                                                type="text" 
                                                placeholder="Məs: LOT-001"
                                                value={item.batchNumber}
                                                onChange={(e) => handleUpdateField(item.id, 'batchNumber', e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-[10px] font-bold outline-none italic text-slate-500 focus:bg-white"
                                            />
                                        </td>
                                        <td className="px-4 py-5">
                                            <textarea 
                                                placeholder="Hər sətrə bir seriya..."
                                                rows={1}
                                                value={item.serialNumbers}
                                                onChange={(e) => handleUpdateField(item.id, 'serialNumbers', e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-[9px] font-bold outline-none resize-none focus:bg-white min-h-[36px]"
                                            />
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            
            {/* Progress Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qəbul Statistikası</h3>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">{summary.totalReceivedNow}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase pb-1">ədəd qəbul edilir</span>
                    </div>
                    
                    <div className="relative h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-emerald-500 group-hover:bg-emerald-600 transition-all duration-1000 ease-out"
                          style={{ width: `${summary.progress}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Gözlənilən Cəmi:</span>
                        <span className="text-slate-800 dark:text-emerald-400">{summary.progress.toFixed(1)}% Tamamlanıb</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-400 uppercase">Məhsul Çeşidi</span>
                        <span className="text-slate-800 dark:text-white">{summary.skuCount} SKU</span>
                    </div>
                    {summary.isPartial && (
                        <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100">
                            <History className="w-3.5 h-3.5 text-amber-500 mr-2" />
                            <span className="text-[9px] font-black text-amber-700 uppercase leading-tight italic">Qismən Qəbul (Partial Receipt)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Document Verification */}
            <div className="bg-emerald-600 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Post-Verify</h4>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-100 leading-relaxed italic opacity-90">
                        Təsdiq edildikdə stok miqdarı dərhal artacaq və maliyyə departamentinə "Mədaxil Bildirişi" göndəriləcək.
                    </p>
                </div>
                <PackageCheck className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/10 rotate-12" />
            </div>

            {/* Notes Section (Point 10) */}
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <FileText className="w-3.5 h-3.5 mr-2" /> Daxili Qeydlər
                </h4>
                <textarea 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold text-slate-500 placeholder-slate-300 outline-none focus:ring-1 focus:ring-emerald-500 resize-none min-h-[100px]"
                    placeholder="Qəbul zamanı aşkar olunan hər hansı kənarlaşmanı bura qeyd edin..."
                ></textarea>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl">
          <div className="flex space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-all">Sənədi Bağla</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center space-x-2">
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Mədaxili Bitir</span>
              </button>
          </div>
      </div>
      <JournalPreviewModal 
          isOpen={isJournalVisible} 
          onClose={() => setIsJournalVisible(false)} 
          periodClosed={false} 
          isAdmin={true}
          initialLines={[
            { id: '1', accountCode: '205', accountName: 'Mallar', description: `${supplier} - GRN ${docNumber}`, debit: summary.totalReceivedNow * 100, credit: 0 },
            { id: '2', accountCode: '531', accountName: 'Malsatan və podratçılara qısamüddətli kreditor borcları', description: `${supplier} - GRN ${docNumber}`, debit: 0, credit: summary.totalReceivedNow * 100 }
          ]}
       />
    </div>
  );
};

export default GoodsReceiptCreate;
