export interface SalesMock {
  id: string;
  invoiceNo: string;
  customerName: string;
  totalPrincipal: number;
  paidPrincipal: number;
  totalVat: number;
  paidVat: number;
  currency: string;
  date: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
}

export interface HRMock {
  id: string;
  fullName: string;
  departmentName: string;
  positionName: string;
  startDate: string;
  terminationDate: string | null;
  employmentStatus: 'Active' | 'Terminated';
  finCode: string;
  phone: string;
  address: string;
  grossSalary: number;
}

export const SALES_MOCK: SalesMock[] = [
  { id: '1', invoiceNo: 'INV-2024-001', customerName: 'Tengry Supply', totalPrincipal: 10000, paidPrincipal: 10000, totalVat: 1800, paidVat: 1800, currency: 'AZN', date: '2026-03-05', status: 'PAID' },
  { id: '2', invoiceNo: 'INV-2024-002', customerName: 'Baku Logistics', totalPrincipal: 15000, paidPrincipal: 5000, totalVat: 2700, paidVat: 0, currency: 'AZN', date: '2026-03-12', status: 'PARTIAL' },
  { id: '3', invoiceNo: 'INV-2024-003', customerName: 'Ganja Flowers', totalPrincipal: 2000, paidPrincipal: 0, totalVat: 360, paidVat: 0, currency: 'AZN', date: '2026-03-20', status: 'UNPAID' },
  { id: '4', invoiceNo: 'INV-2024-004', customerName: 'Tengry Supply', totalPrincipal: 5000, paidPrincipal: 5000, totalVat: 900, paidVat: 0, currency: 'AZN', date: '2026-04-02', status: 'PARTIAL' },
  { id: '5', invoiceNo: 'INV-2024-005', customerName: 'Sumqayit Steel', totalPrincipal: 25000, paidPrincipal: 20000, totalVat: 4500, paidVat: 4500, currency: 'AZN', date: '2026-04-05', status: 'PARTIAL' },
];

export const HR_MOCK: HRMock[] = [
  { id: '1', fullName: 'Ali Aliyev', departmentName: 'Satış', positionName: 'Manager', startDate: '2020-01-15', terminationDate: null, employmentStatus: 'Active', finCode: 'AZE1234567', phone: '050-123-4455', address: 'Baki, Nizami küç.', grossSalary: 2500 },
  { id: '2', fullName: 'Veli Veliyev', departmentName: 'HR', positionName: 'Specialist', startDate: '2021-06-10', terminationDate: null, employmentStatus: 'Active', finCode: 'AZE7654321', phone: '055-333-2211', address: 'Baki, Azadliq pr.', grossSalary: 1800 },
  { id: '3', fullName: 'Leyla Mammadova', departmentName: 'Maliyyə', positionName: 'Accountant', startDate: '2022-03-01', terminationDate: '2023-12-31', employmentStatus: 'Terminated', finCode: 'AZE9876543', phone: '070-999-8877', address: 'Sumqayit, 2-ci məh.', grossSalary: 2200 },
  { id: '4', fullName: 'Aysel Karimova', departmentName: 'Satış', positionName: 'Sales Rep', startDate: '2023-11-20', terminationDate: null, employmentStatus: 'Active', finCode: 'AZE5554433', phone: '051-444-5566', address: 'Baki, Gənclik', grossSalary: 1200 },
];

export const SYSTEM_KNOWLEDGE = {
  modules: {
    sales: ["Invoices", "Orders", "Reservations", "Returns", "Proforma", "Waybills", "Price Lists"],
    crm: ["Leads", "Opportunities", "Pipelines", "Customers", "Vendors"],
    inventory: ["Consignment", "Stock Adjustment", "Inventory Count", "Warehouses"],
    hr_payroll: ["Employee Management", "Payroll Calculation", "Attendance", "Contracts"],
    finance: ["Bank/Cash", "Tax", "Chart of Accounts", "Fixed Assets"]
  },
  ai_capabilities: ["Data Analysis (Sales, HR)", "Mock Reports", "Limited Automation"]
};

