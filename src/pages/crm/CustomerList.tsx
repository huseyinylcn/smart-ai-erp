import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Users, Search, UserPlus, Filter, 
  Download, Globe, ChevronRight, 
  MapPin, Loader2, Edit2, Trash2, Eye,
  X, Check, FileText, Layout, ChevronLeft, ChevronsLeft, ChevronsRight,
  Upload, FileUp, Info, FileSpreadsheet, Settings2, Receipt, Calculator,
  Building2, Hash, Smartphone, Settings, Maximize2, Minimize2, GripVertical
} from 'lucide-react';
import { crmApi, financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

const CustomerList = () => {
  const navigate = useNavigate();
  const { 
    isContentFullscreen, 
    setIsContentFullscreen,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    setFilterSidebarContent
  } = useOutletContext<any>();
  const { activeCompany } = useCompany();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkAccountModal, setShowBulkAccountModal] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState<'ALL' | 'LOCAL' | 'FOREIGN'>('ALL'); 

  // Import/Export States
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'IDLE' | 'PARSING' | 'READY' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [importData, setImportData] = useState<any[]>([]);
  const [exportFormat, setExportFormat] = useState<'CSV' | 'XLSX'>('XLSX');

  // Bulk Form States
  const [bulkReceivableId, setBulkReceivableId] = useState('');
  const [bulkAdvanceId, setBulkAdvanceId] = useState('');
  const [bulkReceivableSearch, setBulkReceivableSearch] = useState('');
  const [bulkAdvanceSearch, setBulkAdvanceSearch] = useState('');
  const [showBulkRecList, setShowBulkRecList] = useState(false);
  const [showBulkAdvList, setShowBulkAdvList] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Column Configuration states
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
    textAlign?: 'left' | 'center' | 'right';
  }

  const DEFAULT_COLUMNS: ColumnConfig[] = [
    { id: 'selection', label: 'SEÇİM', isVisible: true, isStickyLeft: true, isStickyRight: false, width: 80, textAlign: 'center' },
    { id: 'customer', label: 'MÜŞTƏRİ / REYESTR', isVisible: true, isStickyLeft: true, isStickyRight: false, width: 280, textAlign: 'left' },
    { id: 'object', label: 'OBYEKT (KOD/AD)', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 200, textAlign: 'left' },
    { id: 'taxId', label: 'VÖEN', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 140, textAlign: 'left' },
    { id: 'type_contact', label: 'NÖV & ƏLAQƏ', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 200, textAlign: 'left' },
    { id: 'vat', label: 'ƏDV ÖDƏYİCİSİ', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 150, textAlign: 'center' },
    { id: 'accounts', label: 'HESABLAR (D/A)', isVisible: true, isStickyLeft: false, isStickyRight: false, width: 240, textAlign: 'center' },
    { id: 'actions', label: 'ƏMƏLİYYAT', isVisible: true, isStickyLeft: false, isStickyRight: true, width: 160, textAlign: 'right' }
  ];

  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem('customer_registry_columns_v1');
    return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
  });

  useEffect(() => {
    localStorage.setItem('customer_registry_columns_v1', JSON.stringify(columnConfigs));
  }, [columnConfigs]);

  const activeColumns = columnConfigs.filter(c => c.isVisible);

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
    if (e.dataTransfer) { e.dataTransfer.effectAllowed = "move"; setTimeout(() => { const t = e.target as HTMLElement; if (t) t.style.opacity = '0.2'; }, 0); }
  };
  const handleDragOver = (e: React.DragEvent, index: number) => { e.preventDefault(); setDragOverIndex(index); };
  const handleDragEnd = (e: React.DragEvent) => { const t = e.target as HTMLElement; if (t) t.style.opacity = '1'; setDraggedIndex(null); setDragOverIndex(null); };
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const newCols = [...columnConfigs];
    const item = newCols.splice(draggedIndex, 1)[0];
    newCols.splice(targetIndex, 0, item);
    setColumnConfigs(newCols);
    handleDragEnd(e);
  };

  // Advanced Filters
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [fieldFilters, setFieldFilters] = useState({
    type: '',
    vatPayer: '',
    payableAccountId: '',
    advanceAccountId: ''
  });

  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-8 animate-in slide-in-from-right duration-300">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Müştəri Növü</label>
              <select 
                value={fieldFilters.type} 
                onChange={(e) => setFieldFilters({...fieldFilters, type: e.target.value})} 
                className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase appearance-none"
              >
                <option value="">HAMISI</option>
                <option value="LOCAL">YERLİ MÜŞTƏRİLƏR</option>
                <option value="FOREIGN">XARİCİ MÜŞTƏRİLƏR</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">ƏDV Ödəyicisi</label>
              <select 
                value={fieldFilters.vatPayer} 
                onChange={(e) => setFieldFilters({...fieldFilters, vatPayer: e.target.value})} 
                className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase appearance-none"
              >
                <option value="">HAMISI</option>
                <option value="YES">BƏLİ (ƏDV ÖDƏYİCİSİ)</option>
                <option value="NO">XEYR (SADƏ)</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Debitor Hesabı</label>
              <select 
                value={fieldFilters.payableAccountId} 
                onChange={(e) => setFieldFilters({...fieldFilters, payableAccountId: e.target.value})} 
                className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase appearance-none"
              >
                <option value="">BÜTÜN HESABLAR</option>
                {accounts.filter(a => a.code.startsWith('211')).map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Avans Hesabı</label>
              <select 
                value={fieldFilters.advanceAccountId} 
                onChange={(e) => setFieldFilters({...fieldFilters, advanceAccountId: e.target.value})} 
                className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase appearance-none"
              >
                <option value="">BÜTÜN HESABLAR</option>
                {accounts.filter(a => a.code.startsWith('543')).map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
              </select>
           </div>

           <div className="pt-6">
             <button 
               onClick={() => {
                 setFieldFilters({ type: '', vatPayer: '', payableAccountId: '', advanceAccountId: '' });
                 setSearchTerm('');
               }}
               className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 italic"
             >
               Sıfırla (Reset All)
             </button>
           </div>
        </div>
      );
    }
  }, [isFilterSidebarOpen, fieldFilters, accounts, setFilterSidebarContent]);

  useEffect(() => {
    fetchCustomers();
    fetchAccounts();
  }, [activeCompany]);

  const fetchCustomers = async () => {
    if (!activeCompany) return;
    setIsLoading(true);
    try {
      const response = await crmApi.getCounterparties(activeCompany.id, 'CUSTOMER');
      setCustomers(response.data || []);
    } catch (err) {} finally { setIsLoading(false); }
  };

  const fetchAccounts = async () => {
    if (!activeCompany) return;
    try {
      const res = await financeApi.getAccounts(activeCompany.id);
      setAccounts(res.data || []);
    } catch (e) {}
  };

  const getAccountCode = (id: string) => accounts.find(a => a.id === id)?.code || '---';

  const filteredCustomers = customers.filter(c => {
    // Basic search
    const term = searchTerm.toLowerCase();
    const match = (c.name || '').toLowerCase().includes(term) || (c.code || '').toLowerCase().includes(term) || (c.taxId || '').includes(term) || (c.objectCode || '').toLowerCase().includes(term);
    
    // Legacy top-tab type filter (if kept)
    const typeMatch = filterType === 'ALL' || (filterType === 'LOCAL' && !c.isForeign) || (filterType === 'FOREIGN' && c.isForeign);
    
    // Advanced UI Field Filters
    if (fieldFilters.type && fieldFilters.type !== 'ALL') {
      if (fieldFilters.type === 'LOCAL' && c.isForeign) return false;
      if (fieldFilters.type === 'FOREIGN' && !c.isForeign) return false;
    }
    if (fieldFilters.vatPayer && fieldFilters.vatPayer !== 'ALL') {
      if (fieldFilters.vatPayer === 'YES' && !c.isVatPayer) return false;
      if (fieldFilters.vatPayer === 'NO' && c.isVatPayer) return false;
    }
    if (fieldFilters.payableAccountId && c.payableAccountId !== fieldFilters.payableAccountId) return false;
    if (fieldFilters.advanceAccountId && c.advanceAccountId !== fieldFilters.advanceAccountId) return false;

    return match && typeMatch;
  });

  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedCustomers.length && paginatedCustomers.length > 0) { setSelectedIds([]); } 
    else { setSelectedIds(paginatedCustomers.map(v => v.id)); }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!activeCompany || !window.confirm(`'${name}' müştərisini silmək istədiyinizə əminsiniz?`)) return;
    try { 
      await crmApi.deleteCounterparty(id); 
      fetchCustomers(); 
    } catch (e: any) {
      alert(`Silinmə xətası: ${e?.message || 'Bilinməyən xəta'}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Seçilmiş ${selectedIds.length} müştərini silmək istədiyinizə əminsiniz?`)) return;
    setIsLoading(true);
    try { 
      const results = await Promise.allSettled(
        selectedIds.map(id => crmApi.deleteCounterparty(id))
      );
      const failedCount = results.filter(r => r.status === 'rejected').length;
      if (failedCount > 0) {
        alert(`${failedCount} müştərini silmək mümkün olmadı (əlaqəli əməliyyatlar mövcud ola bilər). Zəhmət olmasa yoxlayın.`);
      }
    } 
    catch (e) { console.error(e); } 
    finally { 
      setSelectedIds([]); 
      fetchCustomers();
      setIsLoading(false); 
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkReceivableId && !bulkAdvanceId) { alert('Hər hansı bir hesabı seçin.'); return; }
    setIsBulkUpdating(true);
    try {
      for (const id of selectedIds) {
        const c = customers.find(x => x.id === id);
        if (c) {
          await crmApi.updateCounterparty(id, {
            ...c,
            payableAccountId: bulkReceivableId || c.payableAccountId,
            advanceAccountId: bulkAdvanceId || c.advanceAccountId
          });
        }
      }
      setShowBulkAccountModal(false);
      setSelectedIds([]);
      fetchCustomers();
    } catch (e) {} finally { setIsBulkUpdating(false); }
  };

  const handleExport = () => {
    const dataSource = selectedIds.length > 0 ? customers.filter(v => selectedIds.includes(v.id)) : filteredCustomers;
    const headers = ["Müştəri Adı", "Kod", "Obyekt Kodu", "Obyekt Adı", "VÖEN", "Növ", "ƏDV Statusu", "Debitor Hesabı", "Avans Hesabı"];
    const rows = dataSource.map(v => [v.name, v.code, v.objectCode || '', v.objectName || '', v.taxId || '', v.isForeign ? 'Xarici' : 'Yerli', v.isVatPayer ? 'Bəli' : 'Xeyr', getAccountCode(v.payableAccountId), getAccountCode(v.advanceAccountId)]);
    
    if (exportFormat === 'CSV') {
        const csvStr = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `Customers_${new Date().getTime()}.csv`; link.click();
    } else {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Customers");
        XLSX.writeFile(wb, `Customers_${new Date().getTime()}.xlsx`);
    }
    setShowDownloadModal(false);
  };

  const parseExcel = async (f: File) => {
    setImportStatus('PARSING');
    try {
      const data = await f.arrayBuffer(); 
      const wb = XLSX.read(data); 
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws);
      const mapped = json.map(r => {
        const fetchAccountIdByCode = (colName: string) => {
           const val = String(r[colName] || '').trim();
           if (!val) return null;
           const acc = accounts.find(a => String(a.code).trim() === val);
           return acc ? acc.id : null;
        };
        const isVatString = String(r['ƏDV Ödəyicisi'] || r['EDV Oleyici'] || '').toLowerCase();
        const isForeignString = String(r['Müştəri Növü'] || r['Növ'] || '').toLowerCase();
        
        return {
          name: r['Ad'] || r['AD'] || r['Müştəri'] || r['Name'] || r['Müştəri Adı (Şirkət)'],
          taxId: (r['VÖEN'] || r['VOEN'] || '').toString(),
          objectCode: (r['Obyekt Kodu'] || r['OBJECT_CODE'] || '').toString(),
          objectName: (r['Obyekt Adı'] || r['OBJECT_NAME'] || '').toString(),
          phone: (r['Telefon Nömrəsi'] || r['Phone'] || '').toString(),
          email: (r['E-poçt Ünvanı'] || r['Email'] || '').toString(),
          isVatPayer: isVatString.includes('bəli') || isVatString.includes('yes') || isVatString === '1',
          isForeign: isForeignString.includes('xarici') || isForeignString.includes('foreign'),
          payableAccountId: fetchAccountIdByCode('Debitor Hesabı') || accounts.find(a => a.code.startsWith('211'))?.id || '',
          advanceAccountId: fetchAccountIdByCode('Avans Hesabı') || accounts.find(a => a.code.startsWith('543'))?.id || '',
          code: `CUST-OBJ-${Math.floor(1000 + Math.random() * 9000)}`,
          bankAccounts: [{
             bankName: (r['Bank Adı'] || '').toString(),
             iban: (r['İBAN'] || '').toString(),
             currency: (String(r['Valyuta'] || '').toUpperCase()) || 'AZN',
             isActive: true
          }].filter(b => b.bankName || b.iban)
        };
      }).filter(x => x.name);
      setImportData(mapped); 
      setImportStatus('READY');
    } catch (e) {
      setImportStatus('ERROR');
    }
  };

  const handleExecuteImport = async () => {
    setImportStatus('UPLOADING');
    try {
      for (const item of importData) {
        await crmApi.createCounterparty({
          ...item,
          companyId: activeCompany!.id,
          type: 'CUSTOMER'
        });
      }
      setImportStatus('SUCCESS');
      fetchCustomers();
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus('IDLE');
        setImportFile(null);
        setImportData([]);
      }, 1500);
    } catch (e) {
      setImportStatus('ERROR');
    }
  };
  const handleDownloadTemplate = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Şablon');

    const headers = [
      "Müştəri Adı (Şirkət)", "VÖEN", "Obyekt Kodu", "Obyekt Adı", 
      "Telefon Nömrəsi", "E-poçt Ünvanı", "ƏDV Ödəyicisi", "Müştəri Növü", 
      "Debitor Hesabı", "Avans Hesabı", "Bank Adı", "İBAN", "Valyuta"
    ];
    ws.addRow(headers);
    ws.getRow(1).font = { bold: true };

    // Apply strict data validations up to 1000 rows
    for (let i = 2; i <= 1000; i++) {
       // ƏDV
      ws.getCell(`G${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Bəli,Xeyr"']
      };
      // Növ
      ws.getCell(`H${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Yerli,Xarici"']
      };
      // Valyuta
      ws.getCell(`M${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"AZN,USD,EUR,TRY"']
      };
    }

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Musteri_Sablounu_Etrafli.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 relative font-black italic">
      
      {/* BULK ACCOUNT MODAL */}
      {showBulkAccountModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 font-black italic">
              <div className="flex items-center justify-between mb-8 border-b pb-6">
                 <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center shadow-inner"><Settings2 className="w-6 h-6 text-primary-600" /></div>
                    <div><h2 className="text-xl uppercase italic">Toplu Hesab Dəyişimi</h2><p className="text-[10px] uppercase text-slate-400 font-bold">Seçilmiş {selectedIds.length} müştəri üçün</p></div>
                 </div>
                 <button onClick={() => setShowBulkAccountModal(false)} className="p-3 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100"><X/></button>
              </div>
              
              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] uppercase text-slate-400">Yeni Debitor Hesabı (211...)</label>
                    <div className="relative">
                       <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <input type="text" value={bulkReceivableSearch} onChange={(e) => { setBulkReceivableSearch(e.target.value); setShowBulkRecList(true); }} placeholder="Hesab kodunu daxil edin..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none" />
                       {showBulkRecList && (
                          <div className="absolute top-18 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-100 rounded-[2rem] shadow-2xl z-[160] max-h-48 overflow-y-auto">
                             {accounts.filter(a => a.code.startsWith('211') && (a.code.includes(bulkReceivableSearch) || a.name.includes(bulkReceivableSearch))).map(a => (
                                <button key={a.id} onMouseDown={(e) => { e.preventDefault(); setBulkReceivableId(a.id); setBulkReceivableSearch(`${a.code} - ${a.name}`); setShowBulkRecList(false); }} className="w-full px-8 py-5 text-left hover:bg-primary-50 transition-all border-b border-slate-50 font-black italic uppercase"><p className="text-[11px] font-black">{a.code}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{a.name}</p></button>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] uppercase text-slate-400">Yeni Avans Hesabı (543...)</label>
                    <div className="relative">
                       <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <input type="text" value={bulkAdvanceSearch} onChange={(e) => { setBulkAdvanceSearch(e.target.value); setShowBulkAdvList(true); }} placeholder="Hesab kodunu daxil edin..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none" />
                       {showBulkAdvList && (
                          <div className="absolute top-18 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-100 rounded-[2rem] shadow-2xl z-[160] max-h-48 overflow-y-auto">
                             {accounts.filter(a => a.code.startsWith('543') && (a.code.includes(bulkAdvanceSearch) || a.name.includes(bulkAdvanceSearch))).map(a => (
                                <button key={a.id} onMouseDown={(e) => { e.preventDefault(); setBulkAdvanceId(a.id); setBulkAdvanceSearch(`${a.code} - ${a.name}`); setShowBulkAdvList(false); }} className="w-full px-8 py-5 text-left hover:bg-emerald-50 transition-all border-b border-slate-50 font-black italic uppercase"><p className="text-[11px] font-black">{a.code}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{a.name}</p></button>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="mt-12 flex gap-4">
                 <button onClick={() => setShowBulkAccountModal(false)} className="flex-1 p-5 bg-slate-100 rounded-3xl text-[10px] font-black uppercase italic">Ləğv Et</button>
                 <button disabled={isBulkUpdating} onClick={handleBulkUpdate} className="flex-grow p-5 bg-primary-600 text-white rounded-3xl text-[11px] font-black uppercase shadow-xl shadow-primary-500/20 active:scale-95 transition-all outline-none font-black italic">{isBulkUpdating ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Müxabirləşməni Təsdiqlə'}</button>
              </div>
           </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 font-black italic">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center"><FileSpreadsheet className="w-6 h-6 text-emerald-600" /></div>
                    <div><h2 className="text-xl uppercase italic">Excel İMPORT</h2><p className="text-[10px] font-bold text-slate-400 uppercase">Toplu müştəri yükləmə</p></div>
                 </div>
                 <button onClick={() => setShowImportModal(false)} className="p-2.5 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all shadow-sm"><X/></button>
              </div>
              <div className="space-y-6">
                 <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between gap-4">
                    <p className="text-[11px] uppercase text-emerald-800 italic">Şablonu Endir</p>
                    <button onClick={handleDownloadTemplate} className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-black text-[10px] border border-emerald-100 shadow-sm italic uppercase">Şablonu Yüklə (.xlsx)</button>
                 </div>
                 <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center space-y-4 cursor-pointer transition-all ${importFile ? 'bg-primary-50 border-primary-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                    <input ref={fileInputRef} type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f){ setImportFile(f); parseExcel(f); } }} />
                    <FileUp className={`w-14 h-14 ${importFile ? 'text-primary-500' : 'text-slate-300'}`} />
                    <p className="text-sm font-black uppercase italic tracking-tighter">{importFile ? importFile.name : 'Excel faylını bu hissəyə atın'}</p>
                 </div>
                 {importStatus === 'READY' && <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl text-[11px] text-center border border-primary-100 shadow-sm">Faylda <span className="text-sm font-black underline">{importData.length}</span> müştəri aşkar edildi.</div>}
                 {importStatus === 'SUCCESS' && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[11px] text-center border border-emerald-100 shadow-sm grow flex items-center justify-center uppercase italic"><Check className="w-4 h-4 mr-2" /> Uğurla Yükləndi!</div>}
              </div>
              <div className="mt-12 flex gap-4">
                 <button onClick={() => setShowImportModal(false)} className="flex-1 p-5 bg-slate-100 rounded-3xl font-black uppercase italic text-[10px] hover:bg-slate-200 transition-all">Ləğv Et</button>
                 <button disabled={importStatus !== 'READY'} onClick={handleExecuteImport} className={`flex-grow p-5 rounded-3xl font-black uppercase italic text-[11px] shadow-xl transition-all ${importStatus === 'READY' ? 'bg-emerald-600 text-white hover:scale-105 shadow-emerald-500/20' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
                    {importStatus === 'UPLOADING' ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'YÜKLƏ'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* COLUMN MODAL */}
      {isColumnModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 font-black italic">
            <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-emerald-50 rounded-[1.2rem] flex items-center justify-center border border-emerald-100/50">
                  <Settings className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Cədvəl Sütunlarını Tənzimlə</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sürüşdürüb sıralayın və görünüşü tənzimləyin</p>
                </div>
              </div>
              <button onClick={() => setIsColumnModalOpen(false)} className="p-3 bg-white hover:bg-slate-100 text-slate-400 rounded-2xl transition-all shadow-sm border border-slate-100 border-b-2">
                <X className="w-5 h-5 leading-none" />
              </button>
            </div>

            <div className="p-10 max-h-[60vh] overflow-y-auto bg-slate-50/30">
              <div className="space-y-4">
                {columnConfigs.map((col, idx) => (
                  <div
                    key={col.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 transition-all cursor-move shadow-sm ${
                      dragOverIndex === idx ? 'border-emerald-500 scale-[1.02] bg-emerald-50' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300'
                    } ${col.id === 'selection' || col.id === 'actions' ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div className="flex items-center space-x-4 pointer-events-none">
                      <div className="text-slate-300">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-200 tracking-wider">
                        {col.label}
                      </span>
                    </div>

                    <div className="flex items-center space-x-8">
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] font-bold text-slate-400 uppercase mb-1.5">Görünürlük</span>
                        <button
                          disabled={col.id === 'selection' || col.id === 'actions'}
                          onClick={() => {
                            const newCols = [...columnConfigs];
                            newCols[idx].isVisible = !newCols[idx].isVisible;
                            setColumnConfigs(newCols);
                          }}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                            col.isVisible ? 'bg-emerald-500 justify-end shadow-inner' : 'bg-slate-200 justify-start'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${col.isVisible ? 'scale-110' : ''}`} />
                        </button>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[8px] font-bold text-slate-400 uppercase mb-1.5">Sola Dondur</span>
                        <button
                          onClick={() => {
                            const newCols = [...columnConfigs];
                            newCols[idx].isStickyLeft = !newCols[idx].isStickyLeft;
                            if (newCols[idx].isStickyLeft) newCols[idx].isStickyRight = false;
                            setColumnConfigs(newCols);
                          }}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                            col.isStickyLeft ? 'bg-indigo-500 justify-end shadow-inner' : 'bg-slate-200 justify-start'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${col.isStickyLeft ? 'scale-110' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setColumnConfigs(DEFAULT_COLUMNS)} 
                className="px-8 py-5 bg-white text-slate-600 font-black uppercase text-[11px] rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-100 transition-all border-b-2"
              >
                İLKİN VƏZİYYƏTƏ QAYTAR
              </button>
              <button 
                onClick={() => setIsColumnModalOpen(false)} 
                className="flex-1 bg-emerald-600 text-white font-black uppercase text-[12px] rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-center hover:bg-emerald-700"
              >
                TƏSDİQLƏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 font-black italic">
              <h2 className="text-xl uppercase italic mb-8 flex items-center border-b pb-4 leading-none"><Download className="w-7 h-7 mr-3 text-primary-500" /> Siyahını Endir</h2>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <button onClick={() => setExportFormat('XLSX')} className={`flex-1 py-5 rounded-2xl border-2 transition-all font-black text-[11px] uppercase ${exportFormat === 'XLSX' ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-sm' : 'border-slate-50 text-slate-400'}`}>EXCEL (.xlsx)</button>
                    <button onClick={() => setExportFormat('CSV')} className={`flex-1 py-5 rounded-2xl border-2 transition-all font-black text-[11px] uppercase ${exportFormat === 'CSV' ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-sm' : 'border-slate-50 text-slate-400'}`}>CSV (.csv)</button>
                 </div>
                 {selectedIds.length > 0 && <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl text-center text-[11px] font-black italic uppercase border border-indigo-100 shadow-inner">Seçilmiş <span className="text-xl mx-1 underline">{selectedIds.length}</span> Müştəri endiriləcək.</div>}
              </div>
              <div className="mt-10 flex gap-4"><button onClick={() => setShowDownloadModal(false)} className="flex-1 p-5 bg-slate-100 rounded-2xl text-[10px] uppercase hover:bg-slate-200 transition-all font-black uppercase italic">Ləğv Et</button><button onClick={handleExport} className="flex-grow p-5 bg-primary-600 text-white rounded-2xl text-[10px] uppercase shadow-xl hover:scale-105 active:scale-95 transition-all font-black uppercase italic">Siyahını yüklə</button></div>
           </div>
        </div>
      )}

      {/* FULLSCREEN INDICATOR */}
      {isContentFullscreen && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-10 py-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-in slide-in-from-top duration-500 mb-6">
           <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                 <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Müştəri Reyestri</h3>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">TAM EKRAN REJİMİ AKTİVDİR</p>
              </div>
           </div>
           <button 
              onClick={() => setIsContentFullscreen(false)}
              className="flex items-center space-x-3 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
           >
              <Minimize2 className="w-4 h-4" />
              <span>SİSTEMƏ QAYIT</span>
           </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div><h1 className="text-3xl font-black uppercase tracking-tight italic flex items-center"><Users className="w-8 h-8 mr-4 text-emerald-500 leading-none"/> Müştəri Reyestri</h1><p className="text-[10px] font-black italic uppercase text-slate-400 mt-2 uppercase tracking-widest leading-none ml-12">Müştəri münasibətlərinin idarəedilməsi və debitor borcların monitorinqi</p></div>
        <div className="flex items-center space-x-3">
           <button onClick={() => setShowImportModal(true)} className="flex items-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-black text-[11px] uppercase italic shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all outline-none border-none leading-none"><Upload className="w-5 h-5 mr-2" /><span>Excel İMPORT</span></button>
           <button onClick={() => navigate('/crm/customers/create')} className="flex items-center space-x-2 px-10 py-4 bg-primary-600 text-white rounded-xl font-black text-[11px] uppercase italic shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all outline-none border-none leading-none"><UserPlus className="w-5 h-5 mr-2" /><span>Yeni Müştəri</span></button>
        </div>
      </div>

      {/* BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center space-x-10 z-[100] animate-in slide-in-from-bottom-10 border border-white/10">
           <div className="flex items-center space-x-4 pr-10 border-r border-white/20"><span className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-primary-500/30 font-black italic">{selectedIds.length}</span><span className="text-[11px] uppercase italic font-black">Seçilmiş</span></div>
           <div className="flex items-center space-x-4">
              <button onClick={() => setShowBulkAccountModal(true)} className="flex items-center space-x-2 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5 font-black italic uppercase"><Settings2 className="w-4 h-4 text-emerald-400 font-black italic uppercase" /><span className="text-[10px] uppercase italic font-black">Hesabları Dəyiş</span></button>
              <button onClick={handleBulkDelete} className="flex items-center space-x-2 px-8 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl transition-all border border-rose-500/20 font-black italic uppercase"><Trash2 className="w-4 h-4 font-black italic uppercase" /><span className="text-[10px] uppercase italic font-black">Toplu Sil</span></button>
              <button onClick={() => setSelectedIds([])} className="p-3 hover:bg-white/10 rounded-2xl transition-all font-black italic uppercase"><X className="w-5 h-5 text-slate-400 font-black italic uppercase" /></button>
           </div>
        </div>
      )}



      {/* SEARCH PANEL */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-50">
           <div className="relative flex-1 group font-black italic uppercase w-full">
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary-500 transition-all" />
              <input type="text" placeholder="Reyestrdə axtar (Ad, Kod, VÖEN, Obyekt)..." className="w-full bg-slate-50/70 border-none rounded-[2.5rem] py-6 pl-22 pr-12 text-xs font-black italic outline-none transition-all placeholder:text-slate-400 shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
           </div>
           <div className="flex items-center space-x-3 2xl:space-x-5 font-black italic uppercase">
              <button onClick={() => setIsColumnModalOpen(true)} className="p-6 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all shadow-sm border border-transparent"><Settings className="w-6 h-6 leading-none" /></button>
              <button 
                onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
                className={`p-6 rounded-2xl shadow-sm transition-all border ${isFilterSidebarOpen ? 'bg-emerald-600 text-white shadow-xl translate-y-[-2px] border-emerald-600' : 'bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 active:scale-95 border-transparent'}`}
                title="Filtri Aç (Alt + F)"
              ><Filter className="w-6 h-6 leading-none" /></button>
              <button onClick={() => setShowDownloadModal(true)} className="p-6 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all border shadow-sm active:scale-95 border-transparent"><Download className="w-6 h-6 leading-none" /></button>
           </div>
        </div>
        
        {/* DATA TABLE */}
        <div className="overflow-x-auto min-h-[500px]">
           {isLoading ? (<div className="flex flex-col items-center justify-center p-40 font-black italic uppercase"><Loader2 className="w-16 h-16 text-primary-500 animate-spin mb-6" /><p className="text-[11px] text-slate-400">Məlumatlar emal olunur...</p></div>) : (
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase italic border-b border-slate-100">
                    {activeColumns.map((col, idx) => {
                      const isLeft = col.isStickyLeft;
                      const isRight = col.isStickyRight;
                      const offsetLeft = getStickyLeftOffset(idx);
                      const offsetRight = getStickyRightOffset(idx);
                      
                      return (
                        <th 
                          key={col.id} 
                          className={`px-10 py-10 font-black uppercase text-${col.textAlign || 'left'} ${isLeft ? 'sticky z-20 bg-slate-50 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''} ${isRight ? 'sticky z-20 bg-slate-50 border-l border-slate-200 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}`}
                          style={{
                            width: `${col.width}px`,
                            minWidth: `${col.width}px`,
                            maxWidth: `${col.width}px`,
                            left: isLeft ? `${offsetLeft}px` : 'auto',
                            right: isRight ? `${offsetRight}px` : 'auto'
                          }}
                        >
                          {col.id === 'selection' ? (
                            <button onClick={toggleSelectAll} className={`w-8 h-8 rounded-xl border-2 mx-auto transition-all flex items-center justify-center ${selectedIds.length === paginatedCustomers.length && paginatedCustomers.length > 0 ? 'bg-primary-600 border-primary-600 text-white shadow-2xl' : 'border-slate-200 bg-white shadow-inner'}`}>{selectedIds.length === paginatedCustomers.length && paginatedCustomers.length > 0 && <Check className="w-5 h-5" />}</button>
                          ) : (
                            col.label
                          )}
                        </th>
                      );
                    })}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {paginatedCustomers.length > 0 ? paginatedCustomers.map((v) => (
                     <tr key={v.id} className={`group hover:bg-slate-50/70 transition-all border-b border-slate-50/50 font-black italic ${selectedIds.includes(v.id) ? 'bg-primary-50/40' : ''}`}>
                       {activeColumns.map((col, idx) => {
                         const isLeft = col.isStickyLeft;
                         const isRight = col.isStickyRight;
                         const offsetLeft = getStickyLeftOffset(idx);
                         const offsetRight = getStickyRightOffset(idx);

                         let cellContent = null;
                         switch (col.id) {
                           case 'selection': cellContent = <button onClick={() => toggleSelectOne(v.id)} className={`w-8 h-8 rounded-xl border-2 mx-auto transition-all flex items-center justify-center ${selectedIds.includes(v.id) ? 'bg-primary-600 border-primary-600 text-white shadow-xl' : 'border-slate-200 bg-white shadow-inner'}`}>{selectedIds.includes(v.id) && <Check className="w-5 h-5" />}</button>; break;
                           case 'customer': cellContent = <><p className="text-[14px] text-slate-800 font-black mb-1.5 leading-none tracking-tight">{v.name}</p><p className="text-[10px] text-slate-400 font-bold tracking-widest">{v.code}</p></>; break;
                           case 'object': cellContent = <div className="flex flex-col"><p className="text-[10px] text-indigo-500 font-black uppercase mb-1.5">{v.objectCode || '---'}</p><p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{v.objectName || '---'}</p></div>; break;
                           case 'taxId': cellContent = <div className="font-mono text-[13px] text-slate-600 font-black tracking-tighter italic">{v.taxId || '----'}</div>; break;
                           case 'type_contact': cellContent = <><p className="text-[10px] text-slate-400 font-black mb-2">{v.isForeign ? '✈️ XARİCİ' : '🌍 YERLİ'}</p><p className="text-[11px] text-primary-600 font-black tracking-widest font-black italic">{v.phone || '---'}</p></>; break;
                           case 'vat': cellContent = v.isVatPayer ? (<span className="bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-2xl text-[9px] uppercase tracking-widest inline-flex items-center shadow-inner border border-emerald-100 font-black italic tracking-tighter"><Receipt className="w-4 h-4 mr-2" /> ƏDV ÖDƏYİCİSİ</span>) : (<span className="text-slate-300 text-[10px] uppercase font-black italic tracking-widest leading-none">ƏDV DEYİL</span>); break;
                           case 'accounts': cellContent = <div className="flex items-center justify-center space-x-3"><span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-4 py-2 rounded-xl text-[10px] shadow-sm font-black border border-slate-200">{getAccountCode(v.payableAccountId)}</span><span className="text-slate-200">/</span><span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-4 py-2 rounded-xl text-[10px] shadow-sm font-black border border-emerald-100">{getAccountCode(v.advanceAccountId)}</span></div>; break;
                           case 'actions': cellContent = (
                             <div className="flex items-center justify-end space-x-3 transition-all font-black italic uppercase">
                               <button onClick={() => navigate(`/crm/customers/edit/${v.id}`)} className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm border border-slate-100/50"><Edit2 className="w-5 h-5"/></button>
                               <button onClick={() => navigate(`/crm/customers/detail/${v.id}`)} className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm border border-slate-100/50"><Eye className="w-5 h-5"/></button>
                               <button onClick={() => handleDelete(v.id, v.name)} className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm border border-slate-100/50"><Trash2 className="w-5 h-5"/></button>
                               <button onClick={() => navigate(`/crm/customers/detail/${v.id}`)} className="w-12 h-12 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all ml-2 shadow-sm border border-primary-100/20"><ChevronRight className="w-6 h-6"/></button>
                             </div>
                           ); break;
                         }

                         return (
                           <td 
                             key={`${v.id}-${col.id}`} 
                             className={`px-10 py-12 uppercase font-black italic text-${col.textAlign || 'left'} ${isLeft ? 'sticky z-10 bg-white group-hover:bg-slate-50/70 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]' : ''} ${isRight ? 'sticky z-10 bg-white group-hover:bg-slate-50/70 border-l border-slate-100 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]' : ''} ${selectedIds.includes(v.id) ? 'bg-primary-50/40 group-hover:bg-primary-50/60' : ''}`}
                             style={{
                               left: isLeft ? `${offsetLeft}px` : 'auto',
                               right: isRight ? `${offsetRight}px` : 'auto'
                             }}
                           >
                             {cellContent}
                           </td>
                         );
                       })}
                     </tr>
                  )) : (
                    <tr><td colSpan={activeColumns.length} className="p-40 text-center font-black italic uppercase"><div className="flex flex-col items-center"><Info className="w-12 h-12 text-slate-300 mb-6" /><p className="text-[11px] font-black uppercase text-slate-400 italic">Məlumat tapılmadı</p></div></td></tr>
                  )}
               </tbody>
            </table>
           )}
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between shadow-inner font-black italic uppercase">
           <div className="flex items-center space-x-12 font-black italic uppercase">
              <div className="flex items-center space-x-3 text-xs font-black italic uppercase"><span className="text-[10px] text-slate-400 uppercase italic">SƏTİR SAYI:</span><select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border-2 border-slate-100 rounded-xl px-5 py-2.5 text-[10px] outline-none shadow-sm hover:border-primary-500 transition-all cursor-pointer font-black italic">{[5,10,20,50,100].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black italic">ÜMUMİ REYESTR: <span className="text-primary-600 underline text-lg mx-2">{totalItems}</span> BƏND</p>
           </div>
           <div className="flex items-center space-x-4 font-black italic uppercase">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-4 bg-white border-2 border-slate-100 rounded-[1.2rem] text-slate-300 hover:text-primary-600 transition-all disabled:opacity-20 active:scale-90 font-black italic uppercase"><ChevronsLeft className="w-5 h-5"/></button>
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-4 bg-white border-2 border-slate-100 rounded-[1.2rem] text-slate-300 hover:text-primary-600 transition-all disabled:opacity-20 active:scale-90 font-black italic uppercase"><ChevronLeft className="w-5 h-5"/></button>
              <div className="px-6 flex items-center space-x-3 font-black italic uppercase">
                 {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                    const pageNum = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                    return (
                       <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-12 h-12 rounded-2xl text-[11px] transition-all font-black border-2 ${currentPage === pageNum ? 'bg-primary-600 border-primary-600 text-white shadow-2xl scale-110' : 'bg-white border-slate-50 text-slate-300 hover:border-primary-300 hover:text-primary-600'}`}>{pageNum}</button>
                    );
                 })}
              </div>
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-4 bg-white border-2 border-slate-100 rounded-[1.2rem] text-slate-300 hover:text-primary-600 transition-all disabled:opacity-20 active:scale-90 font-black italic uppercase"><ChevronRight className="w-5 h-5"/></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-4 bg-white border-2 border-slate-100 rounded-[1.2rem] text-slate-300 hover:text-primary-600 transition-all disabled:opacity-20 active:scale-90 font-black italic uppercase"><ChevronsRight className="w-5 h-5"/></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
