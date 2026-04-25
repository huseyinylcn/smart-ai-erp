import { 
  Home, MapPin, User, Maximize2, Search, Plus, MoreVertical,
  Activity, Package, X, Check,
  Trash2, Box, Layers, Edit2, Settings,
  Hash, Tag, Palette, Bookmark
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { inventoryApi } from '../../utils/api';

const WarehouseList = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Default Types
  const defaultTypes = [
    { id: '1', name: 'Fiziki', color: 'indigo' },
    { id: '2', name: 'İstehsalat', color: 'emerald' },
    { id: '3', name: 'Virtual', color: 'sky' },
    { id: '4', name: 'Təhlükəli', color: 'rose' }
  ];

  const [warehouseTypes, setWarehouseTypes] = useState<any[]>(() => {
    const saved = localStorage.getItem('erp_warehouse_types');
    return saved ? JSON.parse(saved) : defaultTypes;
  });

  useEffect(() => {
    localStorage.setItem('erp_warehouse_types', JSON.stringify(warehouseTypes));
  }, [warehouseTypes]);

  // Default data with capacity and sub-locations support
  const initialWarehouses = [
    { 
      id: '1', 
      name: 'Mərkəzi Anbar (Logistika)', 
      location: 'Bakı, Binəqədi şossesi 4b', 
      manager: 'Anar Məmmədov', 
      area: '2500', 
      capacity: '12000', 
      occupancy: 82, 
      type: 'Fiziki', 
      items: 1240,
      subLocations: [
        { id: 's1', name: 'Zona A (Soyuq)', capacity: '4000', manager: 'Vaqif Əliyev' },
        { id: 's2', name: 'Zona B (Quru)', capacity: '8000', manager: 'Anar Məmmədov' }
      ]
    },
    { 
      id: '2', 
      name: 'Sahə Anbarı 1 (Modern City)', 
      location: 'Sumqayıt yolu, km 12', 
      manager: 'Elvin Həsənov', 
      area: '800', 
      capacity: '3500', 
      occupancy: 45, 
      type: 'Fiziki', 
      items: 310,
      subLocations: []
    },
    { 
      id: '3', 
      name: 'Xammal Anbarı', 
      location: 'Bakı, Dərnəgül sos.', 
      manager: 'Tural Əliyev', 
      area: '1200', 
      capacity: '5800', 
      occupancy: 95, 
      type: 'Təhlükəli', 
      items: 850,
      subLocations: []
    },
    { 
      id: '4', 
      name: 'Virtual Tranzit Anbar', 
      location: 'Sistem / Bulud', 
      manager: 'Sistem Admin', 
      area: '0', 
      capacity: '0', 
      occupancy: 12, 
      type: 'Virtual', 
      items: 45,
      subLocations: []
    },
  ];

  const [warehouses, setWarehouses] = useState<any[]>(() => {
    const saved = localStorage.getItem('erp_warehouses');
    return saved ? JSON.parse(saved) : initialWarehouses;
  });

  useEffect(() => {
    localStorage.setItem('erp_warehouses', JSON.stringify(warehouses));
  }, [warehouses]);

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter(wh => 
      wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wh.manager.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [warehouses, searchQuery]);

  const handleOpenModal = (wh: any = null) => {
    setEditingWarehouse(wh);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWarehouse(null);
  };

  const handleSave = (formData: any) => {
    if (editingWarehouse) {
      setWarehouses(prev => prev.map(w => w.id === editingWarehouse.id ? { ...w, ...formData } : w));
    } else {
      const newWarehouse = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        occupancy: 0,
        items: 0
      };
      setWarehouses(prev => [...prev, newWarehouse]);
    }
    handleCloseModal();
  };

  const handleSaveType = (updatedTypes: any[]) => {
    // Check if any type renamed
    const renamedTypes = updatedTypes.filter(ut => {
      const old = warehouseTypes.find(ot => ot.id === ut.id);
      return old && old.name !== ut.name;
    });

    if (renamedTypes.length > 0) {
      setWarehouses(prev => prev.map(wh => {
        const renamed = renamedTypes.find(rt => rt.id === (warehouseTypes.find(ot => ot.name === wh.type)?.id));
        if (renamed) {
          return { ...wh, type: renamed.name };
        }
        return wh;
      }));
    }

    setWarehouseTypes(updatedTypes);
  };

  const handleDelete = (id: string) => {
    // Check for operations associated with this warehouse
    const hasAdjustments = JSON.parse(localStorage.getItem('erp_stock_adjustments') || '[]').some((a: any) => a.warehouseId === id);
    const hasCounts = JSON.parse(localStorage.getItem('erp_inventory_counts') || '[]').some((c: any) => c.warehouseId === id);
    const hasReservations = JSON.parse(localStorage.getItem('erp_item_reservations') || '[]').some((r: any) => r.warehouseId === id);
    const hasMoves = JSON.parse(localStorage.getItem('erp_stock_moves') || '[]').some((m: any) => m.warehouseId === id);

    if (hasAdjustments || hasCounts || hasReservations || hasMoves) {
      alert('Bu anbar üzrə sistemdə əməliyyat tarixçəsi mövcuddur. Anbarı silmək üçün əvvəlcə ona bağlı olan əməliyyatları silməli və ya başqa anbara keçirməlisiniz!');
      return;
    }

    if (window.confirm('Bu anbarı silmək istədiyinizə əminsiniz?')) {
      setWarehouses(prev => prev.filter(w => w.id !== id));
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter shadow-inner whitespace-nowrap">Location Registry</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Physical & Virtual Stocks</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner whitespace-nowrap">Anbarların Siyahısı</h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 shadow-sm italic-none">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Anbar adı ilə axtar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-bold w-48 placeholder-slate-400 italic-none"
            />
          </div>
          <button 
              onClick={() => setIsTypeModalOpen(true)}
              className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-2xl transition-all active:scale-95 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-2"
              title="Növləri İdarə Et"
          >
              <Settings className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase italic tracking-widest hidden md:block">Növləri İdarə Et</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-500/30 active:scale-95 italic-none text-white !important"
          >
            <Plus className="w-4 h-4 shadow-inner" />
            <span>Yeni Anbar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredWarehouses.map((wh, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all group relative overflow-hidden italic-none">
             {/* TYPE TAG */}
             <div className="absolute top-8 right-8 italic-none">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-inner ${
                    wh.type === 'Fiziki' ? 'bg-emerald-50 text-emerald-600' : 
                    wh.type === 'Virtual' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                }`}>
                    {wh.type}
                </span>
             </div>

             <div className="flex flex-col h-full italic-none">
                <div className="mb-8 italic-none">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-inner mb-6 italic-none">
                        <Home className="w-6 h-6 shadow-inner" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums shadow-inner group-hover:text-primary-600 transition-colors leading-tight mb-2 whitespace-nowrap">{wh.name}</h3>
                    <div className="flex items-center space-x-2 text-slate-400 italic-none">
                        <MapPin className="w-3.5 h-3.5 shadow-inner" />
                        <span className="text-[11px] font-bold italic tracking-tighter shadow-inner opacity-70 leading-tight uppercase underline decoration-primary-500/5 underline-offset-4 decoration-dotted">{wh.location}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8 italic-none">
                    <div className="flex items-center justify-between text-xs italic-none">
                        <div className="flex items-center space-x-2 text-slate-400 italic-none">
                            <User className="w-4 h-4 shadow-inner" />
                            <span className="font-bold uppercase tracking-tighter italic">Məsul Şəxs</span>
                        </div>
                        <span className="font-black italic text-slate-700 dark:text-slate-200">{wh.manager}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs italic-none">
                        <div className="flex items-center space-x-2 text-slate-400 italic-none">
                            <Maximize2 className="w-4 h-4 shadow-inner" />
                            <span className="font-bold uppercase tracking-tighter italic">Sahə (m²)</span>
                        </div>
                        <span className="font-black italic text-slate-700 dark:text-slate-200 tabular-nums">{wh.area || 0} m²</span>
                    </div>
                    <div className="flex items-center justify-between text-xs italic-none">
                        <div className="flex items-center space-x-2 text-indigo-400 italic-none">
                            <Layers className="w-4 h-4 shadow-inner" />
                            <span className="font-bold uppercase tracking-tighter italic">Tutum (m³)</span>
                        </div>
                        <span className="font-black italic text-indigo-600 dark:text-indigo-400 tabular-nums">{wh.capacity || 0} m³</span>
                    </div>
                    <div className="flex items-center justify-between text-xs italic-none">
                        <div className="flex items-center space-x-2 text-slate-400 italic-none">
                            <Package className="w-4 h-4 shadow-inner" />
                            <span className="font-bold uppercase tracking-tighter italic">Mal Çeşidi</span>
                        </div>
                        <span className="font-black italic text-slate-700 dark:text-slate-200 tabular-nums">{wh.items} SKU</span>
                    </div>
                </div>

                <div className="mt-auto italic-none">
                    <div className="flex items-center justify-between mb-2 italic-none">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Doluluq (Real-time m³)</span>
                            <span className="text-[8px] font-bold text-slate-300 uppercase italic">Formula: Σ(Miqdar × Həcm)</span>
                        </div>
                        <span className={`text-sm font-black italic tabular-nums shadow-inner ${wh.occupancy > 90 ? 'text-rose-600' : 'text-primary-600'}`}>{wh.occupancy}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner p-0.5 italic-none">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 shadow-lg ${wh.occupancy > 90 ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`} 
                            style={{ width: `${wh.occupancy}%` }}
                        />
                    </div>
                </div>


                 <div className="flex items-center space-x-2 mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 italic-none">
                    <button onClick={() => navigate(`/inventory/nomenclature?warehouses=${encodeURIComponent(wh.id)}`)} className="flex-1 flex items-center justify-center space-x-2 py-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/10 text-slate-500 dark:text-slate-400 hover:text-primary-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic-none active:scale-95 shadow-inner">
                        <Activity className="w-4 h-4" />
                        <span>Stoklara Bax</span>
                    </button>
                    <button 
                      onClick={() => handleOpenModal(wh)}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 text-indigo-400 rounded-2xl transition-all active:scale-95 shadow-inner"
                      title="Redaktə et"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(wh.id)}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-rose-400 rounded-2xl transition-all active:scale-95 shadow-inner"
                      title="Sil"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
             </div>
          </div>
        ))}

        <div 
          onClick={() => handleOpenModal()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center p-8 hover:border-primary-500/50 transition-all group cursor-pointer h-full italic-none opacity-50 hover:opacity-100 min-h-[350px]"
        >
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all shadow-inner mb-4 italic-none">
                <Plus className="w-8 h-8 shadow-inner" />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner tabular-nums font-black italic shadow-inner">Yeni Bölmə / Anbar Əlavə Et</p>
        </div>
      </div>

      {isModalOpen && (
        <WarehouseModal 
          warehouse={editingWarehouse} 
          warehouseTypes={warehouseTypes}
          onClose={handleCloseModal} 
          onSave={handleSave} 
        />
      )}

      {isTypeModalOpen && (
        <WarehouseTypeModal 
          types={warehouseTypes} 
          onClose={() => setIsTypeModalOpen(false)} 
          onSave={handleSaveType} 
        />
      )}
    </div>
  );
};

