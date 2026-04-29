import React from 'react';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  MapPin, Clock, Phone, Mail, 
  Settings, Users, Briefcase, ShoppingCart, Globe, Package,
  ChevronRight
} from 'lucide-react';

const AboutUs = () => {
  const leadership = [
    { name: 'Mirismayıl Qurbanlı', role: 'Co-Founder and Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
    { name: 'Fərid Əhmədov', role: 'Co-Founder', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300' },
    { name: 'Pərvanə Məmmədova', role: 'Head of Human Resources', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' },
    { name: 'Amid Seyidov', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300' },
  ];

  const team = [
    { name: 'Ali Səfərov', role: 'Product Designer', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300' },
    { name: 'Adilə Əhmədova', role: 'Frontend developer', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300' },
    { name: 'Elçin Hümmət', role: 'Backend developer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300' },
    { name: 'Emil Hacıyev', role: 'Copywriter', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300' },
    { name: 'Rəşad Əhmədov', role: 'Backend developer', image: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=300' },
    { name: 'Nigar Muradova', role: 'Marketing', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300' },
  ];

  const sectors = [
    { name: 'Xidmət', icon: Settings, color: 'text-indigo-500' },
    { name: 'İctimai iaşə', icon: Users, color: 'text-red-500' },
    { name: 'İstehsalat və tikinti', icon: Briefcase, color: 'text-blue-500' },
    { name: 'Pərakəndə və topdan satış', icon: ShoppingCart, color: 'text-orange-500' },
    { name: 'Enerji və natural resurslar', icon: Globe, color: 'text-emerald-500' },
    { name: 'Digər', icon: Package, color: 'text-slate-500' },
  ];

  const contactInfo = [
    { title: 'Location and mail index', desc: 'Nərimanov, Əhməd Rəcəbli AZ1054', icon: MapPin },
    { title: 'Working hours', desc: 'Monday-Friday\n9:00 a.m. to 6:00 p.m.', icon: Clock },
    { title: 'Telephone', desc: '+994 12 310 00 12', icon: Phone },
    { title: 'Mail', desc: 'sbp.erp@gmail.com', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-32 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-16 font-bold uppercase tracking-widest">
            <a href="/landing" className="hover:text-[#2D5BFF]">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800">About us</span>
          </nav>

          {/* Section: Şirkət haqqında */}
          <section className="mb-24">
            <h1 className="text-4xl font-black text-center mb-12">Şirkət haqqında</h1>
            <div className="max-w-5xl mx-auto space-y-8 text-center text-slate-600 leading-relaxed font-medium">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
              <div>
                <h4 className="font-black text-slate-800 mb-4">Why do we use it?</h4>
                <p>
                  It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                </p>
              </div>
            </div>
          </section>

          {/* Section: Rəhbərlik */}
          <section className="mb-24">
            <h2 className="text-2xl font-black mb-12">Rəhbərlik</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {leadership.map((person, idx) => (
                <div key={idx} className="group">
                  <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <img src={person.image} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900 leading-tight">{person.name}</h3>
                  <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-wider">{person.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Komanda Üzvləri */}
          <section className="mb-24">
            <h2 className="text-2xl font-black mb-12">Komanda Üzvləri</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {team.map((person, idx) => (
                <div key={idx} className="group text-center lg:text-left">
                  <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-4 shadow-md grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img src={person.image} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="font-black text-sm text-slate-900 leading-tight">{person.name}</h3>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{person.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Platforma haqqında */}
          <section className="mb-24">
            <h2 className="text-3xl font-black text-center mb-12">Platforma haqqında</h2>
            <div className="max-w-5xl mx-auto space-y-8 text-center text-slate-600 leading-relaxed font-medium">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
              <div>
                <h4 className="font-black text-slate-800 mb-4">Why do we use it?</h4>
                <p>
                  It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                </p>
              </div>
            </div>
          </section>

          {/* Section: Sektorlar */}
          <section className="mb-24">
            <h2 className="text-2xl font-black text-center mb-12 max-w-2xl mx-auto leading-tight">
              Çalışdığımız və SBP ERP sisteminə uyğun biznes sektorları
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {sectors.slice(0, 4).map((sector, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[#2D5BFF]/10 transition-colors`}>
                    <sector.icon className={`w-6 h-6 ${sector.color} group-hover:text-[#2D5BFF] transition-colors`} />
                  </div>
                  <span className="font-black text-sm text-slate-800">{sector.name}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {sectors.slice(4).map((sector, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[#2D5BFF]/10 transition-colors`}>
                    <sector.icon className={`w-6 h-6 ${sector.color} group-hover:text-[#2D5BFF] transition-colors`} />
                  </div>
                  <span className="font-black text-sm text-slate-800">{sector.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Bizimlə əlaqə */}
          <section className="mb-24">
            <h2 className="text-4xl font-black text-center mb-16">Bizimlə əlaqə</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 text-center hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
                  <div className="w-16 h-16 bg-[#2D5BFF]/5 text-[#2D5BFF] rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[#2D5BFF] group-hover:text-white transition-all">
                    <info.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{info.title}</h4>
                  <p className="text-sm font-bold text-slate-700 whitespace-pre-line leading-relaxed">{info.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button className="px-10 py-4 bg-[#2D5BFF] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                Mənə zəng et
              </button>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <section className="bg-slate-950 py-24 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-black text-white mb-6">Get Started with SBP Software</h2>
            <p className="text-slate-400 mb-12 leading-relaxed">
              SBP həlləri gələcək imkanlardan istifadə etmək üçün təməl qurarkən biznesinizi bugünkü problemləri həll etmək üçün təchiz edir.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100 transition-all">
                Try for free
              </button>
              <button className="w-full sm:w-auto px-10 py-4 bg-[#2D5BFF] text-white rounded-xl font-black text-sm hover:bg-blue-600 transition-all">
                Buy
              </button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AboutUs;
