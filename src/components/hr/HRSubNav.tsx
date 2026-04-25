import { NavLink, useLocation } from 'react-router-dom';
import { 
  Users, Briefcase, Clock, FileText, 
  ShieldCheck, ClipboardList, Calendar,
  Building2, UserMinus, Maximize2, Minimize2, Scan, Calculator
} from 'lucide-react';

// Mock plane icon
const Plane = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
);

interface HRSubNavProps {
  isContentFullscreen: boolean;
  setIsContentFullscreen: (val: boolean) => void;
}

const HRSubNav = ({ isContentFullscreen, setIsContentFullscreen }: HRSubNavProps) => {
  const location = useLocation();
  const path = location.pathname;

  // Define Groups
  const groups = [
    {
      id: 'employees',
      match: ['/hr/employees', '/hr/employee/'],
      tabs: [
        { name: 'Əməkdaşlar Reyestri', path: '/hr/employees', icon: Users }
      ]
    },
    {
      id: 'operations',
      name: 'Kadr Əməliyyatları',
      match: ['/hr/hiring', '/hr/leaves', '/hr/sick-leaves', '/hr/permissions', '/hr/termination', '/hr/face-registry'],
      tabs: [
        { name: 'İşə Qəbul Reyestri', path: '/hr/hiring', icon: Briefcase },
        { name: 'Məzuniyyət və Ezamiyyətlər', path: '/hr/leaves', icon: Plane },
        { name: 'İşçi İcazələri', path: '/hr/permissions', icon: ShieldCheck },
        { name: 'Xəstəlik Vərəqələri', path: '/hr/sick-leaves', icon: ClipboardList },
        { name: 'İşdən Azad Etmə (Xitam)', path: '/hr/terminations', icon: UserMinus },
        { name: 'Biometrik Reyestr', path: '/hr/face-registry', icon: Scan },
      ]
    },
    {
      id: 'payroll',
      name: 'Əmək Haqqı və Hesablamalar',
      match: ['/payroll/calculation'],
      tabs: [
        { name: 'Maaş Hesablanması', path: '/payroll/calculation/create', icon: Calculator },
      ]
    },
    {
      id: 'attendance',
      name: 'Davamiyyət və Tabel',
      match: ['/hr/attendance-log', '/hr/attendance'],
      tabs: [
        { name: 'Davamiyyət Jurnalı', path: '/hr/attendance-log', icon: Clock },
        { name: 'Aylıq Tabel', path: '/hr/attendance', icon: Calendar },
      ]
    },
    {
      id: 'structure',
      name: 'Struktur və Tənzimləmələr',
      match: ['/hr/departments', '/hr/positions', '/hr/shifts', '/hr/calendar'],
      tabs: [
        { name: 'Şöbələr və Struktur', path: '/hr/departments', icon: Building2 },
        { name: 'Vəzifələr (Ştatlar)', path: '/hr/positions', icon: Users },
        { name: 'İş Rejimləri (Şiftlər)', path: '/hr/shifts', icon: Clock },
        { name: 'İstehsalat Təqvimi', path: '/hr/calendar', icon: Calendar },
      ]
    }
  ];

  // Find active group
  const activeGroup = groups.find(g => g.match.some(m => path.startsWith(m)));

  if (!activeGroup || activeGroup.tabs.length === 0) return null;

  return (
    <div className={`w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 sticky ${isContentFullscreen ? 'top-0' : 'top-[76px]'} z-30 px-6 py-2 shadow-sm transition-all duration-300`}>
      <div className="max-w-[1700px] mx-auto flex items-center">
        
        {/* Global Fullscreen Toggle - Fixed top left position */}
        <button 
          onClick={() => setIsContentFullscreen(!isContentFullscreen)}
          className={`mr-4 p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center group ${
            isContentFullscreen 
            ? 'bg-primary-50 text-primary-600 shadow-inner' 
            : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:shadow-soft-sm'
          }`}
          title={isContentFullscreen ? "Sistemə qayıt" : "Tam ekran rejimi"}
        >
          {isContentFullscreen ? (
            <Minimize2 className="w-5 h-5 animate-in zoom-in-95 duration-300" />
          ) : (
            <Maximize2 className="w-5 h-5 animate-in zoom-in-95 duration-300" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mr-4"></div>

        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
          {activeGroup.tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) => 
                  `flex items-center space-x-2.5 px-5 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap group ${
                    isActive 
                      ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-soft-sm border border-slate-100/50 dark:border-slate-700' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`} />
                    <span className={`text-[11px] font-black uppercase tracking-widest italic ${isActive ? 'tracking-tighter' : ''}`}>{tab.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HRSubNav;
