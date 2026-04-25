import React, { useState, memo, useCallback } from 'react';
import { 
  Shield, Users, Lock, ChevronRight, 
  Search, Plus, Save, Eye, Edit3, Trash, Download, 
  FilePlus, X, Sparkles, BarChart3, Zap, Calculator, 
  Landmark, Fingerprint, Settings, LayoutDashboard, 
  Box, ShoppingCart, Truck, Factory
} from 'lucide-react';

// STABLE PREMIUM TOGGLE
const MatrixToggle = memo(() => {
  const [isOn, setIsOn] = useState(false);
  return (
    <div className="flex justify-center items-center w-full h-full">
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOn(!isOn);
        }}
        className={`relative w-11 h-5.5 rounded-full transition-all duration-300 border-2 ${
          isOn 
          ? 'bg-emerald-500 border-emerald-600 shadow-sm' 
          : 'bg-rose-500 border-rose-600 shadow-sm'
        }`}
      >
        <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all duration-300 shadow-sm ${
          isOn ? 'left-6' : 'left-0.5'
        }`} />
      </button>
    </div>
  );
});

MatrixToggle.displayName = 'MatrixToggle';

const RolesPermissions = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [expandedModules, setExpandedModules] = useState<string[]>(['panels', 'crm']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  
  const roles = [
    { id: 'admin', name: 'Admin', users: 2, color: 'bg-indigo-500' },
    { id: 'accountant', name: 'Baş Mühasib', users: 3, color: 'bg-emerald-500' },
    { id: 'sales', name: 'Satış Meneceri', users: 8, color: 'bg-amber-500' },
    { id: 'hr', name: 'İnsan Resursları', users: 1, color: 'bg-rose-500' },
    { id: 'warehouse', name: 'Anbar Məsul', users: 4, color: 'bg-sky-500' }
  ];

  const modules = [
    {
      id: 'panels',
      name: 'Əsas Panellər',
      icon: LayoutDashboard,
      subModules: [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'ai_agent', name: 'S-AI Agent' },
        { id: 'automation', name: 'Automation' },
        { id: 'projects', name: 'Layihələr' }
      ]
    },
    { 
      id: 'crm', 
      name: 'CRM və Müştərilər', 
      icon: Users,
      subModules: [
        { id: 'customers', name: 'Müştəri Reyestri' },
        { id: 'leads', name: 'Potensial Müştərilər' },
        { id: 'opportunities', name: 'Pipeline' }
      ]
    },
    {
      id: 'sales',
      name: 'Satış Əməliyyatları',
      icon: ShoppingCart,
      subModules: [
        { id: 'invoices', name: 'Satış Fakturaları' },
        { id: 'orders', name: 'Sifarişlər' }
      ]
    },
    {
      id: 'finance',
      name: 'Maliyyə & Uçot',
      icon: Calculator,
      subModules: [
        { id: 'accounting', name: 'Mühasibatlıq' },
        { id: 'treasury', name: 'Kassa və Bank' },
        { id: 'taxes', name: 'Vergilər' }
      ]
    },
    {
       id: 'analytics',
       name: 'Hesabat Mərkəzi',
       icon: BarChart3,
       subModules: [
         { id: 'finance_rep', name: 'Maliyyə Hesabatları' },
         { id: 'sales_rep', name: 'Satış Hesabatları' }
       ]
    }
  ];

  const handleAddRole = () => {
    if(newRoleName.trim()){
      setIsModalOpen(false);
      setNewRoleName('');
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '400px 120px 120px 120px 120px 120px 1fr'
  };

  const toggleModule = useCallback((id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  }, []);

  return (
    <div className="flex h-[calc(100vh-40px)] bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl font-sans">
      
      {/* Sidebar Role Selection */}
      <div className="w-[300px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
           <div className="flex items-center justify-between mb-6">
              <h1 className="text-[20px] font-black uppercase italic tracking-tighter flex items-center space-x-2">
                 <Shield className="w-6 h-6 text-indigo-600" />
                 <span>Rollar</span>
              </h1>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-lg hover:rotate-90 transition-all duration-300 flex items-center justify-center"
              >
                 <Plus className="w-6 h-6 stroke-[3px]" />
              </button>
           </div>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input type="text" placeholder="Rolu axtar..." className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-3.5 text-[13px] font-bold italic w-full focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
           {roles.map((role) => (
             <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full p-4 rounded-2xl flex items-center justify-between group transition-all duration-300 ${
                selectedRole === role.id ? 'bg-indigo-600 text-white shadow-xl translate-x-1' : 'hover:bg-slate-50 text-slate-600 dark:text-slate-300'
              }`}
             >
                <div className="flex items-center space-x-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[11px] uppercase ${selectedRole === role.id ? 'bg-white/20' : role.color + ' text-white'}`}>
                      {role.name.substring(0, 2)}
                   </div>
                   <div className="text-left font-black tracking-tight italic uppercase">
                      <p className="text-[15px] leading-none mb-1">{role.name}</p>
                      <p className={`text-[10px] font-bold not-italic ${selectedRole === role.id ? 'text-white/60' : 'text-slate-400'}`}>{role.users} ISTIFADƏÇİ</p>
                   </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all ${selectedRole === role.id ? 'transform rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
             </button>
           ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 overflow-hidden relative">
         <header className="h-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 shrink-0 z-50">
            <div>
               <h2 className="text-[26px] font-black uppercase italic tracking-tighter leading-none mb-1 text-slate-800 dark:text-white">{roles.find(r => r.id === selectedRole)?.name}</h2>
               <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-black uppercase italic tracking-widest leading-none">
                 <Lock className="w-4 h-4 text-indigo-500" />
                 <span>Matrix Səlahiyyət İdarəetmə Modulu</span>
               </div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center space-x-3">
               <Save className="w-4 h-4" />
               <span>Saxla</span>
            </button>
         </header>

         {/* MATRIX GRID - 1200px Scroll Goal */}
         <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-50/10">
            <div className="min-w-[1240px] flex flex-col h-full">
               
               {/* Matrix Header Row (Sticky Header) */}
               <div style={gridStyle} className="bg-slate-50 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 sticky top-0 z-[60] shadow-sm">
                  {/* First Column Header must be Sticky Left also */}
                  <div className="p-6 border-r border-slate-200 dark:border-slate-700 flex flex-col justify-center sticky left-0 z-[70] bg-slate-200 dark:bg-slate-800">
                     <span className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase italic tracking-widest relative">
                        MODUL VƏ ALT BÖLMLƏR
                        <div className="absolute -bottom-2 left-0 w-8 h-1 bg-indigo-600 rounded-full" />
                     </span>
                  </div>
                  {[
                    { name: 'Baxış', icon: Eye },
                    { name: 'Yarat', icon: FilePlus },
                    { name: 'Düzəlt', icon: Edit3 },
                    { name: 'Sil', icon: Trash },
                    { name: 'Eksport', icon: Download }
                  ].map((col) => (
                    <div key={col.name} className="flex flex-col items-center justify-center p-4 border-r border-slate-100 dark:border-slate-700 bg-slate-50/50">
                       <div className="p-2 bg-white dark:bg-slate-700 rounded-xl mb-2 shadow-sm border border-slate-200 min-w-[32px] flex items-center justify-center">
                          <col.icon className="w-4 h-4 text-indigo-600" />
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{col.name}</span>
                    </div>
                  ))}
                  <div className="bg-slate-100/10" />
               </div>

               {/* Matrix Body (Internal Scroll) */}
               <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 border-t border-slate-200 custom-scrollbar">
                  {modules.map((module) => (
                    <div key={module.id}>
                       {/* Main Row */}
                       <div 
                        style={gridStyle} 
                        className={`transition-all cursor-pointer items-center border-b border-slate-100 dark:border-slate-800 ${expandedModules.includes(module.id) ? 'bg-indigo-50/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`} 
                        onClick={() => toggleModule(module.id)}
                       >
                          {/* Label - Sticky Left */}
                          <div className="p-6 flex items-center space-x-6 border-r border-slate-200 dark:border-slate-700 sticky left-0 z-40 bg-slate-50 dark:bg-slate-900 group-hover:bg-indigo-50 dark:group-hover:bg-slate-800 transition-colors">
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${expandedModules.includes(module.id) ? 'bg-indigo-600 text-white rotate-90' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'}`}>
                                <ChevronRight className="w-4 h-4" />
                             </div>
                             <div className="flex items-center space-x-4">
                                <module.icon className={`w-4.5 h-4.5 ${expandedModules.includes(module.id) ? 'text-indigo-600' : 'text-slate-400'}`} />
                                <span className="text-[14px] font-black uppercase italic text-slate-800 dark:text-white leading-none whitespace-nowrap">{module.name}</span>
                             </div>
                          </div>
                          {[1,2,3,4,5].map(i => <div key={i} className="border-r border-slate-100 dark:border-slate-800 h-full bg-slate-50/5" />)}
                          <div className="flex justify-end items-center px-10 h-full">
                             <button 
                              onClick={(e) => e.stopPropagation()}
                              className="text-[9px] font-black text-indigo-600 bg-white dark:bg-slate-800 border border-indigo-100 px-6 py-2 rounded-xl uppercase italic shadow-sm hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
                             >
                               FULL ACCESS
                             </button>
                          </div>
                       </div>

                       {/* Sub Rows (MATHEMATICAL ALIGNMENT + STICKY) */}
                       {expandedModules.includes(module.id) && (
                         <div className="bg-slate-50/5">
                            {module.subModules.map((sub, sidx) => (
                              <div key={sub.id} style={gridStyle} className={`group/row border-l-[12px] border-indigo-600 transition-all ${sidx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'}`}>
                                 {/* Sticky Sub-Label */}
                                 <div className="p-6 pl-10 flex items-center border-r border-slate-200 dark:border-slate-800 sticky left-0 z-40 bg-white dark:bg-slate-900 group-hover/row:bg-indigo-50/30 dark:group-hover/row:bg-slate-800 transition-colors shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
                                    <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400 italic uppercase tracking-tight group-hover/row:translate-x-3 transition-transform duration-500 whitespace-nowrap">{sub.name}</span>
                                 </div>
                                 {[1, 2, 3, 4, 5].map((idx) => (
                                   <div key={idx} className="border-r border-slate-100 dark:border-slate-700 p-6 flex justify-center items-center group-hover/row:bg-indigo-50/10">
                                      <MatrixToggle />
                                   </div>
                                 ))}
                                 <div className="group-hover/row:bg-indigo-50/5" />
                              </div>
                            ))}
                         </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Role Modal - Fixed Portal Style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-8 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-[450px] rounded-[3rem] p-12 shadow-2xl border border-white/10 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[20px] font-black uppercase italic tracking-tighter">Yeni Rol Yarat</h3>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              <div className="space-y-8">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Rolün Adlandırılması</label>
                    <input 
                      type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Məsələn: Baş Mühasib Müavini"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-[16px] font-bold italic focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                    />
                 </div>
                 <div className="flex items-center space-x-4 pt-4">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 font-black uppercase text-[11px] text-slate-400">Ləğv Et</button>
                    <button onClick={handleAddRole} className="flex-[2] bg-indigo-600 text-white py-4.5 rounded-2xl font-black uppercase text-[11px] shadow-xl shadow-indigo-500/30 active:scale-95 transition-all">Sistemə Əlavə Et</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(79, 70, 229, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default RolesPermissions;
