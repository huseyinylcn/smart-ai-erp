import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, MoreHorizontal,
  User,
  Download
} from 'lucide-react';
import { useFormat } from '../../context/FormatContext';

const LeaveRequestList = () => {
  const navigate = useNavigate();
  const { formatDate } = useFormat();
  const [activeTab, setActiveTab] = useState('leaves');

  const leaves: any[] = [];
  const trips: any[] = [];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">HRM Əməliyyatlar</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Məzuniyyət və Ezamiyyətlər</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100 dark:border-slate-700">
              <Download className="w-4 h-4" />
              <span>Hesabatı Çıxar</span>
           </button>
            <button 
               onClick={() => navigate(activeTab === 'leaves' ? '/hr/leaves/create' : '/hr/business-trip/create')}
               className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic"
            >
               <Plus className="w-4 h-4" />
               <span>Yeni Müraciət</span>
            </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
         <button 
           onClick={() => setActiveTab('leaves')}
           className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'leaves' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >Məzuniyyətlər</button>
         <button 
           onClick={() => setActiveTab('trips')}
           className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'trips' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >Ezamiyyətlər</button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-3">
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                  <th className="p-8">Əməkdaş</th>
                  <th className="p-8">{activeTab === 'leaves' ? 'Növ' : 'Məkan (Destination)'}</th>
                  <th className="p-8">Tarix Aralığı</th>
                  <th className="p-8 text-right">{activeTab === 'leaves' ? 'Gün Sayı' : 'Məqsəd'}</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {(activeTab === 'leaves' ? leaves : trips).map((row: any) => (
                 <tr key={row.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="p-8">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><User className="w-5 h-5"/></div>
                          <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors">{row.employee}</span>
                       </div>
                    </td>
                    <td className="p-8">
                       <span className="text-[11px] font-black text-slate-500 uppercase italic tracking-widest">{activeTab === 'leaves' ? row.type : row.destination}</span>
                    </td>
                    <td className="p-8 text-[11px] font-black text-slate-600 dark:text-slate-300 italic tabular-nums uppercase">{formatDate(row.start)} - {formatDate(row.end)}</td>
                    <td className="p-8 text-right">
                       <span className="text-sm font-black italic tracking-tighter text-slate-800 dark:text-white">{activeTab === 'leaves' ? `${row.days} Gün` : row.purpose}</span>
                    </td>
                    <td className="p-8">
                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                         ['Təsdiqlənib', 'Tamamlanıb', 'Planlaşdırılıb'].includes(row.status) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       }`}>{row.status}</span>
                    </td>
                    <td className="p-8 text-right">
                       <button className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-300 hover:text-indigo-600 transition-all"><MoreHorizontal className="w-5 h-5"/></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

    </div>
  );
};

export default LeaveRequestList;
