import { useState } from 'react';
import { 
  ArrowLeft, PackageX, Clock,
  FileText, CheckCircle2,
  Printer, 
  Trash2,
  Warehouse,
  Plus,
  Search,
  Calculator,
  Info,
  History,
  AlertTriangle,
  ArrowRightLeft,
  Eye,
  BookOpen
} from 'lucide-react';
import JournalPreviewModal from '../../components/JournalPreviewModal';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { hasPermission } from '../../utils/permissionHelper';

interface StockItem {
  id: string;
  name: string;
  code: string;
  uom: string;
  quantity: number;
  unitCost: number;
}

const StockIssueCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`INV-ISS-${new Date().getFullYear()}-0420`);
  const [warehouse, setWarehouse] = useState('');
  const [reason, setReason] = useState('USAGE');
  const [items, setItems] = useState<StockItem[]>([
    { id: '1', name: 'Beton Marka 400', code: 'PR-BT-400', uom: 'm3', quantity: 10, unitCost: 85.50 }
  ]);
  const [isJournalVisible, setIsJournalVisible] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

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
                        <PackageX className="w-6 h-6 mr-2 text-indigo-500" /> Malların Silinməsi
                    </h1>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter">STOCK ISSUE</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic"><Clock className="w-3.5 h-3.5 mr-1 text-indigo-500" /> {new Date().toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center text-indigo-600 font-bold"><Warehouse className="w-3.5 h-3.5 mr-1" /> {warehouse || 'Anbar Seçilməyib'}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasPermission('FINANCE', 'view') && (
                <button onClick={() => navigate(`/finance/transaction/TRX-2026-902`)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 transition-all text-indigo-400 hover:text-indigo-600 shadow-sm" title="Müxabirləşməyə bax">
                    <BookOpen className="w-5 h-5" />
                </button>
            )}
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 leading-none">
                <CheckCircle2 className="w-4 h-4" />
                <span>Silinməni Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN - Items Grid */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* Main Info */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic text-indigo-600">
                            <Warehouse className="w-3.5 h-3.5 mr-2" /> Mənbə Anbar
                        </label>
                        <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner">
                            <option value="">Anbar seçin...</option>
                            <option>Mərkəzi Anbar</option>
                            <option>Xammal Anbarı</option>
                            <option>Tikinti Sahəsi #3</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                             Silinmə Səbəbi
                        </label>
                        <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner">
                            <option value="USAGE">İstehsalat / İstifadə</option>
                            <option value="DAMAGE">Zədələnmə / Yararsızlıq</option>
                            <option value="LOSS">İtki / Çatışmazlıq</option>
                            <option value="EXPIRE">İstifadə müddəti bitib</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                             Məsul Şəxs (MOT)
                        </label>
                        <input type="text" placeholder="Ad, Soyad..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/10" />
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center italic">
                        <FileText className="w-4 h-4 mr-2 text-indigo-500" /> Mal və Material Siyahısı
                    </h3>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input type="text" placeholder="Kod və ya adla axtar..." className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold italic w-64 outline-none focus:ring-2 focus:ring-indigo-500/10" />
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Məhsul Əlavə Et</span>
                        </button>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FAFBFD] dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-5">№</th>
                            <th className="px-5 py-5">Kod / Məhsul</th>
                            <th className="px-5 py-5 text-center">Ölçü vahidi</th>
                            <th className="px-5 py-5 text-right w-32">Miqdar</th>
                            <th className="px-5 py-5 text-right w-40">Maya Dəyəri (Unit)</th>
                            <th className="px-5 py-5 text-right w-40">Cəmi</th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold text-slate-600 dark:text-slate-300 italic">
                        {items.map((item, index) => (
                            <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800/50 group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                                <td className="px-8 py-4 text-slate-300 font-mono italic">{index + 1}</td>
                                <td className="px-5 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{item.code}</span>
                                        <span className="text-slate-800 dark:text-white font-black">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-black uppercase text-slate-500 line-none">{item.uom}</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].quantity = Number(e.target.value);
                                            setItems(newItems);
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2 px-3 text-right font-black italic shadow-inner outline-none focus:ring-1 focus:ring-indigo-500/20"
                                    />
                                </td>
                                <td className="px-5 py-4 text-right font-mono tabular-nums text-slate-400">{item.unitCost.toLocaleString()} AZN</td>
                                <td className="px-5 py-4 text-right font-black italic tabular-nums text-indigo-600">{(item.quantity * item.unitCost).toLocaleString()} AZN</td>
                                <td className="px-8 py-4 text-right">
                                    <button className="p-2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State Action */}
                <div className="p-12 text-center border-t border-slate-50 dark:border-slate-800">
                    <button className="inline-flex items-center space-x-3 px-12 py-4 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-slate-400 font-black text-xs uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-500 transition-all group">
                         <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
                         <span>Yeni Sətir Əlavə Et</span>
                    </button>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            
            {/* Total Balance Card */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 italic">Maliyyə Nəticəsi</h3>
                    <div className="space-y-4 pt-2">
                         <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-500 uppercase tracking-widest italic">Ümumi Sətir:</span>
                            <span className="font-black italic text-indigo-200">{items.length}</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-500 uppercase tracking-widest italic">Ümumi Miqdar:</span>
                            <span className="font-black italic">{items.reduce((s, i) => s + i.quantity, 0)} {items[0]?.uom}</span>
                         </div>
                         <div className="pt-4 border-t border-white/5">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Silinmə Cəmi:</span>
                                <span className="text-2xl font-black italic tracking-tighter tabular-nums">{totalAmount.toLocaleString()} AZN</span>
                             </div>
                         </div>
                    </div>
                </div>
                <Calculator className="absolute bottom-[-20px] right-2 w-32 h-32 text-indigo-500/5 rotate-[-15deg]" />
            </div>

            {/* Accounting Note */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <Info className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Mühasibat Qeydi
                </h4>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black">
                        <span className="text-slate-400 uppercase italic">Debet Hesab:</span>
                        <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4 tracking-tighter">721 (İnzibati xərclər)</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black">
                        <span className="text-slate-400 uppercase italic">Kredit Hesab:</span>
                        <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-4 tracking-tighter">201 (Xammal və materiallar)</span>
                    </div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 leading-relaxed italic">
                    Bu sənəd avtomatik olaraq Mühasibat Jurnalında Double-Entry (İkili yazılış) yaradacaq.
                </p>
            </div>

            {/* History Logs */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm opacity-50">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <History className="w-3.5 h-3.5 mr-2" /> Əməliyyat Tarixçəsi
                </h4>
                <p className="text-[9px] font-bold text-slate-400 italic">Sənəd hələ ilkin qaralama halındadır.</p>
            </div>

            {/* Warning Alert */}
            <div className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 p-6 rounded-[2rem] flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <div>
                   <p className="text-[9px] font-black text-rose-800 uppercase italic mb-1 tracking-tight">Kritik Xəbərdarlıq</p>
                   <p className="text-[8px] font-bold text-rose-600/70 leading-normal uppercase tabular-nums">Silinmə miqdarı cari anbar qalığından çox ola bilməz. (Sistem block tətbiq edir)</p>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-800 transition-all italic underline underline-offset-8">Ləğv Et</button>
              <button disabled={currentStatus === 'POSTED'} className="px-8 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">Qaralama</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center space-x-2 leading-none">
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Silinməni Tamamla</span>
              </button>
          </div>
      </div>
      <JournalPreviewModal 
          isOpen={isJournalVisible} 
          onClose={() => setIsJournalVisible(false)} 
          periodClosed={false} 
          isAdmin={true}
          initialLines={[
            { id: '1', accountCode: '721', accountName: 'İnzibati xərclər', description: `Silinmə - ${docNumber}`, debit: totalAmount, credit: 0 },
            { id: '2', accountCode: '205', accountName: 'Mallar', description: `Silinmə - ${docNumber}`, debit: 0, credit: totalAmount }
          ]}
       />
    </div>
  );
};

export default StockIssueCreate;
