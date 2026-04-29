import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  ChevronRight, Briefcase, CheckCircle2, Share2, 
  ShoppingCart, Users, Zap, Layout, Globe, Rocket, Shield
} from 'lucide-react';

const SectionOverview = () => {
  const { section } = useParams();

  const sectionData: Record<string, any> = {
    'products': {
      title: 'SBP Məhsul Ekosistemi',
      subtitle: 'Bütün biznes prosesləriniz üçün vahid platforma',
      desc: 'Müştəri münasibətlərindən tutmuş, layihə idarəetməsi və AI dəstəkli avtomatlaşdırmaya qədər hər şey burada.',
      categories: [
        { id: 'crm', name: 'CRM', icon: Briefcase, features: ['Leads', 'Deals', 'Contact Center'] },
        { id: 'tasks', name: 'Tasks', icon: CheckCircle2, features: ['Gantt', 'Kanban', 'Time Tracking'] },
        { id: 'hr', name: 'HR', icon: Users, features: ['Payroll', 'Attendance', 'Recruitment'] }
      ]
    },
    'solutions': {
      title: 'Biznesiniz üçün Özəl Həllər',
      subtitle: 'Sənaye və sahəyə uyğun konfiqurasiyalar',
      desc: 'Hər bir sektorun özünəməxsus ehtiyacları var. Biz SBP-ni sizin sahəniz üçün optimallaşdırırıq.',
      categories: [
        { id: 'retail', name: 'Retail', icon: ShoppingCart, features: ['Stock', 'POS', 'Loyalty'] },
        { id: 'real-estate', name: 'Real Estate', icon: Globe, features: ['Listing', 'Leads', 'Contracts'] },
        { id: 'logistics', name: 'Logistics', icon: Rocket, features: ['Fleet', 'Delivery', 'Route'] }
      ]
    },
    'integrations': {
      title: 'İnteqrasiyalar və Marketplace',
      subtitle: 'SBP-ni sevdiyiniz alətlərlə birləşdirin',
      desc: 'SBP açıq ekosistemdir. WhatsApp, Google, Slack və yüzlərlə başqa alətlə saniyələr içində inteqrasiya olun.',
      categories: [
        { id: 'social', name: 'Social Media', icon: Share2, features: ['WhatsApp', 'Facebook', 'Instagram'] },
        { id: 'office', name: 'Office Tools', icon: Layout, features: ['Google Workspace', 'Outlook', 'Slack'] },
        { id: 'payment', name: 'Payments', icon: ShoppingCart, features: ['Stripe', 'PayPal', 'Bank APIs'] }
      ]
    }
  };

  const current = sectionData[section || 'products'] || sectionData['products'];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-40 pb-24">
        {/* Section Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2D5BFF] skew-x-[-20deg] translate-x-32 opacity-20" />
            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-black text-[#2D5BFF] uppercase tracking-[0.4em] mb-6 block">{current.subtitle}</span>
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">{current.title}</h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
                {current.desc}
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="px-10 py-5 bg-[#2D5BFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20">
                  İndi Başlayın
                </button>
                <button className="px-10 py-5 bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                  Məsləhət Al
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sitemap / Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-widest">Sektor Xəritəsi</h2>
            <div className="h-1 bg-slate-100 flex-grow mx-8 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {current.categories.map((cat: any) => (
              <div key={cat.id} className="group">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#2D5BFF] group-hover:bg-[#2D5BFF] group-hover:text-white transition-all shadow-sm">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{cat.name}</h3>
                </div>

                <ul className="space-y-4 mb-8 pl-4 border-l-2 border-slate-50">
                  {cat.features.map((feature: string) => (
                    <li key={feature}>
                      <Link 
                        to={`/product/${cat.id}/${feature.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-slate-500 hover:text-[#2D5BFF] font-bold text-sm flex items-center space-x-3 group/link transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-all -ml-4" />
                        <span>{feature}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      to={`/product/${cat.id}`}
                      className="text-[#2D5BFF] font-black text-xs uppercase tracking-widest hover:underline pt-4 block"
                    >
                      Bütün funksiyalara bax
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default SectionOverview;
