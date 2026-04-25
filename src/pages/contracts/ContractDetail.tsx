import { useState } from 'react';
import { 
  ArrowLeft, Calendar, 
  DollarSign, FileText, ClipboardList, Info,
  Download, ChevronRight, 
  ShieldCheck,
  Printer
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ContractDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Simulation of Detailed Contract Data
  const [contract] = useState({
    id: id || 'CONT-2026-0042',
    partner: 'Supplier Group MMC',
    voen: '1401234567',
    type: 'ALIBAL (Mallar)',
    date: '2026-01-15',
    expiryDate: '2027-01-15',
    amount: 250500.00,
    currency: 'AZN',
    status: 'ACTIVE',
    manager: 'Anar Əliyev',
    paymentTerms: '30% Avans, 70% Təslimata 15 gün qalmış',
    description: 'Tikinti materiallarının tədarükü üzrə çərçivə müqaviləsi.'
  });

  // Simulation of linked QRP (Price Agreements)
  const [priceAgreements] = useState([
    { id: 'QRP-2026-015', date: '2026-01-20', status: 'ACTIVE', items: 12 },
    { id: 'QRP-2026-048', date: '2026-03-05', status: 'PENDING', items: 4 }
  ]);

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate('/contracts')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Aktiv Müqavilə</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-sm">{contract.id}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">{contract.partner}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl shadow-inner hover:text-indigo-500 transition-all">
            <Printer className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigate(`/contracts/edit/${contract.id}`)}
            className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic text-center"
          >
            <FileText className="w-4 h-4" />
            <span>Düzəliş Et</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MAIN INFO */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/10">
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="w-4 h-4 text-primary-500 shadow-sm" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ümumi Müqavilə məbləği</span>
              </div>
              <p className="text-2xl font-black text-white italic tabular-nums">₼ {contract.amount.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shadow-sm" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Qəbul edilmiş</span>
              </div>
              <p className="text-2xl font-black text-emerald-500 italic tabular-nums">₼ {(contract.amount * 0.65).toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500 shadow-sm" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Gözlənilən</span>
              </div>
              <p className="text-2xl font-black text-amber-500 italic tabular-nums">₼ {(contract.amount * 0.35).toLocaleString()}</p>
            </div>
          </div>

          {/* DETAILED INFO */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm space-y-10">
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-2xl">
                <Info className="w-5 h-5 shadow-sm" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest italic text-slate-600">Müqavilənin Şərtləri və Təsviri</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-10">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 block">VÖEN (Kontragent)</label>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 tabular-nums italic">{contract.voen}</p>
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 block">Müqavilənin Tipi</label>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 italic">{contract.type}</p>
               </div>
               <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4 block underline decoration-indigo-500/30">Ətraflı Ödəniş Şərtləri</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase italic mb-1">İlkin Ödəniş</span>
                        <span className="text-sm font-black text-indigo-600 italic">30%</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Təslimdən öncə</span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200 italic">30%</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Təslimdən sonra</span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200 italic">40%</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Müddət</span>
                        <span className="text-sm font-black text-emerald-600 italic">15 TG sonra</span>
                     </div>
                  </div>
               </div>
               <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 block">Təsvir</label>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed italic">{contract.description}</p>
               </div>
            </div>
          </div>

          {/* QRP (PRICE AGREEMENTS) TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
                    <ClipboardList className="w-5 h-5 shadow-sm" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest italic text-slate-600">Qiymət Razılaşma Protolları (QRP)</h3>
               </div>
               <button 
                 onClick={() => navigate(`/contracts/price-agreements/create?contractId=${contract.id}`)}
                 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline italic"
               >
                 Yeni QRP Əlavə Et
               </button>
            </div>
            
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800">
                     <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic">Protokol No</th>
                     <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic">Tarix</th>
                     <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic text-center">Mal Sayı</th>
                     <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic text-right">Status</th>
                     <th className="py-4 shadow-sm"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {priceAgreements.map(pa => (
                    <tr 
                      key={pa.id} 
                      onClick={() => navigate(`/contracts/price-agreements/detail/${pa.id}`)}
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                    >
                       <td className="py-5 text-xs font-black text-slate-800 dark:text-white italic tabular-nums">{pa.id}</td>
                       <td className="py-5 text-[11px] font-bold text-slate-400 italic tabular-nums">{pa.date}</td>
                       <td className="py-5 text-center text-xs font-black italic tabular-nums text-indigo-500">{pa.items}</td>
                       <td className="py-5 text-right">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase italic ${pa.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                             {pa.status === 'ACTIVE' ? 'Qüvvədədir' : 'Gözləmədə'}
                          </span>
                       </td>
                       <td className="py-5 text-right">
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-all" />
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: TIMELINE & ACTIONS */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/10">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic mb-8">İcra Vəziyyəti</h3>
              <div className="space-y-8 shadow-sm">
                 <div className="relative pl-8 border-l-2 border-indigo-500/30">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-indigo-500 rounded-full border-4 border-slate-900 shadow-sm shadow-indigo-500/50"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase italic">Müqavilə İmzalandı</p>
                    <p className="text-xs font-bold text-white mt-1 italic tabular-nums">2026-01-15</p>
                 </div>
                 <div className="relative pl-8 border-l-2 border-slate-800">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-700 rounded-full border-4 border-slate-900 shadow-sm"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase italic">İlk Tədarük Gözlənilir</p>
                    <p className="text-xs font-bold text-slate-500 mt-1 italic tabular-nums">2026-04-01</p>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm shadow-sm shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Sənəd Qoşmaları</h3>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all">
                 <div className="flex items-center space-x-4 shadow-sm">
                    <FileText className="w-5 h-5 text-indigo-500 shadow-sm" />
                    <div>
                       <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase italic shadow-sm shadow-sm">Muqavila_Scan.pdf</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase italic shadow-sm shadow-sm shadow-sm">2.4 MB • PDF</p>
                    </div>
                 </div>
                 <Download className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </div>
           </div>
        </div>
        
      </div>
    </div>
  );
};

export default ContractDetail;
