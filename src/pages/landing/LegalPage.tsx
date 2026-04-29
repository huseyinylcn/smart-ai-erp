import React, { useState } from 'react';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { ChevronRight, Shield, Scale, FileText, Lock, Eye, AlertCircle } from 'lucide-react';

const LegalPage = () => {
  const [activeSection, setActiveSection] = useState('privacy');

  const sections = [
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'terms', name: 'Terms of Use', icon: Scale },
    { id: 'legal', name: 'Legal Disclosure', icon: FileText },
    { id: 'copyright', name: 'Copyright', icon: Lock },
    { id: 'trademark', name: 'Trademark', icon: AlertCircle },
    { id: 'cookies', name: 'Cookie Preferences', icon: Eye },
  ];

  const content: Record<string, any> = {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: '29 Aprel 2024',
      items: [
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia.',
        'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero.',
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
        'Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.',
        'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero.',
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
        'Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.',
        'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero.'
      ]
    },
    terms: {
      title: 'Terms of Use',
      lastUpdated: '29 Aprel 2024',
      items: [
        'By using this platform, you agree to comply with our usage terms.',
        'You are responsible for maintaining the confidentiality of your account.',
        'Unauthorized access or use of the service is strictly prohibited.',
        'We reserve the right to terminate service for any user who violates these terms.'
      ]
    }
    // Other sections would follow similar structure
  };

  const current = content[activeSection] || content['privacy'];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-12 font-bold uppercase tracking-widest">
            <a href="/landing" className="hover:text-[#2D5BFF]">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800">Legal</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar */}
            <aside className="lg:w-1/4">
              <div className="sticky top-32 space-y-2 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-4">Term & Conditions</h2>
                {sections.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${
                      activeSection === s.id ? 'bg-[#2D5BFF] text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Content Area */}
            <div className="lg:w-3/4">
              <div className="bg-white p-12 md:p-20 rounded-[3rem] border-2 border-[#2D5BFF] shadow-2xl shadow-blue-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#2D5BFF]" />
                
                <h1 className="text-4xl font-black text-slate-900 mb-4 text-center">{current.title}</h1>
                <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-widest mb-16">
                  Last updated: {current.lastUpdated}
                </p>

                <div className="space-y-12 max-w-4xl mx-auto">
                  {current.items.map((item: string, idx: number) => (
                    <div key={idx} className="flex space-x-6 group">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-[#2D5BFF] group-hover:text-white transition-all">
                        {idx + 1}.
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium pt-1">
                        {item}
                      </p>
                    </div>
                  ))}
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

export default LegalPage;
