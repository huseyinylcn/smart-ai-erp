import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  CheckCircle2, Users, Briefcase, ChevronRight, 
  ChevronLeft, Calculator, Zap, Shield, Rocket,
  Settings, Database, DollarSign, PieChart, Info,
  ShoppingCart, Globe, Truck, Building2, Factory, 
  Sprout, Landmark, GraduationCap, HeartPulse, HardHat,
  ChevronDown, ChevronUp, HelpCircle, ArrowLeft
} from 'lucide-react';

const PricingConfigurator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    industries: [] as string[],
    modules: [] as string[],
    turnover: 'Micro', // Azerbaijan classification
    employees: 10,
    users: 3
  });

  const industries = [
    { id: 'retail', name: 'Pərakəndə Satış', icon: ShoppingCart },
    { id: 'wholesale', name: 'Topdan Satış', icon: Briefcase },
    { id: 'manufacturing', name: 'İstehsalat (BOM)', icon: Factory },
    { id: 'construction', name: 'Tikinti & İnşaat', icon: HardHat },
    { id: 'real-estate', name: 'Daşınmaz Əmlak', icon: Building2 },
    { id: 'logistics', name: 'Logistika & Nəqliyyat', icon: Truck },
    { id: 'agriculture', name: 'Kənd Təsərrüfatı', icon: Sprout },
    { id: 'hospitality', name: 'Otellər & Restoranlar', icon: Globe },
    { id: 'healthcare', name: 'Səhiyyə', icon: HeartPulse },
    { id: 'education', name: 'Təhsil', icon: GraduationCap },
    { id: 'finance', name: 'Maliyyə & Sığorta', icon: Landmark }
  ];

  const modules = [
    { id: 'treasury', name: 'Xəzinə & Bank', category: 'Finance', type: 'mandatory' },
    { id: 'accounting', name: 'Mühasibatlıq (Milli Standart)', category: 'Finance', type: 'recommended' },
    { id: 'procurement', name: 'Tədarük & Satınalma', category: 'Operations', type: 'optional' },
    { id: 'inventory', name: 'Anbar & Stok Uçotu', category: 'Operations', type: 'optional' },
    { id: 'sales', name: 'Satış & CRM', category: 'Sales', type: 'recommended' },
    { id: 'production', name: 'İstehsalat & Maya Dəyəri', category: 'Operations', type: 'optional' },
    { id: 'hr', name: 'HR & Şəxsi İşlər', category: 'People', type: 'mandatory' },
    { id: 'payroll', name: 'Əmək haqqı (Payroll)', category: 'People', type: 'recommended' },
    { id: 'fixed-assets', name: 'Əsas Vəsaitlər', category: 'Finance', type: 'optional' },
    { id: 'e-doc', name: 'E-Sənəd Dövriyyəsi', category: 'Management', type: 'recommended' },
    { id: 'ai', name: 'AI CoPilot Agent', category: 'Advanced', type: 'optional' },
    { id: 'mobile', name: 'Mobil ERP', category: 'Advanced', type: 'optional' }
  ];

  const turnoverSizes = [
    { id: 'Micro', name: 'Mikro', desc: '0 - 200,000 ₼' },
    { id: 'Small', name: 'Kiçik', desc: '200,000 - 3 mln ₼' },
    { id: 'Medium', name: 'Orta', desc: '3 mln - 30 mln ₼' },
    { id: 'Large', name: 'İri', desc: '30 mln+ ₼' }
  ];

  // AI Logic: Mandatory & Recommended modules based on Industry & Selections
  useEffect(() => {
    let newModules = [...selections.modules];
    
    // Auto-add Mandatory modules if missing
    modules.filter(m => m.type === 'mandatory').forEach(m => {
      if (!newModules.includes(m.id)) newModules.push(m.id);
    });

    // AI Logic 1: Manufacturing sector -> Production becomes RECOMMENDED (if not already selected)
    if (selections.industries.includes('manufacturing') && !newModules.includes('production')) {
      // Logic could auto-select or just flag it. Let's auto-select recommended ones.
      newModules.push('production');
    }
    
    // AI Logic 2: Retail sector -> Inventory & Sales become RECOMMENDED
    if (selections.industries.includes('retail')) {
      if (!newModules.includes('inventory')) newModules.push('inventory');
      if (!newModules.includes('sales')) newModules.push('sales');
    }

    if (JSON.stringify(newModules) !== JSON.stringify(selections.modules)) {
      setSelections(prev => ({ ...prev, modules: newModules }));
    }
  }, [selections.industries]);

  const toggleIndustry = (id: string) => {
    setSelections(prev => ({
      ...prev,
      industries: prev.industries.includes(id) 
        ? prev.industries.filter(i => i !== id) 
        : [...prev.industries, id]
    }));
  };

  const toggleModule = (id: string) => {
    const mod = modules.find(m => m.id === id);
    if (mod?.type === 'mandatory') return;

    setSelections(prev => ({
      ...prev,
      modules: prev.modules.includes(id) 
        ? prev.modules.filter(m => m !== id) 
        : [...prev.modules, id]
    }));
  };

  const calculatePrice = () => {
    let base = 75; 
    base += selections.modules.length * 25;
    base += selections.users * 20;
    if (selections.modules.includes('ai')) base += 150;
    
    const multipliers: Record<string, number> = { 'Micro': 1, 'Small': 1.3, 'Medium': 1.8, 'Large': 3 };
    return Math.round(base * multipliers[selections.turnover]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-40 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tight">Demo Sına</h1>
            <p className="text-lg text-slate-500 font-medium">AI Agent sizin ehtiyaclarınıza uyğun ən optimal konfiqurasiyanı hazırlayır.</p>
          </div>

          <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
            {/* AI BADGE */}
            <div className="absolute top-8 right-8 flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <Zap className="w-4 h-4 text-[#2D5BFF] fill-[#2D5BFF]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2D5BFF]">AI Pricing Agent: Learning Active</span>
            </div>

            {/* STEP 1: INDUSTRIES */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center space-x-4 mb-10">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">1. Fəaliyyət Sahələri</h2>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">AI: Sahənizi analiz edir</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {industries.map(ind => (
                    <button 
                      key={ind.id}
                      onClick={() => toggleIndustry(ind.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left group ${
                        selections.industries.includes(ind.id) 
                        ? 'border-[#2D5BFF] bg-blue-50/50' 
                        : 'border-slate-50 bg-white hover:border-slate-200'
                      }`}
                    >
                      <ind.icon className={`w-8 h-8 mb-4 ${
                        selections.industries.includes(ind.id) ? 'text-[#2D5BFF]' : 'text-slate-400'
                      }`} />
                      <div className="font-bold text-xs uppercase tracking-widest text-slate-800">{ind.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: MODULES */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center space-x-4 mb-10">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">2. ERP Modulları</h2>
                  <div className="bg-blue-50 text-[#2D5BFF] px-3 py-1 rounded-lg text-[10px] font-black uppercase">AI: Modul asılılıqlarını yoxlayır</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {modules.map(mod => {
                    const isSelected = selections.modules.includes(mod.id);
                    const isMandatory = mod.type === 'mandatory';
                    const isRecommended = mod.type === 'recommended';

                    return (
                      <div key={mod.id} className="relative group">
                        <button 
                          onClick={() => toggleModule(mod.id)}
                          className={`w-full p-5 rounded-xl border-2 transition-all flex items-center justify-between ${
                            isSelected 
                            ? 'border-[#2D5BFF] bg-blue-50/50' 
                            : 'border-slate-50 bg-white hover:border-slate-200'
                          } ${isMandatory ? 'opacity-70' : ''}`}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-bold text-sm text-slate-700">{mod.name}</span>
                            <div className="flex items-center space-x-2 mt-1">
                              {isMandatory && <span className="text-[8px] font-black uppercase text-[#2D5BFF]">Məcburi</span>}
                              {isRecommended && <span className="text-[8px] font-black uppercase text-emerald-500">Tövsiyə</span>}
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2D5BFF]" />}
                        </button>
                        
                        {isRecommended && isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg cursor-help">
                            <Info className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-black text-slate-900 mb-10 uppercase tracking-tight">3. Biznes Ölçüsü (AR Meyarı)</h2>
                
                <div className="mb-12">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 block">İllik Dövriyyə və İşçi Sayı üzrə Təsnifat</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {turnoverSizes.map(size => (
                      <button 
                        key={size.id}
                        onClick={() => setSelections(prev => ({ ...prev, turnover: size.id }))}
                        className={`p-6 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                          selections.turnover === size.id 
                          ? 'border-[#2D5BFF] bg-blue-50/50' 
                          : 'border-slate-50 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-black text-sm uppercase tracking-widest text-slate-800 mb-1">{size.name}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{size.desc}</div>
                        </div>
                        {selections.turnover === size.id && <CheckCircle2 className="w-5 h-5 text-[#2D5BFF]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 block">Dəqiq İşçi Sayı</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input 
                        type="number" value={selections.employees}
                        onChange={(e) => setSelections(prev => ({ ...prev, employees: parseInt(e.target.value) || 0 }))}
                        className="w-full pl-12 p-4 bg-slate-50 rounded-xl border border-slate-100 font-bold outline-none focus:border-[#2D5BFF]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 block">Sistem İstifadəçisi (Eyni anda giriş)</label>
                    <div className="relative">
                      <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input 
                        type="number" value={selections.users}
                        onChange={(e) => setSelections(prev => ({ ...prev, users: parseInt(e.target.value) || 0 }))}
                        className="w-full pl-12 p-4 bg-slate-50 rounded-xl border border-slate-100 font-bold outline-none focus:border-[#2D5BFF]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: RESULT */}
            {step === 4 && (
              <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                <h2 className="text-5xl font-black text-slate-900 mb-8 uppercase tracking-tight">Hesablanmış Təklif</h2>
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white mb-12 max-w-2xl mx-auto">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2D5BFF] mb-6">Aylıq Ödəniş</div>
                  <div className="text-7xl font-black mb-6">₼{calculatePrice()}</div>
                  <p className="text-slate-400 text-sm font-medium">Sizin üçün {selections.modules.length} modul və {selections.users} istifadəçi üzrə fərdi paket hazırlandı.</p>
                </div>
                <button onClick={() => navigate('/auth/register')} className="px-16 py-8 bg-[#2D5BFF] text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:scale-105 transition-all">
                  Demo Sına və Qeydiyyatı Tamamla
                </button>
              </div>
            )}

            {/* NAVIGATION */}
            <div className="mt-16 pt-8 border-t border-slate-50 flex justify-between">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="text-slate-400 font-black uppercase tracking-widest text-xs flex items-center space-x-2">
                  <ChevronLeft className="w-4 h-4" /> <span>Geri</span>
                </button>
              ) : <div />}
              {step < 4 ? (
                <button onClick={() => setStep(step + 1)} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2">
                  <span>Növbəti</span> <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PricingConfigurator;
