import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, UserCheck,
  Printer, 
  Briefcase,
  DollarSign,
  ShieldCheck,
  UserPlus,
  Loader2,
  FileText,
  Trash2,
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  Plus,
  AlertCircle,
  Package,
  ListCheck,
  Calculator
} from 'lucide-react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { hrApi, financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import PhotoUpload from '../../components/hr/PhotoUpload';
import FormattedDateInput from '../../components/common/FormattedDateInput';
import SearchableSelect from '../../components/common/SearchableSelect';

// Future-ready Company Configuration for Documents
const COMPANY_CONFIG = {
  name: "SMARTAGENT ERP SOLUTIONS",
  taxId: "1234567891",
  address: "Bakı şəhəri, Səbail rayonu, Nizami küç. 45",
  contact: "+994 (55) 123-45-67 / info@smartagent.az",
  website: "www.smartagent.az"
};

// Statutory Tax Exemption Categories (Article 102)
const EXEMPTION_CATEGORIES = [
    { 
        amount: 800, 
        label: "V.M. 102.1-1 (800 AZN)", 
        options: ["Şəhid statusu almış şəxslərin valideynlərinin, dul arvadlarının (ərlərinin) və övladlarının"] 
    },
    { 
        amount: 400, 
        label: "V.M. 102.2 (400 AZN)", 
        options: [
            "Azərbaycan Respublikasının Vətən Müharibəsi Qəhrəmanları",
            "Azərbaycanın Milli Qəhrəmanları",
            "Sovet İttifaqı və Sosialist Əməyi Qəhrəmanları",
            "Müharibə ilə əlaqədar əlilliyi olan şəxslər",
            "Həlak olmuş/vəfat etmiş döyüşçülərin dul arvadları (ərləri) və övladları (şəhid statusu istisna istisna olmaqla)",
            "1941-1945-ci illərdə arxa cəbhədə fədakar əməyə görə orden və medal ilə təltif edilmiş şəxslər",
            "Qanunvericiliklə müəyyən edilmiş qaydada müharibə veteranı adı almış şəxslər",
            "Çernobıl AES / Radiasiya qəzası nəticəsində şüa xəstəliyinə tutulmuş şəxslər"
        ] 
    },
    { 
        amount: 200, 
        label: "V.M. 102.3 (200 AZN)", 
        options: [
            "Orqanizmin funksiyalarının 61-100 faiz pozulmasına görə əlilliyi müəyyən edilmiş şəxslər",
            "Əlilliyi olan uşaqlar",
            "Daimi qulluq tələb edən əlilliyi olan uşağa baxan valideynlərdən biri (himayəçi/qəyyum)"
        ] 
    },
    { 
        amount: 100, 
        label: "V.M. 102.4 (100 AZN)", 
        options: [
            "Həlak olmuş döyüşçülərin/dövlat qulluqçularının valideynləri və arvadları (ərləri)",
            "Əfqanıstana və döyüş əməliyyatları aparılan başqa ölkələrə gönderilmiş hərbi qulluqçular",
            "Məcburi köçkün və onlara bərabər tutulan şəxslər"
        ] 
    },
    { 
        amount: 50, 
        label: "V.M. 102.5 (50 AZN)", 
        options: [
            "Himayəsində azı üç nəfər (və ya 23 yaşınadək tələbə) olan ər və ya arvaddan biri"
        ] 
    }
];

// PRINT STYLES (Professional Enterprise HR Standard)
const printStyles = `
  @media print {
    /* Aggrresive UI Hiding */
    html, body, #root, .main-container, .main-content, main {
      background: white !important;
      margin: 0 !important;
      padding: 0 !important;
      height: auto !important;
      overflow: visible !important;
    }

    aside, header, nav, footer, button, .sidebar, .top-header, .premium-header, 
    .no-print, [role="navigation"], [role="banner"], .sticky {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
    }

    /* Page Setup */
    @page {
      size: A4;
      margin: 20mm;
    }

    .print-only {
      display: block !important;
      visibility: visible !important;
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      background: white !important;
      z-index: 9999 !important;
      padding: 0 !important;
    }

    /* Typography & Hierarchy */
    .hr-document {
      font-family: 'Inter', 'Segoe UI', Tahoma, Arial, sans-serif !important;
      color: #000 !important;
      line-height: 1.6 !important;
      font-size: 11pt !important;
    }

    .hr-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 25pt;
      padding-bottom: 15pt;
      border-bottom: 1.5pt solid #000;
    }

    .hr-title-block {
      text-align: center;
      margin-bottom: 30pt;
    }

    .hr-title {
      font-size: 18pt !important;
      font-weight: 900 !important;
      text-transform: uppercase !important;
      margin-bottom: 8pt !important;
      letter-spacing: 1pt;
    }

    .hr-section-title {
      font-size: 12pt !important;
      font-weight: 800 !important;
      text-transform: uppercase !important;
      border-bottom: 0.5pt solid #ccc;
      padding-bottom: 3pt;
      margin-top: 20pt;
      margin-bottom: 12pt;
      color: #333;
    }

    .hr-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 15pt 40pt;
    }

    .hr-field {
      display: flex;
      flex-direction: column;
    }

    .hr-label {
      font-size: 8.5pt;
      font-weight: 700;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 2pt;
    }

    .hr-value {
      font-size: 10.5pt;
      font-weight: 600;
      border-bottom: 0.5pt dashed #eee;
    }

    .hr-textarea {
      background: #fbfbfb;
      padding: 10pt;
      border: 0.5pt solid #eee;
      border-radius: 4pt;
      font-size: 10pt;
      white-space: pre-wrap;
    }

    .hr-signature-block {
      margin-top: 50pt;
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 60pt;
    }

    .hr-signature-box {
      border-top: 1pt solid #000;
      padding-top: 6pt;
      text-align: center;
    }

    .hr-seal {
      width: 70pt;
      height: 70pt;
      border: 1pt dashed #ccc;
      border-radius: 50%;
      margin: 10pt auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      color: #999;
    }

    /* Print Optimization */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      text-shadow: none !important;
      box-shadow: none !important;
    }
  }
`;

