import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { menuConfig } from '../config/menu';

const ModuleNav = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  
  if (pathParts.length === 0) return null;
  const baseModule = `/${pathParts[0]}`;

  // Yalnız "Tətbiqlər" (/app) və "Layihələr" (/projects) bölmələrində görünəcək.
  if (baseModule !== '/app' && baseModule !== '/projects') {
    return null;
  }

  // Daxil olunan URL-ə uyğun ana bölməni konfiqurasiyadan axtarırıq
  const activeSection = menuConfig.find(section => 
    section.subItems?.some(sub => sub.path?.startsWith(baseModule))
  );

  if (!activeSection || !activeSection.subItems) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800 px-6 lg:px-8 shrink-0 relative z-30 transition-colors duration-300">
      <div className="flex items-center space-x-8 overflow-x-auto custom-scrollbar no-scrollbar">
        {activeSection.subItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path || '#'}
            className={({ isActive }) =>
              `whitespace-nowrap py-3 text-[12px] font-black uppercase tracking-widest transition-all duration-200 border-b-2 relative ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ModuleNav;
