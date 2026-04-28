import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { companyApi } from '../utils/api';

export interface Company {
  id: string;
  code: string;
  name: string;
  taxId?: string;
  logo?: string;
  profile?: string;
  settings?: any;
  factualDate?: string;
  legalDate?: string;
  isAccountPlanLocked?: boolean;
}

interface CompanyContextType {
  activeCompany: Company | null;
  setActiveCompany: (company: Company | null) => void;
  companies: Company[];
  isLoading: boolean;
  refreshCompanies: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompanyState] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await companyApi.getCompanies();
      const data = response?.data || (Array.isArray(response) ? response : []);
      let fetchedCompanies = data.map((c: any) => ({
        id: c.id,
        code: c.code,
        name: c.name || 'Addsız Şirkət',
        taxId: c.taxId || '',
        logo: c.logo || (c.code ? c.code.substring(0, 2) : '??'),
        profile: c.profile || '',
        settings: c.settings || {},
        factualDate: c.factualDate || null,
        legalDate: c.legalDate || null,
        isAccountPlanLocked: c.isAccountPlanLocked || false
      }));

      // ALWAYS ensure TENGRY SUPPLY exists in the list for development/demo stability
      const tengryId = 'ae1dd922-4d6e-401f-95ed-cfa89ea84df4';
      const hasTengry = fetchedCompanies.some((c: Company) => c.id === tengryId);
      if (!hasTengry) {
        fetchedCompanies.push({
          id: tengryId,
          code: 'TENGRY',
          name: 'TENGRY SUPPLY',
          taxId: '1234567890',
          logo: 'TE',
          settings: {},
          isAccountPlanLocked: false
        });
      }
      
      setCompanies(fetchedCompanies);

      // Restore session or pick first
      const storedId = localStorage.getItem('activeCompanyId');
      const found = fetchedCompanies.find((c: Company) => c.id === storedId);
      if (found) {
        setActiveCompanyState(found);
      } else if (fetchedCompanies.length > 0) {
        setActiveCompanyState(fetchedCompanies[0]);
      }
    } catch (error) {
      console.error('Failed to fetch companies, using fallback:', error);
      const fallback = [{
        id: 'ae1dd922-4d6e-401f-95ed-cfa89ea84df4',
        code: 'TENGRY',
        name: 'TENGRY SUPPLY',
        taxId: '1234567890',
        logo: 'TE',
        settings: {},
        isAccountPlanLocked: false
      }];
      setCompanies(fallback);
      setActiveCompanyState(fallback[0]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCompanies();
  }, []);

  const setActiveCompany = (company: Company | null) => {
    setActiveCompanyState(company);
    if (company) {
      localStorage.setItem('activeCompanyId', company.id);
    } else {
      localStorage.removeItem('activeCompanyId');
    }
  };

  return (
    <CompanyContext.Provider value={{ activeCompany, setActiveCompany, companies, isLoading, refreshCompanies }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