const EmployeeHiringCreate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isContentFullscreen, setIsContentFullscreen } = useOutletContext<any>();
  const { activeCompany } = useCompany();
  const { formatDate, formatNumber, formatCurrency } = useFormat();
  const isEdit = Boolean(id);
  const companyId = activeCompany?.id || '';
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [docNumber, setDocNumber] = useState(isEdit ? '' : `HR-HIRE-${new Date().getFullYear()}-0021`);
  const [docDate, setDocDate] = useState(isEdit ? '' : new Date().toISOString().split('T')[0]);

  interface HiringFormData {
    employeeName: string;
    fin: string;
    idSerial: string;
    gender: string;
    birthDate: string;
    education: string;
    department: string;
    position: string;
    positionId: string;
    startDate: string;
    signingDate: string;
    endDate: string;
    orderNumber: string;
    contractNumber: string;
    contractTerm: 'INDEFINITE' | 'FIXED';
    previousExperienceYears: number | null;
    previousExperienceMonths: number | null;
    taxExemptionGroup: string;
    taxExemptionEndDate: string;
    taxExemptionsJson: any[];
    probationMonths: number | null;
    isSpecialized: boolean;
    isWarParticipant: boolean;
    salary: number | null;
    salaryGross: number | null;
    salaryType: string;
    workShiftId: string;
    workSchedule: string;
    vacationDays: number | null;
    workplaceType: string;
    address: string;
    phone: string;
    email: string;
    notes: string;
    sector: 'PRIVATE' | 'STATE_OIL';
    assignedAssets: any[];
    responsibilities: string;
    payableAccountId: string;
    advanceAccountId: string;
    avatarUrl: string | null;
    citizenship: string; // 'AR' or 'FOREIGN'
    branchId: string;
  }

  // Form State
  const [formData, setFormData] = useState<HiringFormData>({
    employeeName: '',
    fin: '',
    idSerial: '',
    gender: '', 
    birthDate: '',
    education: '', 
    department: '',
    position: '',
    positionId: '',
    startDate: '', 
    signingDate: '',
    endDate: '',
    orderNumber: '',
    contractNumber: '',
    contractTerm: 'INDEFINITE' as 'INDEFINITE' | 'FIXED',
    previousExperienceYears: null as number | null, 
    previousExperienceMonths: null as number | null, 
    taxExemptionGroup: 'NONE',
    taxExemptionEndDate: '',
    taxExemptionsJson: [] as any[],
    probationMonths: null as number | null, 
    isSpecialized: true,
    isWarParticipant: false,
    salary: null as number | null, 
    salaryGross: null as number | null,
    salaryType: '', 
    workShiftId: '',
    workSchedule: '',
    vacationDays: null as number | null,
    workplaceType: '', 
    address: '',
    phone: '',
    email: '',
    notes: '',
    sector: 'PRIVATE' as 'PRIVATE' | 'STATE_OIL',
    assignedAssets: [] as any[],
    responsibilities: '',
    payableAccountId: '',
    advanceAccountId: '',
    avatarUrl: null,
    citizenship: 'AR',
    branchId: ''
  });

  const [shifts, setShifts] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [allPositions, setAllPositions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoadingShifts, setIsLoadingShifts] = useState(true);
  const [isLoadingDepts, setIsLoadingDepts] = useState(true);
  const [isLoadingPositions, setIsLoadingPositions] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSelectData = async () => {
      if (!companyId) return;
      try {
        setIsLoadingShifts(true);
        setIsLoadingDepts(true);
        setIsLoadingAccounts(true);
        setIsLoadingBranches(true);
        
        const ensureArray = (res: any) => Array.isArray(res) ? res : (res?.data || []);
        
        const [sData, dData, pData, aData, bData] = await Promise.all([
            hrApi.getShifts(companyId),
            hrApi.getDepartments(companyId),
            hrApi.getPositions(companyId),
            financeApi.getAccounts(companyId),
            hrApi.getBranches(companyId)
        ]);
        
        const shiftsArr = ensureArray(sData);
        const deptsArr = ensureArray(dData);
        const positionsArr = ensureArray(pData);
        const accountsArr = ensureArray(aData);
        const branchesArr = ensureArray(bData);

        setShifts(shiftsArr);
        setDepartments(deptsArr);
        setAllPositions(positionsArr);
        setAccounts(accountsArr);
        setBranches(branchesArr);
        
        if (isEdit && id) {
           const orderRes = await hrApi.getHiringOrderDetail(id, companyId);
           const data = orderRes.data || orderRes;
           
           if (data) {
              setDocNumber(data.docNumber);
              setDocDate(data.docDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
              
              setFormData(prev => {
                  // Advanced mapping logic for deleted/recreated WorkShifts
                  let activeShiftId = data.workShiftId || data.employee?.workShiftId || '';
                  const oldScheduleName = data.workSchedule || data.employee?.workSchedule || '';
                  
                  let shiftMatch = shiftsArr.find((s:any) => s.id === activeShiftId);
                  // If ID not found, try to match by name (fallback for recreated shifts)
                  if (!shiftMatch && oldScheduleName) {
                      shiftMatch = shiftsArr.find((s:any) => s.name === oldScheduleName);
                      if (shiftMatch) {
                          activeShiftId = shiftMatch.id;
                      }
                  }

                  const updated = {
                      ...prev,
                      employeeName: data.employee?.fullName || data.employeeName || data.name || '',
                      fin: data.employee?.fin || data.fin || '',
                      citizenship: data.employee?.citizenship || data.citizenship || 'AR',
                      idSerial: data.employee?.idSerial || data.idSerial || '',
                      gender: data.employee?.gender || data.gender || 'MALE',
                      birthDate: data.employee?.birthDate?.split('T')[0] || data.birthDate?.split('T')[0] || '',
                      education: data.employee?.education || data.education || 'HIGHER',
                      department: data.department || data.employee?.department?.name || '',
                      position: data.position || data.employee?.position || '',
                      positionId: data.positionId || data.employee?.positionId || '',
                      startDate: data.startDate?.split('T')[0] || '',
                      signingDate: data.signingDate?.split('T')[0] || data.docDate?.split('T')[0],
                      endDate: data.endDate?.split('T')[0] || '', 
                      orderNumber: data.orderNumber || '',
                      contractNumber: data.contractNumber || '', 
                      contractTerm: (data.contractTerm || (data.endDate ? 'FIXED' : 'INDEFINITE')) as 'INDEFINITE' | 'FIXED',
                      previousExperienceYears: data.previousExperienceYears || 0,
                      previousExperienceMonths: data.previousExperienceMonths || 0,
                      taxExemptionGroup: data.taxExemptionGroup || 'NONE',
                      taxExemptionEndDate: data.taxExemptionEndDate ? data.taxExemptionEndDate.split('T')[0] : '',
                      taxExemptionsJson: data.taxExemptionsJson || [],
                      probationMonths: typeof data.probationMonths === 'number' ? data.probationMonths : 3,
                      isSpecialized: data.isSpecialized ?? true,
                      isWarParticipant: data.isWarParticipant ?? false,
                      vacationDays: data.vacationDays || (data.isSpecialized ? 30 : 21),
                      salary: Number(data.salary) || 0,
                      salaryGross: Number(data.salaryGross) || Number(data.salary) || 0,
                      salaryType: data.salaryType || 'NET',
                      workShiftId: activeShiftId,
                      workSchedule: shiftMatch ? shiftMatch.name : oldScheduleName,
                      address: data.employee?.address || data.address || '',
                      phone: data.employee?.phone || data.phone || '',
                      email: data.employee?.email || data.email || '',
                      notes: data.notes || '',
                      sector: data.sector || 'PRIVATE',
                      assignedAssets: data.assignedAssets || [],
                      responsibilities: data.responsibilities || data.employee?.responsibilities?.map((r: any) => r.title || r.content).join('\n') || '',
                      payableAccountId: data.payableAccountId || '',
                      advanceAccountId: data.advanceAccountId || '',
                      avatarUrl: data.employee?.avatarUrl || null,
                      workplaceType: data.workplaceType || 'ƏSAS',
                      branchId: data.branchId || data.employee?.branchId || ''
                  };

                  // Critical: Sync shifts to only show active ones + the one currently selected
                  setShifts(shiftsArr.filter((s: any) => s.isActive || s.id === updated.workShiftId));

                  // Critical: If positionId is missing but we have name, find it in loaded positions
                  if (!updated.positionId && updated.position) {
                      const match = positionsArr.find((p: any) => p.name === updated.position);
                      if (match) updated.positionId = match.id;
                  }
                  return updated as HiringFormData;
              });
              setCurrentStatus(data.status || 'POSTED');
           }
        }
      } catch (error) {
        console.error('FETCH_DATA_ERROR:', error);
      } finally {
        setIsLoadingShifts(false);
        setIsLoadingDepts(false);
        setIsLoadingPositions(false);
        setIsLoadingAccounts(false);
        setIsLoadingBranches(false);
      }
    };
    fetchSelectData();
  }, [companyId, id, isEdit]);

  // Azerbaijan Payroll Calculation (2024 Non-oil Private Sector)
  const [payrollPreview, setPayrollPreview] = useState<{
      net:number, 
      gross:number, 
      dsmf:number, 
      its:number, 
      unemployment:number, 
      incomeTax:number,
      employerDSMF: number,
      employerITS: number,
      employerUnemployment: number,
      totalCost: number
  } | null>(null);

  useEffect(() => {
    const amount = Number(formData.salary) || 0;
    if (amount === 0) {
        setPayrollPreview(null);
        return;
    }

    const calcForGross = (gross: number) => {
        const isPrivate = formData.sector === 'PRIVATE';
        
        // --- EMPLOYEE DEDUCTIONS ---
        let dsmf = 0;
        if (isPrivate) {
            dsmf = gross <= 200 ? gross * 0.03 : (gross <= 8000 ? 6 + (gross - 200) * 0.1 : 786 + (gross - 8000) * 0.1);
        } else {
            dsmf = gross * 0.03; // State/Oil is fixed 3%
        }
        
        const unemployment = gross * 0.005;

        let its = 0;
        if (gross <= 2500) {
            its = gross * 0.02;
        } else {
            // For State/Oil, ITS bracket might vary slightly but we follow the screenshots provided
            its = 50 + (gross - 2500) * 0.005;
        }
        
        const personalEx = Math.max(0, ...(formData.taxExemptionsJson || []).map(ex => ex.amount), 0);
        const primaryDeduction = formData.workplaceType === 'ƏSAS' ? 200 : 0;
        const taxBase = Math.max(0, gross - primaryDeduction - personalEx);
        
        let incomeTax = 0;
        if (isPrivate) {
            if (taxBase <= 2500) {
                incomeTax = taxBase * 0.03;
            } else if (taxBase <= 8000) {
                incomeTax = 75 + (taxBase - 2500) * 0.1;
            } else {
                incomeTax = 625 + (taxBase - 8000) * 0.14;
            }
        } else {
            // State / Oil Sector: 14% up to 2500, then 25%
            if (taxBase <= 2500) {
                incomeTax = taxBase * 0.14;
            } else {
                incomeTax = 350 + (taxBase - 2500) * 0.25;
            }
        }

        const net = gross - (dsmf + its + unemployment + incomeTax);

        // --- EMPLOYER COSTS ---
        let employerDSMF = 0;
        if (isPrivate) {
            if (gross <= 200) {
                employerDSMF = gross * 0.22;
            } else if (gross <= 8000) {
                employerDSMF = 44 + (gross - 200) * 0.15;
            } else {
                employerDSMF = 1214 + (gross - 8000) * 0.11;
            }
        } else {
            employerDSMF = gross * 0.22; // State/Oil Employer is flat 22%
        }

        let employerITS = 0;
        if (gross <= 2500) {
            employerITS = gross * 0.02;
        } else {
            employerITS = 50 + (gross - 2500) * 0.005;
        }

        const employerUnemployment = gross * 0.005;
        const totalCost = gross + employerDSMF + employerITS + employerUnemployment;

        return { net, gross, dsmf, its, unemployment, incomeTax, employerDSMF, employerITS, employerUnemployment, totalCost };
    };

    let results: any = {};
    if (formData.salaryType === 'GROSS') {
        results = calcForGross(amount);
    } else {
        const targetNet = amount;
        // Iterative Solver for absolute precision in Net-to-Gross
        let low = targetNet;
        let high = targetNet * 2.5; // Safe upper bound
        let bestGross = targetNet;
        
        for (let i = 0; i < 20; i++) {
            let mid = (low + high) / 2;
            let currentNet = calcForGross(mid).net;
            if (currentNet < targetNet) {
                low = mid;
            } else {
                high = mid;
            }
            bestGross = mid;
        }
        results = calcForGross(bestGross);
    }
    
    setPayrollPreview(results);
    
    // Auto-update salaryGross in parent state for persistence
    if (formData.salaryType === 'NET') {
        if (Math.abs((formData.salaryGross || 0) - results.gross) > 0.01) {
            setFormData(prev => ({...prev, salaryGross: results.gross}));
        }
    } else {
        if (Math.abs((formData.salaryGross || 0) - amount) > 0.01) {
            setFormData(prev => ({...prev, salaryGross: amount}));
        }
    }
  }, [formData.salary, formData.salaryType, formData.workplaceType, formData.taxExemptionsJson, formData.sector]);

  const getVacationDetails = () => {
    let base = formData.isWarParticipant ? 46 : (formData.isSpecialized ? 30 : 21);
    
    // Calculate Total Seniority (Previous + Current Tenure)
    const prevYears = Number(formData.previousExperienceYears) || 0;
    const prevMonths = Number(formData.previousExperienceMonths) || 0;
    
    const startObj = formData.startDate ? new Date(formData.startDate) : new Date();
    const nowObj = new Date();
    
    // Months between StartDate and Today
    let currentTenureMonths = (nowObj.getFullYear() - startObj.getFullYear()) * 12 + (nowObj.getMonth() - startObj.getMonth());
    if (nowObj.getDate() < startObj.getDate()) currentTenureMonths--;
    
    const totalMonths = (prevYears * 12) + prevMonths + Math.max(0, currentTenureMonths);
    const totalYears = Math.floor(totalMonths / 12);
    
    let bonus = 0;
    if (totalYears >= 15) bonus = 6;
    else if (totalYears >= 10) bonus = 4;
    else if (totalYears >= 5) bonus = 2;
    
    return { base, bonus, total: base + (bonus || 0), totalYears };
  };

  const vacationDetails = getVacationDetails();

  useEffect(() => {
    if (formData.vacationDays !== vacationDetails.total) {
        setFormData(prev => ({ ...prev, vacationDays: vacationDetails.total }));
    }
  }, [vacationDetails.total, formData.isSpecialized, formData.isWarParticipant, formData.startDate, formData.previousExperienceYears, formData.previousExperienceMonths]);

  const handleSave = async () => {
    if (!formData.employeeName) {
      alert('Zəhmət olmasa işçinin adını daxil edin');
      return;
    }

    setIsSaving(true);
    try {
      // Calculate top exemption group for quick reporting
      const topExAmount = Math.max(0, ...(formData.taxExemptionsJson || []).map(ex => ex.amount), 0);
      const topExGroup = topExAmount > 0 ? `${topExAmount}` : 'NONE';

      // Smart sanitize helper for payload creation
      const cleanId = (id: any) => (typeof id === 'string' && id.trim() !== '' ? id : null);

      const payload = {
          ...formData,
          docNumber,
          docDate,
          taxExemptionGroup: topExGroup,
          salaryGross: formData.salaryType === 'GROSS' ? (formData.salary || 0) : (formData.salary || 0) / 0.86,
          departmentId: cleanId(departments.find(d => d.name === formData.department)?.id),
          workShiftId: cleanId(formData.workShiftId),
          workSchedule: formData.workSchedule || '', // Explicitly send workSchedule
          payableAccountId: cleanId(formData.payableAccountId),
          advanceAccountId: cleanId(formData.advanceAccountId),
          probationMonths: typeof formData.probationMonths === 'number' ? formData.probationMonths : null
      };

      if (isEdit && id) {
          await hrApi.updateHiringOrder(id, payload, companyId);
      } else {
          await hrApi.hireEmployee(payload, companyId);
      }
      
      setCurrentStatus('POSTED');
      setTimeout(() => {
        setIsSaving(false);
        navigate('/hr/hiring');
      }, 1500);
    } catch (e: any) { 
      setIsSaving(false); 
      alert('Xəta baş verdi: ' + e.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      <style>{printStyles}</style>

      {/* PRINT TEMPLATE (Enterprise HR Format) */}
      <div className="print-only hidden hr-document">
          {/* HEADER (Logo & Company Info) */}
          <div className="hr-header">
              <div className="w-24 h-24 bg-white border border-slate-200 flex items-center justify-center text-[10pt] text-slate-300 font-bold uppercase italic tracking-widest leading-none">LOGO</div>
              <div className="text-right flex flex-col items-end">
                  <h2 className="text-lg font-black tracking-tight mb-1">{COMPANY_CONFIG.name}</h2>
                  <div className="space-y-0.5 text-[9pt] text-slate-600 font-medium">
                      <p>VÖEN: {COMPANY_CONFIG.taxId}</p>
                      <p>{COMPANY_CONFIG.address}</p>
                      <p>{COMPANY_CONFIG.contact}</p>
                      <p className="text-indigo-500 font-bold">{COMPANY_CONFIG.website}</p>
                  </div>
              </div>
          </div>

          {/* TITLE & METADATA */}
          <div className="hr-title-block">
              <h1 className="hr-title">İŞƏ QƏBUL ƏMRİ</h1>
              <div className="flex justify-center items-center gap-12 font-bold italic text-[11pt]">
                  <p>SƏNƏD NO: <span className="text-indigo-600">#{docNumber || '---'}</span></p>
                  <p>TARİX: <span className="text-indigo-600">{docDate || '---'}</span></p>
              </div>
          </div>

          {/* SECTION 1: PERSONAL INFO */}
          <div className="page-break-inside-avoid">
              <h3 className="hr-section-title">1. ŞƏXSİ MƏLUMATLAR</h3>
              <div className="hr-grid">
                  <div className="hr-field">
                      <span className="hr-label">İşçinin Tam Adı:</span>
                      <span className="hr-value">{formData.employeeName || '---'}</span>
                  </div>
                  {formData.fin && (
                  <div className="hr-field">
                      <span className="hr-label">FİN Kod:</span>
                      <span className="hr-value">{formData.fin}</span>
                  </div>
                  )}
                  {formData.birthDate && (
                  <div className="hr-field">
                      <span className="hr-label">Doğum Tarixi:</span>
                      <span className="hr-value">{formatDate(formData.birthDate)}</span>
                  </div>
                  )}
                  {formData.gender && (
                  <div className="hr-field">
                      <span className="hr-label">Cinsi:</span>
                      <span className="hr-value">{formData.gender === 'MALE' ? 'KİŞİ' : 'QADIN'}</span>
                  </div>
                  )}
                  {formData.idSerial && (
                  <div className="hr-field">
                      <span className="hr-label">Ş/V Seriyası:</span>
                      <span className="hr-value">{formData.idSerial}</span>
                  </div>
                  )}
                  {formData.education && (
                  <div className="hr-field">
                      <span className="hr-label">Təhsili:</span>
                      <span className="hr-value">{formData.education}</span>
                  </div>
                  )}
              </div>
          </div>

          {/* SECTION 2: CONTRACT & POSITION */}
          <div className="page-break-inside-avoid">
              <h3 className="hr-section-title">2. MÜQAVİLƏ VƏ VƏZİFƏ DETALLARI</h3>
              <div className="hr-grid">
                  <div className="hr-field">
                      <span className="hr-label">Vəzifə / Peşə:</span>
                      <span className="hr-value">{formData.position || '---'}</span>
                  </div>
                  <div className="hr-field">
                      <span className="hr-label">Şöbə / Struktur Bölmə:</span>
                      <span className="hr-value">{formData.department || '---'}</span>
                  </div>
                  <div className="hr-field">
                      <span className="hr-label">İşə Başlama Tarixi:</span>
                      <span className="hr-value">{formatDate(formData.startDate)}</span>
                  </div>
                  <div className="hr-field">
                      <span className="hr-label">Müqavilə Növü:</span>
                      <span className="hr-value">{formData.contractTerm === 'INDEFINITE' ? 'MÜDDƏTSİZ' : 'MÜDDƏTLİ'}</span>
                  </div>
                  <div className="hr-field">
                      <span className="hr-label">Sınaq Müddəti:</span>
                      <span className="hr-value">{formData.probationMonths ?? 0} Ay</span>
                  </div>
                  <div className="hr-field">
                      <span className="hr-label">İş Yeri Növü:</span>
                      <span className="hr-value">{formData.workplaceType === 'MAIN' ? 'ƏSAS' : 'ƏLAVƏ'}</span>
                  </div>
              </div>
          </div>

          {/* SECTION 3: RESPONSIBILITIES */}
          {formData.responsibilities && (
          <div className="page-break-inside-avoid">
              <h3 className="hr-section-title">3. VƏZİFƏ ÖHDƏLİKLƏRİ</h3>
              <div className="hr-textarea">
                  {formData.responsibilities}
              </div>
          </div>
          )}

          {/* SECTION 4: SALARY & BENEFITS */}
          <div className="page-break-inside-avoid">
              <h3 className="hr-section-title">4. ƏMƏK HAQQI VƏ ŞƏRTLƏR</h3>
              <div className="hr-grid">
                  <div className="hr-field">
                      <span className="hr-label">Hesablanan Maaş (GROSS):</span>
                      <span className="hr-value font-bold">{formatNumber(payrollPreview?.gross || 0, 2)} AZN</span>
                  </div>
                  <div className="hr-field">
                      <span className="hr-label">Ödəniləcək Maaş (NET):</span>
                      <span className="hr-value font-bold">{formatNumber(payrollPreview?.net || 0, 2)} AZN</span>
                  </div>
                  <div className="hr-field">
                      <span className="hr-label">İş Rejimi / Qrafik:</span>
                      <span className="hr-value">{shifts.find(s => s.id === formData.workShiftId)?.name || '---'}</span>
                  </div>
                  <div className="hr-field">
                      <span className="hr-label">Məzuniyyət Günləri:</span>
                      <span className="hr-value">{formData.vacationDays ?? 0} Gün / İl</span>
                  </div>
              </div>
          </div>

          {/* SECTION 5: TAX & EXPERIENCE (Conditional) */}
          {((formData.previousExperienceYears ?? 0) > 0 || (formData.taxExemptionsJson?.length ?? 0) > 0) && (
          <div className="page-break-inside-avoid">
              <h3 className="hr-section-title">5. GÜZƏŞTLƏR VƏ STAJ</h3>
              <div className="hr-grid">
                  {((formData.taxExemptionsJson?.length ?? 0) > 0) && (
                  <div className="hr-field col-span-2">
                      <span className="hr-label">Vergi Güzəştləri (Maddə 102):</span>
                      <div className="mt-1 space-y-1">
                          {formData.taxExemptionsJson.map((ex, i) => (
                              <div key={i} className="text-[10pt] font-semibold border-l-2 border-slate-200 pl-3 italic">
                                  {ex.category} — {formatNumber(ex.amount, 2)} AZN
                              </div>
                          ))}
                      </div>
                  </div>
                  )}
                  {((formData.previousExperienceYears ?? 0) > 0) && (
                  <div className="hr-field">
                      <span className="hr-label">Ümumi İş Stajı:</span>
                      <span className="hr-value">{(formData.previousExperienceYears ?? 0)} İL {(formData.previousExperienceMonths ?? 0)} AY</span>
                  </div>
                  )}
              </div>
          </div>
          )}

          {/* SIGNATURES */}
          <div className="hr-signature-block">
              <div className="flex flex-col">
                  <h4 className="text-[11pt] font-black italic mb-6">İşəgötürən:</h4>
                  <div className="hr-signature-box mt-auto">
                      <p className="text-[10pt] font-bold">{COMPANY_CONFIG.name}</p>
                      <p className="text-[8pt] text-slate-500 italic uppercase">Səlahiyyətli şəxs / Direktor</p>
                      <div className="hr-seal">M.Y.</div>
                  </div>
              </div>
              <div className="flex flex-col">
                  <h4 className="text-[11pt] font-black italic mb-6">İşçi:</h4>
                  <div className="hr-signature-box mt-auto">
                      <p className="text-[10pt] font-bold">{formData.employeeName || '---'}</p>
                      <p className="text-[8pt] text-slate-500 italic uppercase">Azərbaycan Respublikasının Vətəndaşı</p>
                      <div className="signature-line mt-12 mb-4 h-1 border-b border-black"></div>
                      <p className="text-[7pt] text-slate-300 italic text-center uppercase tracking-tighter">E-Signature Placeholder - SmartAgent Audit Ready System</p>
                  </div>
              </div>
          </div>
      </div>

      <div className="no-print p-8 space-y-10">

      
      {/* PREMIUM HEADER */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-emerald-100 dark:border-emerald-900/30 -mx-8 px-8 py-5 mb-4 flex items-center justify-between shadow-sm font-black italic leading-none">
          <div className="flex items-center space-x-6 leading-none">
            <button onClick={() => navigate(-1)} className="group p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-white hover:shadow-xl transition-all outline-none border-none pointer-events-auto leading-none">
                <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-all font-black leading-none" />
            </button>
            <div className="leading-none">
              <div className="flex items-center gap-3 mb-1.5 leading-none">
                 <UserCheck className="w-6 h-6 text-emerald-500 leading-none" />
                 <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-none">İşə Qəbul Əmri</h1>
                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    currentStatus === 'DRAFT' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-500/20 shadow-lg shadow-emerald-500/10'
                 } leading-none`}>{currentStatus}</span>
              </div>
              <div className="flex items-center space-x-4 leading-none font-black text-[10px] text-slate-400 uppercase tracking-widest">
                 <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100/50 group focus-within:border-emerald-500/30 transition-all leading-none">
                    <span className="mr-2 opacity-50 leading-none lowercase">SƏNƏD NO:</span>
                    <input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="bg-transparent border-none p-0 w-32 outline-none text-emerald-600 font-black italic uppercase leading-none" />
                 </div>
                 <span className="w-1 h-1 bg-slate-300 rounded-full leading-none"></span>
                 <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100/50 leading-none">
                    <span className="mr-2 opacity-50 leading-none lowercase">TARİX:</span>
                    <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="bg-transparent border-none p-0 w-28 outline-none text-emerald-600 font-black italic uppercase leading-none hidden" />
                    <span onClick={() => (document.querySelector('input[type="date"]') as any)?.showPicker?.()} className="text-emerald-600 font-black italic uppercase leading-none cursor-pointer">{formatDate(docDate)}</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 transition-all leading-none">
             <button 
                onClick={() => window.print()}
                className="bg-white hover:bg-slate-50 border border-slate-200 px-6 py-4 rounded-[2rem] text-[10px] font-black flex items-center transition-all shadow-sm active:scale-95 leading-none"
             >
                <Printer className="w-4 h-4 mr-3" /> ÇAP ET
             </button>
             <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-[2rem] text-sm font-black flex items-center shadow-xl shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 leading-none"
             >
                {isSaving ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                {isEdit ? 'Dəyişiklikləri Yadda Saxla' : 'Əmri Təsdiqlə'}
             </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 leading-none">
          <div className="lg:col-span-8 space-y-10 leading-none">
              
              {/* PERSONAL INFO CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none text-left">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none">
                    <UserPlus className="w-6 h-6 mr-3 text-emerald-500 leading-none" />
                    <h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Şəxsi Məlumatlar</h3>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    {/* PHOTO UPLOAD ZONE */}
                    <div className="w-full md:w-auto">
                        <PhotoUpload 
                            value={formData.avatarUrl}
                            onChange={(val) => setFormData({...formData, avatarUrl: val})}
                        />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 font-black italic uppercase leading-none text-left w-full">
                        <div className="space-y-4 font-black italic uppercase leading-none md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">İşçinin Adı, Soyadı, Atasının Adı</label>
                            <input type="text" value={formData.employeeName} onChange={(e) => setFormData({...formData, employeeName: e.target.value})} placeholder="Məs: Əliyev Vəli Həsən" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" />
                        </div>
                        
                        <div className="space-y-4 font-black italic uppercase leading-none">
                            <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Vətəndaşlıq</label>
                            <input 
                                type="text"
                                value={formData.citizenship} 
                                onChange={(e) => setFormData({...formData, citizenship: e.target.value})}
                                placeholder="Məs: Azərbaycan"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none uppercase leading-none"
                            />
                        </div>

                        <div className="space-y-4 font-black italic uppercase leading-none">
                            <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">FİN Kod</label>
                            <input 
                                type="text" 
                                maxLength={formData.citizenship === 'Azərbaycan' ? 7 : undefined} 
                                value={formData.fin} 
                                onChange={(e) => setFormData({...formData, fin: e.target.value.toUpperCase()})} 
                                placeholder={formData.citizenship === 'Azərbaycan' ? "7 Simvol" : "FİN Kod"} 
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" 
                            />
                        </div>
                        <div className="space-y-4 font-black italic uppercase leading-none md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Vəsiqə Seriyası və Nömrəsi</label>
                            <input type="text" value={formData.idSerial} onChange={(e) => setFormData({...formData, idSerial: e.target.value.toUpperCase()})} placeholder="Məs: AZE 12345678" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" />
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-black italic uppercase leading-none text-left">
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Cinsi</label>
                          <input 
                              type="text"
                              value={formData.gender} 
                              onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                              placeholder="Məs: Kişi" 
                              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none uppercase leading-none" 
                          />
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                        <FormattedDateInput 
                            label="Doğum Tarixi"
                            value={formData.birthDate || ""}
                            onChange={(val) => setFormData({...formData, birthDate: val})}
                        />
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Təhsili</label>
                          <input 
                              type="text"
                              value={formData.education} 
                              onChange={(e) => setFormData({...formData, education: e.target.value})} 
                              placeholder="Məs: Ali" 
                              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none uppercase leading-none" 
                          />
                      </div>
                  </div>
              </div>

              {/* CONTRACT DETAILS CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none text-left">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none"><Briefcase className="w-6 h-6 mr-3 text-emerald-500 leading-none" /><h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Müqavilə Detalları</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-black italic uppercase leading-none text-left">
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Müqavilə Nömrəsi</label>
                          <input type="text" value={formData.contractNumber} onChange={(e) => setFormData({...formData, contractNumber: e.target.value})} placeholder="Məs: EMAS-12345" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" />
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Əmr Nömrəsi</label>
                          <input type="text" value={formData.orderNumber} onChange={(e) => setFormData({...formData, orderNumber: e.target.value})} placeholder="Məs: QR-2024/01" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" />
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Müqavilə Növü</label>
                          <select value={formData.contractTerm} onChange={(e) => setFormData({...formData, contractTerm: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none">
                              <option value="INDEFINITE">MÜDDƏTSİZ</option>
                              <option value="FIXED">MÜDDƏTLİ</option>
                          </select>
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                        <FormattedDateInput 
                            label="Müqavilənin Bağlanma Tarixi"
                            value={formData.signingDate || ""}
                            onChange={(val) => setFormData({...formData, signingDate: val})}
                        />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-black italic uppercase leading-none text-left">
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Kadr Növü</label>
                          <select value={formData.isSpecialized ? 'YES' : 'NO'} onChange={(e) => setFormData({...formData, isSpecialized: e.target.value === 'YES'})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none">
                              <option value="YES">İXTİSASLI (30 GÜN)</option>
                              <option value="NO">İXTİSASSIZ (21 GÜN)</option>
                          </select>
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Müharibə İştirakçısı</label>
                          <select value={formData.isWarParticipant ? 'YES' : 'NO'} onChange={(e) => setFormData({...formData, isWarParticipant: e.target.value === 'YES'})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none">
                              <option value="NO">XEYR</option>
                              <option value="YES">BƏLİ (46 GÜN)</option>
                          </select>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">
                              Məzuniyyət Günü Hesablaması 
                              <span className="ml-2 text-emerald-500">(YEKUN STAJ: {vacationDetails.totalYears} İL)</span>
                          </label>
                          <div className="flex space-x-3">
                              <div className="flex-1 bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4 flex justify-between items-center">
                                  <span className="text-[9px] font-black italic text-slate-400 uppercase">ƏSAS:</span>
                                  <span className="text-xs font-black italic text-emerald-600">{vacationDetails.base} GÜN</span>
                              </div>
                              <div className="flex-1 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-4 flex justify-between items-center">
                                  <span className="text-[9px] font-black italic text-slate-400 uppercase">STAJ:</span>
                                  <span className="text-xs font-black italic text-amber-600">+{vacationDetails.bonus} GÜN</span>
                              </div>
                              <div className="flex-1 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-4 flex justify-between items-center">
                                  <span className="text-[9px] font-black italic text-slate-400 uppercase">CƏMİ:</span>
                                  <span className="text-xs font-black italic text-indigo-600">{vacationDetails.total} GÜN</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-black italic uppercase leading-none text-left">
                      <div className="space-y-4 font-black italic uppercase leading-none">
                        <FormattedDateInput 
                            label="İşə Başlama Tarixi"
                            value={formData.startDate || ""}
                            onChange={(val) => setFormData({...formData, startDate: val})}
                            iconColor="text-indigo-500"
                        />
                      </div>
                         <div className="space-y-4 font-black italic uppercase leading-none animate-in slide-in-from-top duration-500">
                           <FormattedDateInput 
                               label="Müqavilənin Bitmə Tarixi"
                               value={formData.endDate || ""}
                               onChange={(val) => setFormData({...formData, endDate: val})}
                               iconColor="text-orange-500"
                           />
                         </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Sınaq Müddəti (Ay)</label>
                          <input type="number" value={formData.probationMonths ?? ''} onChange={(e) => setFormData({...formData, probationMonths: e.target.value === '' ? null : Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic outline-none leading-none" />
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Xitam / Əvəz Tarixi</label>
                          <input type="date" disabled className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent opacity-50 rounded-[2rem] py-5 px-8 text-xs font-black italic outline-none leading-none cursor-not-allowed" placeholder="Yalnız Xitamda" />
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">İş yerinin növü</label>
                          <select value={formData.workplaceType} onChange={(e) => setFormData({...formData, workplaceType: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none">
                              <option value="">SEÇİN</option>
                              <option value="ƏSAS">ƏSAS İŞ YERİ</option>
                              <option value="ƏLAVƏ">ƏLAVƏ İŞ YERİ</option>
                          </select>
                      </div>
                  </div>
              </div>

              {/* CONTACT INFO CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none text-left">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none"><MapPin className="w-6 h-6 mr-3 text-sky-500 leading-none" /><h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Əlaqə Məlumatları</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black italic uppercase leading-none text-left">
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Telefon Nömrəsi</label>
                          <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+994 (__) ___-__-__" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] py-5 pl-14 pr-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" />
                          </div>
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">E-poçt ünvanı</label>
                          <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="example@domain.com" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] py-5 pl-14 pr-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" />
                          </div>
                      </div>
                  </div>
                  <div className="space-y-4 font-black italic uppercase leading-none text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Yaşadığı Ünvan</label>
                      <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Məs: Bakı şəhəri, ...." className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" />
                  </div>
              </div>

              {/* GENERAL EXPERIENCE CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-amber-100 dark:border-amber-900/30 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none"><Briefcase className="w-6 h-6 mr-3 text-amber-500 leading-none" /><h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Əvvəlki İş Stajı</h3></div>
                  <p className="text-[10px] text-slate-400 italic leading-none text-left">* Mövcud şirkətdən əvvəlki cəmi staj (İl və Ay)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black italic uppercase leading-none text-left">
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Cəmi İl</label>
                          <input type="number" value={formData.previousExperienceYears ?? ''} onChange={(e) => setFormData({...formData, previousExperienceYears: e.target.value === '' ? null : Number(e.target.value)})} placeholder="Məs: 5" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-amber-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" />
                      </div>
                      <div className="space-y-4 font-black italic uppercase leading-none">
                          <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Cəmi Ay</label>
                          <input type="number" min={0} max={11} value={formData.previousExperienceMonths ?? ''} onChange={(e) => setFormData({...formData, previousExperienceMonths: e.target.value === '' ? null : Number(e.target.value)})} placeholder="Məs: 6" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-amber-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-none" />
                      </div>
                  </div>
              </div>
              
              {/* RESPONSIBILITIES CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none text-left">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none">
                    <ListCheck className="w-6 h-6 mr-3 text-indigo-500 leading-none" />
                    <h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Vəzifə Öhdəlikləri</h3>
                  </div>
                  
                  <div className="space-y-6">
                      <textarea 
                        rows={8} 
                        value={formData.responsibilities} 
                        onChange={(e) => setFormData({...formData, responsibilities: e.target.value})} 
                        placeholder="İşçinin vəzifə üzrə məsuliyyətlərini və əsas öhdəliklərini bura daxileyin..." 
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-300/20 rounded-[2.5rem] py-8 px-10 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-tight placeholder:text-slate-300"
                      ></textarea>
                      <div className="bg-indigo-500/5 p-6 rounded-[2rem] border border-indigo-100/30 flex items-center leading-tight">
                        <AlertCircle className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
                        <p className="text-[9px] text-indigo-600 italic font-black uppercase">Bu məlumatlar işçinin rəsmi profilində və müvafiq kadr sənədlərində istifadə ediləcəkdir.</p>
                      </div>
                  </div>
              </div>

              {/* TAX EXEMPTIONS CARD (DYNAMIC LIST) */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-indigo-100 dark:border-indigo-900/30 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-8 leading-none">
                      <div className="flex items-center">
                          <ShieldCheck className="w-6 h-6 mr-3 text-indigo-500 leading-none" />
                          <h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Vergi Güzəştləri (Maddə 102)</h3>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                            const newList = [...(formData.taxExemptionsJson || [])];
                            newList.push({ id: Date.now(), amount: 400, category: EXEMPTION_CATEGORIES[0].options[0], endDate: '' });
                            setFormData({...formData, taxExemptionsJson: newList});
                        }}
                        className="flex items-center bg-indigo-50 text-indigo-600 px-6 py-3 rounded-[1.5rem] text-[10px] font-black italic hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 border-none leading-none"
                      >
                        <Plus className="w-3 h-3 mr-2" /> Güzəşt Əlavə Et
                      </button>
                  </div>

                  <div className="space-y-6 text-left">
                      {(formData.taxExemptionsJson || []).length === 0 ? (
                          <div className="py-12 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                              <p className="text-[10px] text-slate-300 font-black italic uppercase italic">Hələ ki heç bir güzəşt əlavə edilməyib</p>
                          </div>
                      ) : (
                          formData.taxExemptionsJson.map((ex, idx) => (
                              <div key={ex.id || idx} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-100/50 relative overflow-hidden group">
                                  <div className="lg:col-span-3 space-y-3">
                                      <label className="text-[9px] font-black text-slate-400 uppercase italic ml-2">Güzəşt Məbləği</label>
                                      <select 
                                        value={ex.amount} 
                                        onChange={(e) => {
                                            const newList = [...formData.taxExemptionsJson];
                                            const amount = Number(e.target.value);
                                            newList[idx] = { ...ex, amount, category: EXEMPTION_CATEGORIES.find(c => c.amount === amount)?.options[0] || '' };
                                            setFormData({...formData, taxExemptionsJson: newList});
                                        }}
                                        className="w-full bg-white dark:bg-slate-900 border-2 border-transparent rounded-[1.5rem] py-4 px-6 text-[10px] font-black italic outline-none leading-none cursor-pointer appearance-none"
                                      >
                                          {EXEMPTION_CATEGORIES.map(c => <option key={c.amount} value={c.amount}>{c.label}</option>)}
                                      </select>
                                  </div>
                                  <div className="lg:col-span-5 space-y-3">
                                      <label className="text-[9px] font-black text-slate-400 uppercase italic ml-2">Alt Kateqoriya (Səbəb)</label>
                                      <select 
                                        value={ex.category} 
                                        onChange={(e) => {
                                            const newList = [...formData.taxExemptionsJson];
                                            newList[idx] = { ...ex, category: e.target.value };
                                            setFormData({...formData, taxExemptionsJson: newList});
                                        }}
                                        className="w-full bg-white dark:bg-slate-900 border-2 border-transparent rounded-[1.5rem] py-4 px-6 text-[10px] font-black italic outline-none leading-none cursor-pointer appearance-none"
                                      >
                                          {(EXEMPTION_CATEGORIES.find(c => c.amount === ex.amount)?.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                      </select>
                                  </div>
                                  <div className="lg:col-span-3 space-y-3">
                                      <label className="text-[9px] font-black text-slate-400 uppercase italic ml-2">Bitmə Tarixi</label>
                                      <input 
                                        type="date" 
                                        value={ex.endDate} 
                                        onChange={(e) => {
                                            const newList = [...formData.taxExemptionsJson];
                                            newList[idx] = { ...ex, endDate: e.target.value };
                                            setFormData({...formData, taxExemptionsJson: newList});
                                        }}
                                        className="w-full bg-white dark:bg-slate-900 border-2 border-transparent rounded-[1.5rem] py-4 px-6 text-[10px] font-black italic outline-none leading-none"
                                      />
                                  </div>
                                  <div className="lg:col-span-1 flex justify-center">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                            const newList = formData.taxExemptionsJson.filter((_, i) => i !== idx);
                                            setFormData({...formData, taxExemptionsJson: newList});
                                        }}
                                        className="p-4 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all border-none bg-transparent active:scale-90"
                                      >
                                          <Trash2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>

                  <div className="bg-indigo-500/5 p-8 rounded-[2.5rem] border border-indigo-100/30 flex items-center justify-between">
                      <div className="space-y-1">
                          <p className="text-[9px] font-black text-indigo-400 uppercase italic tracking-widest leading-none">Tətbiq Olunan Əsas Güzəşt</p>
                          <p className="text-[10px] text-slate-500 italic leading-none">Bitmə tarixi keçməmiş ən yüksək məbləğli güzəşt əsas götürülür.</p>
                      </div>
                      <div className="text-right">
                          <span className="text-2xl font-black italic text-indigo-600">
                             {Math.max(0, ...(formData.taxExemptionsJson || []).map(ex => ex.amount), 0)} AZN
                          </span>
                      </div>
                  </div>
              </div>




          </div>

          <div className="lg:col-span-4 space-y-10 leading-none">
              
              {/* ORGANIZATION CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none text-left">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none"><Building2 className="w-6 h-6 mr-3 text-blue-500 leading-none" /><h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Təşkilati Struktur</h3></div>
                  
                  <div className="space-y-4 font-black italic uppercase leading-none">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Şöbə / Struktur Bölmə</label>
                      {isLoadingDepts ? (
                        <div className="py-5 px-8 bg-slate-50 rounded-[2rem] flex items-center justify-center italic text-[10px] text-slate-400 leading-none"><Loader2 className="w-3 h-3 mr-2 animate-spin leading-none" /> Şöbələr Yüklənir...</div>
                      ) : (
                        <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none">
                            <option value="">ŞÖBƏ SEÇİN</option>
                            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                      )}
                  </div>

                   <div className="font-black italic uppercase leading-none">
                       {isLoadingPositions ? (
                          <div className="py-5 px-8 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center italic text-[10px] text-slate-400 leading-none"><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Yüklənir...</div>
                       ) : (
                         <SearchableSelect 
                           label="Vəzifə / Peşə"
                           placeholder="VƏZİFƏ SEÇİN"
                           value={formData.positionId}
                           options={allPositions
                            .filter(p => !formData.department || p.department?.name === formData.department || p.id === formData.positionId)
                            .map(p => ({
                               id: p.id,
                               label: p.name,
                               subLabel: p.department?.name
                            }))
                           }
                           onChange={(id) => {
                             const pos = allPositions.find(p => p.id === id);
                             setFormData({...formData, positionId: id, position: pos?.name || ''});
                           }}
                         />
                       )}
                       {!formData.department && (
                         <p className="text-[9px] text-amber-500 italic font-bold ml-4 font-black italic uppercase italic mt-1">Öncə şöbə seçməyiniz tövsiyə olunur</p>
                       )}
                   </div>

                  <div className="space-y-4 font-black italic uppercase leading-none">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1 italic">Filial (Branch)</label>
                      {isLoadingBranches ? (
                        <div className="py-5 px-8 bg-slate-50 rounded-[2rem] flex items-center justify-center italic text-[10px] text-slate-400 leading-none"><Loader2 className="w-3 h-3 mr-2 animate-spin leading-none" /> Filiallar Yüklənir...</div>
                      ) : (
                        <select value={formData.branchId} onChange={(e) => setFormData({...formData, branchId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none">
                            <option value="">FİLİAL SEÇİN</option>
                            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      )}
                  </div>

                  <div className="space-y-4 font-black italic uppercase leading-none">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">İş Rejimi / Qrafik</label>
                      {isLoadingShifts ? (
                        <div className="py-5 px-8 bg-slate-50 rounded-[2rem] flex items-center justify-center italic text-[10px] text-slate-400 leading-none"><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Yüklənir...</div>
                      ) : (
                        <select 
                          value={formData.workShiftId} 
                          onChange={(e) => {
                            const shiftId = e.target.value;
                            const shift = shifts.find(s => s.id === shiftId);
                            setFormData({
                                ...formData, 
                                workShiftId: shiftId,
                                workSchedule: shift ? shift.name : (formData.workSchedule || '')
                            });
                          }} 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none"
                        >
                            <option value="">İŞ REJİMİ SEÇİN</option>
                            {shifts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.startTime}-{s.endTime})</option>)}
                        </select>
                      )}
                  </div>
              </div>

              {/* ACCOUNTING CORRESPONDENCE CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-indigo-100 dark:border-indigo-900/30 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none text-left">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none">
                    <Calculator className="w-6 h-6 mr-3 text-indigo-500 leading-none" />
                    <h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Müxabirləşmə (Uçot)</h3>
                  </div>
                  
                  <div className="space-y-4 font-black italic uppercase leading-none">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1 italic">Əməyin ödənilməsi üzrə borclar (Məs: 533)</label>
                      {isLoadingAccounts ? (
                        <div className="py-5 px-8 bg-slate-50 rounded-[2rem] flex items-center justify-center italic text-[10px] text-slate-400 leading-none"><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Hesablar Yüklənir...</div>
                      ) : (
                        <select 
                          value={formData.payableAccountId} 
                          onChange={(e) => setFormData({...formData, payableAccountId: e.target.value})} 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none"
                        >
                            <option value="">HESAB SEÇİN</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                            ))}
                        </select>
                      )}
                  </div>

                  <div className="space-y-4 font-black italic uppercase leading-none">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1 italic">İşçi heyətinə verilmiş avanslar (Avans)</label>
                      {isLoadingAccounts ? (
                        <div className="py-5 px-8 bg-slate-50 rounded-[2rem] flex items-center justify-center italic text-[10px] text-slate-400 leading-none"><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Yüklənir...</div>
                      ) : (
                        <select 
                          value={formData.advanceAccountId} 
                          onChange={(e) => setFormData({...formData, advanceAccountId: e.target.value})} 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none"
                        >
                            <option value="">HESAB SEÇİN</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                            ))}
                        </select>
                      )}
                  </div>
                  
                  <div className="bg-indigo-500/5 p-6 rounded-[2rem] border border-indigo-100/30 leading-tight">
                    <p className="text-[9px] text-indigo-600 italic font-black uppercase">Bu tənzimləmə əmək haqqı hesablanarkən maliyyə sənədlərinin (Jurnal Yazılışı) avtomatik formalaşması üçün istifadə olunacaqdır.</p>
                  </div>
              </div>

              {/* SALARY CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none text-left">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none"><DollarSign className="w-6 h-6 mr-3 text-rose-500 leading-none" /><h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Əmək Haqqı</h3></div>
                  
                  <div className="space-y-4 font-black italic uppercase leading-none">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">İş kateqoriyası</label>
                      <select value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none font-black italic uppercase appearance-none cursor-pointer leading-none">
                          <option value="PRIVATE">QEYRİ-DÖVLƏT VƏ QEYRİ-NEFT SEKTORU</option>
                          <option value="STATE_OIL">DÖVLƏT VƏ NEFT SEKTORU</option>
                      </select>
                  </div>

                  <div className="space-y-4 font-black italic uppercase leading-none">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Maaşın Növü</label>
                      <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-[2rem] border-2 border-transparent leading-none">
                          <button 
                            onClick={() => {
                                if (formData.salaryType === 'GROSS' && payrollPreview) {
                                    setFormData({...formData, salaryType: 'NET', salary: Number(payrollPreview.net.toFixed(2))});
                                } else {
                                    setFormData({...formData, salaryType: 'NET'});
                                }
                            }} 
                            className={`flex-1 py-3.5 px-6 rounded-[1.5rem] text-[10px] font-black italic transition-all border-none ${formData.salaryType === 'NET' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'} leading-none`}
                          >
                            NET
                          </button>
                          <button 
                            onClick={() => {
                                if (formData.salaryType === 'NET' && payrollPreview) {
                                    setFormData({...formData, salaryType: 'GROSS', salary: Number(payrollPreview.gross.toFixed(2))});
                                } else {
                                    setFormData({...formData, salaryType: 'GROSS'});
                                }
                            }} 
                            className={`flex-1 py-3.5 px-6 rounded-[1.5rem] text-[10px] font-black italic transition-all border-none ${formData.salaryType === 'GROSS' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'} leading-none`}
                          >
                            GROSS
                          </button>
                      </div>
                  </div>

                  <div className="space-y-4 font-black italic uppercase leading-none">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none block ml-4 mb-1">Məbləğ (AZN)</label>
                      <div className="relative leading-none">
                          <input type="number" value={formData.salary ?? ''} onChange={(e) => setFormData({...formData, salary: e.target.value === '' ? null : Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-rose-500/20 rounded-[2rem] py-6 px-8 text-2xl font-black italic shadow-inner outline-none leading-none" />
                          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black italic leading-none">₼</span>
                      </div>

                      {payrollPreview && (
                        <div className="bg-rose-50/30 dark:bg-rose-900/10 rounded-[2.5rem] border border-rose-100/50 p-8 space-y-8 animate-in slide-in-from-top-4 duration-300">
                             {/* EMPLOYEE SECTION */}
                             <div className="space-y-4">
                                 <div className="flex items-center justify-between border-b border-rose-100/50 pb-4">
                                    <span className="text-[10px] font-black italic text-slate-400">İŞÇİDƏN TUTULMALAR:</span>
                                    <span className="text-xl font-black italic text-rose-500 uppercase">{formatNumber(payrollPreview.net, 2)} AZN (NET)</span>
                                 </div>
                                 <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                                    <div className="flex justify-between items-center text-[9px] uppercase font-black italic">
                                        <span className="text-slate-400">DSMF (İşçi):</span>
                                        <span className="text-slate-600">-{formatNumber(payrollPreview.dsmf, 2)} AZN</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] uppercase font-black italic">
                                        <span className="text-slate-400">İTS (MTS):</span>
                                        <span className="text-slate-600">-{formatNumber(payrollPreview.its, 2)} AZN</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] uppercase font-black italic">
                                        <span className="text-slate-400">İşsizlik:</span>
                                        <span className="text-slate-600">-{formatNumber(payrollPreview.unemployment, 2)} AZN</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] uppercase font-black italic">
                                        <span className="text-slate-400">Vergi:</span>
                                        <span className={`font-black ${payrollPreview.incomeTax > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{payrollPreview.incomeTax > 0 ? `-${formatNumber(payrollPreview.incomeTax, 2)}` : '0.00 (GÜZƏŞT)'} AZN</span>
                                    </div>
                                 </div>
                             </div>

                             {/* EMPLOYER SECTION */}
                             <div className="bg-white/40 dark:bg-slate-900/40 p-6 rounded-[2rem] border border-rose-100/20 space-y-4">
                                 <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <span className="text-[9px] font-black italic text-slate-400">İŞƏGÖTÜRƏNİN XƏRCLƏRİ:</span>
                                    <span className="text-sm font-black italic text-slate-600">+{ formatNumber(payrollPreview.employerDSMF + payrollPreview.employerITS + payrollPreview.employerUnemployment, 2) } AZN</span>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <div className="space-y-1">
                                         <p className="text-[8px] text-slate-400 font-black italic">DSMF (Mədaxil)</p>
                                         <p className="text-[10px] text-slate-900 dark:text-slate-100 font-black italic">{payrollPreview.employerDSMF.toFixed(2)} AZN</p>
                                     </div>
                                     <div className="space-y-1">
                                         <p className="text-[8px] text-slate-400 font-black italic">İTS (Xərc)</p>
                                         <p className="text-[10px] text-slate-900 dark:text-slate-100 font-black italic">{payrollPreview.employerITS.toFixed(2)} AZN</p>
                                     </div>
                                     <div className="space-y-1">
                                         <p className="text-[8px] text-slate-400 font-black italic">İşsizlik</p>
                                         <p className="text-[10px] text-slate-900 dark:text-slate-100 font-black italic">{payrollPreview.employerUnemployment.toFixed(2)} AZN</p>
                                     </div>
                                 </div>
                                 <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                     <span className="text-[10px] font-black italic text-indigo-500">CƏMİ ŞİRKƏT XƏRCİ:</span>
                                     <span className="text-lg font-black italic text-indigo-600">{formatNumber(payrollPreview.totalCost, 2)} AZN</span>
                                 </div>
                             </div>
                        </div>
                      )}

                      <div className="flex items-start bg-rose-50/50 p-4 rounded-2xl border border-rose-100/30 leading-none">
                          <AlertCircle className="w-4 h-4 text-rose-400 mr-3 mt-0.5 leading-none" />
                          <p className="text-[10px] text-rose-600 italic font-black leading-tight">Gəlir vergisi, DSMF və İcbari Tibbi Sığorta bu məbləğə əsasən müvafiq qaydada hesablanacaq.</p>
                      </div>
                  </div>
              </div>



              {/* ASSETS CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none text-left">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none">
                    <Package className="w-6 h-6 mr-3 text-emerald-500 leading-none" />
                    <h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Təhkim Olunmuş Vəsaitlər</h3>
                  </div>

                  <div className="space-y-6">
                      {formData.assignedAssets.length === 0 ? (
                          <div className="py-8 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                              <p className="text-[9px] text-slate-300 font-black italic uppercase">Təhkim olunmiş vəsait yoxdur</p>
                          </div>
                      ) : (
                          formData.assignedAssets.map((asset, idx) => (
                              <div key={idx} className="flex space-x-6 items-center bg-emerald-50/30 p-6 rounded-[2rem] border border-emerald-100/50 group transition-all">
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                      <Package className="w-4 h-4 text-emerald-400" />
                                  </div>
                                  <div className="flex-1 grid grid-cols-2 gap-4">
                                      <div>
                                          <p className="text-[8px] text-slate-400 font-black mb-1">VƏSAİTİN ADI</p>
                                          <input 
                                            type="text" 
                                            value={asset.name}
                                            onChange={(e) => {
                                                const newList = [...formData.assignedAssets];
                                                newList[idx].name = e.target.value;
                                                setFormData({...formData, assignedAssets: newList});
                                            }}
                                            placeholder="Məs: HP ProBook 450 G8" 
                                            className="w-full bg-transparent text-[10px] font-black italic text-slate-900 outline-none border-none placeholder:text-slate-300" 
                                          />
                                      </div>
                                      <div>
                                          <p className="text-[8px] text-slate-400 font-black mb-1">QEYD / INV NO</p>
                                          <input 
                                            type="text" 
                                            value={asset.notes}
                                            onChange={(e) => {
                                                const newList = [...formData.assignedAssets];
                                                newList[idx].notes = e.target.value;
                                                setFormData({...formData, assignedAssets: newList});
                                            }}
                                            placeholder="Məs: INV-2024-001" 
                                            className="w-full bg-transparent text-[10px] font-black italic text-slate-900 outline-none border-none placeholder:text-slate-300" 
                                          />
                                      </div>
                                  </div>
                                  <button onClick={() => {
                                      const newList = formData.assignedAssets.filter((_, i) => i !== idx);
                                      setFormData({...formData, assignedAssets: newList});
                                  }} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all border-none bg-transparent opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                          ))
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setFormData({...formData, assignedAssets: [...formData.assignedAssets, { assetId: '', name: '', notes: '', type: 'FIXED' }]})}
                          className="py-5 bg-emerald-50/50 text-emerald-500 rounded-[2rem] text-[10px] font-black italic uppercase hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-[1.01] active:scale-95 border-none leading-none flex items-center justify-center font-black italic uppercase leading-none"
                        >
                          <Plus className="w-3.5 h-3.5 mr-2" /> Əsas Vəsait Qoş
                        </button>
                        <button 
                          onClick={() => setFormData({...formData, assignedAssets: [...formData.assignedAssets, { assetId: '', name: '', notes: '', type: 'ATK' }]})}
                          className="py-5 bg-amber-50/50 text-amber-500 rounded-[2rem] text-[10px] font-black italic uppercase hover:bg-amber-500 hover:text-white transition-all transform hover:scale-[1.01] active:scale-95 border-none leading-none flex items-center justify-center font-black italic uppercase leading-none"
                        >
                          <Plus className="w-3.5 h-3.5 mr-2" /> ATK Qoş
                        </button>
                      </div>
                  </div>
              </div>

              {/* NOTES CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase leading-none text-left">
                  <div className="flex items-center border-b border-slate-50 pb-8 leading-none"><FileText className="w-6 h-6 mr-3 text-slate-400 leading-none" /><h3 className="text-sm font-black text-slate-400 uppercase italic tracking-widest leading-none text-left">Əlavə Qeydlər</h3></div>
                  <textarea rows={6} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Sənəd və ya işçi ilə bağlı xüsusi qeydlər..." className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-slate-300/20 rounded-[2.5rem] py-8 px-10 text-xs font-black italic shadow-inner outline-none font-black italic uppercase leading-tight"></textarea>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
};

export default EmployeeHiringCreate;
