export interface SectorTemplate {
  sector: string;
  industry: string;
  icon: string;
  modules: string[];
  features: string[];
  kpis: string[];
  default_settings: Record<string, any>;
  description: string;
}

export const SECTOR_TEMPLATES: Record<string, SectorTemplate> = {
  retail: {
    sector: 'Retail',
    industry: 'Pərakəndə Satış',
    icon: 'ShoppingCart',
    modules: ['crm', 'sales', 'inventory', 'finance'],
    features: ['barcode_scanning', 'point_of_sale', 'loyalty_program', 'inventory_tracking'],
    kpis: ['Daily Sales', 'Stock Turnover', 'Customer Retention'],
    default_settings: {
      vat_rate: 18,
      currency: 'AZN',
      stock_method: 'FIFO'
    },
    description: 'Mağaza və pərakəndə satış nöqtələri üçün tam idarəetmə sistemi.'
  },
  gym: {
    sector: 'Gym',
    industry: 'Fitness və İdman',
    icon: 'Activity',
    modules: ['crm', 'membership', 'attendance', 'payments', 'hr'],
    features: ['membership_tracking', 'qr_checkin', 'personal_training_booking', 'recurring_billing'],
    kpis: ['Active Members', 'Churn Rate', 'Attendance Peak Hours'],
    default_settings: {
      membership_types: ['Daily', 'Monthly', 'Annual'],
      auto_renewal: true
    },
    description: 'İdman zalları və üzvlük əsaslı bizneslər üçün abunəlik və davamiyyət idarəetməsi.'
  },
  horeca: {
    sector: 'HoReCa',
    industry: 'Restoran və Hotel',
    icon: 'Coffee',
    modules: ['crm', 'sales', 'inventory', 'booking', 'finance'],
    features: ['table_reservation', 'kitchen_order_tracking', 'menu_management', 'recipe_costing'],
    kpis: ['Table Turnover', 'Food Cost %', 'Average Check'],
    default_settings: {
      service_charge: 10,
      kitchen_printers: true
    },
    description: 'Restoran, kafe və otellər üçün sifariş, mətbəx və rezervasiya sistemi.'
  },
  wholesale: {
    sector: 'Wholesale',
    industry: 'Topdan Satış',
    icon: 'Package',
    modules: ['sales', 'inventory', 'purchase', 'finance', 'logistics'],
    features: ['bulk_pricing', 'credit_limit_tracking', 'warehouse_zones', 'route_planning'],
    kpis: ['Order Fulfillment Rate', 'Accounts Receivable Aging', 'Inventory Accuracy'],
    default_settings: {
      wholesale_discounts: true,
      min_order_qty: 10
    },
    description: 'Böyük həcmli satış və mürəkkəb anbar logistikası olan şirkətlər üçün.'
  },
  education: {
    sector: 'Education',
    industry: 'Təhsil (Məktəb/Kurs)',
    icon: 'GraduationCap',
    modules: ['crm', 'hr', 'finance', 'attendance'],
    features: ['student_attendance', 'parent_notification', 'course_scheduling', 'grade_tracking'],
    kpis: ['Enrollment Growth', 'Teacher Load', 'Student Success Rate'],
    default_settings: {
      academic_year: '2024-2025',
      grading_system: 'A-F'
    },
    description: 'Tədris mərkəzləri, məktəblər və kurslar üçün tələbə və cədvəl idarəetməsi.'
  }
};
