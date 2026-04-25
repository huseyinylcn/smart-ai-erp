import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, CheckCircle2, History, 
  Save, Info, ShoppingCart, 
  Calendar, User, ShieldCheck, 
  Plus, Truck, CreditCard, Clock, Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

interface PurchaseItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  expectedPrice: number;
  taxRate: number;
}

const PurchaseOrderCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`PO-${new Date().getFullYear()}-0341`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [items] = useState<PurchaseItem[]>([
    { id: '1', name: 'Server Rack 42U Cabinet', sku: 'HW-SRV-01', qty: 2, expectedPrice: 1250.00, taxRate: 18 },
    { id: '2', name: 'Cisco Core Switch L3', sku: 'NET-SW-9200', qty: 1, expectedPrice: 3450.00, taxRate: 18 },
  ]);

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
                            <input placeholder="Təchizatçı adı və ya VÖEN..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black outline-none focus:ring-4 focus:ring-amber-500/10 shadow-inner italic uppercase leading-none" />
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
                            <CreditCard className="w-3.5 h-3.5 mr-2 text-amber-500" /> Ödəniş Forması
                        </label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-amber-500/10 shadow-inner italic uppercase leading-none">
                            <option>Köçürmə yolu ilə</option>
                            <option>Nəqd ödəniş</option>
                            <option>Kontos</option>
                        </select>
                    </div>
                </div>
            </div>

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
                                <th className="px-4 py-5 text-right">Gözlənilən Qiymət</th>
                                <th className="px-8 py-5 text-right">Cəmi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => (
                                <tr key={item.id} className="group hover:bg-amber-50/30">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 dark:text-white text-sm italic">{item.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-1">{item.sku}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-right tabular-nums font-black">{item.qty} ədəd</td>
                                    <td className="px-4 py-6 text-right tabular-nums font-black">{item.expectedPrice.toLocaleString()} ₼</td>
                                    <td className="px-8 py-6 text-right tabular-nums font-black italic">
                                        {(item.qty * item.expectedPrice * (1 + item.taxRate / 100)).toLocaleString()} ₼
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
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
