import { useState } from 'react';
import { 
  Box, Search, Filter, Plus, 
  ArrowRightLeft, User, MapPin, 
  Trash2, MoreVertical, ShieldCheck,
  TrendingDown, Package, Clock, AlertTriangle,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const lvaData = [
  { 
    id: 1, 
    name: 'Xüsusi Geyim (Mühafizə)', 
    category: 'Xüsusi geyim', 
    code: 'LVA-CLH-001',
    cost: 120.00, 
    bookValue: 0.00, 
    status: 'ISSUED', 
    custodian: 'Kamran Bağırov',
    location: 'Şimal Filialı',
    issuedDate: '2024-01-15',
    method: '100% EXPENSE'
  },
  { 
    id: 2, 
    name: 'Ofis Kreslosu (Ergonomik)', 
    category: 'Ofis inventarı', 
    code: 'LVA-OFF-082',
    cost: 350.00, 
    bookValue: 240.00, 
    status: 'ISSUED', 
    custodian: 'Aytən Məmmədova',
    location: 'Bakı Baş Ofis',
    issuedDate: '2023-11-20',
    method: 'STRAIGHT-LINE'
  },
  { 
    id: 3, 
    name: 'Bosch Perfomance Tool Set', 
    category: 'İstehsalat alətləri', 
    code: 'LVA-TL-009',
    cost: 480.00, 
    bookValue: 480.00, 
    status: 'IN-STOCK', 
    custodian: 'Anbar (Mərkəzi)',
    location: 'Mərkəzi Anbar',
    issuedDate: '-',
    method: 'PENDING'
  },
  { 
    id: 4, 
    name: 'Fərdi Mühafizə Kaskası', 
    category: 'Fərdi mühafizə vasitələri', 
    code: 'LVA-PPE-044',
    cost: 45.00, 
    bookValue: 0.00, 
    status: 'EXPIRED', 
    custodian: 'Zaur Əliyev',
    location: 'Yataq sahəsi A',
    issuedDate: '2023-06-10',
    method: '100% EXPENSE'
  },
];

const LvaList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-full space-y-8 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">ATƏ Reyestri (Low-Value Assets)</h1>
          <p className="text-sm font-medium text-slate-500 mt-1 italic tracking-tight">Azqiymətli və Tezköhnələn əşyaların inventarizasiyası və uçotu</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/lva/categories')} className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
             <Filter className="w-4 h-4" />
             <span>Qaydalar</span>
          </button>
          <button onClick={() => navigate('/lva/purchase/create')} className="flex items-center space-x-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95">
            <Plus className="w-4 h-4" />
            <span>Yeni ATƏ Alınışı</span>
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                    <Package className="w-5 h-5" />
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic tracking-tighter">Ümumi Say</h4>
                <p className="text-2xl font-black italic tabular-nums">785 <span className="text-xs text-slate-400 opacity-60">ƏDƏD</span></p>
            </div>
            <Box className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 dark:text-slate-800/20 rotate-[-15deg] group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <User className="w-5 h-5" />
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic tracking-tighter">İstifadədə Olan</h4>
                <p className="text-2xl font-black italic tabular-nums text-emerald-500">642 <span className="text-xs text-slate-400 opacity-60">ƏDƏD</span></p>
            </div>
            <ArrowRightLeft className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 dark:text-slate-800/20 rotate-[-15deg] group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center mb-4">
                    <Trash2 className="w-5 h-5" />
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic tracking-tighter">Bu Ay Silinənlər</h4>
                <p className="text-2xl font-black italic tabular-nums text-red-500">18 <span className="text-xs text-slate-400 opacity-60">ƏDƏD</span></p>
            </div>
            <TrendingDown className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 dark:text-slate-800/20 rotate-[-15deg] group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic tracking-tighter">Müddəti Bitmiş</h4>
                <p className="text-2xl font-black italic tabular-nums text-orange-500">34 <span className="text-xs text-slate-400 opacity-60">ƏDƏD</span></p>
            </div>
            <AlertTriangle className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 dark:text-slate-800/20 rotate-[-15deg] group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="ATƏ adı, inventar № və ya şöbə..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
              />
          </div>
          <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 font-bold text-xs uppercase italic tracking-widest hover:bg-slate-50 transition-all">
                  <Calendar className="w-4 h-4" />
                  <span>Tarix Aralığı</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 font-bold text-xs uppercase italic tracking-widest hover:bg-slate-50 transition-all shadow-inner">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audit keçmiş</span>
              </button>
          </div>
      </div>

      {/* LVA TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm shadow-2xl shadow-primary-500/5 italic-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800/50">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner">Əşya / Kateqoriya</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner">Təhvil Tarixi</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner">Məsul Şəxs</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner">Qalıq Dəyər</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter shadow-inner"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {lvaData.map((item) => (
                <tr key={item.id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-900/5 transition-all cursor-pointer shadow-inner">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all shadow-inner">
                          <Package className="w-5 h-5 stroke-[2.2px] shadow-inner" />
                       </div>
                       <div>
                          <div className="text-[13px] font-black italic text-slate-800 dark:text-white leading-tight underline decoration-primary-500/20 underline-offset-4">{item.name}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter italic shadow-inner">{item.code}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-[9px] font-black text-primary-500 uppercase italic tracking-tighter shadow-inner">{item.category}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[12px] font-bold text-slate-600 dark:text-slate-400 italic tabular-nums shadow-inner">
                    {item.issuedDate}
                  </td>
                  <td className="px-8 py-6 shadow-inner">
                    <div className="flex items-center space-x-2 shadow-inner">
                        <User className="w-3.5 h-3.5 text-slate-300 shadow-inner" />
                        <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 shadow-inner">{item.custodian}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 opacity-60 shadow-inner">
                        <MapPin className="w-3 h-3 text-slate-300 shadow-inner" />
                        <span className="text-[9px] font-medium text-slate-500 italic shadow-inner">{item.location}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 shadow-inner">
                    <div className="flex flex-col shadow-inner">
                        <span className="text-[13px] font-black italic tabular-nums text-slate-800 dark:text-white shadow-inner">₼ {item.bookValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase italic mt-1 shadow-inner tracking-tighter">{item.method}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center shadow-inner">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase italic tracking-widest ${item.status === 'ISSUED' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : item.status === 'EXPIRED' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                       <span className={`w-1.5 h-1.5 rounded-full mr-2 ${item.status === 'ISSUED' ? 'bg-emerald-500 animate-pulse' : item.status === 'EXPIRED' ? 'bg-orange-500' : 'bg-slate-400'}`}></span>
                       {item.status === 'ISSUED' ? 'İstifadədə' : item.status === 'EXPIRED' ? 'Müddəti bitib' : 'Anbarda'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right shadow-inner">
                    <button className="p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary-500 transition-all shadow-sm group-hover:shadow-md shadow-inner">
                       <MoreVertical className="w-5 h-5 shadow-inner" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase italic tracking-widest shadow-inner">
            <span>Görünür: 4 / 785</span>
            <div className="flex items-center space-x-2 shadow-inner">
                <button className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:text-primary-500 transition-all border border-slate-100 dark:border-slate-800 shadow-inner italic-none">Əvvəlki</button>
                <button className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:text-primary-500 transition-all border border-slate-100 dark:border-slate-800 shadow-inner italic-none">Növbəti</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LvaList;
