import { useState, useEffect } from 'react';
import { X, Save, Folder, Layers, Bookmark, AlertCircle, Tag } from 'lucide-react';
import { inventoryApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

interface Props {
  category?: any; // If editing
  parentCategory?: any; // If creating a subcategory under this parent
  initialType?: string; // Default type for new root categories
  onClose: () => void;
  onSave: () => void;
}

const NomenclatureCategoryModal = ({ category, parentCategory, initialType, onClose, onSave }: Props) => {
  const { activeCompany } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    code: category?.code || '',
    type: category?.type || initialType || 'MATERIAL',
  });

  useEffect(() => {
    const fetchNextCode = async () => {
      if (!activeCompany || category) return; // Don't auto-fill if editing
      try {
        const codes = await inventoryApi.getNextCodes(activeCompany.id);
        setFormData(prev => ({ 
          ...prev, 
          code: parentCategory ? codes.subCategory : codes.category 
        }));
      } catch (err) {
        console.error('Error fetching next code:', err);
      }
    };
    fetchNextCode();
  }, [activeCompany?.id, category, parentCategory]);

  const isSubCategory = !!parentCategory || (category && category.categoryId);
  const isEdit = !!category;

  const handleSave = async () => {
    if (!activeCompany || !formData.name) return;
    setIsLoading(true);
    try {
      if (isSubCategory) {
        // SubCategory (L2)
        const payload = {
          name: formData.name,
          code: formData.code,
          categoryId: parentCategory?.id || category.categoryId,
          companyId: activeCompany.id
        };

        if (isEdit) {
          await inventoryApi.updateSubCategory(category.id, payload, activeCompany.id);
        } else {
          await inventoryApi.createSubCategory(payload, activeCompany.id);
        }
      } else {
        // Root Category (L1)
        const payload = {
          name: formData.name,
          code: formData.code,
          type: formData.type,
          companyId: activeCompany.id
        };

        if (isEdit) {
          await inventoryApi.updateCategory(category.id, payload, activeCompany.id);
        } else {
          await inventoryApi.createCategory(payload, activeCompany.id);
        }
      }
      onSave();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${isSubCategory ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {isSubCategory ? <Layers /> : <Folder />}
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight leading-none mb-1">
                    {isEdit ? 'Kateqoriya Redaktəsi' : (isSubCategory ? 'Yeni Alt Kateqoriya' : 'Yeni Kateqoriya')}
                 </h2>
                 <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">
                    {parentCategory ? `Valideyn: ${parentCategory.name}` : (isSubCategory ? 'Alt Səviyyə' : 'Kök Səviyyə')}
                 </span>
              </div>
           </div>
           <button onClick={onClose} className="p-3 text-slate-400 hover:text-rose-500 transition-all">
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* BODY */}
        <div className="p-10 space-y-6">
           {/* Növ seçimi artıq istifadəçinin rəyinə əsasən ləğv edilib. Növ kontekstə görə avtomatik təyin olunur. */}
           
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-2">Kateqoriya Adı</label>
              <input 
                autoFocus
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/10" 
                placeholder="Məs: Metal Konstruksiyalar"
              />
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-2">Sistem Kodu (Opsional)</label>
              <input 
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/10" 
                placeholder="Məs: CAT-001"
              />
           </div>

           <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-dashed border-indigo-100 flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-indigo-500 mt-1 shrink-0" />
              <p className="text-[10px] font-bold text-slate-500 uppercase italic leading-relaxed">
                 Kateqoriya məlumatları qeyd edildikdən sonra sistem tərəfindən avtomatik olaraq müvafiq növə (Ehtiyatlar/Xidmətlər/İşlər) rəsmən aid ediləcəkdir.
              </p>
           </div>
        </div>

        {/* FOOTER */}
        <div className="px-10 py-8 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
           <button 
             onClick={onClose} 
             className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 italic hover:text-slate-600 transition-all"
           >
              Ləğv Et
           </button>
           <button 
             onClick={handleSave}
             disabled={isLoading || !formData.name}
             className="px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center space-x-3 disabled:opacity-50 italic"
           >
              {isLoading ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div> : <Save className="w-4 h-4" />}
              <span>{isEdit ? 'Yadda Saxla' : (isSubCategory ? 'Alt Kateqoriya Saxla' : 'Kateqoriya Saxla')}</span>
           </button>
        </div>

      </div>
    </div>
  );
};

export default NomenclatureCategoryModal;
