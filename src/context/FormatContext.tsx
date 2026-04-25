import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Formatter, defaultSettings, type FormatSettings } from '../utils/formatter';
import { useCompany } from './CompanyContext';

interface FormatContextType {
  settings: FormatSettings;
  updateSettings: (newSettings: Partial<FormatSettings>) => void;
  formatDate: (date: Date | string | null | undefined, options?: any) => string;
  formatTime: (date: Date | string | null | undefined) => string;
  formatNumber: (value: number | null | undefined, options?: any) => string;
  formatCurrency: (value: number | null | undefined, currencyCode?: string) => string;
}

const FormatContext = createContext<FormatContextType | undefined>(undefined);

export const FormatProvider = ({ children }: { children: ReactNode }) => {
  const { activeCompany } = useCompany();
  const [settings, setSettings] = useState<FormatSettings>(defaultSettings);
  const [formatter, setFormatter] = useState(new Formatter(defaultSettings));

  // Load settings from Company or LocalStorage (User Override)
  useEffect(() => {
    const userSettings = localStorage.getItem('erp_user_settings');
    let activeSettings = { ...defaultSettings };

    // 1. Company Defaults
    if (activeCompany?.settings) {
      try {
        const companySettings = typeof activeCompany.settings === 'string' 
          ? JSON.parse(activeCompany.settings) 
          : activeCompany.settings;
        activeSettings = { ...activeSettings, ...companySettings };
      } catch (e) {
        console.error('Failed to parse company settings:', e);
      }
    }

    // 2. User Override (LocalStorage for now)
    if (userSettings) {
      try {
        const parsedUser = JSON.parse(userSettings);
        activeSettings = { ...activeSettings, ...parsedUser };
      } catch (e) {
        console.error('Failed to parse user settings:', e);
      }
    }

    setSettings(activeSettings);
    setFormatter(new Formatter(activeSettings));
  }, [activeCompany]);

  const updateSettings = (newSettings: Partial<FormatSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    setFormatter(new Formatter(updated));
    // Save to localStorage as user override
    localStorage.setItem('erp_user_settings', JSON.stringify(updated));
  };

  return (
    <FormatContext.Provider value={{ 
      settings, 
      updateSettings,
      formatDate: (d, opt) => formatter.formatDate(d, opt),
      formatTime: (d) => formatter.formatTime(d),
      formatNumber: (v, opt) => formatter.formatNumber(v, opt),
      formatCurrency: (v, c) => formatter.formatCurrency(v, c)
    }}>
      {children}
    </FormatContext.Provider>
  );
};

export const useFormat = () => {
  const context = useContext(FormatContext);
  if (context === undefined) {
    throw new Error('useFormat must be used within a FormatProvider');
  }
  return context;
};
