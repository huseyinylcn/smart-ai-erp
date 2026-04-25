import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Edit2, Check, X, 
  FileText, Globe, Briefcase, RefreshCw, ChevronRight,
  ShieldCheck, AlertCircle, PlusCircle as PlusCircleIcon,
  MapPin, Trash2, Loader2
} from 'lucide-react';
import { companyApi, hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const CompanyManagement = () => {
  const { companies, refreshCompanies, activeCompany, setActiveCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<'companies' | 'branches'>('companies');
  
  // Company Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    code: '',
    name: '',
    taxId: '',
    legalName: '',
    email: '',
    phone: '',
    address: '',
    country: 'Azerbaijan',
    currency: 'AZN'
  });

  // Branch State
  const [branches, setBranches] = useState<any[]>([]);
  const [isBranchLoading, setIsBranchLoading] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isEditingBranch, setIsEditingBranch] = useState(false);
  const [branchFormData, setBranchFormData] = useState({
    id: '',
    name: '',
    code: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    if (activeTab === 'branches' && activeCompany) {
        fetchBranches();
    }
  }, [activeTab, activeCompany?.id]);

  const fetchBranches = async () => {
    if (!activeCompany) return;
    setIsBranchLoading(true);
    try {
        const data = await hrApi.getBranches(activeCompany.id);
        setBranches(data);
    } catch (error) {
        console.error('Failed to fetch branches:', error);
    } finally {
        setIsBranchLoading(false);
    }
  };

  const handleOpenModal = (company?: any) => {
    if (company) {
      setFormData({
        id: company.id,
        code: company.code,
        name: company.name,
        taxId: company.taxId || '',
        legalName: company.legalName || company.name,
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        country: company.country || 'Azerbaijan',
        currency: company.currency || 'AZN'
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: '',
        code: '',
        name: '',
        taxId: '',
        legalName: '',
        email: '',
        phone: '',
        address: '',
        country: 'Azerbaijan',
        currency: 'AZN'
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await companyApi.updateCompany(formData.id, {
          name: formData.name,
          taxId: formData.taxId
        });
      } else {
        await companyApi.createCompany({
          code: formData.code,
          name: formData.name,
          taxId: formData.taxId
        });
      }
      await refreshCompanies();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save company:', error);
      alert('Xəta baş verdi: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBranchModal = (branch?: any) => {
    if (branch) {
        setBranchFormData({
            id: branch.id,
            name: branch.name,
            code: branch.code || '',
            address: branch.address || '',
            phone: branch.phone || ''
        });
        setIsEditingBranch(true);
    } else {
        setBranchFormData({
            id: '',
            name: '',
            code: '',
            address: '',
            phone: ''
        });
        setIsEditingBranch(false);
    }
    setIsBranchModalOpen(true);
  };

  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany) return;
    setIsLoading(true);
    try {
        if (isEditingBranch) {
            await hrApi.updateBranch(branchFormData.id, branchFormData, activeCompany.id);
        } else {
            await hrApi.createBranch(branchFormData, activeCompany.id);
        }
        await fetchBranches();
        setIsBranchModalOpen(false);
    } catch (error: any) {
        alert('Xəta: ' + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteBranch = async (id: string, name: string) => {
    if (!activeCompany) return;
    if (name === 'Baş Ofis') {
        alert('Baş Ofis silinə bilməz.');
        return;
    }
    if (!window.confirm(`"${name}" filialını silmək istədiyinizə əminsiniz?`)) return;
    
    try {
        await hrApi.deleteBranch(id, activeCompany.id);
        await fetchBranches();
    } catch (error: any) {
        alert('Filial silinmədi: ' + (error.data?.error || error.message));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700 font-black italic uppercase leading-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800 leading-none">
        <div className="space-y-1 leading-none text-left">
          <div className="flex items-center space-x-3 mb-2 leading-none">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic leading-none">Sistem İdarəçiliyi</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums leading-none">Müəssisə Tənzimləmələri</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic leading-none lowercase mt-2">Şirkətlərin və struktur bölmələrin mərkəzi idarəetmə paneli</p>
        </div>

        <div className="flex items-center space-x-3 leading-none">
           <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl flex items-center shadow-inner leading-none">
              <button 
                onClick={() => setActiveTab('companies')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all leading-none ${activeTab === 'companies' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >Şirkətlər</button>
              <button 
                onClick={() => setActiveTab('branches')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all leading-none ${activeTab === 'branches' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >Filiallar</button>
           </div>
        </div>
      </div>

      {activeTab === 'companies' && (
        <>
            {/* STATS / INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 leading-none">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-5 leading-none">
                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Building2 className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mövcud Şirkətlər</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white italic tabular-nums">{companies.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-5 leading-none">
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Aktiv Sessiya</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white italic tabular-nums uppercase">{activeCompany?.code || 'Yoxdur'}</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl shadow-indigo-500/20 flex items-center space-x-5 text-white hover:scale-[1.02] transition-all leading-none"
                >
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Plus className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Əməliyyat</p>
                    <p className="text-lg font-black italic uppercase leading-tight">Müəssisə Əlavə Et</p>
                    </div>
                </button>
            </div>

            {/* COMPANY LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 leading-none text-left">
                {companies.map(company => (
                <div 
                    key={company.id} 
                    className={`group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border transition-all duration-300 hover:shadow-soft-xl ${activeCompany?.id === company.id ? 'border-indigo-500 ring-4 ring-indigo-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'}`}
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-5">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black italic shadow-inner ${activeCompany?.id === company.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors'}`}>
                            {company.code?.slice(0, 2) || '??'}
                        </div>
                        <div className="text-left">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums group-hover:text-indigo-600 transition-colors">{company.name}</h3>
                                {activeCompany?.id === company.id && <Check className="w-5 h-5 text-indigo-500" />}
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">VÖEN: {company.taxId || 'Qeyd edilməyib'}</p>
                        </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <button 
                            onClick={() => handleOpenModal(company)}
                            className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                            <Edit2 className="w-4 h-4" />
                            </button>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">ID: {company.id.slice(0, 8)}...</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center space-x-3 text-slate-500">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                            <Globe className="w-4 h-4" />
                        </div>
                        <span className="text-[12px] font-bold uppercase italic">Azerbaijan</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-500">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-[12px] font-black italic">AZN</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-6 border-t border-slate-50 dark:border-slate-800">
                        <button 
                        onClick={() => setActiveCompany(company)}
                        disabled={activeCompany?.id === company.id}
                        className={`flex-1 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest italic transition-all ${activeCompany?.id === company.id ? 'bg-indigo-50 text-indigo-600 opacity-60 cursor-default' : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none'}`}
                        >
                        {activeCompany?.id === company.id ? 'Hazırda Aktivdir' : 'Bu Şirkətə Keç'}
                        </button>
                        <button className="w-14 h-14 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
                        <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                ))}

                {companies.length === 0 && (
                <div className="col-span-2 py-24 bg-slate-50/50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center text-slate-300 mb-6 border border-slate-100 dark:border-slate-700">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-600 dark:text-slate-400 uppercase italic tracking-tight">Şirkət Tapılmadı</h3>
                    <p className="text-slate-400 font-medium mt-3 max-w-sm lowercase italic">Backend bazasında hələ heç bir müəssisə yaradılmayıb. Başlamaq üçün yeni şirkət əlavə edin.</p>
                </div>
                )}
            </div>
        </>
      )}

      {activeTab === 'branches' && (
        <div className="animate-in slide-in-from-right-10 duration-500 leading-none">
            {!activeCompany ? (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 leading-none">
                    <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-400 font-black italic uppercase tracking-widest">Zəhmət olmasa əvvəlcə bir şirkət seçin</p>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-8 leading-none">
                        <div className="text-left leading-none">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase leading-none">Filiallar və Nümayəndəliklər</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{activeCompany.name} üzrə {branches.length} filial mövcuddur</p>
                        </div>
                        <button 
                            onClick={() => handleOpenBranchModal()}
                            className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transform hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-600/20 shadow-lg leading-none italic"
                        >
                            <Plus className="w-4 h-4 mr-3" />
                            Filial Əlavə Et
                        </button>
                    </div>

                    {isBranchLoading ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {branches.map(branch => (
                                <div key={branch.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative text-left">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-600">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleOpenBranchModal(branch)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"
                                            ><Edit2 className="w-4 h-4" /></button>
                                            <button 
                                                onClick={() => handleDeleteBranch(branch.id, branch.name)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                                            ><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-2">{branch.name}</h4>
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-6 italic">KOD: {branch.code || '---'}</p>
                                    
                                    <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-800 leading-none">
                                        <div className="flex items-center text-[11px] font-black text-slate-500 italic truncate leading-none">
                                            <Globe className="w-3.5 h-3.5 mr-3 text-slate-300" />
                                            {branch.address || 'Ünvan qeyd edilməyib'}
                                        </div>
                                        <div className="flex items-center text-[11px] font-black text-slate-500 italic leading-none">
                                            <ShieldCheck className="w-3.5 h-3.5 mr-3 text-slate-300" />
                                            Aktiv Filial
                                        </div>
                                    </div>
                                   
                                    {branch.name === 'Baş Ofis' && (
                                        <div className="absolute top-8 right-8 text-[8px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">
                                            DEFAULT
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
      )}

      {/* COMPANY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 leading-none">
           <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 text-left">
              <form onSubmit={handleSubmit}>
                 <div className="p-10 pb-0">
                    <div className="flex items-center justify-between mb-8 leading-none">
                       <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                             <PlusCircleIcon className="w-6 h-6" />
                          </div>
                          <div>
                             <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight leading-none">{isEditing ? 'Şirkət Parametrləri' : 'Yeni Şirkət Qeydiyyatı'}</h2>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sistemə yeni hüquqi şəxs əlavə edin</p>
                          </div>
                       </div>
                       <button 
                         type="button"
                         onClick={() => setIsModalOpen(false)}
                         className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"
                       >
                          <X className="w-5 h-5" />
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-none">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Şirkət Kodu (Məs: ABC)</label>
                          <input 
                            required
                            disabled={isEditing}
                            value={formData.code}
                            onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                            className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[14px] font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Şirkətin Adı</label>
                          <input 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[14px] font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">VÖEN (Azı 10 rəqəm)</label>
                          <input 
                            value={formData.taxId}
                            onChange={e => setFormData({...formData, taxId: e.target.value})}
                            className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[14px] font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="p-10 flex items-center space-x-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[12px] uppercase transition-all italic tracking-widest">Ləğv Et</button>
                    <button type="submit" disabled={isLoading} className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black text-[12px] uppercase shadow-xl shadow-indigo-600/20 transition-all italic tracking-widest disabled:opacity-50 flex items-center justify-center">
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-3" />}
                        Sənədi Təsdiqlə
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* BRANCH MODAL */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 leading-none">
           <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden text-left">
                <form onSubmit={handleBranchSubmit}>
                    <div className="p-10 pb-0">
                        <div className="flex items-center justify-between mb-10 leading-none">
                            <div className="flex items-center space-x-5 leading-none">
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <div className="leading-none text-left">
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight leading-none">{isEditingBranch ? 'Filialı Yenilə' : 'Yeni Filial Qeydiyyatı'}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{activeCompany?.name} üzrə bölmə</p>
                                </div>
                            </div>
                            <button onClick={() => setIsBranchModalOpen(false)} type="button" className="p-4 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 leading-none">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Filialın Adı</label>
                                <input 
                                    required
                                    value={branchFormData.name}
                                    onChange={e => setBranchFormData({...branchFormData, name: e.target.value})}
                                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[14px] font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Filial Kodu</label>
                                <input 
                                    value={branchFormData.code}
                                    onChange={e => setBranchFormData({...branchFormData, code: e.target.value.toUpperCase()})}
                                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[14px] font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Fiziki Ünvan</label>
                                <input 
                                    value={branchFormData.address}
                                    onChange={e => setBranchFormData({...branchFormData, address: e.target.value})}
                                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[14px] font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-10 flex items-center space-x-6">
                        <button type="button" onClick={() => setIsBranchModalOpen(false)} className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-[1.8rem] font-black text-[12px] uppercase italic tracking-widest transition-all">Ləğv Et</button>
                        <button type="submit" disabled={isLoading} className="flex-[2] py-6 bg-emerald-600 text-white rounded-[1.8rem] font-black text-[12px] uppercase shadow-2xl shadow-emerald-600/30 italic tracking-widest transition-all flex items-center justify-center">
                            {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-4" />}
                            Filialı Yadda Saxla
                        </button>
                    </div>
                </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
