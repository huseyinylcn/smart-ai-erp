import React, { useState, useEffect } from 'react';
import { 
  Shield, Globe, Database, Settings, BarChart3, 
  Users, MessageSquare, Zap, Layout, Terminal,
  Lock, Key, LogIn, ChevronRight, Activity, 
  Eye, Edit3, Trash2, Plus, Save, LifeBuoy,
  UserPlus, LayoutDashboard, Wand2, Map,
  Briefcase, Building, Search, FileText,
  PieChart, HelpCircle, Share2, Image as ImageIcon,
  Video, Link as LinkIcon, Type, Smartphone,
  CheckCircle2, AlertCircle, Clock, Send
} from 'lucide-react';

const SystemAdminPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeModule, setActiveModule] = useState<'dashboard' | 'website' | 'erp' | 'ai' | 'users' | 'helpdesk' | 'erp_admin'>('dashboard');
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Persistence for session
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/db');
      const data = await res.json();
      setDbData(data);
    } catch (err) {
      console.error('Backend connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminSession', 'active');
    } else {
      alert('Yanlış şifrə!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminSession');
  };

  const handleSaveCMS = async (section: string, newData: any) => {
    try {
      const updatedCMS = { ...dbData.cms, ...newData };
      await fetch('http://localhost:3001/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCMS)
      });
      fetchData();
      alert('CMS yeniləndi');
    } catch (err) {
      alert('Yadda saxlama xətası');
    }
  };

  const handleReplyTicket = async (ticketId: number) => {
    if (!replyText.trim()) return;
    // Mocking reply logic - in real world this would be an API call
    alert('Cavab göndərildi (Mock)');
    setReplyText('');
    setSelectedTicket(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">SBP Master Control</h1>
            <p className="text-slate-500 font-bold">Sistem İdarəetmə Panelinə Giriş</p>
          </div>
          <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Admin Şifrəsi</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 ring-indigo-500/50 font-black tracking-widest" 
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                <LogIn className="w-5 h-5" />
                Panelə Daxil Ol
              </button>
            </div>
          </form>
          <p className="text-center mt-8 text-slate-700 text-xs font-bold uppercase tracking-widest">SBP Enterprise System v2.0</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-xs">M</div>
            <span className="text-white font-black uppercase tracking-widest text-sm">Master Admin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistem Online</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'website', label: 'Vebsayt (CMS)', icon: Globe },
            { id: 'erp_admin', label: 'ERP Modulları', icon: Shield },
            { id: 'ai', label: 'Aİ Təlimatları', icon: Zap },
            { id: 'helpdesk', label: 'Helpdesk Admin', icon: LifeBuoy },
            { id: 'users', label: 'Adminlər', icon: UserPlus },
            { id: 'settings', label: 'Sistem Ayarları', icon: Settings },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveModule(item.id as any)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeModule === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'}`}
            >
              <div className="flex items-center space-x-4">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {activeModule === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full py-4 bg-slate-800 hover:bg-red-500/10 hover:text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4 rotate-180" /> Çıxış
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        <header className="p-8 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-20 border-b border-slate-800">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-4">
            <Terminal className="w-5 h-5 text-indigo-500" />
            {activeModule.toUpperCase()}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Linked</span>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {activeModule === 'dashboard' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Sayt Ziyarətçisi', val: '12,402', color: 'bg-indigo-500' },
                  { label: 'Bilet Sayı', val: dbData?.helpdesk?.length || 0, color: 'bg-emerald-500' },
                  { label: 'Aktiv Admin', val: dbData?.admins?.length || 0, color: 'bg-violet-500' },
                  { label: 'Sistem Yükü', val: '4%', color: 'bg-blue-500' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 blur-[40px] -mr-8 -mt-8 group-hover:opacity-10 transition-all`} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">{stat.label}</span>
                    <div className="text-3xl font-black text-white">{stat.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
                  <h3 className="text-lg font-black text-white mb-8 uppercase tracking-tight">Sistem Statusu</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-4">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-bold">Vebsayt Frontend</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500">ONLINE</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-4">
                        <Database className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-bold">Backend API Server</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500">ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === 'website' && dbData && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                  <Type className="w-5 h-5 text-indigo-500" /> CMS İdarəetməsi
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Hero Başlıq (Ana Səhifə)</label>
                      <input 
                        type="text" 
                        id="cms_hero_title"
                        defaultValue={dbData.cms.hero_title}
                        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white font-bold outline-none focus:ring-2 ring-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Hero Alt-Başlıq</label>
                      <textarea 
                        id="cms_hero_subtitle"
                        defaultValue={dbData.cms.hero_subtitle}
                        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white font-bold outline-none focus:ring-2 ring-indigo-500/50 min-h-[120px]"
                      />
                    </div>
                    <button 
                      onClick={() => handleSaveCMS('hero', {
                        hero_title: (document.getElementById('cms_hero_title') as HTMLInputElement).value,
                        hero_subtitle: (document.getElementById('cms_hero_subtitle') as HTMLTextAreaElement).value,
                      })}
                      className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Saxla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === 'helpdesk' && (
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
              <div className="p-10 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <LifeBuoy className="w-6 h-6 text-indigo-500" /> Müştəri Dəstəyi
                </h3>
                <div className="flex gap-4">
                   <span className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Açıq: {dbData?.helpdesk?.filter((t: any) => t.status === 'open').length}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5 border-r border-slate-800 max-h-[600px] overflow-y-auto">
                  {dbData?.helpdesk?.map((ticket: any) => (
                    <button 
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`w-full p-8 text-left border-b border-slate-800 hover:bg-slate-800/20 transition-all ${selectedTicket?.id === ticket.id ? 'bg-indigo-600/5 border-l-4 border-l-indigo-600' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">#{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${ticket.status === 'open' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white mb-2 line-clamp-1">{ticket.subject}</h4>
                      <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-1">{ticket.description}</p>
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-bold text-indigo-500">{ticket.category}</span>
                         <span className="text-[9px] font-bold text-slate-600">{ticket.created_at?.split('T')[0]}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-7 bg-slate-950 p-10 min-h-[600px] flex flex-col">
                  {selectedTicket ? (
                    <>
                      <div className="flex-1 space-y-8">
                        <div className="pb-8 border-b border-slate-800">
                          <h4 className="text-2xl font-black text-white mb-2">{selectedTicket.subject}</h4>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-400">Göndərən: {selectedTicket.user_id}</span>
                            <span className="text-xs font-bold text-slate-400">•</span>
                            <span className="text-xs font-bold text-indigo-500">{selectedTicket.priority.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 italic text-slate-300">
                          "{selectedTicket.description}"
                        </div>
                        {/* Mock replies list */}
                        <div className="space-y-4">
                          <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 ml-12">
                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest block mb-2">Sistem Cavabı (Aİ)</span>
                            <p className="text-xs text-slate-300">Sorğunuz qeydə alındı. Texniki komandamız hazırda məsələ ilə məşğuldur.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 pt-8 border-t border-slate-800">
                        <textarea 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="İstifadəçiyə cavab yazın..."
                          className="w-full bg-slate-900 border border-slate-800 p-6 rounded-[2rem] text-sm text-white font-medium outline-none focus:ring-2 ring-indigo-500/50 min-h-[120px] resize-none"
                        />
                        <div className="flex justify-end mt-4">
                          <button 
                            onClick={() => handleReplyTicket(selectedTicket.id)}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3"
                          >
                            <Send className="w-4 h-4" /> Cavabı Göndər
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-6">
                        <MessageSquare className="w-8 h-8 text-slate-700" />
                      </div>
                      <h4 className="text-lg font-black text-slate-500 uppercase tracking-widest">Bilet Seçilməyib</h4>
                      <p className="text-xs text-slate-700 font-bold max-w-xs mt-2">Sol tərəfdən bilet seçərək detallara baxa və cavab yaza bilərsiniz.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeModule === 'ai' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <Zap className="w-6 h-6 text-indigo-500" /> Aİ Agent Təlimatları
                  </h3>
                  <div className="px-4 py-2 bg-indigo-600/10 text-indigo-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Model: GPT-4o Master</div>
                </div>
                
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2rem]">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">ERP Aİ Davranış Təlimatı</label>
                       <textarea 
                        className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl text-xs text-slate-300 font-medium min-h-[200px] outline-none focus:ring-1 ring-indigo-500"
                        defaultValue={dbData?.ai_instructions?.erp_agent || "Sən SmartAgent ERP-nin daxili köməkçisisən. İstifadəçilərə biznes proseslərində kömək et..."}
                       />
                    </div>
                    <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2rem]">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Landing Page Satış Agent Təlimatı</label>
                       <textarea 
                        className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl text-xs text-slate-300 font-medium min-h-[200px] outline-none focus:ring-1 ring-indigo-500"
                        defaultValue={dbData?.ai_instructions?.sales_agent || "Sən vebsaytın ziyarətçiləri ilə danışan satış mütəxəssisisən. Məqsədin müştərini qeydiyyata sövq etməkdir..."}
                       />
                    </div>
                  </div>
                  <button className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">
                    Agentləri Yenidən Təlim Et (Retrain)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeModule === 'erp_admin' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {[
               { title: 'Aİ İnkişaf Köməkçisi', icon: Wand2, color: 'text-violet-500', desc: 'ERP-nin yeni modullarını və funksiyalarını planlaşdırın.' },
               { title: 'Aİ Şablon Qurucu', icon: Layout, color: 'text-blue-500', desc: 'Müəssisə üçün sənəd və hesabat şablonlarını avtomatlaşdırın.' },
               { title: 'Aİ Strateji Məsləhətçi', icon: PieChart, color: 'text-emerald-500', desc: 'Biznes datası əsasında böyümə strategiyaları hazırlayın.' },
               { title: 'Yol Xəritəsi (Roadmap)', icon: Map, color: 'text-indigo-500', desc: 'SmartAgent-in inkişaf mərhələlərini idarə edin.' },
               { title: 'Sektor Analizləri (Industry)', icon: Building, color: 'text-orange-500', desc: 'Müxtəlif sənaye sahələri üçün ERP uyğunluq analizi.' },
               { title: 'Bitrix24 Analizi', icon: Share2, color: 'text-sky-500', desc: 'Rəqib platforma ilə müqayisəli analizlər.' }
             ].map((tool, i) => (
               <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-indigo-500/50 hover:bg-slate-800/30 transition-all cursor-pointer group">
                 <div className={`w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center mb-6 border border-slate-800 group-hover:scale-110 transition-transform`}>
                   <tool.icon className={`w-7 h-7 ${tool.color}`} />
                 </div>
                 <h4 className="text-lg font-black text-white mb-3">{tool.title}</h4>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed">{tool.desc}</p>
               </div>
             ))}
           </div>
          )}

          {activeModule === 'users' && (
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <UserPlus className="w-6 h-6 text-indigo-500" /> Admin İdarəetməsi
                  </h3>
                  <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Yeni Admin Əlavə Et</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {dbData?.admins?.map((admin: any) => (
                    <div key={admin.id} className="p-8 bg-slate-950 border border-slate-800 rounded-[2rem] flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center">
                           <Users className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                          <div className="text-lg font-black text-white">{admin.id}</div>
                          <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{admin.role}</div>
                        </div>
                      </div>
                      <button className="p-3 bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-all"><Edit3 className="w-5 h-5" /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SystemAdminPortal;
