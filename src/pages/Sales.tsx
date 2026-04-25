import { useState } from 'react';
import { Plus, Search, Filter, FileSpreadsheet, Eye, Lock, Receipt, X } from 'lucide-react';

const Sales = () => {
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Head */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Satış Sifarişləri (Sales)</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Bütün CRM sənədlərinin qeydiyyatı, arxiv və təsdiq mərkəzi</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="bg-white border-none shadow-soft text-sm font-bold text-slate-600 hover:text-emerald-600 px-5 py-2.5 rounded-xl flex items-center transition relative overflow-hidden group">
            <span className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition"></span>
            <FileSpreadsheet className="w-4 h-4 mr-2 relative z-10" /> <span className="relative z-10">Export (XLS)</span>
          </button>
          <button onClick={() => setShowOrderModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl shadow-soft-lg shadow-primary-500/40 text-sm font-bold flex items-center transition-all">
            <Plus className="w-5 h-5 mr-2" /> Yeni Qaimə
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-soft border-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
           <div className="flex items-center w-full md:w-[400px] bg-slate-50 rounded-xl px-4 py-2.5 border border-transparent focus-within:border-primary-300 focus-within:bg-white focus-within:shadow-soft transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Qaimə №, Müştəri və ya Məbləğ..." className="bg-transparent border-none outline-none ml-3 text-sm w-full font-semibold placeholder-slate-400 text-slate-700" />
           </div>
           <button className="text-slate-500 hover:text-primary-600 shadow-soft flex items-center text-sm font-bold px-5 py-2.5 rounded-xl bg-white transition hover:bg-primary-50 self-start md:self-auto border border-slate-100/50">
             <Filter className="w-4 h-4 mr-2" /> Təkmilləşdirilmiş Filtr
           </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] text-slate-500 text-[12px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4 font-black">Sənəd №</th>
                <th className="px-6 py-4 font-black">Müştəri Detalları</th>
                <th className="px-6 py-4 font-black">ƏDV-siz Dəyər</th>
                <th className="px-6 py-4 font-black text-rose-500">+18% ƏDV AZN</th>
                <th className="px-6 py-4 font-black text-primary-600">Toplam Məbləğ</th>
                <th className="px-6 py-4 font-black text-center">Status</th>
                <th className="px-6 py-4 font-black text-center">Fəaliyyət</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {[1, 2, 3, 4].map((item) => {
                const baseValue = 1250 * item;
                const vat = baseValue * 0.18;
                const total = baseValue + vat;
                return (
                <tr key={item} className="hover:bg-slate-50/70 transition-colors bg-white border-b border-slate-50 last:border-0 group cursor-pointer">
                  <td className="px-6 py-4 font-bold text-slate-700 flex items-center h-full">
                    S-2026-{(1003+item).toString().padStart(4, '0')}
                    <span title="Təsdiqləndi (Edit Disabled)"><Lock className="w-3.5 h-3.5 ml-2.5 text-slate-300 group-hover:text-primary-400 transition" /></span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-[14.5px]">Caspian Qrup M<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">MC</span></div>
                    <div className="text-[12px] text-slate-400 font-semibold mt-0.5 tracking-wide">VÖEN: 1400{item}23122</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-500">{baseValue.toLocaleString('az-AZ', {minimumFractionDigits: 2})} ₼</td>
                  <td className="px-6 py-4 font-bold text-rose-500">{vat.toLocaleString('az-AZ', {minimumFractionDigits: 2})} ₼</td>
                  <td className="px-6 py-4 font-black text-slate-800 text-[15px]">{total.toLocaleString('az-AZ', {minimumFractionDigits: 2})} ₼</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider font-black bg-emerald-50 text-emerald-600">
                      ÖDƏNİLİB
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center flex-row space-x-2">
                      <button onClick={() => setShowOrderModal(true)} className="p-2 lg:p-2.5 text-slate-400 bg-white border border-slate-100 hover:border-slate-300 hover:text-slate-600 rounded-xl transition-all shadow-soft" title="Sənədin İçi">
                        <Eye className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <button onClick={() => setShowJournalModal(true)} className="px-3 py-2 bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl font-bold flex items-center transition shadow-soft hover:shadow-primary-500/30" title="Müxabirləşmə (Dr/Cr)">
                        <Receipt className="w-4 h-4 mr-1.5 stroke-[2.5]" /> <span className="text-xs uppercase tracking-wide">Müxabirləşmə</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in p-4">
          <div className="bg-white rounded-3xl shadow-soft-xl border-0 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Qaimənin Sətirləri: S-2026-1004</h3>
              <button onClick={() => setShowOrderModal(false)} className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-full transition"><X className="w-6 h-6"/></button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 bg-[#F9FAFB]">
               <div className="overflow-x-auto border-0 shadow-soft bg-white rounded-2xl">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-white text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                     <tr>
                       <th className="p-5 font-black">Malın / Xidmətin Adı</th>
                       <th className="p-5">Kateqoriya</th>
                       <th className="p-5">Ölçü Vahidi</th>
                       <th className="p-5">Ölçüsü</th>
                       <th className="p-5 bg-slate-50/50">Miqdar</th>
                       <th className="p-5 bg-slate-50/50 text-right">Vahid Dəyəri</th>
                       <th className="p-5 text-right text-rose-400">Totsuz (ƏDV-siz)</th>
                       <th className="p-5 text-right font-black text-primary-500">Toplam Cəmi</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 font-medium text-[13.5px]">
                     {[1,2,3].map(i => (
                       <tr key={i} className="hover:bg-[#F9FAFB] transition">
                         <td className="p-5 font-bold text-slate-700">Armatur A500C {i*2}mm</td>
                         <td className="p-5 text-slate-400">Tikinti Mat.</td>
                         <td className="p-5 text-slate-500 font-semibold">Ton</td>
                         <td className="p-5 text-slate-400">12m Standart</td>
                         <td className="p-5 font-black bg-slate-50/30 text-slate-800">{i * 1.5}</td>
                         <td className="p-5 font-bold text-slate-500 text-right bg-slate-50/30">840.00 AZN</td>
                         <td className="p-5 font-bold text-rose-500 text-right bg-rose-50/10">{((i * 1.5) * 840).toFixed(2)} AZN</td>
                         <td className="p-5 font-black text-primary-600 text-right bg-primary-50/10 text-[15px]">{(((i * 1.5) * 840) * 1.18).toFixed(2)} AZN</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
              <button onClick={() => setShowOrderModal(false)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition">Qapat və Geri Dön</button>
            </div>
          </div>
        </div>
      )}

      {showJournalModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in p-4">
          <div className="bg-white rounded-[2rem] shadow-soft-xl border-0 w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-8 border-b border-slate-100 bg-white">
              <div className="flex items-center">
                <div className="bg-primary-50 p-3 rounded-2xl mr-4 shadow-inner text-primary-600">
                  <Receipt className="w-7 h-7 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-800">Double-Entry T-Hesabları</h3>
                  <p className="text-slate-500 text-sm font-semibold mt-1">Sənəd: <span className="text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded-md">S-2026-1004</span> | Standart: <span className="text-amber-600">ARVM / IFRS 15</span></p>
                </div>
              </div>
              <button onClick={() => setShowJournalModal(false)} className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all"><X className="w-6 h-6 stroke-[2.5]"/></button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 bg-[#FAFBFD] space-y-8">
               
               <div>
                 <h4 className="font-bold text-slate-400 text-[11px] mb-3 uppercase tracking-widest pl-1">Jurnal Sətirləri (Gəlirin İdentifikasiyası)</h4>
                 <div className="border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-soft">
                   <table className="w-full text-left text-[13.5px]">
                     <thead className="bg-white text-slate-400 border-b border-slate-100 uppercase tracking-widest font-bold text-[11px]">
                       <tr>
                         <th className="p-4 pl-6 w-32">Uçot Kodu</th>
                         <th className="p-4">Hesab Adlandırması</th>
                         <th className="p-4 text-right border-l border-slate-50 text-emerald-500 w-36">Debet (Dr)</th>
                         <th className="p-4 pr-6 text-right border-l border-slate-50 text-rose-400 w-36">Kredit (Cr)</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50/50 font-semibold text-slate-700">
                       <tr className="hover:bg-slate-50 transition">
                         <td className="p-4 pl-6 font-mono font-bold text-primary-600 tracking-tight">211.01</td>
                         <td className="p-4">Alıcılar: <span className="text-slate-400 font-medium">Caspian Qrup</span></td>
                         <td className="p-4 text-right border-l border-slate-50 font-black text-emerald-600 text-[15px] bg-emerald-50/20">4,425.00</td>
                         <td className="p-4 pr-6 text-right border-l border-slate-50 text-slate-300">0.00</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition">
                         <td className="p-4 pl-6 font-mono font-bold text-primary-600 tracking-tight">601.01</td>
                         <td className="p-4">Satışdan Gəlirlər (Mallar)</td>
                         <td className="p-4 text-right border-l border-slate-50 text-slate-300">0.00</td>
                         <td className="p-4 pr-6 text-right border-l border-slate-50 font-black text-slate-800 text-[15px]">3,750.00</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition border-b border-slate-100">
                         <td className="p-4 pl-6 font-mono font-bold text-primary-600 tracking-tight">545.01</td>
                         <td className="p-4">Ödənilməli ƏDV Öhdəliyi (Büdcəyə 18%)</td>
                         <td className="p-4 text-right border-l border-slate-50 text-slate-300">0.00</td>
                         <td className="p-4 pr-6 text-right border-l border-slate-50 font-black text-rose-500 text-[15px] bg-rose-50/30">675.00</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>

               <div>
                 <h4 className="font-bold text-slate-400 text-[11px] mb-3 uppercase tracking-widest pl-1">Maya Dəyəri Sətirləri (IAS 2 - Costing)</h4>
                 <div className="border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-soft">
                   <table className="w-full text-left text-[13.5px]">
                     <thead className="bg-white text-slate-400 border-b border-slate-100 uppercase tracking-widest font-bold text-[11px]">
                       <tr>
                         <th className="p-4 pl-6 w-32">Uçot Kodu</th>
                         <th className="p-4">Hesab Adlandırması</th>
                         <th className="p-4 text-right border-l border-slate-50 text-emerald-500 w-36">Debet (Dr)</th>
                         <th className="p-4 pr-6 text-right border-l border-slate-50 text-rose-400 w-36">Kredit (Cr)</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50/50 font-semibold text-slate-700">
                       <tr className="hover:bg-slate-50 transition">
                         <td className="p-4 pl-6 font-mono font-bold text-primary-600 tracking-tight">701.01</td>
                         <td className="p-4">Satılmış Malların Maya Dəyəri (COGS)</td>
                         <td className="p-4 text-right border-l border-slate-50 font-black text-emerald-600 text-[15px] bg-emerald-50/20">2,850.00</td>
                         <td className="p-4 pr-6 text-right border-l border-slate-50 text-slate-300">0.00</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition">
                         <td className="p-4 pl-6 font-mono font-bold text-primary-600 tracking-tight">204.01</td>
                         <td className="p-4">Ehtiyatlar (Anbardan çıxış: Armatur)</td>
                         <td className="p-4 text-right border-l border-slate-50 text-slate-300">0.00</td>
                         <td className="p-4 pr-6 text-right border-l border-slate-50 font-black text-slate-800 text-[15px]">2,850.00</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
