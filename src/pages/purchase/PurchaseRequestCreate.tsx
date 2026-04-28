import { useState } from 'react';
import { 
  ArrowLeft, Search, CheckCircle2, 
  Save, Info, ShoppingCart, 
  Calendar, User, ShieldCheck, 
  Plus, Building2, LayoutList, Clock, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

interface RequestItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  note: string;
}

const PurchaseRequestCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`REQ-${new Date().getFullYear()}-0412`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [items, setItems] = useState<RequestItem[]>([
    { id: '1', name: 'Ofis kağızı A4', qty: 10, unit: 'paçka', note: 'Aylıq ehtiyac üçün' },
  ]);

  const [priority, setPriority] = useState('MEDIUM');
  const [department, setDepartment] = useState('');

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), name: '', qty: 1, unit: 'ədəd', note: '' }]);
  };

  const handleUpdateItem = (id: string, field: keyof RequestItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    setCurrentStatus('POSTED');
    alert("İlkin tələb uğurla göndərildi!");
    navigate('/purchase/requests');
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-emerald-100 dark:border-emerald-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-emerald-50 transition-all text-slate-400 hover:text-emerald-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                        <LayoutList className="w-6 h-6 mr-2 text-emerald-500" /> Yeni İlkin Tələb
                    </h1>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic">PURCHASE REQUEST</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic uppercase tracking-tighter"><Clock className="w-3.5 h-3.5 mr-1 text-emerald-500" /> {date}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={handleSave} className="flex items-center space-x-2 px-8 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tələbi Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-9 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-10 relative overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Building2 className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Departament
                        </label>
                        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic uppercase leading-none">
                            <option value="">Departament seçin</option>
                            <option>İT Departamenti</option>
                            <option>Maliyyə</option>
                            <option>Satış və Marketinq</option>
                            <option>İnsan Resursları</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <User className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Sorğuçu Şəxs
                        </label>
                        <input placeholder="Ad, Soyad" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic uppercase leading-none" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <AlertCircle className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Təciliyyət
                        </label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic uppercase leading-none">
                            <option value="LOW">Aşağı</option>
                            <option value="MEDIUM">Normal</option>
                            <option value="HIGH">Yüksək</option>
                            <option value="URGENT">Təcili</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Tələb Olunan Tarix
                        </label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic uppercase leading-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-emerald-50 dark:border-emerald-800 flex justify-between items-center bg-emerald-50/20">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic flex items-center">
                        <Plus className="w-4 h-4 mr-2 text-emerald-500" /> Mallar və Tələbat Siyahısı
                    </h3>
                    <button onClick={handleAddItem} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
                        <Plus className="w-4 h-4 inline mr-1" /> Sətir Əlavə Et
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Malın Adı / Təsviri</th>
                                <th className="px-4 py-5 text-center">Miqdar</th>
                                <th className="px-4 py-5 text-center">Vahid</th>
                                <th className="px-8 py-5">Qeyd</th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map(item => (
                                <tr key={item.id} className="group hover:bg-emerald-50/30">
                                    <td className="px-8 py-6">
                                        <input value={item.name} onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)} placeholder="Məhsul adı daxil edin..." className="bg-transparent border-none p-0 text-sm font-black text-slate-700 dark:text-slate-200 outline-none w-full italic" />
                                    </td>
                                    <td className="px-4 py-6 text-center tabular-nums">
                                        <input type="number" value={item.qty} onChange={(e) => handleUpdateItem(item.id, 'qty', Number(e.target.value))} className="w-20 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1.5 text-center font-black outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <select value={item.unit} onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)} className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1.5 text-center font-black outline-none">
                                            <option>ədəd</option>
                                            <option>paçka</option>
                                            <option>kg</option>
                                            <option>metr</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-6">
                                        <input value={item.note} onChange={(e) => handleUpdateItem(item.id, 'note', e.target.value)} placeholder="Əsaslandırma..." className="bg-transparent border-none p-0 text-[11px] font-bold text-slate-400 outline-none w-full italic" />
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Plus className="w-4 h-4 rotate-45" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 italic opacity-60 flex items-center">
                    <Info className="w-3.5 h-3.5 mr-2 text-emerald-400" /> Ümumi Qeydlər
                </h3>
                <textarea className="w-full bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[150px] italic" placeholder="Bu sorğu haqqında əlavə izahat yazın..."></textarea>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Status və Təsdiq
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                </div>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100">
                        <span className="text-[10px] font-black text-amber-700 uppercase italic">Gözləmədə</span>
                        <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">Yeni Sorğu</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 italic leading-relaxed uppercase">Bu sorğu təsdiq edildikdən sonra daxili təminat və ya Satınalma Sorğusu (PR) mərhələsinə keçəcəkdir.</p>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-100 p-6 flex justify-end items-center z-40 h-[90px]">
          <div className="flex space-x-4 px-4 items-center">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-[10px] uppercase italic">Ləğv Et</button>
              <button onClick={handleSave} className="px-16 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-[10px] uppercase shadow-2xl active:scale-95 transition-all">
                 <Save className="w-4 h-4 inline mr-2" />
                 Tələbi Göndər
              </button>
          </div>
      </div>
    </div>
  );
};

export default PurchaseRequestCreate;
