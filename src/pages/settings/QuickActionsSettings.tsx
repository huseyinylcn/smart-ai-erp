import { useState, useEffect } from 'react';
import { 
  Settings2, Save, Star, EyeOff, Eye, RotateCcw,
  CheckCircle2, AlertCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import { menuData, type MenuCategory, type MenuItem } from '../../components/AddNewDropdown';

interface Config {
  favorites: string[];
  hidden: string[];
  categoryOrder?: string[];
}

const QuickActionsSettings = () => {
  const [config, setConfig] = useState<Config>({ favorites: [], hidden: [], categoryOrder: [] });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('quickActionsConfig');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleToggleFavorite = (id: string) => {
    setConfig(prev => {
      const favorites = prev.favorites.includes(id)
        ? prev.favorites.filter(fid => fid !== id)
        : [...prev.favorites, id];
      return { ...prev, favorites };
    });
    setIsSaved(false);
  };

  const handleToggleVisibility = (id: string) => {
    setConfig(prev => {
      const hidden = prev.hidden.includes(id)
        ? prev.hidden.filter(hid => hid !== id)
        : [...prev.hidden, id];
      // If hiding, also remove from favorites to prevent conflicts
      const favorites = hidden.includes(id) ? prev.favorites.filter(fid => fid !== id) : prev.favorites;
      
      return { ...prev, hidden, favorites };
    });
    setIsSaved(false);
  };

  const handleReset = () => {
    if (window.confirm("Bütün tənzimləmələri sıfırlamaq istədiyinizə əminsiniz?")) {
      setConfig({ favorites: [], hidden: [], categoryOrder: [] });
      localStorage.removeItem('quickActionsConfig');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const activeOrder = config.categoryOrder || [];
  const sortedCategories = [...menuData].sort((a, b) => {
    const idxA = activeOrder.indexOf(a.title);
    const idxB = activeOrder.indexOf(b.title);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  const moveCategory = (title: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const currentOrder = sortedCategories.map(c => c.title);
      const currentIndex = currentOrder.indexOf(title);
      
      if (direction === 'up' && currentIndex > 0) {
        [currentOrder[currentIndex - 1], currentOrder[currentIndex]] = [currentOrder[currentIndex], currentOrder[currentIndex - 1]];
      } else if (direction === 'down' && currentIndex < currentOrder.length - 1) {
        [currentOrder[currentIndex + 1], currentOrder[currentIndex]] = [currentOrder[currentIndex], currentOrder[currentIndex + 1]];
      }
      
      return { ...prev, categoryOrder: currentOrder };
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('quickActionsConfig', JSON.stringify(config));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
         <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-slate-900 dark:bg-slate-100 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-slate-900/20 rotate-3">
               <Settings2 className="w-8 h-8 text-white dark:text-slate-900" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Sürətli Əməliyyat Tənzimləmələri</h1>
               <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Açılan menyunu öz iş axınınıza uyğunlaşdırın</p>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <button 
               onClick={handleReset}
               className="p-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 rounded-2xl transition-all"
               title="Sıfırla"
            >
               <RotateCcw className="w-5 h-5" />
            </button>
            <button 
               onClick={handleSave}
               className={`flex flex-row items-center space-x-3 px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 italic ${
                 isSaved 
                   ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                   : 'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700'
               }`}
            >
               {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
               <span>{isSaved ? 'Yadda Saxlanıldı' : 'Yadda Saxla'}</span>
            </button>
         </div>
      </div>

      <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400">
         <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
         <div>
            <h4 className="text-sm font-black uppercase tracking-widest italic mb-1">Məlumat</h4>
            <p className="text-xs font-semibold leading-relaxed">
               Bu ekranda etdiyiniz dəyişikliklər dərhal lokal cihazınızda yadda saxlanılır. Ulduzla işarələnmiş sənədlər əsas menyudakı kateqoriyasından çıxarılaraq ən üst hissədə "Ən Çox İstifadə Olunanlar" bloku altında cəmləşəcək.
            </p>
         </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {sortedCategories.map((category: MenuCategory, index: number) => (
            <div key={category.title} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">
                    {category.title}
                 </h3>
                 <div className="flex items-center space-x-1 opacity-50 hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => moveCategory(category.title, 'up')}
                     disabled={index === 0}
                     className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                     title="Yuxarı köçür"
                   >
                     <ArrowUp className="w-3.5 h-3.5" />
                   </button>
                   <button 
                     onClick={() => moveCategory(category.title, 'down')}
                     disabled={index === sortedCategories.length - 1}
                     className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                     title="Aşağı köçür"
                   >
                     <ArrowDown className="w-3.5 h-3.5" />
                   </button>
                 </div>
               </div>
               
               <div className="space-y-3 flex-1">
                  {category.items.map((item: MenuItem) => {
                     const isFavorite = config.favorites.includes(item.id);
                     const isHidden = config.hidden.includes(item.id);

                     return (
                        <div 
                           key={item.id} 
                           className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              isHidden 
                                 ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 grayscale' 
                                 : isFavorite
                                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                           }`}
                        >
                           <div className="flex items-center space-x-3 overflow-hidden">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                 isHidden ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}>
                                 <item.icon className="w-4 h-4 stroke-[2.2px]" />
                              </div>
                              <span className={`text-[12px] font-bold truncate ${
                                 isHidden ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                              }`}>
                                 {item.name}
                              </span>
                           </div>

                           <div className="flex items-center space-x-1 flex-shrink-0 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-100 dark:border-slate-700">
                              <button 
                                 onClick={() => handleToggleFavorite(item.id)}
                                 disabled={isHidden}
                                 className={`p-1.5 rounded-md transition-all ${
                                    isHidden ? 'cursor-not-allowed opacity-50' : ''
                                 } ${
                                    isFavorite && !isHidden
                                       ? 'bg-amber-100 text-amber-500' 
                                       : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'
                                 }`}
                                 title={isFavorite ? "Favorilərdən çıxar" : "Favorilərə əlavə et"}
                              >
                                 <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                              </button>
                              
                              <button 
                                 onClick={() => handleToggleVisibility(item.id)}
                                 className={`p-1.5 rounded-md transition-all ${
                                    isHidden 
                                       ? 'bg-rose-100 text-rose-500' 
                                       : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'
                                 }`}
                                 title={isHidden ? "Görünür et" : "Gizlət"}
                              >
                                 {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         ))}
      </div>
      
    </div>
  );
};

export default QuickActionsSettings;
