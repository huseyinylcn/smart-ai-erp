import React, { useState } from 'react';
import { 
  Search, Plus, Filter, MessageSquare, Clock, 
  CheckCircle2, AlertCircle, ChevronRight, Send,
  FileText, HelpCircle, BookOpen, ExternalLink
} from 'lucide-react';

const Helpdesk = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'kb'>('tickets');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'HR/Payroll', priority: 'normal', description: '' });

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/helpdesk');
      const data = await res.json();
      setTickets(data.reverse()); // Show newest first
    } catch (err) {
      console.error('Helpdesk fetch error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/helpdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...newTicket,
            user_id: 'Cari İstifadəçi' // Mock current user
        })
      });
      if (res.ok) {
          fetchTickets();
          setShowNewTicket(false);
          setNewTicket({ subject: '', category: 'HR/Payroll', priority: 'normal', description: '' });
      }
    } catch (err) {
      alert('Bilet göndərilmədi');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-600';
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'closed': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Helpdesk & Dəstək
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Sistem və texniki məsələlər üzrə kömək alın.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNewTicket(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            Yeni Bilet
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('tickets')}
          className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Mənim Biletlərim
        </button>
        <button 
          onClick={() => setActiveTab('kb')}
          className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'kb' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Bilik Bazası (KB)
        </button>
      </div>

      {activeTab === 'tickets' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Bilet axtar..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 ring-indigo-100 outline-none w-64" />
                  </div>
                </div>
                <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-6 hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-black text-slate-400 tracking-widest">{ticket.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${ticket.priority === 'high' || ticket.priority === 'urgent' ? 'text-red-500' : 'text-slate-400'}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">{ticket.created_at?.split('T')[0]}</span>
                    </div>
                    <h3 className="text-[15px] font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{ticket.subject}</h3>
                    <p className="text-[12px] text-slate-500 font-medium italic">{ticket.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats & Quick Links */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-6">Dəstək Vəziyyəti</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white/70">Açıq biletlər</span>
                  <span className="text-2xl font-black">02</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white/70">Ortalama həll vaxtı</span>
                  <span className="text-2xl font-black">4s</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Faydalı Linklər</h3>
              <div className="space-y-4">
                {[
                  { title: 'Sistem statusu', icon: CheckCircle2, color: 'text-emerald-500' },
                  { title: 'Video təlimatlar', icon: HelpCircle, color: 'text-blue-500' },
                  { title: 'SBP İcması', icon: BookOpen, color: 'text-violet-500' }
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{item.title}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-8">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Bilik Bazası Hazırlanır</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            SBP sistemi üzrə bütün sənədlər, təlimatlar və "Necə etməli" (How-to) məqalələri tezliklə burada olacaq.
          </p>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300">
            <form onSubmit={handleCreateTicket} className="p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Yeni Bilet Yarat</h2>
                <button type="button" onClick={() => setShowNewTicket(false)} className="p-2 hover:bg-slate-50 rounded-xl">
                  <Plus className="w-6 h-6 text-slate-400 rotate-45" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Mövzu</label>
                  <input 
                    required type="text" value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    placeholder="Məs: Sistemdə gecikmə var" 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-100" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Kateqoriya</label>
                    <select 
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-100 appearance-none"
                    >
                      <option>HR/Payroll</option>
                      <option>Maliyyə</option>
                      <option>Təchizat</option>
                      <option>IT Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Prioritet</label>
                    <select 
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-100 appearance-none"
                    >
                      <option value="normal">Normal</option>
                      <option value="high">Yüksək</option>
                      <option value="urgent">Təcili</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Təsvir</label>
                  <textarea 
                    required rows={4} value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    placeholder="Problemi ətraflı izah edin..." 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-100 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100">Bileti Göndər</button>
                <button type="button" onClick={() => setShowNewTicket(false)} className="px-10 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest">Ləğv et</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Helpdesk;
