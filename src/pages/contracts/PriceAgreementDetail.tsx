import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, DollarSign, Package, 
  Info, Printer, Edit3, ClipboardList, 
  ChevronRight, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const PriceAgreementDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data
  const [agreement] = useState({
    id: id || 'QRP-2024-8842',
    contractId: 'CONT-SIM-01',
    partner: 'Metal Sənaye (Bakı) MMC',
    date: '2024-09-20',
    status: 'ACTIVE',
    description: 'Oktyabr 2024 dövrü üçün əsas materialların qiymət razılaşması.',
    items: [
      { id: 1, name: 'Profil 40x40', unit: 'metr', price: 4.5, quantity: 500, used: 120 },
      { id: 2, name: 'Boya (Qara)', unit: 'kq', price: 12, quantity: 100, used: 45 },
      { id: 3, name: 'Elektrod 3.2mm', unit: 'paçka', price: 8.5, quantity: null, used: 10 },
    ]
  });

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-amber-600 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Qiymət Protokolu</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-sm">{agreement.id}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">{agreement.partner}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl shadow-inner hover:text-amber-500 transition-all">
            <Printer className="w-4 h-4 shadow-sm" />
          </button>
          <button 
            onClick={() => navigate(`/contracts/price-agreements/edit/${agreement.id}`)}
            className="flex items-center space-x-2 px-8 py-3.5 bg-amber-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-amber-500/20 active:scale-95 italic text-center"
          >
            <Edit3 className="w-4 h-4 shadow-sm" />
            <span>Redaktə Et</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MAIN INFO */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* TOP STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-4 h-4 text-indigo-500 shadow-sm" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Bağlı Müqavilə</span>
              </div>
              <p 
                onClick={() => navigate(`/contracts/detail/${agreement.contractId}`)}
                className="text-lg font-black text-indigo-600 italic cursor-pointer hover:underline"
              >
                {agreement.contractId}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-4 h-4 text-emerald-500 shadow-sm" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Protokol Tarixi</span>
              </div>
              <p className="text-lg font-black text-slate-800 dark:text-white italic tabular-nums">{agreement.date}</p>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
            <div className="flex items-center space-x-4 mb-8">
               <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl shadow-sm">
                 <Package className="w-5 h-5 shadow-sm" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest italic text-slate-600">Razılaşdırılmış Qiymət Siyahısı</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-800">
                       <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic">Məhsul</th>
                       <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic text-center">Vahid</th>
                       <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic text-right">Qiymət (₼)</th>
                       <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic text-right">Miqdar</th>
                       <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic text-right">Məbləğ</th>
                       <th className="py-4 text-[10px] font-black text-slate-400 uppercase italic text-right">İstifadə</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {agreement.items.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group shadow-sm">
                         <td className="py-5 text-xs font-black text-slate-800 dark:text-white italic">{item.name}</td>
                         <td className="py-5 text-center text-[10px] font-bold text-slate-400 italic uppercase">{item.unit}</td>
                         <td className="py-5 text-right text-xs font-black italic tabular-nums text-primary-600">₼ {item.price.toFixed(2)}</td>
                         <td className="py-5 text-right text-xs font-black italic tabular-nums text-slate-700 dark:text-slate-200">
                            {item.quantity ? item.quantity.toLocaleString() : 'Limitsiz'}
                         </td>
                         <td className="py-5 text-right text-xs font-black italic tabular-nums text-indigo-600">
                            {item.quantity ? `₼ ${(item.price * item.quantity).toLocaleString()}` : '-'}
                         </td>
                         <td className="py-5 text-right shadow-sm">
                            <div className="flex flex-col items-end space-y-1 shadow-sm">
                               <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                  <div 
                                    className={`h-full rounded-full ${item.quantity ? (item.used / item.quantity > 0.8 ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-indigo-500'}`}
                                    style={{ width: item.quantity ? `${(item.used / item.quantity) * 100}%` : '100%' }}
                                  />
                               </div>
                               <span className="text-[9px] font-black italic text-slate-400 tabular-nums uppercase">
                                  {item.used} / {item.quantity || '∞'} {item.unit}
                               </span>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ADDITIONAL INFO */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                 <Info className="w-4 h-4 text-amber-500 shadow-sm" />
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status və Təsvir</h3>
              </div>
              <div className="mb-8">
                 <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase italic tracking-widest border border-emerald-100 shadow-sm">
                    QÜVVƏDƏDİR
                 </span>
              </div>
              <p className="text-xs font-bold text-slate-500 leading-relaxed italic border-l-2 border-slate-100 pl-4">
                 {agreement.description}
              </p>
           </div>

           <div className="bg-primary-600 p-10 rounded-[3rem] shadow-2xl shadow-primary-500/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-all">
                 <CheckCircle2 className="w-32 h-32" />
              </div>
              <h3 className="text-[10px] font-black text-primary-200 uppercase tracking-widest italic mb-4 relative z-10">Təsdiq Məlumatı</h3>
              <p className="text-xl font-black italic leading-tight mb-4 relative z-10 shadow-sm">BU PROTOKOL TƏRƏFLƏR ARASINDA TƏSDİQLƏNİB</p>
              <p className="text-[10px] font-bold text-primary-100 opacity-70 italic uppercase relative z-10 shadow-sm">
                 Bütün satınalma sifarişləri bu qiymət limitlərinə əsasən avtomatik yoxlanılır.
              </p>
           </div>
        </div>
        
      </div>
    </div>
  );
};

export default PriceAgreementDetail;
