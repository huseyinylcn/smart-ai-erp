import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  ChevronRight, Briefcase, CheckCircle2, Share2, 
  ShoppingCart, Users, Zap, Layout, Globe, Rocket, 
  Shield, MessageSquare, ArrowRight, Star, Cpu
} from 'lucide-react';

const ExplorePlatform = () => {
  const sections = [
    {
      title: 'Məhsullar',
      desc: 'Biznesinizi idarə etmək üçün lazım olan bütün rəqəmsal alətlər bir platformada.',
      path: '/overview/products',
      items: [
        { name: 'CRM', icon: Briefcase, color: 'bg-blue-50 text-blue-500' },
        { name: 'Tasks', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-500' },
        { name: 'HR', icon: Users, color: 'bg-pink-50 text-pink-500' },
        { name: 'Collaboration', icon: Share2, color: 'bg-purple-50 text-purple-500' }
      ]
    },
    {
      title: 'Həllərimiz',
      desc: 'Sizin sənayeniz üçün özəl olaraq konfiqurasiya edilmiş hazır biznes şablonları.',
      path: '/overview/solutions',
      items: [
        { name: 'Retail', icon: ShoppingCart, color: 'bg-amber-50 text-amber-500' },
        { name: 'Logistics', icon: Rocket, color: 'bg-orange-50 text-orange-500' },
        { name: 'Real Estate', icon: Globe, color: 'bg-indigo-50 text-indigo-500' },
        { name: 'Healthcare', icon: Shield, color: 'bg-teal-50 text-teal-500' }
      ]
    },
    {
      title: 'İnteqrasiyalar',
      desc: 'Sevdiyiniz bütün tətbiqləri SBP ilə birləşdirin və məlumat axınını avtomatlaşdırın.',
      path: '/overview/integrations',
      items: [
        { name: 'WhatsApp', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600' },
        { name: 'Google', icon: Globe, color: 'bg-blue-50 text-blue-600' },
        { name: 'AI / Copilot', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
        { name: 'APIs', icon: Cpu, color: 'bg-slate-100 text-slate-600' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <main>
        {/* MASTER HERO */}
        <section className="pt-48 pb-32 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#2D5BFF_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-6xl md:text-8xl font-black mb-10 leading-tight">SBP Dünyasını <br /> <span className="text-[#2D5BFF]">Kəşf Edin</span></h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-16">
              Məhsullarımızdan tutmuş sənaye həllərinə və minlərlə inteqrasiyaya qədər platformamızın bütün imkanlarını burada kəşf edin.
            </p>
            <div className="flex justify-center">
              <div className="w-1 h-24 bg-gradient-to-b from-[#2D5BFF] to-transparent animate-bounce" />
            </div>
          </div>
        </section>

        {/* ECOSYSTEM SECTIONS */}
        {sections.map((sec, idx) => (
          <section key={idx} className={`py-32 ${idx % 2 !== 0 ? 'bg-slate-50' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-20">
                <div className="lg:w-1/2">
                  <h2 className="text-5xl font-black text-slate-900 mb-8">{sec.title}</h2>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">{sec.desc}</p>
                  <Link 
                    to={sec.path}
                    className="inline-flex items-center space-x-3 px-8 py-4 bg-[#2D5BFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
                  >
                    <span>{sec.title} bölməsinə keç</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="lg:w-1/2 grid grid-cols-2 gap-6">
                  {sec.items.map((item, i) => (
                    <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                      <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                        <item.icon className="w-7 h-7" />
                      </div>
                      <h4 className="text-xl font-black text-slate-800 mb-2">{item.name}</h4>
                      <Link 
                        to={`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs font-black text-[#2D5BFF] uppercase tracking-widest hover:underline"
                      >
                        Daha çox
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* FULL ECOSYSTEM SITEMAP */}
        <section className="py-32 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
            <h2 className="text-5xl font-black mb-8 uppercase tracking-widest">Platforma Xəritəsi</h2>
            <p className="text-slate-400 font-medium">Bütün modullar, alt modullar və funksiyalar arasında sürətli naviqasiya.</p>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-16">
            <div>
              <h4 className="text-[#2D5BFF] font-black uppercase tracking-[0.2em] mb-10 text-xs">Məhsul Modulları</h4>
              <ul className="space-y-4">
                {['CRM & Satış', 'Tapşırıqlar & Layihə', 'HR & Heyət', 'Marketinq', 'Kollaborasiya'].map(link => (
                  <li key={link} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-bold uppercase tracking-widest">{link}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-emerald-500 font-black uppercase tracking-[0.2em] mb-10 text-xs">Həllərimiz</h4>
              <ul className="space-y-4">
                {['Pərakəndə satış', 'Daşınmaz əmlak', 'Logistika', 'Səhiyyə', 'Təhsil'].map(link => (
                  <li key={link} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-bold uppercase tracking-widest">{link}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-pink-500 font-black uppercase tracking-[0.2em] mb-10 text-xs">Dəstək & Təlim</h4>
              <ul className="space-y-4">
                {['Video Kurslar', 'Dokumentasiya', 'Vebinarlar', 'SBP Akademiya', 'Forum'].map(link => (
                  <li key={link} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-bold uppercase tracking-widest">{link}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-amber-500 font-black uppercase tracking-[0.2em] mb-10 text-xs">Şirkət</h4>
              <ul className="space-y-4">
                {['Haqqımızda', 'Vakansiyalar', 'Hüquqi sənədlər', 'Blog', 'Əlaqə'].map(link => (
                  <li key={link} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-bold uppercase tracking-widest">{link}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-[#2D5BFF]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-5xl font-black text-white mb-10">Bütün bunları tək bir platformada əldə edin</h2>
            <button className="px-12 py-6 bg-white text-[#2D5BFF] rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
              Hemen Qeydiyyatdan Keç
            </button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default ExplorePlatform;
