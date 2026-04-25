import { useState } from 'react';
import { 
  ArrowLeft, Building2, User, MapPin, 
  Settings, History, Calculator, TrendingUp,
  ShieldCheck, FileText, Wrench, Trash2,
  Calendar, MoreVertical, Plus, Info,
  Percent, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const AssetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const asset = {
    id: 1,
    name: 'Toyota Prius 2024 (Eco-Fleet)',
    code: 'FA-TRN-089',
    category: 'Nəqliyyat vasitələri',
    status: 'ACTIVE',
    custodian: 'Elvin Məmmədov',
    department: 'Loqistika və Təchizat',
    location: 'Bakı Baş Ofis',
    acquiredDate: '2024-03-01',
    cost: 53750,
    bookValue: 51240,
    depreciationAccrued: 2510,
    usefulLife: 60,
    remainingLife: 58,
  };

  const history = [
    { id: 1, date: '2024-03-01', type: 'PURCHASE', desc: 'Aktivin alınması', amount: 53750, user: 'Admin' },
    { id: 2, date: '2024-03-05', type: 'COMMISSIONING', desc: 'İstismara verilmə və Elvin M. təhkimat', amount: 0, user: 'Admin' },
    { id: 3, date: '2024-04-01', type: 'DEPRECIATION', desc: 'Aylıq amortizasiya hesabı', amount: -895.83, user: 'System' },
    { id: 4, date: '2024-05-01', type: 'DEPRECIATION', desc: 'Aylıq amortizasiya hesabı', amount: -895.83, user: 'System' },
  ];

  return (
    <div className="flex flex-col min-h-full space-y-8 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/assets')} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-primary-50 transition-all text-slate-400">
              <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-md text-[10px] font-black uppercase tracking-widest italic">{asset.category}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{asset.code}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">{asset.name}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 rounded-xl hover:text-red-500 transition-all">
             <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 rounded-xl hover:text-primary-500 transition-all">
             <Wrench className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95">
            <Plus className="w-4 h-4" />
            <span>Əməliyyat Əlavə Et</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* LEFT: MAIN CONTENT */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* TABS */}
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 px-2 italic-none">
                {['overview', 'depreciation', 'history', 'documents'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab === 'overview' ? 'Ümumi Baxış' : 
                         tab === 'depreciation' ? 'Amortizasiya / Uçot' : 
                         tab === 'history' ? 'Əməliyyatlar' : 'Sənədlər'}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full shadow-[0_-4px_12px_rgba(37,99,235,0.4)]"></div>}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* STATS GRID */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Maya Dəyəri</h4>
                            <p className="text-xl font-black italic tabular-nums">₼ {asset.cost.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic text-emerald-500">Qalıq Dəyəri</h4>
                            <p className="text-xl font-black italic tabular-nums text-emerald-500">₼ {asset.bookValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic text-orange-500">Amortizasiya</h4>
                            <p className="text-xl font-black italic tabular-nums text-orange-500">₼ {asset.depreciationAccrued.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* DETAILS CARD */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-10 shadow-sm shadow-2xl shadow-primary-500/5">
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                    <User className="w-4 h-4 mr-2" /> Mülkiyyət və Təhkimat (HR)
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-xl shadow-primary-600/20">EM</div>
                                        <div>
                                            <div className="text-[13px] font-black italic text-slate-800 dark:text-white leading-tight">{asset.custodian}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase italic mt-0.5">{asset.department}</div>
                                        </div>
                                        <button className="ml-auto p-2 text-slate-300 hover:text-primary-500 transition-colors">
                                           <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-3 px-2">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400">Cari yerləşmə: <span className="text-slate-800 dark:text-white italic">{asset.location}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                    <Calendar className="w-4 h-4 mr-2" /> Həyat Döngüsü
                                </h3>
                                <div className="space-y-6">
                                    <div className="relative pt-2">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase italic">İstifadə müddəti</span>
                                            <span className="text-[12px] font-black italic">{asset.remainingLife} / {asset.usefulLife} ay qalıb</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                                            <div className="h-full bg-primary-500 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]" style={{ width: `${(asset.remainingLife / asset.usefulLife) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] font-bold px-2">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-slate-500 italic">01.03.2024 Start</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                            <span className="text-slate-400 italic">01.03.2029 End</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm shadow-2xl shadow-primary-500/5 animate-in slide-in-from-bottom-4 duration-500 italic-none">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 uppercase italic tracking-tighter">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Tarix</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Əməliyyat</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Məbləğ (₼)</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">İstifadəçi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {history.map((h) => (
                                <tr key={h.id} className="hover:bg-primary-50/20 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="text-[12px] font-black italic text-slate-500">{h.date}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-[13px] font-black italic text-slate-700 dark:text-slate-200">{h.desc}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase italic mt-0.5 tracking-widest">{h.type}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[13px] font-black italic tabular-nums ${h.amount < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                            {h.amount !== 0 ? h.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <User className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic tracking-tighter">{h.user}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28 italic-none shadow-2xl shadow-primary-500/5">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden italic-none shadow-2xl shadow-primary-500/10">
                <div className="relative z-10 space-y-8">
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-primary-400 mb-6 italic tracking-widest">Uçot Proyeksiya</h3>
                        <div className="space-y-5">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4 shadow-2xl shadow-primary-500/10">
                                <span className="text-[10px] font-black text-white/40 uppercase italic">Vergi Metodu</span>
                                <span className="text-sm font-black italic">Qalıq Dəyəri (25%)</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-[10px] font-black text-white/40 uppercase italic">Maliyyə Metodu</span>
                                <span className="text-sm font-black italic text-emerald-400">Düz xətt (60 ay)</span>
                            </div>
                            <div className="flex justify-between items-end pt-4">
                                <span className="text-[10px] font-black text-primary-400 uppercase italic">Aylıq Gider (IFRS)</span>
                                <span className="text-2xl font-black italic tabular-nums text-emerald-400">₼ 895.83</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Calculator className="absolute bottom-[-30px] right-[-30px] w-48 h-48 text-white/5 rotate-[-15deg] pointer-events-none" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6 shadow-sm shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Sürətli Əməliyyatlar</h3>
                <div className="grid grid-cols-2 gap-3 shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5">
                    <button className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-primary-50 transition-all group">
                        <Wrench className="w-5 h-5 text-slate-400 group-hover:text-primary-600 mb-2 shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5" />
                        <span className="text-[9px] font-black uppercase text-slate-500 italic shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5">Təmir</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-primary-50 transition-all group shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5">
                        <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 mb-2 shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5" />
                        <span className="text-[9px] font-black uppercase text-slate-500 italic shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5 italic tracking-tighter">Qiymət.</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-primary-50 transition-all group">
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 mb-2 shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5 italic tracking-tighter" />
                        <span className="text-[9px] font-black uppercase text-slate-500 italic shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5 italic tracking-tighter">Köçürülmə</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl hover:bg-red-100 transition-all group">
                        <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-600 mb-2 shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5 italic tracking-tighter" />
                        <span className="text-[9px] font-black uppercase text-red-500 italic shadow-2xl shadow-primary-500/10 shadow-2xl shadow-emerald-500/5 italic tracking-tighter">Silinmə</span>
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AssetDetail;
