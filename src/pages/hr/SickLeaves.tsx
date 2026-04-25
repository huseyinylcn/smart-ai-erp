import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Calendar, User, FileText, 
  CheckCircle2, Loader2, ClipboardList, Briefcase,
  ChevronRight, ArrowRight, Download, Filter
} from 'lucide-react';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import { useNavigate } from 'react-router-dom';

interface SickLeave {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  docNumber: string | null; // Bülleten Nömrəsi & Seriyası
  status: string;
  employee: {
    fullName: string;
    position: string | null;
  };
  leaveType: {
    name: string;
    code: string;
  };
}

const SickLeaves = () => {
  const { activeCompany } = useCompany();
  const { formatDate } = useFormat();
  const companyId = activeCompany?.id || 'COM-001';
  const navigate = useNavigate();

  const [sickLeaves, setSickLeaves] = useState<SickLeave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      // We fetch all leaves but filter for SICK in frontend for now, 
      // or we can expect the backend to have a specific type.
      const data = await hrApi.getLeaveRequests(new Date().getMonth() + 1, new Date().getFullYear(), companyId);
      // Filter for leaves where the type code is 'SICK'
      const filtered = data.filter((l: any) => l.leaveType?.code === 'SICK');
      setSickLeaves(filtered);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  const filtered = sickLeaves.filter(s => 
    s.employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.docNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Xəstəlik Vərəqələri</h2>
          <p className="text-[11px] font-black tracking-widest text-slate-400 mt-1 uppercase italic flex items-center">
            <ClipboardList className="w-3 h-3 mr-2" />
            Sosial Sığorta Bülletenlərinin Jurnalı
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
             onClick={() => navigate('/hr/sick-leave/create')}
             className="flex items-center px-6 py-4 bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            <Plus className="w-4 h-4 mr-2" /> Yeni Bülleten
          </button>
          <button className="p-4 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-2">
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Cari Ayda Aktiv</p>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-black text-slate-800 italic">{sickLeaves.length}</span>
               <span className="text-[10px] font-black text-slate-400 uppercase italic">Vərəqə</span>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Cəmi Gün Sayı</p>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-black text-slate-800 italic">{sickLeaves.reduce((acc, curr) => acc + curr.totalDays, 0)}</span>
               <span className="text-[10px] font-black text-slate-400 uppercase italic">Gün</span>
            </div>
         </div>
         <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 shadow-sm">
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Yoxlanılmalı</p>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-black text-indigo-600 italic">0</span>
               <span className="text-[10px] font-black text-indigo-400 uppercase italic">Yeni Sənəd</span>
            </div>
         </div>
      </div>

      {/* Registry Table Card */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-white overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="İşçi adı və ya Bülleten №..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-[11px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 uppercase"
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
                <Filter className="w-3.5 h-3.5" /> Filtr
             </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-20 flex justify-center">
             <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFBFD]/50 border-b border-slate-50">
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest italic">İşçi</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Bülleten № / Seriya</th>
                  <th className="px-10 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Dövr</th>
                  <th className="px-10 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Gün</th>
                  <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(sick => (
                  <tr key={sick.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs mr-1 shrink-0">
                          {sick.employee.fullName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-black text-slate-800 uppercase italic leading-none mb-1.5">{sick.employee.fullName}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{sick.employee.position || 'Təyin edilməyib'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
                             <FileText className="w-4 h-4 text-rose-500" />
                          </div>
                          <span className="text-[11px] font-black text-slate-700 italic uppercase">
                             {sick.docNumber || 'Sənəd Qeyd Edilməyib'}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-7">
                       <div className="flex items-center justify-center gap-3">
                          <span className="text-[10px] font-black text-slate-600 italic tabular-nums">{formatDate(sick.startDate)}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-[10px] font-black text-slate-600 italic tabular-nums">{formatDate(sick.endDate)}</span>
                       </div>
                    </td>
                    <td className="px-10 py-7 text-center">
                       <span className="text-sm font-black text-slate-800 italic tabular-nums">{sick.totalDays} <small className="text-[9px]">GÜN</small></span>
                    </td>
                    <td className="px-10 py-7 text-right">
                       <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 italic shadow-sm">
                         <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> TƏSDİQLƏNİB
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-32 text-center flex flex-col items-center">
             <div className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-[2.5rem] mb-8">
                <ClipboardList className="w-10 h-10 text-slate-200" />
             </div>
             <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest italic mb-3">Xəstəlik vərəqəsi tapılmadı</h4>
             <p className="text-[11px] text-slate-400 max-w-md mx-auto uppercase italic leading-loose font-medium">Bu tarix aralığında qeydə alınmış heç bir bülleten yoxdur. Yeni sənəd əlavə etmək üçün "Yeni Bülleten" düyməsindən istifadə edin.</p>
          </div>
        )}
      </div>

      {/* Info cards row */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
         <div className="bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl shadow-slate-200">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <Briefcase className="w-16 h-16 text-white" />
            </div>
            <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-4 italic">İş Günü İtkisi Analizi</h4>
            <p className="text-[12px] text-slate-300 leading-relaxed uppercase italic font-bold">
               Xəstəlik vərəqələri Tabeldə "XV" kimi işarələnir və maaş hesablamasında qanunvericiliyin tələblərinə (ilk 14 gün müəssisə, sonrası dövlət tərəfindən) uyğun hesablanır.
            </p>
         </div>
      </div>
    </div>
  );
};

export default SickLeaves;
