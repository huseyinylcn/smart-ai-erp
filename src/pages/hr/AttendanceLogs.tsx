import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Clock, Plus, Search, Calendar, CheckCircle2, User, 
  Play, Square, Loader2, Trash2, RotateCcw, ChevronLeft, 
  ChevronRight, Filter, Download, Zap, AlertCircle, X,
  MapPin, ShieldCheck, AlertTriangle, QrCode, Smartphone,
  Lock, Unlock
} from 'lucide-react';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import QRGenerator from '../../components/hr/QRGenerator';
import { financeApi } from '../../utils/api';

interface AttendanceDetail {
  id: string;
  day: number;
  status: string;
  timeIn: string | null;
  timeOut: string | null;
  hoursWorked: number | null;
  isManual?: boolean;
  attendance?: { employeeId: string };
}

interface AttendanceMatrixRow {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  monthlyNorm?: number;
  employee: {
    id: string;
    fullName: string;
    code?: string;
    fin?: string;
    position: string | null;
    dept?: string;
    jobPosition?: { name: string };
    department?: { name: string };
    workplaceType?: string;
    startDate: string | null;
  };
  details: AttendanceDetail[];
  branchId?: string;
  departmentId?: string;
}

const MultiSelect = ({ label, items, selectedIds, onChange }: { label: string, items: any[], selectedIds: string[], onChange: (ids: string[]) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredItems = items.filter(item => {
    const name = item.name || item.title || item.fullName || item.label || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });
  const isAllSelected = selectedIds.length === items.length && items.length > 0;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border-2 border-slate-50 rounded-[1.5rem] py-2 px-4 shadow-sm text-[11px] font-black text-slate-800 uppercase italic outline-none cursor-pointer"
      >
        <Filter className="w-3 h-3 text-slate-400" />
        {selectedIds.length > 0 ? `${label} (${selectedIds.length})` : label}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 z-[101] overflow-hidden p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {items.length > 5 && (
              <div className="relative mb-2 px-2 pt-2">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Axtar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border-transparent rounded-xl py-2 pl-9 pr-4 text-[10px] font-black uppercase italic outline-none focus:border-indigo-400 transition-all"
                />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto px-2 custom-scrollbar">
              <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-all group">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={() => {
                    if (isAllSelected) onChange([]);
                    else onChange(items.map(i => i.id));
                  }}
                  className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-[10px] font-black text-indigo-600 uppercase italic">Hamısını Seç</span>
              </label>
              <div className="h-px bg-slate-50 my-1" />
              {filteredItems.map(item => (
                <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(item.id)}
                    onChange={() => {
                      if (selectedIds.includes(item.id)) onChange(selectedIds.filter(id => id !== item.id));
                      else onChange([...selectedIds, item.id]);
                    }}
                    className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] font-black text-slate-600 uppercase italic">
                    {item.name || item.title || item.fullName || item.label || item.id || 'Adsız'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AttendanceLogs = () => {
  const { activeCompany } = useCompany();
  const companyId = activeCompany?.id || 'COM-001';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [matrix, setMatrix] = useState<AttendanceMatrixRow[]>([]);
  const [liveLogs, setLiveLogs] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'TABEL' | 'LIVE'>('TABEL');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);
  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([]);
  
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  
  const [editingCell, setEditingCell] = useState<any>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [isLocked, setIsLocked] = useState(false);
  const [periodStatus, setPeriodStatus] = useState<string>('NOT_FOUND');
  const [showQR, setShowQR] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDay, setEditingDay] = useState<{rowId: string, employeeName: string, detail: AttendanceDetail} | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editHours, setEditHours] = useState('');
  const [editTimeIn, setEditTimeIn] = useState('');
  const [editTimeOut, setEditTimeOut] = useState('');
  const [isSavingCell, setIsSavingCell] = useState(false);

  const employeesMap = useMemo(() => {
    const map = new Map();
    matrix.forEach(row => map.set(row.employee.id, row.employee));
    return map;
  }, [matrix]);
  
  const layoutContext: any = useOutletContext();
  const setIsContentFullscreen = layoutContext?.setIsContentFullscreen;
  const isFullScreen = layoutContext?.isContentFullscreen;

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [month, year]);
  
  const monthNames = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    let startYear = 2024;
    const years = [];
    for (let y = startYear; y <= currentYear; y++) {
      years.push(y);
    }
    return years.length > 0 ? years : [2024];
  }, []);

  const isAnyDataFilled = useMemo(() => {
    if (!matrix || matrix.length === 0) return false;
    return matrix.some(row => {
        const details = row.details || {};
        // Only count as 'filled' if there are actual hours > 0
        return Object.values(details).some((d: any) => (d.hoursWorked || 0) > 0);
    });
  }, [matrix]);

  const loadStatus = async () => {
    try {
        const res = await hrApi.getAttendanceStatus(month + 1, year, companyId);
        setPeriodStatus(res.status);
        setIsLocked(res.status === 'APPROVED' || res.status === 'POSTED');
    } catch (e) {
        setPeriodStatus('NOT_FOUND');
        setIsLocked(false);
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await hrApi.getAttendanceMatrix(month + 1, year, companyId);
      setMatrix(data);
      const allApproved = data.length > 0 && data.every((r: any) => r.status === 'APPROVED');
      setIsLocked(allApproved);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLiveLogs = async () => {
    try {
        setIsLoading(true);
        const data = await hrApi.getAttendanceLogs(companyId);
        setLiveLogs(data);
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const loadMetadata = async () => {
    try {
      const [b, d, s] = await Promise.all([
        hrApi.getBranches(companyId),
        hrApi.getDepartments(companyId),
        hrApi.getShifts(companyId)
      ]);
      setBranches(b || []);
      setDepartments(d || []);
      setShifts(s || []);
    } catch (err) {
      console.error("Filter data load error:", err);
    }
  };

  useEffect(() => {
    loadStatus();
    loadData();
    loadMetadata();

    return () => {
      setIsContentFullscreen(false);
    };
  }, [month, year, companyId, viewMode]);

  const handleGenerate = async (fill: boolean = false) => {
    const isBulk = selectedRowIds.size > 0;
    const actionName = fill ? 'doldurulsun' : 'formalaşdırılsın';
    const targetIds = isBulk ? Array.from(selectedRowIds).map(id => matrix.find(r => r.id === id)?.employeeId).filter(Boolean) as string[] : [];

    if (!isBulk && !window.confirm(`${monthNames[month]} ${year} üçün tabel ${actionName}?`)) return;
    
    try {
      if (fill) setIsFilling(true); else setIsGenerating(true);
      await hrApi.generateAttendance(month + 1, year, companyId, fill, targetIds);
      await loadStatus(); 
      await loadData();
      if (isBulk) setSelectedRowIds(new Set());
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsGenerating(false);
      setIsFilling(false);
    }
  };

  const [isResetting, setIsResetting] = useState(false);
  const handleReset = async () => {
    const isBulk = selectedRowIds.size > 0;
    const targetIds = isBulk ? Array.from(selectedRowIds).map(id => matrix.find(r => r.id === id)?.employeeId).filter(Boolean) as string[] : [];

    if (!isBulk && !window.confirm(`${monthNames[month]} ${year} üçün tabel tamamilə TƏMİZLƏNSİN? Bütün məlumatlar silinəcək!`)) return;
    
    try {
      setIsResetting(true);
      await hrApi.resetAttendance(month + 1, year, companyId, targetIds);
      await loadStatus();
      await loadData();
      if (isBulk) setSelectedRowIds(new Set());
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleApproveRange = async (status: string) => {
    const isBulk = selectedRowIds.size > 0;
    
    let statusText = 'yenilənsin';
    if (status === 'APPROVED') statusText = 'təsdiqlənsin';
    else if (status === 'DRAFT') statusText = 'təsdiqi ləğv edilsin';
    else if (status === 'POSTED') statusText = 'KİLİDLƏNSİN';

    const targetAttendanceIds = isBulk ? Array.from(selectedRowIds) : [];
    
    if (!isBulk && !window.confirm(`Tabel ${statusText}?`)) return;
    
    try {
      setIsLoading(true);
      await hrApi.approveAttendance(
        month + 1, 
        year, 
        companyId, 
        status, 
        selectedBranchIds.length > 0 ? selectedBranchIds : undefined, 
        selectedDeptIds.length > 0 ? selectedDeptIds : undefined,
        targetAttendanceIds
      );
      await loadStatus();
      await loadData();
      if (isBulk) setSelectedRowIds(new Set());
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [isSavingAll, setIsSavingAll] = useState(false);
  const handleSaveAll = async () => {
    try {
      setIsSavingAll(true);
      const updates = matrix.flatMap(row => row.details.map(d => ({
        id: d.id,
        status: d.status,
        timeIn: d.timeIn,
        timeOut: d.timeOut,
        hoursWorked: d.hoursWorked
      })));
      
      await hrApi.batchUpdateAttendanceDetails(updates, companyId);
      await loadData();
      alert('Tabel məlumatları uğurla yadda saxlanıldı.');
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleUpdateDetail = async () => {
    if (!editingDay) return;
    if (Number(editHours) === 0 && editStatus === 'WORK') {
        alert('Saat 0 olduqda status "İşdə" ola bilməz. Zəhmət olmasa uyğun səbəbi seçin.');
        return;
    }
    try {
      setIsSavingCell(true);
      await hrApi.updateAttendanceDetail({
        detailId: editingDay.detail.id,
        status: editStatus,
        hoursWorked: Number(editHours),
        timeIn: editTimeIn || undefined,
        timeOut: editTimeOut || undefined
      }, companyId);
      await loadData();
      setShowEditModal(false);
      setEditingDay(null);
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsSavingCell(false);
    }
  };

  const handleHourChange = (val: string) => {
    setEditHours(val);
    if (!editingDay) return;
    const hours = Number(val);
    if (hours > 0) {
        setEditStatus('WORK');
        // Auto-calc times
        const emp = employeesMap.get(editingDay.detail.attendance?.employeeId || editingDay.rowId); // fallback
        const workShift = emp?.workShift;
        const startTime = workShift?.startTime || '09:00';
        setEditTimeIn(startTime);
        
        const [h, m] = startTime.split(':').map(Number);
        let endH = h + hours;
        if (hours > 5) endH += 1; // Auto lunch
        
        const endStr = `${String(endH % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        setEditTimeOut(endStr);
    } else {
        // if zero, clear times and let user pick status
        setEditTimeIn('');
        setEditTimeOut('');
    }
  };

  const filteredMatrix = useMemo(() => {
    return matrix.filter(row => {
      const matchesSearch = row.employee.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBranch = selectedBranchIds.length > 0 ? selectedBranchIds.includes(row.branchId || '') : true;
      const matchesDept = selectedDeptIds.length > 0 ? selectedDeptIds.includes(row.departmentId || '') : true;
      const matchesShift = selectedShiftIds.length > 0 ? selectedShiftIds.includes((row as any).workShiftId || '') : true;
      return matchesSearch && matchesBranch && matchesDept && matchesShift;
    });
  }, [matrix, searchTerm, selectedBranchIds, selectedDeptIds, selectedShiftIds]);

  const tableRef = useRef<HTMLTableElement>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (tableRef.current && filteredMatrix.length > 0 && viewMode === 'TABEL') {
        const bodyRow = tableRef.current.querySelector('tbody tr');
        if (bodyRow) {
          const cells = Array.from(bodyRow.children).slice(0, 4) as HTMLElement[];
          let cumulative = 0;
          cells.forEach((cell, idx) => {
            const width = cell.getBoundingClientRect().width;
            tableRef.current?.style.setProperty(`--col-${idx + 1}-w`, `${width}px`);
            tableRef.current?.style.setProperty(`--col-${idx + 1}-offset`, `${cumulative}px`);
            cumulative += width;
          });
        }
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [filteredMatrix, viewMode]);

  const filteredLiveLogs = useMemo(() => {
    return liveLogs.filter(log => {
        const matchesSearch = log.employee.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBranch = selectedBranchIds.length > 0 ? selectedBranchIds.includes(log.employee.branchId || '') : true;
        return matchesSearch && matchesBranch;
    });
  }, [liveLogs, searchTerm, selectedBranchIds]);

  const getStatusDisplay = (detail: any, employee: any) => {
    if (!detail) return { label: '-', bg: 'bg-slate-50', color: 'text-slate-300' };
    
    switch (detail.status) {
        case 'WORK': return { label: 'İŞ', bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600 dark:text-emerald-400' };
        case 'AO': return { label: 'AO', bg: 'bg-teal-50 dark:bg-teal-500/10', color: 'text-teal-600 dark:text-teal-400' };
        case 'X': return { label: 'X', bg: 'bg-rose-50 dark:bg-rose-500/10', color: 'text-rose-600 dark:text-rose-400' };
        case 'M1': return { label: 'M1', bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-600 dark:text-blue-400' };
        case 'M2': return { label: 'M2', bg: 'bg-cyan-50 dark:bg-cyan-500/10', color: 'text-cyan-600 dark:text-cyan-400' };
        case 'YM': return { label: 'YM', bg: 'bg-violet-50 dark:bg-violet-500/10', color: 'text-violet-600 dark:text-violet-400' };
        case 'TM': return { label: 'TM', bg: 'bg-orange-50 dark:bg-orange-500/10', color: 'text-orange-600 dark:text-orange-400' };
        case 'SM': return { label: 'SM', bg: 'bg-pink-50 dark:bg-pink-500/10', color: 'text-pink-600 dark:text-pink-400' };
        case 'ÖM': return { label: 'ÖM', bg: 'bg-slate-100 dark:bg-slate-800', color: 'text-slate-600 dark:text-slate-400' };
        case 'İ': return { label: 'İ', bg: 'bg-slate-50 dark:bg-slate-800/50', color: 'text-slate-400 dark:text-slate-500' };
        case 'B': return { label: 'B', bg: 'bg-rose-50 dark:bg-rose-500/10', color: 'text-rose-500 dark:text-rose-400' };
        case 'H': return { label: 'H', bg: 'bg-slate-900', color: 'text-white' };
        case 'E': return { label: 'E', bg: 'bg-indigo-50 dark:bg-indigo-500/10', color: 'text-indigo-600 dark:text-indigo-400' };
        case 'XV': return { label: 'XV', bg: 'bg-amber-50 dark:bg-amber-500/10', color: 'text-amber-600 dark:text-amber-400' };
        default: return { label: detail.status || '-', bg: 'bg-slate-100', color: 'text-slate-600' };
    }
  };

  return (
    <div className={`flex flex-col gap-6 p-6 transition-all duration-500 rounded-[2.5rem] ${isFullScreen ? 'bg-slate-50 overflow-auto h-screen' : ''}`}>
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden relative group bg-indigo-600 shadow-indigo-200`}>
              {viewMode === 'TABEL' ? <Calendar className="w-7 h-7 text-white" /> : <Clock className="w-7 h-7 text-white" />}
            </div>
            <div>
               <h1 className="text-[20px] font-black tracking-tight text-slate-800 uppercase italic leading-tight">Davamiyyət Jurnalı</h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className="flex p-0.5 bg-slate-100 rounded-lg">
                     <button 
                       onClick={() => setViewMode('TABEL')}
                       className={`px-3 py-1 rounded-md text-[9px] font-black uppercase italic transition-all ${viewMode === 'TABEL' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       Aylıq Tabel
                     </button>
                     <button 
                       onClick={() => setViewMode('LIVE')}
                       className={`px-3 py-1 rounded-md text-[9px] font-black uppercase italic transition-all ${viewMode === 'LIVE' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       Canlı Jurnal
                     </button>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                  <p className="text-[11px] font-black tracking-widest text-slate-400 uppercase italic">
                    {monthNames[month]} {year}
                  </p>
               </div>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group w-64 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="İşçi axtar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-slate-50 rounded-[1.5rem] py-3 pl-12 pr-6 text-[12px] font-black text-slate-800 shadow-sm focus:border-indigo-400 outline-none uppercase italic transition-all"
            />
          </div>

          <MultiSelect label="Filiallar" items={branches} selectedIds={selectedBranchIds} onChange={setSelectedBranchIds} />
          {viewMode === 'TABEL' && (
            <>
              <MultiSelect label="Şöbələr" items={departments} selectedIds={selectedDeptIds} onChange={setSelectedDeptIds} />
              <MultiSelect label="Qrafiklər" items={shifts} selectedIds={selectedShiftIds} onChange={setSelectedShiftIds} />
            </>
          )}

          <div className="flex items-center gap-2">
            <select 
              value={month}
              onChange={(e) => setCurrentDate(new Date(year, Number(e.target.value), 1))}
              className="bg-white border-2 border-slate-50 rounded-[1.5rem] py-2 px-4 shadow-sm text-[11px] font-black text-slate-800 uppercase italic outline-none cursor-pointer"
            >
              {monthNames.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
            <select 
              value={year}
              onChange={(e) => setCurrentDate(new Date(Number(e.target.value), month, 1))}
              className="bg-white border-2 border-slate-50 rounded-[1.5rem] py-2 px-4 shadow-sm text-[11px] font-black text-slate-800 italic outline-none cursor-pointer"
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2 bg-slate-900 border-2 border-slate-800 hover:bg-slate-800 text-white rounded-[1.5rem] py-2 px-6 shadow-xl shadow-slate-200 text-[11px] font-black uppercase italic transition-all"
          >
            <QrCode className="w-3 h-3" />
            QR Terminal
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS BAR (TABEL ONLY) */}
      {viewMode === 'TABEL' && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-10 py-6 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/30">
            <div className="flex flex-wrap items-center gap-4">
                {/* SEQUENTIAL ACTION FLOW */}
                {periodStatus === 'NOT_FOUND' && (
                    <button onClick={() => handleGenerate(false)} disabled={isGenerating} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] py-3.5 px-8 text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200">
                        <RotateCcw className="w-3.5 h-3.5" /> Formalaşdır
                    </button>
                )}

                {periodStatus === 'DRAFT' && (
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleGenerate(true)} disabled={isFilling} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] py-3.5 px-8 text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-100">
                            {isFilling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />} Doldur
                        </button>
                        <button onClick={handleSaveAll} disabled={isSavingAll} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] py-3.5 px-8 text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Yadda saxla
                        </button>
                        <button onClick={() => handleApproveRange('APPROVED')} disabled={isLoading} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] py-3.5 px-8 text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-100">
                            <ShieldCheck className="w-3.5 h-3.5" /> Təsdiq et
                        </button>
                        <div className="w-px h-8 bg-slate-200 mx-2 hidden lg:block" />
                        <button onClick={handleReset} disabled={isResetting} className="flex items-center gap-2 bg-white border-2 border-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-[1.5rem] py-3 px-6 text-[11px] font-black uppercase tracking-widest transition-all">
                            <Trash2 className="w-3.5 h-3.5" /> Təmizlə
                        </button>
                    </div>
                )}

                {periodStatus === 'APPROVED' && (
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleApproveRange('POSTED')} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] py-3.5 px-10 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-slate-300">
                            <Lock className="w-3.5 h-3.5 text-emerald-400" /> Kilidlə
                        </button>
                        <button onClick={() => handleApproveRange('DRAFT')} className="flex items-center gap-2 bg-white border-2 border-rose-100 hover:bg-rose-50 text-rose-600 rounded-[1.5rem] py-3.5 px-8 text-[11px] font-black uppercase tracking-widest transition-all">
                            <RotateCcw className="w-3.5 h-3.5" /> Təsdiqi ləğv et
                        </button>
                    </div>
                )}

                {periodStatus === 'POSTED' && (
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-4 bg-emerald-50/50 border border-emerald-100 px-8 py-3.5 rounded-[1.5rem]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="text-[11px] font-black text-emerald-900 uppercase tracking-widest leading-none">Tabel Kilidlənib</h4>
                            </div>
                        </div>
                        <button onClick={() => handleApproveRange('APPROVED')} className="flex items-center gap-2 bg-white border-2 border-indigo-100 hover:bg-indigo-50 text-indigo-600 rounded-[1.5rem] py-3.5 px-8 text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
                            <Unlock className="w-3.5 h-3.5" /> Kilidi aç (Unlock)
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-20">
        {isLoading ? (
          <div className="p-32 flex flex-col items-center justify-center">
             <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
             <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Yüklənir...</p>
          </div>
        ) : viewMode === 'TABEL' ? (
          filteredMatrix.length > 0 ? (
            <div className="relative overflow-x-auto">
               <table ref={tableRef} className="w-full border-collapse table-auto">
                 <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100/50">
                        <th rowSpan={2} className="sticky left-0 z-40 bg-slate-50 px-4 py-5 border-r border-slate-100">
                            <input type="checkbox" onChange={(e) => e.target.checked ? setSelectedRowIds(new Set(filteredMatrix.map(r => r.id))) : setSelectedRowIds(new Set())} checked={selectedRowIds.size === filteredMatrix.length} />
                        </th>
                        <th rowSpan={2} className="sticky left-[var(--col-2-offset,48px)] z-40 bg-slate-50 px-6 py-5 text-left text-[9px] font-black text-slate-500 uppercase italic border-r border-slate-100">İşçi / FİN</th>
                        <th rowSpan={2} className="sticky left-[var(--col-3-offset,348px)] z-40 bg-slate-50 px-6 py-5 text-left text-[9px] font-black text-slate-500 uppercase italic border-r border-slate-100">Şöbə / Vəzifə</th>
                        <th rowSpan={2} className="sticky left-[var(--col-4-offset,588px)] z-40 bg-slate-50 px-4 py-5 text-center border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-[9px] font-black text-slate-500 uppercase italic">İş yeri</th>
                        {Array.from({ length: daysInMonth }).map((_, i) => (
                            <th key={i} className={`px-3 py-2 text-center text-[8px] font-black border-r border-slate-100 min-w-[50px] ${new Date(year, month, i+1).getDay() === 0 ? 'text-rose-500 bg-rose-50/30' : 'text-slate-400'}`}>
                                {["B", "BE", "ÇA", "Ç", "CA", "C", "Ş"][new Date(year, month, i+1).getDay()]}
                            </th>
                        ))}
                        <th rowSpan={2} className="sticky right-[70px] z-40 bg-slate-50 px-4 py-5 border-l border-slate-100 text-[9px] uppercase italic w-[70px]">Norma</th>
                        <th rowSpan={2} className="sticky right-0 z-40 bg-indigo-50 px-4 py-5 border-l border-indigo-100 text-[9px] uppercase italic text-indigo-600 w-[70px]">Faktiki</th>
                    </tr>
                    <tr className="bg-white border-b border-slate-100">
                        {Array.from({ length: daysInMonth }).map((_, i) => (
                            <th key={i} className="px-3 py-2 text-center text-[10px] font-black border-r border-slate-100">{i+1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredMatrix.map(row => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors group text-[10px]">
                            <td className="sticky left-0 z-30 bg-white group-hover:bg-slate-50 px-4 py-4 text-center border-r border-slate-100 whitespace-nowrap">
                                <input type="checkbox" onChange={(e) => { const n = new Set(selectedRowIds); e.target.checked ? n.add(row.id) : n.delete(row.id); setSelectedRowIds(n); }} checked={selectedRowIds.has(row.id)} />
                            </td>
                            <td className="sticky left-[var(--col-2-offset,48px)] z-30 bg-white group-hover:bg-slate-50 px-6 py-4 border-r border-slate-100 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-slate-800 uppercase italic">{row.employee.fullName}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase italic leading-none">{row.employee.code || '---'}</span>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span className="text-[8px] font-black text-indigo-500 uppercase italic">{row.employee.fin || '---'}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="sticky left-[var(--col-3-offset,348px)] z-30 bg-white group-hover:bg-slate-50 px-6 py-4 border-r border-slate-100 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-600 uppercase italic">{row.employee.department?.name || row.employee.dept || 'Ümumi Şöbə'}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{row.employee.jobPosition?.name || row.employee.position || 'İşçi'}</span>
                                </div>
                            </td>
                            <td className="sticky left-[var(--col-4-offset,588px)] z-30 bg-white group-hover:bg-slate-50 px-4 py-4 border-r border-slate-100 text-center shadow-[2px_0_5px_rgba(0,0,0,0.05)] whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${row.employee.workplaceType === 'ƏLAVƏ' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    {row.employee.workplaceType || 'ƏSAS'}
                                </span>
                            </td>
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const d = row.details.find(det => det.day === i+1);
                                const disp = getStatusDisplay(d, row.employee);
                                return (
                                    <td 
                                      key={i} 
                                      className={`px-1 py-1 text-center border-r border-slate-50 cursor-pointer transition-all relative ${d?.isManual ? 'ring-inset ring-1 ring-amber-300' : ''}`}
                                      onClick={() => {
                                        if (isLocked || !d) return;
                                        setEditingDay({ rowId: row.id, employeeName: row.employee.fullName, detail: d });
                                        setEditStatus(d.status);
                                        setEditHours(String(d.hoursWorked || '0'));
                                        setEditTimeIn(d.timeIn || '');
                                        setEditTimeOut(d.timeOut || '');
                                        setShowEditModal(true);
                                      }}
                                    >
                                        <div className={`w-10 py-1 mx-auto rounded-xl flex flex-col items-center justify-center transition-all ${isLocked ? 'grayscale-[0.5]' : 'hover:shadow-lg hover:scale-105 shadow-sm'} ${disp.bg} border border-slate-200/60 dark:border-slate-700/60 relative overflow-hidden`}>
                                          <span className={`text-[8px] font-black uppercase tracking-wider ${disp.color} italic leading-none my-1`}>
                                            {disp.label}
                                          </span>
                                          <div className="w-full h-[1px] bg-slate-200/80 dark:bg-slate-700/80"></div>
                                          <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 tabular-nums italic leading-none my-1.5">
                                            {['WORK', 'E', 'İ', 'B'].includes(d?.status || '') ? (d?.hoursWorked || 0) : '0'}
                                          </span>
                                        </div>
                                        {d?.isManual && (
                                           <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm border border-white" />
                                        )}
                                    </td>
                                );
                            })}
                            <td className="sticky right-[70px] z-40 bg-slate-50 text-center font-black w-[70px]">{row.monthlyNorm || 0}</td>
                            <td className="sticky right-0 z-40 bg-indigo-50 text-center font-black text-indigo-600 text-[11px] w-[70px]">{row.details.reduce((s,d)=>s+(d.hoursWorked||0),0).toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-32 flex flex-col items-center justify-center">
                <p className="text-[11px] font-black text-slate-400 uppercase italic">Məlumat Tapılmadı</p>
            </div>
          )
        ) : (
          /* LIVE JOURNAL VIEW */
          <div className="relative overflow-x-auto">
            <table className="w-full border-collapse">
               <thead>
                 <tr className="bg-slate-50/80 border-b border-slate-100/50">
                    <th className="px-6 py-5 text-left text-[9px] font-black text-slate-500 uppercase italic">İşçi</th>
                    <th className="px-6 py-5 text-center text-[9px] font-black text-slate-500 uppercase italic">Hərəkət</th>
                    <th className="px-6 py-5 text-center text-[9px] font-black text-slate-500 uppercase italic">Vaxt (Baku)</th>
                    <th className="px-6 py-5 text-center text-[9px] font-black text-slate-500 uppercase italic">Face ID</th>
                    <th className="px-6 py-5 text-center text-[9px] font-black text-slate-500 uppercase italic">Tip</th>
                    <th className="px-6 py-5 text-center text-[9px] font-black text-slate-500 uppercase italic">Məkan Statusu</th>
                    <th className="px-6 py-5 text-center text-[9px] font-black text-slate-500 uppercase italic">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {filteredLiveLogs.length > 0 ? filteredLiveLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-5 text-[11px] font-black uppercase italic text-slate-800">{log.employee.fullName}</td>
                       <td className="px-6 py-5 text-center text-[10px] font-black text-indigo-600">{log.movementType}</td>
                       <td className="px-6 py-5 text-center text-[10px] font-black text-slate-500 italic">{log.datetimeBaku}</td>
                       <td className="px-6 py-5 text-center">
                           <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase italic ${log.faceVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {log.faceVerified ? 'Uğurlu' : 'Xəta'}
                           </span>
                       </td>
                       <td className="px-6 py-5 text-center px-2 py-1 rounded-lg text-[8px] font-black italic">
                             {log.qrType}
                       </td>
                       <td className="px-6 py-5 text-center">
                          <p className={`text-[9px] font-black italic ${log.isLocationValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                             {log.isLocationValid ? 'Məqbul' : 'Uzaq'} {log.distanceFromBranch ? `(${Number(log.distanceFromBranch).toFixed(1)}km)` : ''}
                          </p>
                       </td>
                       <td className="px-6 py-5 text-center">
                          {log.isLocationValid && log.faceVerified ? (
                             <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : (
                             <AlertTriangle className="w-4 h-4 text-rose-500 mx-auto" />
                          )}
                       </td>
                    </tr>
                 )) : (
                    <tr><td colSpan={7} className="p-32 text-center text-slate-400 font-black uppercase italic">Hələ qeyd yoxdur.</td></tr>
                 )}
               </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR MODAL */}
      {showQR && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-lg relative animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setShowQR(false)} 
                className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
              
              <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
                 <div className="p-10">
                    <QRGenerator companyId={companyId} />
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingDay && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-[400px] relative animate-in zoom-in-95 duration-300">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                 <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                       <div>
                          <h3 className="text-[14px] font-black text-slate-800 uppercase italic">Günü Redaktə Et</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-1">{editingDay.employeeName}</p>
                          <p className="text-[9px] font-bold text-indigo-500 uppercase italic">{editingDay.detail.day} {monthNames[month]} {year}</p>
                       </div>
                       <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                          <X className="w-5 h-5" />
                       </button>
                    </div>

                    <div className="space-y-5">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase italic mb-2 block">Səbəb / Status</label>
                          <select 
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full h-11 bg-slate-50 border-2 border-slate-50 rounded-xl px-4 text-[11px] font-black text-slate-800 outline-none focus:border-indigo-400 transition-all uppercase italic"
                          >
                              <option value="WORK">İş Günü</option>
                              <option value="AO">Ayın ortası işə qəbul</option>
                              <option value="X">Əmək müqaviləsinə xitam</option>
                              <option value="M1">Ödənişli əsas məzuniyyət</option>
                              <option value="M2">Ödənişli əlavə məzuniyyət</option>
                              <option value="YM">Yaradıcılıq məzuniyyəti</option>
                              <option value="TM">Təhsil Məzuniyyəti</option>
                              <option value="SM">Sosial Məzuniyyət</option>
                              <option value="ÖM">Ödənişsiz məzuniyyət</option>
                              <option value="İ">İstirahət Günü</option>
                              <option value="B">Bayram Günü</option>
                              <option value="H">Hüzn Günü</option>
                              <option value="E">Ezamiyyə Günü</option>
                              <option value="XV">İşçinin xəstə olması</option>
                          </select>
                       </div>

                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase italic mb-2 block">İş Saatı</label>
                          <input 
                            type="number"
                            step="0.5"
                            value={editHours}
                            onChange={(e) => handleHourChange(e.target.value)}
                            placeholder="Məs: 8"
                            className="w-full h-11 bg-slate-50 border-2 border-slate-50 rounded-xl px-4 text-[11px] font-black text-slate-800 outline-none focus:border-indigo-400 transition-all uppercase italic"
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase italic mb-2 block">Giriş Vaxtı</label>
                             <input 
                               type="time"
                               value={editTimeIn}
                               onChange={(e) => setEditTimeIn(e.target.value)}
                               className="w-full h-11 bg-slate-50 border-2 border-slate-50 rounded-xl px-4 text-[11px] font-black text-slate-800 outline-none focus:border-indigo-400 transition-all uppercase italic"
                             />
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase italic mb-2 block">Çıxış Vaxtı</label>
                             <input 
                               type="time"
                               value={editTimeOut}
                               onChange={(e) => setEditTimeOut(e.target.value)}
                               className="w-full h-11 bg-slate-50 border-2 border-slate-50 rounded-xl px-4 text-[11px] font-black text-slate-800 outline-none focus:border-indigo-400 transition-all uppercase italic"
                             />
                          </div>
                       </div>

                       <div className="flex gap-3 pt-3">
                          <button 
                            onClick={() => setShowEditModal(false)}
                            className="flex-1 h-11 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase italic hover:bg-slate-200 transition-all"
                          >
                             İmtina
                          </button>
                          <button 
                            onClick={handleUpdateDetail}
                            disabled={isSavingCell}
                            className="flex-[1.5] h-11 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase italic hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                          >
                             {isSavingCell ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                             Yadda Saxla
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceLogs;
