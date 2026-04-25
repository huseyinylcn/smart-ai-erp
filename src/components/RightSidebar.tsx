import { NavLink } from 'react-router-dom';
import { 
  PieChart, TrendingUp, Boxes, Factory, 
  Users, ShieldAlert, Activity, LineChart, Landmark, Building, ChevronDown, ChevronRight, X,
  Layout, Crosshair, Briefcase
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

interface SidebarItem {
  name: string;
  icon?: any;
  path?: string;
  keyHint?: string;
  subItems?: { name: string; path: string, keyHint?: string }[];
  isHeader?: boolean;
}

const getHint = (index: number) => {
  if (index < 9) return String(index + 1);
  // Excluded: f, n, e, u, d, s, r, p, b, k, l, c, a (reserved by user)
  // Also excluding i, l, o for visual clarity (similar to 1, 0)
  const letters = 'qwtyghjmvzx'; 
  const letterIndex = index - 9;
  return letters[letterIndex] || '?';
};

interface MenuItemProps {
  item: SidebarItem;
  isExpanded: boolean;
  onClick: () => void;
  isAltPressed?: boolean;
  navPath?: string[];
}

const MenuItem = ({ item, isExpanded, onClick, isAltPressed, navPath, numHint }: MenuItemProps & { numHint?: string }) => {
  const Icon = item.icon;
  const hasSubMenu = item.subItems && item.subItems.length > 0;
  
  if (hasSubMenu) {
    return (
      <div className="mb-0.5 relative group/item">
        <button
          onClick={onClick}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 rounded-xl relative ${
            isExpanded 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          <div className="flex items-center">
            {Icon && <Icon className={`w-[18px] h-[18px] mr-3 stroke-[2.2px] ${isExpanded ? 'text-indigo-600' : 'text-slate-400'}`} />}
            <span className="tracking-wide select-none truncate text-left">{item.name}</span>
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
          
          {/* KeyTip Hint (Numeric/Letter) */}
          {(isAltPressed && numHint) && (
             <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
                {numHint}
             </div>
          )}
        </button>
        {isExpanded && (
          <div className="pl-11 pr-2 py-1 space-y-0.5 mt-1 bg-white dark:bg-slate-900 ml-2 border-l border-slate-100 dark:border-slate-800">
            {item.subItems?.map((sub, sidx) => (
              <NavLink
                key={sub.name}
                to={sub.path}
                className={({ isActive: subActive }: { isActive: boolean }) =>
                  `block px-3 py-2 text-[13px] font-medium rounded-lg transition-colors relative ${
                    subActive 
                      ? 'text-indigo-600 bg-indigo-50/50 before:absolute before:left-[-1.5px] before:top-1.5 before:bottom-1.5 before:w-[3px] before:bg-indigo-600 before:rounded-full' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                  }`
                }
              >
                {sub.name}
                
                {/* Sub-item KeyTip (Level 1 - Numeric/Letter) */}
                {(isAltPressed && navPath && navPath[0] === numHint && navPath.length === 1) && (
                   <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
                      {getHint(sidx)}
                   </div>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || '#'}
      className={({ isActive }: { isActive: boolean }) =>
        `flex items-center px-3.5 py-2.5 mb-0.5 text-[13.5px] font-semibold transition-all duration-200 rounded-xl relative ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-soft-lg shadow-indigo-500/30' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`
      }
    >
      {({ isActive }: { isActive: boolean }) => (
        <>
          {Icon && <Icon className={`w-[18px] h-[18px] mr-3 stroke-[2.2px] ${isActive ? 'text-white' : 'text-slate-400'}`} />}
          <span className="tracking-wide">{item.name}</span>
          
          {/* Main Item KeyTip (Numeric/Letter) */}
          {(isAltPressed && numHint) && (
             <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
                {numHint}
             </div>
          )}
        </>
      )}
    </NavLink>
  );
};



interface RightSidebarProps {
  isCollapsed: boolean;
  setCollapsed: (val: boolean) => void;
  isAltPressed?: boolean;
  navPath?: string[];
  setNavPath?: (path: string[]) => void;
}

const RightSidebar = ({ isCollapsed, setCollapsed, isAltPressed, navPath, setNavPath }: RightSidebarProps) => {
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('KPI və Dashboard');

  const reportConfig: SidebarItem[] = [
    { isHeader: true, name: 'Təhlil və Analtika' },
    { 
      name: 'Vergi Hesabatları', icon: Building, keyHint: 'T',
      subItems: [
        { name: 'ƏDV Bəyannaməsi', path: '/reports/tax/vat', keyHint: 'V' },
        { name: 'Sadələşdirilmiş Vergi', path: '/reports/tax/simplified', keyHint: 'S' },
        { name: 'Vahid Bəyannamə (Gəlir/DSMF)', path: '/reports/tax/unified', keyHint: 'U' },
        { name: 'Gəlir/Mənfəət', path: '/reports/tax/profit', keyHint: 'G' },
        { name: 'ÖM (WHT)', path: '/reports/tax/wht', keyHint: 'W' },
        { name: 'Aksiz Vergisi', path: '/reports/tax/excise', keyHint: 'A' },
        { name: 'Əmlak və Torpaq', path: '/reports/tax/property', keyHint: 'P' }
      ]
    },
    { 
      name: 'Maliyyə (Financial)', icon: Landmark, keyHint: 'F',
      subItems: [
        { name: 'Yoxlama Balansı (Trial Balance)', path: '/reports/trial-balance', keyHint: 'T' },
        { name: 'Balans (Balance Sheet)', path: '/reports/finance/balance', keyHint: 'B' },
        { name: 'Mənfəət/Zərər (P&L)', path: '/reports/finance/pnl', keyHint: 'P' },
        { name: 'Cash Flow (Dolayı/Birbaşa)', path: '/reports/finance/cash-flow', keyHint: 'C' },
        { name: 'Debitor/Kreditor Qalığı', path: '/reports/finance/ar-ap', keyHint: 'D' },
        { name: 'Bank Reconcillation', path: '/reports/finance/bank', keyHint: 'R' }
      ]
    },
    { 
      name: 'Tədarük (Procurement)', icon: Briefcase, keyHint: 'P',
      subItems: [
        { name: 'Tədarükçü Analizi', path: '/reports/purchasing/vendor', keyHint: 'T' },
        { name: 'PO İcra Vəziyyəti', path: '/reports/purchasing/po-status', keyHint: 'P' },
        { name: 'Alış Qiymət Trendləri', path: '/reports/purchasing/prices', keyHint: 'A' }
      ]
    },
    { 
      name: 'Satış (Sales & CRM)', icon: TrendingUp, keyHint: 'S',
      subItems: [
        { name: 'Satış Kanalları Üzrə', path: '/reports/mgt/sales/channels', keyHint: 'C' },
        { name: 'Regionlar Üzrə Satış', path: '/reports/mgt/sales/regions', keyHint: 'R' },
        { name: 'Müştəri Gəlirliliyi', path: '/reports/mgt/sales/customer-profit', keyHint: 'M' },
        { name: 'Sales Pipeline (Salesforce)', path: '/reports/mgt/sales/pipeline', keyHint: 'P' }
      ]
    },
    { 
      name: 'Anbar və Logistika', icon: Boxes, keyHint: 'I',
      subItems: [
        { name: 'Stok Dövriyyəsi', path: '/reports/mgt/inventory/turnover', keyHint: 'T' },
        { name: 'ABC/XYZ Analizi', path: '/reports/mgt/inventory/abc', keyHint: 'A' },
        { name: 'Son İstifadə Tarixi (Expiry)', path: '/reports/mgt/inventory/expiry', keyHint: 'E' },
        { name: 'Anbar Tutumu (Capacity)', path: '/reports/mgt/inventory/capacity', keyHint: 'C' }
      ]
    },
    { 
      name: 'İstehsalat (C-Level)', icon: Factory, keyHint: 'M',
      subItems: [
        { name: 'Plan vs Fakt (OEE)', path: '/reports/mgt/production/oee', keyHint: 'O' },
        { name: 'Maya Dəyəri Təhlili', path: '/reports/mgt/production/cost', keyHint: 'C' },
        { name: 'Resurs Yüklənməsi', path: '/reports/mgt/production/resources', keyHint: 'R' }
      ]
    },
    { 
      name: 'İnsan Resursları (HR)', icon: Users, keyHint: 'H',
      subItems: [
        { name: 'Əmək Haqqı Fondu (Payroll)', path: '/reports/mgt/hr/payroll', keyHint: 'P' },
        { name: 'İşçi Dövriyyəsi (Turnover)', path: '/reports/mgt/hr/turnover', keyHint: 'T' },
        { name: 'Davamiyyət Hesabatı', path: '/reports/mgt/hr/attendance', keyHint: 'A' },
        { name: 'Təlim və İnkişaf (L&D)', path: '/reports/mgt/hr/training', keyHint: 'L' }
      ]
    },
    { 
      name: 'Layihələr (Project Mgmt)', icon: Layout, keyHint: 'L',
      subItems: [
        { name: 'Gannt Diaqramı İcmalı', path: '/reports/mgt/projects/gantt', keyHint: 'G' },
        { name: 'Layihə Gəlirliliyi', path: '/reports/mgt/projects/margin', keyHint: 'M' },
        { name: 'Tapşırıq Sürəti (Velocity)', path: '/reports/mgt/projects/velocity', keyHint: 'V' }
      ]
    },
    { 
      name: 'Marketinq (Marketing)', icon: Crosshair, keyHint: 'A',
      subItems: [
        { name: 'Kampaniya ROI', path: '/reports/marketing/roi', keyHint: 'R' },
        { name: 'Segment Analizi', path: '/reports/marketing/segmentation', keyHint: 'S' },
        { name: 'Lead Conversion', path: '/reports/marketing/leads', keyHint: 'L' }
      ]
    },
    { 
      name: 'Risk və Audit', icon: ShieldAlert, keyHint: 'R',
      subItems: [
        { name: 'Ödəmə Gecikmələri', path: '/reports/mgt/risk/ar-delays', keyHint: 'D' },
        { name: 'Audit İzləri (Logs)', path: '/reports/mgt/risk/audit-logs', keyHint: 'L' },
        { name: 'Sistem Girişləri', path: '/reports/mgt/risk/access', keyHint: 'A' }
      ]
    },
    { 
      name: 'AI & Proqnozlaşdırma', icon: LineChart, keyHint: 'Z',
      subItems: [
        { name: 'Gələcək Satış Proqnozu', path: '/reports/ai/sales', keyHint: 'S' },
        { name: 'Anomal Məlumatlar', path: '/reports/ai/anomalies', keyHint: 'A' },
        { name: 'Tələb (Demand) Modeli', path: '/reports/ai/demand', keyHint: 'D' }
      ]
    },
    { 
      name: 'İcraçı KPI (C-Suite)', icon: Activity, keyHint: 'X',
      subItems: [
        { name: 'Şirkət Sağlamlıq İndeksi', path: '/reports/exec/health', keyHint: 'H' },
        { name: 'Strateji Hədəflər (OKR)', path: '/reports/exec/okr', keyHint: 'O' }
      ]
    }
  ];

  // Pre-calculate indices for stable navigation
  const processedMenu = useMemo(() => {
    let sectionCounter = 0;
    let currentSectionIdx = -1;
    let itemInSectionIdx = 0;

    return reportConfig.map((item) => {
      if (item.isHeader) {
        sectionCounter++;
        currentSectionIdx = sectionCounter;
        itemInSectionIdx = 0;
        return { ...item, sectionIdx: currentSectionIdx, itemIdx: 0 };
      } else {
        itemInSectionIdx++;
        return { ...item, sectionIdx: currentSectionIdx, itemIdx: itemInSectionIdx };
      }
    });
  }, []);

  // Navigation Logic (Recursive Hierarchical Numeric/Letter)
  useEffect(() => {
    if (isCollapsed || !isAltPressed || !navPath || navPath.length === 0) return;

    const navigateRecursive = (items: SidebarItem[], path: string[], depth: number): boolean => {
      if (depth >= path.length) return false;
      const targetHint = path[depth];

      if (depth === 0) {
        // Match Section Header
        const l0 = processedMenu.find(m => m.isHeader && getHint(m.sectionIdx - 1) === targetHint);
        if (!l0) return false;

        if (path.length === 1) {
          setExpandedMenu(l0.name);
          return true;
        }
        
        // Go to Level 1
        setExpandedMenu(l0.name);
        const sectionItems = processedMenu.filter(m => !m.isHeader && m.sectionIdx === l0.sectionIdx);
        return navigateRecursive(sectionItems, path, depth + 1);
      } else {
        // Match Item or Sub-Item
        const matchIdx = items.findIndex((m, idx) => {
          const hint = (depth === 1 && (m as any).itemIdx !== undefined) 
            ? getHint((m as any).itemIdx - 1) 
            : getHint(idx);
          return hint === targetHint;
        });

        const targetNode = items[matchIdx];
        if (!targetNode) return false;

        if (depth === path.length - 1) {
          if (targetNode.path) {
            navigate(targetNode.path);
            if (setNavPath) setNavPath([]);
          } else if (targetNode.subItems) {
             setExpandedMenu(targetNode.name);
          }
          return true;
        }

        return navigateRecursive((targetNode.subItems as any) || [], path, depth + 1);
      }
    };

    navigateRecursive([], navPath, 0);
  }, [navPath, isAltPressed, navigate, setNavPath, isCollapsed, processedMenu]);

  const handleToggle = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  return (
    <div 
      className={`bg-white dark:bg-slate-900 h-full shrink-0 flex flex-col transition-all duration-300 border-l border-[#E8EDF2] dark:border-slate-800 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] fixed right-0 top-0 z-40 transform ${isCollapsed ? 'translate-x-full' : 'translate-x-0'} w-[320px]`}
    >
      <div className="h-[76px] flex items-center justify-between px-6 border-b border-[#E8EDF2] dark:border-slate-800 shrink-0">
        <h2 className="text-[17px] font-black text-slate-800 dark:text-white tracking-tight flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Hesabat Mərkəzi
        </h2>
        <button onClick={() => setCollapsed(true)} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <X className="w-[18px] h-[18px]" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3.5 py-4 overflow-x-visible">
        <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-2 mb-3">ANALİTİKA PANNELLƏRİ</div>
        <nav className="space-y-1">
          {processedMenu.map((item, idx) => {
              if (item.isHeader) {
                return (
                  <div key={`header-${idx}`} className="mt-6 mb-3 px-4 py-2 bg-slate-50/50 dark:bg-slate-800/30 border-l-[3px] border-indigo-500 rounded-r-xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] italic relative">
                    {item.name}
                    {isAltPressed && (!navPath || navPath.length === 0) && (
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
                          {getHint(item.sectionIdx - 1)}
                       </div>
                    )}
                  </div>
                );
              }
              
              const sectionHint = getHint(item.sectionIdx - 1);
              let displayHint = undefined;
              if (!navPath || navPath.length === 0) {
                 // No hint for items in root (we show section hints)
              } else if (navPath.length === 1 && navPath[0] === sectionHint) {
                 displayHint = getHint(item.itemIdx - 1);
              }

              return (
                <MenuItem 
                  key={item.name} 
                  numHint={displayHint}
                  item={item} 
                  isExpanded={expandedMenu === item.name}
                  onClick={() => handleToggle(item.name as string)}
                  isAltPressed={isAltPressed}
                  navPath={navPath}
                />
              );
          })}
        </nav>
      </div>
    </div>
  );
};

export default RightSidebar;
