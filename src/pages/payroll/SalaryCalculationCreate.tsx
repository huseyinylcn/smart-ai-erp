import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Calendar, 
  Users, Info, Clock, 
  History, FileText,
  AlertCircle, CheckCircle2,
  Printer, Download,
  ShieldCheck, Save, Paperclip, 
  Link as LinkIcon, Lock, 
  MessageSquare, 
  ChevronDown, ChevronUp,
  Calculator, UserPlus, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

interface SalaryItem {
  id: string;
  employeeName: string;
  position: string;
  gross: number;
  dsmfEmployee: number;
  itsEmployee: number;
  incomeTax: number;
  net: number;
}

const SalaryCalculationCreate = () => {
  const navigate = useNavigate();
  
  // State for Tabs (11-14)
  const [activeTab, setActiveTab] = useState<'employees' | 'files' | 'linked' | 'approvals' | 'history'>('employees');
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');

  // Basic Info (2)
  const [docNumber] = useState(`SAL-${new Date().getFullYear()}-04`);
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  
  // HRM Context (4)
  const [period, setPeriod] = useState('Aprel 2024');
  const [department, setDepartment] = useState('Bütün Şöbələr');

  // Reference (5)
  const [isRefExpanded, setIsRefExpanded] = useState(false);
  const [project] = useState('TENGRI_SUPPLY_OPS');

  // Salary Items (6)
  const [items] = useState<SalaryItem[]>([
    { 
      id: '1', 
      employeeName: 'Qurban Əliyev', 
      position: 'Senior Engineer',
      gross: 2500, 
      dsmfEmployee: 75, 
      itsEmployee: 50, 
      incomeTax: 322, 
      net: 2053 
    },
    { 
      id: '2', 
      employeeName: 'Aysel Məmmədova', 
      position: 'Project Manager',
      gross: 1800, 
      dsmfEmployee: 54, 
      itsEmployee: 36, 
      incomeTax: 224, 
      net: 1486 
    }
  ]);

  // Sidebar Sections Visibility (8, 9, 10)
  const [isEmployerCostsExpanded, setIsEmployerCostsExpanded] = useState(true);
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);

  // Totals Summary Logic (7)
  const totals = useMemo(() => {
    return items.reduce((acc, item) => ({
      gross: acc.gross + item.gross,
      net: acc.net + item.net,
      tax: acc.tax + item.incomeTax + item.dsmfEmployee + item.itsEmployee,
      employerDsmf: acc.employerDsmf + (item.gross * 0.22) // Simplified 22%
    }), { gross: 0, net: 0, tax: 0, employerDsmf: 0 });
  }, [items]);

  const handleSave = (status: DocumentStatus) => {
    setCurrentStatus(status);
    console.log('Payroll Journal Posting...', { status });
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* 1. HEADER (Sticky) */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-rose-600 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Əmək Haqqı Hesablanması</h1>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  currentStatus === 'DRAFT' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                  currentStatus === 'POSTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {currentStatus}
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">PAYROLL ID: {docNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-rose-600 transition-all">
                <Printer className="w-4 h-4" />
            </button>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-rose-600 transition-all">
                <Download className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button 
                onClick={() => handleSave('POSTED')}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20`}
            >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hesablamanı Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 relative overflow-hidden">
            {/* 2, 4. Info Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5" /> Hesablaşma Dövrü
                    </label>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500/20">
                        <option>Mart 2024</option>
                        <option>Aprel 2024</option>
                        <option>May 2024</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <Users className="w-3 h-3 mr-1.5" /> Şöbə / Struktur
                    </label>
                    <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold">
                        <option>Bütün Şöbələr</option>
                        <option>Maliyyə</option>
                        <option>IT & Development</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5" /> Sənəd Tarixi
                    </label>
                    <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <FileText className="w-3 h-3 mr-1.5" /> Sənəd №
                    </label>
                    <input disabled value={docNumber} className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-2.5 px-4 text-xs font-bold text-slate-500" />
                </div>
            </div>

            {/* 5. References (Collapsible) */}
            <div className="border-t border-slate-50 dark:border-slate-800 pt-6 relative z-10">
                <button 
                    onClick={() => setIsRefExpanded(!isRefExpanded)}
                    className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors"
                >
                    {isRefExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    <span>Mühasibatlıq və Layihə Detalları</span>
                </button>
                
                {isRefExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                Layihə Kodu
                            </label>
                            <input value={project} readOnly className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold text-slate-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                İş Rejimi
                            </label>
                            <input value="Standart 40h/week" readOnly className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-xs font-bold text-slate-500" />
                        </div>
                    </div>
                )}
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 dark:bg-rose-900/10 rounded-full blur-3xl -mr-16 -mt-16 z-0"></div>
          </div>

          {/* 6. Payroll Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center">
                    <Users className="w-4 h-4 mr-2 text-rose-600" /> İşçi Siyahısı və Hesablama
                </h3>
                <button className="flex items-center space-x-2 px-4 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>İşçi Əlavə Et</span>
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">İşçi / Vəzifə</th>
                            <th className="px-6 py-4 text-right">Gross (₼)</th>
                            <th className="px-6 py-4 text-right">DSMF %</th>
                            <th className="px-6 py-4 text-right">ITS %</th>
                            <th className="px-6 py-4 text-right">G.Vergisi</th>
                            <th className="px-6 py-4 text-right text-rose-600">Net Maaş</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-slate-800 dark:text-white uppercase leading-none mb-1">{item.employeeName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase italic">{item.position}</p>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-slate-500">{item.gross.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-400">{item.dsmfEmployee.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-400">{item.itsEmployee.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-400">{item.incomeTax.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-sm font-black tabular-nums text-rose-600">{item.net.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>

          {/* TABS (11-14) */}
          <div className="space-y-6">
            <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'employees', label: 'Cədvəl', icon: Info },
                    { id: 'files', label: 'Fayllar', icon: Paperclip },
                    { id: 'approvals', label: 'Təsdiqlər', icon: ShieldCheck },
                    { id: 'history', label: 'Tarixçə', icon: History },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 min-h-[150px]">
                {activeTab === 'approvals' && (
                    <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-black text-[10px] uppercase">HR</div>
                            <div>
                                <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic">Baş HR Menecer</p>
                                <p className="text-[9px] text-rose-600 font-black uppercase tracking-widest leading-none">Verify required</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 h-fit uppercase px-3 py-1 bg-white/50 dark:bg-slate-800 rounded-lg">Status: Pending</span>
                    </div>
                )}
                {activeTab === 'history' && (
                    <div className="flex items-start space-x-4">
                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 mr-1 shadow-lg shadow-rose-500/50"></div>
                        <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Dövr üzrə hesablama başladıldı</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase italic tracking-wide">İndi - Admin User</p>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (7, 8, 10) */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            {/* 7. Totals Summary (Sticky Sidebar) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6 flex flex-col group transition-all hover:border-rose-100">
                <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cəmi NET Ödəniş</p>
                    <h2 className="text-4xl font-black text-rose-600 dark:text-rose-400 tabular-nums leading-tight">
                        {totals.net.toLocaleString()}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AZN</p>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                   <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-slate-400 uppercase tracking-wide">Gross Cəmi</span>
                       <span className="text-slate-700 dark:text-slate-200">{totals.gross.toLocaleString()} ₼</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold text-rose-600">
                       <span className="uppercase tracking-wide">Vergi & Fond</span>
                       <span className="tabular-nums">-{totals.tax.toLocaleString()} ₼</span>
                   </div>
                </div>

                <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl text-[10px] text-slate-500 font-bold leading-relaxed border border-rose-100/50 dark:border-rose-900/30">
                   <Calculator className="w-4 h-4 text-rose-600 mb-2" />
                   Hesablama Azərbaycan Respublikası Vergi Məcəlləsinin <strong>Aprel 2024</strong> üzrə tarifləri ilə aparılıb.
                </div>
            </div>

            {/* 8. Employer Costs (Collapsible) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <button 
                    onClick={() => setIsEmployerCostsExpanded(!isEmployerCostsExpanded)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white"
                >
                   <span>İşəgötürən Xərcləri</span>
                   {isEmployerCostsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isEmployerCostsExpanded && (
                    <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top-1 text-[10px]">
                         <div className="flex justify-between font-bold text-slate-500 uppercase tracking-tight">
                            <span>DSMF (22%)</span>
                            <span className="text-rose-600 tabular-nums">{totals.employerDsmf.toLocaleString()} ₼</span>
                         </div>
                         <div className="flex justify-between font-bold text-slate-500 uppercase tracking-tight">
                            <span>ITS (Company)</span>
                            <span className="text-rose-600 tabular-nums">{(totals.gross * 0.02).toLocaleString()} ₼</span>
                         </div>
                    </div>
                )}
            </div>

            {/* 10. Notes (Collapsible) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <button 
                    onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white"
                >
                   <span>Daxili Qeydlər</span>
                   {isNotesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isNotesExpanded && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-1">
                        <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-medium resize-none focus:ring-1 focus:ring-rose-500" placeholder="Muhasibatlıq üçün qeyd..."></textarea>
                    </div>
                )}
            </div>

            {/* Audit Status */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase italic">
                    <TrendingUp className="w-3 h-3" />
                    <span>Statistika</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                        <span>Büdcə doluluğu</span>
                        <span>82%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 w-[82%]"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl transition-all">
         <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 text-slate-500 hover:text-slate-700 font-black text-xs uppercase tracking-widest transition-all"
            >
              Ləğv Et
            </button>
            <button 
              onClick={() => handleSave('DRAFT')}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-xs uppercase tracking-widest text-slate-700 dark:text-white hover:bg-slate-200 transition-all shadow-sm"
            >
              Qaralamaya At
            </button>
            <button 
              onClick={() => handleSave('POSTED')}
              className="px-10 py-2.5 bg-rose-600 text-white hover:bg-rose-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-500/20 active:scale-95"
            >
              Hesablamanı Bitir
            </button>
         </div>
      </div>
    </div>
  );
};

export default SalaryCalculationCreate;
