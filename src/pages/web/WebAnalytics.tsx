import { 
  BarChart4, TrendingUp, Users, 
  MousePointer2, Target, Globe,
  ArrowUpRight, ArrowDownRight, Activity,
  Filter, Calendar, Download, Sparkles
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const WebAnalytics = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  const stats = [
    { label: 'Ümumi Ziyarətçi', value: '45.2k', change: '+12%', positive: true, icon: Users, color: 'text-blue-500' },
    { label: 'Konversiya Faizi', value: '3.8%', change: '+0.5%', positive: true, icon: Target, color: 'text-indigo-500' },
    { label: 'Həmən Çıxma (Bounce)', value: '42%', change: '-5%', positive: true, icon: Activity, color: 'text-rose-500' },
    { label: 'Sifariş Dəyəri (Avg)', value: '185 AZN', change: '+15 AZN', positive: true, icon: TrendingUp, color: 'text-emerald-500' }
  ];

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">Veb Analitika</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">Veb platformaların performans göstəriciləri</p>
          </div>
          <div className="flex items-center space-x-3">
             <button className="px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center italic">
                <Calendar className="w-3.5 h-3.5 mr-2" />
                <span>Son 30 gün</span>
             </button>
             <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl flex items-center italic">
                <Download className="w-4 h-4 mr-2" />
                <span>Hesabatı Yüklə</span>
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 text-[10px] font-black italic ${s.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {s.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{s.change}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">{s.label}</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white italic tabular-nums tracking-tight">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 flex flex-col shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Trafik Mənbələri</h3>
              <BarChart4 className="w-5 h-5 text-slate-400" />
           </div>
           <div className="flex-1 flex flex-col justify-center space-y-6">
              {[
                { name: 'Direct Traffic', value: '45%', color: 'bg-indigo-500' },
                { name: 'Organic Search', value: '32%', color: 'bg-violet-500' },
                { name: 'Social Media', value: '18%', color: 'bg-blue-500' },
                { name: 'Referral', value: '5%', color: 'bg-slate-400' }
              ].map((src, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[11px] font-black uppercase italic text-slate-600 dark:text-slate-400">
                      <span>{src.name}</span>
                      <span>{src.value}</span>
                   </div>
                   <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full ${src.color} rounded-full`} style={{ width: src.value }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-xl shadow-indigo-500/20 relative overflow-hidden">
           <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest italic border border-white/10 mb-8">
                 <Sparkles className="w-4 h-4 mr-2" /> AI Intelligence Insights
              </div>
              <h3 className="text-3xl font-black uppercase italic leading-tight tracking-tight mb-4">Aİ sizin üçün satış ehtimallarını analiz edir.</h3>
              <p className="text-sm font-bold text-white/70 italic leading-relaxed mb-8 max-w-sm">
                 Veb saytdakı davranış datasına əsasən, səbətdə qalan məhsulların 24 saat ərzində alış ehtimalını 82% proqnozlaşdırırıq.
              </p>
           </div>
           <button className="relative z-10 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl italic">
              Tam Aİ Hesabatını Gör
           </button>
           <Globe className="absolute bottom-[-30px] right-[-30px] w-64 h-64 text-white/10 rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default WebAnalytics;