import { 
  Cpu, Zap, Target, Users, Calculator, 
  BarChart4, MessageSquare, Shield, FileText,
  Building2, Layers, Sparkles, Brain, Table, Truck, RefreshCw, ShieldCheck, TrendingUp, Landmark,
  Languages
} from 'lucide-react';

export const BITRIX_INSIGHTS = [
  {
    title: "Intelligence Hub (Martha AI)",
    description: "Bitrix24 2025-dəki 'Martha' kimi, sistem daxilində bütün modulları idarə edən mərkəzi AI köməkçisinin yaradılması.",
    benefit: "Təbii dildə komandalarla ERP idarəetməsi.",
    priority: "High",
    category: "AI & Intelligence",
    categoryIcon: Brain
  },
  {
    title: "Dedicated AI Agents",
    description: "Onboarding, kadr hazırlığı və hesabatlılıq üçün ixtisaslaşmış AI agentlərin (HR Agent, Sales Agent) tətbiqi.",
    benefit: "İnsan resurslarına qənaət və dəqiqlik.",
    priority: "High",
    category: "Automation",
    categoryIcon: Users
  },
  {
    title: "No-Code Automation Studio",
    description: "Bitrix24-ün yeni 'Automation Studio'su kimi, biznes prosesləri üçün sürətli drag-and-drop AI workflow builder.",
    benefit: "Proseslərin 5 dəqiqəyə avtomatlaşdırılması.",
    priority: "Medium",
    category: "Workflow",
    categoryIcon: Zap
  },
  {
    title: "Predictive CRM Insights",
    description: "Müştəri davranışlarını analiz edərək təkrar satış ehtimalı olanları AI vasitəsilə öncədən proqnozlaşdırmaq.",
    benefit: "Satışın 25-30% artımı.",
    priority: "High",
    category: "Sales Intelligence",
    categoryIcon: Target
  },
  {
    title: "Dynamic AI Boards & Tasks",
    description: "Tapşırıqların statik siyahıdan çıxıb, AI tərəfindən idarə olunan 'Board' və 'Chat-style' tapşırıqlara keçidi.",
    benefit: "Komanda daxili koordinasiya sürəti.",
    priority: "Medium",
    category: "Project Management",
    categoryIcon: Table
  }
];

export const ONE_C_INSIGHTS = [
  {
    category: "Accounting Logic",
    title: "Deep Ledger Integration",
    description: "1C-in ən güclü tərəfi müxabirləşmələrin avtomatik formalaşmasıdır. Biz SmartAgent-də 'Hər sənəd bir jurnal yazılışıdır' məntiqini mükəmməlləşdiririk.",
    priority: "High",
    benefit: "Səhvsiz mühasibat",
    categoryIcon: Calculator
  },
  {
    category: "Reporting",
    title: "Configurable Report Builder",
    description: "1C-də istifadəçilər özləri hesabat sütunlarını yığa bilirlər. Bizim 'Aİ Dashboard Qurucu' bu ehtiyacı daha müasir şəkildə qarşılayacaq.",
    priority: "High",
    benefit: "Maksimal fleksibillik",
    categoryIcon: Table
  },
  {
    category: "Compliance",
    title: "Multi-Tax Engine",
    description: "1C yerli qanunvericiliyə çox tez uyğunlaşır. SmartAgent ERP-də AR Vergi Məcəlləsi avtomatik yenilənən modul kimi qurulmalıdır.",
    priority: "Medium",
    benefit: "Qanuni təhlükəsizlik",
    categoryIcon: Shield
  }
];

