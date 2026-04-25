import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Calculator, RefreshCw, Landmark, Users, 
  ArrowRightLeft, ChevronRight, Percent, 
  DollarSign, Wallet, ShieldCheck, HelpCircle, 
  Building2, Briefcase, MinusCircle, PlusCircle,
  BarChart3, Info, Maximize2, Minimize2, ArrowLeft
} from 'lucide-react';
import { calculateOfficialPayroll, type Sector, type WorkplaceType } from '../../utils/payrollCalculator';

const PayrollCalculator = () => {
  const navigate = useNavigate();
  const { isContentFullscreen, setIsContentFullscreen } = useOutletContext<any>();
  const [activeTab, setActiveTab] = useState<'MAIN' | 'ADDITIONAL'>('MAIN');
  const [calculationMode, setCalculationMode] = useState<'GROSS_TO_NET' | 'NET_TO_GROSS'>('GROSS_TO_NET');
  const [amount, setAmount] = useState<number>(500);
  const [sector, setSector] = useState<Sector>('PRIVATE');
  const [unionFeePercent, setUnionFeePercent] = useState<number>(0);
  const [exemptionAmount, setExemptionAmount] = useState<number>(0);

  // Result for the current configuration
  const mainResult = useMemo(() => calculateOfficialPayroll({
    amount, sector, workplaceType: 'MAIN', unionFeePercent, exemptionAmount, year: 2026
  }, calculationMode), [amount, sector, unionFeePercent, calculationMode, exemptionAmount]);

  const addResult = useMemo(() => calculateOfficialPayroll({
    amount, sector, workplaceType: 'ADDITIONAL', unionFeePercent, exemptionAmount, year: 2026
  }, calculationMode), [amount, sector, unionFeePercent, calculationMode, exemptionAmount]);

  const toggleTab = (tab: 'MAIN' | 'ADDITIONAL') => setActiveTab(tab);

  return (
    <div className={`max-w-[1400px] mx-auto min-h-screen animate-in fade-in duration-1000 pb-20 px-4 mt-6 text-slate-800 dark:text-slate-100 italic-none ${isContentFullscreen ? 'pt-10' : ''}`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-6">
        <div className="flex items-center space-x-4">
           {!isContentFullscreen && (
             <button onClick={() => navigate(-1)} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all text-slate-400">
                <ArrowLeft className="w-5 h-5" />
             </button>
           )}
           <div className="flex flex-col">
              <div className="inline-flex items-center px-3 py-1 bg-indigo-50/50 dark:bg-indigo-900/20 backdrop-blur-xl border border-indigo-100/20 rounded-full mb-1 w-fit">
                <Calculator className="w-3 h-3 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300 italic">Official 2026 Calculator</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight italic">
                <span className="bg-gradient-to-r from-indigo-700 to-emerald-500 bg-clip-text text-transparent">Əməkhaqqı</span> Kalkulyatoru
              </h1>
           </div>
        </div>

      </div>

      {/* TOP TAB SWITCHER */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
          <button 
            onClick={() => toggleTab('MAIN')}
            className={`flex items-center space-x-3 px-8 py-4 rounded-[1.8rem] transition-all duration-500 ${activeTab === 'MAIN' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xl scale-[1.05] italic font-black' : 'text-slate-400'}`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest italic">Əsas İş Yeri</span>
          </button>
          <button 
            onClick={() => toggleTab('ADDITIONAL')}
            className={`flex items-center space-x-3 px-8 py-4 rounded-[1.8rem] transition-all duration-500 ${activeTab === 'ADDITIONAL' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xl scale-[1.05] italic font-black' : 'text-slate-400'}`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest italic">Əlavə İş Yeri</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* INPUT PANEL (LEFT) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/20 dark:border-slate-800/50 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
            
            <div className="space-y-10 relative z-10">
              {/* MODE SELECTOR */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Hesablama İstiqaməti</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/30 p-1 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => setCalculationMode('GROSS_TO_NET')}
                    className={`py-3 px-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all duration-300 ${calculationMode === 'GROSS_TO_NET' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Gross ➔ Net
                  </button>
                  <button 
                    onClick={() => setCalculationMode('NET_TO_GROSS')}
                    className={`py-3 px-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all duration-300 ${calculationMode === 'NET_TO_GROSS' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Net ➔ Gross
                  </button>
                </div>
              </div>

              {/* SECTOR PICKER */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">İş Kateqoriyası</label>
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value as Sector)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-6 text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200 outline-none shadow-inner"
                >
                  <option value="PRIVATE">Qeyri-dövlət və qeyri-neft sektoru</option>
                  <option value="STATE">Dövlət və neft sektoru</option>
                </select>
              </div>

              {/* AMOUNT INPUT */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Məbləğ (AZN)</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none outline-none p-10 rounded-[2.5rem] text-4xl font-black text-slate-800 dark:text-white tabular-nums transition-all focus:ring-4 ring-indigo-500/10 text-center italic shadow-inner"
                  />
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic opacity-40">Azərbaycan Manatı</span>
                </div>
              </div>

              {/* EXEMPTION SELECTOR */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Vergi Güzəşti (Maddə 102)</label>
                <select 
                  value={exemptionAmount}
                  onChange={(e) => setExemptionAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-5 text-[11px] font-black uppercase italic text-slate-700 dark:text-slate-200 outline-none shadow-inner"
                >
                  <option value={0}>Yoxdur (0 AZN)</option>
                  <option value={800}>800 AZN (Şəhid ailə üzvləri - Maddə 102.1-1)</option>
                  <option value={400}>400 AZN (Müharibə qəhrəmanı, Şəhid dul arvadı - Maddə 102.2)</option>
                  <option value={200}>200 AZN (I və II dərəcə əlil, Müharibə iştirakçısı - Maddə 102.3)</option>
                  <option value={100}>100 AZN (Əfqanıstan veteranı, Məcburi köçkün - Maddə 102.4)</option>
                  <option value={50}>50 AZN (Himayəsində azı 3 nəfər olanlar - Maddə 102.5)</option>
                </select>
              </div>

              {/* UNION FEE */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Həmkarlar təşkilatı haqqı (%)</label>
                <div className="relative italic">
                  <input 
                    type="number" 
                    value={unionFeePercent}
                    onChange={(e) => setUnionFeePercent(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-5 text-sm font-black text-slate-700 dark:text-slate-200 shadow-inner"
                  />
                  <Percent className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full p-6 bg-gradient-to-r from-indigo-700 to-indigo-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 shadow-inner flex items-center justify-center space-x-3">
                  <RefreshCw className="w-4 h-4" />
                  <span>Hesablamanı Yenilə</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS PANEL (RIGHT) */}
        <div className="xl:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResultColumn 
              title={`MUZDLU İŞÇİ ÜÇÜN (${activeTab === 'MAIN' ? 'ƏSAS' : 'ƏLAVƏ'})`} 
              result={activeTab === 'MAIN' ? mainResult : addResult} 
              perspective="EMPLOYEE" 
              isMain={activeTab === 'MAIN'}
              sector={sector}
            />

            <ResultColumn 
              title={`İŞƏGÖTÜRƏN ÜÇÜN (${activeTab === 'MAIN' ? 'ƏSAS' : 'ƏLAVƏ'})`} 
              result={activeTab === 'MAIN' ? mainResult : addResult} 
              perspective="EMPLOYER" 
              isMain={activeTab === 'MAIN'}
              sector={sector}
            />
          </div>

          {/* METHODOLOGY SECTION */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-2xl space-y-10">
             <div className="flex items-center space-x-4 border-b border-slate-50 dark:border-slate-800 pb-6 shadow-sm">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white italic">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest italic tracking-tight">Hesablama Qaydası ({sector === 'PRIVATE' ? 'Özəl Sektor' : 'Dövlət Sektoru'})</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-500 dark:text-slate-400">
                <div className="space-y-6">
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic shadow-sm">Vergi Hesablanması (Fiziki şəxslər)</p>
                   <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
                      {sector === 'PRIVATE' ? (
                        <div className="text-[11px] font-medium leading-relaxed italic space-y-4">
                           <p>2026-cı il yanvarın 1-dən qeyri-dövlət sektorunda:</p>
                           <ul className="list-disc ml-4 space-y-2">
                              <li>Vergi Bazası = Gross - Güzəşt (200*) - {exemptionAmount} (Maddə 102)</li>
                              <li>2 500 ₼-dək gəlir: (Baza) * 3%</li>
                              <li>2 500 - 8 000 ₼: 75 ₼ + (Excess) * 10%</li>
                              <li>8 000 ₼-dan çox: 625 ₼ + (Excess) * 14%</li>
                              <li className="opacity-50 italic">*200 AZN güzəşt yalnız əsas iş yerində tətbiq olunur.</li>
                           </ul>
                        </div>
                      ) : (
                        <div className="text-[11px] font-medium leading-relaxed italic space-y-4">
                           <p>Dövlət və neft sektorunda standart dərəcə:</p>
                           <ul className="list-disc ml-4 space-y-2">
                             <li>Vergi Bazası = Gross - Güzəşt (200*) - {exemptionAmount} (Maddə 102)</li>
                             <li>2 500 ₼-dək gəlir: (Baza) * 14%</li>
                             <li>2 500-dən çox: 350* + (Excess) * 25%</li>
                             <li className="opacity-50 italic">*200 AZN güzəşt yalnız əsas iş yerində tətbiq olunur.</li>
                           </ul>
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-6">
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic shadow-sm">Sosial Öhdəliklər (Yekun Görünüş)</p>
                   <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
                      {sector === 'PRIVATE' ? (
                        <div className="text-[11px] font-medium leading-relaxed italic space-y-4 text-slate-500">
                          <p>DSMF Dərəcələri:</p>
                          <ul className="list-disc ml-4 space-y-2">
                             <li>İşçi: 200 ₼-dək 3%, sonra 6 ₼ + 10%</li>
                             <li>İşəgötürən: 200 ₼-dək 22%, sonra 44 ₼ + 15%</li>
                             <li className="opacity-70">8000 ₼-dan çox olduqda dərəcələr azalır.</li>
                          </ul>
                        </div>
                      ) : (
                        <div className="text-[11px] font-medium leading-relaxed italic space-y-4 text-slate-500">
                          <p>Dövlət/Neft sektoru üçün sabit DSMF:</p>
                          <ul className="list-disc ml-4 space-y-2">
                             <li>İşçi payı: 3% (Məhdudiyyətsiz)</li>
                             <li>İşəgötürən payı: 22% (Məhdudiyyətsiz)</li>
                          </ul>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const ResultColumn = ({ title, result, perspective, isMain, sector }: { title: string, result: any, perspective: 'EMPLOYEE' | 'EMPLOYER', isMain: boolean, sector: Sector }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-xl space-y-8 relative group overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1.5 ${isMain ? 'bg-indigo-600' : 'bg-rose-500'}`}></div>
      
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest italic text-slate-400">{title}</h4>
        {isMain ? <PlusCircle className="w-5 h-5 text-indigo-500" /> : <MinusCircle className="w-5 h-5 text-rose-500" />}
      </div>

      <div className="space-y-10">
         {/* THE MAIN FIGURE */}
         <div className="text-center bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-2">
              {perspective === 'EMPLOYEE' ? 'Hesablanan əməkhaqqı (GROSS)' : 'İşəgötürənin ümumi məsrəfi'}
            </p>
            <h3 className={`text-4xl font-black italic tabular-nums tracking-tighter ${perspective === 'EMPLOYEE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
              {perspective === 'EMPLOYEE' ? result.gross.toLocaleString() : result.superGross.toLocaleString()} <span className="text-xl font-bold opacity-50">AZN</span>
            </h3>
         </div>

         {/* BREAKDOWN LIST */}
         <div className="space-y-6">
            <ResultRow label="Gəlir Vergisi" value={result.incomeTax} color="rose" isMinus={perspective === 'EMPLOYEE' || result.incomeTax > 0} />
            <ResultRow label={`DSMF (${perspective === 'EMPLOYEE' ? 'İşçi' : 'Şirkət'})`} value={perspective === 'EMPLOYEE' ? result.dsmfEmployee : result.dsmfEmployer} color="indigo" isMinus />
            <ResultRow label="İcbari Tibbi Sığorta" value={perspective === 'EMPLOYEE' ? result.itsEmployee : result.itsEmployer} color="emerald" isMinus />
            <ResultRow label="İşsizlik Sığortası" value={perspective === 'EMPLOYEE' ? result.unemploymentEmployee : result.unemploymentEmployer} color="slate" isMinus />
            {perspective === 'EMPLOYEE' && (result.unionFee || 0) > 0 && <ResultRow label="Həmkarlar Haqqı" value={result.unionFee} color="amber" isMinus />}
            
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center italic">
               <span className="text-[11px] font-black uppercase tracking-widest italic text-slate-800 dark:text-white">
                 {perspective === 'EMPLOYEE' ? 'Yekun ödəniləcək (NETT)' : 'İşəgötürənin ödəməli olduğu (G+S)'}
               </span>
               <span className={`text-lg font-black tabular-nums transition-all ${perspective === 'EMPLOYEE' ? 'text-indigo-600' : 'text-slate-800 dark:text-white'}`}>
                 ₼ {perspective === 'EMPLOYEE' ? result.net.toLocaleString() : result.superGross.toLocaleString()}
               </span>
            </div>
         </div>
      </div>
    </div>
  );
};

const ResultRow = ({ label, value, color, isMinus }: { label: string, value: number, color: string, isMinus: boolean }) => (
  <div className="flex justify-between items-center group">
    <span className="text-[10px] font-bold text-slate-500 uppercase italic group-hover:text-slate-800 transition-colors">{label}</span>
    <span className={`text-sm font-black italic tabular-nums text-${color}-600 tracking-tight`}>
       {isMinus ? '-' : '+'} {value.toLocaleString(undefined, { minimumFractionDigits: 2 })} ₼
    </span>
  </div>
);

export default PayrollCalculator;
