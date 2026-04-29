import React, { useState } from 'react';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { 
      q: 'SBP sistemi nədir?', 
      a: 'SBP (SmartAgent Business Platform) müəssisənin bütün daxili proseslərini - maliyyə, HR, tədarük, satış və anbarı vahid mərkəzdən idarə etməyə imkan verən bulud əsaslı ERP həllidir.' 
    },
    { 
      q: 'Demo müddəti nə qədərdir?', 
      a: 'Sistemimizi 1 ay (30 gün) tam funksional şəkildə pulsuz sınaqdan keçirə bilərsiniz. Bu müddət ərzində hər hansı öhdəlik yaranmır.' 
    },
    { 
      q: 'Sistem Azərbaycanda qanunvericiliyə uyğundurmu?', 
      a: 'Bəli, SBP sistemi Azərbaycan Respublikasının Vergi Məcəlləsinə, Əmək Məcəlləsinə və digər normativ hüquqi aktlara tam uyğunlaşdırılıb. Hesabatlar birbaşa vergi standartlarına uyğundur.' 
    },
    { 
      q: 'Məlumatlarımızın təhlükəsizliyinə necə zəmanət verilir?', 
      a: 'Məlumatlarınız SSL şifrələmə ilə qorunan bulud serverlərində saxlanılır. Həmçinin gündəlik nüsxələmə (backup) və kiber təhlükəsizlik agentləri tərəfindən 24/7 monitorinq həyata keçirilir.' 
    },
    { 
      q: 'Qiymətlər necə müəyyən edilir?', 
      a: 'Qiymətlər sizin biznesinizin ölçüsünə (mikro, kiçik, orta, iri), seçdiyiniz modulların sayına və sistem istifadəçilərinin sayına əsasən fərdi olaraq hesablanır.' 
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-40 pb-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-blue-50 text-[#2D5BFF] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/10">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight">Tez-tez Verilən Suallar</h1>
            <p className="text-xl text-slate-500 font-medium">SBP haqqında ən çox verilən suallar və onların cavabları.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-[2rem] border-2 transition-all overflow-hidden ${
                  openIndex === idx ? 'border-[#2D5BFF] shadow-2xl shadow-blue-500/5' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-8 text-left flex items-center justify-between"
                >
                  <span className="text-xl font-black text-slate-800">{faq.q}</span>
                  {openIndex === idx ? <ChevronUp className="w-6 h-6 text-[#2D5BFF]" /> : <ChevronDown className="w-6 h-6 text-slate-300" />}
                </button>
                {openIndex === idx && (
                  <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-lg text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-6">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D5BFF] rounded-full -mr-16 -mt-16 opacity-20" />
            <h2 className="text-3xl font-black mb-6">Sualınız hələ də qalıb?</h2>
            <p className="text-slate-400 font-medium mb-10">Bizim komanda sizə hər zaman kömək etməyə hazırdır.</p>
            <Link to="/helpdesk" className="px-10 py-5 bg-[#2D5BFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all inline-block">
              Dəstək Mərkəzinə keç
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default FAQPage;