export const PROJECT_INSIGHTS = [
  {
    category: "Project Management",
    title: "Gantt & Kanban Mastery (Bitrix24 Style)",
    description: "Bitrix24-ün Layihə idarəetməsindəki Gantt chart və Kanban keçid məntiqini SmartAgent-ə tətbiq edirik. Tapşırıqların asılılığı və kritik yol analizi Aİ tərəfindən hesablanır.",
    priority: "High",
    benefit: "Dəqiq zaman planlaması",
    categoryIcon: Table
  },
  {
    category: "Team Coordination",
    title: "Resource Workload Balancing",
    description: "İşçilərin iş yükünü (workload) Bitrix-dəki kimi vizuallaşdırıb, Aİ vasitəsilə boş olan kadrları tapşırıqlara avtomatik təyin edirik.",
    priority: "High",
    benefit: "Effektiv resurs bölgüsü",
    categoryIcon: Users
  },
  {
    category: "Project Communication",
    title: "Contextual Chat Integration",
    description: "Hər tapşırıq daxilində Bitrix-də olduğu kimi müstəqil çat və sənəd dövriyyəsi. Aİ bu çatları analiz edib tapşırıq statusunu avtomatik yeniləyir.",
    priority: "Medium",
    benefit: "Sürətli kommunikasiya",
    categoryIcon: MessageSquare
  }
];

export const APP_INSIGHTS = [
  {
    category: "Ecosystem",
    title: "Marketplace & Apps (Bitrix24 Pattern)",
    description: "Bitrix24 Marketplace-dəki kimi, SmartAgent-də də kənar developerlər üçün Tətbiqlər (Apps) bölməsini genişləndiririk. Aİ tətbiqlərin təhlükəsizlik və performans testini həyata keçirir.",
    priority: "High",
    benefit: "Sonsuz genişlənmə imkanı",
    categoryIcon: Layers
  },
  {
    category: "Integration",
    title: "Seamless External App Sync",
    description: "Telefoniya, WhatsApp və digər xarici tətbiqlərin Bitrix səviyyəsində inteqrasiyası. Bir pəncərədən bütün tətbiqləri idarə etmək üçün 'Aİ App Hub' yaradılır.",
    priority: "Medium",
    benefit: "Vahid ekosistem",
    categoryIcon: Zap
  }
];

export const ECOM_INSIGHTS = [
  {
    category: "Omnichannel",
    title: "Bitrix24 Store Sync Model",
    description: "Bitrix24-ün 'Contact Center' və 'Store' inteqrasiyasını tətbiq edirik. Mağaza, Veb və Sosial Şəbəkələrdən gələn sifarişlər vahid CRM-də cəmlənir.",
    priority: "High",
    benefit: "Stok və Satış dəqiqliyi",
    categoryIcon: Layers
  },
  {
    category: "Customer Experience",
    title: "AI Personalization Patterns",
    description: "Veb Mağaza daxilində Aİ tərəfindən idarə olunan fərdi təkliflər bloku. Müştərinin keçmiş alışlarına əsasən avtomatik kampaniyalar (Bitrix CRM Marketing üslubunda).",
    priority: "Medium",
    benefit: "Loyallığın artması",
    categoryIcon: Sparkles
  },
  {
    category: "Logistics",
    title: "Bitrix Delivery Logic",
    description: "Sifarişin statusuna uyğun olaraq kuryer tətbiqləri ilə birbaşa API inteqrasiyası və çatdırılma vaxtının proqnozlaşdırılması.",
    priority: "High",
    benefit: "Sürətli logistika",
    categoryIcon: Truck
  }
];

export const SYSTEM_ARCH_INSIGHTS = [
  {
    category: "Architecture",
    title: "Modular Micro-Frontend Pattern",
    description: "Sistemin 20+ modulu (CRM-dən Vergilərə qədər) üçün 'Micro-Frontend' yanaşmasını təklif edirik. Bu, hər modulun müstəqil yenilənməsini və sistemin sürətini təmin edir.",
    priority: "High",
    benefit: "Sonsuz genişlənə bilən struktur",
    categoryIcon: Layers
  },
  {
    category: "Navigation UX",
    title: "Predictive Sidebar & Action Center",
    description: "MiniSidebar və Əsas Menyu istifadəçi davranışına görə dinamik dəyişməlidir. 'ADD NEW' mərkəzində ən çox istifadə olunan əməliyyatlar Aİ tərəfindən ən önə gətirilməlidir.",
    priority: "High",
    benefit: "30% daha sürətli naviqasiya",
    categoryIcon: Zap
  },
  {
    category: "Global Search",
    title: "AI-Powered Command Bar",
    description: "'ADD NEW' modalını sadəcə klik mərkəzi yox, həm də 'Command Bar' (Kommanda sətri) halına gətiririk. İstifadəçi bura 'Yeni invoys yarat' yazaraq birbaşa əməliyyata keçə biləcək.",
    priority: "Medium",
    benefit: "Professional istifadəçi təcrübəsi",
    categoryIcon: MessageSquare
  },
  {
    category: "Cross-Module Flow",
    title: "Automated Document Conversion",
    description: "CRM-dən Satışa, Satışdan Mühasibata keçid zamanı sənədlərin avtomatik konvertasiyası (Auto-mapping). Məsələn: Lead -> Invoys -> Müxabirləşmə zənciri.",
    priority: "High",
    benefit: "Məlumat təkrarlanmasının qarşısı",
    categoryIcon: RefreshCw
  }
];

