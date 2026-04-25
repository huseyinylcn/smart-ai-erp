import { 
  ShoppingCart, Plus, Search, 
  RefreshCw, MoreVertical, Layers, 
  CheckCircle2, AlertCircle, ShoppingBag,
  ExternalLink, TrendingUp, Package
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const OnlineStores = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  const stores = [
    { id: 1, name: 'Baku Store', platform: 'WooCommerce', syncStatus: 'Synced', ordersToday: 24, revenue: '4.2k AZN' },
    { id: 2, name: 'Global Wholesale', platform: 'Shopify', syncStatus: 'Warning', ordersToday: 12, revenue: '12.5k AZN' },
    { id: 3, name: 'Tech Depot', platform: 'Custom API', syncStatus: 'Synced', ordersToday: 8, revenue: '1.8k AZN' }
  ];

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">Onlayn Mağazalar</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">E-ticarət satış kanallarının idarəedilməsi</p>
          </div>
          <div className="flex items-center space-x-3">
             <button className="px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center italic">
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                <span>Hamısını Yenilə</span>
             </button>
             <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center italic">
                <Plus className="w-4 h-4 mr-2" />
                <span>Yeni Mağaza Qoş</span>
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-4 custom-scrollbar pr-2 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all group relative overflow-hidden flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center text-violet-600 shadow-inner group-hover:rotate-12 transition-transform">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-end">
                   <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase italic ${
                     store.syncStatus === 'Synced' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                   }`}>
                      {store.syncStatus === 'Synced' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>{store.syncStatus}</span>
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase italic mt-2 tracking-widest">{store.platform}</span>
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{store.name}</h3>
                <div className="flex items-center text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em] italic">
                   <RefreshCw className="w-3 h-3 mr-1.5 animate-spin-slow" />
                   Son sinxronizasiya: 5 dəq əvvəl
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                 <div className="bg-slate-50/50 dark:bg-slate-800/50 p-5 rounded-3xl border border-transparent hover:border-violet-100 transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase italic mb-2 tracking-widest">Sifarişlər (Bugün)</p>
                    <div className="flex items-center space-x-2">
                       <Package className="w-4 h-4 text-violet-500" />
                       <span className="text-base font-black text-slate-800 dark:text-white italic">{store.ordersToday}</span>
                    </div>
                 </div>
                 <div className="bg-slate-50/50 dark:bg-slate-800/50 p-5 rounded-3xl border border-transparent hover:border-violet-100 transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase italic mb-2 tracking-widest">Gəlir (Bugün)</p>
                    <div className="flex items-center space-x-2">
                       <TrendingUp className="w-4 h-4 text-emerald-500" />
                       <span className="text-base font-black text-slate-800 dark:text-white italic">{store.revenue}</span>
                    </div>
                 </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                 <button className="text-[10px] font-black text-slate-400 hover:text-violet-600 uppercase tracking-widest italic transition-colors flex items-center">
                    Dashboard-a bax <ExternalLink className="w-3 h-3 ml-1.5" />
                 </button>
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200"></div>
                    ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnlineStores;
