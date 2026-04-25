import React, { useState } from 'react';
import { 
  Calendar, Clock, Users, Plus, 
  Search, Filter, ChevronLeft, ChevronRight,
  MoreVertical, CalendarClock, CheckCircle2,
  AlertCircle, LayoutGrid, List, Settings,
  UserPlus, Mail, Phone, ExternalLink, X,
  Maximize2, Minimize2, Download, Share2
} from 'lucide-react';

const Booking = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const resources = [
    { id: 1, name: "Consultation Room A", type: "Room", status: "Available" },
    { id: 2, name: "Meeting Hall", type: "Room", status: "Occupied" },
    { id: 3, name: "Service Bay 1", type: "Service", status: "Available" },
    { id: 4, name: "Dr. Aliyev", type: "Specialist", status: "Available" }
  ];

  const timeSlots = Array.from({ length: 11 }, (_, i) => `${i + 9}:00`);

  const bookings = [
    { id: 1, resourceId: 1, client: "Anar Quliyev", time: "09:00", duration: "1h", service: "Financial Audit", status: "Confirmed" },
    { id: 2, resourceId: 2, client: "ABC Corp", time: "10:00", duration: "2h", service: "Strategy Meeting", status: "Processing" },
    { id: 3, resourceId: 4, client: "Lala M.", time: "11:00", duration: "30m", service: "HR Consultation", status: "Confirmed" }
  ];

  const waitingList = [
    { id: 101, name: "Zaur H.", request: "Urgent Meeting", date: "Today", priority: "High" },
    { id: 102, name: "Gunel A.", request: "System Demo", date: "Tomorrow", priority: "Medium" }
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex h-[calc(100vh-40px)] bg-[#F8FAFC] dark:bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center space-x-12">
            <h1 className="text-[22px] font-black text-slate-800 dark:text-white uppercase italic tracking-tighter flex items-center space-x-3">
               <CalendarClock className="w-8 h-8 text-primary-600" />
               <span>Booking Hub</span>
            </h1>

            <nav className="flex items-center bg-slate-100/50 dark:bg-slate-800 rounded-xl p-1.5">
               {['bookings', 'services', 'resources'].map((tab) => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                 >
                   {tab}
                 </button>
               ))}
            </nav>
          </div>

          <div className="flex items-center space-x-6">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search bookings..." 
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-12 pr-6 py-3 text-[12px] font-bold italic w-64 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
             </div>
             <button className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-primary-500">
                <Filter className="w-5 h-5" />
             </button>
             <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-primary-500/20 transition-all active:scale-95 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
             </button>
          </div>
        </header>

        {/* TIMELINE AREA */}
        <div className="flex-1 overflow-x-auto custom-scrollbar flex flex-col">
          
          {/* Sub Header (Counters) */}
          <div className="h-14 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center px-10 space-x-8 shrink-0">
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">Confirmed: 24</span>
             </div>
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">Pending: 5</span>
             </div>
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">Cancelled: 2</span>
             </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Resources List (Vertical) */}
            <div className="w-[280px] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shrink-0">
               <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-[0.2em]">Resources</span>
                  <button className="text-primary-600 hover:text-primary-700 font-bold text-[10px] uppercase italic">Edit</button>
               </div>
               <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {resources.map((res) => (
                    <div key={res.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                       <h3 className="text-[12px] font-black text-slate-700 dark:text-slate-200 uppercase italic tracking-tight mb-1 group-hover:text-primary-600">{res.name}</h3>
                       <div className="flex items-center space-x-3">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{res.type}</span>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${res.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                             {res.status}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full py-6 text-[10px] font-black text-primary-600 uppercase italic border-t border-slate-50 dark:border-slate-800 hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2">
                  <Plus className="w-3 h-3" />
                  <span>Add Resource</span>
               </button>
            </div>

            {/* Timeline View (Horizontal) */}
            <div className="flex-1 overflow-x-auto custom-scrollbar bg-white dark:bg-slate-900/40 relative">
               
               {/* Time Headers */}
               <div className="flex h-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 sticky top-0 z-10">
                  {timeSlots.map((time) => (
                    <div key={time} className="w-[180px] shrink-0 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">{time}</span>
                    </div>
                  ))}
               </div>

               {/* Grid Content */}
               <div className="relative">
                  {resources.map((res) => (
                    <div key={res.id} className="flex h-[81px] border-b border-slate-100 dark:border-slate-800 group hover:bg-slate-50/30 transition-colors">
                       {timeSlots.map((time) => (
                         <div key={`${res.id}-${time}`} className="w-[180px] shrink-0 border-r border-slate-100 dark:border-slate-800 relative">
                            {/* Cell content could go here */}
                         </div>
                       ))}
                       
                       {/* Floating Booking Cards (Absolute Positioned) */}
                       {bookings.filter(b => b.resourceId === res.id).map((book) => {
                          const startIndex = timeSlots.indexOf(book.time);
                          const width = book.duration === '2h' ? 360 : book.duration === '30m' ? 90 : 180;
                          return (
                            <div 
                              key={book.id}
                              style={{ left: startIndex * 180 + 8, width: width - 16 }}
                              className={`absolute top-4 bottom-4 rounded-xl p-4 shadow-lg border-l-4 overflow-hidden transition-all hover:scale-[1.02] hover:z-20 cursor-pointer ${
                                book.status === 'Confirmed' 
                                ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-emerald-500/5' 
                                : 'bg-white dark:bg-slate-800 border-amber-500 shadow-amber-500/5'
                              }`}
                            >
                               <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase italic truncate pr-2">{book.client}</span>
                                  <CheckCircle2 className={`w-3 h-3 ${book.status === 'Confirmed' ? 'text-emerald-500' : 'text-amber-500'}`} />
                               </div>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">{book.service}</p>
                            </div>
                          );
                       })}
                    </div>
                  ))}

                  {/* Current Time Indicator (Static for demo) */}
                  <div className="absolute top-0 bottom-0 left-[450px] w-px bg-primary-500 z-10">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-500 ring-4 ring-primary-500/20"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR (Calendar & Waiting List) */}
      <div className="w-[340px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
         
         {/* Mini Calendar Section */}
         <div className="p-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-[12px] font-black text-slate-800 dark:text-white uppercase italic tracking-widest">April 2026</h2>
               <div className="flex space-x-2">
                  <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-all"><ChevronLeft className="w-4 h-4"/></button>
                  <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-all"><ChevronRight className="w-4 h-4"/></button>
               </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
               {daysOfWeek.map(day => (
                 <div key={day} className="text-[10px] font-black text-slate-400 uppercase italic text-center">{day}</div>
               ))}
               {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                 <button 
                  key={day}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all ${
                    day === 22 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                 >
                   {day}
                 </button>
               ))}
            </div>
         </div>

         {/* Waiting List Section */}
         <div className="flex-1 flex flex-col p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-6 shrink-0">
               <h2 className="text-[12px] font-black text-slate-800 dark:text-white uppercase italic tracking-widest flex items-center space-x-2">
                  <span>Waiting list</span>
                  <span className="bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded text-[10px] font-black">2</span>
               </h2>
               <button className="text-primary-600 hover:text-primary-700 font-black text-[10px] uppercase italic">Add</button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
               {waitingList.map((item) => (
                 <div key={item.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group cursor-move">
                    <div className="flex items-center justify-between mb-3">
                       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${item.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                          {item.priority} Priority
                       </span>
                       <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-slate-600"><MoreVertical className="w-4 h-4"/></button>
                    </div>
                    <h4 className="text-[13px] font-black text-slate-800 dark:text-white uppercase italic tracking-tight mb-1">{item.name}</h4>
                    <p className="text-[11px] font-medium text-slate-500 italic mb-4">{item.request}</p>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 italic">
                          <Clock className="w-3 h-3" />
                          <span>{item.date}</span>
                       </div>
                       <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-primary-600 hover:scale-110 transition-all">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Footer Actions */}
         <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30">
            <button className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest italic shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-3">
               <Settings className="w-4 h-4" />
               <span>Booking Settings</span>
            </button>
         </div>
      </div>

      <style>{`
        .italic-none { font-style: normal !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
      `}</style>

    </div>
  );
};

export default Booking;
