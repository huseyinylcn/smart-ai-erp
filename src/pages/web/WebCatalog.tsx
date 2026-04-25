import { 
  Package, Search, Filter, 
  MoreVertical, Globe, CheckCircle2, 
  AlertCircle, ArrowUpRight, Plus,
  Layers, Tag, Eye
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const WebCatalog = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  const products = [
    { id: 1, name: 'iPhone 15 Pro', sku: 'IP15P-256-GR', stock: 42, price: '2,499 AZN', status: 'Published', channels: ['Main', 'Store'] },
    { id: 2, name: 'MacBook Air M3', sku: 'MBA-M3-16-512', stock: 15, price: '3,199 AZN', status: 'Draft', channels: ['Store'] },
    { id: 3, name: 'AirPods Pro 2', sku: 'APP2-WHT', stock: 120, price: '549 AZN', status: 'Published', channels: ['Main'] }
  ];

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">Məhsul Kataloqu (Veb)</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">Veb platformalarda görünən məhsulların idarəedilməsi</p>
          </div>
          <div className="flex items-center space-x-3">
             <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center italic">
                <Plus className="w-4 h-4 mr-2" />
                <span>Məhsul Əlavə Et</span>
             </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Kataloqda axtarış..." 
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
                <th className="px-8 py-5">Məhsul / SKU</th>
                <th className="px-6 py-5">Veb Status</th>
                <th className="px-6 py-5">Kanallar</th>
                <th className="px-6 py-5">Stok</th>
                <th className="px-6 py-5">Qiymət</th>
                <th className="px-8 py-5 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 transition-all">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase italic ${
                      p.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center -space-x-1">
                      {p.channels.map((ch, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] text-white font-black uppercase italic">
                           {ch[0]}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-slate-800 dark:text-white italic tabular-nums">{p.stock}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-slate-800 dark:text-white italic tabular-nums">{p.price}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><Eye className="w-4 h-4" /></button>
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

export default WebCatalog;
