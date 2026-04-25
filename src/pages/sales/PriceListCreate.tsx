import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Plus, Trash2, 
  Tag, Percent, DollarSign, List,
  Calendar, Info, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PriceListCreate = () => {
  const navigate = useNavigate();

  // Header State
  const [name, setName] = useState('');
  const [type, setType] = useState('Standard');
  const [currency, setCurrency] = useState('AZN');
  const [basePriceList, setBasePriceList] = useState('');
  const [markupType, setMarkupType] = useState('Percentage');
  const [markupValue, setMarkupValue] = useState(0);

  // Items State
  const [items, setItems] = useState<any[]>([
    { id: '1', product: 'Macbook Pro 14', sku: 'ICT-MB-02', basePrice: 3500, finalPrice: 3500 },
    { id: '2', product: 'iPhone 15 Pro', sku: 'MOB-IP15-P', basePrice: 2400, finalPrice: 2400 },
  ]);

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), product: '', sku: '', basePrice: 0, finalPrice: 0 }]);
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
              <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Yeni Qiymət Siyahısı</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Qiymət siyasəti konfiqurasiyası</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button onClick={() => navigate('/sales/pricelist')} className="px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                <Save className="w-4 h-4 mr-2 inline" />
                <span>Siyahını Yadda Saxla</span>
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Settings */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6 shadow-sm">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Tag className="w-3.5 h-3.5 mr-2" /> Siyahı Məlumatları
              </label>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Siyahı adı (məs: VİP 2024)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none">
                    <option value="Standard">Standart</option>
                    <option value="VIP">VİP Qrup</option>
                    <option value="Regional">Regional</option>
                  </select>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none">
                    <option value="AZN">AZN (₼)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
              <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center italic">
                <Percent className="w-3.5 h-3.5 mr-2" /> Avtomatik Hesablama
              </label>
              <div className="space-y-4">
                <select value={basePriceList} onChange={(e) => setBasePriceList(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none">
                  <option value="">Baza Siyahısı Seçin (Heç biri)</option>
                  <option value="standard">Standart Satış Qiyməti</option>
                </select>
                <div className="flex items-center space-x-2">
                  <select value={markupType} onChange={(e) => setMarkupType(e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none">
                    <option value="Percentage">Faiz (%)</option>
                    <option value="Fixed">Sabit Məbləğ</option>
                  </select>
                  <input 
                    type="number"
                    value={markupValue}
                    onChange={(e) => setMarkupValue(Number(e.target.value))}
                    className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-black text-center tabular-nums"
                  />
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase italic leading-relaxed">Seçilmiş baza siyahısındakı qiymətlər avtomatik olaraq bu marja ilə yenilənəcəkdir.</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/30 flex items-start space-x-4">
            <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest italic">Yadda Saxla:</p>
              <p className="text-[9px] font-bold text-indigo-600/70 dark:text-indigo-400/70 mt-1 italic">Qiymət siyahısı təsdiqləndikdən sonra Satış Sifarişləri və POS-da dərhal aktiv olacaqdır.</p>
            </div>
          </div>
        </div>

        {/* Product Selection & Pricing */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center italic">
                <List className="w-4 h-4 mr-2 text-indigo-600" /> Məhsul və Qiymət Cedveli
              </h3>
              <div className="flex items-center space-x-3">
                 <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                    <input type="text" placeholder="Məhsul axtar..." className="pl-8 pr-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] outline-none" />
                 </div>
                 <button onClick={handleAddItem} className="flex items-center space-x-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
                    <Plus className="w-3 h-3" />
                    <span>Məhsul Əlavə Et</span>
                 </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-white dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5">Məhsul / SKU</th>
                    <th className="px-6 py-5 text-right italic">Baza Qiymət</th>
                    <th className="px-6 py-5 text-right font-black text-indigo-600">Yekun Qiymət</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none">
                  {items.map(item => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800 dark:text-white uppercase italic">{item.product || 'YENİ MƏHSUL'}</span>
                          <span className="text-[9px] font-bold text-slate-400 tracking-widest">{item.sku || 'SKU-PENDING'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-xs text-slate-400 tabular-nums">
                        {item.basePrice.toLocaleString()} {currency}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                           <DollarSign className="w-3 h-3 text-indigo-500" />
                           <input 
                             type="number" 
                             value={item.finalPrice} 
                             onChange={(e) => {
                               const newItems = [...items];
                               const idx = newItems.findIndex(i => i.id === item.id);
                               newItems[idx].finalPrice = Number(e.target.value);
                               setItems(newItems);
                             }}
                             className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-right font-black text-xs tabular-nums focus:ring-1 focus:ring-indigo-500" 
                           />
                        </div>
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

export default PriceListCreate;
