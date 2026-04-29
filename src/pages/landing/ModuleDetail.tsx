import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { ChevronRight, Play, BookOpen, Clock, Shield, Star } from 'lucide-react';

const ModuleDetail = () => {
  const { id } = useParams();

  // Mock data for modules with videos
  const moduleData: Record<string, any> = {
    'HRM': {
      title: 'İnsan Resurslarının İdarə Edilməsi (HRM)',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
      description: `
        SmartAgent HRM modulu şirkətinizin ən dəyərli aktivi olan insan resurslarını idarə etmək üçün nəzərdə tutulmuşdur. 
        Bu modul işə qəbuldan başlayaraq, işçinin bütün karyera yolunu izləməyə imkan verir.
      `,
      features: [
        'Avtomatlaşdırılmış işə qəbul prosesi',
        'Performansın qiymətləndirilməsi və KPI',
        'Məzuniyyət və icazələrin idarə edilməsi',
        'Təlim və inkişaf proqramları',
        'Rəqəmsal işçi kartları'
      ],
      benefits: 'İşçi məhsuldarlığını 30% artırır, sənədləşməni 80% azaldır.'
    },
    'ERP': {
      title: 'Müəssisə Resurs Planlaması (ERP)',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Müəssisənizin bütün departamentlərini vahid bir mərkəzdən idarə edin. ERP modulu biznesinizin onurğa sütunudur.',
      features: ['Vahid məlumat bazası', 'Departamentlərarası inteqrasiya', 'Real-vaxt hesabatlılıq', 'Resursların optimallaşdırılması'],
      benefits: 'Biznes proseslərində tam şəffaflıq və nəzarət təmin edir.'
    },
    'CRM': {
      title: 'Müştəri Münasibətlərinin İdarə Edilməsi (CRM)',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Müştərilərinizlə əlaqələri yeni səviyyəyə qaldırın. Satış kanallarınızı izləyin və müştəri loyallığını artırın.',
      features: ['Satış qonfisi (Sales Pipeline)', 'Müştəri tarixçəsi', 'Avtomatik bildirişlər', 'Marketinq kampaniyaları'],
      benefits: 'Satış həcmini 25% artırmağa kömək edir.'
    }
  };

  const currentModule = moduleData[id || ''] || moduleData['HRM'];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-12 font-bold uppercase tracking-widest">
            <Link to="/landing" className="hover:text-[#2D5BFF]">Ana səhifə</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800">Modullar</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#2D5BFF]">{currentModule.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                {currentModule.title}
              </h1>

              {/* Video Player */}
              <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-4 border-slate-100">
                <iframe
                  className="w-full h-full"
                  src={currentModule.videoUrl}
                  title={currentModule.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Description */}
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-black text-slate-800 mb-6">Modul haqqında ətraflı</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium">
                  {currentModule.description}
                </p>

                <h3 className="text-xl font-black text-slate-800 mb-6">Əsas Funksiyalar</h3>
                <ul className="space-y-4 mb-12">
                  {currentModule.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-4 text-slate-600 font-medium">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-[#2D5BFF]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                  <h4 className="font-black text-[#2D5BFF] mb-2 uppercase text-xs tracking-widest">Əsas Üstünlük</h4>
                  <p className="text-slate-700 font-bold">{currentModule.benefits}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-10">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-6">Digər Modullar</h3>
                <div className="space-y-4">
                  {Object.keys(moduleData).map((mKey) => (
                    <Link 
                      key={mKey}
                      to={`/modules/${mKey}`}
                      className={`block p-4 rounded-2xl transition-all font-bold text-sm ${
                        id === mKey ? 'bg-[#2D5BFF] text-white shadow-lg' : 'bg-white text-slate-600 hover:border-[#2D5BFF] border border-transparent'
                      }`}
                    >
                      {moduleData[mKey].title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                <h3 className="text-xl font-black mb-4">Sualınız var?</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Modul haqqında daha çox məlumat almaq üçün mütəxəssisimizlə əlaqə saxlayın.
                </p>
                <button className="w-full py-4 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100 transition-all">
                  Məsləhət al
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

// Internal icon as lucide CheckCircle wasn't in the list
const CheckCircle = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default ModuleDetail;
