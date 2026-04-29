import { 
  LayoutDashboard, Users, ShoppingCart, PackageOpen, 
  Factory, Calculator, Landmark, Receipt, 
  CircleDollarSign, Box, FileText, 
  MessageSquare, Shield, Truck,
  Target, Layers, Settings, Banknote, PackagePlus,
  Briefcase, Clock, Building2, CalendarClock, Bot, BarChart4,
  Globe, Sparkles, Languages, TrendingUp, BookOpen
} from 'lucide-react';
import React from 'react';

export interface SidebarItem {
  name: string;
  keyHint?: string;
  icon?: React.ElementType;
  path?: string;
  subItems?: SidebarItem[]; 
  isHeader?: boolean;
}

export const menuConfig: SidebarItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/', keyHint: 'D' },
  
  { isHeader: true, name: 'Əsas Panellər' },
  { 
    name: 'S-AI Agent', icon: BarChart4, keyHint: 'A',
    subItems: [
      { name: 'AI Chat (General)', path: '/ai-agent', keyHint: 'C' },
      { name: 'ERP Setup Assistant', path: '/ai/setup-assistant', keyHint: 'S' },
      { name: 'Avtomatlaşdırma (RPA)', path: '/ai/automation', keyHint: 'R' }
    ]
  },
  {
    name: 'ERP Admin Panel', icon: Settings, keyHint: 'M',
    subItems: [
      { name: 'Aİ İnkişaf Köməkçisi', path: '/ai/dev-assistant', keyHint: 'D' },
      { name: 'Aİ Şablon Qurucu', path: '/ai/template-builder', keyHint: 'T' },
      { name: 'Aİ Strateji Məsləhətçi', path: '/ai/strategic-advisor', icon: TrendingUp },
      { name: 'Aİ Tərcümə Məsləhətçisi', path: '/ai/translation-advisor', icon: Languages },
      { name: 'Aİ Öyrənmə Laboratoriyası', path: '/ai/learning-lab', icon: BookOpen },
      { name: 'Yol Xəritəsi (Roadmap)', path: '/ai/roadmap', keyHint: 'Y' },
      { name: 'Industry Insights', path: '/ai/industry-insights', keyHint: 'I' },
      { name: 'Bitrix24 Analizi', path: '/ai/bitrix-analysis', keyHint: 'B' },
      { name: '1C Analizi', path: '/ai/1c-analysis', keyHint: '1' },
      { name: 'Veb Mağaza Analizi', path: '/ai/ecom-analysis', keyHint: 'E' },
      { name: 'Layihələr Analizi', path: '/ai/project-analysis', keyHint: 'P' },
      { name: 'Tətbiqlər Analizi', path: '/ai/app-analysis', keyHint: 'A' },
      { name: 'Ümumi Sistem Analizi', path: '/ai/system-analysis', keyHint: 'S' },
      { name: 'Compliance & Intel Hub', path: '/ai/compliance-hub', keyHint: 'C' },
      { name: 'Dövlət İnteqrasiyaları', path: '/ai/gov-integrations', keyHint: 'G' },
      { name: 'Aİ Hesabat Mərkəzi', path: '/ai/report-center', keyHint: 'H' },
      { name: 'Aİ Admin Analizi', path: '/ai/admin-analysis', icon: Sparkles },
      { name: 'Helpdesk İdarəetməsi', path: '/admin/helpdesk', keyHint: 'H' },
      { name: 'Aİ Dashboard Qurucu', path: '/ai/dashboard-creator', keyHint: 'D' }
    ]
  },
  { 
    name: 'Layihələr', icon: Layers, keyHint: 'L',
    subItems: [
      { name: 'Tapşırıqlar', path: '/projects/tasks', keyHint: 'T' },
      { name: 'İş qrupları', path: '/projects/workgroups', keyHint: 'W' },
      { name: 'Layihə Dashboard', path: '/projects/dashboard', keyHint: 'D' },
      { name: 'Layihə Reyestri', path: '/projects/list', keyHint: 'R' },
      { name: 'Kanban Lövhəsi', path: '/projects/kanban', keyHint: 'K' },
      { name: 'Gantt Chart', path: '/projects/gantt', keyHint: 'G' }
    ]
  },
  {
    name: 'Saytlar və Mağaza', icon: Globe, keyHint: 'W',
    subItems: [
      { name: 'Saytların Reyestri', path: '/web/sites', keyHint: 'S' },
      { name: 'Onlayn Mağazalar', path: '/web/stores', keyHint: 'M' },
      { name: 'Məhsul Kataloqu (Veb)', path: '/web/catalog', keyHint: 'K' },
      { name: 'Veb Sifarişləri', path: '/web/orders', keyHint: 'O' },
      { name: 'Veb Analitika', path: '/web/analytics', keyHint: 'A' },
      { name: 'Tənzimləmələr', path: '/web/settings', keyHint: 'T' }
    ]
  },
  { 
    name: 'Tətbiqlər', icon: MessageSquare, keyHint: 'T',
    subItems: [
      { name: 'Lenta', path: '/app/feed', keyHint: 'L' },
      { name: 'Çat', path: '/app/chat', keyHint: 'C' },
      { name: 'Təqvim', path: '/app/calendar', keyHint: 'T' },
      { name: 'E-poçt', path: '/app/email', keyHint: 'E' },
      { name: 'Fayl Meneceri', path: '/app/files', keyHint: 'F' },
      { name: 'Lövhələr', path: '/app/boards', keyHint: 'B' },
      { name: 'Collabs', path: '/app/collabs', keyHint: 'K' },
      { name: 'Rezervasiya', path: '/app/booking', keyHint: 'B' },
      { name: 'Helpdesk', path: '/app/helpdesk', keyHint: 'H' }
    ]
  },

  { isHeader: true, name: 'Biznes Əməliyyatları' },
  { 
    name: 'CRM', icon: Target, keyHint: 'C',
    subItems: [
      { name: 'Müştəri Reyestri', path: '/crm/customers', keyHint: 'R' },
      { name: 'Potensial Müştərilər', path: '/crm/leads', keyHint: 'L' },
      { name: 'Sövdələşmələr', path: '/crm/opportunities', keyHint: 'S' },
      { name: 'Satış Hunisi', path: '/crm/pipeline', keyHint: 'H' }
    ]
  },
  { 
    name: 'Satış', icon: ShoppingCart, keyHint: 'S',
    subItems: [
      { name: 'Satış Dashboard', path: '/sales/dashboard', keyHint: 'D' },
      { name: 'Satış Reyestri/İnvoyslar', path: '/sales/list', keyHint: 'R' },
      { name: 'Sifarişlərin Reyestri', path: '/sales/orders', keyHint: 'S' },
      { name: 'Qiymət Siyahıları', path: '/sales/pricelist', keyHint: 'Q' },
      { name: 'Bron müraciətləri', path: '/sales/reservations', keyHint: 'B' },
      { name: 'Satışdan Geri qaytarmalar', path: '/sales/returns', keyHint: 'G' }
    ]
  },
  { 
    name: 'Təchizat və Daşıma', icon: Truck, keyHint: 'T',
    subItems: [
      { name: 'Təchizatçı Reyestri', path: '/purchase/vendors', keyHint: 'T' },
      { name: 'İlkin Tələblər (Internal)', path: '/purchase/requests', keyHint: 'I' },
      { name: 'Satınalma Sorğuları (PR)', path: '/purchase/requisitions', keyHint: 'O' },
      { name: 'Qiymət Təklifləri (RFQ)', path: '/purchase/rfq', keyHint: 'Q' },
      { name: 'Satınalma Sifarişləri', path: '/purchase/orders', keyHint: 'S' },
      { name: 'Alış Reyestri və Qaimələr', path: '/purchase/invoice/list', keyHint: 'A' },
      { name: 'Alışdan Geri Qaytarmalar', path: '/purchase/return/invoice/list', keyHint: 'G' },
      { name: 'Maya Dəyəri Əlavələri', path: '/purchase/landed-cost', keyHint: 'D' }
    ]
  },
  { 
    name: 'Anbar və Stok', icon: PackageOpen, keyHint: 'A',
    subItems: [
      { name: 'Stok Reyestri', path: '/inventory', keyHint: 'R' },
      { name: 'Nomenklatura', path: '/inventory/nomenclature', keyHint: 'N' },
      { name: 'Anbarların Siyahısı', path: '/inventory/warehouses', keyHint: 'S' },
      { name: 'Stok Hərəkətləri', path: '/inventory/moves', keyHint: 'H' },
      { name: 'Konsiqnasiya', path: '/inventory/consignment', keyHint: 'K' },
      { name: 'Sayım və Düzəlişlər', path: '/inventory/adjustments', keyHint: 'D' }
    ]
  },
  { 
    name: 'İstehsalat', icon: Factory, keyHint: 'I',
    subItems: [
      { name: 'İstehsalat Reyestri', path: '/production', keyHint: 'R' },
      { name: 'Məhsul Resepturası', path: '/production/bom', keyHint: 'M' },
      { name: 'İstehsalat Sifarişi', path: '/production/order/create', keyHint: 'S' },
      { name: 'İstehsal Jurnalı', path: '/production/journal', keyHint: 'J' }
    ]
  },
  { 
    name: 'Hüquqi Müqavilələr', icon: FileText, keyHint: 'G',
    subItems: [
      { name: 'Müqavilə Reyestri', path: '/contracts', keyHint: 'R' },
      { name: 'Qiymət Razılaşmaları', path: '/contracts/price-agreements', keyHint: 'Q' }
    ]
  },

  { isHeader: true, name: 'Maliyyə və Uçot', keyHint: 'M' },
  { 
    name: 'Mühasibat', icon: Calculator, keyHint: 'M',
    subItems: [
      { name: 'Hesab Planı', path: '/finance/chart-of-accounts', keyHint: 'H' },
      { name: 'Müxabirləşmə Reyestri', path: '/finance/journal/list', keyHint: 'M' },
      { name: 'Baş Kitab', path: '/finance/general-ledger', keyHint: 'B' },
      { name: 'Sınaq Balansı', path: '/finance/trial-balance', keyHint: 'S' },
      { name: 'Mənfəət və Zərər', path: '/finance/profit-and-loss', keyHint: 'P' },
      { name: 'Balans Hesabatı', path: '/finance/balance-sheet', keyHint: 'L' },
      { name: 'Pul Axını', path: '/finance/cash-flow', keyHint: 'A' },
      { name: 'Kontragent Hesablaşmaları', path: '/finance/settlements', keyHint: 'K' },
      { name: 'Debitor Aging', path: '/finance/ar-aging', keyHint: 'D' },
      { name: 'Kreditor Reyestri', path: '/finance/ap-registry', keyHint: 'R' },
      { name: 'Jurnal Yazılışları', path: '/finance/journal/create', keyHint: 'J' },
      { name: 'Kurs Fərqi Hesabatı', path: '/finance/fx-report', keyHint: 'F' },
      { name: 'Ay Bağlanışı', path: '/finance/currency-revaluation', keyHint: 'B' }
    ] 
  },
  { 
    name: 'Xəzinə', icon: Landmark, keyHint: 'X',
    subItems: [
      { name: 'Xəzinə Hesabları', path: '/bank/registry', keyHint: 'H' },
      { name: 'Məzənnə', path: '/finance/currencies', keyHint: 'M' },
      { name: 'Pul Hərəkətləri', path: '/bank/transactions', keyHint: 'P' },
      { name: 'Qalıqlar və Dövriyyələr', path: '/bank/reports', keyHint: 'Q' },
      { name: 'Tənzimləmələr', path: '/bank/settings', keyHint: 'Z' }
    ]
  },
  { name: 'Xərclər', icon: CircleDollarSign, path: '/finance/expenses', keyHint: 'E' },
  { 
    name: 'Vergilər', icon: Receipt, keyHint: 'V',
    subItems: [
      { name: 'Vergi Paneli (Dashboard)', path: '/tax', keyHint: 'P' },
      { name: 'ƏDV İdarəedilməsi', path: '/tax/vat', keyHint: 'V' },
      { name: 'Vergi Bəyannamələri', path: '/tax/declarations', keyHint: 'B' },
      { name: 'Əmlak və Torpaq Vergisi', path: '/tax/assets', keyHint: 'A' },
      { name: 'Parametrlər və Qaydalar', path: '/tax/config', keyHint: 'C' }
    ]
  },

  { isHeader: true, name: 'HR', keyHint: 'H' },
  { 
    name: 'İnsan Resursları', icon: Users, keyHint: 'H',
    subItems: [
      { name: 'İşçilər Reyestri', path: '/hr/employees', keyHint: 'I' },
      { 
        name: 'Kadr Əməliyyatları', icon: Briefcase, keyHint: 'K',
        subItems: [
          { name: 'İşə Qəbul Reyestri', path: '/hr/hiring', keyHint: 'I' },
          { name: 'Məzuniyyət və Ezamiyyətlər', path: '/hr/leaves', keyHint: 'M' },
          { name: 'Xəstəlik Vərəqələri', path: '/hr/sick-leaves', keyHint: 'X' },
          { name: 'İşdən Azad Etmə (Xitam)', path: '/hr/terminations', keyHint: 'X' }
        ]
      },
      { 
        name: 'Davamiyyət və Tabel', icon: Clock, keyHint: 'D',
        subItems: [
          { name: 'Davamiyyət Jurnalı', path: '/hr/attendance-log', keyHint: 'D' },
          { name: 'Aylıq Tabel', path: '/hr/attendance', keyHint: 'T' },
          { name: 'İşçi İcazələri', path: '/hr/permissions', keyHint: 'I' },
          { name: 'Biometrik Reyestr', path: '/hr/face-registry', keyHint: 'B' }
        ]
      },
      { 
        name: 'Struktur və Tənzimləmələr', icon: Building2, keyHint: 'S',
        subItems: [
          { name: 'Şöbələr və Struktur', path: '/hr/departments', keyHint: 'S' },
          { name: 'Vəzifələr (Ştatlar)', path: '/hr/positions', keyHint: 'V' },
          { name: 'İş Rejimləri (Şiftlər)', path: '/hr/shifts', keyHint: 'L' },
          { name: 'İstehsalat Təqvimi', path: '/hr/calendar', keyHint: 'I' }
        ]
      }
    ]
  },
  { 
    name: 'Əmək Haqqı', icon: Banknote, keyHint: 'P',
    subItems: [
      { name: 'Maaş Hesablanması', path: '/payroll/calculation/create', keyHint: 'H' },
      { name: 'Maaş Cədvəlləri', path: '/payroll/tables', keyHint: 'C' },
      { 
        name: 'KPİ və Mükafatlar', keyHint: 'K',
        subItems: [
          { name: 'KPİ Siyahısı', path: '/payroll/kpi', keyHint: 'P' },
          { name: 'Mükafat Siyahısı', path: '/payroll/bonus', keyHint: 'M' }
        ]
      },
      { name: 'Payroll Kalkulyatoru', path: '/payroll/calculator', keyHint: 'K' }
    ]
  },

  { isHeader: true, name: 'Vəsaitlər', keyHint: 'V' },
  { 
    name: 'Əsas Vəsaitlər', icon: Box, keyHint: 'B',
    subItems: [
      { name: 'ƏV Reyestri', path: '/assets', keyHint: 'R' },
      { name: 'Yeni Alınma', path: '/assets/purchase/create', keyHint: 'A' },
      { name: 'İstismara Verilmə', path: '/assets/commissioning/create', keyHint: 'I' },
      { name: 'Amortizasiya Reyestri', path: '/assets/maintenance', keyHint: 'M' }
    ]
  },
  { 
    name: 'ATƏ', icon: PackagePlus, keyHint: 'W',
    subItems: [
      { name: 'ATƏ Reyestri', path: '/lva', keyHint: 'R' },
      { name: 'Yeni Alınma', path: '/lva/purchase/create', keyHint: 'A' },
      { name: 'İstifadəyə Buraxılış', path: '/lva/issue/create', keyHint: 'I' }
    ]
  },

  { isHeader: true, name: 'Admin və Ayarlar' },
  { name: 'Aİ Admin Köməkçisi', path: '/ai/admin-assistant', icon: Sparkles, keyHint: 'A' },
  { 
    name: 'İstifadəçilər', icon: Shield, keyHint: 'U',
    subItems: [
      { name: 'İşçilər siyahısı', path: '/users', keyHint: 'S' },
      { name: 'Rollar və Səlahiyyətlər', path: '/roles-permissions', keyHint: 'R' }
    ]
  },
  { name: 'Sistem Ayarları', icon: Settings, path: '/settings', keyHint: 'Z' }
];
