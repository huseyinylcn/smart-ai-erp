import { useState, useMemo, useEffect } from 'react';
import { 
  X, BookOpen, Plus, 
  Trash2, AlertCircle, 
  CheckCircle2, ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';

interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

interface JournalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodClosed: boolean;
  isAdmin: boolean;
  initialLines?: JournalLine[];
}

const JournalPreviewModal = ({ isOpen, onClose, periodClosed, isAdmin, initialLines = [] }: JournalPreviewModalProps) => {
  const [lines, setLines] = useState<JournalLine[]>(initialLines.length > 0 ? initialLines : [
    { id: '1', accountCode: '171', accountName: 'Alıcıların Borcu', description: 'Satış Qaiməsi üzrə', debit: 1180, credit: 0 },
    { id: '2', accountCode: '601', accountName: 'Satış Gəliri', description: 'Satış Qaiməsi üzrə', debit: 0, credit: 1000 },
    { id: '3', accountCode: '521', accountName: 'Büdcəyə ƏDV Borcu', description: 'Satış Qaiməsi üzrə', debit: 0, credit: 180 }
  ]);

  const handleAddLine = () => {
    setLines([...lines, { id: Math.random().toString(36).substr(2, 9), accountCode: '', accountName: '', description: '', debit: 0, credit: 0 }]);
  };

  const handleUpdateLine = (id: string, field: keyof JournalLine, value: any) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const totals = useMemo(() => {
    return lines.reduce((acc, l) => ({
        debit: acc.debit + (l.debit || 0),
        credit: acc.credit + (l.credit || 0)
    }), { debit: 0, credit: 0 });
  }, [lines]);

  const balance = totals.debit - totals.credit;
  const isLocked = periodClosed && !isAdmin;

  // Global ESC listener for this modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[3rem] shadow-mega-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Müxabirləşmə Önizləməsi</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sənəd üzrə G/L Jurnal Yazılışları</p>
                </div>
            </div>
            <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all shadow-sm">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* PERIOD WARNING */}
        {periodClosed && (
            <div className="px-8 py-3 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span className="text-[10px] font-black text-rose-800 uppercase italic">Bağlı Dövr: {isLocked ? 'Yalnız baxış rejmi aktivdir (Baxış istisna Admin icazəsi tələb olunur)' : 'Admin səlahiyyəti ilə redaktə aktivdir'}</span>
                </div>
            </div>
        )}

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
            <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs font-bold border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="px-8 py-4">Hesab Kodu / Adı</th>
                            <th className="px-4 py-4">Açıqlama</th>
                            <th className="px-4 py-4 text-right">Debet</th>
                            <th className="px-4 py-4 text-right">Kredit</th>
                            {!isLocked && <th className="px-8 py-4"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 italic-none">
                        {lines.map(line => (
                            <tr key={line.id} className="group hover:bg-slate-50/30 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col space-y-1">
                                        <input 
                                            disabled={isLocked}
                                            value={line.accountCode} 
                                            onChange={(e) => handleUpdateLine(line.id, 'accountCode', e.target.value)}
                                            className="bg-transparent border-none p-0 text-[10px] font-black text-indigo-600 uppercase outline-none" 
                                        />
                                        <input 
                                            disabled={isLocked}
                                            value={line.accountName} 
                                            onChange={(e) => handleUpdateLine(line.id, 'accountName', e.target.value)}
                                            className="bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none w-full shadow-none" 
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-5">
                                    <input 
                                        disabled={isLocked}
                                        value={line.description}
                                        onChange={(e) => handleUpdateLine(line.id, 'description', e.target.value)}
                                        className="w-full bg-transparent border-none p-0 text-[10px] italic text-slate-400 outline-none" 
                                    />
                                </td>
                                <td className="px-4 py-5 text-right w-32 border-l border-slate-50">
                                    <input 
                                        disabled={isLocked}
                                        type="number" 
                                        value={line.debit || ''} 
                                        onChange={(e) => handleUpdateLine(line.id, 'debit', Number(e.target.value))}
                                        className={`w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-right font-black italic tabular-nums outline-none ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </td>
                                <td className="px-4 py-5 text-right w-32 bg-slate-50/30">
                                    <input 
                                        disabled={isLocked}
                                        type="number" 
                                        value={line.credit || ''} 
                                        onChange={(e) => handleUpdateLine(line.id, 'credit', Number(e.target.value))}
                                        className={`w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-right font-black italic tabular-nums outline-none ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </td>
                                {!isLocked && (
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            onClick={() => setLines(lines.filter(l => l.id !== line.id))}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!isLocked && (
                <button onClick={handleAddLine} className="mt-4 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-slate-200 transition-all">
                    <Plus className="w-4 h-4 mr-2" /> Sətir Əlavə Et
                </button>
            )}
        </div>

        {/* FOOTER */}
        <div className="p-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-12">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Cəmi Balans</p>
                    <div className="text-xl font-black text-white tabular-nums flex items-center">
                        <ArrowRightLeft className="w-5 h-5 mr-3 text-indigo-500" />
                        {totals.debit.toLocaleString()} ₼
                    </div>
                </div>
                <div className={`px-5 py-2 rounded-2xl flex items-center space-x-2 ${balance === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {balance === 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span className="text-[10px] font-black uppercase tracking-widest italic">{balance === 0 ? 'Balanslıdır' : 'Balans Pozulub'}</span>
                </div>
            </div>

            <div className="flex space-x-3">
               <button onClick={onClose} className="px-8 py-3 bg-slate-800 text-slate-400 hover:bg-slate-700 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all">Bağla</button>
               {!isLocked && (
                   <button onClick={onClose} disabled={balance !== 0} className="px-12 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-20 leading-none">Dəyişiklikləri Saxla</button>
               )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default JournalPreviewModal;
