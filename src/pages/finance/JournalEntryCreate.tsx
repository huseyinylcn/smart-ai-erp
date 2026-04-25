import { useState, useMemo } from 'react';
import { 
  ArrowLeft, BookOpen,
  FileText, CheckCircle2,
  Trash2,
  Plus,
  ArrowRightLeft,
  Calendar,
  History,
  LayoutTemplate,
  AlertCircle,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';
const userRole = 'Admin'; // Mock
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

const JournalEntryCreate = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber] = useState(`JV-${new Date().getFullYear()}-045}`);
  const [taxDate, setTaxDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountingDate, setAccountingDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock Period Closing Logic (e.g. any date before 2024-03-01 is closed)
  const isPeriodClosed = (dateStr: string) => {
    const date = new Date(dateStr);
    const closingDate = new Date('2024-03-01');
    return date < closingDate;
  };

  const periodClosed = isPeriodClosed(accountingDate) || isPeriodClosed(taxDate);
  const isAdmin = userRole === 'Admin'; // Mock admin status

  // Lines State
  const [lines, setLines] = useState<JournalLine[]>([
    { id: '1', accountCode: '', accountName: '', description: '', debit: 0, credit: 0 },
    { id: '2', accountCode: '', accountName: '', description: '', debit: 0, credit: 0 }
  ]);

  // Templates Logic
  const templates = [
    { name: 'Əmək Haqqı Hesablanması', lines: [
        { code: '721-1', name: 'İnzibati Heyətin Əmək Haqqı Xərci', d: 1000, c: 0 },
        { code: '533-1', name: 'Əmək Haqqı üzrə Borclar', d: 0, c: 1000 }
    ]},
    { name: 'ƏDV Əvəzləşdirilməsi', lines: [
        { code: '521-1', name: 'Büdcəyə ƏDV Borcu', d: 500, c: 0 },
        { code: '241-1', name: 'Əvəzləşdirilən ƏDV', d: 0, c: 500 }
    ]}
  ];

  const applyTemplate = (template: typeof templates[0]) => {
    const newLines = template.lines.map((l, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        accountCode: l.code,
        accountName: l.name,
        description: template.name,
        debit: l.d,
        credit: l.c
    }));
    setLines(newLines);
  };

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

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100">
      
      {/* HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-primary-100 dark:border-primary-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center">
                        <BookOpen className="w-6 h-6 mr-2 text-primary-600" /> Mühasibat Əməliyyatı
                    </h1>
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-600 border border-primary-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic">Journal Entry (GL)</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>JV № {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center italic text-rose-500"><History className="w-3.5 h-3.5 mr-1" /> Vergi: {taxDate}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center italic text-indigo-500"><Calendar className="w-3.5 h-3.5 mr-1" /> Maliyyə: {accountingDate}</span>
                    {periodClosed && (
                        <span className="ml-4 px-2 py-0.5 bg-rose-100 text-rose-600 rounded text-[9px] font-black uppercase flex items-center">
                            <ShieldAlert className="w-3 h-3 mr-1" /> Bağlı Dövr
                        </span>
                    )}
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             {/* Templates Dropdown Placeholder */}
             <div className="relative group mr-4">
                <button className="flex items-center space-x-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-100 transition-all">
                    <LayoutTemplate className="w-4 h-4" />
                    <span>Şablonlar</span>
                    <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-mega-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                    {templates.map(t => (
                        <button 
                            key={t.name}
                            onClick={() => applyTemplate(t)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
             </div>
            <button onClick={() => setCurrentStatus('POSTED')} disabled={balance !== 0 || totals.debit === 0} className="flex items-center space-x-2 px-8 py-2.5 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-20 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Müxabirləşməni Ver</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Ledger Table */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/20 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center italic">
                        <ArrowRightLeft className="w-4 h-4 mr-2 text-primary-500" /> Müxabirləşmə Sətirləri
                    </h3>
                    <button onClick={handleAddLine} className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center hover:bg-slate-800 transition-all">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Sətir Əlavə Et
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-8 py-4">Hesab Kodu / Adı</th>
                                <th className="px-4 py-4">Açıqlama</th>
                                <th className="px-4 py-4 text-right">Debet</th>
                                <th className="px-4 py-4 text-right">Kredit</th>
                                <th className="px-8 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {lines.map(line => (
                                <tr key={line.id} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-5 min-w-[300px]">
                                        <div className="flex flex-col space-y-1">
                                            <input 
                                                value={line.accountCode} 
                                                onChange={(e) => handleUpdateLine(line.id, 'accountCode', e.target.value)}
                                                placeholder="721-..." 
                                                className="bg-transparent border-none p-0 text-[10px] font-black text-primary-600 uppercase outline-none" 
                                            />
                                            <input 
                                                value={line.accountName} 
                                                onChange={(e) => handleUpdateLine(line.id, 'accountName', e.target.value)}
                                                placeholder="Hesab adı seçin..." 
                                                className="bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none w-full" 
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <input 
                                            value={line.description}
                                            onChange={(e) => handleUpdateLine(line.id, 'description', e.target.value)}
                                            placeholder="Əmək haqqı hesablanması m/y..." 
                                            className="w-full bg-transparent border-none p-0 text-[10px] italic text-slate-400 outline-none" 
                                        />
                                    </td>
                                    <td className="px-4 py-5 text-right w-32 border-l border-slate-50 dark:border-slate-800">
                                        <input 
                                            type="number" 
                                            disabled={periodClosed && !isAdmin}
                                            value={line.debit || ''} 
                                            onChange={(e) => handleUpdateLine(line.id, 'debit', Number(e.target.value))}
                                            placeholder="0.00"
                                            className={`w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-right font-black italic tabular-nums outline-none focus:ring-1 focus:ring-primary-500/20 ${periodClosed && !isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                        />
                                    </td>
                                    <td className="px-4 py-5 text-right w-32 bg-slate-50/30 dark:bg-slate-800/10">
                                        <input 
                                            type="number" 
                                            disabled={periodClosed && !isAdmin}
                                            value={line.credit || ''} 
                                            onChange={(e) => handleUpdateLine(line.id, 'credit', Number(e.target.value))}
                                            placeholder="0.00"
                                            className={`w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-right font-black italic tabular-nums outline-none focus:ring-1 focus:ring-primary-500/20 ${periodClosed && !isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                        />
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            disabled={periodClosed && !isAdmin}
                                            onClick={() => setLines(lines.filter(l => l.id !== line.id))}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all focus:opacity-100 disabled:hidden"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-900 text-white">
                            <tr>
                                <td colSpan={2} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest italic text-white/40">CƏMİ BALANS</td>
                                <td className="px-4 py-6 text-right font-black text-sm tabular-nums underline decoration-primary-500 decoration-2 underline-offset-4">{totals.debit.toLocaleString()}</td>
                                <td className="px-4 py-6 text-right font-black text-sm tabular-nums underline decoration-primary-500 decoration-2 underline-offset-4">{totals.credit.toLocaleString()}</td>
                                <td className="px-8 py-6"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        {/* RIGHT SIDEBAR: Validation & Metadata */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            
            {/* Balance Card */}
            <div className={`rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 ${balance === 0 && totals.debit > 0 ? 'bg-emerald-600' : 'bg-slate-900 border-2 border-dashed border-slate-700'}`}>
                <div className="relative z-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">Balans Fərqi</h3>
                    <div className="text-center py-4">
                        <h2 className="text-4xl font-black text-white italic tabular-nums leading-none">
                            {balance.toLocaleString()}
                        </h2>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-4 flex items-center justify-center ${balance === 0 && totals.debit > 0 ? 'text-emerald-200' : 'text-rose-400'}`}>
                            {balance === 0 && totals.debit > 0 ? (
                                <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Balanslıdır</>
                            ) : (
                                <><AlertCircle className="w-3.5 h-3.5 mr-1" /> Balans Düz Deyil</>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Document Info */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm">
                {periodClosed && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 animate-pulse">
                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                        <div>
                            <p className="text-[10px] font-black text-rose-800 uppercase italic">Bağlı Dövr</p>
                            <p className="text-[9px] font-bold text-rose-500 italic leading-tight">Bu dövrdə əməliyyat üçün Admin təsdiqi vacibdir.</p>
                        </div>
                    </div>
                )}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center italic">
                        <History className="w-3.5 h-3.5 mr-2" /> Vergi Uçotu Tarixi
                    </label>
                    <input type="date" value={taxDate} onChange={(e) => setTaxDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 text-xs font-black shadow-inner" />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center italic">
                        <Calendar className="w-3.5 h-3.5 mr-2" /> Maliyyə Uçotu Tarixi
                    </label>
                    <input type="date" value={accountingDate} onChange={(e) => setAccountingDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 text-xs font-black shadow-inner" />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                        <FileText className="w-3.5 h-3.5 mr-2" /> Ümumi Qeyd
                    </label>
                    <textarea rows={4} placeholder="Jurnal əməliyyatı barədə qeydlər..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-[10px] font-bold italic shadow-inner resize-none"></textarea>
                </div>
            </div>

            {/* Audit Log */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-sm opacity-50">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic">
                    <History className="w-3.5 h-3.5 mr-2" /> Tarixçə
                </h4>
                <p className="text-[9px] font-bold text-slate-400 italic">Redaktə tarixçəsi üçün sənədi yadda saxlayın.</p>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all h-[90px]">
          <div className="flex space-x-3 px-4">
              <button 
                onClick={() => navigate(-1)} 
                className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-800 transition-all italic underline underline-offset-8"
              >
                Ləğv Et
              </button>
              <button 
                onClick={() => setCurrentStatus('DRAFT')} 
                className="px-8 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
              >
                Qaralama
              </button>
              <button 
                onClick={() => setCurrentStatus('POSTED')} 
                disabled={balance !== 0 || totals.debit === 0}
                className="px-16 py-2.5 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-20 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center space-x-2 leading-none"
              >
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Müxabirləşməni Tamamla</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default JournalEntryCreate;
