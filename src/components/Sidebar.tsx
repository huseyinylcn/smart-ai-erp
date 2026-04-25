import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ChevronDown, ChevronRight
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { menuConfig } from '../config/menu';
import type { SidebarItem } from '../config/menu';
import { useLocalization } from '../context/LocalizationContext';

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
  showFull: boolean;
  isActive?: boolean;
  isAltPressed?: boolean;
  navPath?: string[];
  currentPathIndices?: string[]; // New prop to track hierarchy
}

const MenuItem = ({ item, isExpanded, onClick, showFull, isActive, isAltPressed, navPath, currentPathIndices, numHint }: MenuItemProps & { numHint?: string }) => {
  const { t } = useLocalization();
  const Icon = item.icon;
  const hasSubMenu = item.subItems && item.subItems.length > 0;
  
  // Translation mapping logic
  const getDisplayName = (name: string) => {
    const key = `nav.${name.toLowerCase().replace(/\s+/g, '_')}`;
    const translated = t(key);
    return translated === key ? name : translated;
  };

  if (hasSubMenu) {
    return (
      <div className="mb-0.5 relative group/item">
        <button
          onClick={onClick}
          className={`w-full flex items-center ${showFull ? 'justify-between px-3.5' : 'justify-center px-0'} py-2.5 text-[13.5px] font-semibold transition-all duration-200 rounded-xl relative ${
            isExpanded && showFull
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary-600'
          }`}
          title={!showFull ? item.name : undefined}
        >
          <div className="flex items-center">
            {Icon && <Icon className={`w-[20px] h-[20px] ${showFull ? 'mr-3' : ''} stroke-[2.2px] ${isExpanded && showFull ? 'text-primary-600' : 'text-slate-400'}`} />}
            {showFull && <span className="tracking-wide select-none truncate text-left">{getDisplayName(item.name)}</span>}
          </div>
          {showFull && (
            isExpanded ? <ChevronDown className="w-4 h-4 text-primary-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          
          {/* KeyTip Hint (Numeric/Letter) */}
          {isAltPressed && numHint && (
             <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
                {numHint}
             </div>
          )}
        </button>
        {(isExpanded && showFull) && (
          <div className="pl-6 pr-2 py-1 space-y-1 mt-1 dark:bg-slate-900 ml-2 border-l border-slate-100 dark:border-slate-800">
            {item.subItems?.map((sub, sidx) => (
              <div key={sub.name} className="relative">
                {sub.subItems ? (
                  <InnerMenuItem 
                    item={sub} 
                    isAltPressed={isAltPressed} 
                    navPath={navPath} 
                    currentPathIndices={currentPathIndices || []}
                    itemIndex={sidx} 
                  />
                ) : (
                  <NavLink
                    to={sub.path || '#'}
                    className={({ isActive: subActive }: { isActive: boolean }) =>
                      `block px-3 py-2 text-[13px] font-medium rounded-lg transition-colors relative ${
                        subActive 
                          ? 'text-primary-600 bg-primary-50/50 before:absolute before:left-[-1.5px] before:top-1.5 before:bottom-1.5 before:w-[3px] before:bg-primary-600 before:rounded-full' 
                          : 'text-slate-500 hover:text-primary-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    {getDisplayName(sub.name)}
                    
                    {/* Sub-item KeyTip (Numeric/Letter Level 1) */}
                    {isAltPressed && navPath && currentPathIndices && 
                      navPath.length === currentPathIndices.length + 1 && 
                      currentPathIndices.every((k, i) => navPath[i] === k) && 
                      navPath[currentPathIndices.length] === getHint(sidx) && (
                       <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
                          {getHint(sidx)}
                       </div>
                    )}
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || '#'}
      title={!showFull ? item.name : undefined}
      className={({ isActive }) =>
        `flex items-center ${showFull ? 'px-3.5' : 'justify-center px-0'} py-2.5 mb-0.5 text-[13.5px] font-semibold transition-all duration-200 rounded-xl relative ${
          isActive 
            ? 'bg-primary-600 text-white shadow-soft-lg shadow-primary-500/30 font-bold' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-primary-600'
        }`
      }
    >
      <div className="flex items-center relative group/item">
        {Icon && (
          <Icon className={`w-[20px] h-[20px] ${showFull ? 'mr-3' : ''} stroke-[2.2px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
        )}
        {showFull && <span className="tracking-wide">{getDisplayName(item.name)}</span>}
      </div>
      
      {/* Main Item KeyTip (Numeric) */}
      {(isAltPressed && showFull && numHint) && (
         <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
            {numHint}
         </div>
      )}
    </NavLink>
  );
};

// Recursive helper for inner menus
const InnerMenuItem = ({ 
  item, 
  isAltPressed, 
  navPath, 
  currentPathIndices, // Current numeric keys to reach THIS menu
  itemIndex 
}: { 
  item: SidebarItem, 
  isAltPressed?: boolean, 
  navPath?: string[], 
  currentPathIndices: string[],
  itemIndex: number 
}) => {
  const { t } = useLocalization();
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = item.icon;
  
  const getDisplayName = (name: string) => {
    const key = `nav.${name.toLowerCase().replace(/\s+/g, '_')}`;
    const translated = t(key);
    return translated === key ? name : translated;
  };

  const currentKey = getHint(itemIndex);
  const fullPathToThis = [...currentPathIndices, currentKey];
  
  // Check if navPath matches our path exactly to expand or show sub-hints
  const isMatchSoFar = navPath && fullPathToThis.every((key, i) => navPath[i] === key);
  const isExactParent = isMatchSoFar && navPath?.length === fullPathToThis.length;
  const isDeepChild = isMatchSoFar && (navPath?.length || 0) > fullPathToThis.length;
  
  const shouldExpand = isExactParent || isDeepChild;
  
  return (
    <div className="mb-1 relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-bold transition-all duration-200 rounded-lg ${
          (isExpanded || shouldExpand)
            ? 'text-primary-600 bg-primary-50/30' 
            : 'text-slate-400 hover:text-primary-500 hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center">
          {Icon && <Icon className="w-3.5 h-3.5 mr-2 stroke-[2.2px]" />}
          <span className="tracking-wide truncate text-[12px] text-slate-600 dark:text-slate-300">{getDisplayName(item.name)}</span>
        </div>
        {(isExpanded || shouldExpand) ? <ChevronDown className="w-3 h-3 text-primary-400" /> : <ChevronRight className="w-3 h-3" />}
        
        {/* Inner Item KeyTip - show ONLY if we are at the exact parent level in navPath */}
        {isAltPressed && navPath && navPath.length === currentPathIndices.length && currentPathIndices.every((k, i) => navPath[i] === k) && (
           <div className="absolute right-8 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
              {currentKey}
           </div>
        )}
      </button>
      
      {(isExpanded || shouldExpand) && (
        <div className="pl-5 py-1 space-y-1 border-l border-slate-100 dark:border-slate-800 ml-4 mt-1">
          {item.subItems?.map((sub, sidx) => {
            const hasChildren = sub.subItems && sub.subItems.length > 0;
            return (
              <div key={sub.name} className="relative">
                {hasChildren ? (
                  <InnerMenuItem 
                    item={sub} 
                    isAltPressed={isAltPressed} 
                    navPath={navPath} 
                    currentPathIndices={fullPathToThis}
                    itemIndex={sidx} 
                  />
                ) : (
                  <NavLink
                    to={sub.path || '#'}
                    className={({ isActive }: { isActive: boolean }) =>
                      `block px-3 py-2 text-[12px] font-medium rounded-lg transition-all relative tracking-wide ${
                        isActive 
                          ? 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-sm' 
                          : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    {getDisplayName(sub.name)}
                    
                    {/* Leaf Item KeyTip - show ONLY if path matches exactly */}
                    {isAltPressed && isExactParent && (
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-emerald-600 border border-emerald-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
                          {getHint(sidx)}
                       </div>
                    )}
                  </NavLink>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};



interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isAltPressed?: boolean;
  navPath?: string[];
  setNavPath?: (path: string[] | ((prev: string[]) => string[])) => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar, isAltPressed, navPath, setNavPath }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Dashboard');
  const [isHovered, setIsHovered] = useState(false);

  // The sidebar is 'mini' if collapsed AND not hovered.
  // It is 'full' if NOT collapsed OR hovered while collapsed.
  const showFullSidebar = !isCollapsed || isHovered;



  // Pre-calculate section indices for stable hierarchical navigation
  const processedMenu = useMemo(() => {
    let sectionCounter = 0;
    let currentSectionIdx = -1;
    let itemInSectionIdx = 0;

    return menuConfig.map((item) => {
      const isTopLevelEntry = item.isHeader || item.name === 'Dashboard';
      if (isTopLevelEntry) {
        sectionCounter++;
        currentSectionIdx = sectionCounter;
        itemInSectionIdx = 0;
        return { ...item, sectionIdx: currentSectionIdx, itemIdx: 0 };
      } else {
        itemInSectionIdx++;
        return { ...item, sectionIdx: currentSectionIdx, itemIdx: itemInSectionIdx };
      }
    });
  }, []); // menuConfig is static, but we memoize processedMenu to prevent Effect loops

  // Navigation Logic (Recursive Hierarchical Numeric/Letter)
  useEffect(() => {
    if (!showFullSidebar || !isAltPressed || !navPath || navPath.length === 0) return;

    // Recursive search function
    const navigateRecursive = (items: SidebarItem[], path: string[], depth: number): boolean => {
      if (depth >= path.length) return false;
      const targetHint = path[depth];

      if (depth === 0) {
        // Match Section Header or Dashboard
        const l0 = processedMenu.find(m => (m.isHeader || m.name === 'Dashboard') && getHint(m.sectionIdx - 1) === targetHint);
        if (!l0) return false;

        if (path.length === 1) {
          if (!l0.isHeader && l0.path) {
            navigate(l0.path);
            if (setNavPath) setNavPath([]);
            return true;
          }
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
          // Found leaf or section to expand
          if (targetNode.path) {
            navigate(targetNode.path);
            if (setNavPath) setNavPath([]);
          } else if (targetNode.subItems) {
            // It's a folder, UI handles expansion via shouldExpand in children
          }
          return true;
        }

        // Recurse deeper
        return navigateRecursive(targetNode.subItems || [], path, depth + 1);
      }
    };

    navigateRecursive([], navPath, 0);
  }, [navPath, isAltPressed, navigate, setNavPath, showFullSidebar, processedMenu]);

  const handleToggle = (name: string) => {
    if (!showFullSidebar) return;
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  return (
    <div 
      className={`h-full flex flex-col shrink-0 transition-all duration-300 ease-in-out z-30 relative ${isCollapsed ? 'w-[70px]' : 'w-[260px]'}`}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => isCollapsed && setIsHovered(false)}
    >
      <div 
        className={`bg-white dark:bg-slate-900 h-full flex flex-col border-r border-[#E8EDF2] dark:border-slate-800 transition-all duration-300 shadow-sm ${isCollapsed && isHovered ? 'absolute top-0 left-0 w-[260px] shadow-2xl z-50' : 'w-full relative z-50'}`}
      >
        {/* Sidebar Header */}
        <div className={`h-[76px] flex items-center shrink-0 bg-white dark:bg-slate-900 sticky top-0 z-40 ${showFullSidebar ? 'px-6' : 'px-0 justify-center border-b border-transparent'}`}>
           {showFullSidebar ? (
             <div className="flex items-center">
               <div className="w-8 h-8 flex items-center justify-center font-black text-[12px] bg-indigo-600 text-white rounded-lg mr-2 shadow-lg shadow-indigo-200 dark:shadow-none uppercase">
                M
               </div>
               <span className="text-[14px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest leading-none">Menyu</span>
             </div>
           ) : (
             <div className="w-8 h-8 flex items-center justify-center font-black text-[12px] bg-indigo-600 text-white rounded-lg border border-transparent shadow-md">
               M
             </div>
           )}
        </div>
        
        {/* Menus */}
        <nav className={`flex-1 ${showFullSidebar ? 'px-3.5' : 'px-2'} py-2 space-y-1 overflow-y-auto custom-scrollbar pb-10`}>
          {processedMenu.map((item, idx) => {
            if (item.isHeader) {
              if (!showFullSidebar) return <div key={`sep-${idx}`} className="h-4"></div>;
              return (
                <div key={`header-${idx}`} className="mt-8 mb-3 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/30 border-l-[3px] border-primary-500 rounded-r-xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] select-none truncate italic transition-all duration-300 relative">
                  {item.name}
                  
                  {/* Section Header KeyTip (Numeric/Letter Level 0) */}
                  {(isAltPressed && showFullSidebar && (!navPath || navPath.length === 0)) && (
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-indigo-600 border border-indigo-400 text-white text-[10px] font-black rounded shadow-2xl z-[101] animate-in zoom-in duration-200 uppercase ring-2 ring-white/10 pointer-events-none">
                        {getHint(item.sectionIdx - 1)}
                     </div>
                    )}
                </div>
              );
            }

            const isDashboardOrHeader = item.isHeader || item.name === 'Dashboard';
            const sectionHint = getHint(item.sectionIdx - 1);
            
            const isHeader = item.isHeader;
            const isDashboard = item.name === 'Dashboard';
            let displayHint = undefined;
            if (!navPath || navPath.length === 0) {
              if (isHeader) displayHint = sectionHint;
              else if (!isDashboard) displayHint = getHint(item.itemIdx - 1);
            } else if (navPath.length === 1 && navPath[0] === sectionHint) {
              if (!isHeader && !isDashboard) displayHint = getHint(item.itemIdx - 1);
            }

            const currentPathIndices = isDashboard ? [] : [sectionHint, getHint(item.itemIdx - 1)];

            return (
              <MenuItem 
                key={item.name} 
                item={item}
                numHint={displayHint}
                isActive={location.pathname === item.path} 
                isExpanded={expandedMenu === item.name}
                onClick={() => handleToggle(item.name as string)}
                showFull={showFullSidebar}
                isAltPressed={isAltPressed}
                navPath={navPath}
                currentPathIndices={currentPathIndices}
              />
            );
          })}
        </nav>

        {!showFullSidebar && (
           <div className="mt-auto flex justify-center pb-8 group cursor-pointer" title="Dashboard">
              <LayoutDashboard className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
           </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
