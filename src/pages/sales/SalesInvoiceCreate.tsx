import { useState, useMemo } from 'react';
import { 
  ArrowLeft, User, 
  History, FileText,
  Save, Paperclip, 
  Link as LinkIcon, 
  ChevronDown, ChevronUp,
  Plus, Trash2,
  Truck, MapPin, DollarSign,
  CheckCircle2,
  Info,
  ShieldCheck,
  ShieldAlert,
  Globe,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import JournalPreviewModal from '../../components/JournalPreviewModal';
import DocumentFlow from '../../components/DocumentFlow';
import PriceVisibility from '../../components/PriceVisibility';

// --- Types ---
interface SalesLineItem {
  id: string;
  code: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  discount: number;
  taxRate: number;
  taxCode: string; // E-taxes code
  cogs: number;
}

const SalesInvoiceCreate = () => {
  const navigate = useNavigate();
  const userRole = 'Admin'; // Mock

  // 1. HEADER & STATUS
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber, setDocNumber] = useState(`SAT-${new Date().getFullYear()}-1042`);
  const [taxDate, setTaxDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountingDate, setAccountingDate] = useState(new Date().toISOString().split('T')[0]);
  
  const isPeriodClosed = (dateStr: string) => {
    const date = new Date(dateStr);
    const closingDate = new Date('2024-03-01');
    return date < closingDate;
  };
  
  const periodClosed = isPeriodClosed(accountingDate) || isPeriodClosed(taxDate);
  const isAdmin = userRole === 'Admin';
  const [customer, setCustomer] = useState('');
  const [customerVoen] = useState('VÖEN: 1234567890');
  const [customerType] = useState('Local Corporate');

  // 3. DOCUMENT METADATA & 4. LOGISTICS
  const [salesType, setSalesType] = useState<'Local' | 'Export' | 'Service'>('Local');
  const [warehouse, setWarehouse] = useState('Bakı Mərkəz Anbarı');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [transporter, setTransporter] = useState('');

  // 5. LINE ITEMS
  const [items, setItems] = useState<SalesLineItem[]>([
    {
      id: '1',
      code: 'ICT-MB-02',
      name: 'Macbook Pro 14 M3 Max',
      unit: 'ədəd',
      quantity: 5,
      price: 4200,
      discount: 2,
      taxRate: 18,
      taxCode: '47.41.11',
      cogs: 3500
    }
  ]);

  // UI STATE
  const [activeTab, setActiveTab] = useState<'approvals' | 'linked' | 'files' | 'audit'>('approvals');
  const [isLogisticsExpanded, setIsLogisticsExpanded] = useState(false);
  const [isDebitorExpanded, setIsDebitorExpanded] = useState(true);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isJournalVisible, setIsJournalVisible] = useState(false);

  // 6, 7, 8. TOTALS & PAYMENT TRACKING
  const totals = useMemo(() => {
    return items.reduce((acc, item) => {
        const net = item.quantity * item.price * (1 - item.discount / 100);
        const tax = net * (item.taxRate / 100);
        return {
            net: acc.net + net,
            tax: acc.tax + tax,
            total: acc.total + net + tax,
            basePaid: 12000, // Mock: Partially paid base
            vatPaid: 0,      // Mock: VAT NOT paid yet
        };
    }, { net: 0, tax: 0, total: 0, basePaid: 0, vatPaid: 0 });
  }, [items]);

  const debtBalance = totals.total - (totals.basePaid + totals.vatPaid);
  const eQaimeStatus: 'Draft' | 'Sent' | 'Accepted' = 'Draft';

  // HELPERS
  const handleAddItem = () => {
    setItems([...items, {
      id: Math.random().toString(36).substr(2, 9),
      code: '', name: '', unit: 'ədəd', quantity: 1, price: 0, discount: 0, taxRate: 18, taxCode: '', cogs: 0
    }]);
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
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Satış Qaiməsi</h1>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        currentStatus === 'DRAFT' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>{currentStatus}</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    <div className="flex items-center">
                        <span className="mr-1">№:</span>
                        <input 
                          type="text" 
                          value={docNumber} 
                          onChange={(e) => setDocNumber(e.target.value)}
                          className="bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-md px-2 py-0.5 w-[140px] text-[10px] font-black text-indigo-600 focus:ring-1 focus:ring-indigo-500 outline-none transition-all italic tracking-tighter shadow-inner"
                        />
                    </div>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="flex items-center text-rose-500 italic"><History className="w-3 h-3 mr-1" /> Vergi: {taxDate}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="flex items-center text-indigo-500 italic"><Calendar className="w-3 h-3 mr-1" /> Maliyyə: {accountingDate}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsJournalVisible(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
            >
                <BookOpen className="w-4 h-4" />
                <span>Müxabirləşməyə Bax</span>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                <Save className="w-4 h-4" />
                <span>Sənədi Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentFlow 
        nodes={[
          { id: 'so-1', type: 'ORDER', number: 'SO-2024-001', date: '2024-04-10', status: 'COMPLETED', path: '/sales/order/1' },
          { id: 'gi-1', type: 'WAREHOUSE', number: 'GI-2024-005', date: '2024-04-12', status: 'PROCESSED', path: '/inventory/moves/1' },
          { id: 'inv-1', type: 'INVOICE', number: docNumber, date: accountingDate, status: currentStatus, current: true, path: '#' },
        ]} 
      />

      <DocumentStatusProgress currentStatus={currentStatus} />

      {periodClosed && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-center justify-between animate-in slide-in-from-top-4">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center animate-pulse">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-rose-900 uppercase italic">Dövr Bağlanıb (Accounting Period Locked)</h4>
                    <p className="text-xs font-bold text-rose-500 italic uppercase tracking-tighter">Hər hansı bir əməliyyat üçün yalnız Admin icazəsi tələb olunur.</p>
                </div>
            </div>
            {isAdmin && (
                <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Admin Səlahiyyəti Aktivdir
                </div>
            )}
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* 2. Customer & 3. Sales Info */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <User className="w-3.5 h-3.5 mr-2" /> Müştəri Məlumatları
                        </label>
                        <select disabled={periodClosed && !isAdmin} value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20">
                            <option value="">Müştəri Seçin...</option>
                            <option value="Azersun Holding">Azərsun Holdinq MMC</option>
                            <option value="Kapital Bank">Kapital Bank ASC</option>
                        </select>
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black text-indigo-500 uppercase italic leading-none">{customerVoen}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{customerType}</span>
                        </div>
                    </div>

                    <div className="space-y-4 lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satış Növü</label>
                            <select disabled={periodClosed && !isAdmin} value={salesType} onChange={(e) => setSalesType(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-3 text-xs font-bold">
                                <option value="Local">Yerli Satış</option>
                                <option value="Export">İxrac</option>
                                <option value="Service">Xidmət Satışı</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anbar</label>
                            <select disabled={periodClosed && !isAdmin} value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-3 text-xs font-bold">
                                <option>Bakı Mərkəz Anbarı</option>
                                <option>Gəncə Filial</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center italic">
                                <History className="w-3 h-3 mr-1" /> Vergi Tarixi
                            </label>
                            <input type="date" disabled={periodClosed && !isAdmin} value={taxDate} onChange={(e) => setTaxDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-3 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center italic">
                                <Calendar className="w-3 h-3 mr-1" /> Maliyyə Tarixi
                            </label>
                            <input type="date" disabled={periodClosed && !isAdmin} value={accountingDate} onChange={(e) => setAccountingDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-3 text-xs font-bold" />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800 relative z-10">
                    <button onClick={() => setIsLogisticsExpanded(!isLogisticsExpanded)} className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                        {isLogisticsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <Truck className="w-3.5 h-3.5" />
                        <span>Çatdırılma və Logistika Detalları</span>
                    </button>
                    {isLogisticsExpanded && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center italic"><MapPin className="w-3 h-3 mr-1.5" /> Çatdırılma Ünvanı</label>
                                <input disabled={periodClosed && !isAdmin} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Küçə, Bina, Ofis..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center italic"><User className="w-3 h-3 mr-1.5" /> Sürücü / Nəqliyyatçı</label>
                                <input disabled={periodClosed && !isAdmin} value={transporter} onChange={(e) => setTransporter(e.target.value)} placeholder="Ad, Soyad və ya Şirkət..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-medium" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 5. Line Items Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-indigo-600" /> Mal və Xidmət Sətri
                    </h3>
                    <button disabled={periodClosed && !isAdmin} onClick={handleAddItem} className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Yeni Sətir</span>
                    </button>
                </div>
                <div className="overflow-x-auto overflow-y-visible">
                    <table className="w-full text-left text-xs font-bold border-collapse min-w-[1100px]">
                        <thead className="bg-white dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-5">Məhsul Detalları</th>
                                <th className="px-4 py-5 text-right">Miqdar</th>
                                <PriceVisibility>
                                    <th className="px-4 py-5 text-right">Qiymət</th>
                                    <th className="px-4 py-5 text-right">Endirim %</th>
                                    <th className="px-4 py-5 text-right text-indigo-600 font-black">Yekun</th>
                                </PriceVisibility>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{item.code || 'CODE-NEW'}</p>
                                                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[8px] font-black italic">{item.taxCode || 'Kodsuz'}</span>
                                            </div>
                                            <input disabled={periodClosed && !isAdmin} value={item.name} placeholder="Məhsul adı..." className="bg-transparent border-none p-0 text-xs font-bold text-slate-800 dark:text-white outline-none w-full" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-right">
                                        <input type="number" disabled={periodClosed && !isAdmin} value={item.quantity} className="w-16 bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg px-2 py-1 text-right font-mono text-xs" />
                                    </td>
                                    <PriceVisibility>
                                        <td className="px-4 py-5 text-right font-mono">{item.price.toLocaleString()}</td>
                                        <td className="px-4 py-5 text-right font-mono text-rose-500">-{item.discount}%</td>
                                        <td className="px-4 py-5 text-right font-black text-sm text-indigo-600 tabular-nums">
                                            {(item.quantity * item.price * (1 - item.discount / 100) * 1.18).toLocaleString()}
                                        </td>
                                    </PriceVisibility>
                                    <td className="px-6 py-5 text-right">
                                        <button disabled={periodClosed && !isAdmin} className="p-2 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
                        <div className="flex items-center space-x-4">
                             <div className="w-1.5 h-10 bg-indigo-500 rounded-full"></div>
                             <div>
                                 <p className="text-xs font-black text-slate-800 dark:text-white uppercase">Menecer Təsdiqi Gözlənilir</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gözləmə: 2 saat 14 dəqiqə</p>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6 group transition-all hover:border-indigo-100">
                <PriceVisibility>
                    <div className="text-center space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yekun Satış (AZN)</p>
                        <h2 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                            {totals.total.toLocaleString()}
                        </h2>
                        <div className="flex justify-center space-x-4 pt-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Net: {totals.net.toLocaleString()}</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">VAT: {totals.tax.toLocaleString()}</span>
                        </div>
                    </div>
                </PriceVisibility>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 space-y-4 border border-slate-100 dark:border-slate-800">
                    <button onClick={() => setIsDebitorExpanded(!isDebitorExpanded)} className="w-full flex items-center justify-between font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">
                        <span className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Ödəniş İzləmə</span>
                        {isDebitorExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {isDebitorExpanded && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                    <span>Əsas Məbləğ Bakıdan</span>
                                    <span className="text-emerald-600 tabular-nums">{totals.basePaid.toLocaleString()} ₼</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${(totals.basePaid / totals.net) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-black">
                                <span className="uppercase text-[9px] text-slate-400">Qalıq Borc:</span>
                                <span className="text-rose-600 tabular-nums">{debtBalance.toLocaleString()} ₼</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col space-y-4 shadow-sm">
                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                    <Globe className="w-3.5 h-3.5 mr-2" /> E-Qaimə Statusu
                 </h4>
                 <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 rounded-lg uppercase tracking-widest">{eQaimeStatus === 'Draft' ? 'Yazılmayıb' : 'Göndərilib'}</span>
                    <button className="text-[10px] font-black text-indigo-600 uppercase underline hover:text-indigo-700">Sync</button>
                 </div>
                 <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl flex items-center space-x-2">
                    <Info className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase leading-tight italic">Müştəri tərəfindən təsdiq gözlənilir.</span>
                 </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <button onClick={() => setIsNotesExpanded(!isNotesExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">
                   <span>Daxili Qeydlər</span>
                   {isNotesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isNotesExpanded && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-1">
                        <textarea rows={3} disabled={periodClosed && !isAdmin} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-medium resize-none outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Muhasibatlıq və ya anbar üçün..."></textarea>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 transition-all shadow-2xl h-[90px]">
          <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="px-6 py-2.5 text-slate-500 font-black text-xs uppercase tracking-widest transition-all">Ləğv Et</button>
              <button disabled={periodClosed && !isAdmin} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-xs uppercase tracking-widest text-slate-700 dark:text-white disabled:opacity-50">Qaralamaya At</button>
              <button disabled={periodClosed && !isAdmin} onClick={() => setCurrentStatus('POSTED')} className="px-12 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50">Satışı Bitir</button>
          </div>
      </div>

      <JournalPreviewModal 
        isOpen={isJournalVisible} 
        onClose={() => setIsJournalVisible(false)} 
        periodClosed={periodClosed} 
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default SalesInvoiceCreate;
