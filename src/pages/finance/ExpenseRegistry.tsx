import { useState } from 'react';
import { 
  Plus, MoreHorizontal,
  PieChart,
  BookOpen
} from 'lucide-react';
import JournalPreviewModal from '../../components/JournalPreviewModal';

const ExpenseRegistry = () => {
  const [activeTab, setActiveTab] = useState('direct');
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const handleOpenJournal = (expense: any) => {
    setSelectedExpense(expense);
    setIsJournalVisible(true);
  };

  const directExpenses = [
    { id: 1, category: "Ofis Ləvazimatları", date: "28 Mar", amount: "₼ 120", method: "Kassa", provider: "Papirus MMC", status: "Tamamlanıb" },
    { id: 2, category: "Maliyyə Xərcləri", date: "30 Mar", amount: "₼ 45", method: "Bank", provider: "Kapital Bank", status: "Tamamlanıb" },
    { id: 3, category: "Reklam Xərcləri", date: "31 Mar", amount: "₼ 1,200", method: "Kart", provider: "Facebook Ads", status: "Gözləyir" },
  ];

  const landedCosts = [
    { id: 1, source: "PO-2026-001", type: "Gömrük Rüsumu", date: "25 Mar", amount: "₼ 2,450", status: "Paylanıb" },
    { id: 2, source: "PO-2026-005", type: "Nəqliyyat xərci", date: "29 Mar", amount: "₼ 800", status: "Hesablanıb" },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Xərc Mərkəzləri</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Xərclərin Reyestri</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
              <Plus className="w-4 h-4" />
              <span>Yeni Xərc Əlavə Et</span>
           </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Cari Ay Xərc</p>
            <h3 className="text-2xl font-black italic tabular-nums text-slate-800 dark:text-white">₼ 42,500.00</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic mb-2">ƏN ÇOX XƏRC</p>
               <h3 className="text-xl font-black italic text-slate-800 dark:text-white uppercase">Reklam</h3>
            </div>
            <PieChart className="w-10 h-10 text-rose-500 stroke-[2.5px]" />
         </div>
         <div className="bg-indigo-600 p-8 rounded-[3rem] shadow-xl shadow-indigo-500/20 text-white">
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest italic mb-2">Yük Xərcləri (Landed)</p>
            <h3 className="text-2xl font-black italic tabular-nums">₼ 8,240.50</h3>
         </div>
      </div>

      {/* TABS */}
      <div className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
         <button 
           onClick={() => setActiveTab('direct')}
           className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'direct' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >Birbaşa Xərclər</button>
         <button 
           onClick={() => setActiveTab('landed')}
           className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'landed' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >Yük xərcləri (Landed Cost)</button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-3">
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                  <th className="p-8">{activeTab === 'direct' ? 'Kateqoriya' : 'Mənbə (Source)'}</th>
                  <th className="p-8">{activeTab === 'direct' ? 'Təchizatçı' : 'Xərc Növü'}</th>
                  <th className="p-8 text-right">Məbləğ</th>
                  <th className="p-8">{activeTab === 'direct' ? 'Ödəniş Metodu' : 'Tarix'}</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {(activeTab === 'direct' ? directExpenses : landedCosts).map((row: any) => (
                 <tr key={row.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="p-8">
                       <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors">
                          {activeTab === 'direct' ? row.category : row.source}
                       </span>
                    </td>
                    <td className="p-8">
                       <span className="text-[11px] font-black text-slate-500 uppercase italic tracking-widest">
                          {activeTab === 'direct' ? row.provider : row.type}
                       </span>
                    </td>
                    <td className="p-8 text-right font-black italic tabular-nums text-slate-800 dark:text-white">{row.amount}</td>
                    <td className="p-8">
                       <span className="text-[11px] font-black text-slate-400 uppercase italic">
                          {activeTab === 'direct' ? row.method : row.date}
                       </span>
                    </td>
                    <td className="p-8">
                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                         ['Tamamlanıb', 'Paylanıb', 'Hesablanıb'].includes(row.status) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       }`}>{row.status}</span>
                    </td>
                    <td className="p-8 text-right flex items-center justify-end space-x-2">
                       <button 
                         onClick={() => handleOpenJournal(row)}
                         className="p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-500 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100"
                         title="Müxabirləşməyə Bax"
                       >
                         <BookOpen className="w-4.5 h-4.5"/>
                       </button>
                       <button className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-300 hover:text-indigo-600 transition-all"><MoreHorizontal className="w-5 h-5"/></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      <JournalPreviewModal 
          isOpen={isJournalVisible} 
          onClose={() => setIsJournalVisible(false)} 
          periodClosed={true} // For existing documents
          isAdmin={true}
          initialLines={[
            { id: '1', accountCode: '721', accountName: selectedExpense?.category || 'Xərc Hesabı', description: `${selectedExpense?.provider} - ${selectedExpense?.category}`, debit: parseInt(selectedExpense?.amount?.replace(/[^\d]/g, '') || '0'), credit: 0 },
            { id: '2', accountCode: selectedExpense?.method === 'Bank' ? '223' : '221', accountName: selectedExpense?.method === 'Bank' ? 'Bank' : 'Kassa', description: `${selectedExpense?.provider} - ${selectedExpense?.category}`, debit: 0, credit: parseInt(selectedExpense?.amount?.replace(/[^\d]/g, '') || '0') }
          ]}
       />
    </div>
  );
};

export default ExpenseRegistry;
