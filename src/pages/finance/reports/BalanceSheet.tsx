import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, Printer, 
  ChevronRight, ChevronDown, Calendar,
  RefreshCw,
  Search, Share2, MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { useFormat } from '../../../context/FormatContext';

type PeriodType = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'SINGLE';

interface BalanceRow {
  id: string;
  label: string;
  code?: string;
  isHeader?: boolean;
  isTotal?: boolean;
  level: number;
  values: number[]; // One value per period column
  children?: BalanceRow[];
}

const BalanceSheet = () => {
  const navigate = useNavigate();
  const { formatNumber, formatCurrency, formatDate } = useFormat();
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [periodType, setPeriodType] = useState<PeriodType>('QUARTERLY');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['1', '2', '3']));

  // Generate periods based on dates and type
  const periods = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const cols: { label: string; key: string }[] = [];
    
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    
    while (current <= end) {
      if (periodType === 'MONTHLY') {
        cols.push({
          label: formatDate(current, { month: 'short', year: '2-digit' }).toUpperCase(),
          key: `${current.getFullYear()}-${current.getMonth() + 1}`
        });
        current.setMonth(current.getMonth() + 1);
      } else if (periodType === 'QUARTERLY') {
        const q = Math.floor(current.getMonth() / 3) + 1;
        cols.push({
          label: `Q${q} ${current.getFullYear().toString().slice(2)}`,
          key: `${current.getFullYear()}-Q${q}`
        });
        current.setMonth(current.getMonth() + 3);
      } else if (periodType === 'YEARLY') {
        cols.push({
          label: current.getFullYear().toString(),
          key: `${current.getFullYear()}`
        });
        current.setFullYear(current.getFullYear() + 1);
      } else {
        cols.push({ label: 'YEKUN', key: 'total' });
        break;
      }
    }
    return cols;
  }, [startDate, endDate, periodType]);

  // Mock data generator for columns (Balance Sheet is cumulative)
  const mockValues = (base: number, growth: number = 0.05) => {
    let last = base;
    return periods.map(() => {
      last = last * (1 + (Math.random() * growth));
      return last;
    });
  };

  const reportData: BalanceRow[] = useMemo(() => [
    {
      id: '1',
      label: 'AKTİVLƏR (ASSETS)',
      isHeader: true,
      level: 0,
      values: [],
      children: [
        { id: '1-1', label: 'Dövriyyə Aktivləri', level: 1, values: [], children: [
          { id: '1-1-1', label: 'Ehtiyatlar', code: '205', level: 2, values: mockValues(500000) },
          { id: '1-1-2', label: 'Debitor borcları', code: '211', level: 2, values: mockValues(350000) },
          { id: '1-1-3', label: 'Pul vəsaitləri', code: '221', level: 2, values: mockValues(120000) },
        ]},
        { id: '1-2', label: 'Qeyri-Dövriyyə Aktivləri', level: 1, values: [], children: [
          { id: '1-2-1', label: 'Torpaq, tikili, avadanlıq', code: '111', level: 2, values: mockValues(1500000, 0.01) },
          { id: '1-2-2', label: 'Qeyri-maddi aktivlər', code: '101', level: 2, values: mockValues(85000, 0.01) },
        ]}
      ]
    },
    {
      id: 'total_assets',
      label: 'CƏMİ AKTİVLƏR',
      isTotal: true,
      level: 0,
      values: mockValues(2555000)
    },
    {
       id: 'empty-1', label: '', level: 0, values: periods.map(() => 0), children: []
    },
    {
      id: '2',
      label: 'ÖHDƏLİKLƏR VƏ KAPİTAL',
      isHeader: true,
      level: 0,
      values: [],
      children: [
        { id: '2-1', label: 'Qısamüddətli öhdəliklər', level: 1, values: [], children: [
          { id: '2-1-1', label: 'Kreditor borcları', code: '531', level: 2, values: mockValues(420000) },
          { id: '2-1-2', label: 'Vergi öhdəlikləri', code: '521', level: 2, values: mockValues(85000) },
        ]},
        { id: '2-2', label: 'Səhmdar Kapitalı', level: 1, values: [], children: [
          { id: '2-2-1', label: 'Nizamnamə kapitalı', code: '301', level: 2, values: mockValues(1000000, 0) },
          { id: '2-2-2', label: 'Bölüşdürülməmiş mənfəət', code: '341', level: 2, values: mockValues(1050000) },
        ]}
      ]
    },
    {
      id: 'total_liabilities_equity',
      label: 'CƏMİ ÖHDƏLİKLƏR VƏ KAPİTAL',
      isTotal: true,
      level: 0,
      values: mockValues(2555000)
    }
  ], [periods]);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  const renderRow = (row: BalanceRow) => {
    if (row.label === '') return <tr key={row.id} className="h-6"></tr>;
    
    const hasChildren = row.children && row.children.length > 0;
    const isExpanded = expandedRows.has(row.id);

    return (
      <React.Fragment key={row.id}>
        <tr className={`
          border-b border-slate-50 dark:border-slate-800/50 transition-colors
          ${row.isHeader ? 'bg-slate-50/20' : ''}
          ${row.isTotal ? 'bg-emerald-50/20 dark:bg-emerald-900/10' : 'hover:bg-slate-50/50'}
        `}>
          <td className="px-8 py-4 sticky left-0 bg-inherit z-10 min-w-[300px]">
             <div className="flex items-center" style={{ paddingLeft: `${row.level * 24}px` }}>
                {hasChildren && (
                  <button onClick={() => toggleRow(row.id)} className="mr-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
                <div className="flex flex-col">
                  <span className={`
                    text-xs uppercase tracking-tight
                    ${row.isTotal || row.isHeader ? 'font-black text-slate-800 dark:text-white' : 'font-bold text-slate-600 dark:text-slate-300'}
                  `}>
                    {row.label}
                  </span>
                  {row.code && <span className="text-[9px] font-black text-indigo-500 font-mono tracking-tighter uppercase">{row.code} HESABI</span>}
                </div>
             </div>
          </td>
          {periods.map((p, idx) => (
            <td key={p.key} className={`
              px-6 py-4 text-right tabular-nums
              ${row.isTotal ? 'font-black text-emerald-600 dark:text-emerald-400 text-sm' : 'font-bold text-slate-700 dark:text-slate-200 text-xs'}
              ${idx % 2 === 0 ? 'bg-slate-50/20' : ''}
              ${!row.isHeader && !row.isTotal ? 'cursor-pointer hover:bg-emerald-50/50 group/item' : ''}
            `}
            onClick={() => {
              if (!row.isHeader && !row.isTotal && row.code) {
                navigate(`/finance/general-ledger?accountCode=${row.code}&startDate=${startDate}&endDate=${endDate}`);
              }
            }}
            >
              {row.isHeader ? '' : (
                <div className="flex items-center justify-end space-x-2">
                   <span>{formatCurrency(row.values[idx], 'AZN')}</span>
                   {!row.isTotal && row.code && <ExternalLink className="w-2.5 h-2.5 text-emerald-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />}
                </div>
              )}
            </td>
          ))}
        </tr>
        {hasChildren && isExpanded && row.children!.map(child => renderRow(child))}
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Financial Position</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic tracking-tight">Audit Ready 2026</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Maliyyə Vəziyyəti Haqqında Hesabat (Balans)</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
            <Printer className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 italic">
            <Download className="w-4 h-4" />
            <span>PDF Export</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC FILTERS BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center italic">
                <Calendar className="w-3 h-3 mr-2 text-emerald-500" /> Analiz Dövrü (Başlanğıc)
              </label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-5 text-xs font-black italic shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
           </div>
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center italic">
                <Calendar className="w-3 h-3 mr-2 text-emerald-500" /> Hesabat Tarixi (Son)
              </label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-5 text-xs font-black italic shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
           </div>
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center italic">
                <RefreshCw className="w-3 h-3 mr-2 text-emerald-500" /> Rüblər / Aylar
              </label>
              <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl shadow-inner border border-slate-100/50">
                 {['MONTHLY', 'QUARTERLY', 'YEARLY', 'SINGLE'].map(type => (
                   <button 
                     key={type}
                     onClick={() => setPeriodType(type as PeriodType)}
                     className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all ${periodType === type ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {type === 'MONTHLY' ? 'Aylıq' : type === 'QUARTERLY' ? 'Rüblük' : type === 'YEARLY' ? 'İllik' : 'Vahid'}
                   </button>
                 ))}
              </div>
           </div>
           <div className="pb-1">
              <button className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center italic shadow-lg shadow-emerald-500/20">
                 <RefreshCw className="w-3.5 h-3.5 mr-2" /> Balansı Yenilə
              </button>
           </div>
        </div>
      </div>

      {/* REPORT TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-soft-xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 sticky left-0 bg-white dark:bg-slate-900 z-20 min-w-[300px] border-r border-slate-50 dark:border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                  Maddələr / Hesabat Paneli
                </th>
                {periods.map(p => (
                  <th key={p.key} className="px-6 py-6 text-right min-w-[140px] whitespace-nowrap">
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="shadow-sm">
              {reportData.map(row => renderRow(row))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER INFO */}
        <div className="p-8 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-between items-center">
           <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span className="text-[10px] font-black uppercase text-slate-500 italic">AZ-VAT Ledger Integrated</span>
              </div>
              <div className="flex items-center space-x-2">
                 <Search className="w-3.5 h-3.5 text-slate-400" />
                 <span className="text-[10px] font-bold text-slate-400 italic">IFRS 16 / IAS 1 Uyğunluğu</span>
              </div>
           </div>
           <div className="flex items-center space-x-2">
              <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all rounded-xl hover:bg-white dark:hover:bg-slate-800">
                 <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all rounded-xl hover:bg-white dark:hover:bg-slate-800">
                 <MoreHorizontal className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default BalanceSheet;
