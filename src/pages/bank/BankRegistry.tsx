import { useState } from 'react';
import { 
  Landmark, Search, Plus, MoreVertical, 
  Copy, ExternalLink, ShieldCheck,
  CreditCard, TrendingUp, Filter, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BankRegistry = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const accounts: any[] = [];

  const filteredAccounts = accounts.filter(acc => 
    acc.bank.toLowerCase().includes(searchTerm.toLowerCase()) || 
    acc.iban.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Xəzinə / Bank Hesabları</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">Bank Hesabları</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">Şirkətin aktiv bank hesabları, IBAN rekvizitləri və qalıqları</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all italic border border-slate-100 dark:border-slate-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
            <Plus className="w-4 h-4" />
            <span>Yeni Hesab</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Bank, Hesab və ya IBAN ilə axtarış..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[13px] focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 transition-all outline-none font-bold italic"
            />
         </div>
         <button className="flex items-center space-x-2 px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all italic">
            <Filter className="w-4 h-4" />
            <span>Filtrlər</span>
         </button>
      </div>

      {/* ACCOUNTS LIST */}
      {filteredAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAccounts.map((acc) => (
            <div key={acc.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-900/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:scale-150"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${acc.status === 'Aktiv' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                          <Landmark className="w-7 h-7" />
                      </div>
                      <div>
                          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">{acc.bank}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{acc.branch}</p>
                      </div>
                  </div>
                  <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic border ${acc.status === 'Aktiv' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                          {acc.status}
                      </span>
                      <button className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-400 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5" />
                      </button>
                  </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-5 mb-6">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-2">IBAN / HESAB REKVİZİTİ</p>
                  <div className="flex items-center justify-between">
                      <span className="text-md font-black italic tabular-nums tracking-tight text-slate-800 dark:text-white">{acc.iban}</span>
                      <button title="Kopyala" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                  <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Cari Balans</p>
                      <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-black text-slate-800 dark:text-white italic tabular-nums">{acc.balance}</span>
                          <span className="text-xs font-black text-indigo-500 italic">{acc.currency}</span>
                      </div>
                  </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1.5 text-slate-400">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">{acc.type}</span>
                      </div>
                  </div>
                  <button 
                    onClick={() => navigate('/bank/transactions')}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-black text-[10px] uppercase tracking-widest transition-all italic bg-indigo-50 px-4 py-2 rounded-xl"
                  >
                      <span>Çıxarış</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                  </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-24 shadow-sm text-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Landmark className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic mb-2 tracking-tight">Bank Hesabı Tapılmadı</h3>
            <p className="text-slate-400 font-bold italic uppercase text-[11px] tracking-[0.2em] mb-10">Zəhmət olmasa ilk bank hesabınızı əlavə edin</p>
            <button className="inline-flex items-center space-x-3 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 italic">
                <Plus className="w-5 h-5" />
                <span>Yeni Hesab Əlavə Et</span>
            </button>
        </div>
      )}

    </div>
  );
};

export default BankRegistry;
