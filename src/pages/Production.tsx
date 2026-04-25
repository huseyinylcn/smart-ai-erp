import { useState } from 'react';
import { 
  Factory, PlayCircle, CheckCircle2, AlertCircle, 
  Search, Plus, ClipboardList, 
  Timer, ArrowRight, MoreVertical,
  Activity, BarChart3, Settings2,
  TrendingUp, PackageCheck, PackageOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Production = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Aktiv Sifarişlər', value: '12', change: '+2 bugün', icon: Timer, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Tamamlanmış (Ay)', value: '142', change: '+12.5%', icon: PackageCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Gecikən İşlər', value: '3', change: 'Kritik', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Ümumi Verimlilik', value: '94.2%', change: '+0.8%', icon: Activity, color: 'text-primary-600', bg: 'bg-primary-50' },
  ];

  const orders = [
    { id: 'PRD-T-001', product: 'Metal Masa (Ofis)', qty: '50 ədəd', warehouse: 'Mərkəzi Xammal Anbarı', status: 'In Progress', progress: 45, startDate: '25.04.2026', endDate: '27.04.2026', priority: 'High' },
    { id: 'PRD-T-002', product: 'Taxta Dolab (4 Qapılı)', qty: '20 ədəd', warehouse: 'İstehsalat Sahəsi', status: 'Draft', progress: 0, startDate: '26.04.2026', endDate: '29.04.2026', priority: 'Medium' },
    { id: 'PRD-T-003', product: 'Erqonomik Ofis Kreslosu', qty: '100 ədəd', warehouse: 'Mərkəzi Xammal Anbarı', status: 'Completed', progress: 100, startDate: '20.04.2026', endDate: '23.04.2026', priority: 'Low' },
    { id: 'PRD-T-004', product: 'Metal Rəf Sistemi', qty: '10 set', warehouse: 'İstehsalat Sahəsi', status: 'In Progress', progress: 75, startDate: '24.04.2026', endDate: '26.04.2026', priority: 'High' },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Draft': return 'bg-slate-50 text-slate-500 border-slate-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap">Factory Execution</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap italic tracking-tighter">Workflow Management</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner">İstehsalat Reyestri</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-primary-500/10 underline-offset-4 decoration-solid">Sifarişlərin icrası, xammal təminatı və istehsalat analitikası</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 shadow-sm italic-none">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Sifariş № və ya Məhsul..." 
              className="bg-transparent border-none outline-none text-sm font-bold w-48 placeholder-slate-400 italic-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => navigate('/production/bom')} className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95 italic-none">
            <Settings2 className="w-4 h-4 shadow-inner" />
            <span>Resepturalar</span>
          </button>
          <button onClick={() => navigate('/production/order/create')} className="flex items-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 active:scale-95 italic-none">
            <Plus className="w-4 h-4 shadow-inner" />
            <span>Yeni Sifariş</span>
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all group overflow-hidden relative italic-none">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity italic-none">
                <stat.icon className="w-20 h-20" />
            </div>
            <div className="flex items-center justify-between mb-4 italic-none">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner italic-none`}>
                <stat.icon className="w-5 h-5 shadow-inner" />
              </div>
              <div className="flex items-center space-x-1 italic-none">
                 <span className={`text-[10px] font-black uppercase tracking-tighter ${stat.change.includes('+') ? 'text-emerald-500' : 'text-amber-500'}`}>{stat.change}</span>
                 {stat.change.includes('+') ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <BarChart3 className="w-3 h-3 text-amber-500" />}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1 shadow-inner">{stat.label}</p>
            <h3 className="text-xl font-black text-slate-800 dark:text-white tabular-nums italic shadow-inner whitespace-nowrap">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* PRODUCTION TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted">
        
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center italic-none">
            <div className="flex items-center space-x-4 italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner">
                <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 italic-none">
                    <Factory className="w-5 h-5 shadow-inner" />
                </div>
                <div className="italic-none shadow-inner">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner whitespace-nowrap italic tracking-tighter shadow-inner">Aktiv Əmriyyatlar</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-0.5 tracking-tighter shadow-inner">İCRA VƏZİYYƏTİNƏ GÖRƏ SİFARİŞLƏR</p>
                </div>
            </div>
            <div className="flex items-center space-x-3 italic-none underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner">
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner">
                    <PlayCircle className="w-3 h-3 shadow-inner shadow-inner shadow-inner" />
                    <span>İcrada: 8</span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner">
                    <CheckCircle2 className="w-3 h-3 shadow-inner shadow-inner shadow-inner" />
                    <span>Hazır: 4</span>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto italic-none shadow-inner">
          <table className="w-full text-left italic-none shadow-inner tabular-nums font-black italic shadow-inner">
            <thead className="bg-slate-50 dark:bg-slate-800/50 italic-none shadow-inner tabular-nums font-black italic shadow-inner">
              <tr className="italic-none shadow-inner tabular-nums font-black italic shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner">Sifariş № / Məhsul</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner text-center shadow-inner">Miqdar / Anbar</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner">Vəziyyət (Progress)</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic shadow-inner text-center shadow-inner">Prioritet</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right shadow-inner">Tarix Aralığı</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right shadow-inner">Hərəkət</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none shadow-inner">
              {orders.map((order, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer italic-none shadow-inner">
                  <td className="px-8 py-6 italic-none shadow-inner">
                    <div className="flex items-center space-x-4 italic-none shadow-inner">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : order.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                        <ClipboardList className="w-5 h-5 shadow-inner" />
                      </div>
                      <div className="shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner">
                        <p className="text-sm font-black italic text-slate-800 dark:text-white uppercase tracking-tight shadow-inner underline decoration-primary-500/5 underline-offset-2 decoration-dotted shadow-inner">{order.product}</p>
                        <p className="text-[10px] font-bold text-primary-600 uppercase italic mt-0.5 tracking-tighter shadow-inner tabular-nums font-black italic shadow-inner">{order.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center italic-none shadow-inner">
                    <p className="text-sm font-black italic text-slate-700 dark:text-slate-300 tabular-nums shadow-inner">{order.qty}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-0.5 tracking-tighter shadow-inner">{order.warehouse}</p>
                  </td>
                  <td className="px-6 py-6 italic-none shadow-inner">
                    <div className="flex flex-col space-y-2 italic-none shadow-inner">
                        <div className="flex items-center justify-between italic-none shadow-inner">
                            <span className={`px-2 py-0.5 border rounded-md text-[9px] font-black uppercase tracking-widest italic shadow-inner ${getStatusStyle(order.status)}`}>{order.status}</span>
                            <span className="text-[10px] font-black italic tabular-nums text-slate-400 shadow-inner">{order.progress}%</span>
                        </div>
                        <div className="h-1.5 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner">
                            <div 
                                className={`h-full transition-all duration-1000 shadow-inner ${order.status === 'Completed' ? 'bg-emerald-500' : order.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-300'}`} 
                                style={{ width: `${order.progress}%` }}
                            />
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center italic-none shadow-inner">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-inner ${
                        order.priority === 'High' ? 'bg-rose-50 text-rose-600' : 
                        order.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner">
                    <div className="flex flex-col items-end italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner shadow-inner">
                        <p className="text-[11px] font-black italic text-slate-700 dark:text-slate-300 shadow-inner">{order.startDate}</p>
                        <ArrowRight className="w-3 h-3 text-slate-300 my-1 shadow-inner" />
                        <p className="text-[11px] font-black italic text-slate-400 shadow-inner">{order.endDate}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right italic-none shadow-inner">
                    <button className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-400 hover:text-primary-600 rounded-2xl transition-all active:scale-95 shadow-inner italic-none">
                        <MoreVertical className="w-5 h-5 shadow-inner" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted">
             <div className="flex items-center space-x-6 italic-none shadow-inner">
                <div className="flex items-center space-x-2 text-slate-400 italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner">
                    <TrendingUp className="w-4 h-4 shadow-inner" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner">AYLIQ PLANA GÖRƏ İCRA: 82%</span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 italic-none shadow-inner"></div>
                <div className="flex items-center space-x-2 text-slate-400 italic-none shadow-inner tabular-nums font-black italic shadow-inner shadow-inner">
                    <PackageOpen className="w-4 h-4 shadow-inner" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner">Gözlənilən Hazır Məhsul: 1,240 ABV</span>
                </div>
             </div>
             <button onClick={() => navigate('/production/output/create')} className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95 italic-none shadow-inner underline decoration-primary-500/5 underline-offset-8 decoration-dotted shadow-inner shadow-inner">
                <span>Məhsul Çıxışı (Output)</span>
                <ChevronRight className="w-4 h-4 shadow-inner shadow-inner" />
             </button>
        </div>
      </div>

    </div>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default Production;
