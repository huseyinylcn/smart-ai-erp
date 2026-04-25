import { useState } from 'react';
import { 
  Receipt, FileText, 
  Settings2, CheckCircle2, 
  ArrowRight, Calculator, 
  Building, ShieldCheck, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tax = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ops'); // 'ops' (Operations) or 'rep' (Reports)

  const modules = [
    // OPERATIONS
    { 
      id: 'vat', 
      title: 'ƏDV İdarəedilməsi', 
      desc: 'Alış/Satış ƏDV qeydiyyatı, əvəzləşdirmə və depozit hesabı', 
      type: 'ops', 
      path: '/tax/vat',
      icon: Receipt,
      tags: ['Əməliyyat', 'ƏDV']
    },
    { 
      id: 'assets', 
      title: 'Əmlak və Torpaq Vergisi', 
      desc: 'Aktivlər üzrə vergi hesablamaları (Asset-based tax calc)', 
      type: 'ops', 
      path: '/tax/assets',
      icon: Building,
      tags: ['Əməliyyat', 'Resurs']
    },
    { 
      id: 'config', 
      title: 'Vergi Parametrləri', 
      desc: 'Vergi dərəcələri və effective-date qaydaları', 
      type: 'ops', 
      path: '/tax/config',
      icon: Settings2,
      tags: ['Konfiqurasiya']
    },
    // REPORTS
    { 
      id: 'vat-decl', 
      title: 'ƏDV Bəyannaməsi', 
      desc: 'Aylıq ƏDV bəyannaməsinin e-taxes formatında hazırlanması', 
      type: 'rep', 
      path: '/reports/tax/vat',
      icon: FileText,
      tags: ['Hesabat', 'Bəyannamə']
    },
    { 
      id: 'simplified', 
      title: 'Sadələşdirilmiş Vergi', 
      desc: 'KOB subyektləri üçün rüblük vahid hesabat', 
      type: 'rep', 
      path: '/reports/tax/simplified',
      icon: Calculator,
      tags: ['Hesabat', 'KOB']
    },
    { 
      id: 'unified', 
      title: 'Vahid Bəyannamə', 
      desc: 'Gəlir vergisi, DSMF və İTS üzrə vahid hesabat', 
      type: 'rep', 
      path: '/reports/tax/unified',
      icon: CheckCircle2,
      tags: ['Hesabat', 'HR/Maaş']
    },
    { 
      id: 'wht', 
      title: 'Ödəniş Mənbəyində Vergi (ÖMV)', 
      desc: 'Qeyri-rezidentlərə və fiziki şəxslərə ödənişlər üzrə ÖMV', 
      type: 'rep', 
      path: '/reports/tax/wht',
      icon: ShieldCheck,
      tags: ['Hesabat', 'WHT']
    }
  ];

  const filtered = modules.filter(m => m.type === activeTab);

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Compliance & Tax</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Vergilər Modulu</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-rose-500/10 underline-offset-4 decoration-solid italic">AR Vergi Məcəlləsi üzrə əməliyyat və hesabat mərkəzi</p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 border border-slate-100 rounded-[2rem] p-1.5 shadow-sm">
           <button 
             onClick={() => setActiveTab('ops')}
             className={`px-8 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'ops' ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20 italic' : 'text-slate-500 hover:bg-slate-50 italic'}`}
           >
              Əməliyyat Modulları
           </button>
           <button 
             onClick={() => setActiveTab('rep')}
             className={`px-8 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all italic ${activeTab === 'rep' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 italic' : 'text-slate-500 hover:bg-slate-50 italic'}`}
           >
              Bəyannamə və Hesabatlar
           </button>
        </div>
      </div>

      {/* QUICK STATS (MOCK) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Cari ƏDV Balansı</h4>
            <div className="text-2xl font-black text-emerald-600 tabular-nums italic">+ 12,450.50 ₼</div>
            <p className="text-[10px] text-slate-400 font-bold italic mt-1">Əvəzləşdirilə bilən ƏDV qalığı</p>
            <Receipt className="absolute -right-4 -bottom-4 w-20 h-20 opacity-5 -rotate-12 group-hover:scale-110 transition-all text-emerald-900" />
         </div>
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Növbəti Bəyannamə</h4>
            <div className="text-2xl font-black text-rose-600 tabular-nums italic">20 Aprel 2026</div>
            <p className="text-[10px] text-slate-400 font-bold italic mt-1">Mart ayı üzrə ƏDV Bəyannaməsi</p>
            <History className="absolute -right-4 -bottom-4 w-20 h-20 opacity-5 -rotate-12 group-hover:scale-110 transition-all text-rose-900" />
         </div>
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Vergi Rejimi</h4>
            <div className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">ƏDV Ödəyicisi</div>
            <p className="text-[10px] text-slate-400 font-bold italic mt-1">Mənfəət vergisi subyekti</p>
            <ShieldCheck className="absolute -right-4 -bottom-4 w-20 h-20 opacity-5 -rotate-12 group-hover:scale-110 transition-all text-slate-900" />
         </div>
      </div>

      {/* MODULE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filtered.map((m) => (
           <div 
             key={m.id} 
             onClick={() => navigate(m.path)}
             className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-50 dark:border-slate-800 p-10 hover:border-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/5 transition-all group cursor-pointer flex flex-col h-full"
           >
              <div className="flex items-center justify-between mb-8">
                 <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-2xl transition-all ${m.type === 'ops' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}`}>
                    <m.icon className="w-8 h-8" />
                 </div>
                 <div className="flex flex-wrap gap-1">
                    {m.tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-slate-50 text-[8px] font-black uppercase tracking-widest text-slate-400 rounded-full italic">{t}</span>
                    ))}
                 </div>
              </div>

              <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">{m.title}</h3>
                  <div className={`w-8 h-1 my-4 group-hover:w-16 transition-all ${m.type === 'ops' ? 'bg-rose-500/20' : 'bg-indigo-500/20'}`}></div>
                  <p className="text-sm font-medium text-slate-500 italic leading-relaxed">{m.desc}</p>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between italic-none">
                  <button className="flex items-center space-x-2 font-black text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-rose-600 transition-colors italic">
                     <span>Modula Keç</span>
                     <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
           </div>
         ))}
      </div>

    </div>
  );
};

export default Tax;
