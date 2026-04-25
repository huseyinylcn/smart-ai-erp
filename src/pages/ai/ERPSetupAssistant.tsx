import { useState, useEffect } from 'react';
import { 
  Sparkles, Brain, Target, ArrowRight, ArrowLeft, 
  CheckCircle2, Building2, Users, Layout, Settings,
  Zap, Loader2, Shield, Globe, ShoppingCart,
  Activity, Coffee, GraduationCap, Package, LayoutGrid
} from 'lucide-react';
import { SECTOR_TEMPLATES, type SectorTemplate } from '../../data/sectorTemplates';

const ERPSetupAssistant = () => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    businessType: '',
    size: '1-10',
    needs: [] as string[]
  });
  const [recommendation, setRecommendation] = useState<SectorTemplate | null>(null);

  const handleNext = () => {
    if (step === 2) {
      runAIAnalysis();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => setStep(prev => prev - 1);

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI thinking
    setTimeout(() => {
      const template = SECTOR_TEMPLATES[formData.industry.toLowerCase()] || SECTOR_TEMPLATES['retail'];
      setRecommendation(template);
      setIsAnalyzing(false);
      setStep(3);
    }, 2500);
  };

  const industries = [
    { id: 'retail', name: 'Retail (Pərakəndə)', icon: ShoppingCart },
    { id: 'wholesale', name: 'Wholesale (Topdan)', icon: Package },
    { id: 'horeca', name: 'HoReCa (Restoran/Hotel)', icon: Coffee },
    { id: 'gym', name: 'Gym & Fitness', icon: Activity },
    { id: 'education', name: 'Təhsil (Məktəb/Kurs)', icon: GraduationCap }
  ];

  const renderStep1 = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Biznes Sahəsini Seçin</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold italic text-sm">AI sizə ən uyğun ERP strukturunu seçməkdə kömək edəcək.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setFormData({ ...formData, industry: ind.id })}
            className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 group ${
              formData.industry === ind.id 
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-slate-100 dark:border-slate-800 hover:border-indigo-300 bg-white dark:bg-slate-900 shadow-sm'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              formData.industry === ind.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <ind.icon className="w-8 h-8" />
            </div>
            <span className={`text-[13px] font-black uppercase italic tracking-tight ${
              formData.industry === ind.id ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'
            }`}>{ind.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Biznes Təfərrüatları</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold italic text-sm">Əlavə məlumatlar AI-ın konfiqurasiyanı dəqiqləşdirməsi üçün vacibdir.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest italic ml-4">Şirkətin Ölçüsü (İşçi sayı)</label>
          <div className="grid grid-cols-4 gap-4">
            {['1-10', '11-50', '51-200', '200+'].map(size => (
              <button
                key={size}
                onClick={() => setFormData({ ...formData, size })}
                className={`py-4 rounded-xl border-2 font-black italic text-xs transition-all ${
                  formData.size === size ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest italic ml-4">Xüsusi Ehtiyaclar</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'membership', name: 'Üzvlük Sistemi', icon: Users },
              { id: 'reservation', name: 'Rezervasiya', icon: Coffee },
              { id: 'inventory', name: 'Anbar İdarəedilməsi', icon: Package },
              { id: 'accounting', name: 'Maliyyə Hesabatlığı', icon: Zap }
            ].map(need => (
              <button
                key={need.id}
                onClick={() => {
                  const newNeeds = formData.needs.includes(need.id)
                    ? formData.needs.filter(n => n !== need.id)
                    : [...formData.needs, need.id];
                  setFormData({ ...formData, needs: newNeeds });
                }}
                className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                  formData.needs.includes(need.id) ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-500'
                }`}
              >
                <need.icon className="w-5 h-5" />
                <span className="text-[12px] font-black uppercase italic tracking-tight">{need.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-10 animate-in zoom-in-95 duration-700">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">AI Konfiqurasiya Hazırdır!</h2>
          <p className="text-slate-500 font-bold italic text-base">Biznesiniz üçün optimallaşdırılmış ERP mühiti yaradıldı.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* RECOMMENDED MODULES */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight flex items-center gap-3">
                        <LayoutGrid className="w-6 h-6 text-indigo-600" /> Aktivləşdirilən Modullar
                    </h3>
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase italic border border-indigo-100">
                        Smart Config Active
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendation?.modules.map(mod => (
                        <div key={mod} className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] group hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[13px] font-black text-slate-800 dark:text-white uppercase italic leading-none mb-1">{mod}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Module Integrated</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                    ))}
                </div>

                <div className="space-y-4 pt-6">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Sektor-spesifik Funksiyalar</h4>
                    <div className="flex flex-wrap gap-3">
                        {recommendation?.features.map(feat => (
                            <div key={feat} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase italic border border-emerald-100">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {feat.replace('_', ' ')}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                            <Settings className="w-6 h-6 text-indigo-400" /> Default Parametrlər
                        </h3>
                        <Shield className="w-6 h-6 text-indigo-500/50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(recommendation?.default_settings || {}).map(([key, val]) => (
                            <div key={key} className="flex flex-col space-y-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{key.replace('_', ' ')}</span>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white font-black italic text-[13px]">
                                    {val.toString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Zap className="absolute bottom-[-40px] right-[-40px] w-64 h-64 text-indigo-500/10 rotate-[20deg]" />
            </div>
        </div>

        {/* SIDEBAR ANALYSIS */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 italic">AI Performance Goals (KPI)</h3>
                <div className="space-y-6">
                    {recommendation?.kpis.map((kpi, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-black text-slate-700 dark:text-slate-300 italic">{kpi}</span>
                                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter">Tracking</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '0%', animation: `grow ${1 + idx * 0.5}s ease-out forwards` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                    <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed">
                        Sistem avtomatik olaraq bu göstəricilər üzrə "Dashboard" və "Hesabat" bölmələrini konfiqurasiya etdi.
                    </p>
                </div>
            </div>

            <button className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase italic shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                Konfiqurasiyanı Tətbiq Et <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
            </button>
            <button 
              onClick={() => { setStep(1); setFormData({ industry: '', businessType: '', size: '1-10', needs: [] }); }}
              className="w-full py-4 text-slate-400 font-black uppercase italic text-[10px] hover:text-slate-600 transition-all"
            >
              Restart Setup Assistant
            </button>
        </div>
      </div>
      
      <style>{`
        @keyframes grow { from { width: 0; } to { width: 75%; } }
      `}</style>
    </div>
  );

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-24">
      
      {/* STEPS INDICATOR */}
      {step < 3 && (
        <div className="flex items-center justify-center space-x-4">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all ${
                step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
                step > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s === 1 && (
                <div className={`w-20 h-1 rounded-full mx-2 transition-all ${step > 1 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* STEP CONTENT */}
      <div className="flex-1">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-8 animate-in fade-in duration-500">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
              <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">AI Analiz Aparır...</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">Biznes sahəniz üçün ən uyğun konfiqurasiya müəyyən edilir.</p>
            </div>
          </div>
        ) : (
          <>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </>
        )}
      </div>

      {/* FOOTER CONTROLS */}
      {step < 3 && !isAnalyzing && (
        <div className="flex items-center justify-center gap-6 mt-8">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-500 rounded-[2rem] text-[11px] font-black uppercase italic shadow-sm hover:border-slate-300 transition-all flex items-center gap-3"
              >
                <ArrowLeft className="w-4 h-4" /> Geri
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={step === 1 && !formData.industry}
              className={`px-12 py-5 bg-indigo-600 text-white rounded-[2rem] text-[11px] font-black uppercase italic shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95 ${
                step === 1 && !formData.industry ? 'opacity-50 cursor-not-allowed grayscale' : ''
              }`}
            >
              {step === 2 ? 'Analiz et və Quraşdır' : 'Növbəti'} <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      )}

    </div>
  );
};

export default ERPSetupAssistant;
