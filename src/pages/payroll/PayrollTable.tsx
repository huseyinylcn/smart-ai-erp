import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { 
  Users, Download, CheckCircle2, 
  MoreVertical, Search, 
  TrendingUp, TrendingDown,
  AlertCircle,
  Calculator, RotateCcw, PlayCircle, Loader2, CalendarIcon, Maximize2, Minimize2, Printer,
  FileText,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Activity,
  X,
  Filter,
  ArrowRight
} from 'lucide-react';
import JournalPreviewModal from '../../components/JournalPreviewModal';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import { useOutletContext } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// PREMIUM LIGHT THEME STICKY CSS - V6 (STABLE)
const tableStickyStyles = `
  /* Global Table Reset */
  .payroll-table { border-collapse: separate !important; border-spacing: 0 !important; }

  /* Header Z-Index & Light Theme */
  .payroll-table thead th { 
    position: sticky !important; 
    top: 0 !important; 
    z-index: 80 !important; 
    background: #f8fafc !important; 
    color: #475569 !important; 
    border-bottom: 2px solid #e2e8f0 !important;
  }
  
  /* Left Side Freeze - Highest Priority Z-Index (100) for Headers, (90) for Cells */
  .payroll-table th:nth-child(1), .payroll-table td:nth-child(1) { position: sticky !important; left: 0px !important; background: white !important; width: 48px !important; }
  .payroll-table th:nth-child(2), .payroll-table td:nth-child(2) { position: sticky !important; left: 48px !important; background: white !important; width: 300px !important; }
  .payroll-table th:nth-child(3), .payroll-table td:nth-child(3) { position: sticky !important; left: 348px !important; background: white !important; width: 240px !important; }
  .payroll-table th:nth-child(4), .payroll-table td:nth-child(4) { 
    position: sticky !important; 
    left: 588px !important; 
    background: white !important; 
    width: 120px !important; 
    border-right: 2px solid #f1f5f9 !important; 
    box-shadow: 10px 0 20px -5px rgba(0,0,0,0.05) !important; 
  }

  /* Set Z-Index for Frozen Items */
  .payroll-table thead th:nth-child(-n+4) { z-index: 100 !important; background: #f1f5f9 !important; }
  .payroll-table tbody td:nth-child(-n+4) { z-index: 90 !important; }

  /* Right Side Freeze (Net Payable etc) */
  .payroll-table th:nth-last-child(1), .payroll-table td:nth-last-child(1) { position: sticky !important; right: 0px !important; background: #f5f3ff !important; min-width: 160px !important; border-left: 2px solid #818cf8 !important; }
  .payroll-table th:nth-last-child(2), .payroll-table td:nth-last-child(2) { position: sticky !important; right: 160px !important; background: #f0fdf4 !important; min-width: 160px !important; }
  .payroll-table th:nth-last-child(3), .payroll-table td:nth-last-child(3) { position: sticky !important; right: 320px !important; background: #f8fafc !important; min-width: 160px !important; }

  /* Z-Index for Right Frozen */
  .payroll-table thead th:nth-last-child(-n+3) { z-index: 100 !important; }
  .payroll-table tbody td:nth-last-child(-n+3) { z-index: 90 !important; }

  /* HOVER READABILITY */
  .payroll-table tr:hover td { background-color: #eff6ff !important; color: #1e3a8a !important; }
  .payroll-table tr:hover td span { color: inherit !important; }

  /* Footer Sync */
  .payroll-table tfoot td { position: sticky !important; bottom: 0 !important; z-index: 110 !important; background: #f8fafc !important; color: #1e293b !important; border-top: 2px solid #e2e8f0 !important; }
  .payroll-table tfoot td:nth-child(-n+4) { z-index: 120 !important; }
  .payroll-table tfoot td:nth-last-child(-n+3) { z-index: 120 !important; }
`;


const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];

const COL_WIDTHS = {
    NO: 48,
    EMPLOYEE: 300,
    DEPT: 240,
    WORKPLACE: 120
};

const OFFSETS = {
    NO: 0,
    EMPLOYEE: 48,
    DEPT: 348,
    WORKPLACE: 588
};