const WarehouseModal = ({ warehouse, warehouseTypes, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: warehouse?.name || '',
    location: warehouse?.location || '',
    manager: warehouse?.manager || '',
    area: warehouse?.area || '',
    capacity: warehouse?.capacity || '',
    type: warehouse?.type || (warehouseTypes?.[0]?.name || 'Fiziki'),
    subLocations: warehouse?.subLocations || []
  });

  const handleAddSubLocation = () => {
    setFormData({
      ...formData,
      subLocations: [
        ...formData.subLocations,
        { id: Math.random().toString(36).substr(2, 9), name: '', capacity: '', manager: '', isReserved: false }
      ]
    });
  };

  const handleUpdateSubLocation = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      subLocations: formData.subLocations.map((sl: any) => 
        sl.id === id ? { ...sl, [field]: value } : sl
      )
    });
  };

  const handleRemoveSubLocation = (id: string) => {
    setFormData({
      ...formData,
      subLocations: formData.subLocations.filter((sl: any) => sl.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-slate-900/60 transition-all animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden relative animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        <div className="p-10 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
              {warehouse ? 'Anbarı Redaktə Et' : 'Yeni Anbar Yarat'}
            </h3>
            <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Anbar Adı</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-inner"
                placeholder="Mərkəzi Anbar"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Məkan / Ünvan</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-inner"
                placeholder="Bakı, ..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Məsul Şəxs</label>
                <input 
                  type="text" 
                  value={formData.manager}
                  onChange={e => setFormData({ ...formData, manager: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-inner"
                  placeholder="Ad Soyad"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Növ (Dinamik)</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none shadow-inner ring-2 ring-transparent focus:ring-indigo-500/20"
                >
                  {warehouseTypes.map((t: any) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Ümumi Sahə (m2)</label>
                <input 
                  type="number" 
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-inner"
                  placeholder="2500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic ml-2">Ümumi Tutum (m3)</label>
                <input 
                  type="number" 
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/50 rounded-2xl p-4 text-sm font-bold text-indigo-700 dark:text-indigo-300 shadow-inner"
                  placeholder="12000"
                />
              </div>
            </div>

            {/* SUB-LOCATIONS SECTION */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic leading-none flex items-center">
                   <Layers className="w-4 h-4 mr-2 text-primary-500" /> Alt Sahələr / Zonalar
                </h4>
                <button 
                  onClick={handleAddSubLocation}
                  className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Zona +</span>
                </button>
              </div>

              <div className="space-y-4 max-h-72 overflow-y-auto px-1 no-scrollbar">
                {formData.subLocations.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
                    <Layers className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-[10px] font-black uppercase italic tracking-widest">Heç bir zona əlavə edilməyib</p>
                  </div>
                ) : formData.subLocations.map((sl: any) => (
                  <div key={sl.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-4 duration-300 shadow-sm relative group/zone">
                    <button 
                      onClick={() => handleRemoveSubLocation(sl.id)}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all flex items-center justify-center shadow-lg opacity-0 group-hover/zone:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase ml-2 italic">Zona Adı</label>
                        <input 
                          type="text" 
                          value={sl.name}
                          onChange={e => handleUpdateSubLocation(sl.id, 'name', e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border-none rounded-xl p-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 shadow-inner"
                          placeholder="Rəf A1"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-indigo-400 uppercase ml-2 italic">Həcm (m3)</label>
                        <input 
                          type="number" 
                          value={sl.capacity}
                          onChange={e => handleUpdateSubLocation(sl.id, 'capacity', e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border-none rounded-xl p-2.5 text-[11px] font-bold text-indigo-600 shadow-inner"
                          placeholder="2000"
                        />
                      </div>
                        <div className="flex items-center space-x-2 mt-2 ml-2">
                           <button 
                             onClick={() => handleUpdateSubLocation(sl.id, 'isReserved', !sl.isReserved)}
                             className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all ${sl.isReserved ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                           >
                             <Bookmark className={`w-3 h-3 ${sl.isReserved ? 'text-white' : 'text-slate-400'}`} />
                             <span className="text-[9px] font-black uppercase italic">{sl.isReserved ? 'Bron Zonası' : 'Ümumi Zona'}</span>
                           </button>
                           {sl.isReserved && (
                             <span className="text-[8px] font-black text-rose-500 uppercase italic animate-pulse">Toxunulmaz sahə</span>
                           )}
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex space-x-4 sticky bottom-0 bg-white dark:bg-slate-900 pt-4 border-t border-slate-50/50 dark:border-slate-800/50">
             <button onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 italic">
               Ləğv Et
             </button>
             <button 
               onClick={() => onSave(formData)}
               className="flex-1 py-4 bg-primary-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-500/30 active:scale-95 italic"
             >
               Yadda Saxla
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WarehouseTypeModal = ({ types, onClose, onSave }: any) => {
  const [localTypes, setLocalTypes] = useState([...types]);
  const [newType, setNewType] = useState({ name: '', color: '#6366f1' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newType.name) return;
    
    let updated;
    if (editingId) {
      updated = localTypes.map(t => t.id === editingId ? { ...t, ...newType } : t);
      setEditingId(null);
    } else {
      updated = [...localTypes, { ...newType, id: Math.random().toString(36).substr(2, 9) }];
    }
    
    setLocalTypes(updated);
    onSave(updated);
    setNewType({ name: '', color: '#6366f1' });
  };

  const startEdit = (t: any) => {
    setNewType({ name: t.name, color: t.color });
    setEditingId(t.id);
  };

  const handleRemove = (id: string) => {
    const next = localTypes.filter(t => t.id !== id);
    setLocalTypes(next);
    onSave(next);
  };

  const colors = ['#6366f1', '#10b981', '#0ea5e9', '#f43f5e', '#f59e0b', '#a855f7', '#d946ef', '#64748b'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-3xl bg-slate-900/60 transition-all animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden relative animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic flex items-center">
              <Tag className="w-5 h-5 mr-3 text-indigo-500" /> Anbar Növləri
            </h3>
            <button onClick={onClose} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex space-x-2">
              <input 
                type="text"
                placeholder="Yeni növ adı..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[11px] font-bold shadow-inner"
                value={newType.name}
                onChange={e => setNewType({ ...newType, name: e.target.value })}
              />
              <button 
                onClick={handleAdd}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 px-1">
               {colors.map(c => (
                 <button 
                   key={c}
                   onClick={() => setNewType({ ...newType, color: c })}
                   className="w-6 h-6 rounded-full ring-offset-2 transition-all opacity-60 hover:opacity-100"
                   style={{ 
                     backgroundColor: c,
                     boxShadow: newType.color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : 'none',
                     opacity: newType.color === c ? 1 : 0.6,
                     transform: newType.color === c ? 'scale(1.1)' : 'scale(1)'
                   }}
                 ></button>
               ))}
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-2">
             {localTypes.map(t => (
               <div key={t.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl group border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                  <div 
                    onClick={() => startEdit(t)}
                    className="flex items-center space-x-3 cursor-pointer group-hover:scale-105 transition-transform"
                  >
                    <div className="w-2 h-6 rounded-full" style={{ backgroundColor: t.color }}></div>
                    <span className={`text-[11px] font-black uppercase italic ${editingId === t.id ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200'}`}>
                      {t.name}
                      {editingId === t.id && ' (Redaktə)'}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemove(t.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
               </div>
             ))}
          </div>

          <button onClick={onClose} className="w-full mt-8 py-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:bg-indigo-100 transition-all">
             Bağla
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseList;
