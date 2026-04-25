import { User, Settings, CreditCard, LogOut, ChevronRight, ShieldCheck, Mail } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const ProfileDropdown = ({ isOpen, onClose, onLogout }: ProfileDropdownProps) => {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Profilim', icon: User, path: '/settings', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Sistem Tənzimləmələri', icon: Settings, path: '/settings', color: 'text-slate-600 bg-slate-50' },
    { label: 'Ödəniş və Abunəlik', icon: CreditCard, path: '/settings', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Təhlükəsizlik', icon: ShieldCheck, path: '/settings', color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute top-[80px] right-0 w-[320px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-soft-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
        <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative overflow-hidden">
           <div className="absolute opacity-10 top-[-20%] right-[-10%] w-32 h-32 bg-white blur-3xl rounded-full"></div>
           <div className="flex items-center space-x-4 relative">
              <div className="w-14 h-14 rounded-2xl bg-white/10 p-1 backdrop-blur-md shadow-inner">
                 <div className="w-full h-full bg-white text-indigo-900 rounded-xl flex items-center justify-center font-black text-lg">AƏ</div>
              </div>
              <div>
                 <h4 className="font-extrabold text-white uppercase tracking-tight">Ali Əliyev</h4>
                 <div className="flex items-center text-[10px] font-black text-indigo-300 uppercase tracking-widest mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_#34d399]"></div>
                    Aktiv Profil
                 </div>
              </div>
           </div>
        </div>

        <div className="p-3">
           {menuItems.map(item => (
             <NavLink
               key={item.label}
               to={item.path}
               onClick={onClose}
               className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group mb-1"
             >
                <div className="flex items-center space-x-3.5">
                   <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                   </div>
                   <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
             </NavLink>
           ))}
        </div>

        <div className="p-3 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
           <button 
             onClick={onLogout}
             className="w-full flex items-center space-x-3.5 p-3.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all font-black"
           >
              <div className="w-9 h-9 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center">
                 <LogOut className="w-5 h-5" />
              </div>
              <span className="text-[13.5px] uppercase tracking-widest leading-none">Sistemdən Çıxış</span>
           </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;
