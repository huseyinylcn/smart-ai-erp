import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Settings2, Clock,
  FileText, CheckCircle2,
  Printer, Trash2, Warehouse, Plus,
  Search, Calculator, Info,
  History, TrendingUp, TrendingDown,
  ArrowRightLeft, BookOpen, ClipboardList, Database
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import JournalPreviewModal from '../../components/JournalPreviewModal';
import { hasPermission } from '../../utils/permissionHelper';

interface AdjustmentItem {
  id: string;
  name: string;
  code: string;
  uom: string;
  quantity: number;
  type: 'INCREASE' | 'DECREASE';
  unitPrice: number;
}

const StockAdjustmentCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`INV-ADJ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`);
  
  const [adjustmentMode, setAdjustmentMode] = useState<'MANUAL' | 'COUNT_BASED'>('MANUAL');
  const [warehouse, setWarehouse] = useState('');
  const [reason, setReason] = useState('Anbar Düzəlişi');
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  const [selectedCountId, setSelectedCountId] = useState('');
  
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [completedCounts, setCompletedCounts] = useState<any[]>([]);
  
  const [items, setItems] = useState<AdjustmentItem[]>([
    { id: '1', name: 'Alçıpan (Ağ) 12.5mm', code: 'PR-GP-W12', uom: 'vərəq', quantity: 5, type: 'INCREASE', unitPrice: 12.00 }
  ]);

  useEffect(() => {
    const savedWarehouses = localStorage.getItem('erp_warehouses');
    if (savedWarehouses) setWarehouses(JSON.parse(savedWarehouses));
    
    // Load inventory counts
    const savedCounts = localStorage.getItem('erp_inventory_counts');
    if (savedCounts) {
       const counts = JSON.parse(savedCounts);
       const validCounts = counts.filter((c: any) => c.status === 'Tamamlanıb' || c.status === 'Düzəliş Gözləyir');
       setCompletedCounts(validCounts);
    }
  }, []);

  const handleCountSelect = (countId: string) => {
    setSelectedCountId(countId);
    if (!countId) return;
    
    const count = completedCounts.find(c => c.id === countId);
    if (!count) return;
    
    setWarehouse(count.warehouseId);
    setReason(`İnventarizasiya Aktı №${count.docNumber}`);
    
    const diffItems = count.items.filter((i: any) => i.actualQty !== i.systemQty);
    const newItems = diffItems.map((i: any, index: number) => {
      const diff = i.actualQty - i.systemQty;
      return {
         id: `adji-${Date.now()}-${index}`,
         name: i.name,
         code: i.code,
         uom: i.uom,
         quantity: Math.abs(diff),
         type: diff > 0 ? 'INCREASE' : 'DECREASE',
         unitPrice: 0 // Will be set manually by user
      };
    });
    
    setItems(newItems);
  };

  const handleModeChange = (mode: 'MANUAL' | 'COUNT_BASED') => {
      setAdjustmentMode(mode);
      if (mode === 'COUNT_BASED') {
         setSelectedCountId('');
         setItems([]);
         setReason('Sayım Nəticəsi');
      } else {
         setReason('Sərbəst Düzəliş');
      }
  };

  const handleSave = () => {
    if (!warehouse) {
      alert('Zəhmət olmasa anbarı seçin');
      return;
    }

    const newAdjustment = {
      id: id || `adj-${Date.now()}`,
      docNumber,
      warehouse: warehouses.find(w => w.id === warehouse)?.name || warehouse,
      warehouseId: warehouse,
      reason,
      date: new Date().toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: items.every(i => i.type === 'INCREASE') ? 'Artım (Plus)' : items.every(i => i.type === 'DECREASE') ? 'Azalma (Minus)' : 'Qarışıq',
      value: items.reduce((s, i) => s + (i.quantity * i.unitPrice), 0),
      items: items.map(i => ({ ...i })),
      status: 'Təsdiqlənib',
      relatedCountId: adjustmentMode === 'COUNT_BASED' ? selectedCountId : null
    };

    const savedAdjustments = localStorage.getItem('erp_stock_adjustments');
    const adjustments = savedAdjustments ? JSON.parse(savedAdjustments) : [];
    
    localStorage.setItem('erp_stock_adjustments', JSON.stringify([...adjustments, newAdjustment]));
    
    // Also record stock moves
    const savedMoves = localStorage.getItem('erp_stock_moves');
    const moves = savedMoves ? JSON.parse(savedMoves) : [];
    const newMoves = items.map(item => ({
      id: `move-${Date.now()}-${item.id}`,
      date: new Date().toISOString(),
      itemCode: item.code,
      itemName: item.name,
      warehouseName: newAdjustment.warehouse,
      type: item.type === 'INCREASE' ? 'IN' : 'OUT',
      quantity: item.quantity,
      reference: docNumber
    }));
    localStorage.setItem('erp_stock_moves', JSON.stringify([...moves, ...newMoves]));

    // If COUNT_BASED, update the count's status
    if (adjustmentMode === 'COUNT_BASED' && selectedCountId) {
        const savedCounts = localStorage.getItem('erp_inventory_counts');
        if (savedCounts) {
           const counts = JSON.parse(savedCounts);
           const updatedCounts = counts.map((c: any) => {
               if (c.id === selectedCountId) {
                   return { ...c, status: 'Tamamlanıb', isAdjusted: true };
               }
               return c;
           });
           localStorage.setItem('erp_inventory_counts', JSON.stringify(updatedCounts));
        }
    }

    setCurrentStatus('POSTED');
    setTimeout(() => {
      navigate('/inventory/adjustments');
    }, 1500);
  };

  const totalIncrease = items.filter(i => i.type === 'INCREASE').reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
  const totalDecrease = items.filter(i => i.type === 'DECREASE').reduce((s, i) => s + (i.quantity * i.unitPrice), 0);

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-primary-100 dark:border-primary-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-primary-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <Settings2 className="w-6 h-6 mr-2 text-primary-500" /> Anbar Düzəlişi
                    </h1>
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-600 border border-primary-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">STOCK ADJUSTMENT</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic"><Clock className="w-3.5 h-3.5 mr-1 text-primary-500" /> {new Date().toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center text-primary-600 font-bold"><Warehouse className="w-3.5 h-3.5 mr-1" /> {warehouses.find(w => w.id === warehouse)?.name || 'Anbar Seçilməyib'}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            {hasPermission('FINANCE', 'view') && (
              <button 
                onClick={() => setIsJournalVisible(true)}
                className="flex items-center space-x-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xs uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-500/10 active:scale-95 italic tabular-nums"
              >
                  <BookOpen className="w-4 h-4 shadow-sm" />
                  <span>Müxabirləşməyə bax</span>
              </button>
            )}
            <button onClick={handleSave} className="flex items-center space-x-2 px-8 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Düzəlişi Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* Header Box (Dual Mode) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6">
                
                {/* Mode Selector */}
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-2">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600">
                           <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-widest">Düzəliş Meyarı</h2>
                            <p className="text-[10px] text-slate-400 font-bold italic mt-0.5">Sərbəst məlumat daxil edin və ya mövcud sayıma istinad edin</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-[320px]">
                        <button 
                            onClick={() => handleModeChange('MANUAL')} 
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${adjustmentMode === 'MANUAL' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            Sərbəst (Tək)
                        </button>
                        <button 
                            onClick={() => handleModeChange('COUNT_BASED')} 
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${adjustmentMode === 'COUNT_BASED' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            Sayım Əsasında
                        </button>
                    </div>
                </div>

                {/* Form Elements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Warehouse selection */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic text-primary-600">
                            <Warehouse className="w-3.5 h-3.5 mr-2" /> Hədəf Anbar
                        </label>
                        <select 
                            value={warehouse} 
                            onChange={(e) => setWarehouse(e.target.value)} 
                            disabled={adjustmentMode === 'COUNT_BASED'}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none disabled:opacity-60 transition-all"
                        >
                            <option value="">Anbar seçin...</option>
                            {warehouses.map(w => (
                              <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                             <ClipboardList className="w-3.5 h-3.5 mr-2 text-primary-500" /> Düzəliş Üçün Əsas (Sənəd)
                        </label>
                        {adjustmentMode === 'MANUAL' ? (
                            <input 
                                type="text" 
                                value={reason} 
                                onChange={e => setReason(e.target.value)} 
                                placeholder="Məs: Sərbəst düzəliş aktı №42" 
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-primary-500/10 transition-all" 
                            />
                        ) : (
                            <select 
                                value={selectedCountId} 
                                onChange={(e) => handleCountSelect(e.target.value)} 
                                className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 border-none rounded-2xl py-4 px-6 text-sm font-black italic text-indigo-700 dark:text-indigo-300 shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            >
                                <option value="">İnventarizasiya Aktını Seçin...</option>
                                {completedCounts.map((c: any) => (
                                  <option key={c.id} value={c.id}>Sayım Aktı: № {c.docNumber} - {c.date} ({c.warehouse})</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-all">
                {adjustmentMode === 'COUNT_BASED' && items.length > 0 && (
                    <div className="bg-blue-50/50 dark:bg-blue-900/20 px-8 py-3 flex text-xs font-bold text-blue-600 dark:text-blue-300 italic items-center transition-all animate-in slide-in-from-top">
                       <Info className="w-4 h-4 mr-2" />
                       Yuxarıda seçilən Sayım Aktına əsasən {items.length} məhsulun fərq (artım/azalma) detalı avtomatik olaraq cədvələ yükləndi. Vahid qiymətləri qeyd etməlisiniz.
                    </div>
                )}
                
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FAFBFD] dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-5">Kod / Məhsul</th>
                            <th className="px-5 py-5 text-center">Növ</th>
                            <th className="px-5 py-5 text-right w-32">Miqdar (Fərq)</th>
                            <th className="px-5 py-5 text-right w-40 text-primary-600">Vahid Qiymət</th>
                            <th className="px-5 py-5 text-right w-40">Cəmi</th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold text-slate-600 dark:text-slate-300 italic">
                        {items.length === 0 ? (
                           <tr>
                             <td colSpan={6} className="px-8 py-16 text-center text-slate-400 font-bold italic">
                                Siyahıda məhsul yoxdur
                             </td>
                           </tr>
                        ) : items.map((item, index) => (
                            <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800/50 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{item.code}</span>
                                        <span className="text-slate-800 dark:text-white font-black">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-5 text-center">
                                    <select 
                                        value={item.type}
                                        onChange={(e) => {
                                            const news = [...items];
                                            news[index].type = e.target.value as 'INCREASE' | 'DECREASE';
                                            setItems(news);
                                        }}
                                        className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border-none shadow-sm outline-none ${item.type === 'INCREASE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                                    >
                                        <option value="INCREASE">ARTIM (+)</option>
                                        <option value="DECREASE">ƏSKİKLİK (-)</option>
                                    </select>
                                </td>
                                <td className="px-5 py-5 text-right">
                                    <input type="number" value={item.quantity} onChange={(e) => {
                                        const news = [...items];
                                        news[index].quantity = Number(e.target.value);
                                        setItems(news);
                                    }} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-1.5 px-3 text-right font-black italic shadow-inner focus:ring-2 focus:ring-primary-500/10 outline-none transition-all" />
                                </td>
                                <td className="px-5 py-5 text-right font-mono tabular-nums text-slate-400">
                                     <input type="number" value={item.unitPrice === 0 ? '' : item.unitPrice} placeholder="0.00" onChange={(e) => {
                                        const news = [...items];
                                        news[index].unitPrice = Number(e.target.value);
                                        setItems(news);
                                    }} className="w-full bg-white dark:bg-slate-800 border-2 border-primary-50/50 dark:border-primary-900/30 rounded-lg py-1.5 px-3 text-right font-black italic shadow-inner tracking-widest text-primary-600 focus:border-primary-300 outline-none transition-all" />
                                </td>
                                <td className="px-5 py-5 text-right font-black italic tabular-nums text-primary-600">{(item.quantity * item.unitPrice).toLocaleString()} ₼</td>
                                <td className="px-8 py-5 text-right">
                                    <button onClick={() => {
                                        const news = [...items];
                                        news.splice(index, 1);
                                        setItems(news);
                                    }} className="p-2 text-slate-200 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-8 text-center bg-slate-50/30 dark:bg-slate-800/30">
                    <button 
                        onClick={() => {
                             setItems([...items, { id: `m-${Date.now()}`, name: 'Seçilməyib', code: '---', uom: 'ƏDƏD', quantity: 0, type: 'INCREASE', unitPrice: 0 }])
                        }}
                        className="flex items-center space-x-3 mx-auto px-8 py-3 bg-white dark:bg-slate-900 border border-primary-50 dark:border-primary-900/50 rounded-2xl text-primary-600 font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Məhsul (Sətir) Əlavə Et</span>
                    </button>
                </div>
            </div>
        </div>

        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 italic">Düzəliş Fakturası</h3>
                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-500 uppercase italic">Gəlir (Artım):</span>
                            <span className="font-black italic text-emerald-400">+{totalIncrease.toLocaleString()} ₼</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-500 uppercase italic">Zərər (Əskiklik):</span>
                            <span className="font-black italic text-rose-400">-{totalDecrease.toLocaleString()} ₼</span>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-primary-400 uppercase italic">NET NƏTİCƏ:</span>
                            <span className="text-xl font-black italic">{(totalIncrease - totalDecrease).toLocaleString()} ₼</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-[60px] opacity-10"></div>
                <ArrowRightLeft className="absolute bottom-[-20px] right-2 w-32 h-32 text-white/5 rotate-[-15deg] group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <Info className="w-3.5 h-3.5 mr-2 text-primary-500" /> Müxbir Hesablar
                </h4>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black">
                        <span className="text-slate-400 italic">Əskiklik Hesabı:</span>
                        <span className="text-rose-500">731 (Digər Xərclər)</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black">
                        <span className="text-slate-400 italic">Artıqlıq Hesabı:</span>
                        <span className="text-emerald-500">631 (Digər Gəlirlər)</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-800 transition-all italic underline underline-offset-8">Ləğv Et</button>
              <button onClick={handleSave} className="px-16 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Düzəlişi Bitir</span>
              </button>
          </div>
      </div>
      <JournalPreviewModal 
          isOpen={isJournalVisible} 
          onClose={() => setIsJournalVisible(false)} 
          periodClosed={false} 
          isAdmin={true}
          initialLines={[
            { id: '1', accountCode: totalIncrease > 0 ? '205' : '721', accountName: totalIncrease > 0 ? 'Mallar' : 'İnzibati xərclər', description: `Düzəliş - ${docNumber}`, debit: totalIncrease || totalDecrease, credit: 0 },
            { id: '2', accountCode: totalIncrease > 0 ? '611' : '205', accountName: totalIncrease > 0 ? 'Digər əməliyyat gəlirləri' : 'Mallar', description: `Düzəliş - ${docNumber}`, debit: 0, credit: totalIncrease || totalDecrease }
          ]}
       />
    </div>
  );
};

export default StockAdjustmentCreate;
