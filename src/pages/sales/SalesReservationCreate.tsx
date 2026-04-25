import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Plus, Trash2, 
  User, Package, Calendar, Clock,
  Search, FileText, ClipboardCheck,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SalesReservationCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sourceOrderId = searchParams.get('orderId');

  // Header State
  const [customer, setCustomer] = useState('');
  const [isTimed, setIsTimed] = useState(true);
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [reservationType, setReservationType] = useState('Manual');

  // Items State
  const [items, setItems] = useState<any[]>([]);

  // Simulate Auto-populate from Order
  useEffect(() => {
    if (sourceOrderId) {
      setReservationType(`Based on Order: SO-${sourceOrderId}`);
      setCustomer('Azərsun Holdinq'); // Mock
      setItems([
        { id: '1', product: 'Macbook Pro 14', sku: 'ICT-MB-02', quantity: 5, warehouse: 'Bakı Mərkəz' },
        { id: '2', product: 'iPhone 15 Pro', sku: 'MOB-IP15-P', quantity: 2, warehouse: 'Bakı Mərkəz' },
      ]);
    } else {
        setItems([{ id: '1', product: '', sku: '', quantity: 1, warehouse: 'Bakı Mərkəz' }]);
    }
  }, [sourceOrderId]);

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), product: '', sku: '', quantity: 1, warehouse: 'Bakı Mərkəz' }]);
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Yeni Bron Müraciəti</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Məhsulların müvəqqəti rezervasiyası</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button onClick={() => navigate('/sales/reservations')} className="px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                <Save className="w-4 h-4 mr-2 inline" />
                <span>Bronu Təsdiqlə</span>
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Reservation Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6 shadow-sm">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <User className="w-3.5 h-3.5 mr-2" /> Müştəri və Mənbə
              </label>
              <div className="space-y-4">
                <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option value="">Müştəri Seçin...</option>
                    <option value="Azersun">Azərsun Holdinq</option>
                    <option value="Kapital">Kapital Bank</option>
                </select>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center space-x-3 border border-slate-100 dark:border-slate-700">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Bron Mənbəyi</p>
                        <p className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-tighter italic">{reservationType}</p>
                    </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
              <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center italic">
                <Clock className="w-3.5 h-3.5 mr-2" /> Rezervasiya Müddəti
              </label>
              
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button 
                  onClick={() => setIsTimed(true)}
                  className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${isTimed ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Müddətli
                </button>
                <button 
                  onClick={() => setIsTimed(false)}
                  className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${!isTimed ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Müddətsiz
                </button>
              </div>

              {isTimed && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold shadow-inner outline-none focus:ring-2 focus:ring-rose-500/10"
                      />
                  </div>
                  <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex items-start space-x-3">
                      <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5" />
                      <p className="text-[9px] font-bold text-rose-600 italic leading-relaxed uppercase tracking-tight">Bu tarixdən sonra bron avtomatik olaraq ləğv ediləcək və mallar sərbəst qalacaqdır.</p>
                  </div>
                </div>
              )}
              
              {!isTimed && (
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex items-start space-x-3 animate-in slide-in-from-top-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5" />
                  <p className="text-[9px] font-bold text-indigo-600 italic leading-relaxed uppercase tracking-tight">Bron müddətsizdir. Sənəd yalnız əl ilə ləğv edilə və ya satışa çevrilə bilər.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center italic">
                <Package className="w-4 h-4 mr-2 text-indigo-600" /> Rezerv Edilən Mallar
              </h3>
              <button onClick={handleAddItem} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>Mal Əlavə Et</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-white dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5">Məhsul</th>
                    <th className="px-6 py-5 text-center">Miqdar</th>
                    <th className="px-6 py-5">Anbar</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none">
                  {items.map(item => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <input type="text" placeholder="Məhsul adı..." value={item.product} className="bg-transparent border-none p-0 text-xs font-black text-slate-800 dark:text-white uppercase italic outline-none w-full" />
                          <span className="text-[9px] font-bold text-slate-400 tracking-widest">{item.sku || 'SKU-PENDING'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <input type="number" value={item.quantity} className="w-16 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-center font-black text-xs tabular-nums focus:ring-1 focus:ring-indigo-500" />
                      </td>
                      <td className="px-6 py-5">
                        <select value={item.warehouse} className="bg-transparent border-none p-0 text-xs font-black text-slate-600 uppercase italic outline-none">
                            <option>Bakı Mərkəz</option>
                            <option>Gəncə Filial</option>
                        </select>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReservationCreate;
