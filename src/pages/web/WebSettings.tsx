import { 
  Settings, Globe, ShieldCheck, 
  Key, RefreshCw, Layers, 
  Database, Bell, MessageSquare,
  Lock, Zap, Code
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const WebSettings = () => {
  const { isContentFullscreen } = useOutletContext<any>();

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      <div className="flex flex-col space-y-6 mb-8">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">Veb Tənzimləmələr</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic -mt-5">Platforma inteqrasiyaları və təhlükəsizlik ayarları</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* API & Integration Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3.5rem] shadow-sm space-y-8">
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">API və İnteqrasiya</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Universal API Key</label>
                <div className="relative group">
                   <input 
                    type="password" 
                    value="sk_test_51MzS2JAZN8888888888888" 
                    readOnly
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 py-4 px-6 rounded-2xl text-xs font-bold italic shadow-inner"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-indigo-100 transition-all">
                <div className="flex items-center space-x-4">
                  <Database className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic">Real-time Webhooks</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">Sifarişlərin dərhal sinxronizasiyası</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Rules */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3.5rem] shadow-sm space-y-8">
             <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-2xl text-violet-600">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Sinxronizasiya Qaydaları</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Stok Avto-Yenilənmə', desc: 'Anbar qalığı dəyişdikdə vebdə yenilə', icon: Zap },
                { label: 'Qiymət Sinxronizasiyası', desc: 'ERP qiymətlərini veb platformaya tətbiq et', icon: Lock },
                { label: 'Müştəri İnteqrasiyası', desc: 'Yeni qeydiyyatları CRM-ə avto-əlavə et', icon: Globe }
              ].map((rule, i) => (
                <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-3xl transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <rule.icon className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" />
                    <div>
                      <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic">{rule.label}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase italic">{rule.desc}</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                     <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Access */}
          <div className="lg:col-span-2 bg-slate-900 dark:bg-indigo-950 p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
             <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest italic border border-white/10 mb-6">
                   <ShieldCheck className="w-4 h-4 mr-2 text-indigo-400" /> Security Protocol
                </div>
                <h3 className="text-3xl font-black uppercase italic leading-tight tracking-tight mb-4">Məlumat Təhlükəsizliyi və Şifrələmə.</h3>
                <p className="text-sm font-bold text-slate-400 italic leading-relaxed">
                   Bütün API trafikləri AES-256 şifrələmə protokolu ilə qorunur. Hər bir qoşulma fərdi təhlükəsizlik tokeni (JWE) ilə təmin edilir.
                </p>
             </div>
             <div className="relative z-10 flex flex-col space-y-4 shrink-0">
                <button className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl italic">
                   Tokenləri Yenilə
                </button>
                <button className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all italic">
                   Loglara bax
                </button>
             </div>
             <Globe className="absolute top-[-100px] right-[-100px] w-96 h-96 text-white/5 opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSettings;
