import { useState, useEffect, useMemo } from 'react';
import { 
  Users, ShieldCheck, Trash2, RotateCcw, Search, 
  MapPin, UserCheck, ShieldAlert, ChevronRight,
  Filter, Download, Loader2
} from 'lucide-react';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useNavigate } from 'react-router-dom';

interface FaceStatusEmployee {
    id: string;
    fullName: string;
    position: string;
    department: { name: string } | null;
    branch: { name: string } | null;
    hasFaceId: boolean;
}

const FaceRegistry = () => {
    const { activeCompany } = useCompany();
    const companyId = activeCompany?.id || 'COM-001';
    const navigate = useNavigate();

    const [employees, setEmployees] = useState<FaceStatusEmployee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [empList, gallery] = await Promise.all([
                hrApi.getEmployees(companyId),
                hrApi.getFaceGallery(companyId)
            ]);

            const galleryIds = new Set(gallery.filter((e: any) => e.faceTemplates && e.faceTemplates.length > 0).map((e: any) => e.id));

            const mapped = empList.map((e: any) => ({
                id: e.id,
                fullName: e.fullName,
                position: e.position || 'İşçi',
                department: e.department,
                branch: e.branch,
                hasFaceId: galleryIds.has(e.id)
            }));

            if (gallery.length > 0) {
                console.log("Face Gallery loaded successfully.");
            } else {
                console.log("Face Gallery is empty for this company.");
            }

            setEmployees(mapped);
        } catch (err) {
            console.error("Resource loading error", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [companyId]);

    const handleDelete = async (empId: string) => {
        if (!window.confirm("Bu işçinin biometrik (Face ID) məlumatlarını silmək istədiyinizə əminsiniz?")) return;
        
        try {
            setIsProcessing(empId);
            await hrApi.deleteFaceTemplate(empId, companyId);
            setEmployees(prev => prev.map(e => e.id === empId ? { ...e, hasFaceId: false } : e));
            alert("Məlumatlar uğurla silindi.");
        } catch (err) {
            alert("Xəta baş verdi.");
        } finally {
            setIsProcessing(null);
        }
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter(e => 
            e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            e.position.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, searchTerm]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-full animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 px-2">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Biometrik Reyestr</h2>
                    <div className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1 leading-none italic">
                        <Users className="w-3 h-3 mr-2 text-indigo-500 shadow-sm" />
                        <span>Kadr Uçotu</span>
                        <ChevronRight className="w-3 h-3 mx-2 text-slate-300" />
                        <span className="text-indigo-500 italic">Face ID Məlumat Bazası</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text"
                            placeholder="İşçi axtar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 pl-11 pr-6 py-3 rounded-2xl text-[12px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 shadow-sm transition-all italic"
                        />
                    </div>
                    
                    <button 
                        onClick={loadData}
                        className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <RotateCcw className="w-4 h-4 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-2">
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center space-x-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Users className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Cəmi İşçi</p>
                        <p className="text-2xl font-black text-slate-800 italic">{employees.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center space-x-5">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Qeydiyyatlı</p>
                        <p className="text-2xl font-black text-emerald-600 italic">{employees.filter(e => e.hasFaceId).length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center space-x-5">
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center">
                        <ShieldAlert className="w-7 h-7 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Qeydiyyatsız</p>
                        <p className="text-2xl font-black text-rose-600 italic">{employees.filter(e => !e.hasFaceId).length}</p>
                    </div>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mx-2">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 italic">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">İşçi Məlumatları</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Şöbə / Filial</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Face ID Statusu</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Əməliyyatlar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 uppercase italic">
                                            {emp.fullName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-slate-800 leading-none italic uppercase">{emp.fullName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic tracking-tighter">{emp.position}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex items-center text-[10px] font-black text-slate-600 uppercase italic leading-none">
                                            <MapPin className="w-3 h-3 mr-2 text-slate-400" />
                                            {emp.branch?.name || 'Mərkəzi Ofis'}
                                        </div>
                                        <div className="flex items-center text-[9px] font-black text-slate-400 uppercase italic leading-none ml-5">
                                            {emp.department?.name || 'Bütün Şöbələr'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-center">
                                        {emp.hasFaceId ? (
                                            <span className="flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider italic border border-emerald-100 leading-none">
                                                <ShieldCheck className="w-3 h-3 mr-1.5" />
                                                Qeydiyyatlı
                                            </span>
                                        ) : (
                                            <span className="flex items-center px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-wider italic border border-rose-100 leading-none">
                                                <ShieldAlert className="w-3 h-3 mr-1.5" />
                                                Məlumat Yoxdur
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button 
                                            onClick={() => navigate(`/hr/face-enrollment?employeeId=${emp.id}&companyId=${companyId}&fullName=${encodeURIComponent(emp.fullName)}`)}
                                            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all italic shadow-sm"
                                        >
                                            {emp.hasFaceId ? 'Yenilə' : 'Qeydiyyatdan Keçir'}
                                        </button>
                                        
                                        {emp.hasFaceId && (
                                            <button 
                                                onClick={() => handleDelete(emp.id)}
                                                disabled={isProcessing === emp.id}
                                                className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Məlumatları Sil"
                                            >
                                                {isProcessing === emp.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FaceRegistry;
