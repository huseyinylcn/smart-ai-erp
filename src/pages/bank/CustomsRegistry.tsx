import { useState } from 'react';
import { 
  Ship, Search, Plus, MoreVertical, 
  MapPin, Calendar, FileText, 
  Download, ArrowLeftRight, CreditCard,
  Anchor, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomsRegistry = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const customsAccounts: any[] = [];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Xəzinə / Gömrük Depozitləri</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Gömrük Depozitləri</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic underline decoration-amber-500/10 underline-offset-4 tracking-tight">İdxal/İxrac rüsumları və ƏDV-nin rəsmiləşdirilməsi üçün depozit vəsaitləri</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100 dark:border-slate-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-8 py-3.5 bg-amber-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-amber-500/20 active:scale-95 italic text-shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Yeni Depozit Hesabı</span>
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS (Placeholders for logic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 dark:bg-amber-900/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-all"></div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                      <Wallet className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Ümumi Gömrük Balansı</p>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase italic tabular-nums">0.00 <span className="text-sm">₼</span></h2>
              </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-all"></div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                      <ArrowLeftRight className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Cari Ayda Transferlər</p>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase italic tabular-nums">0.00 <span className="text-sm">₼</span></h2>
              </div>
          </div>

          <button className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2.5rem] shadow-xl shadow-amber-500/20 flex flex-col items-center justify-center space-y-4 hover:scale-105 transition-all text-white active:scale-95 group">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <ArrowLeftRight className="w-7 h-7" />
              </div>
              <div className="text-center">
                  <p className="text-base font-black uppercase italic tracking-tight">Depoziti Artır</p>
                  <p className="text-[10px] font-bold uppercase opacity-80 italic">Bank və ya ƏDV Depozitindən</p>
              </div>
          </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Gömrük idarəsi və ya Hesab adı ilə axtarış..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[13px] focus:ring-2 focus:ring-amber-500/20 placeholder-slate-400 transition-all outline-none font-bold italic"
            />
         </div>
      </div>

      {/* EMPTY STATE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-24 shadow-sm text-center">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Anchor className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic mb-2 tracking-tight">Gömrük Depozit Hesabı Tapılmadı</h3>
          <p className="text-slate-400 font-bold italic uppercase text-[11px] tracking-[0.2em] mb-10">Bəyannamələrin rəsmiləşdirilməsi üçün gömrük depozit hesabı əlavə edilməyib</p>
          <button className="inline-flex items-center space-x-3 px-10 py-5 bg-amber-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-amber-500/20 active:scale-95 italic">
              <Plus className="w-5 h-5" />
              <span>Yeni Gömrük Hesabı</span>
          </button>
      </div>

    </div>
  );
};

export default CustomsRegistry;
