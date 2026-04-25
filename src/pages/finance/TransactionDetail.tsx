import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Printer, Download, Share2, 
  ExternalLink, FileText, User, Calendar, 
  ShieldCheck, Tag, Box, 
  Briefcase, Paperclip, History, ChevronRight,
  Layers, AlertCircle, Lock
} from 'lucide-react';
import { 
  getSourceDocumentRoute, 
  getSourceDocumentIcon,
  getSourceDocumentStatusColor
} from '../../utils/sourceDocumentResolver';
import { hasPermission } from '../../utils/permissionHelper';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import { financeApi } from '../../utils/api';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const { formatDate, formatTime, formatNumber, formatCurrency } = useFormat();
  
  const [transaction, setTransaction] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id || !activeCompany) return;
    setIsLoading(true);
    try {
      const res = await financeApi.getTransactionDetail(id, activeCompany.id);
      setTransaction(res.data);
      setAuditLogs(res.data.auditLogs || []);
    } catch (err: any) {
      console.error(err);
      setError('Tranzaksiya detalları tapılmadı.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, activeCompany?.id]);

  if (isLoading) return <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase italic tracking-widest leading-none">Yüklənir...</div>;
  if (error || !transaction) return <div className="p-20 text-center text-rose-500 font-black uppercase italic tracking-widest leading-none"><AlertCircle className="w-12 h-12 mx-auto mb-4" /> {error || 'Tranzaksiya tapılmadı.'}</div>;

  const hasSourcePermission = hasPermission(transaction.sourceModule as any);
  const isLegacy = !transaction.sourceId || transaction.sourceId === '0';
  const sourceRoute = getSourceDocumentRoute(transaction.sourceModule, transaction.sourceType, transaction.sourceId);
  const SourceIcon = getSourceDocumentIcon(transaction.sourceModule as any);
  const sourceStatusColor = getSourceDocumentStatusColor(transaction.status);

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 italic-none">
      
      {/* BREADCRUMBS & TOP ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <Link to="/finance/reports" className="hover:text-indigo-600 transition-colors">Hesabatlar</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/finance/general-ledger" className="hover:text-indigo-600 transition-colors">Baş Kitab</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 dark:text-slate-300">Vauçer: {transaction.voucherNo}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums mt-0.5">
              Müxabirləşmə Detalları
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic leading-none">
            <Download className="w-4 h-4" />
            <span>Vauçeri Çıxar (PDF)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: MAIN DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HEADER INFO CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-900/10 -mr-16 -mt-16 rounded-full blur-2xl"></div>
             
             <div className="flex flex-wrap gap-8 relative z-10">
                <div className="flex-1 min-w-[150px] space-y-1.5 border-r border-slate-100 dark:border-slate-800 pr-8">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Vauçer Nömrəsi</span>
                   <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-black text-slate-800 dark:text-white tabular-nums italic">{transaction.voucherNo}</span>
                   </div>
                </div>
                <div className="flex-1 min-w-[120px] space-y-1.5 px-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Əməliyyat Tarixi</span>
                   <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200 tabular-nums italic">{formatDate(transaction.postingDate)}</span>
                   </div>
                </div>
                <div className="flex-1 min-w-[120px] space-y-1.5 px-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</span>
                   <div className={`inline-flex px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest italic leading-none h-6 items-center ${sourceStatusColor}`}>
                      {transaction.status}
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 block">Əməliyyatın Təsviri</span>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 italic leading-relaxed">
                   {transaction.description}
                </p>
             </div>
          </div>

          {/* JOURNAL ENTRIES TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
             <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic flex items-center">
                   <Layers className="w-4 h-4 mr-2 text-indigo-500" /> Müxabirləşmə Sətirləri
                </h3>
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg border border-indigo-100/50">
                   {transaction.lines?.length || 0} Line(s)
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#F9FAFB] dark:bg-slate-800/40 text-[9px] font-black uppercase tracking-widest italic text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                         <th className="px-6 py-4 w-12 text-center">#</th>
                         <th className="px-6 py-4" colSpan={2}>Mühasibat Hesabı</th>
                         <th className="px-6 py-4 text-right">Debet (DR)</th>
                         <th className="px-6 py-4 text-right">Kredit (CR)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {transaction.lines?.map((line: any, idx: number) => (
                        <tr key={line.id} className="hover:bg-indigo-50/10 dark:hover:bg-indigo-900/10 transition-all group">
                           <td className="px-6 py-5 text-center text-[10px] font-black text-slate-300 italic">{idx + 1}</td>
                           <td className="px-6 py-5" colSpan={2}>
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tighter uppercase">{line.account?.code}</span>
                                 <span className="text-[10px] font-bold text-slate-500 truncate max-w-[300px] uppercase italic">{line.account?.name}</span>
                                 {line.counterparty && <span className="text-[9px] text-slate-400 mt-1">Kontragent: {line.counterparty.name}</span>}
                              </div>
                           </td>
                           <td className="px-6 py-5 text-right font-black italic tabular-nums text-slate-800 dark:text-slate-200">
                              {line.debitAmount > 0 ? (
                                <>{formatNumber(line.debitAmount)} <span className="text-[9px] font-black opacity-50 ml-1 text-emerald-500 font-mono">DR</span></>
                              ) : '-'}
                           </td>
                           <td className="px-6 py-5 text-right font-black italic tabular-nums text-indigo-600 dark:text-indigo-400">
                              {line.creditAmount > 0 ? (
                                <>{formatNumber(line.creditAmount)} <span className="text-[9px] font-black opacity-50 ml-1 text-rose-500 font-mono">CR</span></>
                              ) : '-'}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                   <tfoot className="bg-slate-50/50 dark:bg-slate-800/10 font-black italic border-t border-slate-100 dark:border-slate-800">
                      <tr>
                         <td colSpan={3} className="px-6 py-5 text-right text-[10px] uppercase tracking-[0.2em] text-slate-400">Yekun Faktura Məbləği</td>
                         <td colSpan={2} className="px-6 py-5 text-right text-lg text-slate-900 dark:text-white tabular-nums">
                            {formatCurrency(transaction.totalAmount, 'AZN') || formatCurrency(0, 'AZN')}
                         </td>
                      </tr>
                   </tfoot>
                </table>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTEXT & AUDIT */}
        <div className="space-y-6">
          
          {/* SOURCE DOCUMENT LINK */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
             
             <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
                         <SourceIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                         <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest italic opacity-80 leading-none">Mənbə Sənədi</span>
                         <h4 className="text-lg font-black italic mt-1 uppercase tracking-tight leading-none">{transaction.sourceModule || 'INTERNAL'}</h4>
                         <span className="text-xs font-bold text-indigo-100 italic opacity-70">№ {transaction.sourceNumber || '-'}</span>
                      </div>
                   </div>
                   <div className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest italic">
                      {transaction.origin}
                   </div>
                </div>
                
                {!hasSourcePermission ? (
                   <div className="p-4 bg-rose-500/30 border border-white/10 rounded-2xl">
                     <div className="flex items-center text-xs font-black uppercase italic tracking-widest text-indigo-50">
                        <Lock className="w-4 h-4 mr-2" /> Giriş Məhduddur
                     </div>
                   </div>
                ) : isLegacy ? (
                   <div className="p-4 bg-amber-500/30 border border-white/10 rounded-2xl">
                     <div className="flex items-center text-xs font-black uppercase italic tracking-widest text-indigo-50">
                        <AlertCircle className="w-4 h-4 mr-2" /> Köhnə/Tamamlanmamış Data
                     </div>
                   </div>
                ) : sourceRoute !== '#' ? (
                   <button 
                     onClick={() => navigate(sourceRoute)}
                     className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center italic shadow-lg"
                   >
                     Sənədi Aç <ExternalLink className="w-3.5 h-3.5 ml-2" />
                   </button>
                ) : (
                   <div className="flex items-center p-4 bg-rose-500/30 border border-white/10 rounded-2xl text-[10px] font-black uppercase italic tracking-widest text-indigo-50">
                     <AlertCircle className="w-4 h-4 mr-2" />
                     Mənbə Sənədi Tapılmadı
                   </div>
                )}
             </div>
          </div>

          {/* BUSINESS CONTEXT CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6">
             <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-indigo-500" /> Biznes Konteksti
             </h3>
             
             <div className="space-y-5">
                <div className="flex items-start space-x-3">
                   <User className="w-4 h-4 text-slate-400 mt-1" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Kontragent</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 italic">{transaction.lines?.[0]?.counterparty?.name || '-'}</span>
                   </div>
                </div>
                <div className="flex items-start space-x-3">
                   <Tag className="w-4 h-4 text-slate-400 mt-1" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Layihə</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 italic">{transaction.project || '-'}</span>
                   </div>
                </div>
                <div className="flex items-start space-x-3">
                   <Box className="w-4 h-4 text-slate-400 mt-1" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Məsul Şəxs</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 italic">{transaction.responsibleUser || '-'}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* AUDIT LOG CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6">
             <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
                <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest italic flex items-center">
                   <History className="w-4 h-4 mr-2 text-indigo-500" /> Audit və Təhlükəsizlik
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
             </div>
             
             <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-100 dark:before:bg-slate-800">
                {auditLogs.length > 0 ? auditLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start space-x-4 relative z-10">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-white dark:border-slate-900 mt-1"></div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-none">{log.action}</span>
                       <span className="text-xs font-black text-slate-700 dark:text-slate-200 italic mt-1">{log.userEmail || log.userId || 'Sistem'}</span>
                       <span className="text-[9px] font-bold text-slate-400 italic mt-0.5">{formatDate(log.performedAt)} {formatTime(log.performedAt)}</span>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-start space-x-4 relative z-10">
                    <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 mt-1"></div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Məlumat yoxdur</span>
                       <span className="text-xs font-black text-slate-500 italic mt-1">Audit tarixçəsi tapılmadı.</span>
                    </div>
                  </div>
                )}
             </div>

             <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <button className="flex items-center space-x-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest italic hover:text-indigo-700 transition">
                   <Paperclip className="w-3.5 h-3.5" />
                   <span>Sənəd Əlavələri (0)</span>
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
