import { useState, useEffect, useMemo } from 'react';
import { 
  Landmark, Wallet, History, RefreshCw, Plus, TrendingUp, TrendingDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../utils/api';
import { useCompany } from '../context/CompanyContext';

interface BankAccount {
  id: string;
  name: string;
  code: string;
  currency: string;
  balance: number;
}

interface Transaction {
  id: string;
  date: string;
  docNumber: string;
  type: string;
  accountId: string;
  counterparty: string;
  memo: string;
  currency: string;
  amount: number;
  status: 'DRAFT' | 'APPROVED' | 'POSTED' | 'CANCELLED';
}

const Bank = () => {
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!activeCompany) return;
    setLoading(true);
    try {
      const [accRes, txRes] = await Promise.all([
        financeApi.getAccounts(activeCompany.id),
        financeApi.getTransactions({ limit: 10 }, activeCompany.id)
      ]);
      
      setAccounts(accRes.data || []);
      setTransactions(txRes.data || []);
      
    } catch (error: any) {
      console.error("Xəzinə məlumatları yüklənərkən xəta:", error);
      if (error.message.includes('Failed to fetch')) {
          // Mock data for TENGRY SUPPLY or dev
          const mockAccs: BankAccount[] = [
            { id: 'a1', name: 'Pasha Bank (AZN)', code: '223.01', currency: 'AZN', balance: 25450.75 },
            { id: 'a2', name: 'Kapital Bank (USD)', code: '223.02', currency: 'USD', balance: 12400.00 },
            { id: 'a3', name: 'Əsas Kassa (AZN)', code: '221.01', currency: 'AZN', balance: 5200.00 },
            { id: 'a4', name: 'Xarici Valyuta Kassası (EUR)', code: '221.02', currency: 'EUR', balance: 850.00 },
          ];
          setAccounts(mockAccs);
          
          setTransactions([
            { id: 't1', date: '2026-04-27', docNumber: 'MAD-2026-1001', type: 'INBOUND', accountId: 'a1', counterparty: 'Altes Group MMC', memo: 'Xidmət haqqı', currency: 'AZN', amount: 5000, status: 'POSTED' },
            { id: 't2', date: '2026-04-26', docNumber: 'MAX-2026-2005', type: 'OUTBOUND', accountId: 'a1', counterparty: 'Azersu ASC', memo: 'Kommunal ödəniş', currency: 'AZN', amount: 120, status: 'POSTED' },
            { id: 't3', date: '2026-04-25', docNumber: 'TRF-2026-3002', type: 'TRANSFER', accountId: 'a1', counterparty: 'Pasha -> Kapital', memo: 'Daxili transfer', currency: 'AZN', amount: 2000, status: 'POSTED' },
          ] as any);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCompany?.id]);

  const summary = useMemo(() => {
    const bank = accounts.filter(a => a.code.startsWith('223')).reduce((sum, a) => sum + (a.currency === 'AZN' ? a.balance : 0), 0);
    const cash = accounts.filter(a => a.code.startsWith('221')).reduce((sum, a) => sum + (a.currency === 'AZN' ? a.balance : 0), 0);
    const fxCount = accounts.filter(a => a.currency !== 'AZN').length;
    const fxBalance = accounts.filter(a => a.currency !== 'AZN').reduce((sum, a) => sum + a.balance, 0); // Combined for simplicity in summary
    
    return { bank, cash, fxCount, fxBalance };
  }, [accounts]);

  const getStatusStyle = (status: Transaction['status']) => {
    switch (status) {
      case 'POSTED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'APPROVED': return 'bg-primary-50 text-primary-600 border-primary-100';
      case 'DRAFT': return 'bg-slate-50 text-slate-500 border-slate-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 max-w-[90rem] mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center">
            <Landmark className="w-8 h-8 mr-3 text-primary-500" />
            Xəzinə
          </h2>
          <p className="text-slate-500 text-[14px] mt-1 font-semibold ml-11 italic uppercase tracking-widest opacity-70">Hesablar arası hərəkət və mədaxil/məxaric</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
             onClick={() => navigate('/bank/transfers?mode=EXCHANGE')}
             className="flex items-center px-6 py-3 bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none text-[10px] font-black uppercase tracking-widest transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> VALYUTA KONVERTASİYASI
          </button>
          <button 
             onClick={() => navigate('/bank/transactions/create?mode=INBOUND')}
             className="flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none text-[10px] font-black uppercase tracking-widest transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" /> DAXİLOLMA
          </button>
          <button 
             onClick={() => navigate('/bank/transactions/create?mode=OUTBOUND')}
             className="flex items-center px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-xl shadow-rose-200 dark:shadow-none text-[10px] font-black uppercase tracking-widest transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" /> MƏXARİC
          </button>
          <button 
             onClick={() => navigate('/bank/transfers?mode=TRANSFER')}
             className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none text-[10px] font-black uppercase tracking-widest transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> TRANSFER
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Bank Balansı', amount: summary.bank.toLocaleString(), currency: '₼', icon: Landmark, color: 'primary' },
          { label: 'Kassa Balansı', amount: summary.cash.toLocaleString(), currency: '₼', icon: Wallet, color: 'emerald' },
          { label: 'Valyuta Hesabları', amount: summary.fxBalance.toLocaleString(), currency: 'Mixed', icon: RefreshCw, color: 'indigo' },
          { label: 'Aktiv Valyutalar', amount: summary.fxCount.toString(), currency: 'Types', icon: History, color: 'slate' }
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-50 dark:border-slate-800 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3 italic">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-baseline tracking-tighter italic">
                {card.amount} <span className="ml-1 text-sm text-slate-400 font-bold">{card.currency}</span>
              </h3>
            </div>
            <card.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-100 dark:text-slate-800 group-hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-3 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-50 dark:border-slate-800 p-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-6">Maliyyə Hesabları</h3>
                  <div className="space-y-2">
                      {accounts.length > 0 ? accounts.map(account => (
                          <button key={account.id} onClick={() => setActiveAccount(account.id)} className={`w-full text-left p-4 rounded-2xl transition-all ${activeAccount === account.id ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-100' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                              <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-black uppercase text-slate-800 dark:text-white italic tracking-tight truncate mr-2">{account.name}</span>
                                  <span className="text-[10px] font-black text-primary-500">{account.currency}</span>
                              </div>
                              <div className="text-sm font-black text-slate-500 italic tabular-nums">
                                  {account.balance.toLocaleString()} {account.currency === 'AZN' ? '₼' : account.currency}
                              </div>
                          </button>
                      )) : (
                          <div className="p-10 text-center border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-3xl">
                              {loading ? <RefreshCw className="w-8 h-8 text-indigo-500 mx-auto animate-spin" /> : <Wallet className="w-8 h-8 text-slate-100 mx-auto mb-3" />}
                              <p className="text-[9px] font-black text-slate-300 uppercase italic tracking-tighter">{loading ? 'Yüklənir...' : 'Hesab yoxdur'}</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          <div className="col-span-12 lg:col-span-9 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 overflow-hidden">
             <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic flex items-center">
                    <History className="w-4 h-4 mr-3 text-primary-500" /> Son Əməliyyatlar
                </h3>
             </div>
             <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <tr>
                        <th className="px-8 py-4">Tarix / Sənəd №</th>
                        <th className="px-4 py-4">Növ</th>
                        <th className="px-4 py-4">Qarşı Tərəf / Təyinat</th>
                        <th className="px-4 py-4 text-right">Məbləğ</th>
                        <th className="px-8 py-4 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {transactions.length > 0 ? transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-8 py-5">
                                <div className="text-xs font-black text-slate-800 dark:text-white italic">{tx.date}</div>
                                <div className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-1">{tx.docNumber}</div>
                            </td>
                            <td className="px-4 py-5">
                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest italic ${tx.type === 'INBOUND' ? 'bg-emerald-50 text-emerald-600' : tx.type === 'OUTBOUND' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                    {tx.type}
                                </span>
                            </td>
                            <td className="px-4 py-5 font-bold italic text-slate-700 dark:text-slate-300 text-xs">
                                {tx.counterparty}
                                <div className="text-[9px] font-medium opacity-50 truncate max-w-[200px]">{tx.memo}</div>
                            </td>
                            <td className={`px-4 py-5 text-right font-black italic text-sm tabular-nums ${tx.type === 'INBOUND' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {tx.amount.toLocaleString()} {tx.currency === 'AZN' ? '₼' : tx.currency}
                            </td>
                            <td className="px-8 py-5">
                                <span className={`flex items-center justify-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(tx.status)}`}>
                                    {tx.status}
                                </span>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="px-8 py-20 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <History className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">{loading ? 'Yüklənir...' : 'Hələ ki, heç bir əməliyyat daxil edilməyib'}</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
             </table>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Bank;
