import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Trophy, TrendingUp, AlertCircle, Save, CheckCircle2, Lock, 
  RotateCcw, ShieldCheck, RefreshCcw, Loader2, Search, Filter, Trash2, DollarSign,
  User, Building2, Briefcase, MapPin, X, Check, Settings, Download, GripVertical, ChevronRight
} from 'lucide-react';
import { hrApi, companyApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import { useOutletContext } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type DocumentStatus = 'DRAFT' | 'APPROVED' | 'LOCKED';

interface EmployeeBonus {
  id: string;
  name: string;
  fin: string;
  code: string;
  dept: string;
  pos: string;
  branch: string;
  branchId: string;
  workplaceType: string;
  gender: string;
  contractType: string;
  baseSalary: number;
  type: string;
  bonus: number;
  settlementId?: string;
}

const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

const BonusList = () => {
  const { activeCompany } = useCompany();
  const companyId = activeCompany?.id || 'COM-001';
  const { formatNumber } = useFormat();
  const { 
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    setFilterSidebarContent
  } = useOutletContext<any>();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>('DRAFT');
  
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<EmployeeBonus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  interface ColumnConfig {
    id: string;
    label: string;
    isVisible: boolean;
    isStickyLeft: boolean;
    isStickyRight: boolean;
    width: number;
  }

  const DEFAULT_COLUMNS: ColumnConfig[] = [
    { id: 'employee_info', label: 'İşçi / FİN', isVisible: true, isStickyLeft: true, isStickyRight: false, width: 220 },
    { id: 'dept_pos', label: 'Şöbə / Vəzifə', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 160 },
    { id: 'branch', label: 'Filial', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 110 },
    { id: 'workplaceType', label: 'İş Yeri', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 90 },
    { id: 'gender', label: 'Cinsi', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 75 },
    { id: 'contractType', label: 'Müqavilə', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 90 },
    { id: 'baseSalary', label: 'Maaş Gross', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 100 },
    { id: 'bonus_info', label: 'Mükafat Açıqlaması', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 260 },
    { id: 'bonus_amount', label: 'Məbləğ (₼)', isVisible: true, isStickyLeft: false, isStickyRight: true, width: 130 },
  ];

  const BONUS_REASONS = [
     "Yüksək İş Performansı",
     "Planın Artıq İcrası",
     "Keyfiyyətli İş Görülməsi",
     "Vaxtından Əvvəl İcra",
     "Əlavə İş Yükünün Qarşılanması",
     "Təşəbbüskarlıq və Yenilikçilik",
     "Komanda Dəstəyi və Əməkdaşlıq",
     "Müştəri Məmnuniyyəti",
     "Nizam-intizam və Davamiyyət",
     "Xüsusi Nailiyyət və ya Layihə Uğuru"
  ];

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem('bonus_registry_columns_v3');
    if (!saved) return DEFAULT_COLUMNS;
    try {
      const savedCols: ColumnConfig[] = JSON.parse(saved);
      const filteredSaved = savedCols.filter(sc => DEFAULT_COLUMNS.some(dc => dc.id === sc.id));
      const newCols = [...filteredSaved];
      DEFAULT_COLUMNS.forEach(defaultCol => {
        if (!newCols.some(c => c.id === defaultCol.id)) {
            newCols.push(defaultCol);
        }
      });
      return newCols;
    } catch (e) { return DEFAULT_COLUMNS; }
  });

  useEffect(() => {
    localStorage.setItem('bonus_registry_columns_v3', JSON.stringify(columnConfigs));
  }, [columnConfigs]);

  const activeColumns = useMemo(() => columnConfigs.filter(c => c.isVisible), [columnConfigs]);

  const getStickyLeftOffset = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      if (activeColumns[i].isStickyLeft) offset += activeColumns[i].width;
    }
    return offset;
  };

  const getStickyRightOffset = (index: number) => {
    let offset = 0;
    for (let i = activeColumns.length - 1; i > index; i--) {
      if (activeColumns[i].isStickyRight) offset += activeColumns[i].width;
    }
    return offset;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newConfigs = [...columnConfigs];
    const draggedItem = newConfigs[draggedIndex];
    newConfigs.splice(draggedIndex, 1);
    newConfigs.splice(index, 0, draggedItem);
    setColumnConfigs(newConfigs);
  };
  
  // Filter Options
  const [allDepartments, setAllDepartments] = useState<any[]>([]);
  const [allBranches, setAllBranches] = useState<any[]>([]);
  const [allPositions, setAllPositions] = useState<any[]>([]);

  const [fieldFilters, setFieldFilters] = useState({
    department: '',
    branchId: '',
    position: '',
    workplaceType: '',
    gender: '',
    contractType: ''
  });

  const loadData = useCallback(async () => {
    if (!companyId) return;
    try {
        setIsLoading(true);
        const [bonusData, statusData, depts, branches, positions] = await Promise.all([
            hrApi.getBonuses(selectedMonth, selectedYear, companyId),
            hrApi.getBonusStatus(selectedMonth, selectedYear, companyId),
            hrApi.getDepartments(companyId),
            companyApi.getBranches(companyId),
            hrApi.getPositions(companyId)
        ]);
        setEmployees(bonusData);
        setDocumentStatus(statusData.status);
        setAllDepartments(Array.isArray(depts) ? depts : []);
        setAllBranches(Array.isArray(branches) ? branches : []);
        setAllPositions(Array.isArray(positions) ? positions : []);
    } catch (err) {
        console.error('LOAD_BONUSES_ERROR:', err);
    } finally {
        setIsLoading(false);
    }
  }, [selectedMonth, selectedYear, companyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetFilters = () => {
    setFieldFilters({
      department: '',
      branchId: '',
      position: '',
      workplaceType: '',
      gender: '',
      contractType: ''
    });
    setSearchTerm('');
  };

  // Sidebar Filter Content
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-10">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2">Vəzifə və Şöbə</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Şöbə</label>
                <select 
                  value={fieldFilters.department}
                  onChange={(e) => setFieldFilters({...fieldFilters, department: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 uppercase"
                >
                  <option value="">HAMISI</option>
                  {allDepartments.map((d: any, i: number) => (
                    <option key={`side-dept-${i}`} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Vəzifə</label>
                <select 
                  value={fieldFilters.position}
                  onChange={(e) => setFieldFilters({...fieldFilters, position: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 uppercase"
                >
                  <option value="">HAMISI</option>
                  {allPositions
                    .filter(p => !fieldFilters.department || p.department?.name === fieldFilters.department)
                    .map((p, i) => (
                    <option key={`side-pos-${i}`} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Filial</label>
                <select 
                  value={fieldFilters.branchId}
                  onChange={(e) => setFieldFilters({...fieldFilters, branchId: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 uppercase"
                >
                  <option value="">HAMISI</option>
                  {allBranches.map((b, i) => (
                    <option key={`side-br-${i}`} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2">Şəxsi və Müqavilə</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">İş Yeri</label>
                  <select 
                    value={fieldFilters.workplaceType}
                    onChange={(e) => setFieldFilters({...fieldFilters, workplaceType: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold transition-all uppercase"
                  >
                    <option value="">HAMISI</option>
                    <option value="ƏSAS">ƏSAS</option>
                    <option value="ƏLAVƏ">ƏLAVƏ</option>
                  </select>
              </div>
              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cinsi</label>
                  <select 
                    value={fieldFilters.gender}
                    onChange={(e) => setFieldFilters({...fieldFilters, gender: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold transition-all uppercase"
                  >
                    <option value="">HAMISI</option>
                    <option value="MALE">KİŞİ</option>
                    <option value="FEMALE">QADIN</option>
                  </select>
              </div>
              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Müqavilə Növü</label>
                  <select 
                    value={fieldFilters.contractType}
                    onChange={(e) => setFieldFilters({...fieldFilters, contractType: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold transition-all uppercase"
                  >
                    <option value="">HAMISI</option>
                    <option value="MÜDDƏTSİZ">MÜDDƏTSİZ</option>
                    <option value="MÜDDƏTLİ">MÜDDƏTLİ</option>
                  </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <button 
                onClick={() => setIsFilterSidebarOpen(false)}
                className="w-full py-4 bg-indigo-600 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all italic leading-none"
            >
                TƏTBİQ ET VƏ BAĞLA
            </button>
            <button 
                onClick={resetFilters}
                className="w-full py-3 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 italic leading-none"
            >
                Filtrləri Sıfırla
            </button>
            <button 
                onClick={() => setIsFilterSidebarOpen(false)}
                className="w-full py-2 bg-transparent text-slate-300 text-[8px] font-black uppercase tracking-widest hover:text-slate-400 transition-all italic"
            >
                GERİ QAYIT
            </button>
          </div>
        </div>
      );
    }
  }, [isFilterSidebarOpen, fieldFilters, allDepartments, allPositions, allBranches]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = emp.name.toLowerCase().includes(searchLower) || emp.fin.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;

      if (fieldFilters.department && emp.dept !== fieldFilters.department) return false;
      if (fieldFilters.branchId && emp.branchId !== fieldFilters.branchId) return false;
      if (fieldFilters.position && emp.pos !== fieldFilters.position) return false;
      if (fieldFilters.workplaceType && emp.workplaceType !== fieldFilters.workplaceType) return false;
      if (fieldFilters.gender && emp.gender !== fieldFilters.gender) return false;
      if (fieldFilters.contractType && emp.contractType !== fieldFilters.contractType) return false;

      return true;
    });
  }, [employees, searchTerm, fieldFilters]);

  const handleExportExcel = () => {
     if (filteredEmployees.length === 0) return;
     
     const data = filteredEmployees.map(emp => ({
        'İşçi': emp.name,
        'FİN': emp.fin,
        'Kod': emp.code,
        'Şöbə': emp.dept,
        'Vəzifə': emp.pos,
        'Filial': emp.branch,
        'İş Yeri': emp.workplaceType,
        'Əsas Maaş': emp.baseSalary,
        'Bonus': emp.bonus,
        'Açıqlama': emp.type
     }));

     const worksheet = XLSX.utils.json_to_sheet(data);
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, "Bonuslar");
     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
     const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     saveAs(blob, `Bonus_Siyahisi_${selectedYear}_${selectedMonth}.xlsx`);
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      await loadData();
    } catch (err: any) {
        alert('Xəta: ' + err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Bütün məlumatı təmizləməyə əminsiniz?")) {
      setEmployees([]);
    }
  };

  const handleUpdateBonus = (id: string, field: 'type' | 'bonus', val: string | number) => {
    if (documentStatus !== 'DRAFT') return;
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, [field]: val } : emp));
  };

  const handleSave = async () => {
    try {
        setIsLoading(true);
        await hrApi.saveBonuses(employees, selectedMonth, selectedYear, companyId);
        await loadData();
        alert('Məlumatlar yadda saxlanıldı.');
    } catch (err: any) {
        alert('Xəta: ' + err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const changeStatus = async (newStatus: DocumentStatus) => {
    const confirmMsg = newStatus === 'LOCKED' ? 'Mübahirələndirmə verilsin və tabel kilidlənsin?' : (newStatus === 'APPROVED' ? 'Təsdiqlənsin?' : 'Ləğv edilsin?');
    if (!window.confirm(confirmMsg)) return;

    try {
      setIsLoading(true);
      await hrApi.changeBonusStatus(selectedMonth, selectedYear, newStatus, companyId);
      await loadData();
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalBonus = employees.reduce((acc, curr) => acc + curr.bonus, 0);
  const activeBonusCount = employees.filter(e => e.bonus > 0).length;

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-700 pb-24 text-slate-800 dark:text-slate-100 font-sans max-w-[100vw] translate-y-2">
      
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-8 px-6">
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic flex items-center gap-3">
              <span className="bg-emerald-500 text-white p-2.5 rounded-[1.2rem] shadow-xl shadow-emerald-500/20"><Trophy className="w-8 h-8" /></span>
              İşçi <span className="font-light not-italic text-emerald-500">Mükafatlandırılması</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 translate-x-16 italic">Bonus Management System</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Cari Dövr</span>
              <div className="text-xl font-black text-slate-700 dark:text-white flex items-center gap-2 mt-2 uppercase italic tracking-tight">
                  <span className="text-emerald-500">{months[selectedMonth-1]}</span> {selectedYear}
              </div>
            </div>
            {documentStatus !== 'DRAFT' && (
              <div className={`px-6 py-4 rounded-[1.5rem] flex items-center gap-2 border-2 ${
                documentStatus === 'LOCKED' ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-900/30 shadow-indigo-500/5' : 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-900/30 shadow-emerald-500/5'
              }`}>
                {documentStatus === 'LOCKED' ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                <span className="text-[11px] font-black uppercase tracking-widest">{documentStatus === 'LOCKED' ? 'KİLİDLİ' : 'TƏSDİQLƏNİB'}</span>
              </div>
            )}
          </div>
      </div>

      {documentStatus === 'DRAFT' && employees.length === 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 p-6 rounded-[2rem] mx-6 flex items-center gap-4 text-amber-700 dark:text-amber-500 font-bold text-[11px] uppercase tracking-wider animate-in slide-in-from-top-4 duration-500 mb-6 shadow-sm">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full"><AlertCircle className="w-5 h-5" /></div>
              <span>Diqqət: Mükafatlandırılacaq işçilər siyahısı boşdur. "Formalaşdır" düyməsi ilə ştatları cədvələ gətirib ardından əl ilə məlumatları daxil edə bilərsiniz.</span>
          </div>
      )}

      {/* ACTION BAR */}
      <div className="mx-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-10 py-6 bg-white dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-emerald-50/10 dark:from-emerald-900/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-wrap items-center gap-6 z-10 w-full">
               <div className="flex items-center gap-3 mr-auto bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))} 
                    disabled={documentStatus !== 'DRAFT'}
                    className="bg-white dark:bg-slate-800 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none transition-all disabled:opacity-50 shadow-sm border-none cursor-pointer"
                  >
                      {[2026, 2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(Number(e.target.value))} 
                    disabled={documentStatus !== 'DRAFT'}
                    className="bg-white dark:bg-slate-800 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none transition-all disabled:opacity-50 shadow-sm border-none cursor-pointer"
                  >
                     {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                  </select>
               </div>

               <div className="flex flex-wrap gap-4">
                  {/* STAGE: DRAFT */}
                  {documentStatus === 'DRAFT' && (
                    <>
                      {employees.length === 0 ? (
                        <button 
                          onClick={handleGenerate}
                          disabled={isLoading}
                          className="flex items-center px-10 py-4.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-slate-950 italic leading-none"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />} Formalaşdır
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={handleClear}
                            disabled={isLoading}
                            className="flex items-center px-8 py-4 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all font-black leading-none bg-rose-50/50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Təmizlə
                          </button>
                          <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center px-12 py-4.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-slate-900/20 italic leading-none"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Yadda Saxla
                          </button>
                          <button 
                            onClick={() => changeStatus('APPROVED')}
                            disabled={isLoading}
                            className="flex items-center border border-slate-200 dark:border-slate-700 text-slate-500 px-8 py-4.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all italic leading-none"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Təsdiqlə
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {/* STAGE: APPROVED */}
                  {documentStatus === 'APPROVED' && (
                    <>
                      <button 
                        onClick={() => changeStatus('DRAFT')}
                        disabled={isLoading}
                        className="flex items-center px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-xl italic leading-none bg-white dark:bg-slate-800 border-2 border-rose-100 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      >
                        <RotateCcw className="w-4 h-4 mr-3" /> Təsdiqi ləğv et
                      </button>
                      <button 
                        onClick={() => changeStatus('LOCKED')}
                        disabled={isLoading}
                        className="flex items-center px-12 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-500/20 italic leading-none bg-indigo-600 text-white hover:scale-105 hover:bg-indigo-700"
                      >
                        <Lock className="w-4 h-4 mr-3" /> Jurnala Köçür (Kilidlə)
                      </button>
                    </>
                  )}

                  {/* STAGE: LOCKED */}
                  {documentStatus === 'LOCKED' && (
                     <button 
                        onClick={() => changeStatus('APPROVED')}
                        disabled={isLoading}
                        className="flex items-center px-12 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-xl italic leading-none bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:scale-105"
                      >
                       <ShieldCheck className="w-4 h-4 mr-3" /> Mühasibat Kilidini Aç (Ləğv Et)
                     </button>
                  )}
               </div>
          </div>
      </div>

      {employees.length > 0 && (
        <>
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
                     <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Aktiv Fond</span>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1 opacity-60">Cəmi Bonus Fondu</p>
               <h3 className="text-3xl font-black italic tabular-nums tracking-tighter">₼ {totalBonus.toLocaleString(undefined, {minimumFractionDigits:2})}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm border-l-8 border-l-indigo-500 relative overflow-hidden group">
               <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform">
                     <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Əhatə Dairəsi</span>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1 opacity-60">Bu ay mükafat alan işçilər</p>
               <h3 className="text-3xl font-black italic tracking-tighter">{activeBonusCount} <span className="text-xs font-bold text-slate-400 tracking-normal opacity-50 uppercase">Nəfər</span> <span className="text-sm font-bold text-slate-400/30 font-light mx-2">/</span> <span className="text-lg font-bold text-slate-300 italic">{employees.length}</span></h3>
            </div>
          </div>

          {/* LIST TABLE CONTAINER */}
          <div className="flex-1 flex flex-col min-h-[500px]">
            {/* NEW PREMIUM SEARCH & ACTIONS BAR */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mx-6 mt-10">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="ƏMR NO, PERSONAL VƏ YA SƏNƏD ÜZRƏ AXTARIŞ..."
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none transition-all uppercase text-slate-700 dark:text-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-3 leading-none">
                <button 
                  onClick={() => setIsColumnModalOpen(true)}
                  className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-slate-100 transition-all leading-none border border-transparent group"
                  title="Sütunları Tənzimlə"
                >
                  <Settings className="w-5 h-5 transition-transform group-hover:rotate-90 duration-500" />
                </button>
                <button 
                  onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                  className={`p-4 rounded-xl transition-all leading-none border ${
                    isFilterSidebarOpen 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:bg-slate-100'
                  }`}
                  title="Zəngin Filtir"
                >
                  <Filter className="w-5 h-5 leading-none" />
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="p-4 bg-slate-50 dark:bg-slate-800 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all leading-none border border-transparent hover:border-emerald-100"
                  title="Excel-ə Çıxar"
                >
                  <Download className="w-5 h-5 leading-none" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[1200px] font-black italic uppercase leading-none">
                  <thead className="sticky top-0 z-40 bg-slate-50 dark:bg-slate-800">
                     <tr className="border-b border-slate-100 dark:border-slate-800">
                        {activeColumns.map((col, index) => {
                           const isStickyLeft = col.isStickyLeft;
                           const isStickyRight = col.isStickyRight;
                           const leftOffset = isStickyLeft ? getStickyLeftOffset(index) : undefined;
                           const rightOffset = isStickyRight ? getStickyRightOffset(index) : undefined;

                           return (
                             <th 
                               key={col.id}
                               style={{ 
                                 left: leftOffset !== undefined ? `${leftOffset}px` : undefined,
                                 right: rightOffset !== undefined ? `${rightOffset}px` : undefined,
                                 width: `${col.width}px`,
                                 minWidth: `${col.width}px`,
                                 maxWidth: `${col.width}px`
                               }}
                               className={`
                                 py-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none
                                 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800
                                 ${isStickyLeft || isStickyRight ? 'sticky z-40' : ''}
                                 ${col.id === 'baseSalary' || col.id === 'bonus_amount' ? 'text-right' : 'text-left'}
                                 ${isStickyLeft && index === activeColumns.findLastIndex(c => c.isStickyLeft) ? 'border-r border-slate-100 dark:border-slate-800 shadow-[1px_0_3px_rgba(0,0,0,0.02)]' : ''}
                                 ${isStickyRight && index === activeColumns.findIndex(c => c.isStickyRight) ? 'border-l border-slate-100 dark:border-slate-800 shadow-[-1px_0_3px_rgba(0,0,0,0.02)]' : ''}
                               `}
                             >
                               {col.label}
                             </th>
                           );
                        })}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800 leading-none">
                     {filteredEmployees.map(emp => (
                        <tr key={emp.id} className={`group transition-all leading-none ${documentStatus !== 'DRAFT' ? 'opacity-90 bg-slate-50/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}>
                           {activeColumns.map((col, index) => {
                              const isStickyLeft = col.isStickyLeft;
                              const isStickyRight = col.isStickyRight;
                              const leftOffset = isStickyLeft ? getStickyLeftOffset(index) : undefined;
                              const rightOffset = isStickyRight ? getStickyRightOffset(index) : undefined;

                              return (
                                <td 
                                  key={col.id}
                                  style={{ 
                                    left: leftOffset !== undefined ? `${leftOffset}px` : undefined,
                                    right: rightOffset !== undefined ? `${rightOffset}px` : undefined,
                                    width: `${col.width}px`,
                                    minWidth: `${col.width}px`,
                                    maxWidth: `${col.width}px`
                                  }}
                                  className={`
                                    py-8 px-4 bg-white dark:bg-slate-900 leading-none
                                    ${isStickyLeft || isStickyRight ? 'sticky z-10' : ''}
                                    ${isStickyLeft && index === activeColumns.findLastIndex(c => c.isStickyLeft) ? 'border-r border-slate-200 dark:border-slate-700' : ''}
                                    ${isStickyRight && index === activeColumns.findIndex(c => c.isStickyRight) ? 'border-l border-slate-200 dark:border-slate-700' : ''}
                                  `}
                                >
                                  {col.id === 'employee_info' && (
                                     <div className="flex items-center space-x-5 leading-none">
                                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center font-black text-sm italic group-hover:scale-110 transition-transform shadow-sm leading-none">
                                           {emp.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col gap-1.5 leading-none">
                                           <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase italic leading-none">{emp.name}</span>
                                           <div className="flex items-center gap-4 leading-none">
                                              <span className="text-[10px] font-black text-slate-400/60 flex items-center gap-1.5 uppercase italic leading-none"><User className="w-3 h-3"/> {emp.code}</span>
                                              <span className="text-[10px] font-black text-indigo-400 flex items-center gap-1.5 uppercase italic leading-none">{emp.fin}</span>
                                           </div>
                                        </div>
                                     </div>
                                  )}
                                  {col.id === 'dept_pos' && (
                                     <div className="flex flex-col gap-1.5 leading-none">
                                        <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase italic tracking-wider leading-none">{emp.dept}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase italic opacity-70 leading-none">{emp.pos}</p>
                                     </div>
                                  )}
                                  {col.id === 'branch' && (
                                     <p className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase italic flex items-center gap-2 tracking-widest leading-none"><MapPin className="w-3.5 h-3.5 text-rose-400 opacity-60"/> {emp.branch || '-'}</p>
                                  )}
                                  {col.id === 'workplaceType' && (
                                     <div className="flex justify-center leading-none">
                                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                         emp.workplaceType === 'ƏSAS' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                       }`}>
                                         {emp.workplaceType}
                                       </span>
                                     </div>
                                  )}
                                  {col.id === 'gender' && (
                                    <div className="flex justify-center leading-none">
                                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase italic ${emp.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {emp.gender === 'MALE' ? 'KİŞİ' : 'QADIN'}
                                      </span>
                                    </div>
                                  )}
                                  {col.id === 'contractType' && (
                                    <div className="flex justify-center leading-none">
                                      <span className="text-[10px] font-black text-slate-500 italic opacity-80 uppercase leading-none">
                                        {emp.contractType === 'FIXED' ? 'MÜDDƏTLİ' : (emp.contractType === 'INDEFINITE' ? 'MÜDDƏTSİZ' : (emp.contractType || 'MÜDDƏTSİZ'))}
                                      </span>
                                    </div>
                                  )}
                                  {col.id === 'baseSalary' && (
                                     <div className="text-right leading-none tabular-nums">
                                       <span className="text-xs font-black text-slate-700 dark:text-slate-300 italic tracking-tight leading-none">{formatNumber(emp.baseSalary, 2)}</span>
                                     </div>
                                  )}
                                  {col.id === 'bonus_info' && (
                                     <div className="leading-none relative">
                                        <div className="relative group">
                                           <input 
                                             type="text"
                                             placeholder="..."
                                             value={openDropdownId === emp.id ? dropdownSearch : emp.type}
                                             onFocus={() => {
                                                setOpenDropdownId(emp.id);
                                                setDropdownSearch(emp.type);
                                             }}
                                             onChange={(e) => {
                                                setDropdownSearch(e.target.value);
                                                if (e.target.value === '') {
                                                    handleUpdateBonus(emp.id, 'type', '');
                                                }
                                            }}
                                             disabled={documentStatus !== 'DRAFT'}
                                             className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 px-6 text-[10px] font-black ring-4 ring-transparent focus:ring-emerald-500/10 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 italic shadow-sm leading-none uppercase pr-10"
                                           />
                                           {emp.type && documentStatus === 'DRAFT' && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateBonus(emp.id, 'type', '');
                                                        setDropdownSearch('');
                                                    }}
                                                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                           )}
                                           <ChevronRight className={`absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 transition-transform ${openDropdownId === emp.id ? 'rotate-90 text-emerald-500' : ''}`} />
                                        </div>

                                        {openDropdownId === emp.id && (
                                           <>
                                              <div 
                                                className="fixed inset-0 z-[50]" 
                                                onClick={() => setOpenDropdownId(null)}
                                              />
                                              <div className="absolute left-0 top-full mt-2 w-full min-w-[240px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                 <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                                                    {BONUS_REASONS.filter(r => r.toLowerCase().includes(dropdownSearch.toLowerCase())).length > 0 ? (
                                                       BONUS_REASONS.filter(r => r.toLowerCase().includes(dropdownSearch.toLowerCase())).map((reason, rid) => (
                                                          <button
                                                             key={rid}
                                                             onClick={() => {
                                                                handleUpdateBonus(emp.id, 'type', reason);
                                                                setOpenDropdownId(null);
                                                             }}
                                                             className="w-full text-left px-5 py-3.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-[10px] font-black uppercase italic text-slate-600 dark:text-slate-300 rounded-xl transition-colors flex items-center justify-between group"
                                                          >
                                                             <span>{reason}</span>
                                                             <Check className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                          </button>
                                                       ))
                                                    ) : (
                                                       <div className="px-5 py-8 text-center text-[9px] font-black text-slate-300 uppercase italic">Nəticə tapılmadı</div>
                                                    )}
                                                 </div>
                                              </div>
                                           </>
                                        )}
                                     </div>
                                  )}
                                  {col.id === 'bonus_amount' && (
                                       <div className="flex justify-end leading-none">
                                           <div className="relative leading-none">
                                               <input 
                                                 type="text"
                                                 defaultValue={emp.bonus === 0 ? '' : emp.bonus.toString()}
                                                 onBlur={(e) => {
                                                     const val = e.target.value.replace(/[^0-9.]/g, '');
                                                     const num = parseFloat(val) || 0;
                                                     handleUpdateBonus(emp.id, 'bonus', num);
                                                     e.target.value = num === 0 ? '' : num.toString();
                                                 }}
                                                 onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const target = e.target as HTMLInputElement;
                                                        const val = target.value.replace(/[^0-9.]/g, '');
                                                        const num = parseFloat(val) || 0;
                                                        handleUpdateBonus(emp.id, 'bonus', num);
                                                        target.value = num === 0 ? '' : num.toString();
                                                        target.blur();
                                                    }
                                                 }}
                                                 placeholder="0.00"
                                                 disabled={documentStatus !== 'DRAFT'}
                                                 className={`w-36 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 px-6 text-[13px] font-black text-right italic ring-4 ring-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-white tabular-nums shadow-sm ${emp.bonus > 0 ? 'ring-emerald-500/10 bg-emerald-50/30' : 'focus:ring-emerald-500/10'} leading-none`}
                                               />
                                               {emp.bonus > 0 && <Check className="absolute -left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-in zoom-in-50" />}
                                           </div>
                                       </div>
                                  )}
                                </td>
                              );
                           })}
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            {filteredEmployees.length === 0 && (
                <div className="p-20 flex flex-col items-center justify-center text-slate-300">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-black uppercase italic tracking-widest opacity-40">Heç bir nəticə tapılmadı</p>
                </div>
            )}
          </div>
      {/* COLUMN SETTINGS MODAL */}
      {isColumnModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 italic font-black">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl max-h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-black uppercase italic tracking-tight text-slate-900 dark:text-white leading-none">Cədvəl Sütunları</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Görünüşü fərdiləşdirin</p>
                </div>
              </div>
              <button 
                onClick={() => setIsColumnModalOpen(false)}
                className="p-4 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-2xl shadow-sm transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {columnConfigs.map((col, index) => {
                  const leftStickyCount = columnConfigs.filter(c => c.isStickyLeft).length;
                  const rightStickyCount = columnConfigs.filter(c => c.isStickyRight).length;

                  return (
                    <div 
                      key={col.id} 
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`group flex items-center p-4 rounded-2xl border transition-all cursor-move active:cursor-grabbing ${
                        col.isVisible 
                        ? (dragOverIndex === index ? 'bg-indigo-50 border-indigo-500 scale-[1.01]' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 shadow-sm') 
                        : 'bg-slate-50/30 dark:bg-slate-800/20 border-transparent opacity-60'
                      } ${draggedIndex === index ? 'opacity-20 grayscale' : ''}`}
                    >
                      <div className="mr-4 text-slate-300 group-hover:text-indigo-500 transition-colors">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <div className="flex-1">
                        <span className={`text-[11px] font-black uppercase tracking-tight ${col.isVisible ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{col.label}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          {col.isStickyLeft && <span className="flex items-center text-[7px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-widest shadow-sm">SOL DON</span>}
                          {col.isStickyRight && <span className="flex items-center text-[7px] font-black bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded uppercase tracking-widest shadow-sm">SAĞ DON</span>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <button 
                            disabled={!col.isVisible || (!col.isStickyLeft && leftStickyCount >= 3)}
                            onClick={(e) => {
                                e.stopPropagation();
                                const newCols = [...columnConfigs];
                                newCols[index].isStickyLeft = !newCols[index].isStickyLeft;
                                if (newCols[index].isStickyLeft) newCols[index].isStickyRight = false;
                                setColumnConfigs(newCols);
                            }}
                            className={`w-8 h-5 p-0.5 rounded-full flex items-center ${col.isStickyLeft ? 'bg-blue-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}
                          >
                            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>

                        <div className="flex flex-col items-center">
                          <button 
                            disabled={!col.isVisible || (!col.isStickyRight && rightStickyCount >= 2)}
                            onClick={(e) => {
                                e.stopPropagation();
                                const newCols = [...columnConfigs];
                                newCols[index].isStickyRight = !newCols[index].isStickyRight;
                                if (newCols[index].isStickyRight) newCols[index].isStickyLeft = false;
                                setColumnConfigs(newCols);
                            }}
                            className={`w-8 h-5 p-0.5 rounded-full flex items-center ${col.isStickyRight ? 'bg-amber-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}
                          >
                            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[7px] font-black text-slate-400 uppercase mb-1.5">Görünürlük</span>
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                const newCols = [...columnConfigs];
                                newCols[index].isVisible = !newCols[index].isVisible;
                                if (!newCols[index].isVisible) {
                                  newCols[index].isStickyLeft = false;
                                  newCols[index].isStickyRight = false;
                                }
                                setColumnConfigs(newCols);
                            }}
                            className={`w-12 h-8 p-1.5 rounded-xl flex items-center ${col.isVisible ? 'bg-emerald-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}
                          >
                            {col.isVisible ? <Check className="w-5 h-5 text-white" /> : <div className="w-5 h-5 bg-white rounded-lg shadow-sm" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <button 
                onClick={() => { if (window.confirm('Sıfırlamaq istəyirsiniz?')) setColumnConfigs(DEFAULT_COLUMNS); }}
                className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all leading-none"
              >
                Sıfırla
              </button>
              <button 
                onClick={() => setIsColumnModalOpen(false)}
                className="px-10 py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all leading-none"
              >
                Yadda Saxla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )}
</div>
  );
};

export default BonusList;
