import React, { useState } from 'react';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { ChevronDown, ChevronRight } from 'lucide-react';

const allFaqs = [
  { q: 'Platformadan necə istifadə edə bilərəm?', a: 'Qeydiyyatdan keçib şirkətinizi yaradın. Dərhal 14 günlük pulsuz sınaq dövrünüz başlayacaq.' },
  { q: 'Neçə istifadəçi əlavə edə bilərəm?', a: 'Seçdiyiniz plana görə istifadəçi sayı dəyişir. Enterprise planda limitsiz istifadəçi əlavə edə bilərsiniz.' },
  { q: 'Məlumatlarım təhlükəsizdir?', a: 'Bütün məlumatlar SSL/TLS şifrələmə ilə qorunur. ISO 27001 sertifikatlı serverlərdə saxlanılır.' },
  { q: 'Texniki dəstək alıram?', a: '7/24 texniki dəstək komandamız həmişə sizin xidmətinizdədir.' },
  { q: 'Hesabı silmək istəsəm nə etməliyəm?', a: 'Parametrlər bölməsindən hesabı silmə tələbini göndərə bilərsiniz. Datanız 30 gün ərzində silinəcək.' },
  { q: 'Ödəniş üsulları hansılardır?', a: 'Visa, MasterCard, bank köçürməsi və yerli ödəniş sistemləri (Expressbank, ABB) vasitəsilə ödəniş edə bilərsiniz.' },
  { q: 'Demo nümayişini necə izləyə bilərəm?', a: 'Vebsaytımızdakı "Demo İzlə" düyməsini sıxaraq sistemin canlı nümayişinə baxa bilərsiniz.' },
  { q: 'Mobil versiya varmı?', a: 'Bəli, platformamız tam responsiv dizayna malikdir. Yaxın zamanda iOS və Android tətbiqlərimiz də hazır olacaq.' },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingHeader />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 text-sm text-slate-400 font-medium">
            <a href="/landing" className="hover:text-[#2D5BFF]">Ana səhifə</a>
            <span className="mx-2">›</span>
            <span className="text-slate-700 font-bold">FAQ</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-16">Tez-tez verilən suallar</h1>
          <div className="space-y-3">
            {allFaqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-slate-100 rounded-2xl overflow-hidden hover:border-blue-100 transition-all">
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-slate-800">{faq.q}</span>
                  {openIdx === idx
                    ? <ChevronDown className="w-5 h-5 text-[#2D5BFF] shrink-0" />
                    : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>
                {openIdx === idx && (
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default FAQ;
