import { useState } from 'react';
import { Settings2, CheckCircle2, Plus } from 'lucide-react';

const Finance = () => {
  const [activeTab, setActiveTab] = useState('gl');
  const [gaapMode, setGaapMode] = useState('LOCAL'); // 'LOCAL' or 'IFRS'

  return (
    <div className="space-y-6 max-w-[90rem] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Maliyyə Zənciri (GL)</h2>
          <p className="text-slate-500 text-[13px] mt-1 mb-3 font-semibold">T-Hesablar və İkili Uçot mərkəzi</p>
          <div className="flex space-x-2">
            <button 
              onClick={() => setGaapMode('LOCAL')}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-widest font-black rounded-lg transition-all border ${gaapMode === 'LOCAL' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-inner' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:text-slate-600 shadow-sm'}`}
            >
              ARVM (Yerli Vergi) Mode
            </button>
            <button 
              onClick={() => setGaapMode('IFRS')}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-widest font-black rounded-lg transition-all border ${gaapMode === 'IFRS' ? 'bg-primary-50 text-primary-700 border-primary-200 shadow-inner' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:text-slate-600 shadow-sm'}`}
            >
              IFRS (ACCA) Mode
            </button>
          </div>
        </div>
        <div className="flex bg-white p-1.5 rounded-[1rem] shadow-sm border border-slate-100 mt-4 md:mt-0">
          <button 
            onClick={() => window.location.href = '/finance/expense/create'}
            className="px-5 py-2.5 text-[13px] font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Xərc Sənədi
          </button>
          <div className="w-[1px] h-6 bg-slate-100 self-center mx-2"></div>
          <button onClick={() => setActiveTab('gl')} className={`px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all ${activeTab === 'gl' ? 'bg-primary-50 shadow-inner-soft text-primary-700' : 'text-slate-500 hover:text-slate-800'}`}>Ümumi Jurnal</button>
          <button onClick={() => setActiveTab('manual')} className={`px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all ${activeTab === 'manual' ? 'bg-primary-50 shadow-inner-soft text-primary-700' : 'text-slate-500 hover:text-slate-800'}`}>Əllə Müxabirləşmə</button>
        </div>
      </div>

      {activeTab === 'gl' && (
      <div className="bg-white rounded-3xl shadow-soft border-0 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
           <div className="flex flex-col">
             <h3 className="font-black text-slate-800 text-lg">General Ledger (Baş Kitab Jurnalı)</h3>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{gaapMode === 'IFRS' ? 'IFRS Standartları (ACCA)' : 'ARVM (Milli Mühasibat Standartları)'} Uçotu üzrə filtrlənib</span>
           </div>
           <button className="text-slate-500 hover:text-primary-700 shadow-inner flex items-center text-sm font-bold px-4 py-2 border border-slate-100 rounded-xl bg-[#F9FAFB] transition hover:bg-primary-50">
             <Settings2 className="w-4 h-4 mr-2" /> Təkmil Filtr
           </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-white text-[13.5px]">
            <thead className="bg-[#F9FAFB] border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-5 w-32 border-r border-white">Əməliyyat №</th>
                <th className="p-5 w-32 border-r border-white">Tarix</th>
                <th className="p-5 border-r border-white">Hesablar Planı (COA)</th>
                <th className="p-5 border-r border-white">Təsvir (Memo)</th>
                <th className="p-5 text-right text-emerald-500 w-36 border-r border-white">Debet (Dr)</th>
                <th className="p-5 text-right text-amber-500 w-36">Kredit (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              <tr className="bg-primary-50/20 hover:bg-primary-50/40 transition">
                <td className="p-5 text-slate-400 font-black border-b border-slate-100" rowSpan={3}>TRX-2026-902</td>
                <td className="p-5 text-slate-500 font-bold border-b border-slate-100" rowSpan={3}>29 Mart 2026</td>
                <td className="p-5 font-mono font-black text-primary-600">211.01.01 - Alıcılar (Ölkədaxili)</td>
                <td className="p-5 text-slate-500 text-xs font-semibold">Satış S-2026-1004</td>
                <td className="p-5 text-right font-black text-[15px] text-emerald-600 bg-emerald-50/30 border-l border-white shadow-inner">4,425.00</td>
                <td className="p-5 text-right text-slate-300 border-l border-white">0.00</td>
              </tr>
              <tr className="bg-white hover:bg-slate-50 transition border-b border-slate-50/50">
                <td className="p-5 font-mono font-bold text-slate-600 italic pl-10 border-l-[3px] border-l-slate-200">601.01.01 - Satışdan Gəlirlər</td>
                <td className="p-5 text-slate-400 text-xs italic">Satış S-2026-1004 üzrə gəlirin tanınması</td>
                <td className="p-5 text-right text-slate-300 border-l border-slate-50">0.00</td>
                <td className="p-5 text-right font-black text-[15px] text-slate-700 bg-amber-50/10 border-l border-slate-50 shadow-inner">3,750.00</td>
              </tr>
              <tr className="bg-white hover:bg-slate-50 transition border-b border-slate-100">
                <td className="p-5 font-mono font-bold text-slate-600 italic pl-10 border-l-[3px] border-l-slate-200">545.01.01 - ƏDV Öhdəliyi (18%)</td>
                <td className="p-5 text-slate-400 text-xs italic">S-2026-1004 üzrə büdcəyə ƏDV</td>
                <td className="p-5 text-right text-slate-300 border-l border-slate-50">0.00</td>
                <td className="p-5 text-right font-black text-[15px] text-rose-500 bg-rose-50/20 border-l border-slate-50 shadow-inner">675.00</td>
              </tr>

              <tr className="bg-primary-50/20 hover:bg-primary-50/40 transition">
                <td className="p-5 text-slate-400 font-black border-b border-slate-100" rowSpan={2}>TRX-2026-903</td>
                <td className="p-5 text-slate-500 font-bold border-b border-slate-100" rowSpan={2}>29 Mart 2026</td>
                <td className="p-5 font-mono font-black text-primary-600">701.01.01 - SMM (COGS)</td>
                <td className="p-5 text-slate-500 text-xs font-semibold">S-2026-1004 maya dəyəri sərfi</td>
                <td className="p-5 text-right font-black text-[15px] text-emerald-600 bg-emerald-50/30 border-l border-white shadow-inner">2,850.00</td>
                <td className="p-5 text-right text-slate-300 border-l border-white">0.00</td>
              </tr>
              <tr className="bg-white hover:bg-slate-50 transition border-b border-slate-100">
                <td className="p-5 font-mono font-bold text-slate-600 italic pl-10 border-l-[3px] border-l-slate-200">204.01.01 - Hazır Məhsullar</td>
                <td className="p-5 text-slate-400 text-xs italic">Anbardan çıxış (Armatur)</td>
                <td className="p-5 text-right text-slate-300 border-l border-slate-50">0.00</td>
                <td className="p-5 text-right font-black text-[15px] text-slate-700 bg-amber-50/10 border-l border-slate-50 shadow-inner">2,850.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activeTab === 'manual' && (
      <div className="bg-white rounded-[2rem] shadow-soft-xl border-0 p-8 max-w-5xl mx-auto">
        <h3 className="font-black text-2xl text-slate-800 border-b border-slate-100 pb-5 mb-8 tracking-tight">Əllə Müxabirləşmə Girişi</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-[#F9FAFB] p-6 rounded-2xl border border-slate-50">
           <div>
             <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Jurnal Tarixi <span className="text-rose-500">*</span></label>
             <input type="date" className="w-full bg-white border border-slate-200 shadow-inner-soft rounded-xl px-5 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" defaultValue="2026-03-29" />
           </div>
           <div>
             <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Sənəd Referansı</label>
             <input type="text" className="w-full bg-white border border-slate-200 shadow-inner-soft rounded-xl px-5 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow placeholder-slate-300" placeholder="Məs: Əmr-10/44" />
           </div>
           <div className="col-span-1 md:col-span-2">
             <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Əsas Açıqlama (Memo) <span className="text-rose-500">*</span></label>
             <input type="text" className="w-full bg-white border border-slate-200 shadow-inner-soft rounded-xl px-5 py-3.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow placeholder-slate-300" placeholder="Əməliyyatın səbəbini qeyd edin..." />
           </div>
        </div>

        <div className="border border-slate-100 rounded-3xl overflow-hidden mb-8 shadow-sm bg-white">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#FAFBFD] text-slate-400 font-bold uppercase tracking-widest text-[11px]">
              <tr>
                <th className="p-4 w-12 text-center border-r border-white">#</th>
                <th className="p-4 border-r border-white">Uçot Hesabı (COA)</th>
                <th className="p-4 border-l border-slate-50 text-right w-48 border-r border-white">Bölmə / Subyekt</th>
                <th className="p-4 border-l border-slate-50 text-right w-40 text-emerald-500 border-r border-white">Debet (Dr) AZN</th>
                <th className="p-4 border-l border-slate-50 text-right w-40 text-amber-500">Kredit (Cr) AZN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              <tr className="bg-white hover:bg-slate-50 transition">
                <td className="p-4 text-center font-black text-slate-300">1</td>
                <td className="p-4"><input type="text" className="w-full outline-none font-bold text-primary-600 bg-transparent placeholder-slate-300" placeholder="Məs: 711" defaultValue="711.01 - İnzibati Xərclər" /></td>
                <td className="p-4 border-l border-slate-50"><input type="text" className="w-full outline-none text-right placeholder-slate-300 font-semibold text-slate-500 bg-transparent" placeholder="Təyinat" defaultValue="Ofis təmiri" /></td>
                <td className="p-4 border-l border-slate-50 bg-emerald-50/20"><input type="text" className="w-full outline-none text-right font-black text-emerald-600 bg-transparent text-[15px]" defaultValue="500.00" /></td>
                <td className="p-4 border-l border-slate-50"><input type="text" className="w-full outline-none text-right font-bold text-slate-300 bg-transparent" defaultValue="0.00" /></td>
              </tr>
              <tr className="bg-white hover:bg-slate-50 transition">
                <td className="p-4 text-center font-black text-slate-300">2</td>
                <td className="p-4"><input type="text" className="w-full outline-none font-bold text-primary-600 bg-transparent placeholder-slate-300" placeholder="Məs: 221" defaultValue="221.01 - Kassa (AZN)" /></td>
                <td className="p-4 border-l border-slate-50"><input type="text" className="w-full outline-none text-right placeholder-slate-300 font-semibold text-slate-500 bg-transparent" placeholder="Təyinat" defaultValue="Məxaric Orderi" /></td>
                <td className="p-4 border-l border-slate-50"><input type="text" className="w-full outline-none text-right font-bold text-slate-300 bg-transparent" defaultValue="0.00" /></td>
                <td className="p-4 border-l border-slate-50 bg-amber-50/10"><input type="text" className="w-full outline-none text-right font-black text-[#FF9F43] bg-transparent text-[15px]" defaultValue="500.00" /></td>
              </tr>
              <tr className="bg-[#FAFBFD]">
                <td colSpan={5} className="p-4 text-center text-primary-600 hover:text-primary-800 font-black text-[12px] uppercase tracking-wider cursor-pointer border-t border-slate-100 transition-colors">
                  + Sətir Əlavə Et
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-white border-t-2 border-slate-100 font-bold text-[14px]">
              <tr>
                <td colSpan={3} className="p-5 text-right text-slate-400 uppercase text-[11px] tracking-widest font-black">Yekun Faktura (Balans)</td>
                <td className="p-5 text-right bg-emerald-50/50 text-emerald-700 border-l border-slate-100 font-black text-[15px]">500.00 ₼</td>
                <td className="p-5 text-right bg-amber-50/30 text-amber-700 border-l border-slate-100 font-black text-[15px]">500.00 ₼</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-primary-500/30 shadow-soft-lg transition-transform hover:scale-105 active:scale-95 flex justify-center items-center group text-sm tracking-wide">
          <CheckCircle2 className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" /> BAŞ KİTABA İŞLƏ (POST)
        </button>
      </div>
      )}
    </div>
  );
};

export default Finance;
