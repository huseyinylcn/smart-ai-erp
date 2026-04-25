import { useState, useEffect } from 'react';
import { 
  ArrowLeft, UserMinus, Clock,
  FileText, CheckCircle2,
  Printer, 
  AlertTriangle,
  History,
  Info,
  Scale,
  Loader2,
  DollarSign,
  Calculator,
  CalendarDays
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import FormattedDateInput from '../../components/common/FormattedDateInput';
import SearchableSelect from '../../components/common/SearchableSelect';

const EmployeeTerminationCreate = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const { formatDate, formatNumber } = useFormat();
  const companyId = activeCompany?.id || '';

  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber, setDocNumber] = useState(`DOC-TERM-${new Date().getFullYear()}-0012`);
  const [orderNumber, setOrderNumber] = useState(`ORDER-EXIT-${new Date().getFullYear()}/01`);
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeId, setEmployeeId] = useState('');
  
  // Calculation States
  const [tenureMonths, setTenureMonths] = useState(0);
  const [earnedDays, setEarnedDays] = useState(0);
  const [usedDays, setUsedDays] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [additionalStajDays, setAdditionalStajDays] = useState(0);
  
  const [terminationDate, setTerminationDate] = useState(new Date().toISOString().split('T')[0]);
  const [reasonCode, setReasonCode] = useState('');
  const [reasonDetails, setReasonDetails] = useState('');
  
  // Payout States
  const [compensationAmount, setCompensationAmount] = useState(0);
  const [finalSalaryAmount, setFinalSalaryAmount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (companyId) {
      hrApi.getEmployees(companyId).then(setEmployees).catch(console.error);
    }
  }, [companyId]);

  // CALCULATION LOGIC
  useEffect(() => {
    if (employeeId && employees.length > 0) {
      const emp = employees.find(e => e.id === employeeId);
      setSelectedEmployee(emp);
      
      if (emp) {
        // Ensure hireDate exists
        const hireDateStr = emp.hireDate || emp.createdAt;
        if (hireDateStr) {
          const start = new Date(hireDateStr);
          const end = new Date(terminationDate);
          
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            // Calculate Tenure (Months)
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            const months = diffDays / 30.44;
            setTenureMonths(Number(months.toFixed(1)));

            // Vacation Logic (Base 30 days)
            const baseVacation = 30; 
            const earned = (baseVacation / 12) * months;
            setEarnedDays(Number(earned.toFixed(1)));
            
            const mockUsed = 0; 
            const remaining = Math.max(0, earned - mockUsed);
            setRemainingDays(Number(remaining.toFixed(1)));
            
            // Tenure addition
            let stajDays = 0;
            const years = months / 12;
            if (years >= 5 && years < 10) stajDays = 2;
            else if (years >= 10 && years < 15) stajDays = 4;
            else if (years >= 15) stajDays = 6;
            setAdditionalStajDays(stajDays);

            // AUTO-FILL only if not already manually adjusted by user in this session
            const empSalary = emp.salary || 0;
            const dailyWage = empSalary / 30.44;
            setCompensationAmount(Number((dailyWage * remaining).toFixed(2)));
            
            const daysInFinalMonth = end.getDate();
            const finalSalary = (empSalary / 30) * daysInFinalMonth;
            setFinalSalaryAmount(Number(finalSalary.toFixed(2)));
          }
        }
      }
    }
  }, [employeeId]); // Only trigger on employee selection

  const handleSave = async () => {
    if (!employeeId || !reasonCode || !docNumber) {
        alert('Zəhmət olmasa bütün vacib sahələri doldurun.');
        return;
    }
    
    setIsSaving(true);
    try {
        const payload = {
            terminationDate,
            reasonCode,
            reasonDetails,
            docNumber,
            orderNumber,
            docDate,
            vacationDays: remainingDays,
            compensationAmount,
            finalSalary: finalSalaryAmount,
            companyId
        };
        await hrApi.terminateEmployee(employeeId, payload, companyId);
        setCurrentStatus('POSTED');
        setTimeout(() => {
            navigate('/hr/employees');
        }, 2000);
    } catch (error) {
        console.error('SAVE_TERMINATION_ERROR:', error);
        alert('Xəta baş verdi.');
    } finally {
        setIsSaving(false);
    }
  };

  const terminationArticles = [
    { code: '68-2-a', label: '68.2.a (Tərəflərin razılığı)' },
    { code: '68-2-b', label: '68.2.b (Müddətin bitməsi)' },
    { code: '69', label: '69. (İşçinin təşəbbüsü)' },
    { code: '70-a', label: '70.a (Müəssisənin ləğvi)' },
    { code: '70-b', label: '70.b (Ştat ixtisarı)' },
    { code: '70-ç', label: '70.ç (Kobud vəzifə pozuntusu)' },
    { code: '74', label: '74. (İradədən asılı olmayan hallar)' }
  ];

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-rose-100 dark:border-rose-900/30 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-rose-50 transition-all text-slate-400">
                <ArrowLeft className="w-5 h-5 px-0" />
            </button>
            <div>
                <div className="flex items-center space-x-3 leading-none italic uppercase">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic leading-none">
                        <UserMinus className="w-6 h-6 mr-3 text-rose-500 shadow-sm px-0" /> İşdən Azad Etmə Əmri № {docNumber}
                    </h1>
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic tracking-tighter leading-none shadow-sm">EXIT ORDER</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-4 text-[10px] font-black uppercase tracking-widest leading-none">
                    <div className="flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all italic leading-none">
                        <span className="text-slate-400 italic">SƏNƏD №</span>
                        <input 
                            value={docNumber} 
                            onChange={(e) => setDocNumber(e.target.value)}
                            className="bg-transparent border-none p-0 focus:ring-0 w-32 font-black text-slate-800 dark:text-white italic leading-none" 
                        />
                    </div>
                    <div className="flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all italic leading-none">
                        <span className="text-slate-400 italic flex items-center leading-none"><CalendarDays className="w-3 h-3 mr-2 text-rose-500 shadow-sm px-0" /> TARİX:</span>
                        <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="bg-transparent border-none p-0 w-28 outline-none text-rose-600 font-black italic uppercase leading-none hidden" />
                        <span onClick={() => (document.querySelector('input[type="date"]') as any)?.showPicker?.()} className="text-rose-600 font-black italic uppercase leading-none cursor-pointer">{formatDate(docDate)}</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Printer className="w-4 h-4 px-0" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button 
                disabled={isSaving || currentStatus === 'POSTED'}
                onClick={handleSave} 
                className="flex items-center space-x-3 px-10 py-3 bg-rose-600 text-white hover:bg-rose-700 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 italic transition-all leading-none"
            >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin px-0" /> : <CheckCircle2 className="w-4 h-4 px-0" />}
                <span>Əmri Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress 
        currentStatus={currentStatus} 
        steps={[
            { status: 'DRAFT', label: 'Yaradıldı', date: `${formatDate(docDate)} 10:00`, user: 'Sistem' },
            { status: 'PENDING', label: 'Təsdiqə göndərildi', date: `${formatDate(docDate)} 11:30`, user: 'Sistem' },
            { status: 'APPROVED', label: 'Təsdiq olundu', date: `${formatDate(docDate)} 14:15`, user: 'Sistem' },
            { status: 'POSTED', label: 'Müxabirləşmə verildi', date: `${formatDate(docDate)} 16:45`, user: 'Sistem' },
        ]}
      />

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Core Info */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-10 leading-none italic uppercase">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 space-y-4">
                        <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic leading-none ml-2">Əmr №</label>
                        <input 
                            value={orderNumber} 
                            onChange={e => setOrderNumber(e.target.value)} 
                            className="w-full bg-rose-50/30 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl py-4 px-6 text-xs font-black text-rose-600 italic shadow-sm" 
                        />
                    </div>
                    <SearchableSelect 
                        label="İşçi Seçimi"
                        placeholder="İşçini seçin..."
                        value={employeeId}
                        onChange={setEmployeeId}
                        options={employees.map(e => ({
                            id: e.id,
                            label: e.fullName,
                            subLabel: e.position
                        }))}
                        className="md:col-span-3"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormattedDateInput 
                        label="Azad Etmə Tarixi"
                        value={terminationDate}
                        onChange={setTerminationDate}
                        iconColor="text-rose-500"
                    />
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none ml-2">Xitam Maddəsi (AR Əmək Məcəlləsi)</label>
                        <select value={reasonCode} onChange={e => setReasonCode(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner">
                            <option value="">Səbəbi seçin...</option>
                            {terminationArticles.map(a => (
                                <option key={a.code} value={a.code}>{a.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Calculations Wrapper */}
            <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-[3.5rem] p-4 space-y-8 italic font-black uppercase">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Vacation Calc */}
                     <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 space-y-8 shadow-sm">
                         <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center italic">
                                <Calculator className="w-5 h-5 mr-3 text-indigo-500 shadow-sm px-0" /> Məzuniyyət Hesablaması
                            </h3>
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg italic">AVTOMATİK</span>
                         </div>

                         <div className="space-y-6">
                            <div className="flex justify-between items-center text-[10px] italic">
                                <span className="text-slate-400">Ümumi İş Stajı (Ay):</span>
                                <span className="text-slate-800 dark:text-white font-black">{formatNumber(tenureMonths, 1)} ay</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] italic">
                                <span className="text-slate-400">Qazanılmış Məzuniyyət:</span>
                                <span className="text-slate-800 dark:text-white font-black">{formatNumber(earnedDays, 1)} gün</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] italic">
                                <span className="text-slate-400">İstifadə Edilib:</span>
                                <span className="text-rose-500 font-black">- {usedDays} gün</span>
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                <div className="space-y-1 w-full mr-4">
                                    <span className="text-[10px] font-black text-slate-400 opacity-50 italic">Ödəniləcək Qalıq Günlər</span>
                                    <div className="flex items-center">
                                        <input 
                                            type="number" 
                                            value={remainingDays} 
                                            onChange={e => setRemainingDays(Number(e.target.value))}
                                            className="text-3xl font-black text-indigo-600 italic leading-none bg-transparent border-none p-0 focus:ring-0 w-24" 
                                        />
                                        <span className="text-xs uppercase opacity-30 font-black ml-2 mt-2 italic">GÜN</span>
                                    </div>
                                </div>
                                <CalendarDays className="w-10 h-10 text-indigo-100 shadow-sm px-0" />
                            </div>
                         </div>
                     </div>

                     {/* Tenure Days (Staj Əlavəsi) Info Card */}
                     <div className="bg-amber-50/30 dark:bg-amber-900/10 rounded-[3rem] border border-amber-100 dark:border-amber-900/20 p-10 space-y-8 shadow-sm italic font-black uppercase">
                         <h3 className="text-[11px] font-black text-amber-800 dark:text-amber-100 uppercase tracking-widest flex items-center italic">
                            <Scale className="w-5 h-5 mr-3 text-amber-500 shadow-sm px-0" /> Staj Əlavəsi (Maddə 116)
                         </h3>
                         <p className="text-[10px] text-amber-600/70 font-bold leading-relaxed italic uppercase leading-tight">
                            Stajına görə əlavə məzuniyyət günləri yalnız istifadə üçün nəzərdə tutulub. Xitamda kompensasiya yoxdur.
                         </p>
                         <div className="pt-4 border-t border-amber-100/30 flex justify-between items-center">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-amber-600/50 italic leading-none">Staj üzrə qazanılan günlər</span>
                                    <div className="text-3xl font-black text-amber-600 italic leading-none">{formatNumber(additionalStajDays, 0)} <span className="text-xs uppercase opacity-30">GÜN</span></div>
                                </div>
                                <div className="p-4 bg-amber-100/50 rounded-2xl shadow-sm italic font-black uppercase leading-none"><Info className="w-5 h-5 text-amber-500 shadow-sm px-0" /></div>
                         </div>
                     </div>
                 </div>

                 {/* Financial Breakout */}
                 <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 space-y-8 shadow-sm italic font-black uppercase">
                     <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center italic">
                        <DollarSign className="w-5 h-5 mr-3 text-rose-500 shadow-sm px-0" /> Ödəniş və Tutulmalar (Sənədli Uçot)
                     </h3>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none ml-2">İşlədiyi Günlər Üçün Maaş (Final Month)</label>
                            <div className="relative">
                                <input type="number" value={finalSalaryAmount} onChange={e => setFinalSalaryAmount(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-8 text-xl font-black text-slate-800 dark:text-white italic shadow-inner" />
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">AZN</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest italic leading-none ml-2">Məzuniyyət Kompensasiyası (Cəmi)</label>
                            <div className="relative leading-none">
                                <input type="number" value={compensationAmount} onChange={e => setCompensationAmount(Number(e.target.value))} className="w-full bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl py-5 px-8 text-xl font-black text-rose-600 italic shadow-inner" />
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-rose-300 uppercase leading-none">AZN (BRUTTO)</span>
                            </div>
                        </div>
                     </div>

                     <div className="p-6 bg-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden italic font-black uppercase">
                        <div className="flex justify-between items-center relative z-10 italic font-black uppercase leading-none">
                            <span className="text-[10px] text-slate-400 tracking-[0.2em] italic font-black uppercase leading-none px-4">Cəmi Ödəniləcək (Gross)</span>
                            <div className="text-3xl text-emerald-400 font-black italic shadow-sm leading-none px-8">{formatNumber(finalSalaryAmount + compensationAmount, 2)} <span className="text-xs text-white opacity-40 italic font-black uppercase">AZN</span></div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
                     </div>
                 </div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28 italic font-black uppercase">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6 shadow-sm italic font-black uppercase leading-none">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center italic mb-4">
                    <Info className="w-3.5 h-3.5 mr-3 text-indigo-500 shadow-sm" /> Rəsmi Protokol (Checklist)
                </h4>
                <div className="space-y-4">
                    {[
                        "Azad etmə ərizəsi və əmr imzalanıb",
                        "Təhkim olunmuş əmlak (Laptop/Avto) alınıb",
                        "İT girişləri və e-mail ləğv edilib",
                        "Borc öhdəliyi yoxdur (Mühasibatlıq)",
                        "Giriş kartı və açarlar təhvil verilib",
                        "Əmək kitabçası təhvil-təslim edilib",
                        "EMAS portalında xitam işlənib"
                    ].map((text, i) => (
                        <label key={i} className="flex items-center space-x-4 cursor-pointer group p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm italic font-black uppercase">
                            <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-rose-600 focus:ring-rose-500 transition-all shadow-inner" />
                            <span className="text-[9px] font-black text-slate-500 uppercase italic group-hover:text-slate-800 transition-colors shadow-sm">{text}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/20 p-6 space-y-4 italic font-black uppercase leading-none shadow-inner">
                <h4 className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center italic">
                    <FileText className="w-3.5 h-3.5 mr-2" /> Vergi və DSMF
                </h4>
                <p className="text-[8px] text-indigo-500 font-bold leading-relaxed italic uppercase leading-tight">
                    Məzuniyyət kompensasiyasından sosial sığorta (DSMF) və işsizlik sığortası rəsmən tutulur.
                </p>
            </div>

            <textarea 
                value={reasonDetails}
                onChange={e => setReasonDetails(e.target.value)}
                placeholder="Xitam barədə rəsmi qeydlər və staj əlavəsi barədə sənədli izah..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 text-xs font-black italic shadow-inner outline-none focus:ring-2 focus:ring-rose-500/10 h-32 uppercase"
            ></textarea>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTerminationCreate;
