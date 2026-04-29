import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  Search, HelpCircle, MessageSquare, BookOpen, 
  Settings, Zap, Globe, Monitor, Shield, Headphones,
  PlayCircle, FileText, ChevronRight, ArrowRight
} from 'lucide-react';

const Helpdesk = () => {
  const [activeTab, setActiveTab] = useState('documentation');

  const categories = [
    { 
      id: 'erp-docs', 
      title: 'ERP Sənədləri', 
      icon: BookOpen, 
      desc: 'Modulların istifadəsi üzrə ətraflı təlimatlar.',
      links: ['Tədarük idarəetməsi', 'Əmək haqqı hesablama', 'Xəzinə əməliyyatları', 'CRM və Satış']
    },
    { 
      id: 'it-services', 
      title: 'İT Xidmətləri', 
      icon: Monitor, 
      desc: 'Texniki dəstək, avadanlıq və proqram təminatı xidmətləri.',
      links: ['Şəbəkə quraşdırılması', 'Server idarəetməsi', 'Kiber təhlükəsizlik', 'Avadanlıq təmiri']
    },
    { 
      id: 'video-tutorials', 
      title: 'Video Dərslər', 
      icon: PlayCircle, 
      desc: 'SBP sistemindən istifadəni vizual olaraq öyrənin.',
      links: ['Yeni başlayanlar üçün SBP', 'Maliyyə hesabatları', 'İşçilərin qeydiyyatı']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-40 pb-24">
        {/* Help Center Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 uppercase tracking-tight">Dəstək Mərkəzi</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium mb-12">
            Sizə necə kömək edə bilərik? ERP təlimatları, İT xidmətləri və texniki dəstək üçün doğru yerdəsiniz.
          </p>
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input 
                type="text" 
                placeholder="Sualınızı daxil edin və ya mövzu axtarın..." 
                className="w-full pl-20 pr-8 py-7 bg-white rounded-[2.5rem] border-2 border-slate-100 focus:border-[#2D5BFF] transition-all font-medium text-slate-700 outline-none shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Support Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2D5BFF] mb-8 group-hover:bg-[#2D5BFF] group-hover:text-white transition-all shadow-lg shadow-blue-500/5">
                <cat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{cat.title}</h3>
              <p className="text-slate-500 font-medium mb-8 text-sm leading-relaxed">{cat.desc}</p>
              <ul className="space-y-4 mb-10">
                {cat.links.map((link, i) => (
                  <li key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-700 hover:text-[#2D5BFF] cursor-pointer transition-colors group/link">
                    <ChevronRight className="w-4 h-4 text-[#2D5BFF] group-hover/link:translate-x-1 transition-transform" />
                    <span>{link}</span>
                  </li>
                ))}
              </ul>
              <button className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#2D5BFF] hover:translate-x-2 transition-transform">
                <span>Hamısına bax</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>

        {/* IT SERVICES & TICKET FLOW (NEW) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2D5BFF] skew-x-[-20deg] translate-x-32 opacity-20" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2">
                <span className="text-xs font-black text-[#2D5BFF] uppercase tracking-[0.4em] mb-6 block">Texniki Dəstək</span>
                <h2 className="text-5xl font-black mb-8 leading-tight">İT Xidmətlərinə <br /> ehtiyacınız var?</h2>
                <p className="text-xl text-slate-400 font-medium mb-10">
                  Şəbəkə problemləri, server quraşdırılması və ya ümumi texniki dəstək üçün dərhal müraciət edin.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-10 py-5 bg-[#2D5BFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20">
                    Bilet Yarat (Ticket)
                  </button>
                  <button className="px-10 py-5 bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                    Canlı Çat (Live Support)
                  </button>
                </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-6">
                {[
                  { title: '7/24 Dəstək', icon: Headphones },
                  { title: 'Sürətli Həll', icon: Zap },
                  { title: 'SLA Təminatı', icon: Shield },
                  { title: 'Təhlükəsizlik', icon: Shield }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center group hover:bg-white/10 transition-all">
                    <item.icon className="w-8 h-8 text-[#2D5BFF] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Quick Access */}
        <section className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-12">Tez-tez verilən suallar</h2>
          <div className="space-y-4">
            {[
              'Sınaq müddəti necə işləyir?',
              'Məlumatların köçürülməsi (migrasiya) necə aparılır?',
              'Təhlükəsizlik standartlarınız hansılardır?',
              'İT dəstək paketlərinə nələr daxildir?'
            ].map((q, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 text-left flex justify-between items-center group cursor-pointer hover:border-[#2D5BFF] transition-all">
                <span className="font-bold text-slate-700">{q}</span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#2D5BFF] transition-colors" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Helpdesk;
