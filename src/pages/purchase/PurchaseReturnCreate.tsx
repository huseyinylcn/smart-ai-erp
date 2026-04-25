import { useState, useMemo } from 'react';
import { 
  ArrowLeft, User, 
  Warehouse, Clock,
  FileText,
  AlertCircle,
  Printer, 
  Trash2,
  Undo2, RefreshCcw, 
  ShieldAlert, 
  PackageSearch,
  DollarSign,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

// --- Types ---
interface ReturnLineItem {
  id: string;
  name: string;
  purchasedQty: number;   // How much was originally purchased
  prevReturned: number;   // How much was already returned
  returningQty: number;   // Current return amount
  price: number;
  taxRate: number;
}

const PurchaseReturnCreate = () => {
  const navigate = useNavigate();
  
  // 1. HEADER & STATUS
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`PRT-${new Date().getFullYear()}-0521`);
  const [docDate] = useState(new Date().toISOString().split('T')[0]);

  // 2. LINKED DOCUMENT & REASON
  const [linkedPurchaseId, setLinkedPurchaseId] = useState('');
  const [returnReason, setReturnReason] = useState('QualityIssue');
  const [sourceWarehouse, setSourceWarehouse] = useState('Əsas Anbar');
  const [supplier] = useState('Azerconnect MMC');
  const [supplierVoen] = useState('VÖEN: 1700543211');

  // 3. RETURN ITEMS
  // Mock data that would normally load from linkedPurchaseId
  const [items, setItems] = useState<ReturnLineItem[]>([
    {
      id: '1',
      name: 'Network Switch Cisco C9200L',
      purchasedQty: 5,
      prevReturned: 0,
      returningQty: 1,
      price: 4200,
      taxRate: 18
    }
  ]);

  // 4. TOTALS & FINANCIAL IMPACT
  const totals = useMemo(() => {
    return items.reduce((acc, item) => {
        const net = item.returningQty * item.price;
        const tax = net * (item.taxRate / 100);
        return {
            net: acc.net + net,
            tax: acc.tax + tax,
            total: acc.total + net + tax
        };
    }, { net: 0, tax: 0, total: 0 });
  }, [items]);

  // HELPERS
  const handleUpdateQty = (id: string, qty: number) => {
    setItems(items.map(item => {
        if (item.id === id) {
            const allowed = item.purchasedQty - item.prevReturned;
            return { ...item, returningQty: qty > allowed ? allowed : qty };
        }
        return item;
    }));
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-rose-100 dark:border-rose-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-rose-50 transition-all text-slate-400 hover:text-rose-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <Undo2 className="w-5 h-5 mr-2 text-rose-500" /> Alış Qaytarma
                    </h1>
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic">DEBIT NOTE</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black"><Clock className="w-3.5 h-3.5 mr-1 text-rose-500" /> {docDate}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-rose-600 text-white hover:bg-rose-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-500/20 active:scale-95">
                <RefreshCcw className="w-4 h-4" />
                <span>Qaytarmonı Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* 2. Linked Doc & Reason */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center">
                            <PackageSearch className="w-3.5 h-3.5 mr-2" /> Bağlı Alış Sənədi
                        </label>
                        <select value={linkedPurchaseId} onChange={(e) => setLinkedPurchaseId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500/20">
                            <option value="">Alış Seçin...</option>
                            <option value="PUR-101">ALI-2024-442 (Azerconnect)</option>
                            <option value="PUR-102">ALI-2024-391 (Delta Telecom)</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Warehouse className="w-3.5 h-3.5 mr-2" /> Stok Çıxış Anbarı
                        </label>
                        <select value={sourceWarehouse} onChange={(e) => setSourceWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold">
                            <option>Əsas Anbar</option>
                            <option>Gömrük Terminalı</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <AlertCircle className="w-3.5 h-3.5 mr-2 text-rose-500" /> Qaytarma Səbəbi
                        </label>
                        <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold italic">
                            <option value="QualityIssue">Keyfiyyət Problemi</option>
                            <option value="NotAsOrdered">Sifarişə Uyğun Deyil</option>
                            <option value="Damaged">Zədəli Gəlib</option>
                        </select>
                    </div>
                </div>
                
                {/* Supplier Detail (Auto-fill) */}
                <div className="flex items-center p-4 bg-rose-50/50 dark:bg-rose-900/5 rounded-2xl border border-dashed border-rose-200">
                    <Building2 className="w-4 h-4 text-rose-500 mr-2" />
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{supplier}</span>
                        <span className="text-[9px] font-bold text-slate-400">{supplierVoen}</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50/50 dark:bg-rose-900/10 rounded-full blur-3xl -mr-24 -mt-24 z-0"></div>
            </div>

            {/* 3. Return Item Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-rose-50 dark:border-rose-900/20 bg-rose-50/20 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-rose-600" /> Təchizatçıya Qaytarılan Mallar
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold min-w-[900px]">
                        <thead className="bg-white dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-5">Məhsul / Xidmət</th>
                                <th className="px-4 py-5 text-right">Alınmış Miqdar</th>
                                <th className="px-4 py-5 text-right">Əvvəl Qaytarılıb</th>
                                <th className="px-4 py-5 text-right text-rose-500">Qaytarılan</th>
                                <th className="px-4 py-5 text-right">Alış Qiyməti</th>
                                <th className="px-4 py-5 text-right text-rose-600 font-black">Məbləğ</th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => {
                                const allowed = item.purchasedQty - item.prevReturned;
                                return (
                                    <tr key={item.id} className="group hover:bg-rose-50/20">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800 dark:text-white">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 italic">HW-NET-CIS</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-right text-slate-500 font-mono italic">{item.purchasedQty}</td>
                                        <td className="px-4 py-5 text-right text-amber-500 font-mono italic">{item.prevReturned}</td>
                                        <td className="px-4 py-5 text-right">
                                            <div className="flex flex-col items-end space-y-1">
                                                <input 
                                                    type="number" 
                                                    value={item.returningQty} 
                                                    onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                                                    className={`w-20 bg-slate-50 dark:bg-slate-800 border-2 rounded-lg px-2 py-1 text-right font-black ${
                                                        item.returningQty > allowed ? 'border-rose-500 text-rose-600' : 'border-transparent'
                                                    }`} 
                                                />
                                                <span className="text-[8px] font-black uppercase text-slate-400">Max: {allowed}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-right font-mono text-slate-500">{item.price.toLocaleString()}</td>
                                        <td className="px-4 py-5 text-right font-black text-sm text-rose-600 tabular-nums">
                                            {(item.returningQty * item.price * 1.18).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
            
            {/* Totals Panel */}
            <div className="bg-rose-600 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-100">Cəmi Borc Azalması</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold text-rose-200 uppercase tracking-widest">
                            <span>Net Məbləğ</span>
                            <span className="tabular-nums font-mono">-{totals.net.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-rose-200 uppercase tracking-widest">
                            <span>ƏDV Düzəlişi</span>
                            <span className="tabular-nums font-mono">-{totals.tax.toLocaleString()}</span>
                        </div>
                        <div className="pt-4 border-t border-rose-500/50">
                            <h2 className="text-3xl font-black text-white text-center tabular-nums leading-none">
                                -{totals.total.toLocaleString()} ₼
                            </h2>
                            <p className="text-[9px] font-black text-rose-200 uppercase tracking-widest text-center mt-2 italic">Təchizatçı Balansından (A/P)</p>
                        </div>
                    </div>
                </div>
                <Undo2 className="absolute bottom-6 right-6 w-32 h-32 text-white/5 -mb-8 -mr-8 -rotate-12 transition-transform group-hover:rotate-0" />
            </div>

            {/* Compliance & Audit */}
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                    <ShieldAlert className="w-3.5 h-3.5 mr-2 text-rose-500" /> Vergi və Stok Riski
                </h4>
                <div className="space-y-3">
                    <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl space-y-1 border border-rose-100">
                        <p className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-tight">ƏDV Əvəzləşməsinn Ləğvi</p>
                        <p className="text-[9px] font-bold text-rose-600 italic">Bu sənəd əvvəllər əvəzləşdirilmiş ƏDV-nin büdcəyə geri qaytarılmasını təsnif edir.</p>
                    </div>
                    {items[0].returningQty > 0 && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-start space-x-2">
                             <Warehouse className="w-4 h-4 text-slate-400 shrink-0" />
                             <p className="text-[9px] font-black text-slate-500 uppercase leading-snug">Avtomatik olaraq {sourceWarehouse}-dan çıxış ediləcək.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Journal Preview */}
            <div className="bg-slate-900 text-white rounded-[1.5rem] p-6 space-y-3 shadow-lg">
                 <h4 className="text-[9px] font-black uppercase text-rose-400 tracking-widest flex items-center">
                    <DollarSign className="w-3.5 h-3.5 mr-2" /> Ledger Təsiri (Debit Memo)
                 </h4>
                 <div className="space-y-2 opacity-80 border-t border-slate-800 pt-3">
                     <div className="flex justify-between text-[9px] font-bold uppercase italic">
                         <span>DEBIT: Accounts Payable</span>
                         <span>{totals.total.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-[9px] font-bold uppercase italic text-rose-400">
                         <span>CREDIT: Inventory Asset</span>
                         <span>{totals.net.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-[9px] font-bold uppercase italic text-rose-400">
                         <span>CREDIT: VAT Receivable</span>
                         <span>{totals.tax.toLocaleString()}</span>
                     </div>
                 </div>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 transition-all shadow-2xl">
          <div className="flex space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-6 py-2.5 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-all">Ləğv Et</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-12 py-2.5 bg-rose-600 text-white hover:bg-rose-700 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 transition-all flex items-center space-x-2">
                 <RefreshCcw className="w-4 h-4" />
                 <span>Qaytarmonı Bitir</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default PurchaseReturnCreate;
