import { useState, useEffect } from 'react';
import { 
  Plus, Search, 
  FileText, Calendar, 
  User,
  Filter,
  Eye,
  MoreVertical,
  Loader2,
  Trash2,
  X,
  UserMinus,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';

const TerminationRegistry = () => {
  const navigate = useNavigate();
  const { 
    isContentFullscreen, 
    setIsContentFullscreen,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    setFilterSidebarContent
  } = useOutletContext<any>();
  const { activeCompany } = useCompany();
  const { formatDate, formatNumber } = useFormat();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOrders = async () => {
    if (!activeCompany) return;
    try {
      setIsLoading(true);
      const res = await hrApi.getTerminationOrders(activeCompany.id);
      setOrders(Array.isArray(res) ? res : (res?.data || []));
    } catch (error) {
      console.error('FETCH_TERMINATIONS_ERROR:', error);
      // Mock data for UI development if API fails
      setOrders([
        {
          id: '1',
          docNumber: 'DOC-TERM-2024-0012',
          docDate: '2024-04-11',
          terminationDate: '2024-04-12',
          employee: { fullName: 'Ali Aliyev', position: 'Manager' },
          reasonCode: '68-2-a',
          status: 'POSTED',
          compensationAmount: 1250.50
        },
        {
          id: '2',
          docNumber: 'DOC-TERM-2024-0013',
          docDate: '2024-04-10',
          terminationDate: '2024-04-15',
          employee: { fullName: 'Veli Veliyev', position: 'Specialist' },
          reasonCode: '69',
          status: 'DRAFT',
          compensationAmount: 0
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeCompany]);

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.docNumber?.toLowerCase().includes(searchLower) ||
      order.employee?.fullName?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id: string, docNum: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`${docNum} nömrəli əmri silmək istədiyinizə əminsiniz?`)) return;

    setIsDeleting(true);
    try {
      if (!activeCompany) return;
      await hrApi.deleteTerminationOrder(id, activeCompany.id);
      fetchOrders();
    } catch (error) {
      alert("Silmə zamanı xəta baş verdi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic flex items-center leading-none">
            <UserMinus className="w-7 h-7 mr-3 text-rose-500" />
            İşdən Azad Etmə (Xitam) Reyestri
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 ml-10 italic">Xaric olan əməkdaşların rəsmi əmr siyahısı</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/hr/termination/create')}
            className="flex items-center justify-center space-x-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-rose-600/20 transition-all hover:scale-105 active:scale-95 leading-none"
          >
            <Plus className="w-5 h-5 leading-none" />
            <span>Yeni Xitam əmri</span>
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
          <input 
            type="text" 
            placeholder="ƏMR NO VƏ YA ƏMƏKDAŞ ÜZRƏ AXTARIŞ..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 pl-14 pr-6 text-xs font-black italic shadow-inner outline-none transition-all uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-slate-100 transition-all border border-transparent">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-full flex flex-col">
        <div className="overflow-x-auto flex-1 h-full custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sənəd No</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tarix</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Əməkdaş</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Xitam Tarixi</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Səbəb</th>
                <th className="px-6 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Kompensasiya</th>
                <th className="px-6 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 text-rose-500 animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Məlumatlar yüklənir...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Xitam əmri tapılmadı</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic">{order.docNumber}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase italic">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-rose-400" />
                        {formatDate(order.docDate)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center text-[10px] font-black mr-3 shadow-sm italic">
                          {order.employee?.fullName?.split(' ').map((n: any) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic leading-none">{order.employee?.fullName}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase italic mt-1">{order.employee?.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-[10px] font-black text-rose-600 uppercase italic">{formatDate(order.terminationDate)}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase italic tracking-tighter shadow-sm border border-slate-200/50 dark:border-slate-700">
                        Maddə {order.reasonCode}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <span className="text-[11px] font-black text-rose-600 italic">
                        {order.compensationAmount > 0 ? `${formatNumber(order.compensationAmount, 2)} AZN` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase italic tracking-widest shadow-sm leading-none ${
                        order.status === 'POSTED' 
                          ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' 
                          : 'bg-amber-50 text-amber-600 shadow-amber-500/10'
                      }`}>
                        {order.status === 'POSTED' ? 'TƏSDİQLƏNİB' : 'QARALAMA'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2.5 bg-white dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm border border-slate-100 dark:border-slate-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(order.id, order.docNumber, e)}
                          className="p-2.5 bg-white dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm border border-slate-100 dark:border-slate-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER / PAGINATION */}
        <div className="bg-slate-50/50 dark:bg-slate-800/30 px-8 py-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 leading-none">
          <div className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">
            CƏMİ: <span className="text-slate-800 dark:text-white">{filteredOrders.length} ƏMR</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-black italic uppercase">
             {/* Simple Pagination Placeholder */}
             <span className="text-slate-400 mr-4">Səhifə 1 / 1</span>
             <button disabled className="p-2 bg-white dark:bg-slate-800 text-slate-300 rounded-lg opacity-50"><RotateCcw className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminationRegistry;
