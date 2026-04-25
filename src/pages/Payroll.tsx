import { useState } from 'react';
import { Calculator, Users, Clock, ReceiptText, SlidersHorizontal, UserPlus } from 'lucide-react';

const Payroll = () => {
  const [activeTab, setActiveTab] = useState('tabel');

  return (
    <div className="space-y-6 max-w-[90rem] mx-auto animate-in fade-in duration-500">
      
      {/* Header section (SaaS style) */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Əmək Haqqı və HR (Payroll)</h2>
          <p className="text-slate-500 text-[13.5px] mt-1 mb-3 font-semibold">Kadrlara nəzarət, Gross-Net kalkulyasiyası və Vergi qaydaları</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[1rem] shadow-soft border border-slate-100 mt-2 md:mt-0 items-center justify-between w-full md:w-auto">
          <div className="flex space-x-1">
            <button onClick={() => setActiveTab('tabel')} className={`px-4 py-2 flex items-center text-[13px] font-bold rounded-xl transition-all ${activeTab === 'tabel' ? 'bg-primary-50 shadow-inner-soft text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}>
              <Clock className="w-4 h-4 mr-2" /> İş Tabeli
            </button>
            <button onClick={() => setActiveTab('calc')} className={`px-4 py-2 flex items-center text-[13px] font-bold rounded-xl transition-all ${activeTab === 'calc' ? 'bg-primary-50 shadow-inner-soft text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}>
              <Calculator className="w-4 h-4 mr-2" /> Aylıq Maaş
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'tabel' && (
      <div className="bg-white rounded-3xl shadow-soft border-0 overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
           <h3 className="font-extrabold text-slate-800 flex items-center text-[15px]">
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 shadow-inner text-slate-400">
                <Users className="w-4 h-4" />
             </div>
             Mart 2026 Uçotu (Timesheet)
           </h3>
           <div className="flex space-x-2">
             <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-sm">İşdə (İ)</span>
             <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-sm">Məzuniyyət (M)</span>
             <span className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-sm">Xəstəlik (X)</span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-white text-[12px] border-collapse whitespace-nowrap">
            <thead className="bg-[#FAFBFD] border-b border-slate-100 text-slate-400 uppercase tracking-widest font-bold">
              <tr>
                <th className="p-4 border-r border-[#FAFBFD] sticky left-0 z-10 bg-[#FAFBFD] shadow-[2px_0_5px_rgba(0,0,0,0.02)] min-w-[200px]">Ştat üzrə Ad / Soyad</th>
                {Array.from({length: 31}, (_, i) => (
                  <th key={i} className="p-3 border-r border-white text-center min-w-[32px]">{i+1}</th>
                ))}
                <th className="p-4 border-l border-[#FAFBFD] text-center text-primary-600 font-black">CƏMİ GÜN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/70 font-semibold text-[13.5px]">
              {[1,2,3,4].map(emp => (
                <tr key={emp} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-50 shadow-[2px_0_5px_rgba(0,0,0,0.03)] flex items-center">
                    <UserPlus className="w-4 h-4 mr-2 text-primary-400 opacity-60" />
                    <span 
                      onClick={() => window.location.href = `/hr/employee/${emp}`}
                      className="hover:text-primary-600 cursor-pointer transition-colors underline-offset-4 hover:underline"
                    >
                      İşçi {emp} ({emp === 1 ? 'Direktor' : emp === 2 ? 'Mühasib' : 'Mütəxəssis'})
                    </span>
                  </td>
                  {Array.from({length: 31}, (_, i) => {
                    const isWeekend = (i+1)%7 === 0 || (i+2)%7 === 0;
                    const status = isWeekend ? '' : (emp === 2 && i > 10 && i < 15) ? 'X' : '8';
                    return (
                      <td key={i} className={`p-2 border-r border-white text-center font-bold ${isWeekend ? 'bg-slate-50/50' : ''} ${status === 'X' ? 'bg-rose-50/60 text-rose-500 shadow-inner cursor-not-allowed' : 'text-slate-400'}`}>
                        {status}
                      </td>
                    )
                  })}
                  <td className="p-4 text-center border-l border-slate-50 bg-emerald-50/20 text-emerald-600 font-black text-[15px]">
                    {emp === 2 ? '19' : '22'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activeTab === 'calc' && (
      <div className="space-y-6 animate-in slide-in-from-right-3 duration-300">
        
        {/* Parametr Cards */}
        <div className="bg-white rounded-3xl shadow-soft border-0 p-6 relative overflow-hidden">
          <div className="absolute opacity-10 top-[-20%] right-[-5%] w-64 h-64 bg-primary-400 blur-[80px] rounded-full"></div>
          
          <h3 className="font-extrabold text-[15px] text-slate-800 mb-5 flex items-center border-b border-slate-50 pb-4 relative z-10">
             <SlidersHorizontal className="w-5 h-5 mr-3 text-primary-500" />
             Azərbaycan Üçün Avtomatik Vergi Parametrləri
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 text-[13px] font-medium relative z-10">
            <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-soft transition group">
              <span className="block text-slate-400 text-[10.5px] uppercase tracking-widest mb-1.5 font-bold group-hover:text-primary-500 transition">Gəlir Vergisi</span>
              <span className="text-slate-800 font-black tracking-tight text-[14.5px]">8000 ₼-dək <span className="text-emerald-500">0%</span>, Yuxarı 14%</span>
            </div>
            <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-soft transition group">
              <span className="block text-slate-400 text-[10.5px] uppercase tracking-widest mb-1.5 font-bold group-hover:text-primary-500 transition">DSMF (İşçi Kəsintisi)</span>
              <span className="text-slate-800 font-black tracking-tight text-[14.5px]">200 ₼-dək <span className="text-rose-400">3%</span>, Yuxarı 10%</span>
            </div>
            <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-soft transition group">
              <span className="block text-slate-400 text-[10.5px] uppercase tracking-widest mb-1.5 font-bold group-hover:text-primary-500 transition">DSMF (İşəgötürən Xərci)</span>
              <span className="text-slate-800 font-black tracking-tight text-[14.5px]">200 ₼-dək 22%, Yuxarı 15%</span>
            </div>
            <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-soft transition group">
              <span className="block text-slate-400 text-[10.5px] uppercase tracking-widest mb-1.5 font-bold group-hover:text-primary-500 transition">Tibbi Sığorta (İTS)</span>
              <span className="text-slate-800 font-black tracking-tight text-[14.5px]">İşçi 2%, İşəgötürən 2%</span>
            </div>
          </div>
        </div>

        {/* Calculation Table */}
        <div className="bg-white rounded-3xl shadow-soft border-0 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
             <h3 className="font-extrabold text-[16px] text-slate-800 flex items-center">
               <ReceiptText className="w-6 h-6 mr-3 text-primary-500 drop-shadow-sm" /> 
               Hesablama Cədvəli (Gross ➔ Net Maaş)
             </h3>
             <span className="text-[11px] bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-black shadow-sm uppercase tracking-widest border border-emerald-100">Aprel üzrə İcra</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-[13.5px]">
              <thead className="bg-[#FAFBFD] text-slate-400 font-bold uppercase tracking-widest text-[11px] border-b border-slate-50">
                <tr>
                  <th className="p-5 font-black">Əməkdaş Vəzifəsi</th>
                  <th className="p-5 border-x border-white text-slate-500 font-black">Gross Qazanc</th>
                  <th className="p-5 border-r border-white">Gəlir Vergi</th>
                  <th className="p-5 border-r border-white">D.S.M.F (İşçi)</th>
                  <th className="p-5 border-r border-white">İşsizlik</th>
                  <th className="p-5 border-r border-white">İTS (Tibbi)</th>
                  <th className="p-5 border-x border-white text-emerald-500 font-black shadow-inner-soft bg-emerald-50/10">Net (Yekun Pay)</th>
                  <th className="p-5 border-l border-white text-amber-500">Müəssisə Xərci</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/50 font-semibold text-slate-600">
                {[
                  { name: "İşçi 1 (Direktor)", gross: 3500 },
                  { name: "İşçi 2 (Mühasib)", gross: 1200 }, // Full month gross, prorated to 19 days
                  { name: "İşçi 3 (Mütəxəssis)", gross: 800 },
                  { name: "İşçi 4 (Köməkçi)", gross: 350 }
                ].map((emp, i) => {
                  let gross = emp.gross;
                  if (i === 1) gross = (1200 / 22) * 19; 

                  const gv = 0; 
                  const dsmfEmp = gross <= 200 ? gross * 0.03 : (200 * 0.03) + ((gross - 200) * 0.10);
                  const dsmfBoss = gross <= 200 ? gross * 0.22 : (200 * 0.22) + ((gross - 200) * 0.15);
                  
                  const ishsizlikEmp = gross * 0.005;
                  const ishsizlikBoss = gross * 0.005;

                  const itsEmp = gross * 0.02;
                  const itsBoss = gross * 0.02;

                  const totalDeductions = gv + dsmfEmp + ishsizlikEmp + itsEmp;
                  const net = gross - totalDeductions;
                  const totalBossCost = dsmfBoss + ishsizlikBoss + itsBoss;

                  return (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="p-5 font-bold text-slate-800">{emp.name}</td>
                      <td className="p-5 font-black text-slate-800 border-x border-slate-50 bg-slate-50/30">{gross.toFixed(2)}</td>
                      <td className="p-5 text-slate-300 border-r border-slate-50 font-bold">{gv.toFixed(2)}</td>
                      <td className="p-5 border-r border-slate-50 text-rose-400">- {dsmfEmp.toFixed(2)}</td>
                      <td className="p-5 border-r border-slate-50 text-rose-400 text-opacity-70">- {ishsizlikEmp.toFixed(2)}</td>
                      <td className="p-5 border-r border-slate-50 text-rose-400 text-opacity-70">- {itsEmp.toFixed(2)}</td>
                      <td className="p-5 font-black text-[16px] text-emerald-600 border-x border-slate-50 shadow-inner bg-emerald-50/10 tracking-tight">{net.toFixed(2)} ₼</td>
                      <td className="p-5 font-bold text-amber-500 border-l border-slate-50 bg-amber-50/5">+ {totalBossCost.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-[#FAFBFD] border-t border-slate-100 flex justify-between items-center text-[12.5px] font-bold">
            <p className="text-slate-400 uppercase tracking-widest pl-2">Mühasibatlıq GL Zənciri (Dr 711 / Cr 533)</p>
            <button className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-soft-xl shadow-primary-500/40 transition-transform hover:scale-105 active:scale-95 uppercase tracking-widest font-black text-[11px]">
               Yekunlaşdır
            </button>
          </div>
        </div>

      </div>
      )}
    </div>
  );
};

export default Payroll;
