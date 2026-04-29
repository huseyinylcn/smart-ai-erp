import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';
import {
  BarChart2, Users, ShoppingCart, Phone, Package, Briefcase,
  Globe, FileText, ChevronDown, ChevronRight, Star, Play,
  CheckCircle, Zap, Brain, Shield, TrendingUp, ArrowRight
} from 'lucide-react';

import tarsaLogo from '../assets/tarsa_logo.png';
import payrollScreenshot from '../assets/payroll_screenshot.png';

const modules = [
  { name: 'HRM', icon: Users, color: 'bg-blue-500', desc: 'İnsan resurslarının idarəsi' },
  { name: 'ERP', icon: BarChart2, color: 'bg-violet-500', desc: 'Müəssisə resurs planlaması' },
  { name: 'CRM', icon: Briefcase, color: 'bg-emerald-500', desc: 'Müştəri münasibətlərinin idarəsi' },
  { name: 'Call Centre', icon: Phone, color: 'bg-orange-500', desc: 'Çağrı mərkəzi həlləri' },
  { name: 'Anbar', icon: Package, color: 'bg-cyan-500', desc: 'Anbar və inventar idarəsi' },
  { name: 'Satış', icon: ShoppingCart, color: 'bg-pink-500', desc: 'Satış proseslərinin avtomatlaşdırılması' },
  { name: 'Maliyyə', icon: TrendingUp, color: 'bg-amber-500', desc: 'Maliyyə hesabatları və planlaşdırma' },
  { name: 'Hesabat', icon: FileText, color: 'bg-slate-500', desc: 'Analitika və hesabat sistemi' },
];

const aiFeatures = [
  { icon: Brain, title: 'AI Proqnozlaşdırma', desc: 'Satış həcmini, inventar ehtiyaclarını və maliyyə axınlarını AI vasitəsilə öncədən proqnozlaşdırın.' },
  { icon: Zap, title: 'Smart Scheduling', desc: 'Əməkdaşların iş cədvəlini AI ilə optimallaşdırın. Avtomatik shift planlaması.' },
  { icon: Shield, title: 'AI Risk Analizi', desc: 'Biznes risklərini real vaxtda aşkarlayın və tövsiyələr alın.' },
];

