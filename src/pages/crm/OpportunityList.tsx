import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Filter, 
  ChevronRight, Calendar,
  Briefcase, Target, TrendingUp, X
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const OpportunityList = () => {
  const navigate = useNavigate();
  
  // Context for global sidebar filter
  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();

  // Opportunities State
  const [opportunities, setOpportunities] = useState([
    { id: 1, name: "Gilan Holding Supply", client: "Gilan Holding", value: 450000, stage: "NEGOTIATION", probability: 75, rep: "Fuad M.", forecastDate: "2026-03-15", priority: "HIGH" },
    { id: 2, name: "Baku Mall Expansion", client: "Baku Mall LLC", value: 120500, stage: "PROPOSAL", probability: 90, rep: "Aysel Q.", forecastDate: "2026-03-10", priority: "MEDIUM" },
    { id: 3, name: "SOCAR Tower Refit", client: "SOCAR Trading", value: 89000, stage: "QUALIFICATION", probability: 40, rep: "Murad E.", forecastDate: "2026-03-30", priority: "LOW" },
    { id: 4, name: "Sea Breeze Project", client: "Agalarov Estates", value: 1250000, stage: "NEGOTIATION", probability: 60, rep: "Kamran Q.", forecastDate: "2026-04-20", priority: "HIGH" },
    { id: 5, name: "Pasha Travel API", client: "Pasha Holding", value: 35000, stage: "CLOSED_WON", probability: 100, rep: "Fuad M.", forecastDate: "2026-03-05", priority: "MEDIUM" },
    { id: 6, name: "Technest Supply", client: "Technest", value: 12000, stage: "CLOSED_LOST", probability: 0, rep: "Aysel Q.", forecastDate: "2026-02-28", priority: "LOW" },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOpp, setNewOpp] = useState({ name: '', client: '', value: 0, stage: 'QUALIFICATION', probability: 20, rep: 'Admin', forecastDate: '', priority: 'MEDIUM' });

  // Filter States
  const [searchName, setSearchName] = useState('');
  const [searchStage, setSearchStage] = useState('ALL');
  const [searchPriority, setSearchPriority] = useState('ALL');
  
  const [quickSearch, setQuickSearch] = useState('');

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey && e.code === 'KeyF') {
            e.preventDefault();
            setIsFilterSidebarOpen((prev: boolean) => !prev);
        }
        if (e.altKey && e.code === 'KeyN') {
            e.preventDefault();
            setIsModalOpen(true);
        }
        if (e.key === 'Escape') {
            setIsFilterSidebarOpen(false);
            setIsModalOpen(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsFilterSidebarOpen]);

  // Sidebar Filter Content
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
           
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">İmkan və ya Müştəri</label>
              <input 
                 type="text" 
                 value={searchName}
                 onChange={(e) => setSearchName(e.target.value)} 
                 placeholder="Məsələn: Gilan..."
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Mərhələ (Stage)</label>
              <select 
                 value={searchStage}
                 onChange={(e) => setSearchStage(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">BÜTÜN MƏRHƏLƏLƏR</option>
                  <option value="QUALIFICATION">YERBƏYER (QUALIFICATION)</option>
                  <option value="PROPOSAL">TƏKLİF (PROPOSAL)</option>
                  <option value="NEGOTIATION">DANIŞIQLAR (NEGOTIATION)</option>
                  <option value="CLOSED_WON">QALİB (WON)</option>
                  <option value="CLOSED_LOST">İTİRİLMİŞ (LOST)</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Prioritet</label>
              <select 
                 value={searchPriority}
                 onChange={(e) => setSearchPriority(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">HAMISI</option>
                  <option value="HIGH">YÜKSƏK (HIGH)</option>
                  <option value="MEDIUM">ORTA (MEDIUM)</option>
                  <option value="LOW">AŞAĞI (LOW)</option>
              </select>
           </div>

           <div className="pt-6">
             <button 
               onClick={() => {
                 setSearchName('');
                 setSearchStage('ALL');
                 setSearchPriority('ALL');
               }}
               className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 italic"
             >
               Filtrləri Sıfırla
             </button>
           </div>
        </div>
      );
    }
  }, [isFilterSidebarOpen, searchName, searchStage, searchPriority, setFilterSidebarContent]);

  const filteredOpps = useMemo(() => {
      return opportunities.filter(o => {
          if (quickSearch && !(o.name.toLowerCase().includes(quickSearch.toLowerCase()) || o.client.toLowerCase().includes(quickSearch.toLowerCase()))) return false;
          if (searchName && !(o.name.toLowerCase().includes(searchName.toLowerCase()) || o.client.toLowerCase().includes(searchName.toLowerCase()))) return false;
          if (searchStage !== 'ALL' && o.stage !== searchStage) return false;
          if (searchPriority !== 'ALL' && o.priority !== searchPriority) return false;
          return true;
      });
  }, [opportunities, quickSearch, searchName, searchStage, searchPriority]);

  const handleAddOpp = (e: React.FormEvent) => {
      e.preventDefault();
      const nextId = Math.max(...opportunities.map(o => o.id), 0) + 1;
      setOpportunities([{ ...newOpp, id: nextId }, ...opportunities]);
      setIsModalOpen(false);
      setNewOpp({ name: '', client: '', value: 0, stage: 'QUALIFICATION', probability: 20, rep: 'Admin', forecastDate: '', priority: 'MEDIUM' });
  };

  const getStageStyle = (stage: string) => {
    switch (stage) {
      case 'CLOSED_WON': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 ring-emerald-100';
      case 'CLOSED_LOST': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 ring-rose-100';
      case 'NEGOTIATION': return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 ring-indigo-100';
      case 'PROPOSAL': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 ring-amber-100';
      case 'QUALIFICATION': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 ring-blue-100';
      default: return 'bg-slate-50 text-slate-500 ring-slate-100';
    }
  };

  const totalPipelineValue = opportunities.reduce((sum, o) => sum + o.value, 0);
  const expectedRevenue = opportunities.reduce((sum, o) => sum + (o.value * (o.probability / 100)), 0);

  const hasFilters = searchName || searchStage !== 'ALL' || searchPriority !== 'ALL';

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">CRM / Opportunities</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Satış İmkanları</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-3">
             <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                   type="text" 
                   placeholder="İmkan və ya Müştəri axtar..." 
                   value={quickSearch}
                   onChange={(e) => setQuickSearch(e.target.value)}
                   className="w-56 pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-black italic shadow-sm focus:border-indigo-500 outline-none uppercase transition-all"
                />
             </div>
             
             <button 
                 onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
                 className={`p-3.5 rounded-2xl shadow-sm transition-all border ${isFilterSidebarOpen || hasFilters ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-y-[-2px] border-indigo-600' : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200'}`}
                 title="Zəngin Süzgəc (Alt + F)"
             >
                 <Filter className="w-4 h-4 leading-none" />
             </button>
          </div>

          <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic"
             title="(Alt + N)"
          >
             <Plus className="w-4 h-4" />
             <span>Yeni Sövdələşmə</span>
          </button>
        </div>
      </div>

      {hasFilters && (
         <div className="flex items-center space-x-3 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl text-[10px] uppercase font-black italic border border-indigo-100 shadow-sm transition-all animate-in zoom-in-95 overflow-x-auto">
             <Filter className="w-4 h-4 shrink-0" />
             <span className="shrink-0">Aktiv Süzgəclər:</span>
             {searchName && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Axtarış: {searchName}</span>}
             {searchStage !== 'ALL' && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Status: {searchStage}</span>}
             {searchPriority !== 'ALL' && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Prioritet: {searchPriority}</span>}
             
             <button onClick={() => { 
                setSearchName(''); setSearchStage('ALL'); setSearchPriority('ALL'); setIsFilterSidebarOpen(false); 
             }} className="ml-auto p-1.5 bg-indigo-200/50 rounded-xl hover:bg-indigo-300 transition-colors shrink-0">
               <X className="w-3.5 h-3.5"/>
             </button>
         </div>
      )}

      {/* PIPELINE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 tracking-tighter">Pipline Cəmi (Bütün Sövdələr)</p>
            <h3 className="text-3xl font-black italic tabular-nums text-slate-800 dark:text-white">₼ {(totalPipelineValue / 1000).toFixed(1)}k</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 tracking-tighter">Gözlənilən (Dəyər x Ehtimal)</p>
            <h3 className="text-3xl font-black italic tabular-nums text-indigo-600">₼ {(expectedRevenue / 1000).toFixed(1)}k</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 tracking-tighter">Aktiv Sövdələşmələr</p>
            <h3 className="text-3xl font-black italic tabular-nums text-emerald-500">{opportunities.filter(o => !o.stage.includes('CLOSED')).length} ədəd</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 tracking-tighter">Qalibiyyət Ehtimalı (Avg)</p>
            <h3 className="text-3xl font-black italic tabular-nums text-amber-500">
                {Math.floor(opportunities.reduce((a, b) => a + b.probability, 0) / opportunities.length || 0)}%
            </h3>
         </div>
      </div>

      {/* LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredOpps.map((opp) => (
              <div key={opp.id} className={`group border ${opp.priority === 'HIGH' ? 'border-amber-100 dark:border-amber-900/50 bg-amber-50/10' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'} p-8 rounded-[3rem] hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative overflow-hidden`}>
                 <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-indigo-600 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                       <Briefcase className="w-6 h-6" />
                    </div>
                    {/* Inline Status Changer Simulation */}
                    <select 
                       className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic outline-none cursor-pointer appearance-none ${getStageStyle(opp.stage)} ring-1 hover:ring-2 transition-all`}
                       value={opp.stage}
                       onChange={(e) => {
                          const newStage = e.target.value;
                          setOpportunities(opportunities.map(o => o.id === opp.id ? { ...o, stage: newStage, probability: newStage === 'CLOSED_WON' ? 100 : newStage === 'CLOSED_LOST' ? 0 : o.probability } : o));
                       }}
                    >
                        <option value="QUALIFICATION">YERBƏYER</option>
                        <option value="PROPOSAL">TƏKLİF</option>
                        <option value="NEGOTIATION">DANIŞIQLAR</option>
                        <option value="CLOSED_WON">QALİB (WON)</option>
                        <option value="CLOSED_LOST">İTİRİLMİŞ</option>
                    </select>
                 </div>
                 
                 <div className="mb-8">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-2 tracking-tighter">{opp.name}</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic tracking-tighter">{opp.client}</p>
                 </div>

                 <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1 tracking-tighter">Dəyər (AZN)</p>
                          <p className="text-xl font-black italic tabular-nums text-slate-800 dark:text-white">₼ {opp.value.toLocaleString()}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1 tracking-tighter">Ehtimal</p>
                          <div className="flex items-center space-x-2 justify-end">
                             <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${opp.probability}%` }}></div>
                             </div>
                             <span className="text-[11px] font-black italic tabular-nums text-indigo-600">{opp.probability}%</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500">
                             {opp.rep.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-[10px] font-black italic text-slate-500 uppercase tracking-widest">{opp.rep}</span>
                       </div>
                       <div className="flex items-center text-[10px] font-bold text-slate-400 italic">
                          <Calendar className="w-3 h-3 mr-2" /> 
                          {opp.forecastDate}
                       </div>
                    </div>
                 </div>

              </div>
           ))}
           {filteredOpps.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                 <Briefcase className="w-12 h-12 mb-4 opacity-20" />
                 <p className="font-bold uppercase tracking-widest italic text-xs">Sorğunuza uyğun sövdələşmə tapılmadı.</p>
              </div>
           )}
        </div>
      </div>

      {/* NEW OPPORTUNITY MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
              
              <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl p-8 sm:p-12 animate-in zoom-in-95 duration-300">
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                 </button>

                 <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Yeni Sövdələşmə (Opportunity)</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic mt-2">Finans və Satış potensialı forması</p>
                 </div>

                 <form onSubmit={handleAddOpp} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">İmkan (Deal) Adı *</label>
                          <input required value={newOpp.name} onChange={(e) => setNewOpp({...newOpp, name: e.target.value})} type="text" placeholder="Məs: Gilan Holding Supply" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Müştəri / Şirkət Adı *</label>
                          <input required value={newOpp.client} onChange={(e) => setNewOpp({...newOpp, client: e.target.value})} type="text" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Təxmini Dəyər (AZN)</label>
                          <input required value={newOpp.value || ''} onChange={(e) => setNewOpp({...newOpp, value: Number(e.target.value)})} type="number" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic tabular-nums shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ehtimal (%)</label>
                          <input required value={newOpp.probability || ''} onChange={(e) => setNewOpp({...newOpp, probability: Number(e.target.value)})} type="number" min="0" max="100" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic tabular-nums shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">İlkin Mərhələ</label>
                          <select value={newOpp.stage} onChange={(e) => setNewOpp({...newOpp, stage: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700">
                              <option value="QUALIFICATION">YERBƏYER (QUALIFICATION)</option>
                              <option value="PROPOSAL">TƏKLİF (PROPOSAL)</option>
                              <option value="NEGOTIATION">DANIŞIQLAR</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Təxmini Yekun Tarixi</label>
                          <input required value={newOpp.forecastDate} onChange={(e) => setNewOpp({...newOpp, forecastDate: e.target.value})} type="date" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700" />
                       </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-4">
                       <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all italic">Ləğv Et</button>
                       <button type="submit" className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 shadow-xl shadow-indigo-500/20 transition-all italic">Yadda Saxla</button>
                    </div>
                 </form>

              </div>
          </div>
      )}
    </div>
  );
};

export default OpportunityList;
