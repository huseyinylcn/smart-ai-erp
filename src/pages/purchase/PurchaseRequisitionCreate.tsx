import { useState } from 'react';
import { 
  ArrowLeft, Calendar, 
  User, Briefcase,
  Plus, Trash2, 
  Save, Printer,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PurchaseRequisitionCreate = () => {
  const navigate = useNavigate();
  
  const [docNumber] = useState('PR-' + Math.floor(Math.random() * 9000 + 1000));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState('');
  const [requester, setRequester] = useState('');
  const [items, setItems] = useState([
    { id: 1, name: '', quantity: 1, unit: 'ədəd', notes: '' }
  ]);
  const [notes, setNotes] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [budgetLink, setBudgetLink] = useState('');

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', quantity: 1, unit: 'ədəd', notes: '' }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSave = () => {
    alert("Satınalma Sorğusu uğurla yaradıldı!");
    navigate('/purchase/requisitions');
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-5">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">Procurement</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Yeni Satınalma Sorğusu (PR)</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Printer className="w-4 h-4" />
            <span>Çap Et</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Yadda Saxla</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INFO SECTION */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Sorğu Nömrəsi</label>
                <div className="relative">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    value={docNumber} 
                    readOnly
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-5 text-sm font-black italic shadow-inner outline-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Tarix</label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-5 text-sm font-black italic shadow-inner outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Departament</label>
                <div className="relative">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-5 text-sm font-black italic shadow-inner outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Departament seçin</option>
                    <option value="IT">IT Departament</option>
                    <option value="HR">HR Departament</option>
                    <option value="ADMIN">İnzibati İşlər</option>
                    <option value="PROD">İstehsalat</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Sorğuçu Şəxs</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Ad, Soyad"
                    value={requester} 
                    onChange={(e) => setRequester(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-5 text-sm font-black italic shadow-inner outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Tələb olunan tarix</label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                  <input 
                    type="date" 
                    value={requiredDate} 
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-5 text-sm font-black italic shadow-inner outline-none ring-1 ring-amber-100 dark:ring-amber-900/30"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Büdcə Referansı (Opsional)</label>
                <div className="relative">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Məs: B-2024-CAPEX-01"
                    value={budgetLink} 
                    onChange={(e) => setBudgetLink(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-5 text-sm font-black italic shadow-inner outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-xs font-black uppercase tracking-widest italic text-slate-500">Mallar və Tələbat Siyahısı</h3>
                <button 
                  onClick={addItem}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Sətir Əlavə Et</span>
                </button>
            </div>
            <div className="p-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-4 pl-2">Malın Adı / Təsviri</th>
                    <th className="pb-4 w-32">Miqdar</th>
                    <th className="pb-4 w-32">Vahid</th>
                    <th className="pb-4">Qeyd</th>
                    <th className="pb-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="group italic-none">
                      <td className="py-4 pr-4 pl-2">
                        <input 
                          type="text" 
                          placeholder="Məs: Ofis kağızı A4"
                          className="w-full bg-transparent text-sm font-black italic outline-none focus:text-indigo-600 transition-all"
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <input 
                          type="number" 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-sm font-black italic outline-none tabular-nums"
                          defaultValue={item.quantity}
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-sm font-black italic outline-none">
                          <option>ədəd</option>
                          <option>kq</option>
                          <option>ton</option>
                          <option>metr</option>
                          <option>paçka</option>
                        </select>
                      </td>
                      <td className="py-4 pr-2">
                        <input 
                          type="text" 
                          placeholder="Əsaslandırma..."
                          className="w-full bg-transparent text-sm font-medium italic text-slate-400 outline-none"
                        />
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SIDE SECTION */}
        <div className="space-y-8">
           <div className="bg-slate-900 dark:bg-indigo-900/20 rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-200 dark:shadow-none">
              <div className="flex items-center space-x-3 mb-6">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-widest italic">Ümumi Qeydlər</h3>
              </div>
              <textarea 
                rows={5}
                placeholder="Bu sorğu haqqında əlavə izahat yazın..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-medium placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-all resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-6 text-center">Status Və Təsdiq</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100/50 dark:border-amber-800/50">
                   <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase italic text-amber-600">Gözləmədə</span>
                   </div>
                   <span className="text-[9px] font-black uppercase text-slate-400">Yeni Sorğu</span>
                </div>
                <p className="text-[9px] font-bold text-slate-400 text-center italic px-4">
                  Bu sorğu təsdiq edildikdən sonra RFQ (Qiymət Təklifi Sorğusu) mərhələsinə keçəcəkdir.
                </p>
                <button 
                  onClick={() => navigate('/purchase/rfq/create', { state: { prId: docNumber, items } })}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 dark:border-indigo-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>RFQ-ya Çevir</span>
                </button>
             </div>
           </div>
        </div>

      </div>

    </div>
  );
};

export default PurchaseRequisitionCreate;
