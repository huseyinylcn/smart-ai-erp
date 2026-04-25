import { useState } from 'react';
import { 
  ShoppingCart, Search, Plus, Filter, 
  Download, MoreHorizontal, 
  ChevronRight, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SalesOrderList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation of Sales Orders Data
  const orders = [
    { id: 1, orderNo: "SO-2026-0042", customer: "Caspian Shipping", items: 5, total: 12500, status: "APPROVED", date: "28 Fev 2026", deliveryDate: "10 Mart", rep: "Kamran Q." },
    { id: 2, orderNo: "SO-2026-0043", customer: "Baku Mall LLC", items: 12, total: 45200, status: "DRAFT", date: "01 Mart 2026", deliveryDate: "15 Mart", rep: "Aysel Q." },
    { id: 3, orderNo: "SO-2026-0044", customer: "SOCAR Tower", items: 3, total: 8900, status: "PENDING", date: "02 Mart 2026", deliveryDate: "05 Mart", rep: "Fuad M." },
    { id: 4, orderNo: "SO-2026-0045", customer: "Gilan Textile", items: 8, total: 12050, status: "COMPLETED", date: "03 Mart 2026", deliveryDate: "03 Mart", rep: "Kamran Q." },
    { id: 5, orderNo: "SO-2026-0046", customer: "Aşberon Port", items: 25, total: 120000, status: "REJECTED", date: "04 Mart 2026", deliveryDate: "20 Mart", rep: "Leyla H." },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 shadow-sm';
      case 'APPROVED': return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 shadow-sm';
      case 'PENDING': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 shadow-sm';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 shadow-sm';
      case 'DRAFT': return 'bg-slate-50 text-slate-500 dark:bg-slate-800/20 shadow-sm shadow-sm';
      default: return 'bg-slate-50 text-slate-600 shadow-sm';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none shadow-sm">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 shadow-sm shadow-sm">
        <div>
          <div className="flex items-center space-x-3 mb-2 shadow-sm shadow-sm shadow-sm shadow-sm">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Sifarişlərin İdarə Olunması</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Sifariş Reyestri (Sales Orders)</h1>
        </div>
        <div className="flex items-center space-x-3 shadow-sm shadow-sm">
           <button 
             onClick={() => navigate('/sales/order/create')}
             className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic shadow-sm shadow-sm shadow-sm"
           >
              <Plus className="w-4 h-4 shadow-sm" />
              <span>Yeni Sifariş</span>
           </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative flex-1 group shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors shadow-sm shadow-sm" />
              <input 
                type="text" 
                placeholder="Sifariş №, Müştəri adı və ya Agent üzrə axtar..."
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center space-x-3 shadow-sm">
              <button className="flex items-center space-x-2 px-6 py-5 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-inner hover:bg-slate-100 transition-all italic shadow-sm">
                 <Filter className="w-4 h-4 shadow-sm" />
                 <span>Status</span>
              </button>
              <button className="p-5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl shadow-inner hover:text-indigo-500 transition-all shadow-sm">
                 <Download className="w-4 h-4 shadow-sm" />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto mt-8 shadow-sm">
           <table className="w-full text-left border-collapse shadow-sm shadow-sm">
              <thead>
                 <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800 shadow-sm shadow-sm shadow-sm">
                    <th className="px-10 py-6 shadow-sm shadow-sm">Sifariş №</th>
                    <th className="px-6 py-6 shadow-sm">Müştəri Detalları</th>
                    <th className="px-6 py-6 text-right shadow-sm shadow-sm shadow-sm">Ümumi Toplam</th>
                    <th className="px-6 py-6 shadow-sm">Status / Tarix</th>
                    <th className="px-6 py-6 shadow-sm shadow-sm">Satış Agenti</th>
                    <th className="px-10 py-6 text-right shadow-sm shadow-sm shadow-sm shadow-sm">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 shadow-sm shadow-sm shadow-sm">
                 {filteredOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer shadow-sm shadow-sm shadow-sm shadow-sm">
                       <td className="px-10 py-8 shadow-sm">
                          <div className="flex items-center space-x-4">
                             <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-sm shadow-sm shadow-sm">
                                <ShoppingCart className="w-6 h-6 shadow-sm shadow-sm shadow-sm" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-800 dark:text-white italic uppercase tracking-tight tabular-nums shadow-sm">{order.orderNo}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic shadow-sm">{order.items} Məhsul</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-8 shadow-sm">
                          <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase italic shadow-sm shadow-sm">{order.customer}</p>
                       </td>
                       <td className="px-6 py-8 text-right shadow-sm shadow-sm">
                          <p className="text-sm font-black italic tabular-nums text-slate-800 dark:text-white shadow-sm shadow-sm shadow-sm">
                             ₼ {order.total.toLocaleString()}
                          </p>
                       </td>
                       <td className="px-6 py-8 shadow-sm shadow-sm">
                          <div className="space-y-2 shadow-sm shadow-sm">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center w-fit shadow-sm shadow-sm shadow-sm ${getStatusStyle(order.status)}`}>
                                {order.status}
                             </span>
                             <div className="flex items-center text-[10px] font-bold text-slate-400 italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                                <Calendar className="w-3 h-3 mr-2 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" /> {order.date}
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-8 shadow-sm shadow-sm shadow-sm">
                          <div className="flex items-center space-x-3 shadow-sm shadow-sm shadow-sm shadow-sm">
                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm shadow-sm shadow-sm shadow-sm">
                                {order.rep.split(' ')[0][0]}
                             </div>
                             <span className="text-[11px] font-black italic text-slate-600 dark:text-slate-400 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">{order.rep}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8 text-right shadow-sm shadow-sm shadow-sm shadow-sm">
                          <div className="flex items-center justify-end space-x-2 shadow-sm shadow-sm shadow-sm shadow-sm">
                             <button className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                                <MoreHorizontal className="w-5 h-5 shadow-sm shadow-sm" />
                             </button>
                             <button className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                                <ChevronRight className="w-5 h-5 shadow-sm shadow-sm shadow-sm" />
                             </button>
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

export default SalesOrderList;
