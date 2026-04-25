import { 
  TrendingUp, Users, ShoppingBag, AlertCircle, 
  ArrowUpRight, Activity, Plus, Trash2, 
  Settings2, Layout, BarChart3, PieChart,
  Calendar, CheckCircle2, MoreVertical
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFormat } from '../context/FormatContext';
import { useLocalization } from '../context/LocalizationContext';

interface Widget {
  id: string;
  type: 'kpi' | 'chart' | 'activity';
  title: string;
  value?: string;
  change?: string;
}

interface DashboardPage {
  id: string;
  title: string;
  widgets: Widget[];
}

const Dashboard = () => {
  const { formatCurrency } = useFormat();
  const { t } = useLocalization();
  const [pages, setPages] = useState<DashboardPage[]>(() => {
    const saved = localStorage.getItem('erp_dashboards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(p => p && p.id);
        }
      } catch (e) {
        console.error('Failed to parse erp_dashboards:', e);
      }
    }
    return [{ id: 'main', title: 'Əsas Panel', widgets: [] }];
  });
  const [activePageId, setActivePageId] = useState('main');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('erp_dashboards', JSON.stringify(pages));
  }, [pages]);

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const addNewPage = () => {
    const newId = `page_${Date.now()}`;
    const newPage: DashboardPage = {
      id: newId,
      title: `Yeni Səhifə ${pages.length + 1}`,
      widgets: []
    };
    setPages([...pages, newPage]);
    setActivePageId(newId);
  };

  const deletePage = (id: string) => {
    if (id === 'main') return;
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    setActivePageId('main');
  };

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      type,
      title: type === 'kpi' ? 'Yeni KPI' : type === 'chart' ? 'Yeni Diaqram' : 'Yeni Fəaliyyət',
      value: type === 'kpi' ? '0.00' : undefined
    };
    
    setPages(pages.map(p => 
      p.id === activePageId 
        ? { ...p, widgets: [...p.widgets, newWidget] }
        : p
    ));
  };

  const removeWidget = (widgetId: string) => {
    setPages(pages.map(p => 
      p.id === activePageId 
        ? { ...p, widgets: p.widgets.filter(w => w.id !== widgetId) }
        : p
    ));
  };

  const clearPage = () => {
    setPages(pages.map(p => 
      p.id === activePageId ? { ...p, widgets: [] } : p
    ));
  };

  return (
    <div className="space-y-6 max-w-[90rem] mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* Header & Page Management */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md text-[10px] font-black uppercase tracking-widest italic border border-primary-100">Analytics Hub</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Personalized Command Center</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic flex items-center">
            <Layout className="w-8 h-8 mr-3 text-primary-600" />
            {t('dashboard.title')}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
           <button 
            onClick={addNewPage}
            className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest italic hover:scale-105 transition-all shadow-lg shadow-primary-500/20 flex items-center"
           >
              <Plus className="w-4 h-4 mr-2" /> {t('dashboard.new_page')}
           </button>
           <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest italic transition-all flex items-center border-2 ${
              isEditing ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
           >
              <Settings2 className="w-4 h-4 mr-2" /> {isEditing ? t('dashboard.finish_edit') : t('dashboard.edit')}
           </button>
           {activePageId !== 'main' && (
             <button 
              onClick={() => deletePage(activePageId)}
              className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
              title="Səhifəni Sil"
             >
                <Trash2 className="w-5 h-5" />
             </button>
           )}
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar pb-4">
         {pages.map(page => (
           <button
            key={page.id}
            onClick={() => setActivePageId(page.id)}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest italic transition-all whitespace-nowrap ${
              activePageId === page.id 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105' 
                : 'bg-white dark:bg-slate-900 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
            }`}
           >
             {page.title}
           </button>
         ))}
      </div>

      {/* Main Content */}
      <div className="space-y-8 min-h-[60vh] relative">
         {isEditing && (
           <div className="flex flex-wrap gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
              <div className="w-full flex justify-between items-center mb-2 px-2">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('dashboard.add_elements') || 'Dashboard Elementləri Əlavə Et'}</h4>
                 <button onClick={clearPage} className="text-[10px] font-black text-rose-500 uppercase italic hover:underline">{t('dashboard.clear_page')}</button>
              </div>
              <button onClick={() => addWidget('kpi')} className="flex-1 min-w-[150px] p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50/50 transition-all group flex flex-col items-center text-center">
                 <Activity className="w-6 h-6 text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-black uppercase italic text-slate-700 dark:text-slate-300 tracking-tight">{t('dashboard.new_kpi')}</span>
              </button>
              <button onClick={() => addWidget('chart')} className="flex-1 min-w-[150px] p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group flex flex-col items-center text-center">
                 <BarChart3 className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-black uppercase italic text-slate-700 dark:text-slate-300 tracking-tight">{t('dashboard.new_chart')}</span>
              </button>
              <button onClick={() => addWidget('activity')} className="flex-1 min-w-[150px] p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group flex flex-col items-center text-center">
                 <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-black uppercase italic text-slate-700 dark:text-slate-300 tracking-tight">{t('dashboard.new_activity')}</span>
              </button>
           </div>
         )}

         {/* Default Content if Main and Empty or Custom */}
         {activePageId === 'main' && activePage.widgets.length === 0 ? (
           <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* Original Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('dashboard.total_revenue')} value={formatCurrency(80000, 'AZN')} change="100%" label="Yeni Şirkət Dataları" icon={TrendingUp} color="primary" />
                <StatCard title={t('dashboard.net_profit')} value={formatCurrency(20000, 'AZN')} change="25%" label="Marja Analizi" icon={Activity} color="indigo" />
                <StatCard title={t('dashboard.capital')} value={formatCurrency(100000, 'AZN')} label="Təsisçi Qoyuluşu" icon={Users} color="emerald" />
                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-6 rounded-3xl shadow-soft-lg text-white relative overflow-hidden group">
                  <AlertCircle className="absolute top-[-20px] right-[-20px] w-32 h-32 opacity-10 rotate-12" />
                  <p className="text-[11px] uppercase tracking-widest font-black text-primary-200 mb-1">Ay Sonu Bağlanış</p>
                  <h3 className="text-3xl font-black text-white italic">Hazır</h3>
                  <div className="mt-6 flex items-center space-x-2">
                     <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-bold text-primary-100 uppercase italic tracking-widest">Trial Balance OK</span>
                  </div>
                </div>
              </div>

              {/* Original Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] shadow-soft border border-slate-100 dark:border-slate-800 p-8">
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight italic">{t('dashboard.revenue_dynamics') || 'Gəlir/Xərc Dinamikası'}</h3>
                       <div className="flex space-x-2">
                          {['AY', 'RÜB', 'İL'].map(t => (
                            <button key={t} className="px-3 py-1 rounded-lg text-[9px] font-black uppercase italic text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">{t}</button>
                          ))}
                       </div>
                    </div>
                    <div className="h-64 flex items-end justify-between space-x-3 px-4">
                       {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center group">
                            <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-t-2xl relative overflow-hidden h-full flex flex-col justify-end">
                               <div style={{ height: `${h}%` }} className="w-full bg-primary-600 group-hover:bg-indigo-600 transition-all duration-500 rounded-t-2xl shadow-inner"></div>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 mt-3 uppercase italic">Həftə {i+1}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-soft border border-slate-100 dark:border-slate-800 p-8 flex flex-col">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight italic mb-8">{t('dashboard.pending_approvals') || 'Gözləyən Təsdiqlər'}</h3>
                    <div className="flex-1 space-y-4">
                       {['Satış #S-2026', 'Anbar #INV-92', 'Kassa #MO-11', 'Kadr #HR-44'].map((t, i) => (
                         <div key={i} className="flex items-center space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 group-hover:rotate-12 transition-transform">
                               <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                               <p className="text-[12px] font-black text-slate-700 dark:text-slate-300 uppercase italic tracking-tight">{t}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-0.5">Mühasibatlıq • 10 dəq. öncə</p>
                            </div>
                            <MoreVertical className="w-4 h-4 text-slate-300" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {activePage.widgets.length === 0 && !isEditing && (
                <div className="lg:col-span-3 flex flex-col items-center justify-center py-20 text-center space-y-6">
                   <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <Layout className="w-10 h-10 text-slate-300" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic">{t('dashboard.empty_page') || 'Boş Səhifə'}</h3>
                      <p className="text-xs text-slate-400 font-bold italic uppercase tracking-widest max-w-xs">{t('dashboard.empty_desc') || 'Bu səhifəyə element əlavə etmək üçün "Düzəliş Et" düyməsini sıxın.'}</p>
                   </div>
                </div>
              )}
              {activePage.widgets.map(widget => (
                <div key={widget.id} className="relative group">
                   {isEditing && (
                     <button 
                      onClick={() => removeWidget(widget.id)}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg z-20 hover:scale-110 transition-all"
                     >
                        <X className="w-4 h-4" />
                     </button>
                   )}
                   {widget.type === 'kpi' ? (
                     <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-56">
                        <div>
                           <div className="flex justify-between items-start mb-4">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{widget.title}</span>
                              <Activity className="w-5 h-5 text-primary-500" />
                           </div>
                           <h3 className="text-3xl font-black text-slate-800 dark:text-white italic tracking-tight">{formatCurrency(12450.00, 'AZN')}</h3>
                        </div>
                        <div className="flex items-center text-[10px] font-black text-emerald-500 uppercase italic">
                           <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> 12% Artım
                        </div>
                     </div>
                   ) : widget.type === 'chart' ? (
                     <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-soft border border-slate-100 dark:border-slate-800 h-56 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{widget.title}</span>
                           <BarChart3 className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="flex-1 flex items-end space-x-2 px-2">
                           {[30, 60, 45, 80, 50, 90].map((h, i) => (
                             <div key={i} className="flex-1 bg-indigo-500/10 rounded-t-lg relative overflow-hidden h-full flex flex-col justify-end">
                                <div style={{ height: `${h}%` }} className="w-full bg-indigo-600 rounded-t-lg"></div>
                             </div>
                           ))}
                        </div>
                     </div>
                   ) : (
                     <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-soft border border-slate-100 dark:border-slate-800 h-56 flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{widget.title}</span>
                           <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="space-y-3 overflow-y-auto no-scrollbar">
                           {[1,2,3].map(i => (
                             <div key={i} className="flex items-center space-x-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 italic">Əməliyyat #TX-{i}0{i} Təsdiqləndi</span>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, label, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] shadow-soft border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
      <Icon className={`w-24 h-24 text-${color}-600`} />
    </div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 italic mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight italic">{value}</h3>
      </div>
      <div className={`p-4 bg-${color}-50 dark:bg-${color}-900/30 rounded-2xl text-${color}-600 shadow-inner group-hover:rotate-12 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="flex items-center text-[10px] font-black relative z-10 uppercase italic">
      {change && (
        <span className="text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full mr-3 border border-emerald-100 dark:border-emerald-800">
          <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
          {change}
        </span>
      )}
      <span className="text-slate-400 tracking-widest">{label}</span>
    </div>
  </div>
);

const X = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Dashboard;
