import { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, 
  FileText, Calendar, 
  User,
  Filter,
  Download,
  Edit,
  Eye,
  MoreVertical,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  GripVertical,
  Trash2,
  RefreshCw, X, Save,
  Settings,
  ArrowUp,
  ArrowDown,
  Lock,
  Maximize2,
  Minimize2,
  Upload, FileUp, FileSpreadsheet,
  QrCode
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { hrApi, financeApi, companyApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const HiringOrderList = () => {
  const navigate = useNavigate();
  const { 
    isContentFullscreen, 
    setIsContentFullscreen, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    setFilterSidebarContent
  } = useOutletContext<any>();
  const { activeCompany } = useCompany();
  const { formatDate, formatCurrency, formatNumber } = useFormat();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [allDepartments, setAllDepartments] = useState<any[]>([]);
  const [allShifts, setAllShifts] = useState<any[]>([]);
  const [allPositions, setAllPositions] = useState<any[]>([]);
  const [allAccounts, setAllAccounts] = useState<any[]>([]);
  const [allBranches, setAllBranches] = useState<any[]>([]);

  // SELECTION & PAGINATION STATES
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [enrollmentOrder, setEnrollmentOrder] = useState<any>(null);
  
  // BULK ACCOUNT EDIT STATES
  const [isBulkAccountModalOpen, setIsBulkAccountModalOpen] = useState(false);
  const [bulkPayableAccountId, setBulkPayableAccountId] = useState('');
  const [bulkAdvanceAccountId, setBulkAdvanceAccountId] = useState('');
  const [isUpdatingAccounts, setIsUpdatingAccounts] = useState(false);

  // COLUMN CONFIGURATION & PERSISTENCE
  interface ColumnConfig {
    id: string;
    label: string;
    isVisible: boolean;
    isStickyLeft: boolean;
    isStickyRight: boolean;
    width: number;
  }

  const DEFAULT_COLUMNS: ColumnConfig[] = [
    { id: 'selection', label: 'Seçim', isVisible: true, isStickyLeft: true, isStickyRight: false, width: 60 },
    { id: 'doc_info', label: 'Əmr No / Tarix', isVisible: true, isStickyLeft: true, isStickyRight: false, width: 220 },
    { id: 'fullName_fin', label: 'İşçinin Adı / FİN', isVisible: true, isStickyLeft: true, isStickyRight: false, width: 280 },
    { id: 'branch', label: 'Filial', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 150 },
    { id: 'dept_pos', label: 'Şöbə / Vəzifə', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 220 },
    { id: 'education', label: 'Təhsili', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 120 },
    { id: 'citizenship', label: 'Vətəndaşlıq', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 140 },
    { id: 'gender', label: 'Cinsi', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 90 },
    { id: 'schedule_type', label: 'İş Rejimi / Növü', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 200 },
    { id: 'sector', label: 'Kadr Növü', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 120 },
    { id: 'contractType', label: 'Müqavilə', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 120 },
    { id: 'vacationDays', label: 'Cəmi Məzuniyyət', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 120 },
    { id: 'startDate', label: 'İşə Başlama', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 140 },
    { id: 'signingDate', label: 'Bağlanma Tar.', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 140 },
    { id: 'terminationDate', label: 'Xitam Tarixi', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 140 },
    { id: 'endDate', label: 'Bitmə Tar.', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 140 },
    { id: 'salary', label: 'Maaş', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 150 },
    { id: 'status', label: 'Status', isVisible: true, isStickyLeft: false, isStickyRight: true, width: 120 },
    { id: 'actions', label: 'Əməliyyat', isVisible: true, isStickyLeft: false, isStickyRight: true, width: 160 },
  ];

  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem('hiring_registry_columns_v7');
    if (!saved) return DEFAULT_COLUMNS;
    
    try {
      const savedCols: ColumnConfig[] = JSON.parse(saved);
      
      // Automatic migration: 
      // 1. Filter out columns that are NO LONGER in DEFAULT_COLUMNS (like old docNumber/docDate)
      // 2. Add columns from DEFAULT_COLUMNS that are NOT in savedCols (like new doc_info)
      const filteredSaved = savedCols.filter(sc => DEFAULT_COLUMNS.some(dc => dc.id === sc.id));
      const newCols = [...filteredSaved];
      
      DEFAULT_COLUMNS.forEach(defaultCol => {
        if (!newCols.some(c => c.id === defaultCol.id)) {
            newCols.push(defaultCol);
        }
      });
      return newCols;
    } catch (e) {
      return DEFAULT_COLUMNS;
    }
  });

  useEffect(() => {
    localStorage.setItem('hiring_registry_columns_v7', JSON.stringify(columnConfigs));
  }, [columnConfigs]);

  const activeColumns = columnConfigs.filter(c => c.isVisible);

  // STICKY OFFSET CALCULATIONS
  const getStickyLeftOffset = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      if (activeColumns[i].isStickyLeft) {
        offset += activeColumns[i].width;
      }
    }
    return offset;
  };

  const getStickyRightOffset = (index: number) => {
    let offset = 0;
    for (let i = activeColumns.length - 1; i > index; i--) {
      if (activeColumns[i].isStickyRight) {
        offset += activeColumns[i].width;
      }
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
    setDraggedIndex(null);
    setDragOverIndex(null);
  };


  const [fieldFilters, setFieldFilters] = useState({
    department: '',
    position: '',
    startDate: '',
    endDate: '',
    minSalary: '',
    maxSalary: '',
    salaryBasis: 'NET',
    gender: '',
    education: '',
    workplaceType: '',
    workSchedule: '',
    staffType: '',
    contractType: '',
    citizenship: '',
    branchId: '',
    startWorkDate: '',
    terminationDate: ''
  });

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
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cinsi</label>
                  <select 
                    value={fieldFilters.gender}
                    onChange={(e) => setFieldFilters({...fieldFilters, gender: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[11px] font-bold uppercase transition-all"
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
                    <option value="INDEFINITE">MÜDDƏTSİZ</option>
                    <option value="FIXED">MÜDDƏTLİ</option>
                  </select>
              </div>
            </div>
          </div>

          <button 
             onClick={resetFilters}
             className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
          >
             Filtrləri Sıfırla
          </button>
        </div>
      );
    }
  }, [isFilterSidebarOpen, fieldFilters, allDepartments, allPositions, allBranches]);

  const fetchOrders = async () => {
    if (!activeCompany) return;
    try {
      setIsLoading(true);
      const ensureArray = (res: any) => Array.isArray(res) ? res : (res?.data || []);

      const ordersRes = await hrApi.getHiringOrders(activeCompany.id);
      setOrders(ensureArray(ordersRes));
      
      const deptsRes = await hrApi.getDepartments(activeCompany.id);
      setAllDepartments(ensureArray(deptsRes));

      const shiftsRes = await hrApi.getShifts(activeCompany.id);
      setAllShifts(ensureArray(shiftsRes));

      const positionsRes = await hrApi.getPositions(activeCompany.id);
      setAllPositions(ensureArray(positionsRes));

      const accountsRes = await financeApi.getAccounts(activeCompany.id);
      setAllAccounts(ensureArray(accountsRes));

      const branchesRes = await companyApi.getBranches(activeCompany.id);
      setAllBranches(ensureArray(branchesRes));
    } catch (error) {
      console.error('FETCH_ORDERS_ERROR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeCompany]);

  const handleDelete = async (id: string, docNum: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`${docNum} nömrəli əmri və əlaqəli işçini silmək istədiyinizə əminsiniz?`)) return;

    setIsDeleting(true);
    try {
      if (!activeCompany) return;
      await hrApi.deleteHiringOrder(id, activeCompany.id);
      const newSelected = new Set(selectedIds);
      newSelected.delete(id);
      setSelectedIds(newSelected);
      fetchOrders();
    } catch (error) {
      alert("Silmə zamanı xəta baş verdi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Seçilmiş ${selectedIds.size} əmri və əlaqəli işçiləri silmək istədiyinizə əminsiniz?`)) return;

    setIsDeleting(true);
    try {
      if (!activeCompany) return;
      await hrApi.bulkDeleteHiringOrders(Array.from(selectedIds), activeCompany.id);
      setSelectedIds(new Set());
      fetchOrders();
    } catch (error) {
      alert("Toplu silmə zamanı xəta baş verdi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkAccountUpdate = async () => {
    if (!bulkPayableAccountId && !bulkAdvanceAccountId) {
      alert("Hər iki hesabı boş qoya bilməzsiniz.");
      return;
    }

    setIsUpdatingAccounts(true);
    try {
      if (!activeCompany) return;
      await hrApi.bulkUpdateHiringOrderAccounts({
        ids: Array.from(selectedIds),
        payableAccountId: bulkPayableAccountId || null,
        advanceAccountId: bulkAdvanceAccountId || null
      }, activeCompany.id);

      alert("Müxabirləşmə hesabları uğurla yeniləndi.");
      setIsBulkAccountModalOpen(false);
      setSelectedIds(new Set());
      fetchOrders();
    } catch (error: any) {
      alert(`Toplu yeniləmə zamanı xəta baş verdi: ${error.message || ""}`);
    } finally {
      setIsUpdatingAccounts(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = (searchTerm || '').toLowerCase();
    const docNumLower = (order.docNumber || '').toLowerCase();
    const fullNameLower = (order.employee?.fullName || '').toLowerCase();
    
    const matchesSearch = docNumLower.includes(searchLower) || fullNameLower.includes(searchLower);
    if (!matchesSearch) return false;

    if (fieldFilters.department && order.department !== fieldFilters.department) return false;
    if (fieldFilters.position && !(order.position || '').toLowerCase().includes(fieldFilters.position.toLowerCase())) return false;
    
    if (fieldFilters.startDate && (order.docDate || '').split('T')[0] < fieldFilters.startDate) return false;
    if (fieldFilters.endDate && (order.docDate || '').split('T')[0] > fieldFilters.endDate) return false;
    
    const salaryToCompare = fieldFilters.salaryBasis === 'GROSS' 
      ? Number(order.salaryGross || 0) 
      : Number(order.salary || 0);
    
    if (fieldFilters.minSalary && salaryToCompare < Number(fieldFilters.minSalary)) return false;
    if (fieldFilters.maxSalary && salaryToCompare > Number(fieldFilters.maxSalary)) return false;

    if (fieldFilters.gender && order.employee?.gender !== fieldFilters.gender) return false;
    if (fieldFilters.education && (order.employee?.education || order.education) !== fieldFilters.education) return false;
    if (fieldFilters.workplaceType && order.workplaceType !== fieldFilters.workplaceType) return false;
    if (fieldFilters.workSchedule && order.workSchedule !== fieldFilters.workSchedule) return false;
    if (fieldFilters.contractType && order.contractTerm !== fieldFilters.contractType) return false;
    if (fieldFilters.staffType && order.sector !== fieldFilters.staffType) return false;
    if (fieldFilters.citizenship && order.employee?.citizenship !== fieldFilters.citizenship) return false;
    if (fieldFilters.branchId && order.branchId !== fieldFilters.branchId) return false;
    
    if (fieldFilters.startWorkDate && (order.startDate || '').split('T')[0] < fieldFilters.startWorkDate) return false;
    if (fieldFilters.terminationDate && order.endDate && (order.endDate || '').split('T')[0] < fieldFilters.terminationDate) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentItems = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === currentItems.length && currentItems.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentItems.map(o => o.id)));
    }
  };



  const resetFilters = () => {
    setFieldFilters({
      department: '',
      position: '',
      startDate: '',
      endDate: '',
      minSalary: '',
      maxSalary: '',
      salaryBasis: 'NET',
      gender: '',
      education: '',
      workplaceType: '',
      workSchedule: '',
      staffType: '',
      contractType: '',
      citizenship: '',
      branchId: '',
      startWorkDate: '',
      terminationDate: ''
    });
    setSearchTerm('');
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('İşə Qəbul Şablonu');

    const headerRow = worksheet.addRow([
      "SƏNƏD NO", "Sənəd TARİXİ", "İşçinin Adı, Soyadı, Atasının Adı", "FİN Kod", "Vəsiqə Seriyası və Nömrəsi", 
      "Vətəndaşlıq", "Cinsi", "Doğum Tarixi", "Təhsili", "Müharibə İştirakçısı", "Telefon Nömrəsi", "E-poçt ünvanı", "Yaşadığı Ünvan", 
      "Müqavilə Nömrəsi", "Əmr Nömrəsi", "Müqavilə Növü", "Müqavilənin Bağlanma Tarixi", "Müqavilənin Bitmə Tarixi", 
      "İşçinin İşə Başlama Tarixi", "Sınaq Müddəti (Ay)", "Əvvəlki İş Stajı (İl)", "Əvvəlki İş Stajı (Ay)",
      "İş Yeri Növü", "Kadr Növü", "Şöbə / Struktur Bölmə", "Vəzifə / Peşə", "İş Rejimi / Qrafik", "Sektor", 
      "Hesablar Planı Kodu Borc", "Hesablar Planı Kodu Avans", "Gross Məbləğ"
    ]);

    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF1F5' } };
      cell.font = { bold: true, size: 9, color: { argb: 'FF1E293B' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { bottom: { style: 'medium', color: { argb: 'FFCBD5E1' } } };
    });

    worksheet.columns = headerRow.values ? (headerRow.values as any).slice(1).map(() => ({ width: 25 })) : [];

    const deptList = allDepartments.map(d => d.name).filter(Boolean);
    const shiftList = allShifts.map(s => `${s.name} (${s.startTime}-${s.endTime})`).filter(Boolean);
    
    const dropdowns = [
      { col: 6, formula: ['"Azərbaycan,Xarici"'] },
      { col: 7, formula: ['"Kişi,Qadın"'] },
      { col: 9, formula: ['"ALİ,ORTA,MAGİSTR,DOKTORANTURA,PEŞƏ-İXTİSAS,ORTA İXTİSAS"'] },
      { col: 10, formula: ['"Bəli,Xeyr"'] },
      { col: 16, formula: ['"MÜDDƏTLİ,MÜDDƏTSİZ"'] },
      { col: 23, formula: ['"ƏSAS,ƏLAVƏ"'] },
      { col: 24, formula: ['"IXTİSASLI,IXTİSASSIZ"'] },
      { col: 25, formula: dropdowns_formula(deptList) },
      { col: 27, formula: dropdowns_formula(shiftList) },
      { col: 28, formula: ['"ÖZƏL,DÖVLƏT / NEFT"'] },
    ];

    function dropdowns_formula(list: string[]) {
        if (list.length === 0) return ['""'];
        return [`"${list.join(',')}"`];
    }

    for (let i = 2; i <= 101; i++) {
        dropdowns.forEach(dd => {
            worksheet.getCell(i, dd.col).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: dd.formula as any
            };
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Ise_Qebul_Sablonu_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const formatDateValue = (val: any): string => {
    if (!val) return "";
    if (val instanceof Date) {
        const dObj = new Date(val.getTime() + (12 * 60 * 60 * 1000));
        const y = dObj.getFullYear();
        const m = String(dObj.getMonth() + 1).padStart(2, '0');
        const d = String(dObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    
    const s = String(val).trim();
    if (!s) return "";

    const standardMatch = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    if (standardMatch) {
        const day = standardMatch[1]?.padStart(2, '0');
        const month = standardMatch[2]?.padStart(2, '0');
        const year = standardMatch[3];
        return `${year}-${month}-${day}`;
    }

    return s;
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 0 });
        if (jsonData.length === 0) {
            alert("Faylda məlumat tapılmadı.");
            return;
        }
        processImportedData(jsonData);
      } catch (err) {
        console.error("EXCEL_IMPORT_ERROR:", err);
        alert("Fayl oxunarkən xəta baş verdi.");
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processImportedData = async (rows: any[]) => {
    if (!activeCompany) return;
    
    if (!Array.isArray(allAccounts) || !Array.isArray(allShifts)) {
        alert("Sistem xətası: Hesablar və ya İş Rejimləri siyahısı yüklənməyib. Zəhmət olmasa səhifəni yeniləyin.");
        return;
    }

    if (!window.confirm(`${rows.length} sətri yükləmək istədiyinizə əminsiniz? İşçilər dərhal bazaya qeyd ediləcək.`)) return;

    setIsImporting(true);
    setImportProgress({ current: 0, total: rows.length });

    const norm = (s: any) => 
        String(s || '')
            .toLowerCase()
            .replace(/[əeıioöuü]/g, '')
            .replace(/[^a-z0-9]/g, '')
            .trim();
    
    const getVal = (row: any, colName: string) => {
        const target = norm(colName);
        if (!target) return "";
        const foundKey = Object.keys(row).find(k => {
            const kNorm = norm(k);
            return kNorm === target;
        });
        return foundKey ? row[foundKey] : "";
    };

    const match = (val: any, keywords: string[]) => {
        const s = norm(val);
        return keywords.some(k => {
            const kn = norm(k);
            return s.includes(kn) || kn.includes(s);
        });
    };

    let successCount = 0;
    let errorCount = 0;
    let firstErrorDetail = "";

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        setImportProgress(prev => ({ ...prev, current: i + 1 }));

        try {
            const data: any = {
                companyId: activeCompany.id,
                docNumber: String(getVal(row, "Sənəd NO") || "").trim(),
                docDate: formatDateValue(getVal(row, "Sənəd TARİXİ")),
                employeeName: String(getVal(row, "İşçinin Adı, Soyadı, Atasının Adı")).trim(),
                citizenship: String(getVal(row, "Vətəndaşlıq") || "").trim(),
                gender: String(getVal(row, "Cinsi") || "").trim(),
                birthDate: formatDateValue(getVal(row, "Doğum Tarixi")),
                education: String(getVal(row, "Təhsili") || "").trim(),
                fin: String(getVal(row, "FİN Kod")).trim(),
                idSerial: String(getVal(row, "Vəsiqə Seriyası və Nömrəsi")).trim(),
                isWarParticipant: match(getVal(row, "Müharibə İştirakçısı"), ["bel", "yes", "he"]),
                previousExperienceYears: Number(getVal(row, "Əvvəlki İş Stajı (İl)")) || 0,
                previousExperienceMonths: Number(getVal(row, "Əvvəlki İş Stajı (Ay)")) || 0,
                payableAccountId: allAccounts.find(a => String(a.code) === String(getVal(row, "Hesablar Planı Kodu Borc")).trim())?.id || null,
                advanceAccountId: allAccounts.find(a => String(a.code) === String(getVal(row, "Hesablar Planı Kodu Avans")).trim())?.id || null,
                phone: String(getVal(row, "Telefon Nömrəsi")).trim(),
                email: String(getVal(row, "E-poçt ünvanı")).trim(),
                address: String(getVal(row, "Yaşadığı Ünvan")).trim(),
                contractNumber: String(getVal(row, "Müqavilə Nömrəsi") || getVal(row, "Sənəd NO") || "").trim(),
                orderNumber: String(getVal(row, "Əmr Nömrəsi")).trim(),
                contractTerm: String(getVal(row, "Müqavilə Növü") || "Müddətsiz").trim(),
                signingDate: formatDateValue(getVal(row, "Müqavilənin Bağlanma Tarixi") || getVal(row, "Sənəd TARİXİ")),
                endDate: formatDateValue(getVal(row, "Müqavilənin Bitmə Tarixi")),
                startDate: formatDateValue(getVal(row, "İşçinin İşə Başlama Tarixi") || getVal(row, "Sənəd TARİXİ")),
                probationMonths: getVal(row, "Sınaq Müddəti (Ay)") ? Number(getVal(row, "Sınaq Müddəti (Ay)")) : 0,
                workplaceType: String(getVal(row, "İş Yeri Növü") || "Əsas").trim(),
                isSpecialized: !match(getVal(row, "Kadr Növü"), ["ixtisassiz"]),
                department: String(getVal(row, "Şöbə / Struktur Bölmə")).trim(),
                position: String(getVal(row, "Vəzifə / Peşə")).trim(),
                workSchedule: String(getVal(row, "İş Rejimi / Qrafik")).trim(),
                workShiftId: allShifts.find(s => {
                    const excelVal = norm(getVal(row, "İş Rejimi / Qrafik"));
                    const shiftName = norm(s.name);
                    const shiftFull = norm(`${s.name} (${s.startTime}-${s.endTime})`);
                    return excelVal === shiftName || excelVal === shiftFull;
                })?.id || null,
                sector: String(getVal(row, "Sektor") || "Özəl").trim(),
                salaryGross: Number(getVal(row, "Gross Məbləğ")) || 0,
                salary: Number(getVal(row, "Gross Məbləğ")) || 0, 
                salaryType: "GROSS"
            };

            const res = await hrApi.hireEmployee(data, activeCompany.id);
            if (res && res.action === 'SKIPPED_DUPLICATE') {
                successCount++;
            } else {
                successCount++;
            }
        } catch (err: any) {
            console.error(`IMPORT_ERROR_ROW_${i+1}:`, err);
            const detail = err.data?.details || err.data?.error || err.message;
            if (!firstErrorDetail) firstErrorDetail = detail;
            errorCount++;
        }
    }

    setIsImporting(false);
    fetchOrders(); 
    
    if (errorCount > 0) {
        alert(`Yükləmə tamamlanmadı: ${successCount} uğurlu, ${errorCount} xəta.\nİlk xəta: ${firstErrorDetail}`);
    } else {
        alert(`${successCount} işçi uğurla əlavə edildi.`);
    }
  };

  const handleExportExcel = () => {
    const dataToExport = selectedIds.size > 0 
      ? orders.filter(o => selectedIds.has(o.id))
      : orders;

    const worksheetData = dataToExport.map(o => ({
      'Əmr No': o.docNumber,
      'Əmr Tarixi': o.docDate?.split('T')[0],
      'İşçi Ad Soyad': o.employee?.fullName,
      'FIN': o.employee?.fin,
      'Seriya No': o.employee?.idSerial,
      'Müharibə İştirakçısı': o.employee?.isWarParticipant ? 'Bəli' : 'Xeyr',
      'Borc Hesab Kodu': allAccounts.find(a => a.id === o.payableAccountId)?.code || '',
      'Avans Hesab Kodu': allAccounts.find(a => a.id === o.advanceAccountId)?.code || '',
      'Staj (İl)': o.previousExperienceYears,
      'Staj (Ay)': o.previousExperienceMonths,
      'Cins': o.employee?.gender,
      'Doğum Tarixi': o.employee?.birthDate?.split('T')[0],
      'Təhsil': o.employee?.education,
      'Şöbə': o.department,
      'Vəzifə': o.position,
      'İşə Başlama': o.startDate?.split('T')[0],
      'Sınaq Müddəti (Ay)': o.probationMonths,
      'Məzuniyyət Günü': o.employee?.contracts?.[0]?.vacationDays || '',
      'İş Yeri Növü': o.workplaceType,
      'Sektor': o.sector,
      'Gross Məbləğ': formatNumber(o.salaryGross, 2),
      'Maaş Növü': o.salaryType,
      'Vergi Güzəşti': (o.taxExemptionGroup && o.taxExemptionGroup !== 'NONE') ? 'Var' : 'Yox'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'İşə Qəbul Reyestri');
    
    const maxWidths = worksheetData.reduce((acc: any, row: any) => {
      Object.keys(row).forEach((key, i) => {
        const val = String(row[key] || '');
        acc[i] = Math.max(acc[i] || 0, val.length + 5, key.length + 5);
      });
      return acc;
    }, []);
    worksheet['!cols'] = maxWidths.map((w: number) => ({ wch: w }));

    XLSX.writeFile(workbook, `Ise_Qebul_Reyestri_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic flex items-center leading-none">
            <FileText className="w-7 h-7 mr-3 text-emerald-500" />
            İşə Qəbul Əmrləri Reyestri
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 ml-10 italic">Şirkət üzrə bütün rəsmi qəbul sənədlərinin siyahısı</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
             onClick={() => setShowImportModal(true)} 
             className="flex items-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-black text-[11px] uppercase italic shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all outline-none border-none leading-none"
          >
             <Upload className="w-5 h-5 mr-1" />
             <span>Excel İMPORT</span>
          </button>

          <button 
            onClick={() => navigate('/hr/hiring/create')}
            className="flex items-center justify-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary-600/20 transition-all hover:scale-105 active:scale-95 leading-none"
          >
            <Plus className="w-5 h-5 leading-none" />
            <span>Yeni İşə Qəbul</span>
          </button>
        </div>
      </div>

      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 font-black italic">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center"><FileSpreadsheet className="w-6 h-6 text-emerald-600" /></div>
                    <div><h2 className="text-xl uppercase italic">Excel İMPORT</h2><p className="text-[10px] font-bold text-slate-400 uppercase">Toplu işçi yükləmə</p></div>
                 </div>
                 <button onClick={() => setShowImportModal(false)} className="p-2.5 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all shadow-sm"><X/></button>
              </div>
              <div className="space-y-6">
                 <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between gap-4">
                    <p className="text-[11px] uppercase text-emerald-800 italic">Şablonu Endir</p>
                    <button onClick={handleDownloadTemplate} className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-black text-[10px] border border-emerald-100 shadow-sm italic uppercase disabled:opacity-50">Şablonu Yüklə (.xlsx)</button>
                 </div>
                 
                 <div onClick={() => !isImporting && fileInputRef.current?.click()} className={`border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center space-y-4 cursor-pointer transition-all ${isImporting ? 'bg-indigo-50 border-indigo-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                    <input ref={fileInputRef} type="file" accept=".xlsx, .xls" className="hidden" onChange={handleExcelImport} disabled={isImporting} />
                    {isImporting ? <Loader2 className="w-14 h-14 text-indigo-500 animate-spin" /> : <FileUp className="w-14 h-14 text-slate-300" />}
                    <p className="text-sm font-black uppercase italic tracking-tighter">{isImporting ? 'Excel məlumatları emal edilir...' : 'Excel faylını bu hissəyə atın'}</p>
                 </div>
                 
                 {isImporting && importProgress.total > 0 && (
                     <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl text-[11px] text-center border border-indigo-100 shadow-sm animate-pulse">Sətirlər yüklənir: {importProgress.current} / {importProgress.total}</div>
                 )}
              </div>
              <div className="mt-12 flex justify-end">
                 <button onClick={() => setShowImportModal(false)} className="px-10 py-5 bg-slate-100 rounded-3xl font-black uppercase italic text-[10px] hover:bg-slate-200 transition-all" disabled={isImporting}>QAPAT</button>
              </div>
           </div>
        </div>
      )}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="ƏMR NO, PERSONAL VƏ YA SƏNƏD ÜZRƏ AXTARIŞ..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none transition-all uppercase"
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
            title="Zəngin Süzgəc (Alt + F)"
          >
            <Filter className="w-5 h-5 leading-none" />
          </button>
          <button 
            onClick={handleExportExcel}
            className="p-4 bg-slate-50 dark:bg-slate-800 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all leading-none border border-transparent hover:border-emerald-100"
            title="Siyahını Endir"
          >
            <Download className="w-5 h-5 leading-none" />
          </button>
        </div>
      </div>

      {/* GLOBAL SIDEBAR FILTER ACTIVE - INLINE PANEL REMOVED */}

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm flex-1 flex flex-col min-h-[850px]">
        <div className="overflow-x-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Məlumatlar Yüklənir...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <FileText className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] italic">Heç bir əmr tapılmadı</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-black italic uppercase leading-none">
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
                          py-6 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none
                          bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800
                          ${isStickyLeft || isStickyRight ? 'sticky z-40' : ''}
                          ${col.id === 'salary' || col.id === 'actions' ? 'text-right' : col.id === 'status' ? 'text-center' : 'text-left'}
                          ${isStickyLeft && index === activeColumns.findLastIndex(c => c.isStickyLeft) ? 'border-r-2 border-slate-200 dark:border-slate-700 shadow-[2px_0_5px_rgba(0,0,0,0.05)]' : ''}
                          ${isStickyRight && index === activeColumns.findIndex(c => c.isStickyRight) ? 'border-l-2 border-slate-200 dark:border-slate-700 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]' : ''}
                        `}
                      >
                        {col.id === 'selection' ? (
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={toggleSelectAll}
                              className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                                selectedIds.size === currentItems.length && currentItems.length > 0
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                              }`}
                            >
                              {selectedIds.size === currentItems.length && currentItems.length > 0 && <Check className="w-3.5 h-3.5 font-bold" />}
                            </button>
                          </div>
                        ) : col.label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 leading-none">
                {currentItems.map((order: any) => (
                  <tr key={order.id} className={`group transition-colors leading-none ${selectedIds.has(order.id) ? 'bg-emerald-50/20' : 'hover:bg-emerald-50/10'}`}>
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
                            py-6 px-6 bg-white dark:bg-slate-900 leading-none
                            ${isStickyLeft || isStickyRight ? 'sticky z-10' : ''}
                            ${isStickyLeft && index === activeColumns.findLastIndex(c => c.isStickyLeft) ? 'border-r-2 border-slate-200 dark:border-slate-700 shadow-[2px_0_5px_rgba(0,0,0,0.05)]' : ''}
                            ${isStickyRight && index === activeColumns.findIndex(c => c.isStickyRight) ? 'border-l-2 border-slate-200 dark:border-slate-700 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]' : ''}
                          `}
                        >
                          {col.id === 'selection' && (
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => toggleSelect(order.id)}
                                className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                                  selectedIds.has(order.id) 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                }`}
                              >
                                {selectedIds.has(order.id) && <Check className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}
                          {col.id === 'doc_info' && (
                            <div className="flex flex-col space-y-1.5 leading-none">
                              <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none uppercase truncate">{order.docNumber}</span>
                              <div className="flex items-center text-[10px] font-black text-slate-400 leading-none">
                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-500 leading-none" />
                                {formatDate(order.docDate)}
                              </div>
                            </div>
                          )}
                          {col.id === 'fullName_fin' && (
                            <div className="flex flex-col space-y-1.5 leading-none">
                              <button onClick={() => navigate(`/hr/employee/${order.employeeId}`)} className="text-left group/link">
                                <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none uppercase group-hover/link:text-emerald-600 transition-colors border-b-2 border-transparent group-hover/link:border-emerald-600/30 pb-0.5 truncate block max-w-[240px]">{order.employee?.fullName}</span>
                              </button>
                              <span className="font-mono text-[9px] font-bold tabular-nums text-slate-400 uppercase tracking-[0.1em]">{order.employee?.fin || '---'}</span>
                            </div>
                          )}
                            {col.id === 'branch' && <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase">{order.branch?.name || order.employee?.branch?.name || '---'}</span>}
                            {col.id === 'dept_pos' && (
                            <div className="flex flex-col space-y-1.5 leading-none">
                              <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase leading-none truncate max-w-[200px]">{order.department || '---'}</span>
                              <div className="flex items-center text-[9px] font-bold text-slate-400 uppercase leading-none truncate max-w-[200px]">
                                <User className="w-3 h-3 mr-1.5 text-slate-300" />
                                {order.position}
                              </div>
                            </div>
                          )}
                          {col.id === 'education' && (
                            <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase">
                              {order.employee?.education || order.education || '---'}
                            </span>
                          )}
                          {col.id === 'citizenship' && <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase">
                             {order.employee?.citizenship || '---'}
                            </span>}
                          {col.id === 'gender' && <span className="text-[10px] font-black text-slate-800 uppercase">{order.employee?.gender || '---'}</span>}
                          {col.id === 'schedule_type' && (
                            <div className="flex flex-col space-y-1.5 leading-none">
                              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase italic">{order.workSchedule || '---'}</span>
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{order.workplaceType || 'ƏSAS'}</span>
                            </div>
                          )}
                          {col.id === 'sector' && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-black bg-slate-100 text-slate-600 uppercase">
                              {order.sector || '---'}
                            </span>
                          )}
                          {col.id === 'contractType' && <span className="text-[10px] font-black text-slate-500 italic">{order.endDate ? 'MÜDDƏTLİ' : 'MÜDDƏTSİZ'}</span>}
                          {col.id === 'vacationDays' && <span className="text-[10px] font-black text-emerald-600 tabular-nums">{order.employee?.contracts?.[0]?.vacationDays || '---'} GÜN</span>}
                          {col.id === 'startDate' && <span className="text-[10px] font-black text-slate-600 whitespace-nowrap">{formatDate(order.startDate)}</span>}
                          {col.id === 'signingDate' && <span className="text-[10px] font-black text-slate-600 whitespace-nowrap">{order.signingDate ? formatDate(order.signingDate) : '---'}</span>}
                          {col.id === 'endDate' && <span className="text-[10px] font-black text-rose-500 whitespace-nowrap">{order.endDate ? formatDate(order.endDate) : '---'}</span>}
                          {col.id === 'terminationDate' && (
                            <span className="text-[11px] font-black text-rose-500 italic leading-none truncate block">
                              {order.employee?.terminationDate ? formatDate(order.employee.terminationDate) : (fieldFilters.terminationDate ? formatDate(fieldFilters.terminationDate) : '-')}
                            </span>
                          )}
                          {col.id === 'salary' && (
                             <div className="flex flex-col items-end leading-none">
                               <span className="text-[11px] font-black text-slate-900 dark:text-white tabular-nums leading-none mb-1">{formatCurrency(order.salary, 'AZN')}</span>
                               <span className="text-[8px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded leading-none">{order.salaryType}</span>
                             </div>
                          )}
                          {col.id === 'status' && (
                             <div className="flex justify-center">
                               <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black tracking-widest leading-none">POSTED</span>
                             </div>
                          )}
                          {col.id === 'actions' && (
                            <div className="flex items-center justify-end space-x-2 leading-none transition-all">
                              <button 
                                onClick={() => setEnrollmentOrder(order)} 
                                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm leading-none"
                                title="Üz Tanıma Qeydiyyatı (Face ID)"
                              >
                                <QrCode className="w-3.5 h-3.5 leading-none" />
                              </button>
                              <button onClick={() => navigate(`/hr/hiring/edit/${order.id}`)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-xl transition-all shadow-sm leading-none"><Edit className="w-3.5 h-3.5 leading-none" /></button>
                              <button onClick={() => navigate(`/hr/hiring/edit/${order.id}`)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm leading-none"><Eye className="w-3.5 h-3.5 leading-none" /></button>
                              <button onClick={(e) => handleDelete(order.id, order.docNumber, e)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all shadow-sm leading-none"><Trash2 className="w-3.5 h-3.5 leading-none" /></button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION BAR (PRO VERSION) */}
        {!isLoading && filteredOrders.length > 0 && (
          <div className="px-10 py-8 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 leading-none">
            
            {/* Left: Row Count Selection */}
            <div className="flex items-center space-x-4 leading-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Sətir Sayı:</span>
              <div className="relative leading-none">
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl pl-6 pr-12 py-3 text-[11px] font-black text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer leading-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none rotate-90 leading-none" />
              </div>
            </div>

            {/* Middle: Total Stats */}
            <div className="flex items-center leading-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">
                Ümumi Reyestr: <span className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600/30 pb-0.5 ml-2 mr-1 text-[12px]">{filteredOrders.length}</span> Bənd
              </span>
            </div>

            {/* Right: Navigation Buttons */}
            <div className="flex items-center space-x-2 leading-none">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all leading-none"
              >
                <ChevronsLeft className="w-4 h-4 leading-none" />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all leading-none"
              >
                <ChevronLeft className="w-4 h-4 leading-none" />
              </button>
              
              <div className="flex items-center px-4 leading-none">
                <span className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[12px] font-black shadow-lg shadow-indigo-600/20 leading-none">
                  {currentPage}
                </span>
                {totalPages > 1 && currentPage < totalPages && (
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="ml-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[12px] font-black text-slate-400 hover:text-indigo-600 transition-all leading-none"
                  >
                    {currentPage + 1}
                  </button>
                )}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all leading-none"
              >
                <ChevronRight className="w-4 h-4 leading-none" />
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all leading-none"
              >
                <ChevronsRight className="w-4 h-4 leading-none" />
              </button>
            </div>

          </div>
        )}
      </div>

      {/* FLOATING ACTION BAR FOR BULK ACTIONS */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-20 duration-500">
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-[3rem] px-10 py-6 flex items-center space-x-8 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border border-slate-700/50">
            <div className="flex items-center space-x-4 pr-8 border-r border-slate-700">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center font-black text-[12px] italic shadow-lg shadow-emerald-500/20">
                {selectedIds.size}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest italic opacity-70">Əmr seçilib</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSelectedIds(new Set())}
                className="p-4 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors group"
                title="LƏĞV ET"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </button>
              <button 
                onClick={() => setIsBulkAccountModalOpen(true)}
                className="flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                <Edit className="w-4 h-4" />
                <span>Müxabirləşmələrini Dəyişmək</span>
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

      {/* COLUMN SETTINGS MODAL */}
      {isColumnModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Cədvəl Sütunlarını Tənzimlə</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cədvəli ehtiyacınıza uyğun formalaşdırın</p>
                </div>
              </div>
              <button onClick={() => setIsColumnModalOpen(false)} className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-10 space-y-4">
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
                      className={`group flex items-center p-5 rounded-[1.5rem] border transition-all cursor-move active:cursor-grabbing ${
                        col.isVisible 
                        ? (dragOverIndex === index ? 'bg-emerald-50 border-emerald-500 scale-[1.02]' : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-200/50') 
                        : 'bg-slate-50/50 dark:bg-slate-800/20 border-transparent opacity-60'
                      } ${draggedIndex === index ? 'opacity-20 grayscale' : ''}`}
                    >
                      {/* Drag Handle */}
                      <div className="mr-6 flex items-center justify-center text-slate-300 group-hover:text-emerald-500 transition-colors">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <span className={`text-[12px] font-black uppercase tracking-tight ${col.isVisible ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{col.label}</span>
                        <div className="flex items-center space-x-3 mt-1.5">
                          {col.isStickyLeft && <span className="flex items-center text-[8px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded uppercase tracking-widest leading-none shadow-sm shadow-blue-500/10"><Lock className="w-2.5 h-2.5 mr-1" /> Sol Dondurulub</span>}
                          {col.isStickyRight && <span className="flex items-center text-[8px] font-black bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded uppercase tracking-widest leading-none shadow-sm shadow-amber-500/10"><Lock className="w-2.5 h-2.5 mr-1" /> Sağ Dondurulub</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-6">
                        {/* Sticky Left Toggle */}
                        <div className="flex flex-col items-center">
                          <span className="text-[7px] font-black text-slate-400 uppercase mb-1.5">Sol Don</span>
                          <button 
                            disabled={!col.isVisible || (!col.isStickyLeft && leftStickyCount >= 4)}
                            onClick={(e) => {
                                e.stopPropagation();
                                const newCols = [...columnConfigs];
                                newCols[index].isStickyLeft = !newCols[index].isStickyLeft;
                                if (newCols[index].isStickyLeft) newCols[index].isStickyRight = false;
                                setColumnConfigs(newCols);
                            }}
                            className={`w-10 h-6 p-1 rounded-full transition-all flex items-center ${col.isStickyLeft ? 'bg-blue-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}
                          >
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>

                        {/* Sticky Right Toggle */}
                        <div className="flex flex-col items-center">
                          <span className="text-[7px] font-black text-slate-400 uppercase mb-1.5">Sağ Don</span>
                          <button 
                            disabled={!col.isVisible || (!col.isStickyRight && rightStickyCount >= 3)}
                            onClick={(e) => {
                                e.stopPropagation();
                                const newCols = [...columnConfigs];
                                newCols[index].isStickyRight = !newCols[index].isStickyRight;
                                if (newCols[index].isStickyRight) newCols[index].isStickyLeft = false;
                                setColumnConfigs(newCols);
                            }}
                            className={`w-10 h-6 p-1 rounded-full transition-all flex items-center ${col.isStickyRight ? 'bg-amber-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}
                          >
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>

                        {/* Visibility Toggle */}
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
                            className={`w-12 h-8 p-1.5 rounded-xl transition-all flex items-center ${col.isVisible ? 'bg-emerald-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}
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
            <div className="px-10 py-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <button 
                onClick={() => {
                  if (window.confirm('Bütün tənzimləmələri sıfırlamaq istəyirsiniz?')) {
                    setColumnConfigs(DEFAULT_COLUMNS);
                  }
                }}
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all active:scale-95 leading-none"
              >
                Sıfırla
              </button>
              <button 
                onClick={() => setIsColumnModalOpen(false)}
                className="px-12 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all leading-none"
              >
                Yadda Saxla və Bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT PROGRESS MODAL */}
      {isImporting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center space-y-8 max-w-md w-full mx-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                {Math.round((importProgress.current / importProgress.total) * 100)}%
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Excel İdxal Edilir</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Zəhmət olmasa gözləyin. Məlumatlar emal olunur... <br />
                <span className="text-emerald-500 mt-2 block">{importProgress.current} / {importProgress.total} sətir emal olundu</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FACE ID ENROLLMENT MODAL */}
      {enrollmentOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 text-center space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="text-left">
                       <h3 className="text-[20px] font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Face ID Qeydiyyatı</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">İşə Qəbul Mərhələsi</p>
                    </div>
                    <button onClick={() => setEnrollmentOrder(null)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors">
                       <X className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex flex-col items-center">
                       <div className="p-6 bg-white rounded-[2rem] shadow-xl mb-4 border border-slate-100">
                          <QRCodeCanvas 
                            value={`${window.location.origin}/hr/face-enrollment?employeeId=${enrollmentOrder.employeeId}&companyId=${enrollmentOrder.companyId}&fullName=${encodeURIComponent(enrollmentOrder.employee?.fullName || '')}`}
                            size={200}
                            level="H"
                            includeMargin={true}
                          />
                       </div>
                       <p className="text-[11px] font-black text-slate-500 uppercase italic px-10">
                         Mütəxəssis tərəfindən oxudulmalı və ya işçiyə öz telefonu ilə qeydiyyatdan keçməsi üçün göndərilməlidir.
                       </p>
                    </div>
                 </div>

                 <div className="flex flex-col space-y-4">
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/50 text-left">
                       <div className="flex items-center gap-3 mb-2">
                          <User className="w-4 h-4 text-indigo-500" />
                          <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">İşçi Məlumatı</span>
                       </div>
                       <p className="text-[14px] font-black text-slate-900 dark:text-white uppercase italic">{enrollmentOrder.employee?.fullName}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Vəzifə: {enrollmentOrder.position}</p>
                    </div>
                    <button 
                       onClick={() => {
                          const url = `${window.location.origin}/hr/face-enrollment?employeeId=${enrollmentOrder.employeeId}&companyId=${enrollmentOrder.companyId}&fullName=${encodeURIComponent(enrollmentOrder.employee?.fullName || '')}`;
                          window.location.href = url;
                       }}
                       className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl text-[12px] font-black uppercase tracking-widest italic shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center space-x-3"
                     >
                       <Maximize2 className="w-4 h-4" />
                       <span>Bu cihazda qeydiyyatdan keç</span>
                     </button>
                    <button 
                      onClick={() => setEnrollmentOrder(null)}
                      className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest italic"
                    >
                      Baqla
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
      {/* BULK ACCOUNT UPDATE MODAL */}
      {isBulkAccountModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 font-black italic">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <h3 className="text-[20px] font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Müxabirləşmələrini Dəyişmək</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Seçilmiş {selectedIds.size} əmr üçün hesabları yaradın</p>
                </div>
                <button onClick={() => setIsBulkAccountModalOpen(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Borc Hesabı (Debet)</label>
                  <select 
                    value={bulkPayableAccountId}
                    onChange={(e) => setBulkPayableAccountId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-5 px-6 text-[11px] font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
                  >
                    <option value="">SEÇİLMƏYİB</option>
                    {allAccounts.map((a: any) => (
                      <option key={`bulk-pay-${a.id}`} value={a.id}>{a.code} - {a.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Avans Hesabı (Kredit)</label>
                  <select 
                    value={bulkAdvanceAccountId}
                    onChange={(e) => setBulkAdvanceAccountId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-5 px-6 text-[11px] font-black italic shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
                  >
                    <option value="">SEÇİLMƏYİB</option>
                    {allAccounts.map((a: any) => (
                      <option key={`bulk-adv-${a.id}`} value={a.id}>{a.code} - {a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <button 
                  onClick={handleBulkAccountUpdate}
                  disabled={isUpdatingAccounts}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl text-[12px] font-black uppercase tracking-widest italic shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isUpdatingAccounts ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  <span>Yadda Saxla və Yenilə</span>
                </button>
                <button 
                  onClick={() => setIsBulkAccountModalOpen(false)}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest italic"
                >
                  Baqla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiringOrderList;
