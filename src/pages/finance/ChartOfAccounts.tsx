import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, 
  ChevronRight, ChevronDown, 
  PlusCircle, RefreshCw, X, Check,
  AlertTriangle, Loader2, Save, Download, FileSpreadsheet, Upload
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useCompany } from '../../context/CompanyContext';
import { financeApi, companyApi } from '../../utils/api';
import standardPlan from '../../data/standardAccountPlan.json';

interface Account {
  id: string;
  section?: string;
  item?: string;
  mainNumber?: string;
  subNumber?: string;
  subSubNumber?: string;
  code: string;
  name: string;
  type: string;
  balanceType: string;
  isSystem: boolean;
  parentId?: string;
}

const ChartOfAccounts = () => {
  const { activeCompany, refreshCompanies } = useCompany();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'IDLE' | 'PARSING' | 'SUCCESS' | 'ERROR'>('IDLE');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAcc, setNewAcc] = useState({
    code: '',
    name: '',
    type: 'Aktiv',
    balanceType: 'Debit',
    subNumber: '',
    subSubNumber: '',
    parentId: undefined as string | undefined
  });

  // Inline Add/Edit
  const [addingToId, setAddingToId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ code: '', name: '', type: '', balanceType: '' });
  const [warning, setWarning] = useState<string | null>(null);

  const handleToggleLock = async () => {
    if (!activeCompany) return;
    const newStatus = !activeCompany.isAccountPlanLocked;
    const confirmMsg = newStatus 
      ? "Hesablar planını kilidləmək istəyirsiniz? Kilidli vəziyyətdə heç bir dəyişiklik edilə bilməyəcək."
      : "Hesablar planının kilidini açmaq istəyirsiniz?";
    
    if (window.confirm(confirmMsg)) {
      try {
        setIsLoading(true);
        await companyApi.updateCompany(activeCompany.id, { isAccountPlanLocked: newStatus });
        await refreshCompanies(); // Context-i yenilə
      } catch (err: any) {
        alert('Xəta baş verdi: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchAccounts = async () => {
    if (!activeCompany) return;
    setIsLoading(true);
    try {
      const res = await financeApi.getAccounts(activeCompany.id);
      setAccounts(res.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeCompany?.id]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const calculateFullCode = (data: typeof newAcc) => {
    return data.code;
  };

  const handleCreateAccount = async () => {
    if (!activeCompany) return;
    try {
      const fullCode = calculateFullCode(newAcc);
      await financeApi.createAccount({
        ...newAcc,
        code: fullCode,
      }, activeCompany.id);
      setShowAddModal(false);
      setNewAcc({
        code: '',
        name: '', type: 'Aktiv', balanceType: 'Debit', subNumber: '', subSubNumber: '', parentId: undefined
      });
      fetchAccounts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!activeCompany || !editingId) return;
    try {
      const res = await financeApi.updateAccount(editingId, editFormData, activeCompany.id);
      if (res.warning) {
        setWarning(res.warning);
      } else {
        setEditingId(null);
        fetchAccounts();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleInlineCreate = async () => {
    if (!activeCompany || !addingToId) return;
    try {
        const parent = accounts.find(a => a.id === addingToId);
        if (!parent) return;
        
        const fullCode = `${parent.code}.${newAcc.subNumber || newAcc.subSubNumber}`;
        await financeApi.createAccount({
            ...newAcc,
            code: fullCode,
            parentId: addingToId,
            type: parent.type // Inherit type from parent
        }, activeCompany.id);
        
        setAddingToId(null);
        setNewAcc({
            code: '',
            name: '', type: 'Aktiv', balanceType: 'Debit', subNumber: '', subSubNumber: '', parentId: undefined
        });
        fetchAccounts();
    } catch (err: any) {
        alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!activeCompany) return;
    if (!window.confirm('Bu hesabı silmək istədiyinizə əminsiniz?')) return;
    try {
      await financeApi.deleteAccount(id, activeCompany.id);
      fetchAccounts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleClearAll = async () => {
    if (!activeCompany) return;
    const nonSystemAccounts = accounts.filter(acc => !acc.isSystem);
    if (nonSystemAccounts.length === 0) {
      alert('Silinəcək qeyri-sistem hesabı yoxdur.');
      return;
    }

    if (!window.confirm(`Diqqət! ${nonSystemAccounts.length} ədəd hesabı tamamilə silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) return;

    setIsLoading(true);
    try {
      // Loop through and delete
      for (const acc of nonSystemAccounts) {
        try {
          await financeApi.deleteAccount(acc.id, activeCompany.id);
        } catch (e) {
          console.error(`Failed to delete account ${acc.code}`, e);
        }
      }
      fetchAccounts();
      alert('Qeyri-sistem hesabları uğurla təmizləndi.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToStandard = async () => {
    if (!activeCompany) return;
    if (!window.confirm('Diqqət! Bütün mövcud hesablar silinəcək və TENGRY SUPPLY standart Hesablar Planı tətbiq olunacaq. Davam etmək istəyirsiniz?')) return;

    setIsLoading(true);
    try {
      // 1. Clear existing non-system
      const nonSystemAccounts = accounts.filter(acc => !acc.isSystem);
      for (const acc of nonSystemAccounts) {
        await financeApi.deleteAccount(acc.id, activeCompany.id);
      }

      // 2. Import standard plan with hierarchy
      const sortedPlan = [...standardPlan].sort((a, b) => a.code.length - b.code.length);
      const codeToIdMap = new Map<string, string>();

      for (const item of sortedPlan) {
        // Skip if already exists (some might be system accounts)
        const existing = accounts.find(a => a.code === item.code);
        if (existing) {
          codeToIdMap.set(existing.code, existing.id);
          continue;
        }

        let parentId: string | undefined = undefined;
        if (item.code.includes('.')) {
          const parentCode = item.code.split('.').slice(0, -1).join('.');
          parentId = codeToIdMap.get(parentCode);
        }

        const res = await financeApi.createAccount({
          code: item.code,
          name: item.name,
          type: item.type,
          balanceType: item.balanceType,
          isSystem: true, // Mark as system as requested
          parentId
        }, activeCompany.id);

        if (res.data?.id) {
          codeToIdMap.set(item.code, res.data.id);
        }
      }

      await fetchAccounts();
      alert('Sistem standart Hesablar Planı uğurla tətbiq edildi.');
    } catch (err: any) {
      alert('Xəta baş verdi: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    // Flatten accounts tree for excel
    const flattenData = accounts.map(acc => ({
      'Hesab Kodu': acc.code,
      'Hesabın Adı': acc.name,
      'Növü': acc.type,
      'Balans Tipi': acc.balanceType
    })).sort((a, b) => a['Hesab Kodu'].localeCompare(b['Hesab Kodu']));

    const ws = XLSX.utils.json_to_sheet(flattenData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hesablar Planı");
    
    // Set column widths
    const wscols = [
      {wch: 15}, // Code
      {wch: 50}, // Name
      {wch: 15}, // Type
      {wch: 15}, // Balance Type
    ];
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, `Hesablar_Plani_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDownloadTemplate = () => {
    // Empty template with correct headers and example row
    const templateData = [
      {
        'Hesab Kodu': '101',
        'Hesabın Adı': 'Kassa (Nümunə)',
        'Növü': 'Aktiv',
        'Balans Tipi': 'Debit'
      },
      {
        'Hesab Kodu': '531',
        'Hesabın Adı': 'Təchizatçılar (Nümunə)',
        'Növü': 'Öhdəlik',
        'Balans Tipi': 'Credit'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Şablon");
    
    const wscols = [
      {wch: 15}, // Code
      {wch: 50}, // Name
      {wch: 15}, // Type
      {wch: 15}, // Balance Type
    ];
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, `Hesablar_Plani_SABLON.xlsx`);
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCompany) return;

    setImportStatus('PARSING');
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        // Sort by code length to ensure parents are created before children
        const sortedData = [...data].sort((a, b) => {
          const codeA = String(a['Hesab Kodu'] || '');
          const codeB = String(b['Hesab Kodu'] || '');
          return codeA.length - codeB.length;
        });

        const codeToIdMap = new Map<string, string>();
        // Also seed with existing accounts
        accounts.forEach(acc => codeToIdMap.set(acc.code, acc.id));

        let successCount = 0;
        for (const row of sortedData) {
          const code = String(row['Hesab Kodu'] || '').trim();
          const name = String(row['Hesabın Adı'] || '').trim();
          const type = String(row['Növü'] || 'Asset').trim();
          const balanceType = String(row['Balans Tipi'] || 'Debit').trim();

          if (code && name) {
            // Skip if already exists
            if (codeToIdMap.has(code)) continue;

            // Find parentId from code (e.g., 101.01 -> parent 101)
            let parentId: string | undefined = undefined;
            if (code.includes('.')) {
              const parts = code.split('.');
              const parentCode = parts.slice(0, -1).join('.');
              parentId = codeToIdMap.get(parentCode);
            }

            try {
              const res = await financeApi.createAccount({
                code,
                name,
                type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
                balanceType: balanceType.charAt(0).toUpperCase() + balanceType.slice(1).toLowerCase(),
                parentId
              }, activeCompany.id);

              if (res.data?.id) {
                codeToIdMap.set(code, res.data.id);
                successCount++;
              }
            } catch (e) {
              console.warn(`Failed to create account ${code}`, e);
            }
          }
        }
        setImportStatus('SUCCESS');
        await fetchAccounts();
        alert(`${successCount} hesab uğurla idxal edildi.`);
        setTimeout(() => setImportStatus('IDLE'), 3000);
      } catch (err) {
        console.error(err);
        setImportStatus('ERROR');
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const startEdit = (acc: Account) => {
    setEditingId(acc.id);
    setEditFormData({ 
      code: acc.code, 
      name: acc.name, 
      type: acc.type, 
      balanceType: acc.balanceType 
    });
    setWarning(null);
  };

  const getSubAccounts = (parentId: string) => {
    return accounts.filter(acc => acc.parentId === parentId);
  };

  const getAccountTypeColor = (type: string) => {
    const t = type?.toUpperCase();
    switch (t) {
      case 'AKTIV':
      case 'ASSET': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'ÖHDƏLIK':
      case 'ÖHDƏLİK':
      case 'LIABILITY': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'KAPITAL':
      case 'EQUITY': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'GƏLIR':
      case 'GƏLİR':
      case 'REVENUE': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'XƏRC':
      case 'EXPENSE': return 'text-sky-600 bg-sky-50 border-sky-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getBalanceTypeBadge = (balance: string) => {
    switch (balance?.toLowerCase()) {
      case 'debit': return 'text-emerald-500 bg-emerald-50/50 border-emerald-100';
      case 'credit': return 'text-rose-500 bg-rose-50/50 border-rose-100';
      case 'hər ikisi':
      case 'both': return 'text-indigo-500 bg-indigo-50/50 border-indigo-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  const topLevelAccounts = accounts.filter(acc => 
    !acc.parentId && (acc.code.includes(searchQuery) || acc.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderAccountRows = (acc: Account, depth = 0) => {
    const children = getSubAccounts(acc.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.includes(acc.id);

    return (
      <React.Fragment key={acc.id}>
        {editingId === acc.id ? (
          <tr className="bg-indigo-50/50 dark:bg-indigo-900/10">
            <td className="p-8 text-center" style={{ paddingLeft: `${depth * 2 + 2}rem` }}>
              <input 
                value={editFormData.code} 
                onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                className="w-24 bg-white border border-indigo-200 rounded-xl py-2 px-3 text-sm font-black text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </td>
            <td className="p-8">
              <input 
                value={editFormData.name} 
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full bg-white border border-indigo-200 rounded-xl py-2 px-4 text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </td>
            <td className="p-8 text-center">
              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border ${getAccountTypeColor(acc.type)}`}>
                 {acc.type}
              </span>
            </td>
            <td className="p-8 text-center">
              <select 
                value={editFormData.balanceType} 
                onChange={(e) => setEditFormData({ ...editFormData, balanceType: e.target.value })}
                className="bg-white border border-indigo-200 rounded-xl py-2 px-3 text-[11px] font-black outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Debit">Debet</option>
                <option value="Credit">Kredit</option>
                <option value="Hər ikisi">Hər ikisi</option>
              </select>
            </td>
            <td className="p-8 text-right pr-12">
              <div className="flex justify-end space-x-2">
                <button onClick={handleUpdate} className="p-3 bg-emerald-600 text-white rounded-xl hover:scale-105 transition-all"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditingId(null)} className="p-3 bg-slate-200 text-slate-600 rounded-xl hover:scale-105 transition-all"><X className="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        ) : (
          <tr className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer ${isExpanded ? 'bg-slate-50/30' : ''}`}>
            <td className="p-8 text-center" style={{ paddingLeft: depth > 0 ? `${depth * 3 + 2}rem` : '2rem' }}>
              <div className="flex items-center justify-center space-x-3">
                {hasChildren && (
                  <button onClick={(e) => { e.stopPropagation(); toggleExpand(acc.id); }} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
                <span className={`text-${depth === 0 ? 'xl' : 'lg'} font-black ${depth === 0 ? 'text-slate-800 dark:text-white' : 'text-indigo-600'} tabular-nums group-hover:text-indigo-600 transition-colors italic`}>
                  {acc.code}
                </span>
              </div>
            </td>
            <td className="p-8">
              <span className={`text-sm font-black ${depth === 0 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'} uppercase italic tracking-tighter group-hover:text-indigo-900 dark:group-hover:text-white transition-colors`}>
                {acc.name}
              </span>
            </td>
            <td className="p-8 text-center">
              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border ${getAccountTypeColor(acc.type)}`}>
                {acc.type}
              </span>
            </td>
            <td className="p-8 text-center">
              <div className="flex items-center justify-center">
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border ${getBalanceTypeBadge(acc.balanceType)}`}>
                  {acc.balanceType === 'Debit' ? 'Debet' : acc.balanceType === 'Credit' ? 'Kredit' : 'Hər ikisi'}
                </span>
              </div>
            </td>
            <td className="p-8 text-right pr-12">
              <div className="flex items-center justify-end space-x-1">
                {!activeCompany?.isAccountPlanLocked && (
                  <>
                    {depth < 2 && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation();
                          setAddingToId(acc.id); 
                          setExpandedIds([...expandedIds, acc.id]); 
                          setNewAcc({ ...newAcc, subNumber: '', subSubNumber: '', name: '' });
                        }}
                        title="Alt hesab əlavə et"
                        className="w-11 h-11 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center active:scale-90"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); startEdit(acc); }} className="w-11 h-11 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-all flex items-center justify-center active:scale-90">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    {!acc.isSystem && (
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(acc.id); }} className="w-11 h-11 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center active:scale-90">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
                {activeCompany?.isAccountPlanLocked && (
                  <span className="p-2 text-slate-300" title="Hesablar planı kilidli olduğu üçün dəyişiklik edilə bilməz.">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                )}
              </div>
            </td>
          </tr>
        )}

        {/* INLINE ADD ROW */}
        {addingToId === acc.id && (
          <tr className="bg-emerald-50/30 border-l-4 border-emerald-500 animate-in slide-in-from-left-2 duration-300">
            <td className="p-6">
              <input 
                autoFocus
                placeholder="Kod..."
                className="w-24 bg-white border border-emerald-200 rounded-lg py-1 px-2 text-sm font-black outline-none focus:ring-2 focus:ring-emerald-500/20 text-center"
                value={newAcc.code}
                onChange={e => setNewAcc({...newAcc, code: e.target.value})}
              />
            </td>
            <td className="p-6">
              <input 
                placeholder="Yeni hesabın adı..."
                className="w-full bg-white border border-emerald-200 rounded-xl py-2 px-4 text-sm font-black outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black italic tracking-tight"
                value={newAcc.name}
                onChange={e => setNewAcc({...newAcc, name: e.target.value})}
              />
            </td>
            <td className="p-6 text-center">
              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border ${getAccountTypeColor(acc.type)}`}>
                {acc.type}
              </span>
            </td>
            <td className="p-6 text-center">
              <select 
                value={newAcc.balanceType} 
                onChange={(e) => setNewAcc({...newAcc, balanceType: e.target.value})}
                className="bg-white border border-emerald-200 rounded-lg py-1 px-3 text-[10px] font-black outline-none focus:ring-2 focus:ring-emerald-500/20 text-center"
              >
                <option value="Debit">Debet</option>
                <option value="Credit">Kredit</option>
                <option value="Hər ikisi">Hər ikisi</option>
              </select>
            </td>
            <td className="p-6 text-right pr-12">
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={handleInlineCreate} 
                  className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 active:scale-90 transition-all font-black italic shadow-emerald-200/50"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setAddingToId(null)} className="p-3 bg-slate-200 text-slate-500 rounded-xl active:scale-90 transition-all font-black italic">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}

        {/* RECURSIVE RENDER CHILDREN */}
        {isExpanded && children.map(child => renderAccountRows(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 relative">
      
      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Yeni Hesab Əlavə Et</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X/></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase italic">Hesabın Kodu</label>
                  <input value={newAcc.code} onChange={e => setNewAcc({...newAcc, code: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Məs: 101 və ya 101.01"/>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase italic">Hesabın Adı</label>
                  <input value={newAcc.name} onChange={e => setNewAcc({...newAcc, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Hesabın adı..."/>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase italic">Hesabın Növü</label>
                  <select value={newAcc.type} onChange={e => setNewAcc({...newAcc, type: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none">
                     <option value="Aktiv">Aktiv (Asset)</option>
                     <option value="Öhdəlik">Öhdəlik (Liability)</option>
                     <option value="Kapital">Kapital (Equity)</option>
                     <option value="Gəlir">Gəlir (Revenue)</option>
                     <option value="Xərc">Xərc (Expense)</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase italic">Balans Tipi</label>
                  <select value={newAcc.balanceType} onChange={e => setNewAcc({...newAcc, balanceType: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none">
                     <option value="Debit">Debet</option>
                     <option value="Credit">Kredit</option>
                     <option value="Hər ikisi">Hər ikisi</option>
                  </select>
               </div>
            </div>
            
            <div className="mt-10 flex gap-4">
               <button onClick={() => setShowAddModal(false)} className="flex-1 p-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[11px] italic">Ləğv Et</button>
               <button onClick={handleCreateAccount} className="flex-1 p-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] italic shadow-xl shadow-indigo-500/20">Yadda Saxla</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Mühasibat Uçotu</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Hesablar Planı</h1>
          <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase italic tracking-widest leading-none">Vahid Hesablar Planı (AZ-2024)</p>
        </div>
        <div className="flex items-center space-x-3">
           <button 
             onClick={handleDownloadExcel}
             className="flex items-center space-x-2 px-8 py-3.5 bg-white dark:bg-slate-900 text-indigo-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/5 active:scale-95 italic border border-indigo-100 dark:border-indigo-900/30"
           >
              <Download className="w-4 h-4" />
              <span>Cari Planı Yüklə</span>
           </button>

           <button 
             onClick={handleDownloadTemplate}
             className="flex items-center space-x-2 px-8 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 italic border border-slate-200 dark:border-slate-700"
           >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Şablonu Yüklə</span>
           </button>

           <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportExcel} 
              className="hidden" 
              accept=".xlsx, .xls"
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={isLoading || importStatus === 'PARSING'}
             className="flex items-center space-x-2 px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 italic"
           >
              {importStatus === 'PARSING' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{importStatus === 'SUCCESS' ? 'Uğurla Yükləndi!' : 'Excel İMPORT'}</span>
           </button>

           <button 
             onClick={handleResetToStandard}
             disabled={isLoading || activeCompany?.isAccountPlanLocked}
             className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95 italic border border-indigo-200 dark:border-indigo-800 disabled:opacity-50"
             title="TENGRY SUPPLY standart planını tətbiq et"
           >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sistem Planına Sıfırla</span>
           </button>

           <button 
             onClick={handleClearAll}
             disabled={isLoading || activeCompany?.isAccountPlanLocked}
             className="flex items-center space-x-2 px-8 py-3.5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 italic border border-rose-100 dark:border-rose-800 disabled:opacity-50"
           >
              <Trash2 className="w-4 h-4" />
              <span>Səhifəni Təmizlə</span>
           </button>

           <button 
             onClick={async () => {
               if (!activeCompany) return;
               const newStatus = !activeCompany.isAccountPlanLocked;
               const confirmMsg = newStatus 
                 ? "Hesablar planını kilidləmək istəyirsiniz? Kilidli vəziyyətdə heç bir dəyişiklik edilə bilməyəcək."
                 : "Hesablar planının kilidini açmaq istəyirsiniz?";
               
               if (window.confirm(confirmMsg)) {
                 try {
                   setIsLoading(true);
                   await companyApi.updateCompany(activeCompany.id, { isAccountPlanLocked: newStatus });
                   await refreshCompanies(); // Context-i yenilə
                 } catch (err: any) {
                   alert('Xəta baş verdi: ' + err.message);
                 } finally {
                   setIsLoading(false);
                 }
               }
             }}
             disabled={isLoading}
             className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 italic border ${
               activeCompany?.isAccountPlanLocked 
                 ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/10' 
                 : 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/10'
             }`}
           >
              {activeCompany?.isAccountPlanLocked ? <AlertTriangle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{activeCompany?.isAccountPlanLocked ? 'Kilidi Aç' : 'Yadda Saxla və Kilidlə'}</span>
           </button>

           <button 
             onClick={fetchAccounts}
             disabled={isLoading}
             className="flex items-center space-x-2 px-8 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100 dark:border-slate-700 disabled:opacity-50"
           >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Yenilə</span>
           </button>
           {!activeCompany?.isAccountPlanLocked && (
             <button 
               onClick={() => setShowAddModal(true)}
               className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic"
             >
                <Plus className="w-4 h-4" />
                <span>Yeni Hesab</span>
             </button>
           )}
        </div>
      </div>

      {/* SEARCH/FILTER */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Hesab kodu və ya adı ilə axtarış (məs. 101, Kassa, Satış)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[14px] focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 transition-all outline-none font-black italic tracking-tight"
            />
         </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-3">
         {warning && (
            <div className="mb-4 mx-4 mt-4 p-4 bg-amber-50 border-2 border-amber-500 text-amber-700 rounded-2xl flex items-center justify-between font-black text-xs uppercase tracking-tight animate-in slide-in-from-top-2">
               <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  {warning}
               </div>
               <button onClick={() => { setWarning(null); setEditingId(null); fetchAccounts(); }} className="p-2 hover:bg-amber-100 rounded-xl transition-all">
                  <Check className="w-5 h-5 text-emerald-600" />
               </button>
            </div>
         )}

         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                  <th className="p-8 w-48 text-center">Hesab Kodu</th>
                  <th className="p-8">Hesabın Adı / Tərifi</th>
                  <th className="p-8 text-center">Növü (Type)</th>
                  <th className="p-8 text-center">Balans Tipi</th>
                  <th className="p-8 text-right pr-12">Əməliyyat</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {topLevelAccounts.map(acc => renderAccountRows(acc))}
            </tbody>
         </table>
      </div>

    </div>
  );
};

export default ChartOfAccounts;
