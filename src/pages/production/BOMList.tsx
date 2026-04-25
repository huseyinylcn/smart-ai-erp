import { 
  Plus, Search, Layers, 
  MoreVertical, Package, 
  ArrowRight, Settings2,
  DollarSign, Activity, History,
  LayoutGrid, List, Filter, Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TENGRY_BOMS, TENGRY_NOMENCLATURE } from '../../utils/tengryData';

const BOMList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const boms = TENGRY_BOMS.map(bom => {
    const product = TENGRY_NOMENCLATURE.find(item => item.id === bom.targetItemId);
    
    // Calculate total cost
    const totalCost = bom.components.reduce((sum, comp) => {
      const item = TENGRY_NOMENCLATURE.find(i => i.id === comp.itemId);
      return sum + (item?.defaultPrice || 0) * comp.quantity;
    }, 0);

    return {
      id: bom.id.toUpperCase().replace('_', '-').replace('BOM-', ''),
      product: product?.name || 'Bilinməyən Məhsul',
      version: 'v1.0',
      items: bom.components.length,
      cost: `₼ ${totalCost.toFixed(2)}`,
      status: 'Active',
      lastUpdate: new Date().toLocaleDateString('az-AZ'),
      type: 'Standard'
    };
  });

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-900 dark:text-slate-100">
      
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-10 rounded-[3rem] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">Reseptura İdarəetməsi</span>
              <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">{boms.length} Aktiv Reseptura</span>
            </div>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums leading-none">
              Məhsul <span className="text-primary-600">Resepturaları</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic max-w-xl leading-relaxed">
              İstehsalat normaları, material tərkibləri və dinamik maya dəyəri hesablamalarının mərkəzi idarəetmə paneli.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* VIEW TOGGLE */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="relative group min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Axtarış..." 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold placeholder-slate-400 focus:ring-2 focus:ring-primary-500 transition-all shadow-inner"
              />
            </div>

            <button className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all shadow-sm">
              <Filter className="w-5 h-5" />
            </button>

            <button 
              onClick={() => navigate('/production/bom/create')}
              className="flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-500/30 active:scale-95 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Yeni BOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
          {boms.map((bom, idx) => (
            <div 
              key={idx} 
              className="group bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-all" />
              
              <div className="flex justify-between items-start mb-8 relative">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  <Layers className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic mb-2 ${
                    bom.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {bom.status}
                  </span>
                  <div className="flex items-center space-x-1.5 text-primary-500">
                    <History className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase italic tracking-tighter tabular-nums">{bom.version}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic group-hover:text-primary-600 transition-colors leading-tight truncate">
                  {bom.product}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center space-x-2">
                  <Settings2 className="w-3 h-3" />
                  <span>{bom.id}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 pt-8 border-t border-slate-50 dark:border-slate-800/50">
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter italic mb-1">Maya Dəyəri</p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-black italic tabular-nums text-slate-800 dark:text-white leading-none">
                      {bom.cost}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter italic mb-1">Materiallar</p>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-black italic tabular-nums text-slate-800 dark:text-white leading-none">
                      {bom.items} Vahid
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate(`/production/bom/${bom.id}`)}
                  className="flex-1 flex items-center justify-center space-x-3 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10"
                >
                  <span>Resepturaya Bax</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <div 
            onClick={() => navigate('/production/bom/create')}
            className="group border-4 border-dashed border-slate-100 dark:border-slate-800/50 rounded-[3rem] flex flex-col items-center justify-center p-12 hover:border-primary-500/30 hover:bg-primary-50/10 transition-all cursor-pointer min-h-[400px]"
          >
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-inner mb-6">
              <Plus className="w-10 h-10 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <p className="text-sm font-black text-slate-400 group-hover:text-primary-600 uppercase tracking-widest italic text-center leading-relaxed">
              Yeni Məhsul<br/>Resepturası Əlavə Et
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-right-4 duration-500">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Məhsul və Reseptura</th>
                <th className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Versiya</th>
                <th className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Materiallar</th>
                <th className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Maya Dəyəri</th>
                <th className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {boms.map((bom, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-6 px-8">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 dark:text-white uppercase italic truncate max-w-[300px]">{bom.product}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{bom.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <span className="text-xs font-black text-primary-500 uppercase italic tabular-nums">{bom.version}</span>
                  </td>
                  <td className="py-6 text-center">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 italic tabular-nums">{bom.items} Vahid</span>
                  </td>
                  <td className="py-6 text-center">
                    <span className="text-xs font-black text-emerald-500 italic tabular-nums">{bom.cost}</span>
                  </td>
                  <td className="py-6 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest italic ${
                      bom.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {bom.status}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/production/bom/${bom.id}`)}
                        className="p-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:scale-110 transition-all shadow-lg"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default BOMList;