export const COMPLIANCE_INSIGHTS = [
  {
    area: "Legal & Regulatory",
    problem: "Əmək müqavilələrində məzuniyyət günlərinin qeyri-dəqiq hesablanması.",
    riskLevel: "High",
    suggestedFix: "Aİ tərəfindən idarə olunan 'Məzuniyyət Kalkulyatoru' tətbiq edilməli və AR Əmək Məcəlləsinin 114-cü maddəsinə uyğunlaşdırılmalıdır.",
    module: "HR / Payroll",
    legalReference: "AR Əmək Məcəlləsi, Maddə 114",
    categoryIcon: ShieldCheck
  },
  {
    area: "Accounting",
    problem: "Əsas vəsaitlərin amortizasiya normalarının vergi uçotu ilə uyğunsuzluğu.",
    riskLevel: "Medium",
    suggestedFix: "Mühasibat və Vergi amortizasiyasını paralel aparan Aİ Jurnalı yaradılmalıdır.",
    module: "Mühasibat",
    legalReference: "AR Vergi Məcəlləsi, Maddə 114",
    categoryIcon: Calculator
  },
  {
    area: "Compliance",
    problem: "Təchizatçı müqavilələrində GDPR və məlumat təhlükəsizliyi bəndlərinin çatışmazlığı.",
    riskLevel: "Medium",
    suggestedFix: "Aİ Müqavilə Analizatoru vasitəsilə bütün xarici müqavilələrə standart 'Data Protection' bəndi əlavə edilməlidir.",
    module: "Hüquqi Müqavilələr",
    legalReference: "ISO 27001 / GDPR Article 28",
    categoryIcon: Shield
  },
  {
    area: "Financial",
    problem: "Cash Flow proqnozunda debitor borcların gecikmə riskinin nəzərə alınmaması.",
    riskLevel: "High",
    suggestedFix: "Ödəniş tarixçəsinə əsaslanan Aİ Predictive Cash Flow modeli tətbiq edilməlidir.",
    module: "Xəzinə / Maliyyə",
    legalReference: "IFRS 9 (Expected Credit Loss)",
    categoryIcon: TrendingUp
  }
];

