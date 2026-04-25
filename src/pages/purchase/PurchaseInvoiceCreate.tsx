import { useState, useMemo } from 'react';
import { 
  ArrowLeft, User, 
  History, FileText,
  AlertCircle, CheckCircle2,
  Printer, Download,
  ShieldCheck, Paperclip, 
  Link as LinkIcon, 
  CreditCard, MessageSquare, 
  ChevronDown, ChevronUp,
  Plus, Trash2, Building2, Calculator, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { hasPermission } from '../../utils/permissionHelper';
import JournalPreviewModal from '../../components/JournalPreviewModal';

// --- Types ---
interface PurchaseLineItem {
  id: string;
  code: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  discount: number;
  taxRate: number; // 0, 18
  warehouse: string;
  costAllocation: boolean; // Flag to allocate to cost
}

const PurchaseInvoiceCreate = () => {
  const navigate = useNavigate();
  
  // 1. HEADER & STATUS
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber, setDocNumber] = useState(`AQ-${new Date().getFullYear()}-0054`);
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [companyBranch, setCompanyBranch] = useState('Bakı Baş Ofis');

  // 2. SUPPLIER INFO
  const [vendor, setVendor] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30_DAYS');

  // 3. DOCUMENT METADATA
  const [purchaseType, setPurchaseType] = useState<'Local' | 'Foreign' | 'Service' | 'Asset' | 'Material'>('Local');
  const [eqaimeNo, setEqaimeNo] = useState('');
  const [eqaimeStatus, setEqaimeStatus] = useState<'Received' | 'Pending' | 'Error'>('Pending');
  const [currency, setCurrency] = useState('AZN');
  const [mainWarehouse, setMainWarehouse] = useState('Əsas Anbar');

  // 4. LINE ITEMS
  const [items, setItems] = useState<PurchaseLineItem[]>([
    {
      id: '1',
      code: 'PRO-001',
      name: 'Solar Panel High Capacity',
      unit: 'ədəd',
      quantity: 10,
      price: 250,
      discount: 0,
      taxRate: 18,
      warehouse: 'Əsas Anbar',
      costAllocation: false
    }
  ]);

  // UI STATE
  const [activeTab, setActiveTab] = useState<'files' | 'linked' | 'approvals' | 'audit'>('approvals');
  const [isTaxExpanded, setIsTaxExpanded] = useState(true);
  const [isSettlementExpanded, setIsSettlementExpanded] = useState(true);
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);
  const [isJournalVisible, setIsJournalVisible] = useState(false);

  // 5. TOTALS LOGIC
  const totals = useMemo(() => {
    return items.reduce((acc, item) => {
        const net = item.quantity * item.price * (1 - item.discount / 100);
        const tax = net * (item.taxRate / 100);
        return {
            net: acc.net + net,
            tax: acc.tax + tax,
            total: acc.total + net + tax,
            paidNet: 0, // In real app, this would match from bank docs
            paidTax: 0
        };
    }, { net: 0, tax: 0, total: 0, paidNet: 0, paidTax: 0 });
  }, [items]);

  // VAT OFFSET LOGIC (Azerbaijan Rule: E-invoice Received = Eligible)
  const isOffsetEligible = eqaimeStatus === 'Received';

  const handleAddItem = () => {
    setItems([...items, {
      id: Math.random().toString(36).substr(2, 9),
      code: '', name: '', unit: 'ədəd', quantity: 1, price: 0, discount: 0, taxRate: 18, warehouse: mainWarehouse, costAllocation: false
    }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof PurchaseLineItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* 1. HEADER (Point 1 - Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">Alış Qaiməsi</h1>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        currentStatus === 'DRAFT' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>{currentStatus}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100/50 group focus-within:border-indigo-500/30 transition-all">
                       <span className="mr-2 opacity-50">NO:</span>
                       <input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="bg-transparent border-none p-0 w-32 outline-none text-indigo-600 font-black italic uppercase" />
                    </div>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100/50"><Building2 className="w-3 h-3 mr-1" /> {companyBranch}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 mr-2">
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Download className="w-4 h-4" /></button>
            </div>
            {hasPermission('FINANCE', 'view') && (
              <button 
                onClick={() => navigate(`/finance/transaction/TRX-2026-902`)}
                className="flex items-center space-x-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xs uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-500/10 active:scale-95 italic"
              >
                  <BookOpen className="w-4 h-4 shadow-sm" />
                  <span>Müxabirləşməyə bax</span>
              </button>
            )}
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (Points 2, 3, 4) */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* 2. Supplier & 3. Doc Info Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {/* Supplier Group */}
                    <div className="space-y-4 lg:border-r lg:border-slate-50 dark:lg:border-slate-800 lg:pr-8">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Təchizatçı</h4>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><User className="w-3 h-3 mr-1.5" /> Təchizatçı Adı</label>
                            <select value={vendor} onChange={(e) => setVendor(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-2.5 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20">
                                <option value="">Seçin...</option>
                                <option value="Tengri Supply MMC">Tengri Supply MMC</option>
                                <option value="SOCAR Trading">SOCAR Trading</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">VÖEN</label>
                                <input readOnly value="1425364758" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">Tip</label>
                                <div className="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-tighter text-center">Resident</div>
                            </div>
                        </div>
                    </div>

                    {/* Doc Info Group */}
                    <div className="space-y-4 lg:col-span-2">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Sənəd Detalları</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alış Növü</label>
                                <select value={purchaseType} onChange={(e) => setPurchaseType(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-bold">
                                    <option value="Local">Yerli Alış</option>
                                    <option value="Foreign">Xarici Alış</option>
                                    <option value="Service">Xidmət</option>
                                    <option value="Asset">Əsas Vəsait</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qaimə №</label>
                                <input value={eqaimeNo} onChange={(e) => setEqaimeNo(e.target.value)} placeholder="E-Q-..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valyuta</label>
                                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-bold">
                                    <option value="AZN">AZN</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarix</label>
                                <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-bold" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Məzənnə</label>
                                <input type="number" readOnly value="1.70" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anbar</label>
                                <select value={mainWarehouse} onChange={(e) => setMainWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-bold">
                                    <option value="Əsas Anbar">Əsas Anbar</option>
                                    <option value="Bərdə Depo">Bərdə Depo</option>
                                </select>
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layihə / Cost Center</label>
                                <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-xs font-bold">
                                    <option value="">Layihəsiz (Project Generic)</option>
                                    <option value="BP_001">BP Project Phase 1</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Line Items Grid (Point 4) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-indigo-600" /> Mallar və Xidmətlər
                    </h3>
                    <button onClick={handleAddItem} className="flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                        <Plus className="w-4 h-4" />
                        <span>Sətir Əlavə Et</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Məhsul Kodu / Adı</th>
                                <th className="px-4 py-4">Vahid</th>
                                <th className="px-4 py-4 text-right">Miqdar</th>
                                <th className="px-4 py-4 text-right">Qiymət</th>
                                <th className="px-4 py-4 text-right">ƏDV %</th>
                                <th className="px-4 py-4 text-right text-indigo-600">Cəmi</th>
                                <th className="px-4 py-4 text-center">Maya?</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 min-w-[250px]">
                                        <div className="flex flex-col space-y-1">
                                            <input value={item.code} onChange={(e) => handleUpdateItem(item.id, 'code', e.target.value)} placeholder="SKU/Kod" className="bg-transparent border-none p-0 text-[10px] font-black text-indigo-500 uppercase outline-none" />
                                            <input value={item.name} onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)} placeholder="Məhsul adı..." className="bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none w-full" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <select className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg p-1 text-[10px] font-bold">
                                            <option>ədəd</option>
                                            <option>kg</option>
                                            <option>metr</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <input type="number" value={item.quantity} onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))} className="w-20 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-right font-mono" />
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <input type="number" value={item.price} onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value))} className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-right font-mono" />
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <select value={item.taxRate} onChange={(e) => handleUpdateItem(item.id, 'taxRate', Number(e.target.value))} className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg p-1 text-[10px] font-bold">
                                            <option value={18}>18%</option>
                                            <option value={0}>0%</option>
                                            <option value={-1}>Azad</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-right font-black tabular-nums text-slate-800 dark:text-white">
                                        {(item.quantity * item.price * (1 + (item.taxRate > 0 ? item.taxRate / 100 : 0))).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={item.costAllocation} onChange={(e) => handleUpdateItem(item.id, 'costAllocation', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleRemoveItem(item.id)} className="p-2 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TAB SYSTEM (Bottom Tabs) */}
            <div className="space-y-4">
                <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
                    {[
                        { id: 'approvals', label: 'Təsdiqlər', icon: ShieldCheck },
                        { id: 'linked', label: 'Əlaqəli', icon: LinkIcon },
                        { id: 'files', label: 'Əlavələr', icon: Paperclip },
                        { id: 'audit', label: 'Tarixçə', icon: History },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            <tab.icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 min-h-[150px]">
                    {activeTab === 'approvals' && (
                        <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-[11px] uppercase">ACC</div>
                                <div>
                                    <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic">Baş Mühasib</p>
                                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Təstiqi Gözlənilir</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-500 border border-slate-100 dark:border-slate-700 hover:text-indigo-600">Təsdiqə Göndər</button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR (Points 5, 6) */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            
            {/* 5. Totals Panel (Sticky) */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Maliyyə Xülasəsi</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Əsas Məbləğ</span>
                            <span className="tabular-nums font-mono">{totals.net.toLocaleString()} {currency}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            <span>ƏDV (18%)</span>
                            <span className="tabular-nums font-mono">+{totals.tax.toLocaleString()} {currency}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center italic">CƏMİ BORC</p>
                            <h2 className="text-3xl font-black text-white text-center tabular-nums leading-none">
                                {totals.total.toLocaleString()} <span className="text-sm font-light text-slate-400 ml-1">{currency}</span>
                            </h2>
                        </div>
                    </div>
                    {/* Payment Info */}
                    <div className="pt-4 border-t border-slate-800 space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                            <span>Ödənilmiş (Əsas)</span>
                            <span>{totals.paidNet.toLocaleString()} ₼</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                            <span>Ödənilmiş (ƏDV)</span>
                            <span>{totals.paidTax.toLocaleString()} ₼</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            </div>

            {/* 6. VAT & Eligibility Section (Collapsible) */}
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <button onClick={() => setIsTaxExpanded(!isTaxExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all">
                   <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">ƏDV Fakturası</span>
                   </div>
                   {isTaxExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isTaxExpanded && (
                    <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top-1">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black text-slate-400 uppercase">E-Qaimə Statusu</label>
                                <select value={eqaimeStatus} onChange={(e) => setEqaimeStatus(e.target.value as any)} className="bg-slate-50 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase p-1">
                                    <option value="Pending">Gözləyir</option>
                                    <option value="Received">Daxil olub</option>
                                    <option value="Error">Xəta</option>
                                </select>
                            </div>
                            
                            <div className={`p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 border ${
                                isOffsetEligible ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                            }`}>
                                <div className="text-[10px] font-black uppercase tracking-widest italic leading-none">Əvəzləşmə Statusu</div>
                                <div className="text-xs font-black uppercase tracking-[0.1em]">{isOffsetEligible ? 'YARARLIDIR' : 'YARARSIZ'}</div>
                            </div>

                            {!isOffsetEligible && (
                                <p className="text-[9px] text-rose-500 font-bold leading-tight italic">
                                    <AlertCircle className="w-2.5 h-2.5 inline mr-1" />
                                    E-qaimə daxil olmayana qədər bu alış üzrə ƏDV-ni əvəzləşdirə bilməzsiniz.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 9. Settlement (Collapsible) */}
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <button onClick={() => setIsSettlementExpanded(!isSettlementExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">
                   <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        <span>Ödəniş Şərtləri</span>
                   </div>
                   {isSettlementExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isSettlementExpanded && (
                    <div className="px-5 pb-5 space-y-3 animate-in slide-in-from-top-1">
                        <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-[10px] font-bold uppercase">
                            <option value="CASH">Nağd</option>
                            <option value="30_DAYS">30 Gün Müddətli</option>
                            <option value="PREPAID">50% Avans</option>
                        </select>
                    </div>
                )}
            </div>

            {/* 10. Notes (Collapsible) */}
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <button onClick={() => setIsNotesExpanded(!isNotesExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">
                   <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        <span>Sənəd Qeydi</span>
                   </div>
                   {isNotesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isNotesExpanded && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-1">
                        <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-medium resize-none focus:ring-1 focus:ring-indigo-500" placeholder="Qeydlər..."></textarea>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* FIXED FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center z-40 transition-all shadow-2xl">
          <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 shadow-lg shadow-indigo-500/50"></div> AZ-VAT Ledger Sync Active</div>
          </div>
          <div className="flex items-center space-x-3">
              <button className="px-6 py-2.5 text-slate-500 font-black text-xs uppercase tracking-widest transition-all hover:text-slate-700">Ləğv Et</button>
              <button disabled className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-xs uppercase tracking-widest text-slate-700 dark:text-white">Qaralama</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-10 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">Alışı Tamamla</button>
          </div>
      </div>
      <JournalPreviewModal 
          isOpen={isJournalVisible} 
          onClose={() => setIsJournalVisible(false)} 
          periodClosed={false} 
          isAdmin={true}
          initialLines={[
            { id: '1', accountCode: purchaseType === 'Service' ? '721' : '205', accountName: purchaseType === 'Service' ? 'İnzibati xərclər' : 'Mallar', description: `${vendor} - Alış Qaiməsi`, debit: totals.net, credit: 0 },
            { id: '2', accountCode: '241', accountName: 'Əvəzləşdirilən vergilər', description: `${vendor} - ƏDV`, debit: totals.tax, credit: 0 },
            { id: '3', accountCode: '531', accountName: 'Malsatan və podratçılara qısamüddətli kreditor borcları', description: `${vendor} - Cəmi Borc`, debit: 0, credit: totals.total }
          ]}
       />
    </div>
  );
};

export default PurchaseInvoiceCreate;
