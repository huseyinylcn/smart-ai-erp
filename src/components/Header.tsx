import { 
  Search, Bell, Settings,
  ChevronDown, Menu, Maximize, Maximize2, Minimize, Moon, LayoutGrid
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';
import AddNewDropdown from './AddNewDropdown';

import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';

import { useLocalization } from '../context/LocalizationContext';
import type { Language } from '../utils/LocalizationEngine';

  const Header = ({ 
    toggleSidebar, 
    toggleRightSidebar, 
    isDarkMode, 
    toggleDarkMode, 
    isContentFullscreen, 
    setIsContentFullscreen,
    isAltPressed,
    navPath,
    setNavPath
  }: { 
    toggleSidebar: () => void, 
    toggleRightSidebar: () => void,
    isDarkMode: boolean,
    toggleDarkMode: () => void,
    isContentFullscreen?: boolean,
    setIsContentFullscreen?: (val: boolean) => void,
    isAltPressed?: boolean,
    navPath?: string[],
    setNavPath?: (path: string[] | ((prev: string[]) => string[])) => void
  }) => {
  const navigate = useNavigate();
  const { activeCompany, companies, setActiveCompany, isLoading } = useCompany();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLocalization();
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);

  // Global Shortcut Handlers
  useEffect(() => {
    const handleProfile = () => setShowProfile(prev => !prev);
    const handleNotify = () => setShowNotifications(prev => !prev);
    const handleLang = () => setShowLangMenu(prev => !prev);
    const handleComp = () => setShowCompanyMenu(prev => !prev);
    const handleSearch = () => {
      const input = document.querySelector('input[placeholder*="Axtar (Müştəri"]') as HTMLInputElement;
      if (input) input.focus();
    };
    const handleNew = (e: any) => {
      if (!e.defaultPrevented) {
        window.dispatchEvent(new CustomEvent('toggle-add-new-dropdown'));
      }
    };

    window.addEventListener('toggle-header-profile', handleProfile);
    window.addEventListener('toggle-header-notifications', handleNotify);
    window.addEventListener('toggle-header-lang', handleLang);
    window.addEventListener('toggle-header-company', handleComp);
    window.addEventListener('global-search-focus', handleSearch);
    window.addEventListener('global-new-document', handleNew);

    return () => {
      window.removeEventListener('toggle-header-profile', handleProfile);
      window.removeEventListener('toggle-header-notifications', handleNotify);
      window.removeEventListener('toggle-header-lang', handleLang);
      window.removeEventListener('toggle-header-company', handleComp);
      window.removeEventListener('global-search-focus', handleSearch);
      window.removeEventListener('global-new-document', handleNew);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const languages = [    { code: 'AZ', name: 'Azerbaijani', flag: '🇦🇿' },
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'RU', name: 'Russian', flag: '🇷🇺' },
    { code: 'TR', name: 'Turkish', flag: '🇹🇷' },
  ];

  return (
    <header className="h-[76px] bg-white dark:bg-slate-900 border-b border-[#E8EDF2] dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 shrink-0 transition-all z-30 sticky top-0 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
      
      {/* Sol tərəf: Menu & Company Selection */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-indigo-600 relative"
        >
          <Menu className="w-5 h-5 stroke-[2.5px]" />
          {isAltPressed && (
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl z-50 uppercase animate-in zoom-in duration-200">S</div>
          )}
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        <div className="relative">
          <button 
            onClick={() => setShowCompanyMenu(!showCompanyMenu)}
            disabled={isLoading}
            className={`flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group relative ${isLoading ? 'opacity-50' : ''}`}
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shadow-sm">
                <span className="text-[11px] font-black uppercase">{activeCompany?.code?.slice(0, 2) || '...'}</span>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 leading-none">
                {isLoading ? 'Yüklənir...' : (activeCompany?.name || 'Şirkət Seçin')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{t('header.active_company')}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showCompanyMenu ? 'rotate-180' : ''}`} />
            
            {/* Comp KeyTip */}
            {isAltPressed && (
              <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl z-50 uppercase animate-in zoom-in duration-200">C</div>
            )}
          </button>

          {showCompanyMenu && (
            <div className="absolute top-14 left-0 w-72 bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-2xl shadow-soft-xl py-3 z-50 animate-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Müəssisələr Arası Keçid</span>
              </div>
              <div className="max-h-64 overflow-y-auto px-2 space-y-1">
                {companies.map(company => (
                  <button 
                    key={company.id}
                    onClick={() => { setActiveCompany(company); setShowCompanyMenu(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group transition-all ${activeCompany?.id === company.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold ${activeCompany?.id === company.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        {company.code.slice(0, 2)}
                      </div>
                      <span className={`text-[13px] ${activeCompany?.id === company.id ? 'font-bold' : 'font-medium'}`}>{company.name}</span>
                    </div>
                    {activeCompany?.id === company.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>}
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800 px-2">
                 <button 
                   onClick={() => { navigate('/settings/companies'); setShowCompanyMenu(false); }}
                   className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-[11px] font-black uppercase tracking-widest transition-all italic"
                 >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Şirkətləri İdarə Et</span>
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orta: Global Search */}
      <div className="hidden lg:flex flex-[1.5] max-w-xl px-12">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 border-none text-[13.5px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all font-medium text-slate-700 dark:text-slate-200"
            placeholder="Axtar (Müştəri, Qaimə, Sənəd ...)"
          />
        </div>
      </div>

      <div className="flex items-center space-x-1.5 sm:space-x-3">
        
        {/* İç səhifə tam ekran */}
        <button 
          onClick={() => setIsContentFullscreen && setIsContentFullscreen(!isContentFullscreen)}
          className={`hidden sm:flex p-2.5 rounded-xl transition-all ${
            isContentFullscreen 
            ? 'bg-primary-50 text-indigo-600 shadow-inner' 
            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600'
          }`}
          title={isContentFullscreen ? "Sistemə Qayıt (Esc)" : "İç Səhifəni Tam Ekran Et (Alt + E)"}
        >
          {isContentFullscreen ? (
            <Minimize className="w-5 h-5 stroke-[2.2px]" />
          ) : (
            <Maximize2 className="w-5 h-5 stroke-[2.2px]" />
          )}
          {isAltPressed && (
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl z-50 uppercase animate-in zoom-in duration-200">E</div>
          )}
        </button>

        {/* + Add New Button (Dropdown) */}
        <AddNewDropdown 
          isAltPressed={isAltPressed}
          navPath={navPath}
          setNavPath={setNavPath}
        />

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block"></div>

        {/* Ümumi (Browser) Fullscreen */}
        <button 
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 rounded-xl transition-all relative"
          title="Ümumi Tam Ekran (Alt + U)"
        >
          <Maximize className="w-5 h-5 stroke-[2.2px]" />
          {isAltPressed && (
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl z-50 uppercase animate-in zoom-in duration-200">U</div>
          )}
        </button>

        {/* Dark Mode */}
        <button 
          onClick={toggleDarkMode}
          className="hidden sm:flex p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 rounded-xl transition-all relative"
          title="Dark Mode"
        >
          <Moon className={`w-5 h-5 stroke-[2.2px] ${isDarkMode ? 'fill-indigo-500 text-indigo-500' : ''}`} />
          {isAltPressed && (
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl z-50 uppercase animate-in zoom-in duration-200">D</div>
          )}
        </button>

        {/* Bildirişlər */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowLangMenu(false); }}
            className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-primary-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600'}`}
          >
            <Bell className="w-5 h-5 stroke-[2.2px]" />
            <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            
            {isAltPressed && (
              <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl z-50 uppercase animate-in zoom-in duration-200">B</div>
            )}
          </button>
          <NotificationsDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>

        {/* Tənzimləmələr */}
        <button 
          onClick={() => navigate('/settings')}
          className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 rounded-xl transition-all relative"
          title="Sistem Parametrləri"
        >
          <Settings className="w-5 h-5 stroke-[2.2px]" />
          {isAltPressed && (
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl z-50 uppercase animate-in zoom-in duration-200">K</div>
          )}
        </button>

        {/* Dil Seçimi */}
        <div className="relative">
          <button 
            onClick={() => { setShowLangMenu(!showLangMenu); setShowNotifications(false); }}
            className="hidden xl:flex items-center space-x-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-400 rounded-xl transition-all relative"
          >
             <span className="text-lg">{languages.find(l => l.code.toLowerCase() === language.toLowerCase())?.flag}</span>
             <span className="text-[12px] font-black uppercase text-slate-600 dark:text-slate-300">{language}</span>
             <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
             
             {isAltPressed && (
               <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl z-50 uppercase animate-in zoom-in duration-200">L</div>
             )}
          </button>

          {showLangMenu && (
            <div className="absolute top-14 right-0 w-44 bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-2xl shadow-soft-xl py-2 z-50 animate-in slide-in-from-top-2">
               {languages.map(lang => (
                 <button 
                   key={lang.code}
                   onClick={() => { setLanguage(lang.code as Language); setShowLangMenu(false); }}
                   className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${language === lang.code ? 'text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                 >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-[13px]">{lang.name}</span>
                 </button>
               ))}
            </div>
          )}
        </div>

        {/* Grid / Apps */}
        <div className="relative group">
          <button 
            onClick={toggleRightSidebar}
            className="hidden sm:flex p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 rounded-xl transition-all"
            title="Tətbiqlər (Alt + R)"
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.2px]" />
          </button>
          
          {/* Apps Hint */}
          <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity uppercase z-50">
            R
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

        {/* Profil Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-3 pl-2 pr-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group relative"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-105">
                AƏ
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 leading-tight">
                {user?.username === 'admin' ? 'Administrator' : user?.username || 'İstifadəçi'}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {user?.username === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            
            {/* Profile KeyTip */}
            {isAltPressed && (
              <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded shadow-2xl z-50 uppercase animate-in zoom-in duration-200">P</div>
            )}
          </button>
          
          <ProfileDropdown 
            isOpen={showProfile} 
            onClose={() => setShowProfile(false)} 
            onLogout={logout} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
