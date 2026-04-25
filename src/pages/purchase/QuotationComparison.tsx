import { useState } from 'react';
import { 
  ArrowLeft, CheckCircle, 
  TrendingDown, TrendingUp,
  Printer,
  FileCheck, ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuotationComparison = () => {
  const navigate = useNavigate();
  
  // Simulation of Multiple Vendor Quotations
  const [quotations, setQuotations] = useState([
    { id: 1, vendor: 'Supplier Group MMC', total: 12500, deliveryDays: 5, score: 92, selected: false, items: [{id: 101, price: 12.50}, {id: 102, price: 45.00}] },
    { id: 2, vendor: 'Azər-Texnik Şirkəti', total: 11800, deliveryDays: 8, score: 85, selected: false, items: [{id: 101, price: 11.80}, {id: 102, price: 42.50}] },
    { id: 3, vendor: 'Global Trade LLC', total: 13200, deliveryDays: 3, score: 95, selected: false, items: [{id: 101, price: 13.20}, {id: 102, price: 48.00}] },
  ]);

  const [items] = useState([
    { id: 101, name: 'Məhsul A', quantity: 500 },
    { id: 102, name: 'Məhsul B', quantity: 100 },
  ]);

  const toggleSelect = (id: number) => {
    setQuotations(quotations.map(q => q.id === id ? { ...q, selected: !q.selected } : { ...q, selected: false }));
  };

  const handleApprove = () => {
    const selected = quotations.find(q => q.selected);
    if (selected) {
      alert(`${selected.vendor} təklifi təsdiq edildi! Satınalma Sifarişi yaradılır.`);
      navigate('/purchase/orders');
    } else {
      alert("Zəhmət olmasa, təsdiq üçün bir təklif seçin.");
    }
  };

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 pb-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">Decision Making</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">CBA Analysis</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Təkliflərin Müqayisəli Cədvəli</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Printer className="w-4 h-4 text-indigo-500" />
            <span>Müqayisə Çapı</span>
          </button>
          <button 
            onClick={handleApprove}
            className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-200 active:scale-95"
          >
            <FileCheck className="w-4 h-4" />
            <span>Seçilmişi Təsdiqlə</span>
          </button>
        </div>
      </div>

      <div className="space-y-12">
        
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {quotations.map(q => (
             <div 
               key={q.id} 
               onClick={() => toggleSelect(q.id)}
               className={`p-10 rounded-[3rem] border-4 transition-all cursor-pointer relative group ${q.selected ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl scale-[1.02]' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 hover:border-indigo-100 shadow-sm'}`}
             >
                {q.selected && <CheckCircle className="absolute top-8 right-8 w-8 h-8 text-white animate-in zoom-in" />}
                <div className="flex items-center space-x-4 mb-8">
                   <div className={`p-4 rounded-2xl ${q.selected ? 'bg-white/10' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                      <Building2 className="w-8 h-8" />
                   </div>
                   <h3 className={`text-sm font-black uppercase tracking-tight italic ${q.selected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                      {q.vendor}
                   </h3>
                </div>
                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <span className={`text-[10px] font-black uppercase tracking-widest italic ${q.selected ? 'text-white/60' : 'text-slate-400'}`}>Ümumi Məbləğ</span>
                      <span className="text-2xl font-black italic tabular-nums">{q.total.toLocaleString()} AZN</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic">
                      <span className={q.selected ? 'text-white/60' : 'text-slate-400'}>Çatdırılma</span>
                      <span>{q.deliveryDays} GÜN</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic">
                      <span className={q.selected ? 'text-white/60' : 'text-slate-400'}>Score</span>
                      <span className={q.selected ? 'text-white' : 'text-indigo-600'}>{q.score}%</span>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* COMPARISON GRID */}
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
           <div className="p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/10 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest italic text-slate-500">Yan-yana Qiymət Müqayisəsi</h3>
              <div className="flex items-center space-x-6">
                 <div className="flex items-center space-x-2 text-[10px] font-black uppercase italic text-emerald-500">
                    <TrendingDown className="w-4 h-4" />
                    <span>Ən ucuz</span>
                 </div>
                 <div className="flex items-center space-x-2 text-[10px] font-black uppercase italic text-rose-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>Ən baha</span>
                 </div>
              </div>
           </div>
           <div className="p-10 overflow-x-auto">
             <table className="w-full text-left font-black italic">
                <thead>
                   <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800">
                      <th className="pb-6 pl-4">Məhsul</th>
                      <th className="pb-6">Miqdar</th>
                      {quotations.map(q => (
                        <th key={q.id} className={`pb-6 text-center ${q.selected ? 'text-indigo-600 bg-indigo-50/30' : ''}`}>
                          {q.vendor} (Qiymət)
                        </th>
                      ))}
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                   {items.map(item => (
                     <tr key={item.id} className="group">
                        <td className="py-6 pl-4 text-slate-800 dark:text-white text-sm">{item.name}</td>
                        <td className="py-6 text-slate-400 text-sm tabular-nums">{item.quantity} ədəd</td>
                        {quotations.map(q => {
                           const price = q.items.find(i => i.id === item.id)?.price || 0;
                           const isMin = price === Math.min(...quotations.map(v => v.items.find(it => it.id === item.id)?.price || 999999));
                           return (
                             <td key={q.id} className={`py-6 text-center tabular-nums ${q.selected ? 'bg-indigo-50/10' : ''}`}>
                                <span className={isMin ? 'text-emerald-500' : 'text-slate-500'}>
                                  {price.toFixed(2)} AZN
                                </span>
                             </td>
                           )
                        })}
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

        {/* WORKFLOW ALERT (Optional) */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100/50 rounded-[3rem] p-10 flex items-center space-x-8 shadow-inner">
           <div className="p-6 bg-amber-500 text-white rounded-[2rem] shadow-xl shadow-amber-500/30">
              <ShieldCheck className="w-10 h-10" />
           </div>
           <div className="flex-1">
              <h4 className="text-sm font-black uppercase text-amber-700 dark:text-amber-400 italic mb-2 tracking-tighter">Təsdiq Mərhələsi Gərəklidir</h4>
              <p className="text-xs font-bold text-amber-600/80 italic leading-relaxed">
                Şirkət tənzimləmələrinə əsasən 10,000 AZN-dən yuxarı satınalmalar üçün Maliyyə Müdiri və CEO təsdiqi tələb olunur.
                Təsdiq verildikdən sonra Satınalma Sifarişi yaradılacaqdır.
              </p>
           </div>
           <div className="flex flex-col items-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-400/50" />
              <span className="text-[9px] font-black uppercase text-amber-400 italic">Settings Based</span>
           </div>
        </div>

      </div>

    </div>
  );
};

export default QuotationComparison;
