import { useState, useEffect } from 'react';
import { 
  Waypoints, Search, Plus, 
  Download, Building2, ChevronRight, 
  User, MapPin, X, Loader2, Save, Edit2, Trash2, AlertTriangle
} from 'lucide-react';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const DepartmentList = () => {
  const { activeCompany } = useCompany();
  const companyId = activeCompany?.id || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentDept, setCurrentDept] = useState<any>(null); // For editing
  const [formData, setFormData] = useState({ name: '', code: '', head: '' });
  const [isCodeManual, setIsCodeManual] = useState(false);

  const generateUniqueCode = (name: string, list: any[]) => {
    if (!name) return "";
    
    // 1. Get Initials (e.g. İnsan Resursları -> İR)
    const words = name.toUpperCase().split(/\s+/).filter(w => !['SÖBƏSİ', 'BÖLMƏSİ', 'DEPARTAMENTİ'].includes(w));
    const initials = words.map(w => w[0]).join('').slice(0, 3);

    // 2. Get base slug (First word or initials-based)
    let baseName = words[0] || 'DEPT';
    baseName = baseName
      .replace(/[^A-Z0-9ÜİÖĞÇŞ]/g, '')
      .slice(0, 6);

    const base = `${initials}_${baseName}`;

    let unique = base;
    let counter = 1;
    
    while (list.some(d => d.code === unique && d.id !== currentDept?.id)) {
      unique = `${base}_${counter.toString().padStart(2, '0')}`;
      counter++;
    }
    
    return unique;
  };

  const handleNameChange = (newName: string) => {
    const updated = { ...formData, name: newName };
    if (!isCodeManual) {
        updated.code = generateUniqueCode(newName, departments);
    }
    setFormData(updated);
  };

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await hrApi.getDepartments(companyId);
      setDepartments(data);
    } catch (error) {
      console.error('FETCH_DEPTS_ERROR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (dept: any) => {
    // 1. Check for relations (Safeguard)
    const empCount = (dept.positions ? dept.positions.reduce((acc: number, curr: any) => acc + (curr._count?.employees || 0), 0) : 0) || (dept._count?.employees || 0);
    const contractCount = dept._count?.contracts || 0;

    if (empCount > 0 || contractCount > 0) {
        let reason = [];
        if (empCount > 0) reason.push(`${empCount} işçi`);
        if (contractCount > 0) reason.push(`${contractCount} müqavilə`);
        
        alert(`SİSTEM XƏTASI: "${dept.name}" şöbəsi silinə bilməz. \n\nSəbəb: Bu şöbəyə bağlı ${reason.join(' və ')} mövcuddur. \n\nZəhmət olmasa, əvvəlcə bu bağlılıqları başqa şöbəyə köçürün.`);
        return;
    }

    // 2. Confirm deletion
    if (window.confirm(`"${dept.name}" şöbəsini silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) {
        setIsLoading(true);
        try {
            await hrApi.deleteDepartment(dept.id, companyId);
            await fetchDepartments();
        } catch (error: any) {
            console.error('DELETE_DEPT_ERROR:', error);
            // Try to extract backend error message
            const serverError = error.error || error.message || 'Şöbəni silərkən naməlum xəta baş verdi.';
            alert(`SİSTEM XƏTASI: ${serverError}`);
        } finally {
            setIsLoading(false);
        }
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchDepartments();
    }
  }, [companyId]);

  const handleOpenModal = (dept: any = null) => {
    if (dept) {
      setCurrentDept(dept);
      setFormData({ name: dept.name, code: dept.code, head: dept.head || '' });
    } else {
      setCurrentDept(null);
      setFormData({ name: '', code: '', head: '' });
      setIsCodeManual(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) return;
    setIsSaving(true);
    try {
      if (currentDept) {
        await hrApi.updateDepartment(currentDept.id, formData, companyId);
      } else {
        await hrApi.createDepartment(formData, companyId);
      }
      await fetchDepartments();
      setIsModalOpen(false);
    } catch (error) {
      console.error('SAVE_DEPT_ERROR:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic relative text-left">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 font-black leading-none">
        <div className="leading-none text-left">
          <div className="flex items-center space-x-3 mb-2 leading-none">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[9px] font-black uppercase tracking-widest italic leading-none">{activeCompany?.name || '---'} Structure</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic leading-none">Şöbələr və Struktur</h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 italic leading-none"
        >
          <Plus className="w-5 h-5 leading-none" />
          <span>Yeni Şöbə</span>
        </button>
      </div>

      {/* SEARCH AND TOOLS */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm leading-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 leading-none">
          <div className="relative flex-1 group shadow-sm leading-none">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors shadow-sm leading-none" />
            <input 
              type="text" 
              placeholder="Şöbə adı üzrə axtar..."
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 pl-16 pr-6 text-xs font-black italic shadow-inner outline-none transition-all uppercase leading-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3 leading-none">
             <button className="flex items-center space-x-2 px-8 py-5 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-inner hover:bg-slate-100 transition-all italic leading-none">
                <Waypoints className="w-4 h-4 leading-none" />
                <span>Org Chart</span>
             </button>
             <button className="p-5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-[2rem] shadow-inner hover:text-indigo-500 transition-all shadow-sm leading-none">
                <Download className="w-5 h-5 shadow-sm leading-none" />
             </button>
          </div>
        </div>
      </div>

      {/* DEPARTMENTS GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 leading-none text-left">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 leading-none" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic leading-none">Məlumatlar Yüklənir...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 leading-none text-left">
            {filteredDepartments.map((dept) => (
            <div 
                key={dept.id} 
                className="group bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-10 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all cursor-pointer relative overflow-hidden shadow-sm leading-none text-left"
            >
                <div className="flex items-start justify-between mb-8 leading-none">
                   <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-[2rem] shadow-sm leading-none">
                      <Building2 className="w-8 h-8 shadow-sm leading-none" />
                   </div>
                   <div className="flex flex-col items-end leading-none">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1 leading-none text-right">İşçi Sayı</span>
                      <p className="text-2xl font-black text-slate-800 dark:text-white tabular-nums italic leading-none">
                         {(dept.positions ? dept.positions.reduce((acc: number, curr: any) => acc + (curr._count?.employees || 0), 0) : 0) || (dept._count?.employees || 0)}
                      </p>
                   </div>
                </div>
                <div className="mb-10 leading-none text-left">
                   <div className="flex items-center space-x-2 mb-2 leading-none text-left">
                      <span className="text-[10px] font-black text-indigo-500 uppercase italic tracking-tighter leading-none">{dept.code}</span>
                   </div>
                   <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-3 leading-tight text-left">{dept.name}</h3>
                </div>
                 <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800 leading-none">
                    <div className="flex items-center space-x-3">
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleOpenModal(dept); }}
                         className="flex items-center space-x-3 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-2xl text-[10px] font-black uppercase italic transition-all leading-none"
                       >
                          <Edit2 className="w-3.5 h-3.5 leading-none" />
                          <span>Düzəliş Et</span>
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleDelete(dept); }}
                         className="flex items-center space-x-3 px-4 py-3 bg-rose-50/50 dark:bg-rose-900/10 text-rose-300 hover:text-rose-600 rounded-2xl text-[10px] font-black uppercase italic transition-all leading-none"
                         title="Şöbəni Sil"
                       >
                          <Trash2 className="w-4 h-4 leading-none" />
                       </button>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all leading-none">
                       <ChevronRight className="w-5 h-5 leading-none" />
                    </div>
                 </div>
            </div>
            ))}
        </div>
      )}

      {/* DEPARTMENT MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 leading-none">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md leading-none" onClick={() => setIsModalOpen(false)}></div>
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[4rem] border border-white/20 shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 font-black italic uppercase leading-none">
                  <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between leading-none">
                      <div className="flex items-center space-x-4 leading-none">
                         <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center leading-none italic"><Plus className="w-6 h-6 leading-none" /></div>
                         <h3 className="text-xl font-black italic uppercase tracking-tight leading-none">{currentDept ? 'Şöbəni Redaktə Et' : 'Yeni Şöbə Yarat'}</h3>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-600 transition-all leading-none"><X className="w-5 h-5 leading-none" /></button>
                  </div>
                  <div className="p-12 space-y-8 font-black italic uppercase leading-none text-left">
                      <div className="space-y-4 leading-none text-left">
                         <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 leading-none text-left block">Şöbənin Tam Adı</label>
                         <input 
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Məs: MALİYYƏ VƏ MÜHASİBATLIQ"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] py-6 px-8 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase leading-none shadow-inner"
                         />
                      </div>
                      <div className="space-y-4 leading-none text-left">
                         <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 leading-none text-left block">Şöbə Kodu (Qısa)</label>
                          <div className="relative leading-none">
                             <input 
                                value={formData.code}
                                onChange={(e) => {
                                    setIsCodeManual(true);
                                    setFormData({...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '_')});
                                }}
                                placeholder="Məs: FIN_DEPT"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] py-6 px-8 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase leading-none shadow-inner"
                             />
                             {!isCodeManual && formData.name && (
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-500 text-white text-[8px] font-black rounded-lg uppercase tracking-tighter leading-none animate-pulse">Avtomatik</span>
                             )}
                          </div>
                      </div>
                  </div>
                  <div className="p-10 bg-slate-50 dark:bg-white/5 flex justify-end space-x-4 leading-none">
                      <button onClick={() => setIsModalOpen(false)} className="px-10 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest leading-none">Ləğv Et</button>
                      <button 
                         disabled={isSaving || !formData.name}
                         onClick={handleSave}
                         className="px-14 py-4.5 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center space-x-3 leading-none disabled:opacity-50"
                      >
                         {isSaving ? <Loader2 className="w-4 h-4 animate-spin leading-none" /> : <Save className="w-4 h-4 leading-none" />}
                         <span>{currentDept ? 'Dəyişikliyi Yadda Sakla' : 'Şöbəni Yadda Sakla'}</span>
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DepartmentList;
