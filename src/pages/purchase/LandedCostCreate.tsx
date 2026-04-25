import { useState } from 'react';
import { 
  ArrowLeft, Truck,
  Calculator, Plus, Trash2, 
  Save, BarChart3,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandedCostCreate = () => {
  const navigate = useNavigate();
  
  const [docNumber] = useState('LC-' + Math.floor(Math.random() * 9000 + 1000));
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [allocationMethod, setAllocationMethod] = useState('VALUE'); // VALUE or WEIGHT
  
  const [receipts] = useState([
    { id: 'GRN-4521', vendor: 'Supplier Group MMC', totalValue: 8500, weight: 1200 },
    { id: 'GRN-4528', vendor: 'Global Trade LLC', totalValue: 4200, weight: 800 },
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, type: 'Nəqliyyat', amount: 450, vendor: 'Cargo Trans LLC' },
    { id: 2, type: 'Gömrük Rüsumu', amount: 820, vendor: 'Customs' },
  ]);

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now(), type: '', amount: 0, vendor: '' }]);
  };

  const removeExpense = (id: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const handleSave = () => {
    alert("Maya dəyəri əlavələri uğurla malların üzərinə yayıldı!");
    navigate('/inventory');
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
              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner">Costing</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Inventory Valuation</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Maya Dəyəri Əlavələri</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end mr-4 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase italic">Sənəd: {docNumber}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase italic">Tarix: {date}</span>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic shadow-sm"
          >
            <Save className="w-4 h-4 shadow-sm" />
            <span>Hesabla və Təsdiqlə</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 shadow-sm">
        
        {/* LEFT: EXPENSES & TARGETS */}
        <div className="xl:col-span-8 space-y-10 shadow-sm">
          
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
             <div className="flex items-center justify-between mb-8 shadow-sm">
                <div className="flex items-center space-x-4 shadow-sm">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl shadow-sm">
                    <FileSpreadsheet className="w-5 h-5 shadow-sm" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest italic shadow-sm text-slate-700">Addım 1: Mədaxil Sənədlərini Seçin (GRN)</h3>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline shadow-sm">Daha Çox Sənəd Əlavə Et</button>
             </div>
             
             <div className="space-y-4 shadow-sm">
                {receipts.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-inner">
                     <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center font-black text-[10px] text-slate-400 border border-slate-100 shadow-sm">
                           {r.id.split('-')[1]}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-800 dark:text-white italic">{r.id}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase italic">{r.vendor}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-md font-black italic tabular-nums text-indigo-600">₼ {r.totalValue.toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase italic">Çəki: {r.weight} kq</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
             <div className="flex items-center justify-between mb-8 shadow-sm">
                <div className="flex items-center space-x-4 shadow-sm">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl shadow-sm">
                    <Truck className="w-5 h-5 shadow-sm" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest italic shadow-sm text-slate-700">Addım 2: Maya Dəyərinə Daxil Ediləcək Xərclər</h3>
                </div>
                <button 
                  onClick={addExpense}
                  className="flex items-center space-x-2 px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 shadow-sm" />
                  <span>Xərc Əlavə Et</span>
                </button>
             </div>

             <div className="space-y-6 shadow-sm">
                {expenses.map((exp) => (
                  <div key={exp.id} className="grid grid-cols-12 gap-6 items-end group shadow-sm">
                     <div className="col-span-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Xərc Növü</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none">
                           <option value="SHIP">Nəqliyyat</option>
                           <option value="CUSTOMS">Gömrük Rüsumu</option>
                           <option value="INSURE">Sığorta</option>
                           <option value="OTH">Digər</option>
                        </select>
                     </div>
                     <div className="col-span-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Məbləğ (AZN)</label>
                        <input type="number" defaultValue={exp.amount} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none shadow-sm" />
                     </div>
                     <div className="col-span-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Təchizatçı</label>
                        <input type="text" defaultValue={exp.vendor} placeholder="Seçin..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none shadow-sm" />
                     </div>
                     <div className="col-span-1 pb-1">
                        <button onClick={() => removeExpense(exp.id)} className="p-3 text-slate-300 hover:text-rose-500 shadow-sm transition-all">
                           <Trash2 className="w-5 h-5 shadow-sm" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="xl:col-span-4 space-y-10 shadow-sm">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center mb-8 shadow-sm">Bölüşdürmə Metodu</h3>
              <div className="grid grid-cols-1 gap-4 shadow-sm">
                 <button onClick={() => setAllocationMethod('VALUE')} className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group shadow-sm ${allocationMethod === 'VALUE' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-black' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}>
                   <div className="flex items-center space-x-4">
                      <Calculator className="w-5 h-5 text-indigo-500 shadow-sm" />
                      <span className="text-[11px] font-black uppercase tracking-widest italic tracking-tight">Məbləğə Görə</span>
                   </div>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${allocationMethod === 'VALUE' ? 'border-indigo-600 bg-indigo-600 shadow-sm' : 'border-slate-300'}`}>
                    {allocationMethod === 'VALUE' && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm animate-in zoom-in" />}
                   </div>
                 </button>
                 <button onClick={() => setAllocationMethod('WEIGHT')} className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group shadow-sm ${allocationMethod === 'WEIGHT' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-black' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}>
                   <div className="flex items-center space-x-4">
                      <BarChart3 className="w-5 h-5 text-indigo-500 shadow-sm" />
                      <span className="text-[11px] font-black uppercase tracking-widest italic tracking-tight shadow-sm">Çəkiyə Görə</span>
                   </div>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${allocationMethod === 'WEIGHT' ? 'border-indigo-600 bg-indigo-600 shadow-sm' : 'border-slate-300'}`}>
                    {allocationMethod === 'WEIGHT' && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm animate-in zoom-in" />}
                   </div>
                 </button>
              </div>
           </div>

           <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl shadow-slate-900/40 italic-none">
              <div className="flex items-center justify-between mb-8 shadow-sm">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic shadow-sm">Yekun Xərclər</h3>
                 <Calculator className="w-5 h-5 text-indigo-400 shadow-sm" />
              </div>
              <div className="space-y-6 shadow-sm">
                 <div className="flex justify-between items-center shadow-sm">
                    <span className="text-[11px] font-bold text-slate-500 uppercase italic shadow-sm">Cəmi Xərc:</span>
                    <span className="text-3xl font-black italic tabular-nums shadow-sm">₼ {totalExpense.toFixed(2)}</span>
                 </div>
                 <div className="pt-6 border-t border-white/5 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase italic shadow-sm">
                       <span>Maya Dəyəri Artımı:</span>
                       <span className="text-emerald-400 shadow-sm">+{((totalExpense / receipts.reduce((sum, r) => sum + r.totalValue, 0)) * 100).toFixed(2)}%</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-[3rem] p-10 flex items-start space-x-4 shadow-sm">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-1 shadow-sm" />
              <p className="text-[10px] font-bold text-blue-600/80 italic leading-relaxed shadow-sm">
                Təsdiq edildikdən sonra xərclər stokdakı malların alış qiymətinə əlavə olunacaqdır.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LandedCostCreate;
