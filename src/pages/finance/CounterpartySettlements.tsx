import { 
  TrendingUp, 
  ArrowDownLeft, FileText,
  Calendar,
  Plus, Search, Filter
} from 'lucide-react';

const CounterpartySettlements = () => {
  const stats = [
    { id: 1, name: "Ümumi Debitor Borcu", value: "₼ 425,800", change: "+12%", type: "ar", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { id: 2, name: "Ümumi Kreditor Borcu", value: "₼ 184,500", change: "-5%", type: "ap", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { id: 3, name: "Alınmış Avanslar", value: "₼ 92,000", change: "+8%", type: "ar_adv", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { id: 4, name: "Verilmiş Avanslar", value: "₼ 45,600", change: "+2%", type: "ap_adv", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  const agingReport = [
    { range: "0-10 gün", amount: 154000, percentage: 35 },
    { range: "11-30 gün", amount: 125000, percentage: 30 },
    { range: "31-60 gün", amount: 75000, percentage: 15 },
    { range: "61-90 gün", amount: 45000, percentage: 10 },
    { range: "91+ gün", amount: 26800, percentage: 10 },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Maliyyə Kontrolu</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Kontragentlərlə Hesablaşmalar</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm border border-slate-100 dark:border-slate-700 italic">
              <FileText className="w-4 h-4" />
              <span>Üzləşmə Aktı Yarat</span>
           </button>
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
              <Plus className="w-4 h-4" />
              <span>Yeni Hesablaşma</span>
           </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl w-fit mb-6 shadow-sm`}>
              {stat.type.includes('adv') ? <ArrowDownLeft className="w-8 h-8 stroke-[2.5px]" /> : <TrendingUp className="w-8 h-8 stroke-[2.5px]" />}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1 tracking-tighter">{stat.name}</p>
            <div className="flex items-end space-x-3">
               <h3 className="text-2xl font-black italic tabular-nums text-slate-800 dark:text-white">{stat.value}</h3>
               <span className={`text-[10px] font-bold italic mb-1 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* AR AGING SUMMARY */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter tracking-wide">Debitor Borcları (Aging)</h3>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic hover:underline">Detallı Bax</button>
           </div>
           
           <div className="space-y-6">
              {agingReport.map((item, i) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between items-center text-[10px] font-black italic uppercase tracking-widest">
                      <span className="text-slate-500">{item.range}</span>
                      <div className="flex items-center space-x-4">
                         <span className="text-slate-400">₼ {item.amount.toLocaleString()}</span>
                         <span className={item.percentage > 30 ? 'text-rose-500' : 'text-indigo-600'}>{item.percentage}%</span>
                      </div>
                   </div>
                   <div className="w-full h-2.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${item.percentage > 30 ? 'bg-rose-500 shadow-rose-500/20 shadow-lg' : 'bg-indigo-600'}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* PAYMENT PLANNING (AP) */}
        <div className="bg-indigo-600 rounded-[3rem] border border-transparent p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20 flex flex-col justify-between">
           <div className="relative z-10">
              <Calendar className="w-12 h-12 mb-8 opacity-80" />
              <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-6 leading-tight">Ödəniş Planlaması (Cash-Out)</h3>
              <p className="text-[14px] font-black opacity-80 uppercase italic tracking-widest leading-relaxed mb-10">Növbəti 7 gün üçün təsdiqlənmiş kreditor ödənişləri.</p>
              
              <div className="space-y-4">
                 {[
                   { vendor: "Zəfər Marketinq", amount: "₼ 12,400", date: "Sabah", priority: "Urgant" },
                   { vendor: "Global Logistics", amount: "₼ 45,000", date: "02 Aprel", priority: "Normal" },
                 ].map((pay, i) => (
                   <div key={i} className="p-6 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-md flex items-center justify-between">
                      <div>
                         <p className="text-[11px] font-black uppercase italic tracking-tight">{pay.vendor}</p>
                         <p className="text-[9px] font-bold opacity-60 uppercase italic">{pay.date}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-black italic tabular-nums">{pay.amount}</p>
                         <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/20 rounded-md">{pay.priority}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
        </div>
      </div>

      {/* DETAILED RECONCILIATION REGISTRY */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-3">
         <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Son Üzləşmələr & Hesablaşmalar</h3>
            <div className="flex items-center space-x-3">
               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400"><Search className="w-4 h-4"/></button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400"><Filter className="w-4 h-4"/></button>
            </div>
         </div>
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                  <th className="p-8">Kontragent</th>
                  <th className="p-8">Layihə</th>
                  <th className="p-8">Növ</th>
                  <th className="p-8 text-right">Borc (DR)</th>
                  <th className="p-8 text-right">Alacaq (CR)</th>
                  <th className="p-8 text-right">Saldo</th>
                  <th className="p-8">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {[
                 { contractor: "Azercell Telecom", project: "Mobillik Portalı", type: "Alıcı", dr: "12,500", cr: "15,000", saldo: "-2,500 (Avans)", status: "Üzləşib" },
                 { contractor: "Socar Marketing", project: "Yanacaq Təchizatı", type: "Alıcı", dr: "45,000", cr: "0", saldo: "45,000", status: "Kredit Limitedə Yaxın" },
                 { contractor: "Smart Solutions", project: "İT Dəstək", type: "Təchizatçı", dr: "0", cr: "8,900", saldo: "-8,900", status: "Ödəniş Gözləyir" },
               ].map((row, i) => (
                 <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="p-8">
                       <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors">{row.contractor}</span>
                    </td>
                    <td className="p-8">
                       <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">{row.project}</span>
                    </td>
                    <td className="p-8">
                       <span className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase italic">{row.type}</span>
                    </td>
                    <td className="p-8 text-right font-black italic tabular-nums text-slate-800 dark:text-white">{row.dr}</td>
                    <td className="p-8 text-right font-black italic tabular-nums text-slate-400">{row.cr}</td>
                    <td className="p-8 text-right font-black italic tabular-nums text-indigo-600 underline decoration-indigo-200">{row.saldo}</td>
                    <td className="p-8">
                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                         row.status === 'Üzləşib' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       }`}>{row.status}</span>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default CounterpartySettlements;