export const GOV_INTEGRATION_INSIGHTS = [
  {
    portalName: "Vergi Portalı (e-Tax)",
    useCase: "E-qaimələrin avtomatik yaradılması",
    manualProcess: "Satış sənədlərinin əllə portala daxil edilməsi.",
    automation: "Satış qaiməsi təsdiqləndiyi an Aİ tərəfindən e-qaimə qaralamasının portala göndərilməsi.",
    module: "Satış / Mühasibat",
    integrationType: "API / RPA",
    priority: "High",
    categoryIcon: Landmark
  },
  {
    portalName: "EMAS / e-Sosial",
    useCase: "Əmək müqavilələrinin sinxronizasiyası",
    manualProcess: "İşə qəbul əmrlərinin EMAS-a tək-tək yazılması.",
    automation: "ERP-də işə qəbul prosesi bitdikdə məlumatların avtomatik EMAS-a ötürülməsi.",
    module: "HR / İnsan Resursları",
    integrationType: "Hybrid",
    priority: "High",
    categoryIcon: Users
  },
  {
    portalName: "Dövlət Statistika Komitəsi",
    useCase: "Rüblük hesabatların avtomatlaşdırılması",
    manualProcess: "Data yığılaraq Excell-də Excel-ə köçürülməsi.",
    automation: "ERP datası əsasında rüblük statistika hesabatlarının (məs: 1-əmək) avto-generasiyası.",
    module: "Admin / Hesabat",
    integrationType: "Manual (Auto-Export)",
    priority: "Medium",
    categoryIcon: BarChart4
  },
  {
    portalName: "Gömrük Portalı",
    useCase: "İdxal bəyannamələrinin analizi",
    manualProcess: "Gömrük rəsmiləşdirilməsi sənədlərinin əllə uçota alınması.",
    automation: "Gömrük bəyannamələrinin (QBT) Aİ tərəfindən oxunaraq maya dəyərinə avto-paylanması.",
    module: "Təchizat / Stok",
    integrationType: "Hybrid (OCR + API)",
    priority: "High",
    categoryIcon: Shield
  }
];

export const DASHBOARD_STRATEGY = [
  {
    title: "Google Looker Style Visualization",
    description: "Dashboard-larda Google Looker-in 'Exploration' məntiqini tətbiq edirik. İstifadəçi daxil olan datanı özü sərbəst şəkildə fərqli ölçülərə (dimensions) görə qruplaşdıra bilir.",
    icon: BarChart4
  },
  {
    title: "Microsoft Power BI DAX Logic",
    description: "Mürəkkəb hesablamalar üçün Power BI-ın DAX (Data Analysis Expressions) məntiqinə bənzər 'Aİ Formula Editor' tətbiq edilir. Bu, ən mürəkkəb KPI-ları hesablamağa imkan verir.",
    icon: Calculator
  }
];

export const INDUSTRY_SUGGESTIONS = [
  {
    sector: 'Gym',
    problem: 'Üzvlük müddəti bitən müştərilərin izlənilməsi çətinliyi.',
    suggestedFeature: 'Membership Expiration Tracking & Auto-Alerts',
    module: 'Membership',
    priority: 'High',
    description: 'Müştərinin üzvlüyü bitməzdən 3 gün əvvəl avtomatik SMS və ya push bildiriş göndərən sistem.'
  },
  {
    sector: 'HoReCa',
    problem: 'Mətbəx sifarişlərinin gecikməsi və itməsi.',
    suggestedFeature: 'Kitchen Order Display System (KDS)',
    module: 'Sales/Kitchen',
    priority: 'High',
    description: 'Sifarişlərin kağız yerinə birbaşa mətbəxdəki ekranda görünməsi və hazırlıq vaxtının izlənilməsi.'
  },
  {
    sector: 'Retail',
    problem: 'Stok qalıqlarının qeyri-dəqiq olması və məhsul çatışmazlığı.',
    suggestedFeature: 'Auto-Reorder Point System',
    module: 'Inventory',
    priority: 'High',
    description: 'Məhsul sayı müəyyən limitdən aşağı düşdükdə təchizatçıya avtomatik sifariş sorğusu göndərilməsi.'
  },
  {
    sector: 'Education',
    problem: 'Tələbə davamiyyətinin valideynlərə gec xəbər verilməsi.',
    suggestedFeature: 'Parent Notification Portal',
    module: 'Attendance',
    priority: 'Medium',
    description: 'Tələbə dərsə gəlmədikdə valideynin mobil tətbiqinə anında bildiriş göndərilməsi.'
  }
];

