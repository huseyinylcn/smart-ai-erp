import { Bell, ShoppingBag, UserCheck, MessageSquare, Plus, Check, Clock } from 'lucide-react';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsDropdown = ({ isOpen, onClose }: NotificationsDropdownProps) => {
  if (!isOpen) return null;

  const notifications = [
    { 
      id: 1, type: 'order', title: 'Yeni Satış Qaiməsi', 
      desc: '#S-2026 qaiməsi təsdiq gözləyir.', 
      time: '10 dəq. öncə', icon: ShoppingBag, color: 'text-indigo-600 bg-indigo-50' 
    },
    { 
      id: 2, type: 'hr', title: 'Kadr Əmri Təsdiqləndi', 
      desc: 'Nika Məmmədovanın işə qəbulu təsdiqləndi.', 
      time: '2 saat öncə', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' 
    },
    { 
      id: 3, type: 'msg', title: 'Yeni Mesaj', 
      desc: 'İlkin Məmmədov tərəfindən yeni mesaj var.', 
      time: 'Dünən', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' 
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute top-[80px] right-0 w-[400px] bg-white dark:bg-slate-900 rounded-3xl shadow-soft-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
        <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-sm">Bildirişlər</span>
            <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">3</span>
          </div>
          <button className="text-[11px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center">
            <Check className="w-3.5 h-3.5 mr-1" /> Hamısını oxunmuş et
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
           {notifications.map(item => (
             <button key={item.id} className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all flex items-start space-x-4 group border border-transparent hover:border-slate-100 dark:hover:border-slate-800 mb-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${item.color}`}>
                   <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                   <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                   <div className="flex items-center mt-2.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3 mr-1.5" /> {item.time}
                   </div>
                </div>
             </button>
           ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
           <button className="w-full py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all">
              Bütün Bildirişlərə Bax
           </button>
        </div>
      </div>
    </>
  );
};

export default NotificationsDropdown;
