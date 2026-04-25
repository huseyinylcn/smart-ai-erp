import { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, 
  Clock, 
  Bell
} from 'lucide-react';

const Calendar = () => {
  const [currentDate] = useState(new Date());
  
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];
  
  const daysOfWeek = ["B.E", "Ç.A", "Ç", "C.A", "C", "Ş", "B"];

  const events = [
    { id: 1, title: "Rüblük Hesabat", time: "10:00 - 11:30", type: "WORK", color: "bg-indigo-600", day: 15 },
    { id: 2, title: "Yeni Layihə Görüşü", time: "14:00 - 15:00", type: "MEETING", color: "bg-emerald-500", day: 18 },
    { id: 3, title: "Satış Təlimi", time: "09:00 - 10:30", type: "TRAINING", color: "bg-amber-500", day: 22 },
    { id: 4, title: "Büdcə Planlaşdırılması", time: "16:00 - 17:00", type: "FINANCE", color: "bg-rose-500", day: 25 },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">İş Planı</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Təqvim & Planlayıcı</h1>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
              <Plus className="w-4 h-4" />
              <span>Yeni Hadisə</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
        
        {/* CALENDAR MAIN */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8">
           <div className="flex items-center justify-between mb-10 px-4">
              <div className="flex items-center space-x-4">
                 <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">
                   {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                 </h2>
                 <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-1 shadow-inner border border-slate-100 dark:border-slate-700">
                    <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                       <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
              <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1 shadow-inner border border-slate-100 dark:border-slate-700">
                 <button className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-sm italic">Ay</button>
                 <button className="px-6 py-3 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-colors italic">Həftə</button>
                 <button className="px-6 py-3 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-colors italic">Gün</button>
              </div>
           </div>

           <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              {daysOfWeek.map((day) => (
                <div key={day} className="bg-slate-50 dark:bg-slate-900 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - startDayOfMonth(currentDate.getMonth(), currentDate.getFullYear()) + 1;
                const isCurrentMonth = day > 0 && day <= daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
                const isToday = day === new Date().getDate();
                const event = events.find(e => e.day === day && isCurrentMonth);

                return (
                  <div key={i} className={`min-h-[140px] bg-white dark:bg-slate-900 p-4 relative group transition-all ${!isCurrentMonth ? 'opacity-20 pointer-events-none' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}>
                    <span className={`text-[11px] font-black italic tabular-nums ${isToday ? 'bg-indigo-600 text-white w-8 h-8 rounded-xl flex items-center justify-center' : 'text-slate-400'}`}>
                      {day > 0 && day <= 31 ? day : ''}
                    </span>
                    
                    {event && (
                      <div className={`mt-3 p-3 rounded-2xl ${event.color} text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all cursor-pointer`}>
                         <p className="text-[10px] font-black uppercase italic tracking-tighter line-clamp-1">{event.title}</p>
                         <p className="text-[8px] font-bold opacity-70 mt-1 uppercase italic tracking-widest">{event.time}</p>
                      </div>
                    )}

                    <button className="absolute bottom-4 right-4 w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 hover:text-indigo-600 transition-all">
                       <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
           </div>
        </div>

        {/* UPCOMING & FILTERS */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8">
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-8 tracking-wide">Yaxınlaşan Hadisələr</h3>
              <div className="space-y-6">
                 {events.map((event) => (
                   <div key={event.id} className="flex items-start space-x-5 group cursor-pointer">
                      <div className={`shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg ${event.color} transition-transform group-hover:scale-110`}>
                         <span className="text-[9px] font-black uppercase opacity-70 italic tracking-widest">Mart</span>
                         <span className="text-xl font-black italic tabular-nums leading-none mt-1">{event.day}</span>
                      </div>
                      <div className="flex-1 min-w-0 border-b border-slate-100 dark:border-slate-800 pb-5">
                         <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-1 truncate">{event.title}</h4>
                         <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400 italic">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all italic">Bütün Hadisələrə Bax</button>
           </div>

           <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
              <div className="relative z-10">
                 <Bell className="w-10 h-10 mb-6 opacity-80" />
                 <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Görüş Bildirişi</h3>
                 <p className="text-[12px] font-black opacity-80 uppercase italic tracking-widest leading-relaxed">Yeni layihənin təqdimatı üçün 15 dəqiqə qaldı.</p>
                 <button className="mt-8 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all italic shadow-xl">İşitrak Et</button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
