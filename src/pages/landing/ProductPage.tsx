import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  ChevronRight, CheckCircle2, Zap, Layout, Globe, 
  Smartphone, Database, ShieldCheck, ArrowRight, Play,
  LayoutGrid, ShoppingCart, MessageCircle, FileText, PieChart,
  Target, Cpu, Layers, MousePointer2, Star, Shield, Rocket,
  UserCheck, DollarSign, Briefcase, Truck, Users, Building2,
  Clock, HeartPulse, Scale, BarChart2, Phone, TrendingUp,
  Package, Monitor, Settings, Construction, Utensils
} from 'lucide-react';

const ProductPage = () => {
  const { category, slug } = useParams();

  const productData: Record<string, any> = {
    'crm': {
      title: 'CRM & Satış İdarəetməsi',
      subtitle: 'Müştəri münasibətlərində tam nəzarət',
      heroDesc: 'Potensial müştərilərin (leads) qəbulundan tutmuş, satış müqavilələrinin bağlanması və fakturaların kəsilməsinə qədər bütün satış dövriyyəsini avtomatlaşdırın.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      features: [
        { title: 'Leads & Deals', desc: 'Satış borusunda (pipeline) hər bir sövdələşməni izləyin.' },
        { title: 'Fakturalandırma', desc: 'Satış əsasında avtomatik faktura və təslim aktlarının hazırlanması.' },
        { title: 'Müştəri Kartı', desc: 'Müştəri ilə olan bütün yazışma, zəng və sənəd tarixçəsi bir yerdə.' }
      ],
      subModules: [
        { name: 'Satış Borusu', icon: Target },
        { name: 'Lead İdarəetməsi', icon: UserCheck },
        { name: 'Müştəri Bazası', icon: Database },
        { name: 'Faktura & Ödəniş', icon: DollarSign }
      ]
    },
    'tasks': {
      title: 'Tapşırıqlar və Layihələr',
      subtitle: 'Komanda işini yeni səviyyəyə qaldırın',
      heroDesc: 'Layihələrin planlaşdırılması, tapşırıqların bölüşdürülməsi və vaxtın izlənilməsi üçün vahid mərkəz.',
      image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80',
      features: [
        { title: 'Gantt Diaqramı', desc: 'Layihənin gedişatını vizual olaraq izləyin.' },
        { title: 'Kanban Lövhələri', desc: 'Tapşırıqları statuslara görə sürüşdürərək idarə edin.' },
        { title: 'Vaxt İzleme', desc: 'Hər bir tapşırığa sərf olunan real vaxtı qeydə alın.' }
      ],
      subModules: [
        { name: 'Gantt', icon: LayoutGrid },
        { name: 'Kanban', icon: Layers },
        { name: 'Təqvim', icon: Briefcase },
        { name: 'Hesabatlar', icon: PieChart }
      ]
    },
    'hr': {
      title: 'HR & Əmək haqqı (Payroll)',
      subtitle: 'AR qanunvericiliyinə tam uyğun sistem',
      heroDesc: 'İşçilərin şəxsi işlərindən tutmuş, davamiyyət, məzuniyyət və mürəkkəb əmək haqqı hesablamalarına qədər bütün HR proseslərini rəqəmsallaşdırın.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80',
      features: [
        { title: 'Ştat Cədvəli', desc: 'Struktur bölmələr və vəzifələr üzrə tam iyerarxiya.' },
        { title: 'Payroll (Maaş)', desc: 'Gəlir vergisi, DSMF və İcbari Sığorta hesablamalarının avtomatlaşdırılması.' },
        { title: 'Davamiyyət Control', desc: 'Biometrik sistemlərlə inteqrasiya olunmuş davamiyyət uçotu.' }
      ],
      subModules: [
        { name: 'Əmək haqqı Hesablama', icon: DollarSign },
        { name: 'İşçi Portalı', icon: Users },
        { name: 'Davamiyyət Uçotu', icon: CheckCircle2 },
        { name: 'Məzuniyyət İdarəetməsi', icon: Briefcase }
      ]
    },
    'finance': {
      title: 'Maliyyə & Xəzinə',
      subtitle: 'Hər bir qəpiyə tam nəzarət',
      heroDesc: 'Bank və kassa əməliyyatları, valyuta mübadiləsi (CBAR inteqrasiyası) və müəssisənin maliyyə hesabatlılığını vahid mərkəzdən idarə edin.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80',
      features: [
        { title: 'Xəzinə İdarəetməsi', desc: 'Bütün bank hesabları və kassa qalığına real vaxtda nəzarət.' },
        { title: 'Valyuta Kursları', desc: 'Mərkəzi Bankın kursları ilə avtomatik sinxronizasiya.' },
        { title: 'Maliyyə Hesabatları', desc: 'P&L, Cash Flow və Balans hesabatlarının bir kliklə hazırlanması.' }
      ],
      subModules: [
        { name: 'Bank & Kassa', icon: DollarSign },
        { name: 'Valyuta Uçotu', icon: Globe },
        { name: 'Büdcə Planlama', icon: PieChart },
        { name: 'Konsolidasiya', icon: Layers }
      ]
    },
    'procurement': {
      title: 'Tədarük & Anbar',
      subtitle: 'Resursların səmərəli idarəedilməsi',
      heroDesc: 'Satınalma sorğularından tutmuş, tədarükçülərlə iş və anbar qalığına nəzarətə qədər bütün təchizat zəncirini optimallaşdırın.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80',
      features: [
        { title: 'Tədarükçü Portalı', desc: 'Tədarükçülərin təkliflərini müqayisə edin və ən yaxşı seçimi edin.' },
        { title: 'Anbar Qalığı', desc: 'Minimum qalıq xəbərdarlıqları ilə mal çatışmazlığının qarşısını alın.' },
        { title: 'QR/Barkod Uçotu', desc: 'Malların giriş-çıxışını skaner vasitəsilə sürətli qeydiyyata alın.' }
      ],
      subModules: [
        { name: 'Tədarük Sifarişləri', icon: FileText },
        { name: 'Anbar İdarəetməsi', icon: Database },
        { name: 'Logistika İzləmə', icon: Truck },
        { name: 'İnventarizasiya', icon: CheckCircle2 }
      ]
    },
    'sites': {
      title: 'Vebsaytlar və Mağazalar',
      subtitle: 'Professional onlayn mövcudluq',
      heroDesc: 'Heç bir proqramlaşdırma biliyi olmadan professional vebsaytlar və e-ticarət mağazaları qurun.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      features: [
        { title: 'Sürətli Builder', desc: 'Sürüşdür və burax (drag-and-drop) üsulu ilə sayt qurucusu.' },
        { title: 'E-ticarət', desc: 'Ödəniş sistemləri və kuryer xidmətləri ilə tam inteqrasiya.' },
        { title: 'SEO Optimallaşdırma', desc: 'Saytınızın axtarış sistemlərində ön sıralarda olması üçün daxili alətlər.' }
      ],
      subModules: [
        { name: 'Vebsayt Qurucusu', icon: LayoutGrid },
        { name: 'Mağaza İdarəetməsi', icon: ShoppingCart },
        { name: 'Veb Formalar', icon: FileText }
      ]
    },
    'collaboration': {
      title: 'Komanda Əməkdaşlığı',
      subtitle: 'Effektiv ünsiyyət və ortaq iş sahəsi',
      heroDesc: 'Çat, video zənglər, təqvim və ortaq sənədlər ilə komandanızın birliyini təmin edin.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
      features: [
        { title: 'Daxili Messencer', desc: 'Şirkət daxili sürətli və təhlükəsiz mesajlaşma.' },
        { title: 'Video Konfrans', desc: 'Yüksək keyfiyyətli onlayn görüşlər və ekran paylaşımı.' },
        { title: 'Ortaq Disk', desc: 'Faylların birgə redaktəsi və bulud saxlanılması.' }
      ],
      subModules: [
        { name: 'Chat', icon: MessageCircle },
        { name: 'Drive', icon: Database },
        { name: 'Calendar', icon: Clock }
      ]
    },
    'copilot': {
      title: 'SBP CoPilot (Aİ)',
      subtitle: 'Sizin süni intellekt köməkçiniz',
      heroDesc: 'Mətnlərin yazılması, datanın analizi və rutin işlərin avtomatlaşdırılmasında Aİ gücündən istifadə edin.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80',
      features: [
        { title: 'Mətn Yaradılması', desc: 'E-poçtlar, hesabatlar və postlar üçün sürətli qaralamalar.' },
        { title: 'Data Analizi', desc: 'Böyük həcmli məlumatlardan mənalı nəticələr çıxarın.' },
        { title: 'Avtomatlaşdırma', desc: 'Təkrarlanan işləri Aİ-yə tapşırın.' }
      ],
      subModules: [
        { name: 'AI Chat', icon: MessageCircle },
        { name: 'AI Writer', icon: FileText },
        { name: 'AI Insights', icon: Zap }
      ]
    },
    'solutions': {
      title: 'Biznes Həllərimiz',
      subtitle: 'Sənayenizə uyğun optimallaşdırılmış sistem',
      heroDesc: 'Pərakəndə satışdan tutmuş tikintiyə qədər hər bir sektor üçün hazır iş axınları.',
      image: 'https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&q=80',
      features: [
        { title: 'Sektor Konfiqurasiyası', desc: 'Sizin sahəniz üçün öncədən tənzimlənmiş modullar.' },
        { title: 'Konsaltinq', desc: 'Biznes proseslərinizin avtomatlaşdırılması üçün mütəxəssis dəstəyi.' }
      ],
      subModules: [
        { name: 'Pərakəndə Satış', icon: ShoppingCart },
        { name: 'Tikinti', icon: Building2 },
        { name: 'Logistika', icon: Truck }
      ]
    },
    'industry': {
      title: 'Sənaye Həllərimiz',
      subtitle: 'Hər bir sektor üçün fərdi yanaşma',
      heroDesc: 'Tikinti, İstehsalat, Pərakəndə və digər sahələr üçün optimallaşdırılmış ERP konfiqurasiyaları.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
      features: [
        { title: 'Sektor Spesifik', desc: 'Sahənizə xas olan iş axınları və hesabat formaları.' },
        { title: 'Hazır Şablonlar', desc: 'Hər bir sənaye üçün öncədən tənzimlənmiş verilənlər bazası.' }
      ],
      subModules: [
        { name: 'Tikinti', icon: Building2 },
        { name: 'Sağlamlıq', icon: HeartPulse },
        { name: 'Hüquq', icon: Scale }
      ]
    },
    'integrations': {
      title: 'İnteqrasiyalar',
      subtitle: 'SBP-ni sevdiyiniz alətlərlə birləşdirin',
      heroDesc: 'SBP ERP sistemi müxtəlif xarici platformalar, banklar və dövlət portalları ilə tam inteqrasiya olunur.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80',
      features: [
        { title: 'Bank İnteqrasiyaları', desc: 'Bank hesablarından çıxarışların avtomatik işlənməsi.' },
        { title: 'Marketplace-lər', desc: 'Trendyol, Amazon və digər platformalarla sinxronizasiya.' },
        { title: 'Hökumət Portalları', desc: 'E-qaimə və digər dövlət xidmətləri ilə tam uyğunluq.' }
      ],
      subModules: [
        { name: 'API & Webhooks', icon: Zap },
        { name: 'Bank Sync', icon: DollarSign },
        { name: 'Marketplace', icon: ShoppingCart }
      ]
    }
  };

  const getPageData = () => {
    const s = slug?.toLowerCase() || '';
    const c = category?.toLowerCase() || '';
    
    if (productData[s]) return productData[s];
    if (productData[c]) return productData[c];
    
    // Keyword Fallbacks
    if (s.includes('marketing') || s.includes('creative')) return productData['crm'];
    if (s.includes('project') || s.includes('gantt') || s.includes('kanban')) return productData['tasks'];
    if (s.includes('hr') || s.includes('payroll') || s.includes('recruitment')) return productData['hr'];
    if (s.includes('chat') || s.includes('workspace') || s.includes('online')) return productData['collaboration'];
    if (s.includes('store') || s.includes('site') || s.includes('shop')) return productData['sites'];
    if (s.includes('legal') || s.includes('healthcare') || s.includes('industry')) return productData['industry'];
    
    return productData['crm'];
  };

  const current = getPageData();
  const isSubModule = !!slug && slug !== category;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <LandingHeader />

      <main>
        {/* PREMIUM HERO SECTION */}
        <section className={`pt-48 pb-32 ${isSubModule ? 'bg-gradient-to-br from-indigo-50 via-white to-blue-50' : 'bg-slate-50'} relative overflow-hidden`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`flex flex-col ${isSubModule ? 'items-center text-center' : 'lg:flex-row items-center gap-20'}`}>
              <div className={`${isSubModule ? 'max-w-3xl mb-16' : 'lg:w-1/2'}`}>
                <nav className={`flex items-center space-x-2 text-[10px] text-slate-400 mb-8 font-black uppercase tracking-[0.2em] ${isSubModule ? 'justify-center' : ''}`}>
                  <Link to="/landing">Home</Link>
                  <ChevronRight className="w-3 h-3" />
                  <Link to={`/overview/products`}>PRODUKTLAR</Link>
                  {isSubModule && (
                    <>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-[#2D5BFF]">{current.title}</span>
                    </>
                  )}
                </nav>
                
                <h1 className={`${isSubModule ? 'text-6xl md:text-8xl' : 'text-5xl md:text-7xl'} font-black text-slate-900 mb-8 leading-tight`}>
                  {current.title}
                </h1>
                <p className="text-2xl font-bold text-[#2D5BFF] mb-8">{current.subtitle}</p>
                <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium max-w-2xl mx-auto lg:mx-0">
                  {current.heroDesc}
                </p>
                <div className={`flex flex-wrap gap-6 ${isSubModule ? 'justify-center' : ''}`}>
                  <button className="px-10 py-5 bg-[#2D5BFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center gap-3">
                    İndi Başlayın <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3">
                    <Play className="w-4 h-4" /> Demo İzlə
                  </button>
                </div>
              </div>

              {!isSubModule && (
                <div className="lg:w-1/2 relative">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#2D5BFF] to-indigo-600 rounded-[4rem] blur-2xl opacity-20 animate-pulse" />
                  <img 
                    src={current.image} 
                    alt={current.title}
                    className="relative z-10 w-full rounded-[3rem] shadow-2xl border-8 border-white object-cover aspect-[4/3]"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Əsas Funksional İmkanlar</h2>
            <div className="w-24 h-2 bg-[#2D5BFF] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {current.features.map((feature: any, idx: number) => (
              <div key={idx} className="group p-12 bg-white rounded-[3rem] border border-slate-100 hover:border-[#2D5BFF]/30 hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2D5BFF] mb-10 group-hover:bg-[#2D5BFF] group-hover:text-white transition-all">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">{feature.title}</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SUB-MODULES EXPLORER */}
        <section className="py-32 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-12">
              <div className="max-w-2xl">
                <span className="text-xs font-black text-[#2D5BFF] uppercase tracking-[0.4em] mb-6 block">Sistem Xəritəsi</span>
                <h2 className="text-5xl font-black mb-8 leading-tight">Bu modula daxil olan alt-sistemlər</h2>
                <p className="text-xl text-slate-400 font-medium">Hər bir alt-modul vahid ekosistemin bir parçasıdır və bir-biri ilə tam inteqrasiya olunmuş şəkildə işləyir.</p>
              </div>
              <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all">Bütün Modullara Bax</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {current.subModules.map((sub: any, i: number) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-[#2D5BFF]/50 transition-all group">
                  <div className="w-12 h-12 bg-[#2D5BFF] rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <sub.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black mb-4 uppercase tracking-wider">{sub.name}</h4>
                  <div className="flex items-center text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                    TAM AKTİVDİR
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default ProductPage;
