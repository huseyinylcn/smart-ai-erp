import { 
  Globe, Plus, Search, ExternalLink, 
  Settings, MoreVertical, Activity, 
  CheckCircle2, AlertCircle, Layout
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const SiteRegistry = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  const sites = [
    { id: 1, name: 'Main E-commerce', url: 'https://shop.tengry.az', status: 'Online', traffic: '12.5k', platform: 'Custom React' },
    { id: 2, name: 'Corporate Landing', url: 'https://tengry.az', status: 'Online', traffic: '5.2k', platform: 'Next.js' },
    { id: 3, name: 'B2B Portal', url: 'https://b2b.tengry.az', status: 'Maintenance', traffic: '0.8k', platform: 'Custom' }
  ];

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">Saytların Reyestri</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">İnteqrasiya olunmuş veb platformalar</p>
          </div>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center italic">
            <Plus className="w-4 h-4 mr-2" />
            <span>Yeni Sayt Əlavə Et</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar pr-2 pb-8">
        {sites.map((site) => (
          <div key={site.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all group flex flex-col">
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase italic ${
                  site.status === 'Online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {site.status}
                </span>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{site.name}</h3>
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase italic truncate">
                <ExternalLink className="w-3 h-3 mr-1.5 shrink-0" />
                {site.url}
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1 tracking-widest">Trafik (Ay)</p>
                <p className="text-sm font-black text-slate-800 dark:text-white italic">{site.traffic}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1 tracking-widest">Platforma</p>
                <p className="text-sm font-black text-slate-800 dark:text-white italic">{site.platform}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-2 text-[9px] font-black text-indigo-600 uppercase italic tracking-widest">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Real-time Monitoring</span>
               </div>
               <button className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase italic tracking-widest">Tənzimləmələr</button>
            </div>
          </div>
        ))}

        {/* Create New Card */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] flex flex-col items-center justify-center space-y-4 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all cursor-pointer group group-hover:shadow-sm">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
            <Plus className="w-8 h-8" />
          </div>
          <p className="text-[11px] font-black text-slate-400 uppercase italic tracking-widest group-hover:text-slate-800 dark:group-hover:text-white transition-colors">Yeni platforma qoş</p>
        </div>
      </div>
    </div>
  );
};

export default SiteRegistry;
