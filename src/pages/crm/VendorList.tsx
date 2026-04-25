import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ShoppingBag, Search, UserPlus, Filter, 
  Download, Globe, ChevronRight, 
  MapPin, Loader2, Edit2, Trash2, Eye,
  X, Check, Layout, Settings, ChevronLeft, ChevronsLeft, ChevronsRight,
  Upload, FileUp, Info, FileSpreadsheet, Settings2, Receipt,
  Maximize2, Minimize2, GripVertical
} from 'lucide-react';
import { crmApi, financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

const DEFAULT_COLUMNS = [
  { id: 'selection', label: 'Seçim', isVisible: true, isStickyLeft: false, isStickyRight: false, minWidth: 60, colSpan: 1, textAlign: 'center' },
  { id: 'vendor', label: 'Təchizatçı / Reyestr', isVisible: true, isStickyLeft: true, isStickyRight: false, minWidth: 350, colSpan: 1, textAlign: 'left' },
  { id: 'taxid', label: 'VÖEN', isVisible: true, isStickyLeft: false, isStickyRight: false, minWidth: 150, colSpan: 1, textAlign: 'left' },
  { id: 'type', label: 'Növ & Təyinat', isVisible: true, isStickyLeft: false, isStickyRight: false, minWidth: 150, colSpan: 1, textAlign: 'left' },
  { id: 'vat', label: 'ƏDV Ödəyicisi', isVisible: true, isStickyLeft: false, isStickyRight: false, minWidth: 150, colSpan: 1, textAlign: 'center' },
  { id: 'accounts', label: 'Hesablar', isVisible: true, isStickyLeft: false, isStickyRight: false, minWidth: 200, colSpan: 1, textAlign: 'center' },
  { id: 'actions', label: 'Əməliyyat', isVisible: true, isStickyLeft: false, isStickyRight: false, minWidth: 200, colSpan: 1, textAlign: 'right' }
];

const VendorList = () => {
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
  const [vendors, setVendors] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selection States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Modal States
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkAccountModal, setShowBulkAccountModal] = useState(false);
  const [showColumnConfigModal, setShowColumnConfigModal] = useState(false);

  // Filter States
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [fieldFilters, setFieldFilters] = useState({
    type: 'ALL', // 'ALL' | 'LOCAL' | 'FOREIGN'
    vatPayer: 'ALL', // 'ALL' | 'YES' | 'NO'
    payableAccountId: '',
    advanceAccountId: ''
  });

  // Import States
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'IDLE' | 'PARSING' | 'READY' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [importData, setImportData] = useState<any[]>([]);

  // Export Config
  const [exportFormat, setExportFormat] = useState<'CSV' | 'XLSX'>('XLSX');

  // Bulk Account Form
  const [bulkPayableId, setBulkPayableId] = useState('');
  const [bulkAdvanceId, setBulkAdvanceId] = useState('');

  // Column Configurations
  const [columnConfigs, setColumnConfigs] = useState(DEFAULT_COLUMNS);
  const activeColumns = columnConfigs.filter(c => c.isVisible);

  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-8 animate-in slide-in-from-right duration-300">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Təchizatçı Növü</label>
              <select 
                value={fieldFilters.type} 
                onChange={(e) => setFieldFilters({...fieldFilters, type: e.target.value})} 
                className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase appearance-none"
              >
                <option value="ALL">HAMISI</option>
                <option value="LOCAL">YERLİ TƏCHİZATÇILAR</option>
                <option value="FOREIGN">XARİCİ TƏCHİZATÇILAR</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">ƏDV Ödəyicisi</label>
              <select 
                value={fieldFilters.vatPayer} 
                onChange={(e) => setFieldFilters({...fieldFilters, vatPayer: e.target.value})} 
                className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase appearance-none"
              >
                <option value="ALL">HAMISI</option>
                <option value="YES">BƏLİ (ƏDV ÖDƏYİCİSİ)</option>
                <option value="NO">XEYR (SADƏ)</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Kreditor Hesabı</label>
              <select 
                value={fieldFilters.payableAccountId} 
                onChange={(e) => setFieldFilters({...fieldFilters, payableAccountId: e.target.value})} 
                className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase appearance-none"
              >
                <option value="">BÜTÜN HESABLAR</option>
                {accounts.filter(a => a.code.startsWith('531')).map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
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
                {accounts.filter(a => a.code.startsWith('243')).map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
              </select>
           </div>

           <div className="pt-6">
             <button 
               onClick={() => {
                 setFieldFilters({ type: 'ALL', vatPayer: 'ALL', payableAccountId: '', advanceAccountId: '' });
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
    fetchVendors();
    fetchAccounts();
  }, [activeCompany]);

  const fetchVendors = async () => {
    if (!activeCompany) return;
    setIsLoading(true);
    try {
      const response = await crmApi.getCounterparties(activeCompany.id, 'SUPPLIER');
      setVendors(response.data || []);
    } catch (err) { setError('Yüklənmə xətası'); } finally { setIsLoading(false); }
  };

  const fetchAccounts = async () => {
    if (!activeCompany) return;
    try {
      const res = await financeApi.getAccounts(activeCompany.id);
      setAccounts(res.data || []);
    } catch (e) {}
  };

  const getAccountCode = (id: string) => accounts.find(a => a.id === id)?.code || '---';

  const filteredVendors = vendors.filter(v => {
    // Basic search
    const term = searchTerm.toLowerCase();
    const match = (v.name || '').toLowerCase().includes(term) || (v.code || '').toLowerCase().includes(term) || (v.taxId || '').includes(term);
    
    // Advanced UI Field Filters
    if (fieldFilters.type && fieldFilters.type !== 'ALL') {
      if (fieldFilters.type === 'LOCAL' && v.isForeign) return false;
      if (fieldFilters.type === 'FOREIGN' && !v.isForeign) return false;
    }
    if (fieldFilters.vatPayer && fieldFilters.vatPayer !== 'ALL') {
      if (fieldFilters.vatPayer === 'YES' && !v.isVatPayer) return false;
      if (fieldFilters.vatPayer === 'NO' && v.isVatPayer) return false;
    }
    if (fieldFilters.payableAccountId && v.payableAccountId !== fieldFilters.payableAccountId) return false;
    if (fieldFilters.advanceAccountId && v.advanceAccountId !== fieldFilters.advanceAccountId) return false;

    return match;
  });

  const totalItems = filteredVendors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedVendors.length && paginatedVendors.length > 0) { setSelectedIds([]); } 
    else { setSelectedIds(paginatedVendors.map(v => v.id)); }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!activeCompany || !window.confirm(`'${name}' təchizatçısını silmək istədiyinizə əminsiniz?`)) return;
    try { 
      await crmApi.deleteCounterparty(id); 
      fetchVendors(); 
    } catch (e: any) {
      alert(`Silinmə xətası: ${e?.message || 'Bilinməyən xəta'}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Seçilmiş ${selectedIds.length} təchizatçını silmək istədiyinizə əminsiniz?`)) return;
    setIsLoading(true);
    try { 
      const results = await Promise.allSettled(
        selectedIds.map(id => crmApi.deleteCounterparty(id))
      );
      const failedCount = results.filter(r => r.status === 'rejected').length;
      if (failedCount > 0) {
        alert(`${failedCount} təchizatçını silmək mümkün olmadı (əlaqəli əməliyyatlar mövcud ola bilər). Zəhmət olmasa yoxlayın.`);
      }
    } 
    catch (e) { console.error(e); } 
    finally { 
      setSelectedIds([]); 
      fetchVendors();
      setIsLoading(false); 
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkPayableId && !bulkAdvanceId) { alert('Hər hansı bir hesabı seçin.'); return; }
    setIsBulkUpdating(true);
    try {
      for (const id of selectedIds) {
        const v = vendors.find(x => x.id === id);
        if (v) {
          await crmApi.updateCounterparty(id, {
            ...v,
            payableAccountId: bulkPayableId || v.payableAccountId,
            advanceAccountId: bulkAdvanceId || v.advanceAccountId
          });
        }
      }
      setShowBulkAccountModal(false);
      setSelectedIds([]);
      fetchVendors();
    } catch (e) {} finally { setIsBulkUpdating(false); }
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Şablon');

    const headers = [
      "Təchizatçı Adı", 
      "VÖEN", 
      "Növ", 
      "ƏDV Statusu", 
      "Kreditor Hesabı", 
      "Avans Hesabı", 
      "Bank Adı", 
      "İBAN", 
      "Valyuta"
    ];

    sheet.addRow(headers);
    sheet.getRow(1).font = { bold: true };

    const typeList = '"Yerli,Xarici"';
    const vatList = '"Bəli,Xeyr"';
    const currencyList = '"AZN,USD,EUR,TRY"';
    const payableList = `"${accounts.filter(a => a.code.startsWith('531')).map(a => a.code).join(',')}"`;
    const advanceList = `"${accounts.filter(a => a.code.startsWith('243')).map(a => a.code).join(',')}"`;

    for (let i = 2; i <= 500; i++) {
      sheet.getCell(`C${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [typeList] };
      sheet.getCell(`D${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [vatList] };
      if (payableList !== '""') sheet.getCell(`E${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [payableList] };
      if (advanceList !== '""') sheet.getCell(`F${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [advanceList] };
      sheet.getCell(`I${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [currencyList] };
    }

    sheet.getColumn(1).width = 30; // Name
    sheet.getColumn(2).width = 20; // TaxID
    sheet.getColumn(3).width = 15; // Type
    sheet.getColumn(4).width = 15; // VAT
    sheet.getColumn(5).width = 25; // Payable
    sheet.getColumn(6).width = 25; // Advance
    sheet.getColumn(7).width = 25; // Bank
    sheet.getColumn(8).width = 35; // IBAN
    sheet.getColumn(9).width = 15; // Currency

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vendor_Import_Template.xlsx`;
    link.click();
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
        const isVatString = String(r['ƏDV Statusu'] || r['ƏDV Ödəyicisi'] || r['EDV'] || '').toLowerCase();
        const isForeignString = String(r['Növ'] || r['Təyinat'] || '').toLowerCase();
        
        return {
          name: r['Təchizatçı Adı'] || r['Ad'] || r['AD'] || r['Təchizatçı'] || r['Name'],
          taxId: (r['VÖEN'] || r['VOEN'] || '').toString(),
          isVatPayer: isVatString.includes('bəli') || isVatString.includes('yes') || isVatString === '1',
          isForeign: isForeignString.includes('xarici') || isForeignString.includes('foreign'),
          payableAccountId: fetchAccountIdByCode('Kreditor Hesabı') || accounts.find(a => a.code.startsWith('531'))?.id || '',
          advanceAccountId: fetchAccountIdByCode('Avans Hesabı') || accounts.find(a => a.code.startsWith('243'))?.id || '',
          code: `VEND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          bankAccounts: [{
             bankName: (r['Bank Adı'] || '').toString(),
             iban: (r['İBAN'] || '').toString(),
             currency: (String(r['Valyuta'] || '').toUpperCase()) || 'AZN',
             isActive: true,
             isDefault: true
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
          type: 'SUPPLIER'
        });
      }
      setImportStatus('SUCCESS');
      fetchVendors();
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus('IDLE');
        setImportFile(null);
      }, 2000);
    } catch (err) {
      setImportStatus('ERROR');
    }
  };

  const handleExport = () => {
    const dataSource = selectedIds.length > 0 ? vendors.filter(v => selectedIds.includes(v.id)) : filteredVendors;
    const headers = ["Təchizatçı Adı", "Kod", "VÖEN", "Növ", "ƏDV Statusu", "Kreditor Hesabı", "Avans Hesabı"];
    const rows = dataSource.map(v => [v.name, v.code, v.taxId || '', v.isForeign ? 'Xarici' : 'Yerli', v.isVatPayer ? 'Bəli' : 'Xeyr', getAccountCode(v.payableAccountId), getAccountCode(v.advanceAccountId)]);
    
    if (exportFormat === 'CSV') {
        const csvStr = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `Vendors_${new Date().getTime()}.csv`; link.click();
    } else {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Vendors");
        XLSX.writeFile(wb, `Vendors_${new Date().getTime()}.xlsx`);
    }
    setShowDownloadModal(false);
  };

  // Drag and Drop Logic for Columns
  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    const newCols = [...columnConfigs];
    const draggedItem = newCols[dragIndex];
    newCols.splice(dragIndex, 1);
    newCols.splice(hoverIndex, 0, draggedItem);
    setColumnConfigs(newCols);
  };

  const getStickyLeftOffset = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      if (activeColumns[i].isStickyLeft) { offset += activeColumns[i].minWidth || 150; }
    }
    return offset;
  };

  const getStickyRightOffset = (index: number) => {
    let offset = 0;
    for (let i = activeColumns.length - 1; i > index; i--) {
      if (activeColumns[i].isStickyRight) { offset += activeColumns[i].minWidth || 150; }
    }
    return offset;
  };

  return (
    <div className={`flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 relative ${isContentFullscreen ? 'bg-slate-50 dark:bg-slate-900 border-none' : ''}`}>
      
      {/* EXCEL IMPORT / EXPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center"><FileSpreadsheet className="w-6 h-6 text-emerald-600" /></div>
                    <div><h2 className="text-xl font-black uppercase italic">Excel İmport</h2><p className="text-[10px] font-bold text-slate-400">Toplu təchizatçı yükləmə</p></div>
                 </div>
                 <button onClick={() => setShowImportModal(false)} className="p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 transition-all"><X className="w-5 h-5 text-slate-500"/></button>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                    <div className="px-4"><p className="text-[10px] font-black italic uppercase text-emerald-800">Şablonu Endir</p></div>
                    <button onClick={handleDownloadTemplate} className="px-6 py-3 bg-white text-emerald-600 rounded-2xl font-black text-[10px] border border-emerald-100 shadow-sm hover:scale-105 transition-all outline-none leading-none"><span className="uppercase italic">Şablonu Yüklə (.xlsx)</span></button>
                 </div>
                 
                 <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center space-y-4 cursor-pointer transition-all ${importFile ? 'bg-primary-50 border-primary-500' : 'bg-slate-50 border-slate-200 hover:border-emerald-300'}`}>
                    <input ref={fileInputRef} type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f){ setImportFile(f); parseExcel(f); } }} />
                    <FileUp className={`w-12 h-12 ${importFile ? 'text-primary-500' : 'text-slate-300'}`} />
                    <div className="text-center">
                       <p className="text-sm font-black uppercase italic mb-1">{importFile ? importFile.name : 'Excel faylını bu hissəyə atın'}</p>
                       {!importFile && <p className="text-[10px] font-bold text-slate-400 uppercase">və ya seçmək üçün klikləyin</p>}
                    </div>
                 </div>
                 
                 {importStatus === 'READY' && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-center font-black italic text-xs animate-in fade-in">Yüklənməyə hazır {importData.length} təchizatçı tapıldı.</div>}
                 {importStatus === 'ERROR' && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-center font-black italic text-xs animate-in fade-in">Xəta baş verdi. Zəhmət olmasa şablon strukturunu yoxlayın.</div>}
              </div>
              <div className="mt-12 flex gap-4">
                 <button onClick={() => setShowImportModal(false)} className="flex-1 p-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-3xl font-black uppercase italic text-[10px] transition-all">Ləğv Et</button>
                 <button disabled={importStatus !== 'READY'} onClick={handleExecuteImport} className="flex-grow p-5 bg-emerald-600 text-white rounded-3xl font-black uppercase italic text-[11px] shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center">
                    {importStatus === 'UPLOADING' ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Yüklə'}
                 </button>
              </div>
           </div>
        </div>
      )}



      {/* COLUMN CONFIGURATION MODAL */}
      {showColumnConfigModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 flex flex-col h-[85vh]">
              <div className="flex items-center justify-between mb-8 shrink-0">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center"><Settings2 className="w-6 h-6 text-emerald-600" /></div>
                    <div><h2 className="text-xl font-black uppercase tracking-tight italic">Cədvəl Sütunlarını Tənzimlə</h2><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sürüşdürüb sıralayın və görünüşü tənzimləyin</p></div>
                 </div>
                 <button onClick={() => setShowColumnConfigModal(false)} className="p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 transition-all"><X className="w-5 h-5 text-slate-500"/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-4 space-y-3 custom-scrollbar">
                 {columnConfigs.map((col, index) => (
                    <div 
                      key={col.id} 
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                         e.preventDefault();
                         const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                         moveColumn(dragIndex, index);
                      }}
                      className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-move group">
                       <div className="flex items-center space-x-4">
                          <GripVertical className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                          <span className="font-black italic uppercase text-xs text-slate-700">{col.label}</span>
                       </div>
                       <div className="flex items-center space-x-8">
                          <div className="flex flex-col items-center space-y-1">
                             <span className="text-[8px] font-bold text-slate-400 uppercase">Görünürlük</span>
                             <button onClick={() => {
                                const newCols = [...columnConfigs]; newCols[index].isVisible = !newCols[index].isVisible; setColumnConfigs(newCols);
                             }} className={`w-10 h-6 rounded-full relative transition-all ${col.isVisible ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${col.isVisible ? 'left-5' : 'left-1'}`} />
                             </button>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                             <span className="text-[8px] font-bold text-slate-400 uppercase">Sola Dondur</span>
                             <button onClick={() => {
                                const newCols = [...columnConfigs]; newCols[index].isStickyLeft = !newCols[index].isStickyLeft; if(newCols[index].isStickyLeft) newCols[index].isStickyRight = false; setColumnConfigs(newCols);
                             }} className={`w-10 h-6 rounded-full relative transition-all ${col.isStickyLeft ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${col.isStickyLeft ? 'left-5' : 'left-1'}`} />
                             </button>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                             <span className="text-[8px] font-bold text-slate-400 uppercase">Sağa Dondur</span>
                             <button onClick={() => {
                                const newCols = [...columnConfigs]; newCols[index].isStickyRight = !newCols[index].isStickyRight; if(newCols[index].isStickyRight) newCols[index].isStickyLeft = false; setColumnConfigs(newCols);
                             }} className={`w-10 h-6 rounded-full relative transition-all ${col.isStickyRight ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${col.isStickyRight ? 'left-5' : 'left-1'}`} />
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4 shrink-0">
                 <button onClick={() => setColumnConfigs(DEFAULT_COLUMNS)} className="px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase italic hover:bg-slate-100 transition-all">İlkin vəziyyətə qaytar</button>
                 <button onClick={() => setShowColumnConfigModal(false)} className="flex-1 p-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase italic shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all">Təsdiqlə</button>
              </div>
           </div>
        </div>
      )}

      {/* DOWNLOAD MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 font-black italic">
              <h2 className="text-xl uppercase italic mb-8 flex items-center"><Download className="w-6 h-6 mr-3 text-primary-500" /> Siyahını Endir</h2>
              <div className="space-y-6">
                 <div className="flex gap-4"><button onClick={() => setExportFormat('XLSX')} className={`flex-1 py-4 rounded-xl border-2 transition-all ${exportFormat === 'XLSX' ? 'border-primary-500 bg-primary-50 text-primary-600 font-black' : 'border-slate-50'}`}>EXCEL (.xlsx)</button><button onClick={() => setExportFormat('CSV')} className={`flex-1 py-4 rounded-xl border-2 transition-all ${exportFormat === 'CSV' ? 'border-primary-500 bg-primary-50 text-primary-600 font-black' : 'border-slate-50'}`}>CSV (.csv)</button></div>
                 {selectedIds.length > 0 && <div className="p-4 bg-primary-50 text-primary-700 rounded-2xl text-center text-[11px] font-black italic uppercase">Seçilmiş <span className="text-xl mx-1">{selectedIds.length}</span> bənd endiriləcək.</div>}
              </div>
              <div className="mt-10 flex gap-4"><button onClick={() => setShowDownloadModal(false)} className="flex-1 p-4 bg-slate-100 rounded-2xl text-[10px] uppercase">Ləğv Et</button><button onClick={handleExport} className="flex-grow p-4 bg-primary-600 text-white rounded-2xl text-[10px] uppercase shadow-xl shadow-primary-500/20">Endiri Başlat</button></div>
           </div>
        </div>
      )}

      {/* BULK ACCOUNT MODAL */}
      {showBulkAccountModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 font-black italic">
              <h2 className="text-xl uppercase italic mb-8 flex items-center"><Settings2 className="w-6 h-6 mr-3 text-primary-500" /> Toplu Müxabirləşmə</h2>
              <div className="space-y-6">
                 <div><label className="text-[10px] text-slate-400 uppercase italic mb-2 block">Kreditor Hesabı (531...)</label><select value={bulkPayableId} onChange={(e) => setBulkPayableId(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xs"><option value="">Saxlanılsın...</option>{accounts.filter(a=>a.code.startsWith('531')).map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select></div>
                 <div><label className="text-[10px] text-slate-400 uppercase italic mb-2 block">Avans Hesabı (243...)</label><select value={bulkAdvanceId} onChange={(e) => setBulkAdvanceId(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xs"><option value="">Saxlanılsın...</option>{accounts.filter(a=>a.code.startsWith('243')).map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select></div>
              </div>
              <div className="mt-10 flex gap-4"><button onClick={() => setShowBulkAccountModal(false)} className="flex-1 p-4 bg-slate-100 rounded-xl text-[10px] uppercase">Ləğv Et</button><button onClick={handleBulkUpdate} className="flex-grow p-4 bg-primary-600 text-white rounded-xl text-[10px] uppercase shadow-xl">Yadda Saxla</button></div>
           </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight italic flex items-center">
             <ShoppingBag className="w-8 h-8 mr-4 text-emerald-500 leading-none"/> Təchizatçı Reyestri
          </h1>
          <p className="text-[10px] font-black italic uppercase text-slate-400 mt-2 uppercase tracking-widest leading-none ml-12">Satınalma əməliyyatlarının idarəedilməsi və kreditor borcların uçotu</p>
        </div>
        <div className="flex items-center space-x-3">
           <button onClick={() => setShowImportModal(true)} className="flex items-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-black text-[11px] uppercase italic shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all outline-none border-none leading-none"><Upload className="w-5 h-5 mr-2" /><span>Excel İMPORT</span></button>
           <button onClick={() => navigate('/purchase/vendors/create')} className="flex items-center space-x-2 px-10 py-4 bg-primary-600 text-white rounded-xl font-black text-[11px] uppercase italic shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all outline-none border-none leading-none"><UserPlus className="w-5 h-5 mr-2" /><span>Yeni Təchizatçı</span></button>
        </div>
      </div>

      {/* BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center space-x-10 z-[100] animate-in slide-in-from-bottom-10 border border-white/10">
           <div className="flex items-center space-x-4 pr-10 border-r border-white/20"><span className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-primary-500/30 font-black italic">{selectedIds.length}</span><span className="text-[11px] uppercase italic font-black">Seçilmiş</span></div>
           <div className="flex items-center space-x-4">
              <button onClick={() => setShowBulkAccountModal(true)} className="flex items-center space-x-2 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5 font-black italic uppercase"><Settings2 className="w-4 h-4 text-emerald-400 font-black italic uppercase" /><span className="text-[10px] uppercase italic font-black">Müxabirləşməni Dəyiş</span></button>
              <button onClick={handleBulkDelete} className="flex items-center space-x-2 px-8 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl transition-all border border-rose-500/20 font-black italic uppercase"><Trash2 className="w-4 h-4 font-black italic uppercase" /><span className="text-[10px] uppercase italic font-black">Toplu Sil</span></button>
              <button onClick={() => setSelectedIds([])} className="p-3 hover:bg-white/10 rounded-2xl transition-all font-black italic uppercase"><X className="w-5 h-5 text-slate-400 font-black italic uppercase" /></button>
           </div>
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col relative">
        <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between gap-6">
           <div className="relative flex-1 group max-w-2xl"><Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500" /><input type="text" placeholder="Reyestrdə axtar (Ad, Kod, VÖEN)..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 pl-16 pr-8 text-xs font-black italic shadow-inner outline-none transition-all" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} /></div>
           <div className="flex items-center space-x-4">
              <button 
                 onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
                 title="Zəngin Süzgəc (Alt + F)" 
                 className={`flex items-center px-6 py-4 rounded-2xl shadow-inner transition-all font-black italic uppercase text-[10px] ${isFilterSidebarOpen ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:text-emerald-600'}`}
               ><Filter className="w-5 h-5 mr-2" /> Filtrlər</button>
              <button onClick={() => setShowColumnConfigModal(true)} title="Cədvəl Sütunlarını Tənzimlə" className="p-4 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-2xl shadow-inner transition-all hover:scale-105 active:scale-95"><Settings className="w-5 h-5" /></button>
              <button onClick={() => setShowDownloadModal(true)} title="Siyahını Endir" className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-inner transition-all hover:scale-105 active:scale-95"><Download className="w-5 h-5" /></button>
           </div>
        </div>
        
        <div className="flex-1 overflow-x-auto min-h-[450px]">
           {isLoading ? (<div className="flex flex-col items-center justify-center p-32 h-full"><Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" /><p className="text-[11px] font-black italic uppercase text-slate-400">Datalar gətirilir...</p></div>) : (
            <table className="w-full text-left relative min-w-max border-collapse">
               <thead>
                  <tr className="bg-slate-50/80 uppercase font-black italic text-slate-400 text-[10px] border-b border-slate-100">
                     {activeColumns.map((col, idx) => {
                       const isLeft = col.isStickyLeft;
                       const isRight = col.isStickyRight;
                       const offsetLeft = getStickyLeftOffset(idx);
                       const offsetRight = getStickyRightOffset(idx);
                       
                       return (
                         <th key={col.id} className={`py-6 px-10 border-slate-100 whitespace-nowrap overflow-hidden text-ellipsis text-${col.textAlign || 'left'} ${isLeft ? 'sticky z-20 bg-slate-100/90 backdrop-blur-md shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-r-slate-200' : ''} ${isRight ? 'sticky z-20 bg-slate-100/90 backdrop-blur-md shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] border-l border-l-slate-200' : ''}`} style={{ minWidth: `${col.minWidth}px`, width: `${col.minWidth}px`, left: isLeft ? `${offsetLeft}px` : 'auto', right: isRight ? `${offsetRight}px` : 'auto' }}>
                            {col.id === 'selection' ? (
                               <button onClick={toggleSelectAll} className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-all outline-none border-2 ${selectedIds.length === paginatedVendors.length && paginatedVendors.length > 0 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-200 shadow-inner'}`}>{selectedIds.length === paginatedVendors.length && paginatedVendors.length > 0 && <Check className="w-3.5 h-3.5" />}</button>
                            ) : col.label}
                         </th>
                       )
                     })}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {paginatedVendors.length > 0 ? paginatedVendors.map((v, rowIndex) => (
                     <tr key={v.id} className={`group z-0 hover:bg-slate-50/70 transition-all cursor-pointer ${selectedIds.includes(v.id) ? 'bg-primary-50/40 hover:bg-primary-50/60' : ''}`}>
                        {activeColumns.map((col, idx) => {
                          const isLeft = col.isStickyLeft;
                          const isRight = col.isStickyRight;
                          const offsetLeft = getStickyLeftOffset(idx);
                          const offsetRight = getStickyRightOffset(idx);

                          let cellContent: React.ReactNode = null;
                          switch (col.id) {
                            case 'selection': cellContent = <button onClick={() => toggleSelectOne(v.id)} className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-all outline-none border-2 ${selectedIds.includes(v.id) ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-slate-200 shadow-inner'}`}>{selectedIds.includes(v.id) && <Check className="w-3.5 h-3.5" />}</button>; break;
                            case 'vendor': cellContent = <div className="flex items-center space-x-5"><div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-[1.5rem] flex items-center justify-center text-xl font-black">{v.name[0]?.toUpperCase() || '-'}</div><div><p className="text-sm uppercase text-slate-800 mb-1.5 font-bold tracking-tight">{v.name}</p><p className="text-[10px] text-slate-400 uppercase tracking-widest">{v.code}</p></div></div>; break;
                            case 'taxid': cellContent = <span className="font-mono text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg shadow-inner">{v.taxId || '---'}</span>; break;
                            case 'type': cellContent = v.isForeign ? <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest flex items-center w-fit"><Globe className="w-3 h-3 mr-2" /> Xarici</span> : <span className="bg-primary-50 text-primary-600 px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest flex items-center w-fit"><MapPin className="w-3 h-3 mr-2" /> Yerli</span>; break;
                            case 'vat': cellContent = v.isVatPayer ? <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest inline-flex items-center border border-emerald-100"><Receipt className="w-3 h-3 mr-2" /> ƏDV ÖDƏYİCİSİ</span> : <span className="text-slate-300 text-[9px] uppercase tracking-widest">SADƏ</span>; break;
                            case 'accounts': cellContent = <div className="flex items-center justify-center space-x-3"><span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-[10px] items-center flex border border-slate-200 font-mono tracking-tighter" title="Kreditor"><span className="mr-2 w-2 h-2 rounded-full bg-slate-300"></span>{getAccountCode(v.payableAccountId)}</span><span className="text-slate-200">|</span><span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] items-center flex border border-emerald-100 font-mono tracking-tighter" title="Avans"><span className="mr-2 w-2 h-2 rounded-full bg-emerald-400"></span>{getAccountCode(v.advanceAccountId)}</span></div>; break;
                            case 'actions': cellContent = <div className="flex items-center justify-end space-x-3"><button onClick={() => navigate(`/purchase/vendors/edit/${v.id}`)} className="w-12 h-12 bg-white text-slate-400 rounded-2xl flex items-center justify-center hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm border border-slate-100"><Edit2 className="w-5 h-5" /></button><button onClick={() => navigate(`/purchase/vendors/detail/${v.id}`)} className="w-12 h-12 bg-white text-slate-400 rounded-2xl flex items-center justify-center hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm border border-slate-100"><Eye className="w-5 h-5" /></button><button onClick={() => handleDelete(v.id, v.name)} className="w-12 h-12 bg-white text-slate-400 rounded-2xl flex items-center justify-center hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm border border-slate-100"><Trash2 className="w-5 h-5" /></button><button onClick={() => navigate(`/purchase/vendors/detail/${v.id}`)} className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all ml-2 shadow-sm border border-primary-100/30"><ChevronRight className="w-6 h-6" /></button></div>; break;
                          }

                          return (
                            <td 
                              key={`${v.id}-${col.id}`} 
                              className={`px-10 py-10 uppercase font-black italic text-${col.textAlign || 'left'} ${isLeft ? 'sticky z-10 bg-white group-hover:bg-slate-50/70 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]' : ''} ${isRight ? 'sticky z-10 bg-white group-hover:bg-slate-50/70 border-l border-slate-100 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]' : ''} ${selectedIds.includes(v.id) ? 'bg-primary-50/40 group-hover:bg-primary-50/60' : ''}`}
                              style={{ left: isLeft ? `${offsetLeft}px` : 'auto', right: isRight ? `${offsetRight}px` : 'auto' }}
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

export default VendorList;
