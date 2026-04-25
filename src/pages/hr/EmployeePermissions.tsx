import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Plus, Search, Calendar, User, Info, 
  CheckCircle2, AlertTriangle, Loader2, Trash2,
  FileText, Timer, ChevronRight
} from 'lucide-react';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import SearchableSelect from '../../components/common/SearchableSelect';

interface Employee {
  id: string;
  fullName: string;
  position?: string;
}

interface EmployeePermission {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  isPaid: boolean;
  status: string;
  reason: string | null;
  docNumber: string | null;
  employee: {
    fullName: string;
    position: string | null;
  };
}

const EmployeePermissions = () => {
  const { activeCompany } = useCompany();
  const { formatDate } = useFormat();
  const companyId = activeCompany?.id || 'COM-001';

  const [permissions, setPermissions] = useState<EmployeePermission[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [permData, empData] = await Promise.all([
        hrApi.getPermissions(companyId),
        hrApi.getEmployees(companyId)
      ]);
      setPermissions(permData);
      setEmployees(empData.map((e: any) => ({
        id: e.id,
        fullName: e.fullName,
        position: e.position
      })));
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  const totalHours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? diff : 0;
  }, [startTime, endTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId || !date || totalHours <= 0) return;
    
    try {
      setIsSubmitting(true);
      await hrApi.createPermission({
        employeeId: selectedEmpId,
        date,
        startTime,
        endTime,
        totalHours,
        reason,
        status: 'APPROVED'
      }, companyId);
      
      setSelectedEmpId('');
      setStartTime('');
      setEndTime('');
      setReason('');
      await loadData();
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPermissions = permissions.filter(p => 
    p.employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">İşçi İcazələri</h2>
          <div className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
            <Timer className="w-3 h-3 mr-2 text-primary-500" />
            <span>SAATLIQ İCAZƏ JURNALI</span>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-primary-500">MÜƏSSİSƏ ÜZRƏ</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 px-2">
        {/* ADD PERMISSION FORM */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-slate-200 border border-slate-50 sticky top-24">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center italic">
              <Plus className="w-4 h-4 mr-2" />
              Yeni İcazə Qeydi
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <SearchableSelect 
                label="İşçi Seçimi"
                options={employees.map(e => ({ id: e.id, label: e.fullName, subLabel: e.position }))}
                value={selectedEmpId}
                onChange={setSelectedEmpId}
                placeholder="İşçini axtarın..."
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Tarix</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Gediş Saatı</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Dönüş Saatı</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              {totalHours > 0 && (
                <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center justify-between">
                   <span className="text-[10px] font-black text-primary-600 uppercase italic">Cəmi Müddət:</span>
                   <span className="text-xl font-black text-primary-700 italic">{totalHours.toFixed(1)} <small className="text-[10px]">SAAT</small></span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase italic px-2">Səbəb</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="İcazənin səbəbi..."
                  rows={3}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-[12px] font-black italic text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !selectedEmpId || totalHours <= 0}
                className="w-full bg-primary-600 text-white rounded-2xl py-5 px-6 text-[11px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'İcazəni Qeydə Al'}
              </button>
            </form>
          </div>
        </div>

        {/* LOGS LIST */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#FAFBFD]/50">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="İşçi axtar..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-[11px] font-black italic focus:ring-2 focus:ring-primary-500/10 outline-none uppercase"
                />
              </div>
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                 <span className="px-5 py-2 text-[10px] font-black text-slate-500 uppercase italic">
                    {filteredPermissions.length} Qeyd
                 </span>
              </div>
            </div>

            {isLoading ? (
              <div className="p-20 flex justify-center">
                 <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : filteredPermissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Tarix</th>
                      <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest italic">İşçi</th>
                      <th className="px-8 py-5 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Saat Aralığı</th>
                      <th className="px-8 py-5 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Müddət</th>
                      <th className="px-8 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPermissions.map(perm => (
                      <tr key={perm.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-700 italic">{formatDate(perm.date)}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-800 uppercase italic mb-0.5">{perm.employee.fullName}</span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest italic">{perm.employee.position || 'Təyin edilməyib'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl">
                              <span className="text-[10px] font-black text-slate-600 tabular-nums">{perm.startTime}</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] font-black text-slate-600 tabular-nums">{perm.endTime}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className="text-[11px] font-black text-slate-800 italic">{perm.totalHours.toFixed(1)} sa</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className="inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 italic shadow-sm">
                             <CheckCircle2 className="w-3 h-3 mr-1.5" /> Təsdiq
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-32 text-center flex flex-col items-center">
                 <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-[2rem] mb-6">
                    <Timer className="w-8 h-8 text-slate-300" />
                 </div>
                 <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-widest italic">İcazə qeydi tapılmadı</h4>
                 <p className="text-[10px] text-slate-400 mt-3 max-w-sm mx-auto uppercase italic leading-relaxed">Saatlıq icazələri qeydə almaq üçün sol tərəfdəki formadan istifadə edin.</p>
              </div>
            )}
          </div>

          {/* POLICY NOTE */}
          <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-8 flex items-start gap-6 shadow-sm">
             <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
             </div>
             <div>
                <h4 className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-2 italic flex items-center">
                   İcazə Limiti Və Maaş Kəsintisi
                </h4>
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase tracking-tighter italic">
                   Ay bitdikdə, ödənişli icazə limitini keçən saatlar avtomatik olaraq maaşdan mütənasib qaydada kəsiləcəkdir. 
                   Sistem fərdi limitləri İşçi Kartındakı "İcazə Siyasəti" bölməsinə əsasən götürür.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePermissions;
