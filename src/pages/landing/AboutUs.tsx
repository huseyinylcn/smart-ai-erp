import React from 'react';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { Users, Globe, Award, Target, Phone, Mail, MapPin } from 'lucide-react';

const team = [
  { name: 'Mirismayıl Qurbanli', role: 'CEO & Founder', initials: 'MQ' },
  { name: 'Famil Ahmadov', role: 'CTO', initials: 'FA' },
  { name: 'Parvana Mammadova', role: 'Head of Product', initials: 'PM' },
  { name: 'Amid Sajidov', role: 'Design Lead', initials: 'AS' },
  { name: 'Ali Safarov', role: 'Backend Developer', initials: 'AS' },
  { name: 'Adilla Ahmadova', role: 'Frontend Developer', initials: 'AA' },
  { name: 'Eltchin Hummat', role: 'DevOps', initials: 'EH' },
  { name: 'Emil Hajiyev', role: 'QA Engineer', initials: 'EH' },
];

const stats = [
  { icon: Users, value: '500+', label: 'Aktif Şirkət' },
  { icon: Globe, value: '3', label: 'Ölkə' },
  { icon: Award, value: '5+', label: 'İl Təcrübə' },
  { icon: Target, value: '99.9%', label: 'Uptime' },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingHeader />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 text-sm text-slate-400 font-medium">
            <a href="/landing" className="hover:text-[#2D5BFF]">Ana səhifə</a>
            <span className="mx-2">›</span>
            <span className="text-slate-700 font-bold">Haqqımızda</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24 items-center">
            <div>
              <h1 className="text-5xl font-black text-slate-900 mb-8 leading-tight">Şirkət haqqında</h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                SmartAgent ERP — Azərbaycanın aparıcı müəssisə resurs planlaması platformasıdır. 2019-cu ildən başlayaraq, biz 500-dən çox şirkətin rəqəmsal transformasiyasına dəstək olmuşuq.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Missiyamız: Hər ölçüdə biznesə əlçatan, güclü və istifadəsi asan ERP həlləri təqdim etmək.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-3xl p-8 text-center">
                  <div className="w-12 h-12 bg-[#2D5BFF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-[#2D5BFF]" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-24">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Niyə bizi seçirsiniz?</h2>
            <p className="text-slate-500 mb-12 max-w-2xl">Azərbaycan bazarını dərindən başa düşürük. Lokal ehtiyaclara uyğun həllər təqdim edirik.</p>
          </div>

          <div className="mb-24">
            <h2 className="text-3xl font-black text-slate-900 mb-16">Komanda üzvləri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.name} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#2D5BFF] to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-black text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    {member.initials}
                  </div>
                  <div className="font-bold text-slate-800 text-sm">{member.name}</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">{member.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-12">
            <h2 className="text-3xl font-black text-slate-900 mb-10">Bizimlə əlaqə</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#2D5BFF]/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#2D5BFF]" />
                </div>
                <div>
                  <div className="font-black text-slate-800 mb-1">Email</div>
                  <div className="text-slate-500 text-sm">info@smartagent.az</div>
                  <div className="text-slate-500 text-sm">qmirismayil@gmail.com</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#2D5BFF]/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#2D5BFF]" />
                </div>
                <div>
                  <div className="font-black text-slate-800 mb-1">Telefon</div>
                  <div className="text-slate-500 text-sm">+994 12 310 00 12</div>
                  <div className="text-slate-500 text-sm">Zəng mərkəzi: *3254</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#2D5BFF]/10 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#2D5BFF]" />
                </div>
                <div>
                  <div className="font-black text-slate-800 mb-1">Ünvan</div>
                  <div className="text-slate-500 text-sm">Azərbaycan, Bakı,</div>
                  <div className="text-slate-500 text-sm">Nərimanov r., AZ1011</div>
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

export default AboutUs;
