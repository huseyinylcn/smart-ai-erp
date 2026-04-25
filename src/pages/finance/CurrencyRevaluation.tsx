import { useState } from 'react';
import { 
  ArrowLeft, RefreshCw,
  Landmark, 
  Users, Briefcase, TrendingUp, TrendingDown,
  AlertTriangle, Info,
  ChevronRight, ShieldCheck, Calendar, Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import JournalPreviewModal from '../../components/JournalPreviewModal';

const CurrencyRevaluation = () => {
  const navigate = useNavigate();
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [revalDate, setRevalDate] = useState('2024-03-31');
  
  // Revaluation Items
  const [items] = useState([
    { id: 1, type: 'BANK', name: 'Pasha Bank (USD)', currency: 'USD', balance: 12500, oldAzn: 21250.00, newRate: 1.7015, newAzn: 21268.75, diff: 18.75 },
    { id: 2, type: 'AR', name: 'Global Logistics MMC', currency: 'USD', balance: 5000, oldAzn: 8500.00, newRate: 1.7015, newAzn: 8507.50, diff: 7.50 },
    { id: 3, type: 'AP', name: 'Tech Supply Co.', currency: 'EUR', balance: 8000, oldAzn: 14648.00, newRate: 1.8342, newAzn: 14673.60, diff: -25.60 },
  ]);

  const totalGain = items.filter(i => i.diff > 0).reduce((sum, i) => sum + i.diff, 0);
  const totalLoss = items.filter(i => i.diff < 0).reduce((sum, i) => sum + Math.abs(i.diff), 0);
  const netImpact = totalGain - totalLoss;

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4 sticky top-0 z-40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Ay Bağlanışı: Yenidən Qiymətləndirmə</h1>
                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 italic">IAS 21 Revaluation</span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 italic">Valyuta qalıqları üzrə unrealized kurs fərqlərinin hesablanması</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-100 dark:border-slate-700">
                <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                <input type="date" value={revalDate} onChange={(e) => setRevalDate(e.target.value)} className="bg-transparent border-none text-xs font-black italic outline-none text-slate-800 dark:text-white" />
            </div>
            <button 
              onClick={() => setIsJournalVisible(true)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
            >
                <Calculator className="w-4 h-4 shadow-inner" />
                <span>Müxabirləşmə</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Qalıqları Yenilə</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* MAIN PANEL */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* 1. Summary Dashboard for current Reval session */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-2 leading-none">Toplam Artım (Unrealized Gain)</p>
                    <h2 className="text-2xl font-black text-emerald-600 italic tracking-tighter">₼ {totalGain.toFixed(2)}</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-2 leading-none">Toplam Azalma (Unrealized Loss)</p>
                    <h2 className="text-2xl font-black text-rose-600 italic tracking-tighter">₼ {totalLoss.toFixed(2)}</h2>
                </div>
                <div className={`p-6 rounded-[2rem] shadow-sm flex flex-col justify-center ${netImpact >= 0 ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
                    <p className="text-[9px] font-black text-white/70 uppercase tracking-widest italic mb-2 leading-none">Xalis Dönəm Təsiri (Net Impact)</p>
                    <h2 className="text-2xl font-black italic tracking-tighter">₼ {netImpact.toFixed(2)}</h2>
                </div>
            </div>

            {/* 2. Revaluation Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center italic">
                        <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" /> Detallı Yenidən Qiymətləndirmə Siyahısı
                    </h3>
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase italic">
                        <ShieldCheck className="w-3.5 h-3.5" /> AMB rəsmi kursları tətbiq olunub
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                    <table className="w-full text-left text-xs font-bold italic tabular-nums italic grow">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5">Təsnifat / Aktiv</th>
                                <th className="px-6 py-5">Valyuta Balansı</th>
                                <th className="px-6 py-5 text-right">Uçot Dəyəri (AZN)</th>
                                <th className="px-6 py-5 text-center">Kurs (Yeni)</th>
                                <th className="px-6 py-5 text-right">Yeni Dəyər (AZN)</th>
                                <th className="px-8 py-5 text-right">Differensial (FX)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {items.map(t => (
                              <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                  <td className="px-8 py-6">
                                      <div className="flex items-center space-x-3">
                                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                            t.type === 'BANK' ? 'bg-indigo-50 text-indigo-600' : 
                                            t.type === 'AR' ? 'bg-emerald-50 text-emerald-600' : 
                                            'bg-rose-50 text-rose-600'
                                          }`}>
                                              {t.type === 'BANK' && <Landmark className="w-4 h-4" />}
                                              {t.type === 'AR' && <Users className="w-4 h-4" />}
                                              {t.type === 'AP' && <Briefcase className="w-4 h-4" />}
                                          </div>
                                          <div>
                                              <p className="text-[13px] font-black text-slate-800 dark:text-white leading-tight italic">{t.name}</p>
                                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-80">{t.type}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-6 font-black text-indigo-600 uppercase tracking-widest italic">{t.balance.toLocaleString()} {t.currency}</td>
                                  <td className="px-6 py-6 text-right font-black italic tracking-tighter tabular-nums text-slate-500">{t.oldAzn.toFixed(2)}</td>
                                  <td className="px-6 py-6 text-center font-black text-slate-800 dark:text-white">{t.newRate.toFixed(4)}</td>
                                  <td className="px-6 py-6 text-right font-black italic tracking-tighter tabular-nums text-slate-800 dark:text-white">{t.newAzn.toFixed(2)}</td>
                                  <td className="px-8 py-6 text-right font-black text-sm italic tracking-tighter tabular-nums">
                                      {t.diff > 0 ? (
                                          <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">+ {t.diff.toFixed(2)} AZN</span>
                                      ) : (
                                          <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">{t.diff.toFixed(2)} AZN</span>
                                      )}
                                  </td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                   <div className="flex items-center space-x-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight italic">
                        <strong>Vacib Qeyd:</strong> Bu əməliyyat bütün monetar hesab qalıqlarını son AMB kursuna uyğun olaraq "Unrealized FX Gain/Loss" hesabına post edəcəkdir. Bu əməliyyat yalnız period bağlanışında icra edilməlidir.
                      </p>
                   </div>
                </div>
            </div>
        </div>

        {/* SIDEBAR POSTING PREVIEW */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 italic">Müxabirləşmə Preview</h3>
                
                <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 space-y-2">
                        <p className="text-[8px] font-black text-indigo-400 uppercase italic">Debet (+ Asset / - Liability)</p>
                        <p className="text-xs font-black italic">Bank / Debitor Hesabları</p>
                        <p className="text-lg font-black italic text-emerald-400">+ 26.25 AZN</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 space-y-2">
                        <p className="text-[8px] font-black text-rose-400 uppercase italic">Kredit (- Cash / Asset)</p>
                        <p className="text-xs font-black italic">Təchizatçı Hesabları</p>
                        <p className="text-lg font-black italic text-rose-400">- 25.60 AZN</p>
                    </div>
                    <div className="p-4 bg-emerald-600 rounded-2xl space-y-2 shadow-lg shadow-emerald-600/20">
                        <p className="text-[8px] font-black text-white/70 uppercase italic">Nəticə: Kurs Gəliri (G/L)</p>
                        <p className="text-xs font-black italic">Unrealized FX Gain Account</p>
                        <p className="text-xl font-black italic text-white">+ 0.65 AZN</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <p className="text-[8px] font-bold text-slate-500 leading-tight uppercase tracking-wide italic">
                        Təsdiq edildikdən sonra <strong>Maliyyə İlinin Bağlanışı</strong> üçün jurnal qeydi yaradılacaqdır.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center space-x-3 text-indigo-600 mb-4">
                    <Info className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">IAS 21 Qaydaları</span>
                </div>
                <p className="text-[9px] font-black text-slate-500 uppercase italic leading-relaxed">
                   Beynəlxalq Mühasibat Standartı 21-ə əsasən, xarici valyuta ilə olan monetar maddələr hesabat tarixinin bağlanış məzənnəsi ilə yenidən qiymətləndirilməlidir.
                </p>
            </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-[70px] lg:left-[260px] right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end items-center z-40 shadow-2xl h-[90px] transition-all">
          <div className="flex items-center space-x-3 px-4">
              <button onClick={() => navigate(-1)} className="px-8 py-2.5 text-slate-500 font-black text-xs uppercase tracking-widest italic">Ləğv Et</button>
              <button onClick={() => setCurrentStatus('POSTED')} className="px-16 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center space-x-3 leading-none italic shadow-inner">
                 <RefreshCw className="w-5 h-5" />
                 <span>Bağlanışı Təsdiqlə</span>
              </button>
          </div>
      </div>
      
      <JournalPreviewModal 
        isOpen={isJournalVisible} 
        onClose={() => setIsJournalVisible(false)} 
        periodClosed={false} 
        isAdmin={true}
        initialLines={items.map((item) => ({
            id: item.id.toString(),
            accountCode: item.type === 'BANK' ? '223' : item.type === 'AR' ? '171' : '531',
            accountName: item.name,
            description: `Yenidən qiymətləndirmə (Kurs: ${item.newRate})`,
            debit: item.diff > 0 ? item.diff : 0,
            credit: item.diff < 0 ? Math.abs(item.diff) : 0
        }))}
      />
    </div>
  );
};

export default CurrencyRevaluation;
