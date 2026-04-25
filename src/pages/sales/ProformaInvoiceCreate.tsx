import { useState, useMemo } from 'react';
import { 
  ArrowLeft, User, 
  Landmark, Info, Clock,
  CheckCircle2,
  Printer, 
  ChevronDown, ChevronUp,
  Plus, Trash2,
  CalendarDays, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

// --- Types ---
interface LineItem {
  id: string;
  code: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  taxRate: number;
}

const ProformaInvoiceCreate = () => {
  const navigate = useNavigate();
  
  // 1. HEADER & STATUS
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`PRO-${new Date().getFullYear()}-0892`);
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  
  // PROFORMA SPECIFIC: Validity & Bank
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [ourBankAccount, setOurBankAccount] = useState('Pasha Bank (AZN) - Main');

  // CUSTOMER INFO
  const [customer, setCustomer] = useState('');

  // LINE ITEMS
  const [items, setItems] = useState<LineItem[]>([
    {
      id: '1',
      code: 'SRV-04',
      name: 'ERP Implementation Consulting',
      unit: 'saat',
      quantity: 40,
      price: 150,
      taxRate: 18
    }
  ]);

  // UI STATE
  const [isTermsExpanded, setIsTermsExpanded] = useState(true);

  // TOTALS
  const totals = useMemo(() => {
    return items.reduce((acc, item) => {
        const net = item.quantity * item.price;
        const tax = net * (item.taxRate / 100);
        return {
            net: acc.net + net,
            tax: acc.tax + tax,
            total: acc.total + net + tax
        };
    }, { net: 0, tax: 0, total: 0 });
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, {
      id: Math.random().toString(36).substr(2, 9),
      code: '', name: '', unit: 'ədəd', quantity: 1, price: 0, taxRate: 18
    }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Hesab-faktura (Proforma)</h1>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-widest">PRE-SALES</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center text-rose-500 font-black"><Clock className="w-3.5 h-3.5 mr-1" /> Etibarlılıq: {validUntil}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-slate-900 text-white hover:bg-black rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-500/10 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hesabı Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* 2. Customer & Bank Details */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <User className="w-3.5 h-3.5 mr-2" /> Müştəri Seçimi
                        </label>
                        <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20">
                            <option value="">Seçin...</option>
                            <option>PMO Group MMC</option>
                            <option>Technovate LLC</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Landmark className="w-3.5 h-3.5 mr-2" /> Bizim Bank Hesabı (Ödəniş üçün)
                        </label>
                        <select value={ourBankAccount} onChange={(e) => setOurBankAccount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold">
                            <option>Pasha Bank (AZN) - Main</option>
                            <option>Kapital Bank (USD) - Forex</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <CalendarDays className="w-3.5 h-3.5 mr-2" /> Tarix
                            </label>
                            <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-3 text-xs font-bold" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center">
                                <CalendarDays className="w-3.5 h-3.5 mr-2" /> Son Tarix
                            </label>
                            <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full bg-rose-50 dark:bg-rose-900/10 border-none rounded-xl py-2.5 px-3 text-xs font-black text-rose-600 outline-none" />
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/5 rounded-full blur-3xl -mr-16 -mt-16 z-0"></div>
            </div>

            {/* 3. Product Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">
                        Təklif Edilən Mal və Xidmətlər
                    </h3>
                    <button onClick={handleAddItem} className="flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Səyahət Əlavə Et</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Məhsul / Xidmət</th>
                                <th className="px-4 py-4 text-right">Miqdar</th>
                                <th className="px-4 py-4 text-right">Qiymət</th>
                                <th className="px-4 py-4 text-right">ƏDV %</th>
                                <th className="px-4 py-4 text-right text-indigo-600">Yekun</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => (
                                <tr key={item.id} className="group hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <input value={item.name} onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)} className="bg-transparent border-none p-0 text-xs font-bold text-slate-800 dark:text-white outline-none" placeholder="Ad daxil edin..." />
                                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item.code || 'SVC-AUTO'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <input type="number" value={item.quantity} onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))} className="w-16 bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-1 text-right" />
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <input type="number" value={item.price} onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value))} className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-1 text-right font-mono" />
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <select value={item.taxRate} onChange={(e) => handleUpdateItem(item.id, 'taxRate', Number(e.target.value))} className="bg-transparent border-none p-0 text-[10px] font-bold">
                                            <option value={18}>18%</option>
                                            <option value={0}>0%</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-right font-black tabular-nums">
                                        {(item.quantity * item.price * 1.18).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleRemoveItem(item.id)} className="p-2 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6 flex flex-col">
                <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ödənilməli Məbləğ</p>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tabular-nums">
                        {totals.total.toLocaleString()}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic leading-none">AZN</p>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                   <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-slate-400 uppercase tracking-wide">Net</span>
                       <span className="text-slate-700 dark:text-slate-200">{totals.net.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold text-indigo-500">
                       <span className="uppercase tracking-wide">ƏDV (18%)</span>
                       <span className="tabular-nums">+{totals.tax.toLocaleString()}</span>
                   </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                   <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-tight uppercase tracking-tight">
                        <Info className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
                        Bu sənəd rəsmi Satış Qaiməsi deyil. Stok və Maliyyə hərəkəti yaratmır.
                   </p>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                    <span>Qaiməyə Çevir</span>
                </button>
            </div>

            {/* Bank Details */}
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                    <Landmark className="w-3.5 h-3.5 mr-2" /> Bank Rekvizitləri
                </h4>
                <div className="space-y-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase">SWIFT</p>
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">PASHA AZ22</p>
                    </div>
                </div>
            </div>

            {/* Terms & Condition */}
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
                <button onClick={() => setIsTermsExpanded(!isTermsExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">
                   <span>Ödəniş Şərtləri</span>
                   {isTermsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isTermsExpanded && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-1 text-[10px] text-slate-500 font-medium leading-relaxed italic">
                        Mallar ödəniş bank hesabımıza daxil olduqdan sonra 2 iş günü ərzində təhvil veriləcəkdir.
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-5 flex justify-end items-center z-40 transition-all shadow-2xl">
          <div className="flex space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-6 py-2.5 text-slate-500 font-black text-xs uppercase tracking-widest">Ləğv Et</button>
              <button disabled className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-xs uppercase text-slate-400">Dəyişiklikləri Saxla</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-10 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Hesabı Bitir</button>
          </div>
      </div>
    </div>
  );
};

export default ProformaInvoiceCreate;
