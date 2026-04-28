import React, { useState, useEffect } from 'react';
import { X, Save, PiggyBank, Truck, Banknote, FileText, Users, LayoutGrid } from 'lucide-react';
import { financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

interface TreasuryCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: any;
}

const TreasuryCategoryModal: React.FC<TreasuryCategoryModalProps> = ({ 
  isOpen, onClose, onSave, initialData 
}) => {
  const { activeCompany } = useCompany();
  const [formData, setFormData] = useState({
    name: '',
    icon: 'LayoutGrid',
    description: ''
  });

  const icons = [
    { name: 'PiggyBank', icon: PiggyBank },
    { name: 'Truck', icon: Truck },
    { name: 'Banknote', icon: Banknote },
    { name: 'FileText', icon: FileText },
    { name: 'Users', icon: Users },
    { name: 'LayoutGrid', icon: LayoutGrid },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        icon: initialData.icon || 'LayoutGrid',
        description: initialData.description || ''
      });
    } else {
      setFormData({ name: '', icon: 'LayoutGrid', description: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany) return;
    try {
      if (initialData) {
        await financeApi.updateTreasuryCategory(initialData.id, formData, activeCompany.id);
      } else {
        await financeApi.createTreasuryCategory(formData, activeCompany.id);
      }
      onSave();
      onClose();
    } catch (error: any) {
      alert(error.message || "Xəta baş verdi");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
            {initialData ? "Tipi Redaktə Et" : "Yeni Hesab Tipi"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Tipin Adı</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all italic"
              placeholder="məs: Gömrük Depozitləri"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">İkon Seçin</label>
            <div className="grid grid-cols-6 gap-3">
              {icons.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: item.name })}
                    className={`p-3 rounded-xl border transition-all ${formData.icon === item.name ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Təsvir</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all italic min-h-[100px]"
              placeholder="Tip haqqında qısa məlumat..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all italic"
            >
              Ləğv Et
            </button>
            <button 
              type="submit"
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic"
            >
              <Save className="w-4 h-4" />
              <span>Yadda Saxla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TreasuryCategoryModal;
