import React, { createContext, useContext, useState, useEffect } from 'react';
import { localizationEngine } from '../utils/LocalizationEngine';
import type { Language } from '../utils/LocalizationEngine';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateData: (entity: string, entityId: string, field: string, value: any) => { value: any, isTranslated: boolean, original: any };
  addTranslation: (entity: string, entityId: string, field: string, lang: Language, value: string) => void;
}

// Static UI Translations (i18n)
const uiStrings: Record<Language, Record<string, string>> = {
  az: {
    'nav.dashboard': 'İdarəetmə Paneli',
    'nav.projects': 'Layihələr',
    'nav.sites': 'Saytlar və Mağaza',
    'nav.apps': 'Tətbiqlər',
    'nav.s-ai_agent': 'S-AI Agent',
    'nav.erp_admin_panel_bölməsi': 'ERP Admin Panel Bölməsi',
    'nav.ai_i̇nkişaf_köməkçisi': 'Aİ İnkişaf Köməkçisi',
    'nav.ai_şablon_qurucu': 'Aİ Şablon Qurucu',
    'nav.ai_strateji_məsləhətçi': 'Aİ Strateji Məsləhətçi',
    'nav.ai_tərcümə_məsləhətçisi': 'Aİ Tərcümə Məsləhətçisi',
    'nav.ai_öyrənmə_laboratoriyası': 'Aİ Öyrənmə Laboratoriyası',
    'nav.yol_xəritəsi_(roadmap)': 'Yol Xəritəsi (Roadmap)',
    'nav.industry_insights': 'Sektor Analizləri (Industry)',
    'nav.bitrix24_analizi': 'Bitrix24 Analizi',
    'nav.1c_analizi': '1C Analizi',
    'nav.veb_mağaza_analizi': 'Veb Mağaza Analizi',
    'nav.layihələr_analizi': 'Layihələr Analizi',
    'nav.tətbiqlər_analizi': 'Tətbiqlər Analizi',
    'nav.ümumi_sistem_analizi': 'Ümumi Sistem Analizi',
    'nav.compliance_&_intel_hub': 'Uyğunluq və Kəşfiyyat (Hub)',
    'nav.dövlət_inteqrasiyaları': 'Dövlət İnteqrasiyaları',
    'nav.ai_hesabat_mərkəzi': 'Aİ Hesabat Mərkəzi',
    'nav.ai_admin_analizi': 'Aİ Admin Analizi',
    'nav.ai_dashboard_qurucu': 'Aİ Dashboard Qurucu',
    'nav.layihələr': 'Layihələr',
    'nav.saytlar_və_mağaza': 'Saytlar və Mağaza',
    'nav.crm': 'CRM',
    'nav.satış': 'Satış',
    'nav.təchizat_və_daşıma': 'Təchizat və Daşıma',
    'nav.anbar_və_stok': 'Anbar və Stok',
    'nav.istehsalat': 'İstehsalat',
    'nav.mühasibat': 'Mühasibat',
    'nav.xəzinə': 'Xəzinə',
    'nav.vergilər': 'Vergilər',
    'nav.i̇nsan_resursları': 'İnsan Resursları',
    'nav.əmək_haqqı': 'Əmək Haqqı',
    'nav.əsas_vəsaitlər': 'Əsas Vəsaitlər',
    'nav.atə': 'ATƏ',
    'nav.hüquqi_müqavilələr': 'Hüquqi Müqavilələr',
    'nav.ai_admin_köməkçisi': 'Aİ Admin Köməkçisi',
    'nav.i̇stifadəçilər': 'İstifadəçilər',
    'nav.sistem_ayarları': 'Sistem Ayarları',
    'dashboard.title': 'İdarəetmə Paneli',
    'dashboard.new_page': 'Yeni Səhifə',
    'dashboard.edit': 'Düzəliş Et',
    'dashboard.finish_edit': 'Düzəlişi Bitir',
    'dashboard.clear_page': 'Səhifəni Təmizlə',
    'dashboard.new_kpi': 'Yeni KPI Kartı',
    'dashboard.new_chart': 'Yeni Diaqram',
    'dashboard.new_activity': 'Fəaliyyət Jurnalı',
    'dashboard.total_revenue': 'Ümumi Gəlir',
    'dashboard.net_profit': 'Xalis Mənfəət',
    'dashboard.capital': 'Nizamnamə Kapitalı',
    'btn.add_translation': 'Tərcümə Əlavə Et',
    'label.original': 'Orijinal',
    'label.translated': 'Tərcümə edilib',
    'msg.financial_warning': 'Maliyyə və hüquqi sənədlər tərcümə edilmir.',
    'header.search_placeholder': 'Axtar (Müştəri, Qaimə, Sənəd ...)',
    'header.active_company': 'Aktiv Şirkət'
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.sites': 'Sites & Stores',
    'nav.apps': 'Applications',
    'nav.s-ai_agent': 'S-AI Agent',
    'nav.erp_admin_panel_bölməsi': 'ERP Admin Panel Section',
    'nav.ai_i̇nkişaf_köməkçisi': 'AI Dev Assistant',
    'nav.ai_şablon_qurucu': 'AI Template Builder',
    'nav.ai_strateji_məsləhətçi': 'AI Strategic Advisor',
    'nav.ai_tərcümə_məsləhətçisi': 'AI Translation Advisor',
    'nav.ai_öyrənmə_laboratoriyası': 'AI Learning Lab',
    'nav.yol_xəritəsi_(roadmap)': 'Roadmap',
    'nav.industry_insights': 'Industry Insights',
    'nav.bitrix24_analizi': 'Bitrix24 Analysis',
    'nav.1c_analizi': '1C Analysis',
    'nav.veb_mağaza_analizi': 'E-com Analysis',
    'nav.layihələr_analizi': 'Project Analysis',
    'nav.tətbiqlər_analizi': 'App Analysis',
    'nav.ümumi_sistem_analizi': 'System Analysis',
    'nav.compliance_&_intel_hub': 'Compliance Hub',
    'nav.dövlət_inteqrasiyaları': 'Gov Integrations',
    'nav.ai_hesabat_mərkəzi': 'AI Report Center',
    'nav.ai_admin_analizi': 'AI Admin Analysis',
    'nav.ai_dashboard_qurucu': 'AI Dashboard Creator',
    'nav.layihələr': 'Projects',
    'nav.saytlar_və_mağaza': 'Sites & Stores',
    'nav.crm': 'CRM',
    'nav.satış': 'Sales',
    'nav.təchizat_və_daşıma': 'Logistics',
    'nav.anbar_və_stok': 'Inventory',
    'nav.istehsalat': 'Production',
    'nav.mühasibat': 'Accounting',
    'nav.xəzinə': 'Treasury',
    'nav.vergilər': 'Taxes',
    'nav.i̇nsan_resursları': 'Human Resources',
    'nav.əmək_haqqı': 'Payroll',
    'nav.əsas_vəsaitlər': 'Fixed Assets',
    'nav.atə': 'LVA',
    'nav.hüquqi_müqavilələr': 'Contracts',
    'nav.ai_admin_köməkçisi': 'AI Admin Assistant',
    'nav.i̇stifadəçilər': 'Users',
    'nav.sistem_ayarları': 'Settings',
    'dashboard.title': 'Management Dashboard',
    'dashboard.new_page': 'New Page',
    'dashboard.edit': 'Edit Dashboard',
    'dashboard.finish_edit': 'Finish Editing',
    'dashboard.clear_page': 'Clear Page',
    'dashboard.new_kpi': 'New KPI Card',
    'dashboard.new_chart': 'New Chart',
    'dashboard.new_activity': 'Activity Log',
    'dashboard.total_revenue': 'Total Revenue',
    'dashboard.net_profit': 'Net Profit',
    'dashboard.capital': 'Share Capital',
    'btn.add_translation': 'Add Translation',
    'label.original': 'Original',
    'label.translated': 'Translated',
    'msg.financial_warning': 'Financial and legal documents are not translated.',
    'header.search_placeholder': 'Search (Customer, Invoice, Doc ...)',
    'header.active_company': 'Active Company'
  },
  ru: {
    'nav.dashboard': 'Панель управления',
    'nav.projects': 'Проекты',
    'nav.sites': 'Сайты и Магазины',
    'nav.apps': 'Приложения',
    'nav.erp_admin_panel_bölməsi': 'Админ панель ERP',
    'nav.ai_i̇nkişaf_köməkçisi': 'ИИ Ассистент разработчика',
    'nav.ai_şablon_qurucu': 'ИИ Конструктор шаблонов',
    'nav.ai_strateji_məsləhətçi': 'ИИ Стратегический советник',
    'nav.ai_tərcümə_məsləhətçisi': 'ИИ Консультант по переводу',
    'nav.yol_xəritəsi_(roadmap)': 'Дорожная карта',
    'nav.industry_insights': 'Отраслевая аналитика',
    'nav.ai_admin_analizi': 'ИИ Админ анализ',
    'nav.ai_dashboard_qurucu': 'ИИ Конструктор панелей',
    'dashboard.title': 'Панель управления',
    'dashboard.new_page': 'Новая страница',
    'dashboard.edit': 'Редактировать',
    'dashboard.finish_edit': 'Завершить',
    'dashboard.clear_page': 'Очистить страницу',
    'dashboard.new_kpi': 'Новая карточка KPI',
    'dashboard.new_chart': 'Новая диаграмма',
    'dashboard.new_activity': 'Журнал активности',
    'dashboard.total_revenue': 'Общий доход',
    'dashboard.net_profit': 'Чистая прибыль',
    'dashboard.capital': 'Уставный капитал',
    'btn.add_translation': 'Добавить перевод',
    'label.original': 'Оригинал',
    'label.translated': 'Переведено',
    'msg.financial_warning': 'Финансовые и юридические документы не переводятся.',
    'header.search_placeholder': 'Поиск (Клиент, Счет, Док ...)',
    'header.active_company': 'Активная компания'
  },
  tr: {
    'nav.dashboard': 'Kontrol Paneli',
    'nav.projects': 'Projeler',
    'nav.sites': 'Siteler ve Mağazalar',
    'nav.apps': 'Uygulamalar',
    'nav.erp_admin_panel_bölməsi': 'ERP Yönetim Paneli Bölümü',
    'nav.ai_i̇nkişaf_köməkçisi': 'AI Geliştirme Asistanı',
    'nav.ai_şablon_qurucu': 'AI Şablon Oluşturucu',
    'nav.ai_strateji_məsləhətçi': 'AI Stratejik Danışman',
    'nav.ai_tərcümə_məsləhətçisi': 'AI Çeviri Danışmanı',
    'nav.yol_xəritəsi_(roadmap)': 'Yol Haritası',
    'nav.industry_insights': 'Sektörel Öngörüler',
    'nav.ai_admin_analizi': 'AI Admin Analizi',
    'nav.ai_dashboard_qurucu': 'AI Dashboard Oluşturucu',
    'dashboard.title': 'Yönetim Paneli',
    'dashboard.new_page': 'Yeni Sayfa',
    'dashboard.edit': 'Düzenle',
    'dashboard.finish_edit': 'Düzenlemeyi Bitir',
    'dashboard.clear_page': 'Sayfayı Temizle',
    'dashboard.new_kpi': 'Yeni KPI Kartı',
    'dashboard.new_chart': 'Yeni Grafik',
    'dashboard.new_activity': 'Aktivite Günlüğü',
    'dashboard.total_revenue': 'Toplam Gelir',
    'dashboard.net_profit': 'Net Kar',
    'dashboard.capital': 'Sermaye',
    'btn.add_translation': 'Çeviri Ekle',
    'label.original': 'Orijinal',
    'label.translated': 'Çevrildi',
    'msg.financial_warning': 'Mali ve hukuki belgeler tercüme edilmez.',
    'header.search_placeholder': 'Ara (Müşteri, Fatura, Belge ...)',
    'header.active_company': 'Aktif Şirket'
  }
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('erp_language');
    const lang = (saved as Language) || 'az';
    return lang.toLowerCase() as Language;
  });

  const setLanguage = (lang: Language) => {
    const normalized = lang.toLowerCase() as Language;
    setLanguageState(normalized);
    localStorage.setItem('erp_language', normalized);
    document.documentElement.lang = normalized;
    document.documentElement.setAttribute('data-lang', normalized);
  };

  const t = (key: string) => {
    const dict = uiStrings[language] || uiStrings['az'];
    return dict[key] ?? key;
  };

  useEffect(() => {
    document.title = t('dashboard.title') || 'SmartAgent ERP';
  }, [language]);

  const translateData = (entity: string, entityId: string, field: string, value: any) => {
    return localizationEngine.translateData(entity, entityId, field, value, language);
  };

  const addTranslation = (entity: string, entityId: string, field: string, lang: Language, value: string) => {
    localizationEngine.addManualTranslation({ entity, entityId, field, language: lang, value });
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, translateData, addTranslation }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocalization must be used within LocalizationProvider');
  return context;
};
