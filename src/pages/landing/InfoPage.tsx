import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  ChevronRight, FileText, Shield, Scale, Globe, Users, Briefcase, 
  Brain, Zap, TrendingUp, Layout, Smartphone, Database
} from 'lucide-react';

const InfoPage = () => {
  const { slug } = useParams();

  // Helper to format slug to title
  const formatTitle = (s: string) => {
    return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const title = formatTitle(slug || 'Page');

  // Real ERP Content mapping
  const pageData: Record<string, any> = {
    'marketing': {
      icon: TrendingUp,
      subtitle: 'Satışlarınızı və marka bilinirliyini AI ilə artırın',
      desc: 'SmartAgent Marketing modulu rəqəmsal marketinq kampaniyalarınızı vahid platformadan idarə etməyə imkan verir.',
      features: [
        'Avtomatlaşdırılmış E-mail və SMS kampaniyaları',
        'Müştəri seqmentasiyası (AI dəstəkli)',
        'ROI və kampaniya analitikası',
        'Sosial media inteqrasiyası'
      ]
    },
    'hr': {
      icon: Users,
      subtitle: 'İnsan resurslarını rəqəmsal idarə edin',
      desc: 'İşə qəbuldan başlayaraq, işçinin bütün karyera yolunu və performansını izləyin.',
      features: [
        'Rəqəmsal işçi kartları və arxiv',
        'Məzuniyyət və icazə idarəetməsi',
        'KPI və Performans qiymətləndirmə',
        'Avtomatlaşdırılmış payroll hesablanması'
      ]
    },
    'ai-copilot': {
      icon: Brain,
      subtitle: 'Sizin rəqəmsal köməkçiniz',
      desc: 'SBP CoPilot süni intellekt texnologiyası ilə biznes qərarlarınızı daha sürətli və dəqiq qəbul etməyə kömək edir.',
      features: [
        'Məlumat analizi və proqnozlaşdırma',
        'Avtomatik sənəd tanıma (OCR)',
        'Ağıllı çatbot dəstəyi',
        'Anomaliyaların aşkarlanması'
      ]
    }
  };

  const current = pageData[slug || ''] || {
    icon: FileText,
    subtitle: 'SBP Platformasının üstünlüklərindən yararlanın',
    desc: `SmartAgent ERP platformasının ${title} bölməsinə xoş gəlmisiniz. Biznesinizi avtomatlaşdırmaq üçün ən müasir texnologiyaları təklif edirik.`,
    features: ['İstifadəçi dostu interfeys', 'Real-vaxt hesabatlılıq', 'Yüksək təhlükəsizlik', 'Bulud texnologiyası']
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-12 font-bold uppercase tracking-widest">
            <Link to="/landing" className="hover:text-[#2D5BFF]">Ana səhifə</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800">{title}</span>
          </nav>

          <div className="bg-white rounded-[3rem] p-12 md:p-20 border-2 border-slate-100 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-[#2D5BFF] text-white rounded-[2rem] flex items-center justify-center mb-10 shadow-xl shadow-blue-500/20">
                <current.icon className="w-10 h-10" />
              </div>
              
              <span className="text-xs font-black text-[#2D5BFF] uppercase tracking-[0.2em] mb-4 block">{current.subtitle}</span>
              <h1 className="text-5xl font-black text-slate-900 mb-8 leading-tight">
                {title}
              </h1>

              <div className="max-w-3xl">
                <p className="text-xl text-slate-500 leading-relaxed mb-16 font-medium">
                  {current.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                  {current.features.map((f: string, i: number) => (
                    <div key={i} className="flex items-center space-x-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-[#2D5BFF] transition-all">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:bg-[#2D5BFF] group-hover:text-white transition-all">
                        <Zap className="w-4 h-4 text-[#2D5BFF] group-hover:text-white" />
                      </div>
                      <span className="font-bold text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16" />
                  <h3 className="text-2xl font-black mb-4">Bu modulu sınamağa hazırsınız?</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Şirkətinizi qeydiyyatdan keçirin və bütün funksionallıqlardan 14 gün pulsuz istifadə edin.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-8 py-4 bg-[#2D5BFF] text-white rounded-xl font-black text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                      İndi başlayın
                    </button>
                    <button className="px-8 py-4 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white/20 transition-all border border-white/10">
                      Görüş tələb et
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default InfoPage;
