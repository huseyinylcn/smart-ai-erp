import React from 'react';
import { Trash2, Plus, Package, Calculator, Info } from 'lucide-react';

export interface LineItem {
  id: string | number;
  productId: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  discount?: number;
  taxRate: number;
  total: number;
  note?: string;
}

interface LineItemGridProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  currency?: string;
}

const LineItemGrid: React.FC<LineItemGridProps> = ({ items, onChange, currency = '₼' }) => {
  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now(),
      productId: '',
      name: '',
      unit: 'ədəd',
      quantity: 1,
      price: 0,
      taxRate: 18,
      total: 0
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string | number) => {
    onChange(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string | number, field: keyof LineItem, value: any) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculate total
        const base = updated.quantity * updated.price;
        const discountVal = updated.discount || 0;
        const taxVal = (base - discountVal) * (updated.taxRate / 100);
        updated.total = base - discountVal + taxVal;
        return updated;
      }
      return item;
    });
    onChange(newItems);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-12 text-center">#</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[250px]">Məhsul / Xidmət</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24">Vahid</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32">Miqdar</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-40 text-right">Qiymət ({currency})</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24 text-center">ƏDV %</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-40 text-right">Cəmi ({currency})</th>
              <th className="px-6 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {items.map((item, index) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-xs font-bold text-slate-400 text-center">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                      <Package className="w-4 h-4" />
                    </div>
                    <input 
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Məhsul axtar..."
                      className="bg-transparent border-none focus:ring-0 text-[13px] font-bold text-slate-700 dark:text-slate-300 placeholder-slate-300 w-full"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-[12px] font-bold text-slate-500 w-full"
                  >
                    <option value="ədəd">ədəd</option>
                    <option value="kq">kq</option>
                    <option value="ton">ton</option>
                    <option value="m">m</option>
                    <option value="xidmət">xidmət</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="bg-transparent border-none focus:ring-0 text-[13px] font-black text-slate-700 dark:text-slate-300 w-full text-center tabular-nums"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <input 
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="bg-transparent border-none focus:ring-0 text-[13px] font-black text-slate-700 dark:text-slate-300 w-full text-right tabular-nums"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <select 
                    value={item.taxRate}
                    onChange={(e) => updateItem(item.id, 'taxRate', parseInt(e.target.value) || 0)}
                    className="bg-transparent border-none focus:ring-0 text-[12px] font-black text-slate-500 w-full text-center"
                  >
                    <option value="18">18%</option>
                    <option value="5">5%</option>
                    <option value="0">0%</option>
                    <option value="exempt">Azad</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[14px] font-black text-slate-800 dark:text-white tabular-nums">
                    {item.total.toLocaleString('az-AZ', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
        <button 
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Sətir Əlavə Et</span>
        </button>
      </div>
    </div>
  );
};

export default LineItemGrid;
