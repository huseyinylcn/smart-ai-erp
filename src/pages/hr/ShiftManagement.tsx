import { useState, useEffect } from 'react';
import { 
  Plus, Clock, ChevronRight, 
  Coffee, Save, X, Loader2, Edit2, Settings2, Trash2
} from 'lucide-react';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';

const ShiftManagement = () => {
  const { activeCompany } = useCompany();
  const { formatTime } = useFormat();
  const companyId = activeCompany?.id || '';

  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentShift, setCurrentShift] = useState<any>(null);
  const [isDetailedMode, setIsDetailedMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '09:00',
    endTime: '18:00',
    lunchStartTime: '13:00',
    lunchEndTime: '14:00',
    workDays: [1, 2, 3, 4, 5],
    weeklyHours: 40,
    dailySettings: {} as any
  });

  const [reassignModal, setReassignModal] = useState<{
    isOpen: boolean;
    employees: { id: string; fullName: string }[];
    targetShiftId: string;
    sourceShiftId: string;
  }>({
    isOpen: false,
    employees: [],
    targetShiftId: '',
    sourceShiftId: ''
  });

  const fetchShifts = async () => {
    setIsLoading(true);
    try {
      const data = await hrApi.getShifts(companyId);
      setShifts(data);
    } catch (error) {
      console.error('FETCH_SHIFTS_ERROR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchShifts();
    }
  }, [companyId]);

  const handleOpenModal = (shift: any = null) => {
    if (shift) {
      setCurrentShift(shift);
      setFormData({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        lunchStartTime: shift.lunchStartTime || '13:00',
        lunchEndTime: shift.lunchEndTime || '14:00',
        workDays: shift.workDays || [1, 2, 3, 4, 5],
        weeklyHours: shift.weeklyHours || 40,
        dailySettings: shift.dailySettings || {}
      });
      setIsDetailedMode(!!shift.dailySettings && Object.keys(shift.dailySettings).length > 0);
    } else {
      setCurrentShift(null);
      setIsDetailedMode(false);
      setFormData({
        name: '',
        startTime: '09:00',
        endTime: '18:00',
        lunchStartTime: '13:00',
        lunchEndTime: '14:00',
        workDays: [1, 2, 3, 4, 5],
        weeklyHours: 40,
        dailySettings: {}
      });
    }
    setIsModalOpen(true);
  };

  const handleDayToggle = (day: number) => {
    const newDays = formData.workDays.includes(day)
      ? formData.workDays.filter(d => d !== day)
      : [...formData.workDays, day].sort();
    
    // Auto-init daily setting for new day if in detailed mode
    const newDaily = { ...formData.dailySettings };
    if (!newDaily[day]) {
        newDaily[day] = { 
            start: formData.startTime, 
            end: day === 6 ? '14:00' : formData.endTime,
            lunchStart: formData.lunchStartTime,
            lunchEnd: formData.lunchEndTime
        }; 
    }
    
    setFormData({...formData, workDays: newDays, dailySettings: newDaily});
  };

  const handleDailyParamChange = (day: number, key: string, val: string) => {
      const newDaily = { ...formData.dailySettings };
      if (!newDaily[day]) newDaily[day] = { 
          start: formData.startTime, 
          end: formData.endTime, 
          lunchStart: formData.lunchStartTime, 
          lunchEnd: formData.lunchEndTime 
      };
      newDaily[day][key] = val;
      setFormData({ ...formData, dailySettings: newDaily });
  };

  const handleDeleteShift = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" iş rejimini silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) return;
    
    try {
      await hrApi.deleteShift(id, companyId);
      await fetchShifts();
    } catch (error: any) {
      console.error('DELETE_SHIFT_ERROR:', error);
      const msg = error.message || '';
      if (msg.includes('PASSİV')) {
          if (window.confirm(msg + "\n\nBu rejimi PASSİV etmək istəyirsiniz?")) {
              handleToggleStatus(id, false);
          }
      } else {
          alert(msg || 'Silinmə zamanı xəta baş verdi.');
      }
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await hrApi.toggleShiftStatus(id, isActive, companyId);
      await fetchShifts();
    } catch (error: any) {
      console.error('TOGGLE_STATUS_ERROR:', error);
      const errorData = error.data || {};
      if (errorData.employees && errorData.employees.length > 0) {
          // Reassignment needed - show modal
          setReassignModal({
              isOpen: true,
              employees: errorData.employees,
              targetShiftId: '',
              sourceShiftId: id
          });
      } else {
          alert(error.message || 'Status dəyişdirilərkən xəta baş verdi.');
      }
    }
  };

  const handleReassign = async () => {
    if (!reassignModal.targetShiftId) return;
    try {
        const empIds = reassignModal.employees.map(e => e.id);
        await hrApi.reassignEmployees(empIds, reassignModal.targetShiftId, companyId);
        // After reassign, try to passivate again
        await handleToggleStatus(reassignModal.sourceShiftId, false);
        setReassignModal({ ...reassignModal, isOpen: false });
    } catch (error) {
        console.error('REASSIGN_ERROR:', error);
        alert('İşçilərin köçürülməsi zamanı xəta baş verdi.');
    }
  };

  const days = [
    { id: 1, name: 'Bazar Ertəsi', short: 'BE' },
    { id: 2, name: 'Çərşənbə Axşamı', short: 'ÇA' },
    { id: 3, name: 'Çərşənbə', short: 'Ç' },
    { id: 4, name: 'Cümə Axşamı', short: 'CA' },
    { id: 5, name: 'Cümə', short: 'C' },
    { id: 6, name: 'Şənbə', short: 'Ş' },
    { id: 0, name: 'Bazar', short: 'B' }
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic relative font-black leading-none text-left">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 leading-none">
        <div className="leading-none text-left">
          <div className="flex items-center space-x-3 mb-2 leading-none">
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-md text-[9px] uppercase tracking-widest italic leading-none">{activeCompany?.name || '---'} Structure</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic leading-none text-left">İş Rejimləri və Şiftlər</h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/10 italic leading-none"
        >
          <Plus className="w-5 h-5 px-0 leading-none" />
          <span>Yeni Rejim Aç</span>
        </button>
      </div>

      {/* SHIFTS GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 font-black italic uppercase leading-none">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            <p className="text-[10px] text-slate-400 tracking-widest leading-none">Yüklənir...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 leading-none">
            {shifts.map((shift) => (
            <div 
                key={shift.id} 
                className="group bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-10 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all relative overflow-hidden shadow-sm leading-none"
            >
                <div className="flex items-start justify-between mb-8 leading-none">
                   <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-[2rem] shadow-sm italic leading-none">
                      <Clock className="w-8 h-8 leading-none" />
                   </div>
                    <div className="flex bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl space-x-2 italic leading-none uppercase items-center">
                       <span className={`w-2 h-2 rounded-full mr-1 ${shift.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                       <span className={`text-[9px] font-black mr-4 ${shift.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                           {shift.isActive ? 'AKTİV' : 'PASSİV'}
                       </span>
                       {days.map(d => (
                           <span key={d.id} className={`text-[9px] font-black ${shift.workDays.includes(d.id) ? 'text-emerald-600' : 'text-slate-300'}`}>{d.short}</span>
                       ))}
                    </div>
                </div>
                <div className="mb-10 leading-none italic uppercase">
                   <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-4 leading-tight leading-none text-left">{shift.name}</h3>
                   <div className="grid grid-cols-2 gap-4 leading-none text-left">
                       <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between shadow-inner leading-none">
                           <span className={`text-[9px] font-extrabold uppercase leading-none shadow-sm ${Object.keys(shift.dailySettings || {}).length > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                               {Object.keys(shift.dailySettings || {}).length > 0 ? 'Özəl' : 'Standart'}
                           </span>
                           <span className="text-xs font-black text-slate-700 dark:text-white italic leading-none shadow-sm">{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                       </div>
                       <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between shadow-inner leading-none">
                           <span className="text-[9px] text-slate-400 font-extrabold uppercase leading-none shadow-sm">Nahar</span>
                           <span className="text-xs font-black text-emerald-600 italic leading-none shadow-sm">{formatTime(shift.lunchStartTime)} - {formatTime(shift.lunchEndTime)}</span>
                       </div>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800 leading-none font-black italic uppercase">
                   <div className="flex items-center space-x-2">
                       <button 
                         onClick={() => handleOpenModal(shift)}
                         className="flex items-center space-x-3 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 rounded-2xl text-[10px] transition-all leading-none"
                       >
                          <Edit2 className="w-4 h-4 shadow-sm" />
                          <span>Düzəliş Et</span>
                       </button>
                       <button 
                         onClick={() => handleToggleStatus(shift.id, !shift.isActive)}
                         className={`flex items-center space-x-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] transition-all leading-none ${shift.isActive ? 'text-slate-400 hover:text-amber-500' : 'text-emerald-600'}`}
                         title={shift.isActive ? 'Passiv Et' : 'Aktiv Et'}
                       >
                          <Settings2 className="w-4 h-4 shadow-sm" />
                       </button>
                       <button 
                         onClick={() => handleDeleteShift(shift.id, shift.name)}
                         className="flex items-center space-x-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 rounded-2xl text-[10px] transition-all leading-none"
                       >
                          <Trash2 className="w-4 h-4 shadow-sm" />
                       </button>
                   </div>
                   <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-200 rounded-xl flex items-center justify-center group-hover:text-indigo-500 transition-all leading-none shadow-sm">
                      <ChevronRight className="w-5 h-5 italic" />
                   </div>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* SHIFT MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 font-black italic uppercase leading-none">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
              <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[4rem] border border-white/20 shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 font-black italic uppercase leading-none">
                  <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between leading-none">
                      <div className="flex items-center space-x-4 leading-none">
                         <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center italic text-xl shadow-sm"><Plus className="w-6 h-6 px-0 shadow-sm" /></div>
                         <h3 className="text-xl font-black italic uppercase tracking-tight leading-none">{currentShift ? 'İş Rejimini Redaktə Et' : 'Yeni İş Rejimi Yarat'}</h3>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-600 transition-all shadow-sm leading-none"><X className="w-5 h-5 px-0 shadow-sm" /></button>
                  </div>
                  <div className="p-12 space-y-10 font-black italic uppercase leading-none max-h-[70vh] overflow-y-auto custom-scrollbar text-left">
                      <div className="space-y-4 leading-none shadow-sm text-left">
                         <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 leading-none text-left block">İş Rejiminin Adı</label>
                         <input 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Məs: 6 GÜNLÜK ÖZƏL QRAFİK"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] py-6 px-8 text-xs font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase leading-none shadow-inner"
                         />
                      </div>

                      <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner leading-none">
                          <div className="flex items-center space-x-4 leading-none italic uppercase text-left">
                             <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center italic shadow-sm leading-none"><Settings2 className="w-5 h-5 shadow-sm" /></div>
                             <div className="leading-none text-left">
                                <span className="block text-[10px] font-black text-slate-800 dark:text-white leading-none text-left">Günlərin hər birinə həm iş, həm də nahar vaxtı təyin et.</span>
                                <span className="text-[9px] text-slate-400 font-bold leading-none text-left">Bu rejim aktiv olduqda hər bir gün üçün bütün detalları dəyişə bilərsiniz.</span>
                             </div>
                          </div>
                          <button 
                            onClick={() => setIsDetailedMode(!isDetailedMode)}
                            className={`w-14 h-8 rounded-full transition-all relative leading-none ${isDetailedMode ? 'bg-emerald-600' : 'bg-slate-300'}`}
                          >
                              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isDetailedMode ? 'left-7' : 'left-1'}`}></div>
                          </button>
                      </div>

                      {!isDetailedMode && (
                        <div className="grid grid-cols-2 gap-8 leading-none italic uppercase shadow-sm text-left">
                            <div className="space-y-6 leading-none text-left">
                                <div className="flex items-center space-x-3 mb-2 font-black text-slate-400 leading-none italic">
                                    <Clock className="w-4 h-4 shadow-sm" />
                                    <span className="text-[10px] uppercase shadow-sm leading-none">Default İş vaxtı</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 leading-none">
                                    <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-xs font-black italic outline-none uppercase shadow-inner leading-none" />
                                    <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-xs font-black italic outline-none uppercase shadow-inner leading-none" />
                                </div>
                            </div>
                            <div className="space-y-6 leading-none text-left">
                                <div className="flex items-center space-x-3 mb-2 font-black text-emerald-600 leading-none italic">
                                    <Coffee className="w-4 h-4 px-0 shadow-sm leading-none" />
                                    <span className="text-[10px] uppercase shadow-sm leading-none uppercase">Default Nahar</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 leading-none">
                                    <input type="time" value={formData.lunchStartTime} onChange={(e) => setFormData({...formData, lunchStartTime: e.target.value})} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-xs font-black italic outline-none uppercase shadow-inner leading-none" />
                                    <input type="time" value={formData.lunchEndTime} onChange={(e) => setFormData({...formData, lunchEndTime: e.target.value})} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-xs font-black italic outline-none uppercase shadow-inner leading-none" />
                                </div>
                            </div>
                        </div>
                      )}

                      <div className="space-y-6 italic uppercase leading-none shadow-sm text-left">
                         <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 leading-none text-left block">Həftəlik İş Günləri</label>
                         <div className="flex flex-wrap gap-3 mb-8 italic uppercase text-left leading-none">
                             {days.map(day => (
                                 <button 
                                    key={day.id} 
                                    onClick={() => handleDayToggle(day.id)}
                                    className={`px-6 py-4 rounded-2xl text-[10px] font-black transition-all shadow-sm italic uppercase leading-none ${formData.workDays.includes(day.id) ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                                 >
                                     {day.short}
                                 </button>
                             ))}
                         </div>

                         {isDetailedMode && (
                             <div className="space-y-4 italic uppercase text-left leading-none">
                                 <div className="grid grid-cols-12 gap-4 mb-2 px-6 text-[9px] font-black text-slate-400 uppercase italic tracking-widest leading-none">
                                     <div className="col-span-3 leading-none italic uppercase text-left">GÜNLƏR</div>
                                     <div className="col-span-4 leading-none italic uppercase text-center flex items-center justify-center italic"><Clock className="w-3 h-3 mr-1" /> İŞ SAATI</div>
                                     <div className="col-span-5 leading-none italic uppercase text-center flex items-center justify-center text-emerald-600 italic"><Coffee className="w-3 h-3 mr-1" /> NAHAR VAXTİ</div>
                                 </div>
                                 {formData.workDays.map(dayId => {
                                     const day = days.find(d => d.id === dayId);
                                     const setting = formData.dailySettings[dayId] || { 
                                         start: formData.startTime, 
                                         end: formData.endTime,
                                         lunchStart: formData.lunchStartTime,
                                         lunchEnd: formData.lunchEndTime
                                     };
                                     return (
                                         <div key={dayId} className="grid grid-cols-12 gap-4 items-center p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner group transition-all leading-none italic uppercase">
                                             <div className="col-span-3">
                                                <span className="text-xs font-black text-slate-700 dark:text-white uppercase italic leading-none">{day?.name}</span>
                                             </div>
                                             <div className="col-span-4 flex items-center justify-center space-x-2 leading-none italic uppercase">
                                                 <input 
                                                    type="time" 
                                                    value={setting.start} 
                                                    onChange={(e) => handleDailyParamChange(dayId, 'start', e.target.value)}
                                                    className="bg-white dark:bg-slate-900 rounded-xl px-3 py-2 text-[10px] font-black italic border border-slate-100 dark:border-slate-800 outline-none shadow-sm uppercase leading-none" 
                                                 />
                                                 <span className="text-slate-300 font-bold italic leading-none">-</span>
                                                 <input 
                                                    type="time" 
                                                    value={setting.end} 
                                                    onChange={(e) => handleDailyParamChange(dayId, 'end', e.target.value)}
                                                    className="bg-white dark:bg-slate-900 rounded-xl px-3 py-2 text-[10px] font-black italic border border-slate-100 dark:border-slate-800 outline-none shadow-sm uppercase leading-none" 
                                                 />
                                             </div>
                                             <div className="col-span-5 flex items-center justify-center space-x-2 leading-none italic uppercase">
                                                 <input 
                                                    type="time" 
                                                    value={setting.lunchStart} 
                                                    onChange={(e) => handleDailyParamChange(dayId, 'lunchStart', e.target.value)}
                                                    className="bg-white dark:bg-emerald-900/10 text-emerald-600 rounded-xl px-3 py-2 text-[10px] font-black italic border border-emerald-50 dark:border-emerald-900/20 outline-none shadow-sm uppercase leading-none" 
                                                 />
                                                 <span className="text-emerald-200 font-bold italic leading-none">-</span>
                                                 <input 
                                                    type="time" 
                                                    value={setting.lunchEnd} 
                                                    onChange={(e) => handleDailyParamChange(dayId, 'lunchEnd', e.target.value)}
                                                    className="bg-white dark:bg-emerald-900/10 text-emerald-600 rounded-xl px-3 py-2 text-[10px] font-black italic border border-emerald-50 dark:border-emerald-900/20 outline-none shadow-sm uppercase leading-none" 
                                                 />
                                             </div>
                                         </div>
                                     );
                                 })}
                             </div>
                         )}
                      </div>
                  </div>
                  <div className="p-10 bg-slate-50 dark:bg-white/5 flex justify-end space-x-4 leading-none italic uppercase shadow-sm">
                      <button onClick={() => setIsModalOpen(false)} className="px-10 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest leading-none italic shadow-sm hover:text-slate-600 transition-all">Ləğv Et</button>
                      <button 
                        disabled={isSaving || !formData.name}
                        onClick={async () => {
                            setIsSaving(true);
                            try {
                                const cleanDaily = {} as any;
                                if (isDetailedMode) {
                                    Object.entries(formData.dailySettings).forEach(([day, val]) => {
                                        if (formData.workDays.includes(Number(day))) {
                                            cleanDaily[day] = val;
                                        }
                                    });
                                }

                                const payload = { 
                                    ...formData, 
                                    dailySettings: cleanDaily,
                                    weeklyHours: Number(formData.weeklyHours) || 40 
                                };
                                
                                if (currentShift) {
                                    await hrApi.updateShift(currentShift.id, payload, companyId);
                                } else {
                                    await hrApi.createShift(payload, companyId);
                                }
                                await fetchShifts();
                                setIsModalOpen(false);
                            } catch (error) {
                                console.error('SAVE_SHIFT_ERROR:', error);
                                alert('Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.');
                            } finally {
                                setIsSaving(false);
                            }
                        }}
                        className="px-14 py-4.5 bg-emerald-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center space-x-3 leading-none italic disabled:opacity-50"
                      >
                         {isSaving ? <Loader2 className="w-4 h-4 animate-spin px-0 shadow-sm leading-none" /> : <Save className="w-4 h-4 px-0 shadow-sm leading-none" />}
                         <span>Qrafiki Yadda Sakla</span>
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* REASSIGN MODAL */}
      {reassignModal.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 font-black italic uppercase leading-none">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
              <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[4rem] border border-white/20 shadow-2xl relative z-10 overflow-hidden p-12">
                  <h3 className="text-xl font-black italic uppercase tracking-tight mb-8">İşçilərin Köçürülməsi</h3>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/20 mb-8">
                      <p className="text-[10px] text-amber-600 font-black leading-relaxed">
                          Aşağıdakı işçilər hazırda bu rejimdədir. Rejimi passiv etmək üçün onları başqa bir AKTİV rejimə keçirməlisiniz:
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                          {reassignModal.employees.map(e => (
                              <span key={e.id} className="bg-white dark:bg-slate-800 px-3 py-1 rounded-lg text-[9px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 shadow-sm">{e.fullName}</span>
                          ))}
                      </div>
                  </div>

                  <div className="space-y-4 mb-10">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4">Yeni İş Rejimi Seçin</label>
                      <select 
                        value={reassignModal.targetShiftId}
                        onChange={(e) => setReassignModal({ ...reassignModal, targetShiftId: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] py-6 px-8 text-xs font-black italic outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase shadow-inner"
                      >
                        <option value="">-- SEÇİN --</option>
                        {shifts.filter(s => s.id !== reassignModal.sourceShiftId && s.isActive).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                  </div>

                  <div className="flex justify-end space-x-4">
                      <button onClick={() => setReassignModal({ ...reassignModal, isOpen: false })} className="px-10 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest italic">Ləğv Et</button>
                      <button 
                        disabled={!reassignModal.targetShiftId}
                        onClick={handleReassign}
                        className="px-14 py-4 bg-emerald-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all italic disabled:opacity-50"
                      >
                        İşçiləri Köçür və Passiv Et
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ShiftManagement;
