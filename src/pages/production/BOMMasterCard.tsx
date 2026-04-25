import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Eye,
  Layers,
  Settings2,
  AlertCircle,
  Copy,
  History,
  CheckCircle2,
  Lock,
  Unlock,
  Undo2,
  Power,
  Search
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TENGRY_NOMENCLATURE, TENGRY_BOMS } from '../../utils/tengryData';

const BOMMasterCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'create';
  const [activeTab, setActiveTab] = useState('components');
  const [isUsed, setIsUsed] = useState(false); 
  const [status, setStatus] = useState<'Draft' | 'Approved' | 'Locked'>('Draft');
  const [saveMessage, setSaveMessage] = useState('');

  // Mock data for initial state
  const [bomData, setBomData] = useState({
    id: '',
    targetItemId: '',
    version: 'v1.0',
    productionTimeDays: 1,
    status: 'Active',
    components: [] as any[]
  });

  // Simulated history data for the target product
  const [versionHistory, setVersionHistory] = useState([
    { id: 'BOM-FG-KRESLO-V10', version: 'v1.0', status: 'Deaktiv', firstActive: '01.01.2024', lastActive: '20.04.2024', user: 'Ali Əliyev' },
    { id: 'BOM-FG-KRESLO-V11', version: 'v1.1', status: 'Aktiv', firstActive: '21.04.2024', lastActive: '-', user: 'Ali Əliyev' },
  ]);

  const [previewVersion, setPreviewVersion] = useState<any>(null);

  const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false);
  const [selectedItemForAdd, setSelectedItemForAdd] = useState<any>(null);
  const [addQty, setAddQty] = useState(1);
  const [addUnit, setAddUnit] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Unit Groups for conversion (Normalized for easier matching)
  const unitGroups = {
    WEIGHT: ['Ton', 'Kq', 'Qram'],
    LENGTH: ['Metr', 'Dm', 'Sm', 'Mm'],
    AREA: ['M2', 'Sm2', 'Mm2'],
    VOLUME: ['Litr', 'Ml'],
    COUNT: ['Ədəd', 'Dəst', 'Paket', 'Rulon']
  };

  const getAvailableUnits = (baseUnit: string) => {
    const unit = baseUnit?.toUpperCase();
    if (['TON', 'KQ', 'KILOQRAM', 'QRAM', 'GR'].includes(unit)) return unitGroups.WEIGHT;
    if (['METR', 'M', 'SM', 'DM', 'MM'].includes(unit)) return unitGroups.LENGTH;
    if (['M2', 'KVADRAT METR', 'SM2'].includes(unit)) return unitGroups.AREA;
    if (['LITR', 'L', 'ML'].includes(unit)) return unitGroups.VOLUME;
    return unitGroups.COUNT;
  };

  const toggleStatus = (index: number) => {
    setVersionHistory(prev => prev.map((v, i) => {
      if (i === index) {
        return { ...v, status: v.status === 'Aktiv' ? 'Deaktiv' : 'Aktiv' };
      }
      return v;
    }));
  };

  // PERSISTENCE LOGIC
  const saveStatusToLocal = (newStatus: string) => {
    if (!id || isNew) return;
    localStorage.setItem(`BOM_STATUS_${id}`, newStatus);
    setStatus(newStatus as any);
    
    setSaveMessage('Dəyişikliklər yadda saxlanıldı');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  useEffect(() => {
    if (id && id !== 'create') {
      const existingBom = TENGRY_BOMS.find(b => b.id.toUpperCase().replace('_', '-').replace('BOM-', '') === id);
      if (existingBom) {
        setBomData({
          ...existingBom,
          version: (existingBom as any).version || 'v1.0',
          status: (existingBom as any).status || 'Active'
        });
        
        // Check localStorage first
        const savedStatus = localStorage.getItem(`BOM_STATUS_${id}`);
        if (savedStatus) {
          setStatus(savedStatus as any);
        } else {
          if (existingBom.id.includes('FG-01') || existingBom.id.includes('MASA')) {
            setIsUsed(true);
            setStatus('Locked');
          } else {
            setStatus('Approved');
          }
        }
      }
    }
  }, [id]);

  const targetProduct = TENGRY_NOMENCLATURE.find(i => i.id === bomData.targetItemId);

  const handleSaveDraft = () => {
    setSaveMessage('Qaralama uğurla yadda saxlanıldı');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const confirmAddComponent = () => {
    if (!selectedItemForAdd || status !== 'Draft') return;
    setBomData(prev => ({
      ...prev,
      components: [...prev.components, { itemId: selectedItemForAdd.id, quantity: addQty, unit: addUnit }]
    }));
    setIsAddComponentModalOpen(false);
    setSelectedItemForAdd(null);
    setAddQty(1);
    setSearchQuery('');
  };

  const removeComponent = (index: number) => {
    if (status !== 'Draft') return;
    setBomData(prev => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index)
    }));
  };

  const updateQuantity = (index: number, qty: number) => {
    if (isUsed) return;
    setBomData(prev => ({
      ...prev,
      components: prev.components.map((c, i) => i === index ? { ...c, quantity: qty } : c)
    }));
  };

  const createNewVersion = () => {
    const currentVersionNum = parseFloat(bomData.version.replace('v', ''));
    const newVersion = `v${(currentVersionNum + 0.1).toFixed(1)}`;
    
    setBomData(prev => ({
      ...prev,
      id: `BOM-${prev.targetItemId.toUpperCase()}-${newVersion.replace('.', '')}`,
      version: newVersion,
      status: 'Active'
    }));
    setIsUsed(false);
    setActiveTab('components');
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-slate-900 dark:text-slate-100">
      
      {/* ADD COMPONENT MODAL */}
      {isAddComponentModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAddComponentModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-[3.5rem] shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-[1.5rem] flex items-center justify-center text-primary-600 shadow-inner">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Yeni Komponent Əlavə Et</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter mt-1">Nomenklaturadan xammal və ya material seçin</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddComponentModalOpen(false)} 
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all hover:rotate-90"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* LEFT: NOMENCLATURE LIST */}
                <div className="flex flex-col space-y-6 overflow-hidden border-r border-slate-50 dark:border-slate-800/50 pr-5">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Ad və ya SKU ilə sürətli axtar..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-[1.5rem] pl-14 pr-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto pr-3 space-y-2 custom-scrollbar">
                    {TENGRY_NOMENCLATURE.filter(i => 
                      i.type !== 'FINISHED_GOOD' && 
                      (i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).map(item => (
                      <button 
                        key={item.id}
                        onClick={() => {
                          setSelectedItemForAdd(item);
                          setAddUnit(item.unit);
                        }}
                        className={`w-full text-left p-5 rounded-[1.5rem] transition-all flex items-center space-x-5 border ${
                          selectedItemForAdd?.id === item.id 
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 shadow-md shadow-primary-500/10' 
                            : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          selectedItemForAdd?.id === item.id ? 'bg-primary-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                        }`}>
                          <Package className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-black uppercase tracking-tight ${selectedItemForAdd?.id === item.id ? 'text-primary-600' : 'text-slate-700 dark:text-slate-200'}`}>
                            {item.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase italic tracking-tighter">{item.sku}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[9px] font-black text-primary-500/60 uppercase italic tracking-tighter">{item.unit}</span>
                          </div>
                        </div>
                        {selectedItemForAdd?.id === item.id && <CheckCircle2 className="w-5 h-5 text-primary-500 animate-in zoom-in" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RIGHT: SETTINGS */}
                <div className="flex flex-col justify-center">
                  {selectedItemForAdd ? (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 space-y-10 animate-in slide-in-from-right-8 duration-500">
                      <div className="text-center space-y-3">
                        <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-primary-600 shadow-2xl mx-auto border border-primary-100 dark:border-primary-900">
                          <Package className="w-10 h-10" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{selectedItemForAdd.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter mt-1">Ölçü vahidi və miqdarı daxil edin</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-8">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4 italic">İstifadə Miqdarı</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              autoFocus
                              value={addQty}
                              onChange={(e) => setAddQty(parseFloat(e.target.value))}
                              className="w-full bg-white dark:bg-slate-900 border-none rounded-[2rem] px-8 py-6 text-2xl font-black focus:ring-2 focus:ring-primary-500 transition-all tabular-nums shadow-sm"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-slate-300">
                              <span className="text-xs font-black uppercase italic">Norma</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4 italic">Seçilən Ölçü Vahidi</label>
                          <div className="grid grid-cols-2 gap-3">
                            {getAvailableUnits(selectedItemForAdd.unit).map(u => (
                              <button
                                key={u}
                                onClick={() => setAddUnit(u)}
                                className={`py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                                  addUnit === u 
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30' 
                                    : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-primary-200'
                                }`}
                              >
                                {u}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={confirmAddComponent}
                        className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center space-x-3"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Siyahıya Əlavə Et</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-6 opacity-40">
                      <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-16 h-16 text-slate-300" />
                      </div>
                      <p className="text-sm font-black text-slate-400 uppercase italic tracking-widest">Soldakı siyahıdan bir <br/> material seçin</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERSION PREVIEW MODAL */}
      {previewVersion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setPreviewVersion(null)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">Versiya Baxışı</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest italic ${previewVersion.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {previewVersion.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight tabular-nums">
                    {targetProduct?.name} <span className="text-primary-600">({previewVersion.version})</span>
                  </h2>
                </div>
                <button 
                  onClick={() => setPreviewVersion(null)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-6 flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Kalkulyasiya Tərkibi</span>
                </h3>
                <div className="space-y-4">
                  {bomData.components.map((comp, idx) => {
                    const item = TENGRY_NOMENCLATURE.find(i => i.id === comp.itemId);
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase">{item?.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase italic">{item?.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-800 dark:text-white tabular-nums">{comp.quantity} {comp.unit}</p>
                          <p className="text-[10px] font-black text-primary-500 uppercase italic">Standart Norma</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase italic px-4">
                <span>Yaradan: {previewVersion.user}</span>
                <span>Tarix: {previewVersion.firstActive}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4 flex-1">
          <button 
            onClick={() => navigate('/production/bom')}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">Reseptura Kartı</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">{bomData.version}</span>
              {isUsed && (
                <span className="flex items-center space-x-1 px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">
                  <Lock className="w-2.5 h-2.5" />
                  <span>İstifadə olunub</span>
                </span>
              )}
            </div>
            
            {isNew ? (
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative w-full md:w-80 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-primary-500">
                    <Package className="w-full h-full" />
                  </div>
                  <select 
                    value={bomData.targetItemId}
                    onChange={(e) => setBomData({...bomData, targetItemId: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm appearance-none"
                  >
                    <option value="">Hazır Məhsul Seçin...</option>
                    {TENGRY_NOMENCLATURE.filter(i => i.type === 'FINISHED_GOOD' || i.type === 'SEMI_FINISHED').map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
                    ))}
                  </select>
                </div>
                <div className="relative w-full md:w-64 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-primary-500">
                    <Layers className="w-full h-full" />
                  </div>
                  <input 
                    type="text"
                    placeholder="Reseptura Adı..."
                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm italic"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">
                  {targetProduct?.name || 'Yeni Reseptura'}
                </h1>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${
                  status === 'Draft' ? 'bg-slate-50 border-slate-200 text-slate-500' :
                  status === 'Approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                  'bg-indigo-50 border-indigo-200 text-indigo-600'
                }`}>
                  {status === 'Draft' ? 'Qaralama' : status === 'Approved' ? 'Təsdiqlənib' : 'Kilidli'}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {status === 'Draft' && (
            <>
              <button 
                onClick={handleSaveDraft}
                className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Qaralama Saxla</span>
              </button>
              <button 
                onClick={() => saveStatusToLocal('Approved')}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Təsdiqlə</span>
              </button>
            </>
          )}

          {status === 'Approved' && (
            <>
              <button 
                onClick={() => saveStatusToLocal('Draft')}
                className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-800 text-rose-600 border border-rose-100 dark:border-rose-900/30 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
              >
                <Undo2 className="w-4 h-4" />
                <span>Təsdiqi Ləğv Et</span>
              </button>
              <button 
                onClick={() => saveStatusToLocal('Locked')}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Kilidlə</span>
              </button>
            </>
          )}

          {status === 'Locked' && (
            <button 
              onClick={() => saveStatusToLocal('Approved')}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              <span>Kilidi Aç</span>
            </button>
          )}

          {!isNew && status !== 'Draft' && (
            <button 
              onClick={createNewVersion}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95"
            >
              <Copy className="w-4 h-4" />
              <span>Yeni Versiya</span>
            </button>
          )}
        </div>
      </div>

      {/* SAVE NOTIFICATION */}
      {saveMessage && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-full duration-300">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-black uppercase tracking-widest italic">{saveMessage}</span>
          </div>
        </div>
      )}

      {/* TABS (Ümumi Məlumat is now at the end) */}
      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-[2rem] w-fit border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
        {[
          { id: 'components', label: 'Komponentlər (BOM)', icon: Package },
          { id: 'history', label: 'Tarixçə', icon: History, hidden: isNew },
          { id: 'general', label: 'Ümumi Məlumat', icon: Settings2 },
        ].filter(t => !t.hidden).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-xl' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm min-h-[500px]">
        {activeTab === 'general' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* MAIN SETTINGS */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2 italic">Xüsusi Qeydlər və Təlimatlar</label>
                  <textarea 
                    rows={8}
                    placeholder="İstehsalat zamanı diqqət edilməli olan məqamlar, xüsusi paketləmə təlimatları və ya keyfiyyət meyarları..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] px-6 py-5 text-sm font-medium italic focus:ring-2 focus:ring-primary-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* STATS & INFO */}
              <div className="space-y-6">
                {!isNew && (
                  <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-[5rem] -mr-16 -mt-16" />
                    <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest mb-6 italic">İstehsalat Statistikası</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 italic">Ümumi İstehsal:</span>
                        <span className="text-xl font-black italic tabular-nums">1,240 Ədəd</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 italic">Son İstehsal Tarixi:</span>
                        <span className="text-[11px] font-black italic tabular-nums">12.04.2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 italic">Ortalama Maya Dəyəri:</span>
                        <span className="text-[11px] font-black italic tabular-nums text-emerald-400">₼ 165.09</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-[2.5rem] p-8 border border-primary-100 dark:border-primary-800/50">
                  <div className="flex items-center space-x-3 mb-4 text-primary-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Texniki Standartlar</span>
                  </div>
                  <ul className="space-y-3">
                    {['ISO 9001 Uyğunluğu', 'Material Sərtlik Testi', 'Rəng Kodlaşdırma (RAL)'].map((s, i) => (
                      <li key={i} className="text-[11px] font-bold text-slate-600 dark:text-slate-300 italic flex items-center space-x-2">
                        <div className="w-1 h-1 bg-primary-400 rounded-full" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight flex items-center space-x-3">
                <Package className="w-5 h-5 text-primary-600" />
                <span>Material və Komponentlərin Siyahısı</span>
              </h3>
              {!isUsed && (
                <button 
                  onClick={() => setIsAddComponentModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Komponent Əlavə Et</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic pl-4">№</th>
                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Komponent</th>
                    <th className="text-center py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Məntiqi Tip</th>
                    <th className="text-center py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Miqdar</th>
                    <th className="text-center py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Vahid</th>
                    {!isUsed && <th className="text-right py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic pr-4">Sil</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {bomData.components.map((comp, idx) => {
                    const item = TENGRY_NOMENCLATURE.find(i => i.id === comp.itemId);
                    return (
                      <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-5 text-xs font-black text-slate-400 italic pl-4">{idx + 1}</td>
                        <td className="py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase">{item?.name}</span>
                            <span className="text-[10px] font-black text-slate-400 italic uppercase">{item?.sku}</span>
                          </div>
                        </td>
                        <td className="py-5 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[9px] font-black uppercase italic">
                            {item?.type === 'RAW_MATERIAL' ? 'Xammal' : item?.type === 'SEMI_FINISHED' ? 'Yarımfabrikat' : 'Köməkçi'}
                          </span>
                        </td>
                        <td className="py-5 text-center">
                          <input 
                            type="number" 
                            disabled={isUsed}
                            value={comp.quantity}
                            onChange={(e) => updateQuantity(idx, parseFloat(e.target.value))}
                            className="w-20 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-3 py-2 text-sm font-black text-center focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
                          />
                        </td>
                        <td className="py-5 text-center">
                          <span className="text-xs font-black text-slate-400 uppercase italic">{comp.unit}</span>
                        </td>
                        {!isUsed && (
                          <td className="py-5 text-right pr-4">
                            <button 
                              onClick={() => removeComponent(idx)}
                              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {bomData.components.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center text-slate-300">
                          <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-sm font-bold italic">Hələ ki heç bir komponent əlavə edilməyib.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Reseptura Versiyaları və Tarixçə</h3>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Cəmi {versionHistory.length} versiya</span>
            </div>
            
            <div className="overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left py-5 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Versiya ID</th>
                    <th className="text-center py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                    <th className="text-center py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">İlk Aktivlik</th>
                    <th className="text-center py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Son Aktivlik</th>
                    <th className="text-center py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">İstifadəçi</th>
                    <th className="text-right py-5 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                  {versionHistory.map((v, i) => (
                    <tr key={i} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${v.status === 'Active' ? 'bg-primary-50/20' : ''}`}>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tabular-nums">{v.id}</span>
                          <span className="text-[10px] font-black text-primary-500 italic tracking-tighter">Versiya {v.version}</span>
                        </div>
                      </td>
                      <td className="py-5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest italic ${
                          v.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' 
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                        }`}>
                          {v.status === 'Active' ? 'Aktiv' : 'Deaktiv'}
                        </span>
                      </td>
                      <td className="py-5 text-center">
                        <span className="text-[11px] font-bold text-slate-500 italic tabular-nums">{v.firstActive}</span>
                      </td>
                      <td className="py-5 text-center">
                        <span className="text-[11px] font-bold text-slate-500 italic tabular-nums">{v.lastActive}</span>
                      </td>
                      <td className="py-5 text-center text-xs font-bold text-slate-600 dark:text-slate-400 italic">
                        {v.user}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => setPreviewVersion(v)}
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                            title="Baxış"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toggleStatus(i)}
                            className={`p-2 rounded-xl transition-all ${
                              v.status === 'Aktiv' 
                                ? 'text-emerald-500 hover:bg-rose-50 hover:text-rose-500' 
                                : 'text-slate-300 hover:bg-emerald-50 hover:text-emerald-500'
                            }`}
                            title={v.status === 'Aktiv' ? 'Deaktiv et' : 'Aktiv et'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-900/20 rounded-2xl p-6 flex items-start space-x-4">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-1" />
              <div className="space-y-1">
                <p className="text-xs font-black text-amber-800 dark:text-amber-200 uppercase tracking-tight italic">Məlumat</p>
                <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 leading-relaxed italic">
                  Deaktiv edilmiş resepturalar üzərində dəyişiklik etmək mümkün deyil. Onlar yalnız baxış və yeni versiya üçün baza kimi istifadə oluna bilər. Aktiv istehsalat sənədləri həmişə ən son "Aktiv" versiyaya istinad edir.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BOMMasterCard;
