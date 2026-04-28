import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, CheckCircle2, History, 
  Save, Info, ShoppingCart, 
  Calendar, User, ShieldCheck, 
  Plus, Truck, CreditCard, Clock, Package, AlertCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { shouldHidePrices } from '../../utils/permissionHelper';
import { flowResolver, type FlowDecision } from '../../services/CommercialFlowResolver';

interface PurchaseItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  expectedPrice: number;
  taxRate: number;
  priceSource: 'QRP' | 'MANUAL';
  limitQty?: number;
  usedQty?: number;
}

const PurchaseOrderCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingData = location.state as { vendor?: string, items?: PurchaseItem[] } | null;

  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`PO-${new Date().getFullYear()}-0341`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [vendorName, setVendorName] = useState(incomingData?.vendor || '');

  const [selectedContract, setSelectedContract] = useState('');
  const [selectedQrpVersion, setSelectedQrpVersion] = useState('');
  const [currency, setCurrency] = useState('AZN');

  const [items, setItems] = useState<PurchaseItem[]>(incomingData?.items?.map(i => ({...i, priceSource: 'QRP', limitQty: 1000, usedQty: 450})) || [
    { id: '1', name: 'Server Rack 42U Cabinet', sku: 'HW-SRV-01', qty: 2, expectedPrice: 1250.00, taxRate: 18, priceSource: 'QRP', limitQty: 10, usedQty: 4 },
    { id: '2', name: 'Cisco Core Switch L3', sku: 'NET-SW-9200', qty: 1, expectedPrice: 3450.00, taxRate: 18, priceSource: 'MANUAL' },
  ]);

  const [decision, setDecision] = useState<FlowDecision | null>({
    status: 'DECISION_REQUIRED',
    message: 'Bu təchizatçı ilə aktiv müqavilə tapılmadı.',
    options: [
      { id: 'c1', label: 'Sürətli Müqavilə Yarat', description: 'Müqavilə məlumatlarını daxil edin', action: 'CREATE_CONTRACT' },
      { id: 'c2', label: 'Manual Davam Et', description: 'Müqaviləsiz davam et', action: 'PROCEED_MANUAL' }
    ]
  });

  const totals = useMemo(() => {
    return items.reduce((acc, item) => {
      const net = item.qty * item.expectedPrice;
      const tax = net * (item.taxRate / 100);
      return {
        net: acc.net + net,
        tax: acc.tax + tax,
        total: acc.total + net + tax
      };
    }, { net: 0, tax: 0, total: 0 });
  }, [items]);

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
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                        <ShoppingCart className="w-6 h-6 mr-2 text-amber-500" /> Təchizatçı Sifarişi
                    </h1>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">PURCHASE ORDER</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic uppercase"><History className="w-3.5 h-3.5 mr-1 text-amber-500" /> {date}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sifarişi Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-9 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-10 relative overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Truck className="w-3.5 h-3.5 mr-2 text-amber-500" /> Təchizatçı
                        </label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                              placeholder="Təchizatçı adı və ya VÖEN..." 
                              value={vendorName}
                              onChange={(e) => setVendorName(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black outline-none focus:ring-4 focus:ring-amber-500/10 shadow-inner italic uppercase leading-none" 
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-amber-500" /> Tarix
                        </label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-amber-500/10 shadow-inner italic uppercase leading-none" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Müqavilə və QRP
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <select value={selectedContract} onChange={(e) => setSelectedContract(e.target.value)} className={`w-full ${decision?.status === 'DECISION_REQUIRED' ? 'ring-2 ring-rose-500/20 bg-rose-50/10' : 'bg-slate-50'} dark:bg-slate-800 border-none rounded-xl py-3.5 px-4 text-xs font-black italic shadow-inner outline-none transition-all`}>
                                <option value="">Müqavilə Seçin...</option>
                                <option value="CONT-2024-001">CONT-2024-001 (Aktiv)</option>
                            </select>
                            <select value={selectedQrpVersion} onChange={(e) => setSelectedQrpVersion(e.target.value)} className="w-full bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl py-3.5 px-4 text-xs font-black italic shadow-inner outline-none">
                                <option value="">Protokol (QRP)...</option>
                                <option value="QRP-V1">QRP-2024-V1 (Cari)</option>
                                <option value="QRP-V2">QRP-2024-V2 (Yeni)</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <CreditCard className="w-3.5 h-3.5 mr-2 text-amber-500" /> Valyuta və Ödəniş
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3.5 px-4 text-xs font-black italic shadow-inner outline-none">
                                <option>AZN</option>
                                <option>USD</option>
                            </select>
                            <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3.5 px-4 text-xs font-black italic shadow-inner outline-none">
                                <option>Köçürmə</option>
                                <option>Nəqd</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* RESOLVER DECISION HUB */}
            {decision && (
                <div className={`bg-gradient-to-r ${decision.status === 'DECISION_REQUIRED' ? 'from-rose-50 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-900/10 border-rose-200' : 'from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200'} rounded-[2.5rem] border p-8 space-y-6 animate-in slide-in-from-top-4 duration-500`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-2xl ${decision.status === 'DECISION_REQUIRED' ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'} shadow-lg`}>
                                <Info className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight leading-none mb-1">Dinamik Qərar Mərkəzi</h4>
                                <p className="text-[11px] font-bold text-slate-500 italic uppercase leading-none">{decision.message}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {decision.options?.map(opt => (
                            <button key={opt.id} onClick={() => setDecision(null)} className="flex flex-col text-left p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] hover:border-amber-500 transition-all group shadow-sm">
                                <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase italic mb-1 group-hover:text-amber-600">{opt.label}</span>
                                <span className="text-[9px] font-bold text-slate-400 italic leading-none">{opt.description}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-amber-50 dark:border-amber-800 flex justify-between items-center bg-amber-50/20">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic flex items-center">
                        <Plus className="w-4 h-4 mr-2 text-amber-500" /> Alınacaq Mallar
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Məhsulun Adı</th>
                                <th className="px-4 py-5 text-right">Miqdar</th>
                                <th className="px-4 py-5 text-center">Mənbə</th>
                                <th className="px-4 py-5 text-right">Qiymət</th>
                                <th className="px-8 py-5 text-right">Cəmi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => (
                                <tr key={item.id} className="group hover:bg-amber-50/30">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 dark:text-white text-sm italic">{item.name}</span>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-[10px] font-bold text-slate-400">{item.sku}</span>
                                                {item.priceSource === 'QRP' && item.limitQty && (
                                                    <div className="flex items-center space-x-2 ml-4">
                                                        <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                            <div 
                                                              className={`h-full ${((item.usedQty || 0) / item.limitQty) > 0.8 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                                              style={{width: `${((item.usedQty || 0) / item.limitQty) * 100}%`}}
                                                            ></div>
                                                        </div>
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                                            {Math.round(((item.usedQty || 0) / item.limitQty) * 100)}% LİMİT
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-right tabular-nums font-black">{item.qty} ədəd</td>
                                    <td className="px-4 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest italic ${item.priceSource === 'QRP' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                {item.priceSource}
                                            </span>
                                            {item.priceSource === 'MANUAL' && (
                                                <div className="mt-2 text-[8px] font-black text-rose-500 uppercase tracking-tighter flex items-center">
                                                    <AlertCircle className="w-3 h-3 mr-1" /> Əsaslandırma Tələb Olunur
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-right tabular-nums font-black">
                                        {shouldHidePrices() ? '***' : `${item.expectedPrice.toLocaleString()} ${currency}`}
                                    </td>
                                    <td className="px-8 py-6 text-right tabular-nums font-black italic">
                                        {shouldHidePrices() ? '***' : `${(item.qty * item.expectedPrice * (1 + item.taxRate / 100)).toLocaleString()} ${currency}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
            {!shouldHidePrices() ? (
                <div className="bg-amber-600 rounded-[3rem] p-8 text-white shadow-2xl">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 italic opacity-60">Sifariş Yekunu</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-baseline opacity-60">
                            <span className="text-[10px] font-black uppercase italic">ƏDV (18%)</span>
                            <span className="font-black italic">{totals.tax.toLocaleString()} ₼</span>
                        </div>
                        <div className="pt-6 border-t border-white/20 text-center">
                            <h2 className="text-4xl font-black italic tracking-tighter tabular-nums leading-none">
                                {totals.total.toLocaleString()} <span className="text-xl opacity-60">AZN</span>
                            </h2>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-[3rem] p-8 text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 text-center">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Maliyyə məlumatlarına giriş məhduddur</p>
                </div>
            )}
            
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                    <Info className="w-3.5 h-3.5 mr-2 text-amber-500" /> Məlumat
                </h4>
                <p className="text-[10px] font-bold text-slate-500 italic leading-relaxed uppercase">Bu sifariş təsdiq edildikdən sonra təchizatçıya email vasitəsilə göndəriləcəkdir.</p>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-100 p-6 flex justify-end items-center z-40 h-[90px]">
          <div className="flex space-x-4 px-4 items-center">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-[10px] uppercase italic">Ləğv Et</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-[10px] uppercase shadow-2xl active:scale-95 transition-all">
                 <Save className="w-4 h-4 inline mr-2" />
                 Sifarişi Göndər
              </button>
          </div>
      </div>
    </div>
  );
};

export default PurchaseOrderCreate;
