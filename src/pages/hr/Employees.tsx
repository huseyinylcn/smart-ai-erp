import { useState, useEffect } from 'react';
import { 
  Search,
  Mail, Phone, Building2,
  ChevronRight,
  Loader2,
  UserCircle,
  Trash2,
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { History } from 'lucide-react';
import Avatar from '../../components/hr/Avatar';

const Employees = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const companyId = activeCompany?.id || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchEmployees();
    }
  }, [companyId]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await hrApi.getEmployees(companyId);
      setEmployees(data);
    } catch (error) {
      console.error('FETCH_EMPLOYEES_ERROR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`${name} adlı əməkdaşı reyestrdən silmək istədiyinizə əminsiniz?`)) return;

    setIsDeleting(true);
    try {
      await hrApi.deleteEmployee(id, companyId);
      setSelectedIds(prev => prev.filter(i => i !== id));
      await fetchEmployees();
    } catch (error: any) {
      alert(error.data?.error || "Silmə zamanı xəta baş verdi.");
    } finally {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 500);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Seçilmiş ${selectedIds.length} əməkdaşı silmək istəyirsiniz?`)) return;

    setIsDeleting(true);
    try {
      await hrApi.bulkDeleteEmployees(selectedIds, companyId);
      setSelectedIds([]);
      await fetchEmployees();
    } catch (error: any) {
      alert(error.data?.error || "Toplu silmə zamanı xəta baş verdi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredEmployees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmployees.map(emp => emp.id));
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 shadow-sm shadow-emerald-500/10';
      case 'LEAVE': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20';
      case 'INACTIVE': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktiv';
      case 'LEAVE': return 'Məzuniyyətdə';
      case 'INACTIVE': return 'Xitam verilib';
      default: return status;
    }
  };

  const filteredEmployees = employees.filter(emp => 
    (emp.fullName || emp.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.position || emp.pos)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.department?.name || emp.dept)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-32 text-slate-900 dark:text-slate-100 italic">
      
      {/* PREMIUM HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-3 leading-none">
            <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic border border-emerald-500/10 shadow-sm">HUMAN CAPITAL PORTAL</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Personallar Reyestri</h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-4 italic opacity-80">ŞİRKƏT ÜZRƏ BÜTÜN ƏMƏKDAŞLARIN VƏ ƏMƏK MÜQAVİLƏLƏRİNİN MƏRKƏZİ REYESTRİ</p>
        </div>
        <div className="flex items-center space-x-4">
           <button 
              onClick={fetchEmployees}
              className="p-5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 rounded-[2rem] transition-all shadow-sm border border-slate-100 dark:border-slate-800"
           >
              <History className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
        <div className="relative flex-1 group shadow-sm">
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-all duration-300" />
          <input 
            type="text" 
            placeholder="ƏMƏKDAŞ, ŞÖBƏ VƏ YA VƏZİFƏ ÜZRƏ SÜRƏTLİ AXTARIŞ..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-[1.5rem] py-6 pl-22 pr-10 text-[11px] font-black italic shadow-inner outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3 ml-6 leading-none">
          <button 
            onClick={handleSelectAll}
            className={`flex items-center space-x-3 px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest italic transition-all border ${
              selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
              : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-500 shadow-sm'
            }`}
          >
            {selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0 ? (
              <>
                <CheckSquare className="w-4 h-4" />
                <span>Seçimi Ləğv Et</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4" />
                <span>Hamısını Seç</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* REGISTRY GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin opacity-20" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Sinxronizasiya edilir...</p>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredEmployees.map((emp) => (
            <div 
              key={emp.id} 
              className="group bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-10 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] transition-all relative overflow-hidden shadow-sm h-[420px] flex flex-col"
            >
              {/* SELECTION CHECKBOX */}
              <div 
                className="absolute top-8 left-8 z-30 flex items-center space-x-3"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
              >
                <div 
                  onClick={(e) => toggleSelect(emp.id, e)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    selectedIds.includes(emp.id) 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 shadow-inner' 
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-transparent group-hover:border-emerald-500 group-hover:text-emerald-500/30'
                  }`}
                  title="SEÇ"
                >
                  <CheckSquare className="w-5 h-5 stroke-[3]" />
                </div>
                
                <button 
                  onClick={(e) => handleDelete(emp.id, emp.fullName || emp.name, e)}
                  className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-rose-100/50"
                  title="SİLDİR"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* NAVIGABLE CONTENT AREA */}
              <div 
                className="flex-1 cursor-pointer flex flex-col"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigate(`/hr/employee/${emp.id}`);
                }}
              >
                {/* ACCENT BACKGROUND */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
                
                <div className="flex items-start justify-between mb-8 mt-10 relative z-10">
                   <Avatar 
                      src={emp.avatarUrl} 
                      name={emp.fullName || emp.name} 
                      size="lg"
                      className="shadow-2xl shadow-emerald-500/10 group-hover:scale-105 transition-all duration-500 border-4 border-white/50 dark:border-slate-800/50"
                   />
                   <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest italic leading-none ${getStatusStyle(emp.status || 'ACTIVE')}`}>
                      {getStatusLabel(emp.status || 'ACTIVE')}
                   </span>
                </div>

                <div className="mb-8 relative z-10">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-1.5 group-hover:text-emerald-600 transition-colors leading-tight">{emp.fullName || emp.name}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic opacity-70 leading-none">{emp.position || emp.pos}</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800/50 relative z-10 flex-1">
                   <div className="flex items-center text-[9px] font-black text-slate-500 uppercase italic opacity-80 decoration-emerald-500/30 leading-none">
                      <Building2 className="w-3.5 h-3.5 mr-3 text-emerald-500" />
                       <span>{emp.branch?.name || "---"} | {emp.department?.name || emp.dept || "UMUMI SOB?"}</span>
                   </div>
                   <div className="flex items-center text-[9px] font-black text-slate-500 italic opacity-80 group-hover:opacity-100 transition-opacity leading-none">
                      <Mail className="w-3.5 h-3.5 mr-3 text-slate-300 group-hover:text-emerald-500" />
                      <span className="normal-case truncate">{emp.email || '---'}</span>
                   </div>
                   <div className="flex items-center text-[9px] font-black text-slate-500 italic opacity-80 group-hover:opacity-100 transition-opacity leading-none">
                      <Phone className="w-3.5 h-3.5 mr-3 text-slate-300 group-hover:text-emerald-500" />
                      <span>{emp.phone || '---'}</span>
                   </div>
                </div>
              </div>

              {/* ACTION AREA (PROFİLO BAX) */}
              <div 
                className="mt-6 flex items-center justify-end relative z-20"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
              >
                 <div 
                  onClick={() => navigate(`/hr/employee/${emp.id}`)}
                  className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-[1.2rem] flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title="DETAALARA BAX"
                 >
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-32 flex flex-col items-center justify-center text-center space-y-8 italic shadow-inner">
            <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
               <UserCircle className="w-16 h-16 text-slate-200" />
            </div>
            <div>
               <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">Hələlik heç bir əməkdaş yoxdur</h4>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">SİSTEMƏ QEYDİYYATDAN KEÇMİŞ ƏMƏKDAŞ TAPILMADI</p>
            </div>
        </div>
      )}

      {/* FLOATING BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-20 duration-500">
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-[3rem] px-10 py-6 flex items-center space-x-8 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border border-slate-700/50">
            <div className="flex items-center space-x-4 pr-8 border-r border-slate-700">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center font-black text-[12px] italic shadow-lg shadow-emerald-500/20">
                {selectedIds.length}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest italic opacity-70">Əməkdaş seçilib</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSelectedIds([])}
                className="p-4 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors group"
                title="LƏĞV ET"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </button>
              <button 
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex items-center space-x-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Seçilənləri Sil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
