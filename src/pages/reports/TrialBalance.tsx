import { useState } from 'react';
import { 
  Download, Printer, Search, ChevronRight, 
  Calendar, RefreshCw, Filter
} from 'lucide-react';

interface TrialBalanceRow {
  code: string;
  name: string;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
  isHeader?: boolean;
}

const mockTrialBalance: TrialBalanceRow[] = [
  { code: '103', name: 'Bank AZN', openingDebit: 0, openingCredit: 0, periodDebit: 100000, periodCredit: 59000, closingDebit: 41000, closingCredit: 0 },
  { code: '201', name: 'Mallar (Ehtiyatlar)', openingDebit: 0, openingCredit: 0, periodDebit: 50000, periodCredit: 50000, closingDebit: 0, closingCredit: 0 },
  { code: '211', name: 'Alıcılar (Debitorlar)', openingDebit: 0, openingCredit: 0, periodDebit: 94400, periodCredit: 0, closingDebit: 94400, closingCredit: 0 },
  { code: '241', name: 'Əvəzləşdirilən ƏDV', openingDebit: 0, openingCredit: 0, periodDebit: 9000, periodCredit: 0, closingDebit: 9000, closingCredit: 0 },
  { code: '301', name: 'Nizamnamə Kapitalı', openingDebit: 0, openingCredit: 0, periodDebit: 0, periodCredit: 100000, closingDebit: 0, closingCredit: 100000 },
  { code: '341', name: 'Bölüşdürülməmiş Mənfəət', openingDebit: 0, openingCredit: 0, periodDebit: 0, periodCredit: 20000, closingDebit: 0, closingCredit: 20000 },
  { code: '531', name: 'Təchizatçılar (Kreditorlar)', openingDebit: 0, openingCredit: 0, periodDebit: 59000, periodCredit: 59000, closingDebit: 0, closingCredit: 0 },
  { code: '542', name: 'ƏDV Öhdəliyi', openingDebit: 0, openingCredit: 0, periodDebit: 0, periodCredit: 14400, closingDebit: 0, closingCredit: 14400 },
  { code: '601', name: 'Satışdan Gəlirlər', openingDebit: 0, openingCredit: 0, periodDebit: 0, periodCredit: 80000, closingDebit: 0, closingCredit: 80000 },
  { code: '701', name: 'Satılan Malın Maya Dəyəri', openingDebit: 0, openingCredit: 0, periodDebit: 50000, periodCredit: 0, closingDebit: 50000, closingCredit: 0 },
  { code: '711', name: 'İnzibati Xərclər (Əmək Haqqı)', openingDebit: 0, openingCredit: 0, periodDebit: 10000, periodCredit: 0, closingDebit: 10000, closingCredit: 0 },
];

