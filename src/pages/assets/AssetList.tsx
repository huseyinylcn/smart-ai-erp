import { useState } from 'react';
import { 
  Building2, Search, Filter, Plus, 
  ArrowUpRight, ArrowDownRight, 
  MoreVertical, Eye, Edit, Trash2,
  Calendar, User, MapPin, Calculator,
  TrendingUp, BarChart3, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const assetsData = [
  { 
    id: 1, 
    name: 'Toyota Prius 2023', 
    category: 'Nəqliyyat vasitələri', 
    code: 'FA-TRN-001',
    cost: 42000, 
    bookValue: 38500, 
    status: 'ACTIVE', 
    custodian: 'Elvin Məmmədov',
    location: 'Bakı Ofis',
    acquiredDate: '2023-05-15'
  },
  { 
    id: 2, 
    name: 'DELL PowerEdge Server', 
    category: 'Hesablama texnikası', 
    code: 'FA-IT-004',
    cost: 12500, 
    bookValue: 9200, 
    status: 'ACTIVE', 
    custodian: 'Nigar Əliyeva',
    location: 'Server Otağı',
    acquiredDate: '2024-01-10'
  },
  { 
    id: 3, 
    name: 'Bakı Biznes Mərkəzi - Ofis A', 
    category: 'Binalar və tikililər', 
    code: 'FA-BLD-012',
    cost: 850000, 
    bookValue: 832000, 
    status: 'ACTIVE', 
    custodian: 'Şirkət Balansı',
    location: 'Xətai ray.',
    acquiredDate: '2020-11-20'
  },
  { 
    id: 4, 
    name: 'Caterpillar Generator', 
    category: 'Maşın və avadanlıq', 
    code: 'FA-MAC-009',
    cost: 28000, 
    bookValue: 28000, 
    status: 'DRAFT', 
    custodian: 'Təyin edilməyib',
    location: 'Anbar (Abşeron)',
    acquiredDate: '2026-03-15'
  },
];

const AssetList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-full space-y-8 animate-in fade-in duration-500 pb-12 text-slate-900 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Əsas Vəsaitlərin Reyestri</h1>
          <p className="text-sm font-medium text-slate-500 mt-1 italic">Şirkət üzrə bütün aktivlərin idarə olunması və monitorinqi</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/assets/categories')} className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
             <Calculator className="w-4 h-4" />
             <span>Kateqoriyalar</span>
          </button>
          <button onClick={() => navigate('/assets/purchase/create')} className="flex items-center space-x-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95">
            <Plus className="w-4 h-4" />
            <span>Yeni ƏV Alınışı</span>
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm shadow-2xl shadow-primary-500/5 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center">
                        <Database className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg italic">+12 BU AY</span>
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Cəmi Aktivlər</h4>
                <p className="text-2xl font-black italic tracking-tighter tabular-nums">₼ 1,240,500.00</p>
            </div>
            <TrendingUp className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 dark:text-slate-800/20 rotate-[-15deg] group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm shadow-2xl shadow-primary-500/5 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center">
                        <Calculator className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 italic">IFRS / TAX</span>
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Aylıq Amortizasiya</h4>
                <p className="text-2xl font-black italic tracking-tighter tabular-nums text-orange-600">₼ 14,230.50</p>
            </div>
            <BarChart3 className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 dark:text-slate-800/20 rotate-[-15deg] group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm shadow-2xl shadow-primary-500/5 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Cari Qalıq Dəyəri</h4>
                <p className="text-2xl font-black italic tracking-tighter tabular-nums text-emerald-600">₼ 932,150.00</p>
            </div>
            <ArrowUpRight className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 dark:text-slate-800/20 rotate-[-15deg] group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm shadow-2xl shadow-primary-500/5 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5" />
                    </div>
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Təhkim Olunub (HR)</h4>
                <p className="text-2xl font-black italic tracking-tighter tabular-nums">84 / 112</p>
            </div>
            <Building2 className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 dark:text-slate-800/20 rotate-[-15deg] group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Aktiv adı, kod və ya məsul şəxs ilə axtarın..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
              />
          </div>
          <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 font-bold text-xs uppercase italic tracking-widest hover:bg-slate-50 transition-all">
                  <Filter className="w-4 h-4" />
                  <span>Filtrlər</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 font-bold text-xs uppercase italic tracking-widest hover:bg-slate-50 transition-all">
                  <Calendar className="w-4 h-4" />
                  <span>Tarix</span>
              </button>
          </div>
      </div>

      {/* ASSET TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm shadow-2xl shadow-primary-500/5 italic-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800/50">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black italic text-slate-400 uppercase tracking-widest italic">Aktiv / Detallar</th>
                <th className="px-8 py-6 text-[10px] font-black italic text-slate-400 uppercase tracking-widest italic">Uçot Maya (₼)</th>
                <th className="px-8 py-6 text-[10px] font-black italic text-slate-400 uppercase tracking-widest italic">Qalıq Dəyər (₼)</th>
                <th className="px-8 py-6 text-[10px] font-black italic text-slate-400 uppercase tracking-widest italic">Məsul Şəxs</th>
                <th className="px-8 py-6 text-[10px] font-black italic text-slate-400 uppercase tracking-widest italic text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black italic text-slate-400 uppercase tracking-widest italic"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 italic-none">
              {assetsData.map((asset) => (
                <tr key={asset.id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-900/5 transition-all cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all shadow-inner">
                          <Building2 className="w-6 h-6 stroke-[2.2px]" />
                       </div>
                       <div>
                          <div className="text-[14px] font-black italic text-slate-800 dark:text-white leading-tight">{asset.name}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{asset.code}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-[10px] font-black text-primary-500 uppercase italic tracking-tighter">{asset.category}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 tabular-nums font-black italic text-slate-700 dark:text-slate-200">
                    {asset.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                        <span className="text-[13px] font-black italic text-emerald-500 tabular-nums">
                            {asset.bookValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <div className="flex items-center text-[10px] text-slate-400 font-bold mt-1">
                            <ArrowDownRight className="w-3 h-3 text-red-400 mr-1" />
                            8.4% amortizasiya
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400">{asset.custodian}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 opacity-60">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-medium text-slate-500">{asset.location}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest ${asset.status === 'ACTIVE' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                       <span className={`w-1.5 h-1.5 rounded-full mr-2 ${asset.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                       {asset.status === 'ACTIVE' ? 'İstifadədə' : 'Qaralama'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary-500 transition-all shadow-sm group-hover:shadow-md">
                       <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetList;