export const REPORT_CENTER_PROPOSALS = [
  {
    category: "Maliyyə Hesabatları",
    icon: Calculator,
    subSections: [
      { 
        name: "Ağıllı P&L (Mənfəət və Zərər)", 
        feature: "AI-driven xərc proqnozlaşdırma",
        functionality: "Maliyyə xərclərini son 12 ayın trendinə əsasən analiz edir və növbəti ay üçün büdcə təklifi verir."
      },
      { 
        name: "Pul Axını (Predictive Cash Flow)", 
        feature: "Likvidlik anomaliya təsbit",
        functionality: "Debitor borcların ödənilmə ehtimalını nəzərə alaraq kassa boşluqlarını (cash gap) öncədən xəbər verir."
      }
    ]
  },
  {
    category: "Satış və CRM Analitikası",
    icon: Target,
    subSections: [
      { 
        name: "Müştəri Rentabelliyi (CLV)", 
        feature: "Lifetime Value analizi",
        functionality: "Hansı müştərilərin uzunmüddətli perspektivdə daha gəlirli olduğunu və marketinq büdcəsinin hara yönəldilməli olduğunu göstərir."
      },
      { 
        name: "Satış Hunisi Konversiyası", 
        feature: "AI Sövdələşmə Skorinqi",
        functionality: "Hər bir satış fürsətinin bağlanma ehtimalını (0-100%) avtomatik hesablayır."
      }
    ]
  },
  {
    category: "Anbar və Logistika",
    icon: Layers,
    subSections: [
      { 
        name: "ABC/XYZ Analizi", 
        feature: "Stok Optimallaşdırma",
        functionality: "Malları dəyər və dövriyyə sürətinə görə qruplaşdırır, 'ölü stok' riskini minimuma endirir."
      },
      { 
        name: "Təchizat Zənciri Riskləri", 
        feature: "Gecikmə Proqnozu",
        functionality: "Təchizatçıların keçmiş performansına əsasən malların anbara çatdırılma vaxtındakı kənarlaşmaları bildirir."
      }
    ]
  },
  {
    category: "HR və Kadr Analitikası",
    icon: Users,
    subSections: [
      { 
        name: "İşçi Bağlılığı və Turnover", 
        feature: "Retention Risk Score",
        functionality: "Davamiyyət və performans datasına əsasən işdən çıxma riski olan əsas kadrları öncədən müəyyən edir."
      },
      { 
        name: "Əməkhaqqı Benchmarking", 
        feature: "Bazar Qiymət Müqayisəsi",
        functionality: "Daxili maaşları bazar ortalaması ilə müqayisə edərək HR strategiyası üçün təkliflər verir."
      }
    ]
  }
];

export const maskFIN = (val: string) => `AZE****${val.slice(-3)}`;
export const maskPhone = (val: string) => {
  const parts = val.split('-');
  if (parts.length < 3) return val;
  return `${parts[0]}-***-${parts[2]}`;
};

export const isEmployeeActiveInPeriod = (emp: HRMock, periodStart: Date, periodEnd: Date) => {
  const start = new Date(emp.startDate);
  const termination = emp.terminationDate ? new Date(emp.terminationDate) : null;
  
  // Active if started before or during period AND (not terminated OR terminated after period starts)
  return start <= periodEnd && (!termination || termination >= periodStart);
};

export const LOCALIZATION_INSIGHTS = {
  translatable: [
    { area: 'UX/UI Labels', fields: ['Naviqasiya menyusu', 'Düymə mətnləri', 'Tooltip-lər'], reason: 'İstifadəçi təcrübəsini yerli dildə təmin etmək.' },
    { area: 'Məhsul Katalogu', fields: ['Məhsul adı', 'Kateqoriya', 'Təsvir'], reason: 'Beynəlxalq satış və axtarış sistemləri üçün.' },
    { area: 'Analitik Başlıqlar', fields: ['Dashboard adları', 'KPI etiketləri'], reason: 'Hesabatların hər dildə aydın oxunması.' }
  ],
  nonTranslatable: [
    { area: 'Maliyyə Sənədləri', fields: ['Invoice No', 'Bank Hesabları', 'Məbləğ'], reason: 'Hüquqi və audit bütövlüyünü qorumaq.' },
    { area: 'Vergi Dataları', fields: ['VÖEN', 'FIN Code', 'Tax Code'], reason: 'Rəsmi dövlət identifikatorları dəyişdirilməzdir.' },
    { area: 'Sistem Identifikatorları', fields: ['UUID', 'Primary Keys', 'Slug'], reason: 'Texniki inteqrasiyaların qırılmaması üçün.' }
  ],
  conditional: [
    { area: 'Müştəri Məlumatları', rule: 'Əgər beynəlxalq müştəridirsə transliterasiya edilə bilər.' },
    { area: 'Ünvanlar', rule: 'Yerli poçt xidmətləri üçün original dildə saxlanılması tövsiyədir.' }
  ]
};

