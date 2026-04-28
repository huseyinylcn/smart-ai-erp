import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Settings } from 'lucide-react';
import { financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import TreasuryCategoryModal from './TreasuryCategoryModal';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  title: string;
  defaultCodePrefix?: string;
  type?: string;
}

const AccountModal: React.FC<AccountModalProps> = ({ 
  isOpen, onClose, onSave, initialData, title, defaultCodePrefix, type = 'CASH_BANK' 
}) => {
  const { activeCompany } = useCompany();
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: defaultCodePrefix || '',
    name: '',
    type: type,
    balanceType: 'DEBIT',
    section: '',
    item: '',
    currency: 'AZN',
    treasuryCategoryId: ''
  });

  const fetchCategories = async () => {
    if (activeCompany && (isOpen || isCategoryModalOpen)) {
      try {
        const result = await financeApi.getTreasuryCategories(activeCompany.id);
        setCategories(result.data);
      } catch (error: any) {
        console.error("Kateqoriyalar yüklənərkən xəta:", error);
        if (error.message.includes('Failed to fetch')) {
            setCategories([
                { id: 'cat1', name: 'Kassa', icon: 'Wallet' },
                { id: 'cat2', name: 'Bank Hesabları', icon: 'Landmark' },
                { id: 'cat3', name: 'Əmanətlər', icon: 'PiggyBank' },
            ]);
        }
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeCompany?.id, isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        currency: initialData.currency || 'AZN',
        treasuryCategoryId: initialData.treasuryCategoryId || ''
      });
    } else {
      setFormData({
        code: defaultCodePrefix || '',
        name: '',
        type: type,
        balanceType: 'DEBIT',
        section: '',
        item: '',
        currency: 'AZN',
        treasuryCategoryId: ''
      });
    }
  }, [initialData, defaultCodePrefix, type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                  <Settings className="w-5 h-5" />
               </div>
               <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">{title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Hesab Kodu</label>
                <input 
                  type="text" 
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all italic"
                  placeholder="məs: 223.01.01"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Valyuta</label>
                <select 
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all italic cursor-pointer"
                >
                  <option value="AZN">AZN (₼)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="RUB">RUB (₽)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Hesabın Tipi / Kateqoriyası</label>
              <div className="flex items-center space-x-2">
                <select 
                  value={formData.treasuryCategoryId}
                  onChange={(e) => setFormData({ ...formData, treasuryCategoryId: e.target.value })}
                  className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all italic cursor-pointer"
                >
                  <option value="">Seçilməyib (Daxili)</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button 
                  type="button" 
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Hesab / Bank Adı</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all italic"
                placeholder="məs: ABB USD Hesabı"
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

      <TreasuryCategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={fetchCategories}
      />
    </>
  );
};

export default AccountModal;
