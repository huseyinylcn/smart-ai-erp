import { useState, useEffect } from 'react';
import { 
  User, Briefcase, Wallet, FileText, Calendar, Clock, Octagon, History, 
  MapPin, Phone, Mail, Award, CheckCircle2, AlertCircle, Download, Plus, 
  ChevronRight, Camera, CreditCard, ShieldCheck, Heart, FileSignature, ArrowRightLeft,
  Loader2, X, Settings2, PenLine, Trash2, Save
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import Avatar from '../../components/hr/Avatar';
import FormattedDateInput from '../../components/common/FormattedDateInput';

const EmployeeCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const { formatDate, formatNumber, formatCurrency } = useFormat();
  const [activeTab, setActiveTab] = useState('general');
  const [employee, setEmployee] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBankSaving, setIsBankSaving] = useState(false);
  
  // Amendment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [amendmentData, setAmendmentData] = useState({
    docNumber: '',
    docDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    position: '',
    positionId: '',
    salaryGross: 0,
    vacationDays: 21,
    workplaceType: 'ƏSAS' as 'ƏSAS' | 'ƏLAVƏ',
    departmentId: '',
    branchId: '',
    workShiftId: ''
  });

  const [shifts, setShifts] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [allPositions, setAllPositions] = useState<any[]>([]);

  // Profile Edit Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    fin: '',
    idSerial: '',
    gender: '',
    birthDate: '',
    education: '',
    citizenship: '',
    address: '',
    phone: '',
    email: '',
    departmentId: '',
    position: '',
    salary: 0,
    workShiftId: ''
  });

  // Fetch Employee Data
  const fetchData = async () => {
    if (!id || !activeCompany) return;
    
    try {
      setIsLoading(true);
      const companyId = activeCompany.id;
      
      const response = await hrApi.getEmployeeDetail(id, companyId);
      const data = response.data || response;
      
      setEmployee(data);
      setContracts(data.contracts || []);
      setBankAccounts(data.bankAccounts || []);
      
      if (data) {
        setAmendmentData(prev => ({
            ...prev,
            position: data.position || '',
            salaryGross: Number(data.salary) || 0,
            vacationDays: Number(data.vacationDays) || 21,
            workplaceType: (data.workplaceType as 'ƏSAS' | 'ƏLAVƏ') || 'ƏSAS',
            departmentId: data.departmentId || '',
            branchId: data.branchId || '',
            positionId: data.positionId || '',
            workShiftId: data.workShiftId || ''
        }));
        setProfileData({
          fullName: data.fullName || '',
          fin: data.fin || '',
          idSerial: data.idSerial || '',
          gender: data.gender || '',
          birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
          education: data.education || '',
          citizenship: data.citizenship || 'Azərbaycan',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          departmentId: data.departmentId || '',
          position: data.position || '',
          salary: Number(data.salary) || 0,
          workShiftId: data.workShiftId || ''
        });
      }
      
      const sData = await hrApi.getShifts(companyId);
      setShifts(sData);
      
      const dData = await hrApi.getDepartments(companyId);
      setDepartments(dData);

      const bData = await hrApi.getBranches(companyId);
      setBranches(bData);

      const pData = await hrApi.getPositions(companyId);
      setAllPositions(pData);

    } catch (error) {
      console.error('FETCH_ERROR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, activeCompany?.id]);

  const handleAmend = async () => {
    if (!amendmentData.docNumber || !amendmentData.position) {
        alert('Zəhmət olmasa Sənəd № və Vəzifəni daxil edin');
        return;
    }

    setIsSaving(true);
    try {
        const companyId = activeCompany!.id;
        await hrApi.amendContract(id!, {
            ...amendmentData,
            employeeId: id
        }, companyId);
        
        setIsModalOpen(false);
        await fetchData();
        alert('Əlavə razılaşma tarixçəyə uğurla əlavə edildi!');
    } catch (error: any) {
        alert('Xəta: ' + error.message);
    } finally {
        setIsSaving(false);
    }
  };

  const handleAddBank = () => {
    setBankAccounts([...bankAccounts, { id: Math.random().toString(36).substr(2, 9), bankName: '', accountNumber: '', isPrimary: bankAccounts.length === 0 }]);
  };

  const handleUpdateBank = (id: string, field: string, value: any) => {
    setBankAccounts(bankAccounts.map(b => {
        if (b.id === id) {
            if (field === 'isPrimary' && value === true) {
                // Only one can be primary
                return { ...b, [field]: value };
            }
            return { ...b, [field]: value };
        }
        if (field === 'isPrimary' && value === true) {
            return { ...b, isPrimary: false };
        }
        return b;
    }));
  };

  const handleRemoveBank = (id: string) => {
    const filtered = bankAccounts.filter(b => b.id !== id);
    // If we removed the primary, make the first one primary
    if (filtered.length > 0 && !filtered.find(f => f.isPrimary)) {
        filtered[0].isPrimary = true;
    }
    setBankAccounts(filtered);
  };

  const saveBankAccounts = async () => {
    setIsBankSaving(true);
    try {
        const companyId = activeCompany!.id;
        await hrApi.updateEmployee(id!, {
            ...employee,
            bankAccounts
        }, companyId);
        alert('Bank hesabları uğurla yeniləndi!');
        fetchData();
    } catch (error: any) {
        alert('Xəta: ' + error.message);
    } finally {
        setIsBankSaving(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;

  const tabs = [
    { id: 'general', label: 'Ümumi Məlumat', icon: User },
    { id: 'contracts', label: 'Müqavilə Tarixçəsi (EMAS)', icon: FileSignature },
    { id: 'work', label: 'İş Məlumatları', icon: Briefcase },
    { id: 'payroll', label: 'Əmək Haqqı', icon: Wallet },
    { id: 'leave', label: 'Məzuniyyətlər', icon: Calendar },
    { id: 'attendance', label: 'Davamiyyət', icon: Clock },
    { id: 'history', label: 'Loqlar', icon: History }
  ];

  return (
    <div className="max-w-[95rem] mx-auto animate-in fade-in duration-700 pb-20 italic font-black uppercase text-slate-900 leading-none">
      
      <div className="flex justify-between items-center mb-8 leading-none">
        <div className="leading-none text-left">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase leading-none">İşçi Kartoçkası</h2>
          <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 leading-none">
            <span>HR MODULU</span>
            <ChevronRight className="w-3 h-3 mx-2 leading-none" />
            <span className="text-emerald-600 leading-none uppercase">ƏMƏKDAŞ PROFİLİ</span>
          </div>
        </div>
        <div className="flex space-x-3 leading-none">
          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm leading-none">
            PDF EKSPORT
          </button>
          <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 leading-none">
            MƏLUMATLARI YENİLƏ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start leading-none">
        
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-6 leading-none">
          <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-emerald-900/5 border border-white overflow-hidden p-10 text-center relative group leading-none">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-5 leading-none"></div>
            
            <div className="relative mt-4 leading-none flex justify-center">
               <Avatar 
                  src={employee?.avatarUrl} 
                  name={employee?.fullName || ''} 
                  size="xl" 
                  className="shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-700" 
               />
               <div className="absolute bottom-0 right-1/2 translate-x-14 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white shadow-xl leading-none"></div>
            </div>

            <div className="mt-8 leading-none">
              <h3 className="text-xl font-black text-slate-800 italic leading-none">{employee?.fullName || '---'}</h3>
              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mt-2 leading-none">{employee?.position || '---'}</p>
              <div className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest mt-4 border border-emerald-500/10 leading-none">
                {employee?.status || 'ACTIVE'}
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50 space-y-5 text-left leading-none">
              <div className="flex items-center leading-none">
                <div className="w-9 h-9 rounded-2xl bg-slate-50 flex items-center justify-center mr-4 leading-none">
                  <ShieldCheck className="w-4 h-4 text-slate-400 leading-none" />
                </div>
                <div className="leading-none text-left">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">FİN KOD</p>
                  <p className="text-[11px] font-black text-slate-700 leading-none">{employee?.fin || '---'}</p>
                </div>
              </div>
              <div className="flex items-center leading-none">
                <div className="w-9 h-9 rounded-2xl bg-slate-50 flex items-center justify-center mr-4 leading-none text-left">
                  <Phone className="w-4 h-4 text-slate-400 leading-none" />
                </div>
                <div className="leading-none text-left">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">TELEFON</p>
                  <p className="text-[11px] font-black text-slate-700 leading-none">{employee?.phone || '---'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl leading-none">
             <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-emerald-500 rounded-full blur-[60px] opacity-20 leading-none"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 italic leading-none">Sürətli Əməliyyat</p>
             <div className="space-y-3 relative z-10 leading-none">
                <button 
                    onClick={() => {
                        setAmendmentData(prev => ({
                            ...prev,
                            docNumber: '',
                            docDate: new Date().toISOString().split('T')[0],
                            startDate: new Date().toISOString().split('T')[0],
                            position: employee?.position || '',
                            salaryGross: employee?.salary || 0,
                            vacationDays: employee?.vacationDays || 21,
                            workplaceType: employee?.workplaceType || 'ƏSAS',
                            departmentId: employee?.departmentId || '',
                            branchId: employee?.branchId || '',
                            workShiftId: employee?.workShiftId || ''
                        }));
                        setIsModalOpen(true);
                    }}
                    className="w-full py-4 px-5 rounded-2xl bg-white/5 hover:bg-emerald-600/20 text-[10px] font-black uppercase tracking-widest text-left flex items-center transition-all leading-none"
                >
                  <FileSignature className="w-4 h-4 mr-4 text-emerald-400 leading-none" /> Yeni Əlavə Razılaşma
                </button>
                <button className="w-full py-4 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-left flex items-center transition-all leading-none">
                  <Calendar className="w-4 h-4 mr-4 text-primary-400 leading-none" /> Məzuniyyət Əmri
                </button>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9 bg-white rounded-[4rem] shadow-2xl shadow-emerald-900/5 border border-white overflow-hidden min-h-[850px] flex flex-col leading-none">
          <div className="px-10 pt-10 border-b border-slate-50 bg-[#FAFBFD]/50 leading-none">
            <div className="flex space-x-1 overflow-x-auto no-scrollbar pb-1 leading-none">
               {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-8 py-5 rounded-t-[2rem] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap leading-none ${activeTab === tab.id ? 'bg-white text-emerald-600 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] border-x border-t border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    <tab.icon className={`w-4 h-4 mr-4 ${activeTab === tab.id ? 'text-emerald-500' : 'text-slate-200'} leading-none`} />
                    {tab.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="p-12 flex-1 overflow-y-auto leading-none text-left">
             {activeTab === 'contracts' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10 leading-none text-left">
                   <div className="flex items-center justify-between mb-2 leading-none">
                      <div className="leading-none text-left">
                         <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest italic leading-none">Müqavilə Tarixçəsi</h3>
                         <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest leading-none">Cəmi {contracts.length} sənəd qeydə alınıb</p>
                      </div>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-emerald-600 hover:text-white transition-all shadow-sm leading-none border border-emerald-100"
                      >
                         <Plus className="w-4 h-4 mr-3 leading-none" /> Yeni Əlavə Razılaşma
                      </button>
                   </div>

                   <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-emerald-900/5 leading-none">
                      <div className="overflow-x-auto leading-none">
                         <table className="w-full text-left leading-none uppercase">
                            <thead className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                               <tr className="leading-none">
                                  <th className="p-6 pl-10 border-b border-slate-100 leading-none">Sənəd №</th>
                                  <th className="p-6 border-b border-slate-100 leading-none">Növü</th>
                                  <th className="p-6 border-b border-slate-100 leading-none">Status</th>
                                  <th className="p-6 border-b border-slate-100 leading-none">Vəzifə</th>
                                  <th className="p-6 border-b border-slate-100 leading-none text-right">Maaş (Gross)</th>
                                  <th className="p-6 border-b border-slate-100 leading-none">Tarix</th>
                                  <th className="p-6 pr-10 border-b border-slate-100 leading-none text-center">Fəaliyyət</th>
                               </tr>
                            </thead>
                            <tbody className="text-[11px] font-black text-slate-700 leading-none">
                               {contracts.map((c, i) => (
                                 <tr key={c.id} className={`group hover:bg-emerald-50/30 transition-all leading-none ${i !== contracts.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                    <td className="p-6 pl-10 leading-none tabular-nums italic text-emerald-600 underline underline-offset-4 decoration-emerald-200">{c.docNumber}</td>
                                    <td className="p-6 leading-none">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black ${c.contractType === 'BAĞLANMIŞ' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                            {c.contractType}
                                        </span>
                                    </td>
                                    <td className="p-6 leading-none">
                                        <div className="flex items-center leading-none">
                                            <div className={`w-2 h-2 rounded-full mr-3 ${c.contractStatus === 'QÜVVƏDƏDİR' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-slate-300'} leading-none`}></div>
                                            <span className={c.contractStatus === 'QÜVVƏDƏDİR' ? 'text-emerald-600' : 'text-slate-400'}>{c.contractStatus}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 leading-none italic">{c.position}</td>
                                    <td className="p-6 leading-none text-right tabular-nums font-black text-slate-900">{formatCurrency(c.salaryGross, 'AZN')}</td>
                                    <td className="p-6 leading-none tabular-nums text-slate-400 truncate">{formatDate(c.startDate)}</td>
                                    <td className="p-6 pr-10 leading-none text-center">
                                        <button className="p-3 bg-white border border-slate-100 rounded-xl group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all shadow-sm leading-none">
                                            <Download className="w-4 h-4 leading-none" />
                                        </button>
                                    </td>
                                 </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'general' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 leading-none text-left">
                   <section className="leading-none text-left">
                     <div className="flex items-center justify-between mb-8 leading-none">
                       <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic flex items-center leading-none">
                         <span className="w-8 h-px bg-slate-100 mr-4 leading-none text-left"></span> Şəxsi Məlumatlar
                       </h4>
                       <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center space-x-2 px-6 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all border border-slate-100 leading-none">
                         <PenLine className="w-3.5 h-3.5" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Profilə Düzəliş Et</span>
                       </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-10 leading-none text-left">
                       {[
                         { label: 'Tam Ad', value: employee?.fullName || '---' },
                         { label: 'FİN Kod', value: employee?.fin || '---' },
                          { label: 'Filial (Branch)', value: branches.find(b => b.id === employee?.branchId)?.name || '---' },
                         { label: 'Şöbə', value: employee?.department?.name || '---' },
                         { label: 'Vəzifə', value: employee?.position || '---' },
                         { label: 'İşə Giriş', value: formatDate(employee?.startDate) },
                         { label: 'Cins', value: employee?.gender || '---' },
                       ].map((item, i) => (
                          <div key={i} className="group pb-5 border-b border-slate-50 leading-none text-left">
                             <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">{item.label}</label>
                             <p className="text-[14px] font-black text-slate-800 tracking-tight italic">{item.value}</p>
                          </div>
                        ))}
                      </div>
                   </section>
                </div>
             )}

             {activeTab === 'work' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 leading-none text-left">
                   
                   {/* BANK ACCOUNTS SECTION */}
                   <section className="leading-none text-left">
                      <div className="flex items-center justify-between mb-8 leading-none">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-indigo-50 rounded-2xl">
                                <CreditCard className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic leading-none">Bank Hesabları</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Maaş köçürülməsi üçün hədəf hesablar</p>
                            </div>
                        </div>
                        <button onClick={handleAddBank} className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 leading-none">
                          <Plus className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Yeni Hesab</span>
                        </button>
                      </div>

                      <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-inner p-8">
                         <div className="space-y-4">
                            {bankAccounts.length === 0 ? (
                                <div className="py-12 text-center italic text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                                    Hələlik heç bir bank hesabı daxil edilməyib
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bankAccounts.map((bank, bIdx) => (
                                        <div key={bank.id || bIdx} className="flex gap-4 items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                                            <div className="flex flex-col items-center justify-center space-y-2 px-2">
                                                <input 
                                                    type="radio" 
                                                    name="primaryBank"
                                                    checked={bank.isPrimary}
                                                    onChange={() => handleUpdateBank(bank.id, 'isPrimary', true)}
                                                    className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-200 cursor-pointer"
                                                />
                                                <span className="text-[8px] font-black text-slate-400 leading-none">ƏSAS</span>
                                            </div>
                                            
                                            <div className="flex-1 grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none block ml-2">Bankın Adı</label>
                                                    <input 
                                                        value={bank.bankName}
                                                        onChange={(e) => handleUpdateBank(bank.id, 'bankName', e.target.value.toUpperCase())}
                                                        placeholder="MƏS: ABB, KAPİTAL BANK"
                                                        className="w-full bg-slate-50/50 border-none rounded-2xl py-3 px-5 text-[11px] font-black italic text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none block ml-2">Hesab № (IBAN)</label>
                                                    <input 
                                                        value={bank.accountNumber}
                                                        onChange={(e) => handleUpdateBank(bank.id, 'accountNumber', e.target.value.toUpperCase())}
                                                        placeholder="AZ0000000000000000000000"
                                                        className="w-full bg-slate-50/50 border-none rounded-2xl py-3 px-5 text-[11px] font-black italic text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/10 tabular-nums"
                                                    />
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleRemoveBank(bank.id)}
                                                className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {bankAccounts.length > 0 && (
                                <div className="pt-6 flex justify-end">
                                    <button 
                                        onClick={saveBankAccounts}
                                        disabled={isBankSaving}
                                        className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center disabled:opacity-50"
                                    >
                                        {isBankSaving ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Save className="w-4 h-4 mr-3" />}
                                        Məlumatları Yadda Saxla
                                    </button>
                                </div>
                            )}
                         </div>
                      </div>
                   </section>

                   {/* FUTURE WORK INFO SECTIONS CAN GO HERE */}
                   <section className="leading-none text-left opacity-30">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-slate-100 rounded-2xl">
                            <ShieldCheck className="w-5 h-5 text-slate-400" />
                        </div>
                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic leading-none">Sığorta və Digər Şəhadətnamələr (Yaxında)</h4>
                      </div>
                      <div className="h-32 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex items-center justify-center">
                         <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest italic">Gələcək genişləndirmələr üçün yer</span>
                      </div>
                   </section>

                </div>
             )}
          </div>
        </div>
      </div>

      {/* AMENDMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-emerald-900 text-white">
                 <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mr-5">
                       <FileSignature className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black italic uppercase">Əlavə Razılaşma</h3>
                       <p className="text-[10px] font-black text-emerald-400 mt-2 uppercase tracking-widest">Müqavilə şərtlərinin yenilənməsi</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 text-white/50 hover:text-white rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-10 space-y-8 text-left">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4 text-left">
                       <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 block">Sənəd №</label>
                       <input 
                         type="text" 
                         value={amendmentData.docNumber}
                         onChange={(e) => setAmendmentData({...amendmentData, docNumber: e.target.value.toUpperCase()})}
                         className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic outline-none" 
                       />
                    </div>
                    <FormattedDateInput 
                        label="Sənəd Tarixi"
                        value={amendmentData.docDate}
                        onChange={(val) => setAmendmentData({...amendmentData, docDate: val})}
                     />
                 </div>

                 <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 block">Şöbə</label>
                        <select 
                          value={amendmentData.departmentId}
                          onChange={(e) => setAmendmentData({...amendmentData, departmentId: e.target.value})}
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-4.5 px-8 text-xs font-black italic outline-none appearance-none cursor-pointer"
                        >
                           <option value="">Seçin...</option>
                           {departments.map(d => (
                             <option key={d.id} value={d.id}>{d.name}</option>
                           ))}
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 block">Filial</label>
                        <select 
                          value={amendmentData.branchId || ''}
                          onChange={(e) => setAmendmentData({...amendmentData, branchId: e.target.value})}
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-4.5 px-8 text-xs font-black italic outline-none appearance-none cursor-pointer"
                        >
                           <option value="">Seçin...</option>
                           {branches.map(b => (
                             <option key={b.id} value={b.id}>{b.name}</option>
                           ))}
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 block">Vəzifə</label>
                        <select 
                          value={amendmentData.positionId}
                          onChange={(e) => {
                             const pos = allPositions.find(p => p.id === e.target.value);
                             setAmendmentData({...amendmentData, positionId: e.target.value, position: pos?.name || ''});
                          }}
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-4.5 px-8 text-xs font-black italic outline-none appearance-none cursor-pointer"
                        >
                           <option value="">Seçin...</option>
                           {allPositions.filter(p => !amendmentData.departmentId || p.departmentId === amendmentData.departmentId).map(p => (
                             <option key={p.id} value={p.id}>{p.name}</option>
                           ))}
                        </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 block">Maaş (Gross)</label>
                       <input 
                         type="number" 
                         value={amendmentData.salaryGross}
                         onChange={(e) => setAmendmentData({...amendmentData, salaryGross: Number(e.target.value)})}
                         className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-lg font-black italic outline-none" 
                       />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 block">İş Rejimi</label>
                        <select 
                            value={amendmentData.workShiftId}
                            onChange={(e) => setAmendmentData({...amendmentData, workShiftId: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] py-4.5 px-8 text-xs font-black italic outline-none appearance-none cursor-pointer"
                        >
                            <option value="">Seçin...</option>
                            {shifts.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-slate-50 flex space-x-4">
                 <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-white text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100">Ləğv Et</button>
                 <button 
                   disabled={isSaving}
                   onClick={handleAmend}
                   className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center disabled:opacity-50"
                 >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <CheckCircle2 className="w-4 h-4 mr-3" />}
                    <span>Yadda Saxla</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