export const processQuery = async (input: string) => {
  const lowInput = input.toLowerCase();
  
  // Translation Advice Intent
  if (lowInput.includes('tərcümə') || lowInput.includes('translate') || lowInput.includes('dil') || lowInput.includes('language')) {
    return {
      type: 'suggestion',
      summary: "Sistemin lokalizasiya strategiyası analiz edildi. Aşağıdakı sahələrin tərcümə olunması və ya orijinal saxlanılması tövsiyə olunur:",
      recommendations: [
        ...LOCALIZATION_INSIGHTS.translatable.map(i => ({ title: `Tərcümə Edilməli: ${i.area}`, description: i.reason, category: 'Lokalizasiya', categoryIcon: Languages, priority: 'High' })),
        ...LOCALIZATION_INSIGHTS.nonTranslatable.map(i => ({ title: `Orijinal Saxlanmalı: ${i.area}`, description: i.reason, category: 'Təhlükəsizlik', categoryIcon: Shield, priority: 'Critical' }))
      ],
      metadata: {
        source: 'localization_engine',
        confidence: 'high'
      }
    };
  }
  if (lowInput.includes('hesabat') || lowInput.includes('report') || lowInput.includes('mərkəz') || lowInput.includes('center') || lowInput.includes('araşdırma')) {
    if (lowInput.includes('hesabat') || lowInput.includes('mərkəz') || lowInput.includes('center')) {
      return {
        type: 'report_proposal',
        summary: "Aİ Hesabat Mərkəzi üçün hazırladığım struktur və funksionallıq təklifləri hazırdır. Bu hesabatlar sadəcə datanı göstərmir, həm də gələcək proqnozlar verir.",
        sections: REPORT_CENTER_PROPOSALS,
        metadata: {
          source: 'ai_research_engine',
          focus: 'intelligence_reporting',
          confidence: 'high'
        }
      };
    }

    if (lowInput.includes('bitrix') || lowInput.includes('təklif') || lowInput.includes('analiz') || lowInput.includes('inkişaf') || lowInput.includes('industry') || lowInput.includes('sektor')) {
      const isSectorSpecific = lowInput.includes('gym') || lowInput.includes('horeca') || lowInput.includes('retail') || lowInput.includes('məktəb') || lowInput.includes('təhsil');
      
      return {
        type: 'suggestion',
        summary: isSectorSpecific 
          ? "Seçdiyiniz sektor üzrə biznes inkişaf təkliflərim hazırdər."
          : "Bitrix24 analizi və müxtəlif sektorlar üçün SmartAgent ERP təkliflərim hazırdır.",
        recommendations: isSectorSpecific 
          ? INDUSTRY_SUGGESTIONS.filter(s => lowInput.includes(s.sector.toLowerCase()))
          : [...BITRIX_INSIGHTS, ...INDUSTRY_SUGGESTIONS.slice(0, 2)],
        metadata: {
          source: 'industry_intelligence',
          permission_status: 'global',
          confidence: 'high'
        }
      };
    }
  }

  // 2. Intent Mapping
  let module: 'sales' | 'hr' | null = null;
  const isSales = /satı(ş|s)|borc|invoice|qaimə|qalıq/.test(lowInput);
  const isHR = /işçi|isci|isçi|hr|tabel|şöbə|sobe|xərc|xerc|maa(ş|s)|salary|supergross|cost/.test(lowInput);

  if (isSales) {
    module = 'sales';
  } else if (isHR) {
    module = 'hr';
  }

  if (!module) return { error: 'INTENT_NOT_FOUND' };

  // 2. Clarification Check (Simulated)
  const hasPeriod = lowInput.includes('mart') || lowInput.includes('aprel') || lowInput.includes('ay');
  if (!hasPeriod && !lowInput.includes('bu ay') && !lowInput.includes('keçən ay')) {
    return { error: 'CLARIFICATION_REQUIRED' };
  }

  // Determine actual dates
  let startDate = new Date('2026-04-01');
  let endDate = new Date('2026-04-30');
  let periodLabel = 'Aprel 2026';

  if (lowInput.includes('mart')) {
    startDate = new Date('2026-03-01');
    endDate = new Date('2026-03-31');
    periodLabel = 'Mart 2026';
  }

  // 3-5. Permission/Isolation/Contracts (Simulated)
  
  // 6. Execution
  if (module === 'sales') {
    const data = SALES_MOCK.filter(inv => {
      const d = new Date(inv.date);
      return d >= startDate && d <= endDate;
    });

    if (data.length === 0) return { error: 'EMPTY_RESULT', module, period: periodLabel };

    let summary = '';
    const totalOutstanding = data.reduce((sum, inv) => sum + (inv.totalPrincipal - inv.paidPrincipal) + (inv.totalVat - inv.paidVat), 0);
    
    if (lowInput.includes('borc')) {
      summary = `${periodLabel} üzrə toplam qalıq borc ${totalOutstanding.toLocaleString()} AZN təşkil edir.`;
    } else {
      summary = `${periodLabel} üzrə ${data.length} satış fakturası qeydə alınıb.`;
    }

    return {
      type: 'analysis',
      module: 'Sales',
      summary,
      table: {
        headers: ['Qaimə №', 'Müştəri', 'Cəmi', 'Ödənilən', 'Qalıq (P)', 'Qalıq (VAT)', 'Status'],
        rows: data.map(inv => [
          inv.invoiceNo,
          inv.customerName,
          (inv.totalPrincipal + inv.totalVat).toLocaleString(),
          (inv.paidPrincipal + inv.paidVat).toLocaleString(),
          (inv.totalPrincipal - inv.paidPrincipal).toLocaleString(),
          (inv.totalVat - inv.paidVat).toLocaleString(),
          inv.status === 'PAID' ? 'Ödənilib' : inv.status === 'PARTIAL' ? 'Qismən' : 'Ödənilməyib'
        ])
      },
      metadata: {
        source: 'data',
        permission_status: 'full',
        confidence: 'high'
      },
      debug: {
        pattern: 'get_list',
        filters: { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] }
      }
    };
  }

  if (module === 'hr') {
    const data = HR_MOCK.filter(emp => isEmployeeActiveInPeriod(emp, startDate, endDate));
    
    if (data.length === 0) return { error: 'EMPTY_RESULT', module, period: periodLabel };

    let summary = '';
    const totalGross = data.reduce((sum, emp) => sum + emp.grossSalary, 0);
    // Supergross simulation: Gross + 22% (Employer Social) + 0.5% (Unemployment)
    const totalSuperGross = totalGross * 1.225;

    if (/xərc|xerc|supergross|maa(ş|s)|cost/.test(lowInput)) {
      summary = `${periodLabel} dövrü üzrə ${data.length} aktiv işçinin toplam supergross xərci ${totalSuperGross.toLocaleString()} AZN təşkil edir.`;
    } else {
      summary = `${periodLabel} dövründə sistemdə ${data.length} aktiv işçi var.`;
    }

    return {
      type: 'analysis',
      module: 'HR',
      summary,
      table: {
        headers: ['Ad Soyad', 'Şöbə', 'Vəzifə', 'Başlama Tarixi', 'FIN', 'Telefon'],
        rows: data.map(emp => [
          emp.fullName,
          emp.departmentName,
          emp.positionName,
          emp.startDate,
          maskFIN(emp.finCode),
          maskPhone(emp.phone)
        ])
      },
      metadata: {
        source: 'data',
        permission_status: 'masked',
        confidence: 'high'
      },
      debug: {
        pattern: 'get_aggregates',
        filters: { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] }
      }
    };
  }

  return { error: 'INTENT_NOT_FOUND' };
};