const integrations = [
  { name: 'Expressbank', logo: 'https://vun.kapitalbank.az/assets/images/expressbank.png' },
  { name: 'Pasha Bank', logo: 'https://www.pashabank.az/static/images/pasha_logo_az.png' },
  { name: 'Kapital Bank', logo: 'https://upload.wikimedia.org/wikipedia/az/thumb/8/87/Kapital_Bank_Logo.png/1200px-Kapital_Bank_Logo.png' },
  { name: 'ABB', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/ABB_International_Bank_Logo.svg' },
  { name: 'AccessBank', logo: 'https://upload.wikimedia.org/wikipedia/az/thumb/d/d9/AccessBank_logo.png/1200px-AccessBank_logo.png' },
  { name: 'Trello', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Trello_logo.svg/1280px-Trello_logo.svg.png' },
  { name: 'Power BI', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Power_bi_logo.svg' },
  { name: 'Tableau', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Tableau_Logo.png' },
];

const blogPosts = [
  { 
    title: 'New module of your SBP Program', 
    category: 'Yenilik', 
    date: 'İndi', 
    image: 'https://img.freepik.com/free-vector/package-delivery-concept-illustration_114360-1111.jpg',
    color: 'bg-yellow-100'
  },
  { 
    title: 'Next module of your SBP Program', 
    category: 'Təziliklə', 
    date: '6 saat öncə', 
    image: 'https://img.freepik.com/free-vector/dashboard-interface-concept-illustration_114360-3103.jpg',
    color: 'bg-pink-100'
  },
  { 
    title: 'New module of your SBP Program', 
    category: 'Event', 
    date: '3 gün öncə', 
    image: 'https://img.freepik.com/free-vector/time-management-concept-illustration_114360-1013.jpg',
    color: 'bg-blue-100'
  },
  { 
    title: 'Changing world : How to keep up', 
    category: 'Hesabat', 
    date: '4 gün öncə', 
    image: 'https://img.freepik.com/free-vector/search-concept-illustration_114360-95.jpg',
    color: 'bg-green-100'
  },
];

const testimonials = [
  { name: 'Əli Həsənov', company: 'TechAz MMC', role: 'Baş Direktor', rating: 5, text: 'SmartAgent ERP bizim şirkətin səmərəliliyini 40% artırdı. Modul sistemi mükəmməldir.' },
  { name: 'Nigar Məmmədova', company: 'Global Trade', role: 'CFO', rating: 5, text: 'Maliyyə modulunun hesabat sistemi bizi tamamilə məftun etdi. İstifadəsi çox asandır.' },
  { name: 'Ruslan Əliyev', company: 'Solartech MMC', role: 'IT Direktoru', rating: 5, text: 'API inteqrasiyası mükəmməl işləyir. Komandamız çox qısa müddətdə adaptasiya oldu.' },
];

const faqs = [
  { q: 'Platformadan necə istifadə edə bilərəm?', a: 'Qeydiyyatdan keçib şirkətinizi yaradın. Dərhal 14 günlük pulsuz sınaq dövrünüz başlayacaq.' },
  { q: 'Neçə istifadəçi əlavə edə bilərəm?', a: 'Seçdiyiniz plana görə istifadəçi sayı dəyişir. Enterprise planda limitsiz istifadəçi əlavə edə bilərsiniz.' },
  { q: 'Məlumatlarım təhlükəsizdir?', a: 'Bütün məlumatlar SSL/TLS şifrələmə ilə qorunur. ISO 27001 sertifikatlı serverlərdə saxlanılır.' },
  { q: 'Texniki dəstək alıram?', a: '7/24 texniki dəstək komandamız həmişə sizin xidmətinizdədir. E-mail, canlı söhbət və zəng vasitəsilə əlaqə saxlaya bilərsiniz.' },
];

const clientLogos = [
  { name: 'TAR SA Group', logo: tarsaLogo, url: 'https://tarsagroup.az/' }
];

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingHeader />

      {/* HERO */}
      <section className="relative pt-20 bg-[#2D5BFF] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-full text-[10px] font-black mb-8 backdrop-blur-sm border border-white/20 uppercase tracking-[0.2em]">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>SBP — SmartAgent ERP Həlli</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
            SBP müştərilərinin 80%-ni tanıyırsınızmı?<br />
            Kiçik və orta biznesiniz varmı?
          </h1>
          <div className="w-24 h-1 bg-white/20 mx-auto mb-8 rounded-full" />
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            SBP həlləri gələcək imkanlardan istifadə etmək üçün təməl qurarkən biznesinizi bugünkü problemləri həll etmək üçün təchiz edir.
          </p>
          <button onClick={() => navigate('/pricing')} className="px-8 py-4 bg-white text-[#2D5BFF] rounded-full font-black text-sm hover:scale-105 transition-all shadow-xl flex items-center space-x-3 mx-auto">
            <Zap className="w-4 h-4" />
            <span>Demo Sına</span>
          </button>
        </div>

        {/* VIDEO EMBED */}
        <div className="relative max-w-5xl mx-auto px-4 pb-32">
          <div className="aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 group relative">
            <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="Demo Video" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-[#2D5BFF] fill-[#2D5BFF] ml-1" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SBP */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-black text-[#2D5BFF] uppercase tracking-widest">Niyə SBP?</span>
            <h2 className="text-4xl font-black text-slate-900 mt-4 mb-6">Biznesinizi rəqəmsallaşdıran<br />vahid platforma</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100">
              <div className="w-14 h-14 bg-blue-50 text-[#2D5BFF] rounded-2xl flex items-center justify-center mb-8">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-4">Təhlükəsizlik və Güvən</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Məlumatlarınız ən yüksək standartlarla qorunur və gündəlik olaraq yedəklənir.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-8">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-4">Sürətli İnteqrasiya</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Mövcud sistemlərinizlə asanlıqla inteqrasiya olunur və işinizi sürətləndirir.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100">
              <div className="w-14 h-14 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center mb-8">
                <BarChart2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-4">Dərin Analitika</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Süni intellekt dəstəkli hesabatlarla gələcəyi proqnozlaşdırın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS (Screen 5 style) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {clientLogos.map((item) => (
              <a 
                key={item.name} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-20 flex items-center justify-center transition-transform hover:scale-110"
              >
                <img src={item.logo} alt={item.name} className="max-h-full object-contain" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-black text-[#2D5BFF] uppercase tracking-widest">Modullar</span>
            <h2 className="text-4xl font-black text-slate-900 mt-4 mb-6">Hər biznes prosesi üçün<br />bir həll</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">8 əsas modul, yüzlərlə funksiya. Ehtiyacınıza görə seçin.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {modules.map((mod) => (
              <div 
                key={mod.name} 
                onClick={() => navigate(`/modules/${mod.name}`)}
                className="group bg-white border-2 border-slate-100 rounded-3xl p-8 hover:border-[#2D5BFF] hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer"
              >
                <div className={`w-14 h-14 ${mod.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <mod.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">{mod.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI FEATURES */}
      <section className="py-32 bg-gradient-to-br from-slate-900 to-[#1a0050]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Süni İntellekt</span>
            <h2 className="text-4xl font-black text-white mt-4 mb-6">AI ilə daha ağıllı<br />qərarlar alın</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiFeatures.map((f) => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/10 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-[#2D5BFF] to-cyan-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS (Refined per User Request) */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 space-y-10">
              <h2 className="text-5xl font-black text-slate-900 leading-tight">
                Platformaya uğurlu inteqrasiyalar
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
                Do you find yourself having to develop new business models to avoid being disrupted, gain efficiencies to fund innovation and transform mission-critical systems without business risk? ERP with SBP is the solution.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-10 pt-4">
                {integrations.map((item) => (
                  <div key={item.name} className="h-16 flex items-center justify-center transition-all duration-500 hover:scale-110">
                    <img src={item.logo} alt={item.name} className="max-h-full max-w-full object-contain shadow-sm rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative scale-110 lg:scale-110">
              {/* Laptop Mockup (Sleeker Version) */}
              <div className="relative mx-auto border-gray-900 bg-gray-900 border-[6px] rounded-t-2xl h-[180px] max-w-[320px] md:h-[300px] md:max-w-[540px] shadow-2xl">
                <div className="rounded-lg overflow-hidden h-[168px] md:h-[288px] bg-white">
                  <img src={payrollScreenshot} className="h-full w-full object-cover" alt="SmartAgent Dashboard" />
                </div>
              </div>
              <div className="relative mx-auto bg-gray-800 rounded-b-2xl h-[12px] max-w-[380px] md:h-[16px] md:max-w-[620px] shadow-lg">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[60px] h-[4px] md:w-[100px] md:h-[6px] bg-gray-950/20"></div>
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute -inset-20 bg-[#2D5BFF]/5 blur-[100px] rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* BLOG SECTION (Screen 3 style) */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl font-black text-slate-900">Bloq</h2>
            <div className="flex space-x-3">
              <button className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                <ArrowRight className="w-5 h-5 text-slate-400 rotate-180" />
              </button>
              <button className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm text-slate-900">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {blogPosts.map((post, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate(`/blog/${idx}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer"
              >
                <div className={`h-64 ${post.color} flex items-center justify-center p-8`}>
                  <img src={post.image} alt={post.title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-md tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-4 line-clamp-2 leading-tight group-hover:text-[#2D5BFF] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-black text-[#2D5BFF] uppercase tracking-widest">Müştəri Rəyləri</span>
            <h2 className="text-4xl font-black text-slate-900 mt-4">Müştərilərimiz nə deyir?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all">
                <div className="flex space-x-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-8 text-lg">"{t.text}"</p>
                <div>
                  <div className="font-black text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-400 mt-1">{t.role} — {t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-black text-[#2D5BFF] uppercase tracking-widest">FAQ</span>
            <h2 className="text-4xl font-black text-slate-900 mt-4">Tez-tez verilən suallar</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-slate-100 rounded-2xl overflow-hidden hover:border-blue-100 transition-all">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left">
                  <span className="font-bold text-slate-800 text-lg">{faq.q}</span>
                  {openFaq === idx ? <ChevronDown className="w-5 h-5 text-[#2D5BFF]" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/faq" className="inline-flex items-center space-x-2 text-[#2D5BFF] font-bold hover:underline">
              <span>Bütün sualları gör</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-[#2D5BFF] to-[#1a0050]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black text-white mb-6">Bizimlə rəqəmsal<br />gələcəyə addımlayın</h2>
          <p className="text-xl text-white/70 mb-12">Bu gün qeydiyyatdan keçin və ilk 14 günü ödənişsiz sınaqdan istifadə edin.</p>
          <button onClick={() => navigate('/auth/register')} className="px-12 py-6 bg-white text-[#2D5BFF] rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl active:scale-95">
            Pulsuz sına
          </button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Landing;
