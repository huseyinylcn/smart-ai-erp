import { useState } from 'react';
import { 
  Wallet, Search, Plus, MoreVertical, 
  User, MapPin, History, 
  ArrowRight, ShieldCheck, Activity,
  TrendingDown, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CashRegistry = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const cashes: any[] = [];

  const filteredCashes = cashes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Xəzinə / Kassa Reyestri</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Kassa Reyestri</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-emerald-500/10 underline-offset-4 tracking-tight">Fiziki kassaların qalıqları, məsul şəxslər və kassa limitləri</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 shadow-sm">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Axtarış..." 
              className="bg-transparent border-none outline-none text-sm font-bold w-48 placeholder-slate-400 italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 italic">
            <Plus className="w-4 h-4" />
            <span>Yeni Kassa</span>
          </button>
        </div>
      </div>

      {/* CASH CARDS GRID or EMPTY STATE */}
      {filteredCashes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCashes.map((cash, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-inner">
                        <Wallet className="w-7 h-7" />
                    </div>
                </div>
                {/* Simplified for now, will expand during details page implementation if needed */}
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-2">{cash.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase italic tracking-widest">{cash.manager}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-24 shadow-sm text-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Wallet className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic mb-2 tracking-tight">Kassa Tapılmadı</h3>
            <p className="text-slate-400 font-bold italic uppercase text-[11px] tracking-[0.2em] mb-10">Sistemdə heç bir fiziki kassa qeydiyyatı yoxdur</p>
            <button className="inline-flex items-center space-x-3 px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 italic">
                <Plus className="w-5 h-5" />
                <span>Yeni Kassa Əlavə Et</span>
            </button>
        </div>
      )}

    </div>
  );
};

export default CashRegistry;
