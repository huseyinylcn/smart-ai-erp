import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Clock,
  FileText, CheckCircle2,
  Printer, Trash2, Warehouse, Plus,
  Search, Calculator, ClipboardList,
  RefreshCw, Calendar, Users, User,
  Save, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Target, X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { useCompany } from '../../context/CompanyContext';
import { inventoryApi } from '../../utils/api';

interface InventoryItem {
  id: string;
  name: string;
  code: string;
  uom: string;
  size?: string;
  systemQty: number;
  actualQty: number;
}

const InventoryCountCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`INV-CNT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`);
  
  // States
  const [warehouse, setWarehouse] = useState('');
  const [countDate, setCountDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState('');
  const [note, setNote] = useState('');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const { activeCompany } = useCompany();

  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Sement Hörmə (Kisə)', code: 'PR-CM-01', uom: 'ƏDƏD', systemQty: 100, actualQty: 98, size: '-' },
    { id: '2', name: 'Armatur A500C 12mm', code: 'PR-ST-12', uom: 'TON', systemQty: 5.4, actualQty: 5.4, size: '12M' },
    { id: '3', name: 'Beton Marka M400', code: 'BET-400', uom: 'M3', systemQty: 124, actualQty: 124, size: '-' },
    { id: '4', name: 'Boya Xarici Cəbhə', code: 'PNT-EXT', uom: 'LITR', systemQty: 45, actualQty: 40, size: '20L' },
    { id: '5', name: 'Kafel Metlax (Ağ)', code: 'TILE-W', uom: 'M2', systemQty: 250, actualQty: 245, size: '60x60' },
  ]);

  useEffect(() => {
    const savedWarehouses = localStorage.getItem('erp_warehouses');
    if (savedWarehouses) setWarehouses(JSON.parse(savedWarehouses));
    
    if (activeCompany?.id) {
       inventoryApi.getItems({ companyId: activeCompany.id }).then(res => {
         if(res?.data && res.data.length > 0) {
            setAvailableItems(res.data);
         } else {
            setAvailableItems([
               { id: 'm1', name: 'Alçıpan (Ağ)', sku: 'ALC-01', uom: 'ƏDƏD', size: '120x240' },
               { id: 'm2', name: 'Profil U', sku: 'PRF-U', uom: 'M', size: '3M' }
            ]);
         }
       }).catch(() => {
           setAvailableItems([
             { id: 'm1', name: 'Alçıpan (Ağ)', sku: 'ALC-01', uom: 'ƏDƏD', size: '120x240' },
             { id: 'm2', name: 'Profil U', sku: 'PRF-U', uom: 'M', size: '3M' }
           ]);
       });
    }
  }, [activeCompany?.id]);

  const handleAddItem = (item: any) => {
    if (items.some(i => i.id === item.id)) {
      alert("Bu məhsul artıq siyahıdadır!");
      return;
    }
    const newItem: InventoryItem = {
      id: item.id,
      name: item.name,
      code: item.sku || item.code || `ITM-${item.id}`,
      uom: item.uom || 'ƏDƏD',
      size: item.size || '-',
      systemQty: 0,
      actualQty: 0
    };
    setItems([newItem, ...items]);
    setIsItemModalOpen(false);
    setItemSearchQuery('');
  };

  const selectedWarehouseData = warehouses.find(w => w.id === warehouse);

  const handleSave = (isDraft: boolean = false) => {
    if (!warehouse) {
      alert('Zəhmət olmasa anbarı seçin');
      return;
    }

    const diffs = items.filter(i => i.actualQty !== i.systemQty);
    const resultText = diffs.length > 0 
      ? `${diffs.length} Məhsulda Fərq` 
      : "Stok Uyğundur";

    const newCount = {
      id: id || `cnt-${Date.now()}`,
      docNumber,
      warehouse: selectedWarehouseData?.name || warehouse,
      warehouseId: warehouse,
      date: countDate,
      participants,
      result: resultText,
      itemsCount: items.length,
      note,
      status: isDraft ? "Qaralama" : (diffs.length > 0 ? "Düzəliş Gözləyir" : "Tamamlanıb"),
      isDraft,
      items: items.map(i => ({ ...i }))
    };

    const savedCounts = localStorage.getItem('erp_inventory_counts');
    const counts = savedCounts ? JSON.parse(savedCounts) : [];
    
    // Remove if updating draft
    const filteredCounts = counts.filter((c: any) => c.id !== newCount.id);
    
    localStorage.setItem('erp_inventory_counts', JSON.stringify([...filteredCounts, newCount]));
    
    if (isDraft) {
      alert('Sayım aktı qaralama kimi yadda saxlanıldı. Qaldığınız yerdən davam edə bilərsiniz.');
    } else {
      setCurrentStatus('POSTED');
      setTimeout(() => {
        navigate('/inventory/adjustments');
      }, 1500);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const extraCount = items.filter(i => i.actualQty > i.systemQty).length;
  const shortageCount = items.filter(i => i.actualQty < i.systemQty).length;
  const accuracy = items.length > 0 ? ((items.filter(i => i.actualQty === i.systemQty).length / items.length) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-indigo-100 dark:border-indigo-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <ClipboardList className="w-6 h-6 mr-2 text-indigo-500" /> İnventarizasiya Aktı
                    </h1>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">INVENTORY COUNT</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic"><Clock className="w-3.5 h-3.5 mr-1 text-indigo-500" /> {new Date().toLocaleDateString()}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => handleSave(true)} className="flex items-center space-x-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Qaralama Saxla</span>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => handleSave(false)} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Aktı Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      {/* FULL WIDTH LAYOUT */}
      <div className="space-y-8">
            
          {/* Context Info (4 columns) */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center italic">
                          <Warehouse className="w-3.5 h-3.5 mr-2" /> Sayım Aparılan Anbar
                      </label>
                      <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all">
                          <option value="">Anbar seçin...</option>
                          {warehouses.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                      </select>
                  </div>

                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                          <Calendar className="w-3.5 h-3.5 mr-2" /> Sayım Tarixi
                      </label>
                      <input 
                        type="date" 
                        value={countDate}
                        onChange={(e) => setCountDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-600 dark:text-slate-300"
                      />
                  </div>

                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                          <User className="w-3.5 h-3.5 mr-2" /> Anbar Məsul Şəxsi
                      </label>
                      <div className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner text-slate-600 dark:text-slate-300 flex items-center">
                          {selectedWarehouseData?.manager || 'Təyin edilməyib'}
                      </div>
                  </div>

                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                          <Users className="w-3.5 h-3.5 mr-2" /> Sayım İştirakçıları
                      </label>
                      <input 
                        type="text" 
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                        placeholder="Məsələn: Əli Babayev, Vəli..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-600 dark:text-slate-300"
                      />
                  </div>
              </div>
          </div>

          {/* Horizontal Summary & Notes (2 rows equivalent or 1 big grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Stat Cards (Col span 8) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Artıqlıq */}
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Artıqlıq (Məhsul)</p>
                          <p className="text-2xl font-black italic text-emerald-500 tabular-nums">{extraCount}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6" />
                      </div>
                  </div>
                  {/* Çatışmazlıq */}
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Çatışmazlıq</p>
                          <p className="text-2xl font-black italic text-rose-500 tabular-nums">{shortageCount}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                          <TrendingDown className="w-6 h-6" />
                      </div>
                  </div>
                  {/* Dəqiqlik */}
                  <div className="bg-indigo-600 text-white rounded-[2rem] p-6 flex items-center justify-between shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                      <div className="relative z-10">
                          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest italic mb-1">Sayım Dəqiqliyi</p>
                          <p className="text-2xl font-black italic tabular-nums">{accuracy}%</p>
                      </div>
                      <Target className="absolute right-[-10px] bottom-[-10px] w-20 h-20 text-white/10 group-hover:scale-110 transition-transform" />
                  </div>
              </div>

              {/* Note (Col span 4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col shadow-sm">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic mb-3">
                      <FileText className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Komissiya Qeydi
                  </label>
                  <textarea 
                    rows={2} 
                    value={note} 
                    onChange={e => setNote(e.target.value)} 
                    placeholder="Sayım nəticələri barədə açıqlama..." 
                    className="w-full flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-[11px] font-bold italic shadow-inner resize-none outline-none focus:ring-1 focus:ring-indigo-500/20"
                  ></textarea>
              </div>
          </div>

          {/* Table (Full Width Premium Design) */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center italic">
                      <Search className="w-4 h-4 mr-2 text-indigo-500" /> Məhsul Müqayisəsi (Nomenklatura Sırası)
                  </h3>
                  <button onClick={() => setIsItemModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Siyahıya Əlavə Et</span>
                  </button>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-[#FAFBFD] dark:bg-slate-800/50">
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                              <th className="px-8 py-6 w-16 text-center">№</th>
                              <th className="px-8 py-6">Kod / Məhsul</th>
                              <th className="px-8 py-6 text-center">Ölçü Vahidi</th>
                              <th className="px-8 py-6 text-center">Ölçüsü</th>
                              <th className="px-8 py-6 text-center bg-slate-100/50 dark:bg-slate-800/80">Sistem Qalığı</th>
                              <th className="px-8 py-6 text-center bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-600">Faktiki Qalıq (Fiziki)</th>
                              <th className="px-8 py-6 text-center">Fərq (+/-)</th>
                              <th className="px-8 py-6 text-right pr-10">Əməliyyat</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800 border-b border-slate-50 dark:border-slate-800">
                          {paginatedItems.map((item, index) => {
                              const diff = item.actualQty - item.systemQty;
                              const realIndex = startIndex + index;
                              return (
                                  <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                      <td className="px-8 py-5 text-center text-slate-300 font-mono italic text-xs tabular-nums">
                                          {(realIndex + 1).toString().padStart(2, '0')}
                                      </td>
                                      <td className="px-8 py-5">
                                          <div className="flex flex-col">
                                              <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{item.code}</span>
                                              <span className="text-sm font-black text-slate-800 dark:text-white italic tracking-tight uppercase leading-none group-hover:text-indigo-600 transition-colors">{item.name}</span>
                                          </div>
                                      </td>
                                      <td className="px-8 py-5 text-center">
                                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase italic">{item.uom}</span>
                                      </td>
                                      <td className="px-8 py-5 text-center">
                                          <span className="text-[11px] font-black text-slate-500 italic uppercase">{item.size || '-'}</span>
                                      </td>
                                      <td className="px-8 py-5 text-center font-black italic text-slate-500 dark:text-slate-400 tabular-nums text-sm bg-slate-50/30 dark:bg-slate-800/30">
                                          {item.systemQty}
                                      </td>
                                      <td className="px-8 py-5 text-center bg-indigo-50/10 dark:bg-indigo-900/5">
                                          <div className="flex justify-center">
                                              <input 
                                                  type="number" 
                                                  value={item.actualQty === 0 && item.actualQty.toString() !== "0" ? "" : item.actualQty} 
                                                  onChange={(e) => {
                                                      const news = [...items];
                                                      news[realIndex].actualQty = Number(e.target.value);
                                                      setItems(news);
                                                  }}
                                                  className="w-24 bg-white dark:bg-slate-800 border-2 border-indigo-100 break-words dark:border-indigo-900/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-2 px-3 text-center font-black text-sm italic shadow-inner outline-none transition-all text-indigo-700 dark:text-indigo-300"
                                              />
                                          </div>
                                      </td>
                                      <td className="px-8 py-5 text-center">
                                          <span className={`px-3 py-1.5 rounded-xl font-black text-[11px] tabular-nums italic ${diff === 0 ? 'bg-slate-100 text-slate-400' : diff > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                              {diff > 0 ? '+' : ''}{diff}
                                          </span>
                                      </td>
                                      <td className="px-8 py-5 text-right pr-10">
                                          <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                              <Trash2 className="w-4 h-4" />
                                          </button>
                                      </td>
                                  </tr>
                              );
                          })}
                          {paginatedItems.length === 0 && (
                            <tr>
                              <td colSpan={8} className="px-8 py-12 text-center text-slate-400 font-bold italic">Siyahıda məhsul yoxdur</td>
                            </tr>
                          )}
                      </tbody>
                  </table>
              </div>

              {/* Pagination Controls */}
              <div className="px-8 py-5 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Hər səhifədə:</span>
                      <select 
                          value={itemsPerPage} 
                          onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                          className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-1 px-3 text-[10px] font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600"
                      >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                          <option value={200}>200</option>
                      </select>
                  </div>
                  <div className="flex items-center space-x-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                          Cəmi {items.length} məhsul, Səhifə {currentPage} / {totalPages || 1}
                      </span>
                      <div className="flex items-center space-x-1">
                          <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-all font-black italic"
                          >
                              <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-all font-black italic"
                          >
                              <ChevronRight className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Item Selection Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic flex items-center">
                        <Search className="w-4 h-4 mr-2 text-indigo-500" /> Nomenklaturadan Məhsul Seçimi
                    </h2>
                    <button onClick={() => setIsItemModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Məhsul adı və ya KOD ilə axtar..." 
                            value={itemSearchQuery}
                            onChange={(e) => setItemSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    <div className="grid grid-cols-1 gap-1">
                        {availableItems.filter(i => (i.name || '').toLowerCase().includes(itemSearchQuery.toLowerCase()) || (i.sku || '').toLowerCase().includes(itemSearchQuery.toLowerCase())).map(item => (
                            <button 
                                key={item.id}
                                onClick={() => handleAddItem(item)}
                                className="w-full flex items-center justify-between p-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-2xl transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 text-left cursor-pointer"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-mono text-slate-400">{item.sku || `ITM-${item.id}`}</span>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 italic group-hover:text-indigo-600 transition-colors uppercase">{item.name}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-[10px] font-black uppercase italic">{item.uom || 'ƏDƏD'}</span>
                                    <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </div>
                            </button>
                        ))}
                        {availableItems.filter(i => (i.name || '').toLowerCase().includes(itemSearchQuery.toLowerCase()) || (i.sku || '').toLowerCase().includes(itemSearchQuery.toLowerCase())).length === 0 && (
                            <div className="p-8 text-center text-slate-400 font-bold italic text-sm">
                                Nəticə tapılmadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex items-center space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-800 transition-all italic underline underline-offset-8">Çıxış</button>
              <button onClick={() => handleSave(true)} className="px-10 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center space-x-2">
                 <Save className="w-4 h-4" />
                 <span>Qaralama Saxla</span>
              </button>
              <button onClick={() => handleSave(false)} className="px-16 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Sayımı Bitir (Təsdiqlə)</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default InventoryCountCreate;