const TrialBalance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-Q1');
  const [searchTerm, setSearchTerm] = useState('');

  const totals = mockTrialBalance.reduce((acc, row) => {
    if (!row.isHeader) {
      acc.od += row.openingDebit;
      acc.oc += row.openingCredit;
      acc.pd += row.periodDebit;
      acc.pc += row.periodCredit;
      acc.cd += row.closingDebit;
      acc.cc += row.closingCredit;
    }
    return acc;
  }, { od: 0, oc: 0, pd: 0, pc: 0, cd: 0, cc: 0 });

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Maliyyə Hesabatları</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Yoxlama Balansı (Trial Balance)</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-indigo-500/10 underline-offset-4 tracking-tight leading-none mt-2">Dövr üzrə hesabların hərəkəti və yekun qalıqları</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-100 rounded-2xl p-1 shadow-sm">
             <div className="flex items-center px-4 py-2 border-r border-slate-50">
                <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-black uppercase italic cursor-pointer pr-4"
                >
                   <option value="2026-03">Mart 2026</option>
                   <option value="2026-Q1">I Rüb 2026</option>
                   <option value="2025-FY">2025 Tam İl</option>
                </select>
             </div>
             <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                <RefreshCw className="w-4 h-4" />
             </button>
          </div>
          <div className="flex space-x-2">
             <button className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                <Printer className="w-5 h-5" />
             </button>
             <button className="flex items-center space-x-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 active:scale-95 italic">
                <Download className="w-4 h-4" />
                <span>Export</span>
             </button>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Hesab kodu və ya adı ilə filtrle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[14px] focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 transition-all outline-none font-black italic tracking-tight"
            />
         </div>
         <button className="flex items-center space-x-2 px-8 py-3.5 bg-white border border-slate-100 dark:border-slate-800 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all italic">
            <Filter className="w-4 h-4" />
            <span>Təkmil Filtrlər</span>
         </button>
      </div>

      {/* TRIAL BALANCE TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-2">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-[9px] font-black uppercase tracking-widest italic text-slate-400 border-b border-white">
                   <tr>
                      <th className="p-6 row-span-2 border-r border-white">Hesab <br/> Kodu</th>
                      <th className="p-6 row-span-2 border-r border-white">Hesabın Adı</th>
                      <th colSpan={2} className="p-4 text-center border-r border-white bg-slate-100/50">İlkin Qalıq</th>
                      <th colSpan={2} className="p-4 text-center border-r border-white bg-indigo-50/30">Dövr üzrə Hərəkət</th>
                      <th colSpan={2} className="p-4 text-center bg-emerald-50/20">Son Qalıq</th>
                   </tr>
                   <tr className="border-t border-white/50">
                      <th className="p-1" colSpan={2}></th>
                      <th className="p-4 text-right pr-6 italic border-r border-white/30">Debet</th>
                      <th className="p-4 text-right pr-6 italic border-r border-white/30">Kredit</th>
                      <th className="p-4 text-right pr-6 italic border-r border-white/30 text-indigo-600">Debet</th>
                      <th className="p-4 text-right pr-6 italic border-r border-white/30 text-indigo-600">Kredit</th>
                      <th className="p-4 text-right pr-6 italic border-r border-white/30 text-emerald-600">Debet</th>
                      <th className="p-4 text-right pr-6 italic text-emerald-600">Kredit</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {mockTrialBalance.map((row, idx) => (
                     <tr key={idx} className={`group hover:bg-slate-50/50 transition-all ${row.isHeader ? 'bg-slate-50/30' : ''}`}>
                        <td className={`p-5 px-6 font-black tabular-nums italic ${row.isHeader ? 'text-indigo-600' : 'text-slate-500'}`}>
                           {row.code}
                        </td>
                        <td className={`p-5 px-6 uppercase italic tracking-tight ${row.isHeader ? 'font-black text-slate-800' : 'font-bold text-slate-600'}`}>
                           <div className="flex items-center">
                              {row.isHeader ? null : <ChevronRight className="w-3 h-3 mr-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                              {row.name}
                           </div>
                        </td>
                        {/* Opening */}
                        <td className={`p-5 text-right font-black italic tabular-nums bg-slate-50/10 border-l border-white ${row.openingDebit > 0 ? 'text-slate-800' : 'text-slate-300'}`}>
                           {row.openingDebit.toLocaleString()}
                        </td>
                        <td className={`p-5 text-right font-black italic tabular-nums bg-slate-50/10 border-l border-white ${row.openingCredit > 0 ? 'text-slate-800' : 'text-slate-300'}`}>
                           {row.openingCredit.toLocaleString()}
                        </td>
                        {/* Period */}
                        <td className={`p-5 text-right font-black italic tabular-nums bg-indigo-50/5 border-l border-white ${row.periodDebit > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>
                           {row.periodDebit.toLocaleString()}
                        </td>
                        <td className={`p-5 text-right font-black italic tabular-nums bg-indigo-50/5 border-l border-white ${row.periodCredit > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>
                           {row.periodCredit.toLocaleString()}
                        </td>
                        {/* Closing */}
                        <td className={`p-5 text-right font-black italic tabular-nums bg-emerald-50/5 border-l border-white ${row.closingDebit > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
                           {row.closingDebit.toLocaleString()}
                        </td>
                        <td className={`p-5 text-right font-black italic tabular-nums bg-emerald-50/5 border-l border-white ${row.closingCredit > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
                           {row.closingCredit.toLocaleString()}
                        </td>
                     </tr>
                   ))}
                </tbody>
                <tfoot className="bg-slate-900 text-white rounded-b-[2rem]">
                   <tr className="font-black text-[13px] italic">
                      <td colSpan={2} className="p-8 px-10 uppercase tracking-[0.2em] text-[10px]">CƏMİ (TOTAL)</td>
                      <td className="p-8 text-right tabular-nums bg-slate-800/20">{totals.od.toLocaleString()}</td>
                      <td className="p-8 text-right tabular-nums bg-slate-800/20">{totals.oc.toLocaleString()}</td>
                      <td className="p-8 text-right tabular-nums bg-indigo-500/20">{totals.pd.toLocaleString()}</td>
                      <td className="p-8 text-right tabular-nums bg-indigo-500/20">{totals.pc.toLocaleString()}</td>
                      <td className="p-8 text-right tabular-nums bg-emerald-500/20">{totals.cd.toLocaleString()}</td>
                      <td className="p-8 text-right tabular-nums bg-emerald-500/20">{totals.cc.toLocaleString()}</td>
                   </tr>
                </tfoot>
            </table>
         </div>
      </div>

    </div>
  );
};

export default TrialBalance;
