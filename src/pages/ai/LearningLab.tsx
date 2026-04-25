import { Cpu, Sparkles, Activity, Zap, Maximize2, Layers, History, Table } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const LearningLab = () => {
  const { isContentFullscreen } = useOutletContext<any>();
  const learningProgress = 42;

  return (
    <div className={`flex flex-col ${isContentFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'} animate-in fade-in duration-500 pb-4 overflow-hidden`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Visual Learning Lab</h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] italic mt-0.5">Agentin YouTube üzərindən apardığı vizual araşdırmalar</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 px-6 rounded-2xl shadow-sm">
          <div className="text-[10px] font-black text-indigo-600 italic uppercase tracking-widest">PROQRES: {learningProgress}%</div>
          <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-lg shadow-indigo-500/40" style={{ width: `${learningProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Sliding Panels UX", desc: "Səhifə yenilənmədən məlumatın sağdan açılması.", status: "Learned", icon: Maximize2 },
            { title: "AI Gradient Palette", desc: "CoPilot üçün bənövşəyi-mavi qradiyent kodları.", status: "Analyzing", icon: Sparkles },
            { title: "Rounded UI Patterns", desc: "Bütün elementlərdə 2.5rem radius standartı.", status: "Learned", icon: Layers },
            { title: "Mobile Bottom Bar", desc: "Mobil ERP üçün naviqasiya məntiqi.", status: "Pending", icon: Cpu },
            { title: "Kanban Drag-n-Drop", desc: "CRM-də kartların hərəkət mexanikası.", status: "Learned", icon: Table },
            { title: "Activity Stream UI", desc: "Live feed və şərhlər bölməsinin dizaynı.", status: "Analyzing", icon: History },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-sm hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors shadow-sm">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                  item.status === 'Learned' ? 'bg-emerald-500/10 text-emerald-500' : 
                  item.status === 'Analyzing' ? 'bg-indigo-500/10 text-indigo-500 animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>{item.status}</span>
              </div>
              <h4 className="text-[13px] font-black uppercase text-slate-800 dark:text-white italic mb-3 leading-tight">{item.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-10 bg-indigo-600 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-4">
              <Activity className="w-8 h-8 animate-pulse" />
              <h3 className="text-2xl font-black uppercase italic tracking-tight">Canlı Analiz: Bitrix24 CoPilot Playlist</h3>
            </div>
            <p className="text-base font-medium italic opacity-90 leading-relaxed max-w-3xl">
              Mən hazırda YouTube-da AI inteqrasiyası videolarını izləyirəm. Bitrix-in AI kartlarında istifadə etdiyi kölgə effektləri və mikro-animasiyalar yaddaşa yazılır. Analiz bitdikdən sonra sistemimizdəki S-AI Agent interfeysinə tətbiq ediləcək.
            </p>
          </div>
          <Zap className="absolute top-[-40px] right-[-40px] w-64 h-64 text-white/10 rotate-[15deg]" />
        </div>
      </div>
    </div>
  );
};

export default LearningLab;