const PayrollTable = () => {
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [payrollStatus, setPayrollStatus] = useState<string>('DRAFT');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [searchTerm, setSearchTerm] = useState('');
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  
  // Real Filters
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterWorkplace, setFilterWorkplace] = useState('ALL');
  const [filterMinSalary, setFilterMinSalary] = useState('');
  const [filterMaxSalary, setFilterMaxSalary] = useState('');

  const { activeCompany } = useCompany();
  const { formatNumber, formatCurrency, formatDate } = useFormat();
  const tableRef = useRef<HTMLTableElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { 
    isContentFullscreen, 
    setIsFilterSidebarOpen, 
    isFilterSidebarOpen, 
    setFilterSidebarContent 
  } = useOutletContext<{ 
    isContentFullscreen: boolean, 
    setIsFilterSidebarOpen: (v: boolean) => void,
    isFilterSidebarOpen: boolean,
    setFilterSidebarContent: (v: any) => void
  }>() || { isContentFullscreen: false, isFilterSidebarOpen: false };

  const companyId = activeCompany?.id || 'COM-001';

  const handleBankExport = () => {
    if (!filteredData || filteredData.length === 0) return;

    // Prepare data for Excel
    const excelData = filteredData.map(row => {
        const emp = row.employee || row;
        // Find the primary bank account
        const primaryBank = (emp.bankAccounts || []).find((b: any) => b.isPrimary) || (emp.bankAccounts || [])[0] || {};
        
        return {
            'İşçinin Tam Adı': emp.fullName || '---',
            'FİN': emp.fin || '---',
            'Dövr': `${months[selectedMonth-1]} ${selectedYear}`,
            'Köçürülməli Məbləğ (₼)': (row.netAmount || 0).toFixed(2),
            'Bankın Adı': primaryBank.bankName || '---',
            'Bank Hesabı (IBAN)': primaryBank.accountNumber || '---'
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bank_Odenis_Siyahisi');

    // Column widths for readability
    const wscols = [
        {wch: 35}, // Name
        {wch: 15}, // FIN
        {wch: 20}, // Period
        {wch: 25}, // Amount
        {wch: 30}, // Bank
        {wch: 40}  // IBAN
    ];
    worksheet['!cols'] = wscols;

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    saveAs(dataBlob, `BANK_PAYMENT_${months[selectedMonth-1].toUpperCase()}_${selectedYear}.xlsx`);
  };

  const calculatePayroll = (emp: any, norm: any, attend: any, periodSalary?: number, sector: 'PRIVATE' | 'STATE' = 'PRIVATE') => {
    const baseSalary = periodSalary !== undefined ? periodSalary : Number(emp.salaryGross || emp.salary || 0);
    const normHours = Number(attend?.monthlyNorm || norm?.hours || 176);
    const normDays = Number(attend?.monthlyNormDays || norm?.days || 22);
    const actualHours = Number(attend?.totalHours || 0);
    const actualDays = Number(attend?.presentDays || 0);
    
    // Proportional basic calculation based on shift-specific norm hours
    const calculatedSalary = normHours > 0 ? (baseSalary / normHours) * actualHours : 0;
    
    // KPI and Bonus
    const kpi = Number(emp.kpi || emp.employee?.kpi || 0);
    const bonus = Number(emp.bonus || emp.employee?.bonus || 0);
    const gross = calculatedSalary + kpi + bonus;

    let incomeTax = 0;
    let dsmfEmployee = 0;
    let unemploymentEmployee = 0;
    let itsEmployee = 0;

    if (sector === 'PRIVATE') {
        // NON-OIL/GAS PRIVATE SECTOR BENEFITS (2024-2026)
        incomeTax = gross > 8000 ? (gross - 8000) * 0.14 : 0;
        if (gross <= 200) { dsmfEmployee = gross * 0.03; } 
        else { dsmfEmployee = 6 + (gross - 200) * 0.1; }
    } else {
        incomeTax = gross > 200 ? (gross - 200) * 0.14 : 0;
        dsmfEmployee = gross * 0.03;
    }

    unemploymentEmployee = gross * 0.005;
    itsEmployee = gross * 0.02;

    const totalEmployeeDeductions = incomeTax + dsmfEmployee + unemploymentEmployee + itsEmployee;
    const net = gross - totalEmployeeDeductions;

    // Employer costs
    let dsmfEmployer = 0;
    if (sector === 'PRIVATE') {
        if (gross <= 200) { dsmfEmployer = gross * 0.22; } 
        else { dsmfEmployer = 44 + (gross - 200) * 0.15; }
    } else {
        dsmfEmployer = gross * 0.22;
    }

    const unemploymentEmployer = gross * 0.005;
    const itsEmployer = gross * 0.02;
    const totalEmployerCost = dsmfEmployer + unemploymentEmployer + itsEmployer;
    const round = (val: number) => Math.round((val + Number.EPSILON) * 100) / 100;

    return {
        baseSalary: round(baseSalary),
        calculatedSalary: round(calculatedSalary),
        kpi: round(kpi),
        bonus: round(bonus),
        salaryGross: round(gross),
        netAmount: round(net),
        incomeTax: round(incomeTax),
        socialInsuranceAmount: round(dsmfEmployee),
        unemploymentInsuranceAmount: round(unemploymentEmployee),
        compulsoryInsuranceAmount: round(itsEmployee),
        employerSocialInsurance: round(dsmfEmployer),
        employerUnemploymentInsurance: round(unemploymentEmployer),
        employerCompulsoryInsurance: round(itsEmployer),
        totalEmployeeDeductions: round(totalEmployeeDeductions),
        totalEmployerObligations: round(totalEmployerCost),
        actualHours,
        actualDays,
        normHours,
        normDays
    };
  };

  const fetchData = async () => {
    if (!companyId) return;
    try {
      setIsLoading(true);
      // Try official Matrix first
      let res: any;
      try {
          res = await (hrApi as any).getPayrollMatrix(Number(selectedMonth), Number(selectedYear), companyId);
      } catch (e) {
          console.warn('MATRIX_FETCH_FAIL (404/500), trying Hybrid Fallback...');
      }
      
      let finalDetails = (res && Array.isArray(res.details)) ? res.details : [];

      // HYBRID FALLBACK: If official matrix is empty or failed, fetch from live generation path
      if (finalDetails.length === 0) {
          console.log('HYBRID_SYNC: Fetching live calculation data for visibility...');
          try {
              // 1. Get employees
              const empList = await hrApi.getEmployees(companyId);
              // 2. Get attendance matrix for the period
              const attendance = await hrApi.getAttendanceMatrix(Number(selectedMonth), Number(selectedYear), companyId);
              const attendanceMap = (attendance || []).reduce((acc: any, curr: any) => {
                  acc[curr.employeeId] = curr;
                  return acc;
              }, {});
              // 3. Get month normative status
              const norm = await hrApi.getMonthStatus(Number(selectedMonth), Number(selectedYear), companyId);

              if (empList && empList.length > 0) {
                  finalDetails = empList
                      .map((e: any) => {
                          const attend = attendanceMap[e.id];
                          // Find active salary in contracts if available
                          let currentSalary = e.salaryGross || e.salary || 0;
                          if (e.contracts && e.contracts.length > 0) {
                              const pEnd = new Date(Number(selectedYear), Number(selectedMonth), 0);
                              const activeC = e.contracts.find((c: any) => new Date(c.startDate) <= pEnd && (!c.endDate || new Date(c.endDate) >= pEnd));
                              if (activeC) currentSalary = activeC.salaryGross;
                          }
                          
                          const calcResult = calculatePayroll(e, norm, attend, currentSalary, 'PRIVATE');
                          
                          return {
                              ...e,
                              ...calcResult,
                              employeeId: e.id,
                              employee: e,
                              status: 'LIVE_RECONSTRUCTED'
                          };
                      })
                      // .filter((row: any) => (row.actualHours || 0) > 0); // REMOVED FILTER: Show all active identities even if 0 hours
              }
          } catch (fallbackErr) {
              console.error('HYBRID_RECONSTRUCTION_FAIL:', fallbackErr);
          }
      }

      const enriched = (finalDetails || []).map((item: any) => ({
        ...item,
        paidAmount: item?.paidAmount || 0,
        employee: item?.employee || item // Safety for missing employee object
      }));
      setPayrollData(enriched);
      setPayrollStatus(res?.status || 'DRAFT');
    } catch (error: any) {
      console.error('FETCH_PAYROLL_DATA_ERROR:', error);
      setPayrollData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, companyId]);

  // Dynamic Departments for filter
  const departments = useMemo(() => {
    if (!payrollData || !Array.isArray(payrollData)) return ['ALL'];
    const deps = new Set(payrollData.map(p => p?.employee?.department?.name || p?.department?.name || 'ÜMUMİ ŞÖBƏ'));
    return ['ALL', ...Array.from(deps)];
  }, [payrollData]);

  const filteredData = useMemo(() => {
    if (!payrollData) return [];
    let data = [...payrollData];
    
    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.employee?.fullName?.toLowerCase().includes(lower) ||
        item.employee?.fin?.toLowerCase().includes(lower) ||
        item.employee?.code?.toLowerCase().includes(lower)
      );
    }

    // Dept Filter
    if (filterDept !== 'ALL') {
      data = data.filter(item => (item.employee?.department?.name || 'ÜMUMİ ŞÖBƏ') === filterDept);
    }

    // Workplace Filter
    if (filterWorkplace !== 'ALL') {
      data = data.filter(item => (item.employee?.workplaceType || 'ƏSAS') === filterWorkplace);
    }

    // Salary Range
    if (filterMinSalary) {
      data = data.filter(item => (item.netAmount || 0) >= Number(filterMinSalary));
    }
    if (filterMaxSalary) {
      data = data.filter(item => (item.netAmount || 0) <= Number(filterMaxSalary));
    }

    return data;
  }, [payrollData, searchTerm, filterDept, filterWorkplace, filterMinSalary, filterMaxSalary]);

  const sums = useMemo(() => {
    const defaultSums = {
        baseSalary: 0, calculatedSalary: 0, vacationPay: 0, sickLeavePay: 0, currentPeriodComp: 0, previousPeriodsComp: 0,
        kpi: 0, bonus: 0, salaryGross: 0, incomeTax: 0, socialInsuranceAmount: 0, unemploymentInsuranceAmount: 0, 
        compulsoryInsuranceAmount: 0, totalEmployeeDeductions: 0, employerSocialInsurance: 0, 
        employerUnemploymentInsurance: 0, employerCompulsoryInsurance: 0, totalEmployerObligations: 0, netAmount: 0,
        paidAmount: 0, balanceAmount: 0
    };
    if (!filteredData || !Array.isArray(filteredData)) return defaultSums;
    
    return (filteredData || []).reduce((acc, row) => {
        if (!row) return acc;
        
        const salaryGross = Number(row?.salaryGross || row?.gross || 0);
        const netAmount = Number(row?.netAmount || row?.net || 0);
        const paidAmount = Number(row?.paidAmount || 0);
        
        const incomeTax = Number(row?.incomeTax || 0);
        const dsmf = Number(row?.socialInsuranceAmount || row?.socialInsurance || 0);
        const unemployment = Number(row?.unemploymentInsuranceAmount || row?.unemploymentInsurance || 0);
        const compulsory = Number(row?.compulsoryInsuranceAmount || row?.compulsoryInsurance || 0);
        
        const totalEmployeeDeductions = incomeTax + dsmf + unemployment + compulsory;
        
        const empDsmf = Number(row?.employerSocialInsurance || 0);
        const empUnemployment = Number(row?.employerUnemploymentInsurance || 0);
        const empCompulsory = Number(row?.employerCompulsoryInsurance || 0);
        const totalEmployerObligations = empDsmf + empUnemployment + empCompulsory;
        
        return {
            baseSalary: acc.baseSalary + (Number(row?.baseSalary || row?.salary || 0)),
            calculatedSalary: acc.calculatedSalary + (Number(row?.calculatedSalary || 0)),
            vacationPay: acc.vacationPay + (Number(row?.vacationPay) || 0),
            sickLeavePay: acc.sickLeavePay + (Number(row?.sickLeavePay) || 0),
            currentPeriodComp: acc.currentPeriodComp + (Number(row?.currentPeriodComp) || 0),
            previousPeriodsComp: acc.previousPeriodsComp + (Number(row?.previousPeriodsComp) || 0),
            kpi: acc.kpi + (Number(row?.kpi || row?.employee?.kpi) || 0),
            bonus: acc.bonus + (Number(row?.bonus || row?.employee?.bonus) || 0),
            salaryGross: acc.salaryGross + salaryGross,
            incomeTax: acc.incomeTax + incomeTax,
            socialInsuranceAmount: acc.socialInsuranceAmount + dsmf,
            unemploymentInsuranceAmount: acc.unemploymentInsuranceAmount + unemployment,
            compulsoryInsuranceAmount: acc.compulsoryInsuranceAmount + compulsory,
            totalEmployeeDeductions: acc.totalEmployeeDeductions + totalEmployeeDeductions,
            employerSocialInsurance: acc.employerSocialInsurance + empDsmf,
            employerUnemploymentInsurance: acc.employerUnemploymentInsurance + empUnemployment,
            employerCompulsoryInsurance: acc.employerCompulsoryInsurance + empCompulsory,
            totalEmployerObligations: acc.totalEmployerObligations + totalEmployerObligations,
            netAmount: acc.netAmount + netAmount,
            paidAmount: acc.paidAmount + paidAmount,
            balanceAmount: acc.balanceAmount + (netAmount - paidAmount)
        };
    }, defaultSums);
  }, [filteredData]);

  // Sidebar content management moved to useMemo for stability



  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* SCREEN 3 TOTALS CARDS INTEGRATION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-3">Cəmi Xalis Ödəniş</span>
                  <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><Calculator className="w-6 h-6" /></div>
                      <span className="text-3xl font-black text-slate-800 dark:text-white tabular-nums italic">₼ {sums.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-3">Cəmi Tutulmalar</span>
                  <div className="flex items-center gap-3">
                      <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform"><ShieldCheck className="w-6 h-6" /></div>
                      <span className="text-3xl font-black text-slate-800 dark:text-white tabular-nums italic">₼ {sums.totalEmployeeDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-3">İşəgötürən Xərci (Cəmi)</span>
                  <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><Activity className="w-6 h-6" /></div>
                      <span className="text-3xl font-black text-slate-800 dark:text-white tabular-nums italic">₼ {(sums.salaryGross + sums.totalEmployerObligations).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-3">İşçi Sayı</span>
                  <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-2xl group-hover:scale-110 transition-transform"><Users className="w-6 h-6" /></div>
                      <span className="text-3xl font-black text-slate-800 dark:text-white tabular-nums italic">{filteredData?.length || 0} <span className="text-xs font-bold text-slate-400 uppercase tracking-widest not-italic">Nəfər</span></span>
                  </div>
              </div>
          </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500 hover:shadow-md">
         <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-0">
               <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter flex items-center">
                  Maaş Cədvəli Listi
                  <span className="ml-3 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] rounded-lg tracking-widest not-italic font-black border border-indigo-100/50 uppercase">Arxiv</span>
               </h1>
               <div className="flex items-center space-x-2 mt-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">{months[selectedMonth-1]} {selectedYear} üzrə arxivləşmiş məlumatlar</p>
               </div>
            </div>
         </div>

         <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 leading-none">
            <div className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
               <span className="text-[10px] font-black uppercase text-slate-400 italic">Ay:</span>
               <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-transparent border-none text-[11px] font-black text-indigo-600 uppercase focus:ring-0 cursor-pointer outline-none"
               >
                  {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
               </select>
            </div>
            <div className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
               <span className="text-[10px] font-black uppercase text-slate-400 italic">İl:</span>
               <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent border-none text-[11px] font-black text-indigo-600 uppercase focus:ring-0 cursor-pointer outline-none"
               >
                  {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
               </select>
            </div>
            <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                  type="text"
                  placeholder="Hızlı axtarış..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-6 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-64 uppercase italic"
               />
            </div>
            <button 
               onClick={fetchData}
               className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 leading-none"
               title="Yenilə"
            >
               <RotateCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
         </div>
      </div>

      <div ref={containerRef} className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col transition-all duration-500 ease-in-out ${isContentFullscreen ? 'fixed inset-0 z-[9999] m-0 rounded-none w-full h-full' : 'min-h-[600px]'}`}>
          <div className="flex items-center justify-between p-7 border-b border-slate-50 dark:border-slate-800 bg-slate-50/20">
             <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200/50 dark:shadow-none transition-transform hover:scale-105 duration-500"><Calculator className="w-5 h-5 text-indigo-600" /></div>
                 <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300 italic">
                        Maaş Siyahısı <span className="text-slate-400 font-light">—</span> {selectedYear} {months[selectedMonth-1]} ({filteredData?.length || 0} işçi)
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Arxiv Məlumatları Süzgəclənmişdir</p>
                 </div>
             </div>
             <div className="flex items-center gap-3 leading-none">
                 <button 
                   onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                   className={`p-4 rounded-xl transition-all shadow-sm flex items-center gap-2 group leading-none border ${isFilterSidebarOpen ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/20' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:text-indigo-600'}`}
                   title="Geniş Süzgəc (Alt+F)"
                 >
                    <Filter className={`w-4 h-4 ${isFilterSidebarOpen ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                    <span className="text-[9px] font-black uppercase italic tracking-widest">Süzgəc</span>
                    { (filterDept !== 'ALL' || filterWorkplace !== 'ALL' || filterMinSalary || filterMaxSalary) && (
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 shadow-sm shadow-rose-500/50" />
                    )}
                 </button>
                 <div className="w-[1px] h-6 bg-slate-100 dark:bg-slate-800 mx-2" />
                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Payroll Arxiv v3.4</span>
             </div>
          </div>
          
          <div className="overflow-x-auto flex-1 custom-scrollbar" style={{ borderRadius: '0 0 2.5rem 2.5rem' }}>
             <style>{tableStickyStyles}</style>
             <table ref={tableRef} className="w-full text-left border-collapse min-w-[3200px] table-auto payroll-table">
                <thead className="sticky top-0 z-[110]">
                   <tr className="bg-slate-50 dark:bg-slate-900 shadow-sm h-12">
                      <th colSpan={4} style={{ width: '708px' }} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-center p-left-0 border-r border-slate-200">İşçi Məlumatları</th>
                      <th colSpan={4} className="px-6 py-4 bg-indigo-50/30 text-[10px] font-black text-slate-600 uppercase text-center border-r border-slate-200 italic border-l border-slate-200">Norma vs Faktiki</th>
                      <th colSpan={9} className="px-6 py-4 bg-emerald-50/30 text-[10px] font-black text-emerald-700 uppercase text-center border-r border-slate-200 italic border-l border-slate-200">Hesablanıb (Hesablanmış Maaş)</th>
                      <th colSpan={5} className="px-6 py-4 bg-rose-50/30 text-[10px] font-black text-rose-700 uppercase text-center border-r border-slate-200 italic border-l border-slate-200 font-serif">Tutulmuşdur (İşçi tərəfindən)</th>
                      <th colSpan={4} className="px-6 py-4 bg-amber-50/30 text-[10px] font-black text-amber-700 uppercase text-center border-r border-slate-200 italic border-l border-slate-200 font-serif">İşəgötürən tərəfindən</th>
                      <th colSpan={3} style={{ width: '480px' }} className="px-6 py-4 p-right-0 text-[11px] font-black text-slate-800 uppercase text-center italic">Ödənilməli Məbləğ</th>
                   </tr>
                   <tr className="bg-white dark:bg-slate-800 text-[9px] font-black text-slate-600 uppercase tracking-tighter shadow-sm h-10 border-b border-slate-200">
                      <th style={{ width: '48px' }} className="px-4 py-3 text-center p-left-0 border-r border-slate-600/30">№</th>
                      <th style={{ width: '300px' }} className="px-6 py-3 p-left-1 border-r border-slate-600/30">İşçi / FİN</th>
                      <th style={{ width: '240px' }} className="px-6 py-3 p-left-2 border-r border-slate-600/30 leading-none">Şöbə <br/><span className="text-[8px] text-slate-400">Vəzifə</span></th>
                      <th style={{ width: '120px' }} className="px-4 py-3 text-center p-left-3 border-r-2 border-slate-600 font-sans italic">İş yeri</th>
                      
                      <th className="px-4 py-3 text-center italic hover:bg-slate-600/50 transition-colors">Ayın <br/>saatı</th>
                      <th className="px-4 py-3 text-center italic hover:bg-slate-600/50 transition-colors text-indigo-300">Faktiki <br/>saat</th>
                      <th className="px-4 py-3 text-center italic hover:bg-slate-600/50 transition-colors">Ayın <br/>günü</th>
                      <th className="px-4 py-3 text-center italic hover:bg-slate-600/50 transition-colors text-indigo-300 border-r border-slate-600">Faktiki <br/>gün</th>
                      
                      <th className="px-4 py-3 text-center border-r border-slate-600/30 font-medium">Ştat Maaşı</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30 font-black text-emerald-300 leading-none italic">Hesab. <br/>Maaş</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Məzuniy.</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Xəstəlik</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Komp.Cari</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Komp.Köhnə</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30 font-black">KPİ</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30 font-black">Mükafat</th>
                      <th className="px-4 py-3 text-center border-r-2 border-slate-600 bg-emerald-900/20 font-black text-white italic">CƏMİ (Gross)</th>
                      
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Gəlir v.</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30 text-rose-300 uppercase">Pensiya</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">İ.Ş.H. (0.5%)</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">İ.T.S.H. (2%)</th>
                      <th className="px-4 py-3 text-center border-r-2 border-slate-600 bg-rose-900/20 font-black text-rose-200 uppercase tracking-tighter italic">Cəmi Tutulma</th>
  
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Pensiya F.</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">İ.Ş.H. (0.5%)</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">İ.T.S.H. (2%)</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600 bg-emerald-900/10 text-emerald-300 font-bold uppercase italic border-l border-slate-600">Cəmi Şirkət</th>
  
                      <th style={{ width: '160px' }} className="px-6 py-3 text-center p-right-2 border-r border-slate-600/30 font-black text-[9px] shadow-[-10px_0_20px_rgba(0,0,0,0.1)] leading-none italic uppercase">Ödənilməli <br/><span className="text-[7px] text-slate-400">(NET)</span></th>
                      <th style={{ width: '160px' }} className="px-6 py-3 text-center p-right-1 border-r border-emerald-600/30 font-black text-[9px] leading-none italic uppercase text-emerald-600">Ödənilmiş <br/><span className="text-[7px] text-emerald-200/50">(AVANS)</span></th>
                      <th style={{ width: '160px' }} className="px-6 py-3 text-center p-right-0 font-black text-[10px] leading-none text-white italic border-l border-indigo-500 uppercase">Net <br/>Qalıq</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                   {isLoading ? (
                     <tr>
                       <td colSpan={30} className="p-24 text-center">
                         <div className="flex flex-col items-center space-y-6">
                           <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center animate-pulse"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
                           <span className="text-[11px] font-black uppercase italic tracking-[0.2em] text-slate-400 animate-pulse">Arxiv Verilənlər Analiz Edilir...</span>
                         </div>
                       </td>
                     </tr>
                   ) : filteredData && filteredData.length > 0 ? (
                     filteredData.map((row, idx) => {
                       const totalEmployeeDeductions = (row.socialInsuranceAmount || 0) + (row.compulsoryInsuranceAmount || 0) + (row.unemploymentInsuranceAmount || 0) + (row.incomeTax || 0);
                       const totalEmployerObligations = (row.employerSocialInsurance || 0) + (row.employerCompulsoryInsurance || 0) + (row.employerUnemploymentInsurance || 0);
                       const netPayable = row.netAmount || 0;
                       const paid = row.paidAmount || 0;
                       const balance = netPayable - paid;
                       
                       return (
                        <tr key={row.id || idx} className="hover:bg-blue-50/50 transition-all text-[11px] tabular-nums group border-b border-slate-50">
                           <td style={{ width: `${COL_WIDTHS.NO}px`, left: `${OFFSETS.NO}px` }} className="px-4 py-5 text-center font-bold text-slate-400 sticky bg-white dark:bg-slate-900 z-30 group-hover:bg-slate-50 transition-colors shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)] translate-z-0">{idx + 1}</td>
                           <td style={{ width: `${COL_WIDTHS.EMPLOYEE}px`, left: `${OFFSETS.EMPLOYEE}px` }} className="px-6 py-5 sticky bg-white dark:bg-slate-900 z-30 group-hover:bg-slate-50 transition-colors shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)] translate-z-0">
                              <div className="flex flex-col">
                                 <span className="font-black text-slate-800 dark:text-white uppercase italic tracking-tight leading-none truncate max-w-[280px]">{row.employee?.fullName || row.fullName}</span>
                                 <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded leading-none">{row.employee?.code || row.employeeCode || row.code || '---'}</span>
                                    <div className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                                    <span className="text-[9px] font-black text-indigo-500 uppercase italic tracking-widest leading-none">{row.employee?.fin || row.fin || '---'}</span>
                                 </div>
                              </div>
                           </td>
                           <td style={{ width: `${COL_WIDTHS.DEPT}px`, left: `${OFFSETS.DEPT}px` }} className="px-6 py-5 sticky bg-white dark:bg-slate-900 z-30 group-hover:bg-slate-50 transition-colors shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)] translate-z-0">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase italic leading-none truncate max-w-[200px]">{row.employee?.department?.name || row.employee?.department || 'ÜMUMİ ŞÖBƏ'}</span>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1.5 leading-none truncate max-w-[200px]">{row.employee?.jobPosition?.name || row.employee?.position || 'İşçi'}</span>
                              </div>
                           </td>
                           <td style={{ width: `${COL_WIDTHS.WORKPLACE}px`, left: `${OFFSETS.WORKPLACE}px` }} className="px-4 py-5 text-center border-r-[1.5px] border-slate-100 dark:border-slate-800 sticky bg-white dark:bg-slate-900 z-30 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.2)] group-hover:bg-slate-50 transition-colors whitespace-nowrap translate-z-0">
                               <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase italic shadow-sm border ${row.employee?.workplaceType === 'ƏLAVƏ' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                  {row.employee?.workplaceType || 'ƏSAS'}
                               </span>
                            </td>
                           
                           <td className="px-4 py-4 text-center bg-indigo-50/20 dark:bg-indigo-900/5 font-black text-indigo-400/80">{(row.normHours || 176).toFixed(2)}</td>
                           <td className="px-4 py-4 text-center bg-indigo-50/20 dark:bg-indigo-900/5 font-black text-indigo-600">{(row.actualHours || 0).toFixed(2)}</td>
                           <td className="px-4 py-4 text-center bg-indigo-50/20 dark:bg-indigo-900/5 font-black text-indigo-400/80">{row.normDays || 22}</td>
                           <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-slate-800 bg-indigo-50/20 dark:bg-indigo-900/5 font-black text-indigo-600 shadow-inner">{row.actualDays || 0}</td>
                           
                           <td className="px-4 py-4 text-center bg-emerald-50/5 dark:bg-emerald-900/5 text-slate-400/70 italic">{(row.baseSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-emerald-50/10 dark:bg-emerald-900/10 font-black text-emerald-600 italic">{(row.calculatedSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-emerald-50/5 dark:bg-emerald-900/5 text-slate-400/60 font-bold italic">{(row.vacationPay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-emerald-50/5 dark:bg-emerald-900/5 text-slate-400/60 font-bold italic">{(row.sickLeavePay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-emerald-50/5 dark:bg-emerald-900/5 text-slate-400/60 font-bold italic">{(row.currentPeriodComp || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-emerald-50/5 dark:bg-emerald-900/5 text-slate-400/60 font-bold italic">{(row.previousPeriodsComp || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-emerald-50/10 dark:bg-emerald-900/10 font-black text-indigo-500 italic shadow-inner">{(Number(row.kpi || row.employee?.kpi) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-emerald-50/10 dark:bg-emerald-900/10 font-black text-indigo-500 italic shadow-inner">{(Number(row.bonus || row.employee?.bonus) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-slate-800 bg-emerald-50/15 dark:bg-indigo-900/20 font-bold text-slate-800 dark:text-white border-l border-emerald-100/30 uppercase italic">{(row.salaryGross || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           
                           <td className="px-4 py-4 text-center bg-rose-50/5 dark:bg-rose-900/5 text-rose-400 font-bold">{(row.incomeTax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-rose-50/10 dark:bg-rose-900/10 text-rose-500/80 font-black italic">{(row.socialInsuranceAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-rose-50/10 dark:bg-rose-900/10 text-rose-500/80 font-black italic">{(row.unemploymentInsuranceAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-rose-50/10 dark:bg-rose-900/10 text-rose-500/80 font-black italic">{(row.compulsoryInsuranceAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-slate-800 bg-rose-50/20 dark:bg-rose-900/20 font-black text-rose-600 italic shadow-inner">{(totalEmployeeDeductions || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
   
                           <td className="px-4 py-4 text-center bg-amber-50/5 dark:bg-amber-900/5 text-amber-600/80 font-bold italic">{(row.employerSocialInsurance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-amber-50/5 dark:bg-amber-900/5 text-amber-600/80 font-bold italic">{(row.employerUnemploymentInsurance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center bg-amber-50/5 dark:bg-amber-900/5 text-amber-600/80 font-bold italic">{(row.employerCompulsoryInsurance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-slate-800 bg-amber-50/20 dark:bg-amber-900/20 font-black text-amber-700 italic shadow-inner">{(totalEmployerObligations || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
   
                           <td className="px-6 py-5 text-center sticky right-[240px] bg-slate-50 dark:bg-slate-800/40 z-30 font-bold text-slate-500 uppercase italic shadow-[-5px_0_10px_rgba(0,0,0,0.05)] translate-z-0">
                              {(netPayable || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </td>
                           <td className="px-6 py-5 text-center sticky right-[120px] bg-emerald-50 dark:bg-emerald-900/20 z-30 font-black text-emerald-600 uppercase italic shadow-[-5px_0_10px_rgba(0,0,0,0.05)] translate-z-0">
                              {(paid || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </td>
                           <td className="px-8 py-5 text-center sticky right-0 bg-white dark:bg-slate-900 z-30 font-black text-[13px] shadow-[-15px_0_30px_rgba(0,0,0,0.2)] backdrop-blur-xl border-l-[1.5px] border-slate-100 dark:border-slate-800 text-indigo-600 uppercase italic translate-z-0">
                              ₼ {(balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </td>
                        </tr>
                       );
                     })
                    ) : (
                      <tr>
                        <td colSpan={30} className="px-10 py-32 text-center">
                          <div className="flex flex-col items-center space-y-6 opacity-80 group">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Calculator className="w-10 h-10 text-indigo-300" /></div>
                            <div className="space-y-2">
                                <p className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-800 dark:text-white italic">Cədvəl Formallaşdırılmayıb</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-sm leading-relaxed mx-auto italic">Seçilmiş dövr üçün rəsmi arxivləşmiş maaş cədvəli tapılmadı. Bu dövr üzrə hesablamanı aparmaq üçün düyməyə sıxın.</p>
                            </div>
                            <button 
                                onClick={() => window.location.href='/payroll/calculation/create'}
                                className="mt-4 px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 italic flex items-center gap-3"
                            >
                                <ArrowRight className="w-4 h-4" /> Cari Hesablamaya Keç
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                 </tbody>
                 <tfoot className="sticky bottom-0 z-[110] bg-slate-50 text-slate-900 font-black text-[11px] italic border-t-2 border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                   <tr className="tabular-nums">
                      <td style={{ width: `${COL_WIDTHS.NO}px`, left: `${OFFSETS.NO}px` }} className="sticky bg-slate-50 border-r border-slate-200 z-[115] px-4 py-6 text-center text-amber-600 font-black scale-110 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Σ</td>
                      <td style={{ width: `${COL_WIDTHS.EMPLOYEE}px`, left: `${OFFSETS.EMPLOYEE}px` }} className="sticky bg-slate-50 border-r border-slate-200 z-[115] px-6 py-6 uppercase tracking-[0.1em] text-slate-500 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">YEKUN:</td>
                      <td style={{ width: `${COL_WIDTHS.DEPT}px`, left: `${OFFSETS.DEPT}px` }} className="sticky bg-slate-50 border-r border-slate-200 z-[115] px-6 py-6 text-slate-400 text-[10px] uppercase shadow-[2px_0_5px_rgba(0,0,0,0.05)]">FİLTR</td>
                      <td style={{ width: `${COL_WIDTHS.WORKPLACE}px`, left: `${OFFSETS.WORKPLACE}px` }} className="sticky bg-slate-50 border-r-[1.5px] border-slate-200 z-[115] px-4 py-6 text-center shadow-[5px_0_15px_rgba(0,0,0,0.07)] text-slate-400 uppercase italic">***</td>
                      
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-slate-800/20 text-indigo-400/40 opacity-30">---</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-slate-800/20 text-indigo-400/40 opacity-30">---</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-slate-800/20 text-indigo-400/40 opacity-30">---</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-slate-800/20 text-indigo-400/40 opacity-30 border-r-2 border-indigo-500/20">---</td>
 
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-emerald-900/10 text-slate-500 italic">₼ {(sums?.baseSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-emerald-900/30 text-emerald-400 shadow-inner">₼ {(sums?.calculatedSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-slate-800/10 text-slate-500 font-bold opacity-60">₼ {(sums?.vacationPay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-slate-800/10 text-slate-500 font-bold opacity-60">₼ {(sums?.sickLeavePay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-slate-800/10 text-slate-500 font-bold opacity-60">₼ {(sums?.currentPeriodComp || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-slate-800/10 text-slate-500 font-bold opacity-60">₼ {(sums?.previousPeriodsComp || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-indigo-900/20 text-indigo-300">₼ {(sums?.kpi || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-indigo-900/20 text-indigo-300">₼ {(sums?.bonus || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r-2 border-slate-600 bg-emerald-900/50 font-black text-emerald-100 border-l-4 border-emerald-500/30 uppercase">₼ {(sums?.salaryGross || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-rose-900/10 text-rose-400/60 font-bold opacity-70">₼ {(sums?.incomeTax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-rose-900/10 text-rose-500/80 font-black">₼ {(sums?.socialInsuranceAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-rose-900/10 text-rose-500/80 font-black">₼ {(sums?.unemploymentInsuranceAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-rose-900/10 text-rose-500/80 font-black">₼ {(sums?.compulsoryInsuranceAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r-2 border-slate-600 bg-rose-900/40 text-rose-300 font-black border-l-4 border-rose-500/30 italic uppercase shadow-inner">₼ {(sums?.totalEmployeeDeductions || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-amber-900/10 text-amber-500/60 font-bold opacity-80 italic">₼ {(sums?.employerSocialInsurance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-amber-900/10 text-amber-500/60 font-bold opacity-80 italic">₼ {(sums?.employerUnemploymentInsurance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r border-slate-800 bg-amber-900/10 text-amber-500/60 font-bold opacity-80 italic">₼ {(sums?.employerCompulsoryInsurance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-6 text-center border-r-2 border-slate-600 bg-amber-900/40 text-amber-300 font-black border-l-4 border-amber-500/30 uppercase shadow-inner">₼ {(sums?.totalEmployerObligations || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 
                      <td className="px-6 py-6 text-center sticky right-[240px] bg-slate-800 text-slate-400 z-[85] shadow-[-5px_0_10px_rgba(0,0,0,0.5)] italic">
                         ₼ {(sums?.netAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-6 text-center sticky right-[120px] bg-emerald-900 text-emerald-300 z-[85] shadow-[-5px_0_10px_rgba(0,0,0,0.5)] italic">
                         ₼ {(sums?.paidAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-8 py-6 text-center sticky right-0 bg-white text-indigo-700 z-[85] shadow-[-20px_0_50px_rgba(0,0,0,0.6)] text-[18px] font-black border-l-4 border-indigo-500 uppercase italic">
                         ₼ {(sums?.balanceAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                   </tr>
                 </tfoot>
             </table>
          </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/5 group">
         <div className="flex items-center space-x-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-[1.5rem] shadow-inner group-hover:scale-110 transition-transform">
               <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
                <p className="text-[11px] font-black text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-amber-200 pl-5 uppercase tracking-tight">
                    Təhlükəsizlik və Hesabatlılıq Bildirişi
                </p>
                <p className="text-[9px] font-bold text-slate-400 lowercase tracking-widest pl-5 opacity-70">
                    Cədvəl rəsmi dövlət dərəcələri {selectedYear} əsasında arxivləndirilmişdir. Dəyişiklik edilə bilməz.
                </p>
            </div>
         </div>
         <div className="flex items-center justify-end space-x-4">
            <button className="group flex items-center space-x-3 px-10 py-5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all italic border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 leading-none">
               <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
               <span>Çap Et (Arxiv)</span>
            </button>
            <button 
                onClick={handleBankExport}
                className="group flex items-center space-x-3 px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 italic hover:-translate-y-1 active:scale-95 leading-none"
            >
               <Download className="w-4 h-4 group-hover:animate-bounce" />
               <span>Bank üçün Export</span>
            </button>
         </div>
      </div>

      <JournalPreviewModal 
          isOpen={isJournalVisible} 
          onClose={() => setIsJournalVisible(false)} 
          periodClosed={false} 
          isAdmin={true}
          initialLines={[
            { id: '1', accountCode: '721', accountName: 'Əmək haqqı xərcləri', description: `${selectedMonth}/${selectedYear} Ayı üzrə əmək haqqı`, debit: payrollData?.reduce((acc: any, curr: any) => acc + (curr.salaryGross || 0) + (curr.bonus || 0) + (curr.overtime || 0), 0) || 0, credit: 0 },
            { id: '2', accountCode: '533', accountName: 'İşçilərə olan borclar', description: `${selectedMonth}/${selectedYear} Ayı üzrə əmək haqqı`, debit: 0, credit: payrollData?.reduce((acc: any, curr: any) => acc + (curr.netAmount || 0), 0) || 0 },
            { id: '3', accountCode: '521.1', accountName: 'DSMF öhdəliyi', description: `${selectedMonth}/${selectedYear} Ayı üzrə tutulmalar`, debit: 0, credit: payrollData?.reduce((acc: any, curr: any) => acc + (curr.socialInsuranceAmount || 0), 0) || 0 },
            { id: '4', accountCode: '521.2', accountName: 'İTS öhdəliyi', description: `${selectedMonth}/${selectedYear} Ayı üzrə tutulmalar`, debit: 0, credit: payrollData?.reduce((acc: any, curr: any) => acc + (curr.compulsoryInsuranceAmount || 0), 0) || 0 },
            { id: '5', accountCode: '521.3', accountName: 'İşsuzlik öhdəliyi', description: `${selectedMonth}/${selectedYear} Ayı üzrə tutulmalar`, debit: 0, credit: payrollData?.reduce((acc: any, curr: any) => acc + (curr.unemploymentInsuranceAmount || 0), 0) || 0 }
          ]}
       />
    </div>
  );
};

export default PayrollTable;
