import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Briefcase, Plus, Search, Trash2, Edit2, Loader2, Users, RefreshCw, AlertCircle, X, Filter, ChevronRight, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import { hrApi, companyApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import SearchableSelect from '../../components/common/SearchableSelect';

interface Position {
  id: string;
  name: string;
  departmentId: string | null;
  department?: { name: string };
  isManagement: boolean;
  baseSalary: number | null;
  status: string;
  _count?: {
    employees: number;
  };
  employees?: any[]; // For branch filtering
  avgActualGrossSalary?: number;
  totalGrossSalary?: number;
  totalEmployerCost?: number;
  totalPositionCost?: number;
}

const PositionRegistry = () => {
  const { activeCompany } = useCompany();
  const companyId = activeCompany?.id || 'COM-001';

  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [isManagement, setIsManagement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { 
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    setFilterSidebarContent,
    isContentFullscreen, 
    setIsContentFullscreen 
  } = useOutletContext<any>();
  
  const [filters, setFilters] = useState({
    department: '',
    branchId: '',
    isManagement: 'ALL',
    minSalary: '',
    maxSalary: ''
  });

  // Filter content for global sidebar
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-10">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2">Vəzifə Filtri</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Şöbə</label>
                <select 
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
                >
                  <option value="">BÜTÜN ŞÖBƏLƏR</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Filial</label>
                <select 
                  value={filters.branchId}
                  onChange={(e) => setFilters({...filters, branchId: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
                >
                  <option value="">BÜTÜN FİLİALLAR</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Vəzifə Tipi</label>
                  <select 
                    value={filters.isManagement}
                    onChange={(e) => setFilters({...filters, isManagement: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
                  >
                    <option value="ALL">HAMISI</option>
                    <option value="TRUE">YALNIZ RƏHBƏRLƏR</option>
                    <option value="FALSE">YALNIZ İŞÇİLƏR</option>
                  </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2">Büdcə Aralığı</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Min. Büdcə</label>
                 <input 
                    type="number" 
                    value={filters.minSalary}
                    onChange={(e) => setFilters({...filters, minSalary: e.target.value})}
                    placeholder="Məs: 1000"
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none"
                  />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Max. Büdcə</label>
                 <input 
                    type="number" 
                    value={filters.maxSalary}
                    onChange={(e) => setFilters({...filters, maxSalary: e.target.value})}
                    placeholder="Məs: 5000"
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none"
                  />
              </div>
            </div>
          </div>

          <button 
             onClick={() => setFilters({
               department: '',
               branchId: '',
               isManagement: 'ALL',
               minSalary: '',
               maxSalary: ''
             })}
             className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
          >
             Filtrləri Sıfırla
          </button>
        </div>
      );
    }
  }, [isFilterSidebarOpen, filters, departments, branches]);

  const toggleFilters = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const ensureArray = (res: any) => Array.isArray(res) ? res : (res?.data || []);
      
      const [posData, deptData, branchData] = await Promise.all([
        hrApi.getPositions(companyId),
        hrApi.getDepartments(companyId),
        companyApi.getBranches(companyId)
      ]);
      
      setPositions(ensureArray(posData));
      setDepartments(ensureArray(deptData));
      setBranches(ensureArray(branchData));
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const res = await hrApi.syncPositions(companyId);
      alert(res.message);
      await loadData();
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      setIsSubmitting(true);
      await hrApi.createPosition({
        name: title,
        departmentId: departmentId || undefined,
        baseSalary: baseSalary ? Number(baseSalary) : undefined,
        isManagement
      }, companyId);
      
      setShowAddModal(false);
      setTitle('');
      setDepartmentId('');
      setBaseSalary('');
      setIsManagement(false);
      await loadData();
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (pos: Position) => {
    setEditingPosition(pos);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPosition) return;
    try {
      setIsSubmitting(true);
      await hrApi.updatePosition(editingPosition.id, {
        name: editingPosition.name,
        departmentId: editingPosition.departmentId || undefined,
        baseSalary: editingPosition.baseSalary ? Number(editingPosition.baseSalary) : undefined,
        isManagement: editingPosition.isManagement
      }, companyId);
      
      setShowEditModal(false);
      setEditingPosition(null);
      await loadData();
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu vəzifəni silməyə əminsiniz?')) return;
    try {
      await hrApi.deletePosition(id, companyId);
      await loadData();
    } catch (err: any) {
      alert('Silinmədi: ' + (err?.response?.data?.error || err.message));
    }
  };

  const filteredPositions = positions.map(p => {
    if (!filters.branchId) return p;

    // Filter employees by branch
    const branchEmps = p.employees?.filter((e: any) => e.branchId === filters.branchId) || [];
    if (branchEmps.length === 0) return { ...p, _count: { employees: 0 }, totalGrossSalary: 0, totalEmployerCost: 0, totalPositionCost: 0 };

    // Recalculate metrics for this branch
    const salaries = branchEmps.map((e: any) => Number(e.salaryGross || 0)).filter(s => s > 0);
    const totalGrossSalary = salaries.reduce((a, b) => a + b, 0);
    const avgActualGrossSalary = salaries.length > 0 ? totalGrossSalary / salaries.length : 0;

    let totalEmployerCost = 0;
    branchEmps.forEach((emp: any) => {
        const gross = Number(emp.salaryGross || 0);
        if (gross <= 0) return;
        
        let dsmf = gross <= 200 ? gross * 0.22 : (gross <= 8000 ? 44 + (gross - 200) * 0.15 : 1214 + (gross - 8000) * 0.11);
        let its = gross <= 2500 ? gross * 0.02 : 50 + (gross - 2500) * 0.005;
        const unemployment = gross * 0.005;
        totalEmployerCost += (dsmf + its + unemployment);
    });

    return {
        ...p,
        _count: { employees: branchEmps.length },
        totalGrossSalary,
        avgActualGrossSalary,
        totalEmployerCost,
        totalPositionCost: totalGrossSalary + totalEmployerCost
    };
  }).filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                         (p.department?.name.toLowerCase() || '').includes(searchLower);
    
    if (!matchesSearch) return false;

    if (filters.department && !(p.department?.name || '').includes(filters.department)) return false;
    
    if (filters.isManagement !== 'ALL') {
       const target = filters.isManagement === 'TRUE';
       if (p.isManagement !== target) return false;
    }

    if (filters.branchId && (p._count?.employees || 0) === 0) return false;

    if (filters.minSalary && (p.totalPositionCost || 0) < Number(filters.minSalary)) return false;
    if (filters.maxSalary && (p.totalPositionCost || 0) > Number(filters.maxSalary)) return false;

    return true;
  });

  // Calculate Aggregates based on filtered data
  const totals = filteredPositions.reduce((acc, curr) => ({
    gross: acc.gross + (curr.totalGrossSalary || 0),
    social: acc.social + (curr.totalEmployerCost || 0),
    budget: acc.budget + (curr.totalPositionCost || 0),
    employees: acc.employees + (curr._count?.employees || 0)
  }), { gross: 0, social: 0, budget: 0, employees: 0 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Vəzifələr Ştatı</h2>
          <p className="text-[11px] font-black tracking-widest text-slate-400 mt-1 uppercase italic">
            Müəssisənin təşkili və ştat strukturu (Enterprise Structure)
          </p>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowAddModal(true)}
             className="flex items-center px-6 py-4 bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
           >
             <Plus className="w-4 h-4 mr-2" />
             Yeni Ştat Əlavə Et
           </button>


           <button 
             onClick={handleSync}
             disabled={isSyncing}
             className="flex items-center px-6 py-4 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
           >
             {isSyncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
             Məlumatları Bərpa Et (Sync)
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 px-2">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase italic">Cəmi Gross ƏH</p>
                  <p className="text-lg font-black text-slate-800 italic">{totals.gross.toLocaleString()} AZN</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0">
                  <PieChart className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase italic">Cəmi Sosial Xərc</p>
                  <p className="text-lg font-black text-slate-800 italic">{totals.social.toLocaleString()} AZN</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase italic">Ümumi Büdcə</p>
                  <p className="text-lg font-black text-indigo-600 italic font-black">{totals.budget.toLocaleString()} AZN</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase italic">Cəmi İşçi Sayı</p>
                  <p className="text-lg font-black text-slate-800 italic">{totals.employees} Nəfər</p>
              </div>
          </div>
      </div>


      <div className="px-2">
        {/* DATA TABLE */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
             <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                   <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Vəzifə üzrə axtar..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-[12px] font-black italic text-slate-700 outline-none w-full max-w-md uppercase"
                />
             </div>
             <div className="flex items-center gap-3">
                <button 
                  onClick={toggleFilters}
                  className={`flex items-center px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isFilterSidebarOpen ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-white text-slate-500 border-slate-100'
                  } border shadow-sm`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrlər
                </button>
                <div className="px-5 py-3 bg-indigo-50 rounded-xl border border-indigo-100 italic">
                   <span className="text-[10px] font-black text-indigo-600 uppercase italic">Tapıldı: {filteredPositions.length}</span>
                </div>
             </div>
          </div>

          {/* FILTERS REMOVED FROM INLINE VIEW - NOW IN GLOBAL SIDEBAR */}

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" /></div>
            ) : filteredPositions.length > 0 ? (
              <div className="min-w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Vəzifə</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Şöbə</th>
                      <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest italic">İşçi</th>
                      <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Tipi</th>
                      <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Baza Maaş</th>
                      <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Ortalama</th>
                      <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Cəmi Gross</th>
                      <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Sosial Xərc</th>
                      <th className="px-6 py-4 text-right text-[9px] font-black text-indigo-600 uppercase tracking-widest italic">Ümumi Büdcə</th>
                      <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Aksiya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPositions.map(pos => (
                      <tr key={pos.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                 <Briefcase className="w-4 h-4 text-slate-500" />
                              </div>
                              <span className="text-[11px] font-black text-slate-800 uppercase italic leading-none">{pos.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest italic font-black leading-tight border-b border-dotted border-slate-200 block py-1">
                             {pos.department?.name || 'Təyin edilməyib'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="flex items-center justify-center gap-2">
                              <Users className="w-3 h-3 text-slate-400" />
                              <span className="text-[11px] font-black text-slate-700 italic">{pos._count?.employees || 0}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           {pos.isManagement ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm bg-purple-50 text-purple-600 border border-purple-100 italic">
                                rəhbər
                              </span>
                           ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm bg-slate-50 text-slate-600 border border-slate-200 italic">
                                işçi
                              </span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           {pos.baseSalary ? (
                             <span className="text-[11px] font-black text-slate-700 italic">{pos.baseSalary}</span>
                           ) : (
                             <span className="text-[9px] font-black text-slate-300 italic">-</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-[11px] font-black text-emerald-600 italic">
                             {pos.avgActualGrossSalary ? `${pos.avgActualGrossSalary.toLocaleString()}` : '-'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-[11px] font-black text-slate-800 italic">
                             {pos.totalGrossSalary ? `${pos.totalGrossSalary.toLocaleString()}` : '-'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-[11px] font-black text-rose-500 italic">
                             {pos.totalEmployerCost ? `${pos.totalEmployerCost.toLocaleString()}` : '-'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right bg-slate-50/30">
                           <span className="text-[11px] font-black text-indigo-600 italic">
                             {pos.totalPositionCost ? `${pos.totalPositionCost.toLocaleString()}` : '-'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => handleEdit(pos)}
                               className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                             >
                               <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => handleDelete(pos.id)}
                               className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4">
                    <Briefcase className="w-6 h-6 text-slate-300" />
                 </div>
                 <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Vəzifə tapılmadı</h4>
                 <p className="text-[10px] text-slate-400 mt-2 max-w-sm mx-auto uppercase italic">Müəssisə strukturunu qurmaq üçün sol tərəfdən yeni ştatlar yaradın.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD POP-UP MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg animate-in zoom-in-95 leading-none">
              <div className="flex items-center justify-between mb-8 leading-none">
                 <div className="flex items-center gap-3 leading-none">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                       <Plus className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">Yeni Ştat Əlavə Et</h2>
                       <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Struktur bölməyə vəzifə təyin edin</p>
                    </div>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all leading-none"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 leading-none">
                 <div className="space-y-2 leading-none">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Vəzifə Adı *</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Məs: Maliyyə Analitiki"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                 </div>

                 <div className="space-y-2 leading-none">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Şöbə</label>
                    <select 
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="">-- Şöbə Seçin --</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                 </div>

                 <div className="space-y-2 leading-none">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Baza Əmək Haqqı (AZN)</label>
                    <input 
                      type="number" 
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(e.target.value)}
                      placeholder="Məs: 1200"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                 </div>

                 <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors leading-none">
                    <input 
                      type="checkbox" 
                      checked={isManagement}
                      onChange={(e) => setIsManagement(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-[11px] font-black text-slate-700 uppercase italic">Rəhbər Vəzifədir? (Management)</span>
                 </label>

                 <div className="flex gap-4 pt-4 leading-none text-left">
                    <button 
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all font-black italic leading-none"
                    >
                      İmtina
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] bg-emerald-600 text-white rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 disabled:opacity-50 flex justify-center items-center leading-none"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ştatı Yadda Saxla'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingPosition && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                       <Edit2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">Vəzifəni Redaktə Et</h2>
                       <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Ştat məlumatlarını yeniləyin</p>
                    </div>
                 </div>
                 <button onClick={() => setShowEditModal(false)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Vəzifə Adı *</label>
                    <input 
                      type="text" 
                      value={editingPosition.name}
                      onChange={(e) => setEditingPosition(prev => prev ? {...prev, name: e.target.value} : null)}
                      required
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Şöbə</label>
                    <select 
                      value={editingPosition.departmentId || ''}
                      onChange={(e) => setEditingPosition(prev => prev ? {...prev, departmentId: e.target.value} : null)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="">-- Şöbə Seçin --</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Baza Əmək Haqqı (AZN)</label>
                    <input 
                      type="number" 
                      value={editingPosition.baseSalary || ''}
                      onChange={(e) => setEditingPosition(prev => prev ? {...prev, baseSalary: Number(e.target.value)} : null)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                 </div>

                 <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={editingPosition.isManagement}
                      onChange={(e) => setEditingPosition(prev => prev ? {...prev, isManagement: e.target.checked} : null)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-[11px] font-black text-slate-700 uppercase italic">Rəhbər Vəzifədir? (Management)</span>
                 </label>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all font-black italic"
                    >
                      İmtina
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] bg-indigo-600 text-white rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 flex justify-center items-center"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yadda Saxla'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
export default PositionRegistry;
