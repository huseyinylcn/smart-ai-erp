import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, AlertCircle, Search, Filter, 
  MessageSquare, User, Calendar, ChevronRight, Send,
  MoreVertical, Shield, BarChart3, Settings
} from 'lucide-react';

const HelpdeskAdmin = () => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState([
    { id: 'T-1001', user: 'Əli Həsənov', company: 'TechAz MMC', subject: 'Maaş hesablama xətası', status: 'Açıq', priority: 'Yüksək', date: '2026-04-29', category: 'HR/Payroll' },
    { id: 'T-1002', user: 'Leyla Əliyeva', company: 'Global Solutions', subject: 'Serverə qoşulma problemi', status: 'Gözləmədə', priority: 'Təcili', date: '2026-04-28', category: 'IT Support' },
    { id: 'T-1003', user: 'Murad Məmmədov', company: 'Azeri Logistics', subject: 'Yeni istifadəçi əlavə edilməsi', status: 'Həll edilib', priority: 'Normal', date: '2026-04-27', category: 'Admin' },
  ]);

  const [reply, setReply] = useState('');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Açıq': return 'bg-blue-100 text-blue-600';
      case 'Gözləmədə': return 'bg-amber-100 text-amber-600';
      case 'Həll edilib': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-100px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Helpdesk İdarəetməsi
          </h1>
          <p className="text-sm text-slate-500 font-medium">Bütün müştəri müraciətlərini və dəstək biletlərini idarə edin.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1,2,3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                A{i}
              </div>
            ))}
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Ticket List Sidebar */}
        <div className="w-[400px] flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden shrink-0">
          <div className="p-6 border-b border-slate-50 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Bilet və ya müştəri axtar..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-indigo-100 font-medium" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bütün Biletlər ({tickets.length})</span>
              <button className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className={`p-6 cursor-pointer transition-all group ${selectedTicket?.id === ticket.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50/30'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${ticket.priority === 'Təcili' ? 'text-red-500' : 'text-slate-400'}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{ticket.date}</span>
                </div>
                <h4 className="text-[14px] font-black text-slate-800 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{ticket.subject}</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">
                    {ticket.user.charAt(0)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{ticket.user} • {ticket.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Conversation Area */}
        <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                    {selectedTicket.id.charAt(2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 leading-tight mb-1">{selectedTicket.subject}</h2>
                    <p className="text-sm font-bold text-slate-400">{selectedTicket.user} ({selectedTicket.company}) • {selectedTicket.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Statusu Dəyiş</button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/20">
                {/* Initial Ticket Message */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shrink-0 uppercase">
                    {selectedTicket.user.charAt(0)}
                  </div>
                  <div className="max-w-[80%]">
                    <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">
                        Salam, SBP sistemində bu gün səhər saatlarından bəri maaş hesablanmasında müəyyən xətalar müşahidə edirik. Xahiş edirəm bu məsələni araşdırasınız.
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold mt-2 block ml-2">{selectedTicket.date} 10:45</span>
                  </div>
                </div>

                {/* System Message */}
                <div className="flex items-center justify-center py-4">
                  <div className="bg-slate-100/50 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                    Bilet açıldı: {selectedTicket.id}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-50 shrink-0">
                <div className="relative">
                  <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Müştəriyə cavab yazın..." 
                    className="w-full p-6 pr-20 bg-slate-50 border-none rounded-3xl font-bold text-sm outline-none focus:ring-2 ring-indigo-100 resize-none"
                    rows={2}
                  ></textarea>
                  <button className="absolute right-4 bottom-4 p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Daxili qeyd əlavə et</button>
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Fayl yüklə</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-50">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mb-8">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight">Bilet Seçilməyib</h3>
              <p className="text-slate-400 font-medium mt-2">Detalları görmək və cavablandırmaq üçün soldakı siyahıdan bilet seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpdeskAdmin;
