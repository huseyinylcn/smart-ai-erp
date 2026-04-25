import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Plus, Filter, 
  MoreHorizontal, Mail, Phone, 
  Target, ChevronRight, MessageSquare,
  Calendar, Star, TrendingUp, X
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const LeadList = () => {
  const navigate = useNavigate();
  
  // Context for global sidebar filter
  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();

  // Leads State
  const [leads, setLeads] = useState([
    { id: 1, name: "Vüsal Məmmədov", company: "Absheron Port", source: "Website", status: "NEW", email: "vusal@absheronport.az", phone: "+994 50 222 11 00", interest: "ERP Implementation", score: 85 },
    { id: 2, name: "Gunel Əliyeva", company: "Beauty Co", source: "Referral", status: "QUALIFIED", email: "gunel@beauty.az", phone: "+994 55 333 44 55", interest: "HR Module", score: 92 },
    { id: 3, name: "Kamran Qasımov", company: "Tech solutions", source: "Cold Call", status: "NEGOTIATION", email: "kamran@techsol.az", phone: "+994 70 555 66 77", interest: "Finance API", score: 78 },
    { id: 4, name: "Aysel Quliyeva", company: "Education Center", source: "Facebook", status: "PROPOSAL", email: "aysel@edu.az", phone: "+994 10 999 00 11", interest: "LMS + Accounting", score: 65 },
    { id: 5, name: "Ramin Hüseynov", company: "Local Store", source: "Walk-in", status: "NEW", email: "ramin@store.az", phone: "+994 51 444 88 99", interest: "POS Terminal", score: 45 },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', company: '', source: 'Website', status: 'NEW', email: '', phone: '', interest: '' });

  // Filter States
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('ALL');
  const [searchSource, setSearchSource] = useState('ALL');
  
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Şirkət və ya Ad Axtar</label>
              <input 
                 type="text" 
                 value={searchName}
                 onChange={(e) => setSearchName(e.target.value)} 
                 placeholder="Məsələn: Kamran..."
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-300"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Status üzrə</label>
              <select 
                 value={searchStatus}
                 onChange={(e) => setSearchStatus(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">BÜTÜN STATUSLAR</option>
                  <option value="NEW">YENİ (NEW)</option>
                  <option value="QUALIFIED">YARARLI (QUALIFIED)</option>
                  <option value="PROPOSAL">TƏKLİF VERİLİB (PROPOSAL)</option>
                  <option value="NEGOTIATION">DANIŞIQLAR (NEGOTIATION)</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Mənbə (Source)</label>
              <select 
                 value={searchSource}
                 onChange={(e) => setSearchSource(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">BÜTÜN MƏNBƏLƏR</option>
                  <option value="Website">VEBSAYT (WEBSITE)</option>
                  <option value="Referral">TÖVSİYƏ (REFERRAL)</option>
                  <option value="Cold Call">Soyuq Zəng (COLD CALL)</option>
                  <option value="Facebook">SOSİAL ŞƏBƏKƏ (FACEBOOK)</option>
              </select>
           </div>

           <div className="pt-6">
             <button 
               onClick={() => {
                 setSearchName('');
                 setSearchStatus('ALL');
                 setSearchSource('ALL');
               }}
               className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 italic"
             >
               Filtrləri Sıfırla
             </button>
           </div>
        </div>
      );
    }
  }, [isFilterSidebarOpen, searchName, searchStatus, searchSource, setFilterSidebarContent]);

  const filteredLeads = useMemo(() => {
      return leads.filter(l => {
          if (quickSearch && !(l.name.toLowerCase().includes(quickSearch.toLowerCase()) || l.company.toLowerCase().includes(quickSearch.toLowerCase()))) return false;
          if (searchName && !(l.name.toLowerCase().includes(searchName.toLowerCase()) || l.company.toLowerCase().includes(searchName.toLowerCase()))) return false;
          if (searchStatus !== 'ALL' && l.status !== searchStatus) return false;
          if (searchSource !== 'ALL' && l.source !== searchSource) return false;
          return true;
      });
  }, [leads, quickSearch, searchName, searchStatus, searchSource]);

  const handleAddLead = (e: React.FormEvent) => {
      e.preventDefault();
      const nextId = Math.max(...leads.map(l => l.id), 0) + 1;
      const scoreEst = Math.floor(Math.random() * (95 - 40 + 1) + 40); // Random score
      setLeads([{ ...newLead, id: nextId, score: scoreEst }, ...leads]);
      setIsModalOpen(false);
      setNewLead({ name: '', company: '', source: 'Website', status: 'NEW', email: '', phone: '', interest: '' });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20';
      case 'QUALIFIED': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20';
      case 'PROPOSAL': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20';
      case 'NEGOTIATION': return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const hasFilters = searchName || searchStatus !== 'ALL' || searchSource !== 'ALL';

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">CRM / Leads Explorer</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Potensial Müştərilər</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-3">
             <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                   type="text" 
                   placeholder="Sürətli axtar..." 
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
             <span>Yeni Potensial</span>
          </button>
        </div>
      </div>

      {hasFilters && (
         <div className="flex items-center space-x-3 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl text-[10px] uppercase font-black italic border border-indigo-100 shadow-sm transition-all animate-in zoom-in-95 overflow-x-auto">
             <Filter className="w-4 h-4 shrink-0" />
             <span className="shrink-0">Aktiv Süzgəclər:</span>
             {searchName && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Ad: {searchName}</span>}
             {searchStatus !== 'ALL' && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Status: {searchStatus}</span>}
             {searchSource !== 'ALL' && <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm tracking-widest whitespace-nowrap">Mənbə: {searchSource}</span>}
             
             <button onClick={() => { 
                setSearchName(''); setSearchStatus('ALL'); setSearchSource('ALL'); setIsFilterSidebarOpen(false); 
             }} className="ml-auto p-1.5 bg-indigo-200/50 rounded-xl hover:bg-indigo-300 transition-colors shrink-0">
               <X className="w-3.5 h-3.5"/>
             </button>
         </div>
      )}

      {/* QUICK STATS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-indigo-600 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2 italic">Yeni Potensiallar</p>
               <h3 className="text-4xl font-black italic tabular-nums">{leads.filter(l=>l.status === 'NEW').length}</h3>
               <div className="flex items-center mt-4 text-[10px] font-bold text-indigo-100 italic">
                  <TrendingUp className="w-3.5 h-3.5 mr-2" />
                  <span>BU AY AKTİVLİK YÜKSƏKDİR</span>
               </div>
            </div>
            <Target className="absolute bottom-[-20px] right-2 w-32 h-32 text-white/10 rotate-[-15deg] group-hover:scale-110 transition-transform duration-500" />
         </div>
         <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 italic">Qazanılma Ehtimalı (Avg Score)</p>
               <h3 className="text-4xl font-black italic tabular-nums text-slate-800 dark:text-white underline decoration-emerald-500 underline-offset-8">
                   {Math.floor(leads.reduce((a, b) => a + b.score, 0) / leads.length) || 0}%
               </h3>
            </div>
            <div className="flex items-center mt-4 text-[10px] font-bold text-slate-400 italic">
               <Star className="w-3.5 h-3.5 mr-2 text-amber-500" />
               <span>YÜKSƏK KEYFİYYƏTLİ LEADS</span>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Gözləyən Satış Potensialı</p>
               <h3 className="text-4xl font-black italic tabular-nums text-indigo-600 tracking-tighter italic">₼ 145K</h3>
            </div>
            <div className="flex items-center mt-4 text-[10px] font-bold text-slate-400 italic">
               <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-500 shadow-sm shadow-sm" />
               <span>MART 2026 PROQNOZ</span>
            </div>
         </div>
      </div>

      {/* FILTER & LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-4 sm:p-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {filteredLeads.map((lead) => (
              <div 
                key={lead.id} 
                className="group bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 p-8 sm:p-10 rounded-[3rem] hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative"
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center">
                       <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-indigo-600 flex items-center justify-center mr-4">
                          <Users className="w-6 h-6" />
                       </div>
                    </div>
                    {/* Inline Status Changer Simulation */}
                    <div className="relative group/status">
                       <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic cursor-pointer ${getStatusStyle(lead.status)} ring-2 ring-transparent group-hover/status:ring-indigo-200 transition-all`}>
                          {lead.status}
                       </div>
                       {/* Dropdown simulation could be added here for quick change */}
                    </div>
                 </div>
                 <div className="mb-8">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-2">{lead.name}</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">{lead.company}</p>
                 </div>
                 <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center text-[10px] font-bold text-slate-500 italic">
                       <MessageSquare className="w-3.5 h-3.5 mr-3 text-slate-400" />
                       <span>{lead.interest}</span>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-slate-500 italic">
                       <Mail className="w-3.5 h-3.5 mr-3 text-slate-400" />
                       <span>{lead.email}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-slate-400 mb-1">Qalibiyyət Ehtimalı</span>
                          <div className="flex items-center text-[11px] font-black italic text-indigo-600">
                             <Target className="w-4 h-4 mr-1.5" />
                             <span className="tabular-nums">{lead.score}%</span>
                          </div>
                       </div>
                       <button className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
           ))}
           {filteredLeads.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                 <Target className="w-12 h-12 mb-4 opacity-20" />
                 <p className="font-bold uppercase tracking-widest italic text-xs">Sorğunuza uyğun potensial tapılmadı.</p>
              </div>
           )}
        </div>
      </div>

      {/* NEW LEAD MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
              
              <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl p-8 sm:p-12 animate-in zoom-in-95 duration-300">
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                 </button>

                 <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Yeni Potensial Qeydi</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic mt-2">Müştəri ilkin məlumatları və marağı</p>
                 </div>

                 <form onSubmit={handleAddLead} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Müştərinin Adı *</label>
                          <input required value={newLead.name} onChange={(e) => setNewLead({...newLead, name: e.target.value})} type="text" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Şirkət / Rol</label>
                          <input required value={newLead.company} onChange={(e) => setNewLead({...newLead, company: e.target.value})} type="text" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Telefon</label>
                          <input value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})} type="text" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-poçt</label>
                          <input value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} type="email" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gəliş Mənbəyi</label>
                          <select value={newLead.source} onChange={(e) => setNewLead({...newLead, source: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700">
                              <option value="Website">VEBSAYT</option>
                              <option value="Referral">TÖVSİYƏ</option>
                              <option value="Cold Call">SOYUQ ZƏNG</option>
                              <option value="Facebook">SOSİAL ŞƏBƏKƏ</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">İlkin Status</label>
                          <select value={newLead.status} onChange={(e) => setNewLead({...newLead, status: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700">
                              <option value="NEW">YENİ POTENSİAL</option>
                              <option value="QUALIFIED">YARARLI</option>
                              <option value="PROPOSAL">TƏKLİF VERİLİB</option>
                           </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Maraqlandığı Xidmət / Məhsul</label>
                       <input value={newLead.interest} onChange={(e) => setNewLead({...newLead, interest: e.target.value})} type="text" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
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

export default LeadList;
