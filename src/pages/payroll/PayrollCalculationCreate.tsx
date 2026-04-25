import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { 
  Calculator, 
  Users, 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Download, 
  Loader2,
  RefreshCcw,
  ShieldCheck,
  RotateCcw,
  Lock,
  X,
  UserPlus,
  UserMinus,
  Trash2,
  FileText,
  Activity
} from 'lucide-react';
import { useLocation, useOutletContext, useNavigate } from 'react-router-dom';
import { hrApi, financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import { generatePayrollJournal } from '../../utils/payrollAccounting';

const months = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

interface PayrollCalculationCreateProps {}

const PayrollCalculationCreate: React.FC<PayrollCalculationCreateProps> = () => {
  const { activeCompany } = useCompany();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceMatrix, setAttendanceMatrix] = useState<any>(null);
  const [normativeData, setNormativeData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [sector, setSector] = useState<'PRIVATE' | 'STATE'>('PRIVATE');
  const [payrollStatus, setPayrollStatus] = useState<'DRAFT' | 'APPROVED' | 'POSTED' | 'NOT_FOUND'>('DRAFT');
  const [attendanceStatus, setAttendanceStatus] = useState<string>('DRAFT');
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  // PREMIUM LIGHT THEME STICKY CSS - V6 (STABLE)
  const tableStickyStyles = `
    .payroll-table { border-spacing: 0; border-collapse: separate !important; }
    
    /* Global Header Reset */
    .payroll-table thead th { 
      position: sticky !important; 
      top: 0 !important; 
      z-index: 80 !important; 
      background: #f8fafc !important; 
      color: #475569 !important; 
      border-bottom: 2px solid #e2e8f0 !important;
    }

    /* LEFT FREEZE ZONE - Highest Priority Z-Index (100) for Headers, (90) for Cells */
    .p-left-0 { position: sticky !important; left: 0px !important; z-index: 90 !important; background: white !important; }
    .p-left-1 { position: sticky !important; left: 48px !important; z-index: 90 !important; background: white !important; }
    .p-left-2 { position: sticky !important; left: 348px !important; z-index: 90 !important; background: white !important; }
    .p-left-3 { 
      position: sticky !important; 
      left: 588px !important; 
      z-index: 90 !important; 
      background: white !important; 
      border-right: 2px solid #f1f5f9 !important; 
      box-shadow: 10px 0 20px -5px rgba(0,0,0,0.05) !important; 
    }

    /* RIGHT FREEZE ZONE */
    .p-right-0 { 
      position: sticky !important; 
      right: 0px !important; 
      z-index: 90 !important; 
      background: #6366f1 !important; 
      color: white !important; 
      box-shadow: -15px 0 30px rgba(0,0,0,0.1) !important; 
    }

    /* Sticky Headers (Top + Left/Right intersection) */
    .payroll-table thead th.p-left-0, 
    .payroll-table thead th.p-left-1, 
    .payroll-table thead th.p-left-2, 
    .payroll-table thead th.p-left-3,
    .payroll-table thead th.p-right-0 { 
      z-index: 100 !important; 
      background: #f1f5f9 !important; 
    }

    /* HOVER SYNC */
    .payroll-table tr:hover td { background-color: #eff6ff !important; color: #1e3a8a !important; }
    .payroll-table tr:hover td span { color: inherit !important; }
    .payroll-table tr:hover td.p-right-0 { background-color: #4f46e5 !important; color: white !important; }

    /* FOOTER SYNC */
    .payroll-table tfoot td { position: sticky !important; bottom: 0 !important; z-index: 110 !important; background: #f8fafc !important; color: #1e293b !important; border-top: 2px solid #e2e8f0 !important; }
    .payroll-table tfoot td.p-left-0, .payroll-table tfoot td.p-left-1, .payroll-table tfoot td.p-left-2, .payroll-table tfoot td.p-left-3, .payroll-table tfoot td.p-right-0 { z-index: 120 !important; }
  `;
  
  // Get context from Outlet for fullscreen mode
  const { isContentFullscreen, setIsContentFullscreen } = useOutletContext<{ 
    isContentFullscreen: boolean; 
    setIsContentFullscreen: (val: boolean) => void 
  }>();

  const isFullScreen = isContentFullscreen;

  useEffect(() => {
    if (activeCompany) {
      fetchData();
    }
  }, [activeCompany, selectedMonth, selectedYear]);

  const fetchData = async () => {
    if (!activeCompany) return;
    
    try {
      // 1. Get current month payroll status and records
      const payrollData = await hrApi.getPayrollMatrix(selectedMonth, selectedYear, activeCompany.id);
      setPayrollStatus(payrollData.status || 'DRAFT');
      
      // 2. Get normative data (working hours/days)
      const norm = await hrApi.getMonthStatus(selectedMonth, selectedYear, activeCompany.id);
      setNormativeData(norm);

      // 3. Get attendance matrix
      const attendance = await hrApi.getAttendanceMatrix(selectedMonth, selectedYear, activeCompany.id);
      const attendanceMap = (attendance || []).reduce((acc: any, curr: any) => {
        acc[curr.employeeId] = curr;
        return acc;
      }, {});
      setAttendanceMatrix(attendanceMap);

      // 4. Get attendance approval status
      const attStatus = await hrApi.getAttendanceStatus(selectedMonth, selectedYear, activeCompany.id);
      setAttendanceStatus(attStatus.status || 'DRAFT');

      // 5. Get Bonus (Premium) data for the period
      let bonusMap: any = {};
      try {
        const bonusData = await hrApi.getBonuses(selectedMonth, selectedYear, activeCompany.id);
        if (Array.isArray(bonusData)) {
            bonusMap = bonusData.reduce((acc: any, curr: any) => {
                acc[curr.fin] = curr.bonus;
                return acc;
            }, {});
        }
      } catch (e) { console.error('Bonus fetch error:', e); }

      // 6. Set employees from existing payroll if found, else fetch all active for the period
      const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth, 0);

      if (payrollData.status !== 'NOT_FOUND' && payrollData.details?.length > 0) {
        setEmployees(payrollData.details.map((d: any) => ({
          ...d.employee,
          ...d, // Flatten payroll detail fields
          bonus: d.bonus || bonusMap[d.employee?.fin] || 0
        })));
      } else {
        const empList = await hrApi.getEmployees(activeCompany.id);
        const filtered = empList.filter((e: any) => {
            const hireDate = new Date(e.startDate || e.createdAt);
            const termDate = e.deletedAt ? new Date(e.deletedAt) : null;
            
            // Started by end of month
            const startedMatch = hireDate <= endOfMonth;
            // AND not terminated before start of month
            const termMatch = !termDate || termDate >= startOfMonth;
            
            return startedMatch && termMatch;
        }).map((e: any) => ({
            ...e,
            bonus: bonusMap[e.fin] || 0
        }));
        setEmployees(filtered);
      }
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    }
  };

  const handleGenerate = async () => {
    if (!activeCompany) return;
    setIsGenerating(true);
    try {
      await hrApi.generatePayroll(selectedMonth, selectedYear, activeCompany.id, { employees: [] });
      await fetchData();
      setSaveStatus({ type: 'success', message: 'Siyahı müvəffəqiyyətlə formalaşdırıldı.' });
    } catch (error: any) {
      setSaveStatus({ type: 'error', message: error.message || 'Xəta baş verdi' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = async () => {
    if (!activeCompany) return;
    if (!window.confirm("Bu dövr üçün bütün hesablamaları təmizləməyə əminsiniz?")) return;
    
    setIsSaving(true);
    try {
        await hrApi.resetPayroll(selectedMonth, selectedYear, activeCompany.id);
        await fetchData();
        setSaveStatus({ type: 'success', message: 'Siyahı təmizləndi.' });
    } catch (error: any) {
        setSaveStatus({ type: 'error', message: error.message || 'Xəta baş verdi' });
    } finally {
        setIsSaving(false);
    }
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    // Real calculation triggered locally on loaded data
    setTimeout(() => {
        setEmployees(prev => prev.map(emp => {
          const attendance = attendanceMatrix ? attendanceMatrix[emp.id] : null;
          // Look up active salary
          let sGross = emp.salaryGross || emp.salary || 0;
          if (emp.contracts) {
                const pEnd = new Date(selectedYear, selectedMonth, 0);
                const activeC = emp.contracts.find((c: any) => new Date(c.startDate) <= pEnd && (!c.endDate || new Date(c.endDate) >= pEnd));
                if (activeC) sGross = activeC.salaryGross;
          }
          const calc = calculatePayroll(emp, normativeData, attendance, sGross);
          return { ...emp, ...calc };
        }));
        setIsCalculating(false);
        setSaveStatus({ type: 'success', message: 'Hesablama tamamlandı. İndi yadda saxlaya bilərsiniz.' });
    }, 800);
  };

  const handleSave = async () => {
    if (!activeCompany) return;
    setIsSaving(true);
    try {
      await hrApi.generatePayroll(selectedMonth, selectedYear, activeCompany.id, { 
        employees: calculatedData.map(c => ({
            id: c.id,
            gross: c.gross,
            net: c.net,
            tax: c.incomeTax,
            dsmfEmployee: c.dsmfEmployee,
            unemploymentEmployee: c.unemploymentEmployee,
            itsEmployee: c.itsEmployee,
            dsmfEmployer: c.dsmfEmployer,
            unemploymentEmployer: c.unemploymentEmployer,
            itsEmployer: c.itsEmployer,
            salary: c.baseSalary,
            kpi: c.kpi,
            bonus: c.bonus,
            daysWorked: c.actualDays,
            hoursWorked: c.actualHours,
            normDays: normativeData?.days || 22,
            normHours: normativeData?.hours || 176
        }))
      });
      setSaveStatus({ type: 'success', message: 'Məlumatlar yadda saxlanıldı.' });
    } catch (error: any) {
      setSaveStatus({ type: 'error', message: error.message || 'Xəta baş verdi' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveRange = async (newStatus: 'APPROVED' | 'POSTED' | 'DRAFT') => {
    if (!activeCompany) return;
    setIsProcessingApproval(true);
    try {
        // 1. Update Core Status First
        await hrApi.approvePayroll(selectedMonth, selectedYear, activeCompany.id, newStatus);
        
        // 2. Archive Sync (Archive) - Now runs for BOTH APPROVED and POSTED to ensure visibility in tables
        if (newStatus === 'APPROVED' || newStatus === 'POSTED') {
            try {
                const matrixPayload = {
                    month: Number(selectedMonth),
                    year: Number(selectedYear),
                    details: calculatedData.map(c => ({
                        employeeId: c.id,
                        fullName: c.fullName || c.employee?.fullName,
                        fin: c.fin || c.employee?.fin,
                        baseSalary: c.baseSalary,
                        calculatedSalary: c.calculatedSalary,
                        vacationPay: c.vacationPay || 0,
                        sickLeavePay: c.sickLeavePay || 0,
                        currentYearComp: c.currentYearComp || 0,
                        prevYearsComp: c.prevYearsComp || 0,
                        kpi: c.kpi || 0,
                        bonus: c.bonus || 0,
                        salaryGross: c.gross,
                        incomeTax: c.incomeTax,
                        socialInsuranceAmount: c.dsmfEmployee,
                        unemploymentInsuranceAmount: c.unemploymentEmployee,
                        compulsoryInsuranceAmount: c.itsEmployee,
                        employerSocialInsurance: c.dsmfEmployer,
                        employerUnemploymentInsurance: c.unemploymentEmployer,
                        employerCompulsoryInsurance: c.itsEmployer,
                        totalEmployeeDeductions: c.totalEmployeeDeductions,
                        totalEmployerCost: c.totalEmployerCost,
                        netAmount: c.net,
                        paidAmount: 0, 
                        normDays: normativeData?.days || 22,
                        actualDays: c.actualDays || 0,
                        normHours: normativeData?.hours || 176,
                        actualHours: c.actualHours || 0,
                        totalEmployerCostFinal: (c.net || 0) + (c.totalEmployeeDeductions || 0) + (c.totalEmployerCost || 0) 
                    }))
                };

                await hrApi.savePayrollMatrix(Number(selectedMonth), Number(selectedYear), activeCompany.id, matrixPayload);
                console.log('MATRIX_SYNC_SUCCESS: Data archived officially for status:', newStatus);
            } catch (matrixError: any) {
                console.error('MATRIX_SYNC_FATAL_ERROR:', matrixError.message);
            }
        }

        // 3. If POSTED, run accounting sync
        if (newStatus === 'POSTED') {
            try {
                const journalData = generatePayrollJournal(
                    calculatedData, 
                    selectedMonth, 
                    selectedYear, 
                    activeCompany.name
                );
                await financeApi.createTransaction(journalData, activeCompany.id);
            } catch (accError: any) {
                console.warn('ACCOUNTING_SYNC_FAILED (404/500):', accError.message);
            }
        }

        setPayrollStatus(newStatus);
        setSaveStatus({ type: 'success', message: newStatus === 'POSTED' ? 'Maaş təsdiqləndi və arxivə köçürüldü.' : `Status deyişdirildi: ${newStatus}` });
    } catch (error: any) {
        setSaveStatus({ type: 'error', message: error.message || 'Xəta baş verdi' });
    } finally {
        setIsProcessingApproval(false);
    }
  };

  const handleFetchJournal = async () => {
    if (!activeCompany) return;
    setIsJournalLoading(true);
    setIsJournalModalOpen(true);
    setJournalEntries([]); // Reset
    try {
        const journals = await financeApi.getTransactions({ 
            docType: 'PAYROLL', 
            month: selectedMonth, 
            year: selectedYear 
        }, activeCompany.id);
        
        const data = Array.isArray(journals) ? journals : (journals.data || []);
        if (data && data.length > 0) {
            setJournalEntries(data);
        } else {
            throw new Error('No data');
        }
    } catch (error: any) {
        console.log('Backend journal empty, showing local preview...');
        if (calculatedData && calculatedData.length > 0) {
            const localEntry = generatePayrollJournal(
                calculatedData, 
                selectedMonth, 
                selectedYear, 
                activeCompany.name
            );
            setJournalEntries([localEntry]);
        }
    } finally {
        setIsJournalLoading(false);
    }
  };

  const calculatePayroll = (emp: any, norm: any, attend: any, periodSalary?: number) => {
    const baseSalary = periodSalary !== undefined ? periodSalary : Number(emp.salaryGross || emp.salary || 0);
    const normHours = Number(attend?.monthlyNorm || norm?.hours || 176);
    const normDays = Number(attend?.monthlyNormDays || norm?.days || 22);
    const actualHours = Number(attend?.totalHours || 0);
    const actualDays = Number(attend?.presentDays || 0);
    
    // Proportional basic calculation based on shift-specific norm hours
    const calculatedSalary = normHours > 0 ? (baseSalary / normHours) * actualHours : 0;
    
    // KPI and Bonus
    const kpi = Number(emp.kpi || 0);
    const bonus = Number(emp.bonus || 0);
    const gross = calculatedSalary + kpi + bonus;

    let incomeTax = 0;
    let dsmfEmployee = 0;
    let unemploymentEmployee = 0;
    let itsEmployee = 0;

    if (sector === 'PRIVATE') {
        // NON-OIL/GAS PRIVATE SECTOR BENEFITS (2024-2026)
        // Income Tax: 0% up to 8000 AZN, 14% above
        incomeTax = gross > 8000 ? (gross - 8000) * 0.14 : 0;
        
        // DSMF Employee: 3% of 200 + 10% of excess
        if (gross <= 200) {
            dsmfEmployee = gross * 0.03;
        } else {
            dsmfEmployee = 6 + (gross - 200) * 0.1;
        }
    } else {
        // STATE SECTOR / OIL-GAS
        // Income Tax: (Gross - 200) * 14%
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
        // 200 * 22% + (Gross - 200) * 15%
        if (gross <= 200) {
            dsmfEmployer = gross * 0.22;
        } else {
            dsmfEmployer = 44 + (gross - 200) * 0.15;
        }
    } else {
        dsmfEmployer = gross * 0.22;
    }

    const unemploymentEmployer = gross * 0.005;
    const itsEmployer = gross * 0.02;
    const totalEmployerCost = dsmfEmployer + unemploymentEmployer + itsEmployer;

    // HIRED/TERMINATED Indicators
    const hDate = new Date(emp.startDate || emp.createdAt);
    const tDate = emp.deletedAt ? new Date(emp.deletedAt) : null;
    const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth, 0);

    const isMidMonthHire = hDate > startOfMonth && hDate <= endOfMonth;
    const isTerminatedThisMonth = tDate && tDate >= startOfMonth && tDate <= endOfMonth;

    const round = (val: number) => Math.round((val + Number.EPSILON) * 100) / 100;

    return {
        id: emp.id,
        fullName: emp.fullName || emp.employee?.fullName,
        code: emp.code || emp.employee?.code,
        fin: emp.fin || emp.employee?.fin,
        department: emp.department || emp.dept || emp.employee?.department || emp.employee?.dept || { name: 'Ümumi Şöbə' },
        jobPosition: emp.jobPosition || emp.position || emp.employee?.jobPosition || emp.employee?.position || { name: 'İşçi' },
        workplaceType: emp.workplaceType || emp.employee?.workplaceType,
        isMidMonthHire,
        isTerminatedThisMonth,
        hDate,
        tDate,
        baseSalary: round(baseSalary),
        calculatedSalary: round(calculatedSalary),
        kpi: round(kpi),
        bonus: round(bonus),
        gross: round(gross),
        net: round(net),
        incomeTax: round(incomeTax),
        dsmfEmployee: round(dsmfEmployee),
        unemploymentEmployee: round(unemploymentEmployee),
        itsEmployee: round(itsEmployee),
        dsmfEmployer: round(dsmfEmployer),
        unemploymentEmployer: round(unemploymentEmployer),
        itsEmployer: round(itsEmployer),
        totalEmployeeDeductions: round(totalEmployeeDeductions),
        totalEmployerCost: round(totalEmployerCost),
        actualHours,
        actualDays,
        normHours,
        normDays
    };
  };

  const calculatedData = useMemo(() => {
    if (!employees) return [];
    return employees.map(emp => {
      // Find specific data in existing payroll if loaded OR already calculated in local state
      const hasCalculatedData = emp.net !== undefined || emp.netAmount !== undefined;
      
      if (hasCalculatedData) {
          const rawGross = emp.gross ?? emp.salaryGross ?? 0;
          return {
              ...emp,
              fullName: emp.fullName || emp.employee?.fullName,
              code: emp.code || emp.employee?.code,
              fin: emp.fin || emp.employee?.fin,
              department: emp.department || emp.dept || emp.employee?.department || emp.employee?.dept,
              jobPosition: emp.jobPosition || emp.position || emp.employee?.jobPosition || emp.employee?.position,
              workplaceType: emp.workplaceType || emp.employee?.workplaceType,
              baseSalary: emp.baseSalary || emp.salaryGross || emp.salary || 0,
              kpi: emp.kpi || emp.employee?.kpi || 0,
              bonus: emp.bonus || emp.employee?.bonus || 0,
              gross: rawGross,
              net: emp.net ?? emp.netAmount,
              incomeTax: emp.incomeTax,
              dsmfEmployee: emp.dsmfEmployee ?? emp.socialInsuranceAmount,
              unemploymentEmployee: emp.unemploymentEmployee ?? emp.unemploymentInsuranceAmount,
              itsEmployee: emp.itsEmployee ?? emp.compulsoryInsuranceAmount,
              totalEmployeeDeductions: emp.totalEmployeeDeductions ?? ((emp.incomeTax || 0) + (emp.socialInsuranceAmount || 0) + (emp.unemploymentInsuranceAmount || 0) + (emp.compulsoryInsuranceAmount || 0)),
              dsmfEmployer: emp.dsmfEmployer ?? emp.employerSocialInsurance,
              unemploymentEmployer: emp.unemploymentEmployer ?? emp.employerUnemploymentInsurance,
              itsEmployer: emp.itsEmployer ?? emp.employerCompulsoryInsurance,
              totalEmployerCost: emp.totalEmployerCost ?? ((emp.employerSocialInsurance || 0) + (emp.employerUnemploymentInsurance || 0) + (emp.employerCompulsoryInsurance || 0)),
              superGross: emp.superGross ?? (rawGross + (emp.employerSocialInsurance || 0) + (emp.employerUnemploymentInsurance || 0) + (emp.employerCompulsoryInsurance || 0))
          };
      }
      
      const attendance = attendanceMatrix ? attendanceMatrix[emp.id] : null;

      // Historical Salary Logic: Find contract active in selected period
      const periodStart = new Date(selectedYear, selectedMonth - 1, 1);
      const periodEnd = new Date(selectedYear, selectedMonth, 0);
      
      let periodSalary = emp.salaryGross || emp.salary || 0;
      if (emp.contracts && emp.contracts.length > 0) {
          // Find the contract that covers the selected period
          const activeContract = emp.contracts.find((c: any) => {
              const contractStart = new Date(c.startDate);
              const contractEnd = c.endDate ? new Date(c.endDate) : null;
              
              const isStartedBeforeOrDuring = contractStart <= periodEnd;
              const isNotEndedOrEndedAfterStart = !contractEnd || contractEnd >= periodStart;
              
              return isStartedBeforeOrDuring && isNotEndedOrEndedAfterStart;
          });
          
          if (activeContract) {
              periodSalary = activeContract.salaryGross;
          }
      }

      if (normativeData) {
          return calculatePayroll(emp, normativeData, attendance, periodSalary);
      }
      
    // Default empty state for row
    return { 
        ...emp, 
        fullName: emp?.fullName || emp?.employee?.fullName || 'İsimsiz İşçi',
        code: emp?.code || emp?.employee?.code || '---',
        fin: emp?.fin || emp?.employee?.fin || '---',
        department: emp?.department || emp?.dept || emp?.employee?.department || emp?.employee?.dept || { name: 'Ümumi Şöbə' },
        jobPosition: emp?.jobPosition || emp?.position || emp?.employee?.jobPosition || emp?.employee?.position || { name: 'İşçi' },
        workplaceType: emp?.workplaceType || emp?.employee?.workplaceType || 'ƏSAS',
        baseSalary: emp?.salaryGross || emp?.salary || 0,
        gross: 0, 
        net: 0,
        incomeTax: 0,
        dsmfEmployee: 0,
        unemploymentEmployee: 0,
        itsEmployee: 0,
        totalEmployeeDeductions: 0,
        dsmfEmployer: 0,
        unemploymentEmployer: 0,
        itsEmployer: 0,
        totalEmployerCost: 0,
        superGross: 0
    };
    });
  }, [employees, attendanceMatrix, sector, selectedYear, normativeData]);

  const totalNet = calculatedData.reduce((sum, item) => sum + (item.net || 0), 0);
  const totalDeductions = calculatedData.reduce((sum, item) => sum + (Number(item.totalEmployeeDeductions) || 0), 0);
  const totalEmployerObligations = calculatedData.reduce((sum, item) => sum + (Number(item.totalEmployerCost) || 0), 0);
  const totalEmployerCostFinal = totalNet + totalDeductions + totalEmployerObligations;

  useEffect(() => {
    console.log('PAYROLL_DEBUG: Render State', {
        selectedMonth, selectedYear, payrollStatus, 
        employeesCount: employees?.length,
        hasAttendance: !!attendanceMatrix,
        activeCompanyId: activeCompany?.id,
        isFullScreen
    });
  }, [selectedMonth, selectedYear, payrollStatus, employees, attendanceMatrix, activeCompany, isFullScreen]);

  if (!activeCompany) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
      <div className="flex flex-col space-y-6 animate-in fade-in duration-700 pb-24 text-slate-800 dark:text-slate-100 font-sans max-w-[100vw] overflow-hidden">
        <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic flex items-center gap-3">
                <span className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none"><Calculator className="w-8 h-8" /></span>
                Əmək haqqı <span className="text-indigo-600 font-light not-italic">Hesablanması</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 translate-x-14">Payroll Management & Compliance System</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Cari Dövr</span>
                <div className="text-xl font-black text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-1 uppercase italic tracking-tight">
                    <span className="text-indigo-600">{months[selectedMonth-1]}</span> {selectedYear}
                </div>
              </div>
              {(payrollStatus === 'APPROVED' || payrollStatus === 'POSTED') && (
                <div className={`px-6 py-3 rounded-2xl flex items-center gap-2 border-2 ${
                  payrollStatus === 'POSTED' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 text-emerald-600' : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 text-indigo-600'
                }`}>
                  {payrollStatus === 'POSTED' ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  <span className="text-[11px] font-black uppercase tracking-widest">{payrollStatus === 'POSTED' ? 'KİLİDLİ' : 'TƏSDİQLƏNİB'}</span>
                </div>
              )}
            </div>
        </div>

        {attendanceStatus !== 'APPROVED' && payrollStatus === 'DRAFT' && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-700 font-bold text-[11px] uppercase tracking-wider animate-in fade-in duration-500 mb-6">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>Diqqət: Bu ay üçün tabel mərkəzində davamiyyət hələ təsdiqlənməyib. Hesablamalar tam dəqiq olmaya bilər.</span>
            </div>
        )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-10 py-6 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-indigo-50/20 to-transparent pointer-events-none" />
          
          <div className="flex flex-wrap items-center gap-4 z-10 w-full">
               <div className="flex items-center gap-2 mr-auto">
                  <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-white p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm focus:border-indigo-400 outline-none transition-all">
                      {[2026, 2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="bg-white p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm focus:border-indigo-400 outline-none transition-all">
                     {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                  </select>
               </div>

               <div className="flex flex-wrap gap-4">
                  {/* BTN GROUP 1: GENERATE & CALCULATE (DRAFT) */}
                  {(payrollStatus === 'DRAFT') && (
                    <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-[1.5rem] shadow-inner">
                      <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center px-6 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm italic leading-none border border-slate-200"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />} Formalaşdır
                      </button>

                      {employees.length > 0 && (
                        <button 
                            onClick={handleReset}
                            disabled={isSaving}
                            className="flex items-center px-4 py-4 bg-white text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all shadow-sm italic leading-none border border-rose-100"
                            title="Siyahını Təmizlə"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button 
                        onClick={handleCalculate}
                        disabled={isCalculating || employees.length === 0}
                        className="flex items-center px-6 py-4 bg-white text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm italic leading-none border border-emerald-100"
                      >
                        {isCalculating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calculator className="w-4 h-4 mr-2" />} Hesabla
                      </button>
                    </div>
                  )}

                  {/* BTN GROUP 2: SAVE & APPROVE (DRAFT) */}
                  {(payrollStatus === 'DRAFT' || payrollStatus === 'NOT_FOUND') && employees.length > 0 && (
                    <div className="flex items-center gap-2 p-1 bg-indigo-50/50 rounded-[1.5rem] shadow-inner">
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 italic leading-none"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Yadda Saxla
                      </button>
                      <button 
                        onClick={() => handleApproveRange('APPROVED')}
                        disabled={isProcessingApproval}
                        className="flex items-center bg-white border-2 border-indigo-100 text-indigo-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-sm italic leading-none"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Təsdiqlə
                      </button>
                    </div>
                  )}

                  {/* BTN GROUP 3: ROLLBACK APPROVAL / POST (APPROVED) */}
                  {payrollStatus === 'APPROVED' && (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleApproveRange('DRAFT')}
                        disabled={isProcessingApproval}
                        className="flex items-center px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic leading-none bg-white border border-rose-200 text-rose-500 hover:bg-rose-50"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" /> Təsdiqi ləğv et
                      </button>
                      <button 
                        onClick={() => handleApproveRange('POSTED')}
                        disabled={isProcessingApproval}
                        className="flex items-center px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl italic leading-none bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <ShieldCheck className="w-4 h-4 mr-3 text-emerald-400" /> Müxabirləşmə ver & Kilidlə
                      </button>
                    </div>
                  )}

                  {/* BTN GROUP 4: UNLOCK (POSTED) */}
                  {payrollStatus === 'POSTED' && (
                      <div className="flex items-center gap-3">
                        <button 
                            onClick={handleFetchJournal}
                            className="flex items-center px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl italic leading-none bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            <FileText className="w-4 h-4 mr-3" /> Müxabirləşmələrə bax
                        </button>
                        <button 
                            onClick={() => handleApproveRange('APPROVED')}
                            disabled={isProcessingApproval}
                            className="flex items-center px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl italic leading-none bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                        >
                            <Lock className="w-4 h-4 mr-3" /> Kilidi aç (Unlock)
                        </button>
                      </div>
                  )}
               </div>
          </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* NEW PREMIUM TOTALS DASHBOARD (SCREEN 3) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-2">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg group">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-3">Cəmi Xalis Ödəniş</span>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><Calculator className="w-6 h-6" /></div>
                        <span className="text-3xl font-black text-slate-800 dark:text-white tabular-nums italic">₼ {totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg group">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-3">Cəmi Tutulmalar</span>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform"><ShieldCheck className="w-6 h-6" /></div>
                        <span className="text-3xl font-black text-slate-800 dark:text-white tabular-nums italic">₼ {totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg group">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-3">İşəgötürən Xərci (Cəmi)</span>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><Activity className="w-6 h-6" /></div>
                        <span className="text-3xl font-black text-slate-800 dark:text-white tabular-nums italic">₼ {totalEmployerCostFinal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg group">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-3">İşçi Sayı</span>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-2xl group-hover:scale-110 transition-transform"><Users className="w-6 h-6" /></div>
                        <span className="text-3xl font-black text-slate-800 dark:text-white tabular-nums italic">{(employees?.length || 0)} <span className="text-xs font-bold text-slate-400 uppercase tracking-widest not-italic">Nəfər</span></span>
                    </div>
                </div>
            </div>
        </div>

         <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm items-center">
            <button onClick={() => setSector('PRIVATE')} className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all ${sector === 'PRIVATE' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
               <Users className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase italic">Özəl Sektor</span>
            </button>
            <button onClick={() => setSector('STATE')} className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all ${sector === 'STATE' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
               <Building2 className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase italic">Dövlət</span>
            </button>
         </div>
      </div>

      <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col transition-all duration-500 ease-in-out ${isFullScreen ? 'fixed inset-0 z-[9999] m-0 rounded-none w-full h-full' : ''}`}>
         <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30">
            <div className="flex items-center gap-4">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300 italic">
                    Maaş Siyahısı <span className="text-slate-400 font-light">—</span> {selectedYear} {months[selectedMonth-1]} ({employees?.length || 0} işçi)
                </h3>
            </div>
            {isFullScreen ? (
                <button 
                    onClick={() => setIsContentFullscreen(false)} 
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm"
                >
                    <X className="w-4 h-4" /> Tam ekrandan çıx
                </button>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mr-2">Cədvəl Paneli</span>
                    <div className="w-8 h-[2px] bg-slate-100 dark:bg-slate-800" />
                </div>
            )}
         </div>
         <div className="overflow-x-auto flex-1 custom-scrollbar" style={{ borderRadius: '0 0 2.5rem 2.5rem' }}>
             <style>{tableStickyStyles}</style>
             <table ref={tableRef} className="w-full text-left border-collapse min-w-[3200px] table-auto payroll-table">
                <thead className="sticky top-0 z-[110]">
                   <tr className="bg-slate-50 dark:bg-slate-900 shadow-sm h-12">
                      <th colSpan={4} style={{ width: '708px' }} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center p-left-0 border-r border-slate-700">İşçi Məlumatları</th>
                      <th colSpan={4} className="px-6 py-4 bg-slate-700/50 text-[10px] font-black text-slate-300 uppercase text-center border-r border-slate-700 italic border-l border-slate-700">Norma vs Faktiki</th>
                      <th colSpan={8} className="px-6 py-4 bg-emerald-900/40 text-[10px] font-black text-emerald-300 uppercase text-center border-r border-slate-700 italic border-l border-slate-700">Hesablanıb (Hesablanmış Maaş)</th>
                      <th colSpan={5} className="px-6 py-4 bg-rose-900/40 text-[10px] font-black text-rose-300 uppercase text-center border-r border-slate-700 italic border-l border-slate-700 font-serif">Tutulmuşdur (İşçi tərəfindən)</th>
                      <th colSpan={3} className="px-6 py-4 bg-emerald-900/20 text-[10px] font-black text-emerald-400/80 uppercase text-center border-r border-slate-700 italic border-l border-slate-700 font-serif">İşəgötürən tərəfindən</th>
                      <th style={{ width: '160px' }} className="px-6 py-4 p-right-0 text-[11px] font-bold text-white uppercase text-center italic">Ödənilməli Məbləğ (NET)</th>
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
                      
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Məzuniy.</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Xəstəlik</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Komp.Cari</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Komp.Köhnə</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30 font-black">KPİ</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30 font-black">Mükafat</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30 font-black text-emerald-300 uppercase italic">Hesab. Maaş</th>
                      <th className="px-4 py-3 text-center border-r-2 border-slate-600 bg-emerald-900/20 font-black text-white italic">CƏMİ (Gross)</th>
                      
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Gəlir v.</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30 text-rose-300 uppercase">Pensiya</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">İ.Ş.H. (0.5%)</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">İ.T.S.H. (2%)</th>
                      <th className="px-4 py-3 text-center border-r-2 border-slate-600 bg-rose-900/20 font-black text-rose-200 uppercase tracking-tighter italic">Cəmi Tutulma</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">Pensiya F.</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600/30">İ.Ş.H. (0.5%)</th>
                      <th className="px-4 py-3 text-center border-r border-slate-600 bg-emerald-900/10 text-emerald-300 font-bold uppercase italic border-l border-slate-600">İ.T.S.H. (2%)</th>
  
                      <th style={{ width: '160px' }} className="px-6 py-3 text-center p-right-0 font-black text-[10px] leading-none text-white italic border-l border-indigo-500 uppercase tracking-tight">Ödənilməli <br/> Məbləğ (NET)</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                   {calculatedData.length > 0 ? (
                      calculatedData.map((calc, idx) => (
                        <tr key={calc.id || idx} className="hover:bg-blue-50/50 transition-all text-[11px] tabular-nums group h-14 border-b border-slate-50 dark:border-slate-800">
                           <td style={{ width: '48px' }} className="px-4 py-3 text-center font-bold text-slate-400 p-left-0 shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)] translate-z-0">{idx + 1}</td>
                           <td style={{ width: '300px' }} className="px-6 py-3 p-left-1 shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)] translate-z-0">
                              <div className="flex flex-col">
                                 <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-slate-800 dark:text-white uppercase italic tracking-tight leading-none truncate max-w-[280px]">{calc.fullName}</span>
                                    {calc.isMidMonthHire && <span className="text-[8px] bg-emerald-100/50 text-emerald-600 px-1 rounded font-black mt-0.5">YENİ</span>}
                                 </div>
                                 <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded leading-none">{calc.code || '---'}</span>
                                    <div className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">{calc.fin || '---'}</span>
                                 </div>
                              </div>
                           </td>
                           <td style={{ width: '240px' }} className="px-6 py-3 p-left-2 shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)] translate-z-0">
                              <div className="flex flex-col leading-tight">
                                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase truncate max-w-[200px]">{calc.department?.name || calc.department || 'ÜMUMİ ŞÖBƏ'}</span>
                                 <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tight mt-1">{calc.position || 'İşçi'}</span>
                              </div>
                           </td>
                           <td style={{ width: '120px' }} className="px-4 py-3 text-center border-r-[1.5px] border-slate-100 dark:border-slate-800 p-left-3 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.1)]">
                              <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-tighter ${calc.workplaceType === 'ƏLAVƏ' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                                 {calc.workplaceType || 'ƏSAS'}
                              </span>
                           </td>

                           <td className="px-4 py-3 text-center text-indigo-400 border-l border-slate-50">{(calc.normHours || 0).toFixed(2)}</td>
                           <td className="px-4 py-3 text-center text-indigo-600 font-bold">{(calc.actualHours || 0).toFixed(2)}</td>
                           <td className="px-4 py-3 text-center text-indigo-400">{(calc.normDays || 0)}</td>
                           <td className="px-4 py-3 text-center border-r-2 border-slate-100 dark:border-slate-800 text-indigo-600 font-bold">{(calc.actualDays || 0)}</td>

                           <td className="px-4 py-3 text-center text-slate-400 italic">₼ {(calc.vacationPay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center text-slate-400 italic">₼ {(calc.sickLeavePay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center text-slate-400 italic">₼ {(calc.currentYearComp || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center text-slate-400 italic">₼ {(calc.prevYearsComp || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center font-bold text-indigo-400/80">₼ {(calc.kpi || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center font-bold text-indigo-600/70">₼ {(calc.bonus || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center font-black text-emerald-600 bg-emerald-50/20 italic">₼ {(calc.calculatedSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center border-r-2 border-slate-100 dark:border-slate-800 bg-emerald-900/5 font-black text-slate-800 dark:text-white border-l border-emerald-100 uppercase italic">₼ {(calc.gross || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           
                           <td className="px-4 py-3 text-center text-rose-400 font-medium">₼ {(calc.incomeTax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center text-rose-600 font-black italic bg-rose-50/20">₼ {(calc.dsmfEmployee || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center text-rose-500 font-bold italic">₼ {(calc.unemploymentEmployee || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center text-rose-500 font-bold italic">₼ {(calc.itsEmployee || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center border-r-2 border-rose-100 bg-rose-50/30 font-black text-rose-600 italic uppercase">₼ {(calc.totalEmployeeDeductions || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>

                           <td className="px-4 py-3 text-center text-slate-400 italic">₼ {(calc.dsmfEmployer || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center text-slate-400 italic">₼ {(calc.unemploymentEmployer || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className="px-4 py-3 text-center border-r border-slate-100 text-slate-400 italic border-l border-emerald-50/30">₼ {(calc.itsEmployer || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           
                           <td style={{ width: '160px' }} className="px-8 py-5 text-center sticky right-0 bg-indigo-600 text-white z-40 font-black text-[13px] shadow-[-15px_0_30px_rgba(0,0,0,0.2)] backdrop-blur-xl border-l-[1.5px] border-indigo-700 italic tracking-tight uppercase translate-z-0">
                             ₼ {(calc.net || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                   ) : (
                      <tr>
                         <td colSpan={30} className="px-6 py-24 text-center">
                            <div className="flex flex-col items-center gap-4 opacity-40">
                               <Users className="w-16 h-16 text-slate-300" />
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Bu dövr üçün maaş siyahısı hələ formalaşdırılmayıb.</span>
                            </div>
                         </td>
                      </tr>
                   )}
                </tbody>
                <tfoot className="sticky bottom-0 z-[110] bg-slate-50 text-slate-900 font-black text-[10px] italic border-t-2 border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                   <tr className="tabular-nums">
                      <td style={{ width: '48px' }} className="p-left-0 bg-slate-50 border-r border-slate-200 z-[115] px-4 py-5 text-center text-amber-600 font-black scale-110 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Σ</td>
                      <td style={{ width: '300px' }} className="p-left-1 bg-slate-50 border-r border-slate-200 z-[115] px-6 py-5 uppercase tracking-widest text-slate-500 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">YEKUN CƏMLƏR:</td>
                      <td style={{ width: '240px' }} className="p-left-2 bg-slate-50 border-r border-slate-200 z-[115] px-6 py-5 text-slate-400 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">---</td>
                      <td style={{ width: '120px' }} className="p-left-3 bg-slate-50 border-r-[1.5px] border-slate-200 z-[115] px-4 py-5 text-center shadow-[5px_0_15px_rgba(0,0,0,0.07)] text-slate-400 italic">---</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-emerald-50/10 text-slate-600 italic">---</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-emerald-50/10 text-slate-600 italic">---</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-emerald-50/10 text-slate-600 italic">---</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-emerald-50/10 text-slate-600 italic">---</td>
 
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-slate-50/10 text-slate-400 italic">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.vacationPay) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-slate-50/10 text-slate-400 italic">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.sickLeavePay) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-slate-50/10 text-slate-400 italic">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.currentYearComp) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-slate-50/10 text-slate-400 italic">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.prevYearsComp) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-indigo-50/20 text-indigo-600 italic font-bold">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.kpi) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-indigo-50/20 text-indigo-600 italic font-bold">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.bonus) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-emerald-50/40 text-emerald-700 font-extrabold italic">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.calculatedSalary) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-emerald-100/30 font-black text-slate-800 border-l border-slate-200">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.gross) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-rose-50/10 text-rose-500 font-bold opacity-70">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.incomeTax) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-rose-50/10 text-rose-600 font-black">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.dsmfEmployee) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-rose-50/10 text-rose-500 font-bold italic">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.unemploymentEmployee) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-rose-50/10 text-rose-500 font-bold italic">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.itsEmployee) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r-2 border-slate-200 bg-rose-100/30 text-rose-700 font-black border-l-4 border-rose-500/10">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.totalEmployeeDeductions) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-amber-50/10 text-amber-600 font-bold opacity-80 italic">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.dsmfEmployer) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-amber-50/10 text-amber-600 font-bold opacity-80 italic">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.unemploymentEmployer) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-5 text-center border-r border-slate-200 bg-amber-50/10 text-amber-600 font-bold opacity-80 italic border-l border-emerald-50/10">₼ {((calculatedData || []).reduce((s,i)=>s+(Number(i?.itsEmployer) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      
                      <td style={{ width: '160px' }} className="px-8 py-5 text-center p-right-0 bg-white text-indigo-700 z-[115] shadow-[-10px_0_25px_rgba(0,0,0,0.1)] font-black italic text-[14px]">
                         ₼ {(totalNet || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                  </tr>
                </tfoot>
             </table>
         </div>
      </div>

      {saveStatus && (
          <div className={`p-4 rounded-2xl flex items-center justify-between font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-top-2 italic ${saveStatus.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'}`}>
             <div className="flex items-center space-x-3">
                <AlertCircle className="w-4 h-4" />
                <span>{saveStatus.message}</span>
             </div>
             <button onClick={() => setSaveStatus(null)} className="hover:opacity-60">X</button>
          </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
         <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
               <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
               Hesablamalar {selectedYear === 2026 ? "2026-cı il" : "2019-2025-ci illər"} <b>Azərbaycan Respublikasının Vergi Məcəlləsinin</b> rəsmi 
               {selectedYear >= 2019 && selectedYear <= 2025 && " 0% (güzəştli)"} daxilolma mexanizminə əsasən aparılmışdır.
            </p>
         </div>
         <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all italic">
               <Printer className="w-4 h-4" />
               <span>Çap et (PDF)</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 shadow-xl italic">
               <Download className="w-4 h-4" />
               <span>Excelə Export</span>
            </button>
         </div>
      </div>

      {/* JOURNAL ENTRIES MODAL */}
      {isJournalModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsJournalModalOpen(false)} />
              <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col z-10 border border-white relative">
                  <div className="flex items-center justify-between p-10 bg-slate-900 text-white border-b border-white/5">
                      <div className="flex flex-col">
                          <h3 className="text-2xl font-black uppercase italic tracking-tight">Müxabirləşmə <span className="text-indigo-400">Jurnalı</span></h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Sənəd: PAYROLL — {selectedYear} {months[selectedMonth-1]}</p>
                      </div>
                      <button onClick={() => setIsJournalModalOpen(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all group">
                          <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-500" />
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-12 custom-scrollbar no-scrollbar text-slate-800 dark:text-slate-100">
                      {isJournalLoading ? (
                          <div className="flex h-full items-center justify-center">
                              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                          </div>
                      ) : journalEntries.length === 0 ? (
                          <div className="flex h-full flex-col items-center justify-center opacity-30 italic">
                             <FileText className="w-20 h-20 mb-6 text-slate-300" />
                             <p className="text-xl font-black uppercase tracking-widest text-slate-400">Heç bir müxabirləşmə tapılmadı</p>
                             <p className="text-sm text-slate-400 mt-3 uppercase tracking-tighter text-center">Sənəd bağlandıqda avtomatik müxabirləşmələr yaradılmalıdır</p>
                          </div>
                      ) : (
                          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
                             {journalEntries.map((entry, eIdx) => (
                                 <div key={eIdx} className="bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 overflow-hidden shadow-inner">
                                     <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200 dark:border-slate-700">
                                         <div className="flex items-center gap-5">
                                             <div className="w-12 h-12 bg-white dark:bg-slate-800 text-indigo-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                 <Calculator className="w-6 h-6" />
                                             </div>
                                             <div className="flex flex-col">
                                                 <span className="text-sm font-black text-slate-800 dark:text-white leading-none tracking-tight">#{entry.no || 'AUTO-ENTRY'}</span>
                                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{new Date(entry.date).toLocaleDateString('az-AZ')} — {entry.description}</span>
                                             </div>
                                         </div>
                                         <div className="text-right">
                                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">Cəmi Məbləğ</span>
                                             <div className="text-2xl font-black text-indigo-600 italic tabular-nums leading-none mt-1">₼ {entry.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                         </div>
                                     </div>

                                     <div className="overflow-x-auto">
                                         <table className="w-full text-left border-collapse">
                                             <thead>
                                                 <tr className="bg-white/50 dark:bg-white/5">
                                                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Debit Hesab</th>
                                                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kredit Hesab</th>
                                                     <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Məbləğ</th>
                                                 </tr>
                                             </thead>
                                             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                 {entry.details?.map((detail: any, dIdx: number) => (
                                                     <tr key={dIdx} className="group italic font-black uppercase leading-none">
                                                         <td className="px-8 py-7 bg-white dark:bg-slate-900 border-none">
                                                             <div className="flex items-center gap-3">
                                                                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                                                                 <span className="text-[11px] text-slate-800 dark:text-slate-200 tracking-tight">
                                                                    {detail.debitAccount?.code || detail.debitAccountCode} 
                                                                    {detail.debitAccount?.name ? ` — ${detail.debitAccount.name}` : ''}
                                                                 </span>
                                                             </div>
                                                         </td>
                                                         <td className="px-8 py-7 bg-white dark:bg-slate-900 border-none">
                                                             <div className="flex items-center gap-3">
                                                                 <div className="w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
                                                                 <span className="text-[11px] text-slate-800 dark:text-slate-200 tracking-tight">
                                                                    {detail.creditAccount?.code || detail.creditAccountCode}
                                                                    {detail.creditAccount?.name ? ` — ${detail.creditAccount.name}` : ''}
                                                                 </span>
                                                             </div>
                                                         </td>
                                                         <td className="px-8 py-7 text-right bg-white dark:bg-slate-900 border-none tabular-nums text-indigo-600 font-black">
                                                             ₼ {detail.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                         </td>
                                                     </tr>
                                                 ))}
                                             </tbody>
                                         </table>
                                     </div>
                                 </div>
                             ))}
                          </div>
                      )}
                  </div>

                  <div className="p-10 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button 
                         onClick={() => setIsJournalModalOpen(false)}
                         className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl transition-all italic leading-none"
                      >
                         Modalı Bağla
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default PayrollCalculationCreate;
