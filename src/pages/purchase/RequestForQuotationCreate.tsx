import { useState } from 'react';
import { 
  ArrowLeft, Calendar, 
  Truck, Mail,
  Plus, Trash2, 
  Send, Printer,
  MessageSquare,
  FileText,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RequestForQuotationCreate = () => {
  const navigate = useNavigate();
  
  const [docNumber] = useState('RFQ-' + Math.floor(Math.random() * 9000 + 1000));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [items, setItems] = useState([
    { id: 1, name: '', quantity: 1, unit: 'ədəd', lastPrice: '0.00' }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', quantity: 1, unit: 'ədəd', lastPrice: '0.00' }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSend = () => {
    alert("RFQ təchizatçıya uğurla göndərildi!");
    navigate('/purchase/orders');
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-5">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-orange-600 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">Procurement Loop</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Qiymət Təklifi Sorğusu (RFQ)</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Printer className="w-4 h-4" />
            <span>Çap Formatı</span>
          </button>
          <button 
            onClick={handleSend}
            className="flex items-center space-x-2 px-6 py-2.5 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-orange-200 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Göndər</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INFO SECTION */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">RFQ Nömrəsi</label>
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Sorğu Tarixi</label>
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Təchizatçı</label>
                <div className="relative">
                  <Truck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select 
                    value={vendor} 
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-5 text-sm font-black italic shadow-inner outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Təchizatçı seçin</option>
                    <option value="V1">Supplier Group MMC</option>
                    <option value="V2">Azər-Texnik Şirkəti</option>
                    <option value="V3">Global Trade LLC</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Son Cavab Tarixi</label>
                <div className="relative">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="date" 
                    value={expiryDate} 
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-5 text-sm font-black italic shadow-inner outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/10">
                <h3 className="text-xs font-black uppercase tracking-widest italic text-slate-500">Sorğu Olunan Mallar</h3>
                <button 
                  onClick={addItem}
                   className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-md shadow-orange-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Sətir Əlavə Et</span>
                </button>
            </div>
            <div className="p-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-4 pl-2">Məhsul / Xidmət</th>
                    <th className="pb-4 w-32">Miqdar</th>
                    <th className="pb-4 w-32">Vahid</th>
                    <th className="pb-4 w-32 text-right">Referans Qiymət</th>
                    <th className="pb-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="group italic-none">
                      <td className="py-4 pr-4 pl-2">
                        <input 
                          type="text" 
                          placeholder="Məhsul adını daxil edin"
                          className="w-full bg-transparent text-sm font-black italic outline-none focus:text-orange-600 transition-all"
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
                          <option>m²</option>
                        </select>
                      </td>
                      <td className="py-4 pr-2 text-right">
                         <input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          className="w-full bg-transparent text-right text-sm font-black italic text-slate-400 outline-none tabular-nums"
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
           <div className="bg-slate-900 dark:bg-orange-900/20 rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-200 dark:shadow-none font-black italic">
              <div className="flex items-center space-x-3 mb-6">
                <Mail className="w-6 h-6 text-orange-400" />
                <h3 className="text-xs font-black uppercase tracking-widest italic">E-poçt Şablonu</h3>
              </div>
              <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
                Təchizatçıya göndəriləcək məktub daxili RFQ sənədinə əsasən avtomatik formalaşacaq.
              </p>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <span className="text-[9px] uppercase text-orange-400">Suallarınız:</span>
                 <p className="text-[11px] mt-2 text-white/50">Münasib qiymət və çatdırılma vaxtı barədə məlumat verməyinizi xahiş edirik.</p>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
              <div className="flex items-center space-x-3 mb-6 justify-center">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
                 <h3 className="text-xs font-black uppercase tracking-widest italic">Workflow</h3>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100/50">
                 <p className="text-[10px] font-black text-emerald-600 text-center uppercase tracking-wider">Təkliflərə Açıqdır</p>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
};

export default RequestForQuotationCreate;
