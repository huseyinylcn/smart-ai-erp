import { 
  ShoppingBag, Search, Filter, 
  MoreVertical, Globe, CheckCircle2, 
  Clock, ArrowUpRight, Plus,
  Layers, Tag, Eye, ArrowDownRight,
  CreditCard, Truck
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const WebOrders = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  const orders = [
    { id: 1, orderNo: 'WEB-4592', customer: 'Ayaz Mammadzada', source: 'Shopify', amount: '154 AZN', status: 'Processing', date: 'Bugün, 12:45' },
    { id: 2, orderNo: 'WEB-4591', customer: 'Lala Aliyeva', source: 'WooCommerce', amount: '890 AZN', status: 'Completed', date: 'Bugün, 10:12' },
    { id: 3, orderNo: 'WEB-4590', customer: 'Orkhan Guliyev', source: 'Custom API', amount: '240 AZN', status: 'Pending', date: 'Dünən, 18:30' }
  ];

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">Veb Sifarişləri</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">Bütün onlayn kanallardan gələn sifarişlər</p>
          </div>
          <div className="flex items-center space-x-3">
             <div className="bg-indigo-50 dark:bg-indigo-900/30 px-5 py-3 rounded-2xl flex items-center space-x-3">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-black text-indigo-600 uppercase italic">Son 1 saatda: 4 yeni sifariş</span>
             </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Sifariş № və ya müştəri axtar..." 
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 pl-10 pr-4 rounded-xl text-xs font-bold italic shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Sifariş № / Mənbə</th>
                <th className="px-6 py-5">Müştəri</th>
                <th className="px-6 py-5">Məbləğ</th>
                <th className="px-6 py-5">Tarix</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{o.orderNo}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase italic tracking-widest">{o.source}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-sm text-slate-700 dark:text-slate-300 italic">{o.customer}</td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-slate-800 dark:text-white italic tabular-nums">{o.amount}</span>
                  </td>
                  <td className="px-6 py-6 text-xs text-slate-500 font-bold italic">{o.date}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase italic ${
                      o.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                      o.status === 'Processing' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors" title="Bax"><Eye className="w-4 h-4" /></button>
                       <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors" title="Statusu dəyiş"><Truck className="w-4 h-4" /></button>
                       <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WebOrders;
